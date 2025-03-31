<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RepairRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Authenticated routes
// middleware('auth:api') ensures that the routes are protected and require authentication 
// using JWT (JSON Web Tokens). This means that only authenticated users can access these routes.
// The 'auth:api' middleware checks the incoming request for a valid JWT token.  
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    // Students
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    Route::put('/students/{id}/approve-room', [StudentController::class, 'approveRoom']);
    Route::put('/students/{id}/reject-room', [StudentController::class, 'rejectRoom']);
    Route::put('/students/{id}/approve-cancel-room', [StudentController::class, 'approveCancelRoom']);
    Route::put('/students/{id}/reject-cancel-room', [StudentController::class, 'rejectCancelRoom']);


    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    // Contracts
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::get('/contracts/{id}', [ContractController::class, 'show']);
    Route::post('/contracts', [ContractController::class, 'store']);
    Route::put('/contracts/{id}', [ContractController::class, 'update']);
    Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{id}', [PaymentController::class, 'update']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    Route::post('/payments/{id}/remind', [PaymentController::class, 'remind']);

    // PayOS
    Route::post('/payos/initiate', [PaymentController::class, 'initiatePayOS']);
    Route::post('/payos/webhook', [PaymentController::class, 'handlePayOSWebhook']);


    // Repair Requests
    Route::get('/repair-requests', [RepairRequestController::class, 'index']);
    Route::get('/repair-requests/{id}', [RepairRequestController::class, 'show']);
    Route::post('/repair-requests', [RepairRequestController::class, 'store']);
    Route::put('/repair-requests/{id}', [RepairRequestController::class, 'update']);
    Route::delete('/repair-requests/{id}', [RepairRequestController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Users (user & admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Admin-specific user management
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
