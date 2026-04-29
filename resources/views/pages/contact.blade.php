@extends('layouts.gallery')

@section('meta_description')
    Contact Anayra for private viewings, artwork consultation, artist partnerships, and collector support.
@endsection

@section('content')
    <section class="border-b border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-950">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
                <p class="section-kicker">Contact</p>
                <h1 class="font-display mt-4 text-5xl leading-tight text-slate-900 dark:text-white">Let’s curate your next acquisition.</h1>
                <p class="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Reach out for collection advice, private previews, artist partnerships, and premium buying support.
                </p>
            </div>
            <img decoding="async" src="https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?auto=format&fit=crop&w=1400&q=80" alt="Contact consultation desk" class="h-[420px] w-full rounded-3xl object-cover shadow-sm" loading="lazy" />
        </div>
    </section>

    <section class="bg-slate-50 py-20 dark:bg-slate-900/80">
        <div class="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
            <div class="space-y-8">
                <h2 class="font-display text-3xl text-slate-900 dark:text-white">Consultation & support</h2>
                <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Our team responds quickly with personalized guidance for collectors, interior projects, and institutional requirements.
                </p>
                <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <img decoding="async" src="https://images.unsplash.com/photo-1518997638297-cf5f4dbf4a03?auto=format&fit=crop&w=1200&q=80" alt="Gallery walkthrough" class="h-64 w-full object-cover" loading="lazy" />
                    <div class="p-6">
                        <p class="text-sm text-slate-600 dark:text-slate-300">Private viewing support, custom recommendations, and end-to-end acquisition assistance.</p>
                    </div>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                @if ($errors->any())
                    <div class="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                        <ul class="list-inside list-disc space-y-1">
                            @foreach ($errors->all() as $e)
                                <li>{{ $e }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form action="{{ route('contact.submit') }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label for="name" class="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Name</label>
                        <input id="name" type="text" name="name" value="{{ old('name') }}" required class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" autocomplete="name" />
                    </div>
                    <div>
                        <label for="email" class="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Email</label>
                        <input id="email" type="email" name="email" value="{{ old('email') }}" required class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" autocomplete="email" />
                    </div>
                    <div>
                        <label for="interest" class="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Interest</label>
                        <input id="interest" type="text" name="interest" value="{{ old('interest') }}" maxlength="120" class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" placeholder="e.g. abstract canvas, sculpture, private viewing" />
                    </div>
                    <div>
                        <label for="message" class="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Message</label>
                        <textarea id="message" name="message" rows="7" required class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100">{{ old('message') }}</textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full justify-center rounded-xl py-4 text-[13px] font-semibold uppercase tracking-[0.22em]">Send Message</button>
                </form>
            </div>
        </div>
    </section>
@endsection