<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:roles']);
        $role = Role::create(['name' => $request->name]);
        return response()->json($role, 201);
    }

    public function assignToUser(Request $request)
    {
        $request->validate(['user_id' => 'required', 'role_id' => 'required']);
        $user = \App\Models\User::findOrFail($request->user_id);
        $user->roles()->attach($request->role_id);
        return response()->json(['message' => 'Role assigned to user']);
    }
}
