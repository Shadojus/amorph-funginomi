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
import { globalStyles } from './tokens.js';

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
        width: 100%;
      }

      .number-container {
        display: inline-flex;
        flex-direction: column;
        gap: 0.1875rem;
        padding: 0.5rem 0.625rem;
        border-radius: var(--radius-md, 6px);
        background: rgba(255, 255, 255, 0.05);
        border: 1.5px solid rgba(102, 126, 234, 0.2);
        transition: all 0.3s ease;
        width: fit-content;
        max-width: 100%;
        min-width: 80px;
    }

    .number-container:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 126, 234, 0.4);
      transform: translateY(-1px);
    }

    .label {
      font-size: 0.625rem;
      color: rgba(255, 255, 255, 0.55);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value-row {
      display: flex;
      align-items: baseline;
      gap: 0.1875rem;
    }

    .value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #667eea;
      line-height: 1.1;
    }

    .unit {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }

    .range {
      font-size: 0.6875rem;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 0.1875rem;
    }

    .range-bar {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin-top: 0.375rem;
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

  /**
   * Smart formatting: large numbers get abbreviated, timestamps detected
   */
  getFormattedValue() {
    const num = Number(this.value);
    
    // Check if this looks like a timestamp (very large negative or positive number)
    if (Math.abs(num) > 1000000000000) {
      // Likely a millisecond timestamp - show as date
      try {
        const date = new Date(num);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) {
        // Fall through to number formatting
      }
    }
    
    // Large numbers: abbreviate
    const absNum = Math.abs(num);
    if (absNum >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (absNum >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (absNum >= 10000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    
    // Regular numbers: use precision
    return num.toFixed(this.precision);
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
        ${this.label ? html`<div class="label">${this.formatLabel(this.label)}</div>` : ''}
        
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
  
  /**
   * Format label: replace underscores, add spaces before caps
   */
  formatLabel(label) {
    return label
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

customElements.define('number-morph', NumberMorph);
