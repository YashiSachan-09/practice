@extends('layouts.gallery')

@section('meta_description')
    Browse premium art collections, paintings, sculptures and prints with verified listings and collector-ready details.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">Marketplace</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">Premium works, elegantly presented.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Explore verified paintings, sculpture, and contemporary pieces with collector-ready details, clear pricing, and curated recommendations.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80" alt="Marketplace hero art wall" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="border-y border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p class="section-kicker">Acquire</p>
                    <h2 class="font-display mt-2 text-3xl text-slate-900 dark:text-white">Ready-to-checkout works</h2>
                    <p class="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                        Choose a listing, complete guest checkout, and your order appears instantly in the admin Orders board for fulfilment.
                    </p>
                </div>
                <a href="{{ route('checkout') }}" class="btn-primary shrink-0">Open checkout</a>
            </div>
            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach (config('storefront.catalog', []) as $sku => $meta)
                    <article class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/80">
                        <h3 class="font-display text-lg text-slate-900 dark:text-white">{{ $meta['name'] }}</h3>
                        <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">₹{{ number_format($meta['unit_price'], 0) }} · <span class="text-slate-500">{{ $sku }}</span></p>
                        <a href="{{ route('checkout', ['sku' => $sku]) }}" class="btn-outline mt-6 w-full justify-center text-center">Buy this work</a>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                @foreach ([
                    ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'Abstract Paintings'],
                    ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80', 'Sculpture'],
                    ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80', 'Fine Art Prints'],
                    ['https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=900&q=80', 'Modern Minimal'],
                    ['https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=900&q=80', 'Contemporary Icons'],
                    ['https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=900&q=80', 'Gallery Editions'],
                ] as [$img, $title])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $img }}" alt="{{ $title }}" class="h-56 w-full object-cover" loading="lazy" />
                        <div class="p-6">
                            <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $title }}</h2>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Curated inventory, transparent details, and seamless buying flow.</p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 class="font-display text-4xl text-slate-900 sm:text-5xl dark:text-white">Need personalized recommendations?</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Tell us your taste, space, and budget. Our curators will share hand-picked works tailored to your brief.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('contact') }}" class="btn-primary">Talk To Curator</a>
                <a href="{{ route('exhibitions') }}" class="btn-outline">View Exhibitions</a>
            </div>
        </div>
    </section>
@endsection
