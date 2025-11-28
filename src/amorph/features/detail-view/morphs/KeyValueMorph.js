/**
 * 🔑 KEY-VALUE MORPH (Detail View) v2.0
 * 
 * Premium 2-column grid display for object data.
 * Shows key-value pairs with type-specific styling.
 * 
 * Features:
 * - Glassmorphism container with hover effects
 * - Color-coded values (boolean green/red, numbers purple)
 * - Range object support with formatted display
 * - Responsive grid layout
 * 
 * Input: { habitat: "forest", season: "autumn", edibility: "edible" }
 * Output: Kompaktes Grid mit Labels und Werten
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class KeyValueMorph extends LitElement {
  static properties = {
    data: { type: Object },
    label: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      /* Minimal container */
      .kv-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .kv-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.25rem;
      }

      .kv-grid {
        display: grid;
        grid-template-columns: minmax(90px, auto) 1fr;
        gap: 0.375rem 1rem;
        font-size: 0.875rem;
        width: 100%;
        max-width: 100%;
      }

      .kv-row {
        display: contents;
      }

      .kv-row:hover .kv-key,
      .kv-row:hover .kv-value {
        opacity: 1;
      }

      .kv-key {
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0.25rem 0;
        transition: opacity 0.2s ease;
      }

      .kv-value {
        color: rgba(255, 255, 255, 0.92);
        font-weight: 600;
        word-wrap: break-word;
        overflow-wrap: break-word;
        font-size: 0.875rem;
        padding: 0.25rem 0;
        transition: opacity 0.2s ease;
      }

      /* Boolean values with badges */
      .kv-value.boolean {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #4ade80;
        width: fit-content;
      }

      .kv-value.boolean.false {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.2);
        color: rgba(248, 113, 113, 0.9);
      }

      /* Number values with purple styling */
      .kv-value.number {
        font-variant-numeric: tabular-nums;
        color: #818cf8;
        font-weight: 700;
        text-shadow: 0 0 12px rgba(129, 140, 248, 0.3);
      }

      /* Range values with eco color */
      .kv-value.range {
        color: #4ade80;
        font-variant-numeric: tabular-nums;
      }

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
    this.data = {};
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

  formatKey(key) {
    // camelCase → Readable Text
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  isRangeObject(value) {
    return typeof value === 'object' && value !== null && 
           'min' in value && 'max' in value && 
           typeof value.min === 'number' && typeof value.max === 'number';
  }

  formatValue(value) {
    const unwrapped = this.unwrapCitedValue(value);
    
    if (typeof unwrapped === 'boolean') {
      return unwrapped ? '✓ Yes' : '✗ No';
    }
    if (unwrapped === null || unwrapped === undefined) {
      return '—';
    }
    // Range-Objekte: Zeige als "min–max unit"
    if (this.isRangeObject(unwrapped)) {
      const { min, max, optimal, unit } = unwrapped;
      let text = `${min}–${max}`;
      if (optimal !== undefined) text += ` (⊙${optimal})`;
      if (unit) text += ` ${unit}`;
      return text;
    }
    // Arrays
    if (Array.isArray(unwrapped)) {
      return unwrapped.join(', ');
    }
    return String(unwrapped);
  }

  getValueClass(value) {
    const unwrapped = this.unwrapCitedValue(value);
    const type = typeof unwrapped;
    if (this.isRangeObject(unwrapped)) return 'kv-value range';
    if (type === 'boolean') return `kv-value boolean ${unwrapped ? '' : 'false'}`;
    return `kv-value ${type}`;
  }

  render() {
    if (!this.data || typeof this.data !== 'object') {
      return html`<div class="empty-state">—</div>`;
    }

    // Unwrap the data if it's a citedValue
    const data = this.unwrapCitedValue(this.data);
    if (!data || typeof data !== 'object') {
      return html`<div class="empty-state">—</div>`;
    }

    const entries = Object.entries(data).filter(([_, value]) => {
      const unwrapped = this.unwrapCitedValue(value);
      // Primitive Werte, Arrays ODER Range-Objekte
      return typeof unwrapped !== 'object' || 
             unwrapped === null || 
             Array.isArray(unwrapped) ||
             this.isRangeObject(unwrapped);
    });

    if (entries.length === 0) {
      return html`<div class="empty-state">No data</div>`;
    }

    return html`
      <div class="kv-container">
        ${this.label ? html`<div class="kv-label">${this.label}</div>` : ''}
        <div class="kv-grid">
          ${entries.map(([key, value]) => html`
            <div class="kv-row">
              <div class="kv-key">${this.formatKey(key)}</div>
              <div class="${this.getValueClass(value)}">
                ${this.formatValue(value)}
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

// Register with detail- prefix for detail pages
customElements.define('detail-keyvalue-morph', KeyValueMorph);
