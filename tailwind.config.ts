import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1116",
          soft: "#3A4150",
          muted: "#6B7280",
        },
        cream: "#FAF7F2",
        sand: "#F1EBE1",
        emerald: {
          DEFAULT: "#0F9D6B",
          dark: "#0B7C54",
          light: "#E6F6EF",
          ring: "#34D399",
        },
        amber: {
          accent: "#E8A33D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px -20px rgba(14, 17, 22, 0.18), 0 8px 20px -12px rgba(14, 17, 22, 0.12)",
        soft: "0 10px 30px -12px rgba(14, 17, 22, 0.14)",
        glow: "0 0 0 4px rgba(15, 157, 107, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "draw-ring": {
          "0%": { strokeDashoffset: "339" },
          "100%": { strokeDashoffset: "108" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        "draw-ring": "draw-ring 1.6s cubic-bezier(0.22,1,0.36,1) 0.4s both",
        shimmer: "shimmer 1.7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
