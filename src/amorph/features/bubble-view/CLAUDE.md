# 🫧 BUBBLE VIEW FEATURE v2.2 - SESSION-BASED RECOMMENDATIONS

**Last Updated:** 27. November 2025  
**Status:** ✅ PRODUCTION READY - Session Memory System + Responsive Design

## 🚀 v2.2.1 Hotfixes (27.11.2025)

**Critical Fixes:**
- **Responsive UserNode** - Position dynamisch berechnet (nicht mehr hardcoded 400,300)
- **updateUserNodePosition()** - Neue Methode für responsive Zentrierung
- **Smaller UserNode** - Größe von 60 auf 40 reduziert
- **Pixi.js v8 Container-Masking** - Bilder werden korrekt maskiert (Container statt Sprite)
- **Entity Caching** - `cacheEntities()` Methode für BubbleHost → BubbleView Flow
- **Connection Lines Fixed** - Korrekte `from/to` Koordinaten statt falscher Signaturen
- **Timing Fix** - `pixieRenderer.app` Check vor Rendering

## 🚀 v2.2 Highlights (26.11.2025)

**Major Feature: UserNode as Session Memory**
- **SessionStateManager** - Collects ALL user actions in browser storage
- **Hilbert Space Relevance** - Calculates entity relevance from session data
- **Session-Based Bubbles** - Shows relevant entities, not just search results
- **Dual Mode Display** - 'session' mode (recommendations) + 'search' mode (filtered)
- **Smart Combination** - Search results + session relevance for ranking

**Session State Tracking:**
- Searches (queries, result counts)
- Entity clicks (bubbles, cards)
- Entity hovers (with duration)
- Page visits (time spent, scroll depth)
- Perspective usage (activations, total time)

## 🚀 v2.1 Highlights (26.11.2025)

**Critical fixes for cited value schema support:**
- **extractValue()** - Handles `{ value: X, confidence, sources }` format
- **getEntityName()** - Smart extraction from nested structures
- **getEntityImage()** - Extracts images from visualIdentity
- **Auto-init Convex** - BackendSimilarity creates own client if needed
- **seoName support** - Backend uses seoName instead of slug

## 🚀 v2.0 Highlights

**Complete architectural redesign with:**
- **Pixi.js GPU rendering** - 10-100x faster than Canvas 2D
- **Backend similarity calculations** - Offloaded to Convex for performance
- **Full user interaction tracking** - Search, clicks, hovers, perspective changes
- **50% code reduction** - 958 lines → 475 lines

## Overview

**Domain-agnostic similarity visualization system** with GPU-accelerated rendering, backend-powered similarity calculations, and comprehensive user interaction tracking.

**Framework Concept:** BubbleView visualisiert **Ähnlichkeitsbeziehungen zwischen Entitäten**. Es funktioniert mit beliebigen strukturierten Daten - Produkte, Personen, Papers, Locations, etc. Die Hilbert-Space-Similarity berechnet Distanzen basierend auf gemeinsamen Properties, unabhängig von der Domäne.

**Key Principle:** Das System zeigt **"WHY entities are connected"** (gemeinsame Eigenschaften, Ähnlichkeiten), nicht "comprehensive data dumps". Die Detail-Ansicht fokussiert auf Beziehungen, nicht auf alle Datenfelder.

**CRITICAL (v2.2):** UserNode is now a SESSION MEMORY that remembers all user interactions and recommends relevant entities based on Hilbert space calculations, not just search results!

## Session State Manager (v2.2)

```javascript
// services/SessionStateManager.js - Brain of the UserNode

import { getSessionStateManager } from './services/SessionStateManager.js';

const sessionManager = getSessionStateManager();

// Track actions (automatic via event listeners)
sessionManager.trackSearch('amanita');
sessionManager.trackEntityClick('amanita-muscaria');
sessionManager.trackEntityHover('cantharellus-cibarius', 1500);
sessionManager.trackPerspectiveChange(['taxonomy', 'ecology']);

// Calculate relevance scores (Hilbert space)
const scores = sessionManager.calculateRelevanceScores(allEntities);
// { 'amanita-muscaria': 0.85, 'cantharellus-cibarius': 0.45, ... }

// Get top relevant entities
const topEntities = sessionManager.getTopRelevantEntities(allEntities, 12);
// [{ slug, score, entity }, ...]

// Get session stats
const stats = sessionManager.getStats();
// { sessionId, totalActions, entitiesInteracted, perspectivesUsed, ... }
```

**Relevance Calculation Weights:**
```javascript
const WEIGHTS = {
  click: 0.25,           // Direct click is strong signal
  hover: 0.05,           // Hover shows interest
  view: 0.20,            // Page view is strong
  timeSpent: 0.15,       // Time on page (normalized)
  scrollDepth: 0.10,     // Deep scroll = engagement
  searchMatch: 0.15,     // Matches search queries
  perspectiveMatch: 0.10 // Matches active perspectives
};
```

**Storage:**
- `sessionStorage` - Current session (cleared on browser close)
- `localStorage` - Persistent user profile (entity preferences)

## Cited Value Handling (v2.1)

```javascript
// BubbleView.js includes these helpers:

// Extract value from citedValue format
function extractValue(data) {
  if (typeof data === 'object' && 'value' in data && 
      ('confidence' in data || 'sources' in data)) {
    return data.value;
  }
  return data;
}

// Get entity display name - handles nested structures
function getEntityName(entity, nameField = 'commonName') {
  let name = extractValue(entity[nameField]);
  // Fallbacks: identity.scientificName, names.common, latinName, seoName, slug
  return String(name);
}

// Get entity slug
function getEntitySlug(entity, slugField = 'seoName') {
  return entity[slugField] || entity.seoName || entity.slug || entity._id;
}

// Get entity image
function getEntityImage(entity) {
  // Checks: visualIdentity.primaryImage, images[0], images[0].url
  return imageUrl || null;
}
```

## Structure (v2.2)

```
features/bubble-view/
├── BubbleView.js           # Main component with SessionStateManager
├── BubbleView.OLD.js       # Backup of Canvas 2D version
├── BubbleHost.js           # Data host for bubbles
├── morphs/                 # Bubble-specific morphs
│   ├── BubbleMorph.js
│   ├── UserNode.js
│   ├── ConnectionMorph.js
│   └── tokens.js
├── reactors/               # Reactors
│   ├── BubbleDetailReactor.js
│   ├── BubbleSearchReactor.js
│   ├── GlowReactor.js, AnimationReactor.js, etc.
│   └── index.js
├── services/
│   ├── HilbertSpaceSimilarity.js
│   ├── BackendSimilarity.js      # Convex integration
│   └── SessionStateManager.js    # 🆕 Browser session memory
└── CLAUDE.md

🔗 Backend (Convex):
├── userInteractions.ts     # Supports perspectives array
├── calculateSimilarity.ts  # Uses seoName index
└── schema.ts               # userInteractions + perspectives field
```

## Components

### 🆕 BubbleView.js (v2.2)
**Session-aware Pixi.js visualization:**
- **Dual display modes** - 'session' (recommendations) + 'search' (filtered results)
- **SessionStateManager integration** - Uses browser-side session memory
- **Hilbert space rendering** - Entity distance = inverse of relevance score
- **Combined ranking** - Search results weighted by session relevance
- **loadAllEntities()** - Fetches all entities for session recommendations
- **showSessionRecommendations()** - Renders top relevant entities
- **renderSessionBubbles()** - Positions by relevance (closer = more relevant)
- **renderSearchResults()** - Combines search position + session relevance

### 🆕 SessionStateManager.js (v2.2)
**Browser-side session memory (Hilbert space calculation):**
- **Automatic tracking** - Listens for search, perspective, click events
- **localStorage persistence** - Remembers user preferences across sessions
- **sessionStorage** - Current session data (cleared on close)
- **Relevance calculation** - Weight factors: click, hover, view, time, scroll, search match, perspective match
- **Recency decay** - Older interactions worth less (decayFactor: 0.95)
- **Event emission** - Fires 'session:action-tracked' for real-time updates

### BackendSimilarity.js (v2.1)
**Auto-initializing Convex client:**
- **Auto-init** - Creates own ConvexHttpClient if none provided
- **isInitialized flag** - Prevents double-initialization
- **Perspectives tracking** - Tracks perspective_change events
- **Session-based** - generateSessionId() for user tracking

### BubbleHost.js
Data provider for BubbleView. Creates morphs from Convex data and manages bubble lifecycle.

### BubbleMorph.js
Individual bubble component with:
- Reactive size property (Lit Web Component)
- Perspective-aware styling
- Hover and interaction states
- Integration with BubbleView canvas system

## Reactors

### BubbleDetailReactor.js (~487 lines)
**Relationship-focused bubble detail dialog**. Shows connections and key facts instead of raw data dump.

**Features:**
- **Window-level event handling** via window.addEventListener('bubble:clicked')
- **Connection strength display** - Shows UserNode similarity score with classification:
  - Stark: > 50%
  - Mittel: ≥ 30%
  - Schwach: < 30%
- **Connected bubbles list** - Shows bubble-to-bubble similarity scores
- **Key facts extraction** - 5 properties from active perspectives with icons:
  - 🍄 Edibility (always shown if available)
  - 🌱 Cultivation difficulty
  - ⚕️ Health benefits
  - 🍳 Flavor profile
  - 🧪 Chemical compounds
- **Wood floor background** with gradient overlay
- **Link to full detail page** (/[collection]/[slug])

**Design Philosophy:**
BubbleView dialog explains WHY bubbles are connected and shows relationships, NOT comprehensive data (that's GridView's job).

### BubbleSearchReactor.js
Manages search-related bubble highlighting and filtering via ConvexSearchReactor events.

### CanvasConnectionReactor.js
Draws curved connection lines between bubbles and UserNode. Features:
- Quadratic curves with control point offset
- Line width 1-8px based on similarity
- Opacity 0.2-1.0 based on connection strength
- Blue connections (#3B82F6) for all types

### CanvasPhysicsReactor.js
**Physics simulation with spring forces and collision detection.**

**Critical Method:**
```javascript
getAllNodes() {
  const bubbles = this.getBubbles();
  const queryNodes = this.getQueryNodes();
  const combined = new Map([...bubbles, ...queryNodes]);
  return Array.from(combined.entries());
}
```
**IMPORTANT:** UserNode is NEVER included in physics simulation - it stays fixed at canvas center.

**Physics Parameters:**
- Spring strength: 0.005
- Damping: 0.95
- Collision strength: 0.1
- User node gravity: 0.02

### CanvasReactor.js
Base canvas reactor providing core rendering loop and helper methods.

### CanvasUserNodeReactor.js
Renders central user node with weighted connection lines to all bubbles.
- **Fixed position** at canvas center
- **Size** 53px fixed
- **Connection threshold** 0.3 (only shows strong connections)
- **Max connections** 8 visible lines

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry & Event Coordination
- `./morphs/UserNode.js` - User node morph (feature-local)
- `./morphs/tokens.js` - Design tokens (feature-local)

**Used by:**
- `../../../pages/[slug].astro` - Astro page integration
- `BubbleHost.js` - Data provider

**See also:**
- `../../core/observers/` - Event handling (MorphObserver, ReactorObserver)
- `../perspective-system/` - Perspective filtering

---

## Services

### HilbertSpaceSimilarity.js
Calculates similarity between entities using Hilbert space transformations. Used for:
- Connection weight calculation
- Bubble positioning
- Similarity matrix updates

**Features:**
- Perspective-aware similarity scoring
- Characteristic property weighting
- Multi-dimensional entity comparison

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
