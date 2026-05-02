import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import TopNavbar from '../components/TopNavbar.jsx';

export default function AdminLayout() {
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--site-bg)] text-[var(--site-text)]">
            {mobileNav ? (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    className="fixed inset-0 z-30 bg-black/35 backdrop-blur-sm dark:bg-black/55 lg:hidden"
                    onClick={() => setMobileNav(false)}
                />
            ) : null}

            <div className="flex min-h-screen">
                <Sidebar mobileOpen={mobileNav} onClose={() => setMobileNav(false)} />

                <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
                    <TopNavbar onOpenSidebar={() => setMobileNav(true)} />
                    <main className="flex min-h-0 flex-1 flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
                        <Outlet />
                    </main>
                    <footer className="site-panel border-x-0 border-b-0 border-t py-6 text-center text-xs site-text-muted">
                        © {new Date().getFullYear()} A7 ANAYARAA · Admin mirrors storefront typography and palette (Outfit · Cormorant Garamond).
                    </footer>
                </div>
            </div>
        </div>
    );
}
