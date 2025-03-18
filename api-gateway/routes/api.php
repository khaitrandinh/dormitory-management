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

Route::prefix('students')->group(function () {
    Route::get('/', function (Request $request) {
        return Http::get('http://student-service:8000/api/students')->json();
    });

    Route::post('/', function (Request $request) {
        return Http::post('http://student-service:8000/api/students', $request->all())->json();
    });

    Route::get('/{id}', function ($id) {
        return Http::get("http://student-service:8000/api/students/{$id}")->json();
    });

    Route::put('/{id}', function (Request $request, $id) {
        return Http::put("http://student-service:8000/api/students/{$id}", $request->all())->json();
    });

    Route::delete('/{id}', function ($id) {
        return Http::delete("http://student-service:8000/api/students/{$id}")->json();
    });
});

