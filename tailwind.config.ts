import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-100', 'text-green-800', 'border-green-300',
    'bg-yellow-100', 'text-yellow-800', 'border-yellow-300',
    'bg-orange-100', 'text-orange-800', 'border-orange-300',
    'bg-red-100', 'text-red-800', 'border-red-300',
    'bg-red-200', 'text-red-900', 'border-red-500',
    'border-red-300', 'border-green-300',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
