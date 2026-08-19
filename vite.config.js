import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/pages/landing.css',
                'resources/css/pages/login.css',
                'resources/css/pages/setupprofile.css',
                'resources/css/pages/discovery.css',
                'resources/css/pages/community.css',
                'resources/css/pages/chat.css',
                'resources/css/pages/notification.css',
                'resources/css/pages/schedule.css',
                'resources/css/pages/settings.css',
                'resources/css/pages/user_profile.css',
                'resources/js/app.js',
                'resources/js/lib/common.js',
                'resources/js/pages/landing.js',
                'resources/js/pages/login.js',
                'resources/js/pages/setupprofile.js',
                'resources/js/pages/discovery.js',
                'resources/js/pages/community.js',
                'resources/js/pages/chat.js',
                'resources/js/pages/notification.js',
                'resources/js/pages/schedule.js',
                'resources/js/pages/settings.js',
                'resources/js/pages/user_profile.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
