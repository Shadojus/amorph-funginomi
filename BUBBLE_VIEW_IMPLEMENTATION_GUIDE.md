# 🛠️ BUBBLE VIEW - Implementation Guide (Pixi.js Rewrite)

**Erstellt:** 23. November 2025  
**Status:** Step-by-Step Implementation Instructions  
**Prerequisite:** Read `BUBBLE_VIEW_VISION.md` first!

---

## 📋 Overview

This guide provides **detailed step-by-step instructions** for rewriting BubbleView with:
1. **Pixi.js** for GPU-accelerated rendering
2. **Backend similarity calculations** in Convex
3. **User interaction tracking** in Backend

**Estimated Time:** 6-8 hours  
**Complexity:** Medium-High (Pixi.js integration + Backend queries)

---

## 🎯 Goals

- ✅ Replace Canvas 2D with Pixi.js (10-100x faster)
- ✅ Move similarity calculations to Backend (offload client)
- ✅ Track ALL user interactions (search, clicks, perspectives)
- ✅ Maintain full integration with Grid View, MorphHeader, Search

---

## 📁 Files to Modify/Create

### Modify:
- `src/amorph/features/bubble-view/BubbleView.js` - Complete rewrite with Pixi.js
- `src/amorph/features/bubble-view/BubbleHost.js` - Add interaction tracking
- `src/amorph/core/PixieRenderer.js` - Add event handling methods

### Create:
- `convex/userInteractions.ts` - User interaction storage & queries
- `convex/calculateSimilarity.ts` - Backend similarity calculations
- `src/amorph/features/bubble-view/services/BackendSimilarity.js` - Frontend API wrapper

### Keep Unchanged:
- `src/amorph/features/bubble-view/services/HilbertSpaceSimilarity.js` - Backend will use this logic
- Canvas Reactors (Physics, Connection, UserNode) - Can be adapted or removed

---

## 🔧 Phase 1: Backend Setup (Convex)

### Step 1.1: Create User Interactions Schema

**File:** `convex/schema.ts`

Add to existing schema:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... existing tables ...
  
  userInteractions: defineTable({
    type: v.string(), // 'search', 'bubble_click', 'bubble_hover', 'perspective_change'
    entitySlug: v.optional(v.string()), // Entity interacted with (if applicable)
    query: v.optional(v.string()), // Search query (if type === 'search')
    perspectives: v.optional(v.array(v.string())), // Active perspectives
    timestamp: v.number(), // Unix timestamp
    sessionId: v.optional(v.string()), // Browser session ID
    metadata: v.optional(v.any()) // Additional data (scores, durations, etc.)
  })
    .index('by_timestamp', ['timestamp'])
    .index('by_entity', ['entitySlug'])
    .index('by_type', ['type'])
    .index('by_session', ['sessionId'])
});
```

**Test:** Run `npx convex dev` - Schema should update without errors.

---

### Step 1.2: Create User Interactions Mutations

**File:** `convex/userInteractions.ts` (NEW)

```typescript
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
    perspectives: v.optional(v.array(v.string())),
    timestamp: v.number(),
    sessionId: v.optional(v.string()),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const interactionId = await ctx.db.insert('userInteractions', {
      type: args.type,
      entitySlug: args.entitySlug,
      query: args.query,
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
    let interactions = ctx.db
      .query('userInteractions')
      .order('desc');
    
    if (args.sessionId) {
      interactions = interactions.filter(q => 
        q.eq(q.field('sessionId'), args.sessionId)
      );
    }
    
    return await interactions.take(args.limit);
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
```

**Test:** 
```bash
npx convex run userInteractions:create '{
  "type": "search",
  "query": "test",
  "timestamp": 1700000000000
}'
```

---

### Step 1.3: Create Similarity Calculation Query

**File:** `convex/calculateSimilarity.ts` (NEW)

```typescript
import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Calculate similarity between entities based on Hilbert space
 * Uses HilbertSpaceSimilarity logic server-side
 */
export const calculate = query({
  args: {
    entitySlugs: v.array(v.string()), // Entities to calculate for
    activePerspectives: v.array(v.string()), // Current perspectives
    userInteractionIds: v.optional(v.array(v.id('userInteractions'))), // Recent interactions
    includeUserNode: v.optional(v.boolean()) // Calculate UserNode connections
  },
  handler: async (ctx, args) => {
    // Fetch all entities
    const entities = await Promise.all(
      args.entitySlugs.map(slug => 
        ctx.db
          .query('fungi')
          .filter(q => q.eq(q.field('slug'), slug))
          .first()
      )
    );
    
    const validEntities = entities.filter(e => e !== null);
    
    if (validEntities.length === 0) {
      return {
        userNodeConnections: {},
        bubbleSimilarities: {},
        metadata: { calculationTime: 0, entitiesProcessed: 0 }
      };
    }
    
    const startTime = Date.now();
    
    // Map perspective names to schema fields
    const perspectiveMapping: Record<string, string> = {
      'taxonomy': 'taxonomy',
      'physicalCharacteristics': 'physicalCharacteristics',
      'ecologyAndHabitat': 'ecologyAndHabitat',
      'culinaryAndNutritional': 'culinaryAndNutritional',
      'medicinalAndHealth': 'medicinalAndHealth',
      'cultivationAndProcessing': 'cultivationAndProcessing',
      'safetyAndIdentification': 'safetyAndIdentification',
      'chemicalAndProperties': 'chemicalAndProperties',
      'culturalAndHistorical': 'culturalAndHistorical',
      'commercialAndMarket': 'commercialAndMarket',
      'environmentalAndConservation': 'environmentalAndConservation',
      'researchAndInnovation': 'researchAndInnovation'
    };
    
    const perspectiveFields = args.activePerspectives
      .map(p => perspectiveMapping[p])
      .filter(Boolean);
    
    // Calculate UserNode connections (based on interactions + perspective relevance)
    const userNodeConnections: Record<string, number> = {};
    
    if (args.includeUserNode && args.userInteractionIds) {
      // Fetch interactions
      const interactions = await Promise.all(
        args.userInteractionIds.map(id => ctx.db.get(id))
      );
      
      const interactionMap = new Map<string, number>();
      interactions.forEach(interaction => {
        if (interaction && interaction.entitySlug) {
          interactionMap.set(
            interaction.entitySlug,
            (interactionMap.get(interaction.entitySlug) || 0) + 1
          );
        }
      });
      
      // Calculate connection weight for each entity
      validEntities.forEach(entity => {
        if (!entity) return;
        
        let weight = 0.1; // Base weight
        
        // Interaction weight (30%)
        const interactionCount = interactionMap.get(entity.slug) || 0;
        if (interactionCount > 0) {
          weight += Math.min(0.3, interactionCount * 0.1);
        }
        
        // Perspective data quality (70%)
        let perspectiveScore = 0;
        perspectiveFields.forEach(field => {
          const data = entity[field as keyof typeof entity];
          if (data && typeof data === 'object') {
            const fieldCount = Object.values(data).filter(v => 
              v !== null && v !== undefined && v !== ''
            ).length;
            if (fieldCount > 0) perspectiveScore += 1;
          }
        });
        
        if (perspectiveFields.length > 0) {
          weight += (perspectiveScore / perspectiveFields.length) * 0.7;
        }
        
        userNodeConnections[entity.slug] = Math.min(1.0, weight);
      });
    }
    
    // Calculate bubble-to-bubble similarities
    const bubbleSimilarities: Record<string, Record<string, number>> = {};
    
    for (let i = 0; i < validEntities.length; i++) {
      const entity1 = validEntities[i];
      if (!entity1) continue;
      
      bubbleSimilarities[entity1.slug] = {};
      
      for (let j = i + 1; j < validEntities.length; j++) {
        const entity2 = validEntities[j];
        if (!entity2) continue;
        
        // Calculate similarity based on active perspectives
        let totalSimilarity = 0;
        let comparedFields = 0;
        
        perspectiveFields.forEach(field => {
          const data1 = entity1[field as keyof typeof entity1];
          const data2 = entity2[field as keyof typeof entity2];
          
          if (!data1 || !data2) return;
          
          // Compare perspective data
          const similarity = comparePerspectiveData(data1, data2);
          totalSimilarity += similarity;
          comparedFields++;
        });
        
        const score = comparedFields > 0 ? totalSimilarity / comparedFields : 0;
        
        // Store bidirectional
        bubbleSimilarities[entity1.slug][entity2.slug] = score;
        if (!bubbleSimilarities[entity2.slug]) {
          bubbleSimilarities[entity2.slug] = {};
        }
        bubbleSimilarities[entity2.slug][entity1.slug] = score;
      }
    }
    
    const calculationTime = Date.now() - startTime;
    
    return {
      userNodeConnections,
      bubbleSimilarities,
      metadata: {
        calculationTime,
        entitiesProcessed: validEntities.length,
        perspectivesUsed: args.activePerspectives,
        interactionsConsidered: args.userInteractionIds?.length || 0
      }
    };
  }
});

/**
 * Compare two perspective data objects
 */
function comparePerspectiveData(data1: any, data2: any): number {
  if (!data1 || !data2) return 0;
  
  let matches = 0;
  let totalFields = 0;
  
  const fields = new Set([
    ...Object.keys(data1),
    ...Object.keys(data2)
  ]);
  
  for (const field of fields) {
    const value1 = data1[field];
    const value2 = data2[field];
    
    if (value1 === undefined && value2 === undefined) continue;
    
    totalFields++;
    
    // Compare values (simplified - same logic as HilbertSpaceSimilarity)
    if (Array.isArray(value1) && Array.isArray(value2)) {
      const commonElements = value1.filter(v => value2.includes(v));
      if (commonElements.length > 0) matches++;
    } else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
      // Nested object comparison
      const nestedSimilarity = comparePerspectiveData(value1, value2);
      if (nestedSimilarity > 0.5) matches++;
    } else if (value1 === value2) {
      matches++;
    }
  }
  
  return totalFields > 0 ? matches / totalFields : 0;
}
```

**Test:**
```bash
npx convex run calculateSimilarity:calculate '{
  "entitySlugs": ["agaricus-subrufescens"],
  "activePerspectives": ["cultivation", "culinary"],
  "includeUserNode": true
}'
```

---

## 🎨 Phase 2: Frontend API Wrapper

### Step 2.1: Create Backend Similarity Service

**File:** `src/amorph/features/bubble-view/services/BackendSimilarity.js` (NEW)

```typescript
/**
 * 🔗 BACKEND SIMILARITY API
 * 
 * Wrapper for Convex backend similarity calculations
 */

export class BackendSimilarity {
  constructor() {
    this.convex = null;
    this.sessionId = this.generateSessionId();
  }
  
  /**
   * Initialize with Convex client
   */
  init(convexClient) {
    this.convex = convexClient;
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
    if (!this.convex) {
      console.warn('[BackendSimilarity] Convex not initialized');
      return null;
    }
    
    try {
      const interactionId = await this.convex.mutation(
        api.userInteractions.create,
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
    if (!this.convex) return [];
    
    try {
      return await this.convex.query(
        api.userInteractions.getRecent,
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
    if (!this.convex) {
      console.warn('[BackendSimilarity] Convex not initialized');
      return null;
    }
    
    try {
      // Get recent interactions for UserNode context
      const recentInteractions = await this.getRecentInteractions(50);
      const interactionIds = recentInteractions.map(i => i._id);
      
      // Call backend similarity calculation
      const result = await this.convex.query(
        api.calculateSimilarity.calculate,
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
    if (!this.convex) return null;
    
    try {
      return await this.convex.query(
        api.userInteractions.getStats,
        { sessionId: this.sessionId }
      );
    } catch (error) {
      console.error('[BackendSimilarity] Failed to get stats:', error);
      return null;
    }
  }
}
```

**Usage Example:**
```javascript
const backendSimilarity = new BackendSimilarity();
backendSimilarity.init(convexClient);

// Track search
await backendSimilarity.trackInteraction('search', {
  query: 'agaricus',
  perspectives: ['culinary', 'medicinal']
});

// Calculate similarities
const result = await backendSimilarity.calculateSimilarities(
  ['agaricus-subrufescens', 'pleurotus-ostreatus'],
  ['culinary', 'medicinal']
);
```

---

## 🫧 Phase 3: BubbleView Pixi.js Rewrite

### Step 3.1: Update PixieRenderer with Event Handling

**File:** `src/amorph/core/PixieRenderer.js`

Add these methods after existing renderNode():

```javascript
/**
 * Enable interactive events on a node
 */
enableNodeInteraction(id, callbacks = {}) {
  const container = this.nodes.get(id);
  if (!container) {
    console.warn(`[PixieRenderer] Node ${id} not found for interaction`);
    return false;
  }
  
  // Make interactive
  container.eventMode = 'static';
  container.cursor = 'pointer';
  
  // Attach event listeners
  if (callbacks.onClick) {
    container.on('pointerdown', (event) => {
      callbacks.onClick(id, event);
    });
  }
  
  if (callbacks.onHover) {
    container.on('pointerover', (event) => {
      callbacks.onHover(id, true, event);
    });
    container.on('pointerout', (event) => {
      callbacks.onHover(id, false, event);
    });
  }
  
  if (callbacks.onDrag) {
    let dragData = null;
    
    container.on('pointerdown', (event) => {
      dragData = {
        startX: event.global.x,
        startY: event.global.y,
        nodeX: container.x,
        nodeY: container.y
      };
      callbacks.onDrag(id, 'start', dragData, event);
    });
    
    container.on('pointermove', (event) => {
      if (dragData) {
        const dx = event.global.x - dragData.startX;
        const dy = event.global.y - dragData.startY;
        container.x = dragData.nodeX + dx;
        container.y = dragData.nodeY + dy;
        callbacks.onDrag(id, 'move', { x: container.x, y: container.y }, event);
      }
    });
    
    container.on('pointerup', (event) => {
      if (dragData) {
        callbacks.onDrag(id, 'end', { x: container.x, y: container.y }, event);
        dragData = null;
      }
    });
    
    container.on('pointerupoutside', (event) => {
      if (dragData) {
        callbacks.onDrag(id, 'end', { x: container.x, y: container.y }, event);
        dragData = null;
      }
    });
  }
  
  return true;
}

/**
 * Get all node positions (for physics)
 */
getAllNodePositions() {
  const positions = new Map();
  
  this.nodes.forEach((container, id) => {
    positions.set(id, {
      x: container.x,
      y: container.y
    });
  });
  
  return positions;
}

/**
 * Batch update node positions (performance!)
 */
batchUpdatePositions(updates) {
  updates.forEach((position, id) => {
    const container = this.nodes.get(id);
    if (container) {
      container.x = position.x;
      container.y = position.y;
    }
  });
}
```

---

### Step 3.2: Rewrite BubbleView.js

**File:** `src/amorph/features/bubble-view/BubbleView.js`

**COMPLETE REWRITE - See next file block**

```javascript
/**
 * 🫧 BUBBLE VIEW - PIXI.JS REWRITE
 * ================================
 * 
 * High-performance GPU-accelerated visualization with:
 * - Pixi.js rendering (PixieRenderer)
 * - Backend similarity calculations (Convex)
 * - User interaction tracking (Backend)
 */

import { LitElement, html, css } from 'lit';
import { PixieRenderer } from '../../core/PixieRenderer.js';
import { BackendSimilarity } from './services/BackendSimilarity.js';

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
    
    // Data structures
    this.bubbles = new Map(); // slug -> bubble data
    this.cachedEntityData = new Map(); // slug -> full entity
    this.activePerspectives = [];
    this.currentSearchQuery = '';
    
    // User Node
    this.userNodeData = {
      x: 400,
      y: 300,
      size: 60,
      connections: new Map() // slug -> weight
    };
    
    console.log('[BubbleView] Initialized with Pixi.js');
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH & Convex
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
      
      // Initialize backend similarity
      if (this.amorph.convex) {
        this.backendSimilarity.init(this.amorph.convex);
      }
    }

    // Listen for events
    this._boundPerspectiveHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundPerspectiveHandler);
    
    this._boundSearchHandler = this.handleSearchComplete.bind(this);
    window.addEventListener('convex-search:completed', this._boundSearchHandler);
    
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
      this.setupResize();
      this.startRenderLoop();
    } else {
      console.error('[BubbleView] ❌ Pixi.js init failed');
    }
  }

  setupResize() {
    // Update UserNode position on resize
    const updateUserNode = () => {
      const width = this.offsetWidth || 800;
      const height = this.offsetHeight || 600;
      this.userNodeData.x = width / 2;
      this.userNodeData.y = height / 2;
      
      if (this.bubbles.has('user-node')) {
        this.pixieRenderer.updateNode('user-node', {
          x: this.userNodeData.x,
          y: this.userNodeData.y
        });
      }
    };
    
    window.addEventListener('resize', updateUserNode);
    updateUserNode();
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
   * Handle search complete
   */
  async handleSearchComplete(event) {
    const { results, query } = event.detail || {};
    
    if (!results || results.length === 0) {
      console.log('[BubbleView] Search returned no results');
      return;
    }
    
    this.currentSearchQuery = query;
    
    console.log('[BubbleView] 🔍 Search completed:', {
      query,
      results: results.length
    });
    
    // Track search
    await this.backendSimilarity.trackInteraction('search', {
      query,
      perspectives: this.activePerspectives
    });
    
    // Update bubbles with search results
    await this.setEntitiesData(results);
  }

  /**
   * Set entities data and render bubbles
   */
  async setEntitiesData(entities) {
    if (!entities || entities.length === 0) return;
    
    console.log(`[BubbleView] 📊 Setting ${entities.length} entities`);
    
    // Cache entity data
    this.cachedEntityData.clear();
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'slug';
    entities.forEach(entity => {
      if (entity[slugField]) {
        this.cachedEntityData.set(entity[slugField], entity);
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
    
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'slug';
    const nameField = window.amorph?.domainConfig?.dataSource?.nameField || 'commonName';
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const slug = entity[slugField];
      const label = entity[nameField] || slug;
      
      // Calculate initial position (circle layout)
      const angle = (i / entities.length) * Math.PI * 2;
      const x = this.userNodeData.x + Math.cos(angle) * radius;
      const y = this.userNodeData.y + Math.sin(angle) * radius;
      
      // Store bubble data
      this.bubbles.set(slug, {
        slug,
        label,
        x,
        y,
        size: 80,
        color: 0x10b981, // Green default
        data: entity
      });
      
      // Render bubble
      await this.pixieRenderer.renderNode(slug, {
        x,
        y,
        radius: 40,
        color: 0x10b981,
        borderWidth: 2,
        borderColor: 0xffffff,
        label: label.length > 20 ? label.substring(0, 17) + '...' : label
      });
      
      // Enable interactions
      this.pixieRenderer.enableNodeInteraction(slug, {
        onClick: (id) => this.handleBubbleClick(id),
        onHover: (id, isHovering) => this.handleBubbleHover(id, isHovering)
      });
    }
    
    console.log(`[BubbleView] ✅ Rendered ${entities.length} bubbles`);
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
      
      this.pixieRenderer.renderConnection(connectionId, 'user-node', slug, {
        color: 0x3b82f6,
        alpha: weight,
        width: Math.max(1, weight * 5),
        curve: 0.3
      });
    });
    
    console.log('[BubbleView] ✅ Rendered UserNode connections');
  }

  /**
   * Handle bubble click
   */
  async handleBubbleClick(slug) {
    console.log('[BubbleView] 🖱️ Bubble clicked:', slug);
    
    // Track interaction
    await this.backendSimilarity.trackInteraction('bubble_click', {
      entitySlug: slug
    });
    
    // Open detail dialog (BubbleDetailReactor handles this)
    window.dispatchEvent(new CustomEvent('bubble:clicked', {
      detail: { slug }
    }));
    
    // Recalculate similarities (click increases weight)
    await this.updateSimilarities();
  }

  /**
   * Handle bubble hover
   */
  async handleBubbleHover(slug, isHovering) {
    if (isHovering) {
      // Add glow effect
      this.pixieRenderer.updateNode(slug, {
        glowRadius: 15,
        glowColor: 0x10b981,
        glowAlpha: 0.6
      });
      
      // Track hover (throttled)
      if (!this._lastHoverTrack || Date.now() - this._lastHoverTrack > 2000) {
        await this.backendSimilarity.trackInteraction('bubble_hover', {
          entitySlug: slug
        });
        this._lastHoverTrack = Date.now();
      }
    } else {
      // Remove glow
      this.pixieRenderer.updateNode(slug, {
        glowRadius: 0
      });
    }
  }

  render() {
    return html`
      <div class="pixi-container"></div>
    `;
  }
}

customElements.define('bubble-view', BubbleView);
```

---

## ✅ Phase 4: Testing & Verification

### Test 1: Backend Interaction Tracking

```javascript
// In browser console
const backendSim = new BackendSimilarity();
backendSim.init(window.amorph.convex);

// Track search
await backendSim.trackInteraction('search', { query: 'agaricus' });

// Get stats
const stats = await backendSim.getStats();
console.log('Stats:', stats);
```

### Test 2: Similarity Calculation

```javascript
// In browser console
const result = await backendSim.calculateSimilarities(
  ['agaricus-subrufescens'],
  ['culinary', 'medicinal']
);
console.log('Similarities:', result);
```

### Test 3: Pixi.js Rendering

1. Open page with BubbleView
2. Check console for: `✅ Pixi.js initialized`
3. Verify bubbles render in circular layout
4. Click bubble → should see: `🖱️ Bubble clicked`
5. Check Convex dashboard → userInteractions table should have new entries

---

## 🚀 Phase 5: Optimization & Polish

### Performance Targets

- [ ] 60 FPS with 100+ bubbles
- [ ] < 100ms backend similarity calculation
- [ ] < 50ms interaction tracking
- [ ] Smooth transitions on perspective changes

### Visual Polish

- [ ] Add particle effects on user interactions
- [ ] Implement smooth bubble animations (spring physics)
- [ ] Add connection flow animations
- [ ] Implement bubble shadows and depth

### Integration Polish

- [ ] Sync with Grid View toggle
- [ ] Preserve zoom/pan state
- [ ] Add minimap for navigation
- [ ] Implement search result highlighting

---

## 📝 Summary Checklist

**Backend (Convex):**
- [ ] Create userInteractions schema
- [ ] Implement userInteractions mutations
- [ ] Implement calculateSimilarity query
- [ ] Test with sample data

**Frontend:**
- [ ] Create BackendSimilarity service
- [ ] Update PixieRenderer with event handling
- [ ] Rewrite BubbleView with Pixi.js
- [ ] Remove old Canvas 2D code
- [ ] Test interaction tracking
- [ ] Test similarity visualization

**Integration:**
- [ ] Verify perspective change updates
- [ ] Verify search integration
- [ ] Verify Grid View toggle
- [ ] Verify detail dialog opens

**Performance:**
- [ ] Test with 100+ bubbles
- [ ] Measure frame rate
- [ ] Measure backend response times
- [ ] Optimize rendering if needed

---

## 🎉 Success!

If all tests pass, you now have:
- ✅ GPU-accelerated Pixi.js visualization
- ✅ Backend similarity calculations
- ✅ Complete user interaction tracking
- ✅ Smooth integration with existing system

**Next:** Consider adding advanced features like:
- Physics-based layout (forces, collision)
- Advanced visual effects (particles, trails)
- Time-based decay of interactions
- Collaborative features (multi-user)
