/**
 * 📊 RANGE MORPH - Datengetrieben
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
    data: { type: Object }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        max-width: 100%;
        overflow: hidden;
      }

      .range-container {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
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
          rgba(34, 197, 94, 0.4), 
          rgba(34, 197, 94, 0.6), 
          rgba(34, 197, 94, 0.4));
        border-radius: 8px;
        border: 1.5px solid rgba(34, 197, 94, 0.8);
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
      }

      .range-optimal {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: #22c55e;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.8),
                    0 0 3px rgba(255, 255, 255, 0.5) inset;
        z-index: 3;
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        padding: 0 4px;
        gap: 0.5rem;
      }

      .range-value {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        display: flex;
        align-items: baseline;
        gap: 2px;
        color: rgba(34, 197, 94, 0.9);
        white-space: nowrap;
      }

      .range-value.optimal { 
        color: #22c55e;
        font-weight: 700;
        text-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
      }

      .range-unit {
        color: inherit;
        opacity: 0.7;
        font-size: 0.65rem;
      }
    `
  ];

  constructor() {
    super();
    this.data = {};
  }

  render() {
    if (!this.data || typeof this.data !== 'object') return html``;
    
    const { min, max, optimal, unit } = this.data;
    
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
    
    // Position des optimal-Markers INNERHALB des Segments
    const optimalPercent = (optimal !== undefined && typeof optimal === 'number') 
      ? segmentLeft + ((optimal - min) / dataRange) * segmentWidth
      : null;

    return html`
      <div class="range-container">
        <div class="range-track">
          <div 
            class="range-segment" 
            style="left: ${segmentLeft}%; width: ${segmentWidth}%;"
          ></div>
          ${optimalPercent !== null ? html`
            <div class="range-optimal" style="left: ${optimalPercent}%"></div>
          ` : ''}
        </div>
        <div class="range-labels">
          <span class="range-value">
            ${min}<span class="range-unit">${unit || ''}</span>
          </span>
          
          ${optimalPercent !== null ? html`
            <span class="range-value optimal">
              ⊛${optimal}<span class="range-unit">${unit || ''}</span>
            </span>
          ` : html`<span style="flex: 1;"></span>`}
          
          <span class="range-value">
            ${max}<span class="range-unit">${unit || ''}</span>
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('range-morph', RangeMorph);
