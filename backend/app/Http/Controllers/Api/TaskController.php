<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\AIService;
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

        return response()->json([
            'message' => 'Data tugas berhasil diambil',
            'task'    => $task->load('course')
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'course_id'       => 'nullable|exists:courses,id',
            'deadline'        => 'required|date|after:now',
            'difficulty'      => 'required|integer|min:1|max:5',
            'estimated_hours' => 'required|numeric|min:0.5|max:100',
            'priority'        => 'nullable|in:low,medium,high,critical',
        ]);

        $task = $request->user()->tasks()->create($validated);

        $this->aiService->analyzeTask($task);
        $task->refresh();

        return response()->json($task->load('course'), 201); // ← langsung object
    }


    public function update(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $validated = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'course_id'       => 'nullable|exists:courses,id',
            'deadline'        => 'sometimes|date',
            'difficulty'      => 'sometimes|integer|min:1|max:5',
            'estimated_hours' => 'sometimes|numeric|min:0.5',
            'progress'        => 'sometimes|integer|min:0|max:100',
            'priority'        => 'sometimes|in:low,medium,high,critical',
        ]);

        $task->update($validated);

        // Re-analyze setelah update
        $this->aiService->analyzeTask($task);
        $task->refresh();

        return response()->json([
            'message' => 'Tugas berhasil diperbarui',
            'task'    => $task->load('course'),
        ]);
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

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,overdue',
        ]);

        $task->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'task'    => $task,
        ]);
    }

    public function analyze(Request $request, Task $task)
    {
        if ($task->user_id != $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $this->aiService->analyzeTask($task);
        $task->refresh();

        return response()->json([
            'message' => 'Analisis AI selesai',
            'task'    => $task->load('course'),
        ]);
    }
}