module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'airbnb-typescript/base',
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        'default-case': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        camelcase: 'off',
        'no-unsafe-finally': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-cycle': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
        'max-classes-per-file': 'off',
        'no-await-in-loop': 'off',
        semi: 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        curly: ['error', 'all'],
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 0,
        'array-callback-return': 'error',
        'brace-style': ['error', '1tbs', { allowSingleLine: false }],
        'no-return-await': 'error',
        'no-invalid-this': 'off',
        'no-empty-pattern': 'error',
        'no-magic-numbers': 'off',
        'no-unused-vars': 'error',
        'object-shorthand': ['error', 'always'],
        'space-before-blocks': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            { accessibility: 'no-public' },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
            },
            {
                selector: 'variable',
                types: ['function'],
                format: ['camelCase', 'PascalCase'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                filter: {
                    regex: '^(.*-.*)$',
                    match: false,
                },
                leadingUnderscore: 'allow',
            },
            {
                selector: 'enumMember',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'memberLike',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'memberLike',
                format: null,
                filter: {
                    regex: '[- ]',
                    match: true,
                },
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],
        '@typescript-eslint/no-explicit-any': [
            'error',
            { ignoreRestArgs: true },
        ],
        '@typescript-eslint/no-invalid-this': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-extra-semi': "off",
        '@typescript-eslint/no-magic-numbers': [
            'error',
            {
                ignoreEnums: true,
                ignoreArrayIndexes: true,
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: true,
                ignore: [0, 1],
            },
        ],
        '@typescript-eslint/return-await': ['error', 'always'],
        '@typescript-eslint/semi': ['error', 'never'],
        'import/order': [
            'error',
            {
                alphabetize: { order: 'asc' },
                'newlines-between': 'always',
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                ],
            },
        ],
        'no-restricted-syntax': 'off',
        'import/extensions': 'off',
    },
    ignorePatterns: ['.eslintrc.js'],
}
