/**
 * 🏷️ TAG MORPH (Detail View) v2.0
 * 
 * Premium pill-style tag display with glassmorphism and animations.
 * Clickable tags dispatch 'tag-click' events for filtering.
 * 
 * Features:
 * - Glassmorphism backgrounds with subtle glow
 * - Hover animations with lift effect
 * - Perspective color inheritance
 * - Multiple variants: pill, badge, chip
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
        --tag-color: var(--perspective-color, rgba(139, 92, 246, 0.8));
      }

      /* Minimal container - no extra box styling */
      .tag-container {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .tag-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .tags-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-width: 100%;
      }
      
      /* ===== BASE TAG STYLE ===== */
      .tag {
        padding: 0.4rem 0.875rem;
        border-radius: 9999px;
        font-size: 0.8125rem;
        font-weight: 600;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1.5px solid var(--tag-color, rgba(139, 92, 246, 0.4));
        background: rgba(139, 92, 246, 0.12);
        color: rgba(196, 181, 253, 0.95);
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
        user-select: none;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        box-shadow: 0 0 0 rgba(139, 92, 246, 0);
      }
    
      .tag.clickable {
        cursor: pointer;
      }
    
      .tag.clickable:hover {
        background: rgba(139, 92, 246, 0.22);
        border-color: var(--tag-color, rgba(139, 92, 246, 0.6));
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.25),
                    0 0 8px var(--tag-color, rgba(139, 92, 246, 0.2));
      }
    
      .tag.clickable:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
      }
    
      /* ===== BADGE VARIANT ===== */
      .tag.badge {
        border-radius: 5px;
        padding: 0.3rem 0.625rem;
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
        background: rgba(139, 92, 246, 0.18);
      }
    
      /* ===== CHIP VARIANT ===== */
      .tag.chip {
        border-radius: 9999px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-width: 2px;
        background: rgba(139, 92, 246, 0.15);
      }

      .tag.chip:hover {
        background: rgba(139, 92, 246, 0.25);
      }

      /* ===== EMPTY STATE ===== */
      .empty-state {
        color: rgba(255, 255, 255, 0.35);
        font-style: italic;
        font-size: 0.8125rem;
        padding: 0.5rem;
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
      return html`<div class="empty-state">—</div>`;
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

// Register with detail- prefix for detail pages
customElements.define('detail-tag-morph', TagMorph);
