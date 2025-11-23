/**
 * 🥧 PIE CHART MORPH - Datengetrieben
 * 
 * Zeigt Verteilungen als Donut-Chart
 * REIN DATENGETRIEBEN - Erkennt Arrays mit Kategorien
 * 
 * Input: [{category: "A", count: 10}, {category: "B", count: 20}]
 * Output: Donut-Diagramm mit Prozent-Anzeige
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class PieChartMorph extends LitElement {
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

      .pie-container {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }

      .pie-chart {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: conic-gradient(from 0deg, var(--segments));
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .pie-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        border: 2px solid rgba(255, 255, 255, 0.1);
      }
      
      .pie-center-label {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .pie-legend {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
      }

      .legend-color {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .legend-label {
        flex: 1;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .legend-value {
        color: rgba(255, 255, 255, 0.7);
        font-variant-numeric: tabular-nums;
        font-weight: 700;
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
  }

  colors = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // orange
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#ec4899', // pink
  ];

  normalizeData() {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      return [];
    }

    const items = this.data.map(item => {
      if (typeof item === 'object') {
        const value = item.value || item.count || item.amount || 0;
        const label = item.label || item.name || item.category || 'Unknown';
        return { label, value };
      }
      return null;
    }).filter(Boolean);

    const total = items.reduce((sum, item) => sum + item.value, 0);

    return items.map((item, i) => ({
      ...item,
      percent: total > 0 ? (item.value / total) * 100 : 0,
      color: this.colors[i % this.colors.length]
    }));
  }

  generateConicGradient(segments) {
    let currentAngle = 0;
    const parts = segments.map(seg => {
      const start = currentAngle;
      currentAngle += (seg.percent / 100) * 360;
      return `${seg.color} ${start}deg ${currentAngle}deg`;
    });
    return parts.join(', ');
  }

  render() {
    const segments = this.normalizeData();
    
    if (segments.length === 0) {
      return html``;
    }

    const gradient = this.generateConicGradient(segments);
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    return html`
      <div class="pie-container">
        <div class="pie-chart" style="--segments: ${gradient}">
          <div class="pie-center">
            ${total.toFixed(0)}
            <div class="pie-center-label">Total</div>
          </div>
        </div>
        <div class="pie-legend">
          ${segments.map(seg => html`
            <div class="legend-item">
              <div class="legend-color" style="background: ${seg.color}"></div>
              <div class="legend-label">${seg.label}</div>
              <div class="legend-value">${seg.percent.toFixed(0)}%</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('pie-chart-morph', PieChartMorph);
