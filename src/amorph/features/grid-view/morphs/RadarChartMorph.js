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
        background: rgba(0, 0, 0, 0.3);
        border-radius: var(--radius-md);
        padding: var(--space-md);
      }

      .radar-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        max-width: 360px;
        margin: 0 auto;
        isolation: isolate;
      }
      
      .label-group,
      .value-group {
        pointer-events: none;
      }

      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3));
        position: relative;
        z-index: 10;
      }

      .radar-grid {
        fill: none;
        stroke: rgba(16, 185, 129, 0.25);
        stroke-width: 1.5;
      }

      .radar-shape {
        fill: rgba(16, 185, 129, 0.35);
        stroke: rgba(16, 185, 129, 0.9);
        stroke-width: 3;
        stroke-linejoin: round;
      }

      .radar-label-html {
        font-size: 12px;
        font-weight: 700;
        color: white !important;
        text-shadow: 
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 4px #000,
          0 0 8px #000;
        white-space: nowrap;
        line-height: 1;
      }

      .radar-value-html {
        font-size: 14px;
        font-weight: 700;
        color: rgb(16, 185, 129) !important;
        text-shadow: 
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 4px #000,
          0 0 8px #000;
        white-space: nowrap;
        line-height: 1;
      }

      .radar-point {
        fill: rgba(16, 185, 129, 1);
        stroke: rgba(255, 255, 255, 0.8);
        stroke-width: 2;
      }
      
      .chart-title {
        text-align: center;
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

  normalizeData() {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      return [];
    }

    // Detect value range to normalize properly
    const rawValues = this.data.map(item => {
      if (typeof item === 'object') {
        return item.value || item.score || item.rating || 
               item.strength || item.intensity || item.difficulty || 0;
      }
      return 0;
    });
    
    const maxRaw = Math.max(...rawValues);
    const isPercentage = maxRaw <= 10; // If max is ≤10, it's likely a 0-10 scale

    return this.data
      .map(item => {
        if (typeof item === 'object') {
          // Flexible value extraction
          const rawValue = item.value || item.score || item.rating || 
                          item.strength || item.intensity || item.difficulty || 0;
          // Normalize: if 0-10 scale, multiply by 10 to get 0-100
          const value = isPercentage ? rawValue * 10 : Math.max(0, Math.min(100, rawValue));
          
          // Flexible label extraction - shorten long labels
          let label = item.axis || item.dimension || item.category || 
                     item.factor || item.label || item.name || 'Unknown';
          // Shorten long labels (e.g., "anti_inflammatory" → "Anti-Inflam")
          if (label.length > 12) {
            label = label.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1, 6)).join(' ');
          }
          
          return { label, value, rawValue };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 12); // Max 12 Achsen
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
    const labelRadius = radius + 25;
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
    
    console.log('[RadarChart] Rendering with items:', items.length, items);
    
    if (items.length < 3) {
      return html`<div style="font-size: 12px; color: rgba(255,255,255,0.5); padding: 20px; text-align: center;">Need 3+ axes</div>`;
    }

    const size = 280;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 55;

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
          
          <!-- Data Points -->
          ${items.map((item, i) => {
            const pt = this.calculatePoint(i, items.length, item.value, centerX, centerY, radius);
            return html`
              <circle class="radar-point" cx="${pt.x}" cy="${pt.y}" r="3.5" />
            `;
          })}
          
          <!-- Labels - Outside SVG for better visibility -->
        </svg>
        
        <!-- HTML Labels positioned absolutely -->
        ${items.map((item, i) => {
          const pos = this.calculateLabelPoint(i, items.length, centerX, centerY, radius);
          const svgRect = size;
          const labelX = (pos.x / svgRect) * 100;
          const labelY = ((pos.y - 8) / svgRect) * 100;
          const valueY = ((pos.y + 8) / svgRect) * 100;
          
          return html`
            <div class="label-group" style="
              position: absolute;
              left: ${labelX}%;
              top: ${labelY}%;
              transform: translate(-50%, -50%);
              text-align: center;
              pointer-events: none;
              z-index: 10;
            ">
              <div class="radar-label-html">${item.label}</div>
            </div>
            <div class="value-group" style="
              position: absolute;
              left: ${labelX}%;
              top: ${valueY}%;
              transform: translate(-50%, -50%);
              text-align: center;
              pointer-events: none;
              z-index: 10;
            ">
              <div class="radar-value-html">
                ${item.rawValue !== undefined ? item.rawValue.toFixed(1) : Math.round(item.value)}
              </div>
            </div>
          `;
        })}
        </svg>
      </div>
    `;
  }
}

customElements.define('radar-chart-morph', RadarChartMorph);
