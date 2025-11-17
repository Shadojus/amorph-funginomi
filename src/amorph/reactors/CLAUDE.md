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

---

## 🆕 HilbertSpaceSimilarity.js (NEW 2025-11-16)

### Funktion

**Similarity calculation service** for Hilbert space visualization:
- ✅ Jaccard similarity for arrays (30% threshold)
- ✅ Recursive object comparison
- ✅ Weighted similarity based on perspective importance
- ✅ FIFO weighted perspectives (oldest = 0.25, newest = 1.0)
- ✅ Full similarity matrix generation

### Methods

```javascript
// Calculate similarity between two fungi
HilbertSpaceSimilarity.calculate(fungus1, fungus2, activePerspectives)
// Returns 0-1 (0 = completely different, 1 = identical)

// Calculate weighted similarity with perspective weights
HilbertSpaceSimilarity.calculateWeighted(fungus1, fungus2, perspectiveWeights)

// Get FIFO-based weights for perspectives
HilbertSpaceSimilarity.getPerspectiveWeights(activePerspectives)
// Returns Map<perspective, weight>
// Newest perspective = 1.0, oldest = 0.25

// Generate full similarity matrix
HilbertSpaceSimilarity.calculateMatrix(fungi, activePerspectives)
// Returns Map<slug, Map<otherSlug, similarity>>
```

### Implementation Details

```javascript
// Jaccard similarity for arrays
static compareArrays(arr1, arr2) {
  const set1 = new Set(arr1.map(v => JSON.stringify(v)));
  const set2 = new Set(arr2.map(v => JSON.stringify(v)));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  const jaccardSimilarity = intersection.size / union.size;
  return jaccardSimilarity > 0.3; // 30% threshold
}

// FIFO perspective weights
static getPerspectiveWeights(activePerspectives) {
  const weights = new Map();
  const count = activePerspectives.length;
  
  activePerspectives.forEach((perspective, index) => {
    // Linear weight: oldest = 0.25, newest = 1.0
    const weight = 0.25 + (index / Math.max(1, count - 1)) * 0.75;
    weights.set(perspective, weight);
  });
  
  return weights;
}
```

---

## 🆕 PerspectiveWeightReactor.js (NEW 2025-11-16)

### Funktion

**Controls bubble size and opacity** based on Hilbert space similarity:
- ✅ Dynamic sizing: 60-150px based on average similarity
- ✅ Opacity control: 0.3-1.0 for relevance indication
- ✅ Live updates on perspective changes
- ✅ Smooth transitions (600ms)
- ✅ Handles both bubble-morphs and regular morphs

### Config

```javascript
{
  minSize: 60,
  maxSize: 150,
  minOpacity: 0.3,
  maxOpacity: 1.0,
  transitionDuration: 600
}
```

### Implementation

```javascript
export class PerspectiveWeightReactor {
  constructor(config = {}) {
    this.config = {
      minSize: 60,
      maxSize: 150,
      minOpacity: 0.3,
      maxOpacity: 1.0,
      transitionDuration: 600,
      ...config
    };
    
    this.activePerspectives = [];
    this.fungi = [];
    this.similarityMatrix = new Map();
  }
  
  apply(morphs = []) {
    // Separate bubble-morphs from regular morphs
    const bubbleMorphs = morphs.filter(m => 
      m.tagName?.toLowerCase() === 'bubble-morph'
    );
    const regularMorphs = morphs.filter(m => 
      m.tagName?.toLowerCase() !== 'bubble-morph'
    );
    
    // Handle bubble morphs
    if (bubbleMorphs.length > 0) {
      this.applyToBubbles(bubbleMorphs);
    }
    
    // Handle regular morphs
    if (regularMorphs.length > 0) {
      const fungiGroups = this.groupMorphsByFungus(regularMorphs);
      
      // Calculate similarity matrix
      this.similarityMatrix = HilbertSpaceSimilarity.calculateMatrix(
        this.fungi,
        this.activePerspectives
      );
      
      // Apply weights
      fungiGroups.forEach(({ slug, morphs, fungusData }) => {
        const avgSimilarity = this.getAverageSimilarity(slug);
        this.applyWeightToGroup(morphs, avgSimilarity, fungusData);
      });
    }
  }
  
  applyToBubbles(bubbleMorphs) {
    bubbleMorphs.forEach(bubbleMorph => {
      const slug = bubbleMorph.getAttribute('slug');
      if (!slug) return;
      
      const avgSimilarity = this.getAverageSimilarity(slug);
      
      // Dispatch event to BubbleView
      bubbleMorph.dispatchEvent(new CustomEvent('bubble-weight-update', {
        bubbles: true,
        composed: true,
        detail: { slug, similarity: avgSimilarity }
      }));
    });
  }
  
  getAverageSimilarity(slug) {
    const similarities = this.similarityMatrix.get(slug);
    if (!similarities) return 0.5;
    
    let total = 0;
    let count = 0;
    
    similarities.forEach((sim, otherSlug) => {
      if (otherSlug !== slug) {
        total += sim;
        count++;
      }
    });
    
    return count > 0 ? total / count : 0.5;
  }
}
```

### Event System

```javascript
// BubbleMorph listens for weight updates
bubbleEl.addEventListener('bubble-weight-update', (e) => {
  const { slug, similarity } = e.detail;
  
  // Update bubble properties
  const bubble = this.bubbles.get(slug);
  if (bubble) {
    bubble.similarity = similarity;
    
    // Calculate size and opacity
    const size = this.config.minSize + 
      (similarity * (this.config.maxSize - this.config.minSize));
    const opacity = this.config.minOpacity + 
      (similarity * (this.config.maxOpacity - this.config.minOpacity));
    
    bubble.size = size;
    bubble.opacity = opacity;
  }
});
```

---

## Status: ✅ ALLE REACTORS IMPLEMENTIERT

Alle Core- und Extended-Reactors sind fertig und produktionsbereit.

**Latest Updates (2025-11-16):**
- ✅ **HilbertSpaceSimilarity.js** - Similarity calculation service
- ✅ **PerspectiveWeightReactor.js** - Dynamic bubble sizing/opacity
- ✅ FIFO weighted perspectives (newest = 1.0, oldest = 0.25)
- ✅ Jaccard similarity with 30% threshold
- ✅ Full similarity matrix generation
- ✅ Event-based communication with BubbleView

**Event System (2025-11-15):**
- Reactors publishen jetzt `reactor:*` Events zu Redis Streams
- `reactor:enabled`, `reactor:disabled`, `reactor:triggered`, `reactor:completed`, `reactor:error`
- ReactorObserver tracked alle Reactor State & Executions
- Siehe: `STREAM_OBSERVER_SYSTEM.md`
