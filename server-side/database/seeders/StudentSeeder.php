<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run()
    {
        // Sinh viên: Student Test (student@example.com)
        $studentUser1 = User::where('email', 'student@example.com')->first();
        if ($studentUser1) {
            Student::firstOrCreate(
                ['user_id' => $studentUser1->id],
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

        // Sinh viên: James (james@gmail.com)
        $studentUser2 = User::where('email', 'james@gmail.com')->first();
        if ($studentUser2) {
            Student::firstOrCreate(
                ['user_id' => $studentUser2->id],
                [
                    'student_code' => 'SV002',
                    'gender' => 'Male',
                    'birth_date' => '2001-05-15',
                    'class' => 'CS102',
                    'faculty' => 'Information Technology',
                    'phone' => '0912345679',
                    'room_code' => 'B201',
                    'is_paid' => false,
                    'room_request_status' => 'pending',
                    'room_cancel_status' => null,
                ]
            );
        }

        // Sinh viên: Harry (harry@gmail.com)
        $studentUser3 = User::where('email', 'harry@gmail.com')->first();
        if ($studentUser3) {
            Student::firstOrCreate(
                ['user_id' => $studentUser3->id],
                [
                    'student_code' => 'SV003',
                    'gender' => 'Male',
                    'birth_date' => '2002-07-20',
                    'class' => 'CS103',
                    'faculty' => 'Software Engineering',
                    'phone' => '0912345680',
                    'room_code' => 'C301',
                    'is_paid' => true,
                    'room_request_status' => 'approved',
                    'room_cancel_status' => null,
                ]
            );
        }

        // Sinh viên: Jane (jane@gmail.com)
        $studentUser4 = User::where('email', 'jane@gmail.com')->first();
        if ($studentUser4) {
            Student::firstOrCreate(
                ['user_id' => $studentUser4->id],
                [
                    'student_code' => 'SV004',
                    'gender' => 'Female',
                    'birth_date' => '2003-09-10',
                    'class' => 'CS104',
                    'faculty' => 'Computer Science',
                    'phone' => '0912345681',
                    'room_code' => 'D401',
                    'is_paid' => true,
                    'room_request_status' => 'approved',
                    'room_cancel_status' => null,
                ]
            );
        }
    }
}
