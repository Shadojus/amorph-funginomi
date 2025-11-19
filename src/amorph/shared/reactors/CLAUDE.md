# ⚡ Shared Reactors - Universal Effects

## Übersicht

Diese Reactors funktionieren mit **ALLEN Views** (Grid, Bubble, Perspective):
- ✅ Automatische Registration beim Import
- ✅ Enable/Disable zur Laufzeit
- ✅ Konfigurierbar
- ✅ Wirken auf alle Morph-Typen

---

## Reactor Pattern

```javascript
export class ExampleReactor {
  constructor(config = {}) {
    this.config = { ...defaults, ...config };
  }
  
  apply(morphs) {
    // Effekt anwenden
  }
  
  cleanup(morphs) {
    // Effekt entfernen
  }
}
```

---

## GlowReactor.js

**Funktion:** Lässt Morphs glühen

**Config:**
```javascript
{
  color: '#00ff88',
  intensity: 1.0,
  duration: 2000,
  pulseSpeed: 1.0
}
```

## 🔗 Related Components

**Uses:**
- `../../core/AmorphSystem.js` - Reactor registration & management

**Used by:**
- `../../features/bubble-view/` - BubbleView uses all universal reactors
- `../../features/grid-view/` - GridView uses all universal reactors
- `../../features/perspective-system/` - PerspectiveHost uses reactors

**See also:**
- `../observers/` - Event-driven state management
- `../morphs/data/` - Reactors apply effects to these morphs

---

**Usage:**
```javascript
amorph.enableReactor('glow', { 
  color: '#ff0000', 
  intensity: 2.0 
});
```

---

## AnimationReactor.js

**Funktion:** Eingangs-Animationen

**Modes:**
- `fade-in` - Fade in from 0 opacity
- `slide-in` - Slide in from below
- `scale-in` - Scale up from 0

**Config:**
```javascript
{
  type: 'fade-in',
  duration: 500,
  delay: 0,
  stagger: 50
}
```

---

## PulseReactor.js

**Funktion:** Pulsing scale animation

**Config:**
```javascript
{
  scale: 1.05,
  duration: 1000,
  easing: 'ease-in-out'
}
```

---

## HoverReactor.js

**Funktion:** Hover effects

**Modes:**
- `lift` - Lift up on hover
- `glow` - Add glow on hover
- `scale` - Scale up on hover

**Config:**
```javascript
{
  mode: 'lift',
  intensity: 1.0,
  duration: 300
}
```

---

## SortReactor.js

**Funktion:** Sort morphs

**Modes:**
- `alphabetical` - A-Z oder Z-A
- `relevance` - Nach Search Score
- `date` - Nach Datum
- `custom` - Custom Comparator

**Config:**
```javascript
{
  mode: 'alphabetical',
  order: 'asc', // 'asc' | 'desc'
  animate: true,
  duration: 400
}
```

**Usage:**
```javascript
amorph.enableReactor('sort', {
  mode: 'alphabetical',
  order: 'asc'
});
```

---

## FilterReactor.js

**Funktion:** Filter morphs

**Modes:**
- Tag-based filtering
- Perspective-based filtering
- Custom filter function

**Config:**
```javascript
{
  tags: [],
  perspectives: [],
  customFilter: null,
  logic: 'OR', // 'AND' | 'OR'
  animate: true
}
```

**Usage:**
```javascript
amorph.enableReactor('filter', {
  tags: ['edible', 'medicinal'],
  logic: 'AND'
});
```

---

## Status

✅ Alle Shared Reactors implementiert und production-ready
✅ Funktionieren mit Grid, Bubble und Perspective Views
✅ Event-driven über AmorphSystem

**Location:** `/src/amorph/shared/reactors/`
