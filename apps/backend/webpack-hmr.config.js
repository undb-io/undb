/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

module.exports = function (options, webpack) {
  return {
    ...options,
    watchOptions: {
      ...options.watchOptions,
      aggregateTimeout: 600,
    },
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: [
          'webpack/hot/poll?100',
          '@egodb/sqlite',
          '@egodb/core',
          '@egodb/domain',
          '@egodb/trpc',
          '@egodb/cqrs',
        ],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: true }),
    ],
    devtool: 'inline-source-map',
  }
}
