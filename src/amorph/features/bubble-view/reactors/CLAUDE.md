# Bubble View - Reactors (Framework Component)

**Last Updated:** 22. November 2025

## Overview

**Domain-agnostic physics and rendering system** for BubbleView canvas-based visualization.

**Framework Principle:** Die Canvas-Reactoren kennen keine Pilze. CanvasPhysicsReactor simuliert Physik für beliebige "Nodes" (könnten Pilze, Pflanzen, Sterne, etc. sein), CanvasConnectionReactor zeichnet Verbindungen zwischen beliebigen Entitäten, BubbleDetailReactor zeigt Beziehungen zwischen beliebigen Objekten.

## Canvas Reactors (Canvas 2D Specific)

### CanvasPhysicsReactor.js
**Physics simulation for bubble movement**
- Spring forces based on connections
- Collision detection and resolution
- Boundary forces to keep bubbles in view
- Damping and friction
- Updates bubble positions (x, y) and velocities (vx, vy)

**Configuration:**
```javascript
{
  springStrength: 0.001,     // Connection attraction
  damping: 0.92,             // Velocity damping
  collisionStrength: 0.05,   // Collision response
  boundaryMargin: 100,       // Edge padding
  repulsionStrength: 0.00005 // Unconnected repulsion
}
```

**Important:** UserNode is NEVER included in physics - it stays fixed at canvas center.

### CanvasConnectionReactor.js
**Renders connection lines between bubbles**
- Draws lines with ctx.stroke()
- Line thickness based on weight
- Color gradient based on strength
- Only renders connections above threshold
- Bubble-to-bubble AND user-to-bubble connections

**Rendering:**
1. Set strokeStyle (color based on weight)
2. Set lineWidth (1-3px based on weight)
3. Draw line from bubble1 to bubble2
4. Apply glow effect for strong connections

### CanvasUserNodeReactor.js
**Renders user node and connections**
- Draws user node at canvas center
- Renders connections to relevant bubbles
- Dynamic connection culling (only strong connections)
- Glow effect around user node
- Displays connection count

**Connection Culling:**
- Threshold: 30% (configurable)
- Only shows connections above threshold
- Prevents visual clutter
- Updates on every frame

## Visual Reactors (Shared with GridView)

### BubbleDetailReactor.js
**Dialog showing bubble details and relationships**
- Opens on bubble click
- Shows fungus details
- Displays connection strengths
- Lists related fungi
- Perspective-based content

**Dialog Structure:**
- Header: Fungus name + close button
- Tags: Perspective tags
- Connections: Related fungi by strength (Strong > Medium > Weak)
- Details: Selected perspective data

### BubbleSearchReactor.js
**Highlights matching bubbles from search**
- Receives search results via `amorph:astro-search:completed`
- Applies highlight class to matching bubbles
- Clears highlights when search is cleared
- Integrates with search system

### AnimationReactor.js
**Smooth animations for bubble interactions**
- CSS transitions for size changes
- Fade in/out effects
- Hover scale animations
- Click pulse animations

### GlowReactor.js
**Glow effects for highlighted bubbles**
- Box-shadow glow
- Color-based glow (search = blue, perspective = various)
- Intensity based on relevance
- Smooth transitions

### HoverReactor.js
**Hover effects for bubbles**
- Scale up on hover
- Cursor change
- Highlight effect
- Smooth transitions

### SortReactor.js
**Sorting bubbles (not used in canvas view)**
- Primarily for GridView
- Bubble positions determined by physics

### FilterReactor.js
**Filtering bubbles (not used in canvas view)**
- Primarily for GridView
- Bubbles controlled by search/perspective events

### PulseReactor.js
**Pulse animation for emphasis**
- Scale pulse effect
- Used for new results
- Attention-grabbing animation

## Architecture

### Reactor Lifecycle
1. **Created**: Reactor instantiated with config
2. **Applied**: Attached to BubbleView host
3. **Update**: Called on every frame (for canvas reactors)
4. **Removed**: Cleanup when view changes

### Canvas vs DOM Reactors
**Canvas Reactors** (CanvasPhysicsReactor, CanvasConnectionReactor, CanvasUserNodeReactor):
- Run on every animation frame
- Manipulate canvas 2D context
- Handle positions, velocities, rendering
- No DOM manipulation

**DOM Reactors** (BubbleDetailReactor, BubbleSearchReactor, etc.):
- React to events
- Manipulate DOM elements (bubbles as web components)
- Apply CSS classes/styles
- User interactions

## Usage

Reactors are registered in `core/init.js` and enabled by BubbleView:

```javascript
// Enable canvas reactors
this.enableCanvasReactors();

// Enable visual reactors
this.enableReactor('bubbleDetail');
this.enableReactor('bubbleSearch');
```

Canvas reactors update on every frame:
```javascript
// Animation loop
const animate = () => {
  canvasPhysicsReactor.update(deltaTime);
  canvasConnectionReactor.render(ctx, bubbles, connections);
  canvasUserNodeReactor.render(ctx, userNodeData);
  requestAnimationFrame(animate);
};
```

## Dependencies

- **BubbleView** - Parent component
- **Canvas 2D API** - For canvas reactors
- **AmorphSystem** - Reactor registry
- **CustomEvents** - Inter-component communication
