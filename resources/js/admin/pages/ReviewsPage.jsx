import { useCallback, useEffect, useState } from 'react';
import PaginationControls from '../components/PaginationControls.jsx';
import { fetchReviews, patchReview } from '../lib/api.js';

const STATUSES = ['pending', 'approved', 'rejected'];

function badge(s) {
    if (s === 'approved') {
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
    }
    if (s === 'rejected') {
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
    }
    return 'bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-100';
}

export default function ReviewsPage() {
    const [payload, setPayload] = useState(null);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setPayload(await fetchReviews({ page, per_page: 25, status: status || undefined }));
        } catch {
            setError('Could not load reviews.');
        } finally {
            setLoading(false);
        }
    }, [page, status]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        setPage(1);
    }, [status]);

    const rows = payload?.data ?? [];

    async function setRowStatus(row, next) {
        try {
            await patchReview(row.id, { status: next });
            await load();
        } catch {
            alert('Update failed');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="section-kicker text-[11px]">Trust / UGC</p>
                    <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Reviews</h1>
                    <p className="mt-2 text-sm site-text-muted">Moderate before storefront surfacing · pending queue first.</p>
                </div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-full border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2 text-sm font-semibold"
                >
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="site-panel overflow-hidden rounded-3xl border">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/[0.03] text-[11px] uppercase tracking-wide site-text-muted dark:bg-white/[0.05]">
                        <tr>
                            <th className="px-4 py-3">SKU / Title</th>
                            <th className="px-4 py-3">Reviewer</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--site-border)]">
                        {loading && rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center">
                                    Loading…
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="align-top hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold">{r.product_name}</p>
                                        <p className="font-mono text-[11px] site-text-muted">{r.sku || '—'}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p>{r.reviewer_name}</p>
                                        <p className="text-xs site-text-muted">{r.reviewer_email || '—'}</p>
                                    </td>
                                    <td className="px-4 py-3">{r.rating}/5</td>
                                    <td className="max-w-xs px-4 py-3 text-xs site-text-muted">{r.body?.trim() || '—'}</td>
                                    <td className="space-y-1 px-4 py-3 text-right">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${badge(r.status)}`}>
                                            {r.status}
                                        </span>
                                        <div className="mt-2 flex flex-col gap-1">
                                            {STATUSES.filter((x) => x !== r.status).map((next) => (
                                                <button
                                                    key={next}
                                                    type="button"
                                                    className="btn-outline px-3 py-0.5 text-[10px] uppercase tracking-wide"
                                                    onClick={() => setRowStatus(r, next)}
                                                >
                                                    Mark {next}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {payload ? (
                    <PaginationControls page={payload.current_page} lastPage={payload.last_page} total={payload.total} loading={loading} onPage={setPage} />
                ) : null}
            </div>
        </div>
    );
}
