import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  /** Jei dev serveris naudoja seną CSS talpyklą – šios klasės vis tiek patenka į buildą */
  safelist: [
    "bg-[#39ff14]",
    "hover:bg-[#32c616]",
    "text-[#39ff14]",
    "hover:text-[#32c616]",
    "focus:ring-[#39ff14]",
    "focus-visible:ring-[#39ff14]",
    "border-[#39ff14]",
    "bg-[#0a0a0a]",
    "border-[#0a0a0a]",
    "hover:border-[#39ff14]",
    "hover:bg-[#39ff14]/15",
    "bg-[#39ff14]/10",
    "border-[#39ff14]",
    "accent-[#39ff14]",
    // Mobile menu overlay: užtikrinam, kad backdrop efektai būtų ir produkciniuose build'uose
    "bg-[#0a0a0a]/80",
    "bg-[#fcfcfc]/95",
    "backdrop-blur-md",
    "backdrop-blur-sm",
    "backdrop-saturate-150",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        /** Neon high-tech akcentas */
        primary: {
          500: "#39ff14",
          600: "#32c616",
          700: "#2aa812",
          800: "#0a0a0a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
