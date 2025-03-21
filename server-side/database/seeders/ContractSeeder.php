<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Student;
use App\Models\Room;

class ContractSeeder extends Seeder
{
    public function run()
    {
        $student = Student::first(); // 🔥 Lấy student đầu tiên trong DB
        $room = Room::first(); // 🔥 Lấy room đầu tiên trong DB

        if (!$student || !$room) {
            echo "Không có student hoặc room nào trong database!";
            return;
        }

        Contract::create([
            'student_id' => $student->id, // ✅ Chắc chắn lấy ID hợp lệ
            'room_id' => $room->id,
            'start_date' => '2025-02-21',
            'end_date' => '2025-08-21',
            'status' => 'active',
        ]);
    }
}
