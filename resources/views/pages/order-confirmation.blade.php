@extends('layouts.gallery')

@section('meta_description')
    Order confirmation for your A7 ANAYARAA acquisition.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-14 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-8 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
                    {{ session('status') }}
                </div>
            @endif

            <p class="section-kicker">Confirmed</p>
            <h1 class="font-display mt-2 text-4xl text-slate-900 dark:text-white">Order {{ $order->order_number }}</h1>
            <p class="mt-4 text-slate-600 dark:text-slate-300">
                Thank you, {{ $order->customer_name }}. Our desk will confirm payment and dispatch. You can reference this number in email or chat.
            </p>

            <dl class="mt-10 grid gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-sm dark:border-slate-700 dark:bg-slate-900/60">
                <div class="flex justify-between gap-4">
                    <dt class="text-slate-500 dark:text-slate-400">Total</dt>
                    <dd class="font-semibold text-slate-900 dark:text-white">₹{{ number_format((float) $order->total, 2) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                    <dt class="text-slate-500 dark:text-slate-400">Payment</dt>
                    <dd class="font-medium capitalize text-slate-800 dark:text-slate-200">
                        @if ($order->payment_status === 'paid')
                            <span class="text-emerald-700 dark:text-emerald-300">Paid online</span>
                        @else
                            {{ str_replace('_', ' ', $order->payment_status) }}
                        @endif
                    </dd>
                </div>
                <div class="flex justify-between gap-4">
                    <dt class="text-slate-500 dark:text-slate-400">Fulfilment</dt>
                    <dd class="font-medium capitalize text-slate-800 dark:text-slate-200">{{ $order->status }}</dd>
                </div>
            </dl>

            <div class="mt-10">
                <h2 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Line items</h2>
                <ul class="mt-4 space-y-3 text-sm">
                    @foreach ($order->items as $item)
                        <li class="flex flex-wrap justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                            <span class="text-slate-800 dark:text-slate-100">{{ $item->product_name }} @if ($item->sku)<span class="text-slate-500">({{ $item->sku }})</span>@endif × {{ $item->quantity }}</span>
                            <span class="font-medium text-slate-900 dark:text-white">₹{{ number_format((float) $item->line_total, 2) }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="mt-12 flex flex-wrap gap-4">
                <a href="{{ route('home') }}" class="btn-outline">Back home</a>
                <a href="{{ route('marketplace') }}" class="btn-primary">Continue browsing</a>
            </div>
        </div>
    </section>
@endsection
