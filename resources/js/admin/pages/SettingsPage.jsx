import { useEffect, useState } from 'react';
import { fetchSettings, patchSettings } from '../lib/api.js';

const DEFAULT_KEYS = [
    { key: 'support_email', label: 'Concierge email', helper: 'Shown on invoices & contact escalation.' },
    { key: 'storefront_tagline', label: 'Storefront headline seed', helper: 'Admin reference line for stakeholder decks.' },
    { key: 'gst_display_hint', label: 'Tax / duties display copy', helper: 'Short legal hint near checkout placeholders.' },
    { key: 'carousel_interval_seconds', label: 'Hero carousel cadence', helper: 'Seconds between SPA hero slides once wired.' },
];

export default function SettingsPage() {
    const [kv, setKv] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings()
            .then((res) => {
                setKv(res.data ?? {});
            })
            .catch(() => setError('Could not read settings'))
            .finally(() => setLoading(false));
    }, []);

    function setField(key, val) {
        setKv((prev) => ({ ...prev, [key]: val }));
    }

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await patchSettings(kv);
            setKv(res.data ?? kv);
            setSavedAt(new Date());
        } catch {
            setError('Persist failed.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <p className="section-kicker text-[11px]">Control plane</p>
                <h1 className="font-display mt-2 text-3xl text-[var(--site-text)] sm:text-4xl dark:text-white">Site settings</h1>
                <p className="mt-2 text-sm site-text-muted">
                    Lightweight key/value store powering concierge copy toggles · extend CatalogSeeder for new primitives.
                </p>
            </div>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            {savedAt ? <p className="text-xs font-semibold text-emerald-600">Saved {savedAt.toLocaleTimeString()}.</p> : null}

            {loading ? (
                <p className="site-text-muted">Loading…</p>
            ) : (
                <form className="site-panel space-y-5 rounded-3xl border p-8" onSubmit={submit}>
                    {DEFAULT_KEYS.map(({ key, label, helper }) => (
                        <label key={key} className="block">
                            <span className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">{label}</span>
                            <input
                                value={kv[key] ?? ''}
                                onChange={(e) => setField(key, e.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--site-border)] bg-[var(--site-bg-soft)] px-4 py-2.5 text-sm text-[var(--site-text)]"
                                autoComplete="off"
                            />
                            <span className="mt-1 block text-[11px] site-text-muted">{helper}</span>
                        </label>
                    ))}

                    <div className="border-t border-[var(--site-border)] pt-6 dark:border-slate-700">
                        <p className="text-[11px] font-semibold uppercase tracking-wide site-text-muted">Raw keys detected</p>
                        <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-black/[0.04] p-4 text-[11px] dark:bg-white/[0.06]">
                            {JSON.stringify(kv, null, 2)}
                        </pre>
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary px-10 py-3 text-sm disabled:opacity-50">
                        {saving ? 'Saving…' : 'Save settings'}
                    </button>
                </form>
            )}
        </div>
    );
}
