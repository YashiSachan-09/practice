import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { fetchReportSummary } from '../lib/api.js';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function ReportsPage() {
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(14);

    useEffect(() => {
        setLoading(true);
        fetchReportSummary({ trend_days: days })
            .then(setReport)
            .catch(() => setError('Reports unavailable'))
            .finally(() => setLoading(false));
    }, [days]);

    const trend = report?.orders_trend ?? [];
    const skuRows = report?.top_skus ?? [];

    const statusRows = Object.entries(report?.orders_by_status ?? {}).map(([name, value]) => ({
        name,
        count: Number(value),
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="section-kicker text-[11px]">Analytics</p>
                    <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Reports</h1>
                    <p className="mt-2 text-sm site-text-muted">
                        Operational mix + trailing revenue from paid orders CSV export for finance.
                        <span className="ml-2 font-semibold text-[var(--site-text)] dark:text-gallery-amber">
                            Active coupons: {report?.counts?.active_coupons ?? '…'} · Pending reviews: {report?.counts?.pending_reviews ?? '…'}
                        </span>
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                        Trend window{' '}
                        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-full border px-3 py-1.5 text-sm font-semibold">
                            {[7, 14, 30, 60, 90].map((d) => (
                                <option key={d} value={d}>
                                    {d}d
                                </option>
                            ))}
                        </select>
                    </label>
                    <a href="/admin/api/reports/orders.csv" className="btn-primary px-6 py-2 text-sm whitespace-nowrap" download target="_blank" rel="noreferrer">
                        Download orders CSV
                    </a>
                </div>
            </div>

            {error ? <p className="font-semibold text-rose-600">{error}</p> : null}
            {loading && !report ? <p className="site-text-muted">Loading aggregates…</p> : null}

            <section className="site-panel rounded-3xl border p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">_orders / day</p>
                <div className="mt-6 h-[300px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={trend} margin={{ top: 6, right: 12 }}>
                            <CartesianGrid strokeDasharray="4 12" opacity={0.25} />
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                            <Tooltip
                                formatter={(v, key) =>
                                    key === 'revenue_inr' ? [inr.format(Number(v)), 'Paid revenue est.'] : [v, 'Orders']
                                }
                            />
                            <Legend />
                            <Line type="monotone" dataKey="orders" name="Orders" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 h-[280px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={statusRows}>
                            <CartesianGrid strokeDasharray="4 12" opacity={0.25} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="count" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="mt-4 text-xs site-text-muted">Status mix counts all lifetime orders · great for SLA stand-ups.</p>
                </div>
            </section>

            <section className="site-panel rounded-3xl border p-6">
                <p className="font-display text-xl text-[var(--site-text)] dark:text-white">Top SKUs · GMV from line items</p>
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="site-text-muted text-[11px] uppercase">
                            <tr>
                                <th className="pb-3">SKU</th>
                                <th className="pb-3">Product</th>
                                <th className="pb-3 text-right">Units</th>
                                <th className="pb-3 text-right">GMV</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--site-border)]">
                            {skuRows.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-6 site-text-muted">
                                        Nothing to rank yet · seed commerce data.
                                    </td>
                                </tr>
                            ) : (
                                skuRows.map((s) => (
                                    <tr key={s.sku}>
                                        <td className="py-3 font-mono text-xs">{s.sku}</td>
                                        <td className="py-3">{s.product_name}</td>
                                        <td className="py-3 text-right">{Number(s.units)}</td>
                                        <td className="py-3 text-right font-semibold">{inr.format(Number(s.gmv))}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
