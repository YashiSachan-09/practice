import { Fragment, useCallback, useEffect, useState } from 'react';
import PaginationControls from '../components/PaginationControls.jsx';
import { fetchCustomers, patchCustomer } from '../lib/api.js';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function formatWhen(iso) {
    if (!iso) {
        return '—';
    }
    try {
        return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(iso));
    } catch {
        return '—';
    }
}

export default function CustomersPage() {
    const [payload, setPayload] = useState(null);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [debounced, setDebounced] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(q.trim()), 300);
        return () => clearTimeout(t);
    }, [q]);

    useEffect(() => {
        setPage(1);
    }, [debounced]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchCustomers({ page, q: debounced || undefined });
            setPayload(data);
        } catch {
            setError('Could not load customers.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced]);

    useEffect(() => {
        load();
    }, [load]);

    const rows = payload?.data ?? [];

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker text-[11px]">People</p>
                <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Customers</h1>
                <p className="mt-2 max-w-2xl text-sm site-text-muted">Profiles linked by email to order history; concierge notes stay internal.</p>
            </div>

            <div className="site-panel rounded-3xl border p-4">
                <input
                    type="search"
                    placeholder="Search name, email, phone…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                />
            </div>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="site-panel overflow-hidden rounded-3xl border">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/[0.03] text-[11px] font-semibold uppercase tracking-wide site-text-muted dark:bg-white/[0.05]">
                        <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3 text-right">Orders</th>
                            <th className="px-4 py-3 text-right">Paid lifetime</th>
                            <th className="px-4 py-3">Last order</th>
                            <th className="px-4 py-3 text-right"> </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--site-border)]">
                        {loading && rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center site-text-muted">
                                    Loading…
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-[var(--site-text)]">{row.name}</p>
                                            <p className="text-xs site-text-muted">{row.email}</p>
                                            {row.phone ? <p className="text-xs site-text-muted">{row.phone}</p> : null}
                                        </td>
                                        <td className="px-4 py-3 text-right">{row.orders_count}</td>
                                        <td className="px-4 py-3 text-right">{inr.format(Number(row.lifetime_inr ?? 0))}</td>
                                        <td className="px-4 py-3 text-xs site-text-muted">{formatWhen(row.last_order_at)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                className="btn-outline px-4 py-1.5 text-xs"
                                                onClick={() => setOpenId((id) => (id === row.id ? null : row.id))}
                                            >
                                                {openId === row.id ? 'Close' : 'Notes'}
                                            </button>
                                        </td>
                                    </tr>
                                    {openId === row.id ? (
                                        <CustomerNotesEditor row={row} onSaved={load} onClose={() => setOpenId(null)} />
                                    ) : null}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
                {payload ? (
                    <PaginationControls
                        page={payload.current_page}
                        lastPage={payload.last_page}
                        total={payload.total}
                        loading={loading}
                        onPage={setPage}
                    />
                ) : null}
            </div>
        </div>
    );
}

function CustomerNotesEditor({ row, onSaved, onClose }) {
    const [name, setName] = useState(row.name ?? '');
    const [phone, setPhone] = useState(row.phone ?? '');
    const [notes, setNotes] = useState(row.admin_notes ?? '');
    const [busy, setBusy] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        try {
            await patchCustomer(row.id, { name, phone: phone || null, admin_notes: notes || null });
            onSaved?.();
            onClose?.();
        } catch {
            alert('Save failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <tr>
            <td colSpan={5} className="bg-black/[0.02] px-4 py-5 dark:bg-white/[0.03]">
                <form className="mx-auto grid max-w-3xl gap-4" onSubmit={submit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">
                            Display name
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                            />
                        </label>
                        <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">
                            Phone
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                            />
                        </label>
                    </div>
                    <label className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">
                        Concierge / admin notes
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-3 py-2 text-sm"
                            placeholder="Internal only — gifting preferences, SLA, risk flags…"
                        />
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button type="submit" disabled={busy} className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
                            {busy ? 'Saving…' : 'Save profile'}
                        </button>
                        <button type="button" className="btn-outline px-6 py-2 text-sm" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </td>
        </tr>
    );
}
