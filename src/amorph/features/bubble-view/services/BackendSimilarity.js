/**
 * 🔗 BACKEND SIMILARITY API
 * ========================
 * 
 * Wrapper for Convex backend similarity calculations
 * Handles all communication with userInteractions & calculateSimilarity
 * 
 * Created: 23. November 2025
 */

export class BackendSimilarity {
  constructor() {
    this.convex = null;
    this.api = null;
    this.sessionId = this.generateSessionId();
    console.log('[BackendSimilarity] Initialized with session:', this.sessionId);
  }
  
  /**
   * Initialize with Convex client
   */
  async init(convexClient) {
    this.convex = convexClient;
    
    // Dynamically import API (avoids build-time issues)
    try {
      const apiModule = await import('../../../../../convex/_generated/api.js');
      this.api = apiModule.api;
      console.log('[BackendSimilarity] ✅ Convex client connected');
    } catch (error) {
      console.error('[BackendSimilarity] ❌ Failed to load API:', error);
    }
  }
  
  /**
   * Generate browser session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Track user interaction
   */
  async trackInteraction(type, data = {}) {
    if (!this.convex || !this.api) {
      console.warn('[BackendSimilarity] Convex not initialized');
      return null;
    }
    
    try {
      const interactionId = await this.convex.mutation(
        this.api.userInteractions.create,
        {
          type,
          entitySlug: data.entitySlug,
          query: data.query,
          perspectives: data.perspectives,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          metadata: data.metadata
        }
      );
      
      console.log(`[BackendSimilarity] ✅ Tracked ${type}:`, interactionId);
      return interactionId;
    } catch (error) {
      console.error('[BackendSimilarity] Failed to track interaction:', error);
      return null;
    }
  }
  
  /**
   * Get recent interactions
   */
  async getRecentInteractions(limit = 50) {
    if (!this.convex || !this.api) return [];
    
    try {
      return await this.convex.query(
        this.api.userInteractions.getRecent,
        { limit, sessionId: this.sessionId }
      );
    } catch (error) {
      console.error('[BackendSimilarity] Failed to get interactions:', error);
      return [];
    }
  }
  
  /**
   * Calculate similarities (main method!)
   */
  async calculateSimilarities(entitySlugs, activePerspectives, includeUserNode = true) {
    if (!this.convex || !this.api) {
      console.warn('[BackendSimilarity] Convex not initialized');
      return null;
    }
    
    try {
      // Get recent interactions for UserNode context
      const recentInteractions = await this.getRecentInteractions(50);
      const interactionIds = recentInteractions.map(i => i._id);
      
      // Call backend similarity calculation
      const result = await this.convex.query(
        this.api.calculateSimilarity.calculate,
        {
          entitySlugs,
          activePerspectives,
          userInteractionIds: interactionIds,
          includeUserNode
        }
      );
      
      console.log('[BackendSimilarity] ✅ Calculated similarities:', {
        entities: entitySlugs.length,
        connections: Object.keys(result.userNodeConnections).length,
        calculationTime: result.metadata.calculationTime + 'ms'
      });
      
      return result;
    } catch (error) {
      console.error('[BackendSimilarity] Failed to calculate similarities:', error);
      return null;
    }
  }
  
  /**
   * Get interaction statistics
   */
  async getStats() {
    if (!this.convex || !this.api) return null;
    
    try {
      return await this.convex.query(
        this.api.userInteractions.getStats,
        { sessionId: this.sessionId }
      );
    } catch (error) {
      console.error('[BackendSimilarity] Failed to get stats:', error);
      return null;
    }
  }
}
