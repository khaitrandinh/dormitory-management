<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Student;

class AuthController extends Controller
{
    // Đăng ký tài khoản
    

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'gender' => 'required',
            'birth_date' => 'required|date',
            'class' => 'required|string',
            'faculty' => 'required|string',
            'phone' => 'required|string',
        ]);
        

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student', 
        ]);

        //Tạo bản ghi student tương ứng
        Student::create([
            'user_id' => $user->id,
            'student_code' => 'S' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
            'gender' => $request->gender,
            'birth_date' => $request->birth_date,
            'class' => $request->class,
            'faculty' => $request->faculty,
            'phone' => $request->phone,
        ]);
        
        //Func FromUser là hàm tạo token cho user được tich hợp sẵn trong JWTAuth
        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }


    // Đăng nhập
    public function login(Request $request)
    {
        
        $credentials = $request->only('email', 'password');
        // attempt là hàm kiểm tra thông tin đăng nhập 
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
