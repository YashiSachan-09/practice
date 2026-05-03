import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../lib/api.js';

/** @typedef {{ name: string; email: string; is_admin: boolean }} ShopUser */

const ShopContext = createContext(null);

/** @param {{ children: import('react').ReactNode }} props */
export function ShopProvider({ children }) {
    const [user, setUser] = useState(/** @type {ShopUser|null} */ (null));
    const [bootstrapped, setBootstrapped] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState(/** @type {string|null} */ (null));

    const refreshBootstrap = useCallback(async () => {
        setError(null);
        try {
            const row = await api.fetchBootstrap();
            setUser(row.user);
        } catch (e) {
            console.error(e);
            setError('Could not reach the server.');
        } finally {
            setBootstrapped(true);
        }
    }, []);

    const refreshCart = useCallback(async () => {
        try {
            const row = await api.fetchCart();
            const items = row?.data?.items ?? [];
            setCartCount(items.reduce((n, it) => n + (it.quantity || 0), 0));
        } catch {
            setCartCount(0);
        }
    }, []);

    useEffect(() => {
        void refreshBootstrap();
    }, [refreshBootstrap]);

    useEffect(() => {
        if (! bootstrapped) {
            return;
        }
        void refreshCart();
    }, [bootstrapped, refreshCart, user]);

    const value = useMemo(
        () => ({
            user,
            bootstrapped,
            cartCount,
            error,
            setUser,
            refreshBootstrap,
            refreshCart,
        }),
        [user, bootstrapped, cartCount, error, refreshBootstrap, refreshCart]
    );

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
    const ctx = useContext(ShopContext);
    if (! ctx) {
        throw new Error('useShop must be used within ShopProvider');
    }
    return ctx;
}
