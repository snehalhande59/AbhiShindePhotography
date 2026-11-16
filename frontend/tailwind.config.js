/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#F7F4EE",
        "secondary-bg": "#EFEBE3",
        "card-bg": "#FFFFFF",
        gold: {
          DEFAULT: "#9E7D47",
          light: "#CBB58E",
          dark: "#6E5326",
          hover: "#826433",
        },
        border: "#E3DDD3",
        "border-light": "#EFEAE1",
        "muted-text": "#6E6961",
        foreground: "#181818",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.8s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
}
