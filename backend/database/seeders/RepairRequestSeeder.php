<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RepairRequest;
use App\Models\User;
use App\Models\Room;

class RepairRequestSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $rooms = Room::all();

        if ($users->isEmpty() || $rooms->isEmpty()) {
            echo "⚠️ Không có User hoặc Room để tạo yêu cầu sửa chữa!\n";
            return;
        }

        foreach ($users as $user) {
            RepairRequest::create([
                'user_id' => $user->id,
                'room_id' => $rooms->random()->id,
                'description' => 'Hỏng đèn trong phòng',
                'status' => 'pending',
            ]);
        }

        echo "✅ Seeder `RepairRequestSeeder` đã tạo dữ liệu thành công!\n";
    }
}
