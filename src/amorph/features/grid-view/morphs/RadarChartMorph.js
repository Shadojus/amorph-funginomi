/**
 * 🎯 RADAR CHART MORPH - Datengetrieben
 * 
 * Zeigt mehrdimensionale Daten als Radar/Spider-Chart
 * REIN DATENGETRIEBEN - Perfekt für Eigenschaften-Profile
 * 
 * Input: [{axis: "Flavor", value: 80}, {axis: "Potency", value: 60}, ...]
 * Output: Kompakter Radar-Chart mit 3-6 Achsen
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class RadarChartMorph extends LitElement {
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

      .radar-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        max-width: 160px;
        margin: 0 auto;
      }

      svg {
        width: 100%;
        height: 100%;
      }

      .radar-grid {
        fill: none;
        stroke: rgba(255, 255, 255, 0.1);
        stroke-width: 1;
      }

      .radar-shape {
        fill: var(--color-culinary);
        fill-opacity: 0.2;
        stroke: var(--color-culinary);
        stroke-width: 2;
        stroke-linejoin: round;
      }

      .radar-label {
        font-size: 11px;
        fill: rgba(255, 255, 255, 0.7);
        text-anchor: middle;
        dominant-baseline: middle;
      }

      .radar-value {
        font-size: 10px;
        fill: rgba(255, 255, 255, 0.5);
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

    return this.data
      .map(item => {
        if (typeof item === 'object') {
          const value = item.value || item.score || item.rating || 0;
          const label = item.axis || item.label || item.name || 'Unknown';
          return { label, value: Math.max(0, Math.min(100, value)) };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 6); // Max 6 Achsen für Lesbarkeit
  }

  calculatePoint(index, total, value, centerX, centerY, radius) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    };
  }

  calculateLabelPoint(index, total, centerX, centerY, radius) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const labelRadius = radius + 15;
    return {
      x: centerX + Math.cos(angle) * labelRadius,
      y: centerY + Math.sin(angle) * labelRadius
    };
  }

  generateGridPath(centerX, centerY, radius, points) {
    if (points === 0) return '';
    
    let path = '';
    for (let level = 1; level <= 3; level++) {
      const r = (radius / 3) * level;
      const levelPoints = [];
      
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
        levelPoints.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r
        });
      }
      
      path += `M ${levelPoints[0].x} ${levelPoints[0].y} `;
      for (let i = 1; i < levelPoints.length; i++) {
        path += `L ${levelPoints[i].x} ${levelPoints[i].y} `;
      }
      path += 'Z ';
    }
    
    return path;
  }

  generateDataPath(items, centerX, centerY, radius) {
    if (items.length === 0) return '';
    
    const points = items.map((item, i) => 
      this.calculatePoint(i, items.length, item.value, centerX, centerY, radius)
    );
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ' Z';
    
    return path;
  }

  render() {
    const items = this.normalizeData();
    
    if (items.length < 3) {
      return html`<div style="font-size: 12px; color: rgba(255,255,255,0.5);">Need 3+ axes for radar</div>`;
    }

    const size = 160;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 25;

    const gridPath = this.generateGridPath(centerX, centerY, radius, items.length);
    const dataPath = this.generateDataPath(items, centerX, centerY, radius);

    return html`
      <div class="radar-container">
        <svg viewBox="0 0 ${size} ${size}">
          <!-- Grid -->
          <path class="radar-grid" d="${gridPath}" />
          
          <!-- Axes -->
          ${items.map((_, i) => {
            const end = this.calculatePoint(i, items.length, 100, centerX, centerY, radius);
            return html`
              <line
                class="radar-grid"
                x1="${centerX}" y1="${centerY}"
                x2="${end.x}" y2="${end.y}"
              />
            `;
          })}
          
          <!-- Data Shape -->
          <path class="radar-shape" d="${dataPath}" />
          
          <!-- Labels -->
          ${items.map((item, i) => {
            const pos = this.calculateLabelPoint(i, items.length, centerX, centerY, radius);
            return html`
              <text class="radar-label" x="${pos.x}" y="${pos.y}">
                ${item.label}
              </text>
            `;
          })}
        </svg>
      </div>
    `;
  }
}

customElements.define('radar-chart-morph', RadarChartMorph);
