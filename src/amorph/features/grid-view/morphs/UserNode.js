/**
 * 👤 USER NODE MORPH
 * ==================
 * 
 * Zentrale Node die ALLE User-Interaktionen sammelt und visualisiert
 * 
 * Konzept:
 * - Eine zentrale Bubble in der Mitte des Bubble Views
 * - Sammelt ALLE Events: Search, Perspectives, Selections, Clicks
 * - Erstellt gewichtete Connections zu relevanten Daten
 * - User kann die Node resetten
 * - Visualisiert den "Intent" des Users
 * 
 * Events die gesammelt werden:
 * - search:input → Suchbegriffe
 * - perspective-changed → Aktive Perspektiven
 * - bubble-selected → Ausgewählte Entities
 * - tag-clicked → Geklickte Tags
 * - reactor:enabled → Aktivierte Reactors
 * 
 * Features:
 * - Zentrale Position (immer in der Mitte)
 * - Dynamische Größe basierend auf Aktivität
 * - Farbcodierung nach dominanter Perspektive
 * - Connection-Gewichtungen basierend auf User-Intent
 * - Reset-Button zum Neustart
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class UserNode extends LitElement {
  static properties = {
    interactions: { type: Array }, // Array of all user interactions
    activePerspectives: { type: Array },
    searchQueries: { type: Array },
    selectedBubbles: { type: Array },
    dominantPerspective: { type: String },
    activityLevel: { type: Number }, // 0-1 scale
    connections: { type: Map }, // slug -> weight
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

      .user-node {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, 
          rgba(59, 130, 246, 0.4), 
          rgba(99, 102, 241, 0.4)
        );
        border: 4px solid rgba(99, 102, 241, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(15px);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
      }

      :host(:hover) .user-node {
        transform: scale(1.05);
        box-shadow: 0 12px 48px rgba(99, 102, 241, 0.6);
      }

      :host([isActive]) .user-node {
        border-width: 5px;
        animation: pulse-user 2s ease-in-out infinite;
      }

      @keyframes pulse-user {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
        }
        50% { 
          transform: scale(1.08);
          box-shadow: 0 12px 48px rgba(99, 102, 241, 0.7);
        }
      }

      .user-content {
        text-align: center;
        padding: 1rem;
        max-width: 90%;
      }

      .user-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
      }

      .user-label {
        font-size: 1rem;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        margin-bottom: 0.25rem;
      }

      .user-stats {
        font-size: 0.625rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.4;
      }

      .activity-ring {
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: rgba(99, 102, 241, 0.8);
        animation: spin 3s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .reset-button {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.9);
        border: 2px solid rgba(239, 68, 68, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.2rem;
        color: white;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      }

      .reset-button:hover {
        transform: scale(1.15) rotate(90deg);
        background: rgba(239, 68, 68, 1);
        box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
      }

      .perspective-badges {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 4px;
        pointer-events: none;
      }

      .perspective-badge {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .connection-count {
        position: absolute;
        top: -12px;
        left: -12px;
        background: rgba(99, 102, 241, 1);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: 700;
        border: 3px solid black;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
    `
  ];

  constructor() {
    super();
    this.interactions = [];
    this.activePerspectives = [];
    this.searchQueries = [];
    this.selectedBubbles = [];
    this.dominantPerspective = 'culinaryAndNutritional';
    this.activityLevel = 0;
    this.connections = new Map();
    this.x = 0;
    this.y = 0;
    this.size = 160; // Larger than other bubbles
    this.isActive = true;
    
    // Track interaction history
    this.interactionHistory = [];
    this.maxHistorySize = 50;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register with AMORPH system
    if (window.amorph) {
      window.amorph.registerMorph(this);
      this.amorph = window.amorph;
      
      // Listen to ALL relevant events
      this.setupEventListeners();
    }

    this.setAttribute('data-morph', '');
    this.setAttribute('data-morph-type', 'user-node');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  /**
   * Setup event listeners for all user interactions
   */
  setupEventListeners() {
    // Search events
    this._searchHandler = (data) => {
      this.addInteraction('search', data.query, 1.0);
      if (!this.searchQueries.includes(data.query) && data.query !== '') {
        this.searchQueries = [...this.searchQueries, data.query];
      }
      this.requestUpdate();
    };
    this.amorph.on('search:input', this._searchHandler);

    // Perspective events
    this._perspectiveHandler = (event) => {
      const perspectives = event.detail?.perspectives || [];
      this.activePerspectives = perspectives;
      this.addInteraction('perspective', perspectives.join(', '), 0.8);
      this.updateDominantPerspective();
      this.requestUpdate();
    };
    window.addEventListener('perspective-changed', this._perspectiveHandler);

    // Selection events (from BubbleView)
    this._selectionHandler = (event) => {
      const selected = event.detail?.selected || [];
      this.selectedBubbles = selected;
      this.addInteraction('selection', selected.join(', '), 0.9);
      this.requestUpdate();
    };
    window.addEventListener('bubble-selection-changed', this._selectionHandler);

    console.log('[UserNode] Event listeners active');
  }

  /**
   * Remove event listeners
   */
  removeEventListeners() {
    if (this.amorph && this._searchHandler) {
      this.amorph.off('search:input', this._searchHandler);
    }
    if (this._perspectiveHandler) {
      window.removeEventListener('perspective-changed', this._perspectiveHandler);
    }
    if (this._selectionHandler) {
      window.removeEventListener('bubble-selection-changed', this._selectionHandler);
    }
  }

  /**
   * Add interaction to history
   */
  addInteraction(type, value, weight = 1.0) {
    const interaction = {
      type,
      value,
      weight,
      timestamp: Date.now()
    };

    this.interactionHistory.unshift(interaction);
    
    // Keep only recent interactions
    if (this.interactionHistory.length > this.maxHistorySize) {
      this.interactionHistory = this.interactionHistory.slice(0, this.maxHistorySize);
    }

    // Update activity level (0-1)
    this.activityLevel = Math.min(1.0, this.interactionHistory.length / 20);

    // Dispatch event for connection updates
    this.dispatchEvent(new CustomEvent('user-interaction', {
      bubbles: true,
      composed: true,
      detail: { interaction, history: this.interactionHistory }
    }));

    console.log('[UserNode] Interaction added:', type, value);
  }

  /**
   * Update dominant perspective based on active perspectives
   */
  updateDominantPerspective() {
    if (this.activePerspectives.length > 0) {
      this.dominantPerspective = this.activePerspectives[0];
    }
  }

  /**
   * Reset user node (clear all interactions)
   */
  reset() {
    this.interactions = [];
    this.searchQueries = [];
    this.selectedBubbles = [];
    this.interactionHistory = [];
    this.activityLevel = 0;
    this.connections.clear();

    this.dispatchEvent(new CustomEvent('user-node-reset', {
      bubbles: true,
      composed: true
    }));

    console.log('[UserNode] Reset!');
    this.requestUpdate();
  }

  /**
   * Handle click
   */
  handleClick(e) {
    e.stopPropagation();
    
    this.dispatchEvent(new CustomEvent('user-node-click', {
      bubbles: true,
      composed: true,
      detail: {
        interactions: this.interactionHistory,
        perspectives: this.activePerspectives,
        searches: this.searchQueries
      }
    }));

    console.log('[UserNode] Clicked - Interactions:', this.interactionHistory.length);
  }

  /**
   * Handle reset button click
   */
  handleReset(e) {
    e.stopPropagation();
    this.reset();
  }

  /**
   * Get perspective colors
   */
  getPerspectiveColors() {
    const colorMap = {
      taxonomy: '#ef4444',
      physicalCharacteristics: '#f97316',
      ecologyAndHabitat: '#eab308',
      culinaryAndNutritional: '#22c55e',
      medicinalAndHealth: '#06b6d4',
      cultivationAndProcessing: '#3b82f6',
      safetyAndIdentification: '#8b5cf6',
      chemicalAndProperties: '#ec4899',
      culturalAndHistorical: '#d946ef',
      commercialAndMarket: '#14b8a6',
      environmentalAndConservation: '#10b981',
      researchAndInnovation: '#0ea5e9'
    };

    return this.activePerspectives.slice(0, 4).map(p => ({
      name: p,
      color: colorMap[p] || '#ffffff'
    }));
  }

  render() {
    const perspectiveColors = this.getPerspectiveColors();
    const connectionCount = this.connections.size;
    const interactionCount = this.interactionHistory.length;

    return html`
      <div 
        class="user-node"
        @click=${this.handleClick}
        style="width: ${this.size}px; height: ${this.size}px;"
      >
        ${this.activityLevel > 0.3 ? html`
          <div class="activity-ring"></div>
        ` : null}

        <div class="user-content">
          <div class="user-stats">
            Threshold: ${(this.activityLevel * 100).toFixed(0)}%
          </div>
        </div>

        ${interactionCount > 0 ? html`
          <button 
            class="reset-button"
            @click=${this.handleReset}
            title="Reset interactions"
          >
            ↻
          </button>
        ` : null}

        ${connectionCount > 0 ? html`
          <div class="connection-count">${connectionCount}</div>
        ` : null}

        ${perspectiveColors.length > 0 ? html`
          <div class="perspective-badges">
            ${perspectiveColors.map(p => html`
              <div 
                class="perspective-badge"
                style="background-color: ${p.color}"
                title="${p.name}"
              >
              </div>
            `)}
          </div>
        ` : null}
      </div>
    `;
  }
}

customElements.define('user-node', UserNode);
