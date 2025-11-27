/**
 * 🎯 USER INTERACTIONS API
 * =======================
 * 
 * Tracks all user interactions for BubbleView similarity calculations
 * - Search queries
 * - Bubble clicks & hovers
 * - Perspective changes
 * 
 * Created: 23. November 2025
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new user interaction
 */
export const create = mutation({
  args: {
    type: v.string(),
    entitySlug: v.optional(v.string()),
    query: v.optional(v.string()),
    perspectiveId: v.optional(v.string()),
    perspectives: v.optional(v.array(v.string())), // Active perspectives array
    timestamp: v.number(),
    sessionId: v.optional(v.string()),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const interactionId = await ctx.db.insert('userInteractions', {
      type: args.type,
      entitySlug: args.entitySlug,
      query: args.query,
      perspectiveId: args.perspectiveId,
      perspectives: args.perspectives,
      timestamp: args.timestamp,
      sessionId: args.sessionId,
      metadata: args.metadata
    });
    
    return interactionId;
  }
});

/**
 * Get recent interactions (for UserNode state)
 */
export const getRecent = query({
  args: {
    limit: v.number(),
    sessionId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('userInteractions').order('desc');
    
    if (args.sessionId) {
      query = query.filter(q => 
        q.eq(q.field('sessionId'), args.sessionId)
      );
    }
    
    return await query.take(args.limit);
  }
});

/**
 * Get interactions by entity slug
 */
export const getByEntity = query({
  args: {
    entitySlug: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userInteractions')
      .withIndex('by_entity', q => q.eq('entitySlug', args.entitySlug))
      .order('desc')
      .take(args.limit || 50);
  }
});

/**
 * Get interaction statistics
 */
export const getStats = query({
  args: {
    sessionId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('userInteractions');
    
    if (args.sessionId) {
      query = query.filter(q => q.eq(q.field('sessionId'), args.sessionId));
    }
    
    const interactions = await query.collect();
    
    // Calculate stats
    const stats = {
      total: interactions.length,
      byType: {} as Record<string, number>,
      recentSearches: [] as string[],
      mostInteractedEntities: [] as { slug: string; count: number }[]
    };
    
    const entityCounts = new Map<string, number>();
    
    interactions.forEach(interaction => {
      // Count by type
      stats.byType[interaction.type] = (stats.byType[interaction.type] || 0) + 1;
      
      // Collect searches
      if (interaction.type === 'search' && interaction.query) {
        stats.recentSearches.push(interaction.query);
      }
      
      // Count entity interactions
      if (interaction.entitySlug) {
        entityCounts.set(
          interaction.entitySlug,
          (entityCounts.get(interaction.entitySlug) || 0) + 1
        );
      }
    });
    
    // Sort entities by interaction count
    stats.mostInteractedEntities = Array.from(entityCounts.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Keep only last 10 searches
    stats.recentSearches = stats.recentSearches.slice(-10);
    
    return stats;
  }
});
