<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run()
    {
        $studentUser = User::where('email', 'student@example.com')->first();

        Student::create([
            'user_id' => $studentUser->id,
            'student_code' => 'SV001',
            'gender' => 'Nam',
            'birth_date' => '2003-12-03',
            'class' => 'KTPM01',
            'faculty' => 'Công nghệ thông tin',
            'phone' => '0912345678',
            'room_code' => 'A101',
            'is_paid' => true,
        ]);
    }
}
