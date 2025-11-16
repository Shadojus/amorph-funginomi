/**
 * 🔮 AMORPH SYSTEM - MORPHHEADER GLOBAL
 * =====================================
 * 
 * Globale Header-Komponente für das AMORPH System
 * 
 * Features:
 * - Perspective Selector (max 4 gleichzeitig, FIFO)
 * - Tag-to-Perspective Auto-Activation
 * - Global Search Bar
 * - Glassmorphism Design
 * 
 * @author AMORPH System
 * @version 2.0.0
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from '../../arch/styles/tokens.js';

/**
 * Tag to Perspective Mapping
 * Lightweight - tags trigger relevant perspectives
 */
const TAG_TO_PERSPECTIVE = {
  // Culinary & Nutritional
  'edible': 'culinaryAndNutritional',
  'delicious': 'culinaryAndNutritional',
  'gourmet': 'culinaryAndNutritional',
  'cooking': 'culinaryAndNutritional',
  'culinary': 'culinaryAndNutritional',
  'taste': 'culinaryAndNutritional',
  'nutrition': 'culinaryAndNutritional',
  
  // Safety & Identification
  'toxic': 'safetyAndIdentification',
  'poisonous': 'safetyAndIdentification',
  'deadly': 'safetyAndIdentification',
  'warning': 'safetyAndIdentification',
  'lookalike': 'safetyAndIdentification',
  'caution': 'safetyAndIdentification',
  
  // Medicinal & Health
  'medicinal': 'medicinalAndHealth',
  'therapeutic': 'medicinalAndHealth',
  'antioxidant': 'medicinalAndHealth',
  'health': 'medicinalAndHealth',
  'healing': 'medicinalAndHealth',
  'immune-boost': 'medicinalAndHealth',
  
  // Ecology & Habitat
  'forest': 'ecologyAndHabitat',
  'grassland': 'ecologyAndHabitat',
  'spring': 'ecologyAndHabitat',
  'summer': 'ecologyAndHabitat',
  'fall': 'ecologyAndHabitat',
  'winter': 'ecologyAndHabitat',
  'parasitic': 'ecologyAndHabitat',
  'decomposer': 'ecologyAndHabitat',
  'mycorrhizal': 'ecologyAndHabitat',
  'habitat': 'ecologyAndHabitat',
  
  // Cultivation & Processing
  'cultivation': 'cultivationAndProcessing',
  'farming': 'cultivationAndProcessing',
  'substrate': 'cultivationAndProcessing',
  'harvest': 'cultivationAndProcessing',
  'growing': 'cultivationAndProcessing',
  
  // Research & Innovation
  'research': 'researchAndInnovation',
  'study': 'researchAndInnovation',
  'innovation': 'researchAndInnovation',
  'biotechnology': 'researchAndInnovation',
  'scientific': 'researchAndInnovation',
  
  // Chemical & Properties
  'compound': 'chemicalAndProperties',
  'molecule': 'chemicalAndProperties',
  'enzyme': 'chemicalAndProperties',
  'chemical': 'chemicalAndProperties',
  'bioactive': 'chemicalAndProperties',
  
  // Cultural & Historical
  'traditional': 'culturalAndHistorical',
  'folklore': 'culturalAndHistorical',
  'cultural': 'culturalAndHistorical',
  'history': 'culturalAndHistorical',
  'mythology': 'culturalAndHistorical',
  
  // Commercial & Market
  'commercial': 'commercialAndMarket',
  'market': 'commercialAndMarket',
  'price': 'commercialAndMarket',
  'trade': 'commercialAndMarket',
  'business': 'commercialAndMarket',
  
  // Environmental & Conservation
  'endangered': 'environmentalAndConservation',
  'protected': 'environmentalAndConservation',
  'conservation': 'environmentalAndConservation',
  'sustainable': 'environmentalAndConservation',
  'biodiversity': 'environmentalAndConservation',
  
  // Taxonomy (for completeness)
  'fungi': 'taxonomy',
  'basidiomycota': 'taxonomy',
  'scientific': 'taxonomy'
};

export class MorphHeader extends LitElement {
  static properties = {
    // Perspectives
    perspectives: { type: Array },
    activePerspectives: { type: Array },
    maxPerspectives: { type: Number },
    showPerspectiveMenu: { type: Boolean },
    
    // Reactors
    enabledReactors: { type: Array },
    
    // Search
    searchQuery: { type: String },
    searchResults: { type: Number },
    totalMorphs: { type: Number },
    
    // View Mode
    viewMode: { type: String },
    
    // BubbleView Controls
    bubbleViewActive: { type: Boolean },
    bubbleViewInstance: { type: Object },
    isSimulating: { type: Boolean },
    showConnections: { type: Boolean },
    
    // UI State
    isMobileMenuOpen: { type: Boolean },
  };

  static styles = [
    globalStyles,
    css`
      :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* ===== GLASSMORPHISM HEADER ===== */
    .header {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      padding: 1rem 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .header-row {
      display: flex;
      align-items: center;
      gap: 2rem;
      width: 100%;
    }

    /* ===== SEARCH BAR (TOP ROW) ===== */
    .top-row {
      justify-content: center;
    }

    /* ===== SEARCH BAR ===== */
    .search-section {
      flex: 1;
      max-width: 600px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1.5rem 0.875rem 3rem;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      font-size: 1rem;
      background: white;
      transition: all 0.2s ease;
      outline: none;
    }

    .search-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(0, 0, 0, 0.4);
      pointer-events: none;
      font-size: 1.125rem;
    }

    .search-results {
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.5);
      font-weight: 500;
      pointer-events: none;
    }

    /* ===== REACTOR TOGGLES ===== */
    .reactors-section {
      display: flex;
      gap: 0.5rem;
    }

    .reactor-toggle {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
    }

    .reactor-toggle:hover {
      border-color: rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }

    .reactor-toggle.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .reactor-icon {
      font-size: 1rem;
    }

    /* ===== PERSPECTIVE BUTTONS (BOTTOM ROW) ===== */
    .perspectives-row {
      display: flex;
      gap: 0.375rem;
      flex-wrap: nowrap;
      justify-content: center;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 0.25rem 0;
    }

    .perspectives-row::-webkit-scrollbar {
      display: none;
    }

    .perspective-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1.5px solid;
      background: rgba(0, 0, 0, 0.85);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      white-space: nowrap;
      flex-shrink: 0;
      text-transform: capitalize;
    }

    .perspective-btn.active {
      padding: 0.625rem 1.125rem;
      font-size: 0.875rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.1);
      font-weight: 600;
      background: rgba(0, 0, 0, 0.95);
      transform: scale(1.05);
    }

    .perspective-btn.inactive {
      opacity: 0.7;
      padding: 0.4rem 0.7rem;
      font-size: 0.7rem;
      transform: scale(0.95);
    }

    .perspective-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
      opacity: 1;
    }

    .perspective-icon {
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .perspective-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ===== VIEW MODE SWITCHER ===== */
    .view-mode-section {
      display: flex;
      gap: 0.25rem;
      background: rgba(0, 0, 0, 0.05);
      padding: 0.25rem;
      border-radius: 12px;
    }

    .view-mode-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.5);
    }

    .view-mode-btn:hover {
      color: rgba(0, 0, 0, 0.7);
    }

    .view-mode-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* ===== MOBILE MENU ===== */
    .mobile-menu-toggle {
      display: none;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }

    .mobile-menu-toggle span {
      width: 24px;
      height: 2px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .header-content {
        gap: 1rem;
      }

      .perspectives-section,
      .reactors-section,
      .view-mode-section {
        display: none;
      }

      .mobile-menu-toggle {
        display: flex;
      }

      .header-content.mobile-open .perspectives-section,
      .header-content.mobile-open .reactors-section,
      .header-content.mobile-open .view-mode-section {
        display: flex;
        width: 100%;
      }
    }

    /* ===== DARK MODE ===== */
    @media (prefers-color-scheme: dark) {
      .header {
        background: rgba(0, 0, 0, 0.75);
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }

      .perspective-pill,
      .search-input,
      .reactor-toggle,
      .view-mode-btn.active {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
      }

      .perspective-menu {
        background: rgba(30, 30, 30, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .perspective-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .add-perspective-btn {
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.5);
      }

      .add-perspective-btn:hover {
        border-color: #667eea;
        color: #667eea;
      }
    `
  ];

  constructor() {
    super();
    
    // State - Match schema perspectives
    this.perspectives = [
      { name: 'taxonomy', label: 'Taxonomy', icon: '🧬', color: '#ef4444' },
      { name: 'physicalCharacteristics', label: 'Physical', icon: '👁️', color: '#f97316' },
      { name: 'ecologyAndHabitat', label: 'Ecology', icon: '🌍', color: '#eab308' },
      { name: 'culinaryAndNutritional', label: 'Culinary', icon: '🍳', color: '#22c55e' },
      { name: 'medicinalAndHealth', label: 'Medicinal', icon: '⚕️', color: '#06b6d4' },
      { name: 'cultivationAndProcessing', label: 'Cultivation', icon: '🌱', color: '#3b82f6' },
      { name: 'safetyAndIdentification', label: 'Safety', icon: '⚠️', color: '#8b5cf6' },
      { name: 'chemicalAndProperties', label: 'Chemical', icon: '🧪', color: '#ec4899' },
      { name: 'culturalAndHistorical', label: 'Cultural', icon: '📜', color: '#d946ef' },
      { name: 'commercialAndMarket', label: 'Commercial', icon: '💰', color: '#14b8a6' },
      { name: 'environmentalAndConservation', label: 'Environment', icon: '🌿', color: '#10b981' },
      { name: 'researchAndInnovation', label: 'Innovation', icon: '🔬', color: '#0ea5e9' },
    ];
    
    this.activePerspectives = [];
    this.maxPerspectives = 4;
    this.showPerspectiveMenu = false;
    
    this.enabledReactors = [];
    
    this.searchQuery = '';
    this.searchResults = 0;
    this.totalMorphs = 0;
    
    this.viewMode = 'grid'; // 'grid', 'list', 'compact'
    
    // BubbleView State
    this.bubbleViewActive = false;
    this.bubbleViewInstance = null;
    this.isSimulating = false;
    this.showConnections = false;
    
    this.isMobileMenuOpen = false;
    
    // AMORPH System Reference
    this.amorph = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Connect to AMORPH System
    if (window.amorph) {
      this.amorph = window.amorph;
      this.initializeFromSystem();
      this.attachEventListeners();
    } else {
      console.warn('[MorphHeader] AMORPH System not found on window.amorph');
    }
    
    // Listen for bubble-view-active event
    document.addEventListener('bubble-view-active', (e) => {
      this.bubbleViewActive = true;
      this.bubbleViewInstance = e.detail.bubbleView;
      this.isSimulating = e.detail.bubbleView.isSimulating;
      this.showConnections = e.detail.bubbleView.showConnections;
      console.log('[MorphHeader] BubbleView activated');
    });
    
    // Close menu on outside click
    this.handleOutsideClick = (e) => {
      if (this.showPerspectiveMenu && !e.composedPath().includes(this)) {
        this.showPerspectiveMenu = false;
      }
    };
    document.addEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
    
    if (this.amorph) {
      this.detachEventListeners();
    }
  }

  initializeFromSystem() {
    // Get enabled reactors
    const info = this.amorph.getSystemInfo();
    this.enabledReactors = info.enabledReactors || [];
    this.totalMorphs = info.morphCount || 0;
    
    // Get active perspectives (falls bereits gesetzt)
    // TODO: Implement perspective system in AmorphSystem
    this.activePerspectives = [];
  }

  attachEventListeners() {
    // Listen to reactor changes
    this.onReactorEnabled = (data) => {
      if (!this.enabledReactors.includes(data.name)) {
        this.enabledReactors = [...this.enabledReactors, data.name];
      }
    };
    
    this.onReactorDisabled = (data) => {
      this.enabledReactors = this.enabledReactors.filter(r => r !== data.name);
    };
    
    // Listen to search changes
    this.onSearchCompleted = (data) => {
      this.searchResults = data.totalResults;
      this.totalMorphs = data.totalMorphs;
    };
    
    this.onSearchChanged = (data) => {
      this.searchQuery = data.new;
    };
    
    // Listen to morph changes
    this.onMorphRegistered = () => {
      const info = this.amorph.getSystemInfo();
      this.totalMorphs = info.morphCount || 0;
    };
    
    // Listen to tag clicks
    this.onTagClicked = (data) => {
      console.log('[MorphHeader] Tag clicked:', data.tag);
      
      // Map tag to perspective
      const perspectiveName = TAG_TO_PERSPECTIVE[data.tag.toLowerCase()];
      if (!perspectiveName) {
        console.log('[MorphHeader] No perspective mapping for tag:', data.tag);
        return;
      }
      
      // Find perspective object
      const perspective = this.perspectives.find(p => p.name === perspectiveName);
      if (!perspective) {
        console.warn('[MorphHeader] Perspective not found:', perspectiveName);
        return;
      }
      
      // Toggle perspective (FIFO logic inside)
      if (!this.activePerspectives.find(p => p.name === perspectiveName)) {
        console.log('[MorphHeader] Auto-activating perspective from tag:', perspectiveName);
        this.togglePerspective(perspective);
      }
    };
    
    // Attach
    this.amorph.on('amorph:reactor:enabled', this.onReactorEnabled);
    this.amorph.on('amorph:reactor:disabled', this.onReactorDisabled);
    this.amorph.on('amorph:search:completed', this.onSearchCompleted);
    this.amorph.on('amorph:search:changed', this.onSearchChanged);
    this.amorph.on('amorph:morph:registered', this.onMorphRegistered);
    this.amorph.on('amorph:tag:clicked', this.onTagClicked);
  }

  detachEventListeners() {
    this.amorph.off('amorph:reactor:enabled', this.onReactorEnabled);
    this.amorph.off('amorph:reactor:disabled', this.onReactorDisabled);
    this.amorph.off('amorph:search:completed', this.onSearchCompleted);
    this.amorph.off('amorph:search:changed', this.onSearchChanged);
    this.amorph.off('amorph:morph:registered', this.onMorphRegistered);
    this.amorph.off('amorph:tag:clicked', this.onTagClicked);
  }

  // ==========================================
  // PERSPECTIVE METHODS
  // ==========================================

  togglePerspective(perspective) {
    const isActive = this.activePerspectives.find(p => p.name === perspective.name);
    
    if (isActive) {
      // Remove if already active
      this.removePerspective(perspective);
    } else {
      // Add with FIFO logic
      if (this.activePerspectives.length >= this.maxPerspectives) {
        console.log(`[MorphHeader] FIFO: Removing oldest perspective`);
        const removed = this.activePerspectives[0];
        this.activePerspectives = this.activePerspectives.slice(1);
        console.log(`[MorphHeader] Removed:`, removed.name);
      }
      
      this.activePerspectives = [...this.activePerspectives, perspective];
      this.dispatchPerspectiveChange();
      
      this.dispatchEvent(new CustomEvent('perspective-added', {
        detail: perspective,
        bubbles: true,
        composed: true,
      }));
    }
  }

  removePerspective(perspective) {
    this.activePerspectives = this.activePerspectives.filter(p => p.name !== perspective.name);
    
    // Dispatch global event for PerspectiveHosts
    this.dispatchPerspectiveChange();
    
    // Emit event
    this.dispatchEvent(new CustomEvent('perspective-removed', {
      detail: perspective,
      bubbles: true,
      composed: true,
    }));
  }

  dispatchPerspectiveChange() {
    const perspectiveIds = this.activePerspectives.map(p => p.name);
    
    console.log('[MorphHeader] Dispatching perspective change:', perspectiveIds);
    
    // Dispatch on window for PerspectiveHosts to listen
    window.dispatchEvent(new CustomEvent('perspective-changed', {
      detail: { perspectives: perspectiveIds },
      bubbles: true,
      composed: true
    }));
    
    // Also dispatch on document for broader reach
    document.dispatchEvent(new CustomEvent('perspective-changed', {
      detail: { perspectives: perspectiveIds },
      bubbles: true,
      composed: true
    }));
    
    console.log('[MorphHeader] Active perspectives:', perspectiveIds);
  }

  // ==========================================
  // REACTOR METHODS
  // ==========================================

  async toggleReactor(reactorName) {
    if (!this.amorph) return;
    
    // Prevent double-clicks
    if (this._toggleInProgress) return;
    this._toggleInProgress = true;
    
    try {
      // Get FRESH state from system, not from local state
      const info = this.amorph.getSystemInfo();
      const isEnabled = info.enabledReactors.includes(reactorName);
      
      if (isEnabled) {
        await this.amorph.disableReactor(reactorName);
      } else {
        await this.amorph.enableReactor(reactorName);
      }
    } finally {
      // Small delay to prevent rapid toggles
      setTimeout(() => {
        this._toggleInProgress = false;
      }, 100);
    }
  }

  // ==========================================
  // SEARCH METHODS
  // ==========================================

  handleSearchInput(e) {
    const query = e.target.value;
    this.searchQuery = query;
    
    // SearchReactor handles its own debouncing
    if (this.amorph) {
      this.amorph.emit('search:input', { query });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.amorph) {
      this.amorph.emit('search:input', { query: '' });
    }
  }

  // ==========================================
  // VIEW MODE METHODS
  // ==========================================

  setViewMode(mode) {
    this.viewMode = mode;
    
    // Emit event
    this.dispatchEvent(new CustomEvent('view-mode-changed', {
      detail: { mode },
      bubbles: true,
      composed: true,
    }));
  }

  // ==========================================
  // BUBBLEVIEW CONTROL METHODS
  // ==========================================

  toggleBubbleSimulation() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.toggleSimulation();
      this.isSimulating = this.bubbleViewInstance.isSimulating;
    }
  }

  toggleBubbleConnections() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.toggleConnections();
      this.showConnections = this.bubbleViewInstance.showConnections;
    }
  }

  resetBubbleView() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.resetView();
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  render() {
    return html`
      <header class="header">
        <div class="header-content">
          <!-- Top Row: Search Bar -->
          <div class="header-row top-row">
            <div class="search-section">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                class="search-input"
                placeholder="search this data..."
                .value=${this.searchQuery}
                @input=${this.handleSearchInput}
              />
              ${this.searchQuery ? html`
                <span class="search-results">
                  ${this.searchResults} / ${this.totalMorphs}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Bottom Row: Perspective Buttons -->
          <div class="perspectives-row">
            ${this.perspectives.map(p => {
              const isActive = this.activePerspectives.find(ap => ap.name === p.name);
              const btnClass = isActive ? 'active' : 'inactive';
              return html`
                <button 
                  class="perspective-btn ${btnClass}"
                  style="border-color: ${p.color}; color: ${p.color};"
                  @click=${() => this.togglePerspective(p)}
                  title="${p.label}"
                >
                  <span class="perspective-icon">${p.icon}</span>
                  <span class="perspective-label">${p.label}</span>
                </button>
              `;
            })}
          </div>
        </div>
      </header>
    `;
  }
}

// Register Web Component
customElements.define('morph-header', MorphHeader);
