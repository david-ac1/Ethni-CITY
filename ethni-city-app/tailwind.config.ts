import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary: "#9c06f9",
        malachite: "#00cf64",
        terracotta: "#e2725b",
        "electric-violet": "#8f00ff",
        "accent-gold": "#d4af37",
        "accent-copper": "#b87333",
        "mechanical-copper": "#b87333",
        "retro-green": "#39ff14",
        // Backgrounds
        "background-light": "#fcfaf2",
        "background-dark": "#1b0f23",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        "serif-display": ["var(--font-playfair)", "serif"],
      },
      borderWidth: {
        "6": "6px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        "neo": "8px 8px 0 0 rgba(0,0,0,1)",
        "neo-sm": "4px 4px 0 0 rgba(0,0,0,1)",
        "mechanical": "6px 6px 0px #1b0f23",
      },
      keyframes: {
        "waveform": {
          "0%, 100%": { scaleY: "0.4" },
          "50%": { scaleY: "1.0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "sonic-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "waveform-1": "waveform 0.8s ease-in-out infinite",
        "waveform-2": "waveform 0.9s ease-in-out infinite 0.1s",
        "waveform-3": "waveform 0.7s ease-in-out infinite 0.2s",
        "waveform-4": "waveform 1.0s ease-in-out infinite 0.3s",
        "waveform-5": "waveform 0.85s ease-in-out infinite 0.15s",
        "float": "float 3s ease-in-out infinite",
        "sonic-pulse": "sonic-pulse 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
