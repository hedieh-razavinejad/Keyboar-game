export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        bread: {
          50: '#fdf6ea', 100: '#f6e8d2', 200: '#ecd3ac', 300: '#dfb887', 400: '#c99a5b',
          500: '#a8672f', 600: '#85501f', 700: '#5e3414', 800: '#3d2008', 900: '#2a170b',
        },
        burnt: { DEFAULT: '#c8431f', light: '#e2552e' },
      },
      fontFamily: {
        sans: ['Shabnam', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        pop: {
          from: { transform: 'scale(.8)', opacity: '.4' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shake: 'shake .35s',
        pop: 'pop .25s',
      },
    },
  },
  plugins: [],
}
