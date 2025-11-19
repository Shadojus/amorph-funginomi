# 👁️ PERSPECTIVE SYSTEM FEATURE

## Overview

Multi-perspective display system with FIFO queue (max 4 active).

## Structure

```
features/perspective-system/
├── PerspectiveHost.js      # Container for single perspective
├── PerspectiveCard.js      # Card display component
├── PerspectiveReactor.js   # Filters/highlights morphs by perspective
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
- `../../shared/morphs/global/MorphHeader.js` - Perspective buttons & FIFO queue

**Used by:**
- `../../../pages/[slug].astro` - Page-level perspective containers
- `../search-system/` - Auto-activates perspectives from search results

**See also:**
- `../../shared/observers/` - GlobalObserver handles perspective events
- `../../shared/morphs/data/` - All data morphs respond to perspective changes

---

## 12 Perspectives

1. taxonomy
2. physicalCharacteristics
3. ecologyAndHabitat
4. culinaryAndNutritional
5. medicinalAndHealth
6. cultivationAndProcessing
7. safetyAndIdentification
8. chemicalAndProperties
9. culturalAndHistorical
10. commercialAndMarket
11. environmentalAndConservation
12. researchAndInnovation

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
