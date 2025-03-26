<?php
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

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});
Route::middleware(['auth:api'])->group(function () {
    Route::get('/students', [StudentController::class, 'index']); 
    Route::get('/students/{id}', [StudentController::class, 'show']); 
    Route::post('/students', [StudentController::class, 'store']); 
    Route::put('/students/{id}', [StudentController::class, 'update']); 
    Route::delete('/students/{id}', [StudentController::class, 'destroy']); 
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/rooms', [RoomController::class, 'index']); // Lấy danh sách phòng
    Route::get('/rooms/{id}', [RoomController::class, 'show']); // Lấy chi tiết phòng
    Route::post('/rooms', [RoomController::class, 'store']); // Tạo phòng
    Route::put('/rooms/{id}', [RoomController::class, 'update']); // Cập nhật phòng
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']); // Xóa phòng
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/contracts', [ContractController::class, 'index']); 
    Route::get('/contracts/{id}', [ContractController::class, 'show']); 
    Route::post('/contracts', [ContractController::class, 'store']); 
    Route::put('/contracts/{id}', [ContractController::class, 'update']); 
    Route::delete('/contracts/{id}', [ContractController::class, 'destroy']); 
});



Route::middleware(['auth:api'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'index']); 
    Route::get('/payments/{id}', [PaymentController::class, 'show']); 
    Route::post('/payments', [PaymentController::class, 'store']); 
    Route::put('/payments/{id}', [PaymentController::class, 'update']); 
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']); 
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/repair-requests', [RepairRequestController::class, 'index']);
    Route::get('/repair-requests/{id}', [RepairRequestController::class, 'show']);
    Route::post('/repair-requests', [RepairRequestController::class, 'store']);
    Route::put('/repair-requests/{id}', [RepairRequestController::class, 'update']);
    Route::delete('/repair-requests/{id}', [RepairRequestController::class, 'destroy']);
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});




Route::middleware(['auth:api'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);       // Danh sách
    Route::get('/users/{id}', [UserController::class, 'show']);   // Chi tiết
    Route::put('/users/{id}', [UserController::class, 'update']); // Cập nhật
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Xóa
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']); 
});

// API cho User (Chỉ có thể xem & cập nhật thông tin cá nhân)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/users/{id}', [UserController::class, 'show']);   
    Route::put('/users/{id}', [UserController::class, 'update']); 
});

// API cho Admin (Quản lý người dùng)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
});
Route::middleware(['auth:api'])->group(function () {
    Route::post('/payos/initiate', [PaymentController::class, 'initiatePayOS']);
    Route::post('/payos/webhook', [PaymentController::class, 'handlePayOSWebhook']);    
});
