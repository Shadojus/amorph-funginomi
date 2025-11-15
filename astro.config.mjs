import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Enable SSR for dynamic routes with Convex
  output: 'server',
  
  // Vite config
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/arch/layouts': path.resolve(__dirname, './src/layouts'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/amorph': path.resolve(__dirname, './src/amorph'),
      },
    },
    optimizeDeps: {
      exclude: ['redis'],
    },
  },
  
  // Server config
  server: {
    port: 4321,
  },
  
  // Build config
  build: {
    inlineStylesheets: 'auto',
  },
});
