/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Schibsted Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'base': ['20px', '1.6'],
        'sm': ['16px', '1.5'],
        'lg': ['24px', '1.5'],
        'xl': ['28px', '1.4'],
        '2xl': ['32px', '1.3'],
        '3xl': ['40px', '1.2'],
        '4xl': ['48px', '1.1'],
        '5xl': ['60px', '1'],
      },
      fontWeight: {
        'normal': '400',
        'bold': '700',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a1a1a',
            maxWidth: '65ch',
            fontSize: '20px',
            lineHeight: '1.6',
            fontWeight: '400',
            'h1': {
              fontWeight: '700',
              fontSize: '2.4em',
              lineHeight: '1.1',
              marginTop: '0',
              marginBottom: '0.8em',
            },
            'h2': {
              fontWeight: '700',
              fontSize: '1.8em',
              lineHeight: '1.2',
              marginTop: '1.5em',
              marginBottom: '0.8em',
            },
            'h3': {
              fontWeight: '700',
              fontSize: '1.4em',
              lineHeight: '1.3',
              marginTop: '1.2em',
              marginBottom: '0.6em',
            },
            'h4': {
              fontWeight: '700',
              fontSize: '1.2em',
              lineHeight: '1.4',
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            'p': {
              marginTop: '1.2em',
              marginBottom: '1.2em',
            },
            'figure': {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'ul': {
              listStyleType: 'disc',
              listStylePosition: 'outside',
              paddingLeft: '1.5em',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'ol': {
              listStyleType: 'decimal',
              listStylePosition: 'outside',
              paddingLeft: '1.5em',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'li': {
              marginTop: '0.4em',
              marginBottom: '0.4em',
              paddingLeft: '0.375em',
            },
            'ul > li': {
              listStyleType: 'disc',
            },
            'ol > li': {
              listStyleType: 'decimal',
            },
            'a': {
              color: '#1a1a1a',
              textDecoration: 'underline',
              textDecorationColor: '#d1d5db',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              fontWeight: '400',
              '&:hover': {
                textDecorationColor: '#9ca3af',
              },
            },
            'strong': {
              fontWeight: '700',
            },
            'blockquote': {
              borderLeftWidth: '0',
              fontStyle: 'normal',
              fontWeight: '400',
              color: '#6b7280',
              fontSize: '1.1em',
              paddingLeft: '0',
              marginTop: '0',
              marginBottom: '0',
            },
            'pre': {
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0',
              fontSize: '0.9em',
              lineHeight: '1.6',
              margin: '0',
            },
            'code': {
              backgroundColor: '#fafafa',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.125rem',
              fontWeight: '400',
              fontSize: '0.9em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: '1em',
            },
            'table': {
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.95em',
            },
            'thead': {
              borderBottomWidth: '2px',
              borderBottomColor: '#e5e7eb',
            },
            'thead th': {
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '0.75em',
              textAlign: 'left',
            },
            'tbody td': {
              verticalAlign: 'top',
              paddingTop: '0.75em',
              paddingRight: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '0.75em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: '#f3f4f6',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td:first-child': {
              fontWeight: '500',
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