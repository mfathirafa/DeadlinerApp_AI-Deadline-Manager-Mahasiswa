<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user  = $request->user();
        $tasks = $user->tasks()->with('course')->get();

        // Auto update overdue
        $tasks->each(fn($t) => $t->checkAndUpdateOverdue());
        $tasks = $user->tasks()->with('course')->get(); // reload setelah update

        // ── Stats ──────────────────────────────────────────────
        $totalTasks     = $tasks->count();
        $completedTasks = $tasks->where('status', 'completed')->count();
        $pendingTasks   = $tasks->whereIn('status', ['pending', 'in_progress'])->count();
        $overdueTasks   = $tasks->where('status', 'overdue')->count();
        $completionRate = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100)
            : 0;

        // Focus score: kombinasi completion rate + tidak ada overdue
        $focusScore = max(0, min(100,
            $completionRate - ($overdueTasks * 10) + ($completedTasks * 2)
        ));

        // ── Recent Tasks (5 terdekat) ──────────────────────────
        $recentTasks = $tasks
            ->whereNotIn('status', ['completed'])
            ->sortBy('deadline')
            ->take(5)
            ->values();

        // ── AI Insights (array) ────────────────────────────────
        $aiInsights = [];

        // Insight 1: tugas paling urgent
        $urgentTask = $tasks
            ->where('status', '!=', 'completed')
            ->sortByDesc('ai_priority_score')
            ->first();

        if ($urgentTask) {
            $aiInsights[] = [
                'id'          => 1,
                'title'       => 'Prioritas Utama: ' . $urgentTask->title,
                'description' => $urgentTask->ai_analysis ?? 'Segera kerjakan tugas ini.',
                'type'        => in_array($urgentTask->priority, ['high', 'critical'])
                    ? 'warning'
                    : 'suggestion',
            ];
        }

        // Insight 2: kalau ada overdue
        if ($overdueTasks > 0) {
            $aiInsights[] = [
                'id'          => 2,
                'title'       => "{$overdueTasks} Tugas Melewati Deadline",
                'description' => 'Segera selesaikan tugas yang sudah melewati deadline untuk menjaga performa akademikmu.',
                'type'        => 'warning',
            ];
        }

        // Insight 3: achievement kalau completion rate tinggi
        if ($completionRate >= 80) {
            $aiInsights[] = [
                'id'          => 3,
                'title'       => 'Performa Luar Biasa!',
                'description' => "Tingkat penyelesaian tugasmu mencapai {$completionRate}%. Pertahankan!",
                'type'        => 'achievement',
            ];
        }

        // ── Productivity Data (7 hari terakhir) ───────────────
        $productivityData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $productivityData[] = [
                'date'             => $date,
                'tasks_completed'  => $tasks
                    ->where('status', 'completed')
                    ->filter(fn($t) => $t->updated_at->format('Y-m-d') === $date)
                    ->count(),
                'focus_hours'      => rand(1, 8), // placeholder
            ];
        }

        // ── Recommendations ────────────────────────────────────
        $recommendations = [];
        $upcomingTasks = $tasks
            ->where('status', '!=', 'completed')
            ->filter(fn($t) => $t->deadline->diffInDays(now(), false) <= 5
                            && $t->deadline->isFuture())
            ->sortBy('deadline')
            ->take(3);

        foreach ($upcomingTasks as $idx => $t) {
            $recommendations[] = [
                'id'          => $idx + 1,
                'title'       => $t->title,
                'description' => $t->ai_analysis ?? 'Deadline mendekat, segera kerjakan.',
                'action'      => 'Mulai Sekarang',
                'priority'    => $t->priority ?? 'medium',
            ];
        }

        return response()->json([
            'user' => [
                'name'       => $user->name,
                'university' => $user->university,
            ],
            'stats' => [
                'total_tasks'     => $totalTasks,
                'completed_tasks' => $completedTasks,
                'pending_tasks'   => $pendingTasks,
                'overdue_tasks'   => $overdueTasks,
                'completion_rate' => $completionRate,
                'focus_score'     => $focusScore,
            ],
            'recent_tasks'      => $recentTasks,
            'ai_insights'       => $aiInsights,
            'productivity_data' => $productivityData,
            'recommendations'   => $recommendations,
        ]);
    }
}