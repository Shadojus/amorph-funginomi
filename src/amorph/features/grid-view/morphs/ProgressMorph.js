/**
 * 📈 PROGRESS MORPH - Datengetrieben
 * 
 * Zeigt Fortschritt/Prozente als kompakten Balken
 * REIN DATENGETRIEBEN - Funktioniert mit value/max oder percentage
 * 
 * Input: { value: 75, max: 100 } oder { percentage: 75 }
 * Output: Fortschrittsbalken mit Prozent
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class ProgressMorph extends LitElement {
  static properties = {
    data: { type: Object }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        font-family: var(--font-sans);
        max-width: 100%;
        overflow: hidden;
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-full);
        overflow: hidden;
        min-width: 60px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-culinary), var(--color-cultivation));
        border-radius: var(--radius-full);
        transition: width var(--transition-base);
      }

      .progress-label {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        min-width: 35px;
        text-align: right;
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }
    `
  ];

  constructor() {
    super();
    this.data = {};
  }

  render() {
    let percent = 0;

    // Datengetrieben: Akzeptiere verschiedene Formate
    if (this.data.percentage !== undefined) {
      percent = this.data.percentage;
    } else if (this.data.value !== undefined && this.data.max !== undefined) {
      percent = (this.data.value / this.data.max) * 100;
    } else if (typeof this.data === 'number') {
      percent = this.data;
    }

    // Clamp zwischen 0-100
    percent = Math.max(0, Math.min(100, percent));

    return html`
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="progress-label">${Math.round(percent)}%</div>
      </div>
    `;
  }
}

customElements.define('progress-morph', ProgressMorph);
