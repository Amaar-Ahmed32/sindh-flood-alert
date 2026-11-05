/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sindh: {
          river: '#0284c7', // Indus blue
          desert: '#f59e0b', // Thar amber
          alert: '#ef4444', // Danger red
          safe: '#10b981', // Normal green
          dark: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Jameel Noori Nastaleeq"', 'serif'],
        sindhi: ['"Noto Sans Arabic"', '"Lateef"', 'serif']
      }
    },
  },
  plugins: [],
}
