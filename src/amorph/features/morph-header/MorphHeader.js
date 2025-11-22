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
import { globalStyles } from './tokens.js';

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
  
  // Taxonomy (generic)
  'taxonomy': 'taxonomy',
  'classification': 'taxonomy',
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
    matchedPerspectives: { type: Object },
    
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

    /* ===== DARK GLASSMORPHISM HEADER ===== */
    .header {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(20px) saturate(150%);
      -webkit-backdrop-filter: blur(20px) saturate(150%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
      justify-content: space-between;
      align-items: center;
    }

    /* ===== BRANDING ===== */
    .branding {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .brand-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      margin: 0;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      font-weight: 400;
    }

    .brand-subtitle a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .brand-subtitle a:hover {
      color: rgba(255, 255, 255, 0.95);
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
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      font-size: 1rem;
      background: rgba(0, 0, 0, 0.4);
      color: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
      outline: none;
      backdrop-filter: blur(10px) saturate(120%);
      -webkit-backdrop-filter: blur(10px) saturate(120%);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.15), 0 0 40px rgba(59, 130, 246, 0.1);
      animation: search-bar-pulse 3s ease-in-out infinite;
    }
    
    @keyframes search-bar-pulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.15), 0 0 40px rgba(59, 130, 246, 0.1);
        border-color: rgba(255, 255, 255, 0.1);
      }
      50% {
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.25), 0 0 60px rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.2);
      }
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .search-input:focus {
      border-color: rgba(59, 130, 246, 0.4);
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 40px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(0, 0, 0, 0.3);
      animation: none;
    }

    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      font-size: 1.125rem;
    }

    .search-results {
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
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
      flex-wrap: wrap; /* Allow wrapping to max 2 rows */
      justify-content: center;
      padding: 0.25rem 0;
      max-height: calc(2.5rem * 2 + 0.375rem); /* Max 2 rows */
      overflow: hidden;
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
      border: 1px solid;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      white-space: normal; /* Allow text wrapping */
      word-break: break-word; /* Break long words */
      flex-shrink: 1; /* Allow shrinking */
      text-transform: capitalize;
      opacity: 0.5;
      min-width: fit-content;
      max-width: 120px; /* Limit width to force wrapping */
      line-height: 1.2;
      text-align: center;
    }

    /* Inactive buttons: hide icon first */
    .perspective-btn.inactive .perspective-icon {
      display: none;
    }

    .perspective-btn.inactive {
      gap: 0;
      padding: 0.4rem 0.7rem;
      font-size: 0.7rem;
      max-width: 100px; /* Smaller max width */
    }

    /* Hide icon on small screens for all buttons */
    @media (max-width: 1200px) {
      .perspective-btn .perspective-icon {
        display: none;
      }
      .perspective-btn {
        gap: 0;
        padding: 0.5rem 0.75rem;
        max-width: 100px;
      }
    }

    /* Further compact on very small screens */
    @media (max-width: 900px) {
      .perspective-btn {
        font-size: 0.65rem;
        padding: 0.35rem 0.5rem;
        max-width: 80px;
      }
      .perspective-btn.active {
        font-size: 0.7rem;
        padding: 0.4rem 0.6rem;
        max-width: 90px;
      }
    }

    .perspective-btn.active {
      padding: 0.625rem 1.125rem;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      font-weight: 600;
      opacity: 1;
      animation: perspective-pulse 2s ease-in-out infinite;
      flex-shrink: 0; /* Active button doesn't shrink */
      max-width: 150px; /* Larger max width for active */
    }

    .perspective-btn.active .perspective-icon {
      display: inline; /* Always show icon on active button */
    }

    @keyframes perspective-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      }
      50% {
        transform: scale(1.03);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 12px var(--btn-color, rgba(255, 255, 255, 0.2));
      }
    }

    .perspective-btn.inactive {
      opacity: 0.35;
      padding: 0.5rem 0.875rem;
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.02);
    }

    .perspective-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0.85;
    }

    .perspective-btn.active:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    .perspective-btn.has-matches {
      position: relative;
    }

    .perspective-btn.has-matches::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
      animation: match-indicator-pulse 1.5s ease-in-out infinite;
    }

    @keyframes match-indicator-pulse {
      0%, 100% {
        opacity: 0.8;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
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
      .header {
        padding: 0.75rem 1rem; /* Smaller padding on mobile */
      }

      .header-content {
        gap: 0.75rem;
      }

      .branding {
        /* Keep branding but make it smaller */
        gap: 0;
      }

      .brand-title {
        font-size: 1.125rem; /* Smaller title */
      }

      .brand-subtitle {
        font-size: 0.625rem; /* Smaller subtitle */
      }

      .top-row {
        gap: 1rem;
      }

      .top-row > div:last-child {
        display: none; /* Hide spacer on mobile */
      }

      .search-section {
        max-width: 100%;
      }

      .search-input {
        padding: 0.75rem 1.25rem 0.75rem 2.5rem;
        font-size: 0.875rem;
      }

      .search-icon {
        left: 1rem;
        font-size: 1rem;
      }

      .perspectives-row {
        gap: 0.25rem;
        max-height: calc(2rem * 2 + 0.25rem); /* Smaller buttons on mobile */
      }

      .perspective-btn {
        font-size: 0.65rem;
        padding: 0.375rem 0.5rem;
      }

      .perspective-btn.active {
        font-size: 0.7rem;
        padding: 0.4rem 0.6rem;
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
    this.matchedPerspectives = {};
    
    this.viewMode = 'grid'; // 'grid', 'list', 'compact'
    
    // BubbleView State
    this.bubbleViewActive = false;
    this.bubbleViewInstance = null;
    this.isSimulating = false;
    this.showConnections = false;
    
    this.isMobileMenuOpen = false;
    
    // Auto-switch debounce timer
    this.autoSwitchTimer = null;
    
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
    
    // Clear auto-switch timer
    if (this.autoSwitchTimer) {
      clearTimeout(this.autoSwitchTimer);
    }
    
    if (this.amorph) {
      this.detachEventListeners();
    }
  }

  initializeFromSystem() {
    // Get enabled reactors
    const info = this.amorph.getSystemInfo();
    this.enabledReactors = info.enabledReactors || [];
    this.totalMorphs = info.morphCount || 0;
    
    // Initialize with 3 most interesting perspectives for users
    const defaultPerspectiveNames = [
      'cultivationAndProcessing',    // How to grow them
      'chemicalAndProperties',       // Chemical composition
      'medicinalAndHealth',          // Health benefits
    ];
    
    this.activePerspectives = defaultPerspectiveNames
      .map(name => this.perspectives.find(p => p.name === name))
      .filter(Boolean);
    
    // Dispatch initial perspective change
    if (this.activePerspectives.length > 0) {
      this.dispatchPerspectiveChange();
    }
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
      console.log('[MorphHeader] 🔥 Search completed EVENT RECEIVED!', data);
      this.searchResults = data.totalResults;
      this.totalMorphs = data.totalMorphs;
      this.matchedPerspectives = data.perspectiveMatchCounts || {};
      
      // Clear previous auto-switch timer (debounce)
      if (this.autoSwitchTimer) {
        clearTimeout(this.autoSwitchTimer);
      }
      
      // Auto-activate perspectives with matches (debounced to prevent switching while typing)
      const matchedPerspectiveNames = data.matchedPerspectives || [];
      console.log('[MorphHeader] 🎯 Matched perspectives for auto-activation:', matchedPerspectiveNames);
      
      if (matchedPerspectiveNames.length > 0) {
        // Debounce: Wait 400ms before auto-switching (user might still be typing)
        this.autoSwitchTimer = setTimeout(async () => {
          console.log('[MorphHeader] ⏰ Auto-switch timer fired, activating perspectives...');
          matchedPerspectiveNames.forEach(perspectiveName => {
            const perspective = this.perspectives.find(p => p.name === perspectiveName);
            const isAlreadyActive = this.activePerspectives.find(p => p.name === perspectiveName);
            console.log('[MorphHeader] Checking perspective:', {
              perspectiveName,
              foundPerspective: !!perspective,
              isAlreadyActive: !!isAlreadyActive
            });
            
            if (perspective && !isAlreadyActive) {
              console.log('[MorphHeader] Auto-activating perspective from search:', perspectiveName);
              this.togglePerspective(perspective);
            }
          });
          
          // Wait for perspective changes and deep mode switches to complete
          // Reduced to 400ms for faster search response
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // NOW trigger highlighting after all perspective switches have completed
          console.log('[MorphHeader] 🎨 Triggering highlighting after perspective auto-activation');
          window.dispatchEvent(new CustomEvent('data-morph:deep-mode-ready', {
            detail: { query: data.query }
          }));
        }, 400); // 400ms debounce - nearly unnoticeable but prevents accidental switches
      } else {
        // No perspectives to activate, trigger highlighting after deep mode completes
        // Reduced to 200ms for faster response
        setTimeout(() => {
          console.log('[MorphHeader] 🎨 Triggering highlighting (no perspective auto-activation)');
          window.dispatchEvent(new CustomEvent('data-morph:deep-mode-ready', {
            detail: { query: data.query }
          }));
        }, 200);
      }
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
    
    // Listen to search perspective activation
    this.onSearchActivatePerspectives = (event) => {
      const perspectiveNames = event.detail?.perspectives || [];
      console.log('[MorphHeader] Search wants to activate perspectives:', perspectiveNames);
      
      perspectiveNames.forEach(perspectiveName => {
        const perspective = this.perspectives.find(p => p.name === perspectiveName);
        if (perspective && !this.activePerspectives.find(p => p.name === perspectiveName)) {
          console.log('[MorphHeader] Auto-activating perspective from search:', perspectiveName);
          this.togglePerspective(perspective);
        }
      });
    };
    
    // Attach
    this.amorph.on('reactor:enabled', this.onReactorEnabled);
    this.amorph.on('reactor:disabled', this.onReactorDisabled);
    this.amorph.on('search:completed', this.onSearchCompleted);
    this.amorph.on('search:changed', this.onSearchChanged);
    this.amorph.on('morph:registered', this.onMorphRegistered);
    this.amorph.on('tag:clicked', this.onTagClicked);
    
    // Listen to window events for search perspective activation
    window.addEventListener('search:activate-perspectives', this.onSearchActivatePerspectives);
  }

  detachEventListeners() {
    this.amorph.off('reactor:enabled', this.onReactorEnabled);
    this.amorph.off('reactor:disabled', this.onReactorDisabled);
    this.amorph.off('search:completed', this.onSearchCompleted);
    this.amorph.off('search:changed', this.onSearchChanged);
    this.amorph.off('morph:registered', this.onMorphRegistered);
    this.amorph.off('tag:clicked', this.onTagClicked);
    
    window.removeEventListener('search:activate-perspectives', this.onSearchActivatePerspectives);
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
    
    // ALSO dispatch via AMORPH event system for Reactors
    if (this.amorph) {
      this.amorph.emit('perspectives:changed', {
        perspectives: perspectiveIds
      });
    }
    
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
      this.amorph.streamPublish('search:input', { query });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.amorph) {
      this.amorph.streamPublish('search:input', { query: '' });
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
          <!-- Top Row: Branding + Search Bar -->
          <div class="header-row top-row">
            <!-- Branding -->
            <div class="branding">
              <h1 class="brand-title">${window.amorph?.domainConfig?.instance?.name || 'AMORPH'}</h1>
              <p class="brand-subtitle">
                Part of the <a href="${window.amorph?.domainConfig?.externalLinks?.bifroest || 'https://bifroest.io'}" target="_blank" rel="noopener noreferrer">Bifröst</a>
              </p>
            </div>

            <!-- Search Bar -->
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

            <!-- Empty spacer for balance -->
            <div style="width: 200px;"></div>
          </div>

          <!-- Bottom Row: Perspective Buttons -->
          <div class="perspectives-row">
            ${this.perspectives.map(p => {
              const isActive = this.activePerspectives.find(ap => ap.name === p.name);
              const hasMatches = this.matchedPerspectives[p.name] > 0;
              const btnClass = `${isActive ? 'active' : 'inactive'} ${hasMatches ? 'has-matches' : ''}`;
              const matchCount = this.matchedPerspectives[p.name] || 0;
              const title = matchCount > 0 ? `${p.label} (${matchCount} matches)` : p.label;
              return html`
                <button 
                  class="perspective-btn ${btnClass}"
                  style="border-color: ${p.color}; color: ${p.color}; --btn-color: ${p.color};"
                  @click=${() => this.togglePerspective(p)}
                  title="${title}"
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
