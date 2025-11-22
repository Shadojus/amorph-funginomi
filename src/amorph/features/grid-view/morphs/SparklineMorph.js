/**
 * 📈 SPARKLINE MORPH - Datengetrieben
 * 
 * Zeigt Trends als Mini-Liniendiagramm (Sparkline)
 * REIN DATENGETRIEBEN - Erkennt numerische Arrays
 * 
 * Input: [10, 20, 15, 25, 30, 28, 35]
 * Output: Kompakte Trendlinie mit Gradient-Fill
 */

import { LitElement, html, css, svg } from 'lit';
import { globalStyles } from './tokens.js';

export class SparklineMorph extends LitElement {
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

      .sparkline-container {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      svg {
        width: 100%;
        height: 40px;
        flex: 1;
      }

      .sparkline-path {
        fill: none;
        stroke: var(--color-culinary);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .sparkline-area {
        fill: url(#sparkline-gradient);
        opacity: 0.3;
      }

      .sparkline-stats {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.5);
        min-width: 40px;
        text-align: right;
      }

      .trend-up {
        color: var(--color-culinary);
      }

      .trend-down {
        color: var(--color-safety);
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

    // Nur Zahlen extrahieren
    const numbers = this.data
      .map(item => typeof item === 'number' ? item : (item?.value || item?.count))
      .filter(n => typeof n === 'number');

    if (numbers.length === 0) return [];

    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    const range = max - min || 1;

    return numbers.map((value, i) => ({
      x: (i / (numbers.length - 1)) * 100,
      y: 100 - ((value - min) / range) * 100,
      value
    }));
  }

  generatePath(points) {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  }

  generateAreaPath(points) {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} 100 L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    path += ` L ${points[points.length - 1].x} 100 Z`;
    return path;
  }

  calculateTrend(points) {
    if (points.length < 2) return 0;
    const first = points[0].value;
    const last = points[points.length - 1].value;
    return ((last - first) / first) * 100;
  }

  render() {
    const points = this.normalizeData();
    
    if (points.length === 0) {
      return html``;
    }

    const linePath = this.generatePath(points);
    const areaPath = this.generateAreaPath(points);
    const trend = this.calculateTrend(points);
    const trendClass = trend >= 0 ? 'trend-up' : 'trend-down';
    const trendIcon = trend >= 0 ? '↗' : '↘';

    const values = points.map(p => p.value);
    const max = Math.max(...values);
    const min = Math.min(...values);

    return html`
      <div class="sparkline-container">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: var(--color-culinary); stop-opacity: 0.5" />
              <stop offset="100%" style="stop-color: var(--color-culinary); stop-opacity: 0" />
            </linearGradient>
          </defs>
          <path class="sparkline-area" d="${areaPath}" />
          <path class="sparkline-path" d="${linePath}" />
        </svg>
        <div class="sparkline-stats">
          <div>${max.toFixed(0)}</div>
          <div class="${trendClass}">${trendIcon}${Math.abs(trend).toFixed(0)}%</div>
          <div>${min.toFixed(0)}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('sparkline-morph', SparklineMorph);
