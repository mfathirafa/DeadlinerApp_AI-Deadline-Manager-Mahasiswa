<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_only_their_own_courses()
    {
        $user1 = User::create(['name' => 'User One', 'email' => 'one@example.com', 'password' => bcrypt('password')]);
        $user2 = User::create(['name' => 'User Two', 'email' => 'two@example.com', 'password' => bcrypt('password')]);

        Course::create([
            'user_id' => $user1->id,
            'name' => 'User One Course',
            'code' => 'CS101',
            'color' => '#ff0000',
        ]);

        Course::create([
            'user_id' => $user2->id,
            'name' => 'User Two Course',
            'code' => 'CS102',
            'color' => '#00ff00',
        ]);

        $response = $this->actingAs($user1, 'sanctum')->getJson('/api/courses');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.name', 'User One Course');
    }

    public function test_user_can_create_course()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/courses', [
            'name' => 'New Course',
            'code' => 'CS201',
            'color' => '#0000ff',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'New Course');

        $this->assertDatabaseHas('courses', [
            'name' => 'New Course',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_cannot_create_course_with_invalid_data()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/courses', [
            'name' => '',
            'code' => '',
            'color' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'code', 'color']);
    }

    public function test_user_can_update_course()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $course = Course::create([
            'user_id' => $user->id,
            'name' => 'Old Course Name',
            'code' => 'CS101',
            'color' => '#fff',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/courses/{$course->id}", [
            'name' => 'Updated Course Name',
            'code' => 'CS101-UPD',
            'color' => '#000',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('name', 'Updated Course Name')
            ->assertJsonPath('code', 'CS101-UPD')
            ->assertJsonPath('color', '#000');
    }

    public function test_user_can_delete_course()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $course = Course::create([
            'user_id' => $user->id,
            'name' => 'Delete Me',
            'code' => 'CS999',
            'color' => '#f00',
        ]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/courses/{$course->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('courses', [
            'id' => $course->id,
        ]);
    }
}
