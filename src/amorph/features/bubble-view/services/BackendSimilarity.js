/**
 * 🔗 BACKEND SIMILARITY API
 * ========================
 * 
 * Wrapper for Convex backend similarity calculations
 * Handles all communication with userInteractions & calculateSimilarity
 * 
 * Created: 23. November 2025
 * Updated: 26. November 2025 - Direct Convex initialization
 */

import { ConvexHttpClient } from 'convex/browser';

export class BackendSimilarity {
  constructor() {
    this.convex = null;
    this.api = null;
    this.sessionId = this.generateSessionId();
    this.isInitialized = false;
    console.log('[BackendSimilarity] Initialized with session:', this.sessionId);
  }
  
  /**
   * Initialize with Convex client (or create our own)
   */
  async init(convexClient = null) {
    if (this.isInitialized) return true;
    
    try {
      // Use provided client or create new one
      if (convexClient) {
        this.convex = convexClient;
      } else {
        // Create our own Convex client
        const convexUrl = import.meta.env?.PUBLIC_CONVEX_URL || 
                         window.__CONVEX_URL__ ||
                         'http://127.0.0.1:3210';
        
        this.convex = new ConvexHttpClient(convexUrl);
        console.log('[BackendSimilarity] Created Convex client:', convexUrl);
      }
      
      // Dynamically import API
      const apiModule = await import('../../../../../convex/_generated/api.js');
      this.api = apiModule.api;
      
      this.isInitialized = true;
      console.log('[BackendSimilarity] ✅ Convex client connected');
      return true;
    } catch (error) {
      console.error('[BackendSimilarity] ❌ Failed to initialize:', error);
      return false;
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
    // Auto-initialize if needed
    if (!this.isInitialized) {
      await this.init();
    }
    
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
          perspectiveId: data.perspectiveId,
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
    if (!this.isInitialized) await this.init();
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
    if (!this.isInitialized) await this.init();
    
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
