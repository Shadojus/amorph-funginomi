# Search System - Reactors (Framework Component)

**Last Updated:** 25. November 2025

**Previously:** 22. November 2025

## Overview

**Domain-agnostic search coordination reactors.** These handle search input, results display, and perspective switching for any structured data.

**Framework Principle:** SearchFilterController und Reactors kennen keine Pilze. Sie filtern beliebige Cards/Entities basierend auf Text-Matches in gerenderten Morphs. Komplett generisch.

## Visual Reactors

### SearchFilterController.js
**NOT a reactor - Controller for search UI**

Manages search input and filter controls in the search bar.

**Features:**
- Search input field
- Debounced search (300ms)
- Clear button
- Filter toggles (future)
- Emits search events

**Events:**
```javascript
// When user types
window.dispatchEvent(new CustomEvent('amorph:search:query', {
  detail: { query: 'shiitake' }
}));

// When search is cleared
window.dispatchEvent(new CustomEvent('amorph:search:clear'));
```

## Search Reactors Directory Structure

```
search-system/
├── CLAUDE.md              # This file
├── SearchFilterController.js  # Search UI controller
└── reactors/              # Search-specific reactors
    └── (empty - using shared reactors)
```

## Integration with Other Systems

### Astro Search API
Search is handled server-side:

```javascript
// User types → SearchFilterController emits event
window.dispatchEvent(new CustomEvent('amorph:search:query', {
  detail: { query }
}));

// Astro /api/search.ts receives query
const results = await ctx.db
  .query('fungi')
  .filter(q => /* full-text search */)
  .collect();

// Astro emits results event
window.dispatchEvent(new CustomEvent('amorph:astro-search:completed', {
  detail: { 
    results,
    scores: { [slug]: score },
    query
  }
}));
```

### BubbleView Integration
BubbleView listens for search results:

```javascript
// In BubbleView
window.addEventListener('amorph:astro-search:completed', (e) => {
  const { results, scores } = e.detail;
  
  // Update search matched bubbles
  this.searchMatchedBubbles.clear();
  results.forEach(fungus => {
    this.searchMatchedBubbles.set(fungus.slug, scores[fungus.slug]);
  });
  
  // Update bubble sizes based on search scores
  this.updateUserNodeConnections();
  this.updateBubbleSizes();
});
```

### GridView Integration
Grid cards are highlighted:

```javascript
// In index.astro
window.addEventListener('amorph:astro-search:completed', (e) => {
  const { results } = e.detail;
  
  // Hide non-matching cards
  document.querySelectorAll('.fungus-card').forEach(card => {
    const slug = card.dataset.slug;
    const matches = results.some(r => r.slug === slug);
    card.style.display = matches ? 'flex' : 'none';
  });
});
```

### Perspective Auto-Switching
Search automatically activates relevant perspectives:

```javascript
// In /api/search.ts
const perspectiveHints = {
  'edible': 'culinary',
  'medicinal': 'medicinal',
  'cultivation': 'cultivation',
  'habitat': 'ecology'
};

// Activate perspective based on query keywords
if (query.includes('edible')) {
  // Emit perspective change event
  window.dispatchEvent(new CustomEvent('perspective-changed', {
    detail: { perspectives: ['culinary'] }
  }));
}
```

## Shared Reactors Used

Search system uses these reactors from other features:

**From BubbleView:**
- `BubbleSearchReactor` - Highlights matching bubbles

**From GridView:**
- `FilterReactor` - Filters grid cards
- `GlowReactor` - Highlights matching cards

## Usage

```javascript
// Initialize search controller
const searchController = new SearchFilterController({
  inputSelector: '#search-input',
  clearSelector: '#clear-search'
});

// Listen for search events
window.addEventListener('amorph:search:query', (e) => {
  console.log('Search query:', e.detail.query);
});
```

## Dependencies

- **Astro Search API** - Server-side search endpoint
- **Convex Database** - Fungi data source
- **BubbleView** - Bubble highlighting
- **GridView** - Card filtering
- **Perspective System** - Auto-switching
