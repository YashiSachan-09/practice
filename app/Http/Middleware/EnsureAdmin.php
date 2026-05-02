<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (! $user?->is_admin) {
            return redirect()
                ->route('admin.login')
                ->withErrors([
                    'email' => __('You must sign in with an administrator account.'),
                ]);
        }

        return $next($request);
    }
}
