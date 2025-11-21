# 📊 GRID VIEW FEATURE

**Last Updated:** 21. November 2025

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
├── morphs/         # ALL data morphs (single source!)
│   ├── NameMorph.js, ImageMorph.js, TagMorph.js
│   ├── TextMorph.js, BooleanMorph.js, NumberMorph.js
│   ├── ListMorph.js, DataMorph.js, ChartMorph.js
│   ├── MapMorph.js, TimelineMorph.js, QueryMorph.js
│   ├── ConnectionMorph.js, UserNode.js
│   ├── tokens.js   # Design tokens für alle morphs
│   └── CLAUDE.md   # Morph documentation
├── reactors/       # ALL visual reactors (single source!)
│   ├── GlowReactor.js, AnimationReactor.js, PulseReactor.js
│   ├── HoverReactor.js, SortReactor.js, FilterReactor.js
│   └── CLAUDE.md   # Reactor documentation
└── CLAUDE.md       # This file
```

## Components

### GridHost.js
Responsive grid layout with CSS Grid. Displays morphs in cards.

## Architecture

**SINGLE SOURCE PRINCIPLE:**
- Grid-view contains ALL 15 data morphs - imported by `core/init.js`
- Grid-view contains ALL 6 visual reactors - imported by `core/init.js`
- Other features copy only what they need OR import from grid-view
- No shared folders - grid-view IS the canonical source

## Features

- Responsive columns (auto-fill)
- Configurable gap and min-width
- Hover effects
- Works with all visual reactors

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
