/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fundo:       '#0D0905',
        dourado:     '#C8892A',
        vinho:       '#7B2D2D',
        creme:       '#F0E6C8',
        castanho:    '#3D2B1F',
        douradoPale: '#E8D5A3',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cinzel:   ['Cinzel', 'serif'],
        lora:     ['Lora', 'serif'],
        fell:     ['"IM Fell English"', 'serif'],
      },
    },
  },
  plugins: [],
}

