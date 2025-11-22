# 👁️ PERSPECTIVE SYSTEM FEATURE

**Last Updated:** 22. November 2025

## Overview

**Domain-agnostic multi-dimensional data filtering system** with FIFO queue (max 4 active).

**Framework Concept:** Das Perspektiven-System ist ein generisches Tag-basiertes Filtersystem, das beliebige Datenstrukturen aus verschiedenen Blickwinkeln betrachten kann. Die Perspektiven sind domain-spezifische Konfiguration - jede Instance definiert ihre eigenen Perspektiven basierend auf ihrer Domäne.

**Key Principle:** Perspektiven sind **dynamisch konfigurierbar** und basieren auf Property-Tags, nicht auf hardcodierten Logiken. Das System filtert/highlightet Morphs basierend auf deren Tags, unabhängig von der Domäne.

## Structure

```
features/perspective-system/
├── PerspectiveCard.js      # Card display component
├── PerspectiveHost.js      # Container for single perspective
├── PerspectiveReactor.js   # Filters/highlights morphs by perspective
├── reactors/               # Perspective-specific reactors (currently empty)
└── CLAUDE.md               # This file
```

## Components

### PerspectiveHost.js
Container that shows/hides based on active perspectives. Event-driven activation.

### PerspectiveCard.js
Card component for perspective display.

## Reactor

### PerspectiveReactor.js
Dims irrelevant morphs when perspective is active. Uses CSS opacity.

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - Perspective state management
- `../morph-header/MorphHeader.js` - Perspective buttons & FIFO queue
- `../grid-view/morphs/tokens.js` - Design tokens (canonical source)

**Used by:**
- `../../../pages/[slug].astro` - Page-level perspective containers
- `../search-system/` - Auto-activates perspectives from search results

**See also:**
- `../../core/observers/` - GlobalObserver handles perspective events
- `../grid-view/morphs/` - All data morphs respond to perspective changes (single source)

---

## Perspectives

Perspectives are configured per instance via `domain.config.js`. Each instance defines:
- Perspective names (identifiers)
- Labels (display text)
- Icons (visual representation)
- Colors (UI theming)

The system supports any number of perspectives based on domain requirements.

## Event System

Listens to: `perspective-changed`
```javascript
window.dispatchEvent(new CustomEvent('perspective-changed', {
  detail: { perspectives: ['culinary', 'medicinal'] }
}));
```

## FIFO Logic

MorphHeader manages max 4 active perspectives. Removes oldest when 5th is added.

## Usage

```javascript
// Import PerspectiveHost
import '../features/perspective-system/PerspectiveHost.js';

// Use in Astro
<perspective-host 
  perspective="medicinalAndHealth"
  title="Medicinal"
  icon="⚕️"
  color="#06b6d4"
>
  <!-- Morphs -->
</perspective-host>
```

## Dependencies

- **Shared Morphs**: All data morphs
- **Core**: AmorphSystem
- **Global**: MorphHeader (manages active perspectives)
