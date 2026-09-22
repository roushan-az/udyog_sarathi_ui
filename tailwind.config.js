/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#12266e',
          50: '#eef1fb',
          100: '#d6ddf5',
          600: '#1a3a8f',
          700: '#12266e',
          800: '#0c1b4f',
          900: '#081338',
        },
        brandGreen: {
          DEFAULT: '#1e7e34',
          50: '#eaf7ee',
          100: '#c9edd4',
          600: '#1e7e34',
          700: '#166028',
        },
        brandOrange: {
          DEFAULT: '#f97316',
          500: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Devanagari', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(18, 38, 110, 0.08), 0 1px 2px rgba(18,38,110,0.06)',
      },
    },
  },
  plugins: [],
}
