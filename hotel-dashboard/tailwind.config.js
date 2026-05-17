/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        teal:    { 50:'#EDF3EE', 100:'#D6E8D8', 200:'#AECFB2', 300:'#84B48A', 400:'#6EA474', 500:'#5C8862', 600:'#4E7854', 700:'#3E6244', 800:'#314E37' },
        sky:     { 50:'#EEF2F6', 100:'#DAE4EE', 200:'#B4CCDE', 300:'#88AFCA', 400:'#6694B2', 500:'#517C9C', 600:'#406888', 700:'#325472' },
        amber:   { 50:'#F5F0E8', 100:'#EAE0C6', 200:'#D2BF90', 300:'#BC9E60', 400:'#A88440', 500:'#9A7030', 600:'#7E5C26', 700:'#664A1E', 800:'#513A18' },
        red:     { 50:'#F4ECEB', 100:'#E9D5D3', 300:'#C09090', 400:'#A87070', 500:'#945858' },
        violet:  { 50:'#EEECF4', 100:'#DAD8EC', 500:'#786CA0', 600:'#685C90', 700:'#544C78' },
        cyan:    { 50:'#EAF2F2', 100:'#D0E4E4', 400:'#589090', 600:'#3E7474', 700:'#306060' },
        pink:    { 600:'#926080' },
        indigo:  { 600:'#6068A6' },
        purple:  { 600:'#6E5EA4' },
        rose:    { 600:'#9E5060' },
        emerald: { 600:'#4C7852' },
      },
    },
  },
  plugins: [],
}
