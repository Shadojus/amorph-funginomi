/**
 * ⏱️ TIMELINE MORPH (Detail View) v2.0
 * 
 * Premium temporal data visualization for lifecycle/cultivation stages.
 * Shows events along a horizontal timeline with day markers.
 * 
 * Features:
 * - Glassmorphism container with hover effects
 * - Glowing event dots with pulse animation
 * - Alternating above/below labels
 * - Container query responsive sizing
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
        padding: 1rem;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(8px);
        container-type: inline-size;
        container-name: timeline;
        box-sizing: border-box;
        --timeline-color: var(--perspective-color, #f59e0b);
        transition: all 0.25s ease;
      }

      :host(:hover) {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .timeline-label {
        font-size: 0.6875rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 1rem;
        word-break: break-word;
        overflow-wrap: break-word;
        line-height: 1.3;
      }

      .timeline-container {
        position: relative;
        padding: 2.5rem 0.75rem 2rem;
        min-height: 90px;
      }
      
      @container timeline (min-width: 320px) {
        .timeline-container {
          padding: 2.5rem 1.25rem 2rem;
        }
      }

      .timeline-line {
        position: absolute;
        top: 50%;
        left: 0.75rem;
        right: 0.75rem;
        height: 4px;
        background: linear-gradient(90deg, 
          var(--timeline-color) 0%, 
          rgba(255, 255, 255, 0.15) 50%, 
          var(--timeline-color) 100%);
        border-radius: 2px;
        transform: translateY(-50%);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }
      
      @container timeline (min-width: 320px) {
        .timeline-line {
          left: 1.25rem;
          right: 1.25rem;
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
        width: 16px;
        height: 16px;
        background: var(--timeline-color);
        border: 3px solid rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 12px var(--timeline-color);
        animation: dotPulse 2.5s ease-in-out infinite;
      }
      
      @keyframes dotPulse {
        0%, 100% { box-shadow: 0 0 8px var(--timeline-color); }
        50% { box-shadow: 0 0 16px var(--timeline-color); }
      }
      
      @container timeline (min-width: 320px) {
        .timeline-event-dot {
          width: 18px;
          height: 18px;
        }
      }

      .timeline-event:hover .timeline-event-dot {
        transform: scale(1.35);
        box-shadow: 0 0 24px var(--timeline-color);
        animation: none;
      }

      .timeline-event-label {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.6875rem;
        color: rgba(255, 255, 255, 0.95);
        white-space: nowrap;
        font-weight: 600;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      }
      
      @container timeline (min-width: 320px) {
        .timeline-event-label {
          font-size: 0.75rem;
          max-width: 130px;
        }
      }

      .timeline-event-label.above {
        bottom: 1.75rem;
      }

      .timeline-event-label.below {
        top: 1.75rem;
      }

      .timeline-event-day {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.5625rem;
        color: var(--timeline-color);
        white-space: nowrap;
        font-weight: 700;
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.9);
      }

      .timeline-event-day.above {
        bottom: 3rem;
      }

      .timeline-event-day.below {
        top: 3rem;
      }

      .timeline-markers {
        display: flex;
        justify-content: space-between;
        margin-top: 0.75rem;
        font-size: 0.6875rem;
        color: rgba(255, 255, 255, 0.45);
        font-weight: 600;
        padding: 0 0.75rem;
      }

      .empty-state {
        color: rgba(255, 255, 255, 0.35);
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

    // Check if this is lifecycle stages data (has stage + duration)
    const firstItem = this.unwrapCitedValue(source[0]);
    const isLifecycleStages = firstItem && (firstItem.stage || firstItem.phase) && firstItem.duration;
    
    if (isLifecycleStages) {
      // Convert lifecycle stages to timeline events
      let cumulativeDay = 0;
      return source.map((item, index) => {
        const unwrapped = this.unwrapCitedValue(item);
        const label = unwrapped.stage || unwrapped.phase || unwrapped.name || `Stage ${index + 1}`;
        
        // Duration can be an object with min/max/typical or a simple number
        let duration = 0;
        if (unwrapped.duration) {
          if (typeof unwrapped.duration === 'object') {
            duration = unwrapped.duration.typical || unwrapped.duration.average || 
                      ((unwrapped.duration.min || 0) + (unwrapped.duration.max || 0)) / 2 || 0;
          } else {
            duration = Number(unwrapped.duration) || 0;
          }
        }
        
        const event = { 
          day: cumulativeDay, 
          label,
          duration,
          description: unwrapped.morphology?.description || unwrapped.description || '',
          ...unwrapped 
        };
        
        cumulativeDay += duration;
        return event;
      });
    }
    
    // Check if this is historical milestones (has year + event)
    const isHistoricalMilestones = firstItem && firstItem.year && (firstItem.event || firstItem.milestone);
    
    if (isHistoricalMilestones) {
      return source.map(item => {
        const unwrapped = this.unwrapCitedValue(item);
        const label = unwrapped.event || unwrapped.milestone || unwrapped.description || 'Event';
        const year = unwrapped.year || 0;
        return { day: year, label, isYear: true, ...unwrapped };
      }).sort((a, b) => a.day - b.day);
    }

    // Standard timeline format
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
    
    // Determine if we're showing years or days
    const isYearTimeline = events[0]?.isYear;
    const dayLabel = isYearTimeline ? '' : 'Day ';
    
    // For lifecycle stages, calculate percentage positions based on duration
    const totalDuration = events.reduce((sum, e) => sum + (e.duration || 0), 0) || range;

    return html`
      ${this.label ? html`<div class="timeline-label">${this.label}</div>` : ''}
      
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        ${events.map((event, i) => {
          // Use cumulative percentage for lifecycle stages
          let left;
          if (event.duration !== undefined && totalDuration > 0) {
            left = (event.day / totalDuration) * 100;
          } else {
            left = ((event.day - minDay) / range) * 100;
          }
          
          // Alternate labels above/below
          const position = i % 2 === 0 ? 'above' : 'below';
          
          // Format the marker label
          const markerLabel = isYearTimeline ? event.day.toString() : `${dayLabel}${event.day}`;
          
          return html`
            <div 
              class="timeline-event" 
              style="left: ${Math.max(5, Math.min(95, left))}%"
              title="${event.label}${event.description ? `: ${event.description}` : ''}"
            >
              <div class="timeline-event-dot"></div>
              <div class="timeline-event-day ${position}">${markerLabel}</div>
              <div class="timeline-event-label ${position}">${event.label}</div>
            </div>
          `;
        })}
      </div>
      
      <div class="timeline-markers">
        <span>${isYearTimeline ? minDay : `Day ${minDay}`}</span>
        <span>${isYearTimeline ? maxDay : `Day ${maxDay}`}</span>
      </div>
    `;
  }
}

// Register with detail- prefix for detail pages
customElements.define('detail-timeline-morph', TimelineMorph);
