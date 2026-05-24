<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Dynamically update status to overdue for tasks in the past that are not completed
        Task::where('user_id', $user->id)
            ->where('status', '!=', 'completed')
            ->where('deadline', '<', Carbon::now())
            ->update(['status' => 'overdue']);

        // Calculate Stats
        $totalTasks = Task::where('user_id', $user->id)->count();
        $completedTasks = Task::where('user_id', $user->id)->where('status', 'completed')->count();
        $pendingTasks = Task::where('user_id', $user->id)->whereIn('status', ['pending', 'in_progress'])->count();
        $overdueTasks = Task::where('user_id', $user->id)->where('status', 'overdue')->count();

        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        // Calculate Focus Score
        $focusScore = 100;
        if ($totalTasks > 0) {
            $focusScore -= ($overdueTasks * 10);
            $criticalPending = Task::where('user_id', $user->id)
                ->where('priority', 'critical')
                ->where('status', '!=', 'completed')
                ->count();
            $focusScore -= ($criticalPending * 5);
            $focusScore += ($completionRate * 0.1);
            $focusScore = (int) max(15, min(100, $focusScore));
        }

        // Fetch Recent Tasks
        $recentTasksRaw = Task::where('user_id', $user->id)
            ->with('course')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        $recentTasks = $recentTasksRaw->map(function ($task) {
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

        // Generate Productivity Data (Last 7 Days)
        $productivityData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateString = $date->format('Y-m-d');

            $completedCount = Task::where('user_id', $user->id)
                ->where('status', 'completed')
                ->whereDate('updated_at', $dateString)
                ->count();

            // Focus Hours: proportional to tasks completed, or a base level
            $focusHours = $completedCount > 0 ? ($completedCount * 1.5) : rand(1, 2);

            $productivityData[] = [
                'date' => $date->format('M d'),
                'tasks_completed' => (int) $completedCount,
                'focus_hours' => (float) $focusHours,
            ];
        }

        // Generate AI Insights
        $aiInsights = [];
        if ($focusScore >= 80) {
            $aiInsights[] = [
                'id' => 1,
                'title' => 'Optimal Focus Level',
                'description' => "Your current focus score is {$focusScore}%. You are maintaining high task compliance and consistent check-ins.",
                'type' => 'achievement',
            ];
        } else {
            $aiInsights[] = [
                'id' => 1,
                'title' => 'Focus Capacity Warning',
                'description' => "Your focus score has dropped to {$focusScore}%. Start prioritizing critical deadlines to bring it back up.",
                'type' => 'warning',
            ];
        }

        if ($overdueTasks > 0) {
            $aiInsights[] = [
                'id' => 2,
                'title' => 'Overdue Risk Warning',
                'description' => "You have {$overdueTasks} overdue tasks active. Resolving these should be your immediate academic focus.",
                'type' => 'warning',
            ];
        } else {
            $aiInsights[] = [
                'id' => 2,
                'title' => 'Scheduling Consistency',
                'description' => "Zero overdue deadlines! You are maintaining an excellent time management record.",
                'type' => 'achievement',
            ];
        }

        $criticalCount = Task::where('user_id', $user->id)
            ->where('priority', 'critical')
            ->where('status', '!=', 'completed')
            ->count();
        if ($criticalCount > 0) {
            $aiInsights[] = [
                'id' => 3,
                'title' => 'Bottleneck Detected',
                'description' => "You have {$criticalCount} active critical tasks. Plan a deep study block to resolve them.",
                'type' => 'suggestion',
            ];
        } else {
            $aiInsights[] = [
                'id' => 3,
                'title' => 'Symmetric Workload',
                'description' => "No critical bottlenecks. Try using this calm block to work on future courses.",
                'type' => 'analysis',
            ];
        }

        // Generate Recommendations
        $recommendations = [];
        
        $oldestOverdue = Task::where('user_id', $user->id)
            ->where('status', 'overdue')
            ->orderBy('deadline', 'asc')
            ->first();

        if ($oldestOverdue) {
            $recommendations[] = [
                'id' => 1,
                'title' => "Complete: {$oldestOverdue->title}",
                'description' => "This task is past its deadline. Dedicate a quick 30 minutes to finish it.",
                'action' => "Prioritize Task",
                'priority' => "high",
            ];
        } else {
            $nextUrgent = Task::where('user_id', $user->id)
                ->where('status', '!=', 'completed')
                ->orderBy('deadline', 'asc')
                ->first();

            if ($nextUrgent) {
                $recommendations[] = [
                    'id' => 1,
                    'title' => "Tackle Next: {$nextUrgent->title}",
                    'description' => "This is due next on your timeline. Starting early reduces cognitive load.",
                    'action' => "Start Task",
                    'priority' => $nextUrgent->priority === 'critical' || $nextUrgent->priority === 'high' ? 'high' : 'medium',
                ];
            } else {
                $recommendations[] = [
                    'id' => 1,
                    'title' => "Take a Break!",
                    'description' => "All current tasks are completed! Enjoy your free time or plan ahead.",
                    'action' => "Open Settings",
                    'priority' => "low",
                ];
            }
        }

        $courseCount = Course::where('user_id', $user->id)->count();
        if ($courseCount > 0) {
            $recommendations[] = [
                'id' => 2,
                'title' => "Review Subject Progress",
                'description' => "Evaluate your task completion ratios for your registered courses.",
                'action' => "View Courses",
                'priority' => "medium",
            ];
        } else {
            $recommendations[] = [
                'id' => 2,
                'title' => "Add Your First Course",
                'description' => "Organize your study goals by registering your university modules.",
                'action' => "Add Course",
                'priority' => "high",
            ];
        }

        $recommendations[] = [
            'id' => 3,
            'title' => "Pomodoro Strategy",
            'description' => "Try studying in 25-minute Pomodoro blocks followed by 5-minute restorative breaks.",
            'action' => "Open Calendar",
            'priority' => "low",
        ];

        return response()->json([
            'stats' => [
                'total_tasks' => (int) $totalTasks,
                'completed_tasks' => (int) $completedTasks,
                'pending_tasks' => (int) $pendingTasks,
                'overdue_tasks' => (int) $overdueTasks,
                'completion_rate' => (int) $completionRate,
                'focus_score' => (int) $focusScore,
            ],
            'recent_tasks' => $recentTasks,
            'ai_insights' => $aiInsights,
            'productivity_data' => $productivityData,
            'recommendations' => $recommendations,
        ]);
    }
}
