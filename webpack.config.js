const path               = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const indexPath = mode === 'production' ? 'src/templates/status_page/index.liquid' : 'intermediate/index.html';

const config = {
  mode: mode,
  entry: './src/js/app.js',
  output: {
    filename: 'js/[name]-[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.scss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader']}) },
      { test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'}) },
    ],
  },
  plugins: [
    new ExtractTextPlugin('css/[name]-[hash].css'),
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist/*')]),
    new HtmlWebpackPlugin({ template: indexPath, inject: false, templateParameters: (compilation) => {
      return { webpack: compilation.getStats().toJson() };
    }})
  ],
};

if (mode === 'production') {
  config.plugins = config.plugins.concat([
    new CopyWebpackPlugin([{ from: './src/templates', to: 'templates' }]),
  ]);
}

module.exports = config;
