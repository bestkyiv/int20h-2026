import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: ['int20h.best-kyiv.org', 'localhost', '127.0.0.1', '0.0.0.0'],
  },
  preview: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: ['int20h.best-kyiv.org', 'localhost', '127.0.0.1', '0.0.0.0'],
  },
});
