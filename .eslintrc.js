module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': [
      'error',
      {builtinGlobals: false, hoist: 'functions', allow: ['_']},
    ],
  },
};
