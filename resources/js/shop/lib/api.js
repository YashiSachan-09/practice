import axios from 'axios';

function csrfToken() {
    const cfg = typeof window !== 'undefined' ? window.__ANAYRA_SHOP__ : null;
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || cfg?.csrf || '';
}

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const t = csrfToken();
    if (t) {
        config.headers['X-CSRF-TOKEN'] = t;
    }
    return config;
});

/** @returns {Promise<{ authenticated: boolean; user: { name: string; email: string; is_admin: boolean } | null }>} */
export async function fetchBootstrap() {
    const { data } = await api.get('/shop/api/bootstrap');
    return data;
}

/** @returns {Promise<{ data: import('axios').AxiosResponse['data'] }>} */
export async function fetchCategories() {
    const { data } = await api.get('/shop/api/categories');
    return data;
}

/** @param {Record<string, unknown>} params */
export async function fetchProducts(params) {
    const { data } = await api.get('/shop/api/products', { params });
    return data;
}

/** @param {string} slug */
export async function fetchProduct(slug) {
    const { data } = await api.get(`/shop/api/products/${encodeURIComponent(slug)}`);
    return data;
}

export async function fetchCart() {
    const { data } = await api.get('/shop/api/cart');
    return data;
}

/** @param {{ slug?: string; product_id?: number; quantity: number }} body */
export async function postCartItem(body) {
    const { data } = await api.post('/shop/api/cart/items', body);
    return data;
}

/** @param {number} cartItemId @param {{ quantity: number }} body */
export async function patchCartItem(cartItemId, body) {
    const { data } = await api.patch(`/shop/api/cart/items/${cartItemId}`, body);
    return data;
}

/** @param {number} cartItemId */
export async function deleteCartItem(cartItemId) {
    const { data } = await api.delete(`/shop/api/cart/items/${cartItemId}`);
    return data;
}

export async function fetchCheckoutPreview() {
    const { data } = await api.get('/shop/api/checkout/preview');
    return data;
}

/** @param {Record<string, string>} payload */
export async function submitCheckout(payload) {
    const { data } = await api.post('/shop/api/checkout', payload);
    return data;
}

/** @param {Record<string, string>} payload */
export async function shopRegister(payload) {
    const { data } = await api.post('/shop/api/auth/register', payload);
    return data;
}

/** @param {Record<string, string | boolean>} payload */
export async function shopLogin(payload) {
    const { data } = await api.post('/shop/api/auth/login', payload);
    return data;
}

export async function shopLogout() {
    const { data } = await api.post('/shop/api/auth/logout');
    return data;
}

/** @param {Record<string, unknown>} params */
export async function fetchShopOrders(params) {
    const { data } = await api.get('/shop/api/orders', { params });
    return data;
}

/** @param {string} orderNumber */
export async function fetchShopOrder(orderNumber) {
    const { data } = await api.get(`/shop/api/orders/${encodeURIComponent(orderNumber)}`);
    return data;
}
