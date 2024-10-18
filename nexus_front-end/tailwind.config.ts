import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}" // Agregado para NextUI
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        blink: 'blink 1.5s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'dark-image': "url('https://www.semana.com/resizer/v2/TXYNYBTBSJFWJOKAWZ2FPSAKUM.jpg?auth=a09223b46e0d3e9b00e655c7e827e7f335ff4ada894e213e6111763eb7e45998&smart=true&quality=75&width=1280&height=1280')",
        'light-image': "url('https://res.cloudinary.com/db5lqptwu/image/upload/v1729278252/logos/spaixnfoxwcs3t8tiu7m.jpg')",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: "#0072f5",
        }
      },
      dark: {
        colors: {
          primary: "#0072f5",
        }
      },
    },
  })],
};

export default config;