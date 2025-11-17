/**
 * 🔍 ASTRO DATA SEARCH REACTOR
 * 
 * Durchsucht Rohdaten die in Astro-Seiten gesetzt werden
 * Komplementär zu SearchReactor (der nur Morphs durchsucht)
 * 
 * Features:
 * - Durchsucht fungus-data Attribute ALLER Elemente
 * - Berücksichtigt auch nicht-gerenderte Daten
 * - Container-basiertes Hiding/Showing
 * - Perspective Auto-Detection
 * - Weighted Scoring basierend auf Datenfeldern
 */

import { amorph } from '../arch/AmorphSystem.js';

export class AstroDataSearchReactor {
  constructor(config = {}) {
    this.config = {
      minScore: 0,
      debounce: 150,
      hideUnmatched: true,
      fieldWeights: {
        // Highest priority - Names
        'commonName': 100,
        'scientificName': 100,
        'name': 100,
        
        // High priority - Taxonomy
        'genus': 90,
        'family': 90,
        'species': 90,
        'tags': 100,
        
        // Medium-high priority
        'edibility': 70,
        'toxicityLevel': 70,
        'medicinalProperties': 60,
        'activeCompounds': 60,
        'primaryCompounds': 60,
        'secondaryMetabolites': 60,
        'flavorProfile': 50,
        'substrate': 50,
        'habitat': 50,
        
        // Lower priority fields
        'description': 30,
        'notes': 30,
        'default': 20  // For any unlisted field
      },
      ...config
    };
    
    this.containers = new Set();
    this.enabled = false;
    this.debounceTimer = null;
    
    // Field to perspective mapping (same as SearchReactor)
    this.fieldToPerspectiveMap = {
      'primaryCompounds': 'chemicalAndProperties',
      'secondaryMetabolites': 'chemicalAndProperties',
      'enzymeActivity': 'chemicalAndProperties',
      'nutritionalValue': 'culinaryAndNutritional',
      'flavorProfile': 'culinaryAndNutritional',
      'preparationMethods': 'culinaryAndNutritional',
      'cultivationDifficulty': 'cultivationAndProcessing',
      'substratePreferences': 'cultivationAndProcessing',
      'cultivationMethods': 'cultivationAndProcessing',
      'medicinalProperties': 'medicinalAndHealth',
      'activeCompounds': 'medicinalAndHealth',
      'therapeuticApplications': 'medicinalAndHealth',
      'activeResearchAreas': 'researchAndInnovation',
      'innovativeApplications': 'researchAndInnovation',
      'substrate': 'ecologyAndHabitat',
      'seasonality': 'ecologyAndHabitat',
      'primarySeason': 'ecologyAndHabitat',
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
      'genus': 'taxonomy',
      'commercialValue': 'commercialAndMarket',
      'marketSegments': 'commercialAndMarket',
      'ecologicalRole': 'environmentalAndConservation',
      'ecosystemServices': 'environmentalAndConservation',
      'historicalSignificance': 'culturalAndHistorical',
      'firstDocumented': 'culturalAndHistorical'
    };
  }
  
  /**
   * Apply Reactor - finds all containers with fungus-data
   */
  apply(containerElements) {
    if (!containerElements || containerElements.length === 0) return;
    
    this.enabled = true;
    
    containerElements.forEach(container => {
      this.containers.add(container);
    });
    
    this.setupEventListeners();
    
    // Initial search if query exists
    const currentQuery = amorph.state.searchQuery;
    if (currentQuery) {
      this.performSearch(currentQuery);
    }
    
    console.log(`[AstroDataSearchReactor] Applied to ${containerElements.length} containers`);
  }
  
  /**
   * Setup Event Listeners
   */
  setupEventListeners() {
    console.log('[AstroDataSearchReactor] Setting up event listeners...');
    
    this.searchHandler = (event) => {
      console.log('[AstroDataSearchReactor] 🔍 Received search:input event:', event);
      // Event structure is { query: 'text' }, not { detail: { query: 'text' } }
      const query = event.query || event.detail?.query || '';
      console.log(`[AstroDataSearchReactor] 📝 Query extracted: "${query}"`);
      
      clearTimeout(this.debounceTimer);
      console.log(`[AstroDataSearchReactor] ⏰ Debounce timer set (${this.config.debounce}ms)`);
      this.debounceTimer = setTimeout(() => {
        console.log(`[AstroDataSearchReactor] ⏰ Debounce timer fired, calling performSearch...`);
        this.performSearch(query);
      }, this.config.debounce);
    };
    
    // Listen to the same event as SearchReactor
    amorph.on('search:input', this.searchHandler);
    console.log('[AstroDataSearchReactor] ✅ Event listener registered for search:input');
  }
  
  /**
   * Remove Event Listeners
   */
  removeEventListeners() {
    if (this.searchHandler) {
      amorph.off('search:input', this.searchHandler);
    }
  }
  
  /**
   * Cleanup Reactor
   */
  cleanup(containerElements) {
    if (!containerElements || containerElements.length === 0) return;
    
    containerElements.forEach(container => {
      this.resetContainer(container);
      this.containers.delete(container);
    });
    
    this.removeEventListeners();
    this.enabled = false;
    
    console.log(`[AstroDataSearchReactor] Cleaned up from ${containerElements.length} containers`);
  }
  
  /**
   * Reset container visibility
   */
  resetContainer(container) {
    container.style.removeProperty('display');
    container.classList.remove('reactor-astro-search-hidden');
  }
  
  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    // Try direct key first
    if (obj[path] !== undefined) {
      return obj[path];
    }
    
    // Try dot notation
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
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
   * Extract all data-morph elements and their fungus-data from a container
   */
  extractFungusData(container) {
    const dataMorphs = container.querySelectorAll('[fungus-data]');
    const allData = [];
    
    console.log('[AstroDataSearchReactor] Extracting fungus data from container:', {
      totalDataMorphs: dataMorphs.length
    });
    
    dataMorphs.forEach(morph => {
      const fungusDataAttr = morph.getAttribute('fungus-data');
      const field = morph.getAttribute('field');
      
      if (fungusDataAttr) {
        try {
          const fungusData = JSON.parse(fungusDataAttr);
          allData.push({
            element: morph,
            field,
            data: fungusData
          });
        } catch (e) {
          console.warn('[AstroDataSearchReactor] Failed to parse fungus-data:', e);
        }
      }
    });
    
    console.log('[AstroDataSearchReactor] Extracted data objects:', allData.length);
    return allData;
  }
  
  /**
   * Extract visible text content from container (taxonomy badges, headers, etc.)
   */
  extractVisibleText(container) {
    const textData = {};
    
    // Extract taxonomy badges
    const taxonomyValues = container.querySelectorAll('.taxonomy-value');
    if (taxonomyValues.length > 0) {
      textData.taxonomy = Array.from(taxonomyValues).map(el => el.textContent.trim());
      console.log('[AstroDataSearchReactor] Found taxonomy values:', textData.taxonomy);
    }
    
    // Extract any other visible text that's not in morphs
    const taxonomyLabels = container.querySelectorAll('.taxonomy-label');
    if (taxonomyLabels.length > 0) {
      const taxonomyPairs = {};
      taxonomyLabels.forEach((label, i) => {
        const key = label.textContent.trim().toLowerCase();
        const value = taxonomyValues[i]?.textContent.trim();
        if (value) {
          taxonomyPairs[key] = value;
        }
      });
      textData.taxonomyPairs = taxonomyPairs;
    }
    
    return textData;
  }
  
  /**
   * Check if query matches at word boundary
   */
  matchesWord(text, query) {
    if (!text || !query) return false;
    
    const lowerText = String(text).toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    // Exact match or word start match
    const wordBoundaryRegex = new RegExp(`\\b${lowerQuery}`, 'i');
    if (wordBoundaryRegex.test(lowerText)) return true;
    
    // Fallback: Contains match (only for queries 3+ chars)
    if (query.length >= 3 && lowerText.includes(lowerQuery)) return true;
    
    return false;
  }
  
  /**
   * Search through all nested object properties
   */
  searchInObject(obj, query, path = '', matchedFields = new Set()) {
    let score = 0;
    
    if (!obj || typeof obj !== 'object') return { score: 0, matchedFields };
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Get weight for this field
      const fieldWeight = this.config.fieldWeights[key] || this.config.fieldWeights.default;
      
      // Check if field name matches query
      if (this.matchesWord(key, query)) {
        score += fieldWeight * 0.5; // 50% weight for field name match
        matchedFields.add(currentPath);
      }
      
      // Check value
      if (value === null || value === undefined) continue;
      
      if (Array.isArray(value)) {
        // Search in array elements
        value.forEach(item => {
          if (typeof item === 'string' || typeof item === 'number') {
            if (this.matchesWord(String(item), query)) {
              score += fieldWeight;
              matchedFields.add(currentPath);
            }
          } else if (typeof item === 'object') {
            const nestedResult = this.searchInObject(item, query, currentPath, matchedFields);
            score += nestedResult.score;
          }
        });
      } else if (typeof value === 'object') {
        // Recursively search nested objects
        const nestedResult = this.searchInObject(value, query, currentPath, matchedFields);
        score += nestedResult.score;
      } else {
        // Primitive value - check match
        if (this.matchesWord(String(value), query)) {
          score += fieldWeight;
          matchedFields.add(currentPath);
        }
      }
    }
    
    return { score, matchedFields };
  }
  
  /**
   * Extract perspectives from matched fields
   */
  extractPerspectives(matchedFields) {
    const perspectives = new Set();
    
    matchedFields.forEach(fieldPath => {
      // Check if field path starts with a perspective
      const firstPart = fieldPath.split('.')[0];
      if (this.fieldToPerspectiveMap[firstPart]) {
        perspectives.add(this.fieldToPerspectiveMap[firstPart]);
      }
      
      // Also check the full path for direct mapping
      const lastPart = fieldPath.split('.').pop();
      if (this.fieldToPerspectiveMap[lastPart]) {
        perspectives.add(this.fieldToPerspectiveMap[lastPart]);
      }
    });
    
    return Array.from(perspectives);
  }
  
  /**
   * Perform Search on all containers
   */
  performSearch(query) {
    console.log(`[AstroDataSearchReactor] 🚀 performSearch() called with query: "${query}"`);
    
    if (!query || query.trim() === '') {
      console.log('[AstroDataSearchReactor] Empty query - resetting all containers');
      this.resetAllContainers();
      return;
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      console.log('[AstroDataSearchReactor] Query too short (<2 chars) - resetting all containers');
      this.resetAllContainers();
      return;
    }
    
    const normalizedQuery = trimmedQuery.toLowerCase();
    const results = [];
    const allMatchedPerspectives = new Set();
    const perspectiveMatchCounts = {};
    
    console.log(`[AstroDataSearchReactor] 🔍 Performing search for: "${query}"`);
    console.log(`[AstroDataSearchReactor] Total containers to search: ${this.containers.size}`);
    
    this.containers.forEach((container, index) => {
      console.log(`[AstroDataSearchReactor] --- Container ${index + 1} ---`);
      
      // Extract all fungus data from this container
      const fungusDataList = this.extractFungusData(container);
      
      let containerScore = 0;
      const containerMatchedFields = new Set();
      
      // Search through each fungus-data object
      fungusDataList.forEach(({ data, field }) => {
        const searchResult = this.searchInObject(data, normalizedQuery, '', new Set());
        if (searchResult.score > 0) {
          console.log(`[AstroDataSearchReactor] Found match in fungus-data:`, {
            field,
            score: searchResult.score,
            matchedFields: Array.from(searchResult.matchedFields)
          });
        }
        containerScore += searchResult.score;
        
        // Merge matched fields
        searchResult.matchedFields.forEach(f => containerMatchedFields.add(f));
      });
      
      // ALSO search visible text content (taxonomy badges, etc.)
      const visibleText = this.extractVisibleText(container);
      console.log('[AstroDataSearchReactor] Visible text:', visibleText);
      
      if (visibleText.taxonomy) {
        console.log('[AstroDataSearchReactor] Checking taxonomy values against query:', {
          taxonomyValues: visibleText.taxonomy,
          query: normalizedQuery
        });
        
        visibleText.taxonomy.forEach(text => {
          const matches = this.matchesWord(text, normalizedQuery);
          console.log(`[AstroDataSearchReactor] Taxonomy "${text}" matches "${normalizedQuery}"? ${matches}`);
          
          if (matches) {
            containerScore += 80; // High score for taxonomy match
            containerMatchedFields.add('taxonomy.visible');
            allMatchedPerspectives.add('taxonomy');
            console.log('[AstroDataSearchReactor] ✅ MATCH FOUND in taxonomy!');
          }
        });
      }
      
      console.log(`[AstroDataSearchReactor] Container ${index + 1} final score: ${containerScore}`);
      
      // Extract perspectives from matched fields
      const perspectives = this.extractPerspectives(containerMatchedFields);
      perspectives.forEach(p => {
        allMatchedPerspectives.add(p);
        perspectiveMatchCounts[p] = (perspectiveMatchCounts[p] || 0) + 1;
      });
      
      results.push({
        container,
        score: containerScore,
        matchedFields: Array.from(containerMatchedFields),
        perspectives
      });
    });
    
    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    // Debug logging for specific queries
    if (normalizedQuery.includes('beauveria') || normalizedQuery.includes('bassiana')) {
      console.log('[AstroDataSearchReactor] Debug search for "' + query + '":', {
        totalContainers: this.containers.size,
        resultsWithScores: results.map(r => ({
          score: r.score,
          matchedFields: r.matchedFields,
          perspectives: r.perspectives,
          hasVisibleTaxonomy: r.container.querySelector('.taxonomy-value')?.textContent
        }))
      });
    }
    
    // Apply filtering
    results.forEach(({ container, score }, index) => {
      if (score > this.config.minScore) {
        container.style.removeProperty('display');
        container.classList.remove('reactor-astro-search-hidden');
        console.log(`[AstroDataSearchReactor] ✅ Showing container ${index + 1} (score: ${score})`);
      } else {
        if (this.config.hideUnmatched) {
          container.style.display = 'none';
          container.classList.add('reactor-astro-search-hidden');
          console.log(`[AstroDataSearchReactor] ❌ Hiding container ${index + 1} (score: ${score})`);
        } else {
          container.style.opacity = '0.3';
          console.log(`[AstroDataSearchReactor] 👻 Dimming container ${index + 1} (score: ${score})`);
        }
      }
    });
    
    // Emit search results for coordination with SearchReactor
    amorph.streamPublish('astro-search:completed', {
      query,
      totalResults: results.filter(r => r.score > this.config.minScore).length,
      totalContainers: this.containers.size,
      matchedPerspectives: Array.from(allMatchedPerspectives),
      perspectiveMatchCounts
    });
    
    console.log(`[AstroDataSearchReactor] Found ${results.filter(r => r.score > this.config.minScore).length} matching containers of ${this.containers.size} total`);
  }
  
  /**
   * Reset all containers
   */
  resetAllContainers() {
    this.containers.forEach(container => {
      this.resetContainer(container);
    });
  }
}

// Export singleton instance
export const astroDataSearchReactor = new AstroDataSearchReactor();
