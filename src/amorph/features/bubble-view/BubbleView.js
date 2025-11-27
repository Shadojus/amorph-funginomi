/**
 * 🫧 BUBBLE VIEW - PIXI.JS REWRITE v2.1
 * =====================================
 * 
 * High-performance GPU-accelerated visualization with:
 * - Pixi.js rendering (PixieRenderer)
 * - Backend similarity calculations (Convex)
 * - Session-based relevance via SessionStateManager
 * - Hilbert space entity recommendations
 * 
 * The UserNode is now a "memory" that collects all user actions
 * and calculates which entities are most relevant to show.
 * 
 * Created: 23. November 2025
 * Updated: 26. November 2025 - SessionStateManager integration
 */

import { LitElement, html, css } from 'lit';
import { PixieRenderer } from '../../core/PixieRenderer.js';
import { BackendSimilarity } from './services/BackendSimilarity.js';
import { getSessionStateManager } from './services/SessionStateManager.js';

/**
 * Extract value from citedValue format or plain value
 * Schema uses { value: X, confidence: N, sources: [...] } format
 */
function extractValue(data) {
  if (data === null || data === undefined) return data;
  
  // CitedValue format: { value: X, confidence, sources, ... }
  if (typeof data === 'object' && 'value' in data && 
      ('confidence' in data || 'sources' in data || 'consensus' in data)) {
    return data.value;
  }
  
  return data;
}

/**
 * Get entity display name - handles nested structures
 */
function getEntityName(entity, nameField = 'commonName') {
  // Try direct field first
  let name = entity[nameField];
  
  // Handle citedValue wrapper
  name = extractValue(name);
  
  // Fallback to identity.scientificName or names.common
  if (!name || typeof name === 'object') {
    const identity = extractValue(entity.identity);
    if (identity) {
      name = extractValue(identity.scientificName) || extractValue(identity.primaryName);
    }
  }
  
  // Fallback to names.common
  if (!name || typeof name === 'object') {
    const names = extractValue(entity.names);
    if (names) {
      name = extractValue(names.common) || extractValue(names.scientific);
      if (Array.isArray(name)) name = name[0];
    }
  }
  
  // Fallback to latinName
  if (!name || typeof name === 'object') {
    name = extractValue(entity.latinName);
  }
  
  // Fallback to slug
  if (!name || typeof name === 'object') {
    name = entity.seoName || entity.slug || 'Unknown';
  }
  
  return String(name);
}

/**
 * Get entity slug - handles different field names
 */
function getEntitySlug(entity, slugField = 'seoName') {
  return entity[slugField] || entity.seoName || entity.slug || entity._id;
}

/**
 * Get entity image URL
 */
function getEntityImage(entity) {
  // Check visualIdentity.primaryImage
  const visualIdentity = extractValue(entity.visualIdentity);
  if (visualIdentity) {
    const primaryImage = extractValue(visualIdentity.primaryImage);
    if (primaryImage && typeof primaryImage === 'string') {
      console.log('[BubbleView] 🖼️ Found primaryImage:', primaryImage);
      return primaryImage;
    }
  }
  
  // Check images array
  const images = extractValue(entity.images);
  if (Array.isArray(images) && images.length > 0) {
    const firstImage = images[0];
    const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
    if (imageUrl) {
      console.log('[BubbleView] 🖼️ Found image from array:', imageUrl);
      return imageUrl;
    }
  }
  
  console.log('[BubbleView] ⚠️ No image found for entity:', entity.seoName || entity._id);
  return null;
}

export class BubbleView extends LitElement {
  static properties = {
    isSimulating: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000000;
      border-radius: 12px;
    }

    .pixi-container {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
  `;

  constructor() {
    super();
    
    // Core state
    this.isSimulating = false;
    this.animationFrame = null;
    
    // Pixi.js
    this.pixieRenderer = new PixieRenderer({
      width: 800,
      height: 600,
      backgroundColor: 0x000000,
      autoResize: true
    });
    
    // Backend similarity
    this.backendSimilarity = new BackendSimilarity();
    
    // Session State Manager (Hilbert space relevance)
    this.sessionManager = getSessionStateManager();
    
    console.log('%c[BubbleView]', 'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '🧠 SessionStateManager attached:', {
        sessionId: this.sessionManager?.state?.sessionId,
        actions: this.sessionManager?.state?.actions?.length || 0,
        entities: Object.keys(this.sessionManager?.state?.entityInteractions || {}).length
      });
    
    // Data structures
    this.bubbles = new Map(); // slug -> bubble data
    this.cachedEntityData = new Map(); // slug -> full entity
    this.allKnownEntities = []; // All entities from Convex (for session-based recommendations)
    this.activePerspectives = [];
    this.currentSearchQuery = '';
    
    // Mode: 'search' = show search results, 'session' = show session-based recommendations
    this.displayMode = 'session';
    
    // User Node - initial position will be set dynamically in connectedCallback
    this.userNodeData = {
      x: 0, // Will be set to center in updateUserNodePosition()
      y: 0, // Will be set to center in updateUserNodePosition()
      size: 40,
      connections: new Map() // slug -> weight
    };
    
    console.log('%c[BubbleView] 🚀 Initialized with Pixi.js v2.1 + SessionStateManager', 
      'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
    }
    
    // Initialize backend similarity (auto-creates Convex client if needed)
    await this.backendSimilarity.init();

    // Listen for events
    this._boundPerspectiveHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundPerspectiveHandler);
    
    this._boundSearchHandler = this.handleSearchComplete.bind(this);
    window.addEventListener('convex-search:completed', this._boundSearchHandler);
    
    // Listen for session state updates
    this._boundSessionHandler = this.handleSessionUpdate.bind(this);
    window.addEventListener('session:action-tracked', this._boundSessionHandler);
    
    console.log('[BubbleView] Connected, waiting for Pixi init...');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this._boundPerspectiveHandler) {
      window.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
    }
    if (this._boundSearchHandler) {
      window.removeEventListener('convex-search:completed', this._boundSearchHandler);
    }
    if (this._boundSessionHandler) {
      window.removeEventListener('session:action-tracked', this._boundSessionHandler);
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.pixieRenderer) {
      this.pixieRenderer.clear();
    }
  }

  async firstUpdated() {
    // Initialize Pixi.js
    const container = this.shadowRoot.querySelector('.pixi-container');
    const success = await this.pixieRenderer.init(container);
    
    if (success) {
      console.log('[BubbleView] ✅ Pixi.js initialized');
      
      // Set initial UserNode position BEFORE rendering
      this.updateUserNodePosition();
      
      this.setupResize();
      this.startRenderLoop();
      
      // If entities are already cached (from BubbleHost), show recommendations
      // Otherwise try to load from Convex
      if (this.allKnownEntities.length > 0) {
        console.log('[BubbleView] 📦 Using', this.allKnownEntities.length, 'cached entities');
        await this.showSessionRecommendations();
      } else {
        await this.loadAllEntities();
        await this.showSessionRecommendations();
      }
    } else {
      console.error('[BubbleView] ❌ Pixi.js init failed');
    }
  }

  // Update UserNode position to viewport center
  updateUserNodePosition() {
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    this.userNodeData.x = width / 2;
    this.userNodeData.y = height / 2;
  }

  setupResize() {
    // Update UserNode AND all bubbles on resize
    const updateLayout = () => {
      // Update position using shared method
      this.updateUserNodePosition();
      const width = this.offsetWidth || 800;
      const height = this.offsetHeight || 600;
      
      if (this.bubbles.has('user-node')) {
        this.pixieRenderer.updateNode('user-node', {
          x: this.userNodeData.x,
          y: this.userNodeData.y
        });
      }
      
      // Recalculate all bubble positions for new viewport
      if (this.displayMode === 'session' && this.bubbles.size > 1) {
        this.repositionBubblesForViewport();
      }
    };
    
    window.addEventListener('resize', updateLayout);
    updateLayout();
  }
  
  /**
   * Reposition all bubbles to fit within current viewport
   */
  repositionBubblesForViewport() {
    const viewportWidth = this.offsetWidth || 400;
    const viewportHeight = this.offsetHeight || 400;
    const responsiveRadius = Math.min(viewportWidth, viewportHeight) * 0.35;
    const padding = 60;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Get non-usernode bubbles
    const bubbleEntries = Array.from(this.bubbles.entries())
      .filter(([id]) => id !== 'user-node');
    
    const count = bubbleEntries.length;
    
    bubbleEntries.forEach(([id, bubble], i) => {
      const relevanceScore = bubble.relevanceScore || 0.3;
      const angle = (i / count) * Math.PI * 2;
      const distance = responsiveRadius * (1.2 - relevanceScore);
      
      let x = centerX + Math.cos(angle) * distance;
      let y = centerY + Math.sin(angle) * distance;
      
      // Clamp to viewport
      x = Math.max(padding, Math.min(viewportWidth - padding, x));
      y = Math.max(padding, Math.min(viewportHeight - padding, y));
      
      // Update stored position
      bubble.x = x;
      bubble.y = y;
      
      // Update rendered position
      this.pixieRenderer.updateNode?.(id, { x, y });
    });
    
    // Re-render connections
    this.renderRelevanceConnections();
  }

  /**
   * Main render loop (Pixi.js)
   */
  startRenderLoop() {
    const animate = () => {
      // Pixi.js handles rendering automatically
      // We only need to update physics/positions here if needed
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Load all entities from Convex for session-based recommendations
   */
  async loadAllEntities() {
    console.log('%c[BubbleView]', 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;', '📚 Loading all entities...');
    
    try {
      // Use the AMORPH Convex client if available
      const client = this.backendSimilarity.client || window.amorph?.convexClient;
      
      if (!client) {
        console.warn('%c[BubbleView]', 'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px;', '⚠️ No Convex client available');
        return;
      }
      
      console.log('%c[BubbleView]', 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;', '   Using client:', client.constructor.name);
      
      // Import the API dynamically
      const { api } = await import('../../../../convex/_generated/api.js');
      
      // Fetch all entities
      const entities = await client.query(api.fungi.search, { 
        query: '',
        perspectives: [],
        limit: 100 // Get up to 100 entities for recommendations
      });
      
      if (entities && entities.length > 0) {
        this.allKnownEntities = entities;
        
        // Cache them
        const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
        entities.forEach(entity => {
          const slug = getEntitySlug(entity, slugField);
          if (slug) {
            this.cachedEntityData.set(slug, entity);
          }
        });
        
        console.log('%c[BubbleView]', 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;', 
          '✅ Loaded', entities.length, 'entities');
        console.log('%c[BubbleView]', 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;', 
          '   Entity slugs:', entities.slice(0, 5).map(e => getEntitySlug(e, slugField)).join(', '), '...');
      } else {
        console.warn('%c[BubbleView]', 'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px;', 
          '⚠️ No entities returned from Convex');
      }
    } catch (error) {
      console.error('%c[BubbleView]', 'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;', 
        '❌ Failed to load entities:', error);
    }
  }

  /**
   * Show session-based recommendations (Hilbert space calculation)
   */
  async showSessionRecommendations() {
    console.log('%c[BubbleView]', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '🧠 SHOWING SESSION RECOMMENDATIONS');
    
    if (this.allKnownEntities.length === 0) {
      console.warn('%c[BubbleView]', 'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px;', 
        '⚠️ No entities loaded - cannot show recommendations');
      return;
    }
    
    this.displayMode = 'session';
    console.log('%c[BubbleView]', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '   Display mode: SESSION');
    console.log('%c[BubbleView]', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '   Available entities:', this.allKnownEntities.length);
    
    // Get session stats for debug
    const stats = this.sessionManager.getStats();
    console.log('%c[BubbleView]', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '   Session stats:', stats);
    
    // Get top relevant entities from SessionStateManager
    const topEntities = this.sessionManager.getTopRelevantEntities(
      this.allKnownEntities,
      12 // Show up to 12 bubbles
    );
    
    console.log('%c[BubbleView]', 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;', 
      '   Top entities from session:', topEntities.length);
    
    if (topEntities.length > 0) {
      console.table(topEntities.slice(0, 5).map(e => ({
        slug: e.slug,
        score: e.score.toFixed(3),
        hasEntity: !!e.entity
      })));
    }
    
    // If no session data yet, show random selection
    let entitiesToShow;
    if (topEntities.length < 3) {
      // Show random entities for new users
      entitiesToShow = this.allKnownEntities
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
      console.log('%c[BubbleView]', 'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;', 
        '👋 NEW USER - showing', entitiesToShow.length, 'random entities');
    } else {
      entitiesToShow = topEntities
        .filter(e => e.entity)
        .map(e => e.entity);
      console.log('%c[BubbleView]', 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px;', 
        '✅ RETURNING USER - showing', entitiesToShow.length, 'relevant entities');
    }
    
    if (entitiesToShow.length > 0) {
      await this.renderSessionBubbles(entitiesToShow, topEntities);
    }
  }

  /**
   * Render bubbles based on session relevance scores
   */
  async renderSessionBubbles(entities, relevanceData = []) {
    // Clear existing
    this.bubbles.clear();
    this.pixieRenderer.clear();
    
    // Render UserNode first
    await this.renderUserNode();
    
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
    const nameField = window.amorph?.domainConfig?.dataSource?.nameField || 'commonName';
    
    // Build relevance lookup
    const relevanceLookup = new Map();
    relevanceData.forEach(r => relevanceLookup.set(r.slug, r.score));
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const slug = getEntitySlug(entity, slugField);
      const label = getEntityName(entity, nameField);
      const imageUrl = getEntityImage(entity);
      
      // Get relevance score (default 0.3 for new users)
      const relevanceScore = relevanceLookup.get(slug) || 0.3;
      
      // Calculate position based on relevance (closer = more relevant)
      // Use responsive radius based on viewport
      const viewportWidth = this.offsetWidth || 400;
      const viewportHeight = this.offsetHeight || 400;
      const responsiveRadius = Math.min(viewportWidth, viewportHeight) * 0.35;
      
      const angle = (i / entities.length) * Math.PI * 2;
      const distance = responsiveRadius * (1.2 - relevanceScore); // Higher score = closer
      
      // Ensure bubbles stay within viewport with padding
      const padding = 60; // Account for bubble size
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;
      let x = centerX + Math.cos(angle) * distance;
      let y = centerY + Math.sin(angle) * distance;
      
      // Clamp to viewport bounds
      x = Math.max(padding, Math.min(viewportWidth - padding, x));
      y = Math.max(padding, Math.min(viewportHeight - padding, y));
      
      // Calculate bubble size based on relevance (larger = more relevant)
      const minSize = 50;
      const maxSize = 120;
      const bubbleSize = minSize + (maxSize - minSize) * relevanceScore;
      
      // Color based on relevance (green=high, blue=medium, gray=low)
      let color;
      if (relevanceScore > 0.6) {
        color = 0x10b981; // Emerald green
      } else if (relevanceScore > 0.3) {
        color = 0x3b82f6; // Blue
      } else {
        color = 0x6b7280; // Gray
      }
      
      // Store bubble data with relevance
      this.bubbles.set(slug, {
        slug,
        label,
        imageUrl,
        x,
        y,
        size: bubbleSize,
        relevanceScore,
        color,
        data: entity
      });
      
      // Update UserNode connections based on relevance
      this.userNodeData.connections.set(slug, relevanceScore);
      
      // Truncate label
      const displayLabel = label.length > 15 ? label.substring(0, 12) + '...' : label;
      
      // Render bubble
      await this.pixieRenderer.renderNode(slug, {
        x,
        y,
        radius: bubbleSize / 2,
        color,
        borderWidth: 2,
        borderColor: relevanceScore > 0.5 ? 0x22c55e : 0x4b5563,
        glowRadius: relevanceScore > 0.5 ? 10 : 4,
        glowColor: color,
        glowAlpha: 0.2 + (relevanceScore * 0.3),
        image: imageUrl,
        label: displayLabel
      });
      
      // Enable interactions
      this.pixieRenderer.enableNodeInteraction(slug, {
        onClick: (id) => this.handleBubbleClick(id),
        onHover: (id, isHovering) => this.handleBubbleHover(id, isHovering)
      });
    }
    
    // Render connections based on relevance
    this.renderRelevanceConnections();
    
    console.log(`[BubbleView] ✅ Rendered ${entities.length} session-based bubbles`);
  }

  /**
   * Render connections based on session relevance
   */
  renderRelevanceConnections() {
    // Clear existing connections
    this.pixieRenderer.connections?.forEach((_, id) => {
      if (id.startsWith('conn-')) {
        this.pixieRenderer.removeConnection?.(id);
      }
    });
    
    // Render connections for all bubbles with relevance > 0.2
    this.userNodeData.connections.forEach((weight, slug) => {
      const bubble = this.bubbles.get(slug);
      if (!bubble || weight < 0.15) return;
      
      const connectionId = `conn-user-${slug}`;
      
      // Color based on weight
      const color = weight > 0.5 ? 0x10b981 : 0x3b82f6;
      
      // Get actual coordinates
      const fromCoords = { x: this.userNodeData.x, y: this.userNodeData.y };
      const toCoords = { x: bubble.x, y: bubble.y };
      
      this.pixieRenderer.renderConnection?.(connectionId, {
        from: fromCoords,
        to: toCoords,
        color,
        alpha: Math.min(0.8, weight + 0.2),
        width: Math.max(1, weight * 4),
        label: `${Math.round(weight * 100)}%`
      });
    });
  }

  /**
   * Handle session state updates (re-render if significant)
   */
  async handleSessionUpdate(event) {
    const { action, totalActions } = event.detail || {};
    
    console.log('%c[BubbleView]', 'background: #6366f1; color: white; padding: 2px 6px; border-radius: 3px;', 
      '📡 SESSION UPDATE:', action?.type, `(total: ${totalActions})`);
    
    // Re-render every 5 actions or on significant changes
    if (totalActions % 5 === 0 && this.displayMode === 'session') {
      console.log('%c[BubbleView]', 'background: #6366f1; color: white; padding: 2px 6px; border-radius: 3px;', 
        '🔄 Refreshing recommendations (every 5 actions)...');
      await this.showSessionRecommendations();
    }
  }

  /**
   * Handle perspective change
   */
  async handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    this.activePerspectives = perspectives.map(p => p.name || p);
    
    console.log('[BubbleView] 🎭 Perspective changed:', this.activePerspectives);
    
    // Track interaction
    await this.backendSimilarity.trackInteraction('perspective_change', {
      perspectives: this.activePerspectives
    });
    
    // Recalculate similarities
    await this.updateSimilarities();
  }

  /**
   * Handle search complete - switches to search mode
   */
  async handleSearchComplete(event) {
    const { results, query } = event.detail || {};
    
    if (!results || results.length === 0) {
      console.log('[BubbleView] Search returned no results, staying in session mode');
      // Stay in session mode when no results
      if (this.displayMode !== 'session') {
        await this.showSessionRecommendations();
      }
      return;
    }
    
    this.currentSearchQuery = query;
    this.displayMode = 'search';
    
    console.log('[BubbleView] 🔍 Search completed, switching to search mode:', {
      query,
      results: results.length
    });
    
    // Track search in SessionStateManager (automatically via event listener)
    
    // Track search in backend
    await this.backendSimilarity.trackInteraction('search', {
      query,
      perspectives: this.activePerspectives
    });
    
    // Update cached entities
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
    results.forEach(entity => {
      const slug = getEntitySlug(entity, slugField);
      if (slug) {
        this.cachedEntityData.set(slug, entity);
      }
    });
    
    // Update bubbles with search results but include session relevance
    await this.renderSearchResults(results);
  }

  /**
   * Render search results with session-boosted relevance
   */
  async renderSearchResults(results) {
    // Calculate session relevance for search results
    const sessionScores = this.sessionManager.calculateRelevanceScores(results);
    
    // Combine search position with session relevance
    const resultsWithRelevance = results.map((entity, index) => {
      const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
      const slug = getEntitySlug(entity, slugField);
      
      // Search position score (first result = 1.0, decays)
      const searchPositionScore = 1 - (index / results.length) * 0.5;
      
      // Session relevance score
      const sessionScore = sessionScores[slug] || 0;
      
      // Combined score (60% search, 40% session)
      const combinedScore = (searchPositionScore * 0.6) + (sessionScore * 0.4);
      
      return {
        entity,
        slug,
        score: combinedScore,
        searchScore: searchPositionScore,
        sessionScore
      };
    });
    
    // Sort by combined score
    resultsWithRelevance.sort((a, b) => b.score - a.score);
    
    console.log('[BubbleView] 🔀 Combined search + session scores:', 
      resultsWithRelevance.slice(0, 3).map(r => ({
        slug: r.slug,
        combined: r.score.toFixed(2),
        search: r.searchScore.toFixed(2),
        session: r.sessionScore.toFixed(2)
      }))
    );
    
    // Render with the combined relevance data
    await this.renderSessionBubbles(
      resultsWithRelevance.map(r => r.entity),
      resultsWithRelevance.map(r => ({ slug: r.slug, score: r.score }))
    );
  }

  /**
   * Cache entities from BubbleHost for session-based recommendations
   * Called before search/perspective events to ensure we have data
   */
  cacheEntities(entities) {
    if (!entities || entities.length === 0) return;
    
    console.log('[BubbleView] 📦 Caching', entities.length, 'entities from BubbleHost');
    
    // Store as allKnownEntities for session-based recommendations
    this.allKnownEntities = entities;
    
    // Also cache them by slug
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
    entities.forEach(entity => {
      const slug = getEntitySlug(entity, slugField);
      if (slug) {
        this.cachedEntityData.set(slug, entity);
      }
    });
    
    console.log('[BubbleView] ✅ Cached entities:', this.allKnownEntities.length);
    
    // Only show recommendations if Pixi is FULLY initialized (app AND container)
    if (this.pixieRenderer.app && this.pixieRenderer.container) {
      this.showSessionRecommendations();
    }
    // Otherwise, firstUpdated will call showSessionRecommendations after init
  }

  /**
   * Set entities data and render bubbles
   */
  async setEntitiesData(entities) {
    if (!entities || entities.length === 0) return;
    
    console.log(`[BubbleView] 📊 Setting ${entities.length} entities`);
    
    // Cache entity data using proper slug extraction
    this.cachedEntityData.clear();
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
    entities.forEach(entity => {
      const slug = getEntitySlug(entity, slugField);
      if (slug) {
        this.cachedEntityData.set(slug, entity);
      }
    });
    
    // Clear existing bubbles
    this.bubbles.clear();
    this.pixieRenderer.clear();
    
    // Render UserNode first
    await this.renderUserNode();
    
    // Render bubbles
    await this.renderBubbles(entities);
    
    // Calculate similarities from backend
    await this.updateSimilarities();
  }

  /**
   * Set active bubbles from BubbleHost (for similarity calculations)
   * Called by BubbleHost after creating BubbleMorphs
   */
  setActiveBubbles(bubbles, slugScores = {}, slugMatchedFields = {}) {
    console.log('[BubbleView] 📊 setActiveBubbles called:', {
      bubbleCount: bubbles?.length || 0,
      scores: Object.keys(slugScores).length,
      fields: Object.keys(slugMatchedFields).length
    });
    
    // Store for similarity calculations
    this.activeBubbleData = {
      bubbles: bubbles || [],
      scores: slugScores,
      matchedFields: slugMatchedFields
    };
    
    // Update connections based on scores
    if (slugScores && Object.keys(slugScores).length > 0) {
      this.userNodeData.connections.clear();
      for (const [slug, score] of Object.entries(slugScores)) {
        this.userNodeData.connections.set(slug, score);
      }
      
      // Update bubble sizes and re-render if we have bubbles
      if (this.bubbles.size > 0) {
        this.updateBubbleSizes();
      }
    }
  }

  /**
   * Render UserNode
   */
  async renderUserNode() {
    const nodeId = 'user-node';
    
    await this.pixieRenderer.renderNode(nodeId, {
      x: this.userNodeData.x,
      y: this.userNodeData.y,
      radius: this.userNodeData.size / 2,
      color: 0x3b82f6, // Blue
      borderWidth: 3,
      borderColor: 0xffffff,
      glowRadius: 20,
      glowColor: 0x3b82f6,
      glowAlpha: 0.5,
      label: '👤 You',
      icon: '👤'
    });
    
    console.log('[BubbleView] ✅ UserNode rendered');
  }

  /**
   * Render all bubbles
   */
  async renderBubbles(entities) {
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    const radius = Math.min(width, height) * 0.3;
    
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'seoName';
    const nameField = window.amorph?.domainConfig?.dataSource?.nameField || 'commonName';
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const slug = getEntitySlug(entity, slugField);
      const label = getEntityName(entity, nameField);
      const imageUrl = getEntityImage(entity);
      
      // Calculate initial position (circle layout around UserNode)
      const angle = (i / entities.length) * Math.PI * 2;
      const x = this.userNodeData.x + Math.cos(angle) * radius;
      const y = this.userNodeData.y + Math.sin(angle) * radius;
      
      // Calculate bubble size based on entity data richness
      const baseSize = 80;
      const dataRichness = this.calculateDataRichness(entity);
      const bubbleSize = baseSize + (dataRichness * 20); // 80-120px
      
      // Store bubble data
      this.bubbles.set(slug, {
        slug,
        label,
        imageUrl,
        x,
        y,
        size: bubbleSize,
        color: 0x10b981, // Green default
        data: entity
      });
      
      // Truncate label for display
      const displayLabel = label.length > 15 ? label.substring(0, 12) + '...' : label;
      
      // Render bubble with image if available
      await this.pixieRenderer.renderNode(slug, {
        x,
        y,
        radius: bubbleSize / 2,
        color: 0x10b981,
        borderWidth: 2,
        borderColor: 0x22c55e,
        glowRadius: 8,
        glowColor: 0x10b981,
        glowAlpha: 0.3,
        image: imageUrl, // Will show image if available
        label: displayLabel
      });
      
      // Enable interactions
      this.pixieRenderer.enableNodeInteraction(slug, {
        onClick: (id) => this.handleBubbleClick(id),
        onHover: (id, isHovering) => this.handleBubbleHover(id, isHovering)
      });
    }
    
    console.log(`[BubbleView] ✅ Rendered ${entities.length} bubbles with labels:`, 
      Array.from(this.bubbles.values()).map(b => b.label).slice(0, 3));
  }
  
  /**
   * Calculate entity data richness (0-2 scale)
   * More data = larger bubble
   */
  calculateDataRichness(entity) {
    let score = 0;
    const perspectiveFields = [
      'taxonomy', 'morphology', 'ecology', 'chemistry', 
      'cultivation', 'medicinal', 'culinary', 'conservation'
    ];
    
    for (const field of perspectiveFields) {
      if (entity[field]) {
        const data = extractValue(entity[field]);
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          score += 0.25;
        }
      }
    }
    
    return Math.min(score, 2); // Cap at 2
  }

  /**
   * Update similarities from backend
   */
  async updateSimilarities() {
    const slugs = Array.from(this.bubbles.keys());
    
    if (slugs.length === 0) return;
    
    console.log('[BubbleView] 🔬 Requesting similarities from backend...');
    
    const result = await this.backendSimilarity.calculateSimilarities(
      slugs,
      this.activePerspectives,
      true // Include UserNode
    );
    
    if (!result) {
      console.warn('[BubbleView] No similarity data received');
      return;
    }
    
    // Update UserNode connections
    this.userNodeData.connections = new Map(
      Object.entries(result.userNodeConnections)
    );
    
    console.log('[BubbleView] ✅ Updated similarities:', {
      userNodeConnections: this.userNodeData.connections.size,
      calculationTime: result.metadata.calculationTime + 'ms'
    });
    
    // Update bubble sizes based on connections
    this.updateBubbleSizes();
    
    // Render connections
    this.renderConnections(result.bubbleSimilarities);
  }

  /**
   * Update bubble sizes based on UserNode connections
   */
  updateBubbleSizes() {
    const minSize = 60;
    const maxSize = 140;
    
    this.bubbles.forEach((bubble, slug) => {
      const weight = this.userNodeData.connections.get(slug) || 0.1;
      const newSize = minSize + (maxSize - minSize) * weight;
      
      bubble.size = newSize;
      
      // Update Pixi node
      this.pixieRenderer.updateNode(slug, {
        radius: newSize / 2
      });
    });
  }

  /**
   * Render connections between bubbles and UserNode
   */
  renderConnections(bubbleSimilarities) {
    // Clear existing connections
    this.pixieRenderer.connections.forEach((_, id) => {
      if (id.startsWith('conn-')) {
        this.pixieRenderer.removeConnection(id);
      }
    });
    
    // Render UserNode connections
    this.userNodeData.connections.forEach((weight, slug) => {
      const bubble = this.bubbles.get(slug);
      if (!bubble || weight < 0.2) return; // Skip weak connections
      
      const connectionId = `conn-user-${slug}`;
      
      // Get actual coordinates
      const fromCoords = { x: this.userNodeData.x, y: this.userNodeData.y };
      const toCoords = { x: bubble.x, y: bubble.y };
      
      this.pixieRenderer.renderConnection(connectionId, {
        from: fromCoords,
        to: toCoords,
        color: 0x3b82f6,
        alpha: weight,
        width: Math.max(1, weight * 5),
        label: `${Math.round(weight * 100)}%`
      });
    });
    
    console.log('[BubbleView] ✅ Rendered UserNode connections');
  }

  /**
   * Handle bubble click - tracks interaction and updates session
   */
  async handleBubbleClick(slug) {
    console.log('[BubbleView] 🖱️ Bubble clicked:', slug);
    
    // Track in SessionStateManager (for Hilbert space calculation)
    this.sessionManager.trackEntityClick(slug);
    
    // Track interaction in backend
    await this.backendSimilarity.trackInteraction('bubble_click', {
      entitySlug: slug
    });
    
    // Open detail dialog (BubbleDetailReactor handles this)
    window.dispatchEvent(new CustomEvent('bubble:clicked', {
      detail: { slug }
    }));
    
    // Update display after a short delay (let interaction be processed)
    setTimeout(() => {
      if (this.displayMode === 'session') {
        this.showSessionRecommendations();
      }
    }, 500);
  }

  /**
   * Handle bubble hover - tracks for session relevance
   */
  async handleBubbleHover(slug, isHovering) {
    if (isHovering) {
      // Add glow effect
      this.pixieRenderer.updateNode(slug, {
        glowRadius: 15,
        glowColor: 0x10b981,
        glowAlpha: 0.6
      });
      
      // Start hover timer
      this._hoverStart = Date.now();
      this._currentHoverSlug = slug;
    } else {
      // Remove glow
      this.pixieRenderer.updateNode(slug, {
        glowRadius: this.bubbles.get(slug)?.relevanceScore > 0.5 ? 10 : 4
      });
      
      // Track hover duration if significant
      if (this._currentHoverSlug === slug && this._hoverStart) {
        const duration = Date.now() - this._hoverStart;
        if (duration > 500) {
          // Track in SessionStateManager
          this.sessionManager.trackEntityHover(slug, duration);
        }
      }
      
      this._currentHoverSlug = null;
      this._hoverStart = null;
    }
  }

  render() {
    return html`
      <div class="pixi-container"></div>
    `;
  }
}

customElements.define('bubble-view', BubbleView);
