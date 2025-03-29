<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Support\Carbon;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        $contracts = Contract::all();

        if ($contracts->isEmpty()) {
            echo "⚠️ No contracts available to seed payments!\n";
            return;
        }

        foreach ($contracts as $contract) {
            // Tạo 3 khoản thanh toán cho mỗi hợp đồng
            for ($i = 1; $i <= 3; $i++) {
                Payment::create([
                    'contract_id' => $contract->id,
                    'amount' => rand(500000, 2000000),
                    'payment_date' => Carbon::now()->subDays(rand(5, 60)),
                    'status' => ['pending', 'paid', 'canceled'][rand(0, 2)],
                    'type' => 'room_booking',
                    'description' => "Payment #$i for contract #{$contract->id}",
                    'payos_transaction_code' => rand(10000000, 99999999),
                ]);
            }
        }

        echo "✅ Đã tạo thêm nhiều khoản thanh toán cho mỗi hợp đồng thành công!\n";
    }
}
