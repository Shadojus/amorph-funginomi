/**
 * 🎯 RADAR CHART MORPH (Detail View) v3.0
 * 
 * Based on working grid-view implementation!
 * Uses HTML labels with absolute positioning (like grid-view)
 * 
 * Input: [{axis: "Flavor", value: 80}, ...]
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
        --local-perspective-color: var(--perspective-color, #8b5cf6);
        container-type: inline-size;
        container-name: radarchart;
      }

      .chart-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .radar-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        max-width: 280px;
        margin: 0 auto;
        isolation: isolate;
      }
      
      @container radarchart (min-width: 300px) {
        .radar-container {
          max-width: 320px;
        }
      }
      
      /* HTML Labels - positioned absolutely like grid-view */
      .label-group,
      .value-group {
        position: absolute;
        transform: translate(-50%, -50%);
        text-align: center;
        pointer-events: none;
        z-index: 20;
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
          0 0 4px #000;
        white-space: nowrap;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      
      @container radarchart (min-width: 280px) {
        .radar-label-html {
          font-size: 11px;
        }
      }

      .radar-value-html {
        font-size: 11px;
        font-weight: 700;
        color: var(--local-perspective-color) !important;
        text-shadow: 
          -1px -1px 0 #000,  
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 4px #000;
        white-space: nowrap;
        line-height: 1;
      }
      
      @container radarchart (min-width: 280px) {
        .radar-value-html {
          font-size: 13px;
        }
      }

      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 8px rgba(139, 92, 246, 0.25));
        position: relative;
        z-index: 10;
      }

      .radar-grid {
        fill: none;
        stroke: var(--local-perspective-color);
        opacity: 0.25;
        stroke-width: 1;
      }

      .radar-shape {
        fill: var(--local-perspective-color);
        fill-opacity: 0.35;
        stroke: var(--local-perspective-color);
        stroke-opacity: 0.9;
        stroke-width: 2.5;
        stroke-linejoin: round;
        filter: drop-shadow(0 0 6px var(--local-perspective-color));
      }

      .radar-point {
        fill: var(--local-perspective-color);
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 2;
        filter: drop-shadow(0 0 4px var(--local-perspective-color));
      }

      .empty-state {
        color: rgba(255, 255, 255, 0.35);
        font-style: italic;
        font-size: 0.8125rem;
        text-align: center;
        padding: 1rem;
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
    console.log('[Detail-RadarChart] connectedCallback, data:', this.data);
    
    if (this.perspective) {
      const color = getPerspectiveColor(this.perspective);
      this.style.setProperty('--local-perspective-color', color);
    }
    if (this.color) {
      this.style.setProperty('--local-perspective-color', this.color);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('data')) {
      console.log('[Detail-RadarChart] data updated:', this.data);
    }
  }

  unwrapCitedValue(value) {
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  }

  normalizeData() {
    const rawData = this.unwrapCitedValue(this.data);
    
    console.log('[Detail-RadarChart] normalizeData input:', rawData, 'type:', typeof rawData, 'isArray:', Array.isArray(rawData));
    
    // Handle object format: { key: value, ... }
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      const entries = Object.entries(rawData)
        .filter(([_, v]) => typeof v === 'number');
      
      console.log('[Detail-RadarChart] Object entries:', entries);
      
      if (entries.length === 0) {
        console.log('[Detail-RadarChart] No numeric entries found in object');
        return [];
      }
      
      const maxRaw = Math.max(...entries.map(([_, v]) => v));
      const is0to10Scale = maxRaw <= 10;
      
      console.log('[Detail-RadarChart] maxRaw:', maxRaw, 'is0to10Scale:', is0to10Scale);
      
      const items = entries.map(([key, rawValue]) => ({
        label: this.formatLabel(key),
        value: is0to10Scale ? rawValue * 10 : Math.max(0, Math.min(100, rawValue)),
        rawValue: rawValue
      }));
      
      console.log('[Detail-RadarChart] Normalized items from object:', items);
      return items.slice(0, 12);
    }

    // Handle array format
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.log('[Detail-RadarChart] Not an array or empty');
      return [];
    }

    const rawValues = rawData.map(item => {
      if (typeof item === 'object') {
        return item.value || item.score || item.rating || 
               item.strength || item.intensity || item.difficulty || 0;
      }
      return 0;
    });
    
    const maxRaw = Math.max(...rawValues);
    const isPercentage = maxRaw <= 10;
    
    console.log('[Detail-RadarChart] Array rawValues:', rawValues, 'maxRaw:', maxRaw);

    const items = rawData
      .map(item => {
        if (typeof item === 'object') {
          const rawValue = item.value || item.score || item.rating || 
                          item.strength || item.intensity || item.difficulty || 0;
          const value = isPercentage ? rawValue * 10 : Math.max(0, Math.min(100, rawValue));
          
          let label = item.axis || item.dimension || item.category || 
                     item.factor || item.label || item.name || 'Unknown';
          label = this.formatLabel(label);
          
          return { label, value, rawValue };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 12);
    
    console.log('[Detail-RadarChart] Normalized items from array:', items);
    return items;
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
    const labelRadius = radius + 30;
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
    
    console.log('[Detail-RadarChart] render() items:', items.length, items);
    
    if (items.length < 3) {
      console.log('[Detail-RadarChart] Less than 3 items, showing empty state');
      return html`<div class="empty-state">Need at least 3 data points (got ${items.length})</div>`;
    }

    // Same size as grid-view
    const size = 280;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 55;

    const gridPath = this.generateGridPath(centerX, centerY, radius, items.length);
    const dataPath = this.generateDataPath(items, centerX, centerY, radius);

    console.log('[Detail-RadarChart] Rendering chart with', items.length, 'axes');

    return html`
      ${this.label ? html`<div class="chart-label">${this.label}</div>` : ''}
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
              <circle class="radar-point" cx="${pt.x}" cy="${pt.y}" r="4" />
            `;
          })}
        </svg>
        
        <!-- HTML Labels positioned absolutely (like grid-view!) -->
        ${items.map((item, i) => {
          const pos = this.calculateLabelPoint(i, items.length, centerX, centerY, radius);
          const svgRect = size;
          const labelX = (pos.x / svgRect) * 100;
          const labelY = ((pos.y - 8) / svgRect) * 100;
          const valueY = ((pos.y + 8) / svgRect) * 100;
          
          console.log('[Detail-RadarChart] Label', i, item.label, 'at', labelX.toFixed(1) + '%', labelY.toFixed(1) + '%');
          
          return html`
            <div class="label-group" style="
              left: ${labelX}%;
              top: ${labelY}%;
            ">
              <div class="radar-label-html">${item.label}</div>
            </div>
            <div class="value-group" style="
              left: ${labelX}%;
              top: ${valueY}%;
            ">
              <div class="radar-value-html">
                ${typeof item.rawValue === 'number' ? item.rawValue.toFixed(1) : item.rawValue}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

// Register with detail- prefix for detail pages
customElements.define('detail-radar-chart-morph', RadarChartMorph);
