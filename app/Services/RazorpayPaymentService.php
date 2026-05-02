<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class RazorpayPaymentService
{
    private const ORDERS_URL = 'https://api.razorpay.com/v1/orders';

    public function isEnabled(): bool
    {
        return (bool) config('razorpay.enabled');
    }

    /**
     * @param  array<string, string>  $notes
     * @return array{id: string, amount: int, currency: string, receipt: string|null}
     */
    public function createOrder(int $amountPaise, string $receipt, array $notes = []): array
    {
        $keyId = config('razorpay.key_id');
        $keySecret = config('razorpay.key_secret');

        if (! is_string($keyId) || ! is_string($keySecret) || $keyId === '' || $keySecret === '') {
            throw new RuntimeException('Razorpay keys are not configured.');
        }

        $response = Http::withBasicAuth($keyId, $keySecret)
            ->acceptJson()
            ->asJson()
            ->post(self::ORDERS_URL, [
                'amount' => $amountPaise,
                'currency' => 'INR',
                'receipt' => mb_substr($receipt, 0, 40),
                'payment_capture' => 1,
                'notes' => $notes,
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Razorpay order failed: '.$response->body(),
                $response->status()
            );
        }

        /** @var array{id: string, amount: int, currency: string, receipt: string|null} $data */
        $data = $response->json();

        return $data;
    }

    public function verifyPaymentSignature(string $razorpayOrderId, string $razorpayPaymentId, string $razorpaySignature): bool
    {
        $secret = config('razorpay.key_secret');
        if (! is_string($secret) || $secret === '') {
            return false;
        }

        $payload = $razorpayOrderId.'|'.$razorpayPaymentId;
        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $razorpaySignature);
    }
}
