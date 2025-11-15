# 🧩 AMORPH Morphs - Atomic UI Components

## Übersicht

Morphs sind **Lit Web Components** die einzelne Datenfelder darstellen:
- ✅ **Atomic Design**: Jedes Datenfeld = eigener Morph
- ✅ **Datengetrieben**: Bekommen Props, kein DOM-Scraping
- ✅ **Auto-Register**: Registrieren sich automatisch bei AmorphSystem
- ✅ **Reactor-kompatibel**: Können von Reactors beeinflusst werden

## Morph-Architektur

Alle Morphs folgen demselben Pattern:

```javascript
import { LitElement, html, css } from 'lit';
import { amorph } from '../../arch/AmorphSystem.js';
import { globalStyles } from '../../arch/styles/tokens.js';

export class ExampleMorph extends LitElement {
  static properties = {
    value: { type: String },
    perspective: { type: String }
  };
  
  static styles = [
    globalStyles,  // ← Global Design Tokens
    css`
      :host {
        display: block;
      }
    `
  ];
  
  constructor() {
    super();
    this.value = '';
    this.perspective = 'culinary';
  }
  
  connectedCallback() {
    super.connectedCallback();
    // Auto-Register bei AmorphSystem
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }
  }
  
  render() {
    return html`
      <div class="morph-content">
        ${this.value}
      </div>
    `;
  }
}

customElements.define('example-morph', ExampleMorph);
```

## Atomic Data Field Morphs

### NameMorph.js

**Funktion:** Zeigt Namen (Common oder Latin)

**Props:**
```javascript
{
  value: String,        // Der Name
  perspective: String,  // 'culinary' | 'scientific'
  lang: String,         // 'de' | 'la' | 'en'
  size: String          // 'small' | 'medium' | 'large'
}
```

**Verwendung:**
```html
<name-morph 
  value="Mandelpilz"
  perspective="culinary"
  lang="de"
></name-morph>

<name-morph 
  value="Agaricus subrufescens"
  perspective="scientific"
  lang="la"
></name-morph>
```

**Styling:**
- Culinary: Normal font
- Scientific: Italic font (lateinischer Name)

---

### ImageMorph.js

**Funktion:** Zeigt Bild

**Props:**
```javascript
{
  src: String,          // Bild-URL
  alt: String,          // Alt-Text
  caption: String,      // Optional: Bildunterschrift
  lazy: Boolean         // Lazy Loading (default: true)
}
```

**Verwendung:**
```html
<image-morph
  src="/images/mandelpilz.jpg"
  alt="Mandelpilz auf Waldboden"
  caption="Agaricus subrufescens"
  lazy
></image-morph>
```

**Features:**
- ✅ Lazy Loading mit IntersectionObserver
- ✅ Placeholder während Laden
- ✅ Responsive (object-fit: cover)

---

### TagMorph.js

**Funktion:** Zeigt einzelnen Tag

**Props:**
```javascript
{
  tag: String,          // Tag-Text
  color: String,        // 'auto' | HEX color
  clickable: Boolean    // Click-Handler (default: true)
}
```

**Verwendung:**
```html
<tag-morph tag="edible" color="auto" clickable></tag-morph>
<tag-morph tag="medicinal" color="#00ff88"></tag-morph>
```

**Features:**
- ✅ Auto-Color basierend auf Tag-Hash
- ✅ Click emittiert Event für Filtering
- ✅ Hover-Effekt

---

### TextMorph.js

**Funktion:** Zeigt Text-Feld

**Props:**
```javascript
{
  value: String,        // Text-Inhalt
  perspective: String,  // Perspektive für Farbe
  maxLines: Number,     // Max. Zeilen (null = unbegrenzt)
  ellipsis: Boolean     // Ellipsis bei Overflow
}
```

**Verwendung:**
```html
<text-morph
  value="Der Mandelpilz ist ein schmackhafter Speisepilz..."
  perspective="culinary"
  maxLines="3"
  ellipsis
></text-morph>
```

---

### BooleanMorph.js

**Funktion:** Zeigt Boolean (Checkbox, Icon)

**Props:**
```javascript
{
  value: Boolean,       // true/false
  trueIcon: String,     // Icon für true
  falseIcon: String,    // Icon für false
  label: String         // Optional: Label-Text
}
```

**Verwendung:**
```html
<boolean-morph
  value={true}
  trueIcon="✓"
  falseIcon="✗"
  label="Essbar"
></boolean-morph>
```

---

### NumberMorph.js

**Funktion:** Zeigt Zahl mit optionaler Einheit

**Props:**
```javascript
{
  value: Number,        // Zahl
  unit: String,         // Einheit (g, mg, %)
  decimals: Number,     // Nachkommastellen
  format: String        // 'decimal' | 'percent' | 'currency'
}
```

**Verwendung:**
```html
<number-morph value="25" unit="g" decimals="2"></number-morph>
<number-morph value="0.85" format="percent"></number-morph>
```

---

### ListMorph.js

**Funktion:** Zeigt Liste von Items

**Props:**
```javascript
{
  items: Array,         // Array von Strings
  variant: String,      // 'bullets' | 'numbered' | 'chips'
  maxItems: Number,     // Max. angezeigte Items
  collapsible: Boolean  // Expandierbar
}
```

**Verwendung:**
```html
<list-morph
  items={['Vitamin D', 'Protein', 'Ballaststoffe']}
  variant="bullets"
></list-morph>
```

---

## Advanced Morphs (Data Visualization)

### ChartMorph.js

**Funktion:** Data Visualization mit Charts

**Props:**
```javascript
{
  type: String,         // 'bar' | 'line' | 'pie'
  data: Object,         // { labels: [], values: [] }
  label: String,
  perspectives: Array,
  width: Number,
  height: Number
}
```

**Verwendung:**
```html
<chart-morph
  type="bar"
  data={{ labels: ['A', 'B', 'C'], values: [10, 20, 30] }}
  width="300"
  height="200"
></chart-morph>
```

---

### MapMorph.js

**Funktion:** Geographic Visualization

**Props:**
```javascript
{
  locations: Array,     // [{ lat, lng, label }]
  zoom: Number,
  center: Object        // { lat, lng }
}
```

---

### TimelineMorph.js

**Funktion:** Temporal Event Visualization

**Props:**
```javascript
{
  events: Array,        // [{ date, label, description }]
  startDate: String,
  endDate: String
}
```

---

## Morph Data Attributes

Jeder Morph hat automatisch diese Attribute:

```html
<name-morph
  data-morph="name-1234567890-abc123"
  data-morph-type="name"
  data-perspective="culinary"
  data-group="fungus-0"
>
```

**Verwendet für:**
- ✅ AMORPH Registry (eindeutige ID)
- ✅ Reactor Targeting (nach Type)
- ✅ Grouping (mehrere Morphs gehören zusammen)
- ✅ Search Scoring

---

## Morph Lifecycle

```
1. Create → <name-morph> Element erstellen
2. Connected → connectedCallback() → Auto-Register bei AMORPH
3. Rendered → firstUpdated() → Lit rendert Component
4. Reactors → Aktive Reactors werden auf Morph angewendet
5. Disconnected → disconnectedCallback() → Cleanup
```

---

## Datengetriebene Erstellung

Morphs werden aus Daten erstellt (nicht aus DOM):

```javascript
// In BubbleHost.js
fungi.forEach((fungus, index) => {
  // Name Morph
  if (fungus.names?.common) {
    const morph = document.createElement('name-morph');
    morph.setAttribute('value', fungus.names.common);
    morph.setAttribute('perspective', 'culinary');
    morph.dataset.group = `fungus-${index}`;
    container.appendChild(morph);
  }
  
  // Image Morph
  if (fungus.images?.[0]) {
    const morph = document.createElement('image-morph');
    morph.setAttribute('src', fungus.images[0].url);
    morph.dataset.group = `fungus-${index}`;
    container.appendChild(morph);
  }
  
  // Text Morph
  if (fungus.description) {
    const morph = document.createElement('text-morph');
    morph.setAttribute('value', fungus.description);
    morph.setAttribute('maxlines', '3');
    morph.dataset.group = `fungus-${index}`;
    container.appendChild(morph);
  }
  
  // Tag Morphs
  fungus.tags?.forEach(tag => {
    const morph = document.createElement('tag-morph');
    morph.setAttribute('tag', tag);
    morph.dataset.group = `fungus-${index}`;
    container.appendChild(morph);
  });
});
```

---

## Status: ✅ ALLE MORPHS IMPLEMENTIERT

Alle Atomic und Advanced Morphs sind fertig und produktionsbereit.

**Event System (2025-11-15):**
- Morphs publishen jetzt `morph:*` Events zu Redis Streams
- `morph:created`, `morph:mounted`, `morph:updated`, `morph:destroyed`
- MorphObserver tracked alle Morph State & Connections
- Auto-Registration bei connectedCallback() publishes `morph:created`
- Siehe: `STREAM_OBSERVER_SYSTEM.md`
