<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_fetch_dashboard_data()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        
        $course = Course::create([
            'user_id' => $user->id,
            'name' => 'CS101',
            'code' => 'CS101',
            'color' => '#fff',
        ]);

        Task::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'title' => 'Completed Task',
            'deadline' => now()->addDays(2),
            'priority' => 'medium',
            'status' => 'completed',
            'progress' => 100,
        ]);

        Task::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'title' => 'Pending Task',
            'deadline' => now()->addDays(3),
            'priority' => 'high',
            'status' => 'pending',
            'progress' => 0,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'stats' => [
                        'total_tasks',
                        'completed_tasks',
                        'pending_tasks',
                        'overdue_tasks',
                        'completion_rate',
                        'focus_score',
                    ],
                    'recent_tasks',
                    'ai_insights',
                    'productivity_data',
                    'recommendations',
                ]
            ])
            ->assertJsonPath('data.stats.total_tasks', 2)
            ->assertJsonPath('data.stats.completed_tasks', 1)
            ->assertJsonPath('data.stats.pending_tasks', 1);
    }
}
