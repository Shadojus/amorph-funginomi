/**
 * 🔍 QUERY MORPH
 * ==============
 * 
 * Represents search queries and semantic concepts as bubbles
 * Acts as a dynamic node that connects to relevant fungi/data
 * 
 * Features:
 * - Visualizes search queries as bubbles
 * - Shows semantic connections to data
 * - Updates connections based on relevance
 * - Interactive - click to refine/expand query
 * 
 * Props:
 * - query: Search query string
 * - type: 'search' | 'concept' | 'field' | 'tag'
 * - relevanceScores: Map of related items and their scores
 * - perspectives: Array of active perspectives
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class QueryMorph extends LitElement {
  static properties = {
    query: { type: String },
    type: { type: String },
    relevanceScores: { type: Object },
    perspectives: { type: Array },
    x: { type: Number },
    y: { type: Number },
    size: { type: Number },
    isActive: { type: Boolean }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        position: absolute;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
      }

      .query-bubble {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.3), 
          rgba(168, 85, 247, 0.3)
        );
        border: 3px solid rgba(168, 85, 247, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      :host(:hover) .query-bubble {
        transform: scale(1.1);
        border-color: rgba(168, 85, 247, 1);
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
      }

      :host([isActive]) .query-bubble {
        border-width: 4px;
        box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .query-content {
        text-align: center;
        padding: 1rem;
        max-width: 90%;
      }

      .query-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .query-text {
        font-size: 0.875rem;
        font-weight: 600;
        color: white;
        word-break: break-word;
        line-height: 1.3;
      }

      .query-type {
        font-size: 0.625rem;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 0.25rem;
      }

      .connection-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: rgba(168, 85, 247, 1);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        border: 2px solid black;
      }
    `
  ];

  constructor() {
    super();
    this.query = '';
    this.type = 'search';
    this.relevanceScores = new Map();
    this.perspectives = [];
    this.x = 0;
    this.y = 0;
    this.size = 100;
    this.isActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register with AMORPH system
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }

    this.setAttribute('data-morph', '');
    this.setAttribute('data-morph-type', 'query');
  }

  /**
   * Get icon based on type
   */
  getIcon() {
    const icons = {
      search: '🔍',
      concept: '💡',
      field: '📊',
      tag: '🏷️'
    };
    return icons[this.type] || '🔍';
  }

  /**
   * Handle click - emit event for query interaction
   */
  handleClick(e) {
    e.stopPropagation();
    
    this.dispatchEvent(new CustomEvent('query-click', {
      bubbles: true,
      composed: true,
      detail: {
        query: this.query,
        type: this.type,
        relevanceScores: this.relevanceScores
      }
    }));

    console.log('[QueryMorph] Clicked:', this.query, `(${this.relevanceScores.size} connections)`);
  }

  render() {
    const connectionCount = this.relevanceScores.size;

    return html`
      <div 
        class="query-bubble"
        @click=${this.handleClick}
        style="width: ${this.size}px; height: ${this.size}px;"
      >
        <div class="query-content">
          <div class="query-icon">${this.getIcon()}</div>
          <div class="query-text">${this.query}</div>
          <div class="query-type">${this.type}</div>
        </div>

        ${connectionCount > 0 ? html`
          <div class="connection-count">${connectionCount}</div>
        ` : null}
      </div>
    `;
  }
}

customElements.define('query-morph', QueryMorph);
