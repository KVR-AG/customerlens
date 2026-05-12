import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:          'var(--color-primary)',
        'primary-hover':  'var(--color-primary-hover)',
        background:       'var(--color-background)',
        surface:          'var(--color-surface)',
        'surface-low':    'var(--color-surface-low)',
        'surface-high':   'var(--color-surface-high)',
        'on-surface':     'var(--color-on-surface)',
        'on-surface-var': 'var(--color-on-surface-variant)',
        secondary:        'var(--color-secondary)',
        outline:          'var(--color-outline)',
        'outline-strong': 'var(--color-outline-strong)',
        positive:         'var(--color-positive)',
        'positive-bg':    'var(--color-positive-bg)',
        negative:         'var(--color-negative)',
        'negative-bg':    'var(--color-negative-bg)',
        warning:          'var(--color-warning)',
        'warning-bg':     'var(--color-warning-bg)',
        watch:            'var(--color-watch)',
        'ai-accent':      'var(--color-ai-accent)',
        'ai-bg':          'var(--color-ai-bg)',
      },
      fontFamily: {
        sans: ['Roboto'],
        display: ['Poppins'],
      },
      borderRadius: {
        card: '12px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}

export default config
