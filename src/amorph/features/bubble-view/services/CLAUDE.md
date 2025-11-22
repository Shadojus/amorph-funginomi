# Bubble View - Services (Framework Component)

**Last Updated:** 22. November 2025

## Overview

**Domain-agnostic utility services** for similarity calculations and algorithms.

## HilbertSpaceSimilarity.js

**Generic semantic similarity calculation in vector space**

**Framework Principle:** Berechnet Ähnlichkeit zwischen **beliebigen strukturierten Objekten** basierend auf gemeinsamen Properties. Die Funginomi-Instance nutzt Pilz-Properties (capColor, habitat, etc.), aber der Algorithmus ist generisch. Phytonomi würde Pflanzen-Properties nutzen (leafShape, bloomSeason, etc.), aber der gleiche Similarity-Code.

Calculates similarity using vector space projections inspired by Hilbert spaces.

### Features

**Multi-dimensional similarity:**
- Physical characteristics (cap, stipe, spores)
- Ecological factors (habitat, season, substrate)
- Culinary properties (taste, texture, preparation)
- Medicinal compounds (active ingredients)
- Cultivation requirements (temperature, humidity, substrate)

**Perspective weighting:**
- Dynamically weights dimensions based on active perspectives
- Example: "culinary" perspective boosts taste/texture similarity
- Example: "medicinal" perspective boosts compound similarity

### Algorithm

1. **Vector Extraction**: Convert fungus object to feature vectors
   ```javascript
   {
     physical: [capDiameter, stipeLength, ...],
     ecological: [habitatEncoding, seasonEncoding, ...],
     culinary: [tasteEncoding, textureEncoding, ...],
     medicinal: [compoundPresence, ...]
   }
   ```

2. **Normalization**: Scale each dimension to [0, 1]

3. **Perspective Weighting**: Multiply dimensions by perspective weights
   ```javascript
   weights = {
     physical: perspectives.includes('morphology') ? 2.0 : 1.0,
     ecological: perspectives.includes('ecology') ? 2.0 : 1.0,
     culinary: perspectives.includes('culinary') ? 2.0 : 1.0,
     medicinal: perspectives.includes('medicinal') ? 2.0 : 1.0
   }
   ```

4. **Cosine Similarity**: Calculate angle between vectors
   ```javascript
   similarity = (vec1 · vec2) / (||vec1|| * ||vec2||)
   ```

5. **Result**: Value between 0 (unrelated) and 1 (identical)

### Usage

```javascript
import { HilbertSpaceSimilarity } from './services/HilbertSpaceSimilarity.js';

const similarity = new HilbertSpaceSimilarity();

// Calculate similarity between two fungi
const score = similarity.calculateSimilarity(
  fungus1, 
  fungus2, 
  ['culinary', 'medicinal'] // Active perspectives
);

// score: 0.0 - 1.0
// 0.0 = completely different
// 0.5 = moderately similar
// 1.0 = identical
```

### Integration with BubbleView

**Connection Strength:**
```javascript
// In BubbleView.updateSimilarityMatrix()
const similarity = this.hilbertSimilarity.calculateSimilarity(
  bubble1.fungusData,
  bubble2.fungusData,
  this.activePerspectives
);

// Create connection if similarity > 0.5
if (similarity > 0.5) {
  this.connections.set(`${slug1}<->${slug2}`, {
    from: slug1,
    to: slug2,
    weight: similarity
  });
}
```

**Physics Simulation:**
```javascript
// In CanvasPhysicsReactor
// Strong connections (high similarity) → Attraction
// Weak connections (low similarity) → Repulsion
const springForce = (distance - targetDistance) * springStrength * connectionWeight;
```

### Field Mappings

**Physical Characteristics:**
- `capDiameter.min, capDiameter.max`
- `stipeLength.min, stipeLength.max`
- `capColor` (encoded as hue)
- `capShape` (categorical encoding)

**Ecological:**
- `habitat` (forest, grassland, etc.)
- `season` (spring, summer, autumn, winter)
- `substrate` (wood, soil, dung, etc.)

**Culinary:**
- `taste` (mild, bitter, sweet, etc.)
- `texture` (firm, soft, crunchy, etc.)
- `edibility` (edible, toxic, unknown)

**Medicinal:**
- Presence of specific compounds (polysaccharides, terpenoids, etc.)
- Bioactive properties (immune-modulating, anti-tumor, etc.)

### Performance

- **Cached Vectors**: Vectors computed once, reused for all comparisons
- **Lazy Calculation**: Only computes when perspectives change
- **Optimized Math**: Uses typed arrays for vector operations
- **Threshold Culling**: Only stores connections > 0.5 similarity

## Future Services

Potential services to add:
- **ClusteringService**: Group similar fungi using k-means or hierarchical clustering
- **RecommendationService**: Suggest fungi based on user preferences
- **PathfindingService**: Find shortest path between fungi in similarity graph
