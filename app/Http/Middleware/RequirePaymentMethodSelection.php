<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePaymentMethodSelection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si l'utilisateur n'est pas client, passer
        if (!auth()->check() || auth()->user()->role !== 'client') {
            return $next($request);
        }

        // Si on est déjà sur la page de sélection de méthode, passer
        if ($request->routeIs('client.payment-method')) {
            return $next($request);
        }

        // Vérifier si une méthode de paiement est fournie dans la requête
        if (!$request->has('payment_method_id')) {
            return redirect()->route('client.payment-method')
                ->with('warning', 'Veuillez d\'abord sélectionner une méthode de paiement.');
        }

        return $next($request);
    }
}
