# 📝 AMORPH Framework - Generic Data Visualization System

**Last Updated:** 26. November 2025

## 🎯 Vision

**AMORPH ist ein Framework-Prototyp für generische datengetriebene Visualisierungen.**

Die wirkliche Innovation ist **"beliebige strukturierte Daten automatisch sinnvoll visualisieren"**. Das ist der Kern, der wertvoll ist.

**Funginomi** ist die erste Instanz dieses Frameworks - eine Knowledge-Base als Proof-of-Concept. Weitere Instanzen mit anderen Domänen werden folgen und über Redis Streams Daten austauschen.

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
  - **Domain-agnostisch** - funktioniert für beliebige strukturierte Daten

- ✅ **BubbleView** - Generic similarity visualization (Native Canvas 2D)
  - Hilbert-Space similarity calculations
  - Physics-based layout
  - UserNode connections für personalisierte Beziehungen
  - **Keine domain-spezifische Logik** - arbeitet mit beliebigen Entitäten

- ✅ **GridView** - Responsive card layout
  - Automatische Morph-Generierung aus Datenfeldern
  - Keine hardcodierten Field-Namen
  - **Universal einsetzbar**

- ✅ **Perspective System** - Multi-dimensional data filtering
  - Generisches Tag-basiertes Perspektiven-System
  - FIFO queue (max 4 aktiv)
  - **Domain-konfigurierbar** - Perspektiven-Anzahl pro Instance definierbar

- ✅ **Event-Driven Architecture** - Redis Streams für Cross-Domain Data Exchange
  - Features kommunizieren über Events, nicht direkte Abhängigkeiten
  - **Multi-Instance-Ready** - Mehrere Instanzen können Daten austauschen
  - Observer-Pattern für Stream-based State Management

- ✅ **MorphHeader** - Global header component (UPDATED 2025-11-26)
  - Schema-driven perspectives (loaded from perspectiveFieldMappings.ts)
  - Scroll-compact mode with hysteresis (>150px compact, <50px expand)
  - Active buttons rendered first, new activations go to position 0
  - Font size hierarchy: active 0.75rem > inactive 0.625rem
  - requestAnimationFrame throttled scroll handler

## 🌐 Multi-Instance Architecture (Roadmap)

**Vision:** Mehrere Knowledge-Bases teilen die gleiche AMORPH-Architektur:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ INSTANCE 1  │     │ INSTANCE 2  │     │ INSTANCE N  │
│ (Domain A)  │     │ (Domain B)  │     │ (Domain X)  │
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
- `convex/schema.ts` - Domain-spezifisches Schema (je nach Domäne)
- Perspektiven-Konfiguration - Domain-spezifisch (Anzahl und Typen variieren)
- Design Tokens - Instance-spezifisches Branding

**Cross-Instance Features:**
- User fügt Entity zu Collection hinzu → Event via Redis
- Instance 2 zeigt "related to Entity X from Instance 1" → Cross-Reference
- Aggregator (Bifroest.io) vereint alle Knowledge-Bases in eine Suche

---

## 🎨 Universal Schema Design Philosophy

**CRITICAL PRINCIPLE:** Das System ist **vollständig datengetrieben** - MorphMapper analysiert **nur** die Datenstruktur!

### The Data-Driven Detection Pattern

**MorphMapper entscheidet basierend auf dem, was es SIEHT, nicht auf dem, was wir VORSCHREIBEN.**

**MorphMapper Location:** `src/amorph/features/grid-view/MorphMapper.js` (677 lines)
**Detection Philosophy:** 
```javascript
// MorphMapper fragt:
typeof value === 'boolean' → BooleanMorph
typeof value === 'number' → NumberMorph
Array.isArray(value) → Analysiere Array-Inhalt
typeof value === 'object' → Analysiere Objekt-Struktur
typeof value === 'string' → Analysiere String-Länge und Pattern
```

**Es gibt KEINE Regeln zum "richtigen" Schema-Design!**
- ❌ Nicht: "Du musst Arrays mit 3-6 Items für Radar-Charts nutzen"
- ✅ Sondern: "MorphMapper sieht Array mit 3-6 Items, jedes hat 'axis' + 'value' → erkennt Pattern → wählt RadarChartMorph"

#### Was MorphMapper TATSÄCHLICH tut

**Type Detection (Pure Analysis):**
```javascript
// 1. Primitive Types
boolean → BooleanMorph
number → NumberMorph
string (< 30 chars, no newlines) → NameMorph oder TagMorph
string (longer or multiline) → TextMorph

// 2. Object Structures
{min: number, max: number} → RangeMorph
{value: number, max: number} → ProgressMorph
{lat/latitude, lng/longitude} → MapMorph
Object mit 2-5 primitive fields → KeyValueMorph
Anderes Object → DataMorph (generic fallback)

// 3. Array Contents
Array of strings → TagMorph (wenn kurz) oder ListMorph
Array of numbers (5-15) → SparklineMorph
Array of objects → Analysiere erste Item-Struktur:
  - Wenn consistent + chart-pattern → ChartMorph
  - Sonst → ListMorph
```

**Priority Calculation (Heuristic):**
- Feldname enthält "edib", "toxic", "danger" → +300 (Safety critical!)
- Feldname enthält "name", "title" → +100
- Morphtyp ist visual (Range, Chart) → +120
- Morphtyp ist Metadata (_id, slug, createdAt) → -500

**Das ist ALLES!** Keine Regeln, nur Pattern-Erkennung.

#### Konzeptuelles Verständnis

**Was ist "Datengetrieben"?**
- Schema definiert Datenstruktur (Convex Schema)
- MorphMapper **beobachtet** diese Struktur zur Runtime
- MorphMapper **erkennt** Patterns in den Daten
- MorphMapper **wählt** passenden Morph basierend auf erkanntem Pattern
- **KEINE** manuellen Mappings: Feldname → Morph-Typ

**Beispiel-Flow:**
```javascript
// Schema: beliebige Struktur
temperatureRange: { min: 10, max: 30, unit: "°C" }

// Runtime: MorphMapper sieht
value = { min: 10, max: 30, unit: "°C" }
typeof value === 'object' → Objekt-Analyse
'min' in value && 'max' in value → Range-Pattern erkannt
typeof value.min === 'number' → Numerischer Range
→ return 'range-morph'

// Rendering: RangeMorph erhält
<range-morph data={value}></range-morph>
→ Zeigt visuellen Scale mit Segment von 10-30°C
```

**Keine Regeln, nur Patterns:**
- MorphMapper kennt ~15 Patterns (Range, Progress, Chart, etc.)
- Jedes Pattern hat Detection-Logik (`if (keys.includes('min') && ...)`)
- Wenn Pattern matcht → Morph-Typ wird zurückgegeben
- Wenn kein Pattern matcht → Fallback (DataMorph, ListMorph, TextMorph)

#### Was bedeutet das für Schema-Design?

**Nicht prescriptive ("Du musst..."), sondern explorativ ("Was passiert wenn..."):**

Frage: "Ich habe ein Array mit [{name, count}, {name, count}] - was passiert?"
Antwort: MorphMapper sieht Array of objects → Analysiert erste Item → 2 Keys, consistent → Prüft Chart-Patterns → Keine klare Übereinstimmung → ListMorph

Frage: "Was wenn ich 'category' statt 'name' nutze?"
Antwort: MorphMapper sieht `keys.includes('category') && keys.includes('count')` → Pie-Chart-Pattern → PieChartMorph

**Das System lernt durch Beobachtung, nicht durch Anweisungen!**

### Erkannte Patterns (Was MorphMapper SIEHT, nicht was wir VORSCHREIBEN)

**Diese Tabelle beschreibt, welche Patterns MorphMapper **beobachtet hat** in den vorhandenen Daten:**

| Pattern-Name | Was MorphMapper Erkennt | Gewählter Morph | Frontend Status |
|--------------|-------------------------|-----------------|-----------------|
| **Range Pattern** | Object: `min` + `max` Keys, beide number | `range-morph` | ✅ Visual Scale |
| **Progress Pattern** | Object: `value` + `max` Keys ODER `percentage` Key | `progress-morph` | ✅ Progress Bar |
| **KeyValue Pattern** | Object: 2-5 Keys, alle Primitive Values | `key-value-morph` | ✅ 2-Column Grid |
| **Tag Array Pattern** | Array: Alle Strings, avg length < 20 chars | `tag-morph` | ✅ Multiple Pills |
| **Number Array Pattern** | Array: 5-15 Numbers | `sparkline-morph` | ⏳ Detection OK, Rendering TODO |
| **Map Pattern** | Array of Objects: Key `location` mit `latitude`/`longitude` | `map-morph` | ⏳ Detection OK, Leaflet TODO |
| **Timeline Pattern** | Array of Objects: Keys `dayOffset`/`date` + `stage`/`label` | `timeline-morph` | ⏳ Detection OK, Rendering TODO |
| **Radar Pattern** | Array of 3-6 Objects: Keys `axis`/`dimension` + `value` | `radar-chart-morph` | ⏳ Detection OK, Chart.js TODO |
| **Pie Pattern** | Array of 2-6 Objects: Keys `category`/`type`/`name` + `count`/`percentage`/`value` | `pie-chart-morph` | ⏳ Detection OK, Chart.js TODO |
| **Bar Pattern** | Array of 3-8 Objects: Keys `label`/`month`/`period` + `value`/`amount` | `bar-chart-morph` | ⏳ Detection OK, Chart.js TODO |

**Wichtig:** Diese Patterns sind **Beobachtungen**, keine **Anforderungen**!
- MorphMapper HAT diese Patterns in Funginomi-Daten gefunden
- Andere Domains könnten andere Patterns haben
- MorphMapper würde neue Patterns erkennen, wenn wir neue Detection-Logik hinzufügen

**Beispiel - Was passiert bei neuem Pattern:**
```javascript
// Neues Pattern in Daten: {start, end, duration}
// Aktuell: MorphMapper erkennt NICHT als speziellen Typ
// → Fallback zu KeyValueMorph (3 Keys, alle primitive)

// Um TimeRange-Morph zu enablen:
// 1. TimeRangeMorph.js implementieren
// 2. MorphMapper.js erweitern:
//    if ('start' in value && 'end' in value && 'duration' in value)
//      return 'time-range-morph'
// 3. Daten in Schema hinzufügen → Automatisch erkannt!
```

**Das System ist erweiterbar durch Code, nicht durch Config!**

### Implementation Strategy (MorphMapper-Driven)

**Phase 1 (COMPLETE):** Schema Design + MorphMapper Detection
- ✅ All 10 visualization field types defined in schema
- ✅ MorphMapper erkennt alle Patterns automatisch (data-driven)
- ✅ 200+ data points populated across 6 entities
- ✅ Core Morphs: RangeMorph, ProgressMorph, KeyValueMorph

**Phase 2 (COMPLETE - 2025-11-23):** Chart Morph Implementation
- ✅ RadarChartMorph (Native SVG + HTML overlays)
  - SVG grid and shape rendering
  - HTML labels with absolute positioning
  - 6-layer text-shadow for visibility
  - Auto-scaling 0-10 → 0-100%
  - Perspective color support (CSS variables)
- ✅ BarChartMorph (Native HTML/CSS)
  - Nested value extraction: {value: {value: number}}
  - Auto-unit detection (g, mg, µg, cm, °C, %)
  - Smart formatting: 1000mg → 1kg
  - HTML labels with text-shadows
  - Gradient backgrounds with color-mix()
  - Perspective color support (CSS variables)
- ✅ PieChartMorph (Native SVG)
  - Category-based segments
  - Color support from data
  - Interactive legends
- ⏳ MapMorph (Leaflet Integration)
- ⏳ TimelineMorph (Custom Canvas oder D3)
- ⏳ SparklineMorph (bereits erkannt, Rendering fehlt)

**Chart Visualization Architecture (2025-11-23):**
- No external libraries (Chart.js/D3) - 100% native rendering
- SVG for shapes, HTML for labels (better text rendering)
- CSS variable system for perspective colors
- Shadow DOM CSS variable cascade with --local-perspective-color
- Text visibility solved with multiple text-shadows (outline effect)

**Phase 3 (TODO):** Advanced Visualizations
- ⏳ ScatterPlotMorph (Multi-Variable Comparison)
- ⏳ NetworkGraphMorph (Entity Relationships)
- ⏳ SankeyMorph (Flow Visualizations)

### Warum Data-Driven Architecture Wichtig Ist

**Das Fundamental-Prinzip:**
```
NICHT: Schema → Regeln → Mapping → Morph (prescriptive)
SONDERN: Daten → Pattern-Erkennung → Morph (descriptive)
```

**Für Entwickler:**
- Keine manuellen Mappings: "Feld X nutzt Morph Y"
- Keine Konfiguration: "Bei Pilzen ist edibility ein TagMorph"
- Nur Code-Erweiterung: "Füge neue Detection-Logik für neues Pattern hinzu"
- Universal: Gleicher MorphMapper-Code für Fungi, Plants, Products, Papers, etc.

**Für Neue Domains:**
```javascript
// Funginomi hat: temperatureRange: {min, max, unit}
// MorphMapper erkennt: Range-Pattern → RangeMorph

// Phytonomi hat: bloomPeriod: {start: "March", end: "July"}
// MorphMapper erkennt: KEIN Pattern → KeyValueMorph (Fallback)
// ABER: String-Values, keine Numbers → TextMorph für beide Values

// Lösung: NICHT Schema ändern, sondern:
// 1. Date-String-Detection in MorphMapper hinzufügen
// 2. DateRangeMorph implementieren
// 3. Phytonomi-Daten automatisch als DateRange erkannt!
```

**Für Framework-Evolution:**
- Neue Patterns entstehen aus **realen Daten**, nicht aus **Spekulation**
- MorphMapper-Code wächst **organisch** mit Anforderungen
- Keine "Top-10 Visualization Types" - sondern "Patterns, die wir bisher gesehen haben"
- Kein Lock-in: Neue Detection-Logik = Neue Möglichkeiten für ALLE Domains

**Das System denkt nicht:**
- ❌ "Das ist ein Pilz-Feld, also braucht es diesen Morph"
- ✅ "Das ist ein Object mit min/max, also passt RangeMorph"

**Das System lernt nicht durch Config, sondern durch Code:**
- MorphMapper.js: Pattern-Detection-Logik
- Neue Morphs: Neue Pattern-Implementierungen
- Daten: Trigger für Pattern-Erkennung

**Result:** 
```
Real Data → Pattern Recognition → Automatic Visualization
(Keine Zwischenschritte, keine Regeln, keine Mappings)
```

## 🏗️ System-Wide Architecture Integration

### Schema → MorphMapper → Morphs → Reactors → Visualization

**Vollständige Integration der Visualization-Ready Schema Philosophy ins AMORPH Framework:**

#### 1. **Schema Design (convex/schema.ts)**
- 10 Visualization Field Types definiert
- 200+ Data Points über 6 Entities
- Alle Fields folgen MorphMapper Detection Patterns

#### 2. **MorphMapper Detection (grid-view/MorphMapper.js - 677 lines)**
**Detection Logic (Data-Driven, NO Hardcoded Mappings):**
```javascript
// Range Detection
if ('min' in value && 'max' in value && typeof value.min === 'number') 
  return 'range-morph';

// Chart Detection
if (Array.isArray(value) && value.length >= 3 && value.length <= 6) {
  if (keys.includes('axis') && keys.includes('value')) 
    return 'radar-chart-morph';
  if (keys.includes('category') && keys.includes('percentage')) 
    return 'pie-chart-morph';
}

// Map Detection
if (keys.includes('location') && firstItem.location.latitude !== undefined)
  return 'map-morph';

// Timeline Detection
if (keys.includes('dayOffset') && keys.includes('stage'))
  return 'timeline-morph';
```

**Priority System:**
- Visual Morphs: +120 (Range, Chart, Sparkline)
- Safety Info: +300 (edibility, toxicity, danger)
- Identity: +100 (name, title)
- Visual ID: +100 (color, shape, size)
- Metadata: -500 (createdAt, _id, slug)

#### 3. **Morph Components (grid-view/morphs/ - SINGLE SOURCE)**
**Implemented (✅):**
- `RangeMorph.js` - Visual scale mit positioned segment
- `ProgressMorph.js` - Progress bars (value/max oder percentage)
- `KeyValueMorph.js` - Compact 2-column layout für kleine Objekte
- `TagMorph.js` - Multiple pills für String-Arrays
- `ListMorph.js` - Wrapping items, compact padding
- `NameMorph.js`, `TextMorph.js`, `ImageMorph.js`, `NumberMorph.js`, `BooleanMorph.js`
- `DataMorph.js` - Nested objects (generic fallback)

**Planned (⏳):**
- `RadarChartMorph.js` - Multi-dimensional spider charts (Chart.js/D3)
- `PieChartMorph.js` - Composition donut charts (Chart.js/D3)
- `BarChartMorph.js` - Bar/Heatmap charts (Chart.js)
- `SparklineMorph.js` - Trend lines (Canvas or D3)
- `MapMorph.js` - Geographic distribution (Leaflet)
- `TimelineMorph.js` - Temporal stages (Custom or D3)
- `ScatterPlotMorph.js` - Multi-variable comparison (Chart.js/D3)

#### 4. **Visual Reactors (grid-view/reactors/ - SINGLE SOURCE)**
- `GlowReactor.js` - Highlight matching morphs
- `FilterReactor.js` - Show/hide based on criteria
- `HoverReactor.js` - Interactive hover states
- `AnimationReactor.js` - Smooth transitions
- `PulseReactor.js` - Attention-grabbing effects
- `SortReactor.js` - Reorder by relevance

**All other features copy from grid-view/** (perspective-system, search-system, bubble-view)

#### 5. **Feature Integration**
**GridView (grid-view/):**
- GridHost renders cards mit auto-generated morphs
- MorphMapper extracts top 15 fields by priority
- Visual reactors highlight/filter/sort

**BubbleView (bubble-view/):**
- Canvas rendering (60 FPS, Native 2D)
- HilbertSpaceSimilarity für connections
- CanvasPhysicsReactor für movement
- BubbleDetailReactor zeigt relationships

**PerspectiveSystem (perspective-system/):**
- PerspectiveHost pro Perspektive
- PerspectiveReactor dims irrelevant morphs
- FIFO queue (max 4 active)

**SearchSystem (search-system/):**
- ConvexSearchReactor (server-side deep search)
- SearchFilterController (client-side highlighting)
- Auto-perspective activation based on matched fields

**MorphHeader (morph-header/):**
- 12 Perspektiven-Buttons (domain-configurable)
- Search bar with debounce (300ms)
- FIFO perspective management

#### 6. **Event-Driven Coordination**
```javascript
// Schema → Data
Convex Query → Entity Object with Visualization Fields

// Data → Detection
MorphMapper.getMappedFields(entity) → [{fieldName, morphType, value, priority}]

// Detection → Rendering
MorphMapper.createMorphElement(fieldConfig) → <range-morph>, <pie-chart-morph>, etc.

// Rendering → Interaction
Visual Reactors (Glow, Filter, Hover) → User Interactions

// Interaction → State
AmorphSystem.emit('perspective:changed') → Update all Views
```

#### 7. **Domain Configuration (core/domain.config.js)**
**Instance-Specific Settings:**
- Entity collection name (`fungi`)
- Data source fields (nameField, slugField, etc.)
- 12 Perspectives mit Colors & Icons
- Field-to-Perspective mappings
- Default perspectives

**Framework-Agnostic:**
- MorphMapper detection (universal patterns)
- Visual reactors (work with any domain)
- GridView/BubbleView architecture
- Event system (AmorphSystem, RedisEventBridge)

### System-Wide Benefits

**For Schema Design:**
- Follow MorphMapper patterns → Automatic visualization
- No need to manually specify which morphs to use
- Consistent across all domains/instances

**For Frontend Development:**
- Implement Chart Morphs once → Works for all fields matching pattern
- MorphMapper handles detection → Zero manual configuration
- Visual Reactors work with all Morph types

**For Multi-Instance Scalability:**
- Same Framework code for Funginomi, Phytonomi, etc.
- Only Schema + DomainConfig changes per instance
- MorphMapper patterns are universal (geographic, timeline, composition, etc.)

**For Users:**
- Rich visualizations automatically generated from data
- Multiple views (Grid, Bubble, Perspective) of same data
- Consistent interaction patterns across all instances

---

## 📊 Current Instance Implementation

**Current Instance = AMORPH Framework + Domain Configuration**

- ✅ **Convex Backend** - Example entities with rich structured data
- ✅ **Multiple Perspectives** - Domain-specific views configured via domain.config.js
- ✅ **BubbleDetailReactor** - Relationship-focused dialog for entity connections
- ✅ **Server-side Search** - Auto-perspective switching based on matched fields

**Framework Refactoring (2025-11-22):**
- ✅ **Domain Config System** - `domain.config.js` isolates all instance-specific configuration
- ✅ **Generic Data Adapter** - Supports Convex, REST, GraphQL backends
- ✅ **MorphMapper** - Fully generic, uses `entity-data` attribute
- ✅ **HilbertSpaceSimilarity** - Generic entity comparison, uses DomainConfig for perspectives
- ✅ **BubbleView** - Generic entity visualization (fully domain-agnostic)
- ✅ **BubbleMorph** - Uses `entityData` property (fully generic)
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

## 🔥 Latest Changes (2025-11-25)

### 0. 🔧 CRITICAL FIX: Search Slug Mismatch Resolved

**Problem:** Search was returning results but cards weren't being highlighted. Search showed "0 text matches in 0 cards" despite finding matching entities.

**Root Cause:** Database uses TWO different slug fields:
- `slug` - Short slug like `amanita-muscaria` (raw database field)
- `seoName` - Full SEO slug like `fly-agaric-amanita-muscaria` (used by frontend cards)

The search API returned the `slug` field, but the frontend cards use `data-slug` attribute populated from `seoName`. This mismatch caused zero matches!

**Solution:** Changed `domain.config.js` line 48:
```javascript
// BEFORE (BROKEN):
slugField: 'slug',

// AFTER (WORKING):
slugField: 'seoName',
```

**Files Changed:**
- ✅ `src/amorph/core/domain.config.js` - `slugField: 'seoName'`
- ✅ `src/amorph/core/perspectiveFieldMappings.ts` - Added missing `perspectiveDisplayFields` export (BubbleMorph import error)

**Search System Status:** ✅ FULLY WORKING
- Server-side search finds correct results
- Card filtering works (matching cards shown)
- Text highlighting works (matched text highlighted)
- Auto-scroll to highlighted content
- Perspective auto-activation based on matched fields

**CRITICAL REMINDER for Future Development:**
- **ALWAYS use `seoName` as the slug field** - This is the field used for URLs and card identification
- The `slug` field exists but is shorter and NOT used by the frontend
- This is documented in `convex/SCHEMA_DOCUMENTATION.md`

---

## 🔥 Previous Changes (2025-11-23)

### 0. 🎨 Visualization-Ready Schema Implementation - Phase 2-4 Complete

**Data-Driven Visualization Architecture Implemented:**
- ✅ **10+ Pattern Types** - MorphMapper erkennt Patterns in allen 6 Entitäten
- ✅ **200+ Data Points** - Structured data für Pattern-Recognition
- ✅ **Multi-Phase Rollout** - Phase 1-4 field types hinzugefügt
- ✅ **MorphMapper beobachtet** - Daten strukturiert, MorphMapper erkennt automatisch

**Phase 2 - Seasonal & Trend Analysis:**
- ✅ `seasonalActivity` - 12 months × 6 species = 72 data points
  - Month-by-month activity levels (0-100)
  - Stage labels (dormant, growing, fruiting, year-round)
  - Enables heatmap and calendar visualizations
- ✅ `biodiversityTrend` - 5 years × 6 species = 30 data points
  - Year-over-year abundance and sighting counts
  - Wild vs cultivated sources
  - Enables timeseries trend analysis

**Phase 3 - Composition & Progress:**
- ✅ `compoundDistribution` - 5 categories × 6 species = 30 data points
  - Macronutrient breakdown (Proteins, Carbs, Fiber, etc.)
  - Percentage + grams for dual visualization
  - Enables pie/donut charts
- ✅ `growthMetrics` - 4 metrics × 5 cultivatable species = 20 data points
  - Colonization, fruiting, yield, quality scores (0-100)
  - Enables progress bar visualizations
- ✅ `cultivationMetrics` - 3-5 strains × 3 commercial species = 12-15 data points
  - Multi-dimensional scatter data (yield, cycle time, contamination, profitability)
  - Strain comparison and optimization analysis

**Phase 4 - Economic & Research Trends:**
- ✅ `priceHistory` - 5 years × 4 commercial species = 20 data points
  - Historical pricing by market segment
  - Currency-aware line charts
- ✅ `researchActivity` - 5 years × 6 species = 30 data points
  - Publications, patents, clinical trials, citations
  - Multi-line research trend visualization

**Seeds Completed:**
1. ✅ Beauveria bassiana - All phases (year-round cultivation, biopesticide market)
2. ✅ Hypsizygus tessellatus - All phases (seasonal fruiting, edible market)
3. ✅ Cordyceps militaris - All phases (rare wild, high-value medicinal)
4. ✅ Hericium erinaceus - All phases (declining wild, premium gourmet/medicinal)
5. ✅ Fomitopsis betulina - Phases 1,2,4 (year-round visible, not cultivatable)
6. ✅ Pholiota adiposa - Phases 1,2,3 (seasonal wild, research only, no market)

**Schema Design Principles Documented:**
- ✅ **Morph-First Thinking** - "What visualizations can this enable?"
- ✅ **Structured for Charts** - Arrays of objects with numeric values
- ✅ **Normalized Scores** - 0-100 scales for comparability
- ✅ **Context Included** - Units, labels, descriptions
- ✅ **Timeseries Support** - Year/month/time fields for trends
- ✅ **Geographic Enabling** - Lat/long coordinates for maps
- ✅ **Raw + Normalized Data** - Both original and scaled values
- ✅ **Optional by Default** - Flexibility via `v.optional()`

**Database Status:**
- ✅ All schema extensions validated (no TypeScript errors)
- ✅ All 6 entities reseeded successfully
- ✅ Convex backend running with complete visualization data
- ✅ Ready for frontend Morph implementations (Chart.js, D3.js, Leaflet)

**Next Steps:**
- Frontend Chart Morph implementations
- MorphMapper auto-detection for new field types
- Automated chart generation from schema metadata
- Additional entity seeds (expand to 20+ fungi)

---

## 🔥 Previous Changes (2025-11-21)

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
- ✅ **Link to full detail page** - `/[collection]/[slug]` for comprehensive data
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
- ✅ **Container-based filtering** - Versteckt ganze `.entity-card` statt einzelner Morphs
- ✅ **Respects AstroDataSearchReactor** - Won't hide containers shown by AstroDataSearchReactor

**AstroDataSearchReactor.js (Data-based) ⭐ Priority Reactor:**
- ✅ **Searches raw data** - Checks entity-data attributes before rendering
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
- ✅ **Branding** - Instance title + "Part of the Bifroest" Link zu https://bifroest.io
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
1. User types search query → AstroDataSearchReactor finds match in data fields
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
- [collection]/[slug].astro komplett neu dokumentiert
- Deep Recursive Rendering erklärt
- flattenObject() Funktion mit Beispielen
- renderField() mit visueller Hierarchie
- Exakte Perspektiven-Arrays

**Neu hinzugefügt:**
```
## [collection]/[slug].astro [KOMPLETT NEU 2025-11-15]
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

// entity-data attribute reading:
const entityData = JSON.parse(morph.getAttribute('entity-data'));

// Nested object navigation:
const value = this.getNestedValue(entityData, 'taxonomy.kingdom');

// Container-based filtering:
// Container filtering:
document.querySelectorAll('.entity-card').forEach(container => {
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
- ✅ entity-data attribute reading for inactive perspectives
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
  ├── [collection]/index.astro
  └── [collection]/[slug].astro ⭐ KOMPLETT NEU
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

## 🔧 Current Challenges & Solutions (2025-11-23)

### Perspective Color System

**Problem:** CSS variable cascade through Shadow DOM boundaries
- PerspectiveReactor sets `--perspective-color` on morph elements
- DataMorph (parent) uses Shadow DOM
- Chart morphs (children) use Shadow DOM
- CSS variables don't automatically cascade through Shadow DOM boundaries

**Current Solution:**
```javascript
// DataMorph inherits and re-declares
:host {
  --perspective-color: var(--perspective-color, rgba(255, 255, 255, 0.5));
}

// Chart morphs use local variable
:host {
  --local-perspective-color: var(--perspective-color, #10b981);
}
```

**Status:** Partially working, colors not consistently applied
**Root Cause:** PerspectiveReactor timing issue (500ms delay in init.js)
**Workaround:** `getActivePerspectives()` method retrieves from MorphHeader

### PerspectiveReactor Timing

**Problem:** Reactor enables after initial perspective-changed events
- MorphHeader dispatches events immediately on load
- PerspectiveReactor activates with 500ms setTimeout
- Early events are missed

**Solution Implemented:**
```javascript
// PerspectiveReactor.apply() checks for initial state
if (this.activePerspectives.length === 0) {
  const morphHeader = document.querySelector('morph-header');
  if (morphHeader && morphHeader.getActivePerspectives) {
    this.activePerspectives = morphHeader.getActivePerspectives();
  }
}
```

**Status:** Workaround in place, but full solution requires init.js refactoring

### Chart Label Visibility

**Problem:** SVG text elements rendering but invisible
**Solution:** Switched to HTML overlays with absolute positioning
**Result:** ✅ Labels now visible with 6-layer text-shadow outline effect

### Nested Value Extraction

**Problem:** BarChart received 0 bars with nested data structures
**Solution:** Enhanced extractNumericValue() to handle `{value: {value: number}}`
**Result:** ✅ All bar charts rendering correctly with proper value extraction

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
