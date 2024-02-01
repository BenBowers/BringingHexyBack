/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.spec.ts', 'infra/custom-resources/**/*.spec.ts'],
    testTimeout: 30000,
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@infra': resolve(__dirname, 'infra'),
      '@adaptors': resolve(__dirname, 'src/adaptors'),
      '@use-cases': resolve(__dirname, 'src/use-cases'),
      '@errors': resolve(__dirname, 'src/errors'),
      '@tests': resolve(__dirname, 'tests'),
    },
  },
});
