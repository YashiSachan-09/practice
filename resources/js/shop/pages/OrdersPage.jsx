import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';

export default function OrdersPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.fetchShopOrders({});
                if (! cancelled) {
                    setRows(res.data ?? []);
                }
            } catch {
                if (! cancelled) {
                    setRows([]);
                }
            } finally {
                if (! cancelled) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <p className="text-sm text-slate-500">Loading orders…</p>;
    }

    return (
        <div className="space-y-4">
            <h1 className="font-display text-3xl text-slate-900 dark:text-white">My orders</h1>
            {rows.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-300">
                    No orders yet.{' '}
                    <Link className="text-indigo-600 underline dark:text-indigo-400" to="/">
                        Start shopping
                    </Link>
                </p>
            ) : (
                <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {rows.map((o) => (
                        <li key={o.order_number} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-mono text-sm text-slate-500">{o.order_number}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {o.status} · {o.payment_status}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-semibold text-slate-900 dark:text-white">{formatInr(o.total)}</p>
                                <Link
                                    to={`/orders/${encodeURIComponent(o.order_number)}`}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-600"
                                >
                                    View
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
