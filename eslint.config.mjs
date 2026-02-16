// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    files: ['**/*.ts', '**/*.vue'],
    ignores: ['node_modules', '.output', 'dist'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
        },
      ],
    },
  },
])
