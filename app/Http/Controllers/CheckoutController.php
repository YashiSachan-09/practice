<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\RazorpayPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Throwable;

class CheckoutController extends Controller
{
    public function __construct(
        private RazorpayPaymentService $razorpay
    ) {}

    public function show(Request $request): View
    {
        $catalog = config('storefront.catalog', []);
        $preselectSku = $request->string('sku')->toString();
        if ($preselectSku !== '' && ! array_key_exists($preselectSku, $catalog)) {
            $preselectSku = '';
        }

        return view('pages.checkout', [
            'title' => 'Checkout — A7 ANAYARAA',
            'catalog' => $catalog,
            'preselectSku' => $preselectSku,
            'razorpayEnabled' => $this->razorpay->isEnabled(),
        ]);
    }

    public function submit(Request $request): RedirectResponse|View
    {
        $skus = array_keys(config('storefront.catalog', []));

        $items = collect($request->input('items', []))
            ->filter(function (array $r): bool {
                $sku = $r['sku'] ?? null;
                $qty = (int) ($r['quantity'] ?? 0);

                return is_string($sku) && $sku !== '' && $qty > 0;
            })
            ->values()
            ->all();
        $request->merge(['items' => $items]);

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:40'],
            'shipping_address' => ['required', 'string', 'max:5000'],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.sku' => ['required', 'string', Rule::in($skus)],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $taxRate = (float) config('storefront.tax_rate', 0);
        $shipping = (float) config('storefront.shipping_flat_inr', 0);
        $catalog = config('storefront.catalog', []);

        $lines = [];
        foreach ($validated['items'] as $row) {
            $sku = $row['sku'];
            $qty = $row['quantity'];
            $meta = $catalog[$sku];
            $unit = (float) $meta['unit_price'];
            $lineTotal = round($unit * $qty, 2);
            $lines[] = [
                'product_name' => $meta['name'],
                'sku' => $sku,
                'quantity' => $qty,
                'unit_price' => $unit,
                'line_total' => $lineTotal,
            ];
        }

        $subtotal = round(collect($lines)->sum('line_total'), 2);
        $tax = round($subtotal * $taxRate, 2);
        $total = round($subtotal + $tax + $shipping, 2);

        $orderNumber = $this->generateUniqueOrderNumber();

        $order = DB::transaction(function () use ($validated, $lines, $subtotal, $tax, $shipping, $total, $orderNumber): Order {
            $newOrder = Order::query()->create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?: null,
                'shipping_address' => $validated['shipping_address'],
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
            }

            Customer::query()->updateOrCreate(
                ['email' => $validated['customer_email']],
                [
                    'name' => $validated['customer_name'],
                    'phone' => $validated['customer_phone'] ?: null,
                ]
            );

            return $newOrder->fresh('items');
        });

        if ($this->razorpay->isEnabled()) {
            $amountPaise = (int) round(((float) $order->total) * 100);
            if ($amountPaise < 100) {
                return redirect()
                    ->route('checkout')
                    ->withErrors(['items' => __('Order total must be at least ₹1 for online payment.')]);
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

                return view('pages.checkout-razorpay', [
                    'title' => 'Pay — A7 ANAYARAA',
                    'order' => $order->fresh('items'),
                    'razorpayKeyId' => config('razorpay.key_id'),
                    'razorpayOrderId' => $rz['id'],
                ]);
            } catch (Throwable $e) {
                report($e);

                return redirect()
                    ->route('order.confirmation', ['order_number' => $order->order_number])
                    ->with(
                        'status',
                        __('Order :number was saved. Online payment could not start — we will contact you for payment.', ['number' => $order->order_number])
                    );
            }
        }

        return redirect()
            ->route('order.confirmation', ['order_number' => $orderNumber])
            ->with(
                'status',
                __('Your order :number was placed. You will receive confirmation by email.', ['number' => $orderNumber])
            );
    }

    public function verifyRazorpay(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_number' => ['required', 'string'],
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        $order = Order::query()
            ->where('order_number', $data['order_number'])
            ->firstOrFail();

        if ($order->payment_status === 'paid') {
            return response()->json([
                'redirect' => route('order.confirmation', ['order_number' => $order->order_number]),
            ]);
        }

        if ($order->razorpay_order_id !== $data['razorpay_order_id']) {
            return response()->json(['message' => __('Invalid payment session.')], 403);
        }

        if (! $this->razorpay->verifyPaymentSignature(
            $data['razorpay_order_id'],
            $data['razorpay_payment_id'],
            $data['razorpay_signature']
        )) {
            return response()->json(['message' => __('Payment verification failed.')], 422);
        }

        $order->payment_status = 'paid';
        $order->razorpay_payment_id = $data['razorpay_payment_id'];
        $order->save();

        return response()->json([
            'redirect' => route('order.confirmation', ['order_number' => $order->order_number]),
        ]);
    }

    public function confirmation(string $order_number): View
    {
        $order = Order::query()
            ->with('items')
            ->where('order_number', $order_number)
            ->firstOrFail();

        return view('pages.order-confirmation', [
            'title' => 'Order '.$order->order_number.' — A7 ANAYARAA',
            'order' => $order,
        ]);
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
