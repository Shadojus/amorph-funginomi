/**
 * 🔮 PERSPECTIVE REACTOR
 * ======================
 * 
 * Lightweight reactor that filters and highlights morphs based on active perspectives.
 * Reuses FilterReactor logic - no bloat!
 * 
 * Features:
 * - Show/hide morphs based on perspective relevance
 * - Highlight morphs with perspective colors
 * - Smooth transitions
 * - Tag color consistency
 * 
 * Usage:
 * amorph.enableReactor('perspective');
 * // Listens to 'perspective-changed' events automatically
 */

export class PerspectiveReactor {
  constructor(config = {}) {
    this.config = {
      animate: true,
      duration: 300,
      highlightActive: true,
      ...config
    };
    
    this.activePerspectives = [];
    this.styleSheet = null;
    this.appliedMorphs = new Set();
    this._boundHandler = null;
    
    console.log('[PerspectiveReactor] Initialized');
    
    // Listen to perspective-changed events
    this._boundHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundHandler);
    console.log('[PerspectiveReactor] 👂 Listening to perspective-changed events');
  }
  
  /**
   * Handle perspective change event
   */
  handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    console.log('[PerspectiveReactor] 🎭 Perspective changed:', perspectives.map(p => p.name || p));
    
    // Update active perspectives
    this.activePerspectives = perspectives;
    
    // Re-apply to all morphs
    const allMorphs = Array.from(document.querySelectorAll('[data-morph="true"]'));
    if (allMorphs.length > 0) {
      this.apply(allMorphs);
    }
  }

  /**
   * Apply perspective filtering to morphs
   */
  apply(morphs) {
    // On first apply, check if we missed any perspective changes (timing issue)
    if (this.activePerspectives.length === 0) {
      const morphHeader = document.querySelector('morph-header');
      if (morphHeader && morphHeader.getActivePerspectives) {
        this.activePerspectives = morphHeader.getActivePerspectives();
        console.log('[PerspectiveReactor] 🔄 Retrieved initial perspectives from MorphHeader:', this.activePerspectives.map(p => p.name));
      }
    }
    
    // Skip if search is active (SearchFilterController handles highlighting during search)
    const containerSelector = window.amorph?.domainConfig?.ui?.grid?.containerClass || '.entity-grid';
    const container = document.querySelector(containerSelector);
    if (container && container.dataset.searchActive === 'true') {
      console.log('[PerspectiveReactor] ⏸️ Skipped - search is active, SearchFilterController handles highlighting');
      return 0;
    }
    
    this.injectStyles();
    
    // NO PERSPECTIVES = NO HIGHLIGHTING (clean state)
    if (this.activePerspectives.length === 0) {
      morphs.forEach(morph => {
        morph.classList.remove('reactor-perspective-dimmed', 'reactor-perspective-highlighted');
        morph.style.removeProperty('--perspective-color');
      });
      console.log('[PerspectiveReactor] 🧹 No perspectives active - cleaned all highlights');
      return morphs.length;
    }
    
    // Filter morphs by relevance
    morphs.forEach(morph => {
      const relevance = this.getMorphRelevance(morph);
      
      if (relevance.score > 0) {
        // Show and highlight relevant morphs
        morph.classList.remove('reactor-perspective-dimmed');
        if (this.config.highlightActive && relevance.color) {
          morph.style.setProperty('--perspective-color', relevance.color);
          morph.classList.add('reactor-perspective-highlighted');
        }
      } else {
        // Dim irrelevant morphs (don't hide - just reduce opacity)
        morph.classList.add('reactor-perspective-dimmed');
        morph.classList.remove('reactor-perspective-highlighted');
      }
      
      this.appliedMorphs.add(morph);
    });
    
    console.log(`[PerspectiveReactor] Applied to ${morphs.length} morphs, ${this.activePerspectives.length} perspectives active`);
    return morphs.length;
  }

  /**
   * Calculate morph relevance to active perspectives
   */
  getMorphRelevance(morph) {
    const morphPerspective = morph.getAttribute('perspective');
    const morphTags = morph.getAttribute('tags')?.split(',').map(t => t.trim()) || [];
    const morphType = morph.tagName.toLowerCase();
    
    let score = 0;
    let color = null;
    
    // Check each active perspective
    for (const perspective of this.activePerspectives) {
      const config = PERSPECTIVE_CONFIG[perspective.name];
      if (!config) continue;
      
      // Direct perspective match (highest priority)
      if (morphPerspective === perspective.name) {
        score += 10;
        color = perspective.color;
        break;
      }
      
      // Tag match
      const matchingTags = morphTags.filter(tag => 
        config.highlightTags?.includes(tag.toLowerCase())
      );
      if (matchingTags.length > 0) {
        score += matchingTags.length * 3;
        if (!color) color = perspective.color;
      }
      
      // Morph type match
      if (config.morphTypes?.includes(morphType)) {
        score += 1;
        if (!color) color = perspective.color;
      }
    }
    
    return { score, color };
  }

  /**
   * Update active perspectives from event
   */
  updatePerspectives(perspectives) {
    this.activePerspectives = perspectives;
  }

  /**
   * Cleanup (remove all perspective effects)
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.classList.remove('reactor-perspective-dimmed', 'reactor-perspective-highlighted');
      morph.style.removeProperty('--perspective-color');
      this.appliedMorphs.delete(morph);
    });
    
    // Remove event listener
    if (this._boundHandler) {
      window.removeEventListener('perspective-changed', this._boundHandler);
    }
    
    console.log('[PerspectiveReactor] Cleaned up');
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (this.styleSheet) return;
    
    const style = document.createElement('style');
    style.textContent = `
      /* Perspective Reactor Styles - Simple left border */
      .reactor-perspective-dimmed {
        opacity: 0.6 !important;
        transition: opacity ${this.config.duration}ms ease;
      }
      
      .reactor-perspective-highlighted {
        border-left: 3px solid var(--perspective-color, transparent) !important;
        padding-left: 0.5rem !important;
        transition: border-left ${this.config.duration}ms ease, padding-left ${this.config.duration}ms ease;
      }
    `;
    
    document.head.appendChild(style);
    this.styleSheet = style;
  }
}

/**
 * Perspective Configuration
 * Maps perspectives to relevant data and visual cues
 * Built from schema definition for consistency
 */
const PERSPECTIVE_CONFIG = {
  identity: {
    highlightTags: ['name', 'nomenclature', 'etymology', 'synonym'],
    morphTypes: ['text-morph', 'name-morph']
  },
  visualIdentity: {
    highlightTags: ['image', 'color', 'visual', 'appearance'],
    morphTypes: ['image-morph', 'color-morph']
  },
  taxonomy: {
    highlightTags: ['scientific', 'classification', 'kingdom', 'phylum', 'family', 'genus', 'species'],
    morphTypes: ['name-morph', 'text-morph', 'hierarchy-morph']
  },
  phylogeny: {
    highlightTags: ['evolution', 'genetic', 'relationship', 'lineage'],
    morphTypes: ['text-morph', 'timeline-morph', 'tree-morph']
  },
  morphologyAndAnatomy: {
    highlightTags: ['cap', 'gills', 'stem', 'spores', 'color', 'shape', 'size'],
    morphTypes: ['image-morph', 'text-morph', 'number-morph']
  },
  microscopyAndCellular: {
    highlightTags: ['spore', 'cell', 'hyphae', 'tissue', 'structure'],
    morphTypes: ['image-morph', 'text-morph', 'number-morph']
  },
  chemicalAndProperties: {
    highlightTags: ['compound', 'molecule', 'enzyme', 'protein', 'bioactive', 'composition'],
    morphTypes: ['text-morph', 'chart-morph', 'list-morph', 'number-morph']
  },
  sensoryProfile: {
    highlightTags: ['aroma', 'taste', 'texture', 'appearance', 'sound'],
    morphTypes: ['text-morph', 'tag-morph', 'sensory-morph']
  },
  ecologyAndDistribution: {
    highlightTags: ['habitat', 'substrate', 'interaction', 'ecosystem', 'forest', 'grassland'],
    morphTypes: ['map-morph', 'tag-morph', 'text-morph']
  },
  temporalPatterns: {
    highlightTags: ['lifecycle', 'phenology', 'season', 'history', 'timing'],
    morphTypes: ['timeline-morph', 'text-morph', 'chart-morph']
  },
  geographyAndDistribution: {
    highlightTags: ['range', 'climate', 'location', 'occurrence'],
    morphTypes: ['map-morph', 'text-morph', 'tag-morph']
  },
  cultivationAndGrowing: {
    highlightTags: ['cultivation', 'farming', 'substrate', 'harvest', 'growing', 'temperature', 'humidity'],
    morphTypes: ['text-morph', 'number-morph', 'timeline-morph', 'chart-morph']
  },
  medicinalAndHealth: {
    highlightTags: ['medicinal', 'therapeutic', 'health', 'healing', 'benefits', 'safety', 'dosing'],
    morphTypes: ['text-morph', 'list-morph', 'chart-morph', 'boolean-morph']
  },
  culinaryAndNutritional: {
    highlightTags: ['edible', 'cooking', 'culinary', 'taste', 'texture', 'nutrition', 'recipe'],
    morphTypes: ['text-morph', 'boolean-morph', 'chart-morph', 'tag-morph', 'radar-chart-morph']
  },
  commercialAndMarket: {
    highlightTags: ['market', 'price', 'trade', 'demand', 'business', 'value'],
    morphTypes: ['number-morph', 'chart-morph', 'text-morph']
  },
  environmentalAndConservation: {
    highlightTags: ['endangered', 'conservation', 'sustainable', 'biodiversity', 'ecosystem', 'threat'],
    morphTypes: ['text-morph', 'boolean-morph', 'tag-morph', 'map-morph']
  },
  historicalAndCultural: {
    highlightTags: ['traditional', 'folklore', 'culture', 'history', 'heritage', 'mythology'],
    morphTypes: ['text-morph', 'timeline-morph', 'image-morph']
  },
  researchAndInnovation: {
    highlightTags: ['research', 'study', 'innovation', 'biotechnology', 'publication', 'discovery'],
    morphTypes: ['text-morph', 'list-morph', 'timeline-morph', 'chart-morph']
  },
  safetyAndIdentification: {
    highlightTags: ['toxic', 'poisonous', 'warning', 'lookalike', 'identification', 'safety', 'caution'],
    morphTypes: ['text-morph', 'boolean-morph', 'image-morph', 'tag-morph']
  },
  metadata: {
    highlightTags: ['quality', 'version', 'timestamp', 'source'],
    morphTypes: ['text-morph', 'number-morph']
  }
};

export default PerspectiveReactor;
