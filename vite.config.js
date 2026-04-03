import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        category: resolve(__dirname, 'pages/category.html'),
        song: resolve(__dirname, 'pages/song.html'),
        user_song: resolve(__dirname, 'woohyun/user_song.html'),
        user_request: resolve(__dirname, 'woohyun/user_request.html'),
        user_song_test: resolve(__dirname, 'woohyun/user_song_test.html'),
        admin_open: resolve(__dirname, 'soyu/admin_open.html'),
        admin_category: resolve(__dirname, 'soyu/admin_category.html'),
        admin_song: resolve(__dirname, 'soyu/admin_song.html'),
        admin_request: resolve(__dirname, 'soyu/admin_request.html'),
        user_song: resolve(__dirname, 'woohyun/user_song.html'),
        user_song_test: resolve(__dirname, 'woohyun/user_song_test.html'),
        user_request: resolve(__dirname, 'woohyun/user_request.html'),
      },
    },
  },
});
