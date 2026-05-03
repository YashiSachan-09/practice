import { Link, NavLink, Outlet } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import * as api from '../lib/api.js';

function cfg() {
    return typeof window !== 'undefined' ? window.__ANAYRA_SHOP__ : null;
}

export default function ShopLayout() {
    const { user, cartCount, refreshBootstrap, refreshCart } = useShop();

    async function onLogout() {
        try {
            await api.shopLogout();
        } catch {
            /* ignore */
        }
        await refreshBootstrap();
        await refreshCart();
    }

    const gallery = cfg()?.galleryHomeUrl ?? '/';

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-indigo-700 dark:text-indigo-300">
                            {cfg()?.appName ?? 'Shop'}
                        </Link>
                        <nav className="hidden items-center gap-2 text-sm sm:flex">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `rounded-full px-3 py-1 ${isActive ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'}`
                                }
                                end
                            >
                                Browse
                            </NavLink>
                            <NavLink
                                to="/cart"
                                className={({ isActive }) =>
                                    `rounded-full px-3 py-1 ${isActive ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'}`
                                }
                            >
                                Cart {cartCount > 0 ? `(${cartCount})` : ''}
                            </NavLink>
                            {user ? (
                                <NavLink
                                    to="/orders"
                                    className={({ isActive }) =>
                                        `rounded-full px-3 py-1 ${isActive ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'}`
                                    }
                                >
                                    My orders
                                </NavLink>
                            ) : null}
                        </nav>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <a href={gallery} className="text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline dark:text-slate-400">
                            Gallery site
                        </a>
                        {user ? (
                            <>
                                <span className="hidden text-slate-500 sm:inline">{user.name}</span>
                                {user.is_admin ? (
                                    <a href={cfg()?.routes?.admin ?? '/admin/dashboard'} className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100">
                                        Admin
                                    </a>
                                ) : null}
                                <button type="button" onClick={() => void onLogout()} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="rounded-full px-3 py-1 text-slate-700 dark:text-slate-200">
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full bg-indigo-600 px-3 py-1 font-medium text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Outlet />
            </main>
            <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Secure checkout · GST as configured · Need help?{' '}
                <a className="underline" href={gallery}>
                    Contact gallery
                </a>
            </footer>
        </div>
    );
}
