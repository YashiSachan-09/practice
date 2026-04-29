@extends('layouts.admin')

@section('content')
    <div class="min-h-screen">
        <header class="sticky top-0 z-40 border-b border-white/10 bg-gallery-void/80 backdrop-blur">
            <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
                <div>
                    <p class="text-[10px] font-semibold uppercase tracking-[0.45em] text-gallery-amber/70">Administrative cockpit</p>
                    <h1 class="font-display mt-1 text-2xl text-white">Welcome back, {{ auth()->user()->name }}</h1>
                </div>
                <div class="flex flex-wrap gap-4">
                    <a href="{{ route('home') }}" class="rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-gallery-sand/80 hover:border-gallery-amber/40 hover:text-white">
                        View storefront
                    </a>
                    <form action="{{ route('admin.logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="rounded-full border border-gallery-ruby/50 bg-gallery-ruby/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-red-50 hover:bg-gallery-ruby/40">
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-6xl space-y-12 px-6 py-14 lg:px-10">
            <section class="rounded-[28px] border border-white/10 bg-white/5 p-8 lg:p-12 backdrop-blur">
                <h2 class="font-display text-3xl text-white">Operational snapshot · placeholder dashboards</h2>
                <p class="mt-4 max-w-3xl text-sm leading-relaxed text-gallery-sand/72">
                    Soon this surface will summarise live inventory ingestion, escrow releases, NFT attestation deltas, concierge ticket aging, kiln commission queues, analogue photograph conservation SLAs —
                    Laravel models will hydrate charts without rewriting SQL when Postgres (Supabase) graduates to MySQL in production stacks.
                    Keep schemas migration-driven; avoid handwritten vendor-specific DDL.
                </p>
                <div class="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    @foreach ([['Edition listings', '00'], ['Outstanding invoices', '—'], ['Crated shipments', '—'], ['Certificates pending expiry', '—']] as [$label, $val])
                        <div class="rounded-2xl border border-white/10 bg-gallery-void/50 p-6">
                            <p class="text-[10px] font-semibold uppercase tracking-[0.32em] text-gallery-amber/70">{{ $label }}</p>
                            <p class="mt-4 font-display text-5xl tracking-tight text-white">{{ $val }}</p>
                        </div>
                    @endforeach
                </div>
            </section>

            <section class="rounded-[28px] border border-emerald-500/20 bg-emerald-950/40 p-8 lg:p-12">
                <h3 class="font-display text-2xl text-emerald-100">Database portability checklist</h3>
                <ul class="mt-6 space-y-4 text-sm leading-relaxed text-emerald-100/85">
                    <li>Prefer Laravel migrations · query builder · Eloquent; avoid Postgres-only enums or triggers until you abstract them behind repositories.</li>
                    <li>Switch `.env`: <code class="rounded bg-black/35 px-2 py-0.5 text-[13px]">DB_CONNECTION=pgsql</code> (Supabase) vs <code class="rounded bg-black/35 px-2 py-0.5 text-[13px]">mysql</code> · update host/credentials concurrently.</li>
                    <li>PHPUnit against both drivers in CI when revenue-critical schemas stabilise · catch subtle JSON casting differences early.</li>
                </ul>
            </section>
        </main>
    </div>
@endsection
