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
└── shared/                        # Gemeinsame Komponenten
    ├── reactors/                  # Universelle Reactors
    │   ├── GlowReactor.js
    │   ├── AnimationReactor.js
    │   ├── PulseReactor.js
    │   ├── HoverReactor.js
    │   ├── SortReactor.js
    │   └── FilterReactor.js
    │
    ├── morphs/                    # Basis-Morphs
    │   ├── data/                  # Daten-Morphs
    │   └── global/                # Globale UI
    │
    ├── observers/                 # Stream Observers
    └── styles/                    # Design Tokens
```

## Vorteile der neuen Struktur

### ✅ Feature-Isolation
Jedes Feature hat ALLE seine Komponenten in einem Ordner:
- BubbleView: View + Host + Reactors + Controllers + Services
- GridView: View + Host
- PerspectiveSystem: Host + Card + Reactor
- SearchSystem: 2 Reactors

### ✅ Klare Abhängigkeiten
- **core/** - Von allen genutzt
- **shared/** - Von allen Features genutzt
- **features/** - Feature-spezifisch, klar getrennt

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
├── core/          # Nur Kern-System
├── features/      # Nach Feature gruppiert
└── shared/        # Wirklich gemeinsam
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
