/**
 * 🔑 KEY-VALUE MORPH (Detail View)
 * 
 * Kompakte 2-Spalten Darstellung für Objekte mit wenigen Feldern
 * REIN DATENGETRIEBEN - Zeigt jedes Objekt als Key-Value Grid
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

      .kv-container {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .kv-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.5rem;
      }

      .kv-grid {
        display: grid;
        grid-template-columns: minmax(80px, auto) 1fr;
        gap: 0.375rem 0.75rem;
        font-size: 0.875rem;
        width: 100%;
        max-width: 100%;
      }

      .kv-key {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kv-value {
        color: rgba(255, 255, 255, 0.95);
        font-weight: 600;
        word-wrap: break-word;
        overflow-wrap: break-word;
        font-size: 0.875rem;
      }

      .kv-value.boolean {
        color: var(--color-culinary);
      }

      .kv-value.boolean.false {
        color: rgba(255, 255, 255, 0.4);
      }

      .kv-value.number {
        font-variant-numeric: tabular-nums;
        color: var(--color-biochemistry);
      }

      .kv-value.range {
        color: var(--color-ecology);
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
      return html``;
    }

    // Unwrap the data if it's a citedValue
    const data = this.unwrapCitedValue(this.data);
    if (!data || typeof data !== 'object') {
      return html``;
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
      return html``;
    }

    return html`
      <div class="kv-container">
        ${this.label ? html`<div class="kv-label">${this.label}</div>` : ''}
        <div class="kv-grid">
          ${entries.map(([key, value]) => html`
            <div class="kv-key">${this.formatKey(key)}</div>
            <div class="${this.getValueClass(value)}">
              ${this.formatValue(value)}
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('key-value-morph')) {
  customElements.define('key-value-morph', KeyValueMorph);
}
