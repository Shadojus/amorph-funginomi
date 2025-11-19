# 👁️ Shared Observers - Stream-based State Management

## Übersicht

**Redis Stream Observer Pattern** für Event Processing:
- ✅ BaseObserver - Abstract Base Class
- ✅ MorphObserver - Verwaltet morph:* Events
- ✅ ReactorObserver - Verwaltet reactor:* Events
- ✅ HostObserver - Verwaltet host:* Events
- ✅ GlobalObserver - Verwaltet global:* Events
- ✅ ArchObserver - Verwaltet arch:* Events
- ✅ LayoutObserver - Verwaltet layout:* Events
- ✅ PerformanceObserver - Legacy Performance Monitoring

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
