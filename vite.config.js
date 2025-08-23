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
    build: {
        outDir: 'public/build',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
        chunkSizeWarningLimit: 1600,
        minify: 'esbuild',
    },
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
});
