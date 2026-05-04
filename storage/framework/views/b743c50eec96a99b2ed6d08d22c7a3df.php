<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="min-h-screen scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e(config('app.name')); ?> · Shop</title>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/shop/main.jsx']); ?>
    <?php
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
    ?>
    <script>
        window.__ANAYRA_SHOP__ = <?php echo json_encode($shopPayload, 15, 512) ?>;
    </script>
</head>

<body class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
    <div id="shop-root" class="min-h-screen"></div>
</body>

</html>
<?php /**PATH C:\anayra\anayra\resources\views/shop/spa.blade.php ENDPATH**/ ?>