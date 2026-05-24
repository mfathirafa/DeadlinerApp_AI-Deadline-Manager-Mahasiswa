<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Demo User
        $user = User::create([
            'name' => 'Demo Student',
            'email' => 'demo@example.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create Courses
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

        // 3. Create Tasks with different deadlines and priorities

        // Task 1: Pending, high priority, ML, due in 2 days
        Task::create([
            'user_id' => $user->id,
            'course_id' => $ml->id,
            'title' => 'Machine Learning Assignment 1',
            'description' => 'Complete the gradient descent implementation tasks and report your training loss values.',
            'deadline' => Carbon::now()->addDays(2)->setHour(23)->setMinute(59)->setSecond(0),
            'priority' => 'high',
            'status' => 'pending',
            'progress' => 0,
            'ai_analysis' => "💡 **AI Workload Analysis (CS401)**\n• **Urgency**: Due in 2 days. Spreading work over 2 sessions is recommended.\n• **Effort Level**: High workload. Estimated completion time: 4-5 hours.\n• **Study Recommendation**: Complete gradient descent math analysis first, then proceed to implementation.",
        ]);

        // Task 2: In progress, critical priority, SE, due in 5 days
        Task::create([
            'user_id' => $user->id,
            'course_id' => $se->id,
            'title' => 'Software Engineering Project Milestone 1',
            'description' => 'Finish the requirement documentation, UML diagram mapping, and entity architecture blueprints.',
            'deadline' => Carbon::now()->addDays(5)->setHour(12)->setMinute(00)->setSecond(0),
            'priority' => 'critical',
            'status' => 'in_progress',
            'progress' => 40,
            'ai_analysis' => "💡 **AI Workload Analysis (CS402)**\n• **Urgency**: Due in 5 days. You have a comfortable window.\n• **Effort Level**: Critical workload! Requires deep team coordination.\n• **Study Recommendation**: Focus on finalizing the entity model today and write API resource mappings tomorrow.",
        ]);

        // Task 3: Overdue, medium priority, HCI, due 1 day ago
        Task::create([
            'user_id' => $user->id,
            'course_id' => $hci->id,
            'title' => 'HCI Quiz 1',
            'description' => 'Complete the online quiz on usability engineering principles and Nielsen heuristics.',
            'deadline' => Carbon::now()->subDay()->setHour(18)->setMinute(00)->setSecond(0),
            'priority' => 'medium',
            'status' => 'overdue',
            'progress' => 10,
            'ai_analysis' => "💡 **AI Workload Analysis (CS403)**\n• **Urgency**: Task is past its deadline! Action needed immediately.\n• **Effort Level**: Moderate workload. Estimated time: 1.5 hours.\n• **Study Recommendation**: Revise usability heuristics summary sheets and complete the submission interface immediately.",
        ]);

        // Task 4: Completed, low priority, CN, completed 4 days ago
        Task::create([
            'user_id' => $user->id,
            'course_id' => $cn->id,
            'title' => 'Computer Networks Lab 1',
            'description' => 'Analyze wire packet logs using Wireshark and answer network layer protocol questions.',
            'deadline' => Carbon::now()->subDays(4)->setHour(23)->setMinute(59)->setSecond(0),
            'priority' => 'low',
            'status' => 'completed',
            'progress' => 100,
            'ai_analysis' => null,
            'updated_at' => Carbon::now()->subDays(4), // Set updated_at to SubDays(4) for chart seeding
        ]);

        // Task 5: Pending, high priority, ML, due in 12 days
        Task::create([
            'user_id' => $user->id,
            'course_id' => $ml->id,
            'title' => 'Machine Learning Midterm Prep',
            'description' => 'Revise calculus, linear algebra bases, and classification loss formulas.',
            'deadline' => Carbon::now()->addDays(12)->setHour(10)->setMinute(00)->setSecond(0),
            'priority' => 'high',
            'status' => 'pending',
            'progress' => 0,
        ]);

        // Task 6: Completed, medium priority, SE, completed today
        Task::create([
            'user_id' => $user->id,
            'course_id' => $se->id,
            'title' => 'Software Engineering Presentation Slide Draft',
            'description' => 'Prepare the slides outline for the project milestones.',
            'deadline' => Carbon::now()->addDays(8)->setHour(23)->setMinute(59)->setSecond(0),
            'priority' => 'medium',
            'status' => 'completed',
            'progress' => 100,
            'updated_at' => Carbon::now(), // Seeding completed today
        ]);

        // Task 7: In progress, low priority, HCI, due in 3 days
        Task::create([
            'user_id' => $user->id,
            'course_id' => $hci->id,
            'title' => 'HCI Paper Review Draft',
            'description' => 'Write a 1-page summary review on double-diamond design pattern paper.',
            'deadline' => Carbon::now()->addDays(3)->setHour(23)->setMinute(59)->setSecond(0),
            'priority' => 'low',
            'status' => 'in_progress',
            'progress' => 50,
        ]);
    }
}
