/**
 * 🔮 DATA MORPH
 * ==============
 * 
 * Smart morph that changes its displayed data based on active perspectives.
 * Receives ALL perspective data and filters/displays based on active perspectives.
 * 
 * Usage:
 * <data-morph
 *   fungus-data={JSON.stringify(fungusData)}
 *   field="edibility"
 * ></data-morph>
 * 
 * The morph will automatically:
 * 1. Extract relevant data from all perspectives
 * 2. Listen to perspective-changed events
 * 3. Display data from active perspectives
 * 4. Switch data when perspectives change
 */

import { LitElement, html, css } from 'lit';

export class DataMorph extends LitElement {
  static properties = {
    fungusData: { type: Object },
    field: { type: String },
    activePerspectives: { type: Array },
    currentData: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
    }

    .data-container {
      background: rgba(255, 255, 255, 0.02);
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .data-container:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .data-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }

    .data-value {
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .data-value.text {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .data-value.tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      transition: all 0.2s ease;
    }

    .perspective-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.5rem;
      background: var(--perspective-color, rgba(255, 255, 255, 0.1));
      color: white;
    }

    .multi-perspective {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .perspective-section {
      padding: 1rem;
      border-left: 3px solid var(--perspective-color, rgba(255, 255, 255, 0.2));
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
    }

    .perspective-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--perspective-color, white);
    }

    .empty-state {
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
    }
  `;

  constructor() {
    super();
    this.fungusData = {};
    this.field = '';
    this.activePerspectives = [];
    this.currentData = {};
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Re-extract data when fungusData changes
    if (changedProperties.has('fungusData')) {
      this.extractData();
    }
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    
    // Parse fungus-data attribute on first render
    if (changedProperties.has('fungusData') || changedProperties.has('field')) {
      // Check if we got a string that needs parsing
      const dataAttr = this.getAttribute('fungus-data');
      if (dataAttr && typeof this.fungusData === 'string') {
        try {
          this.fungusData = JSON.parse(dataAttr);
        } catch (e) {
          console.error('[DataMorph] Failed to parse fungus-data:', e);
        }
      }
      
      this.extractData();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Parse attribute if it's a string
    const dataAttr = this.getAttribute('fungus-data');
    if (dataAttr) {
      try {
        this.fungusData = JSON.parse(dataAttr);
      } catch (e) {
        console.error('[DataMorph] Failed to parse fungus-data:', e);
      }
    }
    
    // Get field attribute
    const fieldAttr = this.getAttribute('field');
    if (fieldAttr) {
      this.field = fieldAttr;
    }
    
    // Bind handler
    this._boundHandler = this.handlePerspectiveChange.bind(this);
    
    // Listen for perspective changes
    window.addEventListener('perspective-changed', this._boundHandler);
    document.addEventListener('perspective-changed', this._boundHandler);
    
    // Set data-morph attributes for AMORPH system
    this.dataset.morph = 'true';
    this.dataset.morphType = 'data';
    this.dataset.morphId = `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Register with AMORPH
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }
    
    // Initial data extraction
    this.extractData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this._boundHandler) {
      window.removeEventListener('perspective-changed', this._boundHandler);
      document.removeEventListener('perspective-changed', this._boundHandler);
    }
  }

  handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    this.activePerspectives = perspectives;
    this.extractData();
    console.log(`[DataMorph] ${this.field} updated for perspectives:`, perspectives);
  }

  /**
   * Extract field data from all active perspectives
   * Searches deep in nested objects for the field
   */
  extractData() {
    if (!this.fungusData || !this.field) {
      this.currentData = {};
      return;
    }

    const allPerspectives = [
      'taxonomy',
      'physicalCharacteristics',
      'ecologyAndHabitat',
      'culinaryAndNutritional',
      'medicinalAndHealth',
      'cultivationAndProcessing',
      'safetyAndIdentification',
      'chemicalAndProperties',
      'culturalAndHistorical',
      'commercialAndMarket',
      'environmentalAndConservation',
      'researchAndInnovation'
    ];

    const extracted = {};

    // Search in active perspectives first
    const searchPerspectives = this.activePerspectives.length > 0 
      ? this.activePerspectives 
      : allPerspectives;

    // Perspectives are direct properties on fungusData (matches schema structure)
    for (const perspectiveName of searchPerspectives) {
      const perspectiveData = this.fungusData[perspectiveName];
      if (!perspectiveData) {
        continue;
      }

      console.log(`[DataMorph] ${this.field}: searching in perspective "${perspectiveName}"`, perspectiveData);

      // Direct field access
      if (this.field in perspectiveData) {
        console.log(`[DataMorph] ${this.field}: found directly in ${perspectiveName}:`, perspectiveData[this.field]);
        extracted[perspectiveName] = perspectiveData[this.field];
      }
      // Deep search in nested objects
      else {
        const value = this.deepSearch(perspectiveData, this.field);
        if (value !== null) {
          console.log(`[DataMorph] ${this.field}: found via deepSearch in ${perspectiveName}:`, value);
          extracted[perspectiveName] = value;
        } else {
          console.log(`[DataMorph] ${this.field}: NOT found in ${perspectiveName} (deepSearch returned null)`);
        }
      }
    }

    this.currentData = extracted;
  }

  /**
   * Deep search for a field in nested objects
   */
  deepSearch(obj, fieldName) {
    if (!obj || typeof obj !== 'object') {
      console.log(`[deepSearch] ${fieldName}: obj is not an object`, obj);
      return null;
    }

    // Direct match
    if (fieldName in obj) {
      console.log(`[deepSearch] ${fieldName}: found directly!`, obj[fieldName]);
      return obj[fieldName];
    }

    // Search in nested objects (not arrays)
    for (const key in obj) {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const result = this.deepSearch(value, fieldName);
        if (result !== null) return result;
      }
    }

    return null;
  }

  /**
   * Get perspective color
   */
  getPerspectiveColor(perspectiveName) {
    const colors = {
      taxonomy: '#ef4444',
      physicalCharacteristics: '#f97316',
      ecologyAndHabitat: '#eab308',
      culinaryAndNutritional: '#22c55e',
      medicinalAndHealth: '#06b6d4',
      cultivationAndProcessing: '#3b82f6',
      safetyAndIdentification: '#8b5cf6',
      chemicalAndProperties: '#ec4899',
      culturalAndHistorical: '#d946ef',
      commercialAndMarket: '#14b8a6',
      environmentalAndConservation: '#10b981',
      researchAndInnovation: '#0ea5e9'
    };
    return colors[perspectiveName] || '#ffffff';
  }

  /**
   * Get perspective icon
   */
  getPerspectiveIcon(perspectiveName) {
    const icons = {
      taxonomy: '🧬',
      physicalCharacteristics: '👁️',
      ecologyAndHabitat: '🌍',
      culinaryAndNutritional: '🍳',
      medicinalAndHealth: '⚕️',
      cultivationAndProcessing: '🌱',
      safetyAndIdentification: '⚠️',
      chemicalAndProperties: '🧪',
      culturalAndHistorical: '📜',
      commercialAndMarket: '💰',
      environmentalAndConservation: '🌿',
      researchAndInnovation: '🔬'
    };
    return icons[perspectiveName] || '📊';
  }

  /**
   * Format field name for display
   */
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Render value based on type
   */
  renderValue(value, perspectiveName) {
    // Array of strings → tags
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return html`
        <div class="data-value tags">
          ${value.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>
      `;
    }

    // Object with min/max/unit → range
    if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
      return html`
        <div class="data-value text">
          ${value.min}-${value.max} ${value.unit || ''}
        </div>
      `;
    }

    // Plain string/number/boolean
    return html`
      <div class="data-value text">
        ${String(value)}
      </div>
    `;
  }

  render() {
    const dataEntries = Object.entries(this.currentData);

    // Debug logging
    if (dataEntries.length === 0) {
      console.log(`[DataMorph] No data for field "${this.field}"`, {
        fungusData: this.fungusData,
        activePerspectives: this.activePerspectives,
        currentData: this.currentData
      });
    }

    if (dataEntries.length === 0) {
      return html`
        <div class="data-container">
          <span class="data-label">${this.formatFieldName(this.field)}</span>
          <div class="empty-state">No data available</div>
        </div>
      `;
    }

    // Single perspective
    if (dataEntries.length === 1) {
      const [perspectiveName, value] = dataEntries[0];
      const color = this.getPerspectiveColor(perspectiveName);
      const icon = this.getPerspectiveIcon(perspectiveName);

      return html`
        <div class="data-container" style="border-left: 3px solid ${color}">
          <span class="data-label">
            ${this.formatFieldName(this.field)}
            <span class="perspective-badge" style="--perspective-color: ${color}">
              ${icon} ${perspectiveName}
            </span>
          </span>
          ${this.renderValue(value, perspectiveName)}
        </div>
      `;
    }

    // Multiple perspectives
    return html`
      <div class="data-container">
        <span class="data-label">${this.formatFieldName(this.field)}</span>
        <div class="multi-perspective">
          ${dataEntries.map(([perspectiveName, value]) => {
            const color = this.getPerspectiveColor(perspectiveName);
            const icon = this.getPerspectiveIcon(perspectiveName);
            return html`
              <div class="perspective-section" style="--perspective-color: ${color}">
                <div class="perspective-header">
                  <span>${icon}</span>
                  <span>${perspectiveName}</span>
                </div>
                ${this.renderValue(value, perspectiveName)}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define('data-morph', DataMorph);
