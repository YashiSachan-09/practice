/** @typedef {'light' | 'dark'} BrandTheme */

export const BRAND_THEME_STORAGE_KEY = 'a7-anayaraa-theme';

/** @returns {BrandTheme} */
export function readThemeFromDocument() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** @param {BrandTheme} next */
export function applyBrandTheme(next) {
    const t = next === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    try {
        localStorage.setItem(BRAND_THEME_STORAGE_KEY, t);
    } catch (e) {
        /* ignore */
    }
}

/** @param {BrandTheme} [current] */
export function themeToggleLabel(current) {
    const t = current ?? readThemeFromDocument();

    return t === 'dark' ? 'Light mode' : 'Dark mode';
}
