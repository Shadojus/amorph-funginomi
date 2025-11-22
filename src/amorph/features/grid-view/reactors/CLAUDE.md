# Grid View - Visual Reactors (Framework Core)

**Last Updated:** 22. November 2025

## Overview

**Domain-agnostic visual effects system.** These reactors add visual effects and behaviors to morphs without modifying their internal logic or knowing about the domain.

**Framework Principle:** Reactors sind vollkommen generisch. GlowReactor kann beliebige HTML-Elemente highlighten (Entity-Karten, Produkt-Karten, Listen-Items), FilterReactor kann beliebige Listen filtern, SortReactor kann beliebige Collections sortieren. Zero domain knowledge.

## Available Reactors

- **GlowReactor** - Adds glow effects to morphs
- **AnimationReactor** - Adds entrance/exit animations
- **PulseReactor** - Adds pulsing effects
- **HoverReactor** - Adds hover effects
- **SortReactor** - Sorts morphs by various criteria
- **FilterReactor** - Filters morphs based on criteria

## Architecture

Each reactor:
- Is a standalone JavaScript class
- Observes morph registration/unregistration
- Can be enabled/disabled dynamically
- Works independently (can be combined)
- Cleans up after itself when disabled

## Usage

Reactors are registered in `core/init.js` and controlled via `window.amorph`:

```javascript
// Enable a reactor
await window.amorph.enableReactor('glow');

// Disable a reactor
await window.amorph.disableReactor('glow');

// Toggle a reactor
await window.amorph.toggleReactor('glow');
```
