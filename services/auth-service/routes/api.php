<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController; // Nếu bạn có permission

// ======================= AUTH ROUTES ========================== //
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']); // ✅ Đăng ký, gán role mặc định "student"
    Route::post('/login', [AuthController::class, 'login']);       // ✅ Đăng nhập nhận token

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);        // ✅ Lấy thông tin user hiện tại
        Route::post('/refresh', [AuthController::class, 'refresh']); // ✅ Làm mới token
        Route::post('/logout', [AuthController::class, 'logout']);   // ✅ Đăng xuất
    });
});

// ======================= ROLE ROUTES (ADMIN QUẢN LÝ) ========================== //
Route::middleware(['auth:api', 'role:admin'])->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);               // ✅ Lấy danh sách roles
    Route::post('/', [RoleController::class, 'store']);              // ✅ Tạo role mới
    Route::post('/assign', [RoleController::class, 'assignToUser']); // ✅ Gán role cho user
});

// ======================= PERMISSIONS ROUTES (ADMIN QUẢN LÝ) ========================== //
Route::middleware(['auth:api', 'role:admin'])->prefix('permissions')->group(function () {
    Route::get('/', [PermissionController::class, 'index']);            // ✅ Lấy danh sách permissions
    Route::post('/', [PermissionController::class, 'store']);           // ✅ Tạo permission mới
    Route::post('/assign', [PermissionController::class, 'assignToRole']); // ✅ Gán permission cho role
});

// ======================= USER LIST (ADMIN) ========================== //
Route::middleware(['auth:api', 'role:admin'])->get('/users', function () {
    return \App\Models\User::with('role')->get(); // ✅ Lấy danh sách user + role
});

// ======================= TEST MIDDLEWARE ADMIN ========================== //
Route::middleware(['auth:api', 'role:admin'])->get('/admin/only', function () {
    return response()->json(['message' => 'Chỉ admin truy cập được']);
});
