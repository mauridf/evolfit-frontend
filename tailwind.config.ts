import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores semânticas ligadas a CSS vars (definidas em index.css)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-foreground': 'hsl(var(--surface-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },

        // Cores por módulo (§2 da Proposta_Tela)
        module: {
          auth: '#6366F1', // indigo-500
          health: '#10B981', // emerald-500
          workouts: '#F59E0B', // amber-500
          dashboard: '#0EA5E9', // sky-500
        },
      },
      borderRadius: {
        card: '12px',
        input: '8px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, .35)',
      },
      spacing: {
        // grid base 8px já é o default; adicionamos só o token semântico
        input: '40px', // altura padrão de input (§2)
      },
      zIndex: {
        toast: '50',
        modal: '100',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;