/**
 * 📊 CHART MORPH
 * ==============
 * 
 * Data visualization morph using Chart.js
 * 
 * Features:
 * - Bar, Line, Pie, Radar, Doughnut charts
 * - Animated transitions
 * - Responsive sizing
 * - Perspective-based colors
 * - Interactive tooltips
 * 
 * Usage:
 * <chart-morph
 *   type="bar"
 *   data='{"labels":["A","B"],"values":[10,20]}'
 *   perspectives='["ecology"]'
 * ></chart-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';
import { globalStyles } from '../../arch/styles/tokens.js';

export class ChartMorph extends LitElement {
  static properties = {
    type: { type: String },
    data: { type: Object },
    label: { type: String },
    perspectives: { type: Array },
    width: { type: Number },
    height: { type: Number }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }

    .chart-label {
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-bottom: 12px;
      text-align: center;
    }

    .chart-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    canvas {
      max-width: 100%;
      height: auto !important;
    }
    `
  ];

  constructor() {
    super();
    this.type = 'bar';
    this.data = { labels: [], values: [] };
    this.label = '';
    this.perspectives = [];
    this.width = 300;
    this.height = 200;
    this.chart = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'chart';
    this.dataset.morphId = this.id || `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Safety Check
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.registerMorph(this);
    }
  }

  firstUpdated() {
    // Render chart after DOM is ready
    this.renderChart();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.unregisterMorph(this);
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('data') || changedProperties.has('type')) {
      this.updateChart();
    }
  }

  willUpdate(changedProperties) {
    // Parse JSON strings
    if (changedProperties.has('data') && typeof this.data === 'string') {
      try {
        this.data = JSON.parse(this.data);
      } catch (e) {
        console.error('[ChartMorph] Invalid data JSON', e);
      }
    }
    
    if (changedProperties.has('perspectives') && typeof this.perspectives === 'string') {
      try {
        this.perspectives = JSON.parse(this.perspectives);
      } catch (e) {
        this.perspectives = [];
      }
    }
  }

  /**
   * Render chart with Chart.js (simulated)
   */
  renderChart() {
    const canvas = this.shadowRoot.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simulate Chart.js rendering with canvas drawing
    this.drawSimpleChart(ctx);
    
    console.log('[ChartMorph] Chart rendered', this.type);
  }

  /**
   * Update chart data
   */
  updateChart() {
    this.renderChart();
  }

  /**
   * Simple chart drawing (placeholder for Chart.js)
   */
  drawSimpleChart(ctx) {
    const { labels, values } = this.data;
    if (!labels || !values) return;
    
    const width = this.width;
    const height = this.height;
    const padding = 40;
    const barWidth = (width - padding * 2) / labels.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get color
    const color = this.amorph?.getPerspectiveColor(this.perspectives[0]) || '#667eea';
    
    // Draw bars
    const maxValue = Math.max(...values);
    
    values.forEach((value, i) => {
      const barHeight = ((height - padding * 2) / maxValue) * value;
      const x = padding + i * barWidth;
      const y = height - padding - barHeight;
      
      // Bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      
      // Label
      ctx.fillStyle = 'white';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth * 0.4, height - padding + 20);
      
      // Value
      ctx.fillText(value, x + barWidth * 0.4, y - 5);
    });
  }

  render() {
    return html`
      ${this.label ? html`<div class="chart-label">${this.label}</div>` : ''}
      <div class="chart-container">
        <canvas width="${this.width}" height="${this.height}"></canvas>
      </div>
    `;
  }
}

customElements.define('chart-morph', ChartMorph);
export default ChartMorph;
