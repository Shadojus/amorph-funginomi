/**
 * 🧠 SESSION STATE MANAGER
 * ========================
 * 
 * Collects ALL user actions in browser storage and calculates
 * entity relevance using Hilbert space transformations.
 * 
 * This is the "memory" of the UserNode - it knows what the user
 * is interested in based on their behavior, not just search results.
 * 
 * Storage: sessionStorage (cleared on browser close) + localStorage (persistent)
 * 
 * Created: 26. November 2025
 */

// Debug mode - set to true for verbose logging
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('%c[SessionState]', 'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;', ...args);
  }
}

function debugTable(label, data) {
  if (DEBUG) {
    console.groupCollapsed(`%c[SessionState] ${label}`, 'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;');
    console.table(data);
    console.groupEnd();
  }
}

export class SessionStateManager {
  constructor(options = {}) {
    this.options = {
      storageKey: 'amorph_session_state',
      persistentKey: 'amorph_user_profile',
      maxActions: 500,          // Max actions to keep in memory
      maxSearches: 50,          // Max search queries to track
      maxEntities: 100,         // Max entities to track
      decayFactor: 0.95,        // Weight decay for older actions
      ...options
    };
    
    // Initialize state from storage
    this.state = this.loadState();
    
    // Bind event listeners
    this.setupEventListeners();
    
    debugLog('🧠 INITIALIZED');
    debugLog('📊 Session ID:', this.state.sessionId);
    debugLog('📝 Loaded actions:', this.state.actions.length);
    debugLog('🍄 Known entities:', Object.keys(this.state.entityInteractions).length);
    debugLog('🔍 Search history:', this.state.searches.length);
    debugLog('🎭 Perspective usage:', Object.keys(this.state.perspectiveUsage));
    
    // Expose to window for debugging
    if (typeof window !== 'undefined') {
      window.__sessionManager = this;
      debugLog('💡 Debug: Access via window.__sessionManager');
    }
  }
  
  /**
   * Load state from browser storage
   */
  loadState() {
    const defaultState = {
      // Session info
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      
      // Actions log (chronological)
      actions: [],
      
      // Aggregated entity interactions
      entityInteractions: {},  // slug -> { clicks, hovers, views, timeSpent, scrollDepth, lastSeen }
      
      // Search history
      searches: [],            // { query, timestamp, resultCount }
      
      // Perspective usage
      perspectiveUsage: {},    // perspectiveId -> { activations, totalTime }
      
      // Current state
      currentPerspectives: [],
      currentSearchQuery: '',
      
      // Calculated relevance scores (cached)
      relevanceScores: {},     // slug -> score
      lastCalculation: 0
    };
    
    try {
      // Load session state
      const sessionData = sessionStorage.getItem(this.options.storageKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        return { ...defaultState, ...parsed };
      }
      
      // Try persistent storage for returning users
      const persistentData = localStorage.getItem(this.options.persistentKey);
      if (persistentData) {
        const parsed = JSON.parse(persistentData);
        // Merge persistent profile with fresh session
        return {
          ...defaultState,
          entityInteractions: parsed.entityInteractions || {},
          perspectiveUsage: parsed.perspectiveUsage || {}
        };
      }
    } catch (error) {
      console.error('[SessionStateManager] Failed to load state:', error);
    }
    
    return defaultState;
  }
  
  /**
   * Save state to browser storage
   */
  saveState() {
    try {
      // Save full state to sessionStorage
      sessionStorage.setItem(
        this.options.storageKey,
        JSON.stringify(this.state)
      );
      
      // Save profile to localStorage (persistent across sessions)
      const profile = {
        entityInteractions: this.state.entityInteractions,
        perspectiveUsage: this.state.perspectiveUsage,
        lastVisit: Date.now()
      };
      localStorage.setItem(
        this.options.persistentKey,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('[SessionStateManager] Failed to save state:', error);
    }
  }
  
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Setup event listeners for automatic tracking
   */
  setupEventListeners() {
    // Search events
    window.addEventListener('search:input', (e) => {
      this.trackSearch(e.detail?.query);
    });
    
    window.addEventListener('convex-search:completed', (e) => {
      const { query, results } = e.detail || {};
      if (query) {
        this.trackSearch(query, results?.length || 0);
      }
    });
    
    // Perspective changes
    window.addEventListener('perspective-changed', (e) => {
      const perspectives = e.detail?.perspectives || [];
      this.trackPerspectiveChange(perspectives);
    });
    
    // Bubble clicks
    window.addEventListener('bubble:clicked', (e) => {
      const slug = e.detail?.slug;
      if (slug) {
        this.trackEntityClick(slug);
      }
    });
    
    // Card clicks in GridView
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.entity-card');
      if (card) {
        const slug = card.dataset.slug;
        if (slug) {
          this.trackEntityClick(slug);
        }
      }
    });
    
    // Page navigation (detail page visits)
    this.trackPageVisit();
    
    // Save state before page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
    
    // Periodic save (every 30 seconds)
    setInterval(() => this.saveState(), 30000);
  }
  
  /**
   * Track a generic action
   */
  trackAction(type, data = {}) {
    const action = {
      type,
      timestamp: Date.now(),
      ...data
    };
    
    this.state.actions.push(action);
    
    // Trim old actions if over limit
    if (this.state.actions.length > this.options.maxActions) {
      this.state.actions = this.state.actions.slice(-this.options.maxActions);
    }
    
    // Invalidate cache
    this.state.lastCalculation = 0;
    
    debugLog(`📌 ACTION: ${type}`, data);
    debugLog(`   Total actions: ${this.state.actions.length}`);
    
    // Emit event for real-time updates
    window.dispatchEvent(new CustomEvent('session:action-tracked', {
      detail: { action, totalActions: this.state.actions.length }
    }));
  }
  
  /**
   * Track search query
   */
  trackSearch(query, resultCount = null) {
    if (!query || query.length < 2) return;
    
    this.state.currentSearchQuery = query;
    
    // Add to searches history
    this.state.searches.push({
      query,
      timestamp: Date.now(),
      resultCount
    });
    
    // Trim old searches
    if (this.state.searches.length > this.options.maxSearches) {
      this.state.searches = this.state.searches.slice(-this.options.maxSearches);
    }
    
    debugLog(`🔍 SEARCH: "${query}"`, resultCount !== null ? `(${resultCount} results)` : '');
    
    this.trackAction('search', { query, resultCount });
  }
  
  /**
   * Track perspective change
   */
  trackPerspectiveChange(perspectives) {
    const perspectiveNames = perspectives.map(p => p.name || p);
    
    debugLog('🎭 PERSPECTIVE CHANGE:', perspectiveNames.join(', ') || '(none)');
    
    // Calculate time spent on previous perspectives
    const now = Date.now();
    if (this.state.currentPerspectives.length > 0 && this._lastPerspectiveTime) {
      const duration = now - this._lastPerspectiveTime;
      this.state.currentPerspectives.forEach(p => {
        if (!this.state.perspectiveUsage[p]) {
          this.state.perspectiveUsage[p] = { activations: 0, totalTime: 0 };
        }
        this.state.perspectiveUsage[p].totalTime += duration;
      });
    }
    
    // Update current perspectives
    this.state.currentPerspectives = perspectiveNames;
    this._lastPerspectiveTime = now;
    
    // Track activations
    perspectiveNames.forEach(p => {
      if (!this.state.perspectiveUsage[p]) {
        this.state.perspectiveUsage[p] = { activations: 0, totalTime: 0 };
      }
      this.state.perspectiveUsage[p].activations++;
    });
    
    this.trackAction('perspective_change', { perspectives: perspectiveNames });
  }
  
  /**
   * Track entity click/interaction
   */
  trackEntityClick(slug) {
    if (!slug) return;
    
    const isNew = !this.state.entityInteractions[slug];
    
    if (isNew) {
      this.state.entityInteractions[slug] = {
        clicks: 0,
        hovers: 0,
        views: 0,
        timeSpent: 0,
        scrollDepth: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };
    }
    
    this.state.entityInteractions[slug].clicks++;
    this.state.entityInteractions[slug].lastSeen = Date.now();
    
    const interaction = this.state.entityInteractions[slug];
    debugLog(`🖱️ CLICK: ${slug}`, isNew ? '(NEW entity)' : `(clicks: ${interaction.clicks})`);
    
    this.trackAction('entity_click', { slug });
  }
  
  /**
   * Track entity hover
   */
  trackEntityHover(slug, duration = 1000) {
    if (!slug) return;
    
    if (!this.state.entityInteractions[slug]) {
      this.state.entityInteractions[slug] = {
        clicks: 0,
        hovers: 0,
        views: 0,
        timeSpent: 0,
        scrollDepth: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };
    }
    
    this.state.entityInteractions[slug].hovers++;
    this.state.entityInteractions[slug].lastSeen = Date.now();
    
    // Only track if hover was longer than 500ms
    if (duration > 500) {
      debugLog(`👆 HOVER: ${slug}`, `${duration}ms`);
      this.trackAction('entity_hover', { slug, duration });
    }
  }
  
  /**
   * Track page visit (detail page)
   */
  trackPageVisit() {
    // Check if we're on a detail page
    const path = window.location.pathname;
    const match = path.match(/\/fungi\/([^\/]+)/);
    
    if (match) {
      const slug = match[1];
      
      if (!this.state.entityInteractions[slug]) {
        this.state.entityInteractions[slug] = {
          clicks: 0,
          hovers: 0,
          views: 0,
          timeSpent: 0,
          scrollDepth: 0,
          firstSeen: Date.now(),
          lastSeen: Date.now()
        };
      }
      
      this.state.entityInteractions[slug].views++;
      this.state.entityInteractions[slug].lastSeen = Date.now();
      
      this.trackAction('page_visit', { slug });
      
      // Track time spent on this page
      this._currentPageSlug = slug;
      this._pageVisitStart = Date.now();
      
      // Track scroll depth
      this.setupScrollTracking(slug);
    }
  }
  
  /**
   * Setup scroll tracking for detail pages
   */
  setupScrollTracking(slug) {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.min(100, Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      ));
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        if (this.state.entityInteractions[slug]) {
          this.state.entityInteractions[slug].scrollDepth = Math.max(
            this.state.entityInteractions[slug].scrollDepth,
            maxScroll
          );
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Track time spent when leaving
    const handleUnload = () => {
      if (this._currentPageSlug === slug && this._pageVisitStart) {
        const timeSpent = Date.now() - this._pageVisitStart;
        if (this.state.entityInteractions[slug]) {
          this.state.entityInteractions[slug].timeSpent += timeSpent;
        }
        this.trackAction('page_leave', { slug, timeSpent, scrollDepth: maxScroll });
      }
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    // Also track on navigation away (SPA)
    window.addEventListener('popstate', handleUnload);
  }
  
  // ========================================
  // HILBERT SPACE RELEVANCE CALCULATION
  // ========================================
  
  /**
   * Calculate relevance scores for all known entities
   * Uses Hilbert space transformations based on user behavior
   */
  calculateRelevanceScores(allEntities = []) {
    const now = Date.now();
    
    // Cache for 5 seconds
    if (now - this.state.lastCalculation < 5000 && 
        Object.keys(this.state.relevanceScores).length > 0) {
      return this.state.relevanceScores;
    }
    
    const scores = {};
    const sessionDuration = now - this.state.startTime;
    
    // Weight factors (tunable)
    const WEIGHTS = {
      click: 0.25,           // Direct click is strong signal
      hover: 0.05,           // Hover shows interest
      view: 0.20,            // Page view is strong
      timeSpent: 0.15,       // Time on page (normalized)
      scrollDepth: 0.10,     // Deep scroll = engagement
      searchMatch: 0.15,     // Matches search queries
      perspectiveMatch: 0.10 // Matches active perspectives
    };
    
    // Process each entity we know about
    const knownSlugs = new Set([
      ...Object.keys(this.state.entityInteractions),
      ...allEntities.map(e => e.seoName || e.slug)
    ]);
    
    debugLog('🔬 CALCULATING RELEVANCE SCORES...');
    debugLog('   Session duration:', Math.round(sessionDuration / 1000), 'seconds');
    debugLog('   Known entities:', knownSlugs.size);
    
    for (const slug of knownSlugs) {
      const interaction = this.state.entityInteractions[slug] || {
        clicks: 0, hovers: 0, views: 0, timeSpent: 0, scrollDepth: 0
      };
      
      const entity = allEntities.find(e => 
        (e.seoName || e.slug) === slug
      );
      
      let score = 0;
      
      // 1. Direct interaction scores
      score += Math.min(1, interaction.clicks * 0.33) * WEIGHTS.click;
      score += Math.min(1, interaction.hovers * 0.1) * WEIGHTS.hover;
      score += Math.min(1, interaction.views * 0.5) * WEIGHTS.view;
      
      // 2. Time spent (normalized to max 10 minutes)
      const timeScore = Math.min(1, interaction.timeSpent / (10 * 60 * 1000));
      score += timeScore * WEIGHTS.timeSpent;
      
      // 3. Scroll depth (0-100%)
      const scrollScore = interaction.scrollDepth / 100;
      score += scrollScore * WEIGHTS.scrollDepth;
      
      // 4. Search match score
      if (entity) {
        const searchScore = this.calculateSearchMatchScore(entity);
        score += searchScore * WEIGHTS.searchMatch;
      }
      
      // 5. Perspective match score
      if (entity) {
        const perspectiveScore = this.calculatePerspectiveMatchScore(entity);
        score += perspectiveScore * WEIGHTS.perspectiveMatch;
      }
      
      // 6. Recency decay (older interactions worth less)
      if (interaction.lastSeen) {
        const age = now - interaction.lastSeen;
        const ageHours = age / (1000 * 60 * 60);
        const decayMultiplier = Math.pow(this.options.decayFactor, ageHours);
        score *= decayMultiplier;
      }
      
      // Clamp to 0-1
      scores[slug] = Math.max(0, Math.min(1, score));
    }
    
    // Store and return
    this.state.relevanceScores = scores;
    this.state.lastCalculation = now;
    
    // Log top 5 scores
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    debugLog('✅ RELEVANCE SCORES CALCULATED');
    debugLog(`   Total entities: ${Object.keys(scores).length}`);
    debugTable('Top 5 Relevant Entities', 
      sortedScores.map(([slug, score]) => ({ slug, score: score.toFixed(3) }))
    );
    
    return scores;
  }
  
  /**
   * Calculate how well an entity matches recent searches
   */
  calculateSearchMatchScore(entity) {
    if (this.state.searches.length === 0) return 0;
    
    // Get recent searches (last 10)
    const recentSearches = this.state.searches.slice(-10);
    
    // Build searchable text from entity
    const searchableText = this.buildSearchableText(entity).toLowerCase();
    
    let matchScore = 0;
    let totalWeight = 0;
    
    recentSearches.forEach((search, index) => {
      // More recent searches have higher weight
      const weight = (index + 1) / recentSearches.length;
      totalWeight += weight;
      
      const query = search.query.toLowerCase();
      
      // Check if entity contains search terms
      const terms = query.split(/\s+/);
      const matchingTerms = terms.filter(term => 
        term.length > 2 && searchableText.includes(term)
      );
      
      if (matchingTerms.length > 0) {
        matchScore += (matchingTerms.length / terms.length) * weight;
      }
    });
    
    return totalWeight > 0 ? matchScore / totalWeight : 0;
  }
  
  /**
   * Calculate how well an entity matches used perspectives
   */
  calculatePerspectiveMatchScore(entity) {
    // Get most used perspectives
    const perspectiveScores = Object.entries(this.state.perspectiveUsage)
      .map(([p, data]) => ({
        perspective: p,
        score: data.activations * 0.5 + (data.totalTime / 60000) * 0.5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    if (perspectiveScores.length === 0) return 0;
    
    let matchScore = 0;
    let totalWeight = 0;
    
    perspectiveScores.forEach(({ perspective, score }) => {
      totalWeight += score;
      
      // Check if entity has data for this perspective
      const hasData = entity[perspective] && 
        typeof entity[perspective] === 'object' &&
        Object.keys(entity[perspective]).length > 0;
      
      if (hasData) {
        matchScore += score;
      }
    });
    
    return totalWeight > 0 ? matchScore / totalWeight : 0;
  }
  
  /**
   * Build searchable text from entity
   */
  buildSearchableText(entity) {
    const parts = [];
    
    // Extract common name
    const commonName = entity.commonName?.value || entity.commonName;
    if (commonName) parts.push(commonName);
    
    // Extract latin name
    const latinName = entity.latinName?.value || entity.latinName;
    if (latinName) parts.push(latinName);
    
    // Extract tags
    if (Array.isArray(entity.tags)) {
      parts.push(...entity.tags);
    }
    
    // Add taxonomy
    const taxonomy = entity.taxonomy?.value || entity.taxonomy;
    if (taxonomy) {
      Object.values(taxonomy).forEach(v => {
        if (typeof v === 'string') parts.push(v);
      });
    }
    
    return parts.join(' ');
  }
  
  // ========================================
  // PUBLIC API
  // ========================================
  
  /**
   * Get top N relevant entities
   */
  getTopRelevantEntities(allEntities, limit = 10) {
    debugLog(`🎯 GET TOP ${limit} RELEVANT ENTITIES`);
    debugLog(`   Input entities: ${allEntities.length}`);
    
    const scores = this.calculateRelevanceScores(allEntities);
    
    const results = Object.entries(scores)
      .filter(([_, score]) => score > 0.05) // Min threshold
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([slug, score]) => ({
        slug,
        score,
        entity: allEntities.find(e => (e.seoName || e.slug) === slug)
      }));
    
    debugLog(`   Returned: ${results.length} entities above threshold`);
    
    return results;
  }
  
  /**
   * Get session statistics
   */
  getStats() {
    return {
      sessionId: this.state.sessionId,
      sessionDuration: Date.now() - this.state.startTime,
      totalActions: this.state.actions.length,
      totalSearches: this.state.searches.length,
      entitiesInteracted: Object.keys(this.state.entityInteractions).length,
      perspectivesUsed: Object.keys(this.state.perspectiveUsage).length,
      currentPerspectives: this.state.currentPerspectives,
      currentSearchQuery: this.state.currentSearchQuery
    };
  }
  
  /**
   * Get entity interaction data
   */
  getEntityInteraction(slug) {
    return this.state.entityInteractions[slug] || null;
  }
  
  /**
   * Clear session state
   */
  clearSession() {
    sessionStorage.removeItem(this.options.storageKey);
    this.state = this.loadState();
    console.log('[SessionStateManager] 🗑️ Session cleared');
  }
  
  /**
   * Clear all data (including persistent)
   */
  clearAll() {
    sessionStorage.removeItem(this.options.storageKey);
    localStorage.removeItem(this.options.persistentKey);
    this.state = this.loadState();
    console.log('[SessionStateManager] 🗑️ All data cleared');
  }
}

// Singleton instance
let instance = null;

export function getSessionStateManager() {
  if (!instance) {
    instance = new SessionStateManager();
  }
  return instance;
}

export default SessionStateManager;
