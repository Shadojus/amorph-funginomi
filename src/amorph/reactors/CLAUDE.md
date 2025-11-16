# ⚡ AMORPH Reactors - System-weite Effekte

## Übersicht

Reactors sind **PLUG & PLAY** Module die Effekte auf Morphs anwenden:
- ✅ Automatische Registration beim Import
- ✅ Enable/Disable zur Laufzeit
- ✅ Konfigurierbar über `reactors.config.js`
- ✅ Wirken auf bestimmte Morph-Typen

## 🆕 New: PerspectiveReactor (2025-11-16)

**Smart perspective-driven morph filtering & highlighting!**

- 🔮 **Tag-to-Perspective Auto-Activation** - 80+ tag mappings
- 🎨 **Smart Highlighting** - Relevant morphs highlighted with perspective colors
- 🌫️ **Dim, don't hide** - Irrelevant morphs dimmed (opacity 0.3)
- ⚡ **Lightweight** - Pure CSS, no DOM manipulation

**Siehe:** [PERSPECTIVE_SYSTEM.md](./PERSPECTIVE_SYSTEM.md) für Details!

## Reactor-Architektur

Alle Reactors folgen demselben Pattern:

```javascript
export class ExampleReactor {
  constructor(amorphSystem, config = {}) {
    this.amorph = amorphSystem;
    this.config = { ...defaultConfig, ...config };
    this.morphTypes = ['*']; // Auf welche Morph-Typen wirkt dieser Reactor?
    this.name = 'example';
  }
  
  /**
   * Apply Reactor zu Morphs
   */
  apply(morphs) {
    morphs.forEach(morph => {
      // Effekt anwenden
    });
    this.log(`Applied to ${morphs.length} morphs`);
  }
  
  /**
   * Cleanup - Effekt entfernen
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      // Effekt entfernen
    });
    this.log(`Removed from ${morphs.length} morphs`);
  }
  
  log(...args) {
    console.log(`[${this.name}]`, ...args);
  }
}

// NO auto-registration - happens centrally in init.js or manually
```

## Core Reactors (MVP)

### GlowReactor.js

**Funktion:** Lässt Morphs glühen bei Tag-Match

**Config:**
```javascript
{
  color: '#00ff88',
  intensity: 1.0,
  duration: 2000,
  pulseSpeed: 1.0,
  tags: []
}
```

**Implementierung:**
```javascript
apply(morphs) {
  morphs.forEach(morph => {
    const tags = this.extractTags(morph);
    const hasMatch = this.config.tags.some(t => tags.includes(t));
    
    if (hasMatch) {
      morph.classList.add('reactor-glow');
      morph.style.setProperty('--glow-color', this.config.color);
      morph.style.setProperty('--glow-intensity', this.config.intensity);
    }
  });
}

cleanup(morphs) {
  morphs.forEach(morph => {
    morph.classList.remove('reactor-glow');
    morph.style.removeProperty('--glow-color');
    morph.style.removeProperty('--glow-intensity');
  });
}
```

**CSS:**
```css
.reactor-glow {
  box-shadow: 0 0 20px var(--glow-color);
  animation: glow-pulse 2s ease-in-out infinite;
}
```

---

### SearchReactor.js

**Funktion:** Filtert & sortiert Morphs mit weighted Scoring

**Config:**
```javascript
{
  query: '',
  fuzzy: true,
  caseSensitive: false,
  weights: {
    tag: 100,
    name: 50,
    description: 10
  },
  minScore: 10
}
```

**Implementierung:**
```javascript
apply(morphs) {
  if (!this.config.query) {
    // Alle anzeigen
    morphs.forEach(m => m.classList.remove('reactor-search-hidden'));
    return;
  }
  
  morphs.forEach(morph => {
    const score = this.calculateScore(morph);
    
    if (score >= this.config.minScore) {
      morph.classList.remove('reactor-search-hidden');
      morph.dataset.searchScore = score;
      morph.style.order = -score; // Sortierung
    } else {
      morph.classList.add('reactor-search-hidden');
    }
  });
}

calculateScore(morph) {
  let score = 0;
  const query = this.config.caseSensitive 
    ? this.config.query 
    : this.config.query.toLowerCase();
  
  // Tag Matching (höchste Priorität)
  const tags = this.extractTags(morph);
  tags.forEach(tag => {
    if (this.matches(tag, query)) {
      score += this.config.weights.tag;
    }
  });
  
  // Name Matching
  const name = morph.dataset.name || '';
  if (this.matches(name, query)) {
    score += this.config.weights.name;
  }
  
  // Description Matching
  const desc = morph.textContent || '';
  if (this.matches(desc, query)) {
    score += this.config.weights.description;
  }
  
  return score;
}

matches(text, query) {
  text = this.config.caseSensitive ? text : text.toLowerCase();
  
  if (this.config.fuzzy) {
    return text.includes(query);
  } else {
    return text === query;
  }
}
```

---

### AnimationReactor.js

**Funktion:** Eingangs-Animationen für Morphs

**Config:**
```javascript
{
  type: 'fade-in',  // 'fade-in' | 'slide-in' | 'scale-in'
  duration: 500,
  delay: 0,
  stagger: 50  // Verzögerung zwischen Morphs
}
```

**Implementierung:**
```javascript
apply(morphs) {
  morphs.forEach((morph, index) => {
    morph.classList.add('reactor-animation-initial');
    morph.classList.add(`reactor-animation-${this.config.type}`);
    morph.style.setProperty('--animation-duration', `${this.config.duration}ms`);
    morph.style.setProperty('--animation-delay', `${this.config.delay + index * this.config.stagger}ms`);
    
    // Trigger Animation
    setTimeout(() => {
      morph.classList.remove('reactor-animation-initial');
    }, 50);
  });
}
```

**CSS:**
```css
.reactor-animation-initial {
  opacity: 0;
  transform: translateY(20px);
}

.reactor-animation-fade-in {
  animation: fade-in var(--animation-duration) ease-out var(--animation-delay) forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Extended Reactors

### PulseReactor.js
Lässt Morphs pulsieren (scale animation)

### HoverReactor.js
Hover-Effekte (lift, glow, scale)

### SortReactor.js
Sortiert Morphs nach verschiedenen Kriterien

### FilterReactor.js
Komplexe Filterung mit Regeln (AND/OR)

---

## BubbleView Reactors

### FlowReactor.js
**Funktion:** Partikel-Flow auf Connection Lines

**Verantwortlich für:**
- Erstellt Partikel auf Connection-Morphs
- Animiert Partikel entlang der Linie
- Verwendet Pixie Renderer für Performance

### ColorShiftReactor.js
**Funktion:** Farb-Änderung basierend auf Perspektiven

**Verantwortlich für:**
- Ändert Bubble-Farben bei Perspektiv-Wechsel
- Smooth Transitions
- Verwendet CSS Custom Properties

### ConnectionRenderer.js
**Funktion:** Rendert Verbindungen zwischen Bubbles

### CollisionDetector.js
**Funktion:** Verhindert Überlappung von Bubbles

### DragController.js
**Funktion:** Drag & Drop für Bubbles

### ZoomPanController.js
**Funktion:** Zoom & Pan im BubbleView

---

## Redis Event Bus (RedisEventBus.js)

**Funktion:** Multi-User Synchronization über Redis

**Features:**
- ✅ Pub/Sub über Redis
- ✅ Event Broadcasting
- ✅ Conflict Resolution mit Vector Clocks
- ✅ Presence Tracking (wer ist online)
- ✅ localStorage Fallback für Browser

**Architektur:**
```javascript
export class RedisEventBus {
  constructor(config = {}) {
    this.config = {
      url: 'redis://localhost:6379',
      channel: 'amorph:events',
      ...config
    };
  }
  
  async connect() {
    // Connect zu Redis oder Fallback localStorage
  }
  
  async broadcast(event, data) {
    // Broadcast Event zu allen Clients
  }
  
  on(event, callback) {
    // Subscribe zu Event
  }
}
```

---

## Verwendung

### Reactor aktivieren
```javascript
amorph.enableReactor('glow', {
  color: '#ff0000',
  intensity: 2.0,
  tags: ['edible', 'medicinal']
});
```

### Reactor deaktivieren
```javascript
amorph.disableReactor('glow');
```

### Reactor togglen
```javascript
amorph.toggleReactor('search');
```

### Check ob Reactor aktiv
```javascript
if (amorph.isReactorActive('glow')) {
  console.log('Glow ist aktiv');
}
```

---

## Reactor Lifecycle

```
1. Import → Auto-Register bei AmorphSystem
2. Enable → apply() wird aufgerufen
3. Neue Morphs → apply() für neue Morphs
4. Disable → cleanup() entfernt Effekte
```

---

## Status: ✅ ALLE REACTORS IMPLEMENTIERT

Alle Core- und Extended-Reactors sind fertig und produktionsbereit.

**Event System (2025-11-15):**
- Reactors publishen jetzt `reactor:*` Events zu Redis Streams
- `reactor:enabled`, `reactor:disabled`, `reactor:triggered`, `reactor:completed`, `reactor:error`
- ReactorObserver tracked alle Reactor State & Executions
- Siehe: `STREAM_OBSERVER_SYSTEM.md`
