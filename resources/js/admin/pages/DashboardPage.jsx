import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdInventory, MdPayments, MdPeople, MdShoppingBasket } from 'react-icons/md';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import dashboardSeed from '../data/dashboardData.json';
import { SKU_THUMB, DEFAULT_ASSORT_THUMB } from '../data/dashboardSkuThumbs.js';
import { ADMIN_PAINTING_BACKDROP_URL } from '../data/adminNavBackdrop.js';
import { fetchDashboardSummary } from '../lib/api.js';

const currencyFmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function mergeTrendSeries(seriesA, seriesB) {
    return seriesA.map((point, idx) => ({
        label: point.day,
        current: +(point.value / 1000).toFixed(1),
        baseline: +(((seriesB[idx]?.value ?? 0) / 1000).toFixed(1)),
    }));
}

function shortChartDate(isoDate) {
    try {
        return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(isoDate));
    } catch {
        return String(isoDate);
    }
}

export default function DashboardPage() {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : { user: { name: 'Admin' } };
    const adminName = cfg?.user?.name ?? 'Admin';

    const [summary, setSummary] = useState(null);
    const [summaryFailed, setSummaryFailed] = useState(false);

    useEffect(() => {
        fetchDashboardSummary()
            .then(setSummary)
            .catch(() => setSummaryFailed(true));
    }, []);

    const counts = summary?.counts;
    const recentApi = summary?.recent_orders ?? [];
    const revenueInr = summary?.revenue?.total_inr ?? 0;
    const pipelineOpen =
        (counts?.orders_pending ?? 0) +
        (counts?.orders_confirmed ?? 0) +
        (counts?.orders_packed ?? 0) +
        (counts?.orders_shipped ?? 0);

    const assortment = summary?.assortment;
    const pulse = assortment?.pulse;
    const topSkus = assortment?.top_skus ?? [];
    const categoryShare = assortment?.category_share ?? [];
    const ledgerTrend = assortment?.revenue_trend ?? [];

    const mergedLegacy = useMemo(
        () => mergeTrendSeries(dashboardSeed.salesOverview.thisMonth, dashboardSeed.salesOverview.lastMonth),
        [],
    );

    const trendFromLedger = useMemo(() => {
        if (!ledgerTrend.length) {
            return null;
        }
        return ledgerTrend.map((row) => ({
            label: shortChartDate(row.date),
            revenueK: +(row.revenue_inr / 1000).toFixed(2),
            orders: row.orders,
            revenue_inr: row.revenue_inr,
        }));
    }, [ledgerTrend]);

    const lineData = trendFromLedger ?? mergedLegacy;
    const isLedgerChart = Boolean(trendFromLedger);

    return (
        <div className="relative -mx-4 flex min-h-full w-auto flex-1 flex-col overflow-x-hidden pb-10 sm:-mx-6 lg:-mx-8">
            {/* Full-bleed painting: fills column below header (viewport − chrome) then grows with content */}
            <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
                <img
                    src={ADMIN_PAINTING_BACKDROP_URL}
                    alt=""
                    className="min-h-full h-full w-full scale-105 object-cover object-[center_35%] opacity-[0.28] saturate-[1.05] dark:opacity-[0.22] dark:saturate-90"
                    loading="eager"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--site-bg)]/93 via-[var(--site-bg)]/88 to-[var(--site-bg)]/94 dark:from-slate-950/94 dark:via-slate-950/90 dark:to-slate-950/96" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/10 via-transparent to-amber-100/25 dark:from-indigo-950/40 dark:via-transparent dark:to-gallery-void/35" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col space-y-8 px-4 pb-2 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="section-kicker text-[11px] text-indigo-600 dark:text-gallery-amber">Dashboard</p>
                    <h1 className="font-display mt-3 text-3xl text-[var(--site-text)] dark:text-white sm:text-4xl">
                        Welcome back, {adminName}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm site-text-muted">
                        KPIs, velocity, and marketplace assortment roll up from the same Laravel ledger that powers Orders — categories mirror
                        your public <span className="font-semibold text-[var(--site-text)]">Marketplace</span> rails.
                        {summaryFailed ? (
                            <span className="mt-2 block font-semibold text-rose-600">Could not sync dashboard — check network or sign in again.</span>
                        ) : null}
                    </p>
                </div>
                <div className="site-panel rounded-3xl px-5 py-3 text-sm shadow-sm">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.3em] site-text-muted">Insight window</label>
                    <p className="mt-2 text-base font-semibold text-[var(--site-text)]">
                        {isLedgerChart ? `Last ${assortment?.revenue_trend_days ?? 14} days · ledger` : 'May preview · illustrative'}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">A7 ANAYARAA gallery commerce</p>
                </div>
            </div>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={MdShoppingBasket}
                    iconWrapClass="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700"
                    label="Total orders"
                    value={counts ? numberFmt.format(counts.orders_total) : summaryFailed ? '—' : '…'}
                />
                <StatCard
                    icon={MdPayments}
                    iconWrapClass="bg-gradient-to-br from-emerald-400 to-teal-600"
                    label="Paid revenue (ex. cancelled)"
                    value={counts ? currencyFmt.format(revenueInr) : summaryFailed ? '—' : '…'}
                />
                <StatCard
                    icon={MdInventory}
                    iconWrapClass="bg-gradient-to-br from-amber-400 to-orange-500"
                    label="Open pipeline"
                    value={counts ? numberFmt.format(pipelineOpen) : summaryFailed ? '—' : '…'}
                />
                <StatCard
                    icon={MdPeople}
                    iconWrapClass="bg-gradient-to-br from-sky-500 to-blue-600"
                    label="Delivered lifetime"
                    value={counts ? numberFmt.format(counts.orders_delivered) : summaryFailed ? '—' : '…'}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-12">
                <div className="site-panel rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-black/30 xl:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--site-border)] pb-4 dark:border-slate-700">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] site-text-muted">Commercial momentum</p>
                            <p className="text-lg font-semibold text-[var(--site-text)] dark:text-white">
                                {isLedgerChart ? 'Order GMV pulse' : 'Sales overview'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 h-[320px] w-full">
                        <ResponsiveContainer>
                            {isLedgerChart ? (
                                <LineChart data={lineData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 12" stroke="#cbd5f5" className="dark:stroke-slate-700" opacity={0.6} />
                                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#cbd5f5" />
                                    <YAxis
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        stroke="#cbd5f5"
                                        tickFormatter={(v) => `₹${v}k`}
                                    />
                                    <Tooltip content={<LedgerTrendTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenueK" name="GMV (₹k)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            ) : (
                                <LineChart data={lineData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 12" stroke="#e2e8f0" />
                                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#cbd5f5" />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#cbd5f5" tickFormatter={(v) => `${v}K`} />
                                    <Tooltip contentStyle={{ borderRadius: 16, border: 'none' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="current" name="This period" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="baseline"
                                        name="Trailing period"
                                        stroke="#cbd5f5"
                                        strokeWidth={2}
                                        strokeDasharray="6 6"
                                        dot={false}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                    {!isLedgerChart ? (
                        <p className="mt-3 text-xs site-text-muted">Preview curve until live orders accumulate for the fortnightly ledger window.</p>
                    ) : null}
                </div>

                <div className="site-panel rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-black/30 xl:col-span-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--site-border)] pb-4 dark:border-slate-700">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] site-text-muted">Pipeline freshness</p>
                            <p className="text-lg font-semibold text-[var(--site-text)] dark:text-white">Recent orders</p>
                        </div>
                        <Link
                            to="/orders"
                            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-900/25 transition hover:-translate-y-0.5"
                        >
                            Full ledger
                        </Link>
                    </div>
                    <ul className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                        {recentApi.length > 0
                            ? recentApi.map((order) => (
                                  <li key={order.id} className="flex gap-4 py-4 first:pt-0">
                                      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-[11px] font-semibold uppercase tracking-wide text-white shadow-inner">
                                          {order.order_number?.slice(-2) ?? '—'}
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{order.order_number}</p>
                                              <StatusBadge status={order.status} />
                                          </div>
                                          <p className="truncate text-[15px] font-semibold text-[var(--site-text)]">{order.customer_name}</p>
                                          <div className="flex flex-wrap items-center gap-2">
                                              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{currencyFmt.format(Number(order.total))}</p>
                                              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600">
                                                  Pay · {order.payment_status}
                                              </span>
                                          </div>
                                      </div>
                                  </li>
                              ))
                            : dashboardSeed.recentOrders.map((order) => (
                                  <li key={order.id} className="flex gap-4 py-4 first:pt-0">
                                      <img
                                          src={order.image}
                                          alt=""
                                          className="size-14 rounded-2xl object-cover shadow-inner"
                                          loading="lazy"
                                      />
                                      <div className="min-w-0 flex-1 space-y-1">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                              <p className="text-sm font-semibold text-indigo-600">{order.id}</p>
                                              <StatusBadge status={order.status} />
                                          </div>
                                          <p className="truncate text-[15px] font-semibold text-[var(--site-text)]">{order.customer}</p>
                                          <p className="text-sm font-semibold text-emerald-600">{currencyFmt.format(order.amount)}</p>
                                      </div>
                                  </li>
                              ))}
                    </ul>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-12">
                <div className="site-panel rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-black/30 xl:col-span-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--site-border)] pb-4 dark:border-slate-700">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] site-text-muted">Velocity</p>
                            <p className="text-lg font-semibold text-[var(--site-text)] dark:text-white">Assortment · top SKUs</p>
                            <p className="mt-1 text-[11px] site-text-muted">Heritage canvases · lithographs · sculpture from OrderSeeder</p>
                        </div>
                        <Link to="/products" className="btn-outline rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] dark:border-slate-600">
                            Marketplace view
                        </Link>
                    </div>
                    <ul className="mt-6 divide-y divide-slate-50 dark:divide-slate-800">
                        {topSkus.length > 0
                            ? topSkus.map((row) => (
                                  <li key={row.sku} className="flex items-start gap-4 py-3 first:pt-0">
                                      <img
                                          src={SKU_THUMB[row.sku] ?? DEFAULT_ASSORT_THUMB}
                                          alt=""
                                          className="size-12 shrink-0 rounded-2xl object-cover shadow-inner"
                                          loading="lazy"
                                      />
                                      <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-semibold text-[var(--site-text)]">{row.product_name}</p>
                                          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                                              {row.sku}
                                          </p>
                                          <p className="mt-1 text-xs site-text-muted">
                                              {numberFmt.format(Number(row.units))} units · {currencyFmt.format(Number(row.gmv_inr))}
                                          </p>
                                      </div>
                                  </li>
                              ))
                            : dashboardSeed.topSelling.map((sku) => (
                                  <li key={sku.name} className="flex items-center gap-4 py-3 first:pt-0">
                                      <img src={sku.thumb} alt="" className="size-12 rounded-2xl object-cover shadow-inner" loading="lazy" />
                                      <div className="min-w-0 flex-1">
                                          <p className="text-sm font-semibold text-[var(--site-text)]">{sku.name}</p>
                                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">{sku.sold} sold</p>
                                      </div>
                                  </li>
                              ))}
                    </ul>
                </div>

                <div className="site-panel rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-black/30 xl:col-span-4">
                    <div className="border-b border-[var(--site-border)] pb-4 dark:border-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] site-text-muted">Merchandising</p>
                        <p className="text-lg font-semibold text-[var(--site-text)] dark:text-white">Category GMV · marketplace slugs</p>
                        <p className="mt-2 text-[11px] site-text-muted">Shares derived by mapping SKU → category (Abstract, Sculpture, Prints…).</p>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        <div className="h-[260px] w-full lg:flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={
                                            categoryShare.length > 0
                                                ? categoryShare
                                                : dashboardSeed.salesByCategory.map((s) => ({ ...s, gmv_inr: 0 }))
                                        }
                                        dataKey="value"
                                        cx="55%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >
                                        {(categoryShare.length > 0 ? categoryShare : dashboardSeed.salesByCategory).map((slice, idx) => (
                                            <Cell key={`slice-${slice.name}-${idx}`} fill={slice.fill ?? '#cbd5f5'} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CategoryPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-3 text-sm lg:w-52">
                            {(categoryShare.length > 0 ? categoryShare : dashboardSeed.salesByCategory).map((slice) => (
                                <div key={slice.name} className="flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2 font-semibold text-[var(--site-text)]">
                                        <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: slice.fill ?? '#cbd5f5' }} />
                                        <span className="truncate">{slice.name}</span>
                                    </div>
                                    <span className="shrink-0">{slice.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-5 border-t border-[var(--site-border)] pt-4 dark:border-slate-700">
                        <Link to="/categories" className="text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">
                            Edit categories →
                        </Link>
                    </div>
                </div>

                <div className="rounded-3xl border border-gallery-ruby/35 bg-white p-6 shadow-xl shadow-rose-900/15 dark:bg-slate-900 dark:shadow-black/35 xl:col-span-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-200/70 pb-4 dark:border-rose-900/35">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gallery-ruby dark:text-gallery-amber">Operational stack</p>
                            <p className="text-lg font-semibold text-[var(--site-text)] dark:text-white">A7 ANAYARAA control room</p>
                            <p className="mt-2 text-[11px] site-text-muted">Counts mirror CMS + moderation tables you seeded with the gallery project.</p>
                        </div>
                        <Link
                            to="/orders"
                            className="rounded-2xl border border-rose-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-950/45"
                        >
                            Fulfillment
                        </Link>
                    </div>
                    <ul className="mt-6 space-y-4 text-sm">
                        <PulseRow label="Categories live" value={pulse?.active_categories ?? '…'} href="/categories" action="taxonomy" />
                        <PulseRow label="Banners rotating" value={pulse?.active_banners ?? '…'} href="/banners" action="creative" />
                        <PulseRow label="Reviews queued" value={pulse?.pending_reviews ?? '…'} href="/reviews" action="moderate" />
                        <PulseRow label="Coupons active" value={pulse?.active_coupons ?? '…'} href="/coupons" action="adjust" />
                    </ul>
                </div>
            </section>
            </div>
        </div>
    );
}

function CategoryPieTooltip({ active, payload }) {
    if (!active || !payload?.length) {
        return null;
    }
    const d = payload[0]?.payload ?? {};
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-xl dark:border-slate-600 dark:bg-slate-900">
            <p className="font-semibold text-[var(--site-text)] dark:text-white">{d.name}</p>
            <p className="mt-2 text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">{d.value}% assortment share</p>
            {typeof d.gmv_inr === 'number' && d.gmv_inr > 0 ? (
                <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">{currencyFmt.format(d.gmv_inr)} line GMV</p>
            ) : null}
        </div>
    );
}

function LedgerTrendTooltip({ active, payload }) {
    if (!active || !payload?.length) {
        return null;
    }
    const p = payload[0]?.payload ?? {};
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-xl dark:border-slate-600 dark:bg-slate-900">
            <p className="font-semibold text-[var(--site-text)] dark:text-white">{p.label}</p>
            <p className="mt-2 text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">{currencyFmt.format(Number(p.revenue_inr))}</p>
            <p className="mt-1 text-[11px] site-text-muted">{p.orders ?? 0} orders</p>
        </div>
    );
}

function PulseRow({ label, value, href, action }) {
    return (
        <li className="flex items-start justify-between gap-4 rounded-2xl border border-rose-100 bg-rose-50/55 px-3 py-3 dark:border-rose-900/40 dark:bg-rose-950/25">
            <div>
                <p className="font-semibold text-[var(--site-text)] dark:text-white">{label}</p>
                <Link to={href} className="mt-1 inline-block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    {action} →
                </Link>
            </div>
            <span className="rounded-full bg-white px-4 py-1 text-xl font-semibold tabular-nums text-rose-700 shadow-inner dark:bg-slate-800 dark:text-rose-200">
                {value}
            </span>
        </li>
    );
}
