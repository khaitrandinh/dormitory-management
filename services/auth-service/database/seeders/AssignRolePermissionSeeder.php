<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

class AssignRolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy user đầu tiên (hoặc tạo mới nếu chưa có)
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password')
            ]
        );

        // Tạo role admin nếu chưa có
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Gán role cho user
        $user->roles()->syncWithoutDetaching([$adminRole->id]);

        // Tạo các permissions
        $viewUsers = Permission::firstOrCreate(['name' => 'view_users', 'description' => 'Xem danh sách user']);
        $editUsers = Permission::firstOrCreate(['name' => 'edit_users', 'description' => 'Chỉnh sửa user']);
        $deleteUsers = Permission::firstOrCreate(['name' => 'delete_users', 'description' => 'Xoá user']);

        // Gán permissions cho role admin
        $adminRole->permissions()->syncWithoutDetaching([$viewUsers->id, $editUsers->id, $deleteUsers->id]);

        echo "Đã gán Role và Permission thành công!\n";
    }
}
