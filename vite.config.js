import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '172.16.1.68', // permite acceso en red
        port: 5173,
        cors: true,
        hmr: {
            //host: 'portal.postialo.net',
            host: '172.16.1.68', // tu IP local
        },
    },
});
