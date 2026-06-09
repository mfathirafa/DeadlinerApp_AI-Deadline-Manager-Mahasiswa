<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Course;
use App\Services\AIService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private AIService $aiService) {}

    public function index(Request $request)
    {
        $tasks = $request->user()
            ->tasks()
            ->with('course')
            ->orderBy('deadline')
            ->get()
            ->map(function ($task) {
                $task->checkAndUpdateOverdue();
                $task->days_remaining = $task->days_remaining;
                return $task;
            });

        return response()->json($tasks); // ← langsung array
    }

    public function show(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        return response()->json($task->load('course'));
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Incoming deadline', [
            'deadline' => $request->deadline
        ]);

        if ($request->has('deadline')) {
            try {
                $deadline = Carbon::parse($request->deadline)->setTimezone(config('app.timezone'));
                $request->merge([
                    'deadline' => $deadline->format('Y-m-d H:i:s')
                ]);
            } catch (\Exception $e) {
                //
            }
        }

        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'course_id'       => 'nullable|exists:courses,id',
            'deadline'        => ['required', 'date'],
            'difficulty'      => 'required|integer|min:1|max:5',
            'estimated_hours' => 'required|numeric|min:0.5|max:100',
            'priority'        => 'nullable|in:low,medium,high,critical',
        ]);

        $deadlineObj = Carbon::parse($validated['deadline']);
        $minimumDeadline = now()->addMinute();

        \Illuminate\Support\Facades\Log::info('Deadline validation (store)', [
            'now' => now()->toDateTimeString(),
            'minimumDeadline' => $minimumDeadline->toDateTimeString(),
            'deadlineObj' => $deadlineObj->toDateTimeString(),
        ]);

        if ($deadlineObj->lessThan($minimumDeadline)) {
            return response()->json([
                'message' => 'Please select a deadline at least 1 minute in the future.',
                'errors' => [
                    'deadline' => ['Please select a deadline at least 1 minute in the future.']
                ]
            ], 422);
        }

        $task = $request->user()->tasks()->create($validated);

        try {
            $this->aiService->analyzeTask($task);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('TaskController store error: ' . $e->getMessage());
        }
        $task->refresh();

        return response()->json($task->load('course'), 201); // ← langsung object
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        \Illuminate\Support\Facades\Log::info('Incoming deadline update', [
            'deadline' => $request->deadline
        ]);

        if ($request->has('deadline')) {
            try {
                $deadline = Carbon::parse($request->deadline)->setTimezone(config('app.timezone'));
                $request->merge([
                    'deadline' => $deadline->format('Y-m-d H:i:s')
                ]);
            } catch (\Exception $e) {
                //
            }
        }

        $validated = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'course_id'       => 'nullable|exists:courses,id',
            'deadline'        => ['sometimes', 'date'],
            'difficulty'      => 'sometimes|integer|min:1|max:5',
            'estimated_hours' => 'sometimes|numeric|min:0.5',
            'progress'        => 'sometimes|integer|min:0|max:100',
            'priority'        => 'sometimes|in:low,medium,high,critical',
            'status'          => 'sometimes|in:pending,in_progress,completed,overdue',
        ]);

        if (isset($validated['deadline'])) {
            $deadlineObj = Carbon::parse($validated['deadline']);
            $minimumDeadline = now()->addMinute();

            \Illuminate\Support\Facades\Log::info('Deadline validation (update)', [
                'now' => now()->toDateTimeString(),
                'minimumDeadline' => $minimumDeadline->toDateTimeString(),
                'deadlineObj' => $deadlineObj->toDateTimeString(),
            ]);

            if ($deadlineObj->lessThan($minimumDeadline)) {
                return response()->json([
                    'message' => 'Please select a deadline at least 1 minute in the future.',
                    'errors' => [
                        'deadline' => ['Please select a deadline at least 1 minute in the future.']
                    ]
                ], 422);
            }
        }

        if (isset($validated['course_id'])) {
            Course::where('user_id', $request->user()->id)->findOrFail($validated['course_id']);
        }

        if (isset($validated['deadline'])) {
            $validated['deadline'] = Carbon::parse($validated['deadline']);
        }

        // Align status & progress and manage completed_at
        if (isset($validated['status']) && $validated['status'] === 'completed') {
            $validated['progress'] = 100;
            if ($task->status !== 'completed') {
                $validated['completed_at'] = Carbon::now();
            }
        } elseif (isset($validated['progress']) && (int)$validated['progress'] === 100) {
            $validated['status'] = 'completed';
            if ($task->status !== 'completed') {
                $validated['completed_at'] = Carbon::now();
            }
        } elseif (isset($validated['status']) || isset($validated['progress'])) {
            $newStatus = $validated['status'] ?? $task->status;
            $newProgress = $validated['progress'] ?? $task->progress;
            if ($newStatus !== 'completed' && (int)$newProgress < 100) {
                $validated['completed_at'] = null;
            }
        }

        $task->update($validated);

        // Re-analyze setelah update
        try {
            $this->aiService->analyzeTask($task);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('TaskController update error: ' . $e->getMessage());
        }
        $task->refresh();

        return response()->json($task->load('course')); // ← langsung object
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Tugas berhasil dihapus']);
    }

    public function updateStatus(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,overdue',
        ]);

        $status = $validated['status'];
        $progress = $task->progress;
        $completedAt = $task->completed_at;

        if ($status === 'completed') {
            $progress = 100;
            if ($task->status !== 'completed') {
                $completedAt = Carbon::now();
            }
        } else {
            if ($status === 'pending') {
                $progress = 0;
            } elseif ($status === 'in_progress') {
                $progress = $progress > 0 && $progress < 100 ? $progress : 25;
            }
            $completedAt = null;
        }

        $task->update([
            'status' => $status,
            'progress' => $progress,
            'completed_at' => $completedAt,
        ]);

        $task->load('course');

        return response()->json($task); // ← langsung object
    }

    public function analyze(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        try {
            $this->aiService->analyzeTask($task);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('TaskController analyze error: ' . $e->getMessage());
        }
        $task->refresh();

        return response()->json($task->load('course')); // ← langsung object
    }
}