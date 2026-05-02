@extends('layouts.gallery')

@section('meta_description')
    Read A7 ANAYARAA Journal: curator insights, artist stories, collecting tips, and market perspectives.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">Journal</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">Insights for collectors, curators, and art lovers.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Explore editorial features, trend reports, and behind-the-scenes stories from studios and exhibitions.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1455885666463-9c792b91f5a3?auto=format&fit=crop&w=1400&q=80" alt="Journal desk with art magazine" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                @foreach ([
                    ['https://images.unsplash.com/photo-1495819903255-00fdfa38a8de?auto=format&fit=crop&w=900&q=80', 'How to start collecting premium art'],
                    ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=900&q=80', '5 trends shaping contemporary interiors'],
                    ['https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80', 'Studio conversations with featured artists'],
                ] as [$img, $title])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $img }}" alt="{{ $title }}" class="h-56 w-full object-cover" loading="lazy" />
                        <div class="p-6">
                            <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $title }}</h2>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Editorial · 6 min read</p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 class="font-display text-4xl text-slate-900 sm:text-5xl dark:text-white">Want updates in your inbox?</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Receive curated stories, market updates, and new release previews from our editorial desk.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('contact') }}" class="btn-primary">Subscribe Interest</a>
                <a href="{{ route('artists') }}" class="btn-outline">Explore Artists</a>
            </div>
        </div>
    </section>
@endsection