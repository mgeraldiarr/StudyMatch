<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's academic profile page.
     */
    public function index(): View
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load('courses');

        return view('dashboard.user-profile', [
            'user' => $user,
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'university' => ['required', 'string', 'max:255'],
            'major' => ['required', 'string', 'max:255'],
            'academic_year' => ['nullable', 'string', 'max:50'],
            'academic_status' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'learning_style' => ['required', 'string', 'in:visual,auditory,kinesthetic,reading'],
            'courses' => ['nullable', 'array'],
        ]);

        $courseNames = $validated['courses'] ?? [];
        unset($validated['courses']);

        $user->update($validated);

        if (!empty($courseNames)) {
            $courseIds = [];
            foreach ($courseNames as $courseName) {
                $trimmed = trim($courseName);
                if (!empty($trimmed)) {
                    $course = Course::firstOrCreate(['name' => $trimmed]);
                    $courseIds[] = $course->id;
                }
            }
            $user->courses()->sync($courseIds);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil akademik berhasil diperbarui! 🎉',
            'user' => $user->fresh(['courses']),
        ]);
    }
}
