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
    mode: { type: String }, // 'simple' (default) or 'deep' (recursive rendering)
    activePerspectives: { type: Array },
    currentData: { type: Object }
  };

  static styles = css`
      :host {
        display: block;
        max-width: 100%;
        overflow: hidden;
      }    .data-container {
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
    }
    
    :host(.search-highlight-morph) .data-container {
      z-index: 50;
    }

    .data-container:hover {
      border-left-width: 4px;
      padding-left: 0.625rem;
    }

    .data-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.5625rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.375rem;
    }

    .data-value {
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.3;
      font-size: 0.8125rem;
      transition: all 0.3s ease;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
    
    /* Search highlight - background only, no overlay effect */
    :host(.search-highlight-morph) .data-value {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.35));
      border-radius: 4px;
      padding: 4px 8px;
      animation: search-value-pulse 1.5s ease-in-out infinite;
      position: relative;
      border-left: 3px solid rgba(59, 130, 246, 0.8);
    }
    
    @keyframes search-value-pulse {
      0%, 100% {
        background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3));
        border-left-color: rgba(59, 130, 246, 0.7);
      }
      50% {
        background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.4));
        border-left-color: rgba(59, 130, 246, 1);
      }
    }

    .data-value.text {
      font-size: 0.9375rem;
      font-weight: 500;
    }

    .data-value.tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      line-height: 1.2;
    }

    .tag {
      padding: 0;
      font-size: 0.8125rem;
      font-weight: 400;
      background: transparent;
      color: rgba(255, 255, 255, 0.85);
      border: none;
      display: inline;
    }
    
    .tag:not(:last-child)::after {
      content: ',';
      margin-right: 0.25rem;
    }

    .perspective-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      padding: 0.1rem 0.375rem;
      border-radius: 3px;
      font-size: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
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

    /* Nested rendering styles */
    .nested-field {
      margin-bottom: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .nested-field:last-child {
      border-bottom: none;
    }

    .nested-label {
      display: block;
      font-size: 0.5625rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .nested-section {
      margin: 0.75rem 0;
      padding: 0.75rem;
      border-left: 2px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
    }

    .section-title {
      font-size: 0.6875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      text-transform: capitalize;
      margin: 0 0 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.375rem;
    }

    .nested-array {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .array-item {
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .array-item-label {
      display: block;
      font-size: 0.5rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.375rem;
    }

    .nested-object {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* Deep mode styles */
    .deep-mode {
      padding: 0;
      border-left: none;
    }

    .deep-mode .perspective-section {
      margin-bottom: 1.5rem;
    }

    .deep-mode .perspective-section:last-child {
      margin-bottom: 0;
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

    /* Search highlighting styles */
    .search-highlight-text {
      background: linear-gradient(90deg, rgba(250, 204, 21, 0.4), rgba(251, 191, 36, 0.5));
      color: rgba(255, 255, 255, 0.95);
      padding: 2px 4px;
      border-radius: 3px;
      font-weight: 600;
      box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.3);
      animation: search-text-pulse 2s ease-in-out infinite;
    }

    @keyframes search-text-pulse {
      0%, 100% {
        background: linear-gradient(90deg, rgba(250, 204, 21, 0.3), rgba(251, 191, 36, 0.4));
        box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.2);
      }
      50% {
        background: linear-gradient(90deg, rgba(250, 204, 21, 0.5), rgba(251, 191, 36, 0.6));
        box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.5);
      }
    }
  `;

  constructor() {
    super();
    this.fungusData = null;
    this.field = null;
    this.mode = 'simple'; // 'simple' or 'deep'
    this.activePerspectives = [];
    this.currentData = {};
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Re-extract data when fungusData or mode changes
    if (changedProperties.has('fungusData') || changedProperties.has('mode')) {
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
   * SIMPLIFIED: Works with complete Convex data
   * 
   * DEEP MODE: If mode='deep' and no field specified, extracts ALL perspectives
   */
  extractData() {
    if (!this.fungusData) {
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

    // DEEP MODE WITHOUT FIELD: Extract ALL perspectives
    if (this.mode === 'deep' && !this.field) {
      const extracted = {};
      const searchPerspectives = this.activePerspectives.length > 0 
        ? this.activePerspectives 
        : allPerspectives;
      
      for (const perspectiveName of searchPerspectives) {
        const perspectiveData = this.fungusData[perspectiveName];
        if (perspectiveData && Object.keys(perspectiveData).length > 0) {
          extracted[perspectiveName] = perspectiveData;
        }
      }
      
      this.currentData = extracted;
      return;
    }

    // SIMPLE MODE or DEEP MODE WITH FIELD: Extract specific field
    if (!this.field) {
      this.currentData = {};
      return;
    }

    const extracted = {};
    const fieldParts = this.field.split('.');

    // STRATEGY 1: Direct field access (e.g., "edibility", "kingdom")
    // Try top-level and all perspectives
    if (fieldParts.length === 1) {
      const fieldName = fieldParts[0];
      
      // Check top-level first
      if (fieldName in this.fungusData && this.fungusData[fieldName] !== null && this.fungusData[fieldName] !== undefined) {
        extracted['root'] = this.fungusData[fieldName];
      }
      
      // Also check all perspectives (if perspectives are active)
      const searchPerspectives = this.activePerspectives.length > 0 
        ? this.activePerspectives 
        : allPerspectives;
      
      for (const perspectiveName of searchPerspectives) {
        const perspectiveData = this.fungusData[perspectiveName];
        if (!perspectiveData) continue;
        
        if (fieldName in perspectiveData && perspectiveData[fieldName] !== null && perspectiveData[fieldName] !== undefined) {
          extracted[perspectiveName] = perspectiveData[fieldName];
        }
      }
    }
    
    // STRATEGY 2: Nested field access (e.g., "taxonomy.family", "ecologyAndHabitat.substrate")
    else {
      const firstPart = fieldParts[0];
      
      // Check if first part is a perspective name
      if (allPerspectives.includes(firstPart)) {
        // Field explicitly references a perspective (e.g., "taxonomy.family")
        const perspectiveData = this.fungusData[firstPart];
        if (perspectiveData) {
          const remainingPath = fieldParts.slice(1);
          const value = this.getNestedValue(perspectiveData, remainingPath);
          if (value !== null && value !== undefined) {
            extracted[firstPart] = value;
          }
        }
      } else {
        // Field doesn't start with perspective name - search in active perspectives
        const searchPerspectives = this.activePerspectives.length > 0 
          ? this.activePerspectives 
          : allPerspectives;
        
        for (const perspectiveName of searchPerspectives) {
          const perspectiveData = this.fungusData[perspectiveName];
          if (!perspectiveData) continue;
          
          // Try direct nested access
          const value = this.getNestedValue(perspectiveData, fieldParts);
          if (value !== null && value !== undefined) {
            extracted[perspectiveName] = value;
          }
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
      root: '#90CAF9',  // Default blue for top-level fields
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
      root: '📊',  // Default icon for top-level fields
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
   * Render value based on type - ENHANCED with Deep Recursive Rendering
   */
  renderValue(value, perspectiveName, depth = 0) {
    // Array of strings → tags
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      // Filter empty strings
      const validStrings = value.filter(s => s && s.trim().length > 0);
      if (validStrings.length === 0) return html``;
      
      return html`
        <div class="data-value tags">
          ${validStrings.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>
      `;
    }

    // Array of objects → render each as nested section
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return html`
        <div class="nested-array" style="margin-left: ${depth * 0.5}rem">
          ${value.map((item, idx) => {
            const itemFields = this.flattenObjectForRender(item, '', 3, 0);
            return html`
              <div class="array-item">
                <span class="array-item-label">Item ${idx + 1}</span>
                ${itemFields.map(field => this.renderNestedField(field, depth + 1))}
              </div>
            `;
          })}
        </div>
      `;
    }

    // Object with min/max/unit → range
    if (typeof value === 'object' && !Array.isArray(value) && value !== null && value.min !== undefined && value.max !== undefined) {
      return html`
        <div class="data-value text">
          ${value.min}-${value.max} ${value.unit || ''}
        </div>
      `;
    }

    // Plain object → render as nested structure
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const fields = this.flattenObjectForRender(value, '', 3, 0);
      if (fields.length === 0) return html``;
      
      return html`
        <div class="nested-object" style="margin-left: ${depth * 0.5}rem">
          ${fields.map(field => this.renderNestedField(field, depth + 1))}
        </div>
      `;
    }

    // Plain string/number/boolean
    const strValue = String(value).trim();
    if (strValue.length === 0) return html``;
    
    return html`
      <div class="data-value text">
        ${strValue}
      </div>
    `;
  }

  /**
   * Flatten object for rendering (similar to detail page)
   */
  flattenObjectForRender(obj, prefix = '', maxDepth = 3, currentDepth = 0) {
    if (!obj || currentDepth >= maxDepth) return [];
    const results = [];
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;
      
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      // Array of strings → tags
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        const validStrings = value.filter(s => s && s.trim().length > 0);
        if (validStrings.length > 0) {
          results.push({ type: 'tags', label, key: fullKey, values: validStrings });
        }
        continue;
      }
      
      // Array of objects → recurse each
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        value.forEach((item, idx) => {
          const subItems = this.flattenObjectForRender(item, `${fullKey}[${idx}]`, maxDepth, currentDepth + 1);
          results.push(...subItems);
        });
        continue;
      }
      
      // Object with min/max/unit → range
      if (typeof value === 'object' && !Array.isArray(value) && value.min !== undefined && value.max !== undefined) {
        results.push({ 
          type: 'text', 
          label, 
          key: fullKey, 
          value: `${value.min}-${value.max} ${value.unit || ''}`.trim() 
        });
        continue;
      }
      
      // Plain object → recurse
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nested = this.flattenObjectForRender(value, fullKey, maxDepth, currentDepth + 1);
        if (nested.length > 0) {
          results.push({ type: 'section', label, key: fullKey, children: nested });
        }
        continue;
      }
      
      // Primitive values
      if (typeof value === 'string') {
        if (value.trim().length > 0) {
          results.push({ type: 'text', label, key: fullKey, value: value.trim() });
        }
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        results.push({ type: 'text', label, key: fullKey, value: String(value) });
      }
    }
    
    return results;
  }

  /**
   * Render a nested field (tags, text, or section)
   */
  renderNestedField(field, depth = 0) {
    const marginStyle = `margin-left: ${depth * 0.5}rem`;
    
    if (field.type === 'tags') {
      return html`
        <div class="nested-field" style="${marginStyle}">
          <label class="nested-label">${field.label}</label>
          <div class="data-value tags">
            ${field.values.map(tag => html`<span class="tag">${tag}</span>`)}
          </div>
        </div>
      `;
    }
    
    if (field.type === 'text') {
      return html`
        <div class="nested-field" style="${marginStyle}">
          <label class="nested-label">${field.label}</label>
          <div class="data-value text">${field.value}</div>
        </div>
      `;
    }
    
    if (field.type === 'section') {
      return html`
        <div class="nested-section" style="${marginStyle}">
          <h5 class="section-title">${field.label}</h5>
          ${field.children.map(child => this.renderNestedField(child, depth + 1))}
        </div>
      `;
    }
    
    return html``;
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

    // DEEP MODE: Render all nested data recursively
    if (this.mode === 'deep') {
      return this.renderDeepMode(dataEntries, color, icon);
    }

    // SIMPLE MODE: Original behavior (single field display)
    // Single perspective - clean display
    if (dataEntries.length === 1) {
      const [perspectiveName, value] = dataEntries[0];

      // Special case: 'root' perspective means top-level field (no badge needed)
      if (perspectiveName === 'root') {
        return html`
          <div class="data-container" style="--perspective-color: ${color}">
            <div class="data-label">
              ${this.formatFieldName(this.field)}
            </div>
            ${this.renderValue(value, perspectiveName)}
          </div>
        `;
      }

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
            // Skip 'root' in multi-perspective display (shouldn't happen often)
            if (perspectiveName === 'root') {
              return html`
                <div style="margin-bottom: 0.75rem;">
                  ${this.renderValue(value, perspectiveName)}
                </div>
              `;
            }
            
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

  /**
   * Render in DEEP mode - shows all nested data recursively
   */
  renderDeepMode(dataEntries, color, icon) {
    // Reverse order so newest perspective is on top
    const reversedEntries = [...dataEntries].reverse();
    
    return html`
      <div class="data-container deep-mode" style="--perspective-color: ${color}">
        ${reversedEntries.map(([perspectiveName, value]) => {
          const pColor = this.getPerspectiveColor(perspectiveName);
          const pIcon = this.getPerspectiveIcon(perspectiveName);
          
          // Flatten the entire value recursively
          const fields = this.flattenObjectForRender(value, '', 4, 0);
          
          if (fields.length === 0) return html``;
          
          return html`
            <div class="perspective-section" style="--perspective-color: ${pColor}">
              <div class="data-label">
                <span class="perspective-badge" style="--perspective-color: ${pColor}">
                  ${pIcon} ${this.formatPerspectiveName(perspectiveName)}
                </span>
              </div>
              ${fields.map(field => this.renderNestedField(field, 0))}
            </div>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('data-morph', DataMorph);
