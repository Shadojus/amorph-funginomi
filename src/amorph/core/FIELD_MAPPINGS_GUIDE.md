# 🎯 Zentralisiertes Field Mapping System

## Überblick

Das Schema hat sich geändert und die Field Mappings waren über mehrere Dateien verteilt. Das ist jetzt **GELÖST**! 🎉

Es gibt jetzt ein **zentrales, einziges System** für alle Field-zu-Perspektive Mappings:

```
src/amorph/core/perspectiveFieldMappings.ts      ← JavaScript Version
src/amorph/core/perspectiveFieldMappings.astro   ← Astro Version
```

## ⚡ Das Problem (gelöst)

**Vorher:** Wenn sich das Datenbankschema änderte, mussten folgende Dateien manuell aktualisiert werden:

```
❌ src/amorph/features/perspective-system/PerspectiveCard.js
❌ src/amorph/features/bubble-view/morphs/BubbleMorph.js
❌ src/pages/fungi/index.astro
❌ src/amorph/core/domain.config.js
❌ + jede andere Komponente mit hardcodiertem Mappings
```

## ✅ Die Lösung

**Jetzt:** Es gibt nur EINE Quelle:

```
✅ src/amorph/core/perspectiveFieldMappings.ts
   └─ Enthält ALLE Mappings
   └─ Wird von allen Komponenten importiert
   └─ Änderungen wirken sich überall aus
```

## 📋 Was wird gemappt?

Das System definiert drei Arten von Mappings:

### 1. **perspectiveSchemaFields** - Schema-Ebene
```javascript
'culinaryAndNutritional': {
  schemaField: 'culinaryAndNutritional',
  displayFields: [
    'edibilityRating',
    'tasteProfile',
    'texture',
    'preparationMethods'
  ]
}
```

### 2. **perspectiveDisplayFields** - Display-Ebene (UI)
```javascript
'culinaryAndNutritional': [
  'culinaryAndNutritional.edibilityRating',
  'culinaryAndNutritional.tasteProfile',
  'culinaryAndNutritional.texture',
  'culinaryAndNutritional.preparationMethods'
]
```

### 3. **fieldToPerspectiveIndex** - Schneller Lookup
```javascript
'edibilityRating': 'culinaryAndNutritional',
'tasteProfile': 'culinaryAndNutritional',
'toxicity': 'safetyAndIdentification',
// ... usw.
```

## 🔄 Welche Komponenten nutzen es?

| Komponente | Nutzt | Grund |
|-----------|------|-------|
| `PerspectiveCard.js` | `perspectiveSchemaFields` | Zeigt Felder pro Perspektive an |
| `BubbleMorph.js` | `perspectiveDisplayFields` | Wählt Felder für Bubble-Display |
| `index.astro` | `perspectiveDisplayFields` | Steuert Feld-Sichtbarkeit |
| `DataMorph.js` | Alle drei | Flexible Feld-Extraktion |
| `domain.config.js` | `fieldToPerspectiveIndex` | Auto-Perspective-Switching |
| `AmorphSystem.js` | `fieldToPerspectiveIndex` | Globale Perspektive-Verwaltung |

## 🛠️ Wie man es nutzt

### Wenn sich das Schema ändert:

**Schritt 1:** Öffne `perspectiveFieldMappings.ts`

**Schritt 2:** Update die Mappings
```javascript
'newPerspective': {
  schemaField: 'newPerspective',
  displayFields: ['newField1', 'newField2']
}
```

**Schritt 3:** Ergänze die Display-Felder
```javascript
'newPerspective': [
  'newPerspective.newField1',
  'newPerspective.newField2'
]
```

**Schritt 4:** Ergänze den Lookup-Index
```javascript
'newField1': 'newPerspective',
'newField2': 'newPerspective'
```

**FERTIG!** ✅ Alle Komponenten bekommen automatisch die neuen Mappings!

### In JavaScript-Komponenten:

```javascript
import { 
  perspectiveDisplayFields,
  perspectiveSchemaFields,
  getFieldsForPerspective,
  getPerspectiveForField
} from '../../core/perspectiveFieldMappings.ts';

// Feld für Perspektive abrufen
const fields = getFieldsForPerspective('culinaryAndNutritional');

// Perspektive für Feld finden
const perspective = getPerspectiveForField('edibilityRating');
```

### In Astro-Komponenten:

```astro
---
import { perspectiveDisplayFields } from '@/amorph/core/perspectiveFieldMappings.astro';

const fieldMap = perspectiveDisplayFields;
---
```

## 📊 Perspektiven-Übersicht

Das System definiert automatisch diese Perspektiven:

```
🍳 culinaryAndNutritional      - Kulinarische Verwendung
⚕️  medicinalAndHealth          - Heilkräfte & Medizin
🧪 chemicalAndProperties       - Chemische Zusammensetzung
🌍 ecologyAndDistribution      - Ökologie & Verbreitung
⚠️  safetyAndIdentification    - Sicherheit & ID
🌱 cultivationAndGrowing       - Anbau & Zucht
🔬 taxonomy                    - Wissenschaftliche Klassifikation
📚 historicalAndCultural       - Geschichte & Kultur
💼 commercialAndMarket         - Handel & Markt
🌿 environmentalAndConservation - Umwelt & Schutz
🔬 researchAndInnovation       - Forschung & Innovation
🔍 morphologyAndAnatomy        - Physische Merkmale
```

## 🎓 Technische Details

### Import-Pfade

**JavaScript/TypeScript:**
```javascript
import from '../../core/perspectiveFieldMappings.ts'
import from '@/amorph/core/perspectiveFieldMappings.ts' // mit Alias
```

**Astro:**
```astro
import from '@/amorph/core/perspectiveFieldMappings.astro'
```

### Verfügbare Funktionen

```javascript
// Hilfsfunktionen
getFieldsForPerspective(perspectiveId)      // Array von Display-Fields
getPerspectiveForField(fieldName)           // Perspektive-ID oder null
getSchemaFieldForPerspective(perspectiveId) // Schema-Feldname
getAllPerspectiveIds()                      // Array aller Perspektiven
getLegacyPerspectiveFieldMap()              // Backward-Compat (deprecated)
```

## 🔍 Debugging

### Alle Perspektiven anschauen:
```javascript
import { perspectiveSchemaFields } from '...';
console.log(Object.keys(perspectiveSchemaFields));
// ['culinaryAndNutritional', 'medicinalAndHealth', ...]
```

### Felder für Perspektive:
```javascript
import { perspectiveDisplayFields } from '...';
console.log(perspectiveDisplayFields['culinaryAndNutritional']);
// ['culinaryAndNutritional.edibilityRating', ...]
```

### Welche Perspektive hat ein Feld?
```javascript
import { fieldToPerspectiveIndex } from '...';
console.log(fieldToPerspectiveIndex['toxicity']);
// 'safetyAndIdentification'
```

## ✨ Vorher vs. Nachher

### ❌ VORHER (mehrere Stellen)
```javascript
// PerspectiveCard.js
if (perspectiveName === 'culinaryAndNutritional') {
  if (perspectiveData.edibility) { ... }
  if (perspectiveData.taste) { ... }
}

// BubbleMorph.js
const perspectiveFieldMap = {
  'culinaryAndNutritional': ['culinaryAndNutritional.flavorProfile', ...]
}

// index.astro
const perspectiveFieldMap = {
  'culinaryAndNutritional': ['culinaryAndNutritional.preparationMethods', ...]
}
```

### ✅ NACHHER (eine Stelle)
```javascript
// perspectiveFieldMappings.ts
export const perspectiveSchemaFields = {
  'culinaryAndNutritional': {
    displayFields: ['edibilityRating', 'taste', ...]
  }
}

export const perspectiveDisplayFields = {
  'culinaryAndNutritional': [
    'culinaryAndNutritional.edibilityRating',
    'culinaryAndNutritional.tasteProfile',
    ...
  ]
}

// Alle Komponenten importieren einfach:
import { perspectiveDisplayFields } from '...';
const fields = perspectiveDisplayFields['culinaryAndNutritional'];
```

## 🎯 Best Practices

1. **Immer das zentrale System nutzen**
   - Nicht hardcoden in einzelnen Komponenten
   - Importiere stets aus `perspectiveFieldMappings.ts`

2. **Bei Schema-Änderungen**
   - Nur `perspectiveFieldMappings.ts` aktualisieren
   - Alle anderen Dateien brauchen keine Änderungen

3. **Neue Perspektiven hinzufügen**
   - Füge in alle drei Mappings ein
   - `perspectiveSchemaFields`
   - `perspectiveDisplayFields`
   - `fieldToPerspectiveIndex`

4. **Testing**
   - Prüfe, ob neue Felder in allen drei Mappings sind
   - Kein Feld sollte "verloren gehen"

## 📞 Fragen?

Die Mappings sind dokumentiert in:
- `perspectiveFieldMappings.ts` - Hauptdatei
- `perspectiveFieldMappings.astro` - Astro-Version
- `domain.config.js` - Verweist auf die zentrale Datei
- Diese Datei - Dokumentation

Alle wichtigen Komponenten haben auch Kommentare, die auf die zentrale Datei hinweisen! 🎯
