<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // Đăng ký tài khoản
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student', // Mặc định là student
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Sai thông tin đăng nhập'], 401);
        }
        
        return response()->json([
            'token' => $token,
            'user' => auth()->user()
        ]);
    }


    // Lấy thông tin user
    public function me()
    {
        return response()->json(auth()->user());
    }

    // Đăng xuất
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    // Refresh token
    public function refresh()
    {
        return response()->json([
            'token' => auth()->refresh()
        ]);
    }
}
