/**
 * QuickFactsMorph - Key Facts Horizontal Bar
 * 
 * Displays 5-6 key facts about an entity in a horizontal,
 * icon-based layout. Auto-extracts facts from entity data.
 * 
 * @version 1.0.0
 * @since 2025-11-27
 * @feature detail-view
 */

import { LitElement, html, css } from 'lit';

export class QuickFactsMorph extends LitElement {
  static properties = {
    entity: { type: String },          // JSON string of entity data
    maxFacts: { type: Number, attribute: 'max-facts' },
    // Internal state
    _entity: { type: Object, state: true },
    _facts: { type: Array, state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .facts-container {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .fact-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      min-width: 100px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .fact-card:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }

    .fact-icon {
      font-size: 24px;
      line-height: 1;
    }

    .fact-value {
      font-size: 14px;
      font-weight: 600;
      color: white;
      text-align: center;
      line-height: 1.2;
    }

    .fact-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .no-facts {
      padding: 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .facts-container {
        padding: 12px;
        gap: 8px;
      }

      .fact-card {
        padding: 10px 12px;
        min-width: 80px;
      }

      .fact-icon {
        font-size: 20px;
      }

      .fact-value {
        font-size: 12px;
      }
    }
  `;

  constructor() {
    super();
    this.entity = '';
    this.maxFacts = 6;
    this._entity = null;
    this._facts = [];
    this._initialized = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Don't parse in connectedCallback - wait for firstUpdated
  }

  firstUpdated() {
    // Parse entity only once after first render
    if (!this._initialized && this.entity) {
      this._initialized = true;
      this._parseEntity();
    }
  }

  updated(changedProperties) {
    // Only re-parse if entity actually changed after initialization
    if (changedProperties.has('entity') && this._initialized) {
      this._parseEntity();
    }
  }

  _parseEntity() {
    if (!this.entity) {
      this._facts = [];
      return;
    }
    
    try {
      this._entity = JSON.parse(this.entity);
      this._extractFacts();
    } catch (e) {
      console.warn('[QuickFactsMorph] Failed to parse entity:', e);
      this._facts = [];
    }
  }

  _extractValue(data) {
    if (!data) return null;
    if (typeof data === 'object' && 'value' in data && 
        ('confidence' in data || 'sources' in data)) {
      return data.value;
    }
    return data;
  }

  _extractFacts() {
    if (!this._entity) {
      this._facts = [];
      return;
    }

    const facts = [];
    const e = this._entity;

    // 1. Taxonomy - Family or Genus
    const taxonomy = this._extractValue(e.taxonomy) || {};
    if (taxonomy.family) {
      facts.push({
        icon: '🧬',
        label: 'Family',
        value: taxonomy.family
      });
    } else if (taxonomy.genus) {
      facts.push({
        icon: '🧬',
        label: 'Genus',
        value: taxonomy.genus
      });
    }

    // 2. Habitat
    const ecology = this._extractValue(e.ecologicalNetwork) || this._extractValue(e.ecology) || {};
    const habitat = this._extractValue(ecology.primaryHabitat) || this._extractValue(ecology.habitat);
    if (habitat) {
      // Handle array, object, or string
      let habitatValue = habitat;
      if (Array.isArray(habitat)) {
        habitatValue = this._extractValue(habitat[0]) || habitat[0];
      }
      if (typeof habitatValue === 'object') {
        habitatValue = habitatValue.name || habitatValue.value || habitatValue.type || '';
      }
      if (habitatValue && typeof habitatValue === 'string') {
        facts.push({
          icon: '🌲',
          label: 'Habitat',
          value: this._capitalize(habitatValue)
        });
      }
    }

    // 3. Seasonality
    const temporal = this._extractValue(e.temporalPatterns) || {};
    const seasons = temporal.seasonality?.peak_seasons || temporal.peakSeasons;
    if (seasons && seasons.length > 0) {
      facts.push({
        icon: '📅',
        label: 'Season',
        value: seasons.slice(0, 2).map(this._capitalize).join(', ')
      });
    }

    // 4. Edibility / Safety
    const culinary = this._extractValue(e.culinaryDimensions) || this._extractValue(e.culinary) || {};
    const safety = this._extractValue(e.safetyAndIdentification) || {};
    const edibility = culinary.edibility || culinary.edibilityRating || safety.edibility;
    if (edibility) {
      const icon = edibility.toLowerCase().includes('edible') ? '✅' : 
                   edibility.toLowerCase().includes('toxic') ? '☠️' : '⚠️';
      facts.push({
        icon,
        label: 'Edibility',
        value: this._capitalize(edibility.replace(/-/g, ' '))
      });
    }

    // 5. Cap Size
    const morphology = this._extractValue(e.morphology) || this._extractValue(e.physicalCharacteristics) || {};
    const cap = morphology.cap || morphology.pileus || {};
    const capSize = cap.diameter || cap.size;
    if (capSize) {
      let sizeStr = '';
      if (typeof capSize === 'object' && capSize.min !== undefined) {
        sizeStr = `${capSize.min}-${capSize.max}${capSize.unit || 'cm'}`;
      } else {
        sizeStr = String(capSize);
      }
      facts.push({
        icon: '📏',
        label: 'Cap Size',
        value: sizeStr
      });
    }

    // 6. Spore Color
    const spores = morphology.spores || morphology.sporePrint || {};
    const sporeColor = spores.printColor || spores.color;
    if (sporeColor) {
      facts.push({
        icon: '🔬',
        label: 'Spore Print',
        value: this._capitalize(sporeColor)
      });
    }

    // 7. Medicinal Use (if applicable)
    const medicinal = this._extractValue(e.medicinalIntelligence) || this._extractValue(e.medicinal) || {};
    if (medicinal.primaryUses && medicinal.primaryUses.length > 0) {
      facts.push({
        icon: '💊',
        label: 'Medicinal',
        value: medicinal.primaryUses[0]
      });
    }

    // 8. Cultivation
    const cultivation = this._extractValue(e.cultivationIntelligence) || this._extractValue(e.cultivation) || {};
    if (cultivation.difficulty) {
      facts.push({
        icon: '🌱',
        label: 'Cultivation',
        value: this._capitalize(cultivation.difficulty)
      });
    }

    // 9. Distribution
    const distribution = ecology.distribution || ecology.geographicRange;
    if (distribution) {
      const distValue = Array.isArray(distribution) ? distribution[0] : distribution;
      facts.push({
        icon: '🌍',
        label: 'Distribution',
        value: this._capitalize(distValue)
      });
    }

    // 10. Trophic Level / Nutrition Mode
    const trophic = ecology.trophicLevel || ecology.nutritionMode;
    if (trophic) {
      facts.push({
        icon: '🔄',
        label: 'Type',
        value: this._capitalize(trophic)
      });
    }

    // Limit to maxFacts
    this._facts = facts.slice(0, this.maxFacts);
  }

  _capitalize(str) {
    if (!str) return '';
    // Handle objects - extract value property or convert to readable string
    if (typeof str === 'object') {
      if (str.value) return this._capitalize(str.value);
      if (str.name) return this._capitalize(str.name);
      if (Array.isArray(str)) return str.map(s => this._capitalize(s)).join(', ');
      return ''; // Skip objects we can't handle
    }
    return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
  }

  render() {
    if (this._facts.length === 0) {
      return html`
        <div class="facts-container">
          <div class="no-facts">No quick facts available</div>
        </div>
      `;
    }

    return html`
      <div class="facts-container">
        ${this._facts.map(fact => html`
          <div class="fact-card">
            <span class="fact-icon">${fact.icon}</span>
            <span class="fact-value">${fact.value}</span>
            <span class="fact-label">${fact.label}</span>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('quick-facts-morph', QuickFactsMorph);
