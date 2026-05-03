<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? 'Admin Login' }}</title>
    {{-- Fallback if Vite is down or hot file points at a stopped dev server --}}
    <style>
        body{font-family:system-ui,Segoe UI,Roboto,sans-serif;min-height:100vh;margin:0;background:#0c0c0f;color:#e8e4dc}a{color:#eab308}
    </style>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-gallery-mesh font-sans text-gallery-sand antialiased">
    @yield('content')
</body>

</html>
