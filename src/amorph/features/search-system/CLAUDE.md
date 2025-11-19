# 🔍 SEARCH SYSTEM FEATURE

## Overview

Dual search system: Morph-based + Data-based with auto-perspective switching.

## Structure

```
features/search-system/
├── reactors/
│   ├── SearchReactor.js           # Searches rendered morphs
│   └── AstroDataSearchReactor.js  # Searches raw data
└── CLAUDE.md                      # This file
```

## Reactors

### SearchReactor (Morph-based)
Searches visible text in Shadow DOM morphs.

**Features:**
- Word boundary matching
- Weighted scoring (Tags: 100, Name: 50, Data: 30)
- Container-based filtering
- 150ms debounced

### AstroDataSearchReactor (Data-based) ⭐ Priority
Searches raw `fungus-data` JSON attributes.

**Features:**
- Deep object traversal
- Field-aware weighting
- Finds inactive perspective data
- 26+ field-to-perspective mappings
- Takes precedence over SearchReactor

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry & Event Publishing
- `../../shared/morphs/global/MorphHeader.js` - Search input & auto-perspective switching

**Used by:**
- All Views (BubbleView, GridView, PerspectiveHost)
- MorphHeader listens to `search:completed` events

**See also:**
- `../perspective-system/` - Auto-activates perspectives based on search results
- `../../shared/observers/` - Event stream processing

---

## Priority System

1. AstroDataSearchReactor marks containers with `reactor-astro-search-hidden` class
2. SearchReactor checks this class before hiding
3. If AstroDataSearchReactor shows container, SearchReactor won't hide it
4. Class-based coordination - no tight coupling

## Auto-Perspective Switching

Both reactors publish matched perspectives:
- `search:completed` event includes `matchedPerspectives` array
- MorphHeader listens with 400ms debounce
- Auto-activates relevant perspectives when user pauses typing

## Field-to-Perspective Mapping

```javascript
'secondaryMetabolites' → 'chemicalAndProperties'
'nutritionalValue' → 'culinaryAndNutritional'
'medicinalProperties' → 'medicinalAndHealth'
'kingdom' → 'taxonomy'
// ... 26+ mappings total
```

## Usage

```javascript
// SearchReactor auto-enabled in init.js
amorph.registerReactor('search', SearchReactor);

// AstroDataSearchReactor manually in pages
const astroReactor = new AstroDataSearchReactor();
astroReactor.apply(containers);
```

## Dependencies

- **Core**: AmorphSystem
- **Global**: MorphHeader (displays search bar, manages auto-switching)
