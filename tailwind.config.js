/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        // Do not change this file because it will be overwritten
        // after you update the code e.g. using 'git pull'.
        // You can customize these colors in the '.env' file.
        colorBase: {
          light: process.env.COLOR_BASE_LIGHT || '#000000',
          dark: process.env.COLOR_BASE_DARK || '#d8d8d8'
        },
        colorPrimary: {
          light: process.env.COLOR_PRIMARY_LIGHT || '#ba14bf',
          dark: process.env.COLOR_PRIMARY_DARK || '#ba14bf'
        },
        colorSecondary: {
          light: process.env.COLOR_SECONDARY_LIGHT || '#000000',
          dark: process.env.COLOR_SECONDARY_DARK || '#ffffff'
        },
        colorHover: {
          light: process.env.COLOR_HOVER_LIGHT || '#243746',
          dark: process.env.COLOR_HOVER_DARK || '#cbd4d1'
        },
        colorNotImportant: {
          light: process.env.COLOR_NOT_IMPORTANT_LIGHT || '#9b8bc6',
          dark: process.env.COLOR_NOT_IMPORTANT_DARK || '#706297'
        },
        colorGreen: {
          light: process.env.COLOR_GREEN_LIGHT || '#089703',
          dark: process.env.COLOR_GREEN_DARK || '#0ad203'
        },
        colorRed: {
          light: process.env.COLOR_RED_LIGHT || '#ff0a0a',
          dark: process.env.COLOR_RED_DARK || '#ff0a0a'
        },
        colorOrange: {
          light: process.env.COLOR_ORANGE_LIGHT || '#f4af0c',
          dark: process.env.COLOR_ORANGE_DARK || '#f4af0c'
        },
        colorBlue: {
          light: process.env.COLOR_BLUE_LIGHT || '#3a3dff',
          dark: process.env.COLOR_BLUE_DARK || '#3a3dff'
        },
        bgBase: {
          light: process.env.BG_BASE_LIGHT || '#fafafa',
          dark: process.env.BG_BASE_DARK || '#0F0F0F'
        },
        bgSecondary: {
          light: process.env.BG_SECONDARY_LIGHT || '#f0f0f0',
          dark: process.env.BG_SECONDARY_DARK || '#181818'
        },
        bgHover: {
          light: process.env.BG_HOVER_LIGHT || '#e3e3e3',
          dark: process.env.BG_HOVER_DARK || '#1f1f1f'
        },
        bgDark: {
          light: process.env.BG_DARK_LIGHT || '#bbbbbb',
          dark: process.env.BG_DARK_DARK || '#000000'
        },
        borderColor: {
          light: process.env.BORDER_COLOR_LIGHT || '#ddd',
          dark: process.env.BORDER_COLOR_DARK || '#312d3e'
        },
      }
    },
  },
  plugins: [],
}
