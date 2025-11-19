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
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px) saturate(120%);
      -webkit-backdrop-filter: blur(10px) saturate(120%);
      padding: 0;
      margin-bottom: 1.25rem;
      border-left: 3px solid var(--perspective-color, rgba(255, 255, 255, 0.15));
      padding-left: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .data-container:hover {
      background: rgba(0, 0, 0, 0.4);
      border-left-width: 4px;
      padding-left: 1.125rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .data-label {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.6875rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }

    .data-value {
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.7;
      font-size: 0.9375rem;
    }

    .data-value.text {
      font-size: 1rem;
      font-weight: 500;
    }

    .data-value.tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      font-weight: 400;
      background: transparent;
      color: rgba(255, 255, 255, 0.85);
      border: none;
    }

    .perspective-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 6px;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.075em;
      background: transparent;
      color: var(--perspective-color, rgba(255, 255, 255, 0.5));
      border: 1px solid var(--perspective-color, rgba(255, 255, 255, 0.05));
      opacity: 0.32;
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
      // Don't call extractData here - let updated() handle it
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

    // If no perspectives active, search in ALL perspectives to find the field
    const searchPerspectives = this.activePerspectives.length > 0 
      ? this.activePerspectives 
      : allPerspectives;

    // Perspectives are direct properties on fungusData (matches schema structure)
    for (const perspectiveName of searchPerspectives) {
      const perspectiveData = this.fungusData[perspectiveName];
      if (!perspectiveData) {
        continue;
      }

      // Check if field uses dot notation (e.g., "ecologyAndHabitat.seasonality.primarySeason")
      const fieldParts = this.field.split('.');
      
      // If first part matches perspective name, use remaining path
      if (fieldParts.length > 1 && fieldParts[0] === perspectiveName) {
        const remainingPath = fieldParts.slice(1);
        const value = this.getNestedValue(perspectiveData, remainingPath);
        if (value !== null && value !== undefined) {
          extracted[perspectiveName] = value;
          continue;
        }
      }

      // Direct field access (no dots)
      if (this.field in perspectiveData) {
        extracted[perspectiveName] = perspectiveData[this.field];
      }
      // Deep search in nested objects
      else {
        const value = this.deepSearch(perspectiveData, this.field);
        if (value !== null) {
          extracted[perspectiveName] = value;
        }
      }
    }

    this.currentData = extracted;
  }

  /**
   * Get value from nested object using path array
   * e.g., getNestedValue(obj, ['seasonality', 'primarySeason'])
   */
  getNestedValue(obj, pathArray) {
    let current = obj;
    for (const key of pathArray) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  }

  /**
   * Deep search for a field in nested objects
   */
  deepSearch(obj, fieldName) {
    if (!obj || typeof obj !== 'object') {
      return null;
    }

    // Direct match
    if (fieldName in obj) {
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
   * Format perspective name for display (shorter labels)
   */
  formatPerspectiveName(perspectiveName) {
    const shortNames = {
      taxonomy: 'Taxonomy',
      physicalCharacteristics: 'Physical',
      ecologyAndHabitat: 'Ecology',
      culinaryAndNutritional: 'Culinary',
      medicinalAndHealth: 'Medicinal',
      cultivationAndProcessing: 'Cultivation',
      safetyAndIdentification: 'Safety',
      chemicalAndProperties: 'Chemical',
      culturalAndHistorical: 'Cultural',
      commercialAndMarket: 'Commercial',
      environmentalAndConservation: 'Environment',
      researchAndInnovation: 'Research'
    };
    return shortNames[perspectiveName] || perspectiveName;
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

    // Array of objects → extract name or compound property
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const labels = value.map(obj => {
        // Try common properties for compound objects
        return obj.name || obj.compound || obj.label || obj.title || JSON.stringify(obj);
      }).filter(Boolean);
      
      return html`
        <div class="data-value tags">
          ${labels.map(label => html`<span class="tag">${label}</span>`)}
        </div>
      `;
    }

    // Object with min/max/unit → range
    if (typeof value === 'object' && !Array.isArray(value) && value.min !== undefined && value.max !== undefined) {
      return html`
        <div class="data-value text">
          ${value.min}-${value.max} ${value.unit || ''}
        </div>
      `;
    }

    // Single object → try to extract readable value
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const readable = value.name || value.value || value.label || value.description;
      if (readable) {
        return html`
          <div class="data-value text">
            ${String(readable)}
          </div>
        `;
      }
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

    // Hide completely if no data (don't show empty cards)
    if (dataEntries.length === 0) {
      return html``;
    }

    // Get first perspective for color (primary)
    const [firstPerspective] = dataEntries[0];
    const color = this.getPerspectiveColor(firstPerspective);
    const icon = this.getPerspectiveIcon(firstPerspective);

    // Single perspective - clean display
    if (dataEntries.length === 1) {
      const [perspectiveName, value] = dataEntries[0];

      return html`
        <div class="data-container" style="--perspective-color: ${color}">
          <div class="data-label">
            ${this.formatFieldName(this.field)}
            <span class="perspective-badge" style="--perspective-color: ${color}">
              ${icon} ${this.formatPerspectiveName(perspectiveName)}
            </span>
          </div>
          ${this.renderValue(value, perspectiveName)}
        </div>
      `;
    }

    // Multiple perspectives - stack them
    return html`
      <div class="data-container" style="--perspective-color: ${color}">
        <div class="data-label">
          ${this.formatFieldName(this.field)}
        </div>
        <div class="multi-perspective">
          ${dataEntries.map(([perspectiveName, value]) => {
            const pColor = this.getPerspectiveColor(perspectiveName);
            const pIcon = this.getPerspectiveIcon(perspectiveName);
            return html`
              <div style="margin-bottom: 0.75rem;">
                <span class="perspective-badge" style="--perspective-color: ${pColor}; margin-bottom: 0.375rem;">
                  ${pIcon} ${this.formatPerspectiveName(perspectiveName)}
                </span>
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
