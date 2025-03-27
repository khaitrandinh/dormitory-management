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
        $student = Student::first();
        $room = Room::first();

        if ($student && $room) {
            Contract::create([
                'student_id'     => $student->id,
                'room_id'        => $room->id,
                'start_date'     => Carbon::now(),
                'end_date'       => Carbon::now()->addMonths(6),
                'status'         => 'active',
                'deposit_amount' => 1000000,
                'notes'          => 'Initial contract for testing.',
            ]);

            echo " ContractSeeder đã tạo hợp đồng mẫu thành công.\n";
        } else {
            echo "Không tìm thấy sinh viên hoặc phòng để tạo hợp đồng.\n";
        }
    }
}
