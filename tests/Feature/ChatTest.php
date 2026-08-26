<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\MatchRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_chat_page_with_active_conversations(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $partner = User::factory()->create(['name' => 'Budi Santoso', 'is_profile_completed' => true]);

        MatchRequest::create([
            'sender_id' => $user->id,
            'receiver_id' => $partner->id,
            'status' => 'accepted',
        ]);

        $response = $this->actingAs($user)->get('/chat');

        $response->assertStatus(200);
        $response->assertSee('Budi Santoso');
    }

    public function test_user_can_fetch_messages_between_matched_partners(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $partner = User::factory()->create(['name' => 'Budi Santoso', 'is_profile_completed' => true]);

        Message::create([
            'sender_id' => $partner->id,
            'receiver_id' => $user->id,
            'message' => 'Halo dari Budi!',
            'is_read' => false,
        ]);

        $response = $this->actingAs($user)->getJson("/chat/messages/{$partner->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $messages = $response->json('messages');
        $this->assertCount(1, $messages);
        $this->assertEquals('Halo dari Budi!', $messages[0]['text']);
        $this->assertEquals('recv', $messages[0]['type']);

        // Message should be marked as read
        $this->assertDatabaseHas('messages', [
            'sender_id' => $partner->id,
            'receiver_id' => $user->id,
            'is_read' => true,
        ]);
    }

    public function test_user_can_send_message_to_matched_partner(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $partner = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($user)->postJson("/chat/messages/{$partner->id}", [
            'message' => 'Halo! Ini pesan tes dari user.',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
            'data' => [
                'from' => 'Me',
                'text' => 'Halo! Ini pesan tes dari user.',
                'type' => 'sent',
            ],
        ]);

        $this->assertDatabaseHas('messages', [
            'sender_id' => $user->id,
            'receiver_id' => $partner->id,
            'message' => 'Halo! Ini pesan tes dari user.',
        ]);
    }

    public function test_user_can_send_and_fetch_course_group_messages(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $course = Course::create(['name' => 'Kalkulus III']);
        $user->courses()->attach($course->id);

        $response = $this->actingAs($user)->postJson("/chat/group-messages/{$course->id}", [
            'message' => 'Halo teman-teman grup Kalkulus III!',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'sender_id' => $user->id,
            'course_id' => $course->id,
            'message' => 'Halo teman-teman grup Kalkulus III!',
        ]);

        $fetchResponse = $this->actingAs($user)->getJson("/chat/group-messages/{$course->id}");
        $fetchResponse->assertStatus(200);
        $fetchResponse->assertJson(['success' => true]);
        $this->assertCount(1, $fetchResponse->json('messages'));
    }

    public function test_user_can_clear_conversation(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $partner = User::factory()->create(['is_profile_completed' => true]);

        Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $partner->id,
            'message' => 'Pesan untuk dihapus',
        ]);

        $response = $this->actingAs($user)->deleteJson("/chat/conversations/{$partner->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('messages', [
            'sender_id' => $user->id,
            'receiver_id' => $partner->id,
        ]);
    }

    public function test_user_cannot_send_empty_message(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $partner = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($user)->postJson("/chat/messages/{$partner->id}", [
            'message' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['message']);
    }
}
