import {
    MdBarChart,
    MdCategory,
    MdDashboard,
    MdImage,
    MdInventory,
    MdLocalOffer,
    MdLogout,
    MdPeople,
    MdRateReview,
    MdSettings,
    MdShoppingBag,
} from 'react-icons/md';

export const NAV_PRIMARY = [
    { to: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { to: 'products', label: 'Products', icon: MdInventory },
    { to: 'categories', label: 'Categories', icon: MdCategory },
    { to: 'orders', label: 'Orders', icon: MdShoppingBag },
    { to: 'customers', label: 'Customers', icon: MdPeople },
    { to: 'coupons', label: 'Coupons', icon: MdLocalOffer },
    { to: 'reviews', label: 'Reviews', icon: MdRateReview },
    { to: 'reports', label: 'Reports', icon: MdBarChart },
    { to: 'banners', label: 'Banners', icon: MdImage },
    { to: 'settings', label: 'Settings', icon: MdSettings },
];

/** Logout rendered as form POST — keep icon export for sidebar styling parity */
export { MdLogout };
