export default function PaginationControls({ page, lastPage, total, loading, onPage }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--site-border)] px-4 py-3 dark:border-slate-700">
            <p className="text-xs site-text-muted">
                Page {page} of {lastPage}
                {total != null ? ` · ${total} total` : ''}
                {loading ? ' · …' : ''}
            </p>
            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => onPage(Math.max(1, page - 1))}
                    className="site-theme-btn rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide opacity-90 disabled:opacity-40"
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={page >= lastPage || loading}
                    onClick={() => onPage(page + 1)}
                    className="site-theme-btn rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide opacity-90 disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
