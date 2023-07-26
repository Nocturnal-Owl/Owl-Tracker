module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        'airbnb-base',
        'airbnb-typescript/base',
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "parserOptions": {
        "project": './tsconfig.json',
    },
    "rules": {
        "import/prefer-default-export": 'off',
        "no-console": 'off',
        "func-names": 'off',
        "no-bitwise": 'off',
        "import/no-cycle": 'off',
        "max-len": 'off',
        "no-param-reassign": ["error", { "props": false }]
    }
}
