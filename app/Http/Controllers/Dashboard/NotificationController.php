<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Illuminate\Support\Facades\Gate;

class NotificationController extends Controller
{
    /**
     * Display notifications and incoming match requests.
     */
    public function index(Request $request): View|JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Get incoming match requests
        $incomingRequests = MatchRequest::where('receiver_id', $user->id)
            ->with(['sender.courses'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get sent match requests
        $sentRequests = MatchRequest::where('sender_id', $user->id)
            ->with(['receiver.courses'])
            ->orderBy('created_at', 'desc')
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'incoming' => $incomingRequests,
                'sent' => $sentRequests,
            ]);
        }

        return view('dashboard.notification', [
            'incomingRequests' => $incomingRequests,
            'sentRequests' => $sentRequests,
        ]);
    }

    /**
     * Accept an incoming match request.
     */
    public function accept(Request $request, MatchRequest $matchRequest): JsonResponse
    {
        // ototisasi otomatis via MatchRequestPolicy
        Gate::authorize('update', $matchRequest);

        $matchRequest->update(['status' => 'accepted']);
        $senderName = $matchRequest->sender->name ?? 'Teman Belajar';

        return response()->json([
            'success' => true,
            'message' => "Permintaan belajar dari {$senderName} berhasil diterima!",
            'match_request' => $matchRequest,
        ]);
    }

    /**
     * Decline an incoming match request.
     */
    public function decline(Request $request, MatchRequest $matchRequest): JsonResponse
    {
        // otorisasi otomatis via MatchRequestPolicy
        Gate::authorize('update', $matchRequest);

        $matchRequest->update(['status' => 'rejected']);
        $senderName = $matchRequest->sender->name ?? 'Teman Belajar';

        return response()->json([
            'success' => true,
            'message' => "Permintaan belajar dari {$senderName} telah ditolak.",
            'match_request' => $matchRequest,
        ]);
    }
}
