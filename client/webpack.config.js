module.exports = {
    resolve: {
      fallback: {
        "zlib": require.resolve("browserify-zlib"),
        "crypto": require.resolve("crypto-browserify"),
        "fs": false,
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "path": require.resolve("path-browserify"),
        "querystring": require.resolve("querystring-es3")
      }
    }
  };
  