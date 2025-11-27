/**
 * MiniBubbleView - Compact Similarity Visualization
 * 
 * A compact Canvas 2D-based visualization showing similar species
 * around a center entity. Designed for detail pages.
 * 
 * @version 1.0.0
 * @since 2025-11-27
 * @feature detail-view
 */

import { LitElement, html, css } from 'lit';

export class MiniBubbleView extends LitElement {
  static properties = {
    centerEntity: { type: String, attribute: 'center-entity' },   // JSON
    similarEntities: { type: String, attribute: 'similar-entities' }, // JSON
    maxBubbles: { type: Number, attribute: 'max-bubbles' },
    // Internal state
    _center: { type: Object, state: true },
    _entities: { type: Array, state: true },
    _hoveredEntity: { type: Object, state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .mini-bubble-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      min-height: 280px;
      max-height: 400px;
      background: radial-gradient(ellipse at center, 
        rgba(30, 41, 59, 0.9) 0%, 
        rgba(15, 23, 42, 0.95) 70%,
        rgba(2, 6, 23, 1) 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    .tooltip {
      position: absolute;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
      max-width: 200px;
    }

    .tooltip.visible {
      opacity: 1;
    }

    .tooltip-name {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .tooltip-similarity {
      color: rgba(139, 195, 74, 0.9);
      font-size: 11px;
    }

    .center-label {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .no-data {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.4);
    }

    .no-data-icon {
      font-size: 32px;
      opacity: 0.5;
    }
  `;

  constructor() {
    super();
    this.centerEntity = '';
    this.similarEntities = '';
    this.maxBubbles = 8;
    this._center = null;
    this._entities = [];
    this._hoveredEntity = null;
    this._canvas = null;
    this._ctx = null;
    this._animationFrame = null;
    this._bubbles = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    if (this._canvas) {
      this._ctx = this._canvas.getContext('2d');
      this._setupCanvas();
      this._initBubbles();
      this._animate();
    }
  }

  _parseData() {
    try {
      this._center = this.centerEntity ? JSON.parse(this.centerEntity) : null;
    } catch (e) {
      console.warn('[MiniBubbleView] Failed to parse centerEntity:', e);
      this._center = null;
    }
    
    try {
      const entities = this.similarEntities ? JSON.parse(this.similarEntities) : [];
      this._entities = entities.slice(0, this.maxBubbles);
    } catch (e) {
      console.warn('[MiniBubbleView] Failed to parse similarEntities:', e);
      this._entities = [];
    }
  }

  _setupCanvas() {
    if (!this._canvas) return;
    
    const container = this._canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this._canvas.width = rect.width * dpr;
    this._canvas.height = rect.height * dpr;
    this._ctx.scale(dpr, dpr);
    
    this._width = rect.width;
    this._height = rect.height;
  }

  _initBubbles() {
    if (!this._center || this._entities.length === 0) return;
    
    const centerX = this._width / 2;
    const centerY = this._height / 2;
    const maxRadius = Math.min(this._width, this._height) * 0.35;
    
    this._bubbles = [];
    
    // Center bubble
    this._bubbles.push({
      x: centerX,
      y: centerY,
      radius: 40,
      targetRadius: 40,
      entity: this._center,
      isCenter: true,
      color: 'rgba(139, 195, 74, 0.8)',
      vx: 0,
      vy: 0
    });
    
    // Similar entities
    this._entities.forEach((entity, i) => {
      const angle = (i / this._entities.length) * Math.PI * 2 - Math.PI / 2;
      const similarity = entity.similarity || 0.5;
      const distance = maxRadius * (1 - similarity * 0.5); // Closer = more similar
      const radius = 20 + similarity * 15; // Larger = more similar
      
      this._bubbles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: radius,
        targetRadius: radius,
        entity,
        isCenter: false,
        similarity,
        color: this._getSimilarityColor(similarity),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        angle,
        baseDistance: distance
      });
    });
  }

  _getSimilarityColor(similarity) {
    // Green to Yellow to Orange based on similarity
    if (similarity >= 0.7) return 'rgba(76, 175, 80, 0.8)';  // High - green
    if (similarity >= 0.4) return 'rgba(255, 193, 7, 0.8)';  // Medium - yellow
    return 'rgba(255, 152, 0, 0.8)';  // Low - orange
  }

  _animate() {
    if (!this._ctx) return;
    
    this._ctx.clearRect(0, 0, this._width, this._height);
    
    // Draw connection lines
    const centerBubble = this._bubbles.find(b => b.isCenter);
    if (centerBubble) {
      this._bubbles.filter(b => !b.isCenter).forEach(bubble => {
        const similarity = bubble.similarity || 0.5;
        const alpha = 0.1 + similarity * 0.2;
        
        this._ctx.beginPath();
        this._ctx.moveTo(centerBubble.x, centerBubble.y);
        this._ctx.lineTo(bubble.x, bubble.y);
        this._ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        this._ctx.lineWidth = 1;
        this._ctx.stroke();
      });
    }
    
    // Update and draw bubbles
    this._bubbles.forEach(bubble => {
      if (!bubble.isCenter) {
        // Gentle floating motion
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        
        // Contain within orbit
        const dx = bubble.x - this._width / 2;
        const dy = bubble.y - this._height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > bubble.baseDistance + 20) {
          bubble.vx *= -0.5;
          bubble.vy *= -0.5;
        }
        
        // Random direction changes
        if (Math.random() < 0.01) {
          bubble.vx = (Math.random() - 0.5) * 0.3;
          bubble.vy = (Math.random() - 0.5) * 0.3;
        }
      }
      
      // Draw bubble
      this._ctx.beginPath();
      this._ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this._ctx.fillStyle = bubble.color;
      this._ctx.fill();
      
      // Draw glow
      const gradient = this._ctx.createRadialGradient(
        bubble.x, bubble.y, bubble.radius * 0.5,
        bubble.x, bubble.y, bubble.radius * 1.5
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      this._ctx.beginPath();
      this._ctx.arc(bubble.x, bubble.y, bubble.radius * 1.5, 0, Math.PI * 2);
      this._ctx.fillStyle = gradient;
      this._ctx.fill();
      
      // Draw entity image if available
      if (bubble.entity?.image && bubble.radius > 15) {
        this._drawEntityImage(bubble);
      }
    });
    
    this._animationFrame = requestAnimationFrame(() => this._animate());
  }

  _drawEntityImage(bubble) {
    // Create circular clip and draw image
    // Note: For performance, we'll just draw a simple circle for now
    // Image loading would require caching
    
    // Draw inner circle
    this._ctx.beginPath();
    this._ctx.arc(bubble.x, bubble.y, bubble.radius * 0.8, 0, Math.PI * 2);
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this._ctx.fill();
  }

  _handleCanvasClick(e) {
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedBubble = this._bubbles.find(bubble => {
      const dx = bubble.x - x;
      const dy = bubble.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= bubble.radius;
    });
    
    if (clickedBubble && !clickedBubble.isCenter && clickedBubble.entity?.slug) {
      window.location.href = `/fungi/${clickedBubble.entity.slug}`;
    }
  }

  _handleCanvasMouseMove(e) {
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hoveredBubble = this._bubbles.find(bubble => {
      if (bubble.isCenter) return false;
      const dx = bubble.x - x;
      const dy = bubble.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= bubble.radius;
    });
    
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    
    if (hoveredBubble) {
      this._hoveredEntity = hoveredBubble.entity;
      this._canvas.style.cursor = 'pointer';
      
      if (tooltip) {
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.classList.add('visible');
      }
      
      // Enlarge hovered bubble
      hoveredBubble.radius = hoveredBubble.targetRadius * 1.2;
    } else {
      this._hoveredEntity = null;
      this._canvas.style.cursor = 'default';
      
      if (tooltip) {
        tooltip.classList.remove('visible');
      }
      
      // Reset bubble sizes
      this._bubbles.forEach(b => {
        b.radius = b.targetRadius;
      });
    }
  }

  render() {
    if (!this._center) {
      return html`
        <div class="mini-bubble-container">
          <div class="no-data">
            <span class="no-data-icon">🫧</span>
            <span>No similarity data available</span>
          </div>
        </div>
      `;
    }

    return html`
      <div class="mini-bubble-container">
        <canvas
          @click=${this._handleCanvasClick}
          @mousemove=${this._handleCanvasMouseMove}
          @mouseleave=${() => {
            this._hoveredEntity = null;
            this.shadowRoot.querySelector('.tooltip')?.classList.remove('visible');
          }}
        ></canvas>
        
        <div class="tooltip ${this._hoveredEntity ? 'visible' : ''}">
          ${this._hoveredEntity ? html`
            <div class="tooltip-name">${this._hoveredEntity.name}</div>
            <div class="tooltip-similarity">
              ${Math.round((this._hoveredEntity.similarity || 0) * 100)}% similar
            </div>
          ` : ''}
        </div>
        
        <div class="center-label">
          <span>🍄</span>
          <span>${this._center.name || 'Current Species'}</span>
        </div>
        
        <div class="legend">
          <div class="legend-item">
            <div class="legend-circle" style="background: rgba(76, 175, 80, 0.8)"></div>
            <span>High similarity</span>
          </div>
          <div class="legend-item">
            <div class="legend-circle" style="background: rgba(255, 193, 7, 0.8)"></div>
            <span>Medium</span>
          </div>
          <div class="legend-item">
            <div class="legend-circle" style="background: rgba(255, 152, 0, 0.8)"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('mini-bubble-view', MiniBubbleView);
