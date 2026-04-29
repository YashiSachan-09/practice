@extends('layouts.gallery')

@section('meta_description')
    Learn about Anayra’s premium curatorial philosophy, team, values, and global collector-first experience.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">About Anayra</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">A premium marketplace for meaningful art collecting.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Anayra brings together curators, artists, and collectors on a platform designed for trust, quality, and timeless aesthetics. Every detail, from listing presentation to delivery support, is built for a refined experience.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1400&q=80" alt="Gallery interior" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid gap-8 md:grid-cols-3">
                @foreach ([
                    ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'Curatorial Quality'],
                    ['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80', 'Collector Confidence'],
                    ['https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80', 'Global Access'],
                ] as [$img, $title])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $img }}" alt="{{ $title }}" class="h-52 w-full object-cover" loading="lazy" />
                        <div class="p-6">
                            <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $title }}</h2>
                            <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                A refined process that balances artistic depth with transparent transactions and premium service.
                            </p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 class="font-display text-4xl text-slate-900 sm:text-5xl dark:text-white">Our mission</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To build India’s most elegant and trustworthy digital art destination where every acquisition feels considered, informed, and deeply personal.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('marketplace') }}" class="btn-primary">Explore Marketplace</a>
                <a href="{{ route('contact') }}" class="btn-outline">Contact Team</a>
            </div>
        </div>
    </section>
@endsection
