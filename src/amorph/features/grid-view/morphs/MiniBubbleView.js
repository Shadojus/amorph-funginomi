/**
 * 🫧 MINI BUBBLE VIEW
 * 
 * Compact similarity visualization showing related entities
 * Simplified version of BubbleView for detail pages
 * 
 * Usage:
 * <mini-bubble-view
 *   center-entity='{"slug": "amanita-muscaria", "name": "Fly Agaric", "image": "..."}'
 *   similar-entities='[{"slug": "...", "name": "...", "similarity": 0.85}, ...]'
 *   max-bubbles="8"
 * ></mini-bubble-view>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class MiniBubbleView extends LitElement {
  static properties = {
    centerEntity: { type: Object, attribute: 'center-entity' },
    similarEntities: { type: Array, attribute: 'similar-entities' },
    maxBubbles: { type: Number, attribute: 'max-bubbles' },
    _hoveredBubble: { type: String, state: true }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      
      .mini-bubble-container {
        position: relative;
        width: 100%;
        aspect-ratio: 2 / 1;
        min-height: 250px;
        max-height: 350px;
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        overflow: hidden;
      }
      
      /* Canvas for connections */
      .connection-canvas {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      
      /* Center Entity */
      .center-bubble {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(145deg, #22c55e, #10b981);
        border: 3px solid rgba(255, 255, 255, 0.3);
        box-shadow: 
          0 0 30px rgba(34, 197, 94, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .center-bubble:hover {
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 
          0 0 40px rgba(34, 197, 94, 0.6),
          inset 0 0 25px rgba(255, 255, 255, 0.2);
      }
      
      .center-bubble img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      
      .center-bubble .center-icon {
        font-size: 32px;
      }
      
      .center-label {
        position: absolute;
        left: 50%;
        top: calc(50% + 55px);
        transform: translateX(-50%);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 10;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
      
      /* Similar Entity Bubbles */
      .similar-bubble {
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.7));
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        z-index: 5;
      }
      
      .similar-bubble:hover {
        transform: scale(1.2);
        z-index: 20;
        box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
      }
      
      .similar-bubble img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      
      .similar-bubble .bubble-icon {
        font-size: 20px;
      }
      
      /* Similarity indicator */
      .similarity-badge {
        position: absolute;
        bottom: -4px;
        right: -4px;
        background: rgba(0, 0, 0, 0.8);
        color: #22c55e;
        font-size: 9px;
        font-weight: bold;
        padding: 2px 5px;
        border-radius: 8px;
        border: 1px solid rgba(34, 197, 94, 0.5);
      }
      
      /* Tooltip */
      .bubble-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-md);
        color: white;
        font-size: var(--font-size-xs);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
        margin-bottom: 8px;
      }
      
      .similar-bubble:hover .bubble-tooltip {
        opacity: 1;
      }
      
      .tooltip-name {
        font-weight: var(--font-weight-semibold);
        margin-bottom: 4px;
      }
      
      .tooltip-similarity {
        color: #22c55e;
      }
      
      /* Connection lines (SVG) */
      .connection-line {
        stroke: rgba(59, 130, 246, 0.4);
        stroke-width: 2;
        fill: none;
        transition: stroke 0.3s ease, stroke-width 0.3s ease;
      }
      
      .connection-line.strong {
        stroke: rgba(34, 197, 94, 0.6);
        stroke-width: 3;
      }
      
      .connection-line.highlighted {
        stroke: rgba(34, 197, 94, 0.8);
        stroke-width: 4;
      }
      
      /* Legend */
      .similarity-legend {
        position: absolute;
        bottom: 12px;
        right: 12px;
        display: flex;
        gap: 12px;
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.6);
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      
      .legend-dot.strong {
        background: #22c55e;
      }
      
      .legend-dot.moderate {
        background: #3b82f6;
      }
      
      /* Empty state */
      .empty-state {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.5);
        gap: 8px;
      }
      
      .empty-icon {
        font-size: 48px;
        opacity: 0.5;
      }
      
      /* View All Link */
      .view-all-link {
        position: absolute;
        bottom: 12px;
        left: 12px;
        padding: 6px 12px;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.4);
        border-radius: var(--radius-full);
        color: #60a5fa;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
      }
      
      .view-all-link:hover {
        background: rgba(59, 130, 246, 0.3);
        color: white;
      }
    `
  ];
  
  constructor() {
    super();
    this.centerEntity = null;
    this.similarEntities = [];
    this.maxBubbles = 8;
    this._hoveredBubble = null;
  }
  
  // Calculate position for each similar entity in an ellipse around center
  _calculatePositions() {
    const entities = this.similarEntities.slice(0, this.maxBubbles);
    const count = entities.length;
    
    if (count === 0) return [];
    
    const positions = [];
    const centerX = 50; // percentage
    const centerY = 50;
    const radiusX = 35; // horizontal radius
    const radiusY = 30; // vertical radius
    
    // Distribute evenly around ellipse
    for (let i = 0; i < count; i++) {
      // Start from top (-90deg) and go clockwise
      const angle = ((i / count) * 2 * Math.PI) - (Math.PI / 2);
      
      // Add slight variation for natural look
      const jitter = (Math.random() - 0.5) * 5;
      
      const x = centerX + (radiusX + jitter) * Math.cos(angle);
      const y = centerY + (radiusY + jitter * 0.5) * Math.sin(angle);
      
      // Size based on similarity
      const similarity = entities[i].similarity || 0.5;
      const size = 40 + (similarity * 20); // 40-60px
      
      positions.push({
        entity: entities[i],
        x,
        y,
        size,
        angle: angle * (180 / Math.PI)
      });
    }
    
    return positions;
  }
  
  _handleBubbleClick(slug) {
    // Dispatch event for navigation
    this.dispatchEvent(new CustomEvent('bubble-click', {
      bubbles: true,
      composed: true,
      detail: { slug }
    }));
    
    // Also navigate directly if no handler catches it
    if (slug) {
      window.location.href = `/fungi/${slug}`;
    }
  }
  
  _renderConnections(positions) {
    if (positions.length === 0) return '';
    
    const centerX = 50;
    const centerY = 50;
    
    return html`
      <svg class="connection-canvas" viewBox="0 0 100 100" preserveAspectRatio="none">
        ${positions.map(pos => {
          const similarity = pos.entity.similarity || 0.5;
          const isStrong = similarity > 0.7;
          const isHighlighted = this._hoveredBubble === pos.entity.slug;
          
          return html`
            <line
              class="connection-line ${isStrong ? 'strong' : ''} ${isHighlighted ? 'highlighted' : ''}"
              x1="${centerX}%"
              y1="${centerY}%"
              x2="${pos.x}%"
              y2="${pos.y}%"
            />
          `;
        })}
      </svg>
    `;
  }
  
  render() {
    const positions = this._calculatePositions();
    const hasData = this.centerEntity || positions.length > 0;
    
    if (!hasData) {
      return html`
        <div class="mini-bubble-container">
          <div class="empty-state">
            <span class="empty-icon">🫧</span>
            <span>No similar species found</span>
          </div>
        </div>
      `;
    }
    
    return html`
      <div class="mini-bubble-container">
        <!-- Connection lines -->
        ${this._renderConnections(positions)}
        
        <!-- Center Entity -->
        <div 
          class="center-bubble"
          @click=${() => this.centerEntity?.slug && this._handleBubbleClick(this.centerEntity.slug)}
        >
          ${this.centerEntity?.image ? html`
            <img src="${this.centerEntity.image}" alt="${this.centerEntity.name || ''}" />
          ` : html`
            <span class="center-icon">🍄</span>
          `}
        </div>
        <div class="center-label">${this.centerEntity?.name || 'Current Species'}</div>
        
        <!-- Similar Entities -->
        ${positions.map(pos => html`
          <div 
            class="similar-bubble"
            style="
              left: ${pos.x}%;
              top: ${pos.y}%;
              width: ${pos.size}px;
              height: ${pos.size}px;
              transform: translate(-50%, -50%);
            "
            @click=${() => this._handleBubbleClick(pos.entity.slug)}
            @mouseenter=${() => this._hoveredBubble = pos.entity.slug}
            @mouseleave=${() => this._hoveredBubble = null}
          >
            ${pos.entity.image ? html`
              <img src="${pos.entity.image}" alt="${pos.entity.name || ''}" />
            ` : html`
              <span class="bubble-icon">🍄</span>
            `}
            
            <span class="similarity-badge">
              ${Math.round((pos.entity.similarity || 0) * 100)}%
            </span>
            
            <div class="bubble-tooltip">
              <div class="tooltip-name">${pos.entity.name || pos.entity.slug}</div>
              <div class="tooltip-similarity">
                Similarity: ${Math.round((pos.entity.similarity || 0) * 100)}%
              </div>
            </div>
          </div>
        `)}
        
        <!-- Legend -->
        <div class="similarity-legend">
          <div class="legend-item">
            <span class="legend-dot strong"></span>
            <span>&gt;70%</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot moderate"></span>
            <span>&lt;70%</span>
          </div>
        </div>
        
        <!-- View All Link -->
        <a href="/fungi" class="view-all-link">
          View in BubbleView →
        </a>
      </div>
    `;
  }
}

customElements.define('mini-bubble-view', MiniBubbleView);
