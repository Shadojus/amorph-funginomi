# 🗄️ CONVEX - Database & Backend (Funginomi Instance)

**Last Updated:** 22. November 2025

**⚠️ DOMAIN-SPECIFIC:** Dieses Schema ist **Funginomi-spezifisch** (Pilze). Das AMORPH Framework selbst ist domain-agnostisch. Andere Instanzen (Phytonomi für Pflanzen, etc.) haben ihre eigenen Schemas mit unterschiedlichen Feldern, aber die gleiche AMORPH-Architektur.

## Structure

```
convex/
├── fungi.ts                      # Fungi queries & mutations
├── schema.ts                     # Database schema definition
├── seed.ts                       # Main seed orchestrator
├── seed_beauveria_bassiana.ts    # Beauveria bassiana data
├── seed_cordyceps_militaris.ts   # Cordyceps militaris data
├── seed_fomitopsis_betulina.ts   # Fomitopsis betulina data
├── seed_hericium_erinaceus.ts    # Hericium erinaceus data
├── seed_hypsizygus_tessellatus.ts # Hypsizygus tessellatus data
├── seed_pholiota_adiposa.ts      # Pholiota adiposa data
├── tsconfig.json                 # TypeScript config
├── _generated/                   # Auto-generated Convex files
│   ├── api.d.ts
│   ├── api.js
│   ├── dataModel.d.ts
│   ├── server.d.ts
│   └── server.js
└── CLAUDE.md                     # This file
```

## Übersicht

Convex Backend für Funginomi AMORPH:
- ✅ **Schema**: Vollständiges Pilz-Datenmodell (1155 Zeilen!)
- ✅ **Queries**: fungi.ts mit allen Abfrage-Funktionen
- ✅ **Seed Scripts**: 6 Beispiel-Pilze (Beauveria, Cordyceps, Fomitopsis, Hericium, Hypsizygus, Pholiota)
- ✅ **Local Backend**: Läuft lokal mit `npx convex dev`

---

## Architektur

```
Convex Local Backend (Node.js)
    ↓
Schema (fungi table)
    ↓
Queries (list, getById, getBySlug, search)
    ↓
Astro Pages (SSR)
    ↓
AMORPH Morphs (Client)
```

---

## schema.ts

### NOEMI-Enhanced Convex Schema v3.0

**Komplexeste Schema der App** (1155 Zeilen):
- Zentrale `fungi` Tabelle mit **allen** Datenfeldern
- 12 Perspektiven vollständig modelliert
- Rich Citations & Source Tracking
- Optimiert für schnelle Queries UND tiefe Analyse

### Hauptbereiche

#### 1. **Core Identity**
```typescript
{
  commonName: string,
  latinName: string,
  scientificNameSynonyms: string[],
  commonNameVariants: string[],
  seoName: string // URL slug
}
```

#### 2. **Taxonomy**
```typescript
taxonomy: {
  kingdom: string,    // Fungi
  phylum: string,     // Basidiomycota
  class: string,      // Agaricomycetes
  order: string,      // Agaricales
  family: string,     // Agaricaceae
  genus: string,      // Agaricus
  species: string     // subrufescens
}
```

#### 3. **Physical Characteristics**
```typescript
physicalCharacteristics: {
  // Cap (Pileus)
  capShape: string[],
  capDiameter: { min: number, max: number, unit: string },
  capColor: string[],
  capTexture: string[],
  capMargin: string,
  capSurface: string,
  
  // Hymenophore (Gills/Pores)
  hymenophoreType: string,
  gillAttachment: string,
  gillSpacing: string,
  gillColor: string[],
  
  // Stipe (Stem)
  stipeLength: { min: number, max: number, unit: string },
  stipeDiameter: { min: number, max: number, unit: string },
  stipeColor: string[],
  stipeTexture: string,
  
  // Spores
  sporePrintColor: string,
  sporeSize: { length, width, unit },
  sporeShape: string,
  
  // Other
  veil: string,
  ring: string,
  volva: string,
  odor: string[],
  taste: string,
  latex: string,
  staining: string
}
```

#### 4. **Culinary & Nutritional** (Perspektive 1)
```typescript
culinaryAndNutritional: {
  edibilityRating: string,      // edible, inedible, toxic
  tasteProfile: string[],       // umami, nutty, earthy
  texture: string,              // firm, tender, chewy
  preparationMethods: string[], // sautéed, grilled, dried
  nutritionalValue: {
    calories, protein, carbs, fat, fiber
    vitamins: { name, amount, unit }[]
    minerals: { name, amount, unit }[]
  },
  culinaryUses: string[],
  pairings: string[]
}
```

#### 5. **Medicinal & Health** (Perspektive 2) ⚠️ KORREKT: `medicinalAndHealth`
```typescript
medicinalAndHealth: {
  compounds: {
    name: string,
    category: string,     // polysaccharide, terpenoid, phenolic
    concentration: string,
    bioactivity: string[]
  }[],
  therapeuticUses: {
    condition: string,
    mechanism: string,
    evidence: string
  }[],
  clinicalTrials: {
    title, phase, status, results
  }[],
  dosage: string,
  contraindications: string[]
}
```

**⚠️ WICHTIG:** Schema-Feldname ist `medicinalAndHealth` (NICHT `medicinalProperties` oder `medicinalAndBioactive`)

#### 6. **Cultivation** (Perspektive 3)
```typescript
cultivation: {
  difficulty: string,      // easy, moderate, difficult
  substrate: string[],     // hardwood, straw, compost
  temperature: { optimal, range },
  humidity: { optimal, range },
  lightRequirements: string,
  fruitingConditions: string,
  growthRate: string,
  yield: string,
  commonIssues: string[]
}
```

#### 7. **Safety & Toxicity** (Perspektive 4)
```typescript
safetyAndToxicity: {
  toxicityLevel: string,    // nontoxic, mildly toxic, deadly
  toxins: {
    name: string,
    type: string,           // amatoxin, muscarine, psilocybin
    concentration: string,
    effects: string[]
  }[],
  symptoms: string[],
  treatment: string,
  lethalDose: string,
  lookalikeSpecies: string[]
}
```

#### 8. **Ecology & Habitat** (Perspektive 5)
```typescript
ecologyAndHabitat: {
  habitat: string[],           // forest, grassland, urban
  substrate: string[],         // soil, wood, living trees
  mycorrhizalRelationships: string[],
  seasonality: string[],       // spring, summer, fall
  geographicDistribution: string[],
  conservationStatus: string,
  ecologicalRole: string
}
```

#### 9-12. **Weitere Perspektiven**

**⚠️ KRITISCHE SCHEMA-FELDNAMEN:**

- ✅ `chemicalAndProperties` - Chemische & Physikalische Eigenschaften (NICHT `biochemistryAndCompounds`)
- ✅ `culturalAndHistorical` - Kulturelle Bedeutung & Geschichte
- ✅ `commercialAndMarket` - Wirtschaftliche Nutzung & Markt (NICHT `commercialAndEconomic`)
- ✅ `environmentalAndConservation` - Umwelt & Naturschutz (NICHT `legalAndRegulatory`)
- ✅ `researchAndInnovation` - Forschung & Innovation (NICHT `researchAndScientific`)

**Vollständige Liste aller 12 Perspektiven-Feldnamen:**
1. `taxonomy`
2. `physicalCharacteristics`
3. `ecologyAndHabitat`
4. `culinaryAndNutritional`
5. `medicinalAndHealth`
6. `cultivationAndProcessing`
7. `safetyAndIdentification`
8. `chemicalAndProperties`
9. `culturalAndHistorical`
10. `commercialAndMarket`
11. `environmentalAndConservation`
12. `researchAndInnovation`

### Indizes

```typescript
.index("by_seoName", ["seoName"])
.index("by_commonName", ["commonName"])
.index("by_latinName", ["latinName"])
.index("by_edibility", ["culinaryAndNutritional.edibilityRating"])
.index("by_toxicity", ["safetyAndToxicity.toxicityLevel"])
```

---

## fungi.ts

### Query Functions

#### 1. **list()**
```typescript
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fungi").collect();
  }
});
```
Gibt **alle** Pilze zurück.

#### 2. **getById()**
```typescript
export const getById = query({
  args: { id: v.id("fungi") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});
```
Holt einzelnen Pilz via ID.

#### 3. **getBySlug()** ⭐
```typescript
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fungi")
      .withIndex("by_seoName", (q) => q.eq("seoName", args.slug))
      .first();
  }
});
```
**Wichtigste Query** - Für Detail-Pages (`/fungi/steinpilz`).

#### 4. **getByCommonName()**
```typescript
export const getByCommonName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    return allFungi.filter((fungus) =>
      fungus.commonName.toLowerCase().includes(args.name.toLowerCase())
    );
  }
});
```
Partial Match Suche im Common Name.

#### 5. **search()** 🔍
```typescript
export const search = query({
  args: { 
    query: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    const searchTerm = args.query.toLowerCase();
    
    const results = allFungi.filter((fungus) => {
      const searchableText = [
        fungus.commonName,
        fungus.latinName,
        fungus.description,
        fungus.seoName,
      ].join(" ").toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
    
    return args.limit ? results.slice(0, args.limit) : results;
  }
});
```
Volltext-Suche über mehrere Felder.

#### 6. **count()**
```typescript
export const count = query({
  args: {},
  handler: async (ctx) => {
    const fungi = await ctx.db.query("fungi").collect();
    return fungi.length;
  }
});
```
Zählt Pilze in DB.

---

## Seed Scripts

### 3 Beispiel-Pilze

#### 1. **seed_beauveria_bassiana.ts**
```typescript
// Beauveria bassiana - Insektenpathogener Pilz
// Medicinal: Biopestizid
// Nicht essbar
```

#### 2. **seed_hypsizygus_tessellatus.ts**
```typescript
// Hypsizygus tessellatus - Buchenseitling
// Culinary: Essbar, beliebter Speisepilz
// Nussiger Geschmack
```

#### 3. **seed_pholiota_adiposa.ts**
```typescript
// Pholiota adiposa - Schuppiger Sägeblättling
// Edible: Jung essbar
// Wächst auf Totholz
```

### Seeding

```bash
# Alle 3 Pilze seeden
npm run seed

# Einzeln seeden
npm run seed:beauveria
npm run seed:hypsizygus
npm run seed:pholiota
```

---

## Convex Client (Astro Integration)

### SSR Data Fetching

**src/amorph/arch/convex.ts**:
```typescript
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(
  import.meta.env.PUBLIC_CONVEX_URL || "http://localhost:3210"
);

export async function fetchFungi() {
  return await convex.query(api.fungi.list);
}

export async function fetchFungus(slug: string) {
  return await convex.query(api.fungi.getBySlug, { slug });
}

export async function searchFungi(query: string) {
  return await convex.query(api.fungi.search, { query });
}
```

### Verwendung in Astro

```astro
---
import { fetchFungi } from '@/amorph/arch/convex';

const fungi = await fetchFungi();
---

<div>
  {fungi.map((fungus) => (
    <h2>{fungus.commonName}</h2>
  ))}
</div>
```

---

## Local Development

### Start Convex Backend

```bash
# Terminal 1: Convex Backend
npm run convex

# Terminal 2: Astro Dev Server
npm run dev
```

### Convex Dashboard

Öffne: http://localhost:3210/dashboard

Features:
- 📊 Database Browser (Tables, Queries)
- 🔍 Query Tester (Live Queries ausführen)
- 📝 Logs & Errors
- ⚡ Function Performance

---

## Performance

### Convex ist SCHNELL
- **Query Time**: < 10ms
- **Edge Caching**: Automatisch
- **Real-time**: WebSocket Updates
- **Optimistic Updates**: Client-Side Prediction

### Indexing Strategy
- Indizes auf häufig gesuchte Felder
- `seoName` für Detail-Pages
- `edibilityRating` für Filterung
- `toxicityLevel` für Safety-Queries

---

## Data Model Philosophy

### NOEMI-Enhanced Design

**N**ested **O**bjects for **E**fficient **M**odeling & **I**nterconnection:

1. **Zentrale Tabelle**: Alles in `fungi` (keine Joins nötig)
2. **Nested Objects**: Perspektiven als verschachtelte Objekte
3. **Rich Citations**: Jede Claim mit Source
4. **Optimiert für Queries**: Schnelle Abfragen UND tiefe Analyse

### Vorteile

✅ **Schnell**: Keine Joins, alles in einer Query
✅ **Vollständig**: Alle 12 Perspektiven modelliert
✅ **Erweiterbar**: Neue Felder einfach hinzufügen
✅ **Type-Safe**: Convex Schema = TypeScript Types
✅ **Migrierbar**: Schema Migrations via Convex

---

## Status: ✅ CONVEX BACKEND KOMPLETT

Convex Backend ist fertig und produktionsbereit.

**Features:**
- ✅ Vollständiges Schema (1155 Zeilen, 12 Perspektiven)
- ✅ 6 Query Functions (list, getById, getBySlug, search, etc.)
- ✅ 3 Seed Scripts (Beispiel-Pilze)
- ✅ Local Development Setup
- ✅ Dashboard & Monitoring
- ✅ SSR Integration mit Astro
- ✅ Type-Safe Queries

**Current Data:**
- 3 Pilze in Datenbank
- Beauveria bassiana (Medicinal)
- Hypsizygus tessellatus (Culinary)
- Pholiota adiposa (Edible)

**Next Steps:**
- Mehr Pilze hinzufügen (Seed Scripts)
- Full-Text Search verbessern
- Favorites/Bookmarks implementieren
- User-generated Content (später)

Siehe auch:
- `convex/README.md` - Convex Setup Guide
- `schema.ts` - Vollständiges Datenmodell
- `fungi.ts` - Query API
