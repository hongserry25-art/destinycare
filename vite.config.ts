
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare var process: {
  env: {
    VITE_API_KEY?: string;
    API_KEY?: string;
    [key: string]: string | undefined;
  };
};

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY || process.env.API_KEY)
  },
  server: {
    host: true,
    port: 3000
  }
});
