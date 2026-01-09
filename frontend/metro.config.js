const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add CSP configuration for web
if (config.web) {
  config.web.build = {
    ...config.web.build,
    babel: {
      ...config.web.build?.babel,
      dangerouslyAllowEval: true
    }
  };
}

// Initialize blockList as array if it doesn't exist
if (!config.resolver.blockList) {
  config.resolver.blockList = [];
}

// Convert single RegExp to array if needed
if (!Array.isArray(config.resolver.blockList)) {
  config.resolver.blockList = [config.resolver.blockList];
}

// Add expo-router to blockList
config.resolver.blockList.push(/node_modules\/expo-router\/.*/);
 
module.exports = withNativeWind(config, { input: './global.css' });