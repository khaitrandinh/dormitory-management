<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route lấy thông tin user (dành cho request có token hợp lệ)
Route::middleware('auth.api')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes cho RoomController (Bảo mật bằng auth.api)
Route::middleware('auth.api')->group(function () {
    Route::get('/rooms', [RoomController::class, 'index']); // Lấy danh sách phòng
    Route::get('/rooms/{id}', [RoomController::class, 'show']); // Lấy thông tin phòng theo ID
    Route::post('/rooms', [RoomController::class, 'store']); // Thêm phòng
    Route::put('/rooms/{id}', [RoomController::class, 'update']); // Cập nhật phòng
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']); // Xóa phòng
});

?>
