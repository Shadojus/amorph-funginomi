/**
 * 📋 LIST MORPH
 * =============
 * 
 * Atomic Morph für Array-Daten mit Pills Design
 * Perfect for: substrates, habitats, seasons, medicinal uses, etc.
 * 
 * Usage:
 * <list-morph 
 *   items='["oak", "beech", "birch"]'
 *   label="Substrates"
 *   max-items="5"
 *   color="#667eea"
 * ></list-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from './tokens.js';

export class ListMorph extends LitElement {
  static properties = {
    items: { type: Array },
    label: { type: String },
    maxItems: { type: Number, attribute: 'max-items' },
    color: { type: String },
    compact: { type: Boolean },
    perspectives: { type: Array }
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

      .list-container {
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s ease;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }

    .list-container:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .label {
      font-size: 0.6875rem;
      color: rgba(255, 255, 255, 0.55);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
      margin-bottom: 0.625rem;
      display: block;
    }

    .items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      width: 100%;
      max-width: 100%;
    }

    .item {
      padding: 0.375rem 0.75rem;
      border-radius: 16px;
      background: rgba(102, 126, 234, 0.1);
      border: 1.5px solid rgba(102, 126, 234, 0.25);
      color: #8b9dff;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s ease;
      user-select: none;
      max-width: 100%;
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.3;
    }

    .item:hover {
      background: rgba(102, 126, 234, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }

    .compact .item {
      padding: 0.3rem 0.625rem;
      font-size: 0.75rem;
      border-radius: 14px;
    }

    .more-indicator {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1.5px dashed rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .empty-state {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.875rem;
      font-style: italic;
    }

    @media (prefers-color-scheme: dark) {
      .list-container {
        background: rgba(255, 255, 255, 0.02);
      }
    }
    `
  ];

  constructor() {
    super();
    this.items = [];
    this.label = '';
    this.maxItems = null;
    this.color = '#667eea';
    this.compact = false;
    this.perspectives = [];
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('items') && typeof this.items === 'string') {
      try {
        this.items = JSON.parse(this.items);
      } catch (e) {
        console.warn('Failed to parse items:', e);
        this.items = [];
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'list';
    this.dataset.morphId = this.id || `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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

  getDisplayItems() {
    if (!this.maxItems) return this.items;
    return this.items.slice(0, this.maxItems);
  }

  hasMoreItems() {
    return this.maxItems && this.items.length > this.maxItems;
  }

  getRemainingCount() {
    return this.items.length - this.maxItems;
  }

  renderItem(item) {
    // Primitive Werte (Strings, Numbers, Booleans)
    if (typeof item !== 'object' || item === null) {
      return html`${String(item)}`;
    }
    
    // Objekte: Zeige wichtigste Felder
    // z.B. { name: "Cordycepin", class: "...", concentration: {...} }
    const nameField = item.name || item.species || item.title || item.label;
    if (nameField) {
      return html`<strong>${nameField}</strong>`;
    }
    
    // Fallback: Erstes Feld
    const firstKey = Object.keys(item)[0];
    return html`${String(item[firstKey])}`;
  }

  render() {
    if (!this.items || this.items.length === 0) {
      return html`
        <div class="list-container">
          ${this.label ? html`<div class="label">${this.label}</div>` : ''}
          <div class="empty-state">No items</div>
        </div>
      `;
    }

    return html`
      <div class="list-container ${this.compact ? 'compact' : ''}">
        ${this.label ? html`<div class="label">${this.label}</div>` : ''}
        
        <div class="items">
          ${this.getDisplayItems().map(item => html`
            <span 
              class="item"
              style="
                background: ${this.color}1a;
                border-color: ${this.color}44;
                color: ${this.color};
              "
            >
              ${this.renderItem(item)}
            </span>
          `)}
          
          ${this.hasMoreItems() ? html`
            <span class="more-indicator">
              +${this.getRemainingCount()} more
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('list-morph', ListMorph);
