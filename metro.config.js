// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.assetPlugins.push('expo-asset/tools/hashAssetFiles');

module.exports = defaultConfig;
