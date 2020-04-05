const path = require('path');

module.exports = ({ config, mode }) => {
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
        exclude: [
          /node_modules/,
          /\.test\.tsx?$/,
        ]
      },
      {
          test: /\.scss$/,
          use: [
              'style-loader', 
              'css-loader', 
              'postcss-loader', 
              'sass-loader',
              {
                  loader: 'sass-resources-loader',
                  options: {
                      resources: [
                          path.resolve(__dirname, '../app/style/globals.scss')
                      ]
                  }
              }
          ],
          exclude: /node_modules/
      },
      { 
          test: /\.css$/, 
          loaders: ['style-loader', 'css-loader'],
          exclude: /node_modules/
      },
      {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
      }
    );
    config.resolve.extensions.push('.ts', '.tsx');
    config.devtool = 'inline-source-map';
    return config;
  };