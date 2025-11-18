# 🎨 CANVAS REACTOR REFACTOR
## BubbleView → Reactor-Architecture Migration

**Status:** Phase 1 Complete ✅  
**Datum:** 2025-11-18

---

## 📋 ÜBERSICHT

### Problem
BubbleView hat ~2000 Zeilen Code mit **hardcoded** Features:
- Physics Engine (200 Zeilen)
- Drag Controller (65 Zeilen)  
- Collision Detection (60 Zeilen)
- Connection Rendering (80 Zeilen)
- Zoom/Pan Logic (30 Zeilen)
- UserNode Rendering (100+ Zeilen)

**Folgen:**
- Schwer wartbar
- Nicht wiederverwendbar
- Keine Konfigurierbarkeit
- Verstößt gegen AMORPH Reactor-Architektur

### Lösung
**Option B: Separate Canvas-Reactors**
- Eigene Reactor-Familie für Canvas (nicht DOM)
- Klare Trennung: DOM-Reactors vs Canvas-Reactors
- Plug & Play über AmorphSystem.enableReactor()

---

## 🎯 ARCHITEKTUR

### Base Class: `CanvasReactor`
```javascript
class CanvasReactor {
  apply(canvasHost) // Initialize on BubbleView
  update(deltaTime) // Frame-by-frame logic
  render(ctx)       // Canvas drawing
  cleanup()         // Remove effects
}
```

### Canvas-Reactors (Phase 1 ✅)

| Reactor | Verantwortung | Priority | Status |
|---------|---------------|----------|--------|
| **CanvasUserNodeReactor** | UserNode Rendering + Score-Verbindungen | 100 | ✅ Created |
| **CanvasPhysicsReactor** | Spring Forces, Collisions, Boundaries | 50 | ✅ Created |
| **CanvasConnectionReactor** | Connection Rendering (Similarity, Semantic, User-Intent) | 10 | ✅ Created |
| CanvasDragReactor | Mouse/Touch Drag & Drop | 70 | 🔲 Planned |
| CanvasNavigationReactor | Zoom/Pan Controls | 60 | 🔲 Planned |

---

## 🔄 MIGRATION PLAN

### Phase 1: Foundation ✅
- [x] `CanvasReactor` Base-Class erstellt
- [x] `CanvasUserNodeReactor` erstellt (Score-basierte Verbindungen)
- [x] `CanvasPhysicsReactor` erstellt (Physics extrahiert)
- [x] `CanvasConnectionReactor` erstellt (Rendering extrahiert)
- [x] Reactors in `init.js` registriert
- [x] `reactors.config.js` erweitert

### Phase 2: BubbleView Integration 🔄
**Aktueller Stand:** BubbleView hat alles hardcoded  
**Ziel:** BubbleView nutzt Reactors

#### Änderungen in BubbleView.js:

**1. Reactor Management hinzufügen:**
```javascript
constructor() {
  // ...existing code...
  
  // Canvas Reactors
  this.reactors = {
    userNode: null,
    physics: null,
    connection: null
  };
}

async connectedCallback() {
  super.connectedCallback();
  
  // Enable Canvas Reactors
  await this.enableCanvasReactors();
}

async enableCanvasReactors() {
  if (!window.amorph) return;
  
  // Enable with config
  this.reactors.physics = await window.amorph.enableReactor('canvasPhysics', {
    springStrength: 0.005,
    damping: 0.95
  });
  
  this.reactors.connection = await window.amorph.enableReactor('canvasConnection', {
    style: 'curved'
  });
  
  this.reactors.userNode = await window.amorph.enableReactor('canvasUserNode', {
    scoreThreshold: 0.3,
    maxConnections: 8
  });
  
  // Apply to this BubbleView instance
  Object.values(this.reactors).forEach(reactor => {
    if (reactor) reactor.apply(this);
  });
}
```

**2. Update-Loop anpassen:**
```javascript
// VORHER (hardcoded):
animate = () => {
  if (!this.isSimulating) return;
  this.updatePhysics(); // 200 Zeilen hardcoded
  this.renderCanvas();  // 300 Zeilen hardcoded
  this.animationFrame = requestAnimationFrame(this.animate);
};

// NACHHER (mit Reactors):
animate = () => {
  if (!this.isSimulating) return;
  
  const deltaTime = 16; // ~60fps
  
  // Update all reactors
  Object.values(this.reactors).forEach(reactor => {
    if (reactor?.isActive()) {
      reactor.update(deltaTime);
    }
  });
  
  // Render
  this.renderCanvas();
  
  this.animationFrame = requestAnimationFrame(this.animate);
};
```

**3. Render-Loop anpassen:**
```javascript
// VORHER (hardcoded):
renderCanvas() {
  // Clear
  this.ctx.clearRect(0, 0, width, height);
  
  // Draw connections (80 Zeilen)
  this.connections.forEach(conn => { /* ... */ });
  
  // Draw bubbles (100 Zeilen)
  this.bubbles.forEach(bubble => { /* ... */ });
  
  // Draw user node (100 Zeilen)
  this.renderUserNode();
}

// NACHHER (mit Reactors):
renderCanvas() {
  if (!this.ctx) return;
  
  const { width, height } = this.canvas;
  
  // Clear
  this.ctx.clearRect(0, 0, width, height);
  
  // Render reactors (in priority order)
  const sortedReactors = Object.values(this.reactors)
    .filter(r => r?.isActive())
    .sort((a, b) => a.config.priority - b.config.priority);
  
  sortedReactors.forEach(reactor => {
    reactor.render(this.ctx);
  });
  
  // Draw bubbles (core responsibility bleibt bei BubbleView)
  this.renderBubbles();
}
```

**4. Physics Logic entfernen:**
```javascript
// LÖSCHEN: updatePhysics() (200 Zeilen)
// → Jetzt in CanvasPhysicsReactor

// LÖSCHEN: UserNode rendering (100+ Zeilen)
// → Jetzt in CanvasUserNodeReactor

// LÖSCHEN: Connection rendering (80 Zeilen)
// → Jetzt in CanvasConnectionReactor
```

### Phase 3: Weitere Reactors 🔲
- [ ] `CanvasDragReactor` erstellen (Drag logic extrahieren)
- [ ] `CanvasNavigationReactor` erstellen (Zoom/Pan extrahieren)
- [ ] `CanvasHoverReactor` erstellen (Hover states)

### Phase 4: Cleanup & Testing 🔲
- [ ] Alte hardcoded Code aus BubbleView entfernen
- [ ] Tests für jeden Reactor
- [ ] Performance-Vergleich (vorher/nachher)
- [ ] Dokumentation updaten

---

## 📊 VORTEILE

### Vorher (Hardcoded)
```
BubbleView.js (1986 Zeilen)
├── Physics Logic (200 Zeilen)
├── Drag Logic (65 Zeilen)
├── Collision Detection (60 Zeilen)
├── Connection Rendering (80 Zeilen)
├── UserNode Rendering (100 Zeilen)
└── ...
```
❌ Monolithisch  
❌ Nicht wiederverwendbar  
❌ Schwer testbar  
❌ Keine Konfiguration

### Nachher (Reactors)
```
BubbleView.js (800 Zeilen)
├── Core Logic (Bubbles, Canvas setup)
└── Reactor Integration (50 Zeilen)

Reactors:
├── CanvasPhysicsReactor (220 Zeilen)
├── CanvasUserNodeReactor (350 Zeilen)
├── CanvasConnectionReactor (230 Zeilen)
├── CanvasDragReactor (150 Zeilen)
└── CanvasNavigationReactor (120 Zeilen)
```
✅ Modular  
✅ Wiederverwendbar  
✅ Testbar  
✅ Konfigurierbar via ReactorsConfig

---

## 🎨 USERNODE FOCUS

### Kompakte Visualisierung
**Ziel:** UserNode als zentraler Punkt mit Score-basierten Verbindungen

**CanvasUserNodeReactor Features:**
- ✅ Score-Threshold (nur Connections > 0.3)
- ✅ Max. 8 Connections (Top-Scores)
- ✅ Vector-Style: `curved` | `straight` | `dashed`
- ✅ Gradient-Rendering (User → Target)
- ✅ Score-Badges bei hohen Werten (>70%)
- ✅ Activity-Pulse bei vielen Interaktionen
- ✅ Stats-Overlay (optional)

**Config:**
```javascript
{
  scoreThreshold: 0.3,  // Min. 30% Relevanz
  maxConnections: 8,    // Top 8 Connections
  vectorStyle: 'curved', // Gebogene Linien
  showStats: true,      // Info anzeigen
  pulseAnimation: true  // Activity-Ring
}
```

---

## 🚀 NÄCHSTE SCHRITTE

### Immediate (Phase 2)
1. BubbleView.js öffnen
2. Reactor-Management hinzufügen (`enableCanvasReactors()`)
3. `animate()` Loop anpassen (Reactor updates)
4. `renderCanvas()` anpassen (Reactor renders)
5. Hardcoded Physics/UserNode/Connection code entfernen

### Testing
```javascript
// Dev Tools Console:
window.amorph.getSystemInfo()
// → Sollte canvasPhysics, canvasUserNode, canvasConnection zeigen

bubbleView.reactors.userNode.getStats()
// → Performance-Statistiken
```

---

## 📝 NOTES

- Canvas-Reactors sind **nicht DOM-kompatibel** (by design)
- DOM-Reactors bleiben unverändert (GlowReactor, SearchReactor, etc.)
- BubbleView bleibt Canvas-Host, Reactors sind Plugins
- Priority-System: Lower = render first (background), Higher = render last (foreground)

**Priority Order:**
1. CanvasConnectionReactor (10) - Connections im Hintergrund
2. CanvasPhysicsReactor (50) - Physics updates
3. CanvasUserNodeReactor (100) - UserNode im Vordergrund

---

**Last Updated:** 2025-11-18  
**Next Review:** Nach Phase 2 Completion
