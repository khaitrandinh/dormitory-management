<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    public function auth()
    {
        $response = Http::get('http://auth-service:8001/api/ping');
        return $response->json();
    }

    // public function notification()
    // {
    //     $response = Http::get('http://notification-service:8001/api/ping');
    //     return $response->json();
    // }
}
