# 🫧 BUBBLE VIEW FEATURE

**Last Updated:** 19. November 2025

## Overview

Complete BubbleView visualization system with Canvas rendering, physics simulation, and user node connections.

## Structure

```
features/bubble-view/
├── BubbleView.js           # Main visualization component (913 lines)
├── BubbleHost.js           # Data host for bubbles
├── morphs/                 # Bubble-specific morphs
│   └── BubbleMorph.js      # Individual bubble component
├── reactors/               # BubbleView-specific reactors
│   ├── BubbleDetailReactor.js       # Detail view handling
│   ├── BubbleSearchReactor.js       # Search interaction
│   ├── CanvasConnectionReactor.js   # Connection line rendering
│   ├── CanvasPhysicsReactor.js      # Physics simulation
│   ├── CanvasReactor.js             # Base canvas reactor
│   ├── CanvasUserNodeReactor.js     # User node rendering
│   └── index.js                     # Reactor exports
├── services/               # Helper services
│   └── HilbertSpaceSimilarity.js    # Similarity calculations
└── CLAUDE.md              # This file
```

## Components

### BubbleView.js (913 lines)
Main Canvas-based visualization component. Key features:
- **Canvas rendering** with Pixi.js integration
- **User node system** with weighted connections (lines 406-514)
- **Size update pipeline** based on connection weights (lines 516-548)
- **Search integration** via 'amorph:astro-search:completed' event (lines 631-695)
- **Similarity matrix** calculations (HilbertSpaceSimilarity)
- **Physics simulation** with spring forces and collision detection
- **Connection weight calculation** (Search 70%, Perspective 20%, Interaction 10%, Base 0.1)
- **Size range** 60-140px based on normalized weights

### BubbleHost.js
Data provider for BubbleView. Creates morphs from Convex data and manages bubble lifecycle.

### BubbleMorph.js
Individual bubble component with:
- Reactive size property (Lit Web Component)
- Perspective-aware styling
- Hover and interaction states
- Integration with BubbleView canvas system

## Reactors

### BubbleDetailReactor.js
Handles bubble detail view interactions and transitions.

### BubbleSearchReactor.js
Manages search-related bubble highlighting and filtering.

### CanvasConnectionReactor.js
Draws Bezier curve connection lines with weight badges between bubbles. Type-specific colors.

### CanvasPhysicsReactor.js
Physics simulation with spring forces (damping: 0.98) and collision detection.

### CanvasReactor.js
Base canvas reactor providing core rendering functionality.

### CanvasUserNodeReactor.js
Renders central user node at (400, 300) with size 160px and weighted connections to all bubbles.

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry & Event Coordination
- `../../shared/morphs/data/UserNode.js` - User node morph
- `../../shared/styles/tokens.js` - Design tokens

**Used by:**
- `../../../pages/[slug].astro` - Astro page integration
- `BubbleHost.js` - Data provider

**See also:**
- `../../shared/observers/` - Event handling (MorphObserver, ReactorObserver)
- `../../features/perspective-system/` - Perspective filtering

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
