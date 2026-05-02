@php
    $footerSections = [
        'Discover' => [
            ['Marketplace', 'marketplace'],
            ['Our artists', 'artists'],
            ['Exhibitions', 'exhibitions'],
        ],
        'Company' => [
            ['Our story', 'about'],
            ['Journal', 'journal'],
            ['Contact', 'contact'],
        ],
        'Legal' => [
            ['Privacy (draft)', '#'],
            ['Terms & shipping (draft)', '#'],
            ['Buyer protection (draft)', '#'],
        ],
    ];
@endphp

<footer class="site-panel relative mt-0 overflow-x-hidden border-t">
    <div class="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
        <div class="absolute bottom-0 left-0 h-[55%] w-[55%] max-w-full rounded-full bg-slate-200/70 blur-[100px]"></div>
        <div class="absolute bottom-0 right-0 h-[50%] w-[50%] max-w-full rounded-full bg-indigo-100/80 blur-[90px]"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid gap-12 md:grid-cols-2 xl:grid-cols-5">
            <div>
                <span class="font-display text-xl font-semibold text-gradient-gold sm:text-2xl md:text-3xl">A7 ANAYARAA</span>
                <p class="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
                    A bridge between eminent studios and passionate collectors worldwide. Every piece is stewarded through
                    curatorial review so you can acquire with intuition and certainty.
                </p>
                <div class="mt-6 flex flex-wrap gap-3">
                    <span class="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-700">
                        Curator-led shipping
                    </span>
                    <span class="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-800">
                        Certificate vault
                    </span>
                </div>
            </div>

            @foreach ($footerSections as $title => $items)
                <div>
                    <h3 class="section-kicker text-[11px] text-slate-600">{{ strtoupper($title) }}</h3>
                    <ul class="mt-4 space-y-3 text-sm text-slate-700">
                        @foreach ($items as [$label, $route])
                            @if ($route !== '#')
                                <li>
                                    <a href="{{ route($route) }}" class="footer-link transition">{{ $label }}</a>
                                </li>
                            @else
                                <li><span class="cursor-not-allowed text-slate-400">{{ $label }}</span></li>
                            @endif
                        @endforeach
                    </ul>
                </div>
            @endforeach

            <div class="min-w-0 max-w-full rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8 lg:col-span-1 dark:border-slate-600 dark:bg-slate-800/60">
                <h3 class="font-display text-2xl text-slate-900 dark:text-white">Weekly studio notes</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Dispatches from our curators plus early access codes.</p>
                <form class="mt-5 flex min-w-0 flex-col gap-3" action="#" method="get" aria-label="Newsletter signup">
                    <label class="sr-only" for="footer-email">Email</label>
                    <input id="footer-email" type="email" name="email" placeholder="your@email" class="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" autocomplete="email" disabled />
                    <button type="button" class="btn-primary w-full px-6 py-3 text-sm opacity-90" disabled title="Connect backend when ready">
                        Coming soon
                    </button>
                </form>
                <hr class="my-8 border-slate-200" />
                <a href="{{ route('admin.login') }}" class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50">
                    <span class="font-medium">Admin login</span>
                    <span aria-hidden class="text-indigo-600">→</span>
                </a>
                <p class="mt-3 text-[11px] leading-relaxed text-slate-500">
                    Owner tools: inventory, curator notes, invoices. Separate from collectors.
                </p>
            </div>
        </div>

        <div class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-10 text-[11px] text-slate-500 sm:flex-row sm:items-center">
            <p>© {{ date('Y') }} A7 ANAYARAA Gallery & Marketplace. Concept experience — replace copy with legally binding text before launch.</p>
            <p class="text-slate-400">Structured for Laravel migrations across PostgreSQL (Supabase) and MySQL without raw SQL divergence.</p>
        </div>
    </div>
</footer>
