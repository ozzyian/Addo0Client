/* eslint-disable max-len */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['google'],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'indent': 'off',
    'inebreak-style': 0,
    'tenary': 'off',
    'operator-linebreak': [2, 'after', {'overrides': {'?': 'ignore', ':': 'ignore'}}],
  },
  parserOptions: {
    sourceType: 'module',
  },
};
