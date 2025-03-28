<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        // Thông báo chung
        Notification::create([
            'user_id' => null,
            'sender_id' => 1,
            'title' => 'Chào mừng đến với hệ thống!',
            'message' => 'Hệ thống ký túc xá đã sẵn sàng hoạt động. Hãy kiểm tra phòng của bạn!',
        ]);

        Notification::create([
            'user_id' => null,
            'sender_id' => 1,
            'title' => 'Lưu ý bảo trì định kỳ',
            'message' => 'Ký túc xá sẽ bảo trì hệ thống điện vào ngày 5 hàng tháng. Vui lòng chú ý.',
        ]);

        Notification::create([
            'user_id' => null,
            'sender_id' => 1,
            'title' => 'Cuộc thi trang trí phòng',
            'message' => 'Tham gia cuộc thi trang trí phòng nhận thưởng hấp dẫn. Hạn đăng ký: 10/04.',
        ]);

        // Thông báo riêng cho từng user (giả sử user_id từ 2–4 là sinh viên)
        Notification::create([
            'user_id' => 2,
            'sender_id' => 1,
            'title' => 'Thanh toán tháng 3',
            'message' => 'Bạn có hoá đơn chưa thanh toán tháng này, vui lòng kiểm tra sớm.',
        ]);

        Notification::create([
            'user_id' => 3,
            'sender_id' => 1,
            'title' => 'Cập nhật hồ sơ',
            'message' => 'Bạn vui lòng cập nhật lại thông tin số điện thoại trong hồ sơ cá nhân.',
        ]);

        Notification::create([
            'user_id' => 4,
            'sender_id' => 1,
            'title' => 'Xác nhận hợp đồng',
            'message' => 'Vui lòng truy cập hệ thống để xác nhận hợp đồng thuê phòng của bạn.',
        ]);
    }
}
