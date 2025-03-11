<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Tạo permission nếu chưa tồn tại
        $viewUsers = Permission::firstOrCreate(['name' => 'view_users'], ['description' => 'Xem danh sách user']);
        $createUsers = Permission::firstOrCreate(['name' => 'create_users'], ['description' => 'Tạo mới user']);
        $deleteUsers = Permission::firstOrCreate(['name' => 'delete_users'], ['description' => 'Xóa user']);

        // Lấy role admin
        $adminRole = Role::where('name', 'admin')->first();

        if ($adminRole) {
            // Gán quyền cho role admin
            $adminRole->permissions()->syncWithoutDetaching([
                $viewUsers->id,
                $createUsers->id,
                $deleteUsers->id
            ]);
        }
    }
}
