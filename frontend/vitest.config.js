import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // allows us to use vitest library methods in unit test without explicit imports
    environment: 'jsdom',
    setupFiles: './tests/setup.js', 
    deps: {
      optimizer: {
        web: {
          include: ['vitest-canvas-mock']
        }
      }
    },
        // For this config, check https://github.com/vitest-dev/vitest/issues/740
    // Vitest < 0.1.x
    threads: false,
    // >= 0.1.0
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  
  },

});