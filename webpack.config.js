const path = require('path');
const webpack = require('webpack'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // Pour minimiser le JS en production

module.exports = {
  // Point d'entrée principal
  entry: './Front/src/index.js',
  output: {
    filename: 'src/[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // Supprime les anciens fichiers lors de la construction
  },
  
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'Assets/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'Assets/[name].[ext]',
            },
          },
        ],
      },
    ]
  },
  
  resolve: {
    fullySpecified: false,
    extensions: ['.js', '.ts', '.json'], // Résolution automatique des extensions
  },
  devServer: {
    historyApiFallback: true, // Gestion des routes pour les SPA
    host: '0.0.0.0',
    port: 8085,
    open: true,
    hot: true, // Hot Module Replacement
    client: {
      logging: 'verbose', // Niveau de détail des logs
      overlay: true,
      progress: true,
      webSocketTransport: 'ws'
    },
    webSocketServer: 'ws'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()] // Minimise le JavaScript en production
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './Front/src/index.html'),
      inject: 'body',
      hash: true
    }),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
      exclude: 'node_modules',
      files: './Front/src/',
      emitWarning: true,
      failOnWarning: false,
      fix: true, // Active la correction automatique
      cache: false 
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ]
};
