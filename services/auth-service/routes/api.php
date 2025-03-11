<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;

// Các route auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->get('/user', [AuthController::class, 'user']);
    Route::middleware('auth:api')->post('/refresh', [AuthController::class, 'refresh']);
    Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);
});

// Các route role, permission
Route::middleware('auth:api')->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::post('/roles/assign', [RoleController::class, 'assignToUser']);

    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::post('/permissions/assign', [PermissionController::class, 'assignToRole']);
});

// 📌 Route test middleware role admin
Route::middleware(['auth:api', 'role:admin'])->get('/admin/only', function () {
    return response()->json(['message' => 'Chỉ admin truy cập được']);
});
// Route test quyền "view_users"
Route::middleware(['auth:api', 'permission:view_users'])->get('/users', function () {
    return "Bạn có quyền xem user";
});

Route::middleware(['auth:api', 'permission:view_users'])->get('/users', function () {
    return \App\Models\User::all();
});
