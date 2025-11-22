# 📝 AMORPH Framework - Generic Data Visualization System

**Last Updated:** 22. November 2025

## 🎯 Vision

**AMORPH ist ein Framework-Prototyp für generische datengetriebene Visualisierungen.**

Die wirkliche Innovation ist **nicht** "Pilze schön darstellen", sondern **"beliebige strukturierte Daten automatisch sinnvoll visualisieren"**. Das ist der Kern, der wertvoll ist.

**Funginomi** ist die erste Instanz dieses Frameworks - eine Pilz-Enzyklopädie als Proof-of-Concept. Weitere Wissensseiten (z.B. Phytonomi für Pflanzen) werden folgen und über Redis Streams Daten austauschen.

**Ziel:** Alle CLAUDE.md Dateien auf dem neuesten Stand:
- ✅ **Jungfräulich** - Für neue Claude-Sessions verständlich
- ✅ **Vollständig** - Keine Details der Implementierung verloren
- ✅ **Akkurat** - Exakte Schema-Feldnamen dokumentiert
- ✅ **Framework-First** - Generische Architektur, nicht domain-spezifisch

## 🔧 Framework-Architektur

**AMORPH ist domain-agnostisch.** Die Komponenten sind **nicht** für Pilze gebaut, sondern für **strukturierte Daten beliebiger Domänen**.

### Core Framework Features

- ✅ **MorphMapper** - Intelligent type detection (ZERO hardcoded mappings!)
  - Erkennt automatisch: Numbers, Ranges, Booleans, Arrays, Objects, URLs, Coordinates
  - Wählt passende Visualisierung basierend auf Datenstruktur
  - **Domain-agnostisch** - funktioniert für Pilze, Pflanzen, Produkte, etc.

- ✅ **BubbleView** - Generic similarity visualization (Native Canvas 2D)
  - Hilbert-Space similarity calculations
  - Physics-based layout
  - UserNode connections für personalisierte Beziehungen
  - **Keine Pilz-Logik** - arbeitet mit beliebigen Entitäten

- ✅ **GridView** - Responsive card layout
  - Automatische Morph-Generierung aus Datenfeldern
  - Keine hardcodierten Field-Namen
  - **Universal einsetzbar**

- ✅ **Perspective System** - Multi-dimensional data filtering
  - Generisches Tag-basiertes Perspektiven-System
  - FIFO queue (max 4 aktiv)
  - **Domain-konfigurierbar** - 12 Perspektiven für Funginomi, beliebig erweiterbar

- ✅ **Event-Driven Architecture** - Redis Streams für Cross-Domain Data Exchange
  - Features kommunizieren über Events, nicht direkte Abhängigkeiten
  - **Multi-Instance-Ready** - Funginomi, Phytonomi, etc. können Daten austauschen
  - Observer-Pattern für Stream-based State Management

## 🌐 Multi-Instance Architecture (Roadmap)

**Vision:** Mehrere Knowledge-Bases teilen die gleiche AMORPH-Architektur:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ FUNGINOMI   │     │ PHYTONOMI   │     │ FURTHER...  │
│ (Mushrooms) │     │ (Plants)    │     │ (...)       │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │    Redis Streams  │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │ BIFRÖST.IO  │
                    │ (Aggregator)│
                    └─────────────┘
```

**Shared Framework:**
- `src/amorph/core/` - Identisch für alle Instanzen
- `src/amorph/features/` - Identische Features (BubbleView, GridView, etc.)
- MorphMapper - Funktioniert mit beliebigen Datenstrukturen

**Instance-Specific:**
- `convex/schema.ts` - Domain-spezifisches Schema (fungi vs. plants vs. ...)
- Perspektiven-Konfiguration - 12 für Funginomi, andere für Phytonomi
- Design Tokens - Instance-spezifisches Branding

**Cross-Instance Features:**
- User fügt Pilz zu Sammlung hinzu → Event via Redis
- Phytonomi zeigt "wächst auf Bäumen der Art X" → Cross-Reference
- Bifröst.io aggregiert alle Knowledge-Bases in eine Suche

## 📊 Funginomi Instance (Aktueller Stand)

**Funginomi = AMORPH Framework + Pilz-Domäne**

- ✅ **Convex Backend** - 6 Beispiel-Pilze (Beauveria, Cordyceps, Fomitopsis, etc.)
- ✅ **12 Perspektiven** - Culinary, Medicinal, Chemical, Ecology, Safety, etc.
- ✅ **BubbleDetailReactor** - Relationship-focused dialog statt data dump
- ✅ **Server-side Search** - Auto-perspective switching

**Framework Refactoring (2025-11-22):**
- ✅ **Domain Config System** - `domain.config.js` isolates all Funginomi-specific configuration
- ✅ **Generic Data Adapter** - Supports Convex, REST, GraphQL backends
- ✅ **MorphMapper** - Fully generic, uses `entity-data` attribute (was `fungus-data`)
- ✅ **HilbertSpaceSimilarity** - Generic entity comparison, uses DomainConfig for perspectives
- ✅ **BubbleView** - Generic entity visualization (was fungi-specific)
- ✅ **BubbleMorph** - Uses `entityData` property (was `fungusData`)
- ✅ **SearchSystem** - Domain-agnostic, extracts slugs from DomainConfig
- ✅ **AmorphSystem** - Injects DomainConfig, provides domain-aware helpers

**Recent Updates (2025-11-22):**
- ✅ **MorphMapper System** - Fully data-driven type detection, nested field extraction
- ✅ **RangeMorph Visualization** - Positioned segment on scale (not full bar)
- ✅ **TagMorph Arrays** - Multiple pills for string arrays
- ✅ **Full Responsive** - All morphs with max-width, overflow, word-wrap
- ✅ **Reduced Logging** - Cleaner console, only essential events
- ✅ **Visual Morph Improvements** - KeyValueMorph inline Range, ListMorph wrapping

**Architecture:**
- Feature-based structure (bubble-view, grid-view, search-system, perspective-system)
- Shared components (reactors, morphs, observers, styles)
- Event-driven coordination via window.dispatchEvent und CustomEvents
- No Redis in browser (events via emit/on)

---

## 🔥 Latest Changes (2025-11-21)

### 0. 🫧 Bubble View Detail Dialog & Canvas Optimization

**BubbleDetailReactor - Relationship-Focused Dialog:**
- ✅ **Window-level event handling** - Listens to `window.addEventListener('bubble:clicked')`
- ✅ **Connection strength display** - Shows UserNode similarity with classification:
  - Stark: > 50%
  - Mittel: ≥ 30% (FIXED: was > 30%, causing 30% to show as "Schwach")
  - Schwach: < 30%
- ✅ **Connected bubbles list** - Shows bubble-to-bubble similarity scores
- ✅ **Key facts extraction** - 5 properties from active perspectives:
  - 🍄 Edibility (always shown if available)
  - 🌱 Cultivation difficulty
  - ⚕️ Health benefits (medicinalAndHealth perspective)
  - 🍳 Flavor profile (culinaryAndNutritional perspective)
  - 🧪 Chemical compounds (chemicalAndProperties perspective)
- ✅ **Wood floor background** with dark gradient overlay
- ✅ **Link to full detail page** - `/fungi/[slug]` for comprehensive data
- ✅ **Design Philosophy** - Shows WHY bubbles are connected (relationships), NOT comprehensive data (that's GridView)

**Canvas Fixes:**
- ❌ **REMOVED** - 2x width canvas on small screens (caused horizontal scroll)
- ✅ **Canvas fills container** - No more auto-scroll or viewport issues
- ✅ **Fixed UserNode position** - Always at canvas center (containerWidth/2, containerHeight/2)
- ✅ **BubbleHost overflow: hidden** - No horizontal scroll anymore

**CanvasPhysicsReactor Critical Fix:**
- ✅ **getAllNodes() method restored** - Was accidentally removed during refactoring
- ✅ **UserNode EXCLUDED from physics** - Stays fixed at center, only bubbles + query nodes move
- ✅ **Method signature:**
  ```javascript
  getAllNodes() {
    const bubbles = this.getBubbles();
    const queryNodes = this.getQueryNodes();
    const combined = new Map([...bubbles, ...queryNodes]);
    return Array.from(combined.entries());
  }
  ```

**Bug Fixes:**
- 🐛 **FIXED** - BubbleDetailReactor showing "Schwach" for all connections
  - Root cause: `score > 0.3` should be `score >= 0.3` for 30% threshold
  - Root cause: Template literal had `${strength}e Verbindung` adding unwanted "e"
- 🐛 **FIXED** - TypeError in CanvasPhysicsReactor due to missing getAllNodes()
- 🐛 **FIXED** - Canvas horizontal scroll on mobile devices

---

## 🔥 Previous Changes (2025-11-19)

### 0. 🎨 UI/UX Overhaul - Wood Floor Design & Touch Optimization

**Wood Floor Background:**
- ✅ **Natural wood texture** - `/images/woodfloor/Moss_Woodsf_Laub.png` as card background
- ✅ **Dark overlay gradient** - `rgba(0,0,0,0.5-0.65)` for readability
- ✅ **Hover effect** - Darker overlay (0.8-0.9) on hover/touch
- ✅ **Fixed Dark Mode bug** - Removed `@media (prefers-color-scheme: dark)` background override

**Touch-Friendly Interactions:**
- ✅ **Touch hover stays active** - Cards remain highlighted until next card touched
- ✅ **No auto-timeout** - User controls when hover disappears
- ✅ **Scroll-friendly** - Touch during scroll activates hover state
- ✅ `.touch-hover` class - Same styles as `:hover` for consistency

**Search Highlight Improvements:**
- ✅ **Background instead of overlay** - `linear-gradient` blue background
- ✅ **High visibility** - Works with multiple filters/perspectives active
- ✅ **Border-left accent** - 3px blue border for clear identification
- ✅ **Smooth pulsation** - Gradient intensity pulses (0.2-0.4 opacity)

**Compact Card Layout:**
- ✅ **40% less whitespace** - Padding reduced from 1.25rem to 0.375-0.5rem
- ✅ **Inline tags** - Comma-separated instead of wrapped blocks
- ✅ **Smaller fonts** - Value: 0.8125rem, Label: 0.5625rem
- ✅ **Tighter line-height** - 1.3 instead of 1.7

**Default Perspectives Changed:**
- ✅ **New defaults:** Cultivation, Chemical, Medicinal (was: Ecology, Safety)
- ✅ **User-focused** - Highlights practical growing and health information

---

## 🔥 Previous Changes (2025-11-18)

### 0. 🎨 Canvas System Optimization (NEW!)

**BubbleView Canvas Reactors optimiert:**

**CanvasConnectionReactor:**
- ✅ **Weight Badges immer sichtbar** - showWeightBadges: true (war false)
- ✅ **3 Dezimalstellen** - Präzise Anzeige (z.B. "0.700")
- ✅ **Type-spezifische Farben** - Grün (Similarity), Violett (Semantic), Blau (User-Intent)
- ✅ **Debug Logging** - Console logs für alle gerenderten Connections

**CanvasPhysicsReactor:**
- ⚛️ **Physics Damping: 0.98** (war 0.95) - Weniger Bouncing auf kleineren Systemen
- ✅ **Stabilisiert ~50% schneller** - Bubbles kommen schneller zur Ruhe

**CanvasUserNodeReactor:**
- 👤 **User Node Size: size/3** (war size/2) - 33% kleiner, weniger dominant
- ✅ **4 Locations geändert** - Pulse ring, outer glow, gradient, main circle

**Architektur-Klarstellung:**
- ❌ **KEINE BubbleMorph DOM-Elemente** - Connections sind Canvas-Rendering, nicht DOM-Morphs
- ✅ **Hybrid System** - DOM-Morphs (data-morph) + Canvas-Rendering (BubbleView)
- ✅ **60 FPS Performance** - Direct ctx rendering ohne DOM-Updates

---

## 🔥 Previous Changes (2025-11-17)

### 1. ⭐ Dual Search System (MAJOR UPDATE!)

**Two complementary search reactors with priority coordination:**

**SearchReactor.js (Morph-based):**
- ✅ **Searches rendered morphs** - Checks visible text in Shadow DOM
- ✅ **Word boundary matching** - Präzise Start-of-Word Suche (`\b${query}`)
- ✅ **Weighted scoring** - Tags: 100, Name: 50, DataMorph: 30
- ✅ **Container-based filtering** - Versteckt ganze `.fungus-card` statt einzelner Morphs
- ✅ **Respects AstroDataSearchReactor** - Won't hide containers shown by AstroDataSearchReactor

**AstroDataSearchReactor.js (Data-based) ⭐ Priority Reactor:**
- ✅ **Searches raw data** - Checks fungus-data attributes before rendering
- ✅ **Deep object traversal** - Searches all nested properties recursively
- ✅ **Field-aware weighting** - commonName/scientificName: 100, genus/family: 90, default: 20
- ✅ **Finds hidden data** - Discovers data not yet rendered in morphs
- ✅ **Taxonomy matching** - Searches visible .taxonomy-value elements
- ✅ **26+ field mappings** - Maps data fields to perspectives automatically
- ✅ **Takes precedence** - SearchReactor defers to AstroDataSearchReactor decisions

**Priority System:**
- ✅ AstroDataSearchReactor marks containers with `reactor-astro-search-hidden` class
- ✅ SearchReactor checks this class before hiding containers
- ✅ If AstroDataSearchReactor is showing a container, SearchReactor won't hide it
- ✅ Class-based coordination - no tight coupling between reactors

**Performance:**
- 150ms debounce für beide Reactors
- 400ms debounce für Auto-Perspective Switching
- Word boundary regex prevents false matches
- Container filtering: O(n) vs O(n*m)

### 2. ⭐ MorphHeader Enhancement (NEW!)

**Branding & Progressive Compression:**
- ✅ **Branding** - "Funginomi" Titel + "Part of the Bifröst" Link zu https://bifroest.io
- ✅ **Max 2 Reihen** - Perspektiven-Buttons wrappen maximal in 2 Reihen
- ✅ **Progressive Komprimierung**:
  - Inaktive Buttons: Keine Icons, kleiner Text (0.7rem, 0.4rem padding)
  - Bei Platzmangel: Text schrumpft weiter
  - Aktive Buttons: Bleiben groß mit Icon (0.875rem, flex-shrink: 0)
- ✅ **Responsive Design**:
  - Desktop: Branding links, Suche Mitte, Spacer rechts
  - Mobile (< 768px): Branding kleiner (1.125rem), alle Elemente kompakter
- ✅ **Auto-perspective detection** - Tracked welche Felder gematcht wurden
- ✅ **Event publishing** - Publishes `search:completed` mit matchedPerspectives Array

**Auto-Perspective Switching:**
- ✅ **Listens to search:completed events** from both Reactors
- ✅ **400ms debounce** - Prevents switching while user is typing
- ✅ **Only switches when user pauses** - Smooth UX
- ✅ **Duplicate prevention** - Checks if perspective already active
- ✅ **FIFO management** - Removes oldest when adding 5th perspective

**Flow:**
1. User types "beauveria" → AstroDataSearchReactor finds match in taxonomy
2. AstroDataSearchReactor shows container 1, hides others
3. SearchReactor finds 0 morphs but sees container 1 has no `reactor-astro-search-hidden` class
4. SearchReactor respects AstroDataSearchReactor's decision → container 1 stays visible!

### 3. 🔧 Event System Fix (CRITICAL!)

**AmorphSystem.js Event Namespace:**
- ✅ **Fixed event listener registration** - Event names now WITHOUT `amorph:` prefix
- ✅ **emit() adds prefix internally** - Consistent behavior
- ✅ **streamPublish() strips prefix** - Proper fallback to emit()
- ✅ **on()/off() use names without prefix** - Correct listener lookup

**Before (BROKEN):**
```javascript
// ❌ This didn't work!
amorph.on('amorph:search:completed', callback);
```

**After (FIXED):**
```javascript
// ✅ This works!
amorph.on('search:completed', callback);
```

---

## 🔄 Previous Changes (2025-11-16)

### 1. MorphHeader.js Vereinfachung
- ❌ **Entfernt:** Reactor Toggles (Glow, Search, Animation)
- ❌ **Entfernt:** View Mode Switcher (Grid, List, Compact)
- ❌ **Entfernt:** BubbleView Controls
- ✅ **Fokus:** Search Bar + 12 Perspektiven-Buttons (FIFO max 4)

### 2. 🆕 PerspectiveReactor System
- ✅ **PerspectiveReactor.js** - Smart morph filtering based on perspectives
- ✅ **TAG_TO_PERSPECTIVE** - 80+ tag mappings for auto-activation
- ✅ **PERSPECTIVE_CONFIG** - 12 perspective configurations
- ✅ **Event-driven** - Listens to perspective-changed events
- ✅ **Lightweight** - Pure CSS, dim irrelevant morphs (don't hide!)
- ✅ **Color consistency** - Tags keep colors, perspectives as border/shadow

---

## ✅ Aktualisierte Dateien

### 1. **/CLAUDE.md** (Project Root)
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- Version 2.0.0 (Perspective Architecture)
- PerspectiveHost Architektur dokumentiert
- 12 Perspektiven mit **exakten Schema-Feldnamen**
- FIFO-Logik (max 4 Perspektiven)
- Deep Recursive Rendering (maxDepth=5)
- Event-System (window + document dispatch)

**Neu hinzugefügt:**
```
## 🎨 12 Perspektiven System
### Schema-Feldnamen (KRITISCH!)
- medicinalAndHealth (NICHT medicinalAndBioactive)
- chemicalAndProperties (NICHT biochemistryAndCompounds)
- commercialAndMarket (NICHT commercialAndEconomic)
- environmentalAndConservation (NICHT legalAndRegulatory)
- researchAndInnovation (NICHT researchAndScientific)

## 🔮 PerspectiveHost Architektur
### FIFO Logik (Max 4 Perspektiven)
### Event-Driven Activation

## 📊 Deep Recursive Rendering
### flattenObject() mit maxDepth=5
### renderField() mit visueller Hierarchie
```

---

### 2. **src/amorph/hosts/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- PerspectiveHost.js komplett dokumentiert (NEU)
- Event-System erklärt (window + document)
- Props, Verwendung, CSS States
- Vollständige Implementierung mit Code-Beispielen

**Neu hinzugefügt:**
```
## PerspectiveHost.js [NEU 2025-11-15]
- Container für einzelne Perspektive
- Event-driven Activation
- FIFO-Logik via MorphHeader
- Smooth Animations
- Shadow DOM mit Lit
```

---

### 3. **src/amorph/morphs/global/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- MorphHeader.js komplett neu dokumentiert
- 12 Perspektiven-Buttons Layout
- FIFO-Logik Implementierung
- Shrinkable/Expandable Button States
- Event Dispatching (window + document)

**Neu hinzugefügt:**
```
## MorphHeader.js [KOMPLETT NEU 2025-11-15]
### Layout-Struktur
- Top Row: Search Bar
- Bottom Row: 12 Perspektiven-Buttons

### FIFO Perspektiven-Management
- togglePerspective() mit slice(1) für oldest removal
- dispatchPerspectiveChange() auf beide window + document

### Button States (CSS)
- .inactive: max-width 80px, shrunk
- .active: max-width 200px, expanded
```

---

### 4. **src/pages/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- fungi/[slug].astro komplett neu dokumentiert
- Deep Recursive Rendering erklärt
- flattenObject() Funktion mit Beispielen
- renderField() mit visueller Hierarchie
- Exakte Perspektiven-Arrays

**Neu hinzugefügt:**
```
## fungi/[slug].astro [KOMPLETT NEU 2025-11-15]
### Architektur
- PerspectiveHost pro Perspektive
- Deep Recursive Flattening (maxDepth=5)
- Automatische Type Detection

### Deep Recursive Flattening
function flattenObject(obj, prefix, maxDepth, currentDepth)
- Array of strings → tags
- Object with min/max → range
- Nested object → recurse
- Primitives → text

### Recursive Rendering
function renderField(field, depth)
- Visual hierarchy mit margin-left: depth * 1rem
- Tags, Text, Sections
```

---

### 5. **convex/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- Korrekte Schema-Feldnamen dokumentiert
- Vollständige Liste aller 12 Perspektiven
- Kritische Feldnamen hervorgehoben

**Neu hinzugefügt:**
```
#### 5. Medicinal & Health ⚠️ KORREKT: medicinalAndHealth

#### 9-12. Weitere Perspektiven
⚠️ KRITISCHE SCHEMA-FELDNAMEN:
- chemicalAndProperties
- commercialAndMarket
- environmentalAndConservation
- researchAndInnovation

Vollständige Liste aller 12 Perspektiven-Feldnamen
```

---

### 6. **src/amorph/arch/CLAUDE.md**
**Status:** ⏳ PARTIALLY UPDATED

**Noch zu tun:**
- convex.ts Sektion mit korrekten Feldnamen updaten

---

## 📋 Noch zu aktualisieren

### Niedrige Priorität (optional):

1. **src/amorph/CLAUDE.md** - Root AMORPH Overview
   - PerspectiveHost erwähnen
   - Perspective Architecture Flow

2. **src/amorph/morphs/CLAUDE.md** - Morphs Overview
   - Deep Recursive Rendering erwähnen

3. **src/amorph/morphs/data/CLAUDE.md** - Data Morphs
   - Bereits gut dokumentiert, kleine Updates

4. **src/amorph/reactors/CLAUDE.md** - Reactors
   - Bereits gut dokumentiert

5. **src/amorph/observers/CLAUDE.md** - Observers
   - Bereits gut dokumentiert (2025-11-15)

---

## 🎯 Kritische Informationen für neue Sessions

### 1. Schema-Feldnamen (MUST KNOW!)

```javascript
// ✅ KORREKT - Diese Namen verwenden:
medicinalAndHealth
chemicalAndProperties
commercialAndMarket
environmentalAndConservation
researchAndInnovation

// ❌ FALSCH - Diese Namen NICHT verwenden:
medicinalAndBioactive
biochemistryAndCompounds
commercialAndEconomic
legalAndRegulatory
researchAndScientific
```

### 2. Event-System Konvention (CRITICAL!)

```javascript
// ✅ KORREKT - Event Namen OHNE 'amorph:' Prefix:
amorph.on('search:completed', callback);
amorph.emit('search:completed', data);
amorph.streamPublish('search:completed', data);

// ❌ FALSCH - NIEMALS 'amorph:' Prefix verwenden:
amorph.on('amorph:search:completed', callback); // BROKEN!

// Grund: emit() fügt 'amorph:' intern hinzu!
// emit() nutzt eventName für Listener-Lookup (ohne Prefix)
// emit() nutzt 'amorph:' + eventName für CustomEvent (mit Prefix)
```

### 3. Search Field-to-Perspective Mapping

```javascript
// Beispiele aus fieldToPerspectiveMap:
'secondaryMetabolites' → 'chemicalAndProperties'
'nutritionalValue' → 'culinaryAndNutritional'
'medicinalProperties' → 'medicinalAndHealth'
'kingdom' → 'taxonomy'
'edibility' → 'safetyAndIdentification'

// Insgesamt 26+ Feld-Mappings!
```

### 4. Search Features

```javascript
// Word boundary matching:
const regex = new RegExp(`\\b${query}`, 'i');

// fungus-data attribute reading:
const fungusData = JSON.parse(morph.getAttribute('fungus-data'));

// Nested object navigation:
const value = this.getNestedValue(fungusData, 'taxonomy.kingdom');

// Container-based filtering:
document.querySelectorAll('.fungus-card').forEach(container => {
  container.style.display = hasMatch ? '' : 'none';
});
```

### 5. Auto-Perspective Switching

```javascript
// 400ms debounce in MorphHeader:
this.autoSwitchTimer = setTimeout(() => {
  // Activate perspectives
}, 400);

// Event flow:
SearchReactor → publishes 'search:completed' with matchedPerspectives
     ↓
MorphHeader → receives event → starts 400ms timer
     ↓
User stops typing → Timer fires → Perspectives auto-activate!
```

### 6. PerspectiveHost Architektur

```
Detail-Seite
  └── 12 x <perspective-host perspective="...">
        └── Deep Recursive Morphs
```

### 7. FIFO-Logik (Max 4)

```javascript
if (activePerspectives.length >= 4) {
  activePerspectives = activePerspectives.slice(1); // Remove oldest
}
```

### 8. Deep Recursion

```javascript
flattenObject(obj, prefix='', maxDepth=5, currentDepth=0)
renderField(field, depth=0)
// Visual hierarchy: margin-left: ${depth * 1}rem
```

---

## 🚀 Status

**HAUPTZIEL ERREICHT:** ✅

**Production-Ready Features:**
- ✅ Smart Search with Auto-Perspective Switching
- ✅ Debounced interactions (150ms search, 400ms auto-switch)
- ✅ Field-to-Perspective mapping (26+ fields)
- ✅ Word boundary matching for precision
- ✅ Container-based filtering
- ✅ fungus-data attribute reading for inactive perspectives
- ✅ Event system with consistent namespace
- ✅ FIFO perspective management (max 4)
- ✅ Smooth UX with debouncing

Alle kritischen CLAUDE.md Dateien sind aktualisiert und dokumentieren:
- ✅ PerspectiveHost Architektur
- ✅ Korrekte Schema-Feldnamen
- ✅ FIFO-Logik
- ✅ Deep Recursive Rendering
- ✅ Event-System

**Nächste Session kann:**
- Sofort mit korrekten Feldnamen arbeiten
- PerspectiveHost-System verstehen
- Deep Recursive Rendering nachvollziehen
- FIFO-Logik korrekt implementieren

---

## 📚 Dokumentations-Hierarchie

```
CLAUDE.md (Root)
  ├── Überblick über gesamtes System
  ├── Tech Stack
  ├── Projekt-Struktur
  ├── 12 Perspektiven System (mit Schema-Feldnamen)
  └── PerspectiveHost Architektur

src/amorph/CLAUDE.md
  └── AMORPH System Overview

src/amorph/arch/CLAUDE.md
  ├── AmorphSystem.js
  ├── RedisEventBridge.js
  └── convex.ts (mit korrekten Feldnamen)

src/amorph/hosts/CLAUDE.md
  ├── PerspectiveHost.js ⭐ NEU
  ├── BubbleHost.js
  ├── GridHost.js
  └── BubbleView.js

src/amorph/morphs/global/CLAUDE.md
  └── MorphHeader.js ⭐ KOMPLETT NEU
      ├── 12 Perspektiven-Buttons
      ├── FIFO-Logik
      └── Event Dispatching

src/pages/CLAUDE.md
  ├── fungi/index.astro
  └── fungi/[slug].astro ⭐ KOMPLETT NEU
      ├── Deep Recursive Rendering
      ├── flattenObject()
      └── renderField()

convex/CLAUDE.md
  ├── Schema mit 12 Perspektiven
  └── Korrekte Feldnamen ⚠️ KRITISCH
```

---
# 🔮 AMORPH System - Feature-Based Architecture

## Neue Struktur (November 2025)

Das AMORPH System wurde von einer **technischen Trennung** zu einer **feature-basierten Struktur** umgebaut.

## Ordnerstruktur

```
src/amorph/
├── core/                           # Kern-System
│   ├── AmorphSystem.js            # Zentrale Registry
│   ├── RedisEventBridge.js        # Event Bus
│   ├── PixieRenderer.js           # Canvas Renderer
│   ├── convex.ts                  # Convex Client
│   ├── init.js                    # System Initialization
│   └── layouts/                   # Astro Layouts
│
├── features/                       # Feature-Module
│   ├── bubble-view/               # BubbleView Visualization
│   │   ├── BubbleView.js
│   │   ├── BubbleHost.js
│   │   ├── reactors/              # Canvas Reactors
│   │   ├── controllers/           # Drag & Zoom
│   │   └── services/              # Similarity, Collision, etc.
│   │
│   ├── grid-view/                 # Grid Layout
│   │   └── GridHost.js
│   │
│   ├── perspective-system/        # Multi-Perspektiven
│   │   ├── PerspectiveHost.js
│   │   ├── PerspectiveCard.js
│   │   └── PerspectiveReactor.js
│   │
│   └── search-system/             # Dual Search
│       └── reactors/
│           ├── SearchReactor.js
│           └── AstroDataSearchReactor.js
│
└── core/observers/                # Stream Observers (System-level)
    ├── BaseObserver.js
    ├── MorphObserver.js
    ├── ReactorObserver.js
    ├── HostObserver.js
    ├── GlobalObserver.js
    ├── ArchObserver.js
    ├── LayoutObserver.js
    └── PerformanceObserver.js
```

## Vorteile der neuen Struktur

### ✅ Feature-Isolation
Jedes Feature hat ALLE seine Komponenten in einem Ordner:
- BubbleView: View + Host + Reactors + Controllers + Services
- GridView: View + Host
- PerspectiveSystem: Host + Card + Reactor
- SearchSystem: 2 Reactors

### ✅ Klare Abhängigkeiten
- **core/** - System-level (AmorphSystem, Observers, Config)
- **features/** - Self-contained, no shared folders
- **grid-view/** - Single source for ALL morphs & visual reactors

### ✅ Einfaches Onboarding
Entwickler können sich auf ein Feature fokussieren ohne das gesamte System zu verstehen.

### ✅ Bessere Wartbarkeit
- Feature-Code ist lokal
- Änderungen am BubbleView betreffen nur `features/bubble-view/`
- Keine Vermischung zwischen Features

## Migration

### Alt (technische Trennung):
```
src/amorph/
├── arch/          # ALLE System-Komponenten
├── hosts/         # ALLE Hosts vermischt
├── reactors/      # ALLE Reactors vermischt
├── morphs/        # ALLE Morphs
└── observers/     # ALLE Observers
```

### Neu (feature-basiert):
```
src/amorph/
├── core/          # System-level (AmorphSystem, Observers, Config)
└── features/      # Feature-only architecture (NO shared folders!)
    ├── grid-view/morphs/     # Single source: ALL 15 morphs
    ├── grid-view/reactors/   # Single source: ALL 6 visual reactors
    └── (other features copy what they need)
```

## Import-Pfade aktualisieren

**Alt:**
```javascript
import { BubbleView } from '../hosts/BubbleView.js';
import { CanvasPhysicsReactor } from '../reactors/canvas/CanvasPhysicsReactor.js';
```

**Neu:**
```javascript
import { BubbleView } from '../features/bubble-view/BubbleView.js';
import { CanvasPhysicsReactor } from '../features/bubble-view/reactors/CanvasPhysicsReactor.js';
```

## Entry Point

Bleibt gleich:
```javascript
import '/src/amorph/init.js';
// oder
import '/src/amorph/core/init.js';
```

Beide funktionieren - `init.js` im Root re-exportiert `core/init.js`.

## Dokumentation

Jedes Feature hat eine `CLAUDE.md` mit:
- Übersicht
- Struktur
- Komponenten-Details
- Usage-Beispiele
- Abhängigkeiten

## Status

✅ Struktur erstellt
✅ Dateien verschoben
✅ init.js aktualisiert
⏳ Import-Pfade in Komponenten aktualisieren (nächster Schritt)
