/**
 * Domain Configuration for AMORPH Framework
 * 
 * This file contains ALL domain-specific configuration.
 * Different instances (Funginomi, Phytonomi, etc.) have different configs.
 * 
 * The AMORPH framework itself is domain-agnostic.
 * This config adapts the framework to a specific knowledge domain.
 * 
 * ⚠️ IMPORTANT: Perspective Colors & Definitions
 * ==============================================
 * ALL perspective colors, labels, and icons are CENTRALIZED in:
 * → convex/perspectiveFieldMappings.ts (SINGLE SOURCE OF TRUTH)
 * 
 * This file IMPORTS from perspectiveFieldMappings.ts and adds
 * domain-specific tags and schemaField mappings.
 * 
 * When updating colors/labels/icons:
 * 1. Update ONLY convex/perspectiveFieldMappings.ts
 * 2. All other files automatically use the updated values
 */

import { perspectiveDefinitions, getPerspectiveColor } from '../../../convex/perspectiveFieldMappings';

// Helper to build perspective config from central definitions
function buildPerspective(id, schemaField, tags) {
  const def = perspectiveDefinitions[id] || {};
  return {
    id,
    label: def.label || id,
    icon: def.icon || '📋',
    color: def.color || '#64748b',
    description: def.description || '',
    schemaField: schemaField || id,
    tags: tags || []
  };
}

export const DomainConfig = {
  // ========================================
  // INSTANCE IDENTITY
  // ========================================
  instance: {
    name: 'Funginomi',
    domain: 'fungi', // Used in routes (/fungi/[slug])
    description: 'Comprehensive fungi knowledge base',
    logo: '/images/logo-funginomi.svg',
    primaryColor: '#10b981', // Emerald green
    secondaryColor: '#059669'
  },

  // ========================================
  // DATA SOURCE
  // ========================================
  dataSource: {
    type: 'convex', // 'convex' | 'rest' | 'graphql' | 'supabase' | etc.
    table: 'fungi', // Table/Collection name
    slugField: 'seoName', // Field used for URL slug (matches Convex schema)
    nameField: 'commonName', // Primary display name field
    secondaryNameField: 'latinName', // Secondary name (scientific, etc.)
    imageField: 'images', // Field containing images array
    descriptionField: 'description' // Short description field
  },

  // ========================================
  // PERSPECTIVES
  // ========================================
  // Colors, labels, icons come from perspectiveDefinitions (central source)
  // Only tags and schemaField are domain-specific
  perspectives: [
    // === NATUR-GRUPPE (Grün-Spektrum) ===
    buildPerspective('environmentalAndConservation', 'environmentalAndConservation', 
      ['conservation', 'endangered', 'protection', 'environment', 'sustainability']),
    buildPerspective('ecologyAndDistribution', 'ecologyAndDistribution', 
      ['ecology', 'habitat', 'distribution', 'season', 'substrate']),
    buildPerspective('temporalPatterns', 'temporalPatterns',
      ['seasons', 'lifecycle', 'phenology', 'timing', 'fruiting']),
    buildPerspective('geographyAndDistribution', 'geographyAndDistribution',
      ['geography', 'location', 'range', 'climate', 'distribution']),
    buildPerspective('cultivationAndGrowing', 'cultivationAndGrowing', 
      ['cultivation', 'growing', 'farming', 'substrate', 'conditions']),
    buildPerspective('culinaryAndNutritional', 'culinaryAndNutritional', 
      ['culinary', 'nutrition', 'edible', 'cooking', 'flavor', 'taste']),
    
    // === IDENTITÄT-GRUPPE (Cyan-Blau) ===
    buildPerspective('identity', 'identity',
      ['name', 'nomenclature', 'common', 'scientific', 'etymology']),
    buildPerspective('taxonomy', 'taxonomy', 
      ['taxonomy', 'classification', 'family', 'genus', 'species']),
    buildPerspective('phylogeny', 'phylogeny',
      ['evolution', 'phylogeny', 'genetics', 'clade', 'lineage']),
    buildPerspective('researchAndInnovation', 'researchAndInnovation', 
      ['research', 'innovation', 'studies', 'scientific', 'development']),
    
    // === STRUKTUR-GRUPPE (Violett-Spektrum) ===
    buildPerspective('morphologyAndAnatomy', 'physicalCharacteristics', 
      ['morphology', 'anatomy', 'structure', 'physical', 'characteristics']),
    buildPerspective('microscopyAndCellular', 'microscopyAndCellular',
      ['microscopy', 'cellular', 'spores', 'hyphae', 'cells']),
    buildPerspective('chemicalAndProperties', 'chemicalAndProperties', 
      ['chemical', 'compounds', 'properties', 'analysis', 'composition']),
    buildPerspective('sensoryProfile', 'sensoryProfile',
      ['sensory', 'smell', 'taste', 'texture', 'aroma']),
    buildPerspective('visualIdentity', 'visualIdentity',
      ['visual', 'image', 'photo', 'color', 'appearance']),
    
    // === PRAKTISCH-GRUPPE (Warm) ===
    buildPerspective('medicinalAndHealth', 'medicinalAndHealth', 
      ['medicinal', 'health', 'therapeutic', 'bioactive', 'compounds']),
    buildPerspective('safetyAndIdentification', 'safetyAndIdentification', 
      ['safety', 'toxicity', 'identification', 'lookalikes', 'warning']),
    buildPerspective('commercialAndMarket', 'commercialAndMarket', 
      ['commercial', 'market', 'price', 'trade', 'availability']),
    buildPerspective('historicalAndCultural', 'historicalAndCultural', 
      ['cultural', 'historical', 'folklore', 'tradition', 'significance']),
  ],

  // ========================================
  // SEARCH CONFIGURATION
  // ========================================
  search: {
    // Fields to search (deep search in these paths)
    searchFields: [
      'commonName',
      'latinName',
      'scientificNameSynonyms',
      'commonNameVariants',
      'taxonomy.kingdom',
      'taxonomy.phylum',
      'taxonomy.class',
      'taxonomy.order',
      'taxonomy.family',
      'taxonomy.genus',
      'taxonomy.species',
      'culinaryAndNutritional.edibilityRating',
      'culinaryAndNutritional.tasteProfile',
      'ecologyAndDistribution.habitat',
      'safetyAndIdentification.lookalikes'
    ],

    // Field-to-Perspective mapping for auto-switching
    fieldToPerspective: {
      // Culinary
      'edibilityRating': 'culinaryAndNutritional',
      'tasteProfile': 'culinaryAndNutritional',
      'texture': 'culinaryAndNutritional',
      'preparationMethods': 'culinaryAndNutritional',
      'nutritionalValue': 'culinaryAndNutritional',

      // Medicinal
      'medicinalProperties': 'medicinalAndHealth',
      'bioactiveCompounds': 'medicinalAndHealth',
      'healthBenefits': 'medicinalAndHealth',

      // Chemical
      'compounds': 'chemicalAndProperties',
      'secondaryMetabolites': 'chemicalAndProperties',
      'chemicalComposition': 'chemicalAndProperties',

      // Ecology
      'habitat': 'ecologyAndDistribution',
      'distribution': 'ecologyAndDistribution',
      'substrate': 'ecologyAndDistribution',
      'season': 'ecologyAndDistribution',

      // Safety
      'toxicity': 'safetyAndIdentification',
      'lookalikes': 'safetyAndIdentification',
      'warnings': 'safetyAndIdentification',

      // Cultivation
      'growingConditions': 'cultivationAndGrowing',
      'substrates': 'cultivationAndGrowing',
      'harvestTime': 'cultivationAndGrowing',

      // Taxonomy
      'kingdom': 'taxonomy',
      'phylum': 'taxonomy',
      'family': 'taxonomy',
      'genus': 'taxonomy',
      'species': 'taxonomy',

      // Cultural
      'folklore': 'historicalAndCultural',
      'traditions': 'historicalAndCultural',
      'culturalSignificance': 'historicalAndCultural',

      // Commercial
      'marketValue': 'commercialAndMarket',
      'availability': 'commercialAndMarket',
      'tradeData': 'commercialAndMarket',

      // Conservation
      'conservationStatus': 'environmentalAndConservation',
      'threats': 'environmentalAndConservation',

      // Research
      'research': 'researchAndInnovation',
      'studies': 'researchAndInnovation',

      // Morphology
      'capShape': 'morphologyAndAnatomy',
      'capColor': 'morphologyAndAnatomy',
      'stipeLength': 'morphologyAndAnatomy',
      'sporePrintColor': 'morphologyAndAnatomy'
    },

    // Default search weights
    fieldWeights: {
      'commonName': 100,
      'latinName': 100,
      'scientificNameSynonyms': 90,
      'genus': 90,
      'family': 90,
      'species': 80,
      'edibilityRating': 50,
      'habitat': 40,
      'default': 20
    }
  },

  // ========================================
  // SIMILARITY CALCULATION
  // ========================================
  similarity: {
    // Properties to compare for similarity (with weights)
    propertyWeights: {
      // Taxonomy (high weight - similar species are very related)
      'taxonomy.family': 0.25,
      'taxonomy.genus': 0.20,
      'taxonomy.order': 0.15,

      // Ecology (medium weight - similar habitats often related)
      'ecologyAndDistribution.habitat': 0.15,
      'ecologyAndDistribution.substrate': 0.10,

      // Physical characteristics (medium weight)
      'physicalCharacteristics.capColor': 0.05,
      'physicalCharacteristics.sporePrintColor': 0.05,

      // Culinary (low weight - similar uses don't mean related)
      'culinaryAndNutritional.edibilityRating': 0.03,
      'culinaryAndNutritional.tasteProfile': 0.02
    },

    // Array similarity method ('jaccard' | 'cosine' | 'overlap')
    arrayMethod: 'jaccard',

    // String similarity method ('exact' | 'fuzzy' | 'semantic')
    stringMethod: 'fuzzy',

    // Minimum similarity threshold (0-1)
    minThreshold: 0.1
  },

  // ========================================
  // UI CUSTOMIZATION
  // ========================================
  ui: {
    // Grid view
    grid: {
      minCardWidth: '320px',
      gap: '1.5rem',
      columns: 'auto-fill'
    },

    // Bubble view
    bubble: {
      minSize: 50,
      maxSize: 120,
      userNodeSize: 60,
      connectionThreshold: 0.3
    },

    // Perspective system
    perspectives: {
      maxActive: 4, // FIFO queue size
      defaultActive: ['culinaryAndNutritional', 'cultivationAndGrowing', 'medicinalAndHealth']
    }
  },

  // ========================================
  // EXTERNAL LINKS
  // ========================================
  externalLinks: {
    aggregator: {
      name: 'Bifroest',
      url: 'https://bifroest.io',
      description: 'Multi-domain knowledge aggregator'
    },
    siblingInstances: [
      {
        name: 'Phytonomi',
        domain: 'plants',
        url: 'https://phytonomi.bifroest.io',
        description: 'Plant knowledge base'
      }
      // Add more instances as they become available
    ]
  }
};

export default DomainConfig;
