import { useCallback, useEffect, useState } from 'react';
import PaginationControls from '../components/PaginationControls.jsx';
import { deleteCategory, fetchCategories, patchCategory, postCategory } from '../lib/api.js';

export default function CategoriesPage() {
    const [payload, setPayload] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState({ name: '', slug: '', description: '', sort_order: 100, is_active: true });

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchCategories({ page, per_page: 40 });
            setPayload(data);
        } catch {
            setError('Could not load categories.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        load();
    }, [load]);

    async function addCategory(e) {
        e.preventDefault();
        try {
            await postCategory({
                ...creating,
                sort_order: Number(creating.sort_order) || 0,
            });
            setCreating({ name: '', slug: '', description: '', sort_order: 100, is_active: true });
            await load();
        } catch {
            alert('Save failed · check slug uniqueness');
        }
    }

    const rows = payload?.data ?? [];

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker text-[11px]">Catalog</p>
                <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Categories</h1>
                <p className="mt-2 max-w-2xl text-sm site-text-muted">Taxonomy for storefront rails — slugs should stay stable for SEO.</p>
            </div>

            <form
                className="site-panel grid gap-4 rounded-3xl border p-5 sm:grid-cols-2 lg:grid-cols-12"
                onSubmit={addCategory}
            >
                <div className="lg:col-span-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Name</label>
                    <input
                        required
                        value={creating.name}
                        onChange={(e) => setCreating((c) => ({ ...c, name: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                    />
                </div>
                <div className="lg:col-span-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Slug (optional)</label>
                    <input
                        placeholder="auto from name"
                        value={creating.slug}
                        onChange={(e) => setCreating((c) => ({ ...c, slug: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Sort</label>
                    <input
                        type="number"
                        min={0}
                        value={creating.sort_order}
                        onChange={(e) => setCreating((c) => ({ ...c, sort_order: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                    />
                </div>
                <div className="flex items-center gap-2 lg:col-span-2">
                    <input
                        id="cat-active-new"
                        type="checkbox"
                        checked={creating.is_active}
                        onChange={(e) => setCreating((c) => ({ ...c, is_active: e.target.checked }))}
                        className="size-4 rounded accent-blue-700"
                    />
                    <label htmlFor="cat-active-new" className="text-sm font-medium">
                        Active
                    </label>
                </div>
                <div className="flex items-end lg:col-span-2">
                    <button type="submit" className="btn-primary w-full justify-center px-6 py-2.5 text-sm">
                        Add category
                    </button>
                </div>
                <div className="sm:col-span-2 lg:col-span-12">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Description</label>
                    <input
                        value={creating.description}
                        onChange={(e) => setCreating((c) => ({ ...c, description: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                    />
                </div>
            </form>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="site-panel overflow-hidden rounded-3xl border">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/[0.03] text-[11px] font-semibold uppercase tracking-wide site-text-muted dark:bg-white/[0.05]">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Sort</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--site-border)]">
                        {loading && rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center site-text-muted">
                                    Loading…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center site-text-muted">
                                    No categories yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((cat) => <CategoryRow key={cat.id} cat={cat} onRefresh={load} />)
                        )}
                    </tbody>
                </table>
                {payload ? (
                    <PaginationControls
                        page={payload.current_page}
                        lastPage={payload.last_page}
                        total={payload.total}
                        loading={loading}
                        onPage={(p) => setPage(p)}
                    />
                ) : null}
            </div>
        </div>
    );
}

function CategoryRow({ cat, onRefresh }) {
    const [draft, setDraft] = useState(cat);

    useEffect(() => {
        setDraft(cat);
    }, [cat]);

    async function saveRow() {
        try {
            await patchCategory(cat.id, {
                name: draft.name,
                slug: draft.slug || undefined,
                description: draft.description ?? '',
                sort_order: Number(draft.sort_order),
                is_active: !!draft.is_active,
            });
            onRefresh?.();
        } catch {
            alert('Could not save.');
        }
    }

    async function remove() {
        if (!window.confirm(`Delete “${cat.name}”?`)) {
            return;
        }
        try {
            await deleteCategory(cat.id);
            onRefresh?.();
        } catch {
            alert('Delete failed.');
        }
    }

    return (
        <tr className="align-top hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
            <td className="px-4 py-3">
                <input
                    value={draft.name ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="w-full min-w-[10rem] rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-1.5 text-sm"
                />
                <textarea
                    value={draft.description ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    rows={2}
                    placeholder="Description"
                    className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-1.5 text-xs"
                />
            </td>
            <td className="px-4 py-3">
                <input
                    value={draft.slug ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-1.5 font-mono text-xs"
                />
            </td>
            <td className="px-4 py-3">
                <input
                    type="number"
                    value={draft.sort_order ?? 0}
                    onChange={(e) => setDraft((d) => ({ ...d, sort_order: e.target.value }))}
                    className="w-20 rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-1.5 text-sm"
                />
            </td>
            <td className="px-4 py-3">
                <label className="flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={!!draft.is_active}
                        onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                        className="size-4 rounded accent-blue-700"
                    />
                    Active
                </label>
            </td>
            <td className="space-y-2 px-4 py-3 text-right">
                <button type="button" className="btn-primary block w-full px-4 py-1.5 text-xs" onClick={saveRow}>
                    Save
                </button>
                <button type="button" className="text-xs font-semibold text-rose-600" onClick={remove}>
                    Delete
                </button>
            </td>
        </tr>
    );
}
