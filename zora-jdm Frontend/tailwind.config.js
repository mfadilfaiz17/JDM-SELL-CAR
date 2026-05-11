/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          500: '#06b6d4',
        },
        magenta: {
          500: '#d946ef',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'radial-at-t': 'radial-gradient(ellipse 80% 50% at 50% 0%, var(--tw-gradient-stops))',
        'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
        'linear-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'linear-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
        'linear-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
