# Detail View Feature

**Last Updated**: 2025-01-27
**Version**: 2.1.0 - Premium Styling Update
**Status**: Active Development

## Purpose

The Detail View feature provides specialized morphs for rendering rich, interactive detail pages for individual fungus species. It works with Astro SSR pages and integrates fully with:
- **MorphHeader** for perspective switching
- **Search System** for highlighting matches
- **Central Field Mappings** from `convex/perspectiveFieldMappings.ts`

## v2.1.0 Styling Update

All morphs now feature **premium glassmorphism styling** matching grid-view quality:

### Design System
- **Glassmorphism**: `rgba(0, 0, 0, 0.15)` backgrounds with `backdrop-filter: blur(8px)`
- **Subtle Borders**: `rgba(255, 255, 255, 0.06)` with hover enhancement
- **Container Queries**: Responsive layouts at 180px, 280px breakpoints
- **Color-Coded Values**:
  - Boolean TRUE: Green badge (`#4ade80`, `rgba(34, 197, 94, 0.15)` bg)
  - Boolean FALSE: Red badge (`#f87171`, `rgba(239, 68, 68, 0.1)` bg)
  - Numbers: Purple (`#818cf8`) with glow
  - Tags: Perspective-colored pills with hover lift
- **Animations**: Subtle pulse on optimal markers, hover transitions

### Key CSS Patterns
```css
/* Glassmorphism Container */
background: rgba(0, 0, 0, 0.15);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 10px;
backdrop-filter: blur(8px);
transition: all 0.25s ease;

/* Boolean Badge (true) */
background: rgba(34, 197, 94, 0.15);
border: 1px solid rgba(34, 197, 94, 0.3);
color: #4ade80;

/* Number Value */
color: #818cf8;
font-weight: 700;
text-shadow: 0 0 12px rgba(129, 140, 248, 0.3);
```

## Key Architecture

### MorphHeader Integration
**MorphHeader is the SINGLE control element** for perspective switching. The detail page:
- Listens to `perspective-changed` events from MorphHeader
- Shows/hides perspective sections based on active perspectives
- Works identically to how GridView responds to MorphHeader

### Central Field Mapping
Uses `getFieldKeyToPerspectiveMapping()` from the central schema to:
- Dynamically build perspectives from entity data
- Map database field names to perspective IDs
- Sort perspectives by defined order

### Search & Highlighting
- Listens to `amorph:search:input` and `convex-search:completed` events
- Highlights matching text with golden animation
- Auto-scrolls to first match
- Re-highlights when perspectives change

## Directory Structure

```
detail-view/
├── CLAUDE.md                    # This file
├── morphs/
│   ├── index.js                 # Central exports for all morphs
│   ├── tokens.js                # Design tokens & perspective colors
│   ├── DetailMorphMapper.js     # Data-driven morph creation
│   │
│   ├── # Core Data Morphs
│   ├── DataMorph.js             # Dynamic nested data renderer
│   ├── KeyValueMorph.js         # Small object display
│   ├── TagMorph.js              # Tag/pill display
│   ├── TextMorph.js             # Text with truncation
│   │
│   ├── # Visualization Morphs
│   ├── RangeMorph.js            # Min/max range visualization
│   ├── RadarChartMorph.js       # Multi-axis chart
│   ├── TimelineMorph.js         # Timeline visualization
│   │
│   ├── # Specialized Morphs
│   ├── View360Morph.js          # 360° image viewer
│   ├── SafetyMorph.js           # Toxicity/safety badges
│   ├── QuickFactsMorph.js       # Key facts bar
│   └── MiniBubbleView.js        # Similarity visualization
└── reactors/
    └── (future reactors)
```

## Integration with [slug].astro

### Imports
```typescript
import { getFieldKeyToPerspectiveMapping } from 'convex/perspectiveFieldMappings';
const fieldToPerspective = getFieldKeyToPerspectiveMapping();
```

### Dynamic Perspective Building
```typescript
for (const [dataField, perspectiveId] of Object.entries(fieldToPerspective)) {
  const rawData = entity[dataField];
  const data = extractValue(rawData);
  
  if (data && Object.keys(data).length > 0) {
    perspectives.push({
      id: perspectiveId,
      title: def.label,
      icon: def.icon,
      color: def.color,
      data,
      dataField
    });
  }
}
```

### Event Listeners
```javascript
// Perspective changes
window.addEventListener('perspective-changed', (e) => {
  updateVisiblePerspectives(e.detail.perspectives);
});

// Search highlighting
window.addEventListener('amorph:search:input', (e) => {
  highlightMatches(e.detail.query);
});

window.addEventListener('convex-search:completed', (e) => {
  highlightMatches(e.detail.query);
});
```

## DetailMorphMapper

The `DetailMorphMapper` provides data-driven morph creation. It analyzes data structure and automatically selects the best morph type for each field.

### Usage

```javascript
import { DetailMorphMapper, renderMorphs } from './morphs/index.js';

// Option 1: Use renderMorphs helper
renderMorphs(container, perspectiveData, { 
  perspective: 'culinary',
  color: '#22c55e'
});

// Option 2: Use mapper directly
const mapper = new DetailMorphMapper({ perspective: 'cultivation' });
const configs = mapper.getMappedFields(data);

configs.forEach(config => {
  const element = mapper.createMorphElement(config);
  container.appendChild(element);
});
```

### Morph Type Detection

The mapper automatically detects the best morph type based on:

| Data Structure | Morph Type |
|----------------|------------|
| `{ min, max, optimal?, unit? }` | RangeMorph |
| `[{ dayOffset, stage, ... }]` | TimelineMorph |
| `[{ axis, value }]` or `{ key: number, ... }` (3+ entries) | RadarChartMorph |
| `['tag1', 'tag2', ...]` (primitives) | TagMorph |
| `{ key: primitive, ... }` (≤8 entries) | KeyValueMorph |
| `"string"` | TextMorph |
| Complex nested object | DataMorph |

### Field Name Hints

Field names also influence morph selection:
- `lifecycle`, `stages`, `growth` → TimelineMorph
- `scores`, `ratings`, `profile` → RadarChartMorph
- `temperature`, `humidity`, `ph` → RangeMorph
- `tags`, `categories`, `uses` → TagMorph

## Element Names

Detail-view morphs **own** the standard element names. They are imported first in `init.js` and register before grid-view morphs:

| Morph Class | Element Name | Source |
|-------------|--------------|--------|
| DataMorph | `<data-morph>` | detail-view |
| TagMorph | `<tag-morph>` | detail-view |
| TextMorph | `<text-morph>` | detail-view |
| RangeMorph | `<range-morph>` | detail-view |
| KeyValueMorph | `<key-value-morph>` | detail-view |
| RadarChartMorph | `<radar-chart-morph>` | detail-view |
| TimelineMorph | `<timeline-morph>` | detail-view |

**Architecture:**
- Detail-view morphs are imported FIRST in `init.js`
- They register with standard element names
- Grid-view morphs check `customElements.get()` and skip if already defined
- This ensures detail pages always use detail-view morphs

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

### DataMorph
Dynamic nested data renderer - recursively renders perspective data.

**Attributes:**
- `entity-data` - Full entity JSON
- `field` - Field path to render
- `mode` - 'simple' or 'deep'
- `perspective` - Perspective ID for color theming

**Features:**
- Unwraps citedValue wrappers automatically
- Selects appropriate sub-morph based on data type
- Respects perspective coloring

### RangeMorph
Visual min/max range with optional optimal marker.

**Properties:**
- `data` - Object: { min, max, optimal?, unit? }

### RadarChartMorph
Multi-axis radar/spider chart for score comparisons.

**Properties:**
- `data` - Array: [{ axis, value }, ...] or Object: { key: score }

### TagMorph
Pill-style tag display for arrays of strings.

**Properties:**
- `tags` - Array of strings
- `value` - Single string (alternative)

### KeyValueMorph
Compact display for small flat objects.

**Properties:**
- `data` - Object with primitive values

### TimelineMorph
Timeline visualization for lifecycle/cultivation stages.

**Properties:**
- `data` - Array: [{ dayOffset, stage, label }, ...]

## Highlighting System

### CSS Classes
```css
.search-highlight {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 165, 0, 0.5));
  animation: highlightPulse 2s ease-in-out infinite;
}

.perspective-section.has-match {
  border-left: 4px solid gold !important;
}

.morph-card.has-match {
  border: 2px solid rgba(255, 215, 0, 0.5) !important;
}
```

### Functions
- `highlightMatches(query)` - Apply highlights to visible content
- `clearHighlights()` - Remove all highlights
- `highlightTextInElement(element, term)` - Highlight in specific element

## Perspective Visibility

```javascript
function updateVisiblePerspectives(activePerspectives) {
  const perspectiveIds = activePerspectives.map(normalizePerspectiveId);
  
  sections.forEach(section => {
    const sectionPerspective = section.getAttribute('data-perspective');
    const isActive = perspectiveIds.includes(sectionPerspective);
    section.style.display = isActive ? 'block' : 'none';
  });
}
```

## Data Flow

```
1. Entity loaded via fetchEntity(slug) in [slug].astro
2. Perspectives built using getFieldKeyToPerspectiveMapping()
3. perspectiveDefinitions provides labels, icons, colors
4. perspective-host components render each section
5. MorphHeader controls which sections are visible
6. Search events trigger highlighting across visible content
```

## Differences from GridView

| Aspect | GridView | DetailView |
|--------|----------|------------|
| Data Source | fetchEntities() (all) | fetchEntity(slug) (single) |
| Card Layout | Grid of cards | Single page sections |
| Morphs | Dynamic via MorphMapper | SSR + dynamic |
| Perspective Control | Hide/show cards | Hide/show sections |
| Search | Filter cards | Highlight content |

## Future Enhancements

1. **DataMorph Integration**: Use MorphMapper pattern for dynamic morph creation
2. **Deep Mode**: Expand sections to show all fields on search
3. **Related Entities**: Cross-link to similar species detail pages
4. **Comparison View**: Side-by-side comparison with similar species
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
