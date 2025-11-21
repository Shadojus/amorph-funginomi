# 🗺️ MORPH MAPPER SYSTEM

**Last Updated:** 21. November 2025

## Overview

Das **MorphMapper System** wählt automatisch den richtigen Morph-Typ basierend auf:
1. **Feldnamen** (exakt oder Pattern-basiert)
2. **Datentyp** (string, number, boolean, array, object)
3. **Inhaltsstruktur** (URLs, Dates, nested objects)
4. **Priorität** für Rendering-Reihenfolge

## Verfügbare Morphs

### 1. NameMorph
**Für:** Namen, Titel, Identifikatoren
- `commonName`, `latinName`, `scientificName`
- Alle Felder die mit "Name" oder "Title" enden
- Taxonomie: `genus`, `species`, `family`

**Rendering:** Große, hervorgehobene Schrift

### 2. ImageMorph
**Für:** Bilder, URLs
- `imageUrl`, `imageUrls`, `images`
- Alle Felder mit "Image", "Photo", "Picture"
- URLs mit Bild-Extensions (.jpg, .png, etc.)

**Rendering:** Bild-Galerie oder Einzelbild

### 3. TagMorph
**Für:** Tags, Kategorien, kurze Listen
- `tags`, `categories`, `keywords`
- `edibility`, `toxicityLevel`, `habitat`
- Arrays mit kurzen Strings (<30 Zeichen)
- Felder mit "Color" im Namen

**Rendering:** Farbige Pills/Badges

### 4. TextMorph
**Für:** Beschreibungen, lange Texte
- `description`, `details`, `notes`, `summary`
- Strings >50 Zeichen oder mit Zeilenumbrüchen

**Rendering:** Formatierter Text-Block

### 5. BooleanMorph
**Für:** Ja/Nein Werte
- `edible`, `toxic`, `medicinal`, `cultivated`
- Alle Felder die mit `is` oder `has` beginnen
- Boolean-Werte

**Rendering:** Checkbox oder Toggle

### 6. NumberMorph
**Für:** Zahlen, Messungen
- `diameter`, `length`, `width`, `height`, `weight`
- `price`, `count`, `quantity`
- Number-Werte

**Rendering:** Formatierte Zahl mit Einheit

### 7. ListMorph
**Für:** Listen, Arrays
- Arrays mit langen Strings
- Arrays mit Objects
- Strukturierte Listen

**Rendering:** Aufzählung oder Tabelle

### 8. DataMorph
**Für:** Nested Objects, komplexe Strukturen
- `taxonomy`, `physicalCharacteristics`
- Objekte mit mehreren Eigenschaften

**Rendering:** Rekursives Rendering aller Sub-Felder

### 9. TimelineMorph
**Für:** Zeitangaben, Datum
- `createdAt`, `updatedAt`, `publishedAt`
- `seasonality`, Date-Objekte
- ISO Date Strings

**Rendering:** Formatiertes Datum/Timeline

### 10. ChartMorph
**Für:** Zahlen-Arrays, Statistiken
- Arrays mit Number-Werten
- Messreihen, Statistiken

**Rendering:** Chart/Graph Visualisierung

### 11. MapMorph
**Für:** Geo-Koordinaten
- Objekte mit `lat`/`lng` oder `latitude`/`longitude`
- Standort-Daten

**Rendering:** Karte mit Marker

## Mapping-Strategie

### 1. Exact Match (Höchste Priorität)
```javascript
exactMappings = {
  'commonName': 'name-morph',
  'imageUrl': 'image-morph',
  'edibility': 'tag-morph',
  // ...
}
```

### 2. Pattern Match
```javascript
/Name$/i → 'name-morph'
/Image$/i → 'image-morph'
/Color$/i → 'tag-morph'
/^is[A-Z]/ → 'boolean-morph'
```

### 3. Value Analysis
```javascript
typeof value === 'boolean' → 'boolean-morph'
typeof value === 'number' → 'number-morph'
Array.isArray(value) → 'tag-morph' oder 'list-morph'
```

### 4. Content Structure
```javascript
URL mit .jpg/.png → 'image-morph'
ISO Date String → 'timeline-morph'
Objekt mit lat/lng → 'map-morph'
```

## Prioritäts-System

Felder werden nach Priorität sortiert:

**Highest (1000-900):**
- `commonName`: 1000
- `latinName`: 950
- `imageUrl`: 900

**High (900-800):**
- `description`: 850
- `edibility`: 800
- `toxicityLevel`: 790

**Medium (800-600):**
- `habitat`: 780
- `taxonomy`: 700
- `genus`: 690

**Lower (600-400):**
- `physicalCharacteristics`: 500

**Lowest (400-100):**
- `createdAt`: 100
- `updatedAt`: 90

## Usage

### Server-Side (Astro)

```astro
---
import { morphMapper } from '@/amorph/features/grid-view/MorphMapper.js';

const fields = morphMapper.getMappedFields(fungus);
---

{fields.map(field => {
  const Element = field.morphType;
  return (
    <Element
      fungus-data={JSON.stringify(fungus)}
      field={field.fullPath}
      data-priority={field.priority}
    />
  );
})}
```

### Client-Side (JavaScript)

```javascript
import { morphMapper } from '/src/amorph/features/grid-view/MorphMapper.js';

// Einzelnes Feld mappen
const morphType = morphMapper.getMorphType('commonName', 'Shiitake');
// → 'name-morph'

// Alle Felder mappen
const fields = morphMapper.getMappedFields(fungusData);
// → [{ fieldName, morphType, value, priority, fullPath }, ...]

// Element erstellen
const element = morphMapper.createMorphElement(fields[0], fungusData);
document.body.appendChild(element);
```

### Globaler Zugriff

```javascript
// Verfügbar als window.amorph.morphMapper
const mapper = window.amorph.morphMapper;

const morphType = mapper.getMorphType('edibility', 'edible');
// → 'tag-morph'
```

## Konfiguration

### Custom Mappings hinzufügen

```javascript
// Eigene Exact Mappings
morphMapper.exactMappings['myCustomField'] = 'custom-morph';

// Eigene Pattern Mappings
morphMapper.patternMappings.push({
  pattern: /Special$/i,
  morph: 'special-morph'
});
```

### Custom Prioritäten

```javascript
const priority = morphMapper.getFieldPriority('myField');
// Oder überschreiben für spezielle Fälle
```

## Beispiele

### Beispiel 1: Fungi Card
```javascript
const fungus = {
  commonName: "Shiitake",
  latinName: "Lentinula edodes",
  imageUrl: "/images/shiitake.jpg",
  edibility: "edible",
  description: "Popular cultivated mushroom...",
  taxonomy: {
    genus: "Lentinula",
    species: "edodes"
  }
};

const fields = morphMapper.getMappedFields(fungus);
// → [
//   { fieldName: 'commonName', morphType: 'name-morph', priority: 1000 },
//   { fieldName: 'latinName', morphType: 'name-morph', priority: 950 },
//   { fieldName: 'imageUrl', morphType: 'image-morph', priority: 900 },
//   { fieldName: 'description', morphType: 'text-morph', priority: 850 },
//   { fieldName: 'edibility', morphType: 'tag-morph', priority: 800 },
//   ...
// ]
```

### Beispiel 2: Custom Field
```javascript
const unknownField = {
  fieldName: 'customMetric',
  value: 42.5
};

const morphType = morphMapper.getMorphType('customMetric', 42.5);
// → 'number-morph' (based on value type)
```

## Integration mit AMORPH System

Der MorphMapper ist Teil des AMORPH Systems und wird automatisch bei `init.js` geladen:

```javascript
// In core/init.js
import { morphMapper } from '../features/grid-view/MorphMapper.js';
window.amorph.morphMapper = morphMapper;
```

Alle Morphs registrieren sich automatisch bei `window.amorph` wenn sie geladen werden.

## Best Practices

1. **Nutze getMappedFields()** für komplette Objekte
2. **Setze Prioritäten** für wichtige Felder
3. **Begrenze Anzahl** auf 8-10 Felder pro Card
4. **Teste neue Felder** mit getMorphType()
5. **Erweitere Mappings** für Domain-spezifische Felder

## Performance

- **Exact Match:** O(1) - Sofortige Lookup
- **Pattern Match:** O(n) - n = Anzahl Patterns (schnell)
- **Value Analysis:** O(1) - Typ-Check
- **getMappedFields():** O(m) - m = Anzahl Felder

**Typical:** ~0.1ms für 20 Felder

## Architecture

```
grid-view/
├── MorphMapper.js           # Intelligent morph type selection
├── morphs/                  # All available morphs
│   ├── NameMorph.js
│   ├── ImageMorph.js
│   ├── TagMorph.js
│   ├── TextMorph.js
│   ├── BooleanMorph.js
│   ├── NumberMorph.js
│   ├── ListMorph.js
│   ├── DataMorph.js
│   ├── ChartMorph.js
│   ├── MapMorph.js
│   └── TimelineMorph.js
└── CLAUDE.md
```

## Related

- **grid-view/morphs/** - All morph implementations
- **core/init.js** - System initialization
- **pages/fungi/index.astro** - Usage example
