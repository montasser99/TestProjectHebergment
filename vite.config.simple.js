import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: false,
        }),
        react({
            jsxRuntime: 'automatic',
        }),
    ],
    build: {
        sourcemap: false,
        minify: false,
        rollupOptions: {
            output: {
                manualChunks: () => 'everything.js',
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
});