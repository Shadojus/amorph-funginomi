/**
 * View360Morph - Interactive 360° Image Viewer
 * 
 * Displays a 360° rotatable view of a fungus using frame arrays or
 * falls back to a static image with subtle rotation effect.
 * 
 * @version 1.0.0
 * @since 2025-11-27
 * @feature detail-view
 */

import { LitElement, html, css } from 'lit';

export class View360Morph extends LitElement {
  static properties = {
    // Attribute-based properties for Astro integration
    src: { type: String },
    alt: { type: String },
    frames: { type: String },         // JSON string of frame URLs
    gallery: { type: String },        // JSON string of gallery images  
    frameCount: { type: Number, attribute: 'frame-count' },
    rotationAxis: { type: String, attribute: 'rotation-axis' },
    autoRotate: { type: Boolean, attribute: 'auto-rotate' },
    speed: { type: Number },
    // Internal state
    currentFrame: { type: Number, state: true },
    isAutoRotating: { type: Boolean, state: true },
    isDragging: { type: Boolean, state: true },
    _frameUrls: { type: Array, state: true },
    _galleryUrls: { type: Array, state: true }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      position: relative;
      cursor: grab;
      user-select: none;
      overflow: hidden;
      border-radius: 12px;
      background: linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%);
    }

    :host([dragging]) {
      cursor: grabbing;
    }

    .viewer-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .main-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.1s ease-out;
      pointer-events: none;
    }

    .rotation-indicator {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 20px;
      color: white;
      font-size: 12px;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    .rotation-indicator:hover {
      opacity: 1;
    }

    .rotation-icon {
      width: 16px;
      height: 16px;
      animation: rotate-hint 2s ease-in-out infinite;
    }

    @keyframes rotate-hint {
      0%, 100% { transform: rotate(-15deg); }
      50% { transform: rotate(15deg); }
    }

    .auto-rotate-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .auto-rotate-btn:hover {
      background: rgba(255,255,255,0.1);
    }

    .auto-rotate-btn.active {
      background: rgba(139, 195, 74, 0.3);
      border-color: #8bc34a;
    }

    .frame-counter {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      color: white;
      font-size: 11px;
      font-family: monospace;
    }

    .fallback-effect {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%);
      pointer-events: none;
    }

    .loading-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: rgba(255,255,255,0.5);
    }

    .loading-icon {
      font-size: 48px;
      opacity: 0.5;
    }

    .gallery-dots {
      position: absolute;
      bottom: 48px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
    }

    .gallery-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      transition: all 0.2s;
    }

    .gallery-dot.active {
      background: white;
      transform: scale(1.2);
    }

    .gallery-dot:hover {
      background: rgba(255,255,255,0.6);
    }
  `;

  constructor() {
    super();
    this.src = '';
    this.alt = 'Fungus image';
    this.frames = '';
    this.gallery = '';
    this.frameCount = 36;
    this.rotationAxis = 'horizontal';
    this.autoRotate = false;
    this.speed = 100;
    this.currentFrame = 0;
    this.isAutoRotating = false;
    this.isDragging = false;
    this._frameUrls = [];
    this._galleryUrls = [];
    this._startX = 0;
    this._autoRotateInterval = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseData();
    
    if (this.autoRotate && this.hasMultipleFrames) {
      this._startAutoRotate();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoRotate();
  }

  _parseData() {
    // Parse frames JSON
    if (this.frames) {
      try {
        this._frameUrls = JSON.parse(this.frames);
      } catch (e) {
        console.warn('[View360Morph] Failed to parse frames:', e);
        this._frameUrls = [];
      }
    }
    
    // Parse gallery JSON
    if (this.gallery) {
      try {
        this._galleryUrls = JSON.parse(this.gallery);
      } catch (e) {
        console.warn('[View360Morph] Failed to parse gallery:', e);
        this._galleryUrls = [];
      }
    }
  }

  get currentImage() {
    if (this._frameUrls.length > 0) {
      return this._frameUrls[this.currentFrame % this._frameUrls.length];
    }
    if (this._galleryUrls.length > 0) {
      return this._galleryUrls[this.currentFrame % this._galleryUrls.length];
    }
    return this.src || '/images/fungi/placeholder.jpg';
  }

  get hasMultipleFrames() {
    return this._frameUrls.length > 1;
  }

  get hasGallery() {
    return this._galleryUrls.length > 1;
  }

  _handleMouseDown(e) {
    this.isDragging = true;
    this._startX = e.clientX;
    this.setAttribute('dragging', '');
    this._stopAutoRotate();
  }

  _handleMouseMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this._startX;

    if (this.hasMultipleFrames) {
      const sensitivity = 5;
      const frameDelta = Math.floor(deltaX / sensitivity);
      if (Math.abs(frameDelta) >= 1) {
        const totalFrames = this._frameUrls.length;
        let newFrame = (this.currentFrame + frameDelta) % totalFrames;
        this.currentFrame = newFrame < 0 ? totalFrames + newFrame : newFrame;
        this._startX = e.clientX;
      }
    } else if (this.hasGallery) {
      // Swipe through gallery
      if (Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? -1 : 1;
        const totalImages = this._galleryUrls.length;
        let newIndex = (this.currentFrame + direction) % totalImages;
        this.currentFrame = newIndex < 0 ? totalImages + newIndex : newIndex;
        this._startX = e.clientX;
      }
    } else {
      // Single image - subtle 3D effect
      const img = this.shadowRoot.querySelector('.main-image');
      if (img) {
        const rotateY = Math.max(-15, Math.min(15, deltaX * 0.05));
        img.style.transform = `perspective(1000px) rotateY(${rotateY}deg)`;
      }
    }
  }

  _handleMouseUp() {
    this.isDragging = false;
    this.removeAttribute('dragging');
    
    if (!this.hasMultipleFrames && !this.hasGallery) {
      const img = this.shadowRoot.querySelector('.main-image');
      if (img) {
        img.style.transform = 'perspective(1000px) rotateY(0deg)';
      }
    }
  }

  _handleTouchStart(e) {
    if (e.touches.length === 1) {
      this._handleMouseDown({ clientX: e.touches[0].clientX });
    }
  }

  _handleTouchMove(e) {
    if (e.touches.length === 1) {
      e.preventDefault();
      this._handleMouseMove({ clientX: e.touches[0].clientX });
    }
  }

  _handleTouchEnd() {
    this._handleMouseUp();
  }

  _toggleAutoRotate() {
    if (this.isAutoRotating) {
      this._stopAutoRotate();
    } else {
      this._startAutoRotate();
    }
  }

  _startAutoRotate() {
    if (!this.hasMultipleFrames) return;
    
    this.isAutoRotating = true;
    const interval = Math.max(30, 1000 / (this.speed || 10));
    this._autoRotateInterval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this._frameUrls.length;
    }, interval);
  }

  _stopAutoRotate() {
    this.isAutoRotating = false;
    if (this._autoRotateInterval) {
      clearInterval(this._autoRotateInterval);
      this._autoRotateInterval = null;
    }
  }

  _goToFrame(index) {
    this.currentFrame = index;
    this._stopAutoRotate();
  }

  render() {
    const hasImage = this.src || this._frameUrls.length > 0 || this._galleryUrls.length > 0;
    
    if (!hasImage) {
      return html`
        <div class="loading-placeholder">
          <span class="loading-icon">🍄</span>
          <span>No image available</span>
        </div>
      `;
    }

    return html`
      <div 
        class="viewer-container"
        @mousedown=${this._handleMouseDown}
        @mousemove=${this._handleMouseMove}
        @mouseup=${this._handleMouseUp}
        @mouseleave=${this._handleMouseUp}
        @touchstart=${this._handleTouchStart}
        @touchmove=${this._handleTouchMove}
        @touchend=${this._handleTouchEnd}
      >
        <img 
          class="main-image" 
          src=${this.currentImage} 
          alt=${this.alt}
          draggable="false"
          @error=${(e) => e.target.src = '/images/fungi/placeholder.svg'}
        />
        
        ${!this.hasMultipleFrames && !this.hasGallery ? html`<div class="fallback-effect"></div>` : ''}
        
        ${this.hasMultipleFrames ? html`
          <div class="frame-counter">
            ${this.currentFrame + 1} / ${this._frameUrls.length}
          </div>
        ` : ''}

        ${this.hasGallery ? html`
          <div class="gallery-dots">
            ${this._galleryUrls.map((_, i) => html`
              <div 
                class="gallery-dot ${i === this.currentFrame ? 'active' : ''}"
                @click=${() => this._goToFrame(i)}
              ></div>
            `)}
          </div>
        ` : ''}
        
        <div class="rotation-indicator">
          <svg class="rotation-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          <span>${this.hasGallery ? 'Swipe to browse' : 'Drag to rotate'}</span>
          ${this.hasMultipleFrames ? html`
            <button 
              class="auto-rotate-btn ${this.isAutoRotating ? 'active' : ''}"
              @click=${this._toggleAutoRotate}
            >
              ${this.isAutoRotating ? 'Stop' : 'Auto'}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('view360-morph', View360Morph);
