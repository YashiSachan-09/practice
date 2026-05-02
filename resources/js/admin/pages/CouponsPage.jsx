import { useCallback, useEffect, useState } from 'react';
import PaginationControls from '../components/PaginationControls.jsx';
import { deleteCoupon, fetchCoupons, patchCoupon, postCoupon } from '../lib/api.js';

const DT = ['percent', 'fixed_inr'];

export default function CouponsPage() {
    const [payload, setPayload] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState({
        code: '',
        description: '',
        discount_type: 'percent',
        discount_value: 10,
        minimum_order_amount: 0,
        max_redemptions: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
    });

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setPayload(await fetchCoupons({ page, per_page: 40 }));
        } catch {
            setError('Could not load coupons.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        load();
    }, [load]);

    async function submitNew(e) {
        e.preventDefault();
        try {
            await postCoupon({
                ...creating,
                code: creating.code,
                discount_value: Number(creating.discount_value),
                minimum_order_amount: Number(creating.minimum_order_amount || 0),
                max_redemptions: creating.max_redemptions ? Number(creating.max_redemptions) : null,
                starts_at: creating.starts_at || null,
                ends_at: creating.ends_at || null,
                is_active: creating.is_active,
            });
            setCreating({
                code: '',
                description: '',
                discount_type: 'percent',
                discount_value: 10,
                minimum_order_amount: 0,
                max_redemptions: '',
                starts_at: '',
                ends_at: '',
                is_active: true,
            });
            await load();
        } catch {
            alert('Create failed · unique codes only');
        }
    }

    const rows = payload?.data ?? [];

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker text-[11px]">Promotions</p>
                <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Coupons</h1>
                <p className="mt-2 text-sm site-text-muted">
                    Percent or flat INR · optional caps and redemption window. Redemption totals live in{' '}
                    <code className="rounded bg-black/5 px-1 dark:bg-white/10">times_used</code>.
                </p>
            </div>

            <form className="site-panel grid gap-3 rounded-3xl border p-5 lg:grid-cols-12" onSubmit={submitNew}>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Code</label>
                    <input
                        required
                        value={creating.code}
                        onChange={(e) => setCreating((c) => ({ ...c, code: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 font-mono text-sm uppercase"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Type</label>
                    <select
                        value={creating.discount_type}
                        onChange={(e) => setCreating((c) => ({ ...c, discount_type: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    >
                        {DT.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Value</label>
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        required
                        value={creating.discount_value}
                        onChange={(e) => setCreating((c) => ({ ...c, discount_value: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Min cart (₹)</label>
                    <input
                        type="number"
                        min={0}
                        value={creating.minimum_order_amount}
                        onChange={(e) => setCreating((c) => ({ ...c, minimum_order_amount: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Max uses</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="∞"
                        value={creating.max_redemptions}
                        onChange={(e) => setCreating((c) => ({ ...c, max_redemptions: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex items-end lg:col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={creating.is_active}
                            onChange={(e) => setCreating((c) => ({ ...c, is_active: e.target.checked }))}
                            className="size-4 accent-blue-700"
                        />{' '}
                        Active
                    </label>
                </div>
                <div className="lg:col-span-12">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Label</label>
                    <input
                        value={creating.description}
                        onChange={(e) => setCreating((c) => ({ ...c, description: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="lg:col-span-6">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Starts (datetime-local)</label>
                    <input
                        type="datetime-local"
                        value={creating.starts_at}
                        onChange={(e) => setCreating((c) => ({ ...c, starts_at: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="lg:col-span-6">
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Ends</label>
                    <input
                        type="datetime-local"
                        value={creating.ends_at}
                        onChange={(e) => setCreating((c) => ({ ...c, ends_at: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex justify-end lg:col-span-12">
                    <button type="submit" className="btn-primary px-8 py-2.5 text-sm">
                        Issue coupon
                    </button>
                </div>
            </form>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="site-panel overflow-hidden rounded-3xl border">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/[0.03] text-[11px] uppercase tracking-wide site-text-muted dark:bg-white/[0.05]">
                        <tr>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3 text-right">Value</th>
                            <th className="px-4 py-3 text-right">Used</th>
                            <th className="px-4 py-3">Window</th>
                            <th className="px-4 py-3 text-right"> </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--site-border)]">
                        {loading && rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center">
                                    Loading…
                                </td>
                            </tr>
                        ) : (
                            rows.map((c) => <CouponEditRow key={c.id} c={c} onRefresh={load} />)
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

function CouponEditRow({ c, onRefresh }) {
    const [busy, setBusy] = useState(false);

    async function toggle() {
        setBusy(true);
        try {
            await patchCoupon(c.id, { is_active: !c.is_active });
            onRefresh?.();
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        if (!window.confirm(`Archive ${c.code}?`)) {
            return;
        }
        await deleteCoupon(c.id).catch(() => alert('Cannot delete'));
        onRefresh?.();
    }

    return (
        <tr className="align-top hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
            <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
            <td className="px-4 py-3 text-xs">{c.discount_type}</td>
            <td className="px-4 py-3 text-right">{c.discount_value}</td>
            <td className="px-4 py-3 text-right">{c.times_used}</td>
            <td className="px-4 py-3 text-xs site-text-muted">
                {c.starts_at || '—'} → {c.ends_at || '∞'}
            </td>
            <td className="space-y-1 px-4 py-3 text-right">
                <button type="button" disabled={busy} className="btn-outline block w-full px-3 py-1 text-[11px]" onClick={toggle}>
                    {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={remove}>
                    Delete
                </button>
            </td>
        </tr>
    );
}
