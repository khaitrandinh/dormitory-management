<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Thêm dòng này
    Route::post('/logout', [AuthController::class, 'logout']);   // Thêm dòng này
    Route::middleware('auth:api')->get('/user', [AuthController::class, 'user']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin-only', function () {
        return response()->json([
            'message' => 'Welcome Admin, you have access to this API!',
            'data' => [
                'example' => 'This is a protected resource only for admin'
            ]
        ]);
    });
});


Route::middleware(['auth:api', 'role:student'])->get('/student/dashboard', function () {
    return response()->json(['message' => 'Welcome Student']);
});

Route::middleware(['auth:api', 'role:admin,student'])->get('/both/dashboard', function () {
    return response()->json(['message' => 'Welcome Admin or Student']);
});
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::post('/roles/create', [RoleController::class, 'createRole']);
    Route::post('/permissions/create', [RoleController::class, 'createPermission']);
    Route::post('/roles/assign', [RoleController::class, 'assignRole']);
    Route::post('/permissions/assign', [RoleController::class, 'assignPermission']);
});

