/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      green1o: 'hsla(83, 58%, 69%, 1)',
      green2o: 'hsla(122, 39%, 49%, 1)',
      green2t:  'hsla(122, 39%, 49%, 0.4)',
      black0o: 'hsla(0, 0%, 0%, 1)',
      blue1t: 'hsla(214, 80%, 62%, 0.4)',
      blue2o: 'hsla(214, 100%, 50%, 1)',
      yellow1o: 'hsla(46, 100%, 56%, 1)',
      white0o: 'hsla(0, 0%, 100%, 1)',
      white0t: 'hsla(0, 0%, 100%, 0.4)',
      grey1o: 'hsla(0, 0%, 32%, 1)',
      grey2o: 'hsla(0, 0%, 20%, 1)',
      yellow1o: 'hsla(42, 100%, 68%, 1)'
  },

    extend: {
      fontFamily: {
        roboto: ['Roboto'],
        robotoSlab: ['Roboto Slab']
      }
    },
  },
  plugins: [],
}