export function formatInr(amount) {
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
            Number(amount) || 0
        );
    } catch {
        return `₹${Number(amount).toFixed(2)}`;
    }
}
