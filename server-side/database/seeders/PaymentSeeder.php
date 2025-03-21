<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Contract;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        // Lấy danh sách hợp đồng để tạo thanh toán
        $contracts = Contract::all();

        if ($contracts->isEmpty()) {
            echo "⚠️ Không có hợp đồng nào để tạo thanh toán!";
            return;
        }

        foreach ($contracts as $contract) {
            Payment::create([
                'contract_id' => $contract->id, // ✅ Gắn với hợp đồng có thật
                'amount' => rand(500000, 2000000), // Số tiền random
                'payment_date' => now()->subDays(rand(1, 30)), // Lấy ngày trong vòng 30 ngày qua
                'status' => ['pending', 'paid', 'canceled'][rand(0, 2)], // Chọn random trạng thái
            ]);
        }

        echo "✅ Seeder `PaymentSeeder` đã tạo dữ liệu thành công!\n";
    }
}
