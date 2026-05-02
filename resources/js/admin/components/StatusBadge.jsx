const styles = {
    delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    confirmed: 'bg-indigo-50 text-indigo-800 ring-indigo-600/15',
    packed: 'bg-violet-50 text-violet-800 ring-violet-600/18',
    pending: 'bg-amber-50 text-amber-800 ring-amber-600/18',
    shipped: 'bg-sky-50 text-sky-800 ring-sky-600/15',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/18',
};

const labels = {
    delivered: 'Delivered',
    confirmed: 'Confirmed',
    packed: 'Packed',
    pending: 'Pending',
    shipped: 'Shipped',
    cancelled: 'Cancelled',
};

export default function StatusBadge({ status }) {
    const key = status?.toLowerCase() ?? 'pending';
    const cn = styles[key] ?? styles.pending;
    const text = labels[key] ?? key;

    return (
        <span
            className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${cn}`}
        >
            {text}
        </span>
    );
}
