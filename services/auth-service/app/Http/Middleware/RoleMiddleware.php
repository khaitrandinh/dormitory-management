<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class RoleMiddleware
{
    public function handle($request, Closure $next, $role)
    {
        if (! $request->user() || ! $request->user()->roles->contains('name', $role)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $next($request);
    }

}


