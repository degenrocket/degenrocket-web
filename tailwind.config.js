/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        colorBase: {
          light: '#000',
          dark: '#d8d8d8'
        },
        colorPrimary: {
          light: '#ba14bf',
          dark: '#ba14bf'
        },
        colorSecondary: {
          light: '#000000',
          dark: '#ffffff'
        },
        colorHover: {
          light: '#243746',
          dark: '#cbd4d1'
        },
        colorNotImportant: {
          light: '#9b8bc6',
          dark: '#706297'
        },
        colorGreen: {
          light: '#089703',
          dark: '#0ad203'
        },
        colorRed: {
          light: '#ff0a0a',
          dark: '#ff0a0a'
        },
        colorOrange: {
          light: '#f4af0c',
          dark: '#f4af0c'
        },
        colorBlue: {
          light: '#3a3dff',
          dark: '#3a3dff'
        },
        bgBase: {
          light: '#fafafa',
          dark: '#0F0F0F'
        },
        bgSecondary: {
          light: '#f0f0f0',
          dark: '#181818'
        },
        bgHover: {
          light: '#e3e3e3',
          dark: '#1f1f1f'
        },
        bgDark: {
          light: '#bbbbbb',
          dark: '#000000'
        },
        borderColor: {
          light: '#ddd',
          dark: '#312d3e'
        },
      }
    },
  },
  plugins: [],
}
