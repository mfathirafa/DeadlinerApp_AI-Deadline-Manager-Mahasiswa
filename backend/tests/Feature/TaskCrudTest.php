<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_only_their_own_tasks()
    {
        $user1 = User::create(['name' => 'User One', 'email' => 'one@example.com', 'password' => bcrypt('password')]);
        $user2 = User::create(['name' => 'User Two', 'email' => 'two@example.com', 'password' => bcrypt('password')]);

        Task::create([
            'user_id' => $user1->id,
            'title' => 'User One Task',
            'deadline' => now()->addDays(2),
            'priority' => 'high',
            'status' => 'pending',
            'progress' => 0
        ]);

        Task::create([
            'user_id' => $user2->id,
            'title' => 'User Two Task',
            'deadline' => now()->addDays(3),
            'priority' => 'medium',
            'status' => 'pending',
            'progress' => 0
        ]);

        // Access as User One
        $response = $this->actingAs($user1, 'sanctum')->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'User One Task');
    }

    public function test_user_can_create_task()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $course = Course::create(['user_id' => $user->id, 'name' => 'CS101', 'code' => 'CS101', 'color' => '#fff']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tasks', [
            'title' => 'New Task Title',
            'description' => 'Description here',
            'course_id' => $course->id,
            'priority' => 'high',
            'deadline' => now()->addDays(5)->toIso8601String(),
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'New Task Title');

        $this->assertDatabaseHas('tasks', ['title' => 'New Task Title', 'user_id' => $user->id]);
    }

    public function test_user_can_update_task()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Old Title',
            'deadline' => now()->addDays(2),
            'priority' => 'medium',
            'status' => 'pending',
            'progress' => 10
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated Title',
            'progress' => 50,
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Title')
            ->assertJsonPath('data.progress', 50);
    }

    public function test_user_can_patch_task_status()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Task',
            'deadline' => now()->addDays(2),
            'priority' => 'medium',
            'status' => 'pending',
            'progress' => 0
        ]);

        $response = $this->actingAs($user, 'sanctum')->patchJson("/api/tasks/{$task->id}/status", [
            'status' => 'completed',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.progress', 100);
    }

    public function test_user_can_run_ai_task_analysis()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Task Title',
            'deadline' => now()->addDays(2),
            'priority' => 'critical',
            'status' => 'pending',
            'progress' => 0
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/tasks/{$task->id}/analyze");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['ai_analysis']]);

        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
        $this->assertNotNull(Task::find($task->id)->ai_analysis);
    }
}
