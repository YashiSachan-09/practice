<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\RazorpayPaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Throwable;

class ShopRazorpayWebhookController extends Controller
{
    public function __construct(
        private RazorpayPaymentService $razorpay
    ) {}

    public function __invoke(Request $request): Response
    {
        $raw = $request->getContent();
        $sig = $request->header('X-Razorpay-Signature');

        if (! $this->razorpay->verifyWebhookSignature($raw, $sig)) {
            return response('invalid signature', 400);
        }

        try {
            /** @var array<string, mixed> $payload */
            $payload = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            return response('bad json', 400);
        }

        $event = $payload['event'] ?? null;
        if (! is_string($event)) {
            return response('no event', 200);
        }

        if ($event !== 'payment.captured') {
            return response('ignored', 200);
        }

        $entity = $payload['payload']['payment']['entity'] ?? null;
        if (! is_array($entity)) {
            return response('no entity', 200);
        }

        $rzOrderId = $entity['order_id'] ?? null;
        $paymentId = $entity['id'] ?? null;

        if (! is_string($rzOrderId) || $rzOrderId === '') {
            return response('no order id', 200);
        }

        $order = Order::query()->where('razorpay_order_id', $rzOrderId)->first();
        if (! $order) {
            return response('order not found', 200);
        }

        if ($order->payment_status !== 'paid') {
            $order->payment_status = 'paid';
            if (is_string($paymentId) && $paymentId !== '') {
                $order->razorpay_payment_id = $paymentId;
            }
            $order->save();
        }

        return response('ok', 200);
    }
}
