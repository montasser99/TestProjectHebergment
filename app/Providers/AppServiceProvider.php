<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        
        // Configure trusted proxies for Railway
        if (config('app.env') === 'production') {
            // Trust all proxies for Railway
            request()->setTrustedProxies(
                ['*'], 
                \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB
            );
            
            // Force HTTPS URL generation for all URLs
            URL::forceScheme('https');
            if (config('app.url')) {
                URL::forceRootUrl(config('app.url'));
            }
            
            // Force HTTPS for pagination and other Laravel components
            $this->app['request']->server->set('HTTPS', 'on');
        }
        
        // Always force HTTPS in production regardless of proxy headers
        if (config('app.env') === 'production' || config('app.force_https', false)) {
            URL::forceScheme('https');
        }
    }
}
