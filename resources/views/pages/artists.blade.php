@extends('layouts.gallery')

@section('meta_description')
    Meet featured artists on Anayra and explore their signature styles, collections, and curated profiles.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">Artists</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">Best artists in one place.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Our artists combine originality, craftsmanship, and contemporary perspective. Explore profiles, styles, and selected pieces curated for discerning collectors.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=80" alt="Artist studio" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                @foreach ([
                    ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80', 'Aarav Mehta', 'Abstract expression and layered textures.'],
                    ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', 'Sana Roy', 'Minimal contemporary compositions.'],
                    ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', 'Rhea Kapoor', 'Bold color stories and geometric narratives.'],
                    ['https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=900&q=80', 'Vihaan Nair', 'Monochrome studies and visual rhythm.'],
                    ['https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80', 'Mira Dsouza', 'Sculptural forms and material depth.'],
                    ['https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=900&q=80', 'Kabir Anand', 'Contemporary figurative language.'],
                ] as [$img, $name, $style])
                    <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <img decoding="async" src="{{ $img }}" alt="{{ $name }}" class="h-56 w-full object-cover" loading="lazy" />
                        <div class="p-6">
                            <h2 class="font-display text-2xl text-slate-900 dark:text-white">{{ $name }}</h2>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ $style }}</p>
                        </div>
                    </article>
                @endforeach
            </div>
        </div>
    </section>

    <section class="bg-white py-20 dark:bg-slate-950">
        <div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 class="font-display text-4xl text-slate-900 sm:text-5xl dark:text-white">Collaborate with Anayra</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                We welcome thoughtful artists with a distinctive voice and a professional portfolio.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="{{ route('contact') }}" class="btn-primary">Apply As Artist</a>
                <a href="{{ route('journal') }}" class="btn-outline">Read Journal</a>
            </div>
        </div>
    </section>
@endsection
