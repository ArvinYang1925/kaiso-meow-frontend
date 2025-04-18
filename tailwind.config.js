// 這段會讓 Tailwind 能夠掃描 index.html 和 src 資料夾底下的所有 .tsx、.ts、.jsx、.js 檔案，正確產生 CSS。
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}