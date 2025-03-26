<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index()
    {
        
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'status')->get();
        return response()->json($users);
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Người dùng không tồn tại'], 404);

        $request->validate([
            'role' => 'in:admin,student,staff',
            'status' => 'in:active,banned'
        ]);

        $user->update($request->only(['role', 'status']));
        return response()->json(['message' => 'Cập nhật người dùng thành công']);
    }

    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa người dùng'], 403);
        }

        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'Người dùng không tồn tại'], 404);

        $user->delete();
        return response()->json(['message' => 'Xóa người dùng thành công']);
    }
}
