# 🔮 AMORPH System - Root Documentation

## Übersicht

Dies ist das Root-Verzeichnis des AMORPH Systems - ein vollständiges morphologisches UI-System für die Funginomi Pilz-Datenbank.

**Philosophie:** Atomic Design - Jedes Datenfeld ist ein eigener Morph  
**Tech Stack:** Astro + Lit + Vanilla JS Reactors + Convex (Lokal) + Pixie Renderer + Redis Event Bus

## Ordnerstruktur

```
src/amorph/
├── amorph.config.js           # Zentrale System-Config
├── reactors.config.js         # Reactor-Definitionen
├── morphs.config.js           # Morph-Type-Definitionen
├── init.js                    # System Initialization
│
├── arch/                      # Kern-System (AmorphSystem, Redis, Convex)
│   ├── styles/                # ← Design System (NEW!)
│   │   └── tokens.js          # Global CSS Custom Properties
│   ├── layouts/               # Astro Layouts
│   ├── AmorphSystem.js        # Core System
│   ├── RedisEventBridge.js    # Event Bus mit Streams
│   └── convex.ts              # Convex Client
├── observers/                 # Stream Observers (Redis Consumer Groups)
├── reactors/                  # Alle Reactors (Glow, Search, Animation, etc.)
├── morphs/                    # Alle Morphs (Atomic Data Field Components)
├── hosts/                     # Host-Container (GridHost, BubbleHost, BubbleView)
└── global/                    # Globale Components (MorphHeader)
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

## Status: ✅ SYSTEM KOMPLETT + STREAM OBSERVERS

Alle 16 Phasen + Redis Stream Observer System sind implementiert. Das System ist produktionsbereit und voll funktionsfähig.
