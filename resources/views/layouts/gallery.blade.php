<!DOCTYPE html>
<html class="scroll-smooth overflow-x-hidden" lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="@yield('meta_description', 'A7 ANAYARAA — a curated marketplace for painters, sculptures, NFT editions, and exclusive gallery collaborations.')">

    <title>{{ $title ?? 'A7 ANAYARAA' }}</title>

    <script>
        (() => {
            const stored = localStorage.getItem('a7-anayaraa-theme');
            const theme = stored === 'dark' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        })();
    </script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>

<body class="min-h-screen overflow-x-hidden font-sans antialiased">
    @include('partials.site-header')

    @if (session('status'))
        <div class="sticky top-[72px] z-40 border-y border-gallery-emerald/30 bg-gallery-emerald/15 px-4 py-3 text-center text-sm text-emerald-100 backdrop-blur">
            {{ session('status') }}
        </div>
    @endif

    <main class="relative z-10">
        @yield('content')
    </main>

    @include('partials.site-footer')

    {{-- Theme toggle inline so it works even when Vite dev server is not running. --}}
    <script>
        (() => {
            const html = document.documentElement;
            const label = () => (html.getAttribute('data-theme') === 'dark' ? 'Light mode' : 'Dark mode');
            const apply = (next) => {
                const t = next === 'dark' ? 'dark' : 'light';
                html.setAttribute('data-theme', t);
                html.classList.toggle('dark', t === 'dark');
                try {
                    localStorage.setItem('a7-anayaraa-theme', t);
                } catch (e) {}
                document.getElementById('theme-label') && (document.getElementById('theme-label').textContent = label());
                const m = document.getElementById('theme-toggle-mobile');
                if (m) m.textContent = label();
            };
            const bind = () => {
                const onClick = () => apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
                document.getElementById('theme-toggle')?.addEventListener('click', onClick);
                document.getElementById('theme-toggle-mobile')?.addEventListener('click', onClick);
                apply(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
            };
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
            else bind();
        })();
    </script>

    @stack('scripts')
</body>

</html>
