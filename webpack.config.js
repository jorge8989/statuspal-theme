const path               = require('path');
const fs                 = require('fs');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const WebpackPluginHash  = require('webpack-plugin-hash');

const MODE = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const PORT = process.env.PORT || 5500;

const config = {
  mode: MODE,
  entry: { theme: ['./src/js/app.js'] },
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
  ],
  devServer: {
    port: PORT,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/status_page.html' },
        { from: /^\/incidents\/(\d+)/, to: '/incident.html' },
        { from: /^\/incidents/, to: '/incidents.html' },
      ],
    },
  }
};

if (MODE === 'production') {
  config.plugins = config.plugins.concat([
    new CopyWebpackPlugin([{ from: './src/templates', to: 'templates' }]),
    new WebpackPluginHash({
      callback: (error, hash) => {
        const packageObj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
        const { theme } = packageObj;

        fs.writeFileSync(path.resolve(__dirname, 'dist/configs.json'), JSON.stringify({ ...theme, hash }, null, 2));
      },
    })
  ]);
} else {
  config.plugins = config.plugins.concat([
    new HtmlWebpackPlugin({ template: 'intermediate/status_page.html', inject: false, filename: 'status_page.html',
      templateParameters: (compilation) => ({ webpack: compilation.getStats().toJson() })}),
    new HtmlWebpackPlugin({ template: 'intermediate/incidents.html', inject: false, filename: 'incidents.html',
      templateParameters: (compilation) => ({ webpack: compilation.getStats().toJson() })}),
    new HtmlWebpackPlugin({ template: 'intermediate/incident.html', inject: false, filename: 'incident.html',
      templateParameters: (compilation) => ({ webpack: compilation.getStats().toJson() })}),
  ]);
}

module.exports = config;
