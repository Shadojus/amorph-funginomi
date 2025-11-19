/**
 * 🔢 NUMBER MORPH
 * ===============
 * 
 * Atomic Morph für numerische Werte mit Einheiten
 * Perfect for: temperature, pH, duration, percentage, etc.
 * 
 * Usage:
 * <number-morph 
 *   value="25"
 *   unit="°C"
 *   label="Temperature"
 *   min="15"
 *   max="30"
 *   show-range
 * ></number-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from '../../styles/tokens.js';

export class NumberMorph extends LitElement {
  static properties = {
    value: { type: Number },
    label: { type: String },
    unit: { type: String },
    min: { type: Number },
    max: { type: Number },
    showRange: { type: Boolean, attribute: 'show-range' },
    precision: { type: Number },
    color: { type: String },
    perspectives: { type: Array }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: inline-block;
      }

      .number-container {
        display: inline-flex;
        flex-direction: column;
        gap: var(--space-xs);
        padding: var(--space-md) var(--space-lg);
        border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      border: 1.5px solid rgba(102, 126, 234, 0.2);
      transition: all 0.3s ease;
    }

    .number-container:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 126, 234, 0.4);
      transform: translateY(-2px);
    }

    .label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .value-row {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      line-height: 1;
    }

    .unit {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
    }

    .range {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.25rem;
    }

    .range-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin-top: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .range-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    @media (prefers-color-scheme: dark) {
      .number-container {
        background: rgba(255, 255, 255, 0.03);
      }
    }
    `
  ];

  constructor() {
    super();
    this.value = 0;
    this.label = '';
    this.unit = '';
    this.min = null;
    this.max = null;
    this.showRange = false;
    this.precision = 1;
    this.color = '#667eea';
    this.perspectives = [];
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'number';
    this.dataset.morphId = this.id || `number-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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

  getFormattedValue() {
    return Number(this.value).toFixed(this.precision);
  }

  getRangePercentage() {
    if (this.min === null || this.max === null) return 0;
    const range = this.max - this.min;
    const position = this.value - this.min;
    return Math.min(100, Math.max(0, (position / range) * 100));
  }

  render() {
    return html`
      <div class="number-container" style="border-color: ${this.color}33;">
        ${this.label ? html`<div class="label">${this.label}</div>` : ''}
        
        <div class="value-row">
          <span class="value" style="color: ${this.color};">
            ${this.getFormattedValue()}
          </span>
          ${this.unit ? html`<span class="unit">${this.unit}</span>` : ''}
        </div>

        ${this.showRange && this.min !== null && this.max !== null ? html`
          <div class="range">Range: ${this.min} - ${this.max} ${this.unit}</div>
          <div class="range-bar">
            <div 
              class="range-fill" 
              style="width: ${this.getRangePercentage()}%; background: ${this.color};"
            ></div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('number-morph', NumberMorph);
