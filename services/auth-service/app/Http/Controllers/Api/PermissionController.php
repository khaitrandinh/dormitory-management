<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return Permission::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:permissions']);
        $permission = Permission::create(['name' => $request->name]);
        return response()->json($permission, 201);
    }

    public function assignToRole(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $role = \App\Models\Role::findOrFail($request->role_id);
        $role->permissions()->syncWithoutDetaching([$request->permission_id]); // Tránh bị duplicate

        return response()->json(['message' => 'Permission assigned to role successfully']);
    }
}
