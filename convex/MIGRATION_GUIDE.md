/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📦 MIGRATION GUIDE: Schema v3 → Schema v4 (Graph-Native)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * OVERVIEW:
 * Transform nested object structure into flat graph structure.
 * 
 * OLD STRUCTURE (v3):
 * fungi {
 *   cultivationAndProcessing: {
 *     temperatureRequirements: {
 *       colonization: { min: 15, max: 25, optimal: 20 }
 *     }
 *   }
 * }
 * 
 * NEW STRUCTURE (v4):
 * fungi { id, slug, commonName, taxonomy }
 * fungiAttributes [
 *   { fungusId, perspective: "cultivation", category: "temperature",
 *     attributeKey: "colonizationTempMin", valueType: "number", numberValue: 15 }
 *   { fungusId, perspective: "cultivation", category: "temperature",
 *     attributeKey: "colonizationTempMax", valueType: "number", numberValue: 25 }
 *   { fungusId, perspective: "cultivation", category: "temperature",
 *     attributeKey: "colonizationTempOptimal", valueType: "number", numberValue: 20 }
 * ]
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

## PHASE 1: SETUP (Pre-Migration)

### 1.1 Backup Current Data
```bash
# Export current database
npx convex export --path ./backup_v3_$(date +%Y%m%d).json

# Verify backup
ls -lh backup_v3_*.json
```

### 1.2 Install New Schema (Parallel)
```bash
# Rename old schema (keep as backup)
mv convex/schema.ts convex/schema_v3_backup.ts

# Activate new schema
cp convex/schema_v4_graph_native.ts convex/schema.ts

# Deploy (will create new tables)
npx convex dev
```

### 1.3 Verify New Tables Created
```bash
# Check in Convex Dashboard
# Should see: fungi, fungiAttributes, fungiRelationships, perspectives, etc.
```

---

## PHASE 2: DATA MIGRATION

### 2.1 Migration Strategy

**OPTION A: Dual-Write (Recommended for Production)**
- Keep both schemas active
- Write to both v3 and v4 simultaneously
- Gradually migrate read queries to v4
- Once verified, drop v3 tables

**OPTION B: Batch Migration (Recommended for Development)**
- Migrate all data at once
- Downtime acceptable
- Faster implementation

**OPTION C: Incremental Migration**
- Migrate one fungus at a time
- No downtime
- Slower but safest

### 2.2 Mapping Rules

#### 2.2.1 Core Identity (fungi table)
```typescript
// OLD → NEW
{
  commonName: fungi.commonName,
  latinName: fungi.latinName,
  slug: fungi.slug || fungi.seoName,
  taxonomy: fungi.taxonomy,
  primaryImageUrl: fungi.imageUrl || fungi.imageUrls?.[0],
  imageUrls: fungi.imageUrls,
  _quickAccess: {
    edibility: fungi.safetyAndIdentification?.edibility,
    cultivable: fungi.cultivationAndProcessing?.cultivable,
    medicinalUse: fungi.medicinalAndHealth?.medicinalUse,
    habitat: fungi.ecologyAndHabitat?.habitat,
  },
  createdAt: fungi.createdAt || Date.now(),
  updatedAt: fungi.updatedAt || Date.now(),
  verified: fungi.verified,
}
```

#### 2.2.2 Attributes (fungiAttributes table)

**Example: Physical Characteristics**
```typescript
// OLD: fungi.physicalCharacteristics.capShape = ["convex", "campanulate"]
// NEW: fungiAttributes entries

[
  {
    fungusId: <fungus_id>,
    perspective: "taxonomy",
    category: "physicalCharacteristics",
    attributeKey: "capShape",
    attributePath: "physicalCharacteristics.capShape",
    displayLabel: "Cap Shape",
    valueType: "array",
    arrayValue: ["convex", "campanulate"],
    morphType: "tag",
    morphConfig: { color: "#667eea", variant: "pill" },
    priority: 100,
    searchable: true,
    createdAt: Date.now(),
  }
]
```

**Example: Range Values**
```typescript
// OLD: fungi.physicalCharacteristics.capDiameter = { min: 5, max: 15, unit: "cm" }
// NEW: fungiAttributes entry

{
  fungusId: <fungus_id>,
  perspective: "taxonomy",
  category: "physicalCharacteristics",
  attributeKey: "capDiameter",
  attributePath: "physicalCharacteristics.capDiameter",
  displayLabel: "Cap Diameter",
  valueType: "range",
  rangeValue: { min: 5, max: 15, unit: "cm" },
  morphType: "range",
  priority: 110,
  createdAt: Date.now(),
}
```

**Example: Nested Objects**
```typescript
// OLD: fungi.cultivationAndProcessing.temperatureRequirements.colonization
//      = { min: 15, max: 25, optimal: 20, unit: "°C" }
// NEW: Multiple fungiAttributes entries

[
  {
    fungusId: <fungus_id>,
    perspective: "cultivation",
    category: "temperature",
    attributeKey: "colonizationTemp",
    attributePath: "cultivationAndProcessing.temperatureRequirements.colonization",
    displayLabel: "Colonization Temperature",
    valueType: "range",
    rangeValue: { min: 15, max: 25, optimal: 20, unit: "°C" },
    morphType: "range",
    priority: 200,
    createdAt: Date.now(),
  }
]
```

#### 2.2.3 Perspectives (perspectives table)

```typescript
// Define all perspectives
[
  {
    perspectiveKey: "taxonomy",
    displayName: "Taxonomy & Identification",
    description: "Physical characteristics and identification features",
    icon: "🔬",
    colorScheme: { primary: "#667eea" },
    categories: ["physicalCharacteristics", "safetyAndIdentification"],
    displayOrder: 1,
    defaultActive: true,
    createdAt: Date.now(),
  },
  {
    perspectiveKey: "cultivation",
    displayName: "Cultivation & Processing",
    description: "Growing conditions and cultivation techniques",
    icon: "🌱",
    colorScheme: { primary: "#10b981" },
    categories: ["cultivationAndProcessing"],
    displayOrder: 2,
    createdAt: Date.now(),
  },
  // ... more perspectives
]
```

---

## PHASE 3: RELATIONSHIP COMPUTATION

### 3.1 Compute Similarities
```typescript
// For each fungus pair, compute similarity scores
// Example: Cultivation similarity

const similarity = computeSimilarity(fungusA, fungusB, "cultivation");

// Create relationship
{
  sourceFungusId: fungusA._id,
  targetFungusId: fungusB._id,
  relationshipType: "similar_cultivation",
  score: similarity.score,  // 0-1
  perspectives: ["cultivation"],
  dimensions: [
    { attributeKey: "temperature", distance: 0.1, weight: 0.8 },
    { attributeKey: "substrate", distance: 0.2, weight: 0.6 },
  ],
  computedAt: Date.now(),
}
```

### 3.2 Pre-compute Embeddings
```typescript
// Generate vector embeddings for fast similarity search
{
  fungusId: <fungus_id>,
  perspective: "cultivation",
  vector: [0.123, 0.456, ...],  // 128-dim vector
  dimensions: 128,
  algorithm: "sentence-bert",
  version: "1.0",
  computedAt: Date.now(),
}
```

---

## PHASE 4: VERIFICATION

### 4.1 Data Integrity Checks
```bash
# Count records
OLD_COUNT=$(convex query fungi:count)
NEW_COUNT=$(convex query fungiV4:count)

# Verify attributes per fungus
# Each fungus should have ~50-200 attributes depending on completeness
```

### 4.2 Query Tests
```typescript
// Test 1: Fetch fungus with all attributes
const fungus = await ctx.db.get(fungusId);
const attributes = await ctx.db
  .query("fungiAttributes")
  .withIndex("by_fungus", q => q.eq("fungusId", fungusId))
  .collect();

console.log(`Fungus: ${fungus.commonName}`);
console.log(`Attributes: ${attributes.length}`);

// Test 2: Perspective-filtered query
const cultivationAttrs = await ctx.db
  .query("fungiAttributes")
  .withIndex("by_perspective", q => 
    q.eq("fungusId", fungusId).eq("perspective", "cultivation")
  )
  .collect();

console.log(`Cultivation attributes: ${cultivationAttrs.length}`);

// Test 3: Relationships
const relationships = await ctx.db
  .query("fungiRelationships")
  .withIndex("by_source", q => q.eq("sourceFungusId", fungusId))
  .collect();

console.log(`Relationships: ${relationships.length}`);
```

### 4.3 UI Tests
```typescript
// Test MorphMapper compatibility
// Ensure all morph types render correctly from new structure
```

---

## PHASE 5: CUTOVER

### 5.1 Switch Queries
```typescript
// Update all Convex functions to use new schema
// Example: fungi.ts

// OLD
export const getFungus = query(async (ctx, { slug }) => {
  return await ctx.db
    .query("fungi")
    .filter(q => q.eq(q.field("slug"), slug))
    .first();
});

// NEW
export const getFungus = query(async (ctx, { slug }) => {
  const fungus = await ctx.db
    .query("fungi")
    .withIndex("by_slug", q => q.eq("slug", slug))
    .first();
  
  if (!fungus) return null;
  
  // Fetch attributes (optional - lazy load by perspective)
  const attributes = await ctx.db
    .query("fungiAttributes")
    .withIndex("by_fungus", q => q.eq("fungusId", fungus._id))
    .collect();
  
  return { ...fungus, attributes };
});
```

### 5.2 Update Frontend
```typescript
// Update MorphMapper to read from fungiAttributes
// Update BubbleView to use fungiRelationships
// Update SearchFilterController to search fungiAttributes
```

### 5.3 Cleanup
```bash
# Drop old tables (AFTER VERIFICATION!)
# convex delete-table fungi_old
# convex delete-table ...
```

---

## PHASE 6: OPTIMIZATION

### 6.1 Index Tuning
```typescript
// Monitor query performance
// Add indexes for slow queries
// Example: Add compound indexes for common queries
```

### 6.2 Caching Strategy
```typescript
// Populate fungiMorphs table for complex visualizations
// Pre-compute frequently accessed relationships
```

---

## ROLLBACK PLAN

### If Migration Fails:
```bash
# 1. Restore backup
npx convex import --path backup_v3_YYYYMMDD.json --replace

# 2. Revert schema
mv convex/schema_v3_backup.ts convex/schema.ts

# 3. Redeploy
npx convex dev

# 4. Verify
convex dashboard
```

---

## ESTIMATED TIMELINE

- **Phase 1 (Setup)**: 1 hour
- **Phase 2 (Migration)**: 8-16 hours (depends on data volume)
- **Phase 3 (Relationships)**: 4-8 hours
- **Phase 4 (Verification)**: 2-4 hours
- **Phase 5 (Cutover)**: 4-8 hours
- **Phase 6 (Optimization)**: Ongoing

**Total: 2-4 days** (with testing and verification)

---

## NEXT STEPS

1. ✅ Review this migration plan
2. ⏳ Create migration script (migrate.ts)
3. ⏳ Test with sample data
4. ⏳ Full migration on dev database
5. ⏳ Verify UI functionality
6. ⏳ Production migration

