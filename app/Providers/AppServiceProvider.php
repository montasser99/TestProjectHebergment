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
            request()->setTrustedProxies(['*'], \Illuminate\Http\Request::HEADER_X_FORWARDED_ALL);
            
            // Force HTTPS URL generation
            URL::forceScheme('https');
            if (config('app.url')) {
                URL::forceRootUrl(config('app.url'));
            }
        }
    }
}
