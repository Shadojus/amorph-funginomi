/**
 * 🔮 AMORPH SYSTEM - MORPHHEADER GLOBAL
 * =====================================
 * 
 * Globale Header-Komponente für das AMORPH System
 * 
 * Features:
 * - Perspective Selector (max 4 gleichzeitig)
 * - Reactor Toggles (Glow, Search, Animation)
 * - Global Search Bar
 * - View Mode Switcher (Grid, List, Compact)
 * - Glassmorphism Design
 * 
 * @author AMORPH System
 * @version 1.0.0
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from '../../arch/styles/tokens.js';

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
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    /* ===== LOGO / TITLE ===== */
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
      user-select: none;
    }

    /* ===== PERSPECTIVES SECTION ===== */
    .perspectives-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 200px;
    }

    .perspective-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .perspective-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .perspective-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .perspective-pill .remove {
      font-size: 1rem;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .perspective-pill:hover .remove {
      opacity: 1;
    }

    .add-perspective-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px dashed rgba(0, 0, 0, 0.2);
      background: transparent;
      color: rgba(0, 0, 0, 0.5);
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .add-perspective-btn:hover {
      border-color: #667eea;
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    /* ===== PERSPECTIVE MENU (DROPDOWN) ===== */
    .perspective-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      min-width: 200px;
      z-index: 100;
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .perspective-menu-item {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .perspective-menu-item:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .perspective-menu-item.active {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      font-weight: 500;
    }

    .perspective-color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid currentColor;
    }

    /* ===== SEARCH BAR ===== */
    .search-section {
      flex: 1;
      max-width: 400px;
      min-width: 200px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      font-size: 0.875rem;
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
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(0, 0, 0, 0.4);
      pointer-events: none;
    }

    .search-results {
      position: absolute;
      right: 1rem;
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
    
    // State
    this.perspectives = [
      { name: 'culinary', label: 'Kulinarisch', color: '#667eea' },
      { name: 'medical', label: 'Medizinisch', color: '#f093fb' },
      { name: 'ecological', label: 'Ökologisch', color: '#4facfe' },
      { name: 'cultural', label: 'Kulturell', color: '#43e97b' },
      { name: 'scientific', label: 'Wissenschaftlich', color: '#fa709a' },
      { name: 'foraging', label: 'Sammeln', color: '#feca57' },
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
      const perspectiveMap = {
        'edible': 'culinary',
        'toxic': 'safety',
        'medicinal': 'medicinal',
        'cultivation': 'cultivation',
        'spring': 'ecology',
        'summer': 'ecology',
        'fall': 'ecology',
        'winter': 'ecology',
        'parasitic': 'ecology',
        'decomposer': 'ecology'
      };
      
      const perspective = perspectiveMap[data.tag.toLowerCase()];
      if (perspective && !this.activePerspectives.includes(perspective)) {
        this.addPerspective(perspective);
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

  togglePerspectiveMenu() {
    this.showPerspectiveMenu = !this.showPerspectiveMenu;
  }

  addPerspective(perspective) {
    if (this.activePerspectives.length >= this.maxPerspectives) {
      console.warn(`[MorphHeader] Maximum ${this.maxPerspectives} perspectives allowed`);
      return;
    }
    
    if (this.activePerspectives.find(p => p.name === perspective.name)) {
      return; // Already active
    }
    
    this.activePerspectives = [...this.activePerspectives, perspective];
    this.showPerspectiveMenu = false;
    
    // Emit event
    this.dispatchEvent(new CustomEvent('perspective-added', {
      detail: perspective,
      bubbles: true,
      composed: true,
    }));
  }

  removePerspective(perspective) {
    this.activePerspectives = this.activePerspectives.filter(p => p.name !== perspective.name);
    
    // Emit event
    this.dispatchEvent(new CustomEvent('perspective-removed', {
      detail: perspective,
      bubbles: true,
      composed: true,
    }));
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
        <div class="header-content ${this.isMobileMenuOpen ? 'mobile-open' : ''}">
          <!-- Logo -->
          <div class="logo">🔮 AMORPH</div>
          
          <!-- Perspectives -->
          <div class="perspectives-section">
            <div class="perspective-pills">
              ${this.activePerspectives.map(p => html`
                <div 
                  class="perspective-pill"
                  style="border-color: ${p.color}; color: ${p.color};"
                  @click=${() => this.removePerspective(p)}
                >
                  <span>${p.label}</span>
                  <span class="remove">×</span>
                </div>
              `)}
            </div>
            
            ${this.activePerspectives.length < this.maxPerspectives ? html`
              <button 
                class="add-perspective-btn"
                @click=${this.togglePerspectiveMenu}
                title="Perspective hinzufügen"
              >
                +
              </button>
            ` : ''}
            
            ${this.showPerspectiveMenu ? html`
              <div class="perspective-menu">
                ${this.perspectives.map(p => {
                  const isActive = this.activePerspectives.find(ap => ap.name === p.name);
                  return html`
                    <div 
                      class="perspective-menu-item ${isActive ? 'active' : ''}"
                      @click=${() => !isActive && this.addPerspective(p)}
                      style="color: ${p.color};"
                    >
                      <div class="perspective-color-dot" style="border-color: ${p.color};"></div>
                      <span>${p.label}</span>
                    </div>
                  `;
                })}
              </div>
            ` : ''}
          </div>
          
          <!-- Search -->
          <div class="search-section">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              class="search-input"
              placeholder="Pilze durchsuchen..."
              .value=${this.searchQuery}
              @input=${this.handleSearchInput}
            />
            ${this.searchQuery ? html`
              <span class="search-results">
                ${this.searchResults} / ${this.totalMorphs}
              </span>
            ` : ''}
          </div>
          
          <!-- Reactor Toggles -->
          <div class="reactors-section">
            <button 
              class="reactor-toggle ${this.enabledReactors.includes('glow') ? 'active' : ''}"
              @click=${() => this.toggleReactor('glow')}
              title="Glow Effect"
            >
              <span class="reactor-icon">✨</span>
              <span>Glow</span>
            </button>
            
            <button 
              class="reactor-toggle ${this.enabledReactors.includes('search') ? 'active' : ''}"
              @click=${() => this.toggleReactor('search')}
              title="Search Filter"
            >
              <span class="reactor-icon">🔍</span>
              <span>Search</span>
            </button>
            
            <button 
              class="reactor-toggle ${this.enabledReactors.includes('animation') ? 'active' : ''}"
              @click=${() => this.toggleReactor('animation')}
              title="Animations"
            >
              <span class="reactor-icon">🎬</span>
              <span>Animation</span>
            </button>
          </div>
          
          <!-- BubbleView Controls (only when BubbleView is active) -->
          ${this.bubbleViewActive ? html`
            <div class="reactors-section">
              <button 
                class="reactor-toggle ${this.isSimulating ? 'active' : ''}"
                @click=${this.toggleBubbleSimulation}
                title="${this.isSimulating ? 'Pause Simulation' : 'Start Simulation'}"
              >
                <span class="reactor-icon">${this.isSimulating ? '⏸️' : '▶️'}</span>
                <span>${this.isSimulating ? 'Pause' : 'Play'}</span>
              </button>
              
              <button 
                class="reactor-toggle ${this.showConnections ? 'active' : ''}"
                @click=${this.toggleBubbleConnections}
                title="Show Connections"
              >
                <span class="reactor-icon">🔗</span>
                <span>Connections</span>
              </button>
              
              <button 
                class="reactor-toggle"
                @click=${this.resetBubbleView}
                title="Reset View"
              >
                <span class="reactor-icon">🔄</span>
                <span>Reset</span>
              </button>
            </div>
          ` : ''}
          
          <!-- View Mode -->
          <div class="view-mode-section">
            <button 
              class="view-mode-btn ${this.viewMode === 'grid' ? 'active' : ''}"
              @click=${() => this.setViewMode('grid')}
              title="Grid View"
            >
              ▦
            </button>
            <button 
              class="view-mode-btn ${this.viewMode === 'list' ? 'active' : ''}"
              @click=${() => this.setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
            <button 
              class="view-mode-btn ${this.viewMode === 'compact' ? 'active' : ''}"
              @click=${() => this.setViewMode('compact')}
              title="Compact View"
            >
              ▪▪▪
            </button>
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button 
            class="mobile-menu-toggle"
            @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    `;
  }
}

// Register Web Component
customElements.define('morph-header', MorphHeader);
