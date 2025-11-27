# Search System - Visual Reactors (Framework Component)

**Last Updated:** 27. November 2025

## Overview

**Domain-agnostic visual feedback system** for search interactions. These are configured instances of shared reactors for search use cases.

**Framework Principle:** Alle Visual Reactors (Glow, Pulse, Filter, etc.) sind generisch und funktionieren mit beliebigen HTML-Elementen. Die Search-Konfiguration ist nur eine spezifische Anwendung.

## Search Visual Reactors

### AnimationReactor.js
**Smooth transitions for search result updates**

Handles fade-in/out animations when search results change.

**Configuration:**
```javascript
{
  duration: 300,
  easing: 'ease-out',
  properties: ['opacity', 'transform']
}
```

**Search Usage:**
- Fade in new results
- Fade out removed results
- Slide in matching cards

### FilterReactor.js
**Show/hide elements based on search match**

Controls visibility of grid cards and bubble nodes.

**Configuration:**
```javascript
{
  filterKey: 'search-match',
  hiddenClass: 'filtered-out',
  animate: true
}
```

**Search Usage:**
```javascript
// In search handler
filterReactor.filter(elements, (el) => {
  return searchResults.includes(el.dataset.slug);
});
```

### GlowReactor.js
**Highlight search matches**

Adds glow effect to elements matching search query.

**Configuration:**
```javascript
{
  color: 'rgba(34, 197, 94, 0.5)', // Green glow
  intensity: 'high',
  pulse: true,
  duration: 1000
}
```

**Search Usage:**
```javascript
// Highlight matching bubbles
glowReactor.highlight(matchingBubbles, {
  color: 'green',
  duration: 1000
});
```

### HoverReactor.js
**Interactive hover states for search results**

Enhances hover feedback on search result cards.

**Configuration:**
```javascript
{
  scale: 1.02,
  shadow: 'elevated',
  cursor: 'pointer'
}
```

**Search Usage:**
- Grid cards hover effect
- Bubble node hover
- Search suggestion hover

### PulseReactor.js
**Attention-grabbing animation for new results**

Pulses new search results to draw user attention.

**Configuration:**
```javascript
{
  scale: [1, 1.05, 1],
  duration: 600,
  iterations: 2
}
```

**Search Usage:**
```javascript
// Pulse top search result
pulseReactor.pulse(topResult, {
  duration: 600,
  iterations: 2
});
```

### SortReactor.js
**Animate reordering of search results**

Smoothly animates when results are sorted by relevance.

**Configuration:**
```javascript
{
  duration: 400,
  easing: 'ease-in-out',
  stagger: 50 // ms between each element
}
```

**Search Usage:**
```javascript
// Sort by search score
sortReactor.reorder(elements, (a, b) => {
  return searchScores[b.slug] - searchScores[a.slug];
});
```

## Search Animation Patterns

### Search Query → Results Animation
```javascript
// 1. Fade out current results (FilterReactor)
filterReactor.fadeOut(allCards);

// 2. Wait for search to complete
await searchAPI.search(query);

// 3. Glow matching results (GlowReactor)
glowReactor.highlight(matchingCards);

// 4. Sort by relevance (SortReactor)
sortReactor.reorder(matchingCards, bySearchScore);

// 5. Fade in with stagger (AnimationReactor)
animationReactor.fadeIn(matchingCards, { stagger: 50 });

// 6. Pulse top result (PulseReactor)
pulseReactor.pulse(matchingCards[0]);
```

### Clear Search Animation
```javascript
// 1. Remove glow from highlighted items
glowReactor.clearAll();

// 2. Fade in all cards (FilterReactor)
filterReactor.showAll(allCards);

// 3. Reset to default sort (SortReactor)
sortReactor.reorder(allCards, byDefaultOrder);
```

## Integration with Search System

### Event Listeners

```javascript
// When search completes
window.addEventListener('amorph:astro-search:completed', (e) => {
  const { results, scores } = e.detail;
  
  // Apply visual reactors
  filterReactor.filter(allCards, card => {
    return results.some(r => r.slug === card.dataset.slug);
  });
  
  glowReactor.highlight(matchingCards);
  sortReactor.reorder(matchingCards, (a, b) => {
    return scores[b.slug] - scores[a.slug];
  });
});

// When search is cleared
window.addEventListener('amorph:search:clear', () => {
  glowReactor.clearAll();
  filterReactor.showAll(allCards);
  sortReactor.reset();
});
```

### BubbleView Integration

```javascript
// In BubbleView
this.glowReactor = new GlowReactor({
  color: 'rgba(34, 197, 94, 0.5)',
  intensity: 'high'
});

// Highlight matching bubbles
this.searchMatchedBubbles.forEach((score, slug) => {
  const bubble = this.bubbles.get(slug);
  this.glowReactor.highlight(bubble.element);
});
```

### GridView Integration

```javascript
// In index.astro
const filterReactor = new FilterReactor({
  filterKey: 'search-match',
  animate: true
});

// Filter cards
filterReactor.filter(cards, card => {
  return searchResults.includes(card.dataset.slug);
});
```

## Dependencies

- **Shared Reactors** - Base reactor implementations from `src/amorph/shared/reactors/`
- **Search API** - Provides search results and scores
- **BubbleView** - Canvas bubble highlighting
- **GridView** - Card filtering and sorting

## Usage Example

```javascript
// Initialize reactors for search
const searchVisuals = {
  filter: new FilterReactor({ animate: true }),
  glow: new GlowReactor({ color: 'green' }),
  sort: new SortReactor({ duration: 400 }),
  pulse: new PulseReactor({ iterations: 2 })
};

// Handle search
async function handleSearch(query) {
  const results = await searchAPI.search(query);
  
  // Apply visual feedback
  searchVisuals.filter.filter(allCards, card => 
    results.includes(card.slug)
  );
  searchVisuals.glow.highlight(matchingCards);
  searchVisuals.sort.reorder(matchingCards, byRelevance);
  searchVisuals.pulse.pulse(matchingCards[0]);
}
```

## Performance Notes

- **Debouncing**: All reactors debounce rapid updates (300ms)
- **RAF Scheduling**: Animations use requestAnimationFrame
- **GPU Acceleration**: transform/opacity use GPU compositing
- **Cleanup**: Reactors clean up animations on unmount
