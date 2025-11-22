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
      }

      .pie-container {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }

      .pie-chart {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: conic-gradient(from 0deg, var(--segments));
        flex-shrink: 0;
      }

      .pie-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.6);
      }

      .pie-legend {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        flex: 1;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: var(--font-size-xs);
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .legend-label {
        flex: 1;
        color: rgba(255, 255, 255, 0.7);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .legend-value {
        color: rgba(255, 255, 255, 0.5);
        font-variant-numeric: tabular-nums;
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
          <div class="pie-center">${segments.length}</div>
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
