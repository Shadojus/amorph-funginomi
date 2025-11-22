/**
 * Domain Configuration for AMORPH Framework
 * 
 * This file contains ALL domain-specific configuration.
 * Different instances (Funginomi, Phytonomi, etc.) have different configs.
 * 
 * The AMORPH framework itself is domain-agnostic.
 * This config adapts the framework to a specific knowledge domain.
 */

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
    slugField: 'slug', // Field used for URL slug
    nameField: 'commonName', // Primary display name field
    secondaryNameField: 'latinName', // Secondary name (scientific, etc.)
    imageField: 'images', // Field containing images array
    descriptionField: 'description' // Short description field
  },

  // ========================================
  // PERSPECTIVES
  // ========================================
  perspectives: [
    {
      id: 'culinaryAndNutritional',
      label: 'Culinary',
      icon: '🍳',
      color: '#10b981',
      description: 'Culinary uses and nutritional information',
      schemaField: 'culinaryAndNutritional', // Field in data schema
      tags: ['culinary', 'nutrition', 'edible', 'cooking', 'flavor', 'taste']
    },
    {
      id: 'medicinalAndHealth',
      label: 'Medicinal',
      icon: '⚕️',
      color: '#3b82f6',
      description: 'Health benefits and medicinal properties',
      schemaField: 'medicinalAndHealth',
      tags: ['medicinal', 'health', 'therapeutic', 'bioactive', 'compounds']
    },
    {
      id: 'chemicalAndProperties',
      label: 'Chemical',
      icon: '🧪',
      color: '#8b5cf6',
      description: 'Chemical composition and properties',
      schemaField: 'chemicalAndProperties',
      tags: ['chemical', 'compounds', 'properties', 'analysis', 'composition']
    },
    {
      id: 'ecologyAndDistribution',
      label: 'Ecology',
      icon: '🌍',
      color: '#059669',
      description: 'Ecological role and distribution',
      schemaField: 'ecologyAndDistribution',
      tags: ['ecology', 'habitat', 'distribution', 'season', 'substrate']
    },
    {
      id: 'safetyAndIdentification',
      label: 'Safety',
      icon: '⚠️',
      color: '#ef4444',
      description: 'Safety information and identification',
      schemaField: 'safetyAndIdentification',
      tags: ['safety', 'toxicity', 'identification', 'lookalikes', 'warning']
    },
    {
      id: 'cultivationAndGrowing',
      label: 'Cultivation',
      icon: '🌱',
      color: '#84cc16',
      description: 'Cultivation methods and growing conditions',
      schemaField: 'cultivationAndGrowing',
      tags: ['cultivation', 'growing', 'farming', 'substrate', 'conditions']
    },
    {
      id: 'taxonomy',
      label: 'Taxonomy',
      icon: '🔬',
      color: '#06b6d4',
      description: 'Scientific classification',
      schemaField: 'taxonomy',
      tags: ['taxonomy', 'classification', 'family', 'genus', 'species']
    },
    {
      id: 'historicalAndCultural',
      label: 'Cultural',
      icon: '📚',
      color: '#f59e0b',
      description: 'Historical and cultural significance',
      schemaField: 'historicalAndCultural',
      tags: ['cultural', 'historical', 'folklore', 'tradition', 'significance']
    },
    {
      id: 'commercialAndMarket',
      label: 'Commercial',
      icon: '💼',
      color: '#6366f1',
      description: 'Commercial availability and market information',
      schemaField: 'commercialAndMarket',
      tags: ['commercial', 'market', 'price', 'trade', 'availability']
    },
    {
      id: 'environmentalAndConservation',
      label: 'Conservation',
      icon: '🌿',
      color: '#14b8a6',
      description: 'Conservation status and environmental impact',
      schemaField: 'environmentalAndConservation',
      tags: ['conservation', 'endangered', 'protection', 'environment', 'sustainability']
    },
    {
      id: 'researchAndInnovation',
      label: 'Research',
      icon: '🔬',
      color: '#a855f7',
      description: 'Current research and innovations',
      schemaField: 'researchAndInnovation',
      tags: ['research', 'innovation', 'studies', 'scientific', 'development']
    },
    {
      id: 'morphologyAndAnatomy',
      label: 'Morphology',
      icon: '🔍',
      color: '#ec4899',
      description: 'Physical characteristics and anatomy',
      schemaField: 'physicalCharacteristics',
      tags: ['morphology', 'anatomy', 'structure', 'physical', 'characteristics']
    }
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
      name: 'Bifröst',
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
