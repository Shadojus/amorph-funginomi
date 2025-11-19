/**
 * ⏱️ TIMELINE MORPH
 * =================
 * 
 * Temporal data visualization morph
 * 
 * Features:
 * - Horizontal timeline
 * - Events with dates
 * - Growth cycles
 * - Seasonal patterns
 * - Interactive scrubbing
 * 
 * Usage:
 * <timeline-morph
 *   events='[{"date":"2024-03","label":"Inoculation"},{"date":"2024-06","label":"Harvest"}]'
 *   perspectives='["cultivation"]'
 * ></timeline-morph>
 */

import { LitElement, html, css } from 'lit';
import { amorph } from '../../../core/AmorphSystem.js';
import { globalStyles } from '../../styles/tokens.js';

export class TimelineMorph extends LitElement {
  static properties = {
    events: { type: Array },
    label: { type: String },
    perspectives: { type: Array },
    startDate: { type: String },
    endDate: { type: String }
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

    .timeline-label {
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-bottom: 12px;
    }

    .timeline-container {
      position: relative;
      padding: 40px 20px;
    }

    .timeline-line {
      position: absolute;
      top: 50%;
      left: 20px;
      right: 20px;
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
    }

    .timeline-event {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }

    .timeline-event-dot {
      width: 16px;
      height: 16px;
      background: currentColor;
      border: 3px solid white;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .timeline-event:hover .timeline-event-dot {
      transform: scale(1.5);
    }

    .timeline-event-label {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: white;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .timeline-event:hover .timeline-event-label {
      opacity: 1;
    }

    .timeline-event-date {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
    }

    .timeline-markers {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    `
  ];

  constructor() {
    super();
    this.events = [];
    this.label = '';
    this.perspectives = [];
    this.startDate = null;
    this.endDate = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Setze data-morph Attribute SOFORT
    this.dataset.morph = 'true';
    this.dataset.morphType = 'timeline';
    this.dataset.morphId = this.id || `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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

  willUpdate(changedProperties) {
    // Parse JSON strings
    if (changedProperties.has('events') && typeof this.events === 'string') {
      try {
        this.events = JSON.parse(this.events);
      } catch (e) {
        console.error('[TimelineMorph] Invalid events JSON', e);
        this.events = [];
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
   * Calculate event position on timeline (0-100%)
   */
  getEventPosition(event) {
    if (!this.events.length) return 0;
    
    // Find date range
    const dates = this.events.map(e => new Date(e.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    
    if (minDate === maxDate) return 50;
    
    const eventDate = new Date(event.date).getTime();
    const position = ((eventDate - minDate) / (maxDate - minDate)) * 100;
    
    return Math.max(5, Math.min(95, position));
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /**
   * Get color from perspectives
   */
  getColor() {
    if (!this.amorph || !this.perspectives.length) return '#667eea';
    return this.amorph.getPerspectiveColor(this.perspectives[0]) || '#667eea';
  }

  render() {
    const color = this.getColor();
    
    return html`
      ${this.label ? html`<div class="timeline-label">${this.label}</div>` : ''}
      
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        ${this.events.map(event => {
          const position = this.getEventPosition(event);
          return html`
            <div 
              class="timeline-event"
              style="left: ${position}%; color: ${color};"
            >
              <div class="timeline-event-dot"></div>
              <div class="timeline-event-label">${event.label}</div>
              <div class="timeline-event-date">${this.formatDate(event.date)}</div>
            </div>
          `;
        })}
      </div>
      
      ${this.events.length > 0 ? html`
        <div class="timeline-markers">
          <span>${this.formatDate(this.events[0].date)}</span>
          <span>${this.formatDate(this.events[this.events.length - 1].date)}</span>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('timeline-morph', TimelineMorph);
export default TimelineMorph;
