/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  return {
    ...options,
		mode: 'production',
    externals: [
      nodeExternals({
        allowlist: [
          'webpack/hot/poll?100',
          '@egodb/in-memory-repository',
        ],
      }),
    ],
  };
};
