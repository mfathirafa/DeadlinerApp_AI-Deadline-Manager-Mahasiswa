<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskDeadlineNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;
    protected $type; // 'deadline_near', 'overdue', 'recommendation'
    protected $data; // extra text

    /**
     * Create a new notification instance.
     */
    public function __construct($task, string $type, array $data = [])
    {
        $this->task = $task;
        $this->type = $type;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = '';
        $title = '';
        $greeting = 'Hi ' . ($notifiable->name ? explode(' ', $notifiable->name)[0] : 'there') . ',';
        $message = '';
        $actionText = 'Open Dashboard';
        $actionUrl = config('app.frontend_url', 'http://localhost:3000') . '/dashboard';

        if ($this->type === 'deadline_near') {
            $subject = '⏰ Urgent: Deadline Approaching!';
            $title = 'Deadline Approaching';
            $message = "Your task \"{$this->task->title}\" is due soon (by " . date('M d, Y H:i', strtotime($this->task->deadline)) . "). Make sure to complete it on time!";
        } elseif ($this->type === 'overdue') {
            $subject = '🚨 Task Overdue!';
            $title = 'Task Overdue';
            $message = "Your task \"{$this->task->title}\" is overdue! The deadline of " . date('M d, Y H:i', strtotime($this->task->deadline)) . " has passed. Please update your progress or reschedule.";
        } elseif ($this->type === 'recommendation') {
            $subject = '💡 New AI Productivity Insights';
            $title = 'AI Insight Generated';
            $message = "AuraAI has generated new productivity recommendations for your task \"{$this->task->title}\". Open the AI Insights tab to review your personalized strategy.";
            $actionText = 'View AI Insights';
            $actionUrl = config('app.frontend_url', 'http://localhost:3000') . '/ai-insights';
        } else {
            $subject = 'AuraAI Notification';
            $title = 'Notification';
            $message = $this->data['message'] ?? 'You have a new update.';
        }

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($message)
            ->action($actionText, $actionUrl)
            ->line('Keep up the good work!')
            ->salutation('The AuraAI Deadliner Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $title = '';
        $message = '';

        if ($this->type === 'deadline_near') {
            $title = 'Deadline Approaching';
            $message = "The task \"{$this->task->title}\" is due soon.";
        } elseif ($this->type === 'overdue') {
            $title = 'Task Overdue';
            $message = "The task \"{$this->task->title}\" is overdue.";
        } elseif ($this->type === 'recommendation') {
            $title = 'New AI Recommendation';
            $message = "AuraAI generated a new recommendation for \"{$this->task->title}\".";
        } else {
            $title = $this->data['title'] ?? 'Notification';
            $message = $this->data['message'] ?? 'You have a new update.';
        }

        return [
            'task_id' => $this->task->id ?? null,
            'type' => $this->type,
            'title' => $title,
            'message' => $message,
        ];
    }
}
