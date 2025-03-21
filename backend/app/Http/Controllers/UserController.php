<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ✅ Lấy danh sách tất cả người dùng (chỉ Admin)
    public function index()
    {
        $this->authorizeAdmin();
        return response()->json(User::all());
    }

    // ✅ Lấy thông tin người dùng theo id
    public function show($id)
    {
        $this->authorizeAdmin();
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        return response()->json($user);
    }

    // ✅ Cập nhật thông tin người dùng
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,student,staff'
        ]);

        if ($request->filled('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $user->update($request->all());

        return response()->json(['message' => 'Cập nhật người dùng thành công', 'data' => $user]);
    }

    // ✅ Xóa người dùng
    public function destroy($id)
    {
        $this->authorizeAdmin();

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Không tìm thấy người dùng'], 404);

        $user->delete();

        return response()->json(['message' => 'Người dùng đã bị xóa']);
    }

    // 🔐 Kiểm tra quyền admin
    private function authorizeAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Bạn không có quyền thực hiện chức năng này');
        }
    }
}
