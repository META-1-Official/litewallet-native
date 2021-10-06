module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': [
      'error',
      { builtinGlobals: false, hoist: 'functions', allow: ['_'] },
    ],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
  },
};
