@extends('layouts.gallery')

@section('meta_description')
    Complete your A7 ANAYARAA acquisition with secure guest checkout. Totals and tax are confirmed on the server.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-12 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
            <p class="section-kicker">Checkout</p>
            <h1 class="font-display mt-2 text-4xl text-slate-900 dark:text-white">Place your order</h1>
            <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Prices, tax ({{ (float) config('storefront.tax_rate', 0) * 100 }}% on subtotal), and shipping are calculated on the server.
                @if ($razorpayEnabled)
                    After you submit, your order is created and the <strong class="font-semibold text-slate-800 dark:text-slate-200">Razorpay</strong> window opens (UPI, cards, net banking). Successful payment is saved automatically.
                @else
                    Add <code class="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">RAZORPAY_KEY_ID</code> and <code class="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">RAZORPAY_KEY_SECRET</code> to <code class="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">.env</code> for online pay; until then, orders stay payment-pending for manual follow-up.
                @endif
            </p>
        </div>
    </section>

    <section class="bg-slate-50 py-14 dark:bg-slate-900/80">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
            @if ($errors->any())
                <div class="mb-8 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
                    <ul class="list-inside list-disc space-y-1">
                        @foreach ($errors->all() as $e)
                            <li>{{ $e }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('checkout.submit') }}" method="post" class="space-y-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                @csrf

                <div class="space-y-5">
                    <h2 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Works</h2>
                    @foreach ([0, 1, 2] as $index)
                        <div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                            <div>
                                <label class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Artwork {{ $index + 1 }}</label>
                                <select
                                    name="items[{{ $index }}][sku]"
                                    class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                                >
                                    <option value="">— Skip this line —</option>
                                    @foreach ($catalog as $sku => $meta)
                                        <option value="{{ $sku }}" @selected($preselectSku === $sku && $index === 0)>{{ $meta['name'] }} · ₹{{ number_format($meta['unit_price'], 0) }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="w-full sm:w-28">
                                <label class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Qty</label>
                                <input
                                    type="number"
                                    name="items[{{ $index }}][quantity]"
                                    min="1"
                                    max="50"
                                    value="{{ $index === 0 && $preselectSku ? '1' : '1' }}"
                                    class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                                />
                            </div>
                        </div>
                    @endforeach
                    <p class="text-xs text-slate-500 dark:text-slate-400">Choose at least one work with quantity ≥ 1. Empty rows are ignored.</p>
                </div>

                <div class="space-y-5 border-t border-slate-200 pt-10 dark:border-slate-700">
                    <h2 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Shipping &amp; contact</h2>
                    <div>
                        <label for="customer_name" class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Full name</label>
                        <input id="customer_name" name="customer_name" type="text" value="{{ old('customer_name') }}" required maxlength="120" class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" autocomplete="name" />
                    </div>
                    <div class="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label for="customer_email" class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Email</label>
                            <input id="customer_email" name="customer_email" type="email" value="{{ old('customer_email') }}" required class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" autocomplete="email" />
                        </div>
                        <div>
                            <label for="customer_phone" class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Phone (optional)</label>
                            <input id="customer_phone" name="customer_phone" type="text" value="{{ old('customer_phone') }}" maxlength="40" class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" autocomplete="tel" />
                        </div>
                    </div>
                    <div>
                        <label for="shipping_address" class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Shipping address</label>
                        <textarea id="shipping_address" name="shipping_address" rows="4" required maxlength="5000" class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100">{{ old('shipping_address') }}</textarea>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-700">
                    <a href="{{ route('marketplace') }}" class="text-sm text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">← Back to marketplace</a>
                    <button type="submit" class="btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]">Submit order</button>
                </div>
            </form>
        </div>
    </section>
@endsection
