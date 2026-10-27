import '../css/app.css';
import './bootstrap';


import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob([
    './Pages/**/*.tsx',
    './Pages/**/*.jsx',
]);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) => {
        const tsxPage = `./Pages/${name}.tsx`;
        const jsxPage = `./Pages/${name}.jsx`;

        if (tsxPage in pages) {
            return resolvePageComponent(tsxPage, pages);
        }

        if (jsxPage in pages) {
            return resolvePageComponent(jsxPage, pages);
        }

        throw new Error(`Inertia page not found: ${name}`);
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});
