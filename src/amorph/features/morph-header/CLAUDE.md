# 🌍 AMORPH Global Components - MorphHeader

**Last Updated:** 27. November 2025

**Framework Note:** MorphHeader ist **konfigurierbar** für verschiedene Instanzen. Die Perspektiven-Buttons, Branding, und Search-Integration sind über Props/Config anpassbar. Jede Instance definiert ihre eigenen Perspektiven basierend auf ihrer Domäne.

## Structure

```
features/morph-header/
├── MorphHeader.js       # Main header with search & perspective controls (~1540 lines)
├── tokens.js            # Local design tokens
└── CLAUDE.md            # This file
```

## Übersicht

Globale Components für die gesamte App:
- ✅ **MorphHeader.js**: Globaler Header mit Branding, Suche & 18 Perspektiven-Buttons (schema-driven, Multicolor Design)

## 🔗 Related Components

**Uses:**
- `./tokens.js` - Local design tokens
- `../../core/AmorphSystem.js` - Event publishing & perspective state
- `../../../convex/perspectiveFieldMappings.ts` - **SINGLE SOURCE OF TRUTH** for all perspective colors/definitions

**Used by:**
- `../../core/layouts/BaseLayout.astro` - Included in all pages
- All Views (BubbleView, GridView, PerspectiveHost)

**Publishes Events:**
- `perspective:activated` - When user clicks perspective button
- `perspective:deactivated` - When perspective removed from queue
- `perspective-changed` - Global event (window + document) with all active perspectives
- `data-morph:deep-mode-ready` - Triggers highlighting after perspective auto-activation

**See also:**
- `../perspective-system/` - PerspectiveHost responds to perspective events
- `../search-system/` - Both SearchReactors publish matched perspectives
- `../../core/observers/GlobalObserver.js` - Handles global:* events

---

## MorphHeader.js ✨ **[MAJOR UPDATE 2025-11-26]**

### Funktion

**Globaler Header für das gesamte System** - **Kernfunktionen:**
- ✅ **Branding** (Multicolor Gradient Text mit Glow-Effekt)
- ✅ **Search Bar** (Multicolor Gradient Background & Border)
- ✅ **Search Section** (Multicolor Gradient Border & Pulsating Glow)
- ✅ **18 Perspektiven-Buttons** (schema-driven, harmonische Farbgruppen, FIFO max 4)
- ✅ **Active Buttons First** (aktive Perspektiven immer zuerst in der Reihe)
- ✅ **New Activation → Front** (neu aktivierte Buttons gehen an Position 0)
- ✅ **Scroll-Compact Mode** (Header schrumpft beim Scrollen)
- ✅ **Shrinkable Buttons** (inactive kleiner, active größer)
- ✅ **Font Size Hierarchy** (active 0.75rem > inactive 0.625rem)
- ✅ **Auto-Perspective Switching** (basierend auf Search Results)
- ✅ **Debounced Auto-Switching** (400ms delay)
- ✅ **View Mode Buttons** (Grid/Bubble neben Suche)
- ✅ Event Dispatching (window + document für Shadow DOM)

**Entfernt:** ❌ Reactor Toggles

**Latest Features (2025-11-26):**
- ✅ **Scroll-compact mode** mit Hysteresis (>150px = compact, <50px = expand)
- ✅ **requestAnimationFrame** throttled scroll handler (keine Jitter)
- ✅ **Active buttons first** - Rendering sortiert aktive Perspektiven nach vorne
- ✅ **FIFO insert at front** - Neue Aktivierungen gehen an Position 0, älteste werden am Ende entfernt
- ✅ **Font size hierarchy** - Active 0.75rem, Inactive 0.625rem
- ✅ **Branding on own row** - Zentriert über search-perspectives-wrapper
- ✅ **Truncated labels** - overflow:hidden ohne Ellipsis

**Previous Features (2025-11-23):**
- ✅ **getActivePerspectives() API** - Public method for external access
- ✅ **PerspectiveReactor timing workaround** - Retrieves perspectives on first apply()
- ✅ **Pulsating search bar** - Blue glow animation (3s loop, stops on focus)

### Layout-Struktur (Normal Mode)

```
┌──────────────────────────────────────────────────────────────────┐
│                         Funginomi (centered)                     │
│                    Part of the Bifroest (centered)                │
├──────────────────────────────────────────────────────────────────┤
│     [🔍 Search Bar (600px max)           ] [📊] [🫧]             │
├──────────────────────────────────────────────────────────────────┤
│ [ACTIVE1] [ACTIVE2] [ACTIVE3] [inactive4] [inactive5] ...        │
│ (Max 600px, wraps to max 2 rows)                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Layout-Struktur (Scroll-Compact Mode - >150px scroll)

```
┌──────────────────────────────────────────────────────────────────┐
│ (Branding hidden)                                                │
│     [🔍 Search] [📊] [🫧] [ACT1] [ACT2] [in3] [in4] ...          │
│ (Smaller padding, smaller fonts, compressed gaps)                │
└──────────────────────────────────────────────────────────────────┘
```

### Perspectives Configuration (Schema-Driven)

```javascript
// Perspectives loaded from perspectiveFieldMappings.ts (NOT hardcoded!)
this.perspectives = this._loadPerspectivesFromSchema();

// _loadPerspectivesFromSchema() converts perspectiveDefinitions to array format
// Each perspective has: name, label, icon, color, description, category, order
```

### Scroll Compact Behavior ⭐ NEW (2025-11-26)

**Hysteresis-based scroll handling:**
- >150px scroll → Compact mode (branding hidden, smaller buttons)
- <50px scroll → Expand mode (branding visible, normal buttons)
- requestAnimationFrame throttled to prevent jitter

```javascript
handleScroll() {
  if (this.scrollTicking) return;
  
  this.scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    
    // Hysteresis: Different thresholds for enter/exit
    if (y > 150 && !this.isScrolled) {
      this.isScrolled = true;
    } else if (y < 50 && this.isScrolled) {
      this.isScrolled = false;
    }
    
    this.scrollTicking = false;
  });
}
```

### FIFO Perspektiven-Management ⭐ UPDATED (2025-11-26)

**New activation goes to FRONT (position 0), oldest removed from END:**

```javascript
togglePerspective(perspective) {
  const isActive = this.activePerspectives.find(p => p.name === perspective.name);
  
  if (isActive) {
    this.removePerspective(perspective);
  } else {
    // FIFO: Remove LAST (oldest) when at max
    if (this.activePerspectives.length >= this.maxPerspectives) {
      const removed = this.activePerspectives[this.activePerspectives.length - 1];
      this.activePerspectives = this.activePerspectives.slice(0, -1); // Remove last
    }
    
    // Insert at FRONT (position 0)
    this.activePerspectives = [perspective, ...this.activePerspectives];
    this.dispatchPerspectiveChange();
  }
}
```

### Button Rendering (Active First) ⭐ NEW (2025-11-26)

**Active perspectives are always rendered first:**

```javascript
render() {
  // Sort: active perspectives first, then inactive
  const activePerspectives = this.perspectives.filter(p => 
    this.activePerspectives.some(ap => ap.name === p.name)
  );
  const inactivePerspectives = this.perspectives.filter(p => 
    !this.activePerspectives.some(ap => ap.name === p.name)
  );
  const sortedPerspectives = [...activePerspectives, ...inactivePerspectives];
  
  return html`
    <div class="perspectives-row">
      ${sortedPerspectives.map(p => this.renderPerspectiveButton(p))}
    </div>
  `;
}
```

### CSS Font Size Hierarchy

```css
/* Active buttons: larger, prominent */
.perspective-btn.active {
  padding: 0.4375rem 0.75rem;
  font-size: 0.75rem;         /* Larger */
  font-weight: 600;
  opacity: 1;
}

/* Inactive buttons: smaller, dimmed */
.perspective-btn.inactive {
  padding: 0.3125rem 0.5rem;
  font-size: 0.625rem;        /* Smaller */
  opacity: 0.4;
}

/* Scroll compact: even smaller */
.header.scrolled .perspective-btn.active {
  font-size: 0.5625rem;
}

.header.scrolled .perspective-btn.inactive {
  font-size: 0.5rem;
  max-width: 3.5rem;          /* Truncated */
}
```

### Auto-Perspective Switching (Search-Based)

**Automatic perspective activation from search results (400ms debounced):**
- Only activates FIRST missing perspective (prevents FIFO cascade)
- Dispatches `data-morph:deep-mode-ready` after activation completes
- Uses `_isAutoActivating` flag to prevent duplicate timers

### View Mode Buttons

**Grid/Bubble toggle buttons next to search:**
```html
<div class="search-container">
  <div class="search-section">...</div>
  <div class="view-mode-buttons">
    <button class="view-mode-btn" data-view="grid">📊</button>
    <button class="view-mode-btn" data-view="bubble">🫧</button>
  </div>
</div>
```

---

## Responsive Breakpoints

| Breakpoint | Branding | Buttons | Font Sizes |
|------------|----------|---------|------------|
| >1200px | Full | Icons + Labels | Active 0.75rem, Inactive 0.625rem |
| 768-1200px | Full | No icons | Same |
| 480-768px | Smaller | Compact | Active 0.5625rem, Inactive 0.5rem |
| <480px | Very small | Very compact | Active 0.5rem, Inactive 0.4375rem |
| Scrolled | Hidden | Truncated | Even smaller |

---

## Status: ✅ PRODUCTION READY

**Latest (2025-11-26):**
- ✅ Scroll-compact mode with hysteresis
- ✅ Active buttons rendered first
- ✅ New activations go to front (position 0)
- ✅ Font size hierarchy (active > inactive)
- ✅ Branding centered above search
- ✅ requestAnimationFrame throttled scroll
