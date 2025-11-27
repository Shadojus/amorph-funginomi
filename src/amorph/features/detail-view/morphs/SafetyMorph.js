/**
 * SafetyMorph - Toxicity & Safety Indicator Badge
 * 
 * Displays safety information with color-coded badges,
 * pulsing glow for dangerous species, and expandable warnings.
 * 
 * @version 1.0.0
 * @since 2025-11-27
 * @feature detail-view
 */

import { LitElement, html, css } from 'lit';

export class SafetyMorph extends LitElement {
  static properties = {
    // Attribute-based properties for Astro integration
    edibility: { type: String },
    toxicityLevel: { type: String, attribute: 'toxicity-level' },
    warnings: { type: String },        // JSON string
    lookalikes: { type: String },      // JSON string
    // Internal state
    expanded: { type: Boolean, state: true },
    safetyLevel: { type: String, state: true },
    _warnings: { type: Array, state: true },
    _lookalikes: { type: Array, state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .safety-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .safety-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      width: fit-content;
    }

    .safety-badge:hover {
      transform: scale(1.02);
    }

    /* Edible - Green */
    .safety-badge.edible,
    .safety-badge.choice {
      background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
    }

    /* Caution - Yellow/Orange */
    .safety-badge.caution,
    .safety-badge.conditional {
      background: linear-gradient(135deg, #f57c00 0%, #e65100 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(245, 124, 0, 0.4);
    }

    /* Inedible - Gray */
    .safety-badge.inedible {
      background: linear-gradient(135deg, #616161 0%, #424242 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(97, 97, 97, 0.4);
    }

    /* Toxic - Red with pulse */
    .safety-badge.toxic,
    .safety-badge.poisonous {
      background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%);
      color: white;
      box-shadow: 0 2px 12px rgba(198, 40, 40, 0.5);
      animation: danger-pulse 2s ease-in-out infinite;
    }

    /* Deadly - Dark Red with strong pulse */
    .safety-badge.deadly,
    .safety-badge.lethal {
      background: linear-gradient(135deg, #880e4f 0%, #4a0e2a 100%);
      color: white;
      box-shadow: 0 2px 16px rgba(136, 14, 79, 0.6);
      animation: danger-pulse 1.5s ease-in-out infinite;
      border-color: #ff1744;
    }

    /* Unknown */
    .safety-badge.unknown {
      background: linear-gradient(135deg, #455a64 0%, #37474f 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(69, 90, 100, 0.4);
    }

    @keyframes danger-pulse {
      0%, 100% {
        box-shadow: 0 2px 12px rgba(198, 40, 40, 0.5);
      }
      50% {
        box-shadow: 0 2px 24px rgba(198, 40, 40, 0.8), 0 0 40px rgba(198, 40, 40, 0.4);
      }
    }

    .safety-icon {
      font-size: 18px;
    }

    .safety-label {
      flex: 1;
    }

    .expand-arrow {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
      fill: currentColor;
    }

    .expand-arrow.expanded {
      transform: rotate(180deg);
    }

    .warning-panel {
      background: rgba(0, 0, 0, 0.6);
      border-radius: 12px;
      padding: 16px;
      margin-top: 8px;
      border-left: 4px solid currentColor;
      animation: slide-down 0.3s ease-out;
    }

    .toxic .warning-panel,
    .deadly .warning-panel,
    .poisonous .warning-panel,
    .lethal .warning-panel {
      border-left-color: #ff1744;
      background: rgba(198, 40, 40, 0.15);
    }

    .caution .warning-panel,
    .conditional .warning-panel {
      border-left-color: #ff9800;
      background: rgba(245, 124, 0, 0.15);
    }

    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .warning-title {
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .warning-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .warning-list li {
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      line-height: 1.6;
      padding-left: 20px;
      position: relative;
    }

    .warning-list li::before {
      content: '⚠️';
      position: absolute;
      left: 0;
      font-size: 11px;
    }

    .lookalikes-section {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .lookalikes-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }

    .lookalikes-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .lookalike-tag {
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `;

  constructor() {
    super();
    this.edibility = 'unknown';
    this.toxicityLevel = '';
    this.warnings = '[]';
    this.lookalikes = '[]';
    this.expanded = false;
    this.safetyLevel = 'unknown';
    this._warnings = [];
    this._lookalikes = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseData();
    this._determineSafetyLevel();
  }

  _parseData() {
    try {
      this._warnings = JSON.parse(this.warnings || '[]');
    } catch (e) {
      this._warnings = [];
    }
    
    try {
      this._lookalikes = JSON.parse(this.lookalikes || '[]');
    } catch (e) {
      this._lookalikes = [];
    }
  }

  _determineSafetyLevel() {
    const toxicity = (this.toxicityLevel || '').toLowerCase();
    const edibility = (this.edibility || '').toLowerCase();
    
    // Check toxicity first
    if (toxicity === 'deadly' || toxicity === 'lethal') {
      this.safetyLevel = 'deadly';
    } else if (toxicity === 'toxic' || toxicity === 'poisonous' || toxicity === 'high') {
      this.safetyLevel = 'toxic';
    } else if (toxicity === 'moderate' || edibility === 'caution' || edibility === 'conditionally-edible' || edibility === 'conditional') {
      this.safetyLevel = 'caution';
    } else if (edibility === 'edible' || edibility === 'choice' || edibility === 'choice-edible') {
      this.safetyLevel = 'edible';
    } else if (edibility === 'inedible' || edibility === 'not-recommended') {
      this.safetyLevel = 'inedible';
    } else {
      this.safetyLevel = 'unknown';
    }
  }

  _getIcon() {
    const icons = {
      edible: '✅',
      choice: '✅',
      caution: '⚠️',
      conditional: '⚠️',
      inedible: '🚫',
      toxic: '☠️',
      poisonous: '☠️',
      deadly: '💀',
      lethal: '💀',
      unknown: '❓'
    };
    return icons[this.safetyLevel] || icons.unknown;
  }

  _getLabel() {
    const labels = {
      edible: 'Edible',
      choice: 'Choice Edible',
      caution: 'Caution Required',
      conditional: 'Conditionally Edible',
      inedible: 'Not Edible',
      toxic: 'Toxic - Do Not Consume',
      poisonous: 'Poisonous',
      deadly: '☠️ Potentially Deadly',
      lethal: '☠️ Lethal',
      unknown: 'Safety Unknown'
    };
    return labels[this.safetyLevel] || labels.unknown;
  }

  _toggleExpanded() {
    this.expanded = !this.expanded;
  }

  _hasWarningContent() {
    return this._warnings.length > 0 || 
           this._lookalikes.length > 0 ||
           this.safetyLevel === 'toxic' || 
           this.safetyLevel === 'deadly' || 
           this.safetyLevel === 'caution';
  }

  render() {
    const hasWarning = this._hasWarningContent();

    return html`
      <div class="safety-container ${this.safetyLevel}">
        <div 
          class="safety-badge ${this.safetyLevel}"
          @click=${hasWarning ? this._toggleExpanded : null}
          role="${hasWarning ? 'button' : 'status'}"
          aria-expanded=${hasWarning ? this.expanded : null}
        >
          <span class="safety-icon">${this._getIcon()}</span>
          <span class="safety-label">${this._getLabel()}</span>
          ${hasWarning ? html`
            <svg class="expand-arrow ${this.expanded ? 'expanded' : ''}" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          ` : ''}
        </div>

        ${this.expanded && hasWarning ? html`
          <div class="warning-panel">
            <div class="warning-title">
              ⚠️ Safety Information
            </div>
            
            ${this._warnings.length > 0 ? html`
              <ul class="warning-list">
                ${this._warnings.map(w => html`<li>${w}</li>`)}
              </ul>
            ` : html`
              <ul class="warning-list">
                <li>
                  ${this.safetyLevel === 'deadly' ? 'This species can cause fatal poisoning. Never consume under any circumstances.' :
                    this.safetyLevel === 'toxic' ? 'This species is poisonous and should never be consumed.' :
                    this.safetyLevel === 'caution' ? 'Exercise caution. Proper identification and preparation is essential.' :
                    'Limited safety information available. When in doubt, do not consume.'}
                </li>
              </ul>
            `}

            ${this._lookalikes.length > 0 ? html`
              <div class="lookalikes-section">
                <div class="lookalikes-title">⚡ Lookalike Species (Easily Confused)</div>
                <div class="lookalikes-list">
                  ${this._lookalikes.map(l => html`
                    <span class="lookalike-tag">${l}</span>
                  `)}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('safety-morph', SafetyMorph);
