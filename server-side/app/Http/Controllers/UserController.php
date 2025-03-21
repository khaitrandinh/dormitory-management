<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ✅ Lấy danh sách tất cả người dùng (Chỉ Admin)
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }
        return response()->json(User::all());
    }

    // ✅ Lấy thông tin người dùng (User chỉ xem chính mình)
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        // ⚡ Chỉ cho phép User xem chính mình hoặc Admin xem tất cả
        if (auth()->user()->id !== $user->id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }

        return response()->json($user);
    }

    // ✅ Cập nhật thông tin cá nhân (User chỉ cập nhật chính họ)
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        // ⚡ Chỉ cho phép User cập nhật chính họ hoặc Admin cập nhật mọi người
        if (auth()->user()->id !== $user->id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật thông tin này'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,student,staff' // ⚠️ Chỉ admin mới được thay đổi role
        ]);

        if ($request->filled('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $user->update($request->all());

        return response()->json(['message' => 'Cập nhật người dùng thành công', 'data' => $user]);
    }

    // ❌ Không cho User tự xóa tài khoản
}
