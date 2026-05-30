<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Auto-update overdue tasks
        $allUserTasks = Task::where('user_id', $user->id)->get();
        foreach ($allUserTasks as $task) {
            $task->checkAndUpdateOverdue();
        }

        // Re-fetch stats after updating overdue status
        $totalTasks = Task::where('user_id', $user->id)->count();
        $completedTasks = Task::where('user_id', $user->id)->where('status', 'completed')->count();
        $pendingTasks = Task::where('user_id', $user->id)->whereIn('status', ['pending', 'in_progress'])->count();
        $overdueTasks = Task::where('user_id', $user->id)->where('status', 'overdue')->count();
        
        $completionRate = $totalTasks > 0 ? (int) round(($completedTasks / $totalTasks) * 100) : 0;
        
        // Dynamic Focus Score:
        if ($totalTasks === 0) {
            $focusScore = 75;
        } else {
            $focusScore = (($completedTasks / $totalTasks) * 100) - ($overdueTasks * 5);
            $focusScore = max(0, min(100, $focusScore));
            $focusScore = (int) round($focusScore);
        }

        // Risk Score
        $riskScore = 0;
        if ($overdueTasks > 0) {
            $riskScore = min(100, $overdueTasks * 20);
        }

        // Dynamic weekly change indicators
        $now = Carbon::now();
        $sevenDaysAgo = Carbon::now()->subDays(7);
        $fourteenDaysAgo = Carbon::now()->subDays(14);

        $totalCurrent = Task::where('user_id', $user->id)
            ->whereBetween('created_at', [$sevenDaysAgo, $now])
            ->count();
        $completedCurrent = Task::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereBetween('completed_at', [$sevenDaysAgo, $now])
            ->count();
        $pendingCurrent = Task::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereBetween('created_at', [$sevenDaysAgo, $now])
            ->count();

        $totalPrevious = Task::where('user_id', $user->id)
            ->whereBetween('created_at', [$fourteenDaysAgo, $sevenDaysAgo])
            ->count();
        $completedPrevious = Task::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereBetween('completed_at', [$fourteenDaysAgo, $sevenDaysAgo])
            ->count();
        $pendingPrevious = Task::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereBetween('created_at', [$fourteenDaysAgo, $sevenDaysAgo])
            ->count();

        $totalChange = $totalPrevious > 0 ? (($totalCurrent - $totalPrevious) / $totalPrevious) * 100 : null;
        if ($totalChange !== null) $totalChange = ($totalChange >= 0 ? '+' : '') . round($totalChange) . '%';

        $completedChange = $completedPrevious > 0 ? (($completedCurrent - $completedPrevious) / $completedPrevious) * 100 : null;
        if ($completedChange !== null) $completedChange = ($completedChange >= 0 ? '+' : '') . round($completedChange) . '%';

        $pendingChange = $pendingPrevious > 0 ? (($pendingCurrent - $pendingPrevious) / $pendingPrevious) * 100 : null;
        if ($pendingChange !== null) $pendingChange = ($pendingChange >= 0 ? '+' : '') . round($pendingChange) . '%';

        $overdueChange = null;

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
                ] : null,
                'deadline' => $task->deadline->toIso8601String(),
                'difficulty' => $task->difficulty,
                'estimated_hours' => (float) $task->estimated_hours,
                'progress' => (int) $task->progress,
                'status' => $status,
                'priority' => $task->priority,
                'ai_priority_score' => (int) $task->ai_priority_score,
                'ai_analysis' => $task->ai_analysis,
                'ai_suggested_start' => $task->ai_suggested_start ? $task->ai_suggested_start->format('Y-m-d') : null,
                'completed_at' => $task->completed_at ? $task->completed_at->toIso8601String() : null,
                'created_at' => $task->created_at->toIso8601String(),
                'updated_at' => $task->updated_at->toIso8601String(),
            ];
        });

        // ── AI Insights ──
        $aiInsights = [];
        $insightId = 1;

        $urgentTask = Task::where('user_id', $user->id)
            ->where('status', '!=', 'completed')
            ->orderBy('ai_priority_score', 'desc')
            ->first();

        if ($urgentTask) {
            $status = $urgentTask->status;
            if ($status !== 'completed' && $urgentTask->deadline->isPast()) {
                $status = 'overdue';
            }
            $aiInsights[] = [
                'id' => $insightId++,
                'title' => 'Prioritas Utama: ' . $urgentTask->title,
                'description' => $urgentTask->ai_analysis ?? 'Segera kerjakan tugas ini.',
                'type' => in_array($urgentTask->priority, ['high', 'critical']) || $status === 'overdue' ? 'warning' : 'suggestion',
            ];
        }

        if ($overdueTasks > 0) {
            $aiInsights[] = [
                'id' => $insightId++,
                'title' => "{$overdueTasks} Tugas Melewati Deadline",
                'description' => 'Segera selesaikan tugas yang sudah melewati deadline untuk menjaga performa akademikmu.',
                'type' => 'warning',
            ];
        }

        if ($completionRate >= 80) {
            $aiInsights[] = [
                'id' => $insightId++,
                'title' => 'Performa Luar Biasa!',
                'description' => "Tingkat penyelesaian tugasmu mencapai {$completionRate}%. Pertahankan!",
                'type' => 'achievement',
            ];
        }

        // ── Productivity Data ──
        $productivityData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateString = $date->format('Y-m-d');

            $createdCount = Task::where('user_id', $user->id)
                ->whereDate('created_at', $dateString)
                ->count();

            $completedCount = Task::where('user_id', $user->id)
                ->where('status', 'completed')
                ->whereDate('completed_at', $dateString)
                ->count();

            $overdueCount = Task::where('user_id', $user->id)
                ->where('status', 'overdue')
                ->whereDate('deadline', $dateString)
                ->count();

            $focusHours = (float) ($completedCount * 1.5);

            $productivityData[] = [
                'date' => $dateString,
                'created' => (int) $createdCount,
                'completed' => (int) $completedCount,
                'overdue' => (int) $overdueCount,
                'focus_hours' => $focusHours,
            ];
        }

        // ── Recommendations ──
        $recommendations = [];
        $recId = 1;

        $courseCount = Course::where('user_id', $user->id)->count();

        if ($totalTasks === 0) {
            $recommendations[] = [
                'id' => $recId++,
                'type' => 'pomodoro',
                'title' => 'Pomodoro Strategy',
                'description' => 'Gunakan teknik 25 menit belajar terfokus dan 5 menit istirahat.',
                'action' => 'Buka Kalender',
                'priority' => 'low',
                'icon' => 'clock',
            ];
            $recommendations[] = [
                'id' => $recId++,
                'type' => 'study_planning',
                'title' => 'Study Planning',
                'description' => 'Tambahkan mata kuliah untuk mulai menyusun rencana belajar kuliahmu.',
                'action' => 'Lihat Mata Kuliah',
                'priority' => 'high',
                'icon' => 'book',
            ];
            $recommendations[] = [
                'id' => $recId++,
                'type' => 'upcoming_deadline',
                'title' => 'Upcoming Deadline',
                'description' => 'Belum ada deadline tugas terdaftar. Yuk, buat tugas pertama kamu sekarang!',
                'action' => 'Buat Tugas Pertama',
                'priority' => 'high',
                'icon' => 'target',
            ];
            $recommendations[] = [
                'id' => $recId++,
                'type' => 'quick_actions',
                'title' => 'Quick Actions',
                'description' => 'Kelola seluruh tugas dan jadwal belajarmu secara teratur dengan AuraAI.',
                'action' => 'Buat Tugas Pertama',
                'priority' => 'medium',
                'icon' => 'sparkles',
            ];
        } else {
            // 1. Pomodoro Strategy (Baseline)
            $recommendations[] = [
                'id' => $recId++,
                'type' => 'pomodoro',
                'title' => 'Pomodoro Strategy',
                'description' => 'Belajar terfokus 25 menit dan istirahat 5 menit untuk menjaga performa otak.',
                'action' => 'Buka Kalender',
                'priority' => 'low',
                'icon' => 'clock',
            ];

            // 2. Study Planning
            if ($courseCount === 0) {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'study_planning',
                    'title' => 'Study Planning',
                    'description' => 'Tambahkan mata kuliah baru untuk mengelompokkan tugas.',
                    'action' => 'Tambah Mata Kuliah',
                    'priority' => 'high',
                    'icon' => 'book',
                ];
            } else {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'study_planning',
                    'title' => 'Study Planning',
                    'description' => "Kamu terdaftar di {$courseCount} mata kuliah. Atur jadwal belajar mingguan Anda.",
                    'action' => 'Lihat Mata Kuliah',
                    'priority' => 'medium',
                    'icon' => 'book',
                ];
            }

            // 3. Upcoming Deadline
            if ($overdueTasks > 0) {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'upcoming_deadline',
                    'title' => 'Upcoming Deadline',
                    'description' => "Ada {$overdueTasks} tugas terlambat! Selesaikan segera untuk menghindari pengurangan nilai.",
                    'action' => 'Lihat Deadline',
                    'priority' => 'high',
                    'icon' => 'warning',
                ];
            } else {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'upcoming_deadline',
                    'title' => 'Upcoming Deadline',
                    'description' => 'Tinjau tugas yang akan datang untuk menghindari deadline mendadak.',
                    'action' => 'Lihat Deadline',
                    'priority' => 'medium',
                    'icon' => 'target',
                ];
            }

            // 4. Quick Actions
            if ($pendingTasks > 0) {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'quick_actions',
                    'title' => 'Quick Actions',
                    'description' => "Ada {$pendingTasks} tugas pending menanti. Cicil pengerjaan sebelum mendekati deadline.",
                    'action' => 'Lihat Deadline',
                    'priority' => 'medium',
                    'icon' => 'sparkles',
                ];
            } else {
                $recommendations[] = [
                    'id' => $recId++,
                    'type' => 'quick_actions',
                    'title' => 'Quick Actions',
                    'description' => 'Luar biasa, semua tugas selesai! Gunakan waktu luang untuk istirahat atau mengulang materi.',
                    'action' => 'Lihat Mata Kuliah',
                    'priority' => 'low',
                    'icon' => 'sparkles',
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_tasks' => (int) $totalTasks,
                    'completed_tasks' => (int) $completedTasks,
                    'pending_tasks' => (int) $pendingTasks,
                    'overdue_tasks' => (int) $overdueTasks,
                    'completion_rate' => (int) $completionRate,
                    'focus_score' => (int) $focusScore,
                    'risk_score' => (int) $riskScore,
                    'total_change' => $totalChange,
                    'completed_change' => $completedChange,
                    'pending_change' => $pendingChange,
                    'overdue_change' => $overdueChange,
                    'current_hour' => (int) Carbon::now('Asia/Jakarta')->hour,
                ],
                'recent_tasks' => $recentTasks,
                'ai_insights' => $aiInsights,
                'productivity_data' => $productivityData,
                'recommendations' => $recommendations,
            ]
        ]);
    }

    public function productivity(Request $request)
    {
        $user = $request->user();
        $timeline = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateString = $date->format('Y-m-d');

            $createdCount = Task::where('user_id', $user->id)
                ->whereDate('created_at', $dateString)
                ->count();

            $completedCount = Task::where('user_id', $user->id)
                ->where('status', 'completed')
                ->whereDate('completed_at', $dateString)
                ->count();

            $overdueCount = Task::where('user_id', $user->id)
                ->where('status', 'overdue')
                ->whereDate('deadline', $dateString)
                ->count();

            $focusHours = (float) ($completedCount * 1.5);

            $timeline[] = [
                'date' => $dateString,
                'created' => (int) $createdCount,
                'completed' => (int) $completedCount,
                'overdue' => (int) $overdueCount,
                'focus_hours' => $focusHours,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'timeline' => $timeline
            ]
        ]);
    }
}