const path = require('path');

module.exports = {
  entry: {
    App: path.resolve(__dirname, './src/js/app.js')
  },
  output: {
    path: path.resolve(__dirname, './dist/js/'),
    filename: './app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'production'
};
