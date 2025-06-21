/** @type {import('tailwindcss').Config} */
export default {
  content: [
   "./src/**/*.{js,jsx,ts,tsx}",
 ],
 theme: {
   extend: {
     screens:{
       'xs': '475px',
       'xss': '300px',
     },
     fontFamily: {
  handwriting: ['"Caveat"', 'cursive'],
},
   },
 },
 plugins: [],
}

