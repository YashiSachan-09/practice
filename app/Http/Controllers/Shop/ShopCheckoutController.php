<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CartResolver;
use App\Services\CheckoutOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopCheckoutController extends Controller
{
    public function __construct(
        private CheckoutOrderService $orders,
        private CartResolver $resolver
    ) {}

    public function preview(Request $request): JsonResponse
    {
        $cart = $this->resolver->cart()->loadMissing('items.product');
        $items = [];
        $subtotal = 0;

        foreach ($cart->items as $line) {
            $product = $line->product;
            if (! $product || ! $product->is_active) {
                continue;
            }

            $lt = round((float) $product->unit_price * (int) $line->quantity, 2);
            $subtotal += $lt;
            $items[] = [
                'sku' => $product->sku,
                'name' => $product->name,
                'quantity' => (int) $line->quantity,
                'line_total' => $lt,
            ];
        }

        $subtotal = round($subtotal, 2);
        $taxRate = (float) config('storefront.tax_rate', 0);
        $shipping = (float) config('storefront.shipping_flat_inr', 0);
        $tax = round($subtotal * $taxRate, 2);

        return response()->json([
            'data' => [
                'lines' => $items,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => round($subtotal + $tax + $shipping, 2),
            ],
        ]);
    }

    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:40'],
            'shipping_address' => ['required', 'string', 'max:5000'],
        ]);

        $cart = $this->resolver->cart()->loadMissing('items');

        /** @var int|null $userId */
        $userId = Auth::id();

        $result = $this->orders->createFromProductCart(
            $validated['customer_name'],
            $validated['customer_email'],
            $validated['customer_phone'] ?? null,
            $validated['shipping_address'],
            $cart->items,
            $userId
        );

        if (isset($result['error'])) {
            return response()->json(['message' => $result['error']], 422);
        }

        /** @var Order $order */
        $order = $result['order'];

        $cart->items()->delete();

        $pay = $this->orders->startPaymentOrComplete($order->fresh('items'));

        return response()->json([
            'data' => [
                'order' => [
                    'order_number' => $order->order_number,
                    'total' => (float) $order->total,
                ],
                'payment' => $pay,
                'confirmation_url' => route('order.confirmation', ['order_number' => $order->order_number]),
            ],
        ]);
    }
}
