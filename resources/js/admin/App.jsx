import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import CouponsPage from './pages/CouponsPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import BannersPage from './pages/BannersPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="coupons" element={<CouponsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="banners" element={<BannersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<AdminUnknownRedirect />} />
            </Route>
        </Routes>
    );
}

function AdminUnknownRedirect() {
    const location = useLocation();
    if (import.meta.env.DEV) {
        console.warn('[admin]', 'Unknown SPA path, sending to dashboard:', location.pathname);
    }
    return <Navigate to="/dashboard" replace />;
}
