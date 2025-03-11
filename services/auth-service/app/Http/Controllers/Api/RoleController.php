<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

class RoleController extends Controller
{
    // Gán role cho user
    public function assignRole(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $role = Role::where('name', $request->role)->firstOrFail();
        $user->roles()->attach($role);

        return response()->json(['message' => 'Role assigned successfully']);
    }

    // Gán permission cho role
    public function assignPermission(Request $request)
    {
        $role = Role::where('name', $request->role)->firstOrFail();
        $permission = Permission::where('name', $request->permission)->firstOrFail();
        $role->permissions()->attach($permission);

        return response()->json(['message' => 'Permission assigned successfully']);
    }

    // Tạo Role mới
    public function createRole(Request $request)
    {
        $role = Role::create(['name' => $request->name]);
        return response()->json(['message' => 'Role created', 'role' => $role]);
    }

    // Tạo Permission mới
    public function createPermission(Request $request)
    {
        $permission = Permission::create(['name' => $request->name]);
        return response()->json(['message' => 'Permission created', 'permission' => $permission]);
    }
}
