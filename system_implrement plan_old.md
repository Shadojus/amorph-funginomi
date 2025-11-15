# 🚀 AMORPH System - Kompletter Implementierungs-Plan

**Ziel:** Von 0 zu komplett funktionalem AMORPH System  
**Philosophie:** Atomic Design - Jedes Datenfeld ist ein eigener Morph  
**Tech Stack:** Astro + Lit + Vanilla JS Reactors + Convex (Lokal) + Pixie Renderer + Redis Event Bus

---

## 📋 Übersicht der Phasen

### **🏗️ TEIL 1: MVP - FUNKTIONIERENDES BASIS-SYSTEM (Phase 1-8)**

- **Phase 1:** Setup & Lokaler Convex
- **Phase 2:** Ordnerstruktur & Zentrale Configs
- **Phase 3:** Core AMORPH System
- **Phase 4:** Erste Atomic Morphs
- **Phase 5:** Basis Reactors (Glow, Search, Animation)
- **Phase 6:** MorphHeader Global
- **Phase 7:** Astro Integration & Data Loading
- **Phase 8:** MVP Testing & Polish

**Ergebnis nach Phase 8:** Funktionierendes Grid-View System mit atomic Morphs, multi-Perspektiven, weighted Search, allen Core-Features

---

### **🎨 TEIL 2: VOLLSTÄNDIGES SYSTEM (Phase 9-16)**

- **Phase 9:** Alle Atomic Morphs für alle Datenfelder
- **Phase 10:** Erweiterte Reactors (Pulse, Hover, Sort, Filter)
- **Phase 11:** BubbleView Foundation (BubbleHost, Pixie Renderer Integration)
- **Phase 12:** BubbleView Morphs (Bubble, Connection, Sphere mit Pixie)
- **Phase 13:** BubbleView Reactors (Flow, Attraction, ColorShift über Redis)
- **Phase 14:** Dynamic Re-Connection System
- **Phase 15:** Advanced Features (Export, Share, Analytics)
- **Phase 16:** DevTools, Performance, Production Ready

**Ergebnis nach Phase 16:** Vollständig ausgereiftes System mit allen Features

---

---

# 🏗️ TEIL 1: MVP - FUNKTIONIERENDES BASIS-SYSTEM

---

## 📦 Phase 1: Setup & Lokaler Convex (Tag 1 - Vormittag)

### **Ziel:** Entwicklungsumgebung vorbereiten, Convex lokal installieren

### **Schritt 1.1: Convex Lokal Installieren**

**Was ist Convex Local?**
Convex kann jetzt als lokaler Server laufen - keine Cloud nötig während der Entwicklung. Das ist schneller, kostenlos, und du hast volle Kontrolle.

**Installation:**

```bash
# Convex CLI global installieren
npm install -g convex

# In deinem Projekt
cd D:\00_Universe\05_Funginomi\astro-funginomi

# Convex initialisieren (lokal)
npx convex dev --local

# Das erstellt:
# - convex/ Ordner (existiert schon)
# - .env.local mit LOCAL_CONVEX_URL
# - Startet lokalen Convex Server auf localhost:3210
```

**Konfiguration in `.env.local`:**

```bash
# Lokaler Convex Server
PUBLIC_CONVEX_URL=http://localhost:3210
CONVEX_DEPLOYMENT=dev:local
```

**Warum wichtig?**
- Schnellere Entwicklung (keine Cloud-Latenz)
- Offline arbeiten möglich
- Kostenlos
- Volle Kontrolle über Daten

---

### **Schritt 1.2: Dependencies überprüfen/installieren**

```bash
# Lit für Web Components
npm install lit

# Convex Client
npm install convex

# Redis Client für Event Bus
npm install redis

# Pixie Renderer für Node-Darstellung
npm install @pixi/arch @pixi/display @pixi/graphics @pixi/app

# TypeScript types
npm install -D @types/redis
```

---

### **Schritt 1.3: Convex Schema validieren**

**Öffne:** `convex/schema.ts`

Stelle sicher, dass alle 12 Perspektiven definiert sind:
- culinaryAndNutritional
- medicinalAndHealth
- cultivationAndProcessing
- safetyAndIdentification
- ecologyAndHabitat
- morphologyAndIdentification
- biochemistryAndNutrition
- culturalAndHistorical
- commercialAndEconomic
- legalAndRegulatory
- researchAndDevelopment
- sustainabilityAndConservation

**Validierung:**
```bash
npx convex dev --local

# Öffne Browser: http://localhost:3210
# Convex Dashboard sollte laufen
# Schema sollte sichtbar sein
```

---

### **Schritt 1.4: Test-Daten laden**

```bash
# Seed-Script ausführen (wenn vorhanden)
npx convex run seedAll

# Oder einzelne Seeds
npx convex run seed_agaricus_subrufescens
```

**Validierung:**
- Öffne Convex Dashboard
- Gehe zu "Data" Tab
- Sollte Pilz-Dokumente sehen

---

### **✅ Phase 1 Deliverables:**
- ✅ Convex läuft lokal auf localhost:3210
- ✅ `.env.local` konfiguriert
- ✅ Dependencies installiert
- ✅ Schema validiert
- ✅ Test-Daten vorhanden

---

---

## 🗂️ Phase 2: Ordnerstruktur & Zentrale Configs (Tag 1 - Nachmittag)

### **Ziel:** Komplette AMORPH Ordnerstruktur mit zentralen Configs

### **Schritt 2.1: Basis-Ordnerstruktur erstellen**

```
src/amorph/
├── amorph.config.js           # Zentrale System-Config
├── reactors.config.js         # Reactor-Definitionen
├── morphs.config.js           # Morph-Type-Definitionen
├── init.js                    # System Initialization
│
├── arch/
│   ├── AmorphSystem.js        # Registry & Core
│   ├── RedisEventBridge.js    # Redis Event Bus Integration
│   └── PixieRenderer.js       # Pixie Node Renderer
│
├── reactors/
│   ├── glow/
│   ├── search/
│   ├── animation/
│   ├── pulse/
│   ├── flow/
│   ├── colorshift/
│   └── attraction/
│
├── morphs/
│   ├── global/
│   │   └── MorphHeader.js     # Globaler Header
│   │
│   ├── data/                  # Atomic Data Field Morphs
│   │   ├── NameMorph.js
│   │   ├── ImageMorph.js
│   │   ├── TextMorph.js
│   │   ├── TagMorph.js
│   │   ├── BooleanMorph.js
│   │   ├── NumberMorph.js
│   │   └── ListMorph.js
│   │
│   ├── category/              # Category Container Morphs
│   │   ├── EdibilityMorph.js
│   │   ├── TasteMorph.js
│   │   ├── HabitatMorph.js
│   │   └── MedicinalMorph.js
│   │
│   └── bubble/                # BubbleView Morphs (später)
│       ├── BubbleMorph.js
│       ├── ConnectionMorph.js
│       └── SphereMorph.js
│
├── hosts/
│   ├── GridHost.js            # Grid Container
│   ├── CardHost.js            # Card Container
│   └── BubbleHost.js          # Bubble Container (später)
│
├── observers/
│   └── PerformanceObserver.js
│
├── utils/
│   ├── extractTags.js
│   ├── calculateSimilarity.js
│   └── pixieHelpers.js
│
└── layouts/
    └── BaseLayout.astro       # Globales Layout
```

---

### **Schritt 2.2: amorph.config.js erstellen**

**Datei:** `src/amorph/amorph.config.js`

```javascript
/**
 * 🔮 AMORPH SYSTEM - ZENTRALE KONFIGURATION
 * 
 * Hier wird ALLES konfiguriert:
 * - System Settings
 * - Perspektiven mit Farben & Icons
 * - Default States
 * - Performance Settings
 */

export const AmorphConfig = {
  // ==========================================
  // SYSTEM SETTINGS
  // ==========================================
  system: {
    name: 'Funginomi AMORPH',
    version: '1.0.0',
    debug: true,              // Console-Logging
    devTools: true,           // Zeige Control Panel
    mode: 'development'       // 'development' | 'production'
  },
  
  // ==========================================
  // PERSPEKTIVEN (Aus Convex Schema)
  // ==========================================
  perspectives: [
    {
      id: 'culinaryAndNutritional',
      name: 'Culinary',
      icon: '🍽️',
      color: '#22c55e',
      description: 'Kulinarische und ernährungswissenschaftliche Aspekte'
    },
    {
      id: 'medicinalAndHealth',
      name: 'Medicinal',
      icon: '💊',
      color: '#8b5cf6',
      description: 'Medizinische und gesundheitliche Eigenschaften'
    },
    {
      id: 'cultivationAndProcessing',
      name: 'Cultivation',
      icon: '🌱',
      color: '#f59e0b',
      description: 'Anbau und Verarbeitung'
    },
    {
      id: 'safetyAndIdentification',
      name: 'Safety',
      icon: '⚠️',
      color: '#ef4444',
      description: 'Sicherheit und Identifikation'
    },
    {
      id: 'ecologyAndHabitat',
      name: 'Ecology',
      icon: '🌲',
      color: '#10b981',
      description: 'Ökologie und Lebensraum'
    },
    {
      id: 'morphologyAndIdentification',
      name: 'Morphology',
      icon: '🔬',
      color: '#06b6d4',
      description: 'Morphologie und Bestimmung'
    },
    {
      id: 'biochemistryAndNutrition',
      name: 'Biochemistry',
      icon: '⚗️',
      color: '#ec4899',
      description: 'Biochemie und Nährstoffe'
    },
    {
      id: 'culturalAndHistorical',
      name: 'Cultural',
      icon: '📜',
      color: '#a855f7',
      description: 'Kulturelle und historische Bedeutung'
    },
    {
      id: 'commercialAndEconomic',
      name: 'Commercial',
      icon: '💰',
      color: '#eab308',
      description: 'Kommerzielle und ökonomische Aspekte'
    },
    {
      id: 'legalAndRegulatory',
      name: 'Legal',
      icon: '⚖️',
      color: '#64748b',
      description: 'Rechtliche und regulatorische Informationen'
    },
    {
      id: 'researchAndDevelopment',
      name: 'Research',
      icon: '🧪',
      color: '#0ea5e9',
      description: 'Forschung und Entwicklung'
    },
    {
      id: 'sustainabilityAndConservation',
      name: 'Sustainability',
      icon: '♻️',
      color: '#14b8a6',
      description: 'Nachhaltigkeit und Naturschutz'
    }
  ],
  
  // ==========================================
  // MULTI-PERSPEKTIVEN SETTINGS
  // ==========================================
  multiPerspective: {
    enabled: true,
    maxSelection: 4,                    // Max. 4 Perspektiven gleichzeitig
    defaultPerspectives: ['culinaryAndNutritional'],  // Initial aktiv
    allowEmpty: false                    // Mind. 1 Perspektive muss aktiv sein
  },
  
  // ==========================================
  // REACTOR DEFAULTS
  // ==========================================
  defaultReactors: {
    animation: { 
      enabled: true, 
      type: 'fade-in',
      duration: 500,
      delay: 0
    },
    glow: { 
      enabled: false,
      color: '#00ff88',
      intensity: 1.0
    },
    search: {
      enabled: false,
      fuzzy: true,
      caseSensitive: false
    }
  },
  
  // ==========================================
  // SEARCH SETTINGS (Weighted Scoring)
  // ==========================================
  search: {
    weights: {
      tag: 100,           // Tags haben höchste Priorität
      name: 50,           // Name mittlere Priorität
      description: 10     // Description niedrigste Priorität
    },
    debounce: 300,        // ms - Verzögerung vor Search-Trigger
    minScore: 10,         // Minimum Score für Match
    fuzzyMatch: true,     // Fuzzy Matching aktiviert
    caseSensitive: false  // Groß-/Kleinschreibung ignorieren
  },
  
  // ==========================================
  // TAG EXTRACTION SETTINGS
  // ==========================================
  tags: {
    maxPerMorph: 20,      // Max. Tags pro Morph
    separator: ',',       // Tag-Separator
    excludeEmpty: true,   // Leere Tags ignorieren
    slugify: true,        // Tags in Slugs konvertieren
    prefixWithCategory: true  // z.B. "taste:nutty" statt nur "nutty"
  },
  
  // ==========================================
  // CONVEX SETTINGS
  // ==========================================
  convex: {
    url: import.meta.env.PUBLIC_CONVEX_URL || 'http://localhost:3210',
    deployment: import.meta.env.CONVEX_DEPLOYMENT || 'dev:local',
    realtimeUpdates: true  // Live Updates aktiviert
  },
  
  // ==========================================
  // REDIS EVENT BUS SETTINGS
  // ==========================================
  redis: {
    url: import.meta.env.REDIS_URL || 'redis://localhost:6379',
    channel: 'amorph:events',
    reconnectDelay: 1000,
    maxRetries: 5,
    enableLogging: true
  },
  
  // ==========================================
  // PIXIE RENDERER SETTINGS
  // ==========================================
  pixie: {
    antialias: true,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    width: 800,
    height: 600,
    autoResize: true
  },
  
  // ==========================================
  // PERFORMANCE SETTINGS
  // ==========================================
  performance: {
    lazyLoad: true,           // Lazy Loading für Morphs
    virtualScroll: false,     // Virtuelles Scrolling (MVP: false)
    debounceResize: 150,      // ms - Window Resize Debounce
    throttleScroll: 16,       // ms - Scroll Throttle (~60fps)
    maxMorphsPerPage: 100,    // Max. Morphs gleichzeitig rendern
    caching: {
      enabled: true,
      ttl: 300000             // 5 Minuten Cache
    }
  },
  
  // ==========================================
  // BUBBLE VIEW SETTINGS (für später)
  // ==========================================
  bubbleView: {
    enabled: false,           // Initial deaktiviert
    renderer: 'pixie',        // Verwende Pixie Renderer
    physics: {
      gravity: 0.1,
      repulsion: 100,
      attraction: 0.01,
      friction: 0.9
    },
    similarity: {
      threshold: 0.3,         // Min. Similarity für Connection
      algorithm: 'cosine'     // 'cosine' | 'jaccard' | 'euclidean'
    },
    animation: {
      duration: 1000,
      easing: 'ease-in-out'
    },
    pixieSettings: {
      nodeRadius: { min: 20, max: 80 },
      connectionWidth: { min: 1, max: 5 },
      particleSize: 4,
      particleSpeed: 1.0
    }
  },
  
  // ==========================================
  // MORPH TYPES (Atomic Design)
  // ==========================================
  morphTypes: {
    // Data Field Morphs (Atomic)
    atomic: [
      'name',
      'image',
      'text',
      'tag',
      'boolean',
      'number',
      'list'
    ],
    
    // Category Morphs (Container)
    category: [
      'edibility',
      'taste',
      'habitat',
      'medicinal',
      'cultivation'
    ],
    
    // Composite Morphs (Card/Grid)
    composite: [
      'card',
      'grid-item'
    ],
    
    // BubbleView Morphs
    bubble: [
      'bubble',
      'connection',
      'sphere'
    ]
  }
};

export default AmorphConfig;
```

---

### **Schritt 2.3: reactors.config.js erstellen**

**Datei:** `src/amorph/reactors.config.js`

```javascript
/**
 * ⚡ REACTOR KONFIGURATION
 * 
 * Definiert alle verfügbaren Reactors und ihre Defaults
 */

export const ReactorsConfig = {
  // ==========================================
  // CORE REACTORS (MVP)
  // ==========================================
  
  glow: {
    name: 'Glow Reactor',
    description: 'Lässt Morphs glühen bei Tag-Match',
    category: 'visual',
    enabled: false,
    defaultConfig: {
      color: '#00ff88',
      intensity: 1.0,
      duration: 2000,
      pulseSpeed: 1.0,
      tags: []
    },
    morphTypes: ['*']  // Wirkt auf alle Morph-Typen
  },
  
  search: {
    name: 'Search Reactor',
    description: 'Filtert & sortiert Morphs mit weighted Scoring',
    category: 'filter',
    enabled: false,
    defaultConfig: {
      query: '',
      fuzzy: true,
      caseSensitive: false,
      weights: {
        tag: 100,
        name: 50,
        description: 10
      },
      minScore: 10
    },
    morphTypes: ['*']
  },
  
  animation: {
    name: 'Animation Reactor',
    description: 'Eingangs-Animationen',
    category: 'animation',
    enabled: true,
    defaultConfig: {
      type: 'fade-in',  // 'fade-in' | 'slide-in' | 'scale-in'
      duration: 500,
      delay: 0,
      stagger: 50  // Verzögerung zwischen Morphs
    },
    morphTypes: ['*']
  },
  
  // ==========================================
  // EXTENDED REACTORS (Full System)
  // ==========================================
  
  pulse: {
    name: 'Pulse Reactor',
    description: 'Lässt Morphs pulsieren',
    category: 'animation',
    enabled: false,
    defaultConfig: {
      speed: 1.0,
      intensity: 0.5,
      frequency: 1000
    },
    morphTypes: ['bubble', 'card']
  },
  
  hover: {
    name: 'Hover Reactor',
    description: 'Hover-Effekte',
    category: 'interaction',
    enabled: true,
    defaultConfig: {
      style: 'lift',  // 'lift' | 'glow' | 'scale'
      intensity: 1.0,
      duration: 200
    },
    morphTypes: ['card', 'bubble']
  },
  
  sort: {
    name: 'Sort Reactor',
    description: 'Sortiert Morphs',
    category: 'layout',
    enabled: false,
    defaultConfig: {
      field: 'name',  // 'name' | 'score' | 'date'
      order: 'asc'    // 'asc' | 'desc'
    },
    morphTypes: ['*']
  },
  
  filter: {
    name: 'Filter Reactor',
    description: 'Komplexe Filterung',
    category: 'filter',
    enabled: false,
    defaultConfig: {
      rules: [],
      operator: 'AND'  // 'AND' | 'OR'
    },
    morphTypes: ['*']
  },
  
  // ==========================================
  // BUBBLEVIEW REACTORS
  // ==========================================
  
  flow: {
    name: 'Flow Reactor',
    description: 'Partikel-Flow auf Connection Lines',
    category: 'bubbleview',
    enabled: false,
    defaultConfig: {
      particleCount: 5,
      speed: 1.0,
      color: '#00ff88'
    },
    morphTypes: ['connection']
  },
  
  attraction: {
    name: 'Attraction Reactor',
    description: 'Physics-basierte Anordnung',
    category: 'bubbleview',
    enabled: false,
    defaultConfig: {
      strength: 0.01,
      distance: 100
    },
    morphTypes: ['bubble']
  },
  
  colorshift: {
    name: 'ColorShift Reactor',
    description: 'Farb-Änderung basierend auf Perspektiven',
    category: 'bubbleview',
    enabled: false,
    defaultConfig: {
      duration: 500,
      easing: 'ease-in-out'
    },
    morphTypes: ['bubble', 'connection', 'sphere']
  }
};

export default ReactorsConfig;
```

---

### **Schritt 2.4: morphs.config.js erstellen**

**Datei:** `src/amorph/morphs.config.js`

```javascript
/**
 * 🔷 MORPH KONFIGURATION
 * 
 * Definiert Morph-Typen und ihre Eigenschaften
 */

export const MorphsConfig = {
  // ==========================================
  // ATOMIC DATA FIELD MORPHS
  // ==========================================
  
  name: {
    type: 'atomic',
    component: 'name-morph',
    description: 'Zeigt Namen (Common oder Latin)',
    defaultConfig: {
      variant: 'common',  // 'common' | 'latin' | 'both'
      size: 'medium',     // 'small' | 'medium' | 'large'
      color: 'inherit'
    },
    searchable: true,
    searchWeight: 50
  },
  
  image: {
    type: 'atomic',
    component: 'image-morph',
    description: 'Zeigt Bild',
    defaultConfig: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      lazy: true,
      placeholder: true
    },
    searchable: false
  },
  
  text: {
    type: 'atomic',
    component: 'text-morph',
    description: 'Zeigt Text-Feld',
    defaultConfig: {
      maxLines: null,     // null = unbegrenzt
      ellipsis: true,
      markdown: false
    },
    searchable: true,
    searchWeight: 10
  },
  
  tag: {
    type: 'atomic',
    component: 'tag-morph',
    description: 'Zeigt einzelnen Tag',
    defaultConfig: {
      variant: 'pill',    // 'pill' | 'badge' | 'chip'
      color: 'auto',      // 'auto' | specific color
      clickable: true
    },
    searchable: true,
    searchWeight: 100   // Tags haben höchste Priorität!
  },
  
  boolean: {
    type: 'atomic',
    component: 'boolean-morph',
    description: 'Zeigt Boolean (Checkbox, Icon)',
    defaultConfig: {
      variant: 'icon',    // 'icon' | 'checkbox' | 'badge'
      trueIcon: '✓',
      falseIcon: '✗'
    },
    searchable: false
  },
  
  number: {
    type: 'atomic',
    component: 'number-morph',
    description: 'Zeigt Zahl mit optionaler Einheit',
    defaultConfig: {
      format: 'decimal',  // 'decimal' | 'percent' | 'currency'
      decimals: 2,
      unit: null
    },
    searchable: false
  },
  
  list: {
    type: 'atomic',
    component: 'list-morph',
    description: 'Zeigt Liste von Items',
    defaultConfig: {
      variant: 'bullets',  // 'bullets' | 'numbered' | 'chips'
      maxItems: null,
      collapsible: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  // ==========================================
  // CATEGORY CONTAINER MORPHS
  // ==========================================
  
  edibility: {
    type: 'category',
    component: 'edibility-morph',
    description: 'Container für Essbarkeits-Informationen',
    containsFields: ['edibleRaw', 'cookingRequired', 'toxicity'],
    defaultConfig: {
      layout: 'compact'   // 'compact' | 'expanded'
    },
    searchable: true,
    searchWeight: 30
  },
  
  taste: {
    type: 'category',
    component: 'taste-morph',
    description: 'Container für Geschmacks-Informationen',
    containsFields: ['flavorProfile', 'intensity', 'notes'],
    defaultConfig: {
      showChart: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  habitat: {
    type: 'category',
    component: 'habitat-morph',
    description: 'Container für Lebensraum-Informationen',
    containsFields: ['ecosystem', 'climate', 'substrate'],
    defaultConfig: {
      showMap: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  medicinal: {
    type: 'category',
    component: 'medicinal-morph',
    description: 'Container für medizinische Informationen',
    containsFields: ['benefits', 'compounds', 'dosage'],
    defaultConfig: {
      highlightBenefits: true
    },
    searchable: true,
    searchWeight: 40
  },
  
  // ==========================================
  // COMPOSITE MORPHS
  // ==========================================
  
  card: {
    type: 'composite',
    component: 'card-host',
    description: 'Container für mehrere Morphs als Karte',
    defaultConfig: {
      layout: 'vertical',  // 'vertical' | 'horizontal'
      padding: 'medium',
      border: true,
      shadow: true
    }
  },
  
  // ==========================================
  // BUBBLEVIEW MORPHS
  // ==========================================
  
  bubble: {
    type: 'bubble',
    component: 'bubble-morph',
    description: 'Node im Bubble-Graph',
    defaultConfig: {
      minRadius: 20,
      maxRadius: 80,
      radiusBy: 'connections'  // 'connections' | 'fixed'
    },
    searchable: true,
    searchWeight: 50
  },
  
  connection: {
    type: 'bubble',
    component: 'connection-morph',
    description: 'Verbindungslinie zwischen Bubbles',
    defaultConfig: {
      minWidth: 1,
      maxWidth: 5,
      widthBy: 'strength'  // 'strength' | 'fixed'
    },
    searchable: false
  },
  
  sphere: {
    type: 'bubble',
    component: 'sphere-morph',
    description: 'Partikel auf Connection Line',
    defaultConfig: {
      radius: 4,
      speed: 1.0
    },
    searchable: false
  }
};

export default MorphsConfig;
```

---

### **✅ Phase 2 Deliverables:**
- ✅ Komplette Ordnerstruktur erstellt
- ✅ `amorph.config.js` - Zentrale System-Config
- ✅ `reactors.config.js` - Alle Reactor-Definitionen
- ✅ `morphs.config.js` - Alle Morph-Typen definiert
- ✅ Atomic Design Prinzip umgesetzt

---

---

## ⚙️ Phase 3: Core AMORPH System (Tag 2)

### **Ziel:** AmorphSystem.js - Das Gehirn des Systems mit Redis Event Bridge

### **Schritt 3.1: RedisEventBridge.js implementieren**

**Datei:** `src/amorph/arch/RedisEventBridge.js`

```javascript
/**
 * 🌉 REDIS EVENT BRIDGE
 * 
 * Verbindet das AMORPH System mit Redis als Event Bus
 * Alle Events werden über Redis Pub/Sub propagiert
 */

import { createClient } from 'redis';

export class RedisEventBridge {
  constructor(config = {}) {
    this.config = {
      url: config.url || 'redis://localhost:6379',
      channel: config.channel || 'amorph:events',
      reconnectDelay: config.reconnectDelay || 1000,
      maxRetries: config.maxRetries || 5,
      enableLogging: config.enableLogging || true
    };
    
    this.publisher = null;
    this.subscriber = null;
    this.connected = false;
    this.retryCount = 0;
    this.listeners = new Map();
  }
  
  /**
   * Verbinde mit Redis
   */
  async connect() {
    try {
      // Publisher Client
      this.publisher = createClient({ url: this.config.url });
      await this.publisher.connect();
      
      // Subscriber Client
      this.subscriber = createClient({ url: this.config.url });
      await this.subscriber.connect();
      
      // Subscribe zu Channel
      await this.subscriber.subscribe(this.config.channel, (message) => {
        this.handleMessage(message);
      });
      
      this.connected = true;
      this.retryCount = 0;
      this.log('✅ Redis Event Bridge connected');
      
      return true;
    } catch (err) {
      this.error('Failed to connect to Redis:', err);
      
      // Auto-Reconnect
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        this.log(`Retrying connection (${this.retryCount}/${this.config.maxRetries})...`);
        setTimeout(() => this.connect(), this.config.reconnectDelay);
      }
      
      return false;
    }
  }
  
  /**
   * Disconnect von Redis
   */
  async disconnect() {
    try {
      if (this.subscriber) await this.subscriber.quit();
      if (this.publisher) await this.publisher.quit();
      
      this.connected = false;
      this.log('Redis Event Bridge disconnected');
    } catch (err) {
      this.error('Error disconnecting from Redis:', err);
    }
  }
  
  /**
   * Publish Event zu Redis
   */
  async publish(eventName, data) {
    if (!this.connected) {
      this.warn('Not connected to Redis, event not published:', eventName);
      return false;
    }
    
    try {
      const message = JSON.stringify({
        event: eventName,
        data,
        timestamp: Date.now(),
        source: 'amorph'
      });
      
      await this.publisher.publish(this.config.channel, message);
      this.log(`📤 Event published: ${eventName}`);
      
      return true;
    } catch (err) {
      this.error(`Failed to publish event "${eventName}":`, err);
      return false;
    }
  }
  
  /**
   * Handle eingehende Redis Messages
   */
  handleMessage(message) {
    try {
      const { event, data, timestamp, source } = JSON.parse(message);
      
      this.log(`📥 Event received: ${event}`, data);
      
      // Call alle Listeners für diesen Event
      const listeners = this.listeners.get(event) || [];
      listeners.forEach(callback => {
        try {
          callback(data, { timestamp, source });
        } catch (err) {
          this.error(`Error in listener for "${event}":`, err);
        }
      });
      
      // Call Wildcard Listeners
      const wildcardListeners = this.listeners.get('*') || [];
      wildcardListeners.forEach(callback => {
        try {
          callback({ event, data }, { timestamp, source });
        } catch (err) {
          this.error('Error in wildcard listener:', err);
        }
      });
      
    } catch (err) {
      this.error('Failed to parse Redis message:', err);
    }
  }
  
  /**
   * Subscribe zu Event
   */
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
  
  /**
   * Check ob connected
   */
  isConnected() {
    return this.connected;
  }
  
  log(...args) {
    if (this.config.enableLogging) {
      console.log('[Redis Bridge]', ...args);
    }
  }
  
  warn(...args) {
    if (this.config.enableLogging) {
      console.warn('[Redis Bridge]', ...args);
    }
  }
  
  error(...args) {
    console.error('[Redis Bridge]', ...args);
  }
}
```

---

### **Schritt 3.2: PixieRenderer.js implementieren**

**Datei:** `src/amorph/arch/PixieRenderer.js`

```javascript
/**
 * 🎨 PIXIE RENDERER
 * 
 * Verwendet Pixi.js für performante Node-Darstellung
 * Rendert Bubbles, Connections und Particles
 */

import * as PIXI from '@pixi/arch';
import { Application } from '@pixi/app';
import { Graphics } from '@pixi/graphics';
import { Container } from '@pixi/display';

export class PixieRenderer {
  constructor(config = {}) {
    this.config = {
      antialias: config.antialias !== false,
      backgroundColor: config.backgroundColor || 0x000000,
      resolution: config.resolution || (window.devicePixelRatio || 1),
      autoDensity: config.autoDensity !== false,
      width: config.width || 800,
      height: config.height || 600,
      autoResize: config.autoResize !== false
    };
    
    this.app = null;
    this.container = null;
    this.nodes = new Map();  // id → PIXI.Graphics
    this.connections = new Map();  // id → PIXI.Graphics
    this.particles = new Map();  // id → PIXI.Graphics
  }
  
  /**
   * Initialisiere Pixie App
   */
  async init(containerElement) {
    try {
      this.app = new Application(this.config);
      
      await this.app.init({
        antialias: this.config.antialias,
        backgroundColor: this.config.backgroundColor,
        resolution: this.config.resolution,
        autoDensity: this.config.autoDensity,
        width: this.config.width,
        height: this.config.height
      });
      
      // Append Canvas zu Container
      containerElement.appendChild(this.app.canvas);
      
      // Main Container für alle Objekte
      this.container = new Container();
      this.app.stage.addChild(this.container);
      
      // Auto-Resize
      if (this.config.autoResize) {
        window.addEventListener('resize', () => this.resize());
        this.resize();
      }
      
      this.log('✅ Pixie Renderer initialized');
      return true;
    } catch (err) {
      this.error('Failed to initialize Pixie:', err);
      return false;
    }
  }
  
  /**
   * Resize Canvas
   */
  resize() {
    if (!this.app) return;
    
    const parent = this.app.canvas.parentElement;
    if (!parent) return;
    
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
  
  /**
   * Rendere einen Node (Bubble)
   */
  renderNode(id, options = {}) {
    const {
      x = 0,
      y = 0,
      radius = 30,
      color = 0x00ff88,
      alpha = 1.0,
      borderWidth = 2,
      borderColor = 0xffffff
    } = options;
    
    // Erstelle oder hole Node
    let node = this.nodes.get(id);
    if (!node) {
      node = new Graphics();
      this.nodes.set(id, node);
      this.container.addChild(node);
    }
    
    // Clear & Redraw
    node.clear();
    
    // Border
    if (borderWidth > 0) {
      node.circle(x, y, radius);
      node.stroke({ width: borderWidth, color: borderColor });
    }
    
    // Fill
    node.circle(x, y, radius);
    node.fill({ color, alpha });
    
    return node;
  }
  
  /**
   * Rendere eine Connection (Linie zwischen Nodes)
   */
  renderConnection(id, options = {}) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 100,
      y2 = 100,
      width = 2,
      color = 0x00ff88,
      alpha = 0.5
    } = options;
    
    // Erstelle oder hole Connection
    let connection = this.connections.get(id);
    if (!connection) {
      connection = new Graphics();
      this.connections.set(id, connection);
      this.container.addChild(connection);
    }
    
    // Clear & Redraw
    connection.clear();
    connection.moveTo(x1, y1);
    connection.lineTo(x2, y2);
    connection.stroke({ width, color, alpha });
    
    return connection;
  }
  
  /**
   * Rendere ein Particle (Flow auf Connection)
   */
  renderParticle(id, options = {}) {
    const {
      x = 0,
      y = 0,
      radius = 4,
      color = 0x00ff88,
      alpha = 1.0
    } = options;
    
    // Erstelle oder hole Particle
    let particle = this.particles.get(id);
    if (!particle) {
      particle = new Graphics();
      this.particles.set(id, particle);
      this.container.addChild(particle);
    }
    
    // Clear & Redraw
    particle.clear();
    particle.circle(x, y, radius);
    particle.fill({ color, alpha });
    
    return particle;
  }
  
  /**
   * Update Node Position
   */
  updateNodePosition(id, x, y) {
    const node = this.nodes.get(id);
    if (node) {
      node.position.set(x, y);
    }
  }
  
  /**
   * Remove Node
   */
  removeNode(id) {
    const node = this.nodes.get(id);
    if (node) {
      this.container.removeChild(node);
      node.destroy();
      this.nodes.delete(id);
    }
  }
  
  /**
   * Remove Connection
   */
  removeConnection(id) {
    const connection = this.connections.get(id);
    if (connection) {
      this.container.removeChild(connection);
      connection.destroy();
      this.connections.delete(id);
    }
  }
  
  /**
   * Remove Particle
   */
  removeParticle(id) {
    const particle = this.particles.get(id);
    if (particle) {
      this.container.removeChild(particle);
      particle.destroy();
      this.particles.delete(id);
    }
  }
  
  /**
   * Clear alles
   */
  clear() {
    // Remove all nodes
    this.nodes.forEach((node, id) => this.removeNode(id));
    
    // Remove all connections
    this.connections.forEach((connection, id) => this.removeConnection(id));
    
    // Remove all particles
    this.particles.forEach((particle, id) => this.removeParticle(id));
  }
  
  /**
   * Destroy Renderer
   */
  destroy() {
    this.clear();
    
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
    
    this.log('Pixie Renderer destroyed');
  }
  
  log(...args) {
    console.log('[Pixie Renderer]', ...args);
  }
  
  error(...args) {
    console.error('[Pixie Renderer]', ...args);
  }
}
```

---

### **Schritt 3.3: AmorphSystem.js implementieren (mit Redis Integration)**

**Datei:** `src/amorph/arch/AmorphSystem.js`

```javascript
/**
 * 🎯 AMORPH CORE SYSTEM
 * 
 * Zentrale Registry die ALLES verwaltet:
 * - Reactor-Management (register, enable, disable, toggle)
 * - Morph-Discovery & Registration
 * - Event-System über Redis Event Bridge
 * - Multi-Perspektiven State
 * - Search State mit Weighted Scoring
 * - Pixie Renderer Integration
 */

import { AmorphConfig } from '../amorph.config.js';
import { ReactorsConfig } from '../reactors.config.js';
import { MorphsConfig } from '../morphs.config.js';
import { RedisEventBridge } from './RedisEventBridge.js';
import { PixieRenderer } from './PixieRenderer.js';

export class AmorphSystem {
  constructor(config = {}) {
    // Merge Configs
    this.config = { ...AmorphConfig, ...config };
    
    // Registries
    this.reactors = new Map();           // name → reactor object
    this.activeReactors = new Set();     // Set von aktiven reactor names
    this.morphs = new Set();             // Set aller registrierten Morphs (DOM elements)
    
    // Redis Event Bridge
    this.eventBridge = new RedisEventBridge(this.config.redis);
    
    // Pixie Renderer
    this.pixieRenderer = null;
    
    // State
    this.state = {
      activePerspectives: [...this.config.multiPerspective.defaultPerspectives],
      selectedTags: [],
      searchQuery: '',
      searchScores: new Map()  // morph element → score
    };
    
    // Event Listeners (lokal, für sync handling)
    this.listeners = new Map();
    
    this.log('🔮 AmorphSystem initialized', this.config.system);
    
    // Auto-connect zu Redis
    this.initEventBridge();
  }
  
  /**
   * Initialisiere Redis Event Bridge
   */
  async initEventBridge() {
    try {
      await this.eventBridge.connect();
      
      // Subscribe zu wichtigen Events
      this.eventBridge.on('reactor:enabled', (data) => {
        this.log('📥 Redis Event: reactor:enabled', data);
      });
      
      this.eventBridge.on('reactor:disabled', (data) => {
        this.log('📥 Redis Event: reactor:disabled', data);
      });
      
      this.eventBridge.on('perspectives:changed', (data) => {
        this.log('📥 Redis Event: perspectives:changed', data);
      });
      
      this.log('✅ Event Bridge initialized');
    } catch (err) {
      this.error('Failed to initialize Event Bridge:', err);
    }
  }
  
  /**
   * Initialisiere Pixie Renderer
   */
  async initPixieRenderer(containerElement) {
    if (this.pixieRenderer) {
      this.warn('Pixie Renderer already initialized');
      return this.pixieRenderer;
    }
    
    this.pixieRenderer = new PixieRenderer(this.config.pixie);
    const success = await this.pixieRenderer.init(containerElement);
    
    if (success) {
      this.log('✅ Pixie Renderer initialized');
    } else {
      this.error('Failed to initialize Pixie Renderer');
    }
    
    return this.pixieRenderer;
  }
  
  // ==========================================
  // REACTOR MANAGEMENT
  // ==========================================
  
  /**
   * Registriere einen Reactor
   */
  registerReactor(name, reactor) {
    if (this.reactors.has(name)) {
      this.warn(`Reactor "${name}" already registered, overwriting...`);
    }
    
    // Validiere Reactor
    if (!reactor.apply || typeof reactor.apply !== 'function') {
      this.error(`Reactor "${name}" must have apply() method`);
      return false;
    }
    
    if (!reactor.remove || typeof reactor.remove !== 'function') {
      this.error(`Reactor "${name}" must have remove() method`);
      return false;
    }
    
    this.reactors.set(name, reactor);
    this.log(`✅ Reactor registered: ${name}`);
    
    // Auto-enable wenn in defaultReactors
    const defaultConfig = this.config.defaultReactors[name];
    if (defaultConfig?.enabled) {
      this.enableReactor(name, defaultConfig);
    }
    
    return true;
  }
  
  /**
   * Aktiviere einen Reactor
   */
  enableReactor(name, config = {}) {
    const reactor = this.reactors.get(name);
    
    if (!reactor) {
      this.error(`Reactor "${name}" not found! Did you register it?`);
      return false;
    }
    
    // Merge mit Default-Config aus reactors.config.js
    const reactorConfig = ReactorsConfig[name];
    const finalConfig = {
      ...reactorConfig?.defaultConfig,
      ...config
    };
    
    // Hole alle Morphs die mit diesem Reactor kompatibel sind
    const morphs = this.getMorphsByType(reactorConfig?.morphTypes || ['*']);
    
    // Apply reactor zu jedem Morph
    let successCount = 0;
    morphs.forEach(morph => {
      try {
        reactor.apply(morph, finalConfig);
        successCount++;
      } catch (err) {
        this.error(`Failed to apply reactor "${name}" to morph:`, err);
      }
    });
    
    this.activeReactors.add(name);
    this.log(`🔌 Reactor enabled: ${name} (${successCount}/${morphs.length} morphs affected)`);
    
    // Trigger event - sowohl lokal als auch über Redis
    const eventData = { name, config: finalConfig, morphs: morphs.length, successCount };
    this.emit('reactor:enabled', eventData);
    await this.eventBridge.publish('reactor:enabled', eventData);
    
    return true;
  }
  
  /**
   * Deaktiviere einen Reactor
   */
  disableReactor(name) {
    const reactor = this.reactors.get(name);
    
    if (!reactor) {
      this.error(`Reactor "${name}" not found!`);
      return false;
    }
    
    // Alle Morphs
    const morphs = this.getAllMorphs();
    
    // Remove reactor von jedem Morph
    let successCount = 0;
    morphs.forEach(morph => {
      try {
        reactor.remove(morph);
        successCount++;
      } catch (err) {
        this.error(`Failed to remove reactor "${name}" from morph:`, err);
      }
    });
    
    this.activeReactors.delete(name);
    this.log(`🔌 Reactor disabled: ${name} (${successCount} morphs cleaned)`);
    
    // Trigger event - sowohl lokal als auch über Redis
    const eventData = { name, morphs: morphs.length, successCount };
    this.emit('reactor:disabled', eventData);
    await this.eventBridge.publish('reactor:disabled', eventData);
    
    return true;
  }
  
  /**
   * Toggle Reactor (enable wenn disabled, disable wenn enabled)
   */
  toggleReactor(name, config = {}) {
    if (this.activeReactors.has(name)) {
      return this.disableReactor(name);
    } else {
      return this.enableReactor(name, config);
    }
  }
  
  /**
   * Ist Reactor aktiv?
   */
  isReactorActive(name) {
    return this.activeReactors.has(name);
  }
  
  // ==========================================
  // MORPH MANAGEMENT
  // ==========================================
  
  /**
   * Registriere einen Morph
   * (wird automatisch aufgerufen wenn Morph rendered wird)
   */
  registerMorph(element) {
    if (!element.dataset.morph) {
      this.warn('Morph without data-morph attribute registered');
      return;
    }
    
    // Unique ID generieren wenn nicht vorhanden
    if (!element.dataset.morphId) {
      element.dataset.morphId = `morph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    this.morphs.add(element);
    this.log(`📦 Morph registered: ${element.dataset.morphId} (type: ${element.dataset.morphType || 'unknown'})`);
    
    // Apply alle aktiven Reactors zu diesem Morph
    this.activeReactors.forEach(reactorName => {
      const reactor = this.reactors.get(reactorName);
      const reactorConfig = ReactorsConfig[reactorName];
      
      // Check ob Reactor auf diesen Morph-Type wirkt
      if (this.reactorSupportsType(reactorConfig?.morphTypes, element.dataset.morphType)) {
        try {
          reactor.apply(element, reactorConfig?.defaultConfig || {});
        } catch (err) {
          this.error(`Failed to apply reactor "${reactorName}" to new morph:`, err);
        }
      }
    });
    
    // Emit event
    this.emit('morph:registered', { element });
  }
  
  /**
   * Deregistriere einen Morph
   */
  unregisterMorph(element) {
    this.morphs.delete(element);
    this.log(`📦 Morph unregistered: ${element.dataset.morphId}`);
    
    // Emit event
    this.emit('morph:unregistered', { element });
  }
  
  /**
   * Hole alle Morphs (optional gefiltert)
   */
  getMorphs(filter = {}) {
    let morphs = Array.from(document.querySelectorAll('[data-morph]'));
    
    // Filter nach Type
    if (filter.type) {
      morphs = morphs.filter(m => m.dataset.morphType === filter.type);
    }
    
    // Filter nach Tags
    if (filter.tags && filter.tags.length > 0) {
      morphs = morphs.filter(morph => {
        const morphTags = (morph.dataset.tags || '').split(',').filter(Boolean);
        return filter.tags.some(tag => morphTags.includes(tag));
      });
    }
    
    // Filter nach Namen
    if (filter.name) {
      const query = filter.name.toLowerCase();
      morphs = morphs.filter(morph => {
        const name = (morph.dataset.name || '').toLowerCase();
        return name.includes(query);
      });
    }
    
    return morphs;
  }
  
  /**
   * Hole Morphs nach Typen (für Reactor-Kompatibilität)
   */
  getMorphsByType(types) {
    if (types.includes('*')) {
      return this.getAllMorphs();
    }
    
    return Array.from(document.querySelectorAll('[data-morph]')).filter(morph => {
      const morphType = morph.dataset.morphType || 'unknown';
      return types.includes(morphType);
    });
  }
  
  /**
   * Hole alle Morphs (ohne Filter)
   */
  getAllMorphs() {
    return Array.from(document.querySelectorAll('[data-morph]'));
  }
  
  /**
   * Check ob Reactor auf Morph-Type wirken soll
   */
  reactorSupportsType(reactorTypes, morphType) {
    if (!reactorTypes || reactorTypes.includes('*')) return true;
    return reactorTypes.includes(morphType);
  }
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  /**
   * Setze aktive Perspektiven (Multi-Select bis zu 4)
   */
  setActivePerspectives(perspectives) {
    // Validierung
    if (perspectives.length > this.config.multiPerspective.maxSelection) {
      this.warn(`Too many perspectives selected (max: ${this.config.multiPerspective.maxSelection})`);
      perspectives = perspectives.slice(0, this.config.multiPerspective.maxSelection);
    }
    
    if (perspectives.length === 0 && !this.config.multiPerspective.allowEmpty) {
      this.warn('At least one perspective must be active');
      return false;
    }
    
    const oldPerspectives = [...this.state.activePerspectives];
    this.state.activePerspectives = perspectives;
    
    this.log(`🔄 Perspectives changed: ${perspectives.join(', ')}`);
    
    // Emit event - sowohl lokal als auch über Redis
    const eventData = { old: oldPerspectives, new: perspectives };
    this.emit('perspectives:changed', eventData);
    await this.eventBridge.publish('perspectives:changed', eventData);
    
    return true;
  }
  
  /**
   * Hole aktive Perspektiven
   */
  getActivePerspectives() {
    return [...this.state.activePerspectives];
  }
  
  /**
   * Setze selektierte Tags (Multi-Select)
   */
  setSelectedTags(tags) {
    const oldTags = [...this.state.selectedTags];
    this.state.selectedTags = tags;
    
    this.log(`🏷️ Tags changed: ${tags.join(', ')}`);
    
    // Emit event - sowohl lokal als auch über Redis
    const eventData = { old: oldTags, new: tags };
    this.emit('tags:changed', eventData);
    await this.eventBridge.publish('tags:changed', eventData);
    
    return true;
  }
  
  /**
   * Hole selektierte Tags
   */
  getSelectedTags() {
    return [...this.state.selectedTags];
  }
  
  /**
   * Setze Search Query
   */
  setSearchQuery(query) {
    const oldQuery = this.state.searchQuery;
    this.state.searchQuery = query;
    
    this.log(`🔍 Search query changed: "${query}"`);
    
    // Emit event - sowohl lokal als auch über Redis
    const eventData = { old: oldQuery, new: query };
    this.emit('search:changed', eventData);
    await this.eventBridge.publish('search:changed', eventData);
    
    return true;
  }
  
  /**
   * Hole Search Query
   */
  getSearchQuery() {
    return this.state.searchQuery;
  }
  
  // ==========================================
  // EVENT SYSTEM
  // ==========================================
  
  /**
   * Emit Event (lokal)
   * Für Redis Events, verwende eventBridge.publish()
   */
  emit(eventName, data) {
    const fullEventName = `amorph:${eventName}`;
    
    // CustomEvent dispatchen (lokal im Browser)
    const event = new CustomEvent(fullEventName, {
      detail: data,
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(event);
    
    // Interne Listeners callen
    const listeners = this.listeners.get(eventName) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        this.error(`Error in event listener for "${eventName}":`, err);
      }
    });
    
    this.log(`📡 Local Event: ${fullEventName}`, data);
  }
  
  /**
   * Subscribe zu Event
   */
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
  
  // ==========================================
  // UTILITIES
  // ==========================================
  
  log(...args) {
    if (this.config.system.debug) {
      console.log('[AMORPH]', ...args);
    }
  }
  
  warn(...args) {
    if (this.config.system.debug) {
      console.warn('[AMORPH]', ...args);
    }
  }
  
  error(...args) {
    console.error('[AMORPH]', ...args);
  }
  
  /**
   * Get System Info (für DevTools)
   */
  getSystemInfo() {
    return {
      version: this.config.system.version,
      mode: this.config.system.mode,
      registeredReactors: Array.from(this.reactors.keys()),
      activeReactors: Array.from(this.activeReactors),
      morphCount: this.morphs.size,
      activePerspectives: this.state.activePerspectives,
      selectedTags: this.state.selectedTags,
      searchQuery: this.state.searchQuery,
      redisConnected: this.eventBridge.isConnected(),
      pixieInitialized: this.pixieRenderer !== null
    };
  }
  
  /**
   * Cleanup - Disconnect von Redis, destroy Pixie
   */
  async cleanup() {
    this.log('🧹 Cleaning up AmorphSystem...');
    
    // Disconnect Redis
    await this.eventBridge.disconnect();
    
    // Destroy Pixie
    if (this.pixieRenderer) {
      this.pixieRenderer.destroy();
      this.pixieRenderer = null;
    }
    
    this.log('✅ Cleanup complete');
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const amorph = new AmorphSystem();

// Global verfügbar machen (für Console Debugging)
if (typeof window !== 'undefined') {
  window.amorph = amorph;
  
  // Dev Mode: Zeige System Info beim Start
  if (amorph.config.system.debug) {
    console.log('🔮 AMORPH System Ready!', amorph.getSystemInfo());
  }
}
```

---

### **✅ Phase 3 Deliverables:**
- ✅ RedisEventBridge.js vollständig implementiert
- ✅ PixieRenderer.js vollständig implementiert
- ✅ AmorphSystem.js mit Redis & Pixie Integration
- ✅ Reactor-Management funktioniert
- ✅ Morph-Discovery & Registration
- ✅ Multi-Perspektiven State
- ✅ Event-System über Redis
- ✅ Singleton Instance global verfügbar

---

---

## 🧩 Phase 4: Erste Atomic Morphs (Tag 3)

### **Ziel:** Grundlegende Atomic Morphs als Lit Web Components

### **Schritt 4.1: NameMorph**

**Datei:** `src/amorph/morphs/data/NameMorph.js`

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';

export class NameMorph extends LitElement {
  static properties = {
    value: { type: String },
    variant: { type: String },  // 'common' | 'latin' | 'both'
    size: { type: String }       // 'small' | 'medium' | 'large'
  };
  
  static styles = css`
    :host {
      display: block;
    }
    
    .name {
      font-weight: 600;
      color: white;
      transition: all 0.3s ease;
    }
    
    .name.small { font-size: 14px; }
    .name.medium { font-size: 18px; }
    .name.large { font-size: 24px; }
    
    .name.latin {
      font-style: italic;
      opacity: 0.8;
    }
  `;
  
  constructor() {
    super();
    this.value = '';
    this.variant = 'common';
    this.size = 'medium';
  }
  
  firstUpdated() {
    // Registriere bei AmorphSystem
    amorph.registerMorph(this);
  }
  
  render() {
    return html`
      <div 
        class="name ${this.size} ${this.variant}"
        data-morph
        data-morph-type="name"
        data-morph-id="${this.getAttribute('id') || ''}"
        data-name="${this.value}"
      >
        ${this.value}
      </div>
    `;
  }
}

customElements.define('name-morph', NameMorph);
```

---

### **Schritt 4.2: ImageMorph**

**Datei:** `src/amorph/morphs/data/ImageMorph.js`

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';

export class ImageMorph extends LitElement {
  static properties = {
    src: { type: String },
    alt: { type: String },
    aspectRatio: { type: String },
    lazy: { type: Boolean }
  };
  
  static styles = css`
    :host {
      display: block;
    }
    
    .image-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
    }
    
    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }
    
    .image:hover {
      transform: scale(1.05);
    }
  `;
  
  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.aspectRatio = '16/9';
    this.lazy = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  render() {
    return html`
      <div 
        class="image-container"
        style="aspect-ratio: ${this.aspectRatio}"
        data-morph
        data-morph-type="image"
        data-morph-id="${this.getAttribute('id') || ''}"
      >
        <img 
          class="image"
          src="${this.src}"
          alt="${this.alt}"
          loading="${this.lazy ? 'lazy' : 'eager'}"
        >
      </div>
    `;
  }
}

customElements.define('image-morph', ImageMorph);
```

---

### **Schritt 4.3: TagMorph**

**Datei:** `src/amorph/morphs/data/TagMorph.js`

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';

export class TagMorph extends LitElement {
  static properties = {
    value: { type: String },
    variant: { type: String },  // 'pill' | 'badge' | 'chip'
    color: { type: String },
    clickable: { type: Boolean }
  };
  
  static styles = css`
    :host {
      display: inline-block;
    }
    
    .tag {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    
    .tag.clickable {
      cursor: pointer;
    }
    
    .tag.clickable:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
    }
  `;
  
  constructor() {
    super();
    this.value = '';
    this.variant = 'pill';
    this.color = 'auto';
    this.clickable = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  handleClick() {
    if (this.clickable) {
      this.dispatchEvent(new CustomEvent('tag-click', {
        detail: { tag: this.value },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  render() {
    return html`
      <span 
        class="tag ${this.variant} ${this.clickable ? 'clickable' : ''}"
        data-morph
        data-morph-type="tag"
        data-morph-id="${this.getAttribute('id') || ''}"
        data-tags="${this.value}"
        @click="${this.handleClick}"
      >
        ${this.value}
      </span>
    `;
  }
}

customElements.define('tag-morph', TagMorph);
```

---

### **Schritt 4.4: TextMorph**

**Datei:** `src/amorph/morphs/data/TextMorph.js`

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';

export class TextMorph extends LitElement {
  static properties = {
    value: { type: String },
    maxLines: { type: Number },
    ellipsis: { type: Boolean }
  };
  
  static styles = css`
    :host {
      display: block;
    }
    
    .text {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      font-size: 14px;
    }
    
    .text.ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  `;
  
  constructor() {
    super();
    this.value = '';
    this.maxLines = null;
    this.ellipsis = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  render() {
    const style = this.maxLines ? `-webkit-line-clamp: ${this.maxLines}` : '';
    
    return html`
      <div 
        class="text ${this.ellipsis ? 'ellipsis' : ''}"
        style="${style}"
        data-morph
        data-morph-type="text"
        data-morph-id="${this.getAttribute('id') || ''}"
        data-description="${this.value}"
      >
        ${this.value}
      </div>
    `;
  }
}

customElements.define('text-morph', TextMorph);
```

---

### **✅ Phase 4 Deliverables:**
- ✅ NameMorph implementiert
- ✅ ImageMorph implementiert
- ✅ TagMorph implementiert (mit Click-Handler)
- ✅ TextMorph implementiert
- ✅ Alle registrieren sich automatisch bei AmorphSystem
- ✅ Alle haben data-morph Attribute

---

**Das ist der erste Teil des Plans (Phase 1-4). Soll ich weitermachen mit Phase 5-8 (MVP fertigstellen) und dann Phase 9-16 (Full System)?**

Das würde dann alles abdecken:
- Basis Reactors (Glow, Search, Animation)
- MorphHeader Global
- Astro Integration
- Alle restlichen Atomic Morphs
- BubbleView komplett
- DevTools & Polish

**Weiter?** 🚀

