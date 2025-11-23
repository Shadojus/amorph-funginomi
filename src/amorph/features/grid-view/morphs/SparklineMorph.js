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
        background: rgba(0, 0, 0, 0.3);
        border-radius: var(--radius-md);
        padding: var(--space-md);
      }

      .sparkline-container {
        display: flex;
        align-items: center;
        gap: var(--space-md);
      }

      svg {
        width: 100%;
        height: 60px;
        flex: 1;
      }

      .sparkline-path {
        fill: none;
        stroke: rgba(16, 185, 129, 0.9);
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4));
      }

      .sparkline-area {
        fill: url(#sparkline-gradient);
        opacity: 0.4;
      }

      .sparkline-stats {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 11px;
        min-width: 50px;
        text-align: right;
      }
      
      .stat-label {
        color: rgba(255, 255, 255, 0.5);
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .stat-value {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 700;
        font-size: 13px;
      }

      .trend-up {
        color: rgba(16, 185, 129, 1);
      }

      .trend-down {
        color: rgba(239, 68, 68, 1);
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
              <stop offset="0%" style="stop-color: rgba(16, 185, 129, 1); stop-opacity: 0.6" />
              <stop offset="100%" style="stop-color: rgba(16, 185, 129, 1); stop-opacity: 0" />
            </linearGradient>
          </defs>
          <path class="sparkline-area" d="${areaPath}" />
          <path class="sparkline-path" d="${linePath}" />
        </svg>
        <div class="sparkline-stats">
          <div>
            <div class="stat-label">Max</div>
            <div class="stat-value">${max.toFixed(0)}</div>
          </div>
          <div>
            <div class="stat-label">Trend</div>
            <div class="stat-value ${trendClass}">${trendIcon}${Math.abs(trend).toFixed(0)}%</div>
          </div>
          <div>
            <div class="stat-label">Min</div>
            <div class="stat-value">${min.toFixed(0)}</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('sparkline-morph', SparklineMorph);
