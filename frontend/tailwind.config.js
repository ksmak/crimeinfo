import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#42a5f5;',
        }
      },
      fontFamily: {
        'lobster': ['Lobster', 'sans-serif']
      },
    },
  },
  plugins: [],
});
