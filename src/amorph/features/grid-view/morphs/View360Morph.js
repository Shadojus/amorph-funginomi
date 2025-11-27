/**
 * 🔄 VIEW 360 MORPH
 * 
 * Interactive 360° image viewer with drag/swipe rotation
 * Falls back to gallery slider if no 360 data available
 * 
 * Usage:
 * <view360-morph
 *   frames='["img1.jpg", "img2.jpg", ...]'
 *   frame-count="36"
 *   rotation-axis="horizontal"
 *   auto-rotate
 *   speed="50"
 * ></view360-morph>
 * 
 * Or with single image + gallery:
 * <view360-morph
 *   src="/primary-image.jpg"
 *   gallery='["img1.jpg", "img2.jpg", "img3.jpg"]'
 * ></view360-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class View360Morph extends LitElement {
  static properties = {
    // 360° mode
    frames: { type: Array },
    frameCount: { type: Number, attribute: 'frame-count' },
    rotationAxis: { type: String, attribute: 'rotation-axis' },
    autoRotate: { type: Boolean, attribute: 'auto-rotate' },
    speed: { type: Number },
    
    // Gallery fallback mode
    src: { type: String },
    gallery: { type: Array },
    alt: { type: String },
    
    // Internal state
    _currentFrame: { type: Number, state: true },
    _isDragging: { type: Boolean, state: true },
    _galleryIndex: { type: Number, state: true },
    _isLoaded: { type: Boolean, state: true },
    _is360Mode: { type: Boolean, state: true }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      
      .view360-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
        cursor: grab;
        user-select: none;
        touch-action: pan-y pinch-zoom;
      }
      
      .view360-container:active {
        cursor: grabbing;
      }
      
      .view360-container.gallery-mode {
        cursor: default;
      }
      
      .frame-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: opacity 0.1s ease;
        pointer-events: none;
      }
      
      .frame-image.loading {
        opacity: 0;
      }
      
      /* 360 Indicator */
      .rotation-indicator {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        border-radius: var(--radius-full);
        color: white;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        pointer-events: none;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }
      
      .view360-container:hover .rotation-indicator {
        opacity: 1;
      }
      
      .rotation-icon {
        font-size: 18px;
        animation: rotate360hint 2s ease-in-out infinite;
      }
      
      @keyframes rotate360hint {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-15deg); }
        75% { transform: rotate(15deg); }
      }
      
      .view360-container.dragging .rotation-icon {
        animation: none;
      }
      
      /* Progress bar for 360 */
      .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #22c55e, #10b981);
        transition: width 0.1s ease;
        border-radius: 0 3px 0 0;
      }
      
      /* Gallery Controls */
      .gallery-controls {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .gallery-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
      }
      
      .gallery-dot:hover {
        background: rgba(255, 255, 255, 0.7);
        transform: scale(1.2);
      }
      
      .gallery-dot.active {
        background: #22c55e;
        transform: scale(1.3);
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
      }
      
      .gallery-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        opacity: 0;
      }
      
      .view360-container:hover .gallery-arrow {
        opacity: 1;
      }
      
      .gallery-arrow:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
      }
      
      .gallery-arrow.prev {
        left: 12px;
      }
      
      .gallery-arrow.next {
        right: 12px;
      }
      
      /* Loading Skeleton */
      .loading-skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0.05) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .loading-skeleton::after {
        content: '🔄';
        font-size: 48px;
        opacity: 0.5;
        animation: pulse 1s ease-in-out infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      
      /* Zoom indicator on hover */
      .zoom-hint {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: var(--radius-md);
        color: white;
        font-size: var(--font-size-xs);
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      .view360-container:hover .zoom-hint {
        opacity: 0.8;
      }
    `
  ];
  
  constructor() {
    super();
    this.frames = [];
    this.frameCount = 36;
    this.rotationAxis = 'horizontal';
    this.autoRotate = false;
    this.speed = 50;
    this.src = '';
    this.gallery = [];
    this.alt = '';
    
    this._currentFrame = 0;
    this._isDragging = false;
    this._galleryIndex = 0;
    this._isLoaded = false;
    this._is360Mode = false;
    
    this._startX = 0;
    this._startY = 0;
    this._autoRotateInterval = null;
    this._preloadedImages = [];
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._determineMode();
    this._preloadImages();
    
    if (this.autoRotate && this._is360Mode) {
      this._startAutoRotate();
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoRotate();
  }
  
  _determineMode() {
    // 360 mode if frames array is provided with multiple images
    if (this.frames && this.frames.length > 1) {
      this._is360Mode = true;
    } else if (this.gallery && this.gallery.length > 1) {
      this._is360Mode = false; // Gallery mode
    } else {
      this._is360Mode = false; // Single image mode
    }
  }
  
  async _preloadImages() {
    const images = this._is360Mode ? this.frames : (this.gallery.length > 0 ? this.gallery : [this.src]);
    
    if (!images || images.length === 0) {
      this._isLoaded = true;
      return;
    }
    
    const loadPromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); // Don't reject, just continue
        img.src = src;
      });
    });
    
    this._preloadedImages = await Promise.all(loadPromises);
    this._isLoaded = true;
    this.requestUpdate();
  }
  
  _startAutoRotate() {
    if (!this._is360Mode || this._autoRotateInterval) return;
    
    this._autoRotateInterval = setInterval(() => {
      if (!this._isDragging) {
        this._currentFrame = (this._currentFrame + 1) % this.frames.length;
        this.requestUpdate();
      }
    }, this.speed);
  }
  
  _stopAutoRotate() {
    if (this._autoRotateInterval) {
      clearInterval(this._autoRotateInterval);
      this._autoRotateInterval = null;
    }
  }
  
  // Mouse/Touch handlers for 360 rotation
  _handlePointerDown(e) {
    if (!this._is360Mode) return;
    
    this._isDragging = true;
    this._startX = e.clientX || e.touches?.[0]?.clientX || 0;
    this._startY = e.clientY || e.touches?.[0]?.clientY || 0;
    
    this._stopAutoRotate();
  }
  
  _handlePointerMove(e) {
    if (!this._isDragging || !this._is360Mode) return;
    
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = clientX - this._startX;
    
    // Sensitivity: ~10px per frame
    const frameDelta = Math.floor(deltaX / 10);
    
    if (frameDelta !== 0) {
      this._currentFrame = (this._currentFrame + frameDelta + this.frames.length) % this.frames.length;
      this._startX = clientX;
      this.requestUpdate();
    }
  }
  
  _handlePointerUp() {
    this._isDragging = false;
    
    if (this.autoRotate && this._is360Mode) {
      setTimeout(() => this._startAutoRotate(), 1000);
    }
  }
  
  // Gallery navigation
  _goToSlide(index) {
    this._galleryIndex = index;
    this.requestUpdate();
  }
  
  _prevSlide() {
    const images = this.gallery.length > 0 ? this.gallery : [this.src];
    this._galleryIndex = (this._galleryIndex - 1 + images.length) % images.length;
    this.requestUpdate();
  }
  
  _nextSlide() {
    const images = this.gallery.length > 0 ? this.gallery : [this.src];
    this._galleryIndex = (this._galleryIndex + 1) % images.length;
    this.requestUpdate();
  }
  
  render() {
    if (!this._isLoaded) {
      return html`
        <div class="view360-container">
          <div class="loading-skeleton"></div>
        </div>
      `;
    }
    
    if (this._is360Mode) {
      return this._render360View();
    } else {
      return this._renderGalleryView();
    }
  }
  
  _render360View() {
    const currentSrc = this.frames[this._currentFrame] || this.frames[0];
    const progress = ((this._currentFrame + 1) / this.frames.length) * 100;
    
    return html`
      <div 
        class="view360-container ${this._isDragging ? 'dragging' : ''}"
        @mousedown=${this._handlePointerDown}
        @mousemove=${this._handlePointerMove}
        @mouseup=${this._handlePointerUp}
        @mouseleave=${this._handlePointerUp}
        @touchstart=${this._handlePointerDown}
        @touchmove=${this._handlePointerMove}
        @touchend=${this._handlePointerUp}
      >
        <img 
          class="frame-image" 
          src=${currentSrc} 
          alt=${this.alt || '360° View'}
          draggable="false"
        />
        
        <div class="progress-bar" style="width: ${progress}%"></div>
        
        <div class="rotation-indicator">
          <span class="rotation-icon">🔄</span>
          <span>Drag to rotate • ${this._currentFrame + 1}/${this.frames.length}</span>
        </div>
        
        <div class="zoom-hint">360°</div>
      </div>
    `;
  }
  
  _renderGalleryView() {
    const images = this.gallery.length > 0 ? this.gallery : [this.src];
    const currentSrc = images[this._galleryIndex] || images[0];
    const hasMultiple = images.length > 1;
    
    return html`
      <div class="view360-container gallery-mode">
        <img 
          class="frame-image" 
          src=${currentSrc} 
          alt=${this.alt || 'Image'}
          draggable="false"
        />
        
        ${hasMultiple ? html`
          <button class="gallery-arrow prev" @click=${this._prevSlide}>‹</button>
          <button class="gallery-arrow next" @click=${this._nextSlide}>›</button>
          
          <div class="gallery-controls">
            ${images.map((_, i) => html`
              <button 
                class="gallery-dot ${i === this._galleryIndex ? 'active' : ''}"
                @click=${() => this._goToSlide(i)}
              ></button>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('view360-morph', View360Morph);
