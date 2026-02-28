import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        '125': '500px',
        '100': '400px',
        '50': '200px',
      },
      minWidth: {
        '25': '100px',
      },
      width: {
        '32.5': '130px',
      },
      maxHeight: {
        '87.5': '350px',
      },
      zIndex: {
        '999': '999',
      }
    },
  },
  plugins: [],
} satisfies Config
