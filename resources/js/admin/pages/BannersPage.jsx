import { useCallback, useEffect, useState } from 'react';
import { deleteBanner, fetchBanners, patchBanner, postBanner } from '../lib/api.js';

const emptyBanner = () => ({
    title: '',
    subtitle: '',
    image_url:
        'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80',
    link_url: '/marketplace',
    sort_order: 100,
    is_active: true,
    starts_at: '',
    ends_at: '',
});

export default function BannersPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [draft, setDraft] = useState(emptyBanner());

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await fetchBanners();
            setList(data ?? []);
            setError('');
        } catch {
            setError('Could not reach CMS endpoint.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function submit(e) {
        e.preventDefault();
        await postBanner({
            ...draft,
            sort_order: Number(draft.sort_order) || 0,
            starts_at: draft.starts_at || null,
            ends_at: draft.ends_at || null,
        }).catch(() => alert('Create failed'));
        setDraft(emptyBanner());
        await load();
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker text-[11px]">Merchandising</p>
                <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Banners</h1>
                <p className="mt-2 max-w-2xl text-sm site-text-muted">
                    Hero carousel cards — imagery matches storefront Unsplash motifs; inactive rows stay dormant until toggled live.
                </p>
            </div>

            {error ? <p className="font-semibold text-rose-600">{error}</p> : null}

            <form className="site-panel grid gap-3 rounded-3xl border p-6 lg:grid-cols-2" onSubmit={submit}>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Headline</label>
                    <input
                        required
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Subtitle</label>
                    <input
                        value={draft.subtitle}
                        onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Image URL</label>
                    <input
                        required
                        value={draft.image_url}
                        onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 font-mono text-xs"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Deep link</label>
                    <input
                        value={draft.link_url}
                        onChange={(e) => setDraft((d) => ({ ...d, link_url: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm font-mono"
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Sort</label>
                        <input
                            type="number"
                            value={draft.sort_order}
                            onChange={(e) => setDraft((d) => ({ ...d, sort_order: e.target.value }))}
                            className="mt-2 w-28 rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm"
                        />
                    </div>
                    <label className="mt-8 flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={draft.is_active}
                            onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                            className="size-4 accent-blue-700"
                        />
                        Live
                    </label>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:col-span-2">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Starts</label>
                        <input
                            type="datetime-local"
                            value={draft.starts_at}
                            onChange={(e) => setDraft((d) => ({ ...d, starts_at: e.target.value }))}
                            className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Ends</label>
                        <input
                            type="datetime-local"
                            value={draft.ends_at}
                            onChange={(e) => setDraft((d) => ({ ...d, ends_at: e.target.value }))}
                            className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-end lg:col-span-2">
                    <button type="submit" className="btn-primary px-8 py-2.5 text-sm">
                        Publish banner
                    </button>
                </div>
            </form>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {loading && list.length === 0 ? <p className="site-text-muted">Loading…</p> : null}
                {list.map((b) => (
                    <BannerCard key={b.id} b={b} onChanged={load} />
                ))}
            </div>
        </div>
    );
}

function BannerCard({ b, onChanged }) {
    async function toggle() {
        try {
            await patchBanner(b.id, { is_active: !b.is_active });
            onChanged?.();
        } catch {
            alert('Toggle failed');
        }
    }

    async function remove() {
        if (!window.confirm('Remove carousel slot?')) {
            return;
        }
        try {
            await deleteBanner(b.id);
            onChanged?.();
        } catch {
            alert('Delete failed');
        }
    }

    return (
        <article className="site-panel overflow-hidden rounded-3xl border">
            <img src={b.image_url} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-5">
                <p className="font-display text-2xl text-[var(--site-text)] dark:text-white">{b.title}</p>
                <p className="text-xs site-text-muted">{b.subtitle}</p>
                <p className="font-mono text-[11px] text-blue-700 dark:text-blue-300">{b.link_url}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide site-text-muted">
                    {b.is_active ? 'Live' : 'Hidden'}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                    <button type="button" className="btn-outline px-3 py-1 text-xs" onClick={toggle}>
                        {b.is_active ? 'Hide' : 'Go live'}
                    </button>
                    <button type="button" className="text-xs font-semibold text-rose-600" onClick={remove}>
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
