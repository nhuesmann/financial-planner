module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',

  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
  tailwindFunctions: ['cn'],
};
