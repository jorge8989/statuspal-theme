const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  entry: './src/js/index.js',
  output: {
    filename: 'js/[hash].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.liquid$/, use: [
          { loader: "html-loader" },
          { loader: "liquid-loader", options: { data: { var1: 'YOLO' } } }
        ]
      },
      { test: /\.scss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader']}) },
      { test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'}) },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: __dirname + '/src/templates/index.liquid' }),
    new ExtractTextPlugin('css/[hash].[name].css'),
  ]
};
