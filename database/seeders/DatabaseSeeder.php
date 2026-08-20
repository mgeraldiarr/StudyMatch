<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\MatchRequest;
use App\Models\Message;
use App\Models\StudySession;
use App\Models\Thread;
use App\Models\ThreadReply;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed courses
        $this->call(CourseSeeder::class);
        $allCourses = Course::all();

        $avatars = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB8m8h3Kebj96j9Xv-qiL6jydArdiojEWCr7KonLA03vEpzrAwjxQVQw1ypWEfzDb59BBv0yC4jnZ-lSDs2aGS0rFUKTUuW1FOEfCSGzEDqqnMLupAvr2cwH3z96OuRo3hfEZdOKBEy6DLiWFOwEaU5v8sCbkcy_PvKhmYcWFxtMEsmueKmU-SYEIhDbCr1TH067UBxDnMn7I-1KHa16mRWrfdYk-msaeYWbTGWAi6bNqGYNKvT3-Z61SN8R2jUW9-ECTKy0W2CxAM',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDWhr2UB_6eTLnGupEodi-ZX6N4jeN72NOQxPcrlI5vc3Z4i-FB-axDU1mCgg5wIVt7qoSGC9K-0xHJ33B561NUhkCWB2ZFa8mEnWWLnEb1DuK32XHsfxdh_zR1hlLDLtAFUwmsx-LfaytVgzMyj_Rxchke3tPctsoJQs9xMC-bF4Hcw4LbK0zqY-YJpz3y7Uy4xcKirryI6wbGL3vZp-vuRapnqbg3Vf_ksU2MfyHVnshOESD9ccgkseZH9Wf4TwdWnT7MygCcL-U',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA',
        ];

        // 2. Demo User (Alya Ramadhani)
        $mainUser = User::firstOrCreate(
            ['email' => 'alya@ui.ac.id'],
            [
                'name' => 'Alya Ramadhani',
                'password' => Hash::make('password'),
                'avatar' => $avatars[3],
                'university' => 'Universitas Indonesia',
                'major' => 'Teknik Informatika',
                'academic_year' => 'Tahun 3',
                'academic_status' => 'Mahasiswa Sarjana (S1)',
                'bio' => 'Mahasiswa Teknik Informatika yang tertarik pada AI, Machine Learning, dan Algoritma. Suka belajar kelompok dengan peta konsep visual.',
                'learning_style' => 'visual',
                'goals' => ['Persiapan ujian', 'Project coding', 'Riset bersama'],
                'weekly_availability' => [
                    'sen' => ['morning', 'afternoon'],
                    'sel' => ['evening'],
                    'rab' => ['afternoon'],
                    'kam' => ['morning', 'evening'],
                    'jum' => ['afternoon'],
                    'sab' => ['morning'],
                    'min' => [],
                ],
                'is_online' => true,
                'last_active_at' => now(),
                'is_profile_completed' => true,
            ]
        );

        $mainCourses = Course::whereIn('name', [
            'Struktur Data & Algoritma',
            'Discrete Math',
            'Machine Learning',
            'Basis Data Non-Relasional',
        ])->get();
        $mainUser->courses()->sync($mainCourses->pluck('id'));

        // 3. Predefined Discovery Students
        $studentsData = [
            [
                'name' => 'Anisa Rahmawati',
                'email' => 'anisa@ui.ac.id',
                'university' => 'Universitas Indonesia',
                'major' => 'Ilmu Komputer',
                'academic_year' => 'Tahun 3',
                'learning_style' => 'visual',
                'avatar' => $avatars[0],
                'is_online' => true,
                'courses' => ['Discrete Math', 'Struktur Data & Algoritma', 'Kalkulus III'],
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@itb.ac.id',
                'university' => 'Institut Teknologi Bandung',
                'major' => 'Teknik Mesin',
                'academic_year' => 'Tahun 2',
                'learning_style' => 'kinesthetic',
                'avatar' => $avatars[1],
                'is_online' => false,
                'courses' => ['Kalkulus III', 'Termodinamika'],
            ],
            [
                'name' => 'Siti Fatimah',
                'email' => 'siti@binus.ac.id',
                'university' => 'Binus University',
                'major' => 'Desain Komunikasi Visual',
                'academic_year' => 'Tahun 4',
                'learning_style' => 'auditory',
                'avatar' => $avatars[2],
                'is_online' => true,
                'courses' => ['UX Design', 'Human-Computer Interaction'],
            ],
            [
                'name' => 'Reza Firmansyah',
                'email' => 'reza@ugm.ac.id',
                'university' => 'Universitas Gadjah Mada',
                'major' => 'Statistika & Sains Data',
                'academic_year' => 'Tahun 3',
                'learning_style' => 'visual',
                'avatar' => $avatars[3],
                'is_online' => true,
                'courses' => ['Machine Learning', 'Statistika & Probabilitas', 'Pemrograman Dasar'],
            ],
            [
                'name' => 'Dewi Kusuma',
                'email' => 'dewi@unair.ac.id',
                'university' => 'Universitas Airlangga',
                'major' => 'Manajemen Bisnis',
                'academic_year' => 'Tahun 2',
                'learning_style' => 'auditory',
                'avatar' => $avatars[0],
                'is_online' => false,
                'courses' => ['Manajemen Bisnis', 'Ekonomi Mikro'],
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad@ub.ac.id',
                'university' => 'Universitas Brawijaya',
                'major' => 'Teknik Informatika',
                'academic_year' => 'Tahun 1',
                'learning_style' => 'kinesthetic',
                'avatar' => $avatars[1],
                'is_online' => true,
                'courses' => ['Pemrograman Dasar', 'Discrete Math'],
            ],
        ];

        foreach ($studentsData as $data) {
            $courses = $data['courses'];
            unset($data['courses']);

            $user = User::firstOrCreate(
                ['email' => $data['email']],
                array_merge($data, [
                    'password' => Hash::make('password'),
                    'academic_status' => 'Mahasiswa Sarjana (S1)',
                    'bio' => 'Antusias belajar dan siap berbagi pemahaman materi kuliah!',
                    'goals' => ['Persiapan ujian', 'Diskusi materi'],
                    'weekly_availability' => [
                        'sen' => ['afternoon'],
                        'rab' => ['evening'],
                        'kam' => ['afternoon'],
                    ],
                    'last_active_at' => now()->subMinutes(rand(1, 120)),
                    'is_profile_completed' => true,
                ])
            );

            $courseIds = Course::whereIn('name', $courses)->pluck('id');
            $user->courses()->sync($courseIds);
        }

        // 4. Create additional random students
        $extraUsers = User::factory()->count(10)->create();
        foreach ($extraUsers as $extraUser) {
            $randomCourses = $allCourses->random(rand(2, 4))->pluck('id');
            $extraUser->courses()->sync($randomCourses);
        }

        // 5. Seed some Match Requests
        $studentAnisa = User::where('email', 'anisa@ui.ac.id')->first();
        $studentBudi = User::where('email', 'budi@itb.ac.id')->first();
        $studentReza = User::where('email', 'reza@ugm.ac.id')->first();

        if ($studentAnisa) {
            MatchRequest::firstOrCreate(
                ['sender_id' => $studentAnisa->id, 'receiver_id' => $mainUser->id],
                [
                    'status' => 'pending',
                    'message' => 'Hai Alya! Mau belajar bareng untuk persiapan UAS Discrete Math?',
                ]
            );
        }

        if ($studentBudi) {
            MatchRequest::firstOrCreate(
                ['sender_id' => $mainUser->id, 'receiver_id' => $studentBudi->id],
                [
                    'status' => 'accepted',
                    'message' => 'Halo Budi, yuk diskusi latihan soal Kalkulus III!',
                ]
            );

            // 6. Seed Sample Messages between Alya and Budi
            Message::firstOrCreate([
                'sender_id' => $studentBudi->id,
                'receiver_id' => $mainUser->id,
                'message' => 'Halo Alya! Makasih udah diajak belajar bareng.',
            ], [
                'is_read' => true,
                'created_at' => now()->subHours(2),
            ]);

            Message::firstOrCreate([
                'sender_id' => $mainUser->id,
                'receiver_id' => $studentBudi->id,
                'message' => 'Sama-sama Budi! Nanti malam ada waktu buat bahas integral lipat dua?',
            ], [
                'is_read' => true,
                'created_at' => now()->subHour(),
            ]);

            Message::firstOrCreate([
                'sender_id' => $studentBudi->id,
                'receiver_id' => $mainUser->id,
                'message' => 'Bisa banget! Jam 19.30 ya, aku siapin catatannya dulu.',
            ], [
                'is_read' => false,
                'created_at' => now()->subMinutes(15),
            ]);
        }

        // 7. Seed Sample Forum Threads
        if ($studentReza) {
            $thread1 = Thread::firstOrCreate([
                'title' => 'Best practices untuk async/await di JavaScript Modern',
            ], [
                'user_id' => $studentReza->id,
                'channel' => 'Pemrograman',
                'body' => 'Diskusi mendalam tentang penanganan error menggunakan try-catch dan Promise.allSettled pada aplikasi asynchronous modern.',
                'votes' => 15,
                'views' => 120,
                'is_solved' => true,
                'is_pinned' => true,
            ]);

            ThreadReply::firstOrCreate([
                'thread_id' => $thread1->id,
                'user_id' => $mainUser->id,
            ], [
                'body' => 'Sangat setuju! Sebaiknya selalu bungkus async function dengan try-catch agar tidak menyebabkan unhandled promise rejection.',
            ]);
        }

        // 8. Seed Sample Study Sessions
        StudySession::firstOrCreate([
            'user_id' => $mainUser->id,
            'title' => 'Kalkulus Lanjut III — Integral Lipat Dua',
        ], [
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '19:30',
            'duration' => 90,
            'location' => 'Online',
            'meeting_link' => 'https://meet.google.com/abc-study-123',
            'participants' => ['Budi Santoso', 'Anisa Rahmawati'],
        ]);
    }
}
