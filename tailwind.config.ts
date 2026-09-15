import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ---- Cores semânticas ligadas a CSS vars ---- */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-foreground': 'hsl(var(--surface-foreground))',
        'surface-hover': 'hsl(var(--surface-hover))',
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

        /* ---- Kinetic Obsidian — module tokens (DESIGN.md) ---- */
        module: {
          auth: '#6366F1', // Indigo-500
          health: '#10B981', // Emerald-500
          workouts: '#F59E0B', // Amber-500
          dashboard: '#0EA5E9', // Sky-500
        },

        /* ---- Kinetic Obsidian — telemetry states (DESIGN.md) ---- */
        'state-active': '#22C55E', // Green-500
        'state-paused': '#F59E0B', // Amber-500
        'state-completed': '#0EA5E9', // Sky-500
        'state-danger': '#EF4444', // Red-500
      },

      /* ---- Boundary matrix (DESIGN.md) ---- */
      borderRadius: {
        card: '0.75rem', // 12px
        input: '0.75rem', // 12px (unificado com card)
        pill: '9999px',
        micro: '0.375rem', // 6px (badges, checkbox frames, tooltips)
      },

      /* ---- Elevation tiers (DESIGN.md) ---- */
      boxShadow: {
        'tier-0': 'none',
        'tier-1': '0 8px 24px rgba(0, 0, 0, 0.35)',
        'tier-2':
          '0 16px 36px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(51, 65, 85, 0.8)',
        /* legacy alias — mantém compatibilidade com etapas anteriores */
        card: '0 8px 24px rgba(0, 0, 0, 0.35)',
        /* hover dos cards interativos */
        glow: '0 0 0 1px rgba(16, 185, 129, 0.4), 0 8px 24px rgba(16, 185, 129, 0.08)',
        /* focus ring do DESIGN.md — 3px emerald translúcido */
        focus: '0 0 0 3px rgba(16, 185, 129, 0.2)',
      },

      /* ---- Spacing (mantém 8px grid + adiciona gutter/margin) ---- */
      spacing: {
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '2rem',
        'margin-mobile': '1rem',
      },

      /* ---- Z-index ---- */
      zIndex: {
        toast: '50',
        modal: '100',
      },

      /* ---- Fontes ---- */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      /* ---- Tipografia nomeada (DESIGN.md) ---- */
      fontSize: {
        'display-lg': [
          '48px',
          { lineHeight: '56px', fontWeight: '800', letterSpacing: '-0.025em' },
        ],
        'display-lg-mobile': [
          '36px',
          { lineHeight: '44px', fontWeight: '800', letterSpacing: '-0.02em' },
        ],
        'headline-xl': [
          '32px',
          { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
        'headline-xl-mobile': [
          '26px',
          { lineHeight: '34px', fontWeight: '700', letterSpacing: '-0.015em' },
        ],
        'headline-lg': [
          '24px',
          { lineHeight: '32px', fontWeight: '600', letterSpacing: '-0.015em' },
        ],
        'headline-md': [
          '20px',
          { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        'headline-sm': [
          '16px',
          { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.005em' },
        ],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '0.005em' }],
        'mono-metric-lg': [
          '28px',
          { lineHeight: '36px', fontWeight: '700', letterSpacing: '-0.03em' },
        ],
        'mono-metric-md': [
          '18px',
          { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        'mono-body': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'mono-label': [
          '11px',
          { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.04em' },
        ],
      },

      /* ---- Background grid (DESIGN.md) ---- */
      backgroundImage: {
        'grid-dark':
          'linear-gradient(to right, rgba(30, 41, 59, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.35) 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-cell': '32px 32px',
      },

      /* ---- Animações extras ---- */
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;