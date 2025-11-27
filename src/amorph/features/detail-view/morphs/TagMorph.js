/**
 * 🏷️ TAG MORPH (Detail View)
 * 
 * Pill-style tag display for arrays of strings or single values
 * Clickable tags dispatch 'tag-click' events
 * 
 * Usage:
 * <tag-morph 
 *   tags='["edible", "choice", "medicinal"]'
 *   variant="pill" 
 *   clickable
 * ></tag-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class TagMorph extends LitElement {
  static properties = {
    value: { type: String },
    tags: { type: Array },
    variant: { type: String },  // 'pill' | 'badge' | 'chip'
    color: { type: String },
    clickable: { type: Boolean },
    label: { type: String }
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

      .tag-container {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .tag-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .tags-wrapper {
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
        color: var(--tag-color, #667eea);
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
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.tags = null;
    this.variant = 'pill';
    this.color = '';
    this.clickable = true;
    this.label = '';
  }

  /**
   * Unwrap citedValue wrapper if present
   */
  unwrapCitedValue(value) {
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  }
  
  handleClick(tag) {
    if (this.clickable) {
      this.dispatchEvent(new CustomEvent('tag-click', {
        detail: { tag, color: this.color },
        bubbles: true,
        composed: true
      }));
    }
  }

  getTags() {
    // Support tags array
    if (this.tags) {
      const unwrapped = this.unwrapCitedValue(this.tags);
      if (Array.isArray(unwrapped)) {
        return unwrapped.filter(t => t != null);
      }
      if (typeof unwrapped === 'string') {
        return [unwrapped];
      }
    }
    // Support single value
    if (this.value) {
      const unwrapped = this.unwrapCitedValue(this.value);
      if (Array.isArray(unwrapped)) {
        return unwrapped.filter(t => t != null);
      }
      return [unwrapped];
    }
    return [];
  }
  
  render() {
    const tags = this.getTags();
    
    if (tags.length === 0) {
      return html``;
    }

    const colorStyle = this.color ? `--tag-color: ${this.color}` : '';

    return html`
      <div class="tag-container" style="${colorStyle}">
        ${this.label ? html`<div class="tag-label">${this.label}</div>` : ''}
        <div class="tags-wrapper">
          ${tags.map(tag => html`
            <span 
              class="tag ${this.variant} ${this.clickable ? 'clickable' : ''}"
              @click=${() => this.handleClick(tag)}
            >${tag}</span>
          `)}
        </div>
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('tag-morph')) {
  customElements.define('tag-morph', TagMorph);
}
