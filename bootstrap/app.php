<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\ForceHttps::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

            // Ajouter les alias pour les middlewares
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        'order.manager' => \App\Http\Middleware\OrderManagerMiddleware::class,
    ]);


    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
