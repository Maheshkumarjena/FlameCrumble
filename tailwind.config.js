export const content = [
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
];

export const theme = {
  extend: {
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#E30B5D',
      'accent-dark': '#c5094f',
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
    },
  },
};
export const plugins = [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
];