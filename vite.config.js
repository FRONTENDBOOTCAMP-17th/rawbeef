import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

const rewrites = [
  { source: '/introduce', destination: '/src/SWcantabile/SWcantabile_introduce.html' },
  { source: '/song', destination: '/src/SWcantabile/SWcantabile_song.html' },
  { source: '/request', destination: '/src/SWcantabile/SWcantabile_request.html' },
  { source: '/admin', destination: '/src/admin/admin_open.html' },
  { source: '/admin/song', destination: '/src/admin/admin_song.html' },
  { source: '/admin/request', destination: '/src/admin/admin_request.html' },
  { source: '/admin/category', destination: '/src/admin/admin_category.html' },
];

function devRewrites() {
  return {
    name: 'dev-rewrites',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const match = rewrites.find((r) => req.url === r.source || req.url?.startsWith(r.source + '?'));
        if (match) req.url = match.destination;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), devRewrites()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin_open: resolve(__dirname, 'src/admin/admin_open.html'),
        admin_category: resolve(__dirname, 'src/admin/admin_category.html'),
        admin_song: resolve(__dirname, 'src/admin/admin_song.html'),
        admin_request: resolve(__dirname, 'src/admin/admin_request.html'),
        SWcantabile_song: resolve(__dirname, 'src/SWcantabile/SWcantabile_song.html'),
        SWcantabile_request: resolve(__dirname, 'src/SWcantabile/SWcantabile_request.html'),
        SWcantabile_introduce: resolve(__dirname, 'src/SWcantabile/SWcantabile_introduce.html'),
      },
    },
  },
});
