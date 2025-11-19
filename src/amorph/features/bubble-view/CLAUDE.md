# 🫧 BUBBLE VIEW FEATURE

## Overview

Complete BubbleView visualization system with Canvas rendering.

## Structure

```
features/bubble-view/
├── BubbleView.js           # Main visualization component
├── BubbleHost.js           # Data host for bubbles
├── reactors/               # BubbleView-specific reactors
│   ├── CanvasConnectionReactor.js
│   ├── CanvasPhysicsReactor.js
│   ├── CanvasUserNodeReactor.js
│   └── CanvasReactor.js
├── controllers/            # Interaction controllers
│   ├── DragController.js
│   └── ZoomPanController.js
├── services/               # Helper services
│   ├── HilbertSpaceSimilarity.js
│   ├── CollisionDetector.js
│   ├── ForceDirectedLayout.js
│   └── ConnectionRenderer.js
└── CLAUDE.md              # This file
```

## Components

### BubbleView.js
Main Canvas-based visualization. Renders fungus data as interactive bubbles with physics simulation.

### BubbleHost.js
Data provider for BubbleView. Creates morphs from Convex data.

## Reactors

### CanvasConnectionReactor
Draws connection lines with weight badges between bubbles.

### CanvasPhysicsReactor
Physics simulation with spring forces and collision detection.

### CanvasUserNodeReactor
Renders central user node with weighted connections.

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

## Controllers

### DragController
Handles bubble dragging interaction.

### ZoomPanController
Handles zoom and pan gestures.

## Services

### HilbertSpaceSimilarity
Calculates similarity between fungi for connection weights.

### CollisionDetector
Prevents bubble overlap.

### ForceDirectedLayout
Physics-based layout algorithm.

### ConnectionRenderer
Renders bezier curve connections.

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
