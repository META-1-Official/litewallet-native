module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions', allow: ['_'] }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': 1,
    'react-hooks/exhaustive-deps': 1,
  },
};
