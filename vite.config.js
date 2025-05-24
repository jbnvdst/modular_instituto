import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // tailwindcss({
    //   config: {
    //     content: ['./src/**/*.{js,jsx,ts,tsx}'],
    //     theme: {
    //       extend: {
    //         colors: {
    //           primary: '#1DA1F2',
    //           secondary: '#14171A',
    //         },
    //       },
    //     },
    //   },
    // }),
  ],
})
