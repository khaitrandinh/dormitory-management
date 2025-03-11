<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', function (Request $request) {
        return Http::post('http://auth-service:8000/api/auth/register', $request->all())->json();
    });

    Route::post('/login', function (Request $request) {
        return Http::post('http://auth-service:8000/api/auth/login', $request->all())->json();
    });

    Route::post('/logout', function (Request $request) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->post('http://auth-service:8000/api/auth/logout')->json();
    });

    Route::post('/refresh', function (Request $request) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->post('http://auth-service:8000/api/auth/refresh')->json();
    });

    Route::get('/user', function (Request $request) {
        return Http::withHeaders([
            'Authorization' => $request->header('Authorization')
        ])->get('http://auth-service:8000/api/auth/user')->json();
    });
});

