const path = require('path');
const fetch = require('node-fetch');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const getConfig = (data) => {
  const htmlLoaders = [{ loader: "html-loader" }];
  if (mode !== 'production') htmlLoaders.push({
    loader: "liquid-loader", options: { data, root: path.resolve(__dirname, 'src/templates/status_page') }
  });
  return {
    mode: mode,
    entry: './src/js/app.js',
    output: {
      filename: 'js/[name]-[hash].js',
      publicPath: '/'
    },
    module: {
      rules: [
        { test: /\.liquid|\.html$/, use: htmlLoaders },
        { test: /\.scss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader']}) },
        { test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'}) },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: __dirname + '/src/templates/status_page/index.liquid' }),
      new ExtractTextPlugin('css/[name]-[hash].css'),
      new CleanWebpackPlugin([path.resolve(__dirname, 'dist/*')]),
    ]
  };
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:4000/api/v1/status_pages/meta')
      .then(res => res.json())
      .then(json => resolve(getConfig(json)))
      .catch(e => reject(e));
  });
};
