/**
 * 🔮 PERSPECTIVE HOST
 * ===================
 * 
 * Host für eine einzelne Perspektive mit ihren Morphs
 * Wird dynamisch angezeigt/versteckt basierend auf aktiver Perspektive
 * 
 * Usage:
 * <perspective-host 
 *   perspective="culinaryAndNutritional"
 *   title="Culinary & Nutritional"
 *   icon="🍳"
 *   color="#22c55e"
 * >
 *   <!-- Morphs hier -->
 * </perspective-host>
 */

import { LitElement, html, css } from 'lit';

export class PerspectiveHost extends LitElement {
  static properties = {
    perspective: { type: String },
    title: { type: String },
    icon: { type: String },
    color: { type: String },
    active: { type: Boolean, reflect: true },
    data: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    :host([active]) {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    :host(:not([active])) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      visibility: hidden;
    }

    .perspective-container {
      background: rgba(255, 255, 255, 0.03);
      border-left: 4px solid var(--perspective-color, #8b5cf6);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(5px);
    }

    .perspective-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .perspective-icon {
      font-size: 2rem;
      line-height: 1;
    }

    .perspective-title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--perspective-color, white);
      margin: 0;
    }

    .morphs-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .morph-wrapper {
      background: rgba(255, 255, 255, 0.03);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .morph-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-style: italic;
    }

    @media (max-width: 768px) {
      .perspective-container {
        padding: 1.5rem;
      }

      .morphs-container {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();
    this.perspective = '';
    this.title = '';
    this.icon = '';
    this.color = '#8b5cf6';
    this.active = false;
    this.data = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Bind handler once
    this._boundHandler = this.handlePerspectiveChange.bind(this);
    
    // Listen for perspective changes on multiple targets
    window.addEventListener('perspective-changed', this._boundHandler);
    document.addEventListener('perspective-changed', this._boundHandler);
    
    // Register with AMORPH system
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.registerHost?.(this);
    }
    
    console.log(`[PerspectiveHost] ${this.perspective} connected, active: ${this.active}`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove listeners
    if (this._boundHandler) {
      window.removeEventListener('perspective-changed', this._boundHandler);
      document.removeEventListener('perspective-changed', this._boundHandler);
    }
    
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.unregisterHost?.(this);
    }
  }

  handlePerspectiveChange(event) {
    const rawPerspectives = event.detail?.perspectives || [];
    
    // Normalize: handle both string IDs and perspective objects with .name property
    const activePerspectives = rawPerspectives.map(p => {
      if (typeof p === 'string') return p;
      if (typeof p === 'object' && p.name) return p.name;
      if (typeof p === 'object' && p.id) return p.id;
      return null;
    }).filter(Boolean);
    
    const wasActive = this.active;
    this.active = activePerspectives.includes(this.perspective);
    
    if (wasActive !== this.active) {
      console.log(`[PerspectiveHost] ${this.perspective} ${this.active ? 'ACTIVATED' : 'DEACTIVATED'}`);
    }
  }

  render() {
    return html`
      <div 
        class="perspective-container"
        style="--perspective-color: ${this.color}"
        data-perspective="${this.perspective}"
      >
        <div class="perspective-header">
          <span class="perspective-icon">${this.icon}</span>
          <h3 class="perspective-title">${this.title}</h3>
        </div>
        
        <div class="morphs-container">
          <slot></slot>
        </div>
        
        ${!this.hasContent() ? html`
          <div class="empty-state">
            No data available for this perspective
          </div>
        ` : ''}
      </div>
    `;
  }

  hasContent() {
    // Check if slot has any children
    const slot = this.shadowRoot?.querySelector('slot');
    const assignedNodes = slot?.assignedNodes() || [];
    return assignedNodes.filter(node => node.nodeType === Node.ELEMENT_NODE).length > 0;
  }
}

customElements.define('perspective-host', PerspectiveHost);
