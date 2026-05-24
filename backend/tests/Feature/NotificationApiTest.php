<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_fetch_notifications()
    {
        $user1 = User::create(['name' => 'User One', 'email' => 'one@example.com', 'password' => bcrypt('password')]);
        $user2 = User::create(['name' => 'User Two', 'email' => 'two@example.com', 'password' => bcrypt('password')]);

        // Create a notification for user 1
        $user1->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'User One Task Reminder']),
            'read_at' => null,
        ]);

        // Create a notification for user 2
        $user2->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'User Two Task Reminder']),
            'read_at' => null,
        ]);

        $response = $this->actingAs($user1, 'sanctum')->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.data.task_title', 'User One Task Reminder');
    }

    public function test_user_can_mark_notification_as_read_via_url_param()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $notificationId = Str::uuid()->toString();

        $user->notifications()->create([
            'id' => $notificationId,
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'Test Reminder']),
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/notifications/{$notificationId}/read");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Notification marked as read.');

        $this->assertNotNull($user->fresh()->notifications()->find($notificationId)->read_at);
    }

    public function test_user_can_mark_notification_as_read_via_body()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);
        $notificationId = Str::uuid()->toString();

        $user->notifications()->create([
            'id' => $notificationId,
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'Test Reminder']),
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/notifications/read", [
            'id' => $notificationId
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Notification marked as read.');

        $this->assertNotNull($user->fresh()->notifications()->find($notificationId)->read_at);
    }

    public function test_user_can_mark_all_notifications_as_read()
    {
        $user = User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')]);

        $user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'Reminder 1']),
            'read_at' => null,
        ]);

        $user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\TaskReminder',
            'data' => json_encode(['task_title' => 'Reminder 2']),
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/notifications/read-all");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'All notifications marked as read.');

        $this->assertEquals(0, $user->fresh()->unreadNotifications()->count());
    }
}
