# 👁️ Shared Observers - Stream-based State Management

**Last Updated:** 21. November 2025

## Übersicht

**Redis Stream Observer Pattern** für Event Processing:
- ✅ **BaseObserver.js** - Abstract Base Class
- ✅ **MorphObserver.js** - Verwaltet morph:* Events
- ✅ **ReactorObserver.js** - Verwaltet reactor:* Events
- ✅ **HostObserver.js** - Verwaltet host:* Events
- ✅ **GlobalObserver.js** - Verwaltet global:* Events
- ✅ **ArchObserver.js** - Verwaltet arch:* Events
- ✅ **LayoutObserver.js** - Verwaltet layout:* Events
- ✅ **PerformanceObserver.js** - Legacy Performance Monitoring

## Structure

```
shared/observers/
├── BaseObserver.js           # Abstract base with Redis Stream integration
├── ArchObserver.js           # arch:* events (architecture changes)
├── GlobalObserver.js         # global:* events (system-wide)
├── HostObserver.js           # host:* events (view containers)
├── LayoutObserver.js         # layout:* events (layout changes)
├── MorphObserver.js          # morph:* events (component lifecycle)
├── PerformanceObserver.js    # Legacy performance monitoring
├── ReactorObserver.js        # reactor:* events (effect lifecycle)
└── CLAUDE.md                 # This file
```

---

## Architektur

```
User Interaction
    ↓
amorph.streamPublish('event:name', data)
    ↓
Redis Stream (XADD)
    ↓
Consumer Groups (6 Observers)
    ├── MorphObserver    → morph:*
    ├── ReactorObserver  → reactor:*
    ├── HostObserver     → host:*
    ├── GlobalObserver   → global:*
    ├── ArchObserver     → arch:*
    └── LayoutObserver   → layout:*
    ↓
State Management
    ↓
UI Updates
```

---

## 🔗 Related Components

**Uses:**
- `../../core/RedisEventBridge.js` - Redis Streams & Consumer Groups

**Used by:**
- `../../core/AmorphSystem.js` - Initializes all observers
- `../../core/init.js` - Observer setup during system boot

**See also:**
- `../reactors/` - Reactors publish events that observers consume
- `../../features/search-system/` - SearchReactor publishes search:* events
- `../morphs/global/MorphHeader.js` - Publishes perspective:* events

---

## BaseObserver.js

**Abstract Base Class** für alle Observers:
- ✅ Auto Consumer Group Creation
- ✅ Non-blocking Poll Loop (100ms)
- ✅ Event Filtering by Prefix
- ✅ State Management (Map)
- ✅ Auto ACK nach Processing

---

## MorphObserver.js

**Verwaltet morph:* Events:**
- `morph:created`
- `morph:mounted`
- `morph:updated`
- `morph:destroyed`
- `morph:connected`

**API:**
```javascript
amorph.observers.morph.getMorph(id)
amorph.observers.morph.getAllMorphs()
amorph.observers.morph.getStats()
```

---

## ReactorObserver.js

**Verwaltet reactor:* Events:**
- `reactor:registered`
- `reactor:triggered`
- `reactor:completed`
- `reactor:error`

---

## PerformanceObserver.js

**Performance Monitoring:**
- FPS Monitoring
- Memory Usage
- Morph Count
- Render Time
- Warning System

**Thresholds:**
- ✅ **>45 FPS**: Excellent
- ⚠️ **30-45 FPS**: Medium
- 🚨 **<30 FPS**: Critical

---

## Usage

```javascript
// Observer State abfragen
const morphs = amorph.observers.morph.getAllMorphs()
const stats = amorph.observers.morph.getStats()

// Check if running
console.log(amorph.observers.morph.running)
```

---

## Status

✅ Alle 6 Stream Observers + BaseObserver implementiert
✅ PerformanceObserver für Legacy Monitoring
✅ Production-ready

**Location:** `/src/amorph/shared/observers/`
