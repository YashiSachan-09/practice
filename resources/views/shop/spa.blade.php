<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="min-h-screen scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name') }} · Shop</title>
    @vite(['resources/css/app.css', 'resources/js/shop/main.jsx'])
    @php
        $shopPayload = [
            'csrf' => csrf_token(),
            'appName' => config('app.name'),
            'galleryHomeUrl' => route('home'),
            'razorpayVerifyUrl' => route('checkout.razorpay.verify'),
            'routes' => [
                'confirmation' => url('/order/confirmation'),
                'admin' => url('/admin/dashboard'),
            ],
        ];
    @endphp
    <script>
        window.__ANAYRA_SHOP__ = @json($shopPayload);
    </script>
</head>

<body class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
    <div id="shop-root" class="min-h-screen"></div>
</body>

</html>
