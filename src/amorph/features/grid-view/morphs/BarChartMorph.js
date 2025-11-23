/**
 * 📊 BAR CHART MORPH - Datengetrieben
 * 
 * Zeigt numerische Arrays als Balkendiagramm
 * REIN DATENGETRIEBEN - Erkennt Arrays mit Zahlen
 * 
 * Input: [12, 45, 23, 67, 34] oder [{label: "A", value: 12}, ...]
 * Output: Kompaktes Balkendiagramm mit Hover-Werten
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class BarChartMorph extends LitElement {
  static properties = {
    data: { type: Array }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        background: rgba(0, 0, 0, 0.3);
        border-radius: var(--radius-md);
        padding: var(--space-md);
      }

      .chart-wrapper {
        position: relative;
      }

      .chart-container {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 140px;
        padding: var(--space-sm) 0;
        position: relative;
      }

      .bar-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 40px;
      }

      .bar {
        width: 100%;
        background: linear-gradient(180deg, rgba(16, 185, 129, 0.9), rgba(16, 185, 129, 0.6));
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        transition: all var(--transition-fast);
        cursor: pointer;
        position: relative;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      }

      .bar:hover {
        background: linear-gradient(180deg, rgba(16, 185, 129, 1), rgba(16, 185, 129, 0.8));
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
      }

      .bar-value {
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: 700;
        color: rgba(16, 185, 129, 1);
        white-space: nowrap;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 1),
                     -1px -1px 3px rgba(0, 0, 0, 1),
                     1px -1px 3px rgba(0, 0, 0, 1),
                     -1px 1px 3px rgba(0, 0, 0, 1),
                     1px 1px 3px rgba(0, 0, 0, 1);
      }

      .bar-label {
        margin-top: 6px;
        font-size: 10px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        word-break: break-word;
        max-width: 100%;
        line-height: 1.2;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9),
                     -1px -1px 2px rgba(0, 0, 0, 0.8),
                     1px -1px 2px rgba(0, 0, 0, 0.8),
                     -1px 1px 2px rgba(0, 0, 0, 0.8),
                     1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      .chart-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: var(--space-sm);
        padding-top: var(--space-sm);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .chart-title {
        font-size: 14px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: var(--space-sm);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
  }

  detectUnit(items) {
    // Detect unit from first item with unit property
    for (const item of items) {
      if (item.unit) return item.unit;
    }
    return '';
  }
  
  formatValue(value, unit) {
    // Handle non-numeric values (objects, ranges, etc.)
    if (typeof value !== 'number' || isNaN(value)) {
      return String(value);
    }
    
    if (!unit) return value.toFixed(1);
    
    // Format based on magnitude
    if (value >= 1000) return `${(value/1000).toFixed(1)}k${unit}`;
    if (value >= 1) return `${value.toFixed(1)}${unit}`;
    return `${value.toFixed(2)}${unit}`;
  }
  
  extractNumericValue(item) {
    // Try direct properties first
    let value = item.value || item.amount || item.concentration || 
               item.suitability || item.score || item.amount_g_per_100g ||
               item.amount_mg_per_g;
    
    console.log('[BarChart] extractNumericValue:', { item, value, valueType: typeof value });
    
    // If value is an object (like a range or nested value), extract numeric value
    if (value && typeof value === 'object') {
      console.log('[BarChart] Value is object, extracting:', value);
      
      // Check for nested value property (e.g., {value: 0.1, unit: '...'})
      if (value.value !== undefined && typeof value.value === 'number') {
        console.log('[BarChart] Found nested value.value:', value.value);
        return value.value;
      }
      
      // For ranges: use optimal, mid-point, or max
      if (value.optimal !== undefined) return value.optimal;
      if (value.min !== undefined && value.max !== undefined) {
        const mid = (value.min + value.max) / 2;
        console.log('[BarChart] Using midpoint:', mid);
        return mid;
      }
      if (value.max !== undefined) return value.max;
      if (value.min !== undefined) return value.min;
    }
    
    // Ensure it's a number
    const result = typeof value === 'number' ? value : null;
    console.log('[BarChart] Final value:', result);
    return result;
  }

  normalizeData() {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      return [];
    }

    // Detect unit first
    const unit = this.detectUnit(this.data);

    // Extrahiere Werte (entweder direkt Zahlen oder aus Objekten)
    const values = this.data.map(item => {
      if (typeof item === 'number') return { value: item, label: null, unit };
      if (typeof item === 'object') {
        // Extract numeric value (handles ranges, objects, etc.)
        const value = this.extractNumericValue(item);
        
        // Flexible label extraction - shorten if needed
        let label = item.label || item.name || item.nutrient || item.compound || 
                   item.substrate || item.factor || item.month || item.period;
        
        // Shorten long labels
        if (label && label.length > 15) {
          label = label.replace(/_/g, ' ').split(' ').slice(0, 2).join(' ');
        }
        
        if (value !== null && value !== undefined) {
          return { value, label: label || 'Unknown', unit: item.unit || unit };
        }
      }
      return null;
    }).filter(Boolean);

    const nums = values.map(v => v.value);
    const max = Math.max(...nums);
    const min = Math.min(...nums);

    return values.map(({ value, label, unit }) => ({
      height: max > 0 ? (value / max) * 100 : 0,
      value,
      label,
      unit,
      formattedValue: this.formatValue(value, unit)
    }));
  }

  render() {
    const bars = this.normalizeData();
    
    console.log('[BarChart] Rendering bars:', bars.length, bars.map(b => ({ label: b.label, value: b.value })));
    
    if (bars.length === 0) {
      return html``;
    }

    const values = bars.map(b => b.value);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const unit = bars[0]?.unit || '';

    return html`
      <div class="chart-wrapper">
        <div class="chart-container">
          ${bars.map(bar => html`
            <div class="bar-wrapper">
              <div class="bar" style="height: ${bar.height}%">
                <div class="bar-value">
                  ${bar.formattedValue}
                </div>
              </div>
              <div class="bar-label">
                ${bar.label}
              </div>
            </div>
          `)}
        </div>
        <div class="chart-info">
          <span>Max: ${this.formatValue(max, unit)}</span>
        <span>Avg: ${avg.toFixed(0)}</span>
      </div>
    `;
  }
}

customElements.define('bar-chart-morph', BarChartMorph);
