<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\MatchRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ChatController extends Controller
{
    /**
     * Determine whether the given user is enrolled in the given course.
     */
    private function userBelongsToCourse(User $user, Course $course): bool
    {
        return $course->users()->where('users.id', $user->id)->exists();
    }

    /**
     * Determine whether the two users have an accepted match with each other.
     */
    private function usersHaveAcceptedMatch(User $a, User $b): bool
    {
        return MatchRequest::where('status', 'accepted')
            ->where(function ($query) use ($a, $b) {
                $query->where('sender_id', $a->id)->where('receiver_id', $b->id);
            })
            ->orWhere(function ($query) use ($a, $b) {
                $query->where('sender_id', $b->id)->where('receiver_id', $a->id);
            })
            ->exists();
    }

    /**
     * Display the chat and messaging page.
     */
    public function index(Request $request): View|JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // 1. Group Chats based on user's enrolled courses
        $currentUser->load(['courses' => function ($query) {
            $query->withCount('users');
        }]);
        $conversations = [];

        foreach ($currentUser->courses as $course) {
            $lastGroupMsg = Message::where('course_id', $course->id)
                ->with('sender')
                ->latest()
                ->first();

            $conversations[] = [
                'id' => 'group_' . $course->id,
                'target_id' => $course->id,
                'type' => 'group',
                'icon' => 'school',
                'color' => 'purple',
                'name' => $course->name,
                'description' => $course->description,
                'lastMsg' => $lastGroupMsg ? ($lastGroupMsg->sender->name . ': ' . $lastGroupMsg->message) : 'Mulai diskusi grup mata kuliah!',
                'time' => $lastGroupMsg ? $lastGroupMsg->created_at->diffForHumans(null, true) : '',
                'online' => (int) $course->users_count,
                'active' => false,
            ];
        }

        // 2. Direct Message Partners (Accepted Match Requests - Deduplicated)
        $acceptedMatches = MatchRequest::where('status', 'accepted')
            ->where(function ($query) use ($currentUser) {
                $query->where('sender_id', $currentUser->id)
                    ->orWhere('receiver_id', $currentUser->id);
            })
            ->with(['sender', 'receiver'])
            ->get();

        $seenPartnerIds = [];
        foreach ($acceptedMatches as $match) {
            $partner = $match->sender_id === $currentUser->id ? $match->receiver : $match->sender;
            if (!$partner || in_array($partner->id, $seenPartnerIds)) {
                continue;
            }
            $seenPartnerIds[] = $partner->id;

            $lastMsg = Message::where(function ($q) use ($currentUser, $partner) {
                $q->where('sender_id', $currentUser->id)->where('receiver_id', $partner->id);
            })->orWhere(function ($q) use ($currentUser, $partner) {
                $q->where('sender_id', $partner->id)->where('receiver_id', $currentUser->id);
            })->latest()->first();

            $conversations[] = [
                'id' => $partner->id,
                'target_id' => $partner->id,
                'type' => 'dm',
                'avatar' => $partner->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
                'name' => $partner->name,
                'university' => $partner->university ?: 'Universitas Indonesia',
                'lastMsg' => $lastMsg ? $lastMsg->message : 'Mulai percakapan dengan teman belajarmu!',
                'time' => $lastMsg ? $lastMsg->created_at->diffForHumans(null, true) : '',
                'online' => (bool) $partner->is_online,
                'active' => false,
            ];
        }

        // Set first conversation as active if exists
        if (!empty($conversations)) {
            $conversations[0]['active'] = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'conversations' => $conversations,
            ]);
        }

        return view('dashboard.chat', [
            'conversations' => $conversations,
            'currentUser' => $currentUser,
        ]);
    }

    /**
     * Get message history with a specific user (DM).
     */
    public function getMessages(Request $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // Mark incoming messages as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
        })
        ->with('sender')
        ->orderBy('created_at', 'asc')
        ->get();

        $formatted = $messages->map(function ($m) use ($currentUser) {
            return [
                'id' => $m->id,
                'from' => $m->sender_id === $currentUser->id ? 'Me' : ($m->sender->name ?? 'Teman'),
                'avatar' => $m->sender->avatar ?? '',
                'text' => $m->message,
                'time' => $m->created_at->format('H:i'),
                'type' => $m->sender_id === $currentUser->id ? 'sent' : 'recv',
                'media' => $m->attachment_path ? [
                    'url' => asset('storage/' . $m->attachment_path),
                    'type' => $m->attachment_type,
                    'name' => $m->attachment_name,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'messages' => $formatted,
            'partner' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'is_online' => $user->is_online,
            ],
        ]);
    }

    /**
     * Send a direct message to a user (DM).
     */
    public function sendMessage(Request $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'sender_id' => $currentUser->id,
            'receiver_id' => $user->id,
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan terkirim',
            'data' => [
                'id' => $message->id,
                'from' => 'Me',
                'avatar' => $currentUser->avatar,
                'text' => $message->message,
                'time' => $message->created_at->format('H:i'),
                'type' => 'sent',
            ],
        ], 201);
    }

    /**
     * Get messages in a course group chat.
     */
    public function getGroupMessages(Request $request, Course $course): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $messages = Message::where('course_id', $course->id)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        $formatted = $messages->map(function ($m) use ($currentUser) {
            return [
                'id' => $m->id,
                'from' => $m->sender_id === $currentUser->id ? 'Me' : ($m->sender->name ?? 'Mahasiswa'),
                'avatar' => $m->sender->avatar ?? '',
                'text' => $m->message,
                'time' => $m->created_at->format('H:i'),
                'type' => $m->sender_id === $currentUser->id ? 'sent' : 'recv',
                'media' => $m->attachment_path ? [
                    'url' => asset('storage/' . $m->attachment_path),
                    'type' => $m->attachment_type,
                    'name' => $m->attachment_name,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'messages' => $formatted,
            'group' => [
                'id' => $course->id,
                'name' => $course->name,
                'members_count' => $course->users()->count(),
            ],
        ]);
    }

    /**
     * Send a message to a course group chat.
     */
    public function sendGroupMessage(Request $request, Course $course): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'sender_id' => $currentUser->id,
            'course_id' => $course->id,
            'message' => $validated['message'],
            'is_read' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan grup terkirim',
            'data' => [
                'id' => $message->id,
                'from' => 'Me',
                'avatar' => $currentUser->avatar,
                'text' => $message->message,
                'time' => $message->created_at->format('H:i'),
                'type' => 'sent',
            ],
        ], 201);
    }

    /**
     * Clear message history between the current user and a contact.
     */
    public function clearConversation(Request $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        Message::where(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
        })->delete();

        return response()->json([
            'success' => true,
            'message' => "Riwayat percakapan dengan {$user->name} berhasil dihapus.",
        ]);
    }

    /**
     * Remove partner connection and clear conversation.
     */
    public function removePartner(Request $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        MatchRequest::where(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
        })->delete();

        Message::where(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($currentUser, $user) {
            $q->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
        })->delete();

        return response()->json([
            'success' => true,
            'message' => "Kontak {$user->name} berhasil dihapus dari daftar pesan.",
        ]);
    }

    /**
     * Leave a course group chat.
     */
    public function leaveGroup(Request $request, Course $course): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        if (!$this->userBelongsToCourse($currentUser, $course)) {
            return response()->json(['success' => false, 'message' => 'Anda bukan anggota grup ini'], 403);
        }

        $course->users()->detach($currentUser->id);

        return response()->json([
            'success' => true,
            'message' => "Anda telah keluar dari grup {$course->name}.",
        ]);
    }

    /**
     * Update group course information.
     */
    public function updateGroupInfo(Request $request, Course $course): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        if (!$this->userBelongsToCourse($currentUser, $course)) {
            return response()->json(['success' => false, 'message' => 'Anda bukan anggota grup ini'], 403);
        }

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        if (isset($validated['name'])) {
            $course->name = $validated['name'];
        }
        if (isset($validated['description'])) {
            $course->description = $validated['description'];
        }

        $course->save();

        return response()->json([
            'success' => true,
            'message' => 'Informasi grup berhasil diperbarui',
            'data' => [
                'id' => $course->id,
                'name' => $course->name,
                'description' => $course->description,
            ],
        ]);
    }

    /**
     * Upload media (document, image, video) to the chat.
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240'], // Max 10MB
            'type' => ['required', 'string', 'in:image,video,document'],
            'receiver_id' => ['nullable', 'exists:users,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
        ]);

        if (!$request->receiver_id && !$request->course_id) {
            return response()->json(['success' => false, 'message' => 'Target penerima tidak valid'], 400);
        }

        /** @var User $currentUser */
        $currentUser = Auth::user();

        if ($request->receiver_id) {
            $receiver = User::findOrFail($request->receiver_id);
            if (!$this->usersHaveAcceptedMatch($currentUser, $receiver)) {
                return response()->json(['success' => false, 'message' => 'Anda tidak terhubung dengan pengguna ini'], 403);
            }
        }

        if ($request->course_id) {
            $course = Course::findOrFail($request->course_id);
            if (!$this->userBelongsToCourse($currentUser, $course)) {
                return response()->json(['success' => false, 'message' => 'Anda bukan anggota grup ini'], 403);
            }
        }

        $file = $request->file('file');
        $path = $file->store('chat_media', 'public');

        $message = Message::create([
            'sender_id' => $currentUser->id,
            'receiver_id' => $request->receiver_id,
            'course_id' => $request->course_id,
            'message' => 'Berkas Dilampirkan',
            'is_read' => $request->course_id ? true : false,
            'attachment_path' => $path,
            'attachment_type' => $request->type,
            'attachment_name' => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berkas berhasil diunggah',
            'data' => [
                'id' => $message->id,
                'from' => 'Me',
                'avatar' => $currentUser->avatar,
                'text' => $message->message,
                'time' => $message->created_at->format('H:i'),
                'type' => 'sent',
                'media' => [
                    'url' => asset('storage/' . $path),
                    'type' => $request->type,
                    'name' => $file->getClientOriginalName(),
                ]
            ],
        ], 201);
    }
}
