<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run()
    {
        $studentUser = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'John Doe',
                'password' => bcrypt('password'),
                'role' => 'student',
            ]
        );

        Student::firstOrCreate(
            ['user_id' => $studentUser->id],
            [
                'student_code' => 'SV001',
                'gender' => 'Male',
                'birth_date' => '2003-12-03',
                'class' => 'CS101',
                'faculty' => 'Computer Science',
                'phone' => '0912345678',
                'room_code' => 'A101',
                'is_paid' => true,
                'room_request_status' => 'approved',
                'room_cancel_status' => null,
            ]
        );
    }
}
