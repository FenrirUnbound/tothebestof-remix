'use strict';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './ui/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/scripts')
  },
  plugins: [
    new UglifyJSPlugin({ minimize: true })
  ]
};
