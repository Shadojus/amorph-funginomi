/**
 * 📝 TEXT MORPH (Detail View) v2.0
 * 
 * Premium text display with glassmorphism and enhanced typography.
 * Supports truncation, multiple sizes, and rich styling.
 * 
 * Features:
 * - Glassmorphism container with subtle border
 * - Line clamping with ellipsis
 * - Multiple size variants
 * - Optional label with uppercase styling
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

      /* Minimal container - no extra box styling */
      .text-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .text-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      
      .text {
        margin: 0;
        font-family: var(--font-sans);
        line-height: 1.6;
        transition: all 0.2s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        color: rgba(255, 255, 255, 0.9);
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
        line-height: 1.5;
      }
    
      .text.medium {
        font-size: 0.9375rem;
        line-height: 1.6;
      }
    
      .text.large {
        font-size: 1.0625rem;
        line-height: 1.65;
        font-weight: 500;
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

      .empty-state {
        color: rgba(255, 255, 255, 0.35);
        font-style: italic;
        font-size: 0.8125rem;
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
      return html`
        <div class="text-container">
          ${this.label ? html`<div class="text-label">${this.label}</div>` : ''}
          <div class="empty-state">—</div>
        </div>
      `;
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

// Register with detail- prefix for detail pages
customElements.define('detail-text-morph', TextMorph);
