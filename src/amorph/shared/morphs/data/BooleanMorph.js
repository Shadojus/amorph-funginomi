/**
 * ✓ BOOLEAN MORPH
 * ===============
 * 
 * Atomic Morph für Boolean-Werte mit visuellen Icons
 * Perfect for: edible, toxic, cultivable, etc.
 * 
 * Usage:
 * <boolean-morph 
 *   value="true"
 *   label="Edible"
 *   icon="✓"
 *   true-color="#22c55e"
 *   false-color="#ef4444"
 * ></boolean-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from '../../styles/tokens.js';

export class BooleanMorph extends LitElement {
  static properties = {
    value: { type: Boolean },
    label: { type: String },
    icon: { type: String },
    trueColor: { type: String, attribute: 'true-color' },
    falseColor: { type: String, attribute: 'false-color' },
    perspectives: { type: Array }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: inline-block;
      }

      .boolean-container {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        transition: var(--transition-base);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
    }

    .boolean-container.true {
      background: rgba(34, 197, 94, 0.1);
      border: 1.5px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .boolean-container.false {
      background: rgba(239, 68, 68, 0.1);
      border: 1.5px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .icon {
      font-size: 1.25rem;
      line-height: 1;
    }

    .label {
      user-select: none;
    }

    @media (prefers-color-scheme: dark) {
      .boolean-container.true {
        background: rgba(34, 197, 94, 0.15);
        border-color: rgba(34, 197, 94, 0.4);
      }

      .boolean-container.false {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.4);
      }
    }
    `
  ];

  constructor() {
    super();
    this.value = false;
    this.label = '';
    this.icon = '';
    this.trueColor = '#22c55e';
    this.falseColor = '#ef4444';
    this.perspectives = [];
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'boolean';
    this.dataset.morphId = this.id || `boolean-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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

  getIcon() {
    if (this.icon) return this.icon;
    return this.value ? '✓' : '✗';
  }

  render() {
    return html`
      <div 
        class="boolean-container ${this.value ? 'true' : 'false'}"
        style="
          ${this.value ? `border-color: ${this.trueColor}44; color: ${this.trueColor};` : ''}
          ${!this.value ? `border-color: ${this.falseColor}44; color: ${this.falseColor};` : ''}
        "
      >
        <span class="icon">${this.getIcon()}</span>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </div>
    `;
  }
}

customElements.define('boolean-morph', BooleanMorph);
