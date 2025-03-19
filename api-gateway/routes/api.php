<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {

    // Đăng ký
    Route::post('/register', function (Request $request) {
        return Http::post('http://auth-service:8000/api/auth/register', $request->all())->json();
    });

    // Đăng nhập
    Route::post('/login', function (Request $request) {
        return Http::post('http://auth-service:8000/api/auth/login', $request->all())->json();
    });

    // Đăng xuất
    Route::post('/logout', function (Request $request) {
        return Http::withToken($request->bearerToken())
            ->post('http://auth-service:8000/api/auth/logout')
            ->json();
    });

    // Làm mới token
    Route::post('/refresh', function (Request $request) {
        return Http::withToken($request->bearerToken())
            ->post('http://auth-service:8000/api/auth/refresh')
            ->json();
    });

    // Lấy user hiện tại
    Route::get('/user', function (Request $request) {
        return Http::withToken($request->bearerToken())
            ->get('http://auth-service:8000/api/auth/user')
            ->json();
    });    
});


Route::prefix('rooms')->group(function () {
    Route::get('/', function (Request $request) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->get('http://room-service:8001/api/rooms')->json();
    });

    Route::get('/{id}', function (Request $request, $id) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->get("http://room-service:8001/api/rooms/{$id}")->json();
    });

    Route::post('/', function (Request $request) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->post('http://room-service:8001/api/rooms', $request->all())->json();
    });

    Route::put('/{id}', function (Request $request, $id) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->put("http://room-service:8001/api/rooms/{$id}", $request->all())->json();
    });

    Route::delete('/{id}', function (Request $request, $id) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->delete("http://room-service:8001/api/rooms/{$id}")->json();
    });
});

