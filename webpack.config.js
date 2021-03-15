const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    host: '0.0.0.0',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader', options: { presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]] } }
        ]
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      // {
      //   test: /\.json$/,
      //   exclude: /node_modules/,
      //   use: [
      //     { loader: 'json-loader' }
      //   ]
      // },
      // {
      //   test: /\.json$/,
      //   use: [
      //     'file-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({ template: './src/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(
      { patterns: [{ from: path.resolve(__dirname, 'public'), to: 'public' }] }
    )
  ]
}
