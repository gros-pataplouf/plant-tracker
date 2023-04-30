/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    

    extend: {
      fontFamily: {
        roboto: ['Roboto'],
        robotoSlab: ['Roboto Slab']
      },
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
        yellow1o: 'hsla(42, 100%, 68%, 1)',
        pantone: '#fb6107', 
        citrine: '#f3de2c',
        cream: 'hsla(101, 72%, 92%, 1)',
        brown: '#43291f',
        apple: '#7cb518',
        avocado: '#5c8001',
        xanthous: '#fbb02d',
        lime: '#abff4f',
        kaki: 'hsl(84, 62%, 10%)',
        slateblue: 'hsla(211, 33%, 25%, 1)',
        mint: 'hsla(161, 48%, 62%, 0.2)',
        sprout: 'hsla(101, 64%, 74%, 0.3)',
    }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),

],
}

