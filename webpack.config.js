
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './index',
  output: {
    filename: 'poisson-process.min.js',
    path: path.join(__dirname, '/dist'),
    sourceMapFilename: '[file].map',
    library: 'poissonProcess',  // module name in global scope
    libraryTarget: 'umd',
  },

  devtool: 'source-map',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
};
