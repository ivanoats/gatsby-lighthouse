module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['react'],
  globals: {
    graphql: false,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '2018',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
