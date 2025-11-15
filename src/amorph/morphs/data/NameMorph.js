/**
 * 🏷️ NAME MORPH
 * 
 * Atomic Morph für Namen (Common Name oder Latin Name)
 * 
 * Usage:
 * <name-morph value="Shiitake" variant="common" size="large"></name-morph>
 * <name-morph value="Lentinula edodes" variant="latin" size="medium"></name-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';
import { globalStyles } from '../../arch/styles/tokens.js';

export class NameMorph extends LitElement {
  static properties = {
    value: { type: String },
    variant: { type: String },  // 'common' | 'latin' | 'both'
    size: { type: String }       // 'small' | 'medium' | 'large'
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
      }
      
      .name {
        font-family: var(--font-sans);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-light);
        transition: var(--transition-base);
        line-height: var(--line-height-normal);
      }
      
      .name.small { font-size: var(--font-size-sm); }
      .name.medium { font-size: var(--font-size-lg); }
      .name.large { font-size: var(--font-size-2xl); }
      
      .name.latin {
        font-style: italic;
        opacity: 0.7;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-sm);
      }
      
      .name.common {
        font-weight: var(--font-weight-semibold);
      }
      
      @media (prefers-color-scheme: dark) {
        .name {
          color: var(--color-text-dark);
        }
      }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.variant = 'common';
    this.size = 'medium';
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'name';
    this.dataset.morphId = this.id || `name-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Safety Check: Registriere nur wenn amorph verfügbar
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
  
  render() {
    return html`
      <div 
        class="name ${this.size} ${this.variant}"
        data-name="${this.value}"
      >
        ${this.value}
      </div>
    `;
  }
}

customElements.define('name-morph', NameMorph);
