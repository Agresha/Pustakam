// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         poppins: ['Poppins', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }

/**  @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
  
      },
      colors: {
        mainColor: "rgba(2, 121, 202, 1)", // for light mode color
        darkModeColor : "#121212",
        lightModeColor : "#ffffff",
      },
    },
  },
  plugins: [],
}