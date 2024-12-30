/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./pages/**/*.vue",
    "./components/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['grotesk'],
		telegraf: ['telegraf'],
		whitney: ['whitney'],
		nunito: ['nunito'],
		robotoCondensed: ['robotoCondensed'],
      },
      colors: {
        primary: '#FDBA30',
				'primary-disabled': '#FFE2BE',
				secondary: '#333333',
				url: '#3817FF',
				midnightBlue: '#00B9FF',
				yellow: '#FDBF3F',
				disable: '#C2D1D9',
				purple: '#AD29FF',
				black: '#000000',
				neutral: '#4F6168',
				error: '#DC3545',
				'error-dark': '#B7192C',
				celestial_white: '#EAEAEA',
				blue_light: '#0056B3',
				gray: '#E8E8E8',
				gray_80: '#6D6D6D',
				gray_40: '#D9D9D9',
				dark_100: '#191919',
				extra_gray: '#F6F6F6',
				green_10: '#E4F1E5',
				green_20: '#D1E8D3',
				green_30: '#BCE4C5',
				green_40: '#98FB98',
				green_60: '#28A745',
				green_70: '#1E7D34',
				yellow_30: '#FEE5C7',
				yellow_90: '#A0751E',
				red_30: '#F7D4D7',
				purple_80: '#861FC5',
				magenta_70: '#D010B4',
				magenta_30: '#F6C5EB',
				violet_20: '#E6C2FF',
				violet_60: '#9500FF',
				violet_80: '#6A00B5',
				violet_100: '#430073',
				cyan_80: '#008FC5',
				blue_link: '#1938A6',
				cyan_40: '#A1D7FF',
				'cyan-80': '#0072AB',
				cyan_10: '#F1F8FF',
				magenta_60: '#FF00DA',
				magenta_80: '#B5009B',
				magenta_10: '#FFE6FB',
				yellow_10: '#FEF8F2',
				white_transparent: 'rgba(255, 255, 255, 0.8)',
				black_transparent: 'rgba(0, 0, 0, 0.5)',
				amber_60: '#FFC107',
				gray_50: "#CDCDCD",
				gray_60: "#C2CAD4",
				cyan_5: "#F3F9FF",
				neutron80: "#262626",
				gray1: "#697074",
				turquoise: "#40E0D0",
				darkBlue: "#00008B"
      },
      boxShadow: {
        bgBox: "0px 4px 6px 0px rgba(25, 25, 25, 0.15)",
      },
    },
  },
  plugins: [],
};
