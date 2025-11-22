/**
 * 🔍 CONVEX SEARCH REACTOR
 * =========================
 * 
 * Server-side search using Convex database
 * Replaces old SearchReactor + AstroDataSearchReactor
 * 
 * Features:
 * - Deep search in Convex (not DOM)
 * - Weighted scoring (server-side)
 * - Auto-perspective detection
 * - Re-renders Grid/Bubble with filtered results
 * - 300ms debounced for better UX
 * 
 * Flow:
 * 1. User types in MorphHeader search input
 * 2. ConvexSearchReactor catches 'search:query-changed' event
 * 3. Debounced fetch to /api/search
 * 4. Results come back from Convex
 * 5. Dispatch 'convex-search:completed' event
 * 6. GridHost/BubbleHost re-render with filtered data
 * 7. MorphHeader auto-activates matched perspectives
 */

import { amorph } from '../../../core/AmorphSystem.js';

export class ConvexSearchReactor {
  constructor(config = {}) {
    this.config = {
      debounce: 300,        // Longer debounce for API calls
      apiEndpoint: '/api/search',
      highlightResults: true,
      highlightColor: '#3b82f6',  // Blue highlight
      ...config
    };
    
    this.enabled = false;
    this.debounceTimer = null;
    this.currentQuery = '';
    this.abortController = null;
    
    // Cache last results
    this.lastResults = {
      results: [],
      scores: {},
      matchedPerspectives: {},
      totalResults: 0,
      query: ''
    };
  }
  
  /**
   * Apply Reactor
   */
  apply() {
    this.enabled = true;
    this.setupEventListeners();
    
    console.log('[ConvexSearchReactor] ✅ Enabled - listening for search events');
  }
  
  /**
   * Cleanup Reactor
   */
  cleanup() {
    this.enabled = false;
    this.removeEventListeners();
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    if (this.abortController) {
      this.abortController.abort();
    }
    
    console.log('[ConvexSearchReactor] 🛑 Disabled');
  }
  
  /**
   * Setup Event Listeners
   */
  setupEventListeners() {
    // Prevent duplicate listeners if already set up
    if (this.handleSearchChange) {
      console.log('[ConvexSearchReactor] ⚠️ Listeners already set up, skipping...');
      return;
    }
    
    // Listen for search input changes (via AMORPH event system)
    this.handleSearchChange = this.onSearchChange.bind(this);
    amorph.on('search:input', this.handleSearchChange);
    
    // Listen for perspective changes (might affect search results)
    this.handlePerspectiveChange = this.onPerspectiveChange.bind(this);
    amorph.on('perspectives:changed', this.handlePerspectiveChange);
    
    console.log('[ConvexSearchReactor] 👂 Listening to AMORPH events: search:input, perspectives:changed');
  }
  
  /**
   * Remove Event Listeners
   */
  removeEventListeners() {
    if (this.handleSearchChange) {
      amorph.off('search:input', this.handleSearchChange);
    }
    if (this.handlePerspectiveChange) {
      amorph.off('perspectives:changed', this.handlePerspectiveChange);
    }
  }
  
  /**
   * Handle search query change
   */
  onSearchChange(data) {
    // AMORPH events pass data directly, not wrapped in event.detail
    const query = data?.query || '';
    const trimmedQuery = query.trim();
    this.currentQuery = query;
    
    // Cancel previous debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Cancel previous fetch
    if (this.abortController) {
      this.abortController.abort();
    }
    
    // If query is empty, do NOTHING - no events, no resets, no data loading
    if (!trimmedQuery) {
      console.log('[ConvexSearchReactor] Empty query - no action');
      return;
    }
    
    // Debounced search for any non-empty query
    this.debounceTimer = setTimeout(() => {
      this.performSearch(trimmedQuery);
    }, this.config.debounce);
  }
  
  /**
   * Handle perspective change
   */
  onPerspectiveChange(data) {
    // AMORPH events pass data directly, not wrapped in event.detail
    // Could re-filter results based on active perspectives
    // For now, just log
    console.log('[ConvexSearchReactor] Perspectives changed:', data?.perspectives);
  }
  
  /**
   * Perform search via Convex API
   */
  async performSearch(query) {
    if (!query || !query.trim()) {
      console.log('[ConvexSearchReactor] Empty query in performSearch - skipping');
      return;
    }
    
    console.log(`[ConvexSearchReactor] 🔍 Searching for: "${query}"`);
    
    // Create abort controller for this request
    this.abortController = new AbortController();
    
    try {
      const startTime = performance.now();
      
      // Extract perspective names from perspective objects
      const activePerspectives = amorph.state?.activePerspectives || [];
      const perspectiveNames = activePerspectives.map(p => 
        typeof p === 'string' ? p : p.name || p
      );
      
      // Fetch from API
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          perspectives: perspectiveNames,
        }),
        signal: this.abortController.signal,
      });
      
      if (!response.ok) {
        throw new Error(`Search API returned ${response.status}`);
      }
      
      const searchResults = await response.json();
      const duration = performance.now() - startTime;
      
      // Cache results
      this.lastResults = searchResults;
      
      // matchedPerspectives is an object {perspectiveName: count}, not an array
      const matchedPerspectivesStr = searchResults.matchedPerspectives 
        ? Object.keys(searchResults.matchedPerspectives).join(', ')
        : 'none';
      const matchedFieldCount = Object.keys(searchResults.matchedFields || {}).length;
      console.log(`[ConvexSearchReactor] ✅ "${query}" → ${searchResults.totalResults} results in ${duration.toFixed(0)}ms | Perspectives: ${matchedPerspectivesStr} | Fields: ${matchedFieldCount} entities`);
      
      // Update AmorphSystem state
      if (amorph.state) {
        amorph.state.searchQuery = query;
        amorph.state.searchScores = new Map(
          Object.entries(searchResults.scores || {})
        );
      }
      
      // Dispatch event for GridHost/BubbleHost to re-render
      this.dispatchSearchComplete(searchResults);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[ConvexSearchReactor] Search aborted (newer search started)');
        return;
      }
      
      console.error('[ConvexSearchReactor] ❌ Search failed:', error);
      
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('convex-search:error', {
        detail: { error, query }
      }));
    }
  }
  
  /**
   * Reset search (show all results)
   * Only called programmatically when needed, not on every keystroke
   */
  resetSearch() {
    console.log('[ConvexSearchReactor] 🔄 Search reset');
    
    this.currentQuery = '';
    
    // Update AmorphSystem state
    if (amorph.state) {
      amorph.state.searchQuery = '';
      amorph.state.searchScores = new Map();
    }
    
    // Dispatch reset event
    window.dispatchEvent(new CustomEvent('convex-search:reset', {
      detail: { 
        timestamp: Date.now() 
      }
    }));
  }
  
  /**
   * Dispatch search complete event
   */
  dispatchSearchComplete(searchResults) {
    const event = new CustomEvent('convex-search:completed', {
      detail: {
        results: searchResults.results || [],
        scores: searchResults.scores || {},
        matchedFields: searchResults.matchedFields || {},
        matchedPerspectives: searchResults.matchedPerspectives || {},
        totalResults: searchResults.totalResults || 0,
        query: searchResults.query || this.currentQuery,
        highlightColor: this.config.highlightColor,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
    
    // Also dispatch legacy event for MorphHeader (auto-perspective switching)
    // Use AMORPH event system (amorph.emit) instead of window.dispatchEvent
    if (typeof amorph !== 'undefined') {
      amorph.emit('search:completed', {
        totalResults: searchResults.totalResults || 0,
        totalMorphs: searchResults.results?.length || 0,
        perspectiveMatchCounts: searchResults.matchedPerspectives || {},
        matchedPerspectives: Object.keys(searchResults.matchedPerspectives || {}), // Array of perspective names
        query: searchResults.query || this.currentQuery,
      });
    }
  }
  
  /**
   * Get current search results
   */
  getResults() {
    return this.lastResults;
  }
  
  /**
   * Check if search is active
   */
  isSearching() {
    return this.currentQuery.length >= this.config.minQueryLength;
  }
}

// Auto-register reactor
if (typeof window !== 'undefined' && window.amorph) {
  window.amorph.registerReactor('convex-search', ConvexSearchReactor);
  console.log('[ConvexSearchReactor] 📦 Registered with AmorphSystem');
}
