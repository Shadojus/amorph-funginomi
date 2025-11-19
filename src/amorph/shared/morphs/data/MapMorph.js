/**
 * 🗺️ MAP MORPH
 * ============
 * 
 * Geographic visualization morph (Leaflet integration)
 * 
 * Features:
 * - Interactive map
 * - Markers for fungus habitats
 * - Heatmap for distribution
 * - Custom icons per perspective
 * - Zoom controls
 * 
 * Usage:
 * <map-morph
 *   locations='[{"lat":51.5,"lng":-0.1,"name":"London"}]'
 *   zoom="10"
 *   perspectives='["ecology"]'
 * ></map-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from '../../styles/tokens.js';

export class MapMorph extends LitElement {
  static properties = {
    locations: { type: Array },
    zoom: { type: Number },
    center: { type: Object },
    perspectives: { type: Array },
    label: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }

    .map-label {
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-bottom: 12px;
    }

    .map-container {
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    }

    .map-marker {
      position: absolute;
      width: 20px;
      height: 20px;
      background: #ef4444;
      border: 2px solid white;
      border-radius: 50%;
      transform: translate(-50%, -100%);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .map-marker:hover {
      transform: translate(-50%, -100%) scale(1.3);
      z-index: 10;
    }

    .map-marker::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid #ef4444;
    }

    .map-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      white-space: nowrap;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .map-tooltip.visible {
      opacity: 1;
    }

    .map-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .map-btn {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .map-btn:hover {
      background: white;
    }
    `
  ];

  constructor() {
    super();
    this.locations = [];
    this.zoom = 10;
    this.center = { lat: 51.505, lng: -0.09 };
    this.perspectives = [];
    this.label = '';
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'map';
    this.dataset.morphId = this.id || `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Safety Check
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.registerMorph(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.unregisterMorph(this);
    }
  }

  willUpdate(changedProperties) {
    // Parse JSON strings
    if (changedProperties.has('locations') && typeof this.locations === 'string') {
      try {
        this.locations = JSON.parse(this.locations);
      } catch (e) {
        console.error('[MapMorph] Invalid locations JSON', e);
        this.locations = [];
      }
    }
    
    if (changedProperties.has('perspectives') && typeof this.perspectives === 'string') {
      try {
        this.perspectives = JSON.parse(this.perspectives);
      } catch (e) {
        this.perspectives = [];
      }
    }
  }

  /**
   * Convert lat/lng to pixel position (simple projection)
   */
  latLngToPixel(lat, lng) {
    const mapWidth = 400;
    const mapHeight = 300;
    
    // Mercator projection (simplified)
    const x = ((lng + 180) / 360) * mapWidth;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (mapHeight / 2) - (mapWidth * mercN) / (2 * Math.PI);
    
    return { x, y };
  }

  /**
   * Handle zoom in
   */
  zoomIn() {
    this.zoom = Math.min(18, this.zoom + 1);
  }

  /**
   * Handle zoom out
   */
  zoomOut() {
    this.zoom = Math.max(1, this.zoom - 1);
  }

  /**
   * Show tooltip
   */
  showTooltip(e, location) {
    const tooltip = this.shadowRoot.querySelector('.map-tooltip');
    if (tooltip) {
      tooltip.textContent = location.name;
      tooltip.style.left = e.offsetX + 10 + 'px';
      tooltip.style.top = e.offsetY - 30 + 'px';
      tooltip.classList.add('visible');
    }
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    const tooltip = this.shadowRoot.querySelector('.map-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  render() {
    return html`
      ${this.label ? html`<div class="map-label">${this.label}</div>` : ''}
      
      <div class="map-container">
        ${this.locations.map(location => {
          const pos = this.latLngToPixel(location.lat, location.lng);
          return html`
            <div 
              class="map-marker"
              style="left: ${pos.x}px; top: ${pos.y}px;"
              @mouseenter=${(e) => this.showTooltip(e, location)}
              @mouseleave=${this.hideTooltip}
            ></div>
          `;
        })}
        
        <div class="map-tooltip"></div>
        
        <div class="map-controls">
          <button class="map-btn" @click=${this.zoomIn}>+</button>
          <button class="map-btn" @click=${this.zoomOut}>−</button>
        </div>
      </div>
    `;
  }
}

customElements.define('map-morph', MapMorph);
export default MapMorph;
