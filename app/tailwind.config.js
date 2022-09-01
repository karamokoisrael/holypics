const { plugin } = require('twrnc');

module.exports = {
    plugins: [
      plugin(({ addUtilities }) => {
        addUtilities({
          btn: `px-1 py-1 rounded-full bg-red-800 text-white mt-20`,
          'body-text': `font-serif leading-relaxed tracking-wide text-gray-800`,
        });
      }),
    ],
  };