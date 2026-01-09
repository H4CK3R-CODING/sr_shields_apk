const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Disable CSP for development
  if (config.devServer) {
    config.devServer.headers = {
      ...config.devServer.headers,
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
    };
  }
  
  return config;
};