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
import { globalStyles } from './tokens.js';

export class TimelineMorph extends LitElement {
  static properties = {
    data: { type: Array },
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
        width: 100%;
        max-width: 100%;
        padding: 0.625rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        container-type: inline-size;
        container-name: timeline;
        box-sizing: border-box;
    }

    .timeline-label {
      font-size: 0.6875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
      word-break: break-word;
      overflow-wrap: break-word;
      line-height: 1.3;
    }

    .timeline-container {
      position: relative;
      padding: 1.25rem 0.5rem;
      min-height: 60px;
    }
    
    @container timeline (min-width: 300px) {
      .timeline-container {
        padding: 1.5rem 1rem;
      }
    }

    .timeline-line {
      position: absolute;
      top: 50%;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: rgba(255, 255, 255, 0.15);
    }
    
    @container timeline (min-width: 300px) {
      .timeline-line {
        left: 1rem;
        right: 1rem;
      }
    }

    .timeline-event {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }

    .timeline-event-dot {
      width: 10px;
      height: 10px;
      background: currentColor;
      border: 2px solid white;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    
    @container timeline (min-width: 300px) {
      .timeline-event-dot {
        width: 14px;
        height: 14px;
      }
    }

    .timeline-event:hover .timeline-event-dot {
      transform: scale(1.2);
    }

    .timeline-event-label {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.5625rem;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
      font-weight: 500;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    @container timeline (min-width: 300px) {
      .timeline-event-label {
        font-size: 0.6875rem;
        max-width: 120px;
      }
    }

    .timeline-event-label.above {
      bottom: 1.25rem;
    }

    .timeline-event-label.below {
      top: 30px;
    }

    .timeline-event-date {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
    }

    .timeline-event-date.above {
      bottom: 50px;
    }

    .timeline-event-date.below {
      top: 50px;
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
    this.data = [];
    this.events = [];
    this.label = '';
    this.perspectives = [];
    this.startDate = null;
    this.endDate = null;
  }

  normalizeData() {
    const source = this.data || this.events;
    if (!Array.isArray(source) || source.length === 0) return [];

    return source.map(item => {
      // Support both date and dayOffset formats
      const day = item.dayOffset !== undefined ? item.dayOffset : 0;
      const label = item.label || item.stage || item.event || 'Event';
      const stage = item.stage || '';
      return { day, label, stage, ...item };
    }).sort((a, b) => a.day - b.day);
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
  getEventPosition(event, minDay, maxDay) {
    if (minDay === maxDay) return 50;
    const position = ((event.day - minDay) / (maxDay - minDay)) * 100;
    return Math.max(5, Math.min(95, position));
  }

  /**
   * Format day offset
   */
  formatDay(day) {
    return `Day ${day}`;
  }

  /**
   * Get color from perspectives
   */
  getColor() {
    return 'var(--color-cultivation, #f59e0b)';
  }

  render() {
    const items = this.normalizeData();
    
    if (items.length === 0) {
      return html`<div style="font-size: 12px; color: rgba(255,255,255,0.5); padding: 20px; text-align: center;">No timeline data</div>`;
    }

    const minDay = items[0].day;
    const maxDay = items[items.length - 1].day;
    const color = this.getColor();
    
    return html`
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        ${items.map((event, index) => {
          const position = this.getEventPosition(event, minDay, maxDay);
          const isEven = index % 2 === 0;
          const positionClass = isEven ? 'above' : 'below';
          return html`
            <div 
              class="timeline-event"
              style="left: ${position}%; color: ${color};"
              title="${event.label} (${this.formatDay(event.day)})"
            >
              <div class="timeline-event-dot"></div>
              <div class="timeline-event-label ${positionClass}">${event.stage || event.label}</div>
              <div class="timeline-event-date ${positionClass}">${this.formatDay(event.day)}</div>
            </div>
          `;
        })}
      </div>
      
      <div class="timeline-markers">
        <span>${this.formatDay(minDay)}</span>
        <span>${this.formatDay(maxDay)} (${Math.round((maxDay - minDay) / 7)} weeks)</span>
      </div>
    `;
  }
}

// Safe registration - skip if already defined by detail-view
if (!customElements.get('timeline-morph')) {
  customElements.define('timeline-morph', TimelineMorph);
}
export default TimelineMorph;
