<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->hasRole('admin')) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Chỉ admin mới có thể truy cập'
        ], 403);
    }
}
