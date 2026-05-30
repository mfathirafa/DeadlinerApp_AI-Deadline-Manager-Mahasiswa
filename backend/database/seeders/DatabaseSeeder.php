<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Demo User
        $user = User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo Student',
                'password' => Hash::make('password'),
            ]
        );

        // Delete existing courses & tasks to ensure clean demo state
        $user->tasks()->delete();
        $user->courses()->delete();
        $user->notifications()->delete();

        // 2. Create 5 Courses
        $ml = Course::create([
            'user_id' => $user->id,
            'name' => 'Machine Learning',
            'code' => 'CS401',
            'color' => '#9f7aea',
        ]);

        $se = Course::create([
            'user_id' => $user->id,
            'name' => 'Software Engineering',
            'code' => 'CS402',
            'color' => '#cfbcff',
        ]);

        $hci = Course::create([
            'user_id' => $user->id,
            'name' => 'Human-Computer Interaction',
            'code' => 'CS403',
            'color' => '#ec4899',
        ]);

        $cn = Course::create([
            'user_id' => $user->id,
            'name' => 'Computer Networks',
            'code' => 'CS404',
            'color' => '#3b82f6',
        ]);

        $db = Course::create([
            'user_id' => $user->id,
            'name' => 'Database Systems',
            'code' => 'CS501',
            'color' => '#22c55e',
        ]);

        $courses = [$ml, $se, $hci, $cn, $db];

        // 3. Create 20 Tasks
        // We need 10 Completed tasks, distributed over the last 7 days:
        // Today: 2 completed tasks
        // 1 day ago: 1 completed task
        // 2 days ago: 2 completed tasks
        // 3 days ago: 1 completed task
        // 4 days ago: 1 completed task
        // 5 days ago: 1 completed task
        // 6 days ago: 2 completed tasks
        $completedDist = [
            0 => 2, // Today
            1 => 1, // 1 day ago
            2 => 2, // 2 days ago
            3 => 1, // 3 days ago
            4 => 1, // 4 days ago
            5 => 1, // 5 days ago
            6 => 2, // 6 days ago
        ];

        $taskIndex = 1;

        foreach ($completedDist as $daysAgo => $count) {
            for ($k = 0; $k < $count; $k++) {
                $completedDate = Carbon::now()->subDays($daysAgo);
                $course = $courses[array_rand($courses)];
                Task::create([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'title' => "Tugas Selesai {$taskIndex}",
                    'description' => "Deskripsi untuk tugas selesai nomor {$taskIndex}.",
                    'deadline' => Carbon::now()->subDays($daysAgo)->addDays(2),
                    'priority' => ['low', 'medium', 'high', 'critical'][rand(0, 3)],
                    'status' => 'completed',
                    'progress' => 100,
                    'completed_at' => $completedDate,
                    'created_at' => Carbon::now()->subDays($daysAgo + 5),
                    'updated_at' => $completedDate,
                    'ai_analysis' => "💡 **AI Workload Analysis ({$course->code})**\n• **Urgency**: Selesai.\n• **Effort Level**: Ringan.\n• **Study Recommendation**: Tugas telah selesai dengan sukses."
                ]);
                $taskIndex++;
            }
        }

        // We need 6 Pending / In Progress tasks
        // Due in future (1 to 10 days)
        for ($i = 0; $i < 6; $i++) {
            $daysOffset = $i + 2;
            $course = $courses[$i % count($courses)];
            $status = $i % 2 === 0 ? 'pending' : 'in_progress';
            $progress = $status === 'in_progress' ? ($i * 15 + 10) : 0;
            Task::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'title' => "Tugas Aktif {$taskIndex}",
                'description' => "Deskripsi untuk tugas aktif nomor {$taskIndex}.",
                'deadline' => Carbon::now()->addDays($daysOffset)->setHour(23)->setMinute(59),
                'priority' => ['low', 'medium', 'high', 'critical'][$i % 4],
                'status' => $status,
                'progress' => $progress,
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
                'ai_analysis' => "💡 **AI Workload Analysis ({$course->code})**\n• **Urgency**: Jatuh tempo dalam {$daysOffset} hari.\n• **Effort Level**: Sedang.\n• **Study Recommendation**: Kerjakan dalam blok waktu Pomodoro."
            ]);
            $taskIndex++;
        }

        // We need 4 Overdue tasks
        // Deadlines in past, status overdue
        for ($i = 0; $i < 4; $i++) {
            $daysOffset = $i + 1;
            $course = $courses[$i % count($courses)];
            Task::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'title' => "Tugas Terlambat {$taskIndex}",
                'description' => "Deskripsi untuk tugas terlambat nomor {$taskIndex}.",
                'deadline' => Carbon::now()->subDays($daysOffset)->setHour(12)->setMinute(0),
                'priority' => ['high', 'critical'][$i % 2],
                'status' => 'overdue',
                'progress' => $i * 10,
                'created_at' => Carbon::now()->subDays($daysOffset + 4),
                'updated_at' => Carbon::now(),
                'ai_analysis' => "💡 **AI Workload Analysis ({$course->code})**\n• **Urgency**: TUGAS SUDAH MELEWATI BATAS WAKTU!\n• **Effort Level**: Tinggi.\n• **Study Recommendation**: Selesaikan segera dan kirimkan ke dosen pengampu."
            ]);
            $taskIndex++;
        }

        // 4. Create Notification data
        $user->notifications()->create([
            'id' => Str::uuid(),
            'type' => 'App\Notifications\TaskDeadlineNotification',
            'data' => [
                'type' => 'overdue',
                'title' => 'Tugas Terlambat!',
                'message' => 'Tugas Terlambat 17 sudah melewati batas waktu pengumpulan!',
                'task_id' => 17
            ],
            'read_at' => null,
            'created_at' => now()->subMinutes(10),
            'updated_at' => now()->subMinutes(10),
        ]);

        $user->notifications()->create([
            'id' => Str::uuid(),
            'type' => 'App\Notifications\TaskDeadlineNotification',
            'data' => [
                'type' => 'deadline_near',
                'title' => 'Tenggat Waktu Mendekat',
                'message' => 'Tugas Aktif 11 akan segera jatuh tempo dalam 2 hari.',
                'task_id' => 11
            ],
            'read_at' => null,
            'created_at' => now()->subHours(1),
            'updated_at' => now()->subHours(1),
        ]);

        $user->notifications()->create([
            'id' => Str::uuid(),
            'type' => 'App\Notifications\TaskDeadlineNotification',
            'data' => [
                'type' => 'recommendation',
                'title' => 'Saran AI Deadliner',
                'message' => 'Selesaikan tugas dengan tingkat prioritas critical terlebih dahulu untuk menjaga skor fokus Anda.',
            ],
            'read_at' => null,
            'created_at' => now()->subHours(4),
            'updated_at' => now()->subHours(4),
        ]);
    }
}
