<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class RazorpayPaymentService
{
    private const ORDERS_URL = 'https://api.razorpay.com/v1/orders';
    private const PAYMENTS_URL = 'https://api.razorpay.com/v1/payments';

    public function isEnabled(): bool
    {
        return (bool) config('razorpay.enabled');
    }

    /**
     * Create a refund for a payment.
     *
     * @param  string  $paymentId  Razorpay Payment ID (pay_...)
     * @param  int|null  $amountPaise  Amount in paise. If null, full refund is processed.
     * @param  array<string, string>  $notes
     * @return array<string, mixed>
     */
    public function refund(string $paymentId, ?int $amountPaise = null, array $notes = []): array
    {
        $keyId = config('razorpay.key_id');
        $keySecret = config('razorpay.key_secret');

        $payload = ['notes' => $notes];
        if ($amountPaise !== null) {
            $payload['amount'] = $amountPaise;
        }

        $response = Http::withBasicAuth($keyId, $keySecret)
            ->acceptJson()
            ->asJson()
            ->post(self::PAYMENTS_URL . '/' . $paymentId . '/refund', $payload);

        if ($response->failed()) {
            throw new RuntimeException(
                'Razorpay refund failed: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json();
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

    /**
     * Verify Razorpay webhook signature (raw request body).
     */
    public function verifyWebhookSignature(string $rawPayload, ?string $razorpaySignatureHeader): bool
    {
        if (! is_string($razorpaySignatureHeader) || $razorpaySignatureHeader === '') {
            return false;
        }

        $secret = config('razorpay.webhook_secret');
        if (! is_string($secret) || $secret === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $rawPayload, $secret);

        return hash_equals($expected, $razorpaySignatureHeader);
    }
}
