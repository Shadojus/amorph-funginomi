# Grid View - Data Morphs (Framework Core)

**Last Updated:** 22. November 2025

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
