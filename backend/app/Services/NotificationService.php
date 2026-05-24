<?php

namespace App\Services;

use App\Models\Task;
use App\Notifications\TaskDeadlineNotification;
use Carbon\Carbon;

class NotificationService
{
    /**
     * Check tasks and send deadline alerts / overdue alerts.
     */
    public function checkAndNotify(): void
    {
        $now = Carbon::now();
        $tomorrow = Carbon::now()->addHours(24);

        // 1. Send warning for approaching deadlines (due within 24h, not completed, not already notified)
        $approachingTasks = Task::with('user')
            ->where('status', '!=', 'completed')
            ->where('deadline', '>', $now)
            ->where('deadline', '<=', $tomorrow)
            ->get();

        foreach ($approachingTasks as $task) {
            if (!$task->user) {
                continue;
            }

            // Check if already notified for deadline_near to prevent spam
            $alreadyNotified = $task->user->notifications()
                ->where('data', 'like', '%"task_id":%' . $task->id . '%')
                ->where('data', 'like', '%"type":"deadline_near"%')
                ->exists();

            if (!$alreadyNotified) {
                $task->user->notify(new TaskDeadlineNotification($task, 'deadline_near'));
            }
        }

        // 2. Mark past-due tasks as overdue and send overdue alerts
        $overdueTasks = Task::with('user')
            ->where('status', '!=', 'completed')
            ->where('status', '!=', 'overdue')
            ->where('deadline', '<=', $now)
            ->get();

        foreach ($overdueTasks as $task) {
            // Update status to overdue
            $task->status = 'overdue';
            $task->save();

            if (!$task->user) {
                continue;
            }

            // Check if already notified for overdue
            $alreadyNotified = $task->user->notifications()
                ->where('data', 'like', '%"task_id":%' . $task->id . '%')
                ->where('data', 'like', '%"type":"overdue"%')
                ->exists();

            if (!$alreadyNotified) {
                $task->user->notify(new TaskDeadlineNotification($task, 'overdue'));
            }
        }
    }

    /**
     * Send AI Recommendation alert.
     */
    public function notifyAIRecommendation(Task $task): void
    {
        if ($task->user) {
            $task->user->notify(new TaskDeadlineNotification($task, 'recommendation'));
        }
    }
}
