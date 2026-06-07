import type { Config } from "tailwindcss";

/**
 * カラーはセクション21のデザイン方針に対応。
 * - メイン: 深いネイビー (brand)
 * - アクセント: オレンジ/ゴールド (accent)
 * - 背景: 薄いグレー / カード: 白 / 文字: 濃いグレー
 * 色を変えたいときはここを編集すれば全体に反映されます。
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2f7",
          100: "#d4dde9",
          200: "#aabbd1",
          300: "#7f96b6",
          400: "#54719b",
          500: "#2f4d7a",
          600: "#243c61",
          700: "#1b2e4a",
          800: "#142238",
          900: "#0e1828",
          950: "#080e18",
        },
        accent: {
          50: "#fff7ec",
          100: "#ffe9cc",
          200: "#ffd199",
          300: "#ffb35c",
          400: "#ff9a2e",
          500: "#f97f12",
          600: "#e26408",
          700: "#bb4a0a",
          800: "#943b0f",
          900: "#783310",
        },
        ink: {
          DEFAULT: "#1f2937",
          soft: "#4b5563",
          faint: "#6b7280",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)",
        "card-hover":
          "0 2px 4px rgba(16, 24, 40, 0.06), 0 12px 28px rgba(16, 24, 40, 0.12)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
