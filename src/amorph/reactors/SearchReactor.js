/**
 * 🔍 SEARCH REACTOR
 * 
 * Filtert und highlighted Morphs basierend auf Search Query
 * Nutzt Weighted Search aus amorph.config.js
 * 
 * Features:
 * - Weighted Search (tag: 100, name: 50, description: 10)
 * - Fuzzy Matching
 * - Highlight Matched Text
 * - Hide/Show Morphs
 * - Performance-optimiert
 */

import { amorph } from '../arch/AmorphSystem.js';

export class SearchReactor {
  constructor(config = {}) {
    this.config = {
      minScore: 0,
      fuzzy: true,
      highlight: true,
      hideUnmatched: false,
      debounce: 150,
      ...config
    };
    
    this.morphs = new Set();
    this.styleElement = null;
    this.enabled = false;
    this.debounceTimer = null;
  }
  
  /**
   * Apply Reactor
   */
  apply(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    this.enabled = true;
    this.injectStyles();
    
    morphElements.forEach(morph => {
      this.morphs.add(morph);
    });
    
    this.setupEventListeners();
    
    // Initial Search wenn Query existiert
    const currentQuery = amorph.state.searchQuery;
    if (currentQuery) {
      this.performSearch(currentQuery);
    }
    
    console.log(`[SearchReactor] Applied to ${morphElements.length} morphs`);
  }
  
  /**
   * Cleanup Reactor
   */
  cleanup(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    morphElements.forEach(morph => {
      this.resetMorph(morph);
      this.morphs.delete(morph);
    });
    
    this.removeEventListeners();
    this.removeStyles();
    this.enabled = false;
    
    console.log(`[SearchReactor] Cleaned up from ${morphElements.length} morphs`);
  }
  
  /**
   * Perform Search mit Scoring
   */
  performSearch(query) {
    if (!query || query.trim() === '') {
      this.resetAllMorphs();
      return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    
    this.morphs.forEach(morph => {
      const score = this.calculateScore(morph, normalizedQuery);
      results.push({ morph, score });
    });
    
    // Apply Results
    results.forEach(({ morph, score }) => {
      if (score > this.config.minScore) {
        this.showMorph(morph, score);
        if (this.config.highlight) {
          this.highlightMorph(morph, normalizedQuery);
        }
      } else {
        if (this.config.hideUnmatched) {
          this.hideMorph(morph);
        } else {
          this.dimMorph(morph);
        }
      }
    });
    
    // Emit Event
    amorph.emit('search:completed', {
      query,
      totalResults: results.filter(r => r.score > this.config.minScore).length,
      totalMorphs: this.morphs.size
    });
  }
  
  /**
   * Calculate Search Score
   */
  calculateScore(morph, query) {
    let score = 0;
    const weights = amorph.config.search.weights;
    
    // Tags (100 Punkte)
    const tags = morph.dataset.tags || '';
    if (tags.toLowerCase().includes(query)) {
      score += weights.tag;
    }
    
    // Name (50 Punkte)
    const morphType = morph.dataset.morphType;
    if (morphType === 'name') {
      // Check Shadow DOM content
      const shadowRoot = morph.shadowRoot;
      const textContent = shadowRoot ? 
        (shadowRoot.textContent || '') : 
        (morph.textContent || '');
      if (textContent.toLowerCase().includes(query)) {
        score += weights.name;
      }
    }
    
    // Text/Description (10 Punkte)
    if (morphType === 'text') {
      // Check Shadow DOM content
      const shadowRoot = morph.shadowRoot;
      const textContent = shadowRoot ? 
        (shadowRoot.textContent || '') : 
        (morph.textContent || '');
      if (textContent.toLowerCase().includes(query)) {
        score += weights.description;
      }
    }
    
    // Fuzzy Matching (Bonus)
    if (this.config.fuzzy && score === 0) {
      const shadowRoot = morph.shadowRoot;
      const morphText = shadowRoot ? 
        (shadowRoot.textContent || '') : 
        (morph.textContent || '');
      
      const allText = [
        tags,
        morphText,
        morph.dataset.morphId || ''
      ].join(' ').toLowerCase();
      
      if (this.fuzzyMatch(allText, query)) {
        score += 5; // Small bonus
      }
    }
    
    return score;
  }
  
  /**
   * Fuzzy Matching
   */
  fuzzyMatch(text, query) {
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  }
  
  /**
   * Show Morph
   */
  showMorph(morph, score) {
    morph.classList.remove('reactor-search-hidden', 'reactor-search-dimmed');
    morph.classList.add('reactor-search-matched');
    morph.style.setProperty('--search-score', score);
    morph.style.removeProperty('display');
  }
  
  /**
   * Hide Morph
   */
  hideMorph(morph) {
    morph.classList.remove('reactor-search-matched', 'reactor-search-dimmed');
    morph.classList.add('reactor-search-hidden');
    morph.style.display = 'none';
  }
  
  /**
   * Dim Morph
   */
  dimMorph(morph) {
    morph.classList.remove('reactor-search-matched', 'reactor-search-hidden');
    morph.classList.add('reactor-search-dimmed');
    morph.style.removeProperty('display');
  }
  
  /**
   * Highlight Matched Text
   */
  highlightMorph(morph, query) {
    // Simple Highlight via CSS Class
    morph.classList.add('reactor-search-highlight');
    
    // TODO: Für komplexeres Text-Highlighting könnte man hier
    // den textContent parsen und <mark> Tags einfügen
    // Aber das würde Shadow DOM erfordern oder innerHTML-Manipulation
  }
  
  /**
   * Reset Single Morph
   */
  resetMorph(morph) {
    morph.classList.remove(
      'reactor-search-matched',
      'reactor-search-hidden',
      'reactor-search-dimmed',
      'reactor-search-highlight'
    );
    morph.style.removeProperty('--search-score');
    morph.style.removeProperty('display');
  }
  
  /**
   * Reset All Morphs
   */
  resetAllMorphs() {
    this.morphs.forEach(morph => {
      this.resetMorph(morph);
    });
  }
  
  /**
   * Inject Styles
   */
  injectStyles() {
    if (this.styleElement) return;
    
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'search-reactor-styles';
    this.styleElement.textContent = `
      .reactor-search-matched {
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 1;
      }
      
      .reactor-search-dimmed {
        opacity: 0.3;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .reactor-search-hidden {
        display: none !important;
      }
      
      .reactor-search-highlight {
        position: relative;
      }
      
      .reactor-search-highlight::after {
        content: '';
        position: absolute;
        inset: -4px;
        background: rgba(59, 130, 246, 0.1);
        border: 2px solid rgba(59, 130, 246, 0.4);
        border-radius: 8px;
        pointer-events: none;
        animation: search-highlight-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes search-highlight-pulse {
        0%, 100% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }
  
  /**
   * Remove Styles
   */
  removeStyles() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  
  /**
   * Setup Event Listeners
   */
  setupEventListeners() {
    this.handleSearchInput = this.onSearchInput.bind(this);
    amorph.on('search:input', this.handleSearchInput);
  }
  
  /**
   * Remove Event Listeners
   */
  removeEventListeners() {
    if (this.handleSearchInput) {
      amorph.off('search:input', this.handleSearchInput);
    }
  }
  
  /**
   * Handler: Search Input with Debounce
   */
  onSearchInput(data) {
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      this.performSearch(data.query);
    }, this.config.debounce);
  }
  
  /**
   * Update Config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Cleanup
   */
  destroy() {
    this.cleanup(Array.from(this.morphs));
    this.morphs.clear();
    clearTimeout(this.debounceTimer);
  }
}
