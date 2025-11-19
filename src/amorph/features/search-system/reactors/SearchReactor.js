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

import { amorph } from '../../../core/AmorphSystem.js';

export class SearchReactor {
  constructor(config = {}) {
    this.config = {
      minScore: 0,
      fuzzy: true,
      highlight: true,
      hideUnmatched: true,
      debounce: 150,
      ...config
    };
    
    this.morphs = new Set();
    this.styleElement = null;
    this.enabled = false;
    this.debounceTimer = null;
    
    // Field to perspective mapping for auto-switching
    this.fieldToPerspectiveMap = {
      'primaryCompounds': 'chemicalAndProperties',
      'secondaryMetabolites': 'chemicalAndProperties',
      'enzymeActivity': 'chemicalAndProperties',
      'nutritionalValue': 'culinaryAndNutritional',
      'flavorProfile': 'culinaryAndNutritional',
      'preparationMethods': 'culinaryAndNutritional',
      'cultivationDifficulty': 'cultivationAndProcessing',
      'substratePreferences': 'cultivationAndProcessing',
      'medicinalProperties': 'medicinalAndHealth',
      'activeCompounds': 'medicinalAndHealth',
      'therapeuticApplications': 'medicinalAndHealth',
      'activeResearchAreas': 'researchAndInnovation',
      'innovativeApplications': 'researchAndInnovation',
      'substrate': 'ecologyAndHabitat',
      'seasonality': 'ecologyAndHabitat',
      'habitat': 'ecologyAndHabitat',
      'edibility': 'safetyAndIdentification',
      'toxicityLevel': 'safetyAndIdentification',
      'capColor': 'physicalCharacteristics',
      'sporePrintColor': 'physicalCharacteristics',
      'kingdom': 'taxonomy',
      'phylum': 'taxonomy',
      'class': 'taxonomy',
      'order': 'taxonomy',
      'family': 'taxonomy',
      'genus': 'taxonomy'
    };
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
   * Get nested value from object using dot notation or direct key
   */
  getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    // Try direct key first (e.g., "secondaryMetabolites")
    if (obj[path] !== undefined) {
      return obj[path];
    }
    
    // Try dot notation (e.g., "chemicalAndProperties.secondaryMetabolites")
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      // Check if value is valid before accessing
      if (!value || typeof value !== 'object') {
        return null;
      }
      
      if (key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return value;
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
    
    // Minimum query length: 2 characters to avoid over-matching
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      this.resetAllMorphs();
      return;
    }
    
    const normalizedQuery = trimmedQuery.toLowerCase();
    const results = [];
    const matchedPerspectives = new Set();
    const perspectiveMatchCounts = {};
    
    this.morphs.forEach(morph => {
      const score = this.calculateScore(morph, normalizedQuery);
      results.push({ morph, score });
      
      // Collect matched perspectives for auto-switching and header marking
      if (score > this.config.minScore && morph._matchedPerspective) {
        matchedPerspectives.add(morph._matchedPerspective);
      }
    });
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Group results by fungi container
    const containerMatches = new Map();
    
    results.forEach(({ morph, score }) => {
      // Find parent fungi container (fungus-card)
      const container = morph.closest('.fungus-card, article, [data-item]');
      
      if (container) {
        const currentScore = containerMatches.get(container) || 0;
        containerMatches.set(container, Math.max(currentScore, score));
        
        // Collect matched perspectives for containers with matches
        if (score > this.config.minScore && morph._matchedPerspective) {
          perspectiveMatchCounts[morph._matchedPerspective] = 
            (perspectiveMatchCounts[morph._matchedPerspective] || 0) + 1;
        }
      }
      
      // Highlight individual morphs with matches
      if (score > this.config.minScore) {
        if (this.config.highlight) {
          this.highlightMorph(morph, normalizedQuery);
        }
      } else {
        morph.classList.remove('reactor-search-highlight');
      }
    });
    
    // Collect all containers for filtering
    const allContainers = new Set();
    this.morphs.forEach(morph => {
      const container = morph.closest('.fungus-card, article, [data-item]');
      if (container) allContainers.add(container);
    });
    
    // Ensure all perspectives from perspectiveMatchCounts are in matchedPerspectives
    Object.keys(perspectiveMatchCounts).forEach(perspName => {
      matchedPerspectives.add(perspName);
    });
    
    // Store data for delayed filtering
    this._pendingContainerFiltering = {
      containerMatches,
      allContainers,
      query,
      totalResults: results.filter(r => r.score > this.config.minScore).length,
      matchedPerspectives: Array.from(matchedPerspectives),
      perspectiveMatchCounts
    };
    
    // Emit search:completed event FIRST - MorphHeader will auto-switch perspectives
    amorph.streamPublish('search:completed', {
      query,
      totalResults: results.filter(r => r.score > this.config.minScore).length,
      totalMorphs: this.morphs.size,
      matchedPerspectives: Array.from(matchedPerspectives),
      perspectiveMatchCounts // For header marking
    });
    
    // Apply container filtering after a delay to allow perspective switch
    // If perspectives need switching, this gives time for morphs to become visible
    setTimeout(() => {
      if (this._pendingContainerFiltering) {
        this.applyContainerFiltering(
          this._pendingContainerFiltering.containerMatches,
          this._pendingContainerFiltering.allContainers
        );
        this._pendingContainerFiltering = null;
      }
    }, matchedPerspectives.size > 0 ? 100 : 0);
  }
  
  /**
   * Apply container filtering based on match scores
   */
  applyContainerFiltering(containerMatches, allContainers) {
    allContainers.forEach(container => {
      const bestScore = containerMatches.get(container) || 0;
      
      // Check if AstroDataSearchReactor has hidden this container
      // If AstroDataSearchReactor has hidden it, respect that decision
      const astroDataHidden = container.classList.contains('reactor-astro-search-hidden');
      
      if (bestScore > this.config.minScore) {
        // Show container (SearchReactor found matches)
        // Only override if AstroDataSearchReactor hasn't explicitly hidden it
        if (!astroDataHidden) {
          container.style.removeProperty('display');
          container.classList.remove('reactor-search-hidden');
        }
      } else {
        // SearchReactor found no matches
        // Only hide if AstroDataSearchReactor hasn't explicitly shown it
        // (i.e., if the container doesn't have reactor-astro-search-hidden, Astro is showing it)
        if (!astroDataHidden) {
          // AstroDataSearchReactor is showing this container, so don't hide it
          // Remove any SearchReactor hiding
          container.classList.remove('reactor-search-hidden');
        } else {
          // AstroDataSearchReactor has hidden it, we can also hide it
          if (this.config.hideUnmatched) {
            container.style.display = 'none';
            container.classList.add('reactor-search-hidden');
          } else {
            container.style.opacity = '0.3';
          }
        }
      }
    });
  }
  
  /**
   * Auto-switch to perspectives with matches
   */
  autoSwitchPerspectives(perspectiveNames) {
    // Get MorphHeader to trigger perspective change
    const morphHeader = document.querySelector('morph-header');
    if (!morphHeader) return;
    
    // Map perspective names to full names
    const perspectiveMap = {
      'ecologyAndHabitat': 'ecologyAndHabitat',
      'safetyAndIdentification': 'safetyAndIdentification',
      'culinaryAndNutritional': 'culinaryAndNutritional',
      'medicinalAndHealth': 'medicinalAndHealth',
      'cultivationAndProcessing': 'cultivationAndProcessing',
      'physicalCharacteristics': 'physicalCharacteristics',
      'chemicalAndProperties': 'chemicalAndProperties',
      'culturalAndHistorical': 'culturalAndHistorical',
      'commercialAndMarket': 'commercialAndMarket',
      'environmentalAndConservation': 'environmentalAndConservation',
      'researchAndInnovation': 'researchAndInnovation',
      'taxonomy': 'taxonomy'
    };
    
    // Trigger perspective buttons programmatically
    const validPerspectives = perspectiveNames
      .map(name => perspectiveMap[name])
      .filter(Boolean);
    
    if (validPerspectives.length > 0) {
      // Emit event to activate perspectives
      window.dispatchEvent(new CustomEvent('search:activate-perspectives', {
        detail: { perspectives: validPerspectives }
      }));
    }
  }
  
  /**
   * Calculate Search Score
   */
  calculateScore(morph, query) {
    let score = 0;
    const weights = amorph.config.search.weights;
    const morphType = morph.dataset.morphType;
    
    // Get text content (works with Shadow DOM)
    const getTextContent = (element) => {
      if (element.shadowRoot) {
        return element.shadowRoot.textContent || '';
      }
      return element.textContent || '';
    };
    
    // Helper: Check if query matches at word boundary or as full word
    const matchesWord = (text, query) => {
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      // Exact match or word start match (higher relevance)
      const wordBoundaryRegex = new RegExp(`\\b${lowerQuery}`, 'i');
      if (wordBoundaryRegex.test(lowerText)) return true;
      
      // Fallback: Contains match (lower relevance, only for queries 3+ chars)
      if (query.length >= 3 && lowerText.includes(lowerQuery)) return true;
      
      return false;
    };
    
    // Tags (100 Punkte)
    const tags = morph.dataset.tags || '';
    if (matchesWord(tags, query)) {
      score += weights.tag;
    }
    
    // Name (50 Punkte)
    if (morphType === 'name') {
      const textContent = getTextContent(morph);
      if (matchesWord(textContent, query)) {
        score += weights.name;
      }
    }
    
    // Text/Description (10 Punkte)
    if (morphType === 'text') {
      const textContent = getTextContent(morph);
      if (matchesWord(textContent, query)) {
        score += weights.description;
      }
    }
    
    // DataMorph (30 Punkte) - Use word boundary matching
    if (morphType === 'data') {
      // Get text content from rendered DOM OR from fungus-data attribute
      let textContent = getTextContent(morph);
      
      // If no textContent (morph not rendered yet), try fungus-data attribute
      if (!textContent || textContent.trim().length === 0) {
        const fungusDataAttr = morph.getAttribute('fungus-data');
        const fieldName = morph.getAttribute('field') || '';
        
        // Debug for peptide searches
        if (query.includes('peptid') && fieldName === 'secondaryMetabolites') {
          console.log('[SearchReactor] Checking peptide in secondaryMetabolites:', {
            hasTextContent: !!textContent,
            hasFungusData: !!fungusDataAttr,
            fieldName,
            morphId: morph.dataset.morphId
          });
        }
        
        if (fungusDataAttr && fieldName) {
          try {
            if (query.includes('peptid') && fieldName === 'secondaryMetabolites') {
              console.log('[SearchReactor] Attempting to parse fungus-data:', {
                fieldName,
                attrLength: fungusDataAttr.length,
                attrPreview: fungusDataAttr.substring(0, 100)
              });
            }
            const fungusData = JSON.parse(fungusDataAttr);
            
            // Build full path using fieldToPerspectiveMap if needed
            // Only map if field doesn't already contain a dot (i.e., not already a full path)
            let fullPath = fieldName;
            if (!fieldName.includes('.') && this.fieldToPerspectiveMap[fieldName]) {
              fullPath = `${this.fieldToPerspectiveMap[fieldName]}.${fieldName}`;
            }
            
            if (query.includes('peptid') && fieldName === 'secondaryMetabolites') {
              console.log('[SearchReactor] Field mapping:', {
                fieldName,
                fullPath,
                hasFungusData: !!fungusData,
                fungusDataKeys: Object.keys(fungusData || {}),
                chemicalAndProperties: fungusData?.chemicalAndProperties,
                secondaryMetabolites: fungusData?.chemicalAndProperties?.secondaryMetabolites
              });
            }
            
            // Navigate through nested object to find field value
            const fieldValue = this.getNestedValue(fungusData, fullPath);
            
            if (query.includes('peptid') && fieldName === 'secondaryMetabolites') {
              console.log('[SearchReactor] getNestedValue result:', {
                fieldValue,
                isArray: Array.isArray(fieldValue)
              });
            }
            
            if (fieldValue !== null && fieldValue !== undefined) {
              textContent = Array.isArray(fieldValue) 
                ? fieldValue.join(', ') 
                : String(fieldValue);
                
              if (query.includes('peptid') && fieldName === 'secondaryMetabolites') {
                console.log('[SearchReactor] Converted textContent:', textContent);
              }
            }
          } catch (e) {
            if (query.includes('peptid')) {
              console.error('[SearchReactor] Failed to parse fungus-data:', e);
            }
          }
        }
      }
      
      const fieldName = morph.getAttribute('field') || '';
      
      // Extract perspective from field name FIRST (before scoring)
      let perspectiveName = null;
      if (fieldName.includes('.')) {
        // Field has perspective prefix (e.g., "chemicalAndProperties.compounds")
        perspectiveName = fieldName.split('.')[0];
      } else {
        // Try to infer perspective from field name using instance property
        perspectiveName = this.fieldToPerspectiveMap[fieldName] || null;
      }
      
      // Search in data values (with word boundary)
      if (matchesWord(textContent, query)) {
        score += 30;
        // Store matched perspective if we have a match
        if (perspectiveName && !morph._matchedPerspective) {
          morph._matchedPerspective = perspectiveName;
        }
      }
      
      // Search in field names (with word boundary)
      if (matchesWord(fieldName, query)) {
        score += 20;
        // Store matched perspective if we have a match
        if (perspectiveName && !morph._matchedPerspective) {
          morph._matchedPerspective = perspectiveName;
        }
      }
    }
    
    // Image Morph (alt text) - Use word boundary matching
    if (morphType === 'image') {
      const altText = morph.getAttribute('alt') || '';
      if (matchesWord(altText, query)) {
        score += 25;
      }
    }
    
    // Fuzzy Matching (Bonus) - only for queries 3+ chars
    if (this.config.fuzzy && score === 0 && query.length >= 3) {
      const morphText = getTextContent(morph);
      const allText = [
        tags,
        morphText,
        morph.dataset.morphId || '',
        morph.getAttribute('field') || '',
        morph.getAttribute('alt') || ''
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
    // Note: Complex text highlighting would require Shadow DOM manipulation
    morph.classList.add('reactor-search-highlight');
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
    
    // Reset all containers
    const allContainers = new Set();
    this.morphs.forEach(morph => {
      const container = morph.closest('.fungus-card, article, [data-item]');
      if (container) allContainers.add(container);
    });
    
    allContainers.forEach(container => {
      container.style.removeProperty('display');
      container.style.removeProperty('opacity');
      container.classList.remove('reactor-search-hidden');
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
