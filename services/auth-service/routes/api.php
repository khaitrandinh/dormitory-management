<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    return response()->json([
        'message' => 'Login successful',
        'email' => $request->email
    ]);
});

