<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full scroll-smooth overflow-x-hidden">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }} · Admin</title>
    @vite(['resources/css/app.css', 'resources/js/admin/main.jsx'])
    @php
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
    @endphp
    <script>
        (() => {
            const stored = localStorage.getItem('a7-anayaraa-theme');
            const theme = stored === 'dark' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        })();
        window.__A7_ANAYARAA_ADMIN__ = @json($brandAdminPayload);
    </script>
</head>

<body class="h-full antialiased font-sans">
    <div id="admin-root" class="h-full"></div>
</body>

</html>
