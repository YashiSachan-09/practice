<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class CartResolver
{
    public const COOKIE_NAME = 'anayra_cart_token';

    public function __construct(private Request $request) {}

    public function cart(): Cart
    {
        if ($user = Auth::user()) {
            return $this->resolveForUser($user);
        }

        return $this->resolveForGuest();
    }

    public function mergeGuestCartInto(User $user): void
    {
        $token = $this->request->cookies->get(self::COOKIE_NAME);
        if (! is_string($token) || $token === '') {
            return;
        }

        /** @var Cart|null $guest */
        $guest = Cart::query()->where('guest_token', $token)->first();
        if (! $guest) {
            return;
        }

        $userCart = $this->resolveForUser($user);

        foreach ($guest->items as $guestLine) {
            /** @var CartItem $guestLine */
            $existing = $userCart->items()->where('product_id', $guestLine->product_id)->first();
            if ($existing) {
                $existing->quantity = min(65535, (int) $existing->quantity + (int) $guestLine->quantity);
                $existing->save();
                $guestLine->delete();

                continue;
            }

            $guestLine->cart_id = $userCart->id;
            $guestLine->save();
        }

        $guest->refresh();
        if ($guest->items()->doesntExist()) {
            $guest->delete();
        }

        Cookie::queue(Cookie::forget(self::COOKIE_NAME));
    }

    protected function resolveForUser(User $user): Cart
    {
        /** @var Cart $cart */
        $cart = Cart::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['guest_token' => null]
        );

        return $cart->loadMissing('items');
    }

    protected function resolveForGuest(): Cart
    {
        $token = $this->request->cookies->get(self::COOKIE_NAME);

        if (! is_string($token) || strlen($token) < 16) {
            $token = Str::uuid()->toString();
            cookie()->queue(cookie(self::COOKIE_NAME, $token, 60 * 24 * 180)->httpOnly(false));
        }

        /** @var Cart $cart */
        $cart = Cart::query()->firstOrCreate(
            ['guest_token' => $token],
            ['user_id' => null]
        );

        return $cart->loadMissing('items');
    }
}
