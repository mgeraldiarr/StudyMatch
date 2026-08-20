<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class SettingsController extends Controller
{
    /**
     * Display account settings and privacy preferences page.
     */
    public function index(): View
    {
        /** @var User $user */
        $user = Auth::user();

        return view('dashboard.settings', [
            'user' => $user,
        ]);
    }

    /**
     * Update account settings (email, academic status, password).
     */
    public function updateAccount(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'academic_status' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $updateData = [
            'email' => $validated['email'],
            'academic_status' => $validated['academic_status'] ?? $user->academic_status,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan akun berhasil disimpan! ✓',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Update privacy preferences (is_online visibility).
     */
    public function updatePrivacy(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'is_online' => ['required', 'boolean'],
        ]);

        $user->update([
            'is_online' => $validated['is_online'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Preferensi privasi diperbarui.',
            'is_online' => $user->is_online,
        ]);
    }
}
