import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative, so it works at charliemontalahorra.github.io
export default defineConfig({ base: './', plugins: [react()] });
