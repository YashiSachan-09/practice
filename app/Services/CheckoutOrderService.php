<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Throwable;

class CheckoutOrderService
{
    public function __construct(
        private RazorpayPaymentService $razorpay
    ) {}

    /**
     * Build order lines from products (DB) with stock checks.
     *
     * @param  array<string, mixed>  $validated  Customer fields + coupon optional later
     * @param  iterable<CartItem>|array<int, array{sku: string, quantity: int}>  $sources
     * @return array{order: Order, lines_snapshot: array<int, array<string, mixed>>, subtotal: float, tax: float, shipping: float, total: float}|array{error: string}
     */
    public function createFromProductCart(string $customerName, string $customerEmail, ?string $customerPhone, string $shippingAddress, iterable $cartItems, ?int $userId = null): array
    {
        $taxRate = (float) config('storefront.tax_rate', 0);
        $shipping = (float) config('storefront.shipping_flat_inr', 0);

        $lines = [];
        foreach ($cartItems as $row) {
            if (! $row instanceof CartItem) {
                return ['error' => __('Invalid cart payload.')];
            }

            $row->loadMissing('product');
            $product = $row->product;
            if (! $product instanceof Product || ! $product->is_active) {
                return ['error' => __('One or more products are no longer available.')];
            }

            $qty = (int) $row->quantity;
            if ($qty < 1) {
                continue;
            }

            if ($product->stock_quantity < $qty) {
                return ['error' => __('Insufficient stock for :name.', ['name' => $product->name])];
            }

            $unit = (float) $product->unit_price;
            $lineTotal = round($unit * $qty, 2);
            $lines[] = [
                'product' => $product,
                'product_name' => $product->name,
                'sku' => $product->sku,
                'quantity' => $qty,
                'unit_price' => $unit,
                'line_total' => $lineTotal,
            ];
        }

        if ($lines === []) {
            return ['error' => __('Your cart is empty.')];
        }

        $subtotal = round(collect($lines)->sum('line_total'), 2);
        $tax = round($subtotal * $taxRate, 2);
        $total = round($subtotal + $tax + $shipping, 2);

        $orderNumber = $this->generateUniqueOrderNumber();

        try {
            $order = DB::transaction(function () use ($lines, $subtotal, $tax, $shipping, $total, $orderNumber, $customerName, $customerEmail, $customerPhone, $shippingAddress, $userId): Order {
                $newOrder = Order::query()->create([
                    'user_id' => $userId,
                    'order_number' => $orderNumber,
                    'customer_name' => $customerName,
                    'customer_email' => $customerEmail,
                    'customer_phone' => $customerPhone ?: null,
                    'shipping_address' => $shippingAddress,
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'shipping_fee' => $shipping,
                    'total' => $total,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                foreach ($lines as $line) {
                    OrderItem::query()->create([
                        'order_id' => $newOrder->id,
                        'product_name' => $line['product_name'],
                        'sku' => $line['sku'],
                        'quantity' => $line['quantity'],
                        'unit_price' => $line['unit_price'],
                        'line_total' => $line['line_total'],
                    ]);

                    /** @var Product $p */
                    $p = $line['product'];
                    $p->stock_update_reason = 'order_placed';
                    $p->stock_update_notes = __('Stock deducted for order :number', ['number' => $orderNumber]);
                    $p->stock_quantity = max(0, (int) $p->stock_quantity - (int) $line['quantity']);
                    $p->save();
                }

                Customer::query()->updateOrCreate(
                    ['email' => $customerEmail],
                    [
                        'name' => $customerName,
                        'phone' => $customerPhone ?: null,
                    ]
                );

                return $newOrder->fresh('items');
            });
        } catch (Throwable $e) {
            report($e);

            return ['error' => __('Could not place order. Please try again.')];
        }

        return [
            'order' => $order,
            'lines_snapshot' => $lines,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
        ];
    }

    /**
     * After order created, optionally start Razorpay. Returns view name or redirect info for API.
     *
     * @return array{mode: 'razorpay', key_id: string, order_id: string, amount_paise: int, order_number: string}|array{mode: 'cod', redirect: string}
     */
    public function startPaymentOrComplete(Order $order): array
    {
        if (! $this->razorpay->isEnabled()) {
            return [
                'mode' => 'cod',
                'redirect' => route('order.confirmation', ['order_number' => $order->order_number]),
            ];
        }

        $amountPaise = (int) round(((float) $order->total) * 100);
        if ($amountPaise < 100) {
            return [
                'mode' => 'cod',
                'redirect' => route('order.confirmation', ['order_number' => $order->order_number]),
            ];
        }

        try {
            $rz = $this->razorpay->createOrder(
                $amountPaise,
                $order->order_number,
                [
                    'laravel_order_id' => (string) $order->id,
                    'customer_email' => $order->customer_email,
                ]
            );

            $order->razorpay_order_id = $rz['id'];
            $order->save();

            return [
                'mode' => 'razorpay',
                'key_id' => (string) config('razorpay.key_id'),
                'order_id' => $rz['id'],
                'amount_paise' => $amountPaise,
                'order_number' => $order->order_number,
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'mode' => 'cod',
                'redirect' => route('order.confirmation', ['order_number' => $order->order_number]),
            ];
        }
    }

    private function generateUniqueOrderNumber(): string
    {
        do {
            $orderNumber = sprintf(
                'AN-%s-%s',
                now()->format('Y'),
                strtoupper(substr(bin2hex(random_bytes(4)), 0, 8))
            );
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}
