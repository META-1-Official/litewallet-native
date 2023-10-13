module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': 'off', // replaced by ts-eslint rule below
    '@typescript-eslint/no-shadow': [
      'error',
      { builtinGlobals: false, hoist: 'functions', allow: ['_'] },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    'no-undef': 'off',
    'prettier/prettier': 1,
    'react-hooks/exhaustive-deps': 1,
  },
};
