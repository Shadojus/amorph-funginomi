/**
 * ⚠️ SAFETY MORPH
 * 
 * Displays toxicity/safety information with visual indicators
 * Color-coded badges, pulsing glow for dangerous species
 * 
 * Usage:
 * <safety-morph
 *   edibility="toxic"
 *   toxicity-level="high"
 *   warnings='["Halluzinogen", "Tödlich"]'
 *   lookalikes='["Amanita phalloides"]'
 * ></safety-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class SafetyMorph extends LitElement {
  static properties = {
    edibility: { type: String },
    toxicityLevel: { type: String, attribute: 'toxicity-level' },
    warnings: { type: Array },
    lookalikes: { type: Array },
    compact: { type: Boolean }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
      }
      
      .safety-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .safety-container.compact {
        flex-direction: row;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      /* Main Safety Badge */
      .safety-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: var(--radius-lg);
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-base);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .compact .safety-badge {
        padding: 8px 14px;
        font-size: var(--font-size-sm);
      }
      
      /* SAFE - Green */
      .safety-badge.edible {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.15));
        border: 2px solid #22c55e;
        color: #22c55e;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
      }
      
      .safety-badge.edible .safety-icon {
        color: #22c55e;
      }
      
      /* CAUTION - Yellow/Orange */
      .safety-badge.caution {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.15));
        border: 2px solid #f59e0b;
        color: #f59e0b;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
      }
      
      .safety-badge.caution .safety-icon {
        color: #f59e0b;
      }
      
      /* TOXIC - Red */
      .safety-badge.toxic {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.2));
        border: 2px solid #ef4444;
        color: #ef4444;
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
        animation: toxicPulse 2s ease-in-out infinite;
      }
      
      .safety-badge.toxic .safety-icon {
        color: #ef4444;
        animation: iconPulse 1s ease-in-out infinite;
      }
      
      /* DEADLY - Dark Red with intense glow */
      .safety-badge.deadly {
        background: linear-gradient(135deg, rgba(127, 29, 29, 0.4), rgba(185, 28, 28, 0.3));
        border: 3px solid #dc2626;
        color: #fca5a5;
        box-shadow: 
          0 0 30px rgba(220, 38, 38, 0.5),
          inset 0 0 20px rgba(220, 38, 38, 0.2);
        animation: deadlyPulse 1.5s ease-in-out infinite;
      }
      
      .safety-badge.deadly .safety-icon {
        color: #fca5a5;
        font-size: 1.3em;
        animation: skullPulse 0.8s ease-in-out infinite;
      }
      
      /* UNKNOWN - Gray */
      .safety-badge.unknown {
        background: linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.15));
        border: 2px solid #64748b;
        color: #94a3b8;
        box-shadow: 0 0 15px rgba(100, 116, 139, 0.15);
      }
      
      .safety-icon {
        font-size: 24px;
        flex-shrink: 0;
      }
      
      .compact .safety-icon {
        font-size: 18px;
      }
      
      .safety-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .safety-label {
        font-size: var(--font-size-xs);
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .compact .safety-label {
        display: none;
      }
      
      .safety-status {
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      
      /* Animations */
      @keyframes toxicPulse {
        0%, 100% { 
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 35px rgba(239, 68, 68, 0.5);
          transform: scale(1.01);
        }
      }
      
      @keyframes deadlyPulse {
        0%, 100% { 
          box-shadow: 
            0 0 30px rgba(220, 38, 38, 0.5),
            inset 0 0 20px rgba(220, 38, 38, 0.2);
          transform: scale(1);
        }
        50% { 
          box-shadow: 
            0 0 50px rgba(220, 38, 38, 0.7),
            inset 0 0 30px rgba(220, 38, 38, 0.3);
          transform: scale(1.02);
        }
      }
      
      @keyframes iconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      
      @keyframes skullPulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
      }
      
      /* Warnings List */
      .warnings-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      
      .compact .warnings-list {
        margin-top: 0;
      }
      
      .warning-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-full);
        color: #fca5a5;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
      }
      
      .warning-tag::before {
        content: '⚠️';
        font-size: 10px;
      }
      
      /* Lookalikes */
      .lookalikes-section {
        margin-top: 12px;
        padding: 12px;
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: var(--radius-md);
      }
      
      .lookalikes-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: #fbbf24;
        margin-bottom: 8px;
      }
      
      .lookalike-item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: rgba(245, 158, 11, 0.15);
        border-radius: var(--radius-full);
        color: #fcd34d;
        font-size: var(--font-size-xs);
        margin: 4px 4px 0 0;
      }
      
      .lookalike-item::before {
        content: '🔍';
        font-size: 10px;
      }
    `
  ];
  
  constructor() {
    super();
    this.edibility = 'unknown';
    this.toxicityLevel = '';
    this.warnings = [];
    this.lookalikes = [];
    this.compact = false;
  }
  
  _getSafetyClass() {
    const edibility = this.edibility?.toLowerCase() || '';
    const toxicity = this.toxicityLevel?.toLowerCase() || '';
    
    // Check for deadly first
    if (toxicity === 'deadly' || toxicity === 'lethal' || edibility === 'deadly') {
      return 'deadly';
    }
    
    // High toxicity or toxic edibility
    if (toxicity === 'high' || edibility === 'toxic' || edibility === 'poisonous') {
      return 'toxic';
    }
    
    // Moderate toxicity or conditional edibility
    if (toxicity === 'moderate' || toxicity === 'medium' || 
        edibility === 'conditional' || edibility === 'caution' || 
        edibility === 'inedible') {
      return 'caution';
    }
    
    // Low toxicity or edible
    if (toxicity === 'low' || toxicity === 'none' || 
        edibility === 'edible' || edibility === 'choice' || edibility === 'excellent') {
      return 'edible';
    }
    
    return 'unknown';
  }
  
  _getIcon() {
    const safetyClass = this._getSafetyClass();
    const icons = {
      'deadly': '☠️',
      'toxic': '⚠️',
      'caution': '⚡',
      'edible': '✅',
      'unknown': '❓'
    };
    return icons[safetyClass] || '❓';
  }
  
  _getLabel() {
    const safetyClass = this._getSafetyClass();
    const labels = {
      'deadly': 'DEADLY',
      'toxic': 'TOXIC',
      'caution': 'CAUTION',
      'edible': 'EDIBLE',
      'unknown': 'UNKNOWN'
    };
    return labels[safetyClass] || 'UNKNOWN';
  }
  
  _formatEdibility() {
    if (!this.edibility) return '';
    return this.edibility.charAt(0).toUpperCase() + this.edibility.slice(1);
  }
  
  render() {
    const safetyClass = this._getSafetyClass();
    const hasWarnings = this.warnings && this.warnings.length > 0;
    const hasLookalikes = this.lookalikes && this.lookalikes.length > 0;
    
    return html`
      <div class="safety-container ${this.compact ? 'compact' : ''}">
        <div class="safety-badge ${safetyClass}">
          <span class="safety-icon">${this._getIcon()}</span>
          <div class="safety-text">
            <span class="safety-label">Safety Status</span>
            <span class="safety-status">${this._getLabel()}</span>
          </div>
        </div>
        
        ${hasWarnings && !this.compact ? html`
          <div class="warnings-list">
            ${this.warnings.map(warning => html`
              <span class="warning-tag">${warning}</span>
            `)}
          </div>
        ` : ''}
        
        ${hasLookalikes && !this.compact ? html`
          <div class="lookalikes-section">
            <div class="lookalikes-title">
              <span>👀</span>
              <span>Can be confused with:</span>
            </div>
            <div>
              ${this.lookalikes.map(species => html`
                <span class="lookalike-item">${species}</span>
              `)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('safety-morph', SafetyMorph);
