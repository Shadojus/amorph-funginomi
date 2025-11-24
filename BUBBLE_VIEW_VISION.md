# 🫧 BUBBLE VIEW - System Vision & Architecture (Pixi.js Rewrite)

**Erstellt:** 23. November 2025  
**Status:** Architecture Planning Phase  
**Ziel:** Performance-optimierte Visualisierung mit Backend-Similarity & User Tracking

---

## 🎯 Vision

**BubbleView 2.0** ist eine **hochperformante, backend-getriebene Ähnlichkeitsvisualisierung**, die:

1. **User-Interaktionen trackt** - Jeder Click, Hover, Search wird im UserNode gespeichert
2. **Backend-basierte Similarity** - Hilbert-Space-Berechnungen im Convex Backend
3. **Pixi.js Rendering** - GPU-beschleunigte Canvas-Visualisierung (statt DOM/Canvas 2D)
4. **Event-driven Integration** - Nahtlose Integration mit Grid View, MorphHeader, Search System

### Warum Pixi.js?

**Canvas 2D ist zu langsam:**
- 100+ Bubbles = Frame Drops
- Jedes Frame: Clear → Redraw → Text → Connections
- CPU-basiert, kein Hardware-Beschleunigung

**Pixi.js Vorteile:**
- ✅ WebGL GPU-Rendering (10-100x schneller)
- ✅ Sprite-basiert (kein Full-Redraw)
- ✅ Effiziente Batch-Rendering
- ✅ Built-in Physics-Ready
- ✅ Text, Bilder, Partikel out-of-the-box
- ✅ Bereits installiert (`pixi.js ^8.0.0`)
- ✅ PixieRenderer.js bereits vorhanden (481 Zeilen, ready-to-use!)

---

## 🏗️ System Architecture

### Current System (Canvas 2D - To Replace)

```
┌─────────────────────────────────────────────────────────────────┐
│ fungi/index.astro (Page)                                        │
│  - Fetches entities from Convex                                 │
│  - Passes to BubbleHost                                         │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BubbleHost.js (Data Provider)                                   │
│  - Listens: convex-search:completed, perspective-changed        │
│  - Creates BubbleMorph elements (DOM)                           │
│  - Passes morphs to BubbleView                                  │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BubbleView.js (Canvas 2D Renderer) ❌ PROBLEM                   │
│  - 958 lines of manual Canvas drawing                           │
│  - Client-side HilbertSpaceSimilarity calculations              │
│  - Slow rendering loop (requestAnimationFrame)                  │
│  - Connection weight calculations on every frame                │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Canvas Reactors (Physics, Connections, UserNode)                │
│  - CanvasPhysicsReactor.js - Spring forces                      │
│  - CanvasConnectionReactor.js - Draw lines                      │
│  - CanvasUserNodeReactor.js - Central user node                 │
└──────────────────────────────────────────────────────────────────┘
```

### New System (Pixi.js + Backend Similarity)

```
┌─────────────────────────────────────────────────────────────────┐
│ fungi/index.astro (Page)                                        │
│  - Fetches entities from Convex                                 │
│  - Passes to BubbleHost                                         │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BubbleHost.js (Data Provider) ✅ KEEP                           │
│  - Listens: convex-search:completed, perspective-changed        │
│  - NO DOM morphs - sends data to BubbleView                     │
│  - Tracks user interactions → sends to Backend                  │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BubbleView.js (Pixi.js Coordinator) ✨ NEW                      │
│  - Uses PixieRenderer for GPU rendering                         │
│  - Receives similarity data from Backend                        │
│  - Updates UserNode interactions                                │
│  - Delegates rendering to PixieRenderer                         │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│ PixieRenderer.js (Pixi.js Wrapper) ✅ EXISTS                    │
│  - 481 lines already implemented!                               │
│  - renderNode() - Bubbles with images, text, badges             │
│  - renderConnection() - Lines between nodes                     │
│  - renderParticles() - Visual effects                           │
│  - Auto-resize, gradient support, glow effects                  │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CONVEX BACKEND ✨ NEW                                           │
│  - userInteractions.ts - Track clicks, hovers, searches         │
│  - calculateSimilarity.ts - Hilbert space calculations          │
│  - Returns: { similarities: Map<slug, Map<slug, score>> }       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Event Flow & Integration

### 1. Initialization Flow

```javascript
Page Load
  ↓
BubbleHost.connectedCallback()
  ↓
Listen to Events:
  - window.addEventListener('perspective-changed')
  - window.addEventListener('convex-search:completed')
  - amorph.on('amorph:astro-search:completed')
  ↓
BubbleView.init()
  ↓
PixieRenderer.init(containerElement)
  ↓
Create Pixi.js Application
  ↓
Ready for Data
```

### 2. Search Event Flow

```javascript
User types in MorphHeader
  ↓
ConvexSearchReactor (300ms debounce)
  ↓
POST /api/search → Convex advancedSearch
  ↓
Returns: { results, scores, matchedPerspectives }
  ↓
window.dispatchEvent('convex-search:completed')
  ↓
BubbleHost.handleSearchCompleted()
  ↓
Track interaction → Backend userInteractions.create()
  ↓
Request similarity from Backend
  ↓
BubbleView.updateBubbles(entities, similarities)
  ↓
PixieRenderer.renderNode() for each bubble
  ↓
PixieRenderer.renderConnection() for similarities
```

### 3. Perspective Change Flow

```javascript
User clicks Perspective in MorphHeader
  ↓
MorphHeader.dispatchPerspectiveChange()
  ↓
window.dispatchEvent('perspective-changed')
  ↓
BubbleHost.handlePerspectiveChanged()
  ↓
Track interaction → Backend userInteractions.create()
  ↓
Request similarity (perspective-weighted) from Backend
  ↓
BubbleView.updateBubbles(entities, similarities)
  ↓
PixieRenderer updates node colors & connections
```

### 4. User Interaction Flow

```javascript
User clicks Bubble
  ↓
Pixi.js Event: sprite.on('pointerdown')
  ↓
BubbleView.handleBubbleClick(slug)
  ↓
Track interaction → Backend userInteractions.create({
    type: 'bubble_click',
    entitySlug: slug,
    timestamp: Date.now()
  })
  ↓
Update UserNode.interactions[]
  ↓
Request updated similarity from Backend
  ↓
BubbleView.updateUserNodeConnections()
  ↓
PixieRenderer updates connection weights
```

---

## 📊 Data Structures

### UserNode Structure

```typescript
interface UserNode {
  x: number;                    // Fixed center position
  y: number;                    // Fixed center position
  size: number;                 // Visual size (smaller than bubbles)
  interactions: Interaction[];  // All user interactions
  searchQueries: string[];      // Recent searches
  activePerspectives: string[]; // Currently active perspectives
  selectedBubbles: string[];    // Recently clicked bubbles
  connections: Map<string, number>; // slug → weight (0-1)
}

interface Interaction {
  type: 'search' | 'perspective_change' | 'bubble_click' | 'bubble_hover';
  timestamp: number;
  data: {
    query?: string;
    perspectives?: string[];
    entitySlug?: string;
  };
}
```

### Bubble Structure (Pixi.js)

```typescript
interface BubbleData {
  slug: string;                 // Entity identifier
  label: string;                // Display name
  x: number;                    // Current position
  y: number;                    // Current position
  vx: number;                   // Velocity x (physics)
  vy: number;                   // Velocity y (physics)
  size: number;                 // Radius (based on similarity)
  color: { r: number; g: number; b: number }; // RGB color
  imageUrl?: string;            // Entity image
  data: Object;                 // Full entity data
  sprite?: PIXI.Sprite;         // Pixi.js sprite reference
}
```

### Similarity Structure (from Backend)

```typescript
interface SimilarityResponse {
  userNodeConnections: Map<string, number>; // slug → weight (0-1)
  bubbleSimilarities: Map<string, Map<string, number>>; // slug → slug → score
  metadata: {
    calculationTime: number;
    perspectivesUsed: string[];
    interactionsConsidered: number;
  };
}
```

---

## 🎨 Visual Design

### Bubble Appearance

**Size:**
- Min: 40px (low similarity)
- Max: 120px (high similarity to UserNode)
- UserNode: 60px (fixed, always visible)

**Color:**
- Perspective-based hue (from --perspective-color)
- Alpha based on connection strength
- Glow effect on hover/selection

**Layout:**
- Physics-based positioning (spring forces)
- UserNode at center (fixed)
- Bubbles orbit around UserNode
- Closer = higher similarity

### Connection Lines

**Thickness:**
- 1px (weak similarity < 0.3)
- 3px (medium similarity 0.3-0.6)
- 5px (strong similarity > 0.6)

**Color:**
- Gradient from UserNode color to Bubble color
- Alpha based on similarity strength

**Animation:**
- Pulse effect on user interaction
- Flow particles for active searches

---

## 🔧 Technical Requirements

### PixieRenderer.js - Already Implemented! ✅

**Existing Methods:**
- `init(containerElement)` - Initialize Pixi.js app
- `renderNode(id, options)` - Render bubble with image, text, badges
- `renderConnection(id, from, to, options)` - Draw connection lines
- `renderParticles(id, x, y, options)` - Visual effects
- `updateNode(id, updates)` - Update existing node
- `removeNode(id)` - Clean up node
- `clear()` - Clear all objects
- `resize()` - Auto-resize handling

**What We Need to Add:**
- Event handling (click, hover) → Pass to BubbleView
- Physics integration → Work with existing CanvasPhysicsReactor?
- Batch updates for performance

### Convex Backend - New Queries

**userInteractions.ts:**
```typescript
// Create interaction
export const create = mutation({
  args: {
    type: v.string(),
    entitySlug: v.optional(v.string()),
    query: v.optional(v.string()),
    perspectives: v.optional(v.array(v.string())),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('userInteractions', args);
  }
});

// Get recent interactions
export const getRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userInteractions')
      .order('desc')
      .take(args.limit);
  }
});
```

**calculateSimilarity.ts:**
```typescript
export const calculate = query({
  args: {
    activePerspectives: v.array(v.string()),
    userInteractions: v.array(v.id('userInteractions')),
    entitySlugs: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // 1. Fetch all entities
    // 2. Calculate Hilbert space similarities
    // 3. Weight by user interactions
    // 4. Return similarity matrix
  }
});
```

---

## 🚀 Implementation Plan

**Phase 1: Backend Setup** (Convex Queries)
- Create userInteractions table schema
- Implement create/getRecent mutations
- Implement calculateSimilarity query
- Test with existing data

**Phase 2: BubbleView Pixi.js Integration**
- Remove Canvas 2D rendering code
- Integrate PixieRenderer.js
- Convert bubble data to Pixi sprites
- Handle Pixi events → BubbleView

**Phase 3: User Tracking**
- Send interactions to Backend on every event
- Update UserNode.interactions array
- Request similarity updates from Backend

**Phase 4: Similarity Visualization**
- Render connections based on Backend data
- Update bubble sizes based on similarity
- Implement physics with similarity-based forces

**Phase 5: Polish & Optimization**
- Batch rendering updates
- Implement smooth transitions
- Add visual effects (glow, particles)
- Performance testing (100+ bubbles)

---

## 🎯 Success Metrics

**Performance:**
- ✅ 60 FPS with 100+ bubbles (Pixi.js)
- ✅ < 100ms similarity calculation (Backend)
- ✅ < 50ms interaction tracking (Backend)

**User Experience:**
- ✅ Smooth bubble movement (physics)
- ✅ Visual feedback on interactions
- ✅ Clear similarity representation
- ✅ Responsive to search/perspective changes

**Integration:**
- ✅ Works with Grid View toggle
- ✅ Syncs with MorphHeader
- ✅ Responds to Search System
- ✅ Tracks all user actions

---

## 📝 Next Steps

1. **READ:** `BUBBLE_VIEW_IMPLEMENTATION_GUIDE.md` - Detailed step-by-step instructions
2. **BACKEND:** Create Convex schemas and queries
3. **FRONTEND:** Integrate PixieRenderer into BubbleView
4. **TEST:** Verify event flow and performance
5. **OPTIMIZE:** Fine-tune physics and rendering
