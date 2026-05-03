<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title><?php echo e($title ?? 'Admin Login'); ?></title>
    
    <style>
        body{font-family:system-ui,Segoe UI,Roboto,sans-serif;min-height:100vh;margin:0;background:#0c0c0f;color:#e8e4dc}a{color:#eab308}
    </style>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>

<body class="min-h-screen bg-gallery-mesh font-sans text-gallery-sand antialiased">
    <?php echo $__env->yieldContent('content'); ?>
</body>

</html>
<?php /**PATH C:\anayra\anayra\resources\views/layouts/admin-login.blade.php ENDPATH**/ ?>