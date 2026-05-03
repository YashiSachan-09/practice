import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';
import { useShop } from '../context/ShopContext.jsx';

export default function CartPage() {
    const { refreshCart } = useShop();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function reload() {
        setLoading(true);
        try {
            const row = await api.fetchCart();
            setItems(row?.data?.items ?? []);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
        await refreshCart();
    }

    useEffect(() => {
        void reload();
    }, []);

    async function updateQty(id, qty) {
        await api.patchCartItem(id, { quantity: qty });
        await reload();
    }

    async function remove(id) {
        await api.deleteCartItem(id);
        await reload();
    }

    const subtotal = items.reduce((s, it) => {
        const price = it.product?.unit_price ?? 0;
        return s + price * (it.quantity || 0);
    }, 0);

    if (loading) {
        return <p className="text-sm text-slate-500">Loading cart…</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-display text-3xl text-slate-900 dark:text-white">Cart</h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Update quantities or proceed to checkout.</p>
                </div>
                <Link
                    to="/checkout"
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
                >
                    Checkout
                </Link>
            </div>

            {items.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-300">
                    Your cart is empty.{' '}
                    <Link className="text-indigo-600 underline dark:text-indigo-400" to="/">
                        Continue shopping
                    </Link>
                </p>
            ) : (
                <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {items.map((it) => (
                        <li key={it.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{it.product?.name}</p>
                                <p className="text-sm text-slate-500">{formatInr(it.product?.unit_price)} each</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={it.quantity}
                                    onChange={(e) => void updateQty(it.id, Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                                    className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {formatInr((it.product?.unit_price ?? 0) * (it.quantity || 0))}
                                </span>
                                <button type="button" onClick={() => void remove(it.id)} className="text-sm text-rose-600 underline dark:text-rose-400">
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {items.length > 0 ? (
                <div className="flex justify-end text-sm text-slate-600 dark:text-slate-300">
                    Subtotal (excl. tax &amp; shipping){' '}
                    <span className="ml-2 font-semibold text-slate-900 dark:text-white">{formatInr(subtotal)}</span>
                </div>
            ) : null}
        </div>
    );
}
