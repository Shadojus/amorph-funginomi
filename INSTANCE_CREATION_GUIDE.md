# 🚀 Creating a New AMORPH Instance

**Last Updated:** 22. November 2025

This guide explains how to create a new AMORPH instance (e.g., Phytonomi for plants) using the domain-agnostic framework.

## Overview

The AMORPH framework is completely domain-agnostic. All domain-specific logic is isolated in configuration files. To create a new instance:

1. Copy the framework code
2. Create a new `domain.config.js` for your domain
3. Set up your data source (Convex, REST, GraphQL, etc.)
4. Customize perspectives, colors, and UI
5. Deploy!

## Step-by-Step Guide

### 1. Copy Framework Base

```bash
# Clone Funginomi repository
git clone https://github.com/your-org/amorph-funginomi.git phytonomi

# Navigate to new instance
cd phytonomi

# Update package.json
# Change name, description, repository URL
```

### 2. Create Domain Configuration

Create `src/amorph/core/domain.config.js`:

```javascript
export const DomainConfig = {
  // ========================================
  // INSTANCE IDENTITY
  // ========================================
  instance: {
    name: 'Phytonomi',
    domain: 'plants', // Used in routes (/plants/[slug])
    description: 'Comprehensive plant knowledge base',
    logo: '/images/logo-phytonomi.svg',
    primaryColor: '#22c55e', // Green for plants
    secondaryColor: '#16a34a'
  },

  // ========================================
  // DATA SOURCE
  // ========================================
  dataSource: {
    type: 'convex', // or 'rest', 'graphql', etc.
    table: 'plants', // Your collection name
    slugField: 'slug',
    nameField: 'commonName',
    secondaryNameField: 'scientificName',
    imageField: 'images',
    descriptionField: 'description'
  },

  // ========================================
  // PERSPECTIVES (define your own!)
  // ========================================
  perspectives: [
    {
      id: 'botanical',
      label: 'Botanical',
      icon: '🌿',
      color: '#22c55e',
      description: 'Scientific classification and morphology',
      schemaField: 'botanicalInfo',
      tags: ['botanical', 'taxonomy', 'morphology', 'classification']
    },
    {
      id: 'gardening',
      label: 'Gardening',
      icon: '🌱',
      color: '#84cc16',
      description: 'Growing conditions and care instructions',
      schemaField: 'gardeningInfo',
      tags: ['gardening', 'cultivation', 'care', 'growing']
    },
    {
      id: 'medicinal',
      label: 'Medicinal',
      icon: '⚕️',
      color: '#3b82f6',
      description: 'Medicinal properties and uses',
      schemaField: 'medicinalProperties',
      tags: ['medicinal', 'health', 'therapeutic', 'healing']
    },
    {
      id: 'ornamental',
      label: 'Ornamental',
      icon: '🌺',
      color: '#ec4899',
      description: 'Decorative uses and aesthetics',
      schemaField: 'ornamentalUse',
      tags: ['ornamental', 'decorative', 'aesthetics', 'landscaping']
    },
    {
      id: 'ecology',
      label: 'Ecology',
      icon: '🌍',
      color: '#059669',
      description: 'Ecological role and habitat',
      schemaField: 'ecologicalInfo',
      tags: ['ecology', 'habitat', 'environment', 'ecosystem']
    },
    {
      id: 'culinary',
      label: 'Culinary',
      icon: '🍃',
      color: '#10b981',
      description: 'Edible parts and culinary uses',
      schemaField: 'culinaryUses',
      tags: ['culinary', 'edible', 'cooking', 'food']
    }
    // Add more perspectives as needed
  ],

  // ========================================
  // SEARCH CONFIGURATION
  // ========================================
  search: {
    searchFields: [
      'commonName',
      'scientificName',
      'family',
      'genus',
      'species',
      'nativeRegion',
      'growingConditions',
      'bloomSeason'
    ],

    fieldToPerspective: {
      // Map your fields to perspectives
      'scientificName': 'botanical',
      'family': 'botanical',
      'genus': 'botanical',
      'growingConditions': 'gardening',
      'waterNeeds': 'gardening',
      'medicinalUses': 'medicinal',
      'bloomColor': 'ornamental',
      'landscapeUse': 'ornamental',
      'habitat': 'ecology',
      'nativeRegion': 'ecology',
      'edibleParts': 'culinary'
    },

    fieldWeights: {
      'commonName': 100,
      'scientificName': 100,
      'family': 90,
      'genus': 90,
      'species': 80,
      'nativeRegion': 50,
      'default': 20
    }
  },

  // ========================================
  // SIMILARITY CALCULATION
  // ========================================
  similarity: {
    propertyWeights: {
      // Define which properties matter for similarity
      'botanicalInfo.family': 0.25,
      'botanicalInfo.genus': 0.20,
      'ecologicalInfo.habitat': 0.15,
      'ecologicalInfo.climateZone': 0.15,
      'gardeningInfo.sunRequirements': 0.10,
      'gardeningInfo.waterNeeds': 0.10,
      'ornamentalUse.bloomColor': 0.05
    },

    arrayMethod: 'jaccard',
    stringMethod: 'fuzzy',
    minThreshold: 0.1
  },

  // ========================================
  // UI CUSTOMIZATION
  // ========================================
  ui: {
    grid: {
      minCardWidth: '320px',
      gap: '1.5rem',
      columns: 'auto-fill'
    },

    bubble: {
      minSize: 50,
      maxSize: 120,
      userNodeSize: 60,
      connectionThreshold: 0.3
    },

    perspectives: {
      maxActive: 4,
      defaultActive: ['botanical', 'gardening', 'ornamental']
    }
  },

  // ========================================
  // EXTERNAL LINKS
  // ========================================
  externalLinks: {
    aggregator: {
      name: 'Bifröst',
      url: 'https://bifroest.io',
      description: 'Multi-domain knowledge aggregator'
    },
    siblingInstances: [
      {
        name: 'Funginomi',
        domain: 'fungi',
        url: 'https://funginomi.bifroest.io',
        description: 'Mushroom knowledge base'
      }
    ]
  }
};

export default DomainConfig;
```

### 3. Set Up Data Source

#### Option A: Convex

1. Create schema in `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plants: defineTable({
    // Core identity
    commonName: v.string(),
    scientificName: v.string(),
    slug: v.string(),
    
    // Your domain-specific fields
    botanicalInfo: v.object({
      family: v.string(),
      genus: v.string(),
      species: v.string(),
      // ...
    }),
    
    gardeningInfo: v.object({
      sunRequirements: v.string(),
      waterNeeds: v.string(),
      // ...
    }),
    
    // Add perspectives as nested objects
  }).index("by_slug", ["slug"])
});
```

2. Create queries in `convex/plants.ts`:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("plants").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plants")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

// Add search, etc.
```

#### Option B: REST API

Update `domain.config.js`:

```javascript
dataSource: {
  type: 'rest',
  endpoint: 'https://api.yourservice.com',
  table: 'plants',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  // ...
}
```

The `DataAdapter.js` will automatically handle REST calls!

#### Option C: GraphQL

Update `domain.config.js`:

```javascript
dataSource: {
  type: 'graphql',
  endpoint: 'https://api.yourservice.com/graphql',
  table: 'plants',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  // ...
}
```

### 4. Update Routes

Rename files in `src/pages/`:

```bash
# Old (Funginomi)
pages/fungi/index.astro
pages/fungi/[slug].astro

# New (Phytonomi)
pages/plants/index.astro
pages/plants/[slug].astro
```

Update route references in files to use `/plants/` instead of `/fungi/`.

### 5. Update Branding

1. **Logo**: Replace `/public/images/logo-phytonomi.svg`
2. **Favicon**: Update `favicon.ico`
3. **Colors**: Defined in `domain.config.js`
4. **Background**: Update wood floor texture or remove (optional)

### 6. Test Framework Components

All framework components are already domain-agnostic:

- ✅ **MorphMapper** - Automatically detects data types
- ✅ **BubbleView** - Visualizes entity similarities
- ✅ **GridView** - Displays entity cards
- ✅ **SearchSystem** - Searches your data
- ✅ **PerspectiveSystem** - Filters by your perspectives
- ✅ **HilbertSpaceSimilarity** - Calculates similarities

No code changes needed!

### 7. Deploy

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Deploy (Vercel, Netlify, etc.)
npm run build
vercel deploy
```

## Key Differences from Funginomi

| Aspect | Funginomi (Fungi) | Phytonomi (Plants) | Generic Framework |
|--------|-------------------|-------------------|-------------------|
| **Domain** | `fungi` | `plants` | Configurable |
| **Perspectives** | 12 (Culinary, Medicinal, etc.) | 6 (Botanical, Gardening, etc.) | Configurable |
| **Routes** | `/fungi/[slug]` | `/plants/[slug]` | `/{domain}/[slug]` |
| **Data Fields** | `capColor`, `sporePrint`, etc. | `leafShape`, `bloomSeason`, etc. | Any fields |
| **Similarity** | Taxonomy, Habitat, Spores | Family, Climate, Bloom | Configurable weights |
| **Colors** | Emerald green (#10b981) | Leaf green (#22c55e) | Configurable |

## Zero Code Changes Required

The framework automatically adapts to your domain config. You **never** need to modify:

- ✅ `MorphMapper.js` - Data-driven type detection
- ✅ `HilbertSpaceSimilarity.js` - Uses `entity1`, `entity2`
- ✅ `BubbleView.js` - Generic entity visualization
- ✅ `BubbleMorph.js` - Uses `entityData` property
- ✅ `SearchSystem` - Extracts fields from config
- ✅ `AmorphSystem.js` - Domain-agnostic core

Just provide `domain.config.js` and your data!

## Multi-Instance Communication

### Redis Streams Setup

To enable cross-instance data exchange (Funginomi ↔ Phytonomi):

1. **Set up Redis server**:
```bash
# Docker
docker run -d -p 6379:6379 redis

# Or use Redis Cloud
```

2. **Configure in `amorph.config.js`**:
```javascript
redis: {
  host: 'localhost',
  port: 6379,
  // or use Redis Cloud URL
  url: 'redis://your-redis-cloud.com:6379'
}
```

3. **Events are automatically shared**:
- User searches in Funginomi → Phytonomi sees event
- User marks plant as favorite → Funginomi can show related fungi
- Cross-domain recommendations work automatically

## Example: Complete Phytonomi Instance

See `examples/phytonomi/` for a complete working example with:
- Plant schema
- 6 botanical perspectives
- Gardening-focused UI
- Sample plant data
- Full deployment config

## Troubleshooting

**Q: Morphs not displaying correctly?**
A: Check that your data structure matches what MorphMapper expects. Arrays of strings → TagMorph, Objects with {min, max} → RangeMorph, etc.

**Q: Perspectives not filtering?**
A: Ensure `schemaField` in `domain.config.js` matches your actual data field names.

**Q: Similarity not working?**
A: Check `similarity.propertyWeights` in `domain.config.js`. Properties must exist in your data.

**Q: Search not finding results?**
A: Verify `search.searchFields` includes the fields you want to search.

## Next Steps

1. **Customize Perspectives**: Add domain-specific perspectives
2. **Enrich Data**: Add more fields to your schema
3. **Custom Morphs**: Create domain-specific morphs if needed (optional)
4. **Connect to Bifröst**: Enable cross-instance search
5. **Deploy Production**: Scale with your data source

The framework handles the rest! 🚀
