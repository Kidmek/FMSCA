const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.assetExts.push('xlsx')
config.resolver.assetExts.push('csv')

module.exports = config
