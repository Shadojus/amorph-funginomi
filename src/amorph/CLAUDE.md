# 🔮 AMORPH System - Root Documentation

**Last Updated:** 21. November 2025

## Übersicht

Dies ist das Root-Verzeichnis des AMORPH Systems - ein vollständiges morphologisches UI-System für die Funginomi Pilz-Datenbank.

**Philosophie:** Atomic Design - Jedes Datenfeld ist ein eigener Morph  
**Tech Stack:** Astro + Lit + Vanilla JS Reactors + Convex (Lokal) + Canvas 2D Renderer + Redis Event Bus

**Latest:** BubbleView mit relationship-focused detail dialog, Canvas ohne Pixi.js, mobile-optimiert ohne horizontal scroll.

## 🔗 Quick Navigation

**Core System:**
- [`core/CLAUDE.md`](./core/CLAUDE.md) - AmorphSystem, RedisEventBridge, PixieRenderer
- [`core/init.js`](./core/init.js) - System Entry Point

**Features:**
- [`features/bubble-view/CLAUDE.md`](./features/bubble-view/CLAUDE.md) - Canvas Visualization
- [`features/grid-view/CLAUDE.md`](./features/grid-view/CLAUDE.md) - Grid Layout
- [`features/perspective-system/CLAUDE.md`](./features/perspective-system/CLAUDE.md) - 12 Perspektiven + FIFO
- [`features/search-system/CLAUDE.md`](./features/search-system/CLAUDE.md) - Dual Search (Morph + Data)

**Shared:**
- [`shared/reactors/CLAUDE.md`](./shared/reactors/CLAUDE.md) - Universal Reactors
- [`shared/morphs/data/CLAUDE.md`](./shared/morphs/data/CLAUDE.md) - Data Morphs (Name, Tag, Text, etc.)
- [`shared/morphs/global/CLAUDE.md`](./shared/morphs/global/CLAUDE.md) - MorphHeader
- [`shared/observers/CLAUDE.md`](./shared/observers/CLAUDE.md) - Redis Stream Observers
- [`shared/styles/CLAUDE.md`](./shared/styles/CLAUDE.md) - Design Tokens

**Architecture:**
- [`FEATURE_ARCHITECTURE.md`](./FEATURE_ARCHITECTURE.md) - Complete Migration Documentation

---

## Ordnerstruktur (Feature-Based Architecture) ✨ **[NEU 2025-11-18]**

```
src/amorph/
├── core/                       # Kern-System
│   ├── AmorphSystem.js         # Core System
│   ├── RedisEventBridge.js     # Event Bus mit Streams
│   ├── RedisEventBus.js        # Legacy Event Bus
│   ├── PixieRenderer.js        # Canvas Renderer
│   ├── convex.ts               # Convex Client
│   ├── init.js                 # System Initialization
│   ├── amorph.config.js        # System Config
│   ├── reactors.config.js      # Reactor Config
│   └── morphs.config.js        # Morph Config
│
├── features/                   # Feature-basierte Komponenten
│   ├── bubble-view/            # BubbleView Feature (ALLES für Bubbles)
│   │   ├── BubbleView.js
│   │   ├── BubbleHost.js
│   │   ├── reactors/
│   │   │   ├── CanvasConnectionReactor.js
│   │   │   ├── CanvasPhysicsReactor.js
│   │   │   ├── CanvasUserNodeReactor.js
│   │   │   ├── FlowReactor.js
│   │   │   └── ColorShiftReactor.js
│   │   ├── controllers/
│   │   │   ├── DragController.js
│   │   │   └── ZoomPanController.js
│   │   ├── services/
│   │   │   ├── HilbertSpaceSimilarity.js
│   │   │   ├── CollisionDetector.js
│   │   │   ├── ConnectionRenderer.js
│   │   │   └── ForceDirectedLayout.js
│   │   └── CLAUDE.md
│   │
│   ├── grid-view/              # GridView Feature
│   │   ├── GridHost.js
│   │   └── CLAUDE.md
│   │
│   ├── perspective-system/     # Perspektiven-System
│   │   ├── PerspectiveHost.js
│   │   ├── PerspectiveCard.js
│   │   ├── reactors/
│   │   │   └── PerspectiveReactor.js
│   │   └── CLAUDE.md
│   │
│   └── search-system/          # Such-System
│       ├── reactors/
│       │   ├── SearchReactor.js
│       │   └── AstroDataSearchReactor.js
│       └── CLAUDE.md
│
├── shared/                     # Shared zwischen allen Features
│   ├── reactors/               # Universelle Reactors
│   │   ├── GlowReactor.js
│   │   ├── AnimationReactor.js
│   │   ├── PulseReactor.js
│   │   ├── HoverReactor.js
│   │   ├── SortReactor.js
│   │   ├── FilterReactor.js
│   │   └── CLAUDE.md
│   │
│   ├── morphs/                 # Basis-Morphs
│   │   ├── data/               # Data Morphs
│   │   │   ├── NameMorph.js
│   │   │   ├── TextMorph.js
│   │   │   ├── TagMorph.js
│   │   │   ├── ImageMorph.js
│   │   │   ├── BooleanMorph.js
│   │   │   ├── NumberMorph.js
│   │   │   ├── ListMorph.js
│   │   │   ├── DataMorph.js
│   │   │   ├── ChartMorph.js
│   │   │   ├── MapMorph.js
│   │   │   ├── TimelineMorph.js
│   │   │   ├── ConnectionMorph.js
│   │   │   ├── QueryMorph.js
│   │   │   ├── UserNode.js
│   │   │   └── CLAUDE.md
│   │   └── global/             # Global Components
│   │       ├── MorphHeader.js
│   │       └── CLAUDE.md
│   │
│   ├── observers/              # Stream-based State Management
│   │   ├── BaseObserver.js
│   │   ├── MorphObserver.js
│   │   ├── ReactorObserver.js
│   │   ├── HostObserver.js
│   │   ├── GlobalObserver.js
│   │   ├── ArchObserver.js
│   │   ├── LayoutObserver.js
│   │   ├── PerformanceObserver.js
│   │   └── CLAUDE.md
│   │
│   └── styles/                 # Global Design System
│       ├── tokens.js           # CSS Custom Properties
│       └── CLAUDE.md
│
└── init.js                     # Main Entry Point (re-exports core/init.js)
```

## Zentrale Konfigurationsdateien

### amorph.config.js
Zentrale System-Konfiguration mit:
- System Settings (debug, devTools, mode)
- 12 Perspektiven mit Farben & Icons
- Multi-Perspektiven Settings
- Reactor Defaults
- Search Settings (Weighted Scoring)
- Tag Extraction Settings
- Convex Settings
- Redis Event Bus Settings
- Pixie Renderer Settings
- Performance Settings
- BubbleView Settings

### reactors.config.js
Alle verfügbaren Reactors mit Defaults:
- **Core Reactors**: glow, search, animation
- **Extended Reactors**: pulse, hover, sort, filter
- **BubbleView Reactors**: flow, attraction, colorshift

### morphs.config.js
Alle Morph-Typen definiert:
- **Atomic Data Field Morphs**: name, image, text, tag, boolean, number, list
- **Category Container Morphs**: edibility, taste, habitat, medicinal
- **Composite Morphs**: card
- **BubbleView Morphs**: bubble, connection, sphere

### init.js
System-Initialisierung:
- Importiert AmorphSystem
- Importiert alle Reactors (Auto-Register)
- Importiert alle Morphs
- Importiert Global Components
- Importiert Hosts & Views
- Exportiert `amorph` Singleton
- Macht `window.amorph` global verfügbar

## Wie das System funktioniert

### 1. Initialisierung
```javascript
import '/src/amorph/init.js';
// System ist dann als window.amorph verfügbar
```

### 2. Datenfluss (DATENGETRIEBEN)
```
Convex → Astro (fungi) → Host.setData() → createMorphsFromData() → Morphs im DOM → AMORPH Registry
```

### 3. Reactor System (PLUG & PLAY)
```javascript
// Reactor aktivieren
amorph.enableReactor('glow', { intensity: 1.5 });

// Reactor deaktivieren
amorph.disableReactor('glow');

// Reactor togglen
amorph.toggleReactor('search');
```

### 4. Morph Registration (AUTOMATISCH)
Alle Morphs registrieren sich automatisch bei `connectedCallback()`:
```javascript
connectedCallback() {
  super.connectedCallback();
  if (window.amorph) {
    window.amorph.registerMorph(this);
  }
}
```

### 5. Event System (Redis Streams + Observers) **NEU!**
```javascript
// Event publishen (NEW - Redis Streams)
await amorph.streamPublish('morph:created', { 
  id: 'morph-123',
  type: 'bubble-name'
});

// Observer State abfragen
const morphs = amorph.observers.morph.getAllMorphs();
const stats = amorph.observers.morph.getStats();

// Legacy Event System (DEPRECATED)
amorph.emit('morph:created', { element });
```

**Redis Stream Observer Pattern:**
- 6 Observers (MorphObserver, ReactorObserver, HostObserver, GlobalObserver, ArchObserver, LayoutObserver)
- Consumer Groups für jeden Observer
- Non-blocking Poll Loop (100ms)
- Event Filtering by Prefix (`morph:*`, `reactor:*`, etc.)
- State Management per Domain

Siehe: `STREAM_OBSERVER_SYSTEM.md` für Details

## Implementierungsphasen (Alle abgeschlossen)

### ✅ TEIL 1: MVP - Basis-System (Phase 1-8)
- Phase 1: Setup & Lokaler Convex
- Phase 2: Ordnerstruktur & Zentrale Configs
- Phase 3: Core AMORPH System
- Phase 4: Erste Atomic Morphs
- Phase 5: Basis Reactors (Glow, Search, Animation)
- Phase 6: MorphHeader Global
- Phase 7: Astro Integration & Data Loading
- Phase 8: MVP Testing & Polish

### ✅ TEIL 2: Vollständiges System (Phase 9-16)
- Phase 9: Alle Atomic Morphs
- Phase 10: Erweiterte Reactors (Pulse, Hover, Sort, Filter)
- Phase 11: BubbleView Foundation
- Phase 12: BubbleView Morphs (Bubble, Connection, Sphere)
- Phase 13: BubbleView Reactors (Flow, Attraction, ColorShift)
- Phase 14: Dynamic Re-Connection System
- Phase 15: Advanced Features (Export, Share, Analytics)
- Phase 16: DevTools, Performance, Production Ready

### ✅ TEIL 3: Redis Stream Observer System (2025-11-15)
- **RedisEventBridge**: Erweitert mit Streams (XADD, XREADGROUP, Consumer Groups)
- **BaseObserver**: Abstract Base Class für alle Observers
- **6 Observers**: MorphObserver, ReactorObserver, HostObserver, GlobalObserver, ArchObserver, LayoutObserver
- **AmorphSystem**: streamPublish() API, Auto-start Observers
- **Event Migration**: Wichtigste Events migriert zu streamPublish()

### ✅ TEIL 4: Dual Search System (2025-11-17)
- **SearchReactor**: Morph-basierte Suche in gerenderten Shadow DOM Elementen
- **AstroDataSearchReactor**: Data-basierte Suche in rohen fungus-data Attributen
- **Priority System**: AstroDataSearchReactor hat Vorrang (class-based coordination)
- **Field Weighting**: Intelligente Scoring für commonName (100), scientificName (100), genus (90), etc.
- **26+ Field Mappings**: Auto-Perspektiven-Aktivierung basierend auf gefundenen Feldern
- **Taxonomy Matching**: Sucht auch in sichtbaren .taxonomy-value Elementen
- **Container Management**: Beide Reactors koordinieren via `reactor-astro-search-hidden` class

### ✅ TEIL 5: MorphHeader Enhancement (2025-11-17)
- **Branding**: "Funginomi" Titel + "Part of the Bifröst" Link
- **Progressive Komprimierung**: Inaktive Buttons schrumpfen (kein Icon, kleiner Text)
- **Max 2 Reihen**: Perspektiven-Buttons wrappen in max 2 Reihen
- **Responsive Design**: Branding kleiner auf Mobile (nicht versteckt)
- **Auto-Perspective Switching**: 400ms debounced, FIFO queue management

### ✅ TEIL 6: Canvas System Optimization (2025-11-18)
- **Physics Damping**: Erhöht auf 0.98 (war 0.95) für weniger Bouncing
- **User Node Size**: Reduziert auf size/3 (war size/2) für kompaktere Darstellung
- **Weight Badges**: Immer anzeigen (nicht nur >0.7), 3 Dezimalstellen, Type-spezifische Farben
- **Connection Lines**: Zeichnen Gewichtungen auf allen Verbindungen (Similarity, Semantic, User-Intent)
- **Debug Logging**: Umfangreiches Logging für Connection-Rendering

## Status: ✅ SYSTEM KOMPLETT + OPTIMIERT

Alle 16 Phasen + Redis Stream Observer System + Dual Search + Enhanced MorphHeader + Canvas Optimization sind implementiert. Das System ist produktionsbereit und voll funktionsfähig.

## 🏗️ Architektur: Hybrides DOM + Canvas System

### DOM-Morphs (Atomic Data Fields)
- ✅ Web Components mit Shadow DOM (data-morph custom elements)
- ✅ Registrieren sich bei AmorphSystem
- ✅ Werden von MorphHeader/Reactors beeinflusst (Perspective, Search, Glow, etc.)
- ✅ Beispiele: name-morph, text-morph, tag-morph, image-morph

### Canvas-Rendering (BubbleView)
- ✅ Direkte Canvas-Rendering für Performance (60 FPS)
- ✅ Keine DOM-Elemente für Bubbles/Connections
- ✅ Physics-Simulation (CanvasPhysicsReactor)
- ✅ Connection Lines mit Bezier-Kurven (CanvasConnectionReactor)
- ✅ User Node mit gewichteten Verbindungen (CanvasUserNodeReactor)

### Event-Koordination
```
MorphHeader (Perspective Change)
  ↓ 'perspective-changed' Event
  ├─→ DOM: PerspectiveReactor → Highlight/Dim Morphs
  └─→ Canvas: BubbleView → Recalculate Connection Weights → Redraw
```

**Wichtig:** BubbleView hat **keine BubbleMorph DOM-Elemente**, nur **Canvas-Rendering** für maximale Performance!
