import {
    MdBarChart,
    MdCategory,
    MdImage,
    MdInventory,
    MdLocalOffer,
    MdPeople,
    MdRateReview,
    MdSettings,
    MdShoppingBag,
} from 'react-icons/md';

const iconMap = {
    products: MdInventory,
    categories: MdCategory,
    orders: MdShoppingBag,
    customers: MdPeople,
    coupons: MdLocalOffer,
    reviews: MdRateReview,
    reports: MdBarChart,
    banners: MdImage,
    settings: MdSettings,
};

export default function PagePlaceholder({ title, description, iconKey }) {
    const Icon = iconMap[iconKey] ?? MdSettings;

    return (
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white px-10 py-16 text-center shadow-xl shadow-indigo-100/70">
            <span className="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-900/35">
                <Icon className="text-4xl" aria-hidden />
            </span>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.52em] text-indigo-500">Operational module</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
            <div className="mt-10 rounded-3xl border border-indigo-100 bg-indigo-50/70 px-6 py-8 text-sm text-indigo-900">
                Laravel routes are wired behind `auth + admin`; this screen doubles as UI inventory for stakeholder reviews. Extend with Policies, auditing, queued exports when you tie it to REST or Livewire payloads.
                <div className="mt-8 flex justify-center gap-4 text-xs uppercase tracking-[0.25em] text-indigo-500">
                    Componentised · Accessible · Responsive
                </div>
            </div>
        </div>
    );
}
