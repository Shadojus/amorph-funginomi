# Bubble View - Morphs (Framework Component)

**Last Updated:** 27. November 2025

## Overview

**Domain-agnostic canvas-based visualization components.** These morphs render entities on HTML5 Canvas 2D context, not DOM elements.

**Framework Principle:** BubbleMorph ist generisch - es repräsentiert beliebige "Entitäten" (Pilze, Pflanzen, Produkte, Personen), nicht speziell Pilze. ConnectionMorph visualisiert Ähnlichkeitsbeziehungen zwischen beliebigen Entitäten. UserNode repräsentiert den User, unabhängig von der Domäne.

## Available Morphs

### BubbleMorph.js
**Entity bubbles in the canvas**
- Circular representation of entities
- Size based on connection weight to UserNode
- Color based on search score or perspective
- Contains entity slug, size, position (x, y)
- Rendered as canvas circles with fill/stroke
- Click event: Opens BubbleDetailReactor dialog

**Properties:**
## Key Properties

- `entityData` - Complete entity object from Convex
- `size` - Dynamic size (60-140px based on connection weight)
- `x, y` - Position on canvas (managed by CanvasPhysicsReactor)
- `color` - RGB color (search score or perspective-based)

### ConnectionMorph.js
**Lines connecting bubbles**
- Represents similarity between entities
- Thickness based on connection weight
- Color gradient based on strength
- Rendered as canvas lines (ctx.stroke)
- Click event: Shows connection details

**Properties:**
- `from` - Source bubble slug
- `to` - Target bubble slug
- `weight` - Connection strength (0-1)
- `bidirectional` - Whether connection is mutual

### UserNode.js
**User's position in the canvas - RESPONSIVE (v2.2.1)**
- **Dynamically positioned** at viewport center via `updateUserNodePosition()`
- Updates on window resize via `setupResize()` observer
- Represents user's current interests (session memory)
- Connections to relevant bubbles based on SessionStateManager
- NOT affected by physics simulation
- **Size: 40px** (reduced from 60px for cleaner UI)

**Properties:**
- `x, y` - Dynamically calculated: `offsetWidth/2`, `offsetHeight/2`
- `size` - 40 (configurable in constructor)
- `connections` - Map of slug → weight
- `interactionHistory` - Array of user interactions
- `isDragging` - Always false (user node is fixed)

## Architecture

### Canvas Rendering
All morphs are rendered via CanvasConnectionReactor and CanvasUserNodeReactor:
1. Clear canvas
2. Draw connections (ConnectionMorph)
3. Draw bubbles (BubbleMorph)
4. Draw user node (UserNode)

### Event Handling
Canvas morphs don't use DOM events. Instead:
- Mouse position tracked on canvas element
- Click detection via distance calculation
- Hover detection via position proximity
- Events dispatched via CustomEvent

### Design Tokens
Shared via `tokens.js`:
- Canvas colors
- Size ranges
- Connection styles
- Shadow/glow effects

## Usage

These morphs are NOT instantiated directly. They are created by BubbleView:

```javascript
// BubbleView creates bubble data
this.bubbles.set(slug, {
  entityData: entity,
  slug: entity.slug,
  x: initialX,
  y: initialY,
  size: initialSize,
  vx: 0, vy: 0,
  color: '#667eea',
  morph: bubbleMorphElement // Reference to DOM element
});

// CanvasReactors render them on canvas
canvasConnectionReactor.render(ctx, bubbles, connections);
```

## Dependencies

- **Canvas 2D API** - Native browser API
- **BubbleView** - Parent component
- **CanvasPhysicsReactor** - Position updates
- **CanvasConnectionReactor** - Line rendering
- **CanvasUserNodeReactor** - User node rendering
