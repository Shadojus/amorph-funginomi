/**
 * 🏷️ TAG MORPH
 * 
 * Atomic Morph für einzelne Tags
 * Clickable - Dispatched 'tag-click' Event
 * 
 * Usage:
 * <tag-morph 
 *   value="edible" 
 *   variant="pill" 
 *   color="#22c55e"
 *   clickable
 * ></tag-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from './tokens.js';

export class TagMorph extends LitElement {
  static properties = {
    value: { type: String },
    tags: { type: Array },  // NEW: Support for multiple tags
    variant: { type: String },  // 'pill' | 'badge' | 'chip'
    color: { type: String },
    clickable: { type: Boolean }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-width: 100%;
      }
      
      .tag {
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.8125rem;
        font-weight: var(--font-weight-medium);
        transition: var(--transition-base);
        border: 1.5px solid currentColor;
        background: transparent;
        color: #667eea;
        display: inline-block;
        white-space: nowrap;
        user-select: none;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .tag.clickable {
      cursor: pointer;
    }
    
    .tag.clickable:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    .tag.clickable:active {
      transform: translateY(0);
    }
    
    /* Badge Variant */
    .tag.badge {
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Chip Variant */
    .tag.chip {
      border-radius: 24px;
      padding: 8px 16px;
      font-size: 14px;
      border-width: 2px;
    }
    
    @media (prefers-color-scheme: dark) {
      .tag {
        color: #8b9dff;
      }
      .tag.clickable:hover {
        background: rgba(139, 157, 255, 0.15);
      }
    }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.tags = null;
    this.variant = 'pill';
    this.color = 'auto';
    this.clickable = true;
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'tag';
    this.dataset.morphId = this.id || `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.dataset.tags = this.value;
    
    // Safety Check
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.registerMorph(this);
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.unregisterMorph(this);
    }
  }
  
  handleClick(e) {
    if (this.clickable) {
      // Dispatch Custom Event
      this.dispatchEvent(new CustomEvent('tag-click', {
        detail: { tag: this.value, color: this.color },
        bubbles: true,
        composed: true
      }));
      
      // Auch direkt an amorph melden
      amorph.emit('tag:clicked', { 
        tag: this.value, 
        color: this.color,
        element: e.target 
      });
    }
  }

  handleTagClick(tag) {
    if (this.clickable) {
      // Dispatch Custom Event for individual tag in array
      this.dispatchEvent(new CustomEvent('tag-click', {
        detail: { tag, color: this.color },
        bubbles: true,
        composed: true
      }));
      
      // Auch direkt an amorph melden
      amorph.emit('tag:clicked', { 
        tag, 
        color: this.color
      });
    }
  }
  
  getColorStyle() {
    if (this.color && this.color !== 'auto') {
      return `
        background: ${this.color}22;
        border-color: ${this.color}88;
        color: ${this.color};
      `;
    }
    return '';
  }
  
  render() {
    // Multiple tags (array)
    if (this.tags && Array.isArray(this.tags) && this.tags.length > 0) {
      return html`
        <div class="tags-container">
          ${this.tags.map(tag => html`
            <span 
              class="tag ${this.variant} ${this.clickable ? 'clickable' : ''}"
              style="${this.getColorStyle()}"
              @click="${() => this.handleTagClick(tag)}"
            >
              ${tag}
            </span>
          `)}
        </div>
      `;
    }
    
    // Single tag (string)
    if (!this.value || this.value.trim().length === 0) {
      return html``;
    }
    
    return html`
      <span 
        class="tag ${this.variant} ${this.clickable ? 'clickable' : ''}"
        style="${this.getColorStyle()}"
        @click="${this.handleClick}"
      >
        ${this.value}
      </span>
    `;
  }
}

// Safe registration - skip if already defined by detail-view
if (!customElements.get('tag-morph')) {
  customElements.define('tag-morph', TagMorph);
}
