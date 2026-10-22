import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          nav: '#0A0A0C',
          page: '#111114',
          card: '#1C1C20',
          hover: '#242428',
        },
        gold: {
          DEFAULT: '#C5B382',
          muted: '#2A2314',
        },
        content: {
          primary: '#F0F0EE',
          muted: '#888884',
        },
      },
    },
  },
  plugins: [],
};
export default config;
