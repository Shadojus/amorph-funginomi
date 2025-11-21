/**
 * 🎨 AMORPH DESIGN TOKENS
 * 
 * Shared CSS für alle Lit Morphs via adoptedStyleSheets
 * 
 * Usage in Morph:
 * import { globalStyles } from './tokens.js';
 * static styles = [globalStyles, css`...component styles...`];
 */

import { css } from 'lit';

export const globalStyles = css`
  /* ====================================
     🎨 DESIGN TOKENS
     ==================================== */
  
  :host {
    /* Colors - 12 Perspektiven */
    --color-culinary: #22c55e;
    --color-medicinal: #ef4444;
    --color-cultivation: #f59e0b;
    --color-safety: #dc2626;
    --color-ecology: #10b981;
    --color-morphology: #8b5cf6;
    --color-biochemistry: #06b6d4;
    --color-cultural: #ec4899;
    --color-commercial: #f97316;
    --color-legal: #64748b;
    --color-research: #0ea5e9;
    --color-sustainability: #84cc16;
    
    /* Neutral Colors */
    --color-bg-light: #ffffff;
    --color-bg-dark: #0f172a;
    --color-text-light: #1a1a2e;
    --color-text-dark: #f1f5f9;
    --color-text-muted: #64748b;
    --color-border: rgba(255, 255, 255, 0.1);
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    
    /* Typography */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
    
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.2;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --shadow-glow: 0 0 20px rgba(34, 197, 94, 0.5);
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 350ms ease;
    
    /* Z-Index */
    --z-base: 1;
    --z-elevated: 10;
    --z-overlay: 100;
    --z-modal: 1000;
    --z-toast: 10000;
  }
  
  /* ====================================
     🌓 DARK MODE
     ==================================== */
  
  @media (prefers-color-scheme: dark) {
    :host {
      --color-bg: var(--color-bg-dark);
      --color-text: var(--color-text-dark);
    }
  }
  
  /* ====================================
     🧩 UTILITY CLASSES
     ==================================== */
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

/**
 * 🎨 PERSPECTIVE COLOR MAP
 * 
 * Zum einfachen Zugriff auf Perspektiven-Farben in JS
 */
export const perspectiveColors = {
  culinaryAndNutritional: '#22c55e',
  medicinalProperties: '#ef4444',
  cultivation: '#f59e0b',
  safetyAndToxicity: '#dc2626',
  ecologyAndHabitat: '#10b981',
  morphology: '#8b5cf6',
  biochemistry: '#06b6d4',
  cultural: '#ec4899',
  commercial: '#f97316',
  legal: '#64748b',
  research: '#0ea5e9',
  sustainability: '#84cc16'
};

/**
 * 🎨 PERSPECTIVE ICONS
 */
export const perspectiveIcons = {
  culinaryAndNutritional: '🍳',
  medicinalProperties: '💊',
  cultivation: '🌱',
  safetyAndToxicity: '⚠️',
  ecologyAndHabitat: '🌍',
  morphology: '🔬',
  biochemistry: '🧪',
  cultural: '🎭',
  commercial: '💰',
  legal: '⚖️',
  research: '📚',
  sustainability: '♻️'
};
