/**
 * 📊 QUICK FACTS MORPH
 * 
 * Displays the most important entity facts in a horizontal bar
 * Automatically extracts key properties from entity data
 * 
 * Usage:
 * <quick-facts-morph
 *   facts='[{"icon": "🍂", "label": "Season", "value": "Aug-Nov"}, ...]'
 * ></quick-facts-morph>
 * 
 * Or with automatic extraction:
 * <quick-facts-morph
 *   entity='{"taxonomy": {...}, "habitat": {...}, ...}'
 * ></quick-facts-morph>
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';

export class QuickFactsMorph extends LitElement {
  static properties = {
    facts: { type: Array },
    entity: { type: Object },
    maxFacts: { type: Number, attribute: 'max-facts' }
  };
  
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      
      .quick-facts-bar {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        overflow-x: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
      }
      
      .quick-facts-bar::-webkit-scrollbar {
        height: 4px;
      }
      
      .quick-facts-bar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
      }
      
      .fact-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-md);
        min-width: 100px;
        flex-shrink: 0;
        transition: all 0.2s ease;
        cursor: default;
      }
      
      .fact-card:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .fact-icon {
        font-size: 24px;
        line-height: 1;
      }
      
      .fact-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        text-align: center;
      }
      
      .fact-label {
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: var(--font-weight-medium);
      }
      
      .fact-value {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: rgba(255, 255, 255, 0.95);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      /* Color coding for specific fact types */
      .fact-card[data-type="edibility"] .fact-value {
        color: #22c55e;
      }
      
      .fact-card[data-type="edibility"].toxic .fact-value {
        color: #ef4444;
      }
      
      .fact-card[data-type="season"] .fact-value {
        color: #f59e0b;
      }
      
      .fact-card[data-type="habitat"] .fact-value {
        color: #10b981;
      }
      
      .fact-card[data-type="family"] .fact-value {
        color: #8b5cf6;
      }
      
      .fact-card[data-type="difficulty"] .fact-value {
        color: #06b6d4;
      }
      
      /* Empty state */
      .empty-state {
        padding: 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: var(--font-size-sm);
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .quick-facts-bar {
          padding: 12px;
          gap: 8px;
        }
        
        .fact-card {
          padding: 10px 12px;
          min-width: 85px;
        }
        
        .fact-icon {
          font-size: 20px;
        }
        
        .fact-value {
          font-size: var(--font-size-xs);
          max-width: 80px;
        }
      }
    `
  ];
  
  constructor() {
    super();
    this.facts = [];
    this.entity = null;
    this.maxFacts = 6;
  }
  
  // Extract value from citedValue format
  _extractValue(data) {
    if (!data) return null;
    if (typeof data === 'object' && 'value' in data && 
        ('confidence' in data || 'sources' in data)) {
      return data.value;
    }
    return data;
  }
  
  // Auto-extract facts from entity if not provided explicitly
  _getFactsToDisplay() {
    if (this.facts && this.facts.length > 0) {
      return this.facts.slice(0, this.maxFacts);
    }
    
    if (!this.entity) return [];
    
    const extractedFacts = [];
    const entity = this.entity;
    
    // Priority extraction order
    const extractors = [
      // 1. Family/Genus
      () => {
        const taxonomy = this._extractValue(entity.taxonomy);
        if (taxonomy?.family || taxonomy?.genus) {
          return {
            icon: '🧬',
            label: 'Family',
            value: taxonomy.family || taxonomy.genus,
            type: 'family'
          };
        }
        return null;
      },
      
      // 2. Edibility
      () => {
        const culinary = this._extractValue(entity.culinaryDimensions) || 
                         this._extractValue(entity.culinary) ||
                         entity;
        const edibility = culinary?.edibility || 
                         culinary?.edibilityRating || 
                         this._extractValue(entity.edibility);
        if (edibility) {
          const isToxic = /toxic|poison|deadly/i.test(String(edibility));
          return {
            icon: isToxic ? '☠️' : '🍽️',
            label: 'Edibility',
            value: this._formatValue(edibility),
            type: 'edibility',
            toxic: isToxic
          };
        }
        return null;
      },
      
      // 3. Habitat
      () => {
        const ecology = this._extractValue(entity.ecologicalNetwork) || 
                       this._extractValue(entity.ecology);
        const habitat = ecology?.habitat || ecology?.primaryHabitat || 
                       this._extractValue(entity.habitat);
        if (habitat) {
          const habitatStr = Array.isArray(habitat) ? habitat[0] : habitat;
          return {
            icon: '🌲',
            label: 'Habitat',
            value: this._formatValue(habitatStr),
            type: 'habitat'
          };
        }
        return null;
      },
      
      // 4. Season
      () => {
        const temporal = this._extractValue(entity.temporalPatterns);
        const season = temporal?.fruiting_season || 
                      temporal?.seasonality || 
                      this._extractValue(entity.season);
        if (season) {
          const seasonStr = Array.isArray(season) ? season.join(', ') : season;
          return {
            icon: '🍂',
            label: 'Season',
            value: this._formatValue(seasonStr),
            type: 'season'
          };
        }
        return null;
      },
      
      // 5. Size (cap diameter)
      () => {
        const morphology = this._extractValue(entity.morphology);
        const cap = morphology?.cap || morphology?.fruiting_body;
        if (cap?.diameter_mm || cap?.dimensions?.width) {
          const size = cap.diameter_mm || cap.dimensions?.width;
          const min = size?.min || size?.typical || 0;
          const max = size?.max || size?.typical || min;
          return {
            icon: '📏',
            label: 'Cap Size',
            value: `${min}-${max}mm`,
            type: 'size'
          };
        }
        return null;
      },
      
      // 6. Cultivation Difficulty
      () => {
        const cultivation = this._extractValue(entity.cultivationIntelligence) || 
                           this._extractValue(entity.cultivation);
        const difficulty = cultivation?.difficulty || 
                          cultivation?.cultivation_status;
        if (difficulty) {
          const icons = { 'easy': '🟢', 'moderate': '🟡', 'difficult': '🔴', 'expert': '⚫' };
          const icon = icons[String(difficulty).toLowerCase()] || '🌱';
          return {
            icon: icon,
            label: 'Difficulty',
            value: this._formatValue(difficulty),
            type: 'difficulty'
          };
        }
        return null;
      },
      
      // 7. Distribution/Region
      () => {
        const geo = this._extractValue(entity.geography) || 
                   this._extractValue(entity.geographicDistribution);
        const native = geo?.native_range || geo?.regions;
        if (native) {
          const region = Array.isArray(native) ? native[0] : native;
          return {
            icon: '🌍',
            label: 'Region',
            value: this._formatValue(region),
            type: 'region'
          };
        }
        return null;
      },
      
      // 8. Conservation Status
      () => {
        const conservation = this._extractValue(entity.conservation) || 
                            this._extractValue(entity.environmentalIntelligence);
        const status = conservation?.conservation_status || 
                      conservation?.iucn_category;
        if (status) {
          return {
            icon: '🛡️',
            label: 'Status',
            value: this._formatValue(status),
            type: 'conservation'
          };
        }
        return null;
      }
    ];
    
    // Run extractors until we have enough facts
    for (const extractor of extractors) {
      if (extractedFacts.length >= this.maxFacts) break;
      
      try {
        const fact = extractor();
        if (fact) {
          extractedFacts.push(fact);
        }
      } catch (e) {
        console.warn('[QuickFactsMorph] Extractor error:', e);
      }
    }
    
    return extractedFacts;
  }
  
  _formatValue(value) {
    if (!value) return '';
    
    // Handle objects
    if (typeof value === 'object') {
      if (value.value) return this._formatValue(value.value);
      if (value.name) return value.name;
      return JSON.stringify(value);
    }
    
    // Capitalize first letter
    const str = String(value);
    if (str.length > 25) {
      return str.slice(0, 22) + '...';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  render() {
    const facts = this._getFactsToDisplay();
    
    if (facts.length === 0) {
      return html`
        <div class="quick-facts-bar">
          <div class="empty-state">No quick facts available</div>
        </div>
      `;
    }
    
    return html`
      <div class="quick-facts-bar">
        ${facts.map(fact => html`
          <div 
            class="fact-card ${fact.toxic ? 'toxic' : ''}" 
            data-type="${fact.type || ''}"
          >
            <span class="fact-icon">${fact.icon}</span>
            <div class="fact-content">
              <span class="fact-label">${fact.label}</span>
              <span class="fact-value" title="${fact.value}">${fact.value}</span>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('quick-facts-morph', QuickFactsMorph);
