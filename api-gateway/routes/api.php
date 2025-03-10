<?php
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

Route::prefix('auth')->group(function () {
    Route::post('/login', function (Request $request) {
        Log::info('Gateway received login request', $request->all());

        $response = Http::post('http://auth-service:8001/api/login', $request->all());

        if ($response->failed()) {
            Log::error('Auth-service login failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return response()->json(['error' => 'Auth Service not available'], 500);
        }

        return $response->json();
    });
});

?>