# 📊 GRID VIEW FEATURE

**Last Updated:** 26. November 2025

## Overview

**Domain-agnostic grid-based layout** for displaying entity cards with intelligent data-driven morph rendering.

**Framework Concept:** GridView ist ein generisches Card-Layout für beliebige strukturierte Daten. Die MorphMapper-Intelligenz entscheidet automatisch, welche Visualisierung für welchen Datentyp passend ist, basierend auf der Datenstruktur (nicht auf Feldnamen).

**✨ LATEST (2025-11-26):**
- 📊 All morphs work with perspective color system
- 🎨 CSS variable inheritance through Shadow DOM
- 🔍 Search highlighting with deep mode

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

### MorphMapper.js (FRAMEWORK CORE)
**Intelligent data-driven morph type detection - Der Kern des generischen Ansatzes**

**Framework-Prinzip:**
MorphMapper analysiert Datenstrukturen, **nicht** Feldnamen. Es gibt KEINE hardcodierten Mappings wie "commonName → NameMorph" oder "edibility → TagMorph". Stattdessen erkennt es die **Struktur** der Daten und wählt die passende Visualisierung.

**Detection Logic (Domain-Agnostic):**
- `typeof value === 'boolean'` → BooleanMorph (funktioniert für "edible", "organic", "available", etc.)
- `typeof value === 'number'` → NumberMorph (funktioniert für "price", "weight", "temperature", etc.)
- `typeof value === 'string' && value.length < 50` → NameMorph/TagMorph
- `typeof value === 'string' && value.length > 50` → TextMorph
- `Array.isArray(value) && all strings` → TagMorph (funktioniert für "colors", "flavors", "categories", etc.)
- `Array.isArray(value) && all numbers` → SparklineMorph
- `Object with {min, max, optimal}` → RangeMorph (funktioniert für "size", "price range", "temperature", etc.)
- `Object (small, flat)` → KeyValueMorph
- `Complex nested object` → DataMorph

**Nested Field Extraction:**
Flattens DataMorph objects one level to expose visual morphs inside complex structures.

**Priority System:**
- Visual morphs: +120 (RangeMorph, ChartMorph, etc.)
- Field hints: +100 (z.B. "range" im Feldnamen)
- Type-based: Base score (Boolean, Number, String)

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
