import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/admin/main.jsx',
                'resources/js/shop/main.jsx',
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        // IMPORTANT (Windows): do not set `server.origin` unless it matches where Vite listens.
        // Laravel writes `public/hot` using `origin` OR HMR host; `localhost` in the hotfile while Vite binds
        // only 127.0.0.1 breaks IPv6 localhost (::1) and the admin SPA loads blank after login.
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
            port: 5173,
            protocol: 'ws',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
