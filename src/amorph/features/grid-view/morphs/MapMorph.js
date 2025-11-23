/**
 * 🗺️ MAP MORPH
 * ============
 * 
 * Geographic visualization morph (Leaflet integration)
 * 
 * Features:
 * - Interactive map
 * - Markers for entity locations
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
import { globalStyles } from './tokens.js';

export class MapMorph extends LitElement {
  static properties = {
    data: { type: Array },
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
        font-family: var(--font-sans);
      }

      .map-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%);
        border-radius: 12px;
        border: 1px solid rgba(16, 185, 129, 0.2);
      }

      .location-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        transition: all 0.2s ease;
      }

      .location-item:hover {
        background: rgba(16, 185, 129, 0.2);
        transform: translateY(-2px);
      }

      .location-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .location-name {
        flex: 1;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .map-empty {
        padding: 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
    this.locations = [];
    this.zoom = 10;
    this.center = { lat: 51.505, lng: -0.09 };
    this.perspectives = [];
    this.label = '';
  }

  normalizeData() {
    const source = this.data || this.locations;
    if (!Array.isArray(source) || source.length === 0) return [];

    return source.map(item => {
      const lat = item.location?.latitude || item.location?.lat || item.lat || 0;
      const lng = item.location?.longitude || item.location?.lng || item.lng || 0;
      // Extract name from various possible fields
      const name = item.region || item.name || item.location?.region || item.location?.name || item.label || 'Unknown Location';
      return { lat, lng, name };
    }).filter(loc => loc.lat !== 0 || loc.lng !== 0);
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
   * Convert lat/lng to SVG coordinates (Mercator projection)
   */
  latLngToSVG(lat, lng, width = 400, height = 200) {
    // Mercator projection
    const x = ((lng + 180) / 360) * width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (height / 2) - (width * mercN) / (2 * Math.PI);
    
    return { x: Math.max(0, Math.min(width, x)), y: Math.max(0, Math.min(height, y)) };
  }

  /**
   * Generate simplified world map path
   */
  getWorldPath() {
    // Simplified continents outline (very basic)
    return `
      M 50,80 L 120,70 L 180,85 L 200,75 L 220,80 L 240,70 L 260,75 L 280,80 L 290,90 L 280,100 L 260,105 L 240,100 L 220,105 L 200,100 L 180,105 L 160,100 L 140,105 L 120,100 L 100,105 L 80,100 L 60,95 Z
      M 50,120 L 80,115 L 100,120 L 120,115 L 140,120 L 160,125 L 180,120 L 200,125 L 220,130 L 240,125 L 260,130 L 280,135 L 300,130 L 320,135 L 340,140 L 340,155 L 320,160 L 300,155 L 280,160 L 260,155 L 240,160 L 220,155 L 200,160 L 180,155 L 160,160 L 140,155 L 120,160 L 100,155 L 80,160 L 60,155 L 50,150 Z
    `;
  }

  render() {
    const items = this.normalizeData();
    
    if (items.length === 0) {
      return html`<div class="map-empty">No locations</div>`;
    }
    
    return html`
      <div class="map-container">
        ${items.map(loc => html`
          <div class="location-item" title="${loc.lat.toFixed(2)}, ${loc.lng.toFixed(2)}">
            <span class="location-icon">📍</span>
            <span class="location-name">${loc.name}</span>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('map-morph', MapMorph);
export default MapMorph;
