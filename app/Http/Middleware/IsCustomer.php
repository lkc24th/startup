<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->hasRole('customer')) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Chỉ khách hàng mới có thể truy cập'
        ], 403);
    }
}