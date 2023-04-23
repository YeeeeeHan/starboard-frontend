module.exports = {
  extends: ['@moralisweb3', 'plugin:@next/next/recommended', 'plugin:cypress/recommended'],
  ignorePatterns: ['**/build/**/*'],
  rules: {
    'no-console': 'off',
    'etc/no-commented-out-code': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'off',
    eqeqeq: 'off',
    header: 'off',
    'prefer-destructuring': 'off',
  },
};
