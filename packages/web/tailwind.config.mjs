/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#167AA0',
        alternate: '#F0AE1C',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
          300: '#FFFAF0',
          400: '#F0F0E9',
          500: '#D9D9D2',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923'
        }
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif']
      // }
      fontFamily: {
        poppins: "'Poppins', sans-serif"
      },
      boxShadow: {
        'top-bottom':
          // '0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)'
          '0 -2px 10px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms', require('@tailwindcss/line-clamp'))
  ]
}
