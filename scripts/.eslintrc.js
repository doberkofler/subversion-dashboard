module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './scripts/tsconfig.json',
		sourceType: 'module',
	},
	env: {
		es6: true,
		node: true
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/all',
	],
	'rules': {
		'semi': ['error', 'always'],
		'@typescript-eslint/comma-dangle': ['warn', {
			arrays: 'only-multiline',
			objects: 'only-multiline',
			imports: 'only-multiline',
			exports: 'only-multiline',
			functions: 'only-multiline',
			enums: 'only-multiline',
		}],
	'@typescript-eslint/consistent-type-definitions': 'off',
	'@typescript-eslint/indent': ['error', 'tab'],
	'@typescript-eslint/init-declarations': 'off',
	'@typescript-eslint/member-delimiter-style': ['error',
		{
			singleline: {
				delimiter: 'comma',
				requireLast: false
			},
			multiline: {
				delimiter: 'comma',
				requireLast: true
			}
		}
	],
	'@typescript-eslint/member-ordering': 'off',
	'@typescript-eslint/naming-convention': 'off',
	'@typescript-eslint/no-magic-numbers': 'off',
	'@typescript-eslint/no-type-alias': 'off',
	'@typescript-eslint/no-use-before-define': 'off',
	'@typescript-eslint/quotes': ['error', 'single', 'avoid-escape'],
	'@typescript-eslint/prefer-readonly-parameter-types': 'off',
	'@typescript-eslint/space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'never'}],
	'@typescript-eslint/sort-type-constituents': 'off',
	'@typescript-eslint/sort-type-union-intersection-members': 'off',
	},
};
