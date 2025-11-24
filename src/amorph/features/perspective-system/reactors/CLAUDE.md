# Perspective System - Reactors (Framework Component)

**Last Updated:** 23. November 2025

**Previously:** 22. November 2025

## Overview

**Domain-agnostic visual transition system** for perspective changes. These handle smooth transitions when perspectives are activated/deactivated and control visual emphasis on tagged data.

**Framework Principle:** Perspective-Reactors filtern/highlighten Morphs basierend auf **Tags**, nicht auf Pilz-Konzepten. Funginomi nutzt Tags wie "culinary", "medicinal" - Phytonomi würde andere Tags nutzen ("botanical", "ornamental"), aber die gleichen Reactors.

## Reactor Configuration for Perspectives

### AnimationReactor.js
**Smooth transitions between perspective states**

Handles animations when switching perspectives or updating card visibility.

**Configuration:**
```javascript
{
  duration: 400,
  easing: 'ease-in-out',
  properties: ['opacity', 'transform', 'filter']
}
```

**Perspective Usage:**
- Fade in/out cards when perspective changes
- Slide transitions for perspective cards
- Smooth emphasis changes on morphs

### FilterReactor.js
**Show/hide morphs based on active perspective**

Controls visibility of morphs that are relevant to current perspective.

**Configuration:**
```javascript
{
  filterKey: 'perspective',
  hiddenClass: 'perspective-hidden',
  animate: true,
  duration: 300
}
```

**Perspective Usage:**
```javascript
// When perspective changes
filterReactor.filter(allMorphs, (morph) => {
  const perspectiveTag = morph.dataset.perspective;
  return activePerspectives.includes(perspectiveTag);
});
```

### GlowReactor.js
**Highlight perspective-relevant data**

Adds glow effect to morphs and cards matching active perspective.

**Configuration:**
```javascript
{
  color: 'rgba(59, 130, 246, 0.5)', // Blue glow for perspectives
  intensity: 'medium',
  pulse: false,
  duration: 500
}
```

**Perspective Usage:**
```javascript
// Highlight culinary perspective data
glowReactor.highlight(culinaryMorphs, {
  color: 'blue',
  intensity: 'medium'
});
```

### HoverReactor.js
**Interactive hover states for perspective cards**

Enhances hover feedback on perspective selection cards.

**Configuration:**
```javascript
{
  scale: 1.05,
  shadow: 'elevated',
  cursor: 'pointer',
  borderGlow: true
}
```

**Perspective Usage:**
- Perspective card hover in selector
- Morph hover when perspective active
- Category expansion hover

### PulseReactor.js
**Attention to newly activated perspective data**

Pulses morphs when their perspective is activated.

**Configuration:**
```javascript
{
  scale: [1, 1.03, 1],
  duration: 500,
  iterations: 1
}
```

**Perspective Usage:**
```javascript
// When perspective activated
pulseReactor.pulse(perspectiveRelevantMorphs, {
  duration: 500,
  iterations: 1
});
```

### SortReactor.js
**Reorder morphs by perspective priority**

Smoothly reorders morphs to prioritize perspective-relevant data.

**Configuration:**
```javascript
{
  duration: 400,
  easing: 'ease-out',
  stagger: 30 // ms between each element
}
```

**Perspective Usage:**
```javascript
// Sort morphs by perspective relevance
sortReactor.reorder(morphs, (a, b) => {
  const aPriority = getPerspectivePriority(a, activePerspective);
  const bPriority = getPerspectivePriority(b, activePerspective);
  return bPriority - aPriority;
});
```

## Perspective Transition Patterns

### Activate Perspective Animation
```javascript
// 1. Pulse perspective card (PulseReactor)
pulseReactor.pulse(perspectiveCard);

// 2. Glow relevant morphs (GlowReactor)
glowReactor.highlight(relevantMorphs, { color: perspectiveColor });

// 3. Sort morphs by relevance (SortReactor)
sortReactor.reorder(allMorphs, byPerspectivePriority);

// 4. Fade in newly visible data (AnimationReactor)
animationReactor.fadeIn(newlyVisibleMorphs);
```

### Deactivate Perspective Animation
```javascript
// 1. Remove glow from morphs (GlowReactor)
glowReactor.clearHighlight(perspectiveMorphs);

// 2. Fade out perspective-only data (AnimationReactor)
animationReactor.fadeOut(perspectiveOnlyMorphs);

// 3. Reset sort to default (SortReactor)
sortReactor.reset(allMorphs);
```

### Multi-Perspective Blend Animation
```javascript
// Multiple perspectives active simultaneously
const blendedHighlight = {
  culinary: 'rgba(34, 197, 94, 0.5)',    // Green
  medicinal: 'rgba(59, 130, 246, 0.5)',  // Blue
  cultivation: 'rgba(234, 179, 8, 0.5)'  // Yellow
};

activePerspectives.forEach(perspective => {
  const morphs = getMorphsForPerspective(perspective);
  glowReactor.highlight(morphs, {
    color: blendedHighlight[perspective]
  });
});
```

## Integration with Perspective System

### Event Listeners

```javascript
// When perspective is activated
window.addEventListener('perspective-changed', (e) => {
  const { perspectives } = e.detail; // Array of active perspectives
  
  // Filter morphs
  filterReactor.filter(allMorphs, morph => {
    return perspectives.some(p => 
      morph.dataset.perspectives?.includes(p)
    );
  });
  
  // Highlight relevant data
  perspectives.forEach(perspective => {
    const morphs = getMorphsForPerspective(perspective);
    glowReactor.highlight(morphs, {
      color: perspectiveColors[perspective]
    });
  });
  
  // Reorder by relevance
  sortReactor.reorder(allMorphs, byPerspectivePriority);
});

// When perspective is deactivated
window.addEventListener('perspective-deactivated', (e) => {
  const { perspective } = e.detail;
  
  const morphs = getMorphsForPerspective(perspective);
  glowReactor.clearHighlight(morphs);
  filterReactor.showAll(morphs);
});
```

### PerspectiveHost Integration

```javascript
// In PerspectiveHost.js
class PerspectiveHost {
  constructor() {
    this.glowReactor = new GlowReactor({ intensity: 'medium' });
    this.sortReactor = new SortReactor({ duration: 400 });
    this.filterReactor = new FilterReactor({ animate: true });
  }
  
  activatePerspective(perspective) {
    // Visual feedback
    this.glowReactor.highlight(
      this.getRelevantMorphs(perspective),
      { color: this.perspectiveColors[perspective] }
    );
    
    this.sortReactor.reorder(
      this.allMorphs,
      (a, b) => this.getPriority(b, perspective) - 
                this.getPriority(a, perspective)
    );
  }
}
```

### BubbleView Integration

```javascript
// In BubbleView - perspective affects bubble size
window.addEventListener('perspective-changed', (e) => {
  const { perspectives } = e.detail;
  
  // Enlarge perspective-relevant bubbles
  this.bubbles.forEach((bubble, slug) => {
    const relevance = this.getPerspectiveRelevance(slug, perspectives);
    const scale = 1 + (relevance * 0.3); // Up to 30% larger
    
    animationReactor.animate(bubble.element, {
      transform: `scale(${scale})`,
      duration: 400
    });
  });
});
```

## Perspective Color Scheme

```javascript
const perspectiveColors = {
  culinary: 'rgba(34, 197, 94, 0.5)',      // Green
  medicinal: 'rgba(59, 130, 246, 0.5)',    // Blue
  cultivation: 'rgba(234, 179, 8, 0.5)',   // Yellow
  ecology: 'rgba(168, 85, 247, 0.5)',      // Purple
  morphology: 'rgba(236, 72, 153, 0.5)'    // Pink
};
```

## Dependencies

- **Shared Reactors** - Base implementations from `src/amorph/shared/reactors/`
- **PerspectiveHost** - Manages perspective state
- **PerspectiveReactor** - Core perspective logic
- **BubbleView** - Bubble size adjustments
- **GridView** - Card filtering and sorting

## Usage Example

```javascript
// Initialize perspective reactors
const perspectiveReactors = {
  glow: new GlowReactor({ intensity: 'medium' }),
  filter: new FilterReactor({ animate: true }),
  sort: new SortReactor({ duration: 400 }),
  animate: new AnimationReactor({ duration: 300 })
};

// Handle perspective change
function handlePerspectiveChange(activePerspectives) {
  // Filter morphs
  perspectiveReactors.filter.filter(allMorphs, morph => {
    return activePerspectives.some(p => 
      morph.dataset.perspectives?.includes(p)
    );
  });
  
  // Highlight with perspective colors
  activePerspectives.forEach(perspective => {
    const morphs = getMorphsForPerspective(perspective);
    perspectiveReactors.glow.highlight(morphs, {
      color: perspectiveColors[perspective]
    });
  });
  
  // Sort by priority
  perspectiveReactors.sort.reorder(allMorphs, byPerspectivePriority);
}
```

## Performance Notes

- **Batch Updates**: Perspective changes batch all visual updates
- **Debouncing**: Multiple rapid perspective toggles are debounced (200ms)
- **GPU Acceleration**: All transforms use GPU-accelerated properties
- **Cleanup**: Reactors properly clean up on perspective deactivation
