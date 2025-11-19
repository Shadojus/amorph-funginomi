/**
 * 🖼️ IMAGE MORPH
 * 
 * Atomic Morph für Bilder
 * 
 * Usage:
 * <image-morph 
 *   src="/images/mushroom.jpg" 
 *   alt="Shiitake Mushroom"
 *   aspect-ratio="16/9"
 *   lazy
 * ></image-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from '../../styles/tokens.js';

export class ImageMorph extends LitElement {
  static properties = {
    src: { type: String },
    alt: { type: String },
    aspectRatio: { type: String, attribute: 'aspect-ratio' },
    lazy: { type: Boolean }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
      }
      
      .image-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: var(--radius-md);
        background: var(--color-border);
        transition: var(--transition-base);
      }
      
      .image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: var(--transition-base);
        display: block;
      }
      
      .image-container:hover {
        box-shadow: var(--shadow-lg);
      }
      
      .image-container:hover .image {
        transform: scale(1.05);
      }
      
      /* Loading State */
      .image-container.loading {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0.05) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `
  ];
  
  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.aspectRatio = '16/9';
    this.lazy = true;
    this.loaded = false;
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'image';
    this.dataset.morphId = this.id || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
  
  handleImageLoad() {
    this.loaded = true;
    this.requestUpdate();
  }
  
  render() {
    return html`
      <div 
        class="image-container ${this.loading ? 'loading' : 'loaded'}"
        style="aspect-ratio: ${this.aspectratio}"
      >
        ${this.src ? html`
          <img 
            class="image"
            src="${this.src}"
            alt="${this.alt}"
            loading="${this.lazy ? 'lazy' : 'eager'}"
            @load="${this.handleImageLoad}"
          >
        ` : ''}
      </div>
    `;
  }
}

customElements.define('image-morph', ImageMorph);
