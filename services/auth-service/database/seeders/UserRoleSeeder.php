<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $user = User::where('email', 'test@example.com')->first(); // email user muốn gán role

        if ($adminRole && $user) {
            $user->roles()->syncWithoutDetaching([$adminRole->id]); // Gán role mà không trùng lặp
        }
    }
}
