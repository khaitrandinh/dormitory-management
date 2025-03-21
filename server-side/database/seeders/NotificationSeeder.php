<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        if ($users->isEmpty()) {
            echo "⚠️ Không có User nào để tạo thông báo!\n";
            return;
        }

        foreach ($users as $user) {
            Notification::create([
                'sender_id' => $user->id,
                'title' => 'Thông báo quan trọng',
                'message' => 'Hãy kiểm tra thông tin mới trong hệ thống.',
            ]);
        }

        echo "✅ Seeder `NotificationSeeder` đã tạo dữ liệu thành công!\n";
    }
}
