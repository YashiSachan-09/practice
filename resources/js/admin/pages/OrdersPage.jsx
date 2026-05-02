import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import { fetchOrders, patchOrder } from '../lib/api.js';

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const currencyFmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

function formatWhen(iso) {
    if (!iso) {
        return '—';
    }
    try {
        return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch {
        return '—';
    }
}

function paymentChipClass(ps) {
    switch (ps) {
        case 'paid':
            return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20';
        case 'failed':
            return 'bg-rose-50 text-rose-700 ring-rose-600/20';
        case 'refunded':
            return 'bg-slate-100 text-slate-700 ring-slate-500/15';
        default:
            return 'bg-amber-50 text-amber-900 ring-amber-600/15';
    }
}

function FulfillmentStrip({ status, confirmed_at, packed_at, shipped_at, delivered_at }) {
    const cancelled = status === 'cancelled';
    const steps = [
        { key: 'confirmed', label: 'Confirmed', done: !!(confirmed_at && !cancelled) },
        { key: 'packed', label: 'Packed', done: !!(packed_at && !cancelled) },
        { key: 'shipped', label: 'Shipped', done: !!(shipped_at && !cancelled) },
        { key: 'delivered', label: 'Delivered', done: !!(delivered_at && !cancelled) },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2 pt-3">
            {steps.map((s) => (
                <span
                    key={s.key}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                        s.done ? 'bg-indigo-50 text-indigo-800 ring-indigo-600/15' : 'bg-slate-50 text-slate-500 ring-slate-200'
                    }`}
                >
                    {s.done ? `✓ ${s.label}` : s.label}
                </span>
            ))}
        </div>
    );
}

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, paymentFilter, debouncedQuery]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetchOrders({
                page,
                status: statusFilter || undefined,
                payment_status: paymentFilter || undefined,
                q: debouncedQuery || undefined,
            });
            setPayload(res);
        } catch {
            setError('Orders could not be loaded. Refresh or sign in again.');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, paymentFilter, debouncedQuery]);

    useEffect(() => {
        load();
    }, [load]);

    const orders = payload?.data ?? [];
    const pagination = useMemo(() => {
        if (!payload) {
            return { current_page: 1, last_page: 1, total: 0 };
        }
        return {
            current_page: payload.current_page,
            last_page: payload.last_page,
            total: payload.total,
            per_page: payload.per_page,
        };
    }, [payload]);

    async function persistOrder(previous, updates) {
        try {
            await patchOrder(previous.id, updates);
            await load();
            return true;
        } catch {
            alert('Could not save changes. Try again.');
            return false;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.42em] text-indigo-500">Operations</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Orders</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        Fulfillment ledger with confirmation, packing, shipment, delivery, and cancellation checkpoints. Filters and inline
                        edits post to Laravel; timestamps advance automatically when you move status forward.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="flex min-w-[200px] flex-1 flex-col gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Search
                    <input
                        type="search"
                        placeholder="Order # · name · email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none ring-indigo-500/0 transition focus:border-indigo-400 focus:ring-4"
                    />
                </label>
                <label className="flex min-w-[160px] flex-col gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Order status
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-400"
                    >
                        <option value="">All</option>
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex min-w-[160px] flex-col gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Payment
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-400"
                    >
                        <option value="">All</option>
                        {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</div>
            ) : null}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Showing {pagination.total === 0 ? '0' : `${orders.length} of ${pagination.total}`} orders
                    {loading ? ' · loading…' : ''}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                        <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Order</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Updated</th>
                                <th className="px-4 py-3 text-right"> </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                                        Loading orders…
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                                        No orders match these filters.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <Fragment key={order.id}>
                                        <tr className="bg-white hover:bg-indigo-50/40">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <p className="font-semibold text-indigo-600">{order.order_number}</p>
                                                <p className="text-xs text-slate-500">#{order.id}</p>
                                            </td>
                                            <td className="max-w-[220px] px-4 py-3">
                                                <p className="truncate font-semibold text-slate-900">{order.customer_name}</p>
                                                <p className="truncate text-xs text-slate-500">{order.customer_email}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">
                                                {currencyFmt.format(Number(order.total))}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${paymentChipClass(order.payment_status)}`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                                {formatWhen(order.updated_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
                                                    className="rounded-2xl border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
                                                >
                                                    {expandedId === order.id ? 'Close' : 'Manage'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedId === order.id ? (
                                            <tr className="bg-slate-50/90">
                                                <td colSpan={7} className="px-4 py-6">
                                                    <ExpandedOrderPanel order={order} onSave={persistOrder} />
                                                </td>
                                            </tr>
                                        ) : null}
                                    </Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-500">
                        Page {pagination.current_page} of {pagination.last_page}
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={pagination.current_page <= 1 || loading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={pagination.current_page >= pagination.last_page || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExpandedOrderPanel({ order, onSave }) {
    const [status, setStatus] = useState(order.status);
    const [payment_status, setPaymentStatus] = useState(order.payment_status);
    const [tracking_number, setTracking] = useState(order.tracking_number ?? '');
    const [admin_notes, setNotes] = useState(order.admin_notes ?? '');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setStatus(order.status);
        setPaymentStatus(order.payment_status);
        setTracking(order.tracking_number ?? '');
        setNotes(order.admin_notes ?? '');
    }, [order]);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        const ok = await onSave(order, {
            status,
            payment_status,
            tracking_number: tracking_number.trim() || null,
            admin_notes: admin_notes.trim() || null,
        });
        setBusy(false);
        if (!ok) {
            return;
        }
    }

    const items = order.items ?? [];

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Line items</p>
                        <p className="text-base font-semibold text-slate-900">{items.length} SKU(s)</p>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                        Tracking:{' '}
                        <span className="text-slate-900">{order.tracking_number || 'Not assigned yet'}</span>
                    </div>
                </div>
                <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                    {items.length === 0 ? (
                        <li className="px-4 py-6 text-sm text-slate-500">No line items captured for this order.</li>
                    ) : (
                        items.map((item, idx) => (
                            <li key={`${item.sku ?? 'sku'}-${idx}`} className="flex flex-wrap items-center gap-4 px-4 py-4">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-slate-900">{item.product_name}</p>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{item.sku || 'SKU pending'}</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">{item.quantity} ×</p>
                                <p className="text-sm font-semibold text-emerald-700">{currencyFmt.format(Number(item.unit_price))}</p>
                                <p className="text-sm font-semibold text-slate-900">{currencyFmt.format(Number(item.line_total))}</p>
                            </li>
                        ))
                    )}
                </ul>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">Totals</p>
                    <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                            ['Subtotal', order.subtotal],
                            ['Tax', order.tax],
                            ['Shipping', order.shipping_fee],
                            ['Grand total', order.total],
                        ].map(([label, amount]) => (
                            <div key={label} className="flex items-center justify-between gap-4">
                                <dt className="text-slate-600">{label}</dt>
                                <dd className="font-semibold text-slate-900">{currencyFmt.format(Number(amount))}</dd>
                            </div>
                        ))}
                    </dl>
                    <FulfillmentStrip
                        status={order.status}
                        confirmed_at={order.confirmed_at}
                        packed_at={order.packed_at}
                        shipped_at={order.shipped_at}
                        delivered_at={order.delivered_at}
                    />
                    {order.status === 'cancelled' ? (
                        <p className="mt-3 text-xs font-semibold text-rose-700">Cancelled · {formatWhen(order.cancelled_at)}</p>
                    ) : null}
                </div>
            </div>

            <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-inner lg:col-span-5" onSubmit={submit}>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Update shipment</p>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Workflow status
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                    >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <span className="text-[11px] font-normal normal-case text-slate-500">
                        Moving ahead stamps missing milestones (confirmation → packing → shipment → delivery).
                    </span>
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment capture
                    <select
                        value={payment_status}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                    >
                        {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tracking number
                    <input
                        value={tracking_number}
                        onChange={(e) => setTracking(e.target.value)}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none"
                        placeholder="Carrier reference"
                    />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admin notes
                    <textarea
                        value={admin_notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none"
                        placeholder="Internal context for concierge + warehouse"
                    />
                </label>

                <div className="grid gap-3 rounded-2xl border border-dashed border-slate-200 p-4 text-[11px] text-slate-600">
                    <p className="font-semibold uppercase tracking-wide text-slate-700">Recorded milestones</p>
                    <ul className="space-y-1">
                        {[
                            ['Confirmed', order.confirmed_at],
                            ['Packed', order.packed_at],
                            ['Shipped', order.shipped_at],
                            ['Delivered', order.delivered_at],
                        ].map(([label, iso]) => (
                            <li key={label} className="flex justify-between gap-4">
                                <span>{label}</span>
                                <span className="font-semibold text-slate-900">{formatWhen(iso)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/25 disabled:opacity-50"
                >
                    {busy ? 'Saving…' : 'Save changes'}
                </button>
            </form>
        </div>
    );
}
