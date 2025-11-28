/**
 * 🗺️ DETAIL MAP MORPH
 * ====================
 * 
 * Premium geographic visualization for detail pages.
 * Uses Leaflet-like styling without actual map integration.
 * 
 * Features:
 * - Location cards with coordinates
 * - Glassmorphism styling
 * - Hover animations
 * - Container queries for responsive layout
 * 
 * Usage:
 * <detail-map-morph 
 *   data='[{"region": "Europe", "location": {"latitude": 51.5, "longitude": -0.1}}]'
 * ></detail-map-morph>
 */

import { LitElement, html, css } from 'lit';

export class MapMorph extends LitElement {
  static properties = {
    data: { type: Array },
    locations: { type: Array },
    label: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
    }

    .map-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      padding: 16px;
      background: linear-gradient(
        135deg,
        rgba(16, 185, 129, 0.1) 0%,
        rgba(5, 150, 105, 0.15) 100%
      );
      border-radius: 16px;
      border: 1px solid rgba(16, 185, 129, 0.3);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .location-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: default;
      position: relative;
      overflow: hidden;
    }

    .location-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(16, 185, 129, 0.15) 0%,
        transparent 50%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .location-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
    }

    .location-card:hover::before {
      opacity: 1;
    }

    .location-header {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .location-icon {
      font-size: 24px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .location-name {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.3;
    }

    .location-coords {
      font-size: 11px;
      color: rgba(16, 185, 129, 0.8);
      font-family: 'SF Mono', Monaco, monospace;
      padding: 6px 8px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      position: relative;
      z-index: 1;
    }

    .coord-label {
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }

    .coord-value {
      color: rgba(255, 255, 255, 0.85);
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .empty-icon {
      font-size: 32px;
      opacity: 0.5;
    }

    /* Container queries for responsive behavior */
    @container (max-width: 300px) {
      .map-container {
        grid-template-columns: 1fr;
        padding: 12px;
        gap: 8px;
      }

      .location-card {
        padding: 10px;
      }

      .location-icon {
        font-size: 20px;
      }
    }

    @container (min-width: 500px) {
      .map-container {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }
  `;

  constructor() {
    super();
    this.data = [];
    this.locations = [];
    this.label = '';
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register with AMORPH system
    this.dataset.morph = 'true';
    this.dataset.morphType = 'detail-map';
    this.dataset.morphId = this.id || `detail-map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
    if (changedProperties.has('data') && typeof this.data === 'string') {
      try {
        this.data = JSON.parse(this.data);
      } catch (e) {
        console.error('[DetailMapMorph] Invalid data JSON:', e);
        this.data = [];
      }
    }
    
    if (changedProperties.has('locations') && typeof this.locations === 'string') {
      try {
        this.locations = JSON.parse(this.locations);
      } catch (e) {
        console.error('[DetailMapMorph] Invalid locations JSON:', e);
        this.locations = [];
      }
    }
  }

  normalizeData() {
    const source = this.data || this.locations;
    if (!Array.isArray(source) || source.length === 0) return [];

    return source.map(item => {
      const loc = item.location || item;
      const lat = loc.latitude || loc.lat || 0;
      const lng = loc.longitude || loc.lng || loc.lon || 0;
      const name = item.region || item.name || loc.region || loc.name || 'Unknown Location';
      
      return { lat, lng, name };
    }).filter(loc => loc.lat !== 0 || loc.lng !== 0);
  }

  formatCoord(value, type) {
    const absVal = Math.abs(value).toFixed(4);
    if (type === 'lat') {
      return value >= 0 ? `${absVal}°N` : `${absVal}°S`;
    }
    return value >= 0 ? `${absVal}°E` : `${absVal}°W`;
  }

  render() {
    const items = this.normalizeData();
    
    if (items.length === 0) {
      return html`
        <div class="empty-state">
          <span class="empty-icon">🗺️</span>
          <span>No location data available</span>
        </div>
      `;
    }
    
    return html`
      <div class="map-container">
        ${items.map(loc => html`
          <div class="location-card">
            <div class="location-header">
              <span class="location-icon">📍</span>
              <span class="location-name">${loc.name}</span>
            </div>
            <div class="location-coords">
              <span class="coord-label">LAT</span>
              <span class="coord-value">${this.formatCoord(loc.lat, 'lat')}</span>
              <span class="coord-label">LNG</span>
              <span class="coord-value">${this.formatCoord(loc.lng, 'lng')}</span>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('detail-map-morph', MapMorph);
export default MapMorph;
