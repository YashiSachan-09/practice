<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="h-full scroll-smooth overflow-x-hidden">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title><?php echo e(config('app.name')); ?> · Admin</title>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/admin/main.jsx']); ?>
    <?php
        $brandAdminPayload = [
            'user' => [
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
            'logoutUrl' => route('admin.logout'),
            'csrf' => csrf_token(),
            'marketplaceUrl' => route('home'),
            'routes' => [
                'home' => route('home'),
                'marketplace' => route('marketplace'),
                'contact' => route('contact'),
            ],
        ];
    ?>
    <script>
        (() => {
            const stored = localStorage.getItem('a7-anayaraa-theme');
            const theme = stored === 'dark' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        })();
        window.__A7_ANAYARAA_ADMIN__ = <?php echo json_encode($brandAdminPayload, 15, 512) ?>;
    </script>
</head>

<body class="h-full antialiased font-sans">
    <div id="admin-root" class="h-full"></div>
</body>

</html>
<?php /**PATH C:\anayra\anayra\resources\views/admin/spa.blade.php ENDPATH**/ ?>