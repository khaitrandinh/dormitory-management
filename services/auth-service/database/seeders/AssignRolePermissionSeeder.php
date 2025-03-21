<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class AssignRolePermissionSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $studentRole = Role::where('name', 'student')->first();

        $permissions = Permission::all();

        // Gán tất cả quyền cho admin
        $adminRole->permissions()->attach($permissions->pluck('id'));

        // Nếu muốn gán quyền hạn chế cho student, ví dụ chỉ view
        $studentPermissions = Permission::whereIn('name', ['view_dashboard'])->get();
        $studentRole->permissions()->attach($studentPermissions->pluck('id'));
    }
}
