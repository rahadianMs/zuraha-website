import { defineConfig } from 'astro/config';

export default defineConfig({
  // No specific config needed for basic SSG, but here if needed
  build: {
    format: 'directory'
  }
});
