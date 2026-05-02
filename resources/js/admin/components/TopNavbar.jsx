import { useMemo, useState } from 'react';
import {
    MdClose,
    MdMenu,
    MdNotificationsNone,
    MdOpenInNew,
    MdSearch,
    MdTune,
} from 'react-icons/md';
import LogoutForm from './LogoutForm.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { ADMIN_PAINTING_BACKDROP_URL } from '../data/adminNavBackdrop.js';

const sampleNotifications = [
    { title: 'Payout consolidated', subtitle: '₹82,440 settled · Stripe', time: '2m ago' },
    { title: 'New wholesale inquiry', subtitle: 'Mumbai concierge desk', time: '18m ago' },
    { title: 'SKU “Heritage XII” synced', subtitle: 'Inventory bridge · Etsy', time: '1h ago' },
];

export default function TopNavbar({ onOpenSidebar }) {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : { user: { name: 'Admin' } };
    const [openNotif, setOpenNotif] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const name = cfg?.user?.name ?? 'Admin';

    const marketplaceUrl = useMemo(() => cfg?.marketplaceUrl ?? '/', []);

    return (
        <header className="sticky top-0 z-30 overflow-x-hidden border-b border-[var(--site-border)] backdrop-blur-xl relative">
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                <img
                    src={ADMIN_PAINTING_BACKDROP_URL}
                    alt=""
                    className="h-full min-h-[4.75rem] w-full object-cover object-[center_32%] opacity-[0.22] saturate-[1.05] dark:opacity-[0.17]"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--site-header)]/93 via-[var(--site-bg-soft)]/84 to-[var(--site-header)]/93 dark:from-slate-950/93 dark:via-slate-900/84 dark:to-slate-950/93" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/[0.07] via-transparent to-amber-100/35 dark:from-indigo-500/12 dark:to-gallery-void/20" />
            </div>

            <div className="relative z-[1] flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    className="site-theme-btn inline-flex rounded-xl p-2 transition hover:opacity-90 lg:hidden"
                    onClick={onOpenSidebar}
                    aria-label="Open navigation"
                >
                    <MdMenu className="text-2xl" />
                </button>

                <div className="relative flex min-w-[200px] max-w-xl flex-1 items-center rounded-full border border-[var(--site-border)]/90 bg-[var(--site-bg-soft)]/72 shadow-inner backdrop-blur-md dark:bg-slate-900/45">
                    <MdSearch className="ml-4 text-xl site-text-muted" aria-hidden />
                    <input
                        type="search"
                        placeholder="Search orders, SKU, concierge notes…"
                        className="flex-1 border-0 bg-transparent py-3 pr-6 pl-3 text-sm text-[var(--site-text)] placeholder:opacity-70 focus:ring-0"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <ThemeToggle className="shrink-0" />
                    <div className="relative hidden sm:block">
                        <button
                            type="button"
                            aria-expanded={openNotif}
                            onClick={() => {
                                setOpenNotif(!openNotif);
                                setOpenProfile(false);
                            }}
                            className="relative rounded-full p-3 text-xl site-text-muted transition hover:bg-black/[0.06] dark:hover:bg-white/10"
                            aria-label="Notifications"
                        >
                            <MdNotificationsNone />
                            <span className="absolute right-2 top-1 h-5 min-w-5 rounded-full bg-rose-500 px-1.5 text-center text-[11px] font-bold leading-5 text-white">
                                {sampleNotifications.length}
                            </span>
                        </button>
                        {openNotif ? (
                            <div className="site-panel absolute right-0 mt-4 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl shadow-2xl shadow-black/15">
                                <div className="flex items-center justify-between border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] site-text-muted border-[var(--site-border)]">
                                    Alerts
                                    <button
                                        type="button"
                                        aria-label="Close notifications"
                                        onClick={() => setOpenNotif(false)}
                                        className="site-text-muted rounded-lg p-1 hover:bg-black/[0.06] dark:hover:bg-white/10"
                                    >
                                        <MdClose />
                                    </button>
                                </div>
                                <div className="max-h-[17rem] divide-y divide-[var(--site-border)] overflow-y-auto">
                                    {sampleNotifications.map((note) => (
                                        <button
                                            key={note.title}
                                            type="button"
                                            className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                                        >
                                            <span className="text-sm font-semibold text-[var(--site-text)]">{note.title}</span>
                                            <span className="text-xs site-text-muted">{note.subtitle}</span>
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                                                {note.time}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenProfile(!openProfile);
                                setOpenNotif(false);
                            }}
                            className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1.5 text-left transition hover:bg-black/[0.04] dark:hover:bg-white/10"
                            aria-expanded={openProfile}
                        >
                            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-xs font-semibold uppercase text-white">
                                {name
                                    .split(' ')
                                    .map((segment) => segment[0])
                                    .join('')
                                    .slice(0, 3)
                                    .toUpperCase()}
                            </span>
                            <div className="hidden text-sm font-semibold text-[var(--site-text)] sm:flex sm:flex-col sm:leading-tight">
                                {name}
                                <span className="text-[11px] font-medium uppercase tracking-wide site-text-muted">Administrative workspace</span>
                            </div>
                            <MdTune className="site-text-muted hidden text-xl sm:flex" aria-hidden />
                        </button>

                        {openProfile ? (
                            <div className="site-panel absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl shadow-black/15">
                                <a
                                    href={marketplaceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--site-text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                                >
                                    <MdOpenInNew className="text-lg text-blue-700 dark:text-blue-300" aria-hidden /> View storefront
                                </a>
                                <LogoutForm>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-300"
                                    >
                                        Sign out securely
                                    </button>
                                </LogoutForm>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
}
