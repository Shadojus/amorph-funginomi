# 🫧 BUBBLE VIEW FEATURE

**Last Updated:** 21. November 2025

## Overview

Complete BubbleView visualization system with Canvas rendering, physics simulation, user node connections, and relationship-focused bubble detail dialog.

## Structure

```
features/bubble-view/
├── BubbleView.js           # Main visualization component (970 lines)
├── BubbleHost.js           # Data host for bubbles
├── morphs/                 # Bubble-specific morphs (only what's needed)
│   ├── BubbleMorph.js      # Individual bubble component
│   ├── UserNode.js         # Central user node
│   ├── ConnectionMorph.js  # Connection visualization
│   └── tokens.js           # Local design tokens
├── reactors/               # All reactors (BubbleView + Visual)
│   ├── BubbleDetailReactor.js       # Detail dialog (relationship-focused)
│   ├── BubbleSearchReactor.js       # Search interaction
│   ├── CanvasConnectionReactor.js   # Connection line rendering
│   ├── CanvasPhysicsReactor.js      # Physics simulation
│   ├── CanvasReactor.js             # Base canvas reactor
│   ├── CanvasUserNodeReactor.js     # User node rendering
│   ├── GlowReactor.js               # Glow effects
│   ├── AnimationReactor.js          # Animations
│   ├── PulseReactor.js              # Pulsing effects
│   ├── HoverReactor.js              # Hover effects
│   ├── SortReactor.js               # Sorting
│   ├── FilterReactor.js             # Filtering
│   └── index.js                     # Reactor exports
├── services/               # Helper services
│   └── HilbertSpaceSimilarity.js    # Similarity calculations
└── CLAUDE.md              # This file
```

## Components

### BubbleView.js (~970 lines)
Main Canvas-based visualization component. Key features:
- **Canvas rendering** with native Canvas 2D (no Pixi.js)
- **User node system** with weighted connections at center (400, 300)
- **Responsive canvas** - fills container width/height
- **Size update pipeline** based on connection weights (lines 584-639)
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
- **Link to full detail page** (/fungi/[slug])

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
Calculates similarity between fungi using Hilbert space transformations. Used for:
- Connection weight calculation
- Bubble positioning
- Similarity matrix updates

**Features:**
- Perspective-aware similarity scoring
- Characteristic property weighting
- Multi-dimensional fungus comparison

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
