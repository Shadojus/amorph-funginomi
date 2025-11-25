# 🫧 BUBBLE VIEW FEATURE v2.0 - PIXI.JS REWRITE

**Last Updated:** 26. November 2025  
**Status:** ✅ COMPLETE REWRITE - Production Ready

## 🚀 v2.0 Highlights

**Complete architectural redesign with:**
- **Pixi.js GPU rendering** - 10-100x faster than Canvas 2D
- **Backend similarity calculations** - Offloaded to Convex for performance
- **Full user interaction tracking** - Search, clicks, hovers, perspective changes
- **50% code reduction** - 958 lines → 475 lines

## Overview

**Domain-agnostic similarity visualization system** with GPU-accelerated rendering, backend-powered similarity calculations, and comprehensive user interaction tracking.

**Framework Concept:** BubbleView visualisiert **Ähnlichkeitsbeziehungen zwischen Entitäten**. Es funktioniert mit beliebigen strukturierten Daten - Produkte, Personen, Papers, Locations, etc. Die Hilbert-Space-Similarity berechnet Distanzen basierend auf gemeinsamen Properties, unabhängig von der Domäne.

**Key Principle:** Das System zeigt **"WHY entities are connected"** (gemeinsame Eigenschaften, Ähnlichkeiten), nicht "comprehensive data dumps". Die Detail-Ansicht fokussiert auf Beziehungen, nicht auf alle Datenfelder.

**NEW in v2.0:** Alle Ähnlichkeitsberechnungen erfolgen im Backend (Convex). User-Interaktionen werden persistiert und fließen in Similarity-Scores ein. GPU-Rendering ermöglicht 100+ Bubbles bei 60 FPS.

## Structure (v2.0)

```
features/bubble-view/
├── BubbleView.js           # 🆕 Main Pixi.js component (475 lines, -50%)
├── BubbleView.OLD.js       # Backup of Canvas 2D version (958 lines)
├── BubbleHost.js           # Data host for bubbles
├── morphs/                 # Bubble-specific morphs
│   ├── BubbleMorph.js      # Individual bubble component
│   ├── UserNode.js         # Central user node
│   ├── ConnectionMorph.js  # Connection visualization
│   └── tokens.js           # Local design tokens
├── reactors/               # Reactors (compatible with v2.0)
│   ├── BubbleDetailReactor.js       # Detail dialog
│   ├── BubbleSearchReactor.js       # Search interaction
│   ├── CanvasConnectionReactor.js   # ⚠️ Legacy (can be removed)
│   ├── CanvasPhysicsReactor.js      # ⚠️ Legacy (can be removed)
│   ├── CanvasReactor.js             # ⚠️ Legacy (can be removed)
│   ├── CanvasUserNodeReactor.js     # ⚠️ Legacy (can be removed)
│   ├── GlowReactor.js               # ✅ Still used for effects
│   ├── AnimationReactor.js          # ✅ Still used
│   ├── PulseReactor.js              # ✅ Still used
│   ├── HoverReactor.js              # ✅ Still used
│   ├── SortReactor.js               # ✅ Still used
│   ├── FilterReactor.js             # ✅ Still used
│   └── index.js                     # Reactor exports
├── services/               # 🆕 Enhanced services
│   ├── HilbertSpaceSimilarity.js    # Client-side similarity (legacy)
│   └── BackendSimilarity.js         # 🆕 Convex API wrapper
└── CLAUDE.md              # This file

🔗 Backend (Convex):
├── userInteractions.ts     # 🆕 User interaction API
├── calculateSimilarity.ts  # 🆕 Backend similarity engine
└── schema.ts               # 🆕 userInteractions table
```

## Components

### 🆕 BubbleView.js (v2.0 - 475 lines)
**Complete Pixi.js rewrite** with backend integration:
- **GPU rendering** via PixieRenderer.js (Pixi.js ^8.0.0)
- **Backend similarity** from Convex calculateSimilarity query
- **Interaction tracking** - All user actions persisted to Convex
- **User node system** with weighted connections (dynamic center)
- **Event-driven** - Click, hover, drag via Pixi.js eventMode
- **Responsive** - Auto-resize with canvas dimensions
- **Performance** - Target 60 FPS with 100+ bubbles
- **Search integration** via ConvexSearchReactor events
- **Similarity matrix** calculations with HilbertSpaceSimilarity
- **Physics simulation** via CanvasPhysicsReactor (getAllNodes method)
- **Connection weight calculation** (Search 70%, Perspective 20%, Interaction 10%, Base 0.1)
- **Size range** 50-100px on mobile (358px), 60-120px on desktop (800px+)
- **Perspective-aware connections** - updates on perspective changes

### BubbleHost.js
Data provider for BubbleView. Creates morphs from Convex data and manages bubble lifecycle.

### BubbleMorph.js
Individual bubble component with:
- Reactive size property (Lit Web Component)
- Perspective-aware styling
- Hover and interaction states
- Integration with BubbleView canvas system

## Reactors

### BubbleDetailReactor.js (~487 lines)
**Relationship-focused bubble detail dialog**. Shows connections and key facts instead of raw data dump.

**Features:**
- **Window-level event handling** via window.addEventListener('bubble:clicked')
- **Connection strength display** - Shows UserNode similarity score with classification:
  - Stark: > 50%
  - Mittel: ≥ 30%
  - Schwach: < 30%
- **Connected bubbles list** - Shows bubble-to-bubble similarity scores
- **Key facts extraction** - 5 properties from active perspectives with icons:
  - 🍄 Edibility (always shown if available)
  - 🌱 Cultivation difficulty
  - ⚕️ Health benefits
  - 🍳 Flavor profile
  - 🧪 Chemical compounds
- **Wood floor background** with gradient overlay
- **Link to full detail page** (/[collection]/[slug])

**Design Philosophy:**
BubbleView dialog explains WHY bubbles are connected and shows relationships, NOT comprehensive data (that's GridView's job).

### BubbleSearchReactor.js
Manages search-related bubble highlighting and filtering via ConvexSearchReactor events.

### CanvasConnectionReactor.js
Draws curved connection lines between bubbles and UserNode. Features:
- Quadratic curves with control point offset
- Line width 1-8px based on similarity
- Opacity 0.2-1.0 based on connection strength
- Blue connections (#3B82F6) for all types

### CanvasPhysicsReactor.js
**Physics simulation with spring forces and collision detection.**

**Critical Method:**
```javascript
getAllNodes() {
  const bubbles = this.getBubbles();
  const queryNodes = this.getQueryNodes();
  const combined = new Map([...bubbles, ...queryNodes]);
  return Array.from(combined.entries());
}
```
**IMPORTANT:** UserNode is NEVER included in physics simulation - it stays fixed at canvas center.

**Physics Parameters:**
- Spring strength: 0.005
- Damping: 0.95
- Collision strength: 0.1
- User node gravity: 0.02

### CanvasReactor.js
Base canvas reactor providing core rendering loop and helper methods.

### CanvasUserNodeReactor.js
Renders central user node with weighted connection lines to all bubbles.
- **Fixed position** at canvas center
- **Size** 53px fixed
- **Connection threshold** 0.3 (only shows strong connections)
- **Max connections** 8 visible lines

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry & Event Coordination
- `./morphs/UserNode.js` - User node morph (feature-local)
- `./morphs/tokens.js` - Design tokens (feature-local)

**Used by:**
- `../../../pages/[slug].astro` - Astro page integration
- `BubbleHost.js` - Data provider

**See also:**
- `../../core/observers/` - Event handling (MorphObserver, ReactorObserver)
- `../perspective-system/` - Perspective filtering

---

## Services

### HilbertSpaceSimilarity.js
Calculates similarity between entities using Hilbert space transformations. Used for:
- Connection weight calculation
- Bubble positioning
- Similarity matrix updates

**Features:**
- Perspective-aware similarity scoring
- Characteristic property weighting
- Multi-dimensional entity comparison

## Usage

```javascript
// Import BubbleView
import '../features/bubble-view/BubbleView.js';

// Use in HTML
<bubble-host>
  <bubble-view></bubble-view>
</bubble-host>
```

## Dependencies

- **Shared Reactors**: Sort, Filter, Hover
- **Shared Morphs**: All data morphs
- **Core**: AmorphSystem, PixieRenderer
