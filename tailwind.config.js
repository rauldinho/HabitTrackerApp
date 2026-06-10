/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Kalam', 'cursive'],
        body:    ['Patrick Hand', 'cursive'],
      },
      colors: {
        paper:     'var(--color-paper)',
        ink:       'var(--color-ink)',
        muted:     'var(--color-muted)',
        accent:    'var(--color-accent)',
        secondary: 'var(--color-secondary)',
        card:      'var(--color-card)',
        'card-alt':'var(--color-card-alt)',
        border:    'var(--color-border)',
      },
      boxShadow: {
        hard:    '4px 4px 0px 0px var(--color-border)',
        'hard-lg':'8px 8px 0px 0px var(--color-border)',
        'hard-sm':'2px 2px 0px 0px var(--color-border)',
        'hard-hover':'2px 2px 0px 0px var(--color-border)',
      },
    },
  },
  plugins: [],
}
