<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            ['name' => 'Struktur Data & Algoritma', 'code' => 'CS201', 'category' => 'Computer Science'],
            ['name' => 'Discrete Math', 'code' => 'MATH102', 'category' => 'Mathematics'],
            ['name' => 'Kalkulus III', 'code' => 'MATH201', 'category' => 'Mathematics'],
            ['name' => 'Machine Learning', 'code' => 'AI301', 'category' => 'Artificial Intelligence'],
            ['name' => 'Kecerdasan Buatan', 'code' => 'AI201', 'category' => 'Artificial Intelligence'],
            ['name' => 'Neural Networks 101', 'code' => 'AI401', 'category' => 'Artificial Intelligence'],
            ['name' => 'UX Design', 'code' => 'DS101', 'category' => 'Design & HCI'],
            ['name' => 'Human-Computer Interaction', 'code' => 'DS201', 'category' => 'Design & HCI'],
            ['name' => 'Basis Data Non-Relasional', 'code' => 'CS302', 'category' => 'Computer Science'],
            ['name' => 'Pemrograman Dasar', 'code' => 'CS101', 'category' => 'Computer Science'],
            ['name' => 'Statistika & Probabilitas', 'code' => 'STAT101', 'category' => 'Mathematics'],
            ['name' => 'Termodinamika', 'code' => 'PHYS201', 'category' => 'Physics'],
            ['name' => 'Ekonomi Mikro', 'code' => 'ECON101', 'category' => 'Economics'],
            ['name' => 'Manajemen Bisnis', 'code' => 'MGMT101', 'category' => 'Management'],
            ['name' => 'Pengantar Epistemologi', 'code' => 'PHIL101', 'category' => 'Philosophy'],
        ];

        foreach ($courses as $course) {
            Course::firstOrCreate(['name' => $course['name']], $course);
        }
    }
}
