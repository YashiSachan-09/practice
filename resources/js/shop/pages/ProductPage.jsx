import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';
import { useShop } from '../context/ShopContext.jsx';

export default function ProductPage() {
    const { slug } = useParams();
    const { refreshCart } = useShop();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await api.fetchProduct(String(slug));
                if (! cancelled) {
                    setProduct(res.data);
                }
            } catch {
                if (! cancelled) {
                    setProduct(null);
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
    }, [slug]);

    async function add() {
        if (! product) {
            return;
        }
        setAdding(true);
        setMessage('');
        try {
            await api.postCartItem({ slug: product.slug, quantity: qty });
            await refreshCart();
            setMessage('Added to cart');
        } catch (e) {
            const msg = e?.response?.data?.message;
            setMessage(typeof msg === 'string' ? msg : 'Could not add to cart.');
        } finally {
            setAdding(false);
        }
    }

    if (loading) {
        return <p className="text-sm text-slate-500">Loading…</p>;
    }

    if (! product) {
        return (
            <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300">Product not found.</p>
                <Link to="/" className="text-indigo-600 underline dark:text-indigo-400">
                    Back to shop
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div>
                {product.image_url ? (
                    <img src={product.image_url} alt="" className="w-full rounded-2xl object-cover shadow-sm" />
                ) : (
                    <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">No image</div>
                )}
            </div>
            <div className="space-y-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{product.category?.name}</p>
                <h1 className="font-display text-3xl text-slate-900 dark:text-white">{product.name}</h1>
                <p className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">{formatInr(product.unit_price)}</p>
                {product.description ? <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p> : null}
                <p className="text-xs text-slate-500">SKU {product.sku} · In stock: {product.stock_quantity}</p>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-300">
                        Qty
                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                            className="ml-2 w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => void add()}
                        disabled={adding}
                        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {adding ? 'Adding…' : 'Add to cart'}
                    </button>
                    <Link to="/cart" className="text-sm text-indigo-600 underline dark:text-indigo-400">
                        View cart
                    </Link>
                </div>
                {message ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
            </div>
        </div>
    );
}
