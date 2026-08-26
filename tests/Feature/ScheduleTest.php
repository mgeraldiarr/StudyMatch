<?php

namespace Tests\Feature;

use App\Models\StudySession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_schedule_page(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);

        StudySession::create([
            'user_id' => $user->id,
            'title' => 'Belajar Kalkulus Lanjut',
            'date' => '2026-08-25',
            'time' => '14:00',
            'duration' => 60,
        ]);

        $response = $this->actingAs($user)->get('/schedule');

        $response->assertStatus(200);
        $response->assertSee('Belajar Kalkulus Lanjut');
    }

    public function test_user_can_create_study_session(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($user)->postJson('/schedule/sessions', [
            'title' => 'Diskusi Machine Learning',
            'date' => '2026-08-28',
            'time' => '19:30',
            'duration' => 90,
            'meeting_link' => 'https://meet.google.com/xyz-123',
            'participants' => ['Alya', 'Budi'],
        ]);

        $response->assertStatus(201);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('study_sessions', [
            'user_id' => $user->id,
            'title' => 'Diskusi Machine Learning',
            'date' => '2026-08-28',
            'time' => '19:30',
        ]);
    }

    public function test_user_can_delete_own_study_session(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $session = StudySession::create([
            'user_id' => $user->id,
            'title' => 'Sesi untuk dihapus',
            'date' => '2026-08-28',
            'time' => '10:00',
            'duration' => 60,
        ]);

        $response = $this->actingAs($user)->deleteJson("/schedule/sessions/{$session->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('study_sessions', [
            'id' => $session->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_study_session(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $otherUser = User::factory()->create(['is_profile_completed' => true]);

        $session = StudySession::create([
            'user_id' => $otherUser->id,
            'title' => 'Sesi milik orang lain',
            'date' => '2026-08-28',
            'time' => '10:00',
            'duration' => 60,
        ]);

        $response = $this->actingAs($user)->deleteJson("/schedule/sessions/{$session->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('study_sessions', [
            'id' => $session->id,
        ]);
    }
}
