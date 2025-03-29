<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        Room::create([
            'room_code' => 'A101',
            'building' => 'Tòa A',
            'floor' => 1,
            'bed_count' => 4,
            'room_type' => 'standard',
            'status' => 'Occupied',
            'price' => 800000,
        ]);

        Room::create([
            'room_code' => 'B202',
            'building' => 'Tòa B',
            'floor' => 2,
            'bed_count' => 3,
            'room_type' => 'vip',
            'status' => 'Available',
            'price' => 1500000,
        ]);

        // Phòng mới
        Room::create([
            'room_code' => 'C301',
            'building' => 'Tòa C',
            'floor' => 3,
            'bed_count' => 2,
            'room_type' => 'standard',
            'status' => 'Available',
            'price' => 1000000,
        ]);

        Room::create([
            'room_code' => 'D401',
            'building' => 'Tòa D',
            'floor' => 4,
            'bed_count' => 4,
            'room_type' => 'standard',
            'status' => 'Occupied',
            'price' => 750000,
        ]);

        Room::create([
            'room_code' => 'E105',
            'building' => 'Tòa E',
            'floor' => 1,
            'bed_count' => 3,
            'room_type' => 'vip',
            'status' => 'Maintenance',
            'price' => 1600000,
        ]);

        Room::create([
            'room_code' => 'F203',
            'building' => 'Tòa F',
            'floor' => 2,
            'bed_count' => 4,
            'room_type' => 'standard',
            'status' => 'Available',
            'price' => 900000,
        ]);
    }
}
