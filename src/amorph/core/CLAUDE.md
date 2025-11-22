# 🎯 AMORPH Core - Framework Kernel

**Last Updated:** 22. November 2025

**Framework Note:** Der Core ist **domain-agnostisch**. Er enthält keine domain-spezifische Logik. AmorphSystem, Observers, und EventBridge funktionieren mit beliebigen strukturierten Daten.

## Structure

```
core/
├── amorph.config.js         # System configuration
├── AmorphSystem.js          # Central registry & coordination
├── convex.ts                # Convex client for SSR data fetching
├── domain.config.js         # Domain-specific configuration (Funginomi)
├── init.js                  # System initialization
├── morphs.config.js         # Morph type configurations
├── PixieRenderer.js         # Canvas renderer
├── reactors.config.js       # Reactor configurations
├── RedisEventBridge.js      # Event bus with Redis Streams
├── RedisEventBus.js         # Legacy event bus
├── layouts/
│   └── BaseLayout.astro     # Base Astro layout
├── observers/
│   ├── ArchObserver.js      # Architecture observer
│   ├── BaseObserver.js      # Base observer class
│   ├── GlobalObserver.js    # Global events observer
│   ├── HostObserver.js      # Host components observer
│   ├── LayoutObserver.js    # Layout observer
│   ├── MorphObserver.js     # Morph lifecycle observer
│   ├── PerformanceObserver.js # Performance monitoring
│   └── ReactorObserver.js   # Reactor events observer
└── CLAUDE.md                # This file
```

## Übersicht

Der `core/` Ordner enthält die Kern-Komponenten des AMORPH Systems:

1. **AmorphSystem.js** - Das Gehirn des Systems (Registry, Events, State)
2. **domain.config.js** - Domain Configuration (Funginomi-specific)
3. **RedisEventBridge.js** - Event Bus mit Redis Streams & Consumer Groups
4. **RedisEventBus.js** - Legacy Event Bus
5. **PixieRenderer.js** - Canvas Renderer für Bubble View
6. **convex.ts** - Convex Client für SSR Data Fetching
7. **init.js** - System Initialization & Bootstrap
8. **observers/** - 8 Stream Observers für State Management
9. **layouts/** - Astro Layout Components (BaseLayout.astro)
10. **Config Files** - amorph.config.js, reactors.config.js, morphs.config.js

## 🔗 Related Components

**Uses:**
- `./observers/` - Stream-based State Management (BaseObserver, MorphObserver, etc.)
- `../features/grid-view/reactors/` - Universal Reactors (GlowReactor, HoverReactor, etc.) - SINGLE SOURCE
- `../features/grid-view/morphs/` - All Data Morphs for Registration - SINGLE SOURCE

**Used by:**
- `../features/bubble-view/` - BubbleView Canvas System
- `../features/grid-view/` - GridView Layout
- `../features/perspective-system/` - Perspektiven-Management
- `../features/search-system/` - Dual Search System

**Design System:** Each feature has local `tokens.js` - Grid-view is canonical source

## AmorphSystem.js

### Verantwortlichkeiten

Zentrale Registry die ALLES verwaltet:
- ✅ Reactor-Management (register, enable, disable, toggle)
- ✅ Morph-Discovery & Registration
- ✅ Event-System über Redis Event Bridge
- ✅ Multi-Perspektiven State
- ✅ Search State mit Weighted Scoring
- ✅ Pixie Renderer Integration
- ✅ Canvas Reactor Coordination (2025-11-18)

### Canvas System Integration (2025-11-18)

**AmorphSystem koordiniert Canvas Reactors** aus `../features/bubble-view/reactors/`:
- ✅ **CanvasConnectionReactor** - Weight badges, type-spezifische Farben
- ✅ **CanvasPhysicsReactor** - Spring forces, damping: 0.98
- ✅ **CanvasUserNodeReactor** - User node rendering, size/3

**Event Flow:**
```javascript
// Perspective Change → Recalculate Weights → Redraw Canvas
amorph.on('perspective-changed', ({ perspectives }) => {
  // 1. DOM-Morphs werden gefiltert (PerspectiveHost)
  // 2. BubbleView recalculiert connection weights
  // 3. Canvas Reactors zeichnen neu
});
```

**Wichtig:** Canvas Reactors arbeiten **unabhängig** von DOM-Morphs!
- ❌ **KEINE BubbleMorph Elements** - Nur Canvas-Rendering
- ✅ **Hybrid Architecture** - DOM für Morphs, Canvas für Visualization

### Architektur

```javascript
export class AmorphSystem {
  constructor(config = {}) {
    // Merge Configs
    this.config = { ...AmorphConfig, ...config };
    
    // State
    this.state = {
      activePerspectives: ['culinaryAndNutritional'],
      selectedTags: new Set(),
      searchQuery: '',
      searchScores: new Map(),
      enabledReactors: new Set()
    };
    
    // Registries
    this.reactors = new Map();        // name → Reactor Class
    this.activeReactors = new Map();  // name → Reactor Instance
    this.morphs = new Set();          // Alle registrierten Morphs
    this.listeners = new Map();       // Event Listeners
    
    // Services
    this.eventBridge = null;          // Redis Event Bridge
    this.pixieRenderer = null;        // Pixie Renderer
    this.performanceObserver = null;  // Performance Monitoring
  }
}
```

### Reactor Management

```javascript
// Reactor registrieren (passiert automatisch beim Import)
registerReactor(name, ReactorClass) {
  this.reactors.set(name, ReactorClass);
  this.log(`✅ Reactor registered: ${name}`);
}

// Reactor aktivieren
enableReactor(name, config = {}) {
  const ReactorClass = this.reactors.get(name);
  const instance = new ReactorClass(this, config);
  this.activeReactors.set(name, instance);
  
  // Apply zu allen kompatiblen Morphs
  const morphs = this.getMorphsByType(instance.morphTypes);
  instance.apply(morphs);
  
  this.emit('reactor:enabled', { name, config, morphs: morphs.length });
}

// Reactor deaktivieren
disableReactor(name) {
  const instance = this.activeReactors.get(name);
  const morphs = this.getAllMorphs();
  instance.cleanup(morphs);
  this.activeReactors.delete(name);
  
  this.emit('reactor:disabled', { name, morphs: morphs.length });
}

// Reactor togglen
toggleReactor(name, config = {}) {
  if (this.activeReactors.has(name)) {
    this.disableReactor(name);
  } else {
    this.enableReactor(name, config);
  }
}
```

### Morph Management

```javascript
// Morph registrieren (passiert automatisch bei connectedCallback)
registerMorph(element) {
  this.morphs.add(element);
  
  // Apply alle aktiven Reactors
  this.activeReactors.forEach((reactor) => {
    if (this.reactorSupportsType(reactor.morphTypes, element.dataset.morphType)) {
      reactor.apply([element]);
    }
  });
  
  this.emit('morph:registered', { element });
}

// Morph deregistrieren
unregisterMorph(element) {
  this.morphs.delete(element);
  this.emit('morph:unregistered', { element });
}

// Alle Morphs holen
getAllMorphs() {
  return Array.from(document.querySelectorAll('[data-morph]'));
}

// Morphs nach Type filtern
getMorphsByType(types) {
  if (types.includes('*')) return this.getAllMorphs();
  return this.getAllMorphs().filter(m => 
    types.includes(m.dataset.morphType)
  );
}
```

### State Management

```javascript
// Aktive Perspektiven setzen (Multi-Select bis zu 4)
setActivePerspectives(perspectives) {
  // Validierung
  if (perspectives.length > this.config.multiPerspective.maxSelection) {
    this.warn('Too many perspectives selected');
    return false;
  }
  
  this.state.activePerspectives = perspectives;
  this.emit('perspectives:changed', { perspectives });
  return true;
}

// Selektierte Tags setzen
setSelectedTags(tags) {
  this.state.selectedTags = new Set(tags);
  this.emit('tags:changed', { tags });
}

// Search Query setzen
setSearchQuery(query) {
  this.state.searchQuery = query;
  this.emit('search:query', { query });
}
```

### Event System ✨ **[UPDATED 2025-11-17]**

**CRITICAL FIX:** Event namespace now consistent! 

**Event Name Convention:**
- ✅ **WITHOUT prefix** when calling `.on()` or `.emit()` → System adds `amorph:` internally
- ✅ Example: `amorph.on('search:completed', callback)` ← NO `amorph:` prefix!
- ✅ Example: `amorph.emit('search:completed', data)` ← NO `amorph:` prefix!
- ❌ NEVER use: `amorph.on('amorph:search:completed', callback)` ← WRONG!

```javascript
// NEW: Stream Event Publishing (RECOMMENDED)
async streamPublish(eventName, data) {
  if (!this.eventBridge.isConnected()) {
    // Fallback zu lokalem emit()
    // IMPORTANT: Strip 'amorph:' prefix if present (emit() adds it)
    const strippedEventName = eventName.replace(/^amorph:/, '');
    this.emit(strippedEventName, data);
    return false;
  }
  
  return await this.eventBridge.streamPublish(eventName, data);
}

// Event emittieren (lokal + Redis Pub/Sub)
emit(eventName, data) {
  const fullEventName = `amorph:${eventName}`; // Adds prefix here!
  
  // Trigger lokale Listener (using eventName WITHOUT prefix)
  const listeners = this.listeners.get(eventName) || [];
  listeners.forEach(callback => {
    try {
      callback(data);
    } catch (err) {
      this.error(`Error in event listener for "${eventName}":`, err);
    }
  });
  
  // CustomEvent dispatchen (Browser) - uses fullEventName WITH prefix
  if (typeof document !== 'undefined') {
    const event = new CustomEvent(fullEventName, {
      detail: data,
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(event);
  }
  
  this.log(`📡 Local Event: ${fullEventName}`, data);
}

// Subscribe zu Event (WITHOUT prefix!)
on(eventName, callback) {
  if (!this.listeners.has(eventName)) {
    this.listeners.set(eventName, []);
  }
  
  this.listeners.get(eventName).push(callback);
  
  // Return unsubscribe function
  return () => {
    const listeners = this.listeners.get(eventName);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

// Unsubscribe von Event (WITHOUT prefix!)
off(eventName, callback) {
  const listeners = this.listeners.get(eventName);
  if (listeners) {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
}
```

**Example Usage:**
```javascript
// ✅ CORRECT: Register listener without prefix
amorph.on('search:completed', (data) => {
  console.log('Search completed!', data);
});

// ✅ CORRECT: Publish event without prefix
amorph.streamPublish('search:completed', {
  query: 'peptide',
  totalResults: 1,
  matchedPerspectives: ['chemicalAndProperties']
});

// ✅ CORRECT: Emit event without prefix
amorph.emit('search:completed', { query: 'test' });

// ❌ WRONG: Don't use 'amorph:' prefix!
amorph.on('amorph:search:completed', callback); // Will NOT work!
```

**Key Events:**
- `search:input` - Search query changed
- `search:completed` - Search finished, includes matchedPerspectives array
- `reactor:enabled` - Reactor was enabled
- `reactor:disabled` - Reactor was disabled
- `morph:created` - New morph registered
- `perspective:changed` - Active perspectives changed

// Event subscriben (Legacy)
on(eventName, callback) {
  if (!this.listeners.has(eventName)) {
    this.listeners.set(eventName, new Set());
  }
  this.listeners.get(eventName).add(callback);
}

// NEW: Observers Property
this.observers = {
  morph: MorphObserver,
  reactor: ReactorObserver,
  host: HostObserver,
  global: GlobalObserver,
  arch: ArchObserver,
  layout: LayoutObserver
}

// NEW: Observer Management
async initStreamObservers() {
  // Create all 6 observers
  // Start all observers
  // Auto-start nach Redis Connection
}

async stopStreamObservers() {
  // Stop all observers
}
```

### Singleton Instance

```javascript
// Singleton Export
export const amorph = new AmorphSystem();

// Global verfügbar machen
if (typeof window !== 'undefined') {
  window.amorph = amorph;
}
```

## RedisEventBridge.js **[UPDATED 2025-11-15]**

### Verantwortlichkeiten

Verbindet das AMORPH System mit Redis als Event Bus:
- ✅ Redis Pub/Sub Connection Management (Legacy)
- ✅ **Redis Streams** mit Consumer Groups (NEW)
- ✅ Event Broadcasting über Redis
- ✅ Event Receiving und Distribution
- ✅ Reconnection Logic
- ✅ Fallback auf localStorage (wenn Redis nicht verfügbar)

**NEU: Redis Streams Support**
- `streamPublish()` - XADD zu Redis Stream
- `createConsumerGroup()` - Consumer Groups für Observers
- `streamRead()` - XREADGROUP für Observer Polling
- `streamAck()` - Message Acknowledgement
- `streamInfo()` - Stream Statistics

### Architektur

```javascript
export class RedisEventBridge {
  constructor(config = {}) {
    this.config = {
      url: 'redis://localhost:6379',
      channel: 'amorph:events',
      streamName: 'amorph:stream',        // NEW
      streamMaxLen: 10000,                // NEW
      reconnectDelay: 1000,
      maxRetries: 5,
      enableLogging: true,
      ...config
    };
    
    this.publisher = null;
    this.subscriber = null;
    this.streamClient = null;            // NEW
    this.connected = false;
    this.listeners = new Map();
  }
  
  async connect() {
    // Connect Publisher, Subscriber, StreamClient
    // Falls fehlschlägt: Fallback auf localStorage
  }
  
  // Legacy Pub/Sub (DEPRECATED)
  async publish(eventName, data) {
    // Publish Event zu Redis Channel
  }
  
  // NEW: Redis Streams
  async streamPublish(eventName, data) {
    // XADD amorph:stream * event "..." data "..." timestamp "..."
    // Returns: Stream Entry ID
  }
  
  async createConsumerGroup(groupName, startId = '$') {
    // XGROUP CREATE amorph:stream groupName $
  }
  
  async streamRead(groupName, consumerName, options = {}) {
    // XREADGROUP GROUP groupName consumerName STREAMS amorph:stream >
    // Returns: Array of { id, event, data, timestamp, source }
  }
  
  async streamAck(groupName, messageId) {
    // XACK amorph:stream groupName messageId
  }
  
  async streamInfo() {
    // XINFO STREAM amorph:stream
  }
  
  on(eventName, callback) {
    // Subscribe zu Event (Legacy)
  }
}
```

### Browser Fallback

Da Redis im Browser nicht direkt läuft:
- ✅ Verwendet `localStorage` als Event Bus im Browser
- ✅ Verwendet `storage` Event für Cross-Tab Communication
- ✅ Server-Side: Echtes Redis für Multi-User Sync

## PixieRenderer.js

### Verantwortlichkeiten

Verwendet Pixi.js für performante Node-Darstellung:
- ✅ Canvas-basiertes Rendering mit Pixi.js
- ✅ Node Rendering (Bubbles)
- ✅ Connection Rendering (Linien zwischen Nodes)
- ✅ Particle Rendering (Flow auf Connections)
- ✅ Performante Updates (requestAnimationFrame)

### Architektur

```javascript
export class PixieRenderer {
  constructor(config = {}) {
    this.config = {
      antialias: true,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      width: 800,
      height: 600,
      autoResize: true,
      ...config
    };
    
    this.app = null;              // Pixi Application
    this.container = null;        // Root Container
    this.nodes = new Map();       // id → PIXI.Graphics (Nodes)
    this.connections = new Map(); // id → PIXI.Graphics (Lines)
    this.particles = new Map();   // id → PIXI.Graphics (Particles)
  }
  
  async init(containerElement) {
    // Erstelle Pixi App
    this.app = new Application({...this.config});
    containerElement.appendChild(this.app.view);
    
    // Setup Container
    this.container = new Container();
    this.app.stage.addChild(this.container);
  }
  
  renderNode(id, options = {}) {
    // Rendere Circle mit Pixi Graphics
  }
  
  renderConnection(id, options = {}) {
    // Rendere Linie zwischen zwei Nodes
  }
  
  renderParticle(id, options = {}) {
    // Rendere kleiner Kreis für Flow-Effekt
  }
}
```

### Verwendung

```javascript
// In BubbleView
const pixie = await amorph.initPixieRenderer(containerElement);

// Nodes rendern
morphs.forEach((morph, index) => {
  pixie.renderNode(`node-${index}`, {
    x: bubble.x,
    y: bubble.y,
    radius: bubble.size,
    color: perspectiveColor
  });
});

// Connections rendern
connections.forEach((connection, index) => {
  pixie.renderConnection(`conn-${index}`, {
    x1: bubble1.x,
    y1: bubble1.y,
    x2: bubble2.x,
    y2: bubble2.y,
    width: 2,
    color: 0xffffff
  });
});
```

## Integration

Alle drei Core-Komponenten arbeiten zusammen:

```javascript
// 1. AmorphSystem wird initialisiert
export const amorph = new AmorphSystem();

// 2. Redis Event Bridge wird connected
await amorph.initEventBridge();

// 3. Pixie Renderer wird bei Bedarf initialisiert
const pixie = await amorph.initPixieRenderer(container);

// 4. System ist bereit!
console.log('🔮 AMORPH System Ready!', amorph.getSystemInfo());
```

---

## domain.config.js - Domain Configuration **[FUNGINOMI INSTANCE]**

### Verantwortlichkeiten

Domain-specific configuration for the Funginomi instance:
- ✅ Instance metadata (name, domain, description)
- ✅ Data source configuration (Convex table, field mappings)
- ✅ Perspective definitions (12 fungi perspectives)
- ✅ UI configuration (grid/card styles, labels)
- ✅ External links (Bifröst integration)

### Structure

```javascript
export default {
  instance: {
    name: 'Funginomi',
    domain: 'fungi',  // Used in routes (/fungi/[slug])
    description: 'Comprehensive fungi knowledge base',
    logo: '/images/logo-funginomi.svg'
  },
  
  dataSource: {
    type: 'convex',
    table: 'fungi',
    nameField: 'commonName',
    slugField: 'seoName',
    descriptionField: 'description'
  },
  
  perspectives: [
    {
      id: 'taxonomy',
      name: 'Taxonomy',
      icon: '🧬',
      color: '#ef4444',
      description: 'Scientific classification'
    },
    // ... 11 more perspectives
  ],
  
  ui: {
    grid: {
      containerClass: '.entity-grid',
      cardClass: '.entity-card'
    },
    labels: {
      connectedEntities: 'Connected Entities'
    }
  },
  
  externalLinks: {
    bifroest: 'https://bifroest.io'
  }
};
```

**Key Principle:** This file contains ALL instance-specific configuration. To create a new instance with a different domain, only this file needs to be changed - the framework code remains untouched.

---

## observers/ - Stream Observers (8 Observers)

### Verantwortlichkeiten

Stream-based observers for Redis Streams event processing:
- ✅ **BaseObserver.js** - Abstract base class for all observers
- ✅ **MorphObserver.js** - Morph lifecycle events
- ✅ **ReactorObserver.js** - Reactor state changes
- ✅ **HostObserver.js** - Host component events
- ✅ **GlobalObserver.js** - Global system events
- ✅ **ArchObserver.js** - Architecture events
- ✅ **LayoutObserver.js** - Layout events
- ✅ **PerformanceObserver.js** - Performance monitoring

### Architecture

All observers:
1. Extend BaseObserver
2. Define `eventTypes` they listen to
3. Implement `handleMessage(message)` method
4. Poll Redis Streams via XREADGROUP
5. Auto-acknowledge processed messages

**Example:**
```javascript
import { BaseObserver } from './BaseObserver.js';

export class MorphObserver extends BaseObserver {
  eventTypes = ['morph:registered', 'morph:unregistered', 'morph:updated'];
  
  async handleMessage(message) {
    const { event, data } = message;
    
    switch (event) {
      case 'morph:registered':
        console.log('New morph registered:', data.element);
        break;
      // ...
    }
  }
}
```

See `observers/CLAUDE.md` for full documentation.

---

## Status: ✅ KOMPLETT IMPLEMENTIERT

Alle Core-Komponenten sind fertig und produktionsbereit.

**Latest Updates (2025-11-15):**
- ✅ RedisEventBridge erweitert mit Redis Streams
- ✅ AmorphSystem mit streamPublish() und Observer Management
- ✅ 6 Stream Observers implementiert und integriert
- ✅ Event Migration zu streamPublish() in AmorphSystem
- ✅ **Global Design System** in `arch/styles/tokens.js`
- ✅ **Alle Morphs** nutzen globalStyles
- ✅ **Konsistentes Styling** über alle Komponenten

Siehe: `STREAM_OBSERVER_SYSTEM.md` für vollständige Dokumentation
