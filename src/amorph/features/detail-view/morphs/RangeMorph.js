/**
 * 📊 RANGE MORPH (Detail View) v2.0
 * 
 * Premium range visualization with animated bar and markers.
 * Shows min/max/optimal values with glowing effects.
 * 
 * Features:
 * - Glassmorphism container
 * - Animated gradient bar
 * - Pulsing optimal marker
 * - Smart unit display
 * - Perspective color inheritance
 * 
 * Input: { min: 15, max: 25, optimal: 20, unit: "°C" }
 * Output: Visueller Balken mit Marker
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class RangeMorph extends LitElement {
  static properties = {
    data: { type: Object },
    label: { type: String },
    color: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        --range-color: var(--perspective-color, rgba(34, 197, 94, 0.8));
      }

      /* Minimal container - visual focus on the range bar */
      .range-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .range-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .range-track {
        position: relative;
        width: 100%;
        height: 24px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }

      .range-segment {
        position: absolute;
        top: 3px;
        bottom: 3px;
        background: linear-gradient(90deg, 
          var(--range-color, rgba(34, 197, 94, 0.3)), 
          var(--range-color, rgba(34, 197, 94, 0.6)), 
          var(--range-color, rgba(34, 197, 94, 0.3)));
        border-radius: 10px;
        border: 1.5px solid var(--range-color, rgba(34, 197, 94, 0.7));
        box-shadow: 0 0 16px var(--range-color, rgba(34, 197, 94, 0.3)),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
      }

      .range-container:hover .range-segment {
        box-shadow: 0 0 24px var(--range-color, rgba(34, 197, 94, 0.4)),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .range-optimal {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: var(--range-color, #22c55e);
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 12px var(--range-color, rgba(34, 197, 94, 0.8)),
                    0 0 4px rgba(255, 255, 255, 0.6) inset;
        z-index: 3;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 12px var(--range-color, rgba(34, 197, 94, 0.8)), 0 0 4px rgba(255, 255, 255, 0.6) inset; }
        50% { box-shadow: 0 0 20px var(--range-color, rgba(34, 197, 94, 1)), 0 0 6px rgba(255, 255, 255, 0.8) inset; }
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 11px;
        padding: 0 4px;
        gap: 0.75rem;
      }
      
      .range-label-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        min-width: 40px;
      }
      
      .range-label-item:first-child {
        align-items: flex-start;
      }
      
      .range-label-item:last-child {
        align-items: flex-end;
      }
      
      .range-label-text {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        line-height: 1.3;
      }

      .range-value {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        display: flex;
        align-items: baseline;
        gap: 3px;
        color: rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        font-size: 0.9rem;
      }

      .range-value.optimal { 
        color: var(--range-color, #4ade80);
        font-weight: 800;
        text-shadow: 0 0 8px var(--range-color, rgba(74, 222, 128, 0.5));
        font-size: 1rem;
      }

      .range-unit {
        color: inherit;
        opacity: 0.7;
        font-size: 0.6875rem;
        font-weight: 500;
      }

      .empty-state {
        color: rgba(255, 255, 255, 0.35);
        font-style: italic;
        font-size: 0.8125rem;
        padding: 0.5rem;
      }
    `
  ];

  constructor() {
    super();
    this.data = {};
    this.label = '';
    this.color = '';
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

  render() {
    const data = this.unwrapCitedValue(this.data);
    
    if (!data || typeof data !== 'object') {
      return html`<div class="empty-state">—</div>`;
    }
    
    const { min, max, unit } = data;
    // Support both 'optimal' and 'typical' as the middle value
    const optimal = data.optimal ?? data.typical ?? data.mean;
    
    // Muss min UND max haben
    if (min === undefined || max === undefined) {
      return html`<div class="empty-state">—</div>`;
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      return html`<div class="empty-state">—</div>`;
    }
    if (min >= max) {
      return html`<div class="empty-state">Invalid range</div>`;
    }

    // Berechne sinnvollen Gesamtbereich (mit Padding)
    const dataRange = max - min;
    const padding = dataRange * 0.2; // 20% Padding links/rechts
    const totalMin = Math.max(0, min - padding);
    const totalMax = max + padding;
    const totalRange = totalMax - totalMin;
    
    // Position und Breite des Range-Segments
    const segmentLeft = ((min - totalMin) / totalRange) * 100;
    const segmentWidth = (dataRange / totalRange) * 100;
    
    // Optional: Position des Optimal-Markers
    let optimalLeft = null;
    if (optimal !== undefined && typeof optimal === 'number') {
      optimalLeft = ((optimal - totalMin) / totalRange) * 100;
    }

    const colorStyle = this.color ? `--range-color: ${this.color}` : '';

    return html`
      <div class="range-container" style="${colorStyle}">
        ${this.label ? html`<div class="range-label">${this.label}</div>` : ''}
        
        <div class="range-track">
          <div 
            class="range-segment" 
            style="left: ${segmentLeft}%; width: ${segmentWidth}%"
          ></div>
          ${optimalLeft !== null ? html`
            <div 
              class="range-optimal" 
              style="left: ${optimalLeft}%"
              title="Optimal: ${optimal}${unit ? ' ' + unit : ''}"
            ></div>
          ` : ''}
        </div>
        
        <div class="range-labels">
          <div class="range-label-item">
            <span class="range-label-text">Min</span>
            <span class="range-value">
              ${min}
              ${unit ? html`<span class="range-unit">${unit}</span>` : ''}
            </span>
          </div>
          
          ${optimal !== undefined ? html`
            <div class="range-label-item">
              <span class="range-label-text">Optimal</span>
              <span class="range-value optimal">
                ${optimal}
                ${unit ? html`<span class="range-unit">${unit}</span>` : ''}
              </span>
            </div>
          ` : ''}
          
          <div class="range-label-item">
            <span class="range-label-text">Max</span>
            <span class="range-value">
              ${max}
              ${unit ? html`<span class="range-unit">${unit}</span>` : ''}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}

// Register with detail- prefix for detail pages
customElements.define('detail-range-morph', RangeMorph);
