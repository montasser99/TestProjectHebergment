<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttps
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force HTTPS in production
        if (config('app.env') === 'production' && !$request->secure()) {
            return redirect()->secure($request->getRequestUri(), 301);
        }

        $response = $next($request);
        
        // Add security headers for HTTPS
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            
            // Clear old HTTP cookies by setting them to expire
            $cookiesToClear = [
                config('session.cookie', 'laravel_session'),
                'remember_token',
                'XSRF-TOKEN'
            ];
            
            foreach ($cookiesToClear as $cookieName) {
                if ($request->hasCookie($cookieName)) {
                    // Clear the cookie by setting it to expire in the past
                    $response->headers->setCookie(
                        cookie($cookieName, '', -1, '/', null, true, true, false, 'None')
                    );
                }
            }
        }

        return $response;
    }
}