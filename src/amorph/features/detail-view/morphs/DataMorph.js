/**
 * 🔮 DATA MORPH (Detail View)
 * ===========================
 * 
 * Smart morph that renders perspective data with automatic type detection.
 * Recursively renders nested objects using appropriate sub-morphs.
 * 
 * Features:
 * - Auto-detects data type (string, array, object, range, etc.)
 * - Unwraps citedValue wrappers automatically
 * - Inherits perspective color from parent
 * - Uses sub-morphs for complex data types
 * 
 * Usage:
 * <data-morph
 *   entity-data={JSON.stringify(entityData)}
 *   field="edibility"
 *   perspective="culinary"
 * ></data-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class DataMorph extends LitElement {
  static properties = {
    entityData: { type: Object },
    field: { type: String },
    mode: { type: String }, // 'simple' (default) or 'deep' (recursive rendering)
    perspective: { type: String },
    currentData: { type: Object },
    label: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        max-width: 100%;
        overflow: hidden;
        --perspective-color: var(--perspective-color, rgba(255, 255, 255, 0.5));
      }
      
      .data-container {
        background: transparent;
        padding: 0.375rem 0.5rem 0.375rem 0;
        margin-bottom: 0.5rem;
        border-left: 3px solid var(--perspective-color, rgba(255, 255, 255, 0.15));
        padding-left: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
        position: relative;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        container-type: inline-size;
        container-name: datamorph;
      }

      .data-container:hover {
        border-left-width: 4px;
        padding-left: 0.625rem;
      }

      .data-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.375rem;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      .data-value {
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.4;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
      }

      .data-value.text {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.9);
      }

      .data-value.tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        line-height: 1.2;
      }

      .tag {
        padding: 0.3125rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        background: rgba(100, 120, 200, 0.15);
        color: rgba(180, 190, 255, 0.95);
        border: 1px solid rgba(100, 120, 200, 0.25);
        border-radius: 4px;
        display: inline-block;
      }

      .nested-fields-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem 0.625rem;
        margin-top: 0.5rem;
        align-items: start;
        container-type: inline-size;
        container-name: nestedgrid;
      }
      
      @container nestedgrid (max-width: 280px) {
        .nested-fields-grid {
          grid-template-columns: 1fr;
          gap: 0.375rem;
        }
      }

      .nested-field {
        padding: 0.5rem 0.625rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .nested-field.wide {
        grid-column: 1 / -1;
      }

      .nested-label {
        font-size: 0.625rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.25rem;
      }

      .nested-value {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .boolean-value {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .boolean-value.true {
        color: var(--color-culinary);
      }

      .boolean-value.false {
        color: rgba(255, 255, 255, 0.4);
      }

      .number-value {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        color: var(--color-biochemistry);
      }

      .empty-state {
        color: rgba(255, 255, 255, 0.3);
        font-style: italic;
        font-size: 0.8125rem;
      }
    `
  ];

  constructor() {
    super();
    this.entityData = {};
    this.field = '';
    this.mode = 'simple';
    this.perspective = '';
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

  /**
   * Format field name for display
   */
  formatFieldName(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Check if value is a range object
   */
  isRangeObject(value) {
    return typeof value === 'object' && value !== null && 
           'min' in value && 'max' in value;
  }

  /**
   * Determine if a nested object needs wide layout
   */
  needsWideLayout(value) {
    if (typeof value === 'string' && value.length > 50) return true;
    if (Array.isArray(value) && value.length > 3) return true;
    if (typeof value === 'object' && value !== null) {
      const keys = Object.keys(value);
      return keys.length > 4;
    }
    return false;
  }

  /**
   * Render a single value based on its type
   */
  renderValue(value, key = '') {
    const unwrapped = this.unwrapCitedValue(value);
    
    // Null/undefined
    if (unwrapped === null || unwrapped === undefined) {
      return html`<span class="empty-state">—</span>`;
    }

    // Boolean
    if (typeof unwrapped === 'boolean') {
      return html`
        <span class="boolean-value ${unwrapped ? 'true' : 'false'}">
          ${unwrapped ? '✓ Yes' : '✗ No'}
        </span>
      `;
    }

    // Number
    if (typeof unwrapped === 'number') {
      return html`<span class="number-value">${unwrapped}</span>`;
    }

    // String
    if (typeof unwrapped === 'string') {
      return html`<span class="data-value text">${unwrapped}</span>`;
    }

    // Array
    if (Array.isArray(unwrapped)) {
      // Array of primitives → tags
      if (unwrapped.every(item => typeof item !== 'object')) {
        return html`
          <div class="data-value tags">
            ${unwrapped.map(item => html`<span class="tag">${item}</span>`)}
          </div>
        `;
      }
      // Array of objects → render each
      return html`
        <div class="nested-fields-grid">
          ${unwrapped.map((item, i) => html`
            <div class="nested-field wide">
              ${this.renderValue(item, `Item ${i + 1}`)}
            </div>
          `)}
        </div>
      `;
    }

    // Range object
    if (this.isRangeObject(unwrapped)) {
      const { min, max, optimal, unit } = unwrapped;
      let text = `${min}–${max}`;
      if (optimal !== undefined) text += ` (optimal: ${optimal})`;
      if (unit) text += ` ${unit}`;
      return html`<span class="data-value text">${text}</span>`;
    }

    // Plain object → nested grid
    if (typeof unwrapped === 'object') {
      const entries = Object.entries(unwrapped).filter(([_, v]) => 
        v !== null && v !== undefined
      );
      
      if (entries.length === 0) {
        return html`<span class="empty-state">No data</span>`;
      }

      return html`
        <div class="nested-fields-grid">
          ${entries.map(([k, v]) => html`
            <div class="nested-field ${this.needsWideLayout(v) ? 'wide' : ''}">
              <div class="nested-label">${this.formatFieldName(k)}</div>
              <div class="nested-value">${this.renderValue(v, k)}</div>
            </div>
          `)}
        </div>
      `;
    }

    // Fallback
    return html`<span class="data-value text">${String(unwrapped)}</span>`;
  }

  /**
   * Get the data to render
   */
  getData() {
    if (!this.entityData) return null;
    
    // If field is specified, extract that field
    if (this.field && this.entityData[this.field] !== undefined) {
      return this.unwrapCitedValue(this.entityData[this.field]);
    }
    
    // Otherwise use the entire entityData
    return this.entityData;
  }

  render() {
    const data = this.getData();
    
    if (data === null || data === undefined) {
      return html``;
    }

    const displayLabel = this.label || (this.field ? this.formatFieldName(this.field) : '');

    return html`
      <div class="data-container">
        ${displayLabel ? html`
          <div class="data-label">${displayLabel}</div>
        ` : ''}
        ${this.renderValue(data)}
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('data-morph')) {
  customElements.define('data-morph', DataMorph);
}
