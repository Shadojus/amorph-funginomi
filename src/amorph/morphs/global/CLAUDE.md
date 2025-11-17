# 🌍 AMORPH Global Components

## Übersicht

Globale Components für die gesamte App:
- ✅ **MorphHeader**: Globaler Header mit 12 Perspektiven-Buttons

---

## MorphHeader.js ✨ **[UPDATED 2025-11-17]**

### Funktion

**Globaler Header für das gesamte System** - **Vereinfacht auf zwei Kernfunktionen:**
- ✅ **Search Bar** (zentriert, glassmorphism)
- ✅ **12 Perspektiven-Buttons** (FIFO max 4)
- ✅ **Shrinkable/Expandable Buttons** (inactive/active states)
- ✅ **Auto-Perspective Switching** (basierend auf Search Results) ⭐ NEW
- ✅ **Debounced Auto-Switching** (400ms delay) ⭐ NEW
- ✅ Event Dispatching (window + document für Shadow DOM)

**Entfernt:** ❌ Reactor Toggles, ❌ View Mode Switcher, ❌ BubbleView Controls

**Latest Features (2025-11-17):**
- ✅ Auto-activates perspectives when search finds matches in specific fields
- ✅ 400ms debounce prevents perspective switching while user is typing
- ✅ Only switches when user pauses typing
- ✅ Prevents duplicate activations (checks if perspective already active)
- ✅ FIFO queue management (removes oldest when adding 5th perspective)

### Layout-Struktur

```
┌─────────────────────────────────────────────────────┐
│ Top Row                                             │
│           [🔍 Search Bar - Centered]                │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Bottom Row                                          │
│ [🧬] [👁️] [🌍] [🍳] [⚕️] [🌱] [⚠️] [🧪]           │
│ [📜] [💰] [🌿] [🔬]                               │
│ Taxonomy Physical Ecology Culinary Medicinal ...    │
└─────────────────────────────────────────────────────┘
```

### 12 Perspektiven (EXAKTE Schema-Feldnamen!)

```javascript
this.perspectives = [
  { name: 'taxonomy', label: 'Taxonomy', icon: '🧬', color: '#ef4444' },
  { name: 'physicalCharacteristics', label: 'Physical', icon: '👁️', color: '#f97316' },
  { name: 'ecologyAndHabitat', label: 'Ecology', icon: '🌍', color: '#eab308' },
  { name: 'culinaryAndNutritional', label: 'Culinary', icon: '🍳', color: '#22c55e' },
  { name: 'medicinalAndHealth', label: 'Medicinal', icon: '⚕️', color: '#06b6d4' },
  { name: 'cultivationAndProcessing', label: 'Cultivation', icon: '🌱', color: '#3b82f6' },
  { name: 'safetyAndIdentification', label: 'Safety', icon: '⚠️', color: '#8b5cf6' },
  { name: 'chemicalAndProperties', label: 'Chemical', icon: '🧪', color: '#ec4899' },
  { name: 'culturalAndHistorical', label: 'Cultural', icon: '📜', color: '#d946ef' },
  { name: 'commercialAndMarket', label: 'Commercial', icon: '💰', color: '#14b8a6' },
  { name: 'environmentalAndConservation', label: 'Environment', icon: '🌿', color: '#10b981' },
  { name: 'researchAndInnovation', label: 'Innovation', icon: '🔬', color: '#0ea5e9' }
];
```

### Auto-Perspective Switching ⭐ NEW (2025-11-17)

**Automatische Perspektiven-Aktivierung basierend auf Suchergebnissen:**

```javascript
constructor() {
  super();
  // ...
  this.autoSwitchTimer = null; // Debounce timer
}

// Event Listener für search:completed
this.onSearchCompleted = (data) => {
  this.searchResults = data.totalResults;
  this.totalMorphs = data.totalMorphs;
  this.matchedPerspectives = data.perspectiveMatchCounts || {};
  
  // Clear previous auto-switch timer (debounce)
  if (this.autoSwitchTimer) {
    clearTimeout(this.autoSwitchTimer);
  }
  
  const matchedPerspectiveNames = data.matchedPerspectives || [];
  
  if (matchedPerspectiveNames.length > 0) {
    // Debounce: Wait 400ms before auto-switching (user might still be typing)
    this.autoSwitchTimer = setTimeout(() => {
      matchedPerspectiveNames.forEach(perspectiveName => {
        const perspective = this.perspectives.find(p => p.name === perspectiveName);
        const isAlreadyActive = this.activePerspectives.find(p => p.name === perspectiveName);
        
        if (perspective && !isAlreadyActive) {
          console.log('[MorphHeader] Auto-activating perspective from search:', perspectiveName);
          this.togglePerspective(perspective);
        }
      });
    }, 400); // 400ms debounce - nearly unnoticeable but prevents accidental switches
  }
};

// Register listener (event name WITHOUT 'amorph:' prefix!)
this.amorph.on('search:completed', this.onSearchCompleted);
```

**Debounce Flow:**
1. User types "p" → Search fires → Timer starts (400ms)
2. User types "e" → Search fires → Previous timer cancelled, new timer starts
3. User types "p" → Search fires → Previous timer cancelled, new timer starts
4. User types "t" → Search fires → Previous timer cancelled, new timer starts
5. User types "i" → Search fires → Previous timer cancelled, new timer starts
6. User types "d" → Search fires → Previous timer cancelled, new timer starts
7. User types "e" → Search fires → Previous timer cancelled, new timer starts
8. **User stops typing** → After 400ms → Perspectives auto-activate!

**Cleanup:**
```javascript
disconnectedCallback() {
  super.disconnectedCallback();
  
  // Clear auto-switch timer
  if (this.autoSwitchTimer) {
    clearTimeout(this.autoSwitchTimer);
  }
  
  if (this.amorph) {
    this.detachEventListeners();
  }
}
```

### FIFO Perspektiven-Management

```javascript
togglePerspective(perspective) {
  const isActive = this.activePerspectives.find(p => p.name === perspective.name);
  
  if (isActive) {
    // Remove wenn bereits aktiv
    this.removePerspective(perspective);
  } else {
    // Add mit FIFO-Logik
    if (this.activePerspectives.length >= this.maxPerspectives) {
      console.log(`[MorphHeader] FIFO: Removing oldest perspective`);
      const removed = this.activePerspectives[0];
      this.activePerspectives = this.activePerspectives.slice(1); // Remove oldest
      console.log(`[MorphHeader] Removed:`, removed.name);
    }
    
    this.activePerspectives = [...this.activePerspectives, perspective];
    this.dispatchPerspectiveChange();
  }
}

dispatchPerspectiveChange() {
  const perspectiveNames = this.activePerspectives.map(p => p.name);
  
  // Dispatch auf BEIDE window UND document (wichtig für Shadow DOM!)
  const event = new CustomEvent('perspective-changed', {
    detail: { perspectives: perspectiveNames },
    bubbles: true,
    composed: true
  });
  
  window.dispatchEvent(event);
  document.dispatchEvent(event);
  
  console.log('[MorphHeader] Dispatching perspective change:', perspectiveNames);
  console.log('[MorphHeader] Active perspectives:', this.activePerspectives.length);
}
```

### Button States (CSS)

```css
/* Alle Buttons in einer Reihe */
.perspectives-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 0.5rem 0;
}

/* Basis-Button */
.perspective-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1.5px solid;
  background: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Inactive: Geschrumpft */
.perspective-btn.inactive {
  opacity: 0.7;
  max-width: 80px;
  padding: 0.4rem 0.7rem;
  font-size: 0.7rem;
  transform: scale(0.95);
}

/* Active: Erweitert */
.perspective-btn.active {
  max-width: 200px;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.1);
  font-weight: 600;
  background: rgba(0, 0, 0, 0.95);
  transform: scale(1.05);
}

/* Hover */
.perspective-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  opacity: 1;
}

### Props

```javascript
{
  perspective: String,  // 'culinary' | 'scientific' | 'medicinal'
  lang: String,         // 'de' | 'en' | 'la'
  group: String,        // data-group Wert
  mini: Boolean,        // Mini-Mode (nur Icons)
  maxi: Boolean         // Maxi-Mode (mit Details)
}
```

### Verwendung

```javascript
import { MorphHeader } from '@/amorph/global/MorphHeader';

// In deinem Morph:
class MyMorph extends LitElement {
  render() {
    return html`
      <morph-header
        perspective="scientific"
        lang="la"
        group="fungus-123"
      ></morph-header>
      
      <div class="morph-content">
        <!-- Dein Content -->
      </div>
    `;
  }
}
```

### Implementierung

```javascript
export class MorphHeader extends LitElement {
  static properties = {
    perspective: { type: String },
    lang: { type: String },
    group: { type: String },
    mini: { type: Boolean },
    maxi: { type: Boolean }
  };
  
  constructor() {
    super();
    this.perspective = 'culinary';
    this.lang = 'de';
    this.group = '';
    this.mini = false;
    this.maxi = false;
  }
  
  /**
   * Get perspective icon
   */
  getPerspectiveIcon(perspective) {
    const icons = {
      culinary: '🍄',
      scientific: '🔬',
      medicinal: '💊',
      default: '📦'
    };
    return icons[perspective] || icons.default;
  }
  
  /**
   * Get perspective color
   */
  getPerspectiveColor(perspective) {
    const colors = {
      culinary: 'hsl(var(--hue-culinary), 70%, 60%)',
      scientific: 'hsl(var(--hue-scientific), 70%, 60%)',
      medicinal: 'hsl(var(--hue-medicinal), 70%, 60%)'
    };
    return colors[perspective] || 'hsl(0, 0%, 60%)';
  }
  
  /**
   * Get lang flag
   */
  getLangFlag(lang) {
    const flags = {
      de: '🇩🇪',
      en: '🇬🇧',
      la: '🏛️',
      fr: '🇫🇷'
    };
    return flags[lang] || '🌐';
  }
  
  render() {
    // Mini Mode: nur Icons
    if (this.mini) {
      return html`
        <div class="morph-header morph-header--mini">
          <span class="badge badge--perspective">
            ${this.getPerspectiveIcon(this.perspective)}
          </span>
          <span class="badge badge--lang">
            ${this.getLangFlag(this.lang)}
          </span>
        </div>
      `;
    }
    
    // Maxi Mode: mit Details
    if (this.maxi) {
      return html`
        <div class="morph-header morph-header--maxi">
          <div class="badge-row">
            <span class="badge badge--perspective" 
                  style="--badge-color: ${this.getPerspectiveColor(this.perspective)}">
              <span class="badge__icon">${this.getPerspectiveIcon(this.perspective)}</span>
              <span class="badge__text">${this.perspective}</span>
            </span>
            
            <span class="badge badge--lang">
              <span class="badge__icon">${this.getLangFlag(this.lang)}</span>
              <span class="badge__text">${this.lang}</span>
            </span>
            
            ${this.group ? html`
              <span class="badge badge--group">
                <span class="badge__icon">🏷️</span>
                <span class="badge__text">${this.group}</span>
              </span>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    // Default Mode
    return html`
      <div class="morph-header">
        <span class="badge badge--perspective" 
              style="--badge-color: ${this.getPerspectiveColor(this.perspective)}">
          ${this.getPerspectiveIcon(this.perspective)}
          <span class="badge__text">${this.perspective}</span>
        </span>
        
        <span class="badge badge--lang">
          ${this.getLangFlag(this.lang)}
        </span>
        
        ${this.group ? html`
          <span class="badge badge--group" title="Group: ${this.group}">
            🏷️
          </span>
        ` : ''}
      </div>
    `;
  }
  
  static styles = css`
    :host {
      display: block;
    }
    
    .morph-header {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .morph-header--mini {
      padding: 0.25rem;
      gap: 0.25rem;
    }
    
    .morph-header--maxi {
      padding: 1rem;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .badge:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
    
    .badge--perspective {
      background: var(--badge-color, rgba(255, 255, 255, 0.1));
      color: white;
    }
    
    .badge--lang {
      font-variant: small-caps;
    }
    
    .badge--group {
      opacity: 0.6;
    }
    
    .badge__icon {
      font-size: 1rem;
    }
    
    .badge__text {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .badge-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `;
}

customElements.define('morph-header', MorphHeader);
```

---

## Design Philosophy

MorphHeader folgt dem **Glass-Morphism** Prinzip:
- Transparente Backgrounds
- Backdrop Blur
- Subtile Borders
- Hover-Effekte

---

## Verwendung in Morphs

```javascript
// NameMorph.js
render() {
  return html`
    <morph-header
      perspective=${this.perspective}
      lang=${this.lang}
      group=${this.dataset.group}
    ></morph-header>
    
    <div class="name-morph__content">
      <h2>${this.value}</h2>
    </div>
  `;
}
```

---

## BubbleView Controls **[NEW]**

MorphHeader zeigt BubbleView-spezifische Controls wenn BubbleView aktiv ist:

```javascript
// Listen to bubble-view-active event
connectedCallback() {
  super.connectedCallback();
  document.addEventListener('bubble-view-active', (e) => {
    this.bubbleViewActive = true;
    this.bubbleViewInstance = e.detail.instance;
    this.requestUpdate();
  });
}

// Render BubbleView controls conditionally
render() {
  return html`
    <div class="morph-header">
      <!-- Normal badges -->
      
      ${this.bubbleViewActive ? html`
        <div class="bubble-controls">
          <button @click=${this.toggleBubbleSimulation}>
            ${this.bubbleViewInstance?.isSimulating ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button @click=${this.toggleBubbleConnections}>
            🔗 ${this.bubbleViewInstance?.showConnections ? 'Hide' : 'Show'} Connections
          </button>
          <button @click=${this.resetBubbleView}>
            🔄 Reset
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// Control methods
toggleBubbleSimulation() {
  if (this.bubbleViewInstance) {
    this.bubbleViewInstance.toggleSimulation();
  }
}

toggleBubbleConnections() {
  if (this.bubbleViewInstance) {
    this.bubbleViewInstance.toggleConnections();
  }
}

resetBubbleView() {
  if (this.bubbleViewInstance) {
    this.bubbleViewInstance.reset();
  }
}
```

---

## Status: ✅ IMPLEMENTIERT + BUBBLEVIEW CONTROLS

MorphHeader ist vollständig implementiert und wird von allen Morphs verwendet.

**Latest Updates (2025-11-15):**
- ✅ BubbleView Controls integriert (Play/Pause, Connections, Reset)
- ✅ Listens to `bubble-view-active` Event
- ✅ Conditional rendering basierend auf aktiver View
- ✅ Zentrale Control-Location für alle Morphs
