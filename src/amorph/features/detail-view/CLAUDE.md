# Detail View Feature

**Last Updated**: 2025-11-27
**Version**: 1.1.0
**Status**: Active Development

## Purpose

The Detail View feature provides specialized morphs for rendering rich, interactive detail pages for individual fungus species. It's designed to work with Astro SSR pages and integrates with the perspective system via MorphHeader.

## Key Architecture

**MorphHeader is the SINGLE control element** for perspective switching. The detail page:
- Removes its own perspective tabs
- Listens to `perspective-changed` events from MorphHeader
- Shows/hides perspective sections based on active perspectives
- Works identically to how GridView responds to MorphHeader

## Directory Structure

```
detail-view/
├── CLAUDE.md           # This file
├── morphs/
│   ├── View360Morph.js      # 360° image viewer
│   ├── SafetyMorph.js       # Toxicity/safety badges
│   ├── QuickFactsMorph.js   # Key facts bar
│   └── MiniBubbleView.js    # Similarity visualization
└── reactors/
    └── (future reactors)
```

## Morphs

### View360Morph
Interactive 360° image viewer with drag/touch rotation support.

**Attributes:**
- `src` - Single image URL
- `alt` - Alt text
- `frames` - JSON array of frame URLs for true 360°
- `gallery` - JSON array of gallery images
- `frame-count` - Number of frames (default: 36)
- `auto-rotate` - Enable auto-rotation
- `speed` - Rotation speed in ms

**Usage:**
```html
<view360-morph
  src="/images/fungi/amanita.jpg"
  gallery='["/img1.jpg", "/img2.jpg"]'
  alt="Fly Agaric"
/>
```

### SafetyMorph
Color-coded safety/toxicity indicator badge with expandable warnings.

**Attributes:**
- `edibility` - Edibility level (edible, caution, inedible, etc.)
- `toxicity-level` - Toxicity level (toxic, deadly, etc.)
- `warnings` - JSON array of warning strings
- `lookalikes` - JSON array of lookalike species names

**Colors:**
- 🟢 Green: Edible
- 🟡 Orange: Caution
- ⚫ Gray: Inedible
- 🔴 Red (pulsing): Toxic
- 💀 Dark Red (strong pulse): Deadly

### QuickFactsMorph
Horizontal bar showing 5-6 key facts auto-extracted from entity data.

**Attributes:**
- `entity` - JSON string of full entity data
- `max-facts` - Maximum facts to show (default: 6)

**Auto-extracts:**
- Taxonomy (family/genus)
- Habitat
- Seasonality
- Edibility
- Cap size
- Spore color
- Medicinal uses
- Cultivation difficulty

### MiniBubbleView
Compact Canvas 2D visualization showing similar species around center entity.

**Attributes:**
- `center-entity` - JSON: { slug, name, image }
- `similar-entities` - JSON array: [{ slug, name, image, similarity }]
- `max-bubbles` - Maximum bubbles (default: 8)

**Features:**
- Animated floating bubbles
- Click to navigate to species
- Hover tooltip with similarity %
- Color-coded by similarity level

## Integration

### Astro Page Usage
```astro
---
import { fetchEntity, fetchAllEntities } from '@/amorph/core/convex';
const entity = await fetchEntity(slug);
const allEntities = await fetchAllEntities();
---

<view360-morph src={primaryImage} alt={name} />
<safety-morph edibility={edibility} warnings={JSON.stringify(warnings)} />
<quick-facts-morph entity={JSON.stringify(entity)} />
<mini-bubble-view 
  center-entity={JSON.stringify(center)}
  similar-entities={JSON.stringify(similar)}
/>
```

### Registration (core/init.js)
```javascript
import '@/amorph/features/detail-view/morphs/View360Morph.js';
import '@/amorph/features/detail-view/morphs/SafetyMorph.js';
import '@/amorph/features/detail-view/morphs/QuickFactsMorph.js';
import '@/amorph/features/detail-view/morphs/MiniBubbleView.js';
```

## Design Principles

1. **Attribute-Based**: All morphs accept string attributes for Astro SSR compatibility
2. **JSON Parsing**: Complex data passed as JSON strings, parsed internally
3. **Progressive Enhancement**: Works without JS, enhanced with interactivity
4. **Mobile-First**: Touch support, responsive layouts
5. **Accessible**: ARIA attributes, keyboard navigation where applicable

## Related Files

- `/src/pages/fungi/[slug].astro` - Detail page template
- `/src/amorph/core/convex.ts` - Data fetching (fetchEntity, fetchAllEntities)
- `/convex/perspectiveFieldMappings.ts` - Perspective definitions
