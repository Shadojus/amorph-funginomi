/**
 * 📊 RANGE MORPH (Detail View)
 * 
 * Zeigt min/max/optimal Werte als visuellen Balken
 * REIN DATENGETRIEBEN - Erkennt automatisch Range-Objekte
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
      }

      .range-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .range-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .range-track {
        position: relative;
        width: 100%;
        height: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .range-segment {
        position: absolute;
        top: 2px;
        bottom: 2px;
        background: linear-gradient(90deg, 
          var(--range-color, rgba(34, 197, 94, 0.4)), 
          var(--range-color, rgba(34, 197, 94, 0.6)), 
          var(--range-color, rgba(34, 197, 94, 0.4)));
        border-radius: 8px;
        border: 1.5px solid var(--range-color, rgba(34, 197, 94, 0.8));
        box-shadow: 0 0 12px var(--range-color, rgba(34, 197, 94, 0.3));
      }

      .range-optimal {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: var(--range-color, #22c55e);
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 8px var(--range-color, rgba(34, 197, 94, 0.8)),
                    0 0 3px rgba(255, 255, 255, 0.5) inset;
        z-index: 3;
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        padding: 0 4px;
        gap: 0.5rem;
      }
      
      .range-label-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      
      .range-label-text {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        word-break: break-word;
        line-height: 1.3;
      }

      .range-value {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        display: flex;
        align-items: baseline;
        gap: 2px;
        color: var(--range-color, rgba(16, 185, 129, 1));
        white-space: nowrap;
        font-size: 0.8125rem;
      }

      .range-value.optimal { 
        color: var(--range-color, rgba(16, 185, 129, 1));
        font-weight: 700;
        text-shadow: 0 0 6px var(--range-color, rgba(16, 185, 129, 0.5));
      }

      .range-unit {
        color: inherit;
        opacity: 0.8;
        font-size: 0.6875rem;
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
    
    if (!data || typeof data !== 'object') return html``;
    
    const { min, max, optimal, unit } = data;
    
    // Muss min UND max haben
    if (min === undefined || max === undefined) return html``;
    if (typeof min !== 'number' || typeof max !== 'number') return html``;
    if (min >= max) return html``; // Invalider Range

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

// Register with standard name - detail-view owns these morphs
if (!customElements.get('range-morph')) {
  customElements.define('range-morph', RangeMorph);
}
