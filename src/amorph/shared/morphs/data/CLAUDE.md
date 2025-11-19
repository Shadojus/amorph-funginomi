# 🧩 AMORPH Data Morphs - Atomic Design Components

**Last Updated:** 19. November 2025

## Übersicht

**Atomic Data Morphs** - Jedes Datenfeld ist ein eigener Morph:
- ✅ **NameMorph**: Namen (culinary, scientific)
- ✅ **ImageMorph**: Bilder mit Aspect Ratio
- ✅ **TagMorph**: Tags mit Click-Handler
- ✅ **TextMorph**: Text mit Ellipsis
- ✅ **BooleanMorph**: Ja/Nein Werte
- ✅ **NumberMorph**: Zahlen mit Einheiten
- ✅ **ListMorph**: Arrays als Listen
- ✅ **DataMorph**: Universal data display with perspective awareness

**Design System:**
- Alle Morphs nutzen `globalStyles` aus `arch/styles/tokens.js`
- CSS Custom Properties (funktionieren in Shadow DOM!)
- Konsistente Perspektiven-Farben, Spacing, Typography
- Dark Mode Support

**✨ NEW (2025-11-19) - Compact Layout & Search Highlighting:**
- **40% smaller padding** - 0.375-0.5rem (was 1.25rem)
- **Inline tags** - Comma-separated display instead of wrapped blocks
- **Search highlight background** - Blue gradient with border-left accent
- **High visibility** - Works with multiple active perspectives
- **Touch-friendly** - Proper z-index stacking

---

## Philosophie: Atomic Design

Jedes **Datenfeld** wird als **eigener Morph** behandelt:

```javascript
// ❌ NICHT so:
<div class="fungus">
  <h2>Steinpilz</h2>
  <p>Boletus edulis</p>
</div>

// ✅ SO:
<name-morph value="Steinpilz" perspective="culinary"></name-morph>
<name-morph value="Boletus edulis" perspective="scientific"></name-morph>
```

**Warum?**
- Jeder Morph registriert sich bei AmorphSystem
- Reactors können **gezielt** auf Morph-Typen reagieren
- Multi-Perspektiven-System funktioniert
- Flexibles Rendering (Grid vs Bubble)

---

## 🔗 Related Components

**Uses:**
- `../../../core/AmorphSystem.js` - Morph registration & event system
- `../../styles/tokens.js` - Global design tokens (CSS Custom Properties)

**Used by:**
- `../../../features/bubble-view/BubbleHost.js` - Creates morphs for Canvas view
- `../../../features/grid-view/GridHost.js` - Creates morphs for Grid cards
- `../../../features/perspective-system/PerspectiveHost.js` - Filters morphs by perspective

**Affected by:**
- `../../reactors/` - All universal reactors (Glow, Hover, Pulse, etc.)
- `../../../features/perspective-system/reactors/PerspectiveReactor.js` - Dims irrelevant morphs
- `../../../features/search-system/reactors/SearchReactor.js` - Highlights search matches

**See also:**
- `../global/MorphHeader.js` - Global header component
- `../../observers/MorphObserver.js` - Handles morph:* events

---

## NameMorph.js

### Funktion

Zeigt **Namen** an (culinary oder scientific):
- ✅ Multi-Perspektiven (culinary, scientific, medicinal)
- ✅ Multi-Language (de, en, la)
- ✅ Größen-Varianten (small, medium, large)
- ✅ Automatische Registration bei AmorphSystem

### Props

```javascript
{
  value: String,        // Der Name (z.B. "Steinpilz")
  perspective: String,  // 'culinary' | 'scientific' | 'medicinal'
  lang: String,         // 'de' | 'en' | 'la'
  variant: String,      // 'common' | 'latin' | 'both'
  size: String          // 'small' | 'medium' | 'large'
}
```

### Verwendung

```javascript
// Culinary Name
<name-morph 
  value="Steinpilz" 
  perspective="culinary"
  lang="de"
  size="large"
></name-morph>

// Scientific Name
<name-morph 
  value="Boletus edulis" 
  perspective="scientific"
  lang="la"
  variant="latin"
  size="medium"
></name-morph>
```

### Implementierung

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';
import { globalStyles } from '../../arch/styles/tokens.js';

export class NameMorph extends LitElement {
  static properties = {
    value: { type: String },
    perspective: { type: String },
    lang: { type: String },
    variant: { type: String },
    size: { type: String }
  };
  
  static styles = [
    globalStyles,
    css`
      :host { display: block; }
      .name {
        font-family: var(--font-sans);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-light);
        transition: var(--transition-base);
      }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.perspective = 'culinary';
    this.lang = 'de';
    this.variant = 'common';
    this.size = 'medium';
  }
  
  firstUpdated() {
    // Registriere bei AmorphSystem
    amorph.registerMorph(this);
  }
  
  render() {
    return html`
      <div 
        class="name ${this.size} ${this.variant}"
        data-morph
        data-morph-type="name"
        data-name="${this.value}"
        data-perspective="${this.perspective}"
        data-lang="${this.lang}"
      >
        ${this.value}
      </div>
    `;
  }
  
  static styles = css`
    .name {
      font-weight: 600;
      color: white;
      transition: all 0.3s ease;
    }
    
    .name.small { font-size: 14px; }
    .name.medium { font-size: 18px; }
    .name.large { font-size: 24px; }
    
    .name.latin {
      font-style: italic;
      opacity: 0.8;
    }
  `;
}

customElements.define('name-morph', NameMorph);
```

---

## ImageMorph.js

### Funktion

Zeigt **Bilder** an:
- ✅ Lazy Loading
- ✅ Aspect Ratio
- ✅ Hover-Zoom
- ✅ Registration bei AmorphSystem

### Props

```javascript
{
  src: String,          // Bild-URL
  alt: String,          // Alt-Text
  aspectRatio: String,  // z.B. '16/9', '1/1', '4/3'
  lazy: Boolean         // Lazy Loading (default: true)
}
```

### Verwendung

```javascript
<image-morph 
  src="/images/steinpilz.jpg"
  alt="Steinpilz"
  aspectRatio="16/9"
  lazy
></image-morph>
```

### Implementierung

```javascript
export class ImageMorph extends LitElement {
  static properties = {
    src: { type: String },
    alt: { type: String },
    aspectRatio: { type: String },
    lazy: { type: Boolean }
  };
  
  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.aspectRatio = '16/9';
    this.lazy = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  render() {
    return html`
      <div 
        class="image-container"
        style="aspect-ratio: ${this.aspectRatio}"
        data-morph
        data-morph-type="image"
      >
        <img 
          class="image"
          src="${this.src}"
          alt="${this.alt}"
          loading="${this.lazy ? 'lazy' : 'eager'}"
        >
      </div>
    `;
  }
  
  static styles = css`
    .image-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
    }
    
    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }
    
    .image:hover {
      transform: scale(1.05);
    }
  `;
}

customElements.define('image-morph', ImageMorph);
```

---

## TagMorph.js

### Funktion

Zeigt **Tags** an:
- ✅ Click-Handler
- ✅ Varianten (pill, badge, chip)
- ✅ Auto-Color
- ✅ Hover-Effekte

### Props

```javascript
{
  value: String,        // Tag-Text
  tag: String,          // Alias für value
  variant: String,      // 'pill' | 'badge' | 'chip'
  color: String,        // 'auto' | HEX | HSL
  clickable: Boolean    // Click-Handler aktiv?
}
```

### Verwendung

```javascript
<tag-morph 
  tag="edible"
  variant="pill"
  color="auto"
  clickable
></tag-morph>
```

### Events

```javascript
// tag-click Event
tagMorph.addEventListener('tag-click', (e) => {
  console.log('Tag clicked:', e.detail.tag);
});
```

### Implementierung

```javascript
export class TagMorph extends LitElement {
  static properties = {
    value: { type: String },
    tag: { type: String },
    variant: { type: String },
    color: { type: String },
    clickable: { type: Boolean }
  };
  
  constructor() {
    super();
    this.value = '';
    this.tag = '';
    this.variant = 'pill';
    this.color = 'auto';
    this.clickable = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  get displayValue() {
    return this.tag || this.value;
  }
  
  handleClick() {
    if (this.clickable) {
      this.dispatchEvent(new CustomEvent('tag-click', {
        detail: { tag: this.displayValue },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  render() {
    return html`
      <span 
        class="tag ${this.variant} ${this.clickable ? 'clickable' : ''}"
        data-morph
        data-morph-type="tag"
        data-tags="${this.displayValue}"
        @click="${this.handleClick}"
      >
        ${this.displayValue}
      </span>
    `;
  }
  
  static styles = css`
    .tag {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    
    .tag.clickable {
      cursor: pointer;
    }
    
    .tag.clickable:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
    }
  `;
}

customElements.define('tag-morph', TagMorph);
```

---

## TextMorph.js

### Funktion

Zeigt **Text** an:
- ✅ Ellipsis (...)
- ✅ Max Lines
- ✅ Multi-Language Support
- ✅ Registration bei AmorphSystem

### Props

```javascript
{
  value: String,        // Text-Content
  perspective: String,  // 'culinary' | 'scientific' | 'medicinal'
  lang: String,         // 'de' | 'en' | 'la'
  maxLines: Number,     // Max Zeilen (default: null = unlimited)
  ellipsis: Boolean     // Ellipsis aktiviert? (default: true)
}
```

### Verwendung

```javascript
<text-morph 
  value="Steinpilze sind eine Gattung..."
  perspective="culinary"
  lang="de"
  maxLines="3"
  ellipsis
></text-morph>
```

### Implementierung

```javascript
export class TextMorph extends LitElement {
  static properties = {
    value: { type: String },
    perspective: { type: String },
    lang: { type: String },
    maxLines: { type: Number },
    ellipsis: { type: Boolean }
  };
  
  constructor() {
    super();
    this.value = '';
    this.perspective = 'culinary';
    this.lang = 'de';
    this.maxLines = null;
    this.ellipsis = true;
  }
  
  firstUpdated() {
    amorph.registerMorph(this);
  }
  
  render() {
    const style = this.maxLines 
      ? `-webkit-line-clamp: ${this.maxLines}` 
      : '';
    
    return html`
      <div 
        class="text ${this.ellipsis ? 'ellipsis' : ''}"
        style="${style}"
        data-morph
        data-morph-type="text"
        data-description="${this.value}"
        data-perspective="${this.perspective}"
        data-lang="${this.lang}"
      >
        ${this.value}
      </div>
    `;
  }
  
  static styles = css`
    .text {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      font-size: 14px;
    }
    
    .text.ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  `;
}

customElements.define('text-morph', TextMorph);
```

---

## BooleanMorph.js

### Funktion

Zeigt **Boolean-Werte** an:
- ✅ Icon-basiert (✅ / ❌)
- ✅ Toggle-Modus (für Inputs)
- ✅ Custom Labels

### Props

```javascript
{
  value: Boolean,       // true/false
  label: String,        // Label-Text
  showIcon: Boolean,    // Icon anzeigen?
  interactive: Boolean  // Kann getoggled werden?
}
```

### Verwendung

```javascript
<boolean-morph 
  value="${true}"
  label="Edible"
  showIcon
></boolean-morph>
```

---

## NumberMorph.js

### Funktion

Zeigt **Zahlen** an:
- ✅ Einheiten (kg, cm, °C)
- ✅ Formatierung (1,234.56)
- ✅ Min/Max Range Indicator

### Props

```javascript
{
  value: Number,        // Zahlen-Wert
  unit: String,         // Einheit (z.B. 'cm', 'kg')
  decimals: Number,     // Nachkommastellen
  min: Number,          // Min-Wert (für Range)
  max: Number           // Max-Wert (für Range)
}
```

### Verwendung

```javascript
<number-morph 
  value="15"
  unit="cm"
  decimals="1"
></number-morph>
```

---

## ListMorph.js

### Funktion

Zeigt **Arrays** an:
- ✅ Bullet Lists
- ✅ Numbered Lists
- ✅ Custom Separator
- ✅ Nested Lists

### Props

```javascript
{
  items: Array,         // Array von Items
  type: String,         // 'bullet' | 'numbered' | 'inline'
  separator: String,    // Separator für inline (default: ', ')
  maxItems: Number      // Max Items anzeigen
}
```

### Verwendung

```javascript
<list-morph 
  .items="${['Item 1', 'Item 2', 'Item 3']}"
  type="bullet"
></list-morph>
```

---

## Data-Attributes

Alle Morphs haben **data-morph** Attribute:

```html
<name-morph 
  value="Steinpilz"
  data-morph
  data-morph-type="name"
  data-name="Steinpilz"
  data-perspective="culinary"
  data-lang="de"
  data-group="fungus-123"
></name-morph>
```

**Warum wichtig?**
- AmorphSystem registriert Morphs via `[data-morph]` Selector
- Reactors können Morphs via data-attributes filtern
- BubbleView identifiziert Morphs via data-morph-type
- SearchReactor durchsucht data-name, data-description, data-tags

---

## Registrierung bei AmorphSystem

Alle Morphs registrieren sich automatisch:

```javascript
firstUpdated() {
  // IMMER in firstUpdated()!
  amorph.registerMorph(this);
}
```

**Lifecycle:**
1. Morph wird erstellt (`new NameMorph()`)
2. Morph wird ins DOM eingefügt
3. `firstUpdated()` wird aufgerufen
4. `amorph.registerMorph(this)` registriert den Morph
5. AmorphSystem fügt Morph zu `this.morphs` Map hinzu
6. Reactors werden automatisch auf neuen Morph angewendet

---

## Datengetriebene Morph-Erstellung

**In BubbleHost.js:**

```javascript
createMorphsFromData() {
  this.data.forEach((fungus, index) => {
    // Name Morph
    if (fungus.names?.common) {
      const morph = document.createElement('name-morph');
      morph.setAttribute('value', fungus.names.common);
      morph.setAttribute('perspective', 'culinary');
      morph.setAttribute('lang', 'de');
      morph.dataset.group = `fungus-${index}`;
      container.appendChild(morph);
    }
    
    // Image Morph
    if (fungus.images?.[0]) {
      const morph = document.createElement('image-morph');
      morph.setAttribute('src', fungus.images[0].url);
      morph.setAttribute('alt', fungus.names.common);
      morph.dataset.group = `fungus-${index}`;
      container.appendChild(morph);
    }
    
    // Text Morph
    if (fungus.description) {
      const morph = document.createElement('text-morph');
      morph.setAttribute('value', fungus.description);
      morph.setAttribute('perspective', 'culinary');
      morph.setAttribute('maxlines', '3');
      morph.dataset.group = `fungus-${index}`;
      container.appendChild(morph);
    }
    
    // Tag Morphs
    fungus.tags?.forEach(tag => {
      const morph = document.createElement('tag-morph');
      morph.setAttribute('tag', tag);
      morph.setAttribute('color', 'auto');
      morph.dataset.group = `fungus-${index}`;
      container.appendChild(morph);
    });
  });
}
```

---

---

## 🆕 BubbleMorph.js (NEW 2025-11-16)

### Funktion

**Lightweight AMORPH integration element** for BubbleView:
- ✅ Custom element representing a bubble
- ✅ Auto-registers with AMORPH system
- ✅ Virtual morph - actual rendering on canvas
- ✅ Event bridge between BubbleView and Reactors

### Props

```javascript
{
  slug: String,          // Fungus identifier (e.g., 'steinpilz')
  label: String,         // Display name (e.g., 'Steinpilz')
  similarity: Number,    // Similarity score 0-1
  perspectives: String   // Comma-separated perspectives (e.g., 'culinary,medicinal')
}
```

### Why BubbleMorph?

**Problem:** Bubbles rendered on canvas can't be registered as morphs
**Solution:** Create invisible DOM elements that:
1. Register with AMORPH system
2. Listen to reactor events
3. Notify BubbleView of updates via events

### Implementierung

```javascript
export class BubbleMorph extends HTMLElement {
  constructor() {
    super();
    
    // Set morph attributes for AMORPH
    this.dataset.morph = 'true';
    this.dataset.morphType = 'bubble';
  }

  connectedCallback() {
    // Register with AMORPH system
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  // Reactive properties
  get slug() {
    return this.getAttribute('slug');
  }

  set slug(value) {
    this.setAttribute('slug', value);
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get similarity() {
    return parseFloat(this.getAttribute('similarity')) || 0;
  }

  set similarity(value) {
    this.setAttribute('similarity', value);
  }

  get perspectives() {
    const attr = this.getAttribute('perspectives');
    return attr ? attr.split(',').map(p => p.trim()) : [];
  }

  set perspectives(value) {
    this.setAttribute('perspectives', Array.isArray(value) ? value.join(',') : value);
  }
}

// Register custom element
customElements.define('bubble-morph', BubbleMorph);
```

### Event System

```javascript
// BubbleView creates BubbleMorph elements
const bubbleEl = document.createElement('bubble-morph');
bubbleEl.setAttribute('slug', slug);
bubbleEl.setAttribute('label', label);
bubbleEl.setAttribute('similarity', similarity);
bubbleEl.setAttribute('perspectives', activePerspectives.join(','));

// Listen for reactor updates
bubbleEl.addEventListener('bubble-weight-update', (e) => {
  const bubble = this.bubbles.get(e.detail.slug);
  if (bubble) {
    bubble.similarity = e.detail.similarity;
  }
});

// Register with AMORPH
window.amorph.registerMorph(bubbleEl);

// Store in hidden container
container.appendChild(bubbleEl);
```

### Integration with PerspectiveWeightReactor

```javascript
// Reactor applies to bubble-morph elements
applyToBubbles(bubbleMorphs) {
  bubbleMorphs.forEach(bubbleMorph => {
    const slug = bubbleMorph.getAttribute('slug');
    const avgSimilarity = this.getAverageSimilarity(slug);
    
    // Dispatch event to BubbleView
    bubbleMorph.dispatchEvent(new CustomEvent('bubble-weight-update', {
      bubbles: true,
      composed: true,
      detail: {
        slug,
        similarity: avgSimilarity
      }
    }));
  });
}
```

### Usage in BubbleView

```javascript
import '../morphs/data/BubbleMorph.js'; // Import at top

createBubbleElement(slug, label, similarity) {
  // Create hidden container if needed
  let container = this.shadowRoot.querySelector('.bubble-morphs-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'bubble-morphs-container';
    container.style.display = 'none'; // Hidden
    this.shadowRoot.appendChild(container);
  }

  // Create bubble element
  const bubbleEl = document.createElement('bubble-morph');
  bubbleEl.dataset.morph = 'true';
  bubbleEl.dataset.morphType = 'bubble';
  bubbleEl.dataset.morphId = `bubble-${slug}`;
  bubbleEl.dataset.group = slug;
  bubbleEl.setAttribute('label', label);
  bubbleEl.setAttribute('slug', slug);
  bubbleEl.setAttribute('similarity', similarity);
  
  if (this.activePerspectives.length > 0) {
    bubbleEl.setAttribute('perspectives', this.activePerspectives.join(','));
  }
  
  // Event listener for reactor updates
  bubbleEl.addEventListener('bubble-weight-update', (e) => {
    const bubble = this.bubbles.get(e.detail.slug);
    if (bubble) bubble.similarity = e.detail.similarity;
  });
  
  // Add to container
  container.appendChild(bubbleEl);
  
  // Register with AMORPH
  if (window.amorph) {
    window.amorph.registerMorph(bubbleEl);
  }
  
  return bubbleEl;
}
```

---

## Status: ✅ ALLE ATOMIC MORPHS IMPLEMENTIERT

Alle Data Morphs sind vollständig implementiert und produktionsbereit:
- ✅ NameMorph
- ✅ ImageMorph
- ✅ TagMorph
- ✅ TextMorph
- ✅ BooleanMorph
- ✅ NumberMorph
- ✅ ListMorph
- ✅ **BubbleMorph** (NEW 2025-11-16)
