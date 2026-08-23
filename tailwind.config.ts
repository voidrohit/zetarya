import { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

// @ts-ignore
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF9",
        surface: "#F2F1EF",
        surface2: "#EAE8E5",
        ink: "#0A0A0A",
        muted: "#6B6B67",
        faint: "#9A9A95",
        line: "#E3E2DE",
        accent: {
          DEFAULT: "#BE2A50",
          soft: "#F9EBEF",
          deep: "#8F1F3C",
        },
        card: "#FFFFFF",
        grid: "#EAE9E5",
        ok: "#1F8A5B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        measure: "1120px",
        prose: "680px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        panel: "0 24px 60px -16px rgba(10,10,10,0.18)",
        lift: "0 12px 32px -12px rgba(10,10,10,0.16)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        wave: "wave 1.4s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 7s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.16,1,.3,1) both",
        "fade-in": "fadeIn .6s ease both",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "draw-ring": "drawRing 1.6s cubic-bezier(.16,1,.3,1) both",
        "grow-bar": "growBar 1.1s cubic-bezier(.16,1,.3,1) both",
        "slide-up": "slideUp .5s cubic-bezier(.16,1,.3,1) both",
        "cell-in": "cellIn .45s ease both",
        scan: "scan 3.2s linear infinite",
        "blink-caret": "blinkCaret 1.1s step-end infinite",
      },
      keyframes: {
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.55)" },
          "50%": { transform: "scaleY(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".45", transform: "scale(.82)" },
        },
        drawRing: {
          "0%": { strokeDashoffset: "999" },
        },
        growBar: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cellIn: {
          "0%": { opacity: "0", transform: "scale(.4)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        blinkCaret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};
export default config;
