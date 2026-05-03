import axios from 'axios';

function csrfHeader() {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : null;
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || cfg?.csrf || '';
}

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use((config) => {
    const token = csrfHeader();
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

/** @typedef {{ pagination: Record<string, unknown> }} OrdersIndexResponse Laravel paginator JSON */

/** @returns {Promise<OrdersIndexResponse>} */
export async function fetchOrders(params) {
    const { data } = await api.get('/admin/api/orders', { params });
    return data;
}

/** @returns {Promise<{ data: Record<string, unknown> }>} */
export async function fetchOrder(orderId) {
    const { data } = await api.get(`/admin/api/orders/${orderId}`);
    return data;
}

/** @returns {Promise<{ data: Record<string, unknown> }>} */
export async function patchOrder(orderId, payload) {
    const { data } = await api.patch(`/admin/api/orders/${orderId}`, payload);
    return data;
}

/** @returns {Promise<Record<string, unknown>>} */
export async function fetchDashboardSummary() {
    const { data } = await api.get('/admin/api/dashboard/summary');
    return data;
}

export async function fetchCategories(params) {
    const { data } = await api.get('/admin/api/categories', { params });
    return data;
}

export async function postCategory(body) {
    const { data } = await api.post('/admin/api/categories', body);
    return data;
}

export async function patchCategory(id, body) {
    const { data } = await api.patch(`/admin/api/categories/${id}`, body);
    return data;
}

export async function deleteCategory(id) {
    const { data } = await api.delete(`/admin/api/categories/${id}`);
    return data;
}

export async function fetchCustomers(params) {
    const { data } = await api.get('/admin/api/customers', { params });
    return data;
}

export async function patchCustomer(id, body) {
    const { data } = await api.patch(`/admin/api/customers/${id}`, body);
    return data;
}

export async function fetchCoupons(params) {
    const { data } = await api.get('/admin/api/coupons', { params });
    return data;
}

export async function postCoupon(body) {
    const { data } = await api.post('/admin/api/coupons', body);
    return data;
}

export async function patchCoupon(id, body) {
    const { data } = await api.patch(`/admin/api/coupons/${id}`, body);
    return data;
}

export async function deleteCoupon(id) {
    const { data } = await api.delete(`/admin/api/coupons/${id}`);
    return data;
}

export async function fetchReviews(params) {
    const { data } = await api.get('/admin/api/reviews', { params });
    return data;
}

export async function patchReview(id, body) {
    const { data } = await api.patch(`/admin/api/reviews/${id}`, body);
    return data;
}

export async function fetchBanners(params) {
    const { data } = await api.get('/admin/api/banners', { params });
    return data;
}

export async function postBanner(body) {
    const { data } = await api.post('/admin/api/banners', body);
    return data;
}

export async function patchBanner(id, body) {
    const { data } = await api.patch(`/admin/api/banners/${id}`, body);
    return data;
}

export async function deleteBanner(id) {
    const { data } = await api.delete(`/admin/api/banners/${id}`);
    return data;
}

export async function fetchSettings() {
    const { data } = await api.get('/admin/api/settings');
    return data;
}

export async function patchSettings(settings) {
    const { data } = await api.patch('/admin/api/settings', { settings });
    return data;
}

export async function fetchReportSummary(params) {
    const { data } = await api.get('/admin/api/reports/summary', { params });
    return data;
}

export async function fetchAdminProducts(params) {
    const { data } = await api.get('/admin/api/products', { params });
    return data;
}

export async function fetchAdminProduct(id) {
    const { data } = await api.get(`/admin/api/products/${id}`);
    return data;
}

export async function postAdminProduct(body) {
    const { data } = await api.post('/admin/api/products', body);
    return data;
}

export async function patchAdminProduct(id, body) {
    const { data } = await api.patch(`/admin/api/products/${id}`, body);
    return data;
}

export async function deleteAdminProduct(id) {
    const { data } = await api.delete(`/admin/api/products/${id}`);
    return data;
}
