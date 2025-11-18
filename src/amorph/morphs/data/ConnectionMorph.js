/**
 * 🔗 CONNECTION MORPH
 * ====================
 * 
 * Vector Morph representing weighted connections between bubbles
 * Visualizes similarity, relationships, and data links
 * 
 * Features:
 * - Dynamic weight visualization (thickness, opacity, color)
 * - Interactive hover states
 * - Perspective-aware coloring
 * - Animated flow effects
 * - Click handlers for connection details
 * 
 * Props:
 * - from: Source bubble slug
 * - to: Target bubble slug
 * - weight: Connection strength (0.0 - 1.0)
 * - type: 'similarity' | 'reference' | 'semantic' | 'temporal'
 * - perspectives: Array of active perspectives
 * - bidirectional: Boolean
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from '../../arch/styles/tokens.js';

export class ConnectionMorph extends LitElement {
  static properties = {
    from: { type: String },
    to: { type: String },
    weight: { type: Number },
    type: { type: String },
    perspectives: { type: Array },
    bidirectional: { type: Boolean },
    fromX: { type: Number },
    fromY: { type: Number },
    toX: { type: Number },
    toY: { type: Number },
    animated: { type: Boolean },
    highlighted: { type: Boolean }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: contents;
        pointer-events: none;
      }

      .connection-line {
        stroke-linecap: round;
        transition: all 0.3s ease;
        cursor: pointer;
        pointer-events: stroke;
      }

      .connection-line:hover {
        filter: brightness(1.5) drop-shadow(0 0 8px currentColor);
      }

      .connection-label {
        font-family: var(--font-mono, monospace);
        font-size: 11px;
        font-weight: 600;
        fill: white;
        text-anchor: middle;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      :host(:hover) .connection-label {
        opacity: 1;
      }

      .connection-arrow {
        fill: currentColor;
        opacity: 0.8;
      }

      .flow-particle {
        r: 3;
        fill: white;
        opacity: 0.6;
        animation: flow 3s linear infinite;
      }

      @keyframes flow {
        0% { opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% { opacity: 0; }
      }

      .connection-glow {
        stroke-width: 10;
        opacity: 0;
        filter: blur(8px);
        pointer-events: none;
      }

      :host([highlighted]) .connection-glow {
        opacity: 0.3;
        animation: pulse-glow 2s ease-in-out infinite;
      }

      @keyframes pulse-glow {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.5; }
      }
    `
  ];

  constructor() {
    super();
    this.from = '';
    this.to = '';
    this.weight = 0.5;
    this.type = 'similarity';
    this.perspectives = [];
    this.bidirectional = false;
    this.fromX = 0;
    this.fromY = 0;
    this.toX = 0;
    this.toY = 0;
    this.animated = true;
    this.highlighted = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register with AMORPH system
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }

    // Set morph attributes for reactor targeting
    this.setAttribute('data-morph', '');
    this.setAttribute('data-morph-type', 'connection');
  }

  /**
   * Get connection color based on type and weight
   */
  getColor() {
    const colors = {
      similarity: `rgba(102, 126, 234, ${0.3 + this.weight * 0.6})`,
      reference: `rgba(34, 197, 94, ${0.3 + this.weight * 0.6})`,
      semantic: `rgba(168, 85, 247, ${0.3 + this.weight * 0.6})`,
      temporal: `rgba(251, 146, 60, ${0.3 + this.weight * 0.6})`
    };
    return colors[this.type] || colors.similarity;
  }

  /**
   * Get line thickness based on weight
   */
  getThickness() {
    return 1 + (this.weight * 7); // 1-8px range
  }

  /**
   * Calculate midpoint for label
   */
  getMidpoint() {
    return {
      x: (this.fromX + this.toX) / 2,
      y: (this.fromY + this.toY) / 2
    };
  }

  /**
   * Calculate angle for arrow
   */
  getAngle() {
    return Math.atan2(this.toY - this.fromY, this.toX - this.fromX);
  }

  /**
   * Handle click
   */
  handleClick(e) {
    e.stopPropagation();
    
    this.dispatchEvent(new CustomEvent('connection-click', {
      bubbles: true,
      composed: true,
      detail: {
        from: this.from,
        to: this.to,
        weight: this.weight,
        type: this.type
      }
    }));

    console.log('[ConnectionMorph] Clicked:', this.from, '→', this.to, `(${Math.round(this.weight * 100)}%)`);
  }

  /**
   * Render arrow marker
   */
  renderArrow() {
    if (this.bidirectional) return null;

    const angle = this.getAngle();
    const distance = Math.sqrt(
      Math.pow(this.toX - this.fromX, 2) + 
      Math.pow(this.toY - this.fromY, 2)
    );
    
    // Position arrow 20px before target
    const arrowDist = distance - 20;
    const arrowX = this.fromX + Math.cos(angle) * arrowDist;
    const arrowY = this.fromY + Math.sin(angle) * arrowDist;
    const arrowAngle = angle * (180 / Math.PI);

    return html`
      <g transform="translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})">
        <polygon 
          class="connection-arrow"
          points="0,0 -8,-4 -8,4"
          style="color: ${this.getColor()}"
        />
      </g>
    `;
  }

  /**
   * Render flow particles along connection
   */
  renderFlowParticles() {
    if (!this.animated) return null;

    const particles = [];
    const numParticles = Math.ceil(this.weight * 3); // More particles for stronger connections

    for (let i = 0; i < numParticles; i++) {
      const delay = (i / numParticles) * 3; // Stagger particles
      particles.push(html`
        <circle 
          class="flow-particle"
          style="animation-delay: ${delay}s"
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin="${delay}s"
          >
            <mpath href="#connection-path-${this.from}-${this.to}" />
          </animateMotion>
        </circle>
      `);
    }

    return particles;
  }

  render() {
    if (!this.from || !this.to) return null;
    
    const midpoint = this.getMidpoint();
    const color = this.getColor();
    const thickness = this.getThickness();
    const percentage = Math.round(this.weight * 100);

    return html`
      <svg 
        style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Define path for animations -->
          <path 
            id="connection-path-${this.from}-${this.to}"
            d="M ${this.fromX},${this.fromY} L ${this.toX},${this.toY}"
          />
        </defs>

        <!-- Glow effect -->
        <line
          class="connection-glow"
          x1="${this.fromX}"
          y1="${this.fromY}"
          x2="${this.toX}"
          y2="${this.toY}"
          stroke="${color}"
        />

        <!-- Main connection line -->
        <line
          class="connection-line"
          x1="${this.fromX}"
          y1="${this.fromY}"
          x2="${this.toX}"
          y2="${this.toY}"
          stroke="${color}"
          stroke-width="${thickness}"
          @click=${this.handleClick}
        />

        <!-- Arrow -->
        ${this.renderArrow()}

        <!-- Flow particles -->
        ${this.renderFlowParticles()}

        <!-- Weight label -->
        <text
          class="connection-label"
          x="${midpoint.x}"
          y="${midpoint.y - 8}"
        >
          ${percentage}%
        </text>

        <!-- Type indicator -->
        ${this.type !== 'similarity' ? html`
          <text
            class="connection-label"
            x="${midpoint.x}"
            y="${midpoint.y + 16}"
            style="font-size: 9px; opacity: 0.6;"
          >
            ${this.type}
          </text>
        ` : null}
      </svg>
    `;
  }
}

customElements.define('connection-morph', ConnectionMorph);
