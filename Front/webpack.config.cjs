const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development', // ou 'production'
  // Le contexte par défaut est le dossier où se trouve ce fichier, soit Front.
  entry: './src/index.js', // Le point d'entrée est dans le sous-dossier src
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'), // La sortie sera dans Front/dist
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8085,
    open: true,
    hot: true,
    static: {
      // Si vous servez des fichiers statiques en dehors de Webpack,
      // vous pouvez définir ici le dossier correspondant.
      // Sinon, vous pouvez le laisser vide ou le désactiver.
      directory: path.resolve(__dirname, 'dist')
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      // Ajoutez d'autres règles si nécessaire...
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      inject: 'body',
      hash: true,
    }),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
      exclude: 'node_modules',
      files: './src/',
      emitWarning: true,
      failOnWarning: false,
      fix: true,
      cache: false,
      // Utilisez overrideConfigFile si vous avez besoin d'un fichier de configuration ESLint
      overrideConfigFile: path.resolve(__dirname, 'eslint.config.cjs'),
    }),
  ],
};

