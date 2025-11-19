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
import { globalStyles } from '../../styles/tokens.js';

export class TagMorph extends LitElement {
  static properties = {
    value: { type: String },
    variant: { type: String },  // 'pill' | 'badge' | 'chip'
    color: { type: String },
    clickable: { type: Boolean }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: inline-block;
      }
      
      .tag {
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-full);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        transition: var(--transition-base);
      border: 1.5px solid currentColor;
      background: transparent;
      color: #667eea;
      display: inline-block;
      white-space: nowrap;
      user-select: none;
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
    // Don't render if value is empty
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

customElements.define('tag-morph', TagMorph);
