<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var int $uid */
        $uid = Auth::id();

        $perPage = min(max($request->integer('per_page', 20), 1), 50);

        $paginator = Order::query()
            ->where('user_id', $uid)
            ->with('items')
            ->latest()
            ->paginate($perPage);

        $paginator->through(fn (Order $o): array => $this->summarizeOrder($o));

        return response()->json($paginator);
    }

    public function show(string $order_number): JsonResponse
    {
        /** @var int $uid */
        $uid = Auth::id();

        /** @var Order $order */
        $order = Order::query()
            ->where('user_id', $uid)
            ->where('order_number', $order_number)
            ->with('items')
            ->firstOrFail();

        return response()->json(['data' => $this->fullOrder($order)]);
    }

    /**
     * @return array<string, mixed>
     */
    private function summarizeOrder(Order $o): array
    {
        return [
            'order_number' => $o->order_number,
            'total' => (float) $o->total,
            'status' => $o->status,
            'payment_status' => $o->payment_status,
            'created_at' => $o->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function fullOrder(Order $o): array
    {
        return [
            'order_number' => $o->order_number,
            'customer_name' => $o->customer_name,
            'customer_email' => $o->customer_email,
            'customer_phone' => $o->customer_phone,
            'shipping_address' => $o->shipping_address,
            'subtotal' => (float) $o->subtotal,
            'tax' => (float) $o->tax,
            'shipping_fee' => (float) $o->shipping_fee,
            'total' => (float) $o->total,
            'status' => $o->status,
            'payment_status' => $o->payment_status,
            'tracking_number' => $o->tracking_number,
            'created_at' => $o->created_at?->toIso8601String(),
            'items' => $o->items->map(static fn ($i): array => [
                'product_name' => $i->product_name,
                'sku' => $i->sku,
                'quantity' => $i->quantity,
                'unit_price' => (float) $i->unit_price,
                'line_total' => (float) $i->line_total,
            ])->values()->all(),
        ];
    }
}
