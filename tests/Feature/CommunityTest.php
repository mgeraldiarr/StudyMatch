<?php

namespace Tests\Feature;

use App\Models\Thread;
use App\Models\ThreadReply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_community_page(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);

        $thread = Thread::create([
            'user_id' => $user->id,
            'channel' => 'Pemrograman',
            'title' => 'Diskusi Laravel 12',
            'body' => 'Bagaimana performa Laravel 12 di environment production?',
        ]);

        $response = $this->actingAs($user)->get('/community');

        $response->assertStatus(200);
        $response->assertSee('Diskusi Laravel 12');
    }

    public function test_user_can_create_new_thread(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);

        $response = $this->actingAs($user)->postJson('/community/threads', [
            'channel' => 'Matematika',
            'title' => 'Tutorial Integral Lipat Tiga',
            'body' => 'Berikut adalah panduan langkah demi langkah menghitung integral lipat tiga.',
        ]);

        $response->assertStatus(201);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('threads', [
            'user_id' => $user->id,
            'channel' => 'Matematika',
            'title' => 'Tutorial Integral Lipat Tiga',
        ]);
    }

    public function test_user_can_view_thread_and_post_reply(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $author = User::factory()->create(['is_profile_completed' => true]);

        $thread = Thread::create([
            'user_id' => $author->id,
            'channel' => 'Sains',
            'title' => 'Fisika Kuantum Dasar',
            'body' => 'Mari berdiskusi tentang dualitas partikel gelombang.',
        ]);

        $showResponse = $this->actingAs($user)->getJson("/community/threads/{$thread->id}");
        $showResponse->assertStatus(200);
        $showResponse->assertJson(['success' => true]);

        $replyResponse = $this->actingAs($user)->postJson("/community/threads/{$thread->id}/replies", [
            'body' => 'Penjelasan yang sangat menarik, terima kasih!',
        ]);

        $replyResponse->assertStatus(201);
        $replyResponse->assertJson(['success' => true]);

        $this->assertDatabaseHas('thread_replies', [
            'thread_id' => $thread->id,
            'user_id' => $user->id,
            'body' => 'Penjelasan yang sangat menarik, terima kasih!',
        ]);
    }

    public function test_user_can_vote_on_thread(): void
    {
        $user = User::factory()->create(['is_profile_completed' => true]);
        $thread = Thread::create([
            'user_id' => $user->id,
            'channel' => 'Desain',
            'title' => 'Prinsip Desain UI Modern',
            'body' => 'Typography dan hierarchy adalah kunci desain yang bersih.',
            'votes' => 5,
        ]);

        $response = $this->actingAs($user)->postJson("/community/threads/{$thread->id}/vote", [
            'direction' => 1,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['votes' => 6]);
    }
}
