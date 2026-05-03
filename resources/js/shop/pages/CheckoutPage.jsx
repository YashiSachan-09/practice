import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api.js';
import { formatInr } from '../lib/money.js';
import { useShop } from '../context/ShopContext.jsx';

function shopCfg() {
    return typeof window !== 'undefined' ? window.__ANAYRA_SHOP__ : null;
}

function loadRazorpay() {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(window.Razorpay);
        s.onerror = () => reject(new Error('Razorpay script failed'));
        document.body.appendChild(s);
    });
}

export default function CheckoutPage() {
    const { refreshCart, user } = useShop();
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        customer_name: user?.name ?? '',
        customer_email: user?.email ?? '',
        customer_phone: '',
        shipping_address: '',
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                customer_name: f.customer_name || user.name,
                customer_email: f.customer_email || user.email,
            }));
        }
    }, [user]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const row = await api.fetchCheckoutPreview();
                if (! cancelled) {
                    setPreview(row.data);
                }
            } catch {
                if (! cancelled) {
                    setPreview(null);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    async function payWithRazorpay({ key_id, order_id, order_number }) {
        const Razorpay = await loadRazorpay();
        const verifyUrl = shopCfg()?.razorpayVerifyUrl;

        const options = {
            key: key_id,
            order_id,
            name: shopCfg()?.appName ?? 'Shop',
            description: `Order ${order_number}`,
            prefill: {
                name: form.customer_name,
                email: form.customer_email,
                contact: form.customer_phone,
            },
            theme: { color: '#4f46e5' },
            handler(response) {
                void (async () => {
                    setStatus('Verifying payment…');
                    try {
                        const res = await fetch(verifyUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                'X-CSRF-TOKEN': shopCfg()?.csrf ?? '',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            credentials: 'same-origin',
                            body: JSON.stringify({
                                order_number,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });
                        const data = await res.json().catch(() => ({}));
                        if (res.ok && data.redirect) {
                            window.location.href = data.redirect;
                            return;
                        }
                        setError(data.message || 'Payment verification failed.');
                    } catch {
                        setError('Network error verifying payment.');
                    }
                })();
            },
            modal: {
                ondismiss() {
                    setStatus('Payment window closed. You can retry from this page.');
                },
            },
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', (resp) => {
            setError(resp?.error?.description || 'Payment failed.');
        });
        rzp.open();
    }

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        setStatus('');
        try {
            const res = await api.submitCheckout(form);
            await refreshCart();
            const pay = res?.data?.payment;
            const orderNumber = res?.data?.order?.order_number;
            if (pay?.mode === 'razorpay') {
                setStatus('Opening Razorpay…');
                await payWithRazorpay({
                    key_id: pay.key_id,
                    order_id: pay.order_id,
                    order_number: pay.order_number,
                });
            } else if (pay?.redirect) {
                window.location.href = pay.redirect;
            } else if (res?.data?.confirmation_url) {
                window.location.href = res.data.confirmation_url;
            } else if (orderNumber) {
                window.location.href = `/order/confirmation/${encodeURIComponent(orderNumber)}`;
            }
        } catch (e) {
            const msg = e?.response?.data?.message;
            setError(typeof msg === 'string' ? msg : 'Checkout failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="font-display text-3xl text-slate-900 dark:text-white">Checkout</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Shipping details and payment (Razorpay when configured).</p>
            </div>

            {preview ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-medium text-slate-900 dark:text-white">Order summary</p>
                    <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                        {preview.lines?.map((l) => (
                            <li key={l.sku}>
                                {l.name} × {l.quantity} — {formatInr(l.line_total)}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                        <p>Subtotal {formatInr(preview.subtotal)}</p>
                        <p>Tax {formatInr(preview.tax)}</p>
                        <p>Shipping {formatInr(preview.shipping)}</p>
                        <p className="text-base font-semibold">Total {formatInr(preview.total)}</p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-slate-500">Loading summary…</p>
            )}

            <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <label className="block text-sm">
                    Full name
                    <input
                        required
                        value={form.customer_name}
                        onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block text-sm">
                    Email
                    <input
                        required
                        type="email"
                        value={form.customer_email}
                        onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block text-sm">
                    Phone
                    <input
                        value={form.customer_phone}
                        onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block text-sm">
                    Shipping address
                    <textarea
                        required
                        rows={4}
                        value={form.shipping_address}
                        onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>

                {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
                {status ? <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}

                <button
                    type="submit"
                    disabled={busy || !preview}
                    className="w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
                >
                    {busy ? 'Processing…' : 'Place order'}
                </button>
                <p className="text-center text-xs text-slate-500">
                    <Link to="/cart" className="underline">
                        Back to cart
                    </Link>
                </p>
            </form>
        </div>
    );
}
