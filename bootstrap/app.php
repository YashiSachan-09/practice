<?php

use App\Http\Middleware\EnsureAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => EnsureAdmin::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'shop/webhooks/razorpay',
        ]);
        $middleware->redirectGuestsTo(function (Request $request): string {
            if ($request->is('admin*')) {
                return route('admin.login');
            }

            return url('/shop');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
