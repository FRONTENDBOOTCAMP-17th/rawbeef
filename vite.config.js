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
      },
    },
  },
});
