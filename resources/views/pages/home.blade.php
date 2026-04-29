@extends('layouts.gallery')

@section('meta_description')
    Discover Anayra, a premium art and gallery marketplace with curated collections, artist stories, private viewings, and collector-grade support.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-8 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-home-slider>
            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-600 dark:bg-slate-800/50">
                <div class="home-slider-track" data-slider-track>
                    @foreach ([
                        ['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1600&q=80', 'Premium art for home and office.', 'Acquire verified works from established and emerging artists with a premium buying experience.'],
                        ['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80', 'Trusted gallery quality with safe delivery.', 'From studio to wall: trusted logistics, provenance documents, and dedicated collector support.'],
                        ['https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1600&q=80', 'Buy original paintings and sculptures easily.', 'Discover paintings, sculpture, prints and contemporary works in one elegant platform.'],
                    ] as [$image, $heading, $caption])
                        <article class="home-slider-item relative h-[460px] sm:h-[560px]" data-slide>
                            <img decoding="async" src="{{ $image }}" alt="{{ $heading }}" class="h-full w-full object-cover" loading="{{ $loop->first ? 'eager' : 'lazy' }}" @if ($loop->first) fetchpriority="high" @endif />
                            <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/30"></div>
                            <div class="absolute inset-0 flex items-end">
                                <div class="max-w-3xl p-8 sm:p-14">
                                    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">ANAYRA PREMIUM GALLERY</p>
                                    <h1 class="font-display mt-4 text-4xl leading-tight text-white sm:text-6xl">{{ $heading }}</h1>
                                    <p class="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">{{ $caption }}</p>
                                    <div class="mt-8 flex flex-wrap gap-3">
                                        <a href="{{ route('marketplace') }}" class="btn-primary">Explore Collection</a>
                                        <a href="{{ route('contact') }}" class="btn-outline border-white/40 text-white">Schedule Consultation</a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    @endforeach
                </div>
            </div>
            <div class="mt-4 flex items-center justify-end gap-3">
                <button type="button" class="btn-outline px-5 py-2 text-xs" data-slider-prev>Prev</button>
                <button type="button" class="btn-primary px-5 py-2 text-xs" data-slider-next>Next</button>
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3 lg:px-8">
            @foreach ([
                ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80', 'Curated Discovery', 'Every listing is reviewed for authenticity, quality, and collector relevance.'],
                ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1000&q=80', 'Private Advisory', 'Get 1:1 help for curation, wall placement, and portfolio expansion.'],
                ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80', 'Trusted Fulfilment', 'Secure packaging and insured delivery across domestic and global routes.'],
            ] as [$image, $title, $text])
                <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <img decoding="async" src="{{ $image }}" alt="{{ $title }}" class="h-56 w-full object-cover" loading="lazy" />
                    <div class="p-6">
                        <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $title }}</h2>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ $text }}</p>
                    </div>
                </article>
            @endforeach
        </div>
    </section>

    <section class="border-y border-slate-200 bg-slate-50 py-20 dark:border-slate-700 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p class="section-kicker text-[11px]">Featured Collections</p>
                    <h2 class="font-display mt-3 text-4xl text-slate-900 sm:text-5xl dark:text-white">Signature works for premium interiors.</h2>
                </div>
                <a href="{{ route('marketplace') }}" class="btn-outline text-xs uppercase tracking-[0.3em]">View All →</a>
            </div>
            <div class="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                @foreach ([
                    ['https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=900&q=80', 'Abstract Series'],
                    ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80', 'Sculpture'],
                    ['https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=900&q=80', 'Fine Prints'],
                    ['https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=900&q=80', 'Contemporary'],
                ] as [$image, $label])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $image }}" alt="{{ $label }}" class="h-52 w-full object-cover" loading="lazy" />
                        <div class="p-5">
                            <h3 class="font-display text-2xl text-slate-900 dark:text-white">{{ $label }}</h3>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Collector-grade selections with full details and documentation.</p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 class="font-display text-center text-4xl text-slate-900 dark:text-white">Collector Testimonials</h2>
            <div class="mt-12 grid gap-8 lg:grid-cols-3">
                @foreach ([
                    ['Noura Khalid · Dubai', 'The end-to-end experience was premium, transparent, and deeply professional.'],
                    ['Leon Voss · Berlin', 'Shipping, condition reports, and support were exactly what serious buyers expect.'],
                    ['Ananya Menon · Bengaluru', 'Elegant platform, strong curation, and outstanding post-purchase support.'],
                ] as [$name, $text])
                    <blockquote class="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900">
                        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{{ $text }}”</p>
                        <footer class="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{{ $name }}</footer>
                    </blockquote>
                @endforeach
            </div>
        </div>
    </section>

    <section class="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-700 dark:bg-slate-900/80">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p class="section-kicker">Private Viewing Rooms</p>
            <h2 class="font-display mt-4 text-4xl text-slate-900 sm:text-5xl dark:text-white">Bring gallery-grade curation to your space.</h2>
            <p class="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Share your style and space preferences. Our advisory team will curate personalized options and acquisition-ready proposals.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('contact') }}" class="btn-primary">Talk To Curator</a>
                <a href="{{ route('artists') }}" class="btn-outline">Meet Artists</a>
            </div>
        </div>
    </section>
@endsection
