<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::where('user_id', $request->user()->id)
            ->with('course')
            ->get();

        $formatted = $tasks->map(function ($task) {
            $status = $task->status;
            if ($status !== 'completed' && $task->deadline->isPast()) {
                $status = 'overdue';
            }
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description ?? '',
                'course_id' => $task->course_id,
                'course' => $task->course ? [
                    'id' => $task->course->id,
                    'name' => $task->course->name,
                    'code' => $task->course->code,
                    'color' => $task->course->color,
                    'created_at' => $task->course->created_at->toIso8601String(),
                    'updated_at' => $task->course->updated_at->toIso8601String(),
                ] : null,
                'priority' => $task->priority,
                'status' => $status,
                'deadline' => $task->deadline->toIso8601String(),
                'progress' => (int) $task->progress,
                'ai_analysis' => $task->ai_analysis,
                'created_at' => $task->created_at->toIso8601String(),
                'updated_at' => $task->updated_at->toIso8601String(),
            ];
        });

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'nullable|integer',
            'priority' => 'required|in:low,medium,high,critical',
            'deadline' => 'required|date',
        ]);

        if (isset($validated['course_id'])) {
            Course::where('user_id', $request->user()->id)->findOrFail($validated['course_id']);
        }

        $deadline = Carbon::parse($validated['deadline']);
        $status = $deadline->isPast() ? 'overdue' : 'pending';

        $task = Task::create([
            'user_id' => $request->user()->id,
            'course_id' => $validated['course_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'deadline' => $deadline,
            'priority' => $validated['priority'],
            'status' => $status,
            'progress' => 0,
            'ai_analysis' => null,
        ]);

        $task->load('course');

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description ?? '',
            'course_id' => $task->course_id,
            'course' => $task->course ? [
                'id' => $task->course->id,
                'name' => $task->course->name,
                'code' => $task->course->code,
                'color' => $task->course->color,
                'created_at' => $task->course->created_at->toIso8601String(),
                'updated_at' => $task->course->updated_at->toIso8601String(),
            ] : null,
            'priority' => $task->priority,
            'status' => $task->status,
            'deadline' => $task->deadline->toIso8601String(),
            'progress' => (int) $task->progress,
            'ai_analysis' => $task->ai_analysis,
            'created_at' => $task->created_at->toIso8601String(),
            'updated_at' => $task->updated_at->toIso8601String(),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'nullable|integer',
            'priority' => 'sometimes|required|in:low,medium,high,critical',
            'deadline' => 'sometimes|required|date',
            'progress' => 'sometimes|required|integer|min:0|max:100',
            'status' => 'sometimes|required|in:pending,in_progress,completed,overdue',
        ]);

        if (isset($validated['course_id'])) {
            Course::where('user_id', $request->user()->id)->findOrFail($validated['course_id']);
        }

        if (isset($validated['deadline'])) {
            $validated['deadline'] = Carbon::parse($validated['deadline']);
        }

        // Align status & progress
        if (isset($validated['status']) && $validated['status'] === 'completed') {
            $validated['progress'] = 100;
        } elseif (isset($validated['progress']) && (int)$validated['progress'] === 100) {
            $validated['status'] = 'completed';
        }

        $task->update($validated);
        $task->load('course');

        $status = $task->status;
        if ($status !== 'completed' && $task->deadline->isPast()) {
            $status = 'overdue';
        }

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description ?? '',
            'course_id' => $task->course_id,
            'course' => $task->course ? [
                'id' => $task->course->id,
                'name' => $task->course->name,
                'code' => $task->course->code,
                'color' => $task->course->color,
                'created_at' => $task->course->created_at->toIso8601String(),
                'updated_at' => $task->course->updated_at->toIso8601String(),
            ] : null,
            'priority' => $task->priority,
            'status' => $status,
            'deadline' => $task->deadline->toIso8601String(),
            'progress' => (int) $task->progress,
            'ai_analysis' => $task->ai_analysis,
            'created_at' => $task->created_at->toIso8601String(),
            'updated_at' => $task->updated_at->toIso8601String(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,overdue',
        ]);

        $status = $validated['status'];
        $progress = $task->progress;

        if ($status === 'completed') {
            $progress = 100;
        } elseif ($status === 'pending') {
            $progress = 0;
        } elseif ($status === 'in_progress') {
            $progress = $progress > 0 && $progress < 100 ? $progress : 25;
        }

        $task->update([
            'status' => $status,
            'progress' => $progress,
        ]);

        $task->load('course');

        if ($status !== 'completed' && $task->deadline->isPast()) {
            $status = 'overdue';
        }

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description ?? '',
            'course_id' => $task->course_id,
            'course' => $task->course ? [
                'id' => $task->course->id,
                'name' => $task->course->name,
                'code' => $task->course->code,
                'color' => $task->course->color,
                'created_at' => $task->course->created_at->toIso8601String(),
                'updated_at' => $task->course->updated_at->toIso8601String(),
            ] : null,
            'priority' => $task->priority,
            'status' => $status,
            'deadline' => $task->deadline->toIso8601String(),
            'progress' => (int) $task->progress,
            'ai_analysis' => $task->ai_analysis,
            'created_at' => $task->created_at->toIso8601String(),
            'updated_at' => $task->updated_at->toIso8601String(),
        ]);
    }

    public function analyze(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->with('course')->findOrFail($id);

        $daysUntil = (int) round(Carbon::now()->diffInDays($task->deadline, false));
        $workloadText = "";
        $recommendationText = "";

        if ($task->priority === 'critical') {
            $workloadText = "Critical workload! This requires immediate, focused attention.";
            $recommendationText = "Divide into sprints: 1. Setup & Outline (1h), 2. Implementation (3h), 3. Verification & Polish (1h).";
        } elseif ($task->priority === 'high') {
            $workloadText = "High workload. Expect to commit 4-5 hours of dedicated effort.";
            $recommendationText = "Schedule a 2-hour deep-work block today. Tackle the hardest sections first.";
        } else {
            $workloadText = "Moderate workload. Estimated completion time: 2-3 hours.";
            $recommendationText = "Perfect for a Pomodoro session (4 x 25-minute study intervals).";
        }

        if ($daysUntil < 0) {
            $deadlineText = "This task is already past its deadline! Focus on submitting it immediately.";
        } elseif ($daysUntil <= 1) {
            $deadlineText = "Due tomorrow! High urgency. Turn off notifications and start a sprint.";
        } else {
            $deadlineText = "Due in {$daysUntil} days. Spreading the work over {$daysUntil} sessions will reduce stress.";
        }

        $courseCode = $task->course ? $task->course->code : 'General';
        
        $aiAnalysis = "💡 **AI Workload Analysis ({$courseCode})**\n"
                    . "• **Urgency**: {$deadlineText}\n"
                    . "• **Effort Level**: {$workloadText}\n"
                    . "• **Study Recommendation**: {$recommendationText}";

        $task->update([
            'ai_analysis' => $aiAnalysis,
        ]);

        // Trigger AI Recommendation notification to user
        try {
            $notificationService = new \App\Services\NotificationService();
            $notificationService->notifyAIRecommendation($task);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to trigger AI recommendation notification: " . $e->getMessage());
        }

        $status = $task->status;
        if ($status !== 'completed' && $task->deadline->isPast()) {
            $status = 'overdue';
        }

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description ?? '',
            'course_id' => $task->course_id,
            'course' => $task->course ? [
                'id' => $task->course->id,
                'name' => $task->course->name,
                'code' => $task->course->code,
                'color' => $task->course->color,
                'created_at' => $task->course->created_at->toIso8601String(),
                'updated_at' => $task->course->updated_at->toIso8601String(),
            ] : null,
            'priority' => $task->priority,
            'status' => $status,
            'deadline' => $task->deadline->toIso8601String(),
            'progress' => (int) $task->progress,
            'ai_analysis' => $task->ai_analysis,
            'created_at' => $task->created_at->toIso8601String(),
            'updated_at' => $task->updated_at->toIso8601String(),
        ]);
    }
}
