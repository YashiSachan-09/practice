@extends('layouts.gallery')

@section('meta_description')
    Explore upcoming A7 ANAYARAA exhibitions, events, and premium gallery showcases.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">Exhibitions</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">Premium exhibitions and live showcases.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Join premium showcases featuring contemporary artists, thematic collections, and collector-focused viewing experiences.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1400&q=80" alt="Exhibition hall" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                @foreach ([
                    ['https://images.unsplash.com/photo-1518997638297-cf5f4dbf4a03?auto=format&fit=crop&w=900&q=80', 'Contemporary Masters', 'Delhi · 12 May'],
                    ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'Color & Form', 'Mumbai · 21 May'],
                    ['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80', 'Minimal Expressions', 'Bengaluru · 03 Jun'],
                ] as [$img, $title, $date])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $img }}" alt="{{ $title }}" class="h-56 w-full object-cover" loading="lazy" />
                        <div class="p-6">
                            <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $title }}</h2>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ $date }}</p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 class="font-display text-4xl text-slate-900 sm:text-5xl dark:text-white">Book your private slot</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Reserve a guided walkthrough with curators and access event previews before public release.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('contact') }}" class="btn-primary">Reserve Seat</a>
                <a href="{{ route('marketplace') }}" class="btn-outline">Shop Collections</a>
            </div>
        </div>
    </section>
@endsection
