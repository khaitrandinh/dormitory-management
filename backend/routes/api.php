<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RepairRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});
Route::middleware(['auth:api'])->group(function () {
    Route::get('/students', [StudentController::class, 'index']); // Lấy danh sách sinh viên
    Route::get('/students/{id}', [StudentController::class, 'show']); // Lấy chi tiết sinh viên
    Route::post('/students', [StudentController::class, 'store']); // Tạo sinh viên
    Route::put('/students/{id}', [StudentController::class, 'update']); // Cập nhật sinh viên
    Route::delete('/students/{id}', [StudentController::class, 'destroy']); // Xóa sinh viên
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/rooms', [RoomController::class, 'index']); // Lấy danh sách phòng
    Route::get('/rooms/{id}', [RoomController::class, 'show']); // Lấy chi tiết phòng
    Route::post('/rooms', [RoomController::class, 'store']); // Tạo phòng
    Route::put('/rooms/{id}', [RoomController::class, 'update']); // Cập nhật phòng
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']); // Xóa phòng
});


Route::middleware(['auth:api'])->group(function () {
    Route::get('/contracts', [ContractController::class, 'index']); // Lấy danh sách hợp đồng
    Route::get('/contracts/{id}', [ContractController::class, 'show']); // Lấy chi tiết hợp đồng
    Route::post('/contracts', [ContractController::class, 'store']); // Tạo hợp đồng
    Route::put('/contracts/{id}', [ContractController::class, 'update']); // Cập nhật hợp đồng
    Route::delete('/contracts/{id}', [ContractController::class, 'destroy']); // Xóa hợp đồng
});



Route::middleware(['auth:api'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'index']); // Lấy danh sách thanh toán
    Route::get('/payments/{id}', [PaymentController::class, 'show']); // Lấy chi tiết thanh toán
    Route::post('/payments', [PaymentController::class, 'store']); // Tạo thanh toán
    Route::put('/payments/{id}', [PaymentController::class, 'update']); // Cập nhật thanh toán
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']); // Xóa thanh toán
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
