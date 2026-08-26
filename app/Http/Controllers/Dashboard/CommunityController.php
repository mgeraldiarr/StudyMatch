<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreThreadRequest;
use App\Models\Thread;
use App\Models\ThreadReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class CommunityController extends Controller
{
    /**
     * Display the community and discussion forums page.
     */
    public function index(Request $request): View|JsonResponse
    {
        $channels = [
            ['id' => 1, 'name' => 'Pemrograman', 'icon' => 'terminal', 'color' => 'purple', 'desc' => 'Python, JavaScript, C++, dan bahasa lain', 'members' => 2400],
            ['id' => 2, 'name' => 'Matematika', 'icon' => 'calculate', 'color' => 'teal', 'desc' => 'Aljabar, Kalkulus, Statistika', 'members' => 1900],
            ['id' => 3, 'name' => 'Sains', 'icon' => 'science', 'color' => 'purple', 'desc' => 'Fisika, Kimia, Biologi', 'members' => 1600],
            ['id' => 4, 'name' => 'Desain', 'icon' => 'palette', 'color' => 'teal', 'desc' => 'UI/UX, Grafis, Fotografi', 'members' => 840],
            ['id' => 5, 'name' => 'Bahasa', 'icon' => 'language', 'color' => 'purple', 'desc' => 'Inggris, Mandarin, Jepang', 'members' => 2100],
            ['id' => 6, 'name' => 'Humaniora', 'icon' => 'menu_book', 'color' => 'teal', 'desc' => 'Sejarah, Sastra, Filsafat', 'members' => 950],
        ];

        $threads = Thread::with('user')
            ->withCount('replies')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'channel' => $t->channel,
                    'title' => $t->title,
                    'excerpt' => $t->body,
                    'author' => $t->user->name ?? 'Mahasiswa',
                    'avatar' => $t->user->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
                    'time' => $t->created_at->diffForHumans(),
                    'votes' => $t->votes,
                    'replies' => $t->replies_count,
                    'views' => $t->views,
                    'solved' => (bool) $t->is_solved,
                    'pinned' => (bool) $t->is_pinned,
                ];
            });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'channels' => $channels,
                'threads' => $threads,
            ]);
        }

        return view('dashboard.community', [
            'channels' => $channels,
            'threads' => $threads,
        ]);
    }

    /**
     * Store a newly created thread in database.
     */
    public function store(StoreThreadRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $thread = Thread::create([
            'user_id' => Auth::id(), 
            'channel' => $validated['channel'],
            'title' => $validated['title'],
            'body' => $validated['body'],
            'votes' => 0,
            'views' => 1,
            'is_solved' => false,
            'is_pinned' => false,
        ]);

        $thread->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Thread berhasil dipublikasikan! 🎉',
            'thread' => [
                'id' => $thread->id,
                'channel' => $thread->channel,
                'title' => $thread->title,
                'excerpt' => $thread->body,
                'author' => $thread->user->name ?? 'Mahasiswa',
                'avatar' => $thread->user->avatar ?: '',
                'time' => 'Baru saja',
                'votes' => 0,
                'replies' => 0,
                'views' => 1,
                'solved' => false,
                'pinned' => false,
            ],
        ], 201);
    }

    /**
     * Display thread details and replies.
     */
    public function show(Thread $thread): JsonResponse
    {
        $thread->increment('views');
        $thread->load(['user', 'replies.user']);

        return response()->json([
            'success' => true,
            'thread' => [
                'id' => $thread->id,
                'channel' => $thread->channel,
                'title' => $thread->title,
                'body' => $thread->body,
                'author' => $thread->user->name ?? 'Mahasiswa',
                'avatar' => $thread->user->avatar ?: '',
                'time' => $thread->created_at->diffForHumans(),
                'votes' => $thread->votes,
                'views' => $thread->views,
                'solved' => (bool) $thread->is_solved,
                'pinned' => (bool) $thread->is_pinned,
                'replies' => $thread->replies->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'author' => $r->user->name ?? 'Mahasiswa',
                        'avatar' => $r->user->avatar ?: '',
                        'body' => $r->body,
                        'time' => $r->created_at->diffForHumans(),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Add a reply to a thread.
     */
    public function reply(Request $request, Thread $thread): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'min:2', 'max:2000'],
        ]);

        $reply = ThreadReply::create([
            'thread_id' => $thread->id,
            'user_id' => Auth::id(),
            'body' => $validated['body'],
        ]);

        $reply->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Balasan berhasil dikirim!',
            'reply' => [
                'id' => $reply->id,
                'author' => $reply->user->name ?? 'Mahasiswa',
                'avatar' => $reply->user->avatar ?: '',
                'body' => $reply->body,
                'time' => 'Baru saja',
            ],
        ], 201);
    }

    /**
     * Vote (upvote/downvote) on a thread.
     */
    public function vote(Request $request, Thread $thread): JsonResponse
    {
        $dir = $request->input('direction', 1) > 0 ? 1 : -1;
        $thread->increment('votes', $dir);

        return response()->json([
            'success' => true,
            'votes' => $thread->votes,
        ]);
    }
}
