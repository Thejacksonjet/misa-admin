import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        'primary-dark': '#047857',
        'primary-light': '#d1fae5',
        accent: '#10b981',
      },
    },
  },
  plugins: [],
};

export default config;
