<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }
        return response()->json(User::all());
    }

    
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        
        if (auth()->user()->id !== $user->id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }

        return response()->json($user);
    }

    
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        if (auth()->user()->id !== $user->id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật thông tin này'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,student,staff'
        ]);

        $data = $request->only(['name', 'email', 'role']); // KHÔNG lấy password nếu để trống

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json(['message' => 'Cập nhật người dùng thành công', 'data' => $user]);
    }


    
}
