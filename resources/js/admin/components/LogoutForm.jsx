export default function LogoutForm({ children, className = '' }) {
    const cfg = typeof window !== 'undefined' ? window.__A7_ANAYARAA_ADMIN__ : null;

    if (!cfg) {
        return null;
    }

    return (
        <form action={cfg.logoutUrl} method="POST" className={className}>
            <input type="hidden" name="_token" value={cfg.csrf} />
            {children}
        </form>
    );
}
