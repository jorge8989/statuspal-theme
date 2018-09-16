const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  const htmlLoaders = [{ loader: "html-loader" }];
  return {
    devServer: {
      contentBase: path.join(__dirname, 'src/templates/status_page/service.liquid'),
      watchContentBase: true,
    },
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
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'intermediate/index.html') }),
      new ExtractTextPlugin('css/[name]-[hash].css'),
      new CleanWebpackPlugin([path.resolve(__dirname, 'dist/*')]),
    ]
  };
};
