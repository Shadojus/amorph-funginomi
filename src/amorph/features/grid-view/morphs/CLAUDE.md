# Grid View - Data Morphs (Framework Core)

**Last Updated:** 27. November 2025

## Overview

**Domain-agnostic data visualization components.** Each morph represents a **data structure type** (not a domain concept) and handles its own rendering, styling, and interactions.

**Framework Principle:** Morphs sind domain-agnostisch. NameMorph zeigt beliebige Namen (Entitäten, Produkte, Personen), TagMorph zeigt beliebige Tags (Kategorien, Eigenschaften, Merkmale), RangeMorph zeigt beliebige Ranges (Größe, Preis, Temperatur, Gewicht). Die Morphs kennen keine domain-spezifischen Felder.

## Available Morphs

### Core Data Morphs
- **NameMorph** - Names with word-wrap, scientific/common variants
- **TextMorph** - Long text with word-break, ellipsis support
- **TagMorph** - Single tags OR arrays of tags as multiple pills
- **ListMorph** - Lists with wrapping items, compact padding
- **BooleanMorph** - Yes/no values with visual indicators
- **NumberMorph** - Numeric values with formatting

### Visual Data Morphs (NEW)
- **RangeMorph** - Visual scale showing {min, max, optimal, unit}
  - Gray track with positioned green segment
  - Shows where range sits on scale
  - Labels: min (left), optimal (center), max (right)
- **ProgressMorph** - Progress bars for {value, max} or {percentage}
- **KeyValueMorph** - Small flat objects as 2-column grid
  - Supports Range objects as values (inline formatting)
  - Responsive grid layout

### Complex Morphs
- **DataMorph** - Generic morph for nested objects
- **ChartMorph** - Bar/Pie/Radar charts
- **SparklineMorph** - Trend lines for number arrays
- **MapMorph** - Geographic data
- **TimelineMorph** - Temporal data

### Design System
- **tokens.js** - Shared design tokens for all morphs

## Architecture

Each morph:
- Is a Lit Web Component with Shadow DOM
- Uses `tokens.js` for consistent styling
- Handles perspective-based visibility
- Supports deep mode highlighting for search
- Emits events for user interactions

### Chart Morphs - Enhanced (2025-11-23)

**BarChartMorph** - Vertical bar charts for numerical arrays
- ✅ Nested value extraction: handles `{value: {value: number, unit: string}}`
- ✅ Auto-unit detection (g, mg, µg, cm, °C, %, etc.)
- ✅ Smart formatting: 1000mg → 1kg, scales large numbers
- ✅ HTML labels with absolute positioning (below bars)
- ✅ Values displayed on top of bars with text-shadows
- ✅ Gradient backgrounds using color-mix()
- ✅ Hover effects with transform and enhanced shadows
- ✅ Perspective color inheritance via CSS variables

**RadarChartMorph** - Spider/Radar charts for multi-dimensional data
- ✅ SVG-based grid and shape rendering
- ✅ HTML label overlays with absolute positioning (percentage-based)
- ✅ Labels + numeric values displayed for each axis
- ✅ Auto-scaling: 0-10 values scaled to 0-100%
- ✅ Multiple text-shadows for label visibility (6-layer outline effect)
- ✅ Perspective color inheritance via CSS variables
- ✅ Supports 3-12 axes with flexible data structures

**PieChartMorph** - Circular charts for categorical data
- ✅ Category-based segments with percentages
- ✅ Color support from data
- ✅ Interactive legends

**CSS Variable System for Perspective Colors:**
```javascript
// DataMorph (parent) inherits from PerspectiveReactor
:host {
  --perspective-color: var(--perspective-color, rgba(255, 255, 255, 0.5));
}

// BarChartMorph/RadarChartMorph (children) use local variable
:host {
  --local-perspective-color: var(--perspective-color, #10b981);
}
```

**Known Issue (2025-11-23):**
- PerspectiveReactor timing issue: Aktiviert sich mit 500ms delay
- Workaround implemented: `getActivePerspectives()` method in MorphHeader
- Colors still not consistently applied (CSS variable cascade through Shadow DOM)

### Responsive Design (2025-11-22)
**ALL morphs now have:**
```css
:host {
  display: block; /* or inline-block */
  max-width: 100%;
  overflow: hidden;
}
```

**Text-based morphs:**
- word-wrap: break-word
- overflow-wrap: break-word
- word-break: break-word (for NameMorph, TextMorph)

**Container morphs:**
- width: 100%, box-sizing: border-box
- flex/grid with proper wrapping
- Compact padding for card layouts

**Visual morphs:**
- Flexible layouts with flex-shrink on labels
- Responsive font sizes (0.7-0.75rem)
- White-space handling for units

## Usage

Morphs are automatically imported by `core/init.js` and registered globally.
