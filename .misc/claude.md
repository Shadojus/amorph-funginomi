# Funginomi - Comprehensive Fungi Knowledge Base

## Project Overview

Funginomi is a comprehensive, AI-enhanced digital encyclopedia of fungi (mushrooms) built on Convex. The platform combines scientific rigor with accessibility, providing detailed information about morphology, ecology, cultivation, medicinal properties, and cultural significance of fungi species worldwide.

**Tech Stack:**
- **Backend:** Convex (serverless backend with real-time capabilities)
- **Frontend:** Next.js 15 with App Router
- **Styling:** Tailwind CSS
- **AI:** Integrated AI assistance for data enrichment and search

## Current Architecture

### Schema Structure (v3.0)

The database uses a **central fungi table** with comprehensive nested objects for all major knowledge domains:

```typescript
// Central fungi table with all core data
fungi {
  // Core Identity
  commonName: string
  latinName: string
  scientificNameSynonyms?: string[]
  commonNameVariants?: string[]
  seoName: string
  slug: string
  
  // Core Description
  description?: string
  imageUrl?: string
  imageUrls?: string[]
  
  // Taxonomic Classification
  taxonomy: {
    kingdom, phylum, class, order, family, genus, species
  }
  
  // Physical Characteristics (detailed morphology)
  physicalCharacteristics: {
    capShape, capDiameter, capColor, capTexture, capSurface,
    hymenophoreType, gillAttachment, gillSpacing, gillColor,
    stipeLength, stipeDiameter, stipeColor, stipeTexture,
    sporePrintColor, sporeSize, sporeShape,
    odor, taste, texture, bioluminescence, etc.
  }
  
  // Safety & Identification
  safetyAndIdentification: {
    edibility, toxicityLevel, toxins, symptoms,
    lookalikeSpecies[], identificationDifficulty,
    keyIdentificationFeatures[], safetyWarnings[], etc.
  }
  
  // Ecology & Habitat
  ecologyAndHabitat: {
    habitat[], substrate[], substrateDetails[],
    ecologicalRole[], symbioticRelationships[],
    seasonality, geographicDistribution, climatePreferences,
    abundance, populationTrend
  }
  
  // Cultivation & Processing (comprehensive grower data)
  cultivationAndProcessing?: {
    cultivable, cultivationDifficulty,
    temperatureRequirements, humidityRequirements,
    substratePreferences[], substrateFormulations[],
    timeToColonization, timeToFruiting, yieldPotential,
    harvestTiming, processingMethods[], storageRecommendations[], etc.
  }
  
  // Culinary & Nutritional
  culinaryAndNutritional?: {
    flavorProfile[], texture, culinaryUses[],
    preparationMethods[], nutritionalValue,
    healthBenefits[], dietaryConsiderations[], etc.
  }
  
  // Medicinal & Health
  medicinalAndHealth?: {
    medicinalUse, traditionalUse, medicinalProperties[],
    therapeuticApplications[], activeCompounds[],
    dosageRecommendations[], contraindications[], etc.
  }
  
  // Chemical & Properties
  chemicalAndProperties?: {
    primaryCompounds[], secondaryMetabolites[],
    antioxidantCapacity, antimicrobialActivity[], etc.
  }
  
  // Commercial & Market
  commercialAndMarket?: {
    commercialValue, marketDemand, priceRange,
    marketSegments[], majorProducers[], tradeVolume, etc.
  }
  
  // Cultural & Historical
  culturalAndHistorical?: {
    historicalSignificance, culturalUse[],
    folklore[], indigenousNames[], traditionalKnowledge, etc.
  }
  
  // Environmental & Conservation
  environmentalAndConservation?: {
    conservationStatus, threats[], protectionMeasures[],
    ecologicalRole[], ecosystemServices[], etc.
  }
  
  // Research & Innovation
  researchAndInnovation?: {
    researchInterest, activeResearchAreas[],
    biotechnologyPotential, innovativeApplications[], etc.
  }
  
  // Metadata
  createdAt, updatedAt, verified, isPublic,
  completenessScore, dataQuality,
  sources[], contributors[], reviewStatus
}
```

### Supporting Tables

Additional tables for specialized data:
- `scientificPapers` - Research publications
- `climateImpact` - Climate change observations
- `economicData` - Market and trade data
- `cultivationRecords` - Grower experiences
- `traditionalKnowledge` - Ethnomycological data
- `observations` - Field observations
- `relationships` - Auto-computed similarities
- `searchTracking` - Search analytics

## Schema Type Definitions

### Important Type Corrections

**Physical Measurements** - Use structured objects:
```typescript
// CORRECT ✓
capDiameter: {
  min: 5,
  max: 15,
  unit: "cm"
}

// INCORRECT ✗
capDiameter: "5-15 cm"  // String format is not supported
```

**Medicinal Compounds - Active Compounds** - Use string for concentration:
```typescript
// In medicinalAndHealth.activeCompounds[]
{
  name: "Beta-glucans",
  class: "polysaccharide",
  concentration: "15-30% dry weight",  // STRING format
  function: "Immunomodulation",
  bioavailability: "moderate"
}
```

**Chemical Compounds - Primary Compounds** - Use structured object:
```typescript
// In chemicalAndProperties.primaryCompounds[]
{
  name: "Beta-glucans",
  class: "polysaccharide",
  concentration: {
    min: 15,
    max: 30,
    unit: "% dry weight"
  },  // OBJECT format
  location: "fruiting body",
  function: "Immunomodulation",
  bioactivity: ["immunostimulating", "antitumor"]
}
```

## Current Seed Data

Successfully seeded high-quality entries:
1. ✅ **Hericium erinaceus** (Lion's Mane) - 99% complete
2. ✅ **Fomitopsis betulina** (Birch Polypore) - 97% complete
3. ✅ **Cordyceps militaris** (Scarlet Caterpillar Club) - 96% complete

All entries include:
- Comprehensive physical characteristics
- Detailed cultivation information
- Medicinal properties with active compounds
- Cultural and historical significance
- Commercial market data
- Conservation status
- Research applications

## Key Features

### Data Quality
- **Completeness scores** (0-100%) for each entry
- **Source citations** with reliability ratings
- **Verification status** and review workflow
- **Multi-language support** (common names, indigenous names)

### Search & Discovery
- Full-text search on common names
- Filter by edibility, family, genus
- Semantic relationships between species
- Lookalike species identification

### Use Cases
- **Foragers:** Safe identification, edibility information
- **Cultivators:** Complete growing guides, substrate formulations
- **Researchers:** Scientific data, chemical compounds, citations
- **Medical practitioners:** Medicinal properties, dosage, contraindications
- **Ethnomycologists:** Cultural uses, traditional knowledge
- **Conservationists:** Conservation status, threats, ecology

## Development Guidelines

### Adding New Fungi

1. **Use existing seed files as templates** (Hericium, Fomitopsis, Cordyceps)
2. **Follow schema structure exactly** - all fields properly typed
3. **Measurements use objects** with min/max/unit
4. **Concentration fields vary by section**:
   - medicinalAndHealth.activeCompounds: STRING
   - chemicalAndProperties.primaryCompounds: OBJECT
5. **Include comprehensive sources** with reliability ratings
6. **Set appropriate completeness score** based on data coverage

### Type Safety Checklist

Before seeding, verify:
- [ ] All measurement objects have min/max/unit
- [ ] Concentration format matches section (string vs object)
- [ ] Arrays contain proper object structures
- [ ] Optional fields use `v.optional()`
- [ ] All required fields present
- [ ] Sources array populated
- [ ] Metadata fields set (createdAt, completenessScore, etc.)

## File Structure

