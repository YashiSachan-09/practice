import { useCallback, useEffect, useState } from 'react';
import { applyBrandTheme, BRAND_THEME_STORAGE_KEY, readThemeFromDocument, themeToggleLabel } from '../lib/theme.js';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(readThemeFromDocument);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== BRAND_THEME_STORAGE_KEY) {
                return;
            }
            if (e.newValue !== 'dark' && e.newValue !== 'light') {
                return;
            }
            const t = /** @type {'light' | 'dark'} */ (e.newValue);
            applyBrandTheme(t);
            setTheme(t);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const onClick = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        applyBrandTheme(next);
        setTheme(next);
    }, [theme]);

    return (
        <button
            type="button"
            id="admin-theme-toggle"
            onClick={onClick}
            className={`site-theme-btn rounded-full px-4 py-2 text-sm font-medium ${className}`}
            aria-label={themeToggleLabel(theme)}
        >
            <span id="admin-theme-label">{themeToggleLabel(theme)}</span>
        </button>
    );
}
