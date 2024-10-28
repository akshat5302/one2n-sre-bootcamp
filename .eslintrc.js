module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Set all rules to warn instead of error
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    // Add more rules here if needed
  },
};
