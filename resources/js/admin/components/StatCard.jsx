export default function StatCard({ icon: Icon, iconWrapClass, label, value, trend }) {
    const trendPositive = typeof trend === 'number' ? trend >= 0 : true;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-indigo-200/80 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                    <p className="mt-4 font-semibold tracking-tight text-slate-900 text-3xl">{value}</p>
                    {typeof trend === 'number' ? (
                        <p className={`mt-3 text-xs font-semibold ${trendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trendPositive ? '↑' : '↓'} {Math.abs(trend)}%{' '}
                            <span className="font-normal text-slate-500">vs last period</span>
                        </p>
                    ) : null}
                </div>
                <span
                    className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl text-white shadow-inner ${iconWrapClass}`}
                >
                    <Icon aria-hidden />
                </span>
            </div>
        </div>
    );
}
