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
        // Detect if we're behind a proxy (Railway) and the original request was HTTPS
        $isHttps = $request->secure() || 
                   $request->header('X-Forwarded-Proto') === 'https' ||
                   $request->header('X-Forwarded-Ssl') === 'on' ||
                   $request->header('HTTP_X_FORWARDED_PROTO') === 'https';

        // Force HTTPS redirect only if we're in production and the original request was HTTP
        if (config('app.env') === 'production' && !$isHttps && !$request->ajax()) {
            return redirect('https://' . $request->getHost() . $request->getRequestUri(), 301);
        }

        $response = $next($request);
        
        // Add security headers only in production
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            
            // Clear problematic cookies once (not on every request)
            if ($request->hasSession() && !$request->session()->has('cookies_cleared')) {
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
                
                $request->session()->put('cookies_cleared', true);
            }
        }

        return $response;
    }
}