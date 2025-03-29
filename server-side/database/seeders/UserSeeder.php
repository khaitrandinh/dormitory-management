<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Student Test',
            'email' => 'student@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        User::create([
            'name' => 'Staff Test',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);
        User::create([
            'name' => 'James',
            'email' => 'james@gmail.com',
            'password' => Hash::make('12345'),
            'role' => 'student',
        ]);
        User::create([
            'name' => 'Harry',
            'email' => 'harry@gmail.com',
            'password' => Hash::make('12345'),
            'role' => 'student',
        ]);
        User::create([
            'name' => 'Jane',
            'email' => 'jane@gmail.com',
            'password' => Hash::make('12345'),
            'role' => 'student',
        ]);
        
    }
}
