@php
    $links = [
        ['route' => 'home', 'label' => 'Home'],
        ['route' => 'about', 'label' => 'Our Story'],
        ['route' => 'marketplace', 'label' => 'Marketplace'],
        ['route' => 'artists', 'label' => 'Artists'],
        ['route' => 'exhibitions', 'label' => 'Exhibitions'],
        ['route' => 'journal', 'label' => 'Journal'],
        ['route' => 'contact', 'label' => 'Contact'],
    ];
@endphp

<header class="site-header sticky top-0 z-50 overflow-x-hidden backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="{{ route('home') }}" class="group flex items-center gap-3">
            <span
                class="font-display text-3xl font-semibold tracking-tight text-gradient-gold transition group-hover:opacity-95"
                style="letter-spacing: 0.04em;"
            >
                ANAYRA
            </span>
            <span class="hidden text-[10px] font-medium uppercase tracking-[0.55em] text-gallery-amber/80 sm:inline">
                Gallery
            </span>
        </a>

        {{-- Desktop --}}
        <nav class="hidden flex-wrap justify-center gap-1 xl:flex xl:gap-0" aria-label="Primary">
            @foreach ($links as $link)
                <a
                    href="{{ route($link['route']) }}"
                    class="nav-link rounded-full px-4 py-2 text-sm transition {{ request()->routeIs($link['route']) ? 'nav-link-active font-semibold' : '' }}"
                    @if(request()->routeIs($link['route'])) aria-current="page" @endif
                >
                    {{ $link['label'] }}
                </a>
            @endforeach
        </nav>

        <div class="hidden items-center gap-3 xl:flex">
            <button id="theme-toggle" type="button" class="site-theme-btn rounded-full px-4 py-2 text-sm">
                <span id="theme-label">Dark mode</span>
            </button>
            <a href="{{ route('marketplace') }}" class="btn-primary text-sm">Browse editions</a>
        </div>

        {{-- Mobile / tablet drawer --}}
        <details class="group relative xl:hidden">
            <summary class="site-theme-btn cursor-pointer list-none rounded-full px-4 py-2 text-sm font-medium backdrop-blur">
                Menu <span aria-hidden class="ml-2 inline-block transition group-open:rotate-180">⌄</span>
            </summary>
            <div
                class="site-panel fixed right-4 top-[4.5rem] z-[60] w-[min(20rem,calc(100%-2rem))] overflow-hidden rounded-2xl p-2 shadow-lg backdrop-blur-xl"
                style="backdrop-filter: blur(16px);"
            >
                <nav class="flex flex-col gap-1" aria-label="Primary mobile">
                    @foreach ($links as $link)
                        <a
                            href="{{ route($link['route']) }}"
                            class="nav-link rounded-xl px-4 py-3 text-sm {{ request()->routeIs($link['route']) ? 'nav-link-active font-semibold' : '' }}"
                            @if(request()->routeIs($link['route'])) aria-current="page" @endif
                        >
                            {{ $link['label'] }}
                        </a>
                    @endforeach
                    <hr class="my-2 border-slate-200 dark:border-slate-600" />
                    <button id="theme-toggle-mobile" type="button" class="site-theme-btn w-full rounded-xl px-4 py-3 text-sm">Dark mode</button>
                    <a href="{{ route('marketplace') }}" class="btn-primary justify-center rounded-xl px-4 py-3 text-center text-sm">Browse editions</a>
                </nav>
            </div>
        </details>
    </div>
</header>
