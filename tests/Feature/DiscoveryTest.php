<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_discovery_page_with_candidates(): void
    {
        $user = User::factory()->create([
            'university' => 'Universitas Indonesia',
            'major' => 'Teknik Informatika',
            'learning_style' => 'visual',
            'is_profile_completed' => true,
        ]);

        $candidate1 = User::factory()->create([
            'name' => 'Anisa Rahmawati',
            'university' => 'Universitas Indonesia',
            'major' => 'Ilmu Komputer',
            'learning_style' => 'visual',
            'is_profile_completed' => true,
        ]);

        $candidate2 = User::factory()->create([
            'name' => 'Budi Santoso',
            'university' => 'ITB',
            'major' => 'Teknik Mesin',
            'learning_style' => 'kinesthetic',
            'is_profile_completed' => true,
        ]);

        $response = $this->actingAs($user)->get('/discovery');

        $response->assertStatus(200);
        $response->assertSee('Anisa Rahmawati');
        $response->assertSee('Budi Santoso');
        $response->assertDontSee($user->name . ' · '); // Should not list self as candidate
    }

    public function test_discovery_candidates_json_endpoint_returns_calculated_compatibility(): void
    {
        $course1 = Course::create(['name' => 'Struktur Data & Algoritma']);
        $course2 = Course::create(['name' => 'Kalkulus III']);

        $user = User::factory()->create([
            'university' => 'Universitas Indonesia',
            'learning_style' => 'visual',
            'is_profile_completed' => true,
        ]);
        $user->courses()->attach([$course1->id, $course2->id]);

        $candidate = User::factory()->create([
            'name' => 'Anisa Rahmawati',
            'university' => 'Universitas Indonesia',
            'learning_style' => 'visual',
            'is_profile_completed' => true,
        ]);
        $candidate->courses()->attach([$course1->id]);

        $response = $this->actingAs($user)->getJson('/discovery/candidates');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $candidates = $response->json('candidates');
        $this->assertNotEmpty($candidates);
        $this->assertEquals('Anisa Rahmawati', $candidates[0]['name']);
        $this->assertGreaterThanOrEqual(70, $candidates[0]['compat']);
    }

    public function test_user_can_send_match_request_to_candidate(): void
    {
        $sender = User::factory()->create(['is_profile_completed' => true]);
        $receiver = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($sender)->postJson('/match-requests/' . $receiver->id, [
            'message' => 'Hai! Mau belajar bareng untuk persiapan ujian?',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('match_requests', [
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Hai! Mau belajar bareng untuk persiapan ujian?',
        ]);
    }

    public function test_user_cannot_send_match_request_to_self(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($user)->postJson('/match-requests/' . $user->id, [
            'message' => 'Halo diri sendiri',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }
}
