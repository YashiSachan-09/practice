import { Navigate, Route, Routes } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext.jsx';
import ShopLayout from './layout/ShopLayout.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

function RequireAuth({ children }) {
    const { user, bootstrapped } = useShop();

    if (! bootstrapped) {
        return <p className="text-sm text-slate-500">Loading…</p>;
    }

    if (! user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function ShopRoutes() {
    return (
        <Routes>
            <Route element={<ShopLayout />}>
                <Route index element={<CatalogPage />} />
                <Route path="p/:slug" element={<ProductPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                    path="orders"
                    element={
                        <RequireAuth>
                            <OrdersPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="orders/:order_number"
                    element={
                        <RequireAuth>
                            <OrderDetailPage />
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <ShopProvider>
            <ShopRoutes />
        </ShopProvider>
    );
}
