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
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
    'tenary': 'off',
    'operator-linebreak': [2, 'after', {'overrides': {'?': 'ignore', ':': 'ignore'}}],
  },
  parserOptions: {
    sourceType: 'module',
  },
};
