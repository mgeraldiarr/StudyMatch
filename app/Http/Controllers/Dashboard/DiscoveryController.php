<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MatchRequest;
use App\Models\User;
use App\Services\MatchmakingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DiscoveryController extends Controller
{
    public function __construct(
        protected MatchmakingService $matchmakingService
    ) {}

    /**
     * Display the discovery dashboard page with candidate matches.
     */
    public function index(Request $request): View|JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $candidates = $this->matchmakingService->getMatchesForUser($currentUser);
        $stats = $this->matchmakingService->getMatchStats($candidates);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'candidates' => $candidates,
                'stats' => $stats,
            ]);
        }

        return view('dashboard.discovery', [
            'candidates' => $candidates,
            'stats' => $stats,
        ]);
    }

    /**
     * JSON API to fetch candidates with filters and sorting.
     */
    public function candidates(Request $request): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $candidates = $this->matchmakingService->getMatchesForUser($currentUser);
        $stats = $this->matchmakingService->getMatchStats($candidates);

        return response()->json([
            'success' => true,
            'candidates' => $candidates,
            'stats' => $stats,
        ]);
    }

    /**
     * Send a match request / study invite to a candidate.
     */
    public function sendInvite(Request $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu tidak dapat mengirim ajakan belajar ke dirimu sendiri.',
            ], 422);
        }

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        $existingRequest = MatchRequest::where('sender_id', $currentUser->id)
            ->where('receiver_id', $user->id)
            ->first();

        if ($existingRequest && $existingRequest->status === 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Kamu sudah mengirim undangan belajar ke ' . $user->name . '. Mohon tunggu responnya.',
            ], 422);
        }

        $matchRequest = MatchRequest::updateOrCreate(
            ['sender_id' => $currentUser->id, 'receiver_id' => $user->id],
            [
                'status' => 'pending',
                'message' => $validated['message'] ?? 'Hai! Mau belajar bareng di StudyMatch?',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Undangan belajar berhasil dikirim ke ' . $user->name . '! 🎉',
            'match_request' => $matchRequest,
        ]);
    }
}
