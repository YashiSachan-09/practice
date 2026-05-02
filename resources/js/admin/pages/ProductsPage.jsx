import { useMemo } from 'react';
import { MARKETPLACE_COLLECTIONS, MARKETPLACE_HERO_IMAGE } from '../data/storefrontCatalog.js';

function adminRoutes() {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : null;
    return cfg?.routes ?? { marketplace: '/marketplace', contact: '/contact', home: '/' };
}

export default function ProductsPage() {
    const routes = useMemo(() => adminRoutes(), []);

    return (
        <div className="space-y-0">
            <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-700 dark:bg-slate-950 sm:py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-0 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="section-kicker text-[11px]">Marketplace · Admin preview</p>
                        <h1 className="font-display mt-4 text-4xl leading-tight text-slate-900 dark:text-white sm:text-5xl">
                            Premium works, elegantly presented.
                        </h1>
                        <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                            Explore verified paintings, sculpture, and contemporary pieces with collector-ready details, clear pricing, and
                            curated recommendations — same layout and imagery shoppers see on the public site.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href={routes.marketplace} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                                Open live marketplace
                            </a>
                            <a href={routes.contact} target="_blank" rel="noreferrer" className="btn-outline text-sm">
                                Talk to curator
                            </a>
                        </div>
                    </div>
                    <img
                        decoding="async"
                        src={MARKETPLACE_HERO_IMAGE}
                        alt="Marketplace hero art wall"
                        className="h-[280px] w-full rounded-3xl object-cover shadow-sm sm:h-[380px] lg:h-[420px]"
                        loading="lazy"
                    />
                </div>
            </section>

            <section className="rounded-3xl bg-slate-50 py-12 dark:bg-slate-900/80 sm:py-16">
                <div className="mx-auto max-w-7xl px-0">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <p className="section-kicker text-[11px]">Catalog surfaces</p>
                            <h2 className="font-display mt-3 text-3xl text-slate-900 sm:text-4xl dark:text-white">
                                Listed like the storefront grid
                            </h2>
                            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                                Cards use identical aspect treatment (`h-56`, `rounded-2xl`, `object-cover`) as{' '}
                                <code className="rounded bg-slate-200/80 px-1 py-0.5 text-[11px] dark:bg-white/10">marketplace.blade.php</code>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {MARKETPLACE_COLLECTIONS.map((item) => (
                            <article
                                key={item.title}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                            >
                                <img
                                    decoding="async"
                                    src={item.image}
                                    alt=""
                                    className="h-56 w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    <h2 className="font-display text-2xl text-slate-900 dark:text-white">{item.title}</h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.blurb}</p>
                                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gallery-amber">{item.hint}</p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <a
                                            href={routes.marketplace}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-primary px-5 py-2 text-xs uppercase tracking-[0.28em]"
                                        >
                                            Buy on site
                                        </a>
                                        <a href={routes.home} target="_blank" rel="noreferrer" className="btn-outline px-5 py-2 text-xs uppercase tracking-[0.2em]">
                                            Home
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-12 rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center dark:border-slate-700 dark:bg-slate-950 sm:py-16">
                <h2 className="font-display text-3xl text-slate-900 sm:text-4xl dark:text-white">
                    Need personalised recommendations?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    Tell us your taste, space, and budget — same concierge entry as the public gallery footer CTA.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <a href={routes.contact} target="_blank" rel="noreferrer" className="btn-primary">
                        Talk to curator
                    </a>
                    <a href={routes.marketplace} target="_blank" rel="noreferrer" className="btn-outline">
                        View exhibitions path → marketplace
                    </a>
                </div>
            </section>
        </div>
    );
}
