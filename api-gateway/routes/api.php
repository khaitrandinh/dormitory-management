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
