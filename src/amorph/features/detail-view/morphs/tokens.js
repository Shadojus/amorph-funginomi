/**
 * 🎨 DETAIL VIEW DESIGN TOKENS
 * 
 * Shared CSS für alle Lit Morphs in Detail View
 * Adapted from grid-view tokens with detail-page specific enhancements
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
    
    /* Detail View Specific */
    --detail-card-bg: rgba(0, 0, 0, 0.3);
    --detail-card-border: rgba(255, 255, 255, 0.1);
    --detail-section-gap: 1rem;
  }
  
  /* ====================================
     🌓 DARK MODE (Default for Detail View)
     ==================================== */
  
  :host {
    color-scheme: dark;
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* ====================================
     🔍 SEARCH HIGHLIGHT
     ==================================== */
  
  :host(.search-highlight-morph) {
    position: relative;
    z-index: 50;
  }
  
  :host(.search-highlight-morph)::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px solid rgba(255, 215, 0, 0.6);
    border-radius: inherit;
    pointer-events: none;
    animation: highlightPulse 2s ease-in-out infinite;
  }
  
  @keyframes highlightPulse {
    0%, 100% {
      border-color: rgba(255, 215, 0, 0.4);
      box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
    }
    50% {
      border-color: rgba(255, 215, 0, 0.8);
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.4);
    }
  }
`;

/**
 * Perspective color mapping for dynamic styling
 */
export const perspectiveColors = {
  culinary: '#22c55e',
  medicinal: '#ef4444',
  cultivation: '#f59e0b',
  safety: '#dc2626',
  ecology: '#10b981',
  ecologyAndDistribution: '#10b981',
  morphology: '#8b5cf6',
  biochemistry: '#06b6d4',
  chemicalUniverse: '#06b6d4',
  cultural: '#ec4899',
  commercial: '#f97316',
  legal: '#64748b',
  research: '#0ea5e9',
  sustainability: '#84cc16'
};

/**
 * Get perspective color by ID
 */
export function getPerspectiveColor(perspectiveId) {
  return perspectiveColors[perspectiveId] || 'rgba(255, 255, 255, 0.5)';
}
