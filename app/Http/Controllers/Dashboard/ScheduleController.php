<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\StudySession;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ScheduleController extends Controller
{
    /**
     * Display the study schedule and calendar page.
     */
    public function index(Request $request): View|JsonResponse
    {
        $userId = Auth::id();
        $todayStr = now()->format('Y-m-d');

        $sessions = StudySession::where('user_id', $userId)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->title,
                    'date' => $s->date,
                    'time' => $s->time,
                    'duration' => $s->duration,
                    'participants' => $s->participants ?? ['Partner Belajar'],
                    'avatars' => [],
                    'meet' => !empty($s->meeting_link),
                    'meetLink' => $s->meeting_link ?: '',
                    'location' => $s->location ?: '',
                ];
            });

        // Derive recaps from past completed sessions (empty for fresh new accounts)
        $recaps = StudySession::where('user_id', $userId)
            ->where('date', '<', $todayStr)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'tag' => 'Sesi Belajar',
                    'tagColor' => 'secondary',
                    'date' => Carbon::parse($s->date)->diffForHumans(),
                    'title' => $s->title,
                    'desc' => 'Sesi belajar bersama partner (' . $s->duration . ' menit).',
                    'file' => 'Catatan_Sesi_' . $s->id . '.pdf',
                ];
            });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'sessions' => $sessions,
                'recaps' => $recaps,
            ]);
        }

        return view('dashboard.schedule', [
            'sessions' => $sessions,
            'recaps' => $recaps,
        ]);
    }

    /**
     * Store a newly created study session in database.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'date' => ['required', 'date'],
            'time' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:15', 'max:480'],
            'location' => ['nullable', 'string', 'max:255'],
            'meeting_link' => ['nullable', 'url', 'max:255'],
            'participants' => ['nullable', 'array'],
        ]);

        $session = StudySession::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'duration' => $validated['duration'],
            'location' => $validated['location'] ?? null,
            'meeting_link' => $validated['meeting_link'] ?? null,
            'participants' => $validated['participants'] ?? ['Partner Belajar'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sesi belajar berhasil dijadwalkan! 📅',
            'session' => [
                'id' => $session->id,
                'name' => $session->title,
                'date' => $session->date,
                'time' => $session->time,
                'duration' => $session->duration,
                'participants' => $session->participants ?? ['Partner Belajar'],
                'avatars' => [],
                'meet' => !empty($session->meeting_link),
                'meetLink' => $session->meeting_link ?: '',
                'location' => $session->location ?: '',
            ],
        ], 201);
    }

    /**
     * Delete a study session.
     */
    public function destroy(StudySession $session): JsonResponse
    {
        if ($session->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu tidak memiliki izin untuk menghapus sesi ini.',
            ], 403);
        }

        $session->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesi belajar berhasil dihapus.',
        ]);
    }
}
