<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        Notification::create([
            'user_id' => null, // Thông báo chung
            'sender_id' => 1, // Giả sử admin có ID = 1
            'title' => 'Chào mừng đến với hệ thống!',
            'message' => 'Hệ thống ký túc xá đã sẵn sàng hoạt động. Hãy kiểm tra phòng của bạn!'
        ]);

        Notification::create([
            'user_id' => 2, // Thông báo riêng cho user_id = 2
            'sender_id' => 1,
            'title' => 'Thanh toán tháng 3',
            'message' => 'Bạn có hoá đơn chưa thanh toán tháng này, vui lòng kiểm tra sớm.'
        ]);
    }
}
