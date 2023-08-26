/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content:["./src/**/*.{wxml,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities, addComponents, addBase, e, config,theme }) {
      // Add your custom styles here
      addBase({
        'h1': { fontSize: theme('fontSize.2xl') },
        'h2': { fontSize: theme('fontSize.xl') },
        'h3': { fontSize: theme('fontSize.lg') },
        'page button':{
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
          '&[type=primary]':{
            backgroundColor: '#3490dc',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#2779bd'
            },
          }
        }
      })
      addComponents({
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          backgroundColor: '#3490dc',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2779bd'
          },
        },
        '.btn-red': {
          backgroundColor: '#e3342f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a'
          },
        },
      })
    }),
  ],
}

