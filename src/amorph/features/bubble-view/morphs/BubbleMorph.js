/**
 * 🫧 BUBBLE MORPH
 * ===============
 * 
 * Atomic morph for a single bubble in BubbleView.
 * Contains DataMorphs that respond to perspective changes.
 * 
 * Usage:
 * <bubble-morph
 *   fungus-data={JSON.stringify(fungus)}
 *   x="100"
 *   y="200"
 *   size="80"
 * ></bubble-morph>
 */

import { LitElement, html, css } from 'lit';

export class BubbleMorph extends LitElement {
  static properties = {
    fungusData: { type: Object },
    x: { type: Number },
    y: { type: Number },
    size: { type: Number },
    color: { type: String },
    isSelected: { type: Boolean },
    isHighlighted: { type: Boolean },
    activePerspectives: { type: Array },
    matchedFields: { type: Array }  // Fields that matched search query
  };

  static styles = css`
    :host {
      display: block;
      position: absolute;
      pointer-events: all;
      /* Fast linear transitions for smooth physics simulation */
      transition: 
        left 0s linear,
        top 0s linear,
        width 0.3s ease,
        height 0.3s ease;
    }

    .bubble-container {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--bubble-color, linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)));
      border: 2px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .bubble-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.4;
      z-index: 0;
      border-radius: 50%;
    }

    .bubble-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
      border-radius: 50%;
    }

    :host([is-selected]) .bubble-container {
      border-width: 3px;
      border-color: rgba(59, 130, 246, 0.8);
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
      transform: scale(1.1);
    }

    :host([is-highlighted]) .bubble-container {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.5));
      border-color: rgba(59, 130, 246, 0.6);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
      animation: bubble-pulse 1.5s ease-in-out infinite;
    }

    @keyframes bubble-pulse {
      0%, 100% {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        border-color: rgba(59, 130, 246, 0.5);
      }
      50% {
        box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
        border-color: rgba(59, 130, 246, 0.8);
      }
    }

    .bubble-container:hover {
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .bubble-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      text-align: center;
      margin-bottom: 0.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100%;
    }
    
    .matched-fields {
      margin-top: 0.5rem;
      padding: 0.4rem;
      background: rgba(255, 193, 7, 0.2);
      border-radius: 4px;
      font-size: 0.65rem;
      line-height: 1.3;
      width: 100%;
    }
    
    .matched-field {
      color: #FFC107;
      padding: 0.1rem 0;
      font-weight: 500;
    }
    
    .more-fields {
      color: rgba(255, 193, 7, 0.7);
      font-style: italic;
      margin-top: 0.2rem;
    }

    .bubble-data {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
      max-height: 60%;
      overflow: hidden;
    }

    .data-item {
      font-size: 0.625rem;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    /* Perspective color accents */
    :host([data-perspective="medicinalAndHealth"]) .bubble-container {
      border-color: rgba(239, 68, 68, 0.3);
    }
    :host([data-perspective="cultivationAndProcessing"]) .bubble-container {
      border-color: rgba(34, 197, 94, 0.3);
    }
    :host([data-perspective="chemicalAndProperties"]) .bubble-container {
      border-color: rgba(168, 85, 247, 0.3);
    }
  `;

  constructor() {
    super();
    this.fungusData = null;
    this.x = 0;
    this.y = 0;
    this.size = 80;
    this.color = '#90CAF9';
    this.isSelected = false;
    this.isHighlighted = false;
    this.activePerspectives = [];
    this.matchedFields = []; // Fields that matched search query
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register with AMORPH system
    if (typeof window !== 'undefined' && window.amorph) {
      window.amorph.registerMorph(this);
      console.log('[BubbleMorph] Registered:', this.fungusData?.slug);
    }

    // Listen for perspective changes
    this._boundPerspectiveHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundPerspectiveHandler);

    // Listen for clicks
    this.addEventListener('click', this.handleClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._boundPerspectiveHandler) {
      window.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
    }
  }

  handlePerspectiveChange(event) {
    const newPerspectives = event.detail.perspectives || [];
    // Log only once per perspective change, not per bubble
    this.activePerspectives = newPerspectives;
    
    // Force re-render to show new data
    this.requestUpdate();
    
    // Update border color based on first active perspective
    if (newPerspectives.length > 0) {
      this.setAttribute('data-perspective', newPerspectives[0]);
    } else {
      this.removeAttribute('data-perspective');
    }
  }

  handleClick() {
    // Emit bubble clicked event
    const event = new CustomEvent('bubble:clicked', {
      detail: {
        fungusData: this.fungusData,
        morph: this
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);

    // Also emit via AMORPH system
    if (window.amorph) {
      window.amorph.emit('bubble:clicked', {
        fungusData: this.fungusData,
        morph: this
      });
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Update position and size when x/y/size changes
    // CSS transitions handle smooth animation automatically
    if (changedProperties.has('x') || changedProperties.has('y') || changedProperties.has('size')) {
      // Use requestAnimationFrame for smoother updates synchronized with browser rendering
      requestAnimationFrame(() => {
        this.style.left = `${this.x - this.size / 2}px`;
        this.style.top = `${this.y - this.size / 2}px`;
        this.style.width = `${this.size}px`;
        this.style.height = `${this.size}px`;
      });
      
      // Log significant size changes only
      if (changedProperties.has('size')) {
        const oldSize = changedProperties.get('size');
        const sizeDiff = Math.abs((oldSize || 0) - this.size);
        if (sizeDiff > 5 || oldSize === undefined) {
          console.log(`[BubbleMorph] 📊 ${this.fungusData?.slug}: ${oldSize || 'initial'} → ${this.size}px`);
        }
      }
    }
  }

  /**
   * Format field name for display (e.g., "medicinalAndHealth.activeCompounds" -> "Active Compounds")
   */
  formatFieldName(fieldPath) {
    const parts = fieldPath.split('.');
    const fieldName = parts[parts.length - 1];
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
  
  /**
   * Get visible data fields based on active perspectives
   */
  getVisibleFields() {
    if (!this.fungusData) return [];
    
    // Mapping of perspectives to fields (matches Grid View)
    const perspectiveFieldMap = {
      'medicinalAndHealth': ['medicinalAndHealth.medicinalProperties', 'medicinalAndHealth.activeCompounds'],
      'cultivationAndProcessing': ['cultivationAndProcessing.cultivationDifficulty', 'cultivationAndProcessing.cultivationMethods'],
      'chemicalAndProperties': ['primaryCompounds', 'secondaryMetabolites'],
      'culinaryAndNutritional': ['culinaryAndNutritional.flavorProfile', 'culinaryAndNutritional.preparationMethods'],
      'ecologyAndHabitat': ['ecologyAndHabitat.substrate', 'ecologyAndHabitat.seasonality.primarySeason'],
      'safetyAndIdentification': ['edibility', 'toxicityLevel'],
      'taxonomy': ['taxonomy.family', 'taxonomy.genus'],
      'physicalCharacteristics': ['physicalCharacteristics.capColor', 'physicalCharacteristics.sporePrintColor']
    };

    let fields = [];
    
    // If no perspectives active, show first 2-3 basic fields
    if (this.activePerspectives.length === 0) {
      if (this.fungusData.edibility) fields.push({ label: 'Edibility', value: this.fungusData.edibility });
      if (this.fungusData.ecologyAndHabitat?.substrate) {
        fields.push({ label: 'Substrate', value: this.fungusData.ecologyAndHabitat.substrate });
      }
      return fields.slice(0, 2);
    }

    // Get fields for active perspectives
    for (const perspective of this.activePerspectives) {
      const fieldNames = perspectiveFieldMap[perspective] || [];
      for (const fieldName of fieldNames) {
        const value = this.getNestedValue(this.fungusData, fieldName);
        if (value) {
          fields.push({
            label: this.formatFieldName(fieldName),
            value: this.formatValue(value)
          });
        }
      }
    }

    return fields.slice(0, 3); // Max 3 fields to fit in bubble
  }

  getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
  }

  formatFieldName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  formatValue(value) {
    if (Array.isArray(value)) {
      return value.slice(0, 2).join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).slice(0, 30);
    }
    return String(value).slice(0, 30);
  }

  render() {
    if (!this.fungusData) {
      return html`<div class="bubble-container">No Data</div>`;
    }

    const visibleFields = this.getVisibleFields();
    
    // Get name - try common name first, then scientific name, then slug
    let name = 'Unknown';
    if (this.fungusData.commonName) {
      name = this.fungusData.commonName;
    } else if (this.fungusData.scientificName) {
      name = this.fungusData.scientificName;
    } else if (this.fungusData.slug) {
      // Format slug as fallback
      name = this.fungusData.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Render log removed - use browser DevTools for render tracking

    // Image path (same as Grid View)
    const imagePath = `/images/fungi/${this.fungusData.slug}.jpg`;
    
    return html`
      <div 
        class="bubble-container"
        data-morph
        data-morph-type="bubble"
        data-slug="${this.fungusData.slug}"
        data-fungus-data="${JSON.stringify(this.fungusData)}"
      >
        <img 
          class="bubble-image" 
          src="${imagePath}" 
          alt="${name}"
          loading="lazy"
          @error="${(e) => e.target.style.display = 'none'}"
        />
        <div class="bubble-content">
          <div class="bubble-name">${name}</div>
          ${this.matchedFields && this.matchedFields.length > 0 ? html`
            <div class="matched-fields">
              <strong>✨ Matched:</strong>
              ${this.matchedFields.slice(0, 3).map(field => html`
                <div class="matched-field">${this.formatFieldName(field)}</div>
              `)}
              ${this.matchedFields.length > 3 ? html`
                <div class="more-fields">+${this.matchedFields.length - 3} more</div>
              ` : ''}
            </div>
          ` : ''}
          <div class="bubble-data">
            ${visibleFields.map(field => html`
              <div class="data-item">${field.label}: ${field.value}</div>
            `)}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('bubble-morph', BubbleMorph);
