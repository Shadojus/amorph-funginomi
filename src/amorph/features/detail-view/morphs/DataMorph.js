/**
 * 🔮 DATA MORPH (Detail View) v2.0
 * =================================
 * 
 * Premium data rendering with glassmorphism, container queries,
 * and sophisticated nested field display.
 * 
 * Mirrors grid-view quality with:
 * - 2-column responsive grid layouts
 * - Container queries at 180px, 280px breakpoints
 * - Glassmorphism backgrounds with subtle borders
 * - Color-coded values (boolean green/red, numbers purple)
 * - Recursive nested field rendering
 * - citedValue wrapper unwrapping
 * - Uses MorphMapper for smart morph type detection (radar charts, etc.)
 * 
 * Usage:
 * <data-morph
 *   entity-data={JSON.stringify(entityData)}
 *   field="edibility"
 *   perspective="culinary"
 *   mode="deep"
 * ></data-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';
import { MorphMapper } from '../../../core/MorphMapper.js';

// Create a shared MorphMapper instance
const morphMapper = new MorphMapper();

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
        --perspective-color: var(--perspective-color, rgba(139, 92, 246, 0.7));
        container-type: inline-size;
        container-name: datamorph;
      }
      
      /* ===== MAIN CONTAINER (only for standalone/simple mode) ===== */
      .data-container {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.75rem 1rem;
        margin-bottom: 0.625rem;
        border-left: 3px solid var(--perspective-color, rgba(139, 92, 246, 0.5));
        border-radius: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        border-right: 1px solid rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        container-type: inline-size;
        container-name: datacontainer;
        backdrop-filter: blur(8px);
      }

      .data-container:hover {
        background: rgba(0, 0, 0, 0.2);
        border-left-width: 4px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      /* DEEP MODE: No container styling at all - parent handles it */
      .data-container.deep-mode {
        background: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      .data-container.deep-mode:hover {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
      }

      /* ========================================
         NEW: FLAT 2-COLUMN ROW LAYOUT
         ======================================== */
      
      .flat-rows {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* Section headers - visual separators */
      .section-header {
        padding: 0.75rem 0 0.5rem 0;
        margin-top: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .section-header:first-child {
        margin-top: 0;
        padding-top: 0;
      }

      .section-header .section-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      /* Data rows - 2 column layout */
      .data-row {
        display: grid;
        grid-template-columns: minmax(100px, 35%) 1fr;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        align-items: baseline;
      }

      .data-row:last-child {
        border-bottom: none;
      }

      .data-row.wide {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .data-row.chart {
        padding: 0.75rem 0;
      }

      .row-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .row-value {
        font-size: 0.9375rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }

      .row-value.number {
        color: #a78bfa;
        font-weight: 600;
      }

      .row-value.yes {
        color: #4ade80;
      }

      .row-value.no {
        color: rgba(255, 255, 255, 0.4);
      }

      .row-value.tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
      }

      /* ===== LABELS ===== */
      .data-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.65);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.5rem;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      .perspective-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: var(--perspective-color, rgba(139, 92, 246, 0.2));
        border: 1px solid var(--perspective-color, rgba(139, 92, 246, 0.3));
        border-radius: 4px;
        font-size: 0.625rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      /* ===== VALUES ===== */
      .data-value {
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.5;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
      }

      .data-value.text {
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1.55;
        color: rgba(255, 255, 255, 0.92);
      }

      .data-value.number {
        font-size: 1.125rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: #818cf8;
        text-shadow: 0 0 12px rgba(129, 140, 248, 0.4);
      }

      .data-value.tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        line-height: 1.2;
      }

      .tag {
        padding: 0.3125rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        background: rgba(139, 92, 246, 0.15);
        color: rgba(196, 181, 253, 0.95);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        transition: all 0.2s ease;
      }

      .tag:hover {
        background: rgba(139, 92, 246, 0.25);
        transform: translateY(-1px);
      }

      /* ===== NESTED GRID ===== */
      .nested-fields-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem 0.625rem;
        margin-top: 0.625rem;
        align-items: start;
        container-type: inline-size;
        container-name: nestedgrid;
      }
      
      /* Container query: narrow */
      @container nestedgrid (max-width: 180px) {
        .nested-fields-grid {
          grid-template-columns: 1fr;
          gap: 0.375rem;
        }
      }

      /* Container query: medium */
      @container nestedgrid (min-width: 181px) and (max-width: 280px) {
        .nested-fields-grid {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      }

      /* ===== NESTED FIELD ITEMS ===== */
      /* Minimal styling - just layout, no extra boxes */
      .nested-field {
        padding: 0.5rem 0;
        min-width: 0;
      }

      .nested-field.wide {
        grid-column: 1 / -1;
      }

      .nested-field.compact {
        padding: 0.25rem 0;
      }

      /* Chart fields get subtle background */
      .nested-field.chart-field {
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      .chart-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.5rem;
      }

      .nested-label {
        display: block;
        font-size: 0.625rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
        line-height: 1.3;
      }

      .nested-value {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        line-height: 1.4;
      }

      /* ===== BOOLEAN INLINE BADGES ===== */
      .boolean-inline {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .boolean-inline.true {
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #4ade80;
      }

      .boolean-inline.false {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: rgba(248, 113, 113, 0.9);
      }

      .bool-icon {
        font-size: 0.75rem;
      }

      .bool-label {
        font-size: 0.625rem;
      }

      /* ===== SECTION HEADERS ===== */
      .nested-section {
        grid-column: 1 / -1;
        margin-top: 0.5rem;
      }

      .section-title {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 0.5rem 0;
        padding-bottom: 0.375rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      /* ===== PERSPECTIVE SECTIONS ===== */
      .perspective-section {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .perspective-section:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      /* ===== EMPTY STATE ===== */
      .empty-state {
        color: rgba(255, 255, 255, 0.35);
        font-style: italic;
        font-size: 0.8125rem;
      }

      /* ===== MULTI-PERSPECTIVE VIEW ===== */
      .multi-perspective {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
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

  connectedCallback() {
    super.connectedCallback();
    
    // Parse entity-data attribute if it's a string
    const dataAttr = this.getAttribute('entity-data');
    if (dataAttr) {
      try {
        this.entityData = JSON.parse(dataAttr);
      } catch (e) {
        console.error('[Detail-DataMorph] Failed to parse entity-data:', e);
      }
    }
    
    // Set data-morph attributes for AMORPH system
    this.dataset.morph = 'true';
    this.dataset.morphType = 'detail-data';
    this.dataset.morphId = `detail-data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Register with AMORPH
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup if needed
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
   * Format label: underscores to spaces, camelCase to Title Case
   * Optionally removes unit suffix if extractUnit is true
   */
  formatLabel(label, removeUnit = false) {
    let formatted = label
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Remove unit suffix if requested (e.g., "Thickness mm" → "Thickness")
    if (removeUnit) {
      formatted = formatted.replace(/\s+(mm|cm|m|km|g|kg|mg|μm|um|µm|ml|l|°C|°F|%|hours?|days?|weeks?|months?|years?)$/i, '');
    }
    
    return formatted;
  }

  /**
   * Extract unit from a key name (e.g., "thickness_mm" → "mm")
   */
  extractUnitFromKey(key) {
    const unitMatch = key.match(/[_\s]?(mm|cm|m|km|g|kg|mg|μm|um|µm|ml|l|°C|°F|%|hours?|days?|weeks?|months?|years?)$/i);
    return unitMatch ? unitMatch[1] : null;
  }

  /**
   * Format numbers with smart abbreviation
   */
  formatNumber(value) {
    const num = Number(value);
    
    // Check if this looks like a timestamp
    if (Math.abs(num) > 1000000000000) {
      try {
        const date = new Date(num);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) { /* fall through */ }
    }
    
    // Abbreviate large numbers
    const absNum = Math.abs(num);
    if (absNum >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (absNum >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (absNum >= 10000) return (num / 1000).toFixed(1) + 'K';
    
    // Regular number
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  }

  /**
   * Get perspective icon based on name
   */
  getPerspectiveIcon(perspectiveName) {
    const icons = {
      taxonomy: '🧬',
      ecology: '🌲',
      culinary: '🍳',
      medicinal: '💊',
      biochemistry: '⚗️',
      cultivation: '🌱',
      mycology: '🔬',
      identification: '🔍',
      foraging: '🍄',
      toxicology: '☠️',
      root: '📋'
    };
    return icons[perspectiveName?.toLowerCase()] || '📊';
  }

  /**
   * Format perspective name for display
   */
  formatPerspectiveName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
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
   * NEW: Flatten object into a FLAT list of rows for 2-column display
   * No deep nesting - sections are just visual separators
   * Returns: [{ type: 'row'|'section'|'tags'|'chart', label, value, ... }]
   */
  flattenToRows(obj, sectionLabel = '') {
    const rows = [];
    const unwrapped = this.unwrapCitedValue(obj);
    
    if (!unwrapped || typeof unwrapped !== 'object') return rows;
    
    for (const [key, rawValue] of Object.entries(unwrapped)) {
      const value = this.unwrapCitedValue(rawValue);
      
      // Skip null/undefined
      if (value === null || value === undefined) continue;
      
      // Primitives → simple row
      if (typeof value === 'boolean') {
        rows.push({ type: 'row', label: key, value: value ? '✓ Yes' : '✗ No', isBoolean: true, boolValue: value });
        continue;
      }
      
      if (typeof value === 'number') {
        // Extract unit from key name (e.g., "free_glutamate_mg" → "mg")
        const unit = this.extractUnitFromKey(key);
        const cleanLabel = unit ? this.formatLabel(key, true) : key;
        const displayValue = unit ? `${this.formatNumber(value)} ${unit}` : this.formatNumber(value);
        rows.push({ type: 'row', label: cleanLabel, value: displayValue, isNumber: true });
        continue;
      }
      
      if (typeof value === 'string') {
        rows.push({ type: 'row', label: key, value: value });
        continue;
      }
      
      // Array of primitives → tags (inline)
      if (Array.isArray(value)) {
        const allPrimitive = value.every(v => typeof v === 'string' || typeof v === 'number');
        if (allPrimitive && value.length > 0) {
          rows.push({ type: 'tags', label: key, values: value });
          continue;
        }
        
        // Array of objects → check for chart data
        if (value.length >= 3 && value.length <= 12 && typeof value[0] === 'object') {
          const keys = Object.keys(value[0]);
          const isRadar = (keys.includes('axis') || keys.includes('category')) && 
                          (keys.includes('value') || keys.includes('score'));
          if (isRadar) {
            rows.push({ type: 'radar', label: key, data: value });
            continue;
          }
        }
        continue; // Skip complex arrays for now
      }
      
      // Range object → visual range
      if (this.isRangeObject(value)) {
        // Try to extract unit from the key name (e.g., "thickness_mm" → "mm")
        let unit = value.unit;
        if (!unit) {
          unit = this.extractUnitFromKey(key);
        }
        // Clean label removes the unit suffix
        const cleanLabel = unit ? this.formatLabel(key, true) : key;
        rows.push({ type: 'range', label: cleanLabel, data: { ...value, unit } });
        continue;
      }
      
      // Score object (all numbers 0-10) → radar chart
      if (typeof value === 'object' && value !== null) {
        const entries = Object.entries(value);
        const allNumericScores = entries.length >= 3 && entries.length <= 12 && 
          entries.every(([k, v]) => typeof v === 'number' && v >= 0 && v <= 10);
        
        console.log('[DataMorph] Checking score object:', key, 'entries:', entries.length, 'allNumericScores:', allNumericScores);
        
        if (allNumericScores) {
          // Pass the original object directly - RadarChartMorph handles normalization
          console.log('[DataMorph] Detected score object for radar:', key, value);
          rows.push({ type: 'radar', label: key, data: value });
          continue;
        }
        
        // Nested object → add section header, then flatten children
        rows.push({ type: 'section', label: key });
        const childRows = this.flattenToRows(value, key);
        rows.push(...childRows);
      }
    }
    
    return rows;
  }

  /**
   * Render a single row in the flat 2-column layout
   */
  renderRow(row) {
    // Section header - spans full width
    if (row.type === 'section') {
      return html`
        <div class="section-header">
          <span class="section-title">${this.formatLabel(row.label)}</span>
        </div>
      `;
    }
    
    // Tags - spans full width
    if (row.type === 'tags') {
      return html`
        <div class="data-row wide">
          <div class="row-label">${this.formatLabel(row.label)}</div>
          <div class="row-value tags">
            ${row.values.map(tag => html`<span class="tag">${tag}</span>`)}
          </div>
        </div>
      `;
    }
    
    // Radar chart - spans full width
    if (row.type === 'radar') {
      console.log('[DataMorph] Rendering radar chart:', row.label, 'data:', row.data);
      return html`
        <div class="data-row wide chart">
          <div class="row-label">${this.formatLabel(row.label)}</div>
          <detail-radar-chart-morph .data=${row.data}></detail-radar-chart-morph>
        </div>
      `;
    }
    
    // Range - spans full width
    if (row.type === 'range') {
      return html`
        <div class="data-row wide">
          <div class="row-label">${this.formatLabel(row.label)}</div>
          <detail-range-morph .data=${row.data}></detail-range-morph>
        </div>
      `;
    }
    
    // Simple row (text, number, boolean)
    return html`
      <div class="data-row ${row.isNumber ? 'number' : ''} ${row.isBoolean ? 'boolean' : ''}">
        <div class="row-label">${this.formatLabel(row.label)}</div>
        <div class="row-value ${row.isNumber ? 'number' : ''} ${row.isBoolean ? (row.boolValue ? 'yes' : 'no') : ''}">${row.value}</div>
      </div>
    `;
  }

  /**
   * Render a nested field based on its type
   */
  renderNestedField(field, depth = 0) {
    const marginStyle = depth > 0 ? `margin-left: ${depth * 0.5}rem` : '';
    const compactClass = field.wide ? 'wide' : 'compact';
    
    // Use detail-morphs for rich rendering
    if (field.type === 'tags') {
      return html`
        <div class="nested-field wide" style="${marginStyle}">
          <detail-tag-morph
            .tags=${field.values}
            label=${this.formatLabel(field.label)}
          ></detail-tag-morph>
        </div>
      `;
    }
    
    if (field.type === 'boolean') {
      return html`
        <div class="nested-field compact" style="${marginStyle}">
          <detail-text-morph
            .value=${field.value ? '✓ Ja' : '✗ Nein'}
            label=${this.formatLabel(field.label)}
          ></detail-text-morph>
        </div>
      `;
    }
    
    if (field.type === 'number') {
      return html`
        <div class="nested-field compact" style="${marginStyle}">
          <detail-text-morph
            .value=${String(this.formatNumber(field.value))}
            label=${this.formatLabel(field.label)}
          ></detail-text-morph>
        </div>
      `;
    }
    
    if (field.type === 'text') {
      return html`
        <div class="nested-field ${compactClass}" style="${marginStyle}">
          <detail-text-morph
            .value=${field.value}
            label=${this.formatLabel(field.label)}
          ></detail-text-morph>
        </div>
      `;
    }
    
    if (field.type === 'range') {
      return html`
        <div class="nested-field wide" style="${marginStyle}">
          <detail-range-morph
            .data=${{ min: field.min, max: field.max, optimal: field.optimal, unit: field.unit }}
            label=${this.formatLabel(field.label)}
          ></detail-range-morph>
        </div>
      `;
    }
    
    // 🎯 RADAR CHART - Score objects visualized as radar diagrams
    if (field.type === 'radar-chart') {
      return html`
        <div class="nested-field wide chart-field" style="${marginStyle}">
          <div class="chart-label">${this.formatLabel(field.label)}</div>
          <detail-radar-chart-morph
            .data=${field.data}
          ></detail-radar-chart-morph>
        </div>
      `;
    }
    
    // 📋 KEY-VALUE - Small flat objects as compact key-value pairs
    if (field.type === 'keyvalue') {
      return html`
        <div class="nested-field wide" style="${marginStyle}">
          <detail-keyvalue-morph
            .data=${field.data}
            label=${this.formatLabel(field.label)}
          ></detail-keyvalue-morph>
        </div>
      `;
    }
    
    if (field.type === 'section') {
      return html`
        <div class="nested-section" style="${marginStyle}">
          <h5 class="section-title">${this.formatLabel(field.label)}</h5>
          <div class="nested-fields-grid">
            ${field.children.map(child => this.renderNestedField(child, depth + 1))}
          </div>
        </div>
      `;
    }
    
    return html``;
  }

  /**
   * Render a single value based on its type (simple mode)
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
        <div class="boolean-inline ${unwrapped ? 'true' : 'false'}">
          <span class="bool-icon">${unwrapped ? '✓' : '✗'}</span>
          <span class="bool-label">${unwrapped ? 'Yes' : 'No'}</span>
        </div>
      `;
    }

    // Number
    if (typeof unwrapped === 'number') {
      return html`<span class="data-value number">${this.formatNumber(unwrapped)}</span>`;
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

    // Plain object → nested grid with flattening
    if (typeof unwrapped === 'object') {
      const fields = this.flattenObjectForRender(unwrapped, '', 4, 0);
      
      if (fields.length === 0) {
        return html`<span class="empty-state">No data</span>`;
      }

      return html`
        <div class="nested-fields-grid">
          ${fields.map(field => this.renderNestedField(field, 0))}
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

    // DEEP MODE: Flat 2-column layout with section headers
    if (this.mode === 'deep' && typeof data === 'object' && !Array.isArray(data)) {
      const rows = this.flattenToRows(data);
      
      if (rows.length === 0) {
        return html``;
      }

      // Use new flat layout - no nested containers
      return html`
        <div class="data-container deep-mode">
          <div class="flat-rows">
            ${rows.map(row => this.renderRow(row))}
          </div>
        </div>
      `;
    }

    // SIMPLE MODE: Original behavior
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

// Register with detail- prefix for detail pages
customElements.define('detail-data-morph', DataMorph);
