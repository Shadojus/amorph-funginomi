/**
 * 🔲 GRID HOST
 * ============
 * 
 * Host component for displaying morphs in a grid layout
 * Simple wrapper that renders morphs in a responsive grid
 * 
 * Usage:
 * <grid-host></grid-host>
 * 
 * Props:
 * - columns: Grid columns (default: auto-fill)
 * - gap: Gap between items (default: 2rem)
 * - min-width: Minimum card width (default: 320px)
 */

import { LitElement, html, css } from 'lit';

class GridHost extends LitElement {
  static properties = {
    columns: { type: String },
    gap: { type: String },
    minWidth: { type: String, attribute: 'min-width' },
    morphs: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .grid-container {
      display: grid;
      grid-template-columns: var(--grid-columns, repeat(auto-fill, minmax(var(--grid-min-width, 320px), 1fr)));
      gap: var(--grid-gap, 2rem);
      width: 100%;
    }

    .grid-item {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .grid-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .grid-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.5rem;
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      .grid-item {
        background: rgba(30, 30, 30, 0.9);
        color: rgba(255, 255, 255, 0.9);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .grid-item {
        padding: 1rem;
      }
    }
  `;

  constructor() {
    super();
    this.columns = 'auto-fill';
    this.gap = '2rem';
    this.minWidth = '320px';
    this.morphs = [];
    this.amorph = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH instance
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
      
      // Auto-collect morphs from AMORPH system
      this.loadMorphs();
      
      // Listen for new morphs
      this.amorph.on('morph:created', () => {
        this.loadMorphs();
      });
    }

    console.log('[GridHost] Connected');
  }

  /**
   * Load morphs from AMORPH system
   */
  loadMorphs() {
    if (!this.amorph) return;
    
    const allMorphs = this.amorph.getAllMorphs();
    
    // Group morphs by parent/context
    const grouped = this.groupMorphs(allMorphs);
    this.morphs = grouped;
    
    this.requestUpdate();
    console.log(`[GridHost] Loaded ${this.morphs.length} items`);
  }

  /**
   * Group morphs that belong together
   * (e.g., all morphs for one fungus)
   */
  groupMorphs(morphs) {
    const groups = new Map();
    
    morphs.forEach(morph => {
      // Try to find parent element or use morph itself
      const parent = morph.closest('article, .fungus-card, [data-item]') || morph;
      const key = parent.id || parent.dataset?.id || `group-${groups.size}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          element: parent,
          morphs: []
        });
      }
      
      groups.get(key).morphs.push(morph);
    });
    
    return Array.from(groups.values());
  }

  /**
   * Set grid style properties
   */
  updated(changedProperties) {
    if (changedProperties.has('columns') || 
        changedProperties.has('gap') || 
        changedProperties.has('minWidth')) {
      this.style.setProperty('--grid-columns', 
        this.columns === 'auto-fill' 
          ? `repeat(auto-fill, minmax(${this.minWidth}, 1fr))` 
          : this.columns
      );
      this.style.setProperty('--grid-gap', this.gap);
      this.style.setProperty('--grid-min-width', this.minWidth);
    }
  }

  render() {
    return html`
      <div class="grid-container">
        ${this.morphs.length > 0 ? this.morphs.map(group => html`
          <div class="grid-item" data-group="${group.key}">
            <slot name="${group.key}"></slot>
          </div>
        `) : html`
          <div class="grid-empty">
            🔲 No items to display
          </div>
        `}
      </div>
    `;
  }
}

// Register custom element
customElements.define('grid-host', GridHost);

// Auto-register with AMORPH system
if (typeof window !== 'undefined' && window.amorph) {
  console.log('[GridHost] Registered');
}

export default GridHost;
