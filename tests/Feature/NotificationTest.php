<?php

namespace Tests\Feature;

use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_incoming_match_requests_in_notifications(): void
    {
        $receiver = User::factory()->create(['is_profile_completed' => true]);
        $sender = User::factory()->create([
            'name' => 'Anisa Rahmawati',
            'university' => 'Universitas Indonesia',
            'is_profile_completed' => true,
        ]);

        MatchRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Yuk belajar Kalkulus bareng!',
        ]);

        $response = $this->actingAs($receiver)->get('/notification');

        $response->assertStatus(200);
        $response->assertSee('Anisa Rahmawati');
        $response->assertSee('Yuk belajar Kalkulus bareng!');
        $response->assertSee('Terima');
        $response->assertSee('Tolak');
    }

    public function test_user_can_accept_incoming_match_request(): void
    {
        $receiver = User::factory()->create(['is_profile_completed' => true]);
        $sender = User::factory()->create(['name' => 'Budi Santoso', 'is_profile_completed' => true]);

        $matchRequest = MatchRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Belajar bareng yuk!',
        ]);

        $response = $this->actingAs($receiver)->postJson("/match-requests/{$matchRequest->id}/accept");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $matchRequest->refresh();
        $this->assertEquals('accepted', $matchRequest->status);
    }

    public function test_user_can_decline_incoming_match_request(): void
    {
        $receiver = User::factory()->create(['is_profile_completed' => true]);
        $sender = User::factory()->create(['name' => 'Budi Santoso', 'is_profile_completed' => true]);

        $matchRequest = MatchRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Belajar bareng yuk!',
        ]);

        $response = $this->actingAs($receiver)->postJson("/match-requests/{$matchRequest->id}/decline");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $matchRequest->refresh();
        $this->assertEquals('rejected', $matchRequest->status);
    }

    public function test_user_cannot_accept_match_request_addressed_to_someone_else(): void
    {
        $receiver = User::factory()->create(['is_profile_completed' => true]);
        $attacker = User::factory()->create(['is_profile_completed' => true]);
        $sender = User::factory()->create(['name' => 'Budi Santoso', 'is_profile_completed' => true]);

        $matchRequest = MatchRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Belajar bareng yuk!',
        ]);

        $response = $this->actingAs($attacker)->postJson("/match-requests/{$matchRequest->id}/accept");

        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
        ]);

        $matchRequest->refresh();
        $this->assertEquals('pending', $matchRequest->status);
    }
}
