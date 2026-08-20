<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_accessing_dashboard(): void
    {
        $response = $this->get('/discovery');

        $response->assertRedirect('/login');
    }

    public function test_user_can_view_login_page(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertSee('StudyMatch');
    }

    public function test_user_can_register_via_json_request(): void
    {
        $response = $this->postJson('/register', [
            'name' => 'Budi Pratama',
            'email' => 'budi.pratama@ui.ac.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
            'redirect' => route('auth.setup-profile'),
        ]);

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'budi.pratama@ui.ac.id',
            'name' => 'Budi Pratama',
        ]);
    }

    public function test_user_cannot_register_with_existing_email(): void
    {
        User::factory()->create([
            'email' => 'existing@ui.ac.id',
        ]);

        $response = $this->postJson('/register', [
            'name' => 'Duplicate User',
            'email' => 'existing@ui.ac.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'student@ui.ac.id',
            'password' => bcrypt('secret123'),
            'is_profile_completed' => true,
        ]);

        $response = $this->postJson('/login', [
            'email' => 'student@ui.ac.id',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'redirect' => route('dashboard.discovery'),
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'student@ui.ac.id',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/login', [
            'email' => 'student@ui.ac.id',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);

        $this->assertGuest();
    }

    public function test_authenticated_user_can_complete_profile_setup(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'is_profile_completed' => false,
        ]);

        $avatarFile = UploadedFile::fake()->create('profile.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->post('/setup-profile', [
            'name' => 'Budi Pratama',
            'university' => 'Universitas Indonesia',
            'major' => 'Teknik Informatika',
            'bio' => 'Belajar coding bareng.',
            'learning_style' => 'visual',
            'avatar' => $avatarFile,
            'courses' => ['Kalkulus III', 'Machine Learning'],
            'goals' => ['Persiapan ujian'],
            'weekly_availability' => [
                'sen' => ['morning'],
            ],
        ], ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'redirect' => route('dashboard.discovery'),
        ]);

        $user->refresh();
        $this->assertTrue($user->is_profile_completed);
        $this->assertEquals('Universitas Indonesia', $user->university);
        $this->assertCount(2, $user->courses);
        $this->assertStringStartsWith('/storage/avatars/', $user->avatar);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }
}
