/**
 * 🎯 RADAR CHART MORPH (Detail View)
 * 
 * Zeigt mehrdimensionale Daten als Radar/Spider-Chart
 * REIN DATENGETRIEBEN - Perfekt für Eigenschaften-Profile
 * 
 * Input: [{axis: "Flavor", value: 80}, {axis: "Potency", value: 60}, ...]
 *   OR:  { flavor: 80, potency: 60, ... }
 * Output: Kompakter Radar-Chart mit 3-12 Achsen
 */

import { LitElement, html, css } from 'lit';
import { globalStyles, getPerspectiveColor } from './tokens.js';

export class RadarChartMorph extends LitElement {
  static properties = {
    data: { type: Array },
    label: { type: String },
    perspective: { type: String },
    color: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        background: rgba(0, 0, 0, 0.3);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        --local-perspective-color: var(--perspective-color, #10b981);
        container-type: inline-size;
        container-name: radarchart;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .chart-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .radar-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        max-width: 200px;
        margin: 0 auto;
        isolation: isolate;
      }
      
      @container radarchart (min-width: 250px) {
        .radar-container {
          max-width: 280px;
        }
      }
      
      .label-group,
      .value-group {
        pointer-events: none;
      }

      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 6px rgba(16, 185, 129, 0.25));
        position: relative;
        z-index: 10;
      }

      .radar-grid {
        fill: none;
        stroke: var(--local-perspective-color);
        opacity: 0.25;
        stroke-width: 1;
      }

      .radar-axis {
        stroke: var(--local-perspective-color);
        stroke-opacity: 0.15;
        stroke-width: 1;
      }

      .radar-shape {
        fill: var(--local-perspective-color);
        fill-opacity: 0.35;
        stroke: var(--local-perspective-color);
        stroke-opacity: 0.9;
        stroke-width: 2;
        stroke-linejoin: round;
      }

      .radar-label-html {
        font-size: 9px;
        font-weight: 700;
        color: white !important;
        text-shadow: 
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 3px #000;
        white-space: nowrap;
        line-height: 1;
      }
      
      @container radarchart (min-width: 250px) {
        .radar-label-html {
          font-size: 11px;
        }
      }

      .radar-value-html {
        font-size: 10px;
        font-weight: 700;
        color: var(--local-perspective-color) !important;
        text-shadow: 
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 3px #000;
        white-space: nowrap;
        line-height: 1;
      }

      .radar-point {
        fill: var(--local-perspective-color);
        stroke: rgba(255, 255, 255, 0.8);
        stroke-width: 1.5;
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
    this.label = '';
    this.perspective = '';
    this.color = '';
  }

  connectedCallback() {
    super.connectedCallback();
    // Set perspective color if provided
    if (this.perspective) {
      const color = getPerspectiveColor(this.perspective);
      this.style.setProperty('--local-perspective-color', color);
    }
    if (this.color) {
      this.style.setProperty('--local-perspective-color', this.color);
    }
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

  normalizeData() {
    const rawData = this.unwrapCitedValue(this.data);
    
    // Handle object format: { key: value, ... }
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      const items = Object.entries(rawData)
        .filter(([_, v]) => typeof v === 'number')
        .map(([key, value]) => ({
          label: this.formatLabel(key),
          value: Math.max(0, Math.min(100, value)),
          rawValue: value
        }));
      return items.slice(0, 12);
    }

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    // Detect value range to normalize properly
    const rawValues = rawData.map(item => {
      if (typeof item === 'object') {
        return item.value || item.score || item.rating || 
               item.strength || item.intensity || item.difficulty || 0;
      }
      return 0;
    });
    
    const maxRaw = Math.max(...rawValues);
    const isPercentage = maxRaw <= 10; // If max is ≤10, it's likely a 0-10 scale

    return rawData
      .map(item => {
        if (typeof item === 'object') {
          // Flexible value extraction
          const rawValue = item.value || item.score || item.rating || 
                          item.strength || item.intensity || item.difficulty || 0;
          // Normalize: if 0-10 scale, multiply by 10 to get 0-100
          const value = isPercentage ? rawValue * 10 : Math.max(0, Math.min(100, rawValue));
          
          // Flexible label extraction
          let label = item.axis || item.dimension || item.category || 
                     item.factor || item.label || item.name || 'Unknown';
          label = this.formatLabel(label);
          
          return { label, value, rawValue };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 12);
  }

  formatLabel(label) {
    if (label.length > 12) {
      return label
        .replace(/_/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1, 6))
        .join(' ');
    }
    return label
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
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

  generateAxisPaths(centerX, centerY, radius, points) {
    const paths = [];
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      paths.push(`M ${centerX} ${centerY} L ${x} ${y}`);
    }
    return paths;
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
      return html``;
    }

    const viewBox = 200;
    const centerX = viewBox / 2;
    const centerY = viewBox / 2;
    const radius = 60;

    const gridPath = this.generateGridPath(centerX, centerY, radius, items.length);
    const axisPaths = this.generateAxisPaths(centerX, centerY, radius, items.length);
    const dataPath = this.generateDataPath(items, centerX, centerY, radius);

    const dataPoints = items.map((item, i) => 
      this.calculatePoint(i, items.length, item.value, centerX, centerY, radius)
    );

    const labelPositions = items.map((item, i) => 
      this.calculateLabelPoint(i, items.length, centerX, centerY, radius)
    );

    return html`
      ${this.label ? html`<div class="chart-label">${this.label}</div>` : ''}
      <div class="radar-container">
        <svg viewBox="0 0 ${viewBox} ${viewBox}">
          <!-- Grid -->
          <path class="radar-grid" d="${gridPath}"></path>
          
          <!-- Axes -->
          ${axisPaths.map(path => html`
            <path class="radar-axis" d="${path}"></path>
          `)}
          
          <!-- Data shape -->
          <path class="radar-shape" d="${dataPath}"></path>
          
          <!-- Data points -->
          ${dataPoints.map(point => html`
            <circle 
              class="radar-point" 
              cx="${point.x}" 
              cy="${point.y}" 
              r="4"
            ></circle>
          `)}
          
          <!-- Labels -->
          ${labelPositions.map((pos, i) => html`
            <foreignObject 
              x="${pos.x - 30}" 
              y="${pos.y - 8}" 
              width="60" 
              height="16"
            >
              <div 
                xmlns="http://www.w3.org/1999/xhtml" 
                class="radar-label-html"
                style="text-align: center"
              >${items[i].label}</div>
            </foreignObject>
          `)}
        </svg>
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('radar-chart-morph')) {
  customElements.define('radar-chart-morph', RadarChartMorph);
}
