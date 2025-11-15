import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['redis'] // Redis nicht für Browser bundlen
  },
  resolve: {
    alias: {
      // Fallback für Node.js Module im Browser
      'events': false,
      'stream': false,
      'net': false,
      'tls': false
    }
  }
});
