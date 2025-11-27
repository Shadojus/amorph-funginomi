/**
 * ⏱️ TIMELINE MORPH (Detail View)
 * 
 * Temporal data visualization for lifecycle/cultivation stages
 * 
 * Features:
 * - Horizontal timeline
 * - Events with days/dates
 * - Growth cycles
 * - Interactive hover
 * 
 * Input: [{ dayOffset: 0, stage: "Inoculation" }, { dayOffset: 30, stage: "Fruiting" }, ...]
 * Output: Visual timeline with events
 */

import { LitElement, html, css } from 'lit';
import { globalStyles, getPerspectiveColor } from './tokens.js';

export class TimelineMorph extends LitElement {
  static properties = {
    data: { type: Array },
    label: { type: String },
    perspective: { type: String },
    color: { type: String }
  };

  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.08);
        container-type: inline-size;
        container-name: timeline;
        box-sizing: border-box;
        --timeline-color: var(--perspective-color, #f59e0b);
      }

      .timeline-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.75rem;
        word-break: break-word;
        overflow-wrap: break-word;
        line-height: 1.3;
      }

      .timeline-container {
        position: relative;
        padding: 2rem 0.5rem 1.5rem;
        min-height: 80px;
      }
      
      @container timeline (min-width: 300px) {
        .timeline-container {
          padding: 2rem 1rem 1.5rem;
        }
      }

      .timeline-line {
        position: absolute;
        top: 50%;
        left: 0.5rem;
        right: 0.5rem;
        height: 3px;
        background: linear-gradient(90deg, 
          var(--timeline-color) 0%, 
          rgba(255, 255, 255, 0.2) 50%, 
          var(--timeline-color) 100%);
        border-radius: 2px;
        transform: translateY(-50%);
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
        z-index: 2;
      }

      .timeline-event-dot {
        width: 14px;
        height: 14px;
        background: var(--timeline-color);
        border: 3px solid rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: 0 0 8px var(--timeline-color);
      }
      
      @container timeline (min-width: 300px) {
        .timeline-event-dot {
          width: 16px;
          height: 16px;
        }
      }

      .timeline-event:hover .timeline-event-dot {
        transform: scale(1.3);
        box-shadow: 0 0 16px var(--timeline-color);
      }

      .timeline-event-label {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.625rem;
        color: rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        font-weight: 600;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
      
      @container timeline (min-width: 300px) {
        .timeline-event-label {
          font-size: 0.6875rem;
          max-width: 120px;
        }
      }

      .timeline-event-label.above {
        bottom: 1.5rem;
      }

      .timeline-event-label.below {
        top: 1.5rem;
      }

      .timeline-event-day {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.5625rem;
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
        font-weight: 500;
      }

      .timeline-event-day.above {
        bottom: 2.5rem;
      }

      .timeline-event-day.below {
        top: 2.5rem;
      }

      .timeline-markers {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: 0.625rem;
        color: rgba(255, 255, 255, 0.4);
        padding: 0 0.5rem;
      }

      .empty-state {
        color: rgba(255, 255, 255, 0.3);
        font-style: italic;
        font-size: 0.8125rem;
        text-align: center;
        padding: 1rem;
      }
    `
  ];

  constructor() {
    super();
    this.data = [];
    this.label = '';
    this.perspective = '';
    this.color = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.perspective) {
      const color = getPerspectiveColor(this.perspective);
      this.style.setProperty('--timeline-color', color);
    }
    if (this.color) {
      this.style.setProperty('--timeline-color', this.color);
    }
  }

  /**
   * Unwrap citedValue wrapper if present
   */
  unwrapCitedValue(value) {
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  }

  normalizeData() {
    const source = this.unwrapCitedValue(this.data);
    if (!Array.isArray(source) || source.length === 0) return [];

    return source.map(item => {
      const unwrapped = this.unwrapCitedValue(item);
      // Support both dayOffset and day formats
      const day = unwrapped.dayOffset !== undefined ? unwrapped.dayOffset : 
                  unwrapped.day !== undefined ? unwrapped.day : 0;
      const label = unwrapped.label || unwrapped.stage || unwrapped.event || unwrapped.name || 'Event';
      return { day, label, ...unwrapped };
    }).sort((a, b) => a.day - b.day);
  }

  render() {
    const events = this.normalizeData();
    
    if (events.length === 0) {
      return html`
        ${this.label ? html`<div class="timeline-label">${this.label}</div>` : ''}
        <div class="empty-state">No timeline data available</div>
      `;
    }

    const minDay = Math.min(...events.map(e => e.day));
    const maxDay = Math.max(...events.map(e => e.day));
    const range = maxDay - minDay || 1;

    return html`
      ${this.label ? html`<div class="timeline-label">${this.label}</div>` : ''}
      
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        ${events.map((event, i) => {
          const left = ((event.day - minDay) / range) * 100;
          // Alternate labels above/below
          const position = i % 2 === 0 ? 'above' : 'below';
          
          return html`
            <div 
              class="timeline-event" 
              style="left: ${Math.max(5, Math.min(95, left))}%"
              title="${event.label} (Day ${event.day})"
            >
              <div class="timeline-event-dot"></div>
              <div class="timeline-event-day ${position}">Day ${event.day}</div>
              <div class="timeline-event-label ${position}">${event.label}</div>
            </div>
          `;
        })}
      </div>
      
      <div class="timeline-markers">
        <span>Day ${minDay}</span>
        <span>Day ${maxDay}</span>
      </div>
    `;
  }
}

// Register with standard name - detail-view owns these morphs
if (!customElements.get('timeline-morph')) {
  customElements.define('timeline-morph', TimelineMorph);
}
