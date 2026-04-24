import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDD0',
        emerald: '#047857',
        gold: '#D4AF37',
        matte: '#0a0a0a',
      },
      boxShadow: {
        card: '0 12px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
