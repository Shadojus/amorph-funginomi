# 📝 AMORPH Funginomi - Project Documentation

**Last Updated:** 17. November 2025

## 🎯 Ziel

Alle CLAUDE.md Dateien auf dem neuesten Stand:
- ✅ **Jungfräulich** - Für neue Claude-Sessions verständlich
- ✅ **Vollständig** - Keine Details der Implementierung verloren
- ✅ **Akkurat** - Exakte Schema-Feldnamen dokumentiert

---

## 🔥 Latest Changes (2025-11-17)

### 1. ⭐ Smart Search System (MAJOR UPDATE!)

**SearchReactor.js Improvements:**
- ✅ **Word boundary matching** - Präzise Start-of-Word Suche (`\b${query}`)
- ✅ **Minimum query length** - 2 Zeichen minimum (verhindert Spam)
- ✅ **Container-based filtering** - Versteckt ganze `.fungus-card` statt einzelner Morphs
- ✅ **fungus-data attribute reading** - Liest JSON-Daten von inaktiven Perspektiven
- ✅ **Field-to-Perspective mapping** - 26+ Feld-Mappings (secondaryMetabolites → chemicalAndProperties)
- ✅ **Nested object navigation** - getNestedValue() mit Dot-Notation Support
- ✅ **Auto-perspective detection** - Tracked welche Felder gematcht wurden
- ✅ **Event publishing** - Publishes `search:completed` mit matchedPerspectives Array

**Performance:**
- 150ms debounce für Search Execution
- 400ms debounce für Auto-Perspective Switching
- Word boundary regex prevents false matches
- Container filtering: O(n) vs O(n*m)

### 2. ⭐ Auto-Perspective Switching (NEW!)

**MorphHeader.js Auto-Activation:**
- ✅ **Listens to search:completed events** from SearchReactor
- ✅ **400ms debounce** - Prevents switching while user is typing
- ✅ **Only switches when user pauses** - Smooth UX
- ✅ **Duplicate prevention** - Checks if perspective already active
- ✅ **FIFO management** - Removes oldest when adding 5th perspective

**Flow:**
1. User types "peptide" → Search finds match in secondaryMetabolites field
2. SearchReactor maps field to perspective: secondaryMetabolites → chemicalAndProperties
3. SearchReactor publishes `search:completed` event with matchedPerspectives array
4. MorphHeader receives event, starts 400ms timer
5. User stops typing → Timer fires → chemicalAndProperties perspective auto-activates!

### 3. 🔧 Event System Fix (CRITICAL!)

**AmorphSystem.js Event Namespace:**
- ✅ **Fixed event listener registration** - Event names now WITHOUT `amorph:` prefix
- ✅ **emit() adds prefix internally** - Consistent behavior
- ✅ **streamPublish() strips prefix** - Proper fallback to emit()
- ✅ **on()/off() use names without prefix** - Correct listener lookup

**Before (BROKEN):**
```javascript
// ❌ This didn't work!
amorph.on('amorph:search:completed', callback);
```

**After (FIXED):**
```javascript
// ✅ This works!
amorph.on('search:completed', callback);
```

---

## 🔄 Previous Changes (2025-11-16)

### 1. MorphHeader.js Vereinfachung
- ❌ **Entfernt:** Reactor Toggles (Glow, Search, Animation)
- ❌ **Entfernt:** View Mode Switcher (Grid, List, Compact)
- ❌ **Entfernt:** BubbleView Controls
- ✅ **Fokus:** Search Bar + 12 Perspektiven-Buttons (FIFO max 4)

### 2. 🆕 PerspectiveReactor System
- ✅ **PerspectiveReactor.js** - Smart morph filtering based on perspectives
- ✅ **TAG_TO_PERSPECTIVE** - 80+ tag mappings for auto-activation
- ✅ **PERSPECTIVE_CONFIG** - 12 perspective configurations
- ✅ **Event-driven** - Listens to perspective-changed events
- ✅ **Lightweight** - Pure CSS, dim irrelevant morphs (don't hide!)
- ✅ **Color consistency** - Tags keep colors, perspectives as border/shadow

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

### 2. Event-System Konvention (CRITICAL!)

```javascript
// ✅ KORREKT - Event Namen OHNE 'amorph:' Prefix:
amorph.on('search:completed', callback);
amorph.emit('search:completed', data);
amorph.streamPublish('search:completed', data);

// ❌ FALSCH - NIEMALS 'amorph:' Prefix verwenden:
amorph.on('amorph:search:completed', callback); // BROKEN!

// Grund: emit() fügt 'amorph:' intern hinzu!
// emit() nutzt eventName für Listener-Lookup (ohne Prefix)
// emit() nutzt 'amorph:' + eventName für CustomEvent (mit Prefix)
```

### 3. Search Field-to-Perspective Mapping

```javascript
// Beispiele aus fieldToPerspectiveMap:
'secondaryMetabolites' → 'chemicalAndProperties'
'nutritionalValue' → 'culinaryAndNutritional'
'medicinalProperties' → 'medicinalAndHealth'
'kingdom' → 'taxonomy'
'edibility' → 'safetyAndIdentification'

// Insgesamt 26+ Feld-Mappings!
```

### 4. Search Features

```javascript
// Word boundary matching:
const regex = new RegExp(`\\b${query}`, 'i');

// fungus-data attribute reading:
const fungusData = JSON.parse(morph.getAttribute('fungus-data'));

// Nested object navigation:
const value = this.getNestedValue(fungusData, 'taxonomy.kingdom');

// Container-based filtering:
document.querySelectorAll('.fungus-card').forEach(container => {
  container.style.display = hasMatch ? '' : 'none';
});
```

### 5. Auto-Perspective Switching

```javascript
// 400ms debounce in MorphHeader:
this.autoSwitchTimer = setTimeout(() => {
  // Activate perspectives
}, 400);

// Event flow:
SearchReactor → publishes 'search:completed' with matchedPerspectives
     ↓
MorphHeader → receives event → starts 400ms timer
     ↓
User stops typing → Timer fires → Perspectives auto-activate!
```

### 6. PerspectiveHost Architektur

```
Detail-Seite
  └── 12 x <perspective-host perspective="...">
        └── Deep Recursive Morphs
```

### 7. FIFO-Logik (Max 4)

```javascript
if (activePerspectives.length >= 4) {
  activePerspectives = activePerspectives.slice(1); // Remove oldest
}
```

### 8. Deep Recursion

```javascript
flattenObject(obj, prefix='', maxDepth=5, currentDepth=0)
renderField(field, depth=0)
// Visual hierarchy: margin-left: ${depth * 1}rem
```

---

## 🚀 Status

**HAUPTZIEL ERREICHT:** ✅

**Production-Ready Features:**
- ✅ Smart Search with Auto-Perspective Switching
- ✅ Debounced interactions (150ms search, 400ms auto-switch)
- ✅ Field-to-Perspective mapping (26+ fields)
- ✅ Word boundary matching for precision
- ✅ Container-based filtering
- ✅ fungus-data attribute reading for inactive perspectives
- ✅ Event system with consistent namespace
- ✅ FIFO perspective management (max 4)
- ✅ Smooth UX with debouncing

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
