# 🌍 AMORPH Global Components

**Last Updated:** 23. November 2025

**Framework Note:** MorphHeader ist **konfigurierbar** für verschiedene Instanzen. Die Perspektiven-Buttons, Branding, und Search-Integration sind über Props/Config anpassbar. Jede Instance definiert ihre eigenen Perspektiven basierend auf ihrer Domäne.

## Structure

```
features/morph-header/
├── MorphHeader.js       # Main header with search & perspective controls
├── tokens.js            # Local design tokens
└── CLAUDE.md            # This file
```

## Übersicht

Globale Components für die gesamte App:
- ✅ **MorphHeader.js**: Globaler Header mit Branding, Suche & 12 Perspektiven-Buttons

## 🔗 Related Components

**Uses:**
- `./tokens.js` - Local design tokens
- `../../core/AmorphSystem.js` - Event publishing & perspective state
- `../search-system/reactors/` - Listens to search:completed events

**Used by:**
- `../../core/layouts/BaseLayout.astro` - Included in all pages
- All Views (BubbleView, GridView, PerspectiveHost)

**Publishes Events:**
- `perspective:activated` - When user clicks perspective button
- `perspective:deactivated` - When perspective removed from queue
- `search:query-changed` - When search input changes

**See also:**
- `../perspective-system/` - PerspectiveHost responds to perspective events
- `../search-system/` - Both SearchReactors publish matched perspectives
- `../../core/observers/GlobalObserver.js` - Handles global:* events

---

## MorphHeader.js ✨ **[UPDATED 2025-11-19]**

### Funktion

**Globaler Header für das gesamte System** - **Drei Kernfunktionen:**
- ✅ **Branding** (Funginomi + Bifröst Link)
- ✅ **Search Bar** (zentriert, glassmorphism, pulsating glow)
- ✅ **12 Perspektiven-Buttons** (FIFO max 3 default, max 2 Reihen)
- ✅ **Shrinkable/Expandable Buttons** (inactive/active states)
- ✅ **Auto-Perspective Switching** (basierend auf Search Results)
- ✅ **Debounced Auto-Switching** (400ms delay)
- ✅ **Progressive Komprimierung** (Icons verschwinden, dann Text schrumpft)
- ✅ **Responsive Branding** (kleiner auf Mobile, nicht versteckt)
- ✅ Event Dispatching (window + document für Shadow DOM)

**Entfernt:** ❌ Reactor Toggles, ❌ View Mode Switcher, ❌ BubbleView Controls

**Latest Features (2025-11-23):**
- ✅ **getActivePerspectives() API** - Public method for external access to active perspectives
- ✅ **PerspectiveReactor timing workaround** - Retrieves perspectives on first apply()

**Latest Features (2025-11-19):**
- ✅ **Pulsating search bar** - Blue glow animation (3s loop, stops on focus)
- ✅ **Default perspectives changed** - Cultivation, Chemical, Medicinal (was: Ecology, Safety)
- ✅ **3 default perspectives** - More focused starting view

**Previous Features (2025-11-17):**
- ✅ **Branding**: "Funginomi" Titel + "Part of the Bifröst" Untertitel mit Link
- ✅ **Max 2 Reihen**: Perspektiven-Buttons wrappen maximal in 2 Reihen
- ✅ **Progressive Komprimierung**:
  - Inaktive Buttons: Keine Icons, kleiner Text
  - Bei Platzmangel: Text schrumpft weiter
  - Aktive Buttons: Bleiben groß mit Icon
- ✅ **Responsive Design**:
  - Desktop: Branding links, Suche Mitte, Spacer rechts
  - Mobile: Branding kleiner, alle Elemente kompakter
- ✅ Auto-activates perspectives when search finds matches in specific fields
- ✅ 400ms debounce prevents perspective switching while user is typing
- ✅ Only switches when user pauses typing
- ✅ Prevents duplicate activations (checks if perspective already active)
- ✅ FIFO queue management (removes oldest when adding 5th perspective)

### Layout-Struktur

```
┌──────────────────────────────────────────────────────────────────┐
│ Top Row                                                          │
│ Funginomi            [🔍 Search Bar - Centered]           Spacer │
│ Part of the Bifröst                                              │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│ Bottom Row (Max 2 Reihen)                                        │
│ [🧬 Taxonomy] [👁️ Physical] [🌍 Ecology] [🍳 Culinary]          │
│ [⚕️ Medicinal] [🌱 Cultivation] [⚠️ Safety] [🧪 Chemical]        │
│ (Inaktive: kleiner, kein Icon | Aktive: groß, mit Icon)         │
└──────────────────────────────────────────────────────────────────┘

Mobile (< 768px):
┌──────────────────────────────────────────────────────────────────┐
│ Funginomi (klein)    [🔍 Search - Compact]                       │
│ Part of the Bifröst (klein)                                      │
└──────────────────────────────────────────────────────────────────┘
```

### Perspectives Configuration

```javascript
// Perspectives are loaded from domain.config.js
// Each instance defines its own perspectives
this.perspectives = DomainConfig.perspectives || [];

// Example structure:
// { name: 'perspective1', label: 'Label', icon: '🔍', color: '#color' }
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
