import { useEffect, useMemo, useState } from 'react';
import { deleteAdminProduct, fetchAdminProducts, fetchCategories, patchAdminProduct, postAdminProduct } from '../lib/api.js';

function moneyInr(n) {
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n) || 0);
    } catch {
        return `₹${Number(n).toFixed(2)}`;
    }
}

const emptyForm = {
    sku: '',
    name: '',
    unit_price: '',
    category_id: '',
    stock_quantity: '999',
    image_url: '',
    description: '',
    is_active: true,
    sort_order: '0',
};

export default function ProductsPage() {
    const shopUrl = '/shop';
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const reload = async () => {
        setLoading(true);
        setError('');
        try {
            const paginator = await fetchAdminProducts({ per_page: 100 });
            setRows(paginator?.data ?? []);
        } catch (e) {
            console.error(e);
            setError('Could not load products.');
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void reload();
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetchCategories({ active_only: true, per_page: 200 });
                const data = Array.isArray(res?.data) ? res.data : res?.data?.data ?? res?.data ?? [];
                const list = typeof data?.length === 'number' ? data : [];
                if (! cancelled) {
                    setCategories(Array.isArray(list) ? list : []);
                }
            } catch {
                if (! cancelled) {
                    setCategories([]);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const categorySelect = useMemo(
        () =>
            categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                    {c.name}
                </option>
            )),
        [categories]
    );

    async function saveProduct(e) {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');
        try {
            const payload = {
                sku: form.sku.trim(),
                name: form.name.trim(),
                unit_price: Number(form.unit_price),
                stock_quantity: form.stock_quantity === '' ? 0 : Number(form.stock_quantity),
                category_id: form.category_id ? Number(form.category_id) : null,
                image_url: form.image_url.trim() || null,
                description: form.description.trim() || null,
                is_active: !! form.is_active,
                sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
            };
            if (editingId) {
                await patchAdminProduct(editingId, payload);
                setMessage('Product updated.');
            } else {
                await postAdminProduct(payload);
                setMessage('Product created.');
            }
            setForm(emptyForm);
            setEditingId(null);
            await reload();
        } catch (e) {
            const msgs = e?.response?.data;
            const m = msgs?.message || (typeof msgs === 'string' ? msgs : null);
            setError(m || 'Save failed.');
        } finally {
            setSaving(false);
        }
    }

    function startEdit(row) {
        setEditingId(row.id);
        setForm({
            sku: row.sku,
            name: row.name,
            unit_price: String(row.unit_price),
            category_id: row.category_id ? String(row.category_id) : '',
            stock_quantity: String(row.stock_quantity ?? 0),
            image_url: row.image_url ?? '',
            description: row.description ?? '',
            is_active: !! row.is_active,
            sort_order: String(row.sort_order ?? 0),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function remove(row) {
        if (! window.confirm(`Delete ${row.name}?`)) {
            return;
        }
        setSaving(true);
        try {
            await deleteAdminProduct(row.id);
            setMessage('Product deleted.');
            if (editingId === row.id) {
                setEditingId(null);
                setForm(emptyForm);
            }
            await reload();
        } catch {
            setError('Delete failed.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="section-kicker text-[11px]">Catalog</p>
                    <h1 className="font-display mt-2 text-3xl text-slate-900 dark:text-white">Products</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                        Items here power the public React shop at <span className="font-mono">{shopUrl}</span>. Shipping and tax still follow{' '}
                        <code className="rounded bg-slate-200/80 px-1 py-0.5 text-[11px] dark:bg-white/10">config/storefront.php</code>.
                    </p>
                </div>
                <a href={shopUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                    Open live shop
                </a>
            </div>

            <form
                onSubmit={saveProduct}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">{editingId ? `Edit product #${editingId}` : 'Create product'}</p>
                    {editingId ? (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                            className="text-xs text-slate-600 underline dark:text-slate-300"
                        >
                            Cancel edit
                        </button>
                    ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                        SKU {! editingId ? <span className="text-rose-500">*</span> : <span className="text-xs text-slate-500">(immutable)</span>}
                        <input
                            disabled={!! editingId}
                            required={! editingId}
                            value={form.sku}
                            onChange={(e) => setForm({ ...form, sku: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-800"
                        />
                    </label>
                    <label className="block">
                        Name *
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="block">
                        Unit price (INR) *
                        <input
                            required
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.unit_price}
                            onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="block">
                        Stock
                        <input
                            type="number"
                            min={0}
                            value={form.stock_quantity}
                            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="block">
                        Category
                        <select
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="">—</option>
                            {categorySelect}
                        </select>
                    </label>
                    <label className="block">
                        Sort order
                        <input
                            type="number"
                            value={form.sort_order}
                            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="md:col-span-2 block">
                        Image URL
                        <input
                            value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="md:col-span-2 block">
                        Description
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </label>
                    <label className="flex items-center gap-2 md:col-span-2">
                        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                        Active (visible in shop)
                    </label>
                </div>
                {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
                {message ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
                <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}
                </button>
            </form>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Active</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-slate-500">
                                    Loading…
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-slate-500">
                                    No products yet — seed or create above.
                                </td>
                            </tr>
                        ) : (
                            rows.map((p) => (
                                <tr key={p.id} className="text-slate-800 dark:text-slate-100">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                                    <td className="px-4 py-3">{moneyInr(p.unit_price)}</td>
                                    <td className="px-4 py-3">{p.stock_quantity}</td>
                                    <td className="px-4 py-3">{p.is_active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => startEdit(p)} className="text-indigo-600 underline dark:text-indigo-400">
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => void remove(p)} className="text-rose-600 underline dark:text-rose-400">
                                                Delete
                                            </button>
                                            <a
                                                href={`${shopUrl}/p/${encodeURIComponent(p.slug)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-600 underline dark:text-slate-300"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
