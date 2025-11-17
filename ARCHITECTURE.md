# 🏗️ AMORPH FUNGINOMI - System Architektur

> Vollständige Architekturdiagramme aller Systemebenen
> Stand: 16. November 2025

---

## 📑 Inhaltsverzeichnis

1. [High-Level System Overview](#1-high-level-system-overview)
2. [Data Flow Architecture](#2-data-flow-architecture)
3. [Event System Architecture](#3-event-system-architecture)
4. [Component Architecture](#4-component-architecture)
5. [Perspective System Architecture](#5-perspective-system-architecture)
6. [BubbleView Architecture](#6-bubbleview-architecture)
7. [Observer Pattern Architecture](#7-observer-pattern-architecture)
8. [Reactor System Architecture](#8-reactor-system-architecture)
9. [Morph Lifecycle Architecture](#9-morph-lifecycle-architecture)
10. [File Structure](#10-file-structure)

---

## 1. High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AMORPH FUNGINOMI SYSTEM                      │
│                     Morphological UI Framework                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                ┌──────────────────┴──────────────────┐
                │                                     │
        ┌───────▼────────┐                   ┌───────▼────────┐
        │   FRONTEND     │                   │    BACKEND     │
        │                │                   │                │
        │  Astro SSR     │◄──────────────────┤  Convex DB     │
        │  Lit Components│     API Calls     │  Redis Events  │
        │  AMORPH System │                   │                │
        └───────┬────────┘                   └────────────────┘
                │
    ┌───────────┼───────────────────┐
    │           │                   │
┌───▼───┐  ┌───▼────┐  ┌──────────▼──────────┐
│ Hosts │  │ Morphs │  │     Reactors        │
│       │  │        │  │                     │
│ Grid  │  │ Name   │  │ Glow  Search  Drag  │
│Bubble │  │ Image  │  │ Zoom  Filter  Flow  │
│Persp. │  │ Tag    │  │ Perspective Weight  │
└───┬───┘  └───┬────┘  └──────────┬──────────┘
    │          │                   │
    └──────────┴───────────────────┘
                │
         ┌──────▼──────┐
         │  Observers  │
         │             │
         │ Stream-based│
         │ State Mgmt  │
         └─────────────┘
```

---

## 2. Data Flow Architecture

### 2.1 Server-Side Rendering (SSR) Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        SSR DATA FLOW                           │
└────────────────────────────────────────────────────────────────┘

User Request
    │
    ├─► /fungi/[slug]
    │       │
    │       ├─► Astro.params.slug
    │       │       │
    │       │       ├─► fetchFungus(slug)
    │       │       │       │
    │       │       │       └─► Convex Query API
    │       │       │               │
    │       │       │               ├─► fungi.getBySlug({ slug })
    │       │       │               │       │
    │       │       │               │       └─► Database Query
    │       │       │               │               │
    │       │       │               │               └─► Return Fungus Object
    │       │       │               │
    │       │       │               └─► Return to Astro
    │       │       │
    │       │       └─► Render PerspectiveHosts
    │       │               │
    │       │               ├─► flattenObject(perspectiveData)
    │       │               │       │
    │       │               │       └─► Recursive Data Flattening
    │       │               │               │
    │       │               │               ├─► Arrays → Tags
    │       │               │               ├─► Objects → Sections
    │       │               │               └─► Primitives → Text
    │       │               │
    │       │               └─► renderField(field, depth)
    │       │                       │
    │       │                       └─► Generate Morphs
    │       │                               │
    │       │                               ├─► <tag-morph>
    │       │                               ├─► <text-morph>
    │       │                               └─► <name-morph>
    │       │
    │       └─► HTML Response to Browser
    │
    └─► /fungi (index)
            │
            └─► Similar flow with all fungi
```

### 2.2 Client-Side Hydration Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   CLIENT HYDRATION FLOW                        │
└────────────────────────────────────────────────────────────────┘

Browser receives HTML
    │
    ├─► Parse & Display Static Content
    │
    ├─► Load JavaScript Bundles
    │       │
    │       ├─► /src/amorph/init.js
    │       │       │
    │       │       ├─► Initialize AmorphSystem
    │       │       │       │
    │       │       │       ├─► Load Configuration
    │       │       │       ├─► Initialize Redis Event Bridge
    │       │       │       ├─► Initialize Observers
    │       │       │       └─► window.amorph = amorph
    │       │       │
    │       │       ├─► Import All Reactors
    │       │       │       │
    │       │       │       └─► Auto-Register Reactors
    │       │       │
    │       │       ├─► Import All Morphs
    │       │       │       │
    │       │       │       └─► Define Custom Elements
    │       │       │
    │       │       └─► Import Hosts & Views
    │       │
    │       └─► Lit Component Hydration
    │               │
    │               └─► connectedCallback()
    │                       │
    │                       └─► window.amorph.registerMorph(this)
    │
    └─► System Ready
            │
            └─► User Interactions → Event System
```

---

## 3. Event System Architecture

### 3.1 Dual Event System

```
┌────────────────────────────────────────────────────────────────┐
│                      EVENT SYSTEM LAYERS                       │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               REDIS STREAM EVENTS (NEW)                     │
│                  Preferred Method                           │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
  │  XADD     │      │ Consumer  │     │  XACK     │
  │  Publish  │      │  Groups   │     │ Acknowledge│
  └─────┬─────┘      └─────┬─────┘     └─────┬─────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────▼────────────┐
              │   RedisEventBridge      │
              │                         │
              │  streamPublish(event)   │
              │  createConsumerGroup()  │
              │  streamRead()           │
              │  streamAck()            │
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
  │   Morph   │      │  Reactor  │     │   Host    │
  │ Observer  │      │ Observer  │     │ Observer  │
  └───────────┘      └───────────┘     └───────────┘

┌─────────────────────────────────────────────────────────────┐
│           LEGACY EVENT SYSTEM (emit/on)                     │
│              Still Used by Infrastructure                   │
└─────────────────────────────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   AmorphSystem          │
              │                         │
              │  emit(eventName, data)  │
              │  on(eventName, callback)│
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
  │CustomEvent│      │  Listeners│     │ Document  │
  │  Browser  │      │    Map    │     │  Events   │
  └───────────┘      └───────────┘     └───────────┘
```

### 3.2 Event Flow Example

```
User Action (Click Perspective Button)
    │
    └─► MorphHeader.togglePerspective()
            │
            ├─► Update activePerspectives (FIFO)
            │       │
            │       └─► Max 4, remove oldest if > 4
            │
            └─► dispatchPerspectiveChange()
                    │
                    ├─► window.dispatchEvent('perspective-changed')
                    │       │
                    │       └─► Shadow DOM Compatibility
                    │
                    └─► document.dispatchEvent('perspective-changed')
                            │
                            └─► All PerspectiveHosts listen
                                    │
                                    ├─► PerspectiveHost 1
                                    │       │
                                    │       └─► Check if active
                                    │               │
                                    │               ├─► Yes → Show
                                    │               └─► No → Hide
                                    │
                                    ├─► PerspectiveHost 2
                                    │       └─► ...
                                    │
                                    └─► PerspectiveHost N
                                            └─► ...
```

---

## 4. Component Architecture

### 4.1 Component Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                         │
└────────────────────────────────────────────────────────────────┘

BaseLayout (Astro)
    │
    ├─► MorphHeader (Global)
    │       │
    │       ├─► Search Bar
    │       └─► 12 Perspective Buttons
    │
    └─► Page Content
            │
            ├─► Detail Page ([slug].astro)
            │       │
            │       └─► 12x PerspectiveHost
            │               │
            │               ├─► Perspective 1 (Taxonomy)
            │               │       │
            │               │       └─► Morphs
            │               │           ├─► <tag-morph>
            │               │           ├─► <text-morph>
            │               │           └─► <name-morph>
            │               │
            │               ├─► Perspective 2 (Physical)
            │               │       └─► ...
            │               │
            │               └─► Perspective N
            │                       └─► ...
            │
            └─► Index Page (index.astro)
                    │
                    ├─► GridHost (Default View)
                    │       │
                    │       └─► Fungi Cards
                    │           └─► Multiple DataMorphs per Fungus
                    │
                    └─► BubbleHost (Toggle View)
                            │
                            └─► BubbleView
                                    │
                                    ├─► Creates BubbleMorphs
                                    │       │
                                    │       └─► One per Fungus Group
                                    │
                                    └─► Canvas Rendering
                                            │
                                            ├─► Bubbles
                                            ├─► Connections
                                            └─► Labels
```

### 4.2 Morph Types & Usage

```
┌────────────────────────────────────────────────────────────────┐
│                        MORPH TYPES                             │
└────────────────────────────────────────────────────────────────┘

ATOMIC DATA MORPHS
├─► NameMorph           → Display names (common/latin)
├─► ImageMorph          → Images with lazy loading
├─► TagMorph            → Tags with click handlers
├─► TextMorph           → Text with ellipsis
├─► BooleanMorph        → Checkboxes/icons
├─► NumberMorph         → Numbers with units
└─► ListMorph           → Arrays as lists

ADVANCED MORPHS
├─► ChartMorph          → Data visualization
├─► MapMorph            → Geographic data
└─► TimelineMorph       → Temporal events

SPECIAL MORPHS
├─► DataMorph           → Generic field renderer
└─► BubbleMorph         → Virtual morph for BubbleView

USAGE EXAMPLE:
<name-morph 
  value="Steinpilz" 
  perspective="culinary"
  lang="de"
  data-morph
  data-morph-type="name"
  data-group="fungus-0"
></name-morph>
```

---

## 5. Perspective System Architecture

### 5.1 Perspective Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                  PERSPECTIVE SYSTEM FLOW                       │
└────────────────────────────────────────────────────────────────┘

Schema (12 Perspectives)
    │
    ├─► 1. taxonomy
    ├─► 2. physicalCharacteristics
    ├─► 3. ecologyAndHabitat
    ├─► 4. culinaryAndNutritional
    ├─► 5. medicinalAndHealth
    ├─► 6. cultivationAndProcessing
    ├─► 7. safetyAndIdentification
    ├─► 8. chemicalAndProperties
    ├─► 9. culturalAndHistorical
    ├─► 10. commercialAndMarket
    ├─► 11. environmentalAndConservation
    └─► 12. researchAndInnovation
            │
            └─► Convex Database
                    │
                    └─► fungi.getBySlug(slug)
                            │
                            └─► Fungus Object
                                    │
                                    ├─► fungus.taxonomy
                                    ├─► fungus.physicalCharacteristics
                                    ├─► fungus.ecologyAndHabitat
                                    └─► ... (all 12)
                                            │
                                            └─► Astro Page
                                                    │
                                                    └─► PerspectiveHost Array
                                                            │
                                                            ├─► Map each perspective
                                                            │       │
                                                            │       └─► Create <perspective-host>
                                                            │               │
                                                            │               ├─► id="taxonomy"
                                                            │               ├─► title="Taxonomy"
                                                            │               ├─► icon="🧬"
                                                            │               ├─► color="#ef4444"
                                                            │               └─► data={fungus.taxonomy}
                                                            │
                                                            └─► Initial State
                                                                    │
                                                                    └─► 4 Default Active:
                                                                        - taxonomy
                                                                        - ecologyAndHabitat
                                                                        - culinaryAndNutritional
                                                                        - safetyAndIdentification
```

### 5.2 FIFO Perspective Management

```
┌────────────────────────────────────────────────────────────────┐
│              FIFO PERSPECTIVE MANAGEMENT                       │
└────────────────────────────────────────────────────────────────┘

Initial State: [A, B, C, D]  (4 active perspectives)
                   │
User clicks E      │
    │              │
    ├─► Check Count
    │       │
    │       └─► Count === 4 (Max reached)
    │               │
    │               └─► FIFO: Remove Oldest (A)
    │                       │
    │                       └─► New State: [B, C, D, E]
    │
User clicks B (already active)
    │
    └─► Remove B
            │
            └─► New State: [C, D, E]

┌─────────────────────────────────────────────────────────┐
│  Visualization:                                         │
│                                                         │
│  Time →                                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                              │
│  │ A │→│ B │→│ C │→│ D │  (Initial)                   │
│  └───┘ └───┘ └───┘ └───┘                              │
│    ↓                                                    │
│  Remove A, Add E                                       │
│    ↓                                                    │
│        ┌───┐ ┌───┐ ┌───┐ ┌───┐                        │
│        │ B │→│ C │→│ D │→│ E │  (After)               │
│        └───┘ └───┘ └───┘ └───┘                        │
│                              ↑                          │
│                           Newest                        │
└─────────────────────────────────────────────────────────┘
```

---

## 6. BubbleView Architecture

### 6.1 BubbleView System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    BUBBLEVIEW ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────┘

BubbleHost
    │
    ├─► setData(fungi)  [3 fungi from Convex]
    │       │
    │       └─► createMorphsFromData()
    │               │
    │               ├─► For each fungus
    │               │       │
    │               │       ├─► Create NameMorphs
    │               │       ├─► Create ImageMorphs
    │               │       ├─► Create TextMorphs
    │               │       └─► Create TagMorphs
    │               │               │
    │               │               └─► data-group="fungus-0"
    │               │
    │               └─► Result: 12 Morphs with 3 groups
    │
    └─► BubbleView
            │
            ├─► setMorphs(morphs)
            │       │
            │       └─► Group by data-group
            │               │
            │               └─► 3 Bubble Groups
            │
            ├─► initializeBubbles()
            │       │
            │       ├─► Create bubble-morph elements
            │       │       │
            │       │       └─► Virtual AMORPH registration
            │       │
            │       └─► bubbles Map
            │               │
            │               ├─► slug → bubble data
            │               │       │
            │               │       ├─► x, y (position)
            │               │       ├─► vx, vy (velocity)
            │               │       ├─► size (60-150px)
            │               │       ├─► opacity (0.3-1.0)
            │               │       └─► similarity (Hilbert)
            │               │
            │               └─► 3 Bubbles total
            │
            ├─► Physics Simulation
            │       │
            │       ├─► updatePhysics() [60 FPS]
            │       │       │
            │       │       ├─► Collision Detection
            │       │       │       │
            │       │       │       └─► Gentle Repulsion
            │       │       │
            │       │       ├─► Velocity Updates
            │       │       │       │
            │       │       │       └─► Damping (95%)
            │       │       │
            │       │       └─► Position Updates
            │       │
            │       └─► requestAnimationFrame()
            │
            ├─► Selection System (FIFO Max 4)
            │       │
            │       ├─► Click Bubble
            │       │       │
            │       │       └─► toggleBubbleSelection()
            │       │               │
            │       │               ├─► If selected → Deselect
            │       │               │
            │       │               └─► If not selected
            │       │                       │
            │       │                       ├─► Check count
            │       │                       │       │
            │       │                       │       └─► If ≥ 4: Remove oldest
            │       │                       │
            │       │                       └─► Add to selection
            │       │
            │       └─► Visual Feedback
            │               │
            │               ├─► Selected: 30% larger
            │               ├─► Blue glow
            │               └─► Bold text
            │
            └─► Canvas Rendering
                    │
                    ├─► renderCanvas() [60 FPS]
                    │       │
                    │       ├─► Clear canvas
                    │       │
                    │       ├─► Draw connections (FIRST)
                    │       │       │
                    │       │       └─► Only between selected
                    │       │               │
                    │       │               ├─► Line thickness: 2-8px
                    │       │               ├─► Opacity: 0.3-0.9
                    │       │               └─► Percentage label
                    │       │
                    │       └─► Draw bubbles (ON TOP)
                    │               │
                    │               ├─► Fill with color
                    │               ├─► Multi-perspective borders
                    │               └─► Label text
                    │
                    └─► requestAnimationFrame()
```

### 6.2 Hilbert Space Similarity

```
┌────────────────────────────────────────────────────────────────┐
│              HILBERT SPACE SIMILARITY SYSTEM                   │
└────────────────────────────────────────────────────────────────┘

Active Perspectives: [culinary, medicinal, ecology, safety]
        │
        └─► FIFO Weights
                │
                ├─► culinary (oldest)    → 0.25
                ├─► medicinal            → 0.50
                ├─► ecology              → 0.75
                └─► safety (newest)      → 1.00
                        │
                        └─► HilbertSpaceSimilarity.calculate()
                                │
                                ├─► For each perspective
                                │       │
                                │       ├─► Compare fungus1 vs fungus2
                                │       │       │
                                │       │       └─► Jaccard Similarity
                                │       │               │
                                │       │               ├─► Arrays: Set intersection/union
                                │       │               │       │
                                │       │               │       └─► > 30% threshold
                                │       │               │
                                │       │               └─► Objects: Recursive compare
                                │       │
                                │       └─► Weight by FIFO position
                                │
                                └─► Average weighted similarities
                                        │
                                        └─► Final similarity: 0.0 - 1.0
                                                │
                                                └─► PerspectiveWeightReactor
                                                        │
                                                        ├─► Bubble size: 60 + (sim * 90)
                                                        └─► Bubble opacity: 0.3 + (sim * 0.7)
```

---

## 7. Observer Pattern Architecture

### 7.1 Stream Observer System

```
┌────────────────────────────────────────────────────────────────┐
│                  STREAM OBSERVER PATTERN                       │
└────────────────────────────────────────────────────────────────┘

Redis Stream: "amorph:stream"
    │
    ├─► XADD (Event Publishing)
    │       │
    │       └─► streamPublish(eventName, data)
    │               │
    │               ├─► morph:created
    │               ├─► reactor:enabled
    │               ├─► host:data-loaded
    │               └─► ... more events
    │
    └─► Consumer Groups (6 Observers)
            │
            ├─► MorphObserver (morph:*)
            │       │
            │       ├─► XREADGROUP morph-observer
            │       │       │
            │       │       └─► Poll every 100ms
            │       │
            │       ├─► State Management
            │       │       │
            │       │       ├─► morphs Map
            │       │       ├─► connections Map
            │       │       └─► stats Object
            │       │
            │       └─► XACK (Acknowledge)
            │
            ├─► ReactorObserver (reactor:*)
            │       │
            │       └─► Track reactor executions
            │
            ├─► HostObserver (host:*)
            │       │
            │       └─► Track host lifecycle
            │
            ├─► GlobalObserver (global:*)
            │       │
            │       └─► Track UI state
            │
            ├─► ArchObserver (arch:*)
            │       │
            │       └─► Track system state
            │
            └─► LayoutObserver (layout:*)
                    │
                    └─► Track layout events

┌─────────────────────────────────────────────────────────────┐
│  BaseObserver (Abstract Class)                             │
│                                                             │
│  constructor(eventBridge, config)                          │
│      ├─► prefix: 'morph:'                                  │
│      ├─► groupName: 'morph-observer'                       │
│      ├─► consumerName: 'morph-observer-{timestamp}'       │
│      └─► pollInterval: 100ms                               │
│                                                             │
│  async start()                                             │
│      ├─► createConsumerGroup()                             │
│      └─► startPolling()                                    │
│                                                             │
│  async poll()                                              │
│      ├─► streamRead()                                      │
│      ├─► Filter by prefix                                  │
│      ├─► handle(eventName, data)                           │
│      └─► streamAck()                                       │
│                                                             │
│  abstract handle(eventName, data, meta)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Reactor System Architecture

### 8.1 Reactor Lifecycle

```
┌────────────────────────────────────────────────────────────────┐
│                   REACTOR LIFECYCLE                            │
└────────────────────────────────────────────────────────────────┘

Import Phase
    │
    └─► /src/amorph/init.js
            │
            └─► Import All Reactors
                    │
                    ├─► GlowReactor
                    ├─► SearchReactor
                    ├─► AnimationReactor
                    ├─► PerspectiveWeightReactor
                    └─► ... more reactors
                            │
                            └─► Auto-Registration
                                    │
                                    └─► AmorphSystem.registerReactor(name, Class)
                                            │
                                            └─► reactors.set(name, Class)

Enable Phase
    │
    └─► amorph.enableReactor(name, config)
            │
            ├─► Get ReactorClass from registry
            │
            ├─► new ReactorClass(amorph, config)
            │       │
            │       └─► Reactor Instance created
            │
            ├─► activeReactors.set(name, instance)
            │
            ├─► Get compatible morphs
            │       │
            │       └─► getMorphsByType(instance.morphTypes)
            │
            ├─► instance.apply(morphs)
            │       │
            │       └─► Apply effect to morphs
            │
            └─► streamPublish('reactor:enabled', { name, config })

Runtime Phase
    │
    ├─► New Morph Registered
    │       │
    │       └─► Check all active reactors
    │               │
    │               └─► If compatible → apply(newMorph)
    │
    └─► User Interaction
            │
            └─► Reactor responds
                    │
                    └─► streamPublish('reactor:triggered', { name })

Disable Phase
    │
    └─► amorph.disableReactor(name)
            │
            ├─► Get instance from activeReactors
            │
            ├─► instance.cleanup(morphs)
            │       │
            │       └─► Remove effects
            │
            ├─► activeReactors.delete(name)
            │
            └─► streamPublish('reactor:disabled', { name })
```

### 8.2 Reactor Types & Responsibilities

```
┌────────────────────────────────────────────────────────────────┐
│                      REACTOR CATEGORIES                        │
└────────────────────────────────────────────────────────────────┘

CORE REACTORS (MVP)
├─► GlowReactor             → Highlight morphs with tag match
├─► SearchReactor           → Filter & score morphs by query
└─► AnimationReactor        → Entrance animations

EXTENDED REACTORS
├─► PulseReactor            → Pulsing animations
├─► HoverReactor            → Hover effects
├─► SortReactor             → Sort morphs by criteria
└─► FilterReactor           → Complex filtering

BUBBLEVIEW REACTORS
├─► FlowReactor             → Particle flow on connections
├─► ColorShiftReactor       → Dynamic color changes
├─► ConnectionRenderer      → Draw connections
├─► CollisionDetector       → Prevent overlap
├─► DragController          → Drag & drop
└─► ZoomPanController       → Zoom & pan

PERSPECTIVE REACTORS
├─► PerspectiveReactor      → Filter by perspective
└─► PerspectiveWeightReactor → Hilbert space similarity
                                │
                                ├─► Calculate similarity matrix
                                ├─► Apply weights (FIFO)
                                └─► Update bubble size/opacity
```

---

## 9. Morph Lifecycle Architecture

### 9.1 Morph Creation to Destruction

```
┌────────────────────────────────────────────────────────────────┐
│                    MORPH LIFECYCLE                             │
└────────────────────────────────────────────────────────────────┘

1. CREATION
    │
    ├─► Server-Side (Astro)
    │       │
    │       └─► <name-morph value="Steinpilz" ...>
    │
    └─► Client-Side (JavaScript)
            │
            └─► document.createElement('name-morph')
                    │
                    └─► Set attributes
                            │
                            └─► container.appendChild(morph)

2. REGISTRATION
    │
    └─► connectedCallback()
            │
            ├─► super.connectedCallback()  [Lit lifecycle]
            │
            ├─► Set data attributes
            │       │
            │       ├─► data-morph="true"
            │       ├─► data-morph-type="name"
            │       ├─► data-morph-id="name-{timestamp}-{random}"
            │       └─► data-group="fungus-0"
            │
            └─► window.amorph.registerMorph(this)
                    │
                    └─► AmorphSystem.registerMorph()
                            │
                            ├─► morphs.add(element)
                            │
                            ├─► Apply active reactors
                            │       │
                            │       └─► For each active reactor
                            │               │
                            │               └─► If compatible
                            │                       │
                            │                       └─► reactor.apply([element])
                            │
                            └─► streamPublish('morph:created', {
                                    id, type, element
                                })

3. RENDERING
    │
    └─► firstUpdated() [Lit lifecycle]
            │
            ├─► Render Shadow DOM
            │       │
            │       └─► Apply styles
            │               │
            │               └─► globalStyles + component styles
            │
            └─► streamPublish('morph:mounted', { id })

4. UPDATES
    │
    ├─► Property Change
    │       │
    │       └─► updated(changedProperties) [Lit]
    │               │
    │               └─► Re-render affected parts
    │
    └─► External Update
            │
            └─► setAttribute()
                    │
                    └─► Triggers Lit reactivity

5. DESTRUCTION
    │
    └─► disconnectedCallback()
            │
            ├─► Cleanup listeners
            │
            ├─► window.amorph.unregisterMorph(this)
            │       │
            │       └─► morphs.delete(element)
            │
            └─► streamPublish('morph:destroyed', { id })
```

### 9.2 Morph Data Attributes

```
┌────────────────────────────────────────────────────────────────┐
│               MORPH DATA ATTRIBUTE SYSTEM                      │
└────────────────────────────────────────────────────────────────┘

<name-morph
  value="Steinpilz"
  perspective="culinary"
  lang="de"
  
  data-morph="true"                    ← AMORPH marker
  data-morph-type="name"               ← Type for reactor targeting
  data-morph-id="name-1234567890-abc"  ← Unique ID
  data-group="fungus-0"                ← Grouping (BubbleView)
  data-perspective="culinary"          ← Perspective context
  data-lang="de"                       ← Language
  data-name="Steinpilz"                ← Searchable content
  data-search-score="100"              ← Search score (dynamic)
>
</name-morph>

Used By:
    │
    ├─► AmorphSystem
    │       │
    │       └─► document.querySelectorAll('[data-morph]')
    │
    ├─► Reactors
    │       │
    │       ├─► Filter by data-morph-type
    │       └─► Read data-* for targeting
    │
    ├─► SearchReactor
    │       │
    │       └─► Read data-name, data-description, data-tags
    │
    └─► BubbleView
            │
            └─► Group by data-group
```

---

## 10. File Structure

### 10.1 Directory Tree

```
amorph_funginomi/
│
├─── convex/                      # Backend (Convex DB)
│    ├─── schema.ts               # Database schema (1156 lines)
│    ├─── fungi.ts                # Query functions
│    ├─── seed_*.ts               # Seed data scripts
│    └─── CLAUDE.md               # Backend documentation
│
├─── src/
│    │
│    ├─── amorph/                 # AMORPH System
│    │    │
│    │    ├─── init.js            # System initialization
│    │    ├─── amorph.config.js   # Central config
│    │    ├─── reactors.config.js # Reactor defaults
│    │    ├─── morphs.config.js   # Morph type definitions
│    │    │
│    │    ├─── arch/              # Core Architecture
│    │    │    ├─── AmorphSystem.js       # Main system class
│    │    │    ├─── RedisEventBridge.js   # Event bus
│    │    │    ├─── convex.ts             # Convex client
│    │    │    ├─── init.js               # Arch initialization
│    │    │    ├─── amorph.config.js      # Config
│    │    │    ├─── morphs.config.js      # Morph configs
│    │    │    ├─── reactors.config.js    # Reactor configs
│    │    │    ├─── styles/
│    │    │    │    └─── tokens.js        # Design tokens
│    │    │    └─── layouts/
│    │    │         └─── BaseLayout.astro # Base layout
│    │    │
│    │    ├─── observers/         # Stream Observers
│    │    │    ├─── BaseObserver.js
│    │    │    ├─── MorphObserver.js
│    │    │    ├─── ReactorObserver.js
│    │    │    ├─── HostObserver.js
│    │    │    ├─── GlobalObserver.js
│    │    │    ├─── ArchObserver.js
│    │    │    ├─── LayoutObserver.js
│    │    │    └─── PerformanceObserver.js
│    │    │
│    │    ├─── reactors/          # All Reactors
│    │    │    ├─── GlowReactor.js
│    │    │    ├─── SearchReactor.js
│    │    │    ├─── AnimationReactor.js
│    │    │    ├─── PerspectiveReactor.js
│    │    │    ├─── PerspectiveWeightReactor.js
│    │    │    ├─── HilbertSpaceSimilarity.js
│    │    │    ├─── DragController.js
│    │    │    ├─── ZoomPanController.js
│    │    │    └─── ... more reactors
│    │    │
│    │    ├─── morphs/            # All Morphs
│    │    │    ├─── data/
│    │    │    │    ├─── NameMorph.js
│    │    │    │    ├─── ImageMorph.js
│    │    │    │    ├─── TagMorph.js
│    │    │    │    ├─── TextMorph.js
│    │    │    │    ├─── BooleanMorph.js
│    │    │    │    ├─── NumberMorph.js
│    │    │    │    ├─── ListMorph.js
│    │    │    │    ├─── BubbleMorph.js
│    │    │    │    └─── ... more morphs
│    │    │    └─── global/
│    │    │         └─── MorphHeader.js
│    │    │
│    │    └─── hosts/             # Container Components
│    │         ├─── PerspectiveHost.js
│    │         ├─── BubbleHost.js
│    │         ├─── BubbleView.js
│    │         └─── GridHost.js
│    │
│    └─── pages/                  # Astro Pages
│         ├─── fungi/
│         │    ├─── index.astro   # List page
│         │    └─── [slug].astro  # Detail page
│         └─── demo.astro         # Demo page
│
├─── public/                      # Static assets
│    └─── images/
│
├─── package.json                 # Dependencies
├─── astro.config.mjs             # Astro config
├─── tsconfig.json                # TypeScript config
├─── vite.config.js               # Vite config
│
└─── ARCHITECTURE.md              # This file
```

### 10.2 Import Dependencies

```
┌────────────────────────────────────────────────────────────────┐
│                   IMPORT DEPENDENCY GRAPH                      │
└────────────────────────────────────────────────────────────────┘

Browser Entry Point
    │
    └─── /src/amorph/init.js
            │
            ├─── AmorphSystem.js
            │       │
            │       ├─── amorph.config.js
            │       ├─── RedisEventBridge.js
            │       └─── PerformanceObserver.js
            │
            ├─── All Reactors (Auto-Import)
            │       │
            │       ├─── GlowReactor.js
            │       ├─── SearchReactor.js
            │       ├─── AnimationReactor.js
            │       ├─── PerspectiveReactor.js
            │       ├─── PerspectiveWeightReactor.js
            │       │       │
            │       │       └─── HilbertSpaceSimilarity.js
            │       └─── ... more
            │
            ├─── All Morphs (Define Custom Elements)
            │       │
            │       ├─── NameMorph.js
            │       ├─── ImageMorph.js
            │       ├─── TagMorph.js
            │       └─── ... more
            │
            ├─── Global Components
            │       │
            │       └─── MorphHeader.js
            │
            └─── Hosts & Views
                    │
                    ├─── PerspectiveHost.js
                    ├─── BubbleHost.js
                    ├─── BubbleView.js
                    └─── GridHost.js

Result: window.amorph (Global Singleton)
```

---

## 🎓 Zusammenfassung

Das AMORPH FUNGINOMI System ist eine mehrschichtige Architektur mit:

1. **Backend-Layer:** Convex Database mit 12 Perspektiven
2. **SSR-Layer:** Astro Pages mit Server-Side Data Fetching
3. **Component-Layer:** Lit Web Components (Morphs, Hosts)
4. **System-Layer:** AmorphSystem (Registry, Lifecycle)
5. **Event-Layer:** Dual System (Redis Streams + Legacy Events)
6. **Observer-Layer:** 6 Stream Observers für State Management
7. **Reactor-Layer:** Plug & Play Effekte auf Morphs
8. **Visualization-Layer:** BubbleView mit Physics & Similarity

Alle Schichten arbeiten zusammen um ein flexibles, erweiterbares und performantes morphologisches UI-System zu schaffen.

---

**Stand:** 16. November 2025  
**Version:** 2.0.0 (Perspective Architecture)  
**Status:** ✅ Produktionsbereit
