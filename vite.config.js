import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin_open: resolve(__dirname, 'soyu/admin_open.html'),
        admin_category: resolve(__dirname, 'soyu/admin_category.html'),
        admin_song: resolve(__dirname, 'soyu/admin_song.html'),
        admin_request: resolve(__dirname, 'soyu/admin_request.html'),
        SWcantabile_song: resolve(__dirname, 'src/SWcantabile/SWcantabile_song.html'),
        SWcantabile_request: resolve(__dirname, 'src/SWcantabile/SWcantabile_request.html'),
      },
    },
  },
});
