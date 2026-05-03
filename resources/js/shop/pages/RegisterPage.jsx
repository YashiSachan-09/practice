import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../lib/api.js';
import { useShop } from '../context/ShopContext.jsx';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { refreshBootstrap, refreshCart, setUser } = useShop();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            const res = await api.shopRegister(form);
            const u = res?.data?.user;
            setUser(u ?? null);
            await refreshBootstrap();
            await refreshCart();
            navigate('/');
        } catch (e) {
            const msgs = e?.response?.data?.errors;
            const first = msgs && typeof msgs === 'object' ? Object.values(msgs)[0]?.[0] : null;
            setError(first || e?.response?.data?.message || 'Registration failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h1 className="font-display text-2xl text-slate-900 dark:text-white">Register</h1>
            <form onSubmit={onSubmit} className="space-y-3 text-sm">
                <label className="block">
                    Name
                    <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block">
                    Email
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block">
                    Password
                    <input
                        required
                        type="password"
                        minLength={8}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                <label className="block">
                    Confirm password
                    <input
                        required
                        type="password"
                        value={form.password_confirmation}
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                </label>
                {error ? <p className="text-rose-600 dark:text-rose-400">{error}</p> : null}
                <button type="submit" disabled={busy} className="w-full rounded-full bg-indigo-600 py-2 font-medium text-white disabled:opacity-50">
                    {busy ? 'Creating…' : 'Create account'}
                </button>
            </form>
            <p className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 underline dark:text-indigo-400">
                    Log in
                </Link>
            </p>
        </div>
    );
}
