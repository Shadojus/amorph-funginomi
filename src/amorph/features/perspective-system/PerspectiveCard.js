/**
 * 🎴 PERSPECTIVE CARD HOST
 * ========================
 * 
 * Data-driven host that creates morphs based on active perspectives.
 * DOES NOT RENDER ITSELF - Creates morphs that render!
 * 
 * Features:
 * - Stores full entity data
 * - Listens to perspective-changed events
 * - Creates morphs for active perspectives
 * - Falls back to default morphs (no perspectives)
 * 
 * Architecture:
 * PerspectiveCard (Host) → Creates Morphs → Morphs register with AmorphSystem
 * 
 * Usage:
 * <perspective-card 
 *   data='{"names": {...}, "culinary": {...}}'
 *   slug="shiitake"
 * ></perspective-card>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from '../grid-view/morphs/tokens.js';
import { amorph } from '../../core/AmorphSystem.js';
import { perspectiveSchemaFields, getFieldsForPerspective } from '../../core/perspectiveFieldMappings.ts';

export class PerspectiveCard extends LitElement {
  static properties = {
    data: { type: String }, // JSON string
    slug: { type: String },
    activePerspectives: { type: Array },
    _parsedData: { type: Object, state: true }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
      }

      .card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .card:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .card-header {
        margin-bottom: 1rem;
      }

      .title {
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
        margin: 0 0 0.25rem 0;
      }

      .subtitle {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
        margin: 0;
      }

      .image-wrapper {
        position: relative;
        width: 100%;
        height: 300px;
        border-radius: 8px;
        margin: 1rem 0;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
      }

      .card-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%);
        padding: 1rem;
        display: flex;
        gap: 0.75rem;
        align-items: flex-end;
      }

      .taxonomy-badge {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .taxonomy-label {
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(255, 255, 255, 0.6);
      }

      .taxonomy-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: white;
        font-style: italic;
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .field-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .field-value {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }

      .detail-link {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: rgba(102, 126, 234, 0.2);
        border: 1px solid rgba(102, 126, 234, 0.5);
        border-radius: 8px;
        color: #8b9dff;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .detail-link:hover {
        background: rgba(102, 126, 234, 0.3);
        border-color: rgba(102, 126, 234, 0.8);
        transform: translateX(4px);
      }

      .empty {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.875rem;
        font-style: italic;
      }
    `
  ];

  constructor() {
    super();
    this.data = '{}';
    this.slug = '';
    this.activePerspectives = [];
    this._parsedData = {};
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Parse data on connect
    this._parseData();
    
    // Listen to perspective changes
    this.handlePerspectiveChange = (e) => {
      this.activePerspectives = e.detail.perspectives || [];
    };
    
    window.addEventListener('perspective-changed', this.handlePerspectiveChange);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('data')) {
      this._parseData();
    }
  }

  _parseData() {
    try {
      this._parsedData = typeof this.data === 'string' ? JSON.parse(this.data) : this.data;
    } catch (e) {
      console.error('[PerspectiveCard] Failed to parse data:', e);
      this._parsedData = {};
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('perspective-changed', this.handlePerspectiveChange);
  }

  /**
   * Get fields to display based on active perspectives
   */
  getDisplayFields() {
    // No perspectives active - show default
    if (this.activePerspectives.length === 0) {
      return this.getDefaultFields();
    }

    // Get fields for each active perspective
    const fields = [];
    for (const perspectiveName of this.activePerspectives) {
      const perspectiveFields = this.getFieldsForPerspective(perspectiveName);
      fields.push(...perspectiveFields);
    }

    return fields.length > 0 ? fields : this.getDefaultFields();
  }

  /**
   * Default fields (no perspective active)
   */
  getDefaultFields() {
    const fields = [];

    if (this._parsedData.description) {
      fields.push({
        label: 'Description',
        value: this._parsedData.description,
        type: 'text'
      });
    }

    return fields;
  }

  /**
   * Get fields for a specific perspective
   * NOW USES CENTRALIZED MAPPINGS from perspectiveFieldMappings.ts
   * 
   * When schema changes, only update perspectiveFieldMappings.ts!
   */
  getFieldsForPerspective(perspectiveName) {
    const fields = [];
    const perspectiveData = this._parsedData[perspectiveName];

    if (!perspectiveData) return fields;

    // Get the display field names from centralized mappings
    const perspectiveConfig = perspectiveSchemaFields[perspectiveName];
    if (!perspectiveConfig) return fields;

    // Iterate through fields defined for this perspective in the mapping
    const displayFields = perspectiveConfig.displayFields || [];
    
    for (const fieldKey of displayFields) {
      // Try to find the value in the data
      const value = this._getNestedValue(perspectiveData, fieldKey);
      
      if (value !== null && value !== undefined && value !== '') {
        fields.push({
          label: this._formatFieldLabel(fieldKey),
          value: this._formatFieldValue(value),
          type: 'text'
        });
      }
    }

    return fields;
  }

  /**
   * Get nested value from object by dot-notation path
   * e.g., "habitat.substrate" → obj.habitat.substrate
   */
  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return current;
  }

  /**
   * Format field name for display
   * e.g., "cultivationMethods" → "Cultivation Methods"
   */
  _formatFieldLabel(fieldKey) {
    return fieldKey
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  }

  /**
   * Format field value for display
   * Handles arrays, objects, and strings
   */
  _formatFieldValue(value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  render() {
    const fields = this.getDisplayFields();
    const hasImage = this._parsedData.images && this._parsedData.images.length > 0;

    return html`
      <article class="card">
        <div class="card-header">
          <h3 class="title">${this._parsedData.names?.common || 'Unknown Entity'}</h3>
          <p class="subtitle">${this._parsedData.names?.scientific || ''}</p>
        </div>

        ${hasImage ? html`
          <div class="image-wrapper">
            <img 
              class="card-image" 
              src="${this._parsedData.images[0].url}" 
              alt="${this._parsedData.names?.common || ''}"
            />
            ${this._parsedData.taxonomy ? html`
              <div class="image-overlay">
                ${this._parsedData.taxonomy.family ? html`
                  <div class="taxonomy-badge">
                    <span class="taxonomy-label">Familie</span>
                    <span class="taxonomy-value">${this._parsedData.taxonomy.family}</span>
                  </div>
                ` : ''}
                ${this._parsedData.taxonomy.genus ? html`
                  <div class="taxonomy-badge">
                    <span class="taxonomy-label">Gattung</span>
                    <span class="taxonomy-value">${this._parsedData.taxonomy.genus}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${this._parsedData.tags && this._parsedData.tags.length > 0 ? html`
          <div class="tags">
            ${this._parsedData.tags.map(tag => html`
              <tag-morph tag="${tag}"></tag-morph>
            `)}
          </div>
        ` : ''}

        <div class="card-content">
          ${fields.length > 0 ? fields.map(field => html`
            <div class="field">
              <div class="field-label">${field.label}</div>
              <div class="field-value">${field.value}</div>
            </div>
          `) : html`
            <div class="empty">
              Select a perspective to see specific data
            </div>
          `}
        </div>

        <a href="/${this.slug}" class="detail-link">
          Details ansehen →
        </a>
      </article>
    `;
  }
}

customElements.define('perspective-card', PerspectiveCard);
