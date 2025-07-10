/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a1a1a',
            maxWidth: '65ch',
            a: {
              color: '#1a1a1a',
              textDecoration: 'underline',
              textDecorationColor: '#d1d5db',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              '&:hover': {
                textDecorationColor: '#9ca3af',
              },
            },
            'blockquote': {
              borderLeftColor: '#e5e7eb',
              borderLeftWidth: '3px',
              fontStyle: 'normal',
              fontWeight: '400',
              color: '#6b7280',
            },
            'pre': {
              backgroundColor: '#fafafa',
              border: '1px solid #e5e7eb',
              borderRadius: '0',
            },
            'code': {
              backgroundColor: '#fafafa',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.125rem',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}