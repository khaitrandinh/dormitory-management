<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = ['view_users', 'manage_rooms', 'manage_students', 'view_finances'];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
