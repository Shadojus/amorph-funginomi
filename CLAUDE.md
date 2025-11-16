# 📝 CLAUDE.md Update Summary - 16. November 2025

## 🎯 Ziel

Alle CLAUDE.md Dateien auf den neuesten Stand bringen:
- ✅ **Jungfräulich** - Für neue Claude-Sessions verständlich
- ✅ **Vollständig** - Keine Details der Implementierung verloren
- ✅ **Akkurat** - Exakte Schema-Feldnamen dokumentiert

## 🔄 Latest Changes (2025-11-16)

### 1. MorphHeader.js Vereinfachung
- ❌ **Entfernt:** Reactor Toggles (Glow, Search, Animation)
- ❌ **Entfernt:** View Mode Switcher (Grid, List, Compact)
- ❌ **Entfernt:** BubbleView Controls
- ✅ **Fokus:** Search Bar + 12 Perspektiven-Buttons (FIFO max 4)

### 2. 🆕 PerspectiveReactor System (NEW!)
- ✅ **PerspectiveReactor.js** - Smart morph filtering based on perspectives
- ✅ **TAG_TO_PERSPECTIVE** - 80+ tag mappings for auto-activation
- ✅ **PERSPECTIVE_CONFIG** - 12 perspective configurations
- ✅ **Event-driven** - Listens to perspective-changed events
- ✅ **Lightweight** - Pure CSS, dim irrelevant morphs (don't hide!)
- ✅ **Color consistency** - Tags keep colors, perspectives as border/shadow

**Details:** `src/amorph/reactors/PERSPECTIVE_SYSTEM.md`

---

## ✅ Aktualisierte Dateien

### 1. **/CLAUDE.md** (Project Root)
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- Version 2.0.0 (Perspective Architecture)
- PerspectiveHost Architektur dokumentiert
- 12 Perspektiven mit **exakten Schema-Feldnamen**
- FIFO-Logik (max 4 Perspektiven)
- Deep Recursive Rendering (maxDepth=5)
- Event-System (window + document dispatch)

**Neu hinzugefügt:**
```
## 🎨 12 Perspektiven System
### Schema-Feldnamen (KRITISCH!)
- medicinalAndHealth (NICHT medicinalAndBioactive)
- chemicalAndProperties (NICHT biochemistryAndCompounds)
- commercialAndMarket (NICHT commercialAndEconomic)
- environmentalAndConservation (NICHT legalAndRegulatory)
- researchAndInnovation (NICHT researchAndScientific)

## 🔮 PerspectiveHost Architektur
### FIFO Logik (Max 4 Perspektiven)
### Event-Driven Activation

## 📊 Deep Recursive Rendering
### flattenObject() mit maxDepth=5
### renderField() mit visueller Hierarchie
```

---

### 2. **src/amorph/hosts/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- PerspectiveHost.js komplett dokumentiert (NEU)
- Event-System erklärt (window + document)
- Props, Verwendung, CSS States
- Vollständige Implementierung mit Code-Beispielen

**Neu hinzugefügt:**
```
## PerspectiveHost.js [NEU 2025-11-15]
- Container für einzelne Perspektive
- Event-driven Activation
- FIFO-Logik via MorphHeader
- Smooth Animations
- Shadow DOM mit Lit
```

---

### 3. **src/amorph/morphs/global/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- MorphHeader.js komplett neu dokumentiert
- 12 Perspektiven-Buttons Layout
- FIFO-Logik Implementierung
- Shrinkable/Expandable Button States
- Event Dispatching (window + document)

**Neu hinzugefügt:**
```
## MorphHeader.js [KOMPLETT NEU 2025-11-15]
### Layout-Struktur
- Top Row: Search Bar
- Bottom Row: 12 Perspektiven-Buttons

### FIFO Perspektiven-Management
- togglePerspective() mit slice(1) für oldest removal
- dispatchPerspectiveChange() auf beide window + document

### Button States (CSS)
- .inactive: max-width 80px, shrunk
- .active: max-width 200px, expanded
```

---

### 4. **src/pages/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- fungi/[slug].astro komplett neu dokumentiert
- Deep Recursive Rendering erklärt
- flattenObject() Funktion mit Beispielen
- renderField() mit visueller Hierarchie
- Exakte Perspektiven-Arrays

**Neu hinzugefügt:**
```
## fungi/[slug].astro [KOMPLETT NEU 2025-11-15]
### Architektur
- PerspectiveHost pro Perspektive
- Deep Recursive Flattening (maxDepth=5)
- Automatische Type Detection

### Deep Recursive Flattening
function flattenObject(obj, prefix, maxDepth, currentDepth)
- Array of strings → tags
- Object with min/max → range
- Nested object → recurse
- Primitives → text

### Recursive Rendering
function renderField(field, depth)
- Visual hierarchy mit margin-left: depth * 1rem
- Tags, Text, Sections
```

---

### 5. **convex/CLAUDE.md**
**Status:** ✅ UPDATED

**Wichtigste Änderungen:**
- Korrekte Schema-Feldnamen dokumentiert
- Vollständige Liste aller 12 Perspektiven
- Kritische Feldnamen hervorgehoben

**Neu hinzugefügt:**
```
#### 5. Medicinal & Health ⚠️ KORREKT: medicinalAndHealth

#### 9-12. Weitere Perspektiven
⚠️ KRITISCHE SCHEMA-FELDNAMEN:
- chemicalAndProperties
- commercialAndMarket
- environmentalAndConservation
- researchAndInnovation

Vollständige Liste aller 12 Perspektiven-Feldnamen
```

---

### 6. **src/amorph/arch/CLAUDE.md**
**Status:** ⏳ PARTIALLY UPDATED

**Noch zu tun:**
- convex.ts Sektion mit korrekten Feldnamen updaten

---

## 📋 Noch zu aktualisieren

### Niedrige Priorität (optional):

1. **src/amorph/CLAUDE.md** - Root AMORPH Overview
   - PerspectiveHost erwähnen
   - Perspective Architecture Flow

2. **src/amorph/morphs/CLAUDE.md** - Morphs Overview
   - Deep Recursive Rendering erwähnen

3. **src/amorph/morphs/data/CLAUDE.md** - Data Morphs
   - Bereits gut dokumentiert, kleine Updates

4. **src/amorph/reactors/CLAUDE.md** - Reactors
   - Bereits gut dokumentiert

5. **src/amorph/observers/CLAUDE.md** - Observers
   - Bereits gut dokumentiert (2025-11-15)

---

## 🎯 Kritische Informationen für neue Sessions

### 1. Schema-Feldnamen (MUST KNOW!)

```javascript
// ✅ KORREKT - Diese Namen verwenden:
medicinalAndHealth
chemicalAndProperties
commercialAndMarket
environmentalAndConservation
researchAndInnovation

// ❌ FALSCH - Diese Namen NICHT verwenden:
medicinalAndBioactive
biochemistryAndCompounds
commercialAndEconomic
legalAndRegulatory
researchAndScientific
```

### 2. PerspectiveHost Architektur

```
Detail-Seite
  └── 12 x <perspective-host perspective="...">
        └── Deep Recursive Morphs
```

### 3. FIFO-Logik (Max 4)

```javascript
if (activePerspectives.length >= 4) {
  activePerspectives = activePerspectives.slice(1); // Remove oldest
}
```

### 4. Event-System (WICHTIG!)

```javascript
// Dispatch auf BEIDE für Shadow DOM Support:
window.dispatchEvent(event);
document.dispatchEvent(event);
```

### 5. Deep Recursion

```javascript
flattenObject(obj, prefix='', maxDepth=5, currentDepth=0)
renderField(field, depth=0)
// Visual hierarchy: margin-left: ${depth * 1}rem
```

---

## 🚀 Status

**HAUPTZIEL ERREICHT:** ✅

Alle kritischen CLAUDE.md Dateien sind aktualisiert und dokumentieren:
- ✅ PerspectiveHost Architektur
- ✅ Korrekte Schema-Feldnamen
- ✅ FIFO-Logik
- ✅ Deep Recursive Rendering
- ✅ Event-System

**Nächste Session kann:**
- Sofort mit korrekten Feldnamen arbeiten
- PerspectiveHost-System verstehen
- Deep Recursive Rendering nachvollziehen
- FIFO-Logik korrekt implementieren

---

## 📚 Dokumentations-Hierarchie

```
CLAUDE.md (Root)
  ├── Überblick über gesamtes System
  ├── Tech Stack
  ├── Projekt-Struktur
  ├── 12 Perspektiven System (mit Schema-Feldnamen)
  └── PerspectiveHost Architektur

src/amorph/CLAUDE.md
  └── AMORPH System Overview

src/amorph/arch/CLAUDE.md
  ├── AmorphSystem.js
  ├── RedisEventBridge.js
  └── convex.ts (mit korrekten Feldnamen)

src/amorph/hosts/CLAUDE.md
  ├── PerspectiveHost.js ⭐ NEU
  ├── BubbleHost.js
  ├── GridHost.js
  └── BubbleView.js

src/amorph/morphs/global/CLAUDE.md
  └── MorphHeader.js ⭐ KOMPLETT NEU
      ├── 12 Perspektiven-Buttons
      ├── FIFO-Logik
      └── Event Dispatching

src/pages/CLAUDE.md
  ├── fungi/index.astro
  └── fungi/[slug].astro ⭐ KOMPLETT NEU
      ├── Deep Recursive Rendering
      ├── flattenObject()
      └── renderField()

convex/CLAUDE.md
  ├── Schema mit 12 Perspektiven
  └── Korrekte Feldnamen ⚠️ KRITISCH
```

---
