module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
    sourceType: "module"
  },
  root: true,
  env: {
    node: true,
    jest: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extra-parens": ["error"],
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/space-before-function-paren": [
      "error",
      { anonymous: "always", named: "never", asyncArrow: "always" }
    ],
    "@typescript-eslint/keyword-spacing": [
      "error",
      { before: true, after: true }
    ],
    "@typescript-eslint/promise-function-async": ["error"],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-readonly": ["error"],
    "@typescript-eslint/no-unnecessary-condition": ["error"],
    "@typescript-eslint/switch-exhaustiveness-check": ["error"],
    "@typescript-eslint/prefer-literal-enum-member": ["error"],
    "@typescript-eslint/prefer-enum-initializers": ["error"],
    "@typescript-eslint/prefer-includes": ["error"],
    "@typescript-eslint/prefer-for-of": ["error"],
    "@typescript-eslint/no-dynamic-delete": ["error"],
    "@typescript-eslint/no-dupe-class-members": ["error"],
    "@typescript-eslint/no-throw-literal": ["error"],
    "@typescript-eslint/no-invalid-void-type": [
      "error",
      { allowInGenericTypeArguments: true }
    ],
    "@typescript-eslint/no-unused-expressions": ["error"],
    "@typescript-eslint/no-useless-constructor": ["error"],
    "@typescript-eslint/return-await": ["error", "always"],
    "@typescript-eslint/method-signature-style": ["error", "property"],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-confusing-non-null-assertion": ["error"],
    "@typescript-eslint/no-invalid-this": ["error"],
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "allow-as-parameter"
      }
    ],
    "@typescript-eslint/type-annotation-spacing": [
      "error",
      {
        before: false,
        after: true,
        overrides: { arrow: { before: true, after: true } }
      }
    ],
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": [
      "error",
      {
        allowComparingNullableBooleansToTrue: false
      }
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "none",
          requireLast: false
        },
        singleline: {
          delimiter: "comma",
          requireLast: false
        }
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "variableLike", format: ["camelCase"] },
      { selector: "method", format: ["camelCase"] },
      { selector: "function", format: ["camelCase"] },
      { selector: "typeLike", format: ["PascalCase"] },
      { selector: "enumMember", format: ["UPPER_CASE"] },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will"]
      },
      {
        selector: "parameter",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will"]
      },
      {
        selector: "parameterProperty",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will"]
      },
      {
        selector: "accessor",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will"]
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        trailingUnderscore: "allow"
      }
    ],
    "@typescript-eslint/lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true }
    ],
    "object-curly-spacing": [
      "error",
      "always",
      {
        arraysInObjects: true,
        objectsInObjects: false
      }
    ],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "padding-line-between-statements": [
      "error",
      { blankLine: "never", prev: "*", next: "block-like" },
      { blankLine: "always", prev: "block", next: "*" },
      { blankLine: "never", prev: "import", next: "import" },
      { blankLine: "always", prev: "import", next: "block-like" },
      {
        blankLine: "always",
        prev: "multiline-block-like",
        next: "multiline-block-like"
      }
    ],
    "padded-blocks": ["error", { blocks: "never" }],
    "space-before-blocks": ["error", "always"],
    "no-dupe-class-members": "off",
    "no-extra-parens": "off",
    "no-invalid-this": "off",
    "no-unused-expressions": "off",
    "no-useless-constructor": "off",
    "no-return-await": "off",
    "space-before-function-paren": "off",
    "keyword-spacing": "off",
    quotes: "off",
    semi: "off",
    camelcase: "off",
    indent: "off"
  }
}
