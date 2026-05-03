import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';
import { useShop } from '../context/ShopContext.jsx';

export default function CatalogPage() {
    const { refreshCart } = useShop();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [category, setCategory] = useState('');
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(/** @type {Record<string, boolean>} */ ({}));
    const [message, setMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.fetchCategories();
                if (! cancelled) {
                    setCategories(res.data ?? []);
                }
            } catch {
                /* ignore */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    async function loadPage(page = 1) {
        setLoading(true);
        setMessage('');
        try {
            const res = await api.fetchProducts({ category: category || undefined, q: q || undefined, page });
            setProducts(res.data ?? []);
            setPagination({
                current_page: res.current_page,
                last_page: res.last_page,
                per_page: res.per_page,
                total: res.total,
            });
        } catch {
            setMessage('Could not load products.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- reset catalog when filters change
    }, [category, q]);

    async function addToCart(slug, key) {
        setAdding((m) => ({ ...m, [key]: true }));
        setMessage('');
        try {
            await api.postCartItem({ slug, quantity: 1 });
            await refreshCart();
            setMessage('Added to cart');
        } catch (e) {
            const msg = e?.response?.data?.message;
            setMessage(typeof msg === 'string' ? msg : 'Could not add to cart.');
        } finally {
            setAdding((m) => ({ ...m, [key]: false }));
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-3xl text-slate-900 dark:text-white">Shop</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Browse the catalog, add to cart, and checkout like a full storefront.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Category
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="ml-2 mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 sm:mt-0 sm:w-56"
                        >
                            <option value="">All</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Search
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Name or SKU"
                            className="ml-2 mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 sm:ml-2 sm:mt-0 sm:w-64"
                        />
                    </label>
                </div>
                {message ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
            </div>

            {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <article
                        key={p.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <Link to={`/p/${p.slug}`} className="block">
                            {p.image_url ? (
                                <img src={p.image_url} alt="" className="h-48 w-full object-cover" loading="lazy" />
                            ) : (
                                <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-800">No image</div>
                            )}
                        </Link>
                        <div className="space-y-2 p-4">
                            <Link to={`/p/${p.slug}`} className="font-display text-lg text-slate-900 dark:text-white">
                                {p.name}
                            </Link>
                            <p className="text-sm text-slate-500">{p.category?.name}</p>
                            <p className="text-base font-semibold text-indigo-700 dark:text-indigo-300">{formatInr(p.unit_price)}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Link to={`/p/${p.slug}`} className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-600">
                                    Details
                                </Link>
                                <button
                                    type="button"
                                    disabled={!!adding[p.slug]}
                                    onClick={() => void addToCart(p.slug, p.slug)}
                                    className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {adding[p.slug] ? 'Adding…' : 'Add to cart'}
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {pagination && pagination.last_page > 1 ? (
                <div className="flex items-center justify-center gap-3 text-sm">
                    <button
                        type="button"
                        disabled={pagination.current_page <= 1}
                        onClick={() => void loadPage(pagination.current_page - 1)}
                        className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
                    >
                        Previous
                    </button>
                    <span className="text-slate-600 dark:text-slate-300">
                        Page {pagination.current_page} / {pagination.last_page}
                    </span>
                    <button
                        type="button"
                        disabled={pagination.current_page >= pagination.last_page}
                        onClick={() => void loadPage(pagination.current_page + 1)}
                        className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
}
