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
      }

      .chart-container {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 60px;
        padding: var(--space-xs) 0;
      }

      .bar {
        flex: 1;
        background: linear-gradient(180deg, var(--color-culinary), var(--color-cultivation));
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        transition: all var(--transition-fast);
        cursor: pointer;
        position: relative;
        min-width: 8px;
      }

      .bar:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }

      .bar-label {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        white-space: nowrap;
        opacity: 0;
        transition: opacity var(--transition-fast);
        pointer-events: none;
        margin-bottom: 4px;
      }

      .bar:hover .bar-label {
        opacity: 1;
      }

      .chart-info {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.4);
        margin-top: var(--space-xs);
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
  }

  normalizeData() {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      return [];
    }

    // Extrahiere Werte (entweder direkt Zahlen oder aus Objekten)
    const values = this.data.map(item => {
      if (typeof item === 'number') return { value: item, label: null };
      if (typeof item === 'object' && item.value !== undefined) {
        return { value: item.value, label: item.label || item.name };
      }
      return null;
    }).filter(Boolean);

    const nums = values.map(v => v.value);
    const max = Math.max(...nums);
    const min = Math.min(...nums);

    return values.map(({ value, label }) => ({
      height: max > 0 ? (value / max) * 100 : 0,
      value,
      label
    }));
  }

  render() {
    const bars = this.normalizeData();
    
    if (bars.length === 0) {
      return html``;
    }

    const values = bars.map(b => b.value);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return html`
      <div class="chart-container">
        ${bars.map(bar => html`
          <div class="bar" style="height: ${bar.height}%">
            <div class="bar-label">
              ${bar.label || bar.value}
            </div>
          </div>
        `)}
      </div>
      <div class="chart-info">
        <span>Max: ${max.toFixed(0)}</span>
        <span>Avg: ${avg.toFixed(0)}</span>
      </div>
    `;
  }
}

customElements.define('bar-chart-morph', BarChartMorph);
