const path = require("path");

module.exports = {
  target: "webworker",
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  mode: "production",
  devtool: "source-map",
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          }
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'build'),
  },
}