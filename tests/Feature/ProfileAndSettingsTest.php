<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileAndSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_profile_page(): void
    {
        $user = User::factory()->create([
            'name' => 'Alya Ramadhani',
            'university' => 'Universitas Indonesia',
            'major' => 'Teknik Informatika',
            'is_profile_completed' => true,
        ]);

        $response = $this->actingAs($user)->get('/user-profile');

        $response->assertStatus(200);
        $response->assertSee('Alya Ramadhani');
        $response->assertSee('Universitas Indonesia');
        $response->assertSee('Teknik Informatika');
    }

    public function test_user_can_update_profile_and_courses(): void
    {
        $user = User::factory()->create([
            'name' => 'Alya Ramadhani',
            'is_profile_completed' => true,
        ]);

        $response = $this->actingAs($user)->postJson('/profile', [
            'name' => 'Alya Ramadhani S.Kom',
            'university' => 'Institut Teknologi Bandung',
            'major' => 'Sistem Informasi',
            'learning_style' => 'auditory',
            'courses' => ['Kalkulus III', 'Basis Data Terdistribusi'],
            'bio' => 'Senang berdiskusi algoritma dan desain sistem.',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Alya Ramadhani S.Kom',
            'university' => 'Institut Teknologi Bandung',
            'major' => 'Sistem Informasi',
            'learning_style' => 'auditory',
            'bio' => 'Senang berdiskusi algoritma dan desain sistem.',
        ]);

        $this->assertDatabaseHas('courses', ['name' => 'Kalkulus III']);
        $this->assertDatabaseHas('courses', ['name' => 'Basis Data Terdistribusi']);
    }

    public function test_user_can_update_account_settings_and_password(): void
    {
        $user = User::factory()->create([
            'email' => 'old_email@example.com',
            'is_profile_completed' => true,
        ]);

        $response = $this->actingAs($user)->postJson('/settings/account', [
            'email' => 'new_email@example.com',
            'academic_status' => 'Mahasiswa Pascasarjana (S2/S3)',
            'password' => 'newpassword123',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $user->refresh();
        $this->assertEquals('new_email@example.com', $user->email);
        $this->assertEquals('Mahasiswa Pascasarjana (S2/S3)', $user->academic_status);
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_user_can_toggle_online_privacy_status(): void
    {
        $user = User::factory()->create([
            'is_online' => false,
            'is_profile_completed' => true,
        ]);

        $response = $this->actingAs($user)->postJson('/settings/privacy', [
            'is_online' => true,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true, 'is_online' => true]);

        $user->refresh();
        $this->assertTrue((bool) $user->is_online);
    }
}
