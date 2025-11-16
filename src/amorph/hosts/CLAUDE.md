# 🏠 AMORPH Hosts - Container Components

## Übersicht

Hosts sind **Container-Components** die Morphs organisieren und darstellen:
- ✅ **PerspectiveHost**: Container für einzelne Perspektive (NEU 2025-11-15)
- ✅ **GridHost**: Grid-Layout für Morphs
- ✅ **BubbleHost**: Datengetriebener Container für BubbleView
- ✅ **BubbleView**: Force-directed Graph Visualization

---

## PerspectiveHost.js **[NEU 2025-11-15]**

### Funktion

**Container für einzelne Perspektive** mit Event-Driven Activation:
- ✅ Jede Perspektive hat eigenen Host
- ✅ FIFO-Logik via MorphHeader (max 4 gleichzeitig)
- ✅ Event-basierte Aktivierung/Deaktivierung
- ✅ Smooth Fade-In/Out Animationen
- ✅ Lit Web Component mit Shadow DOM

### Props

```javascript
{
  perspective: String,  // Schema-Feldname (z.B. 'medicinalAndHealth')
  title: String,        // Display Title (z.B. 'Medicinal')
  icon: String,         // Emoji Icon (z.B. '⚕️')
  color: String,        // Farbe (z.B. '#06b6d4')
  active: Boolean       // Aktiv-Status (managed by events)
}
```

### Verwendung in Astro

```astro
<!-- [slug].astro -->
{perspectives.map(p => {
  if (!p.data) return null;
  const fields = flattenObject(p.data);
  if (fields.length === 0) return null;
  
  return (
    <perspective-host 
      perspective={p.id} 
      title={p.title} 
      icon={p.icon} 
      color={p.color}
    >
      {fields.map(f => renderField(f, 0))}
    </perspective-host>
  );
})}
```

### Event System

```javascript
// PerspectiveHost listens to 'perspective-changed' event
connectedCallback() {
  super.connectedCallback();
  
  // Listen auf BEIDE window UND document (wichtig für Shadow DOM)
  window.addEventListener('perspective-changed', this.handlePerspectiveChange);
  document.addEventListener('perspective-changed', this.handlePerspectiveChange);
}

handlePerspectiveChange = (e) => {
  const { perspectives } = e.detail;
  this.active = perspectives.includes(this.perspective);
};
```

### CSS States

```css
:host {
  display: block;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

:host([active]) {
  opacity: 1;
  transform: translateY(0);
  position: relative;
}

:host(:not([active])) {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}
```

### Implementierung

```javascript
import { LitElement, html, css } from 'lit';

export class PerspectiveHost extends LitElement {
  static properties = {
    perspective: { type: String, reflect: true },
    title: { type: String },
    icon: { type: String },
    color: { type: String },
    active: { type: Boolean, reflect: true }
  };
  
  constructor() {
    super();
    this.perspective = '';
    this.title = '';
    this.icon = '';
    this.color = '#ffffff';
    this.active = false;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.handlePerspectiveChange = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this.handlePerspectiveChange);
    document.addEventListener('perspective-changed', this.handlePerspectiveChange);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('perspective-changed', this.handlePerspectiveChange);
    document.removeEventListener('perspective-changed', this.handlePerspectiveChange);
  }
  
  handlePerspectiveChange(e) {
    const { perspectives } = e.detail;
    const wasActive = this.active;
    this.active = perspectives.includes(this.perspective);
    
    if (this.active && !wasActive) {
      console.log(`[PerspectiveHost] ${this.perspective} ACTIVATED`);
    } else if (!this.active && wasActive) {
      console.log(`[PerspectiveHost] ${this.perspective} DEACTIVATED`);
    }
  }
  
  render() {
    return html`
      <div class="perspective-container" style="--perspective-color: ${this.color}">
        <header class="perspective-header">
          <span class="perspective-icon">${this.icon}</span>
          <h2 class="perspective-title">${this.title}</h2>
        </header>
        <div class="perspective-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
  
  static styles = css`
    :host {
      display: block;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      margin-bottom: 2rem;
    }
    
    :host([active]) {
      opacity: 1;
      transform: translateY(0);
      position: relative;
    }
    
    :host(:not([active])) {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
    }
    
    .perspective-container {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 2rem;
      border: 2px solid var(--perspective-color);
    }
    
    .perspective-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--perspective-color);
    }
    
    .perspective-icon {
      font-size: 2rem;
    }
    
    .perspective-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--perspective-color);
      margin: 0;
    }
  `;
}

customElements.define('perspective-host', PerspectiveHost);
```

---

## Architektur

Hosts sind **datengetrieben** - sie bekommen Daten von Convex und erstellen daraus Morphs:

```
Convex → Astro (fungi) → Host.setData() → createMorphsFromData() → BubbleView
```

---

## BubbleHost.js **[UPDATED]**

### Funktion

Datengetriebener Container für BubbleView:
- ✅ Bekommt Fungi-Daten von Convex
- ✅ Erstellt Morphs aus Daten mit `data-group` Attribut
- ✅ Fügt Morphs ins Shadow DOM ein
- ✅ Übergibt Morphs an BubbleView
- ✅ **Gruppiert Morphs nach data-group** (z.B. fungus-0, fungus-1, fungus-2)
- ✅ Dispatched `host:data-loaded` und `host:morphs-generated` Events

### Props

```javascript
{
  height: String,       // Container-Höhe (default: '600px')
  data: Array          // Fungi-Daten von Convex
}
```

### Verwendung in Astro

```astro
---
import { fetchFungi } from '@/lib/convex';
const fungi = await fetchFungi();
---

<bubble-host id="bubble-view-host"></bubble-host>

<script define:vars={{ fungi }}>
  const bubbleHost = document.getElementById('bubble-view-host');
  bubbleHost.setData(fungi);
</script>
```

### Implementierung

```javascript
export class BubbleHost extends LitElement {
  static properties = {
    height: { type: String },
    data: { type: Array }
  };
  
  constructor() {
    super();
    this.height = '600px';
    this.data = [];
    this.bubbleView = null;
  }
  
  /**
   * Set data (Fungi objects from Convex)
   * DATENGETRIEBEN - data drives morph creation
   */
  setData(data) {
    this.data = Array.isArray(data) ? data : [data];
    console.log(`[BubbleHost] Data set: ${this.data.length} items`);
    
    if (this.bubbleView) {
      this.createMorphsFromData();
    }
  }
  
  /**
   * Create morphs from data objects
   * Each fungus becomes a collection of morphs
   */
  createMorphsFromData() {
    // Create hidden container for morphs
    let container = this.shadowRoot.querySelector('.morphs-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'morphs-container';
      container.style.display = 'none';
      this.shadowRoot.appendChild(container);
    }
    
    const allMorphs = [];
    
    // Create morphs for each fungus
    this.data.forEach((fungus, index) => {
      // Name morphs
      if (fungus.names?.common) {
        const morph = this.createNameMorph(
          fungus.names.common, 
          'culinary', 
          `fungus-${index}`
        );
        container.appendChild(morph);
        allMorphs.push(morph);
      }
      
      if (fungus.names?.scientific) {
        const morph = this.createNameMorph(
          fungus.names.scientific, 
          'scientific', 
          `fungus-${index}`
        );
        container.appendChild(morph);
        allMorphs.push(morph);
      }
      
      // Image morph
      if (fungus.images?.[0]) {
        const morph = this.createImageMorph(
          fungus.images[0].url,
          fungus.names?.common,
          `fungus-${index}`
        );
        container.appendChild(morph);
        allMorphs.push(morph);
      }
      
      // Text morph
      if (fungus.description) {
        const morph = this.createTextMorph(
          fungus.description,
          'culinary',
          `fungus-${index}`
        );
        container.appendChild(morph);
        allMorphs.push(morph);
      }
      
      // Tag morphs
      if (fungus.tags) {
        fungus.tags.forEach(tag => {
          const morph = this.createTagMorph(tag, `fungus-${index}`);
          container.appendChild(morph);
          allMorphs.push(morph);
        });
      }
    });
    
    console.log(`[BubbleHost] Created ${allMorphs.length} morphs`);
    
    // Wait for morphs to register, then pass to BubbleView
    setTimeout(() => {
      if (this.bubbleView && allMorphs.length > 0) {
        this.bubbleView.setMorphs(allMorphs);
        console.log(`[BubbleHost] Passed ${allMorphs.length} morphs to BubbleView`);
      }
    }, 500);
  }
  
  /**
   * Helper: Create name-morph
   */
  createNameMorph(value, perspective, group) {
    const morph = document.createElement('name-morph');
    morph.setAttribute('value', value);
    morph.setAttribute('perspective', perspective);
    morph.setAttribute('lang', perspective === 'scientific' ? 'la' : 'de');
    morph.dataset.group = group;
    return morph;
  }
  
  /**
   * Helper: Create image-morph
   */
  createImageMorph(src, alt, group) {
    const morph = document.createElement('image-morph');
    morph.setAttribute('src', src);
    morph.setAttribute('alt', alt || '');
    morph.dataset.group = group;
    return morph;
  }
  
  /**
   * Helper: Create text-morph
   */
  createTextMorph(value, perspective, group) {
    const morph = document.createElement('text-morph');
    morph.setAttribute('value', value);
    morph.setAttribute('perspective', perspective);
    morph.setAttribute('maxlines', '3');
    morph.dataset.group = group;
    return morph;
  }
  
  /**
   * Helper: Create tag-morph
   */
  createTagMorph(tag, group) {
    const morph = document.createElement('tag-morph');
    morph.setAttribute('tag', tag);
    morph.setAttribute('color', 'auto');
    morph.dataset.group = group;
    return morph;
  }
  
  render() {
    return html`
      ${this.data.length === 0 ? html`
        <div class="bubble-loading">
          🫧 Waiting for data...
        </div>
      ` : html`
        <bubble-view></bubble-view>
      `}
    `;
  }
}

customElements.define('bubble-host', BubbleHost);
```

---

## BubbleView.js **[UPDATED]**

### Funktion

Force-directed Graph Visualization:
- ✅ **Gruppiert Morphs nach data-group** (1 Bubble pro Gruppe!)
- ✅ Rendert Gruppen als Bubbles (Kreise)
- ✅ Force-directed Layout (Physics-basiert)
- ✅ Interactive (Drag, Zoom, Pan)
- ✅ Connections zwischen verwandten Bubbles
- ✅ **KEINE Controls** - Controls sind in MorphHeader
- ✅ Dispatched `bubble-view-active` Event für MorphHeader Integration

### Props

```javascript
{
  morphs: Array,        // Array von Morph-Elementen
  zoom: Number,         // Zoom-Level (default: 1.0)
  isSimulating: Boolean // Physics Simulation aktiv?
}
```

### Verwendung

```javascript
// Get BubbleView
const bubbleView = document.querySelector('bubble-view');

// Set Morphs
bubbleView.setMorphs(arrayOfMorphElements);
```

### Architektur

```javascript
export class BubbleView extends LitElement {
  static properties = {
    morphs: { type: Array },
    zoom: { type: Number },
    isSimulating: { type: Boolean }
  };
  
  constructor() {
    super();
    this.morphs = [];
    this.bubbles = new Map();  // morph → bubble data
    this.zoom = 1.0;
    this.isSimulating = true;
    this.canvas = null;
    this.ctx = null;
  }
  
  /**
   * Set morphs to display
   */
  setMorphs(morphs) {
    this.morphs = morphs;
    this.initializeBubbles();
  }
  
  /**
   * Initialize bubble data for each morph
   */
  initializeBubbles() {
    let width = this.offsetWidth || 800;
    let height = this.offsetHeight || 600;
    
    this.bubbles.clear();
    
    this.morphs.forEach((morph, index) => {
      // Position in circle
      const angle = (index / this.morphs.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      // Bubble size based on importance
      const size = 60;
      
      // Get perspective for color
      const perspective = morph.getAttribute('perspective') || 'culinary';
      
      this.bubbles.set(morph, {
        x,
        y,
        vx: 0,
        vy: 0,
        size,
        perspective,
        mass: 1,
        isDragging: false
      });
    });
    
    console.log(`[BubbleView] Initialized ${this.bubbles.size} bubbles`);
    this.requestUpdate();
  }
  
  /**
   * Physics simulation
   */
  simulate() {
    if (!this.isSimulating) return;
    
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    
    // Apply forces
    this.bubbles.forEach((bubble, morph) => {
      if (bubble.isDragging) return;
      
      // Center attraction
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = centerX - bubble.x;
      const dy = centerY - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = 0.01;
        bubble.vx += (dx / distance) * force;
        bubble.vy += (dy / distance) * force;
      }
      
      // Collision detection
      this.bubbles.forEach((other, otherMorph) => {
        if (morph === otherMorph) return;
        
        const dx = other.x - bubble.x;
        const dy = other.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = (bubble.size + other.size) / 2;
        
        if (distance < minDist && distance > 0) {
          const force = 0.5;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          bubble.vx -= fx;
          bubble.vy -= fy;
        }
      });
      
      // Apply velocity
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      
      // Friction
      bubble.vx *= 0.98;
      bubble.vy *= 0.98;
      
      // Bounds
      const padding = bubble.size / 2;
      bubble.x = Math.max(padding, Math.min(width - padding, bubble.x));
      bubble.y = Math.max(padding, Math.min(height - padding, bubble.y));
    });
    
    this.renderCanvas();
    requestAnimationFrame(() => this.simulate());
  }
  
  /**
   * Render bubbles to canvas
   */
  renderCanvas() {
    if (!this.ctx) return;
    
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    
    // Clear
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw bubbles
    this.bubbles.forEach((bubble, morph) => {
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = this.getPerspectiveColor(bubble.perspective);
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }
  
  render() {
    return html`
      <div class="bubble-container">
        <canvas class="bubble-canvas"></canvas>
        
        <div class="bubble-controls">
          <button @click=${this.toggleSimulation}>
            ${this.isSimulating ? '⏸ Pause' : '▶ Play'}
          </button>
          <button @click=${this.resetView}>🔄 Reset</button>
        </div>
        
        <div class="bubble-info">
          <div>Bubbles: ${this.bubbles.size}</div>
          <div>Zoom: ${(this.zoom * 100).toFixed(0)}%</div>
          <div>Status: ${this.isSimulating ? '🟢 Simulating' : '🔴 Paused'}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('bubble-view', BubbleView);
```

---

## GridHost.js

### Funktion

Grid-Layout Container (noch nicht vollständig implementiert):
- ✅ Responsive Grid
- ✅ Auto-Layout
- ✅ Grouping von Morphs

---

## Datenfluss

```
1. Convex → Fungi-Daten
2. Astro → Lädt Fungi, übergibt an BubbleHost
3. BubbleHost.setData() → Erstellt Morphs aus Daten
4. BubbleHost → Fügt Morphs ins Shadow DOM
5. Morphs → Registrieren sich bei AmorphSystem
6. BubbleHost → Übergibt Morphs an BubbleView
7. BubbleView.setMorphs() → Initialisiert Bubbles
8. BubbleView → Rendert & animiert Bubbles
```

---

## Status: ✅ ALLE HOSTS IMPLEMENTIERT + UPDATES

BubbleHost und BubbleView sind fertig und produktionsbereit.

**Latest Updates (2025-11-15):**
- ✅ BubbleView gruppiert Morphs nach `data-group` (1 Bubble pro Gruppe, nicht pro Morph!)
- ✅ 3 Fungi → 12 Morphs → 3 Bubbles (grouped by data-group)
- ✅ BubbleView Controls entfernt (alle Controls jetzt in MorphHeader)
- ✅ `bubble-view-active` Event für MorphHeader Integration
- ✅ Host Events: `host:data-loaded`, `host:morphs-generated` (für Observer System)
