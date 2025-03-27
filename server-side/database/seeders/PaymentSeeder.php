<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Contract;

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
            Payment::create([
                'contract_id' => $contract->id,
                'amount' => rand(500000, 2000000),
                'payment_date' => now()->subDays(rand(1, 30)),
                'status' => ['pending', 'paid', 'canceled'][rand(0, 2)],
                'type' => 'room_booking',
                'description' => 'Room booking fee for contract #' . $contract->id,
                'payos_transaction_code' => rand(10000000, 99999999),
            ]);
        }

        echo "✅ PaymentSeeder has seeded sample data successfully!\n";
    }
}
