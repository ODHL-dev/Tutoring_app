const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
 
config.resolver = config.resolver || {};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === 'zustand') {
		return {
			filePath: path.join(__dirname, 'node_modules', 'zustand', 'index.js'),
			type: 'sourceFile',
		};
	}
	if (moduleName.startsWith('zustand/')) {
		const subpath = moduleName.replace('zustand/', '');
		return {
			filePath: path.join(__dirname, 'node_modules', 'zustand', `${subpath}.js`),
			type: 'sourceFile',
		};
	}

	return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
