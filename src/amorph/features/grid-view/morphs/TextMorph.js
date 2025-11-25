/**
 * 📝 TEXT MORPH
 * 
 * Atomic Morph für Text mit Ellipsis-Support
 * Unterstützt maxLines und automatische Truncation
 * 
 * Usage:
 * <text-morph 
 *   value="Langer Text..." 
 *   maxlines="3"
 *   size="medium"
 * ></text-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from './tokens.js';

export class TextMorph extends LitElement {
  static properties = {
    value: { type: String },
    maxlines: { type: Number },
    size: { type: String },       // 'small' | 'medium' | 'large'
    align: { type: String },       // 'left' | 'center' | 'right'
    weight: { type: String },      // 'normal' | 'medium' | 'bold'
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
      
      .text {
        margin: 0;
        font-family: var(--font-sans);
        line-height: 1.5;
        transition: var(--transition-base);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        color: var(--color-text-muted);
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
    
    @media (prefers-color-scheme: dark) {
      .text {
        color: rgba(255, 255, 255, 0.7);
      }
    }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.maxlines = null;
    this.size = 'medium';
    this.align = 'left';
    this.weight = 'normal';
    this.color = null;
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'text';
    this.dataset.morphId = this.id || `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
    // Don't render if value is empty
    if (!this.value || this.value.trim().length === 0) {
      return html``;
    }
    
    const classes = [
      'text',
      this.maxlines ? 'ellipsis' : '',
      `size-${this.size}`,
      `align-${this.align}`,
      `weight-${this.weight}`
    ].filter(Boolean).join(' ');
    
    return html`
      <p 
        class="${classes}"
        style="${this.getClampStyle()} ${this.getColorStyle()}"
      >
        ${this.value}
      </p>
    `;
  }
}

customElements.define('text-morph', TextMorph);
