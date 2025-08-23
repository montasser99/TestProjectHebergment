<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderManagerMiddleware
{
    /**
     * Handle an incoming request.
     * Permet l'accès aux utilisateurs admin ET gestionnaire_commande
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if (!auth()->user()->canManageOrders()) {
            return redirect()->route('unauthorized');
        }

        return $next($request);
    }
}
