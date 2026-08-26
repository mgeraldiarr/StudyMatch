<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SetupProfileRequest;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Show the login/registration page.
     */
    public function login(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('dashboard.discovery');
        }

        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function authenticate(LoginRequest $request): JsonResponse|RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();
            $user->update([
                'is_online' => true,
                'last_active_at' => now(),
            ]);

            $redirectUrl = $user->is_profile_completed
                ? route('dashboard.discovery')
                : route('auth.setup-profile');

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Berhasil masuk ke StudyMatch!',
                    'redirect' => $redirectUrl,
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ]);
            }

            return redirect()->intended($redirectUrl);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password yang kamu masukkan salah.',
                'errors' => [
                    'password' => ['Password tidak cocok dengan data kami.'],
                ],
            ], 422);
        }

        return back()->withErrors([
            'email' => 'Email atau password yang kamu masukkan salah.',
        ])->onlyInput('email');
    }

    /**
     * Handle user registration.
     */
    public function register(RegisterRequest $request): JsonResponse|RedirectResponse
    {
        $avatars = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB8m8h3Kebj96j9Xv-qiL6jydArdiojEWCr7KonLA03vEpzrAwjxQVQw1ypWEfzDb59BBv0yC4jnZ-lSDs2aGS0rFUKTUuW1FOEfCSGzEDqqnMLupAvr2cwH3z96OuRo3hfEZdOKBEy6DLiWFOwEaU5v8sCbkcy_PvKhmYcWFxtMEsmueKmU-SYEIhDbCr1TH067UBxDnMn7I-1KHa16mRWrfdYk-msaeYWbTGWAi6bNqGYNKvT3-Z61SN8R2jUW9-ECTKy0W2CxAM',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDWhr2UB_6eTLnGupEodi-ZX6N4jeN72NOQxPcrlI5vc3Z4i-FB-axDU1mCgg5wIVt7qoSGC9K-0xHJ33B561NUhkCWB2ZFa8mEnWWLnEb1DuK32XHsfxdh_zR1hlLDLtAFUwmsx-LfaytVgzMyj_Rxchke3tPctsoJQs9xMC-bF4Hcw4LbK0zqY-YJpz3y7Uy4xcKirryI6wbGL3vZp-vuRapnqbg3Vf_ksU2MfyHVnshOESD9ccgkseZH9Wf4TwdWnT7MygCcL-U',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA',
        ];

        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'avatar' => $avatars[array_rand($avatars)],
            'is_online' => true,
            'last_active_at' => now(),
            'is_profile_completed' => false,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil dibuat! Silakan lengkapi profil akademikmu.',
                'redirect' => route('auth.setup-profile'),
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 201);
        }

        return redirect()->route('auth.setup-profile');
    }

    /**
     * Show the setup profile page.
     */
    public function setupProfile(): View|RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $availableCourses = Course::orderBy('name')->get();

        return view('auth.setup-profile', [
            'user' => $user,
            'availableCourses' => $availableCourses,
        ]);
    }

    /**
     * Save the completed profile setup.
     */
    public function saveSetupProfile(SetupProfileRequest $request): JsonResponse|RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validated();
        $courseNames = $data['courses'] ?? [];
        unset($data['courses']);

        // Handle avatar file upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = '/storage/' . $path;
        }

        // Handle weekly availability JSON string if sent from FormData
        if (isset($data['weekly_availability']) && is_string($data['weekly_availability'])) {
            $data['weekly_availability'] = json_decode($data['weekly_availability'], true);
        }

        $data['is_profile_completed'] = true;
        $data['last_active_at'] = now();
        $user->update($data);

        // Sync or create courses
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil disimpan! Selamat datang di StudyMatch.',
                'redirect' => route('dashboard.discovery'),
            ]);
        }

        return redirect()->route('dashboard.discovery');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();
            $user->update(['is_online' => false]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
