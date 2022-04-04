module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        envName: 'NETWORK',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
