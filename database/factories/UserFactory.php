<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $universities = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Universitas Airlangga',
            'Binus University',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Brawijaya',
            'Universitas Diponegoro',
        ];

        $majors = [
            'Teknik Informatika',
            'Sistem Informasi',
            'Ilmu Komputer',
            'Matematika',
            'Desain Komunikasi Visual',
            'Manajemen Bisnis',
            'Teknik Elektro',
            'Psikologi',
        ];

        $learningStyles = ['visual', 'auditory', 'kinesthetic', 'reading'];
        $years = ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4'];
        $availableGoals = [
            'Persiapan ujian',
            'Riset bersama',
            'Project coding',
            'Diskusi materi',
            'Kelompok belajar rutin',
            'Bahasa & writing',
            'Presentasi & debat',
        ];

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
            'university' => fake()->randomElement($universities),
            'major' => fake()->randomElement($majors),
            'academic_year' => fake()->randomElement($years),
            'academic_status' => 'Mahasiswa Sarjana (S1)',
            'bio' => fake()->paragraph(2),
            'learning_style' => fake()->randomElement($learningStyles),
            'goals' => fake()->randomElements($availableGoals, fake()->numberBetween(2, 4)),
            'weekly_availability' => [
                'sen' => ['morning', 'afternoon'],
                'sel' => ['evening'],
                'rab' => ['afternoon'],
                'kam' => ['morning', 'evening'],
                'jum' => ['afternoon'],
                'sab' => ['morning'],
                'min' => [],
            ],
            'is_online' => fake()->boolean(60),
            'last_active_at' => now()->subMinutes(fake()->numberBetween(5, 300)),
            'is_profile_completed' => true,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
