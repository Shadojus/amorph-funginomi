# 🎨 AMORPH Design System - Global Tokens

**Last Updated:** 21. November 2025

## Übersicht

**Global Design Tokens** für das gesamte AMORPH System:
- ✅ **tokens.js** - CSS Custom Properties die in **allen Shadow DOM Morphs** funktionieren
- ✅ Perspektiven-Farben, Typography, Spacing, Border Radius
- ✅ Dark Mode Support
- ✅ Konsistentes Design System über alle Views

---

## 🔗 Related Components

**Used by:**
- `../morphs/data/` - Alle Data Morphs nutzen tokens.js für Styling
- `../morphs/global/MorphHeader.js` - Header nutzt Design Tokens
- `../../features/bubble-view/` - BubbleView nutzt Perspektiven-Farben
- `../../features/grid-view/` - GridView nutzt Layout Tokens
- `../../features/perspective-system/` - PerspectiveHost & PerspectiveCard nutzen Tokens

**Design Philosophy:**
- CSS Custom Properties funktionieren **auch in Shadow DOM**!
- Zentrale Definition verhindert Inkonsistenzen
- Einfach erweiterbar für neue Farben, Spacing, etc.

---

## tokens.js

### Funktion

**Globale CSS Custom Properties** die in **allen Morphs verfügbar** sind:

```javascript
import { css } from 'lit';

export const globalStyles = css`
  :host {
    /* === PERSPECTIVE COLORS === */
    --color-taxonomy: #ef4444;
    --color-physicalCharacteristics: #f97316;
    --color-ecologyAndHabitat: #eab308;
    --color-culinaryAndNutritional: #22c55e;
    --color-medicinalAndHealth: #06b6d4;
    --color-cultivationAndProcessing: #3b82f6;
    --color-safetyAndIdentification: #8b5cf6;
    --color-chemicalAndProperties: #ec4899;
    --color-culturalAndHistorical: #d946ef;
    --color-commercialAndMarket: #14b8a6;
    --color-environmentalAndConservation: #10b981;
    --color-researchAndInnovation: #0ea5e9;

    /* === TYPOGRAPHY === */
    --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
    
    --font-size-xs: 0.75rem;     /* 12px */
    --font-size-sm: 0.875rem;    /* 14px */
    --font-size-base: 1rem;      /* 16px */
    --font-size-lg: 1.125rem;    /* 18px */
    --font-size-xl: 1.25rem;     /* 20px */
    --font-size-2xl: 1.5rem;     /* 24px */
    --font-size-3xl: 1.875rem;   /* 30px */
    --font-size-4xl: 2.25rem;    /* 36px */

    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* === SPACING === */
    --spacing-xs: 0.25rem;    /* 4px */
    --spacing-sm: 0.5rem;     /* 8px */
    --spacing-md: 1rem;       /* 16px */
    --spacing-lg: 1.5rem;     /* 24px */
    --spacing-xl: 2rem;       /* 32px */
    --spacing-2xl: 3rem;      /* 48px */
    --spacing-3xl: 4rem;      /* 64px */

    /* === BORDER RADIUS === */
    --radius-sm: 0.25rem;     /* 4px */
    --radius-md: 0.5rem;      /* 8px */
    --radius-lg: 0.75rem;     /* 12px */
    --radius-xl: 1rem;        /* 16px */
    --radius-2xl: 1.5rem;     /* 24px */
    --radius-full: 9999px;    /* Circle */

    /* === SHADOWS === */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

    /* === Z-INDEX === */
    --z-base: 1;
    --z-dropdown: 10;
    --z-sticky: 20;
    --z-fixed: 30;
    --z-modal: 40;
    --z-popover: 50;
    --z-tooltip: 60;

    /* === COLORS (Dark Mode) === */
    --color-bg-primary: #0a0a0a;
    --color-bg-secondary: #1a1a1a;
    --color-bg-tertiary: #2a2a2a;
    
    --color-text-primary: #ffffff;
    --color-text-secondary: #a0a0a0;
    --color-text-tertiary: #707070;
    
    --color-border: #333333;
    --color-border-hover: #555555;
    
    /* === TRANSITIONS === */
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 350ms ease;
  }
`;
```

---

## Usage in Morphs

### NameMorph.js Example

```javascript
import { LitElement, html, css } from 'lit';
import { globalStyles } from '../../styles/tokens.js';

export class NameMorph extends LitElement {
  static styles = [
    globalStyles,  // ← Import global tokens
    css`
      :host {
        display: inline-block;
        font-family: var(--font-family-base);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--perspective-color, var(--color-text-primary));
      }
      
      .name {
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        background: var(--color-bg-secondary);
        transition: all var(--transition-base);
      }
      
      .name:hover {
        background: var(--color-bg-tertiary);
        box-shadow: var(--shadow-md);
      }
    `
  ];
}
```

---

## Perspektiven-Farben

**12 Perspektiven mit eindeutigen Farben:**

| Perspective                   | Color Variable                          | Hex     |
|-------------------------------|----------------------------------------|---------|
| Taxonomy                      | `--color-taxonomy`                     | #ef4444 |
| Physical Characteristics      | `--color-physicalCharacteristics`      | #f97316 |
| Ecology & Habitat             | `--color-ecologyAndHabitat`            | #eab308 |
| Culinary & Nutritional        | `--color-culinaryAndNutritional`       | #22c55e |
| Medicinal & Health            | `--color-medicinalAndHealth`           | #06b6d4 |
| Cultivation & Processing      | `--color-cultivationAndProcessing`     | #3b82f6 |
| Safety & Identification       | `--color-safetyAndIdentification`      | #8b5cf6 |
| Chemical & Properties         | `--color-chemicalAndProperties`        | #ec4899 |
| Cultural & Historical         | `--color-culturalAndHistorical`        | #d946ef |
| Commercial & Market           | `--color-commercialAndMarket`          | #14b8a6 |
| Environmental & Conservation  | `--color-environmentalAndConservation` | #10b981 |
| Research & Innovation         | `--color-researchAndInnovation`        | #0ea5e9 |

---

## Dynamic Perspective Coloring

**Morphs können ihre Farbe dynamisch basierend auf ihrer Perspektive setzen:**

```javascript
export class TagMorph extends LitElement {
  static properties = {
    perspective: { type: String }
  };

  connectedCallback() {
    super.connectedCallback();
    this.updatePerspectiveColor();
  }

  updatePerspectiveColor() {
    const colorVar = `--color-${this.perspective}`;
    const color = getComputedStyle(this).getPropertyValue(colorVar);
    this.style.setProperty('--perspective-color', color);
  }

  static styles = [
    globalStyles,
    css`
      .tag {
        background: var(--perspective-color, #666);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-md);
      }
    `
  ];
}
```

---

## Best Practices

### ✅ DO:
- Import `globalStyles` in alle Morphs
- Use CSS Custom Properties für alle Farben, Spacing, etc.
- Nutze semantische Token-Namen (`--spacing-md`, nicht `16px`)
- Teste Morphs in **Shadow DOM** (Tokens funktionieren dort!)

### ❌ DON'T:
- Hardcode keine Farben oder Spacing-Werte
- Überschreibe keine Tokens außer für spezielle Anpassungen
- Vergiss nicht `globalStyles` zu importieren

---

## Erweiterungen

**Neue Tokens hinzufügen:**

1. **In tokens.js:**
```javascript
export const globalStyles = css`
  :host {
    /* Neue Token */
    --color-success: #10b981;
    --color-error: #ef4444;
    --color-warning: #f59e0b;
  }
`;
```

2. **In Morphs nutzen:**
```javascript
.success {
  color: var(--color-success);
}
```

3. **Alle Morphs haben sofort Zugriff!** 🎉

---

## Migration Notes (2025-11-18)

**Alte Pfade:**
- ❌ `../../arch/styles/tokens.js` (vor Refactor)

**Neue Pfade:**
- ✅ `../../styles/tokens.js` (von morphs/data/)
- ✅ `../styles/tokens.js` (von morphs/global/)
- ✅ `../shared/styles/tokens.js` (von core/ oder features/)

**Alle Imports wurden aktualisiert! ✅**
