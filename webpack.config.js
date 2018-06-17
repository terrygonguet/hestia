const path = require('path')

module.exports = {
  entry: {
    background: './src/background/background.js',
    new_tab: './src/new_tab/new_tab.js',
    options: './src/options/options.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: 'eval-source-map',
  mode: 'development',
  performance: {
    maxAssetSize: 2500000
  },
  watch: true,
  watchOptions: {
    ignored: [/node_modules/, /dist/]
  }
}
