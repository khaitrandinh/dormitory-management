<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Student;
use App\Models\Room;
use Carbon\Carbon;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        // Mảng ánh xạ student_code với room_code
        $contracts = [
            'SV001' => 'A101',
            'SV002' => 'B202',
            'SV003' => 'C301',
            'SV004' => 'D401',
        ];

        foreach ($contracts as $studentCode => $roomCode) {
            $student = Student::where('student_code', $studentCode)->first();
            $room = Room::where('room_code', $roomCode)->first();

            if ($student && $room) {
                Contract::firstOrCreate(
                    ['student_id' => $student->id, 'room_id' => $room->id],
                    [
                        'start_date'     => Carbon::now(),
                        'end_date'       => Carbon::now()->addMonths(6),
                        'status'         => 'active',
                        'deposit_amount' => 1000000,
                        'notes'          => "Contract for $studentCode in $roomCode",
                    ]
                );

                echo "✅ Hợp đồng đã tạo cho sinh viên $studentCode tại phòng $roomCode.\n";
            } else {
                echo "⚠️ Không tìm thấy sinh viên $studentCode hoặc phòng $roomCode.\n";
            }
        }
    }
}
