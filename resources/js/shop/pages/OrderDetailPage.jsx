import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';

export default function OrderDetailPage() {
    const { order_number } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.fetchShopOrder(String(order_number));
                if (! cancelled) {
                    setOrder(res.data);
                }
            } catch {
                if (! cancelled) {
                    setOrder(null);
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
    }, [order_number]);

    if (loading) {
        return <p className="text-sm text-slate-500">Loading…</p>;
    }

    if (! order) {
        return (
            <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-300">Order not found.</p>
                <Link to="/orders" className="text-indigo-600 underline dark:text-indigo-400">
                    Back to orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/orders" className="text-sm text-indigo-600 underline dark:text-indigo-400">
                    ← Orders
                </Link>
                <h1 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">{order.order_number}</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {order.status} · Payment: {order.payment_status}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="font-medium text-slate-900 dark:text-white">Ship to</p>
                <p className="mt-2 whitespace-pre-wrap text-slate-600 dark:text-slate-300">{order.shipping_address}</p>
                {order.tracking_number ? (
                    <p className="mt-2 text-slate-700 dark:text-slate-200">Tracking: {order.tracking_number}</p>
                ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {order.items?.map((i) => (
                        <li key={`${i.sku}-${i.product_name}`} className="flex justify-between gap-3 p-3 text-sm">
                            <span className="text-slate-800 dark:text-slate-100">
                                {i.product_name} × {i.quantity}
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">{formatInr(i.line_total)}</span>
                        </li>
                    ))}
                </ul>
                <div className="space-y-1 border-t border-slate-200 p-4 text-sm dark:border-slate-800 dark:text-slate-200">
                    <p>Subtotal {formatInr(order.subtotal)}</p>
                    <p>Tax {formatInr(order.tax)}</p>
                    <p>Shipping {formatInr(order.shipping_fee)}</p>
                    <p className="text-base font-semibold">Total {formatInr(order.total)}</p>
                </div>
            </div>
        </div>
    );
}
