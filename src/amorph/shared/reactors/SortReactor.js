/**
 * 🔢 SORT REACTOR
 * ===============
 * 
 * Sortiert Morphs nach verschiedenen Kriterien:
 * - Alphabetical (A-Z, Z-A)
 * - Relevance (Search scores)
 * - Date/Time (newest, oldest)
 * - Custom comparator
 * 
 * Features:
 * - Smooth reordering animations
 * - Multiple sort modes
 * - Maintains DOM order for accessibility
 * - Works with FLIP animation technique
 * 
 * Usage:
 * amorph.enableReactor('sort', {
 *   mode: 'alphabetical',
 *   order: 'asc',
 *   animate: true
 * });
 */

export class SortReactor {
  constructor(config = {}) {
    this.config = {
      mode: 'alphabetical',  // 'alphabetical' | 'relevance' | 'date' | 'custom'
      order: 'asc',           // 'asc' | 'desc'
      animate: true,
      duration: 400,
      comparator: null,       // Custom sort function
      ...config
    };
    
    this.appliedMorphs = new Set();
    this.originalOrder = new Map();
    
    console.log('[SortReactor] Initialized', this.config);
  }

  /**
   * Apply sorting to morphs
   */
  apply(morphs) {
    if (morphs.length === 0) return 0;
    
    // Store original positions for FLIP animation
    if (this.config.animate) {
      this.storePositions(morphs);
    }
    
    // Sort morphs array
    const sorted = this.sortMorphs([...morphs]);
    
    // Reorder in DOM
    const parent = morphs[0].parentElement;
    if (!parent) {
      console.warn('[SortReactor] No parent element found');
      return 0;
    }
    
    // Animate if enabled
    if (this.config.animate) {
      this.animateReorder(morphs, sorted, parent);
    } else {
      sorted.forEach(morph => parent.appendChild(morph));
    }
    
    sorted.forEach(morph => this.appliedMorphs.add(morph));
    
    console.log(`[SortReactor] Sorted ${morphs.length} morphs by ${this.config.mode}`);
    return morphs.length;
  }

  /**
   * Cleanup sorting (restore original order)
   */
  cleanup(morphs) {
    if (morphs.length === 0) return 0;
    
    const parent = morphs[0].parentElement;
    if (!parent) return 0;
    
    // Restore original order
    const sorted = [...morphs].sort((a, b) => {
      const orderA = this.originalOrder.get(a) ?? 0;
      const orderB = this.originalOrder.get(b) ?? 0;
      return orderA - orderB;
    });
    
    if (this.config.animate) {
      this.animateReorder(morphs, sorted, parent);
    } else {
      sorted.forEach(morph => parent.appendChild(morph));
    }
    
    morphs.forEach(morph => {
      this.appliedMorphs.delete(morph);
      this.originalOrder.delete(morph);
    });
    
    console.log(`[SortReactor] Restored original order for ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Sort morphs based on config
   */
  sortMorphs(morphs) {
    const comparator = this.getComparator();
    const sorted = morphs.sort(comparator);
    
    // Reverse if descending order
    if (this.config.order === 'desc') {
      sorted.reverse();
    }
    
    return sorted;
  }

  /**
   * Get sort comparator function
   */
  getComparator() {
    // Custom comparator
    if (this.config.comparator) {
      return this.config.comparator;
    }
    
    // Built-in comparators
    switch (this.config.mode) {
      case 'alphabetical':
        return (a, b) => {
          const nameA = this.getMorphName(a).toLowerCase();
          const nameB = this.getMorphName(b).toLowerCase();
          return nameA.localeCompare(nameB);
        };
      
      case 'relevance':
        return (a, b) => {
          const scoreA = this.amorph.state.searchScores.get(a) ?? 0;
          const scoreB = this.amorph.state.searchScores.get(b) ?? 0;
          return scoreB - scoreA; // Higher score first
        };
      
      case 'date':
        return (a, b) => {
          const dateA = this.getMorphDate(a);
          const dateB = this.getMorphDate(b);
          return dateB - dateA; // Newer first
        };
      
      default:
        return (a, b) => 0; // No sorting
    }
  }

  /**
   * Get morph name for alphabetical sorting
   */
  getMorphName(morph) {
    // Check for name-morph
    if (morph.tagName.toLowerCase() === 'name-morph') {
      return morph.textContent || '';
    }
    
    // Check data attribute
    if (morph.dataset.morphName) {
      return morph.dataset.morphName;
    }
    
    // Fallback to text content
    return morph.textContent || '';
  }

  /**
   * Get morph date for date sorting
   */
  getMorphDate(morph) {
    // Check data attribute
    if (morph.dataset.morphDate) {
      return new Date(morph.dataset.morphDate);
    }
    
    // Check for date in content
    const dateMatch = morph.textContent?.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return new Date(dateMatch[0]);
    }
    
    return new Date(0); // Epoch fallback
  }

  /**
   * Store original positions for FLIP animation
   */
  storePositions(morphs) {
    morphs.forEach((morph, index) => {
      if (!this.originalOrder.has(morph)) {
        this.originalOrder.set(morph, index);
      }
      const rect = morph.getBoundingClientRect();
      morph.dataset.sortX = rect.left;
      morph.dataset.sortY = rect.top;
    });
  }

  /**
   * Animate reordering using FLIP technique
   * (First, Last, Invert, Play)
   */
  animateReorder(oldOrder, newOrder, parent) {
    // FIRST: Store initial positions
    const first = new Map();
    oldOrder.forEach(morph => {
      const rect = morph.getBoundingClientRect();
      first.set(morph, { x: rect.left, y: rect.top });
    });
    
    // LAST: Move to new positions
    newOrder.forEach(morph => parent.appendChild(morph));
    
    const last = new Map();
    newOrder.forEach(morph => {
      const rect = morph.getBoundingClientRect();
      last.set(morph, { x: rect.left, y: rect.top });
    });
    
    // INVERT: Calculate deltas
    newOrder.forEach(morph => {
      const f = first.get(morph);
      const l = last.get(morph);
      if (!f || !l) return;
      
      const deltaX = f.x - l.x;
      const deltaY = f.y - l.y;
      
      // Apply invert transform
      morph.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      morph.style.transition = 'none';
    });
    
    // PLAY: Animate to final position
    requestAnimationFrame(() => {
      newOrder.forEach(morph => {
        morph.style.transition = `transform ${this.config.duration}ms ease-out`;
        morph.style.transform = '';
      });
      
      // Cleanup after animation
      setTimeout(() => {
        newOrder.forEach(morph => {
          morph.style.transition = '';
          morph.style.transform = '';
        });
      }, this.config.duration);
    });
  }
}

export default SortReactor;
