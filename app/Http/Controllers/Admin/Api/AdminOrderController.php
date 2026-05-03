<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 30), 5), 100);

        $query = Order::query()->with('items')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->string('payment_status'));
        }

        if ($request->filled('q')) {
            $needle = '%'.$request->string('q')->trim().'%';
            $query->where(function ($q) use ($needle): void {
                $q->where('order_number', 'like', $needle)
                    ->orWhere('customer_name', 'like', $needle)
                    ->orWhere('customer_email', 'like', $needle);
            });
        }

        $paginator = $query->paginate($perPage);
        $paginator->through(fn (Order $order): array => $this->transformOrder($order));

        return response()->json($paginator);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'data' => $this->transformOrder($order->load('items')),
        ]);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(Order::STATUSES)],
            'payment_status' => ['sometimes', Rule::in(Order::PAYMENT_STATUSES)],
            'tracking_number' => ['nullable', 'string', 'max:120'],
            'admin_notes' => ['nullable', 'string', 'max:65000'],
        ]);

        if (array_key_exists('status', $validated)) {
            $order->status = $validated['status'];
            $order->syncProgressTimestamps();
            if ($order->status !== 'cancelled') {
                $order->cancelled_at = null;
            }
            unset($validated['status']);
        }

        $order->fill($validated);
        $order->save();

        return response()->json([
            'data' => $this->transformOrder($order->fresh('items')),
            'message' => __('Order updated.'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'user_id' => $order->user_id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'shipping_address' => $order->shipping_address,
            'subtotal' => $order->subtotal,
            'tax' => $order->tax,
            'shipping_fee' => $order->shipping_fee,
            'total' => $order->total,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'razorpay_order_id' => $order->razorpay_order_id,
            'razorpay_payment_id' => $order->razorpay_payment_id,
            'tracking_number' => $order->tracking_number,
            'admin_notes' => $order->admin_notes,
            'confirmed_at' => $order->confirmed_at?->toIso8601String(),
            'packed_at' => $order->packed_at?->toIso8601String(),
            'shipped_at' => $order->shipped_at?->toIso8601String(),
            'delivered_at' => $order->delivered_at?->toIso8601String(),
            'cancelled_at' => $order->cancelled_at?->toIso8601String(),
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
            'items' => $order->items->map(static fn ($item): array => [
                'product_name' => $item->product_name,
                'sku' => $item->sku,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
            ])->values()->all(),
        ];
    }
}
