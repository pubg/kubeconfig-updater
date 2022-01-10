module.exports = {
  plugins: ['prettier'],
  extends: ['erb', 'prettier'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    // indent option conflicts with prettier
    indent: ['off', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-case-declarations': 'error',
    'no-underscore-dangle': 'off',
    'prettier/prettier': 'warn',
    'no-restricted-syntax': ['off'],
    '@typescript-eslint/no-namespace': ['off'],
    'func-names': ['off'],
    'react/jsx-props-no-spreading': [
      'warn',
      {
        html: 'enforce',
        custom: 'ignore',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    // 'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      // node: {},
      // webpack: {
        // config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      // },
    // },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
}
