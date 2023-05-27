const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the entry file of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace with the output path for bundled files
    filename: 'bundle.js', // Replace with the desired output bundle file name
  },
  resolve: {
    fallback: {
      url: require.resolve('url/'),
    },
  },
  // Add other webpack configuration options as needed
};
