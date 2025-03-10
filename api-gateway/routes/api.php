<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', function (Request $request) {
        $response = Http::post('http://auth-service:8000/api/auth/register', $request->all());
        return response()->json($response->json(), $response->status());
    });

    Route::post('/login', function (Request $request) {
        $response = Http::post('http://auth-service:8000/api/auth/login', $request->all());
        return response()->json($response->json(), $response->status());
    });

    Route::middleware('auth:api')->get('/user', function (Request $request) {
        $token = $request->bearerToken();
        $response = Http::withToken($token)->get('http://auth-service:8000/api/auth/user');
        return response()->json($response->json(), $response->status());
    });
});
