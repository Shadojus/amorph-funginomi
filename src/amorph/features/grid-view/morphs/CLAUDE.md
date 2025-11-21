# Grid View - Data Morphs

**Last Updated:** 21. November 2025

## Overview

Data Morphs for the Grid View feature. Each morph represents a specific data type and handles its own rendering, styling, and interactions.

## Available Morphs

- **NameMorph** - Displays fungus names with scientific/common variants
- **ImageMorph** - Displays fungus images with lazy loading
- **TagMorph** - Displays clickable tags that activate perspectives
- **TextMorph** - Displays rich text with deep mode highlighting
- **BooleanMorph** - Displays yes/no values with visual indicators
- **NumberMorph** - Displays numeric values with formatting
- **ListMorph** - Displays lists of items
- **DataMorph** - Generic morph for any data type
- **ChartMorph** - Displays data as charts
- **MapMorph** - Displays geographic data
- **TimelineMorph** - Displays temporal data
- **tokens.js** - Shared design tokens for all morphs

## Architecture

Each morph:
- Is a Lit Web Component
- Uses `tokens.js` for consistent styling
- Handles perspective-based visibility
- Supports deep mode highlighting for search
- Emits events for user interactions

## Usage

Morphs are automatically imported by `core/init.js` and registered globally.
