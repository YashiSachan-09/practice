import { MdClose, MdLogout, MdStorefront } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { ADMIN_PAINTING_BACKDROP_URL } from '../data/adminNavBackdrop.js';
import { NAV_PRIMARY } from '../constants/navigation.js';
import LogoutForm from './LogoutForm.jsx';

function initials(name) {
    if (!name || typeof name !== 'string') {
        return 'AD';
    }
    const bits = name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
    return bits.join('') || 'AD';
}

export default function Sidebar({ mobileOpen, onClose }) {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : { user: { name: 'Admin', email: '' } };
    const name = cfg?.user?.name ?? 'Admin';

    const panelClasses = `
        relative flex w-72 flex-col overflow-hidden border-e border-slate-200/90 shadow-xl shadow-black/10
        backdrop-blur-[2px] transition-transform duration-300 ease-out dark:border-slate-600/70 dark:shadow-black/40
        fixed inset-y-0 left-0 z-40 lg:static lg:z-10 lg:translate-x-0 lg:shadow-lg
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `;

    const linkBase =
        'group flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition';
    const linkIdle =
        'site-text-muted hover:bg-black/[0.06] hover:text-[var(--site-text)] dark:hover:bg-white/[0.1] dark:hover:text-[var(--site-text)]';
    const linkActive =
        'bg-black/10 text-[var(--site-text)] shadow-inner shadow-black/5 dark:bg-white/[0.15] dark:text-white dark:shadow-white/10';

    return (
        <div className={panelClasses}>
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                <img
                    src={ADMIN_PAINTING_BACKDROP_URL}
                    alt=""
                    className="h-full w-full object-cover object-[center_20%] opacity-[0.26] saturate-[1.08] dark:opacity-[0.2] dark:saturate-90"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--site-bg-soft)]/93 via-[var(--site-bg-soft)]/82 to-[var(--site-bg-soft)]/94 dark:from-slate-900/93 dark:via-slate-900/82 dark:to-slate-950/94" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-amber-200/30 dark:from-indigo-400/14 dark:to-gallery-void/25" />
            </div>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col py-6">
                <div className="flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-950 to-blue-700 text-xl text-white shadow-md shadow-blue-900/40 ring-2 ring-white/25 dark:ring-white/15">
                            <MdStorefront aria-hidden />
                        </span>
                        <div className="leading-tight">
                            <p className="section-kicker text-[10px]">A7 ANAYARAA</p>
                            <p className="font-display text-xl font-semibold text-[var(--site-text)] drop-shadow-[0_1px_1px_rgb(255_255_255/0.4)] dark:text-white dark:drop-shadow-none">
                                Admin
                            </p>
                            <p className="mt-0.5 text-[11px] site-text-muted">Gallery commerce</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={onClose}
                        className="rounded-xl p-2 site-text-muted transition hover:bg-black/[0.06] hover:text-[var(--site-text)] dark:hover:bg-white/10 lg:hidden"
                    >
                        <MdClose className="text-2xl" aria-hidden />
                    </button>
                </div>

                <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
                    {NAV_PRIMARY.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
                        >
                            <Icon className="text-xl opacity-90" aria-hidden />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto space-y-5 px-3 pt-10">
                    <LogoutForm className="w-full">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
                        >
                            <MdLogout aria-hidden className="text-xl" /> Log out
                        </button>
                    </LogoutForm>

                    <div className="rounded-2xl border border-[var(--site-border)]/80 bg-[var(--site-bg-soft)]/75 p-4 shadow-inner backdrop-blur-sm dark:bg-slate-900/55 dark:border-slate-600/50">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-indigo-600 text-sm font-bold text-white shadow-md">
                                {initials(name)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[var(--site-text)] dark:text-white">{name}</p>
                                <p className="truncate text-[11px] uppercase tracking-wide site-text-muted">Super admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
