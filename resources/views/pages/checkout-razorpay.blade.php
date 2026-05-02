@extends('layouts.gallery')

@section('meta_description')
    Complete payment securely with Razorpay.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-14 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto max-w-lg px-6 text-center lg:px-8">
            <p class="section-kicker">Payment</p>
            <h1 class="font-display mt-2 text-3xl text-slate-900 dark:text-white">Pay for order {{ $order->order_number }}</h1>
            <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Total due: <span class="font-semibold text-slate-900 dark:text-white">₹{{ number_format((float) $order->total, 2) }}</span>
            </p>
            <p id="pay-status" class="mt-6 text-sm text-slate-500 dark:text-slate-400">Opening Razorpay checkout…</p>
            <p class="mt-8 text-xs text-slate-500 dark:text-slate-400">
                If the window does not open, disable popup blockers or
                <button type="button" id="pay-manual" class="text-indigo-600 underline dark:text-indigo-400">click here to pay</button>.
            </p>
            <a href="{{ route('order.confirmation', ['order_number' => $order->order_number]) }}" class="mt-10 inline-block text-sm text-slate-500 underline dark:text-slate-400">Cancel and view order status</a>
        </div>
    </section>
@endsection

@push('head')
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
@endpush

@push('scripts')
    <script>
        (function () {
            const verifyUrl = @json(route('checkout.razorpay.verify'));
            const confirmationUrl = @json(route('order.confirmation', ['order_number' => $order->order_number]));
            const orderNumber = @json($order->order_number);
            const key = @json($razorpayKeyId);
            const rpOrderId = @json($razorpayOrderId);

            const statusEl = document.getElementById('pay-status');

            async function verifyPayment(response) {
                statusEl.textContent = 'Verifying payment…';
                try {
                    const res = await fetch(verifyUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            order_number: orderNumber,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (res.ok && data.redirect) {
                        window.location.href = data.redirect;
                        return;
                    }
                    statusEl.textContent = data.message || 'Payment verification failed. Please contact support with your order number.';
                } catch (e) {
                    statusEl.textContent = 'Network error. Your payment may still be processing — check order status or contact us.';
                }
            }

            const options = {
                key: key,
                order_id: rpOrderId,
                name: @json(config('app.name')),
                description: 'Order ' + orderNumber,
                prefill: {
                    name: @json($order->customer_name),
                    email: @json($order->customer_email),
                    contact: @json($order->customer_phone ?? ''),
                },
                theme: { color: '#4f46e5' },
                handler: verifyPayment,
                modal: {
                    ondismiss: function () {
                        statusEl.textContent = 'Checkout closed. You can retry payment below.';
                    },
                },
            };

            const rzp = new Razorpay(options);

            rzp.on('payment.failed', function (resp) {
                statusEl.textContent =
                    (resp.error && resp.error.description) || 'Payment failed. Try again or use another method.';
            });

            function openPay() {
                rzp.open();
            }

            document.getElementById('pay-manual').addEventListener('click', openPay);

            openPay();
        })();
    </script>
@endpush
