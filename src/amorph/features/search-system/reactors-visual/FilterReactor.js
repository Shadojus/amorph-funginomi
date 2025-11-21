/**
 * 🔍 FILTER REACTOR
 * =================
 * 
 * Filtert Morphs nach verschiedenen Kriterien:
 * - Tag-based (zeige nur bestimmte Tags)
 * - Perspective-based (zeige nur bestimmte Perspektiven)
 * - Custom filter function
 * 
 * Features:
 * - Smooth fade-out animations
 * - Multiple filter modes
 * - Combines multiple filters (AND/OR logic)
 * - Maintains DOM structure
 * 
 * Usage:
 * amorph.enableReactor('filter', {
 *   tags: ['edible', 'medicinal'],
 *   perspectives: ['culinary'],
 *   logic: 'AND',
 *   animate: true
 * });
 */

export class FilterReactor {
  constructor(config = {}) {
    this.config = {
      tags: [],               // Array of tags to filter by
      perspectives: [],       // Array of perspectives to filter by
      customFilter: null,     // Custom filter function
      logic: 'OR',           // 'AND' | 'OR' - how to combine filters
      animate: true,
      duration: 300,
      ...config
    };
    
    this.styleSheet = null;
    this.appliedMorphs = new Set();
    this.hiddenMorphs = new Set();
    
    console.log('[FilterReactor] Initialized', this.config);
  }

  /**
   * Apply filtering to morphs
   */
  apply(morphs) {
    this.injectStyles();
    
    const filtered = morphs.filter(morph => this.shouldShow(morph));
    const hidden = morphs.filter(morph => !this.shouldShow(morph));
    
    // Show filtered morphs
    filtered.forEach(morph => {
      morph.classList.remove('reactor-filter-hidden');
      this.appliedMorphs.add(morph);
      this.hiddenMorphs.delete(morph);
    });
    
    // Hide non-matching morphs
    hidden.forEach(morph => {
      morph.classList.add('reactor-filter-hidden');
      this.appliedMorphs.add(morph);
      this.hiddenMorphs.add(morph);
    });
    
    console.log(`[FilterReactor] Showing ${filtered.length}, hiding ${hidden.length} morphs`);
    return morphs.length;
  }

  /**
   * Cleanup filtering (show all morphs)
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.classList.remove('reactor-filter-hidden');
      this.appliedMorphs.delete(morph);
      this.hiddenMorphs.delete(morph);
    });
    
    if (this.appliedMorphs.size === 0 && this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    
    console.log(`[FilterReactor] Cleanup filtering from ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Check if morph should be shown based on filters
   */
  shouldShow(morph) {
    const filters = [];
    
    // Tag filter
    if (this.config.tags.length > 0) {
      filters.push(this.matchesTags(morph));
    }
    
    // Perspective filter
    if (this.config.perspectives.length > 0) {
      filters.push(this.matchesPerspectives(morph));
    }
    
    // Custom filter
    if (this.config.customFilter) {
      filters.push(this.config.customFilter(morph));
    }
    
    // No filters = show all
    if (filters.length === 0) return true;
    
    // Combine with logic
    if (this.config.logic === 'AND') {
      return filters.every(f => f);
    } else {
      return filters.some(f => f);
    }
  }

  /**
   * Check if morph matches tag filter
   */
  matchesTags(morph) {
    const morphTags = this.getMorphTags(morph);
    
    if (this.config.logic === 'AND') {
      // Morph must have ALL filter tags
      return this.config.tags.every(tag => morphTags.includes(tag));
    } else {
      // Morph must have AT LEAST ONE filter tag
      return this.config.tags.some(tag => morphTags.includes(tag));
    }
  }

  /**
   * Check if morph matches perspective filter
   */
  matchesPerspectives(morph) {
    const morphPerspectives = this.getMorphPerspectives(morph);
    
    if (this.config.logic === 'AND') {
      // Morph must have ALL filter perspectives
      return this.config.perspectives.every(p => morphPerspectives.includes(p));
    } else {
      // Morph must have AT LEAST ONE filter perspective
      return this.config.perspectives.some(p => morphPerspectives.includes(p));
    }
  }

  /**
   * Get tags from morph
   */
  getMorphTags(morph) {
    // Check for tag-morph
    if (morph.tagName.toLowerCase() === 'tag-morph') {
      const tag = morph.dataset.morphTag || morph.textContent;
      return tag ? [tag.toLowerCase()] : [];
    }
    
    // Check data attribute
    if (morph.dataset.morphTags) {
      try {
        return JSON.parse(morph.dataset.morphTags).map(t => t.toLowerCase());
      } catch (e) {
        return morph.dataset.morphTags.split(',').map(t => t.trim().toLowerCase());
      }
    }
    
    return [];
  }

  /**
   * Get perspectives from morph
   */
  getMorphPerspectives(morph) {
    if (morph.dataset.morphPerspectives) {
      try {
        return JSON.parse(morph.dataset.morphPerspectives).map(p => p.toLowerCase());
      } catch (e) {
        return morph.dataset.morphPerspectives.split(',').map(p => p.trim().toLowerCase());
      }
    }
    
    return [];
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (this.styleSheet) return;
    
    this.styleSheet = document.createElement('style');
    this.styleSheet.textContent = `
      /* Hidden state */
      .reactor-filter-hidden {
        opacity: 0 !important;
        pointer-events: none !important;
        max-height: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        ${this.config.animate ? `
          transition: 
            opacity ${this.config.duration}ms ease-out,
            max-height ${this.config.duration}ms ease-out,
            margin ${this.config.duration}ms ease-out,
            padding ${this.config.duration}ms ease-out;
        ` : ''}
      }
      
      /* Visible state */
      .reactor-filter-visible {
        opacity: 1;
        pointer-events: auto;
        max-height: none;
        ${this.config.animate ? `
          transition: 
            opacity ${this.config.duration}ms ease-in,
            max-height ${this.config.duration}ms ease-in;
        ` : ''}
      }
      
      /* Accessibility: Keep in DOM for screen readers */
      .reactor-filter-hidden[aria-hidden="false"] {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
      }
    `;
    
    document.head.appendChild(this.styleSheet);
  }

  /**
   * Update filter config dynamically
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Reapply to existing morphs
    if (this.appliedMorphs.size > 0) {
      this.apply([...this.appliedMorphs]);
    }
    
    console.log('[FilterReactor] Config updated', this.config);
  }

  /**
   * Get currently visible morphs
   */
  getVisibleMorphs() {
    return [...this.appliedMorphs].filter(m => !this.hiddenMorphs.has(m));
  }

  /**
   * Get currently hidden morphs
   */
  getHiddenMorphs() {
    return [...this.hiddenMorphs];
  }
}
