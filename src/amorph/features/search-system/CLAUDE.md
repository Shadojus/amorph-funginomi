# 🔍 SEARCH SYSTEM FEATURE

**Last Updated:** 21. November 2025

## Overview

**Convex-powered server-side search** with auto-perspective switching and client-side highlighting.

**✨ UPDATED (2025-11-21):**
- ConvexSearchReactor coordinates with BubbleView for bubble creation
- SearchFilterController handles Grid View card filtering
- BubbleDetailReactor provides quick preview dialog

**✨ UPDATED (2025-11-19):** 
- Server-side search via Convex with deep field matching
- Client-side SearchFilterController for precise highlighting
- Scroll-to-view for first matched result
- Touch-friendly interactions

## Structure

```
features/search-system/
├── SearchFilterController.js      # Client-side card filtering & highlighting
├── reactors/
│   └── ConvexSearchReactor.js     # Server-side search via Convex
└── CLAUDE.md                      # This file
```

**REMOVED (2025-11-19):**
- ❌ `AstroDataSearchReactor.js` - Replaced by SearchFilterController
- ❌ `SearchReactor.js` - Replaced by SearchFilterController

## Architecture

```
User Input (MorphHeader)
    ↓
ConvexSearchReactor (debounce 300ms)
    ↓
POST /api/search
    ↓
Convex advancedSearch Query
    ↓
Deep field matching + Weighted scoring
    ↓
Returns: { results, scores, matchedPerspectives }
    ↓
SearchFilterController filters Grid View cards
    ↓
MorphHeader auto-activates perspectives
```

## Components

### ConvexSearchReactor ⭐ NEW
Server-side search using Convex database.

**Features:**
- Deep search in Convex (not DOM!)
- Weighted scoring server-side
- 80+ field-to-perspective mappings
- **Auto-perspective detection & activation** 🎯
- 300ms debounced for better UX
- Returns filtered fungi + scores + matched fields
- **Dispatches events for highlighting** 🎨

**Why Better:**
- ✅ No DOM traversal (faster)
- ✅ Searches ALL data (even hidden perspectives)
- ✅ Scalable to 1000+ fungi
- ✅ No client-side performance hit
- ✅ Convex local = unlimited queries
- ✅ All old features preserved (highlight + perspective switch)

### SearchFilterController ⭐ NEW (Updated 2025-11-19)
Client-side controller that filters static Astro cards and highlights precise data matches.

**Features:**
- Listens to `convex-search:completed` events
- Shows/hides cards with smooth animations
- **Precise data-based highlighting** - Parses `fungus-data` JSON attribute
- **Only highlights matching values** - Not entire containers
- **Scroll-to-view** - First match scrolls to center (smooth, 300ms delay)
- Works with Shadow DOM (DataMorph web components)
- Updates BubbleView with filtered data

**Highlighting Strategy:**
1. Parse `fungus-data` JSON from each `data-morph` element
2. Extract nested field values via `getNestedValue(obj, "path.to.field")`
3. Convert to searchable string (arrays → comma-separated, objects → JSON)
4. Check if value contains query (case-insensitive)
5. Add `.search-highlight-morph` class ONLY to matched morphs

**Visual Design:**
- **Background gradient** - `linear-gradient(90deg, rgba(59,130,246,0.25), rgba(59,130,246,0.35))`
- **Border-left accent** - 3px solid blue for clear identification
- **Smooth pulsation** - Gradient intensity pulses between 0.2-0.4 opacity
- **No overlay effect** - Background only for better readability
- Works with multiple active perspectives/filters

**Helper Methods:**
```javascript
getNestedValue(obj, path)     // "ecologyAndHabitat.substrate" → "dead wood"
valueToString(value)           // Converts arrays/objects to searchable strings
highlightMatches(query)        // Main highlighting logic
clearHighlights()              // Removes all highlight classes
scrollToFirstMatch()           // Smooth scroll to center of viewport
```

### SearchReactor (LEGACY)
Old client-side search through Shadow DOM.

**Status:** Commented out in init.js, kept for reference.

### AstroDataSearchReactor (LEGACY)
Old client-side search through JSON attributes.

**Status:** Deprecated, replaced by ConvexSearchReactor.

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry & Event Publishing
- `../morph-header/MorphHeader.js` - Search input & auto-perspective switching

**Used by:**
- All Views (BubbleView, GridView, PerspectiveHost)
- MorphHeader listens to `search:completed` events

**See also:**
- `../perspective-system/` - Auto-activates perspectives based on search results
- `../../core/observers/` - Event stream processing

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
