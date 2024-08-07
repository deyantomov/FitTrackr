module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'react-app', 'react-app/jest'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'indent': ["error", 2],
    'no-unused-vars': 'warn',
    'no-console': 'warn', 
    'eqeqeq': 'error', 
    'curly': 'error', 
    'block-spacing': 'error',
    'array-bracket-spacing': ['error', 'never'], 
    'object-curly-spacing': ['error', 'always'], 
    'semi': ['warn', 'always'], 
    'quotes': ['error', 'double'], 
    'no-case-declarations': 'off'
  },
}
