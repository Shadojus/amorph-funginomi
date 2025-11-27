/**
 * 📝 TEXT MORPH (Detail View)
 * 
 * Text display with truncation and maxlines support
 * 
 * Usage:
 * <text-morph 
 *   value="Long text content..." 
 *   maxlines="3"
 *   size="medium"
 * ></text-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class TextMorph extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    maxlines: { type: Number },
    size: { type: String },       // 'small' | 'medium' | 'large'
    align: { type: String },      // 'left' | 'center' | 'right'
    weight: { type: String },     // 'normal' | 'medium' | 'bold'
    color: { type: String }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      .text-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .text-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      
      .text {
        margin: 0;
        font-family: var(--font-sans);
        line-height: 1.5;
        transition: var(--transition-base);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        color: rgba(255, 255, 255, 0.85);
        max-width: 100%;
      }
    
      .text.ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    
      /* Sizes */
      .text.small {
        font-size: 0.8125rem;
        line-height: 1.45;
      }
    
      .text.medium {
        font-size: 0.9375rem;
        line-height: 1.5;
      }
    
      .text.large {
        font-size: 1.0625rem;
        line-height: 1.55;
      }
    
      /* Weight */
      .text.weight-normal {
        font-weight: 400;
      }
    
      .text.weight-medium {
        font-weight: 500;
      }
    
      .text.weight-bold {
        font-weight: 600;
      }
    
      /* Align */
      .text.align-left {
        text-align: left;
      }
    
      .text.align-center {
        text-align: center;
      }
    
      .text.align-right {
        text-align: right;
      }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.maxlines = null;
    this.size = 'medium';
    this.align = 'left';
    this.weight = 'normal';
    this.color = null;
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
  
  getClampStyle() {
    if (this.maxlines && this.maxlines > 0) {
      return `-webkit-line-clamp: ${this.maxlines};`;
    }
    return '';
  }
  
  getColorStyle() {
    if (this.color) {
      return `color: ${this.color};`;
    }
    return '';
  }
  
  render() {
    const text = this.unwrapCitedValue(this.value);
    
    // Don't render if value is empty
    if (!text || (typeof text === 'string' && text.trim().length === 0)) {
      return html``;
    }

    // Handle arrays
    const displayText = Array.isArray(text) ? text.join(', ') : String(text);
    
    const classes = [
      'text',
      this.maxlines ? 'ellipsis' : '',
      this.size,
      `align-${this.align}`,
      `weight-${this.weight}`
    ].filter(Boolean).join(' ');
    
    return html`
      <div class="text-container">
        ${this.label ? html`<div class="text-label">${this.label}</div>` : ''}
        <p 
          class="${classes}"
          style="${this.getClampStyle()} ${this.getColorStyle()}"
        >
          ${displayText}
        </p>
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('text-morph')) {
  customElements.define('text-morph', TextMorph);
}
