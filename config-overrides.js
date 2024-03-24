const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    querystring: require.resolve("querystring-es3"),
    path: require.resolve("path-browserify"),
    http: require.resolve("http-browserify"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    url: require.resolve("url"),
    buffer: require.resolve("buffer")
  });
  config.resolve.fallback = fallback;
  return config;
};
