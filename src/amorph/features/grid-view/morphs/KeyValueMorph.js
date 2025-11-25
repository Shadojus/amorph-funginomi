/**
 * 🔑 KEY-VALUE MORPH - Datengetrieben
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
    data: { type: Object }
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

      .kv-value.number {
        font-variant-numeric: tabular-nums;
      }
    `
  ];

  constructor() {
    super();
    this.data = {};
  }

  formatKey(key) {
    // camelCase → Readable Text
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  isRangeObject(value) {
    return typeof value === 'object' && value !== null && 
           'min' in value && 'max' in value && 
           typeof value.min === 'number' && typeof value.max === 'number';
  }

  formatValue(value) {
    if (typeof value === 'boolean') {
      return value ? '✓ Yes' : '✗ No';
    }
    if (value === null || value === undefined) {
      return '—';
    }
    // Range-Objekte: Zeige als "min–max unit"
    if (this.isRangeObject(value)) {
      const { min, max, optimal, unit } = value;
      let text = `${min}–${max}`;
      if (optimal !== undefined) text += ` (⊙${optimal})`;
      if (unit) text += ` ${unit}`;
      return text;
    }
    return String(value);
  }

  getValueClass(value) {
    const type = typeof value;
    if (this.isRangeObject(value)) return 'kv-value range';
    return `kv-value ${type}`;
  }

  render() {
    if (!this.data || typeof this.data !== 'object') {
      return html``;
    }

    const entries = Object.entries(this.data).filter(([_, value]) => {
      // Primitive Werte ODER Range-Objekte
      return typeof value !== 'object' || value === null || this.isRangeObject(value);
    });

    if (entries.length === 0) {
      return html``;
    }

    return html`
      <div class="kv-grid">
        ${entries.map(([key, value]) => html`
          <div class="kv-key">${this.formatKey(key)}</div>
          <div class="${this.getValueClass(value)}">
            ${this.formatValue(value)}
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('key-value-morph', KeyValueMorph);
