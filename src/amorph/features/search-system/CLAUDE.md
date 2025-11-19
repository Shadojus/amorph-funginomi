# 🔍 SEARCH SYSTEM FEATURE

## Overview

**Convex-powered server-side search** with auto-perspective switching.

**✨ NEW (2025-11-19):** Migrated from client-side to server-side search using Convex local database.

## Structure

```
features/search-system/
├── reactors/
│   ├── ConvexSearchReactor.js     # ⭐ NEW: Server-side search via Convex
│   ├── SearchReactor.js           # LEGACY: Client-side morph search
│   └── AstroDataSearchReactor.js  # LEGACY: Client-side data search
├── SearchFilterController.js      # ⭐ NEW: Filters static cards
└── CLAUDE.md                      # This file
```

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

### SearchFilterController ⭐ NEW
Client-side controller that filters static Astro cards.

**Features:**
- Listens to `convex-search:completed` events
- Shows/hides cards with smooth animations
- **Highlights matched morphs** 🎨 (blue pulse animation)
- **Highlights matched cards** (border glow)
- Stores matched fields per fungus
- Updates BubbleView with filtered data
- Works with static SSR pages

**Highlighting:**
- Adds `.search-highlight-morph` class to matched morphs
- Adds `.search-highlight-card` class to matched cards
- Pulse animation (1.5s infinite)
- Blue border glow (rgba(59, 130, 246, 0.4))
- Auto-clears on search reset

### SearchReactor (LEGACY)
Old client-side search through Shadow DOM.

**Status:** Commented out in init.js, kept for reference.

### AstroDataSearchReactor (LEGACY)
Old client-side search through JSON attributes.

**Status:** Deprecated, replaced by ConvexSearchReactor.

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
