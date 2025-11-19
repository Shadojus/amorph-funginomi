# 📊 GRID VIEW FEATURE

**Last Updated:** 19. November 2025

## Overview

Grid-based layout for displaying fungus cards with wood floor design and touch-friendly interactions.

**✨ NEW (2025-11-19):**
- 🪵 **Wood floor background** - Natural texture on cards
- 👆 **Touch hover effects** - Cards stay highlighted until next touch
- 📦 **Ultra-compact layout** - 40% less padding/whitespace
- 🔍 **Search highlighting** - Background gradient on matched values

## Structure

```
features/grid-view/
├── GridHost.js     # Grid layout host
└── CLAUDE.md       # This file
```

## Components

### GridHost.js
Responsive grid layout with CSS Grid. Displays morphs in cards.

## Features

- Responsive columns (auto-fill)
- Configurable gap and min-width
- Hover effects
- Works with all shared reactors

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - System Registry
- `../../shared/reactors/` - All universal reactors (Glow, Hover, etc.)
- `../../shared/morphs/data/` - All data morphs for card content

**See also:**
- `../bubble-view/` - Alternative visualization (Canvas-based)
- `../perspective-system/` - Works with PerspectiveHost for filtering

---

## Usage

```javascript
// Import GridHost
import '../features/grid-view/GridHost.js';

// Use in HTML
<grid-host columns="3" gap="2rem" min-width="320px">
  <!-- Morphs will be rendered here -->
</grid-host>
```

## Dependencies

- **Shared Reactors**: Sort, Filter, Hover, Glow, Animation
- **Shared Morphs**: All data morphs
- **Core**: AmorphSystem
