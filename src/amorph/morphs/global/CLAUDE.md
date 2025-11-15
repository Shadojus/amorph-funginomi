# 🌍 AMORPH Global Components

## Übersicht

Globale Hosts die in der gesamten App verfügbar sind:
- ✅ **MorphHeader**: Universeller Header für alle Morphs

---

## MorphHeader.js **[UPDATED 2025-11-15]**

### Funktion

Universeller Header für jeden Morph + **ALLE GLOBALEN CONTROLS**:
- ✅ Perspective-Badge (culinary, scientific, medicinal)
- ✅ Lang-Badge (de, en, la)
- ✅ Group-Badge (data-group)
- ✅ Mini/Maxi Modes
- ✅ Glass-Morphism Design
- ✅ **BubbleView Controls** (Play/Pause, Connections, Reset)
- ✅ **Theme Toggle** (Dark/Light)
- ✅ **View Mode Toggle** (Grid/Bubble)
- ✅ Listens to `bubble-view-active` Event

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
