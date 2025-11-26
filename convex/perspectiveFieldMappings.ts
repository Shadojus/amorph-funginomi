/**
 * 🎯 PERSPECTIVE FIELD MAPPINGS - Complete Schema v5.0
 * 
 * ✨ VOLLSTÄNDIG AKTUALISIERT - Alle Schema-Felder abgedeckt!
 * 
 * Mapping aller Top-Level Felder aus schema.ts zu ihren Perspektiven
 * Verwendet in:
 * - Convex Backend (fungi.ts, calculateSimilarity.ts, etc.)
 * - TypeScript Components (PerspectiveCard, PerspectiveReactor, etc.)
 * - Grid-View & Bubble-View Rendering
 * 
 * Schema v5.0 Feldstruktur:
 * 20 Hauptperspektiven + 13 Unterkategorien
 * Gesamt: ~195 explizit gemappte Felder
 */

// ============================================================================
// PRIMARY FIELD TO PERSPECTIVE INDEX
// ============================================================================
// Maps all schema fields to their primary perspective
export const fieldToPerspectiveIndex: Record<string, string> = {
  // ===== IDENTITY & NOMENCLATURE (8 felder) =====
  'commonName': 'identity',
  'latinName': 'identity',
  'scientificNameSynonyms': 'identity',
  'commonNameVariants': 'identity',
  'seoName': 'identity',
  'slug': 'identity',
  'internationalNames': 'identity',
  'nomenclatureHistory': 'identity',

  // ===== VISUAL IDENTITY (6 felder) =====
  'visualIdentity': 'visualIdentity',
  'primaryImage': 'visualIdentity',
  'imageGallery': 'visualIdentity',
  'view360': 'visualIdentity',
  'colorData': 'visualIdentity',
  'visualSignature': 'visualIdentity',

  // ===== TAXONOMY (13 felder) =====
  'taxonomy': 'taxonomy',
  'kingdom': 'taxonomy',
  'phylum': 'taxonomy',
  'class': 'taxonomy',
  'order': 'taxonomy',
  'family': 'taxonomy',
  'genus': 'taxonomy',
  'species': 'taxonomy',
  'subspecies': 'taxonomy',
  'variety': 'taxonomy',
  'author_citation': 'taxonomy',
  'type_specimen': 'taxonomy',
  'identifiers': 'taxonomy',

  // ===== PHYLOGENY & EVOLUTION (7 felder) =====
  'phylogeny': 'phylogeny',
  'clade': 'phylogeny',
  'sister_taxa': 'phylogeny',
  'divergence_time_mya': 'phylogeny',
  'genetic_markers': 'phylogeny',
  'genome': 'phylogeny',
  'evolutionary_innovations': 'phylogeny',

  // ===== MORPHOLOGY & ANATOMY (16 felder) =====
  'morphology': 'morphologyAndAnatomy',
  'growth_form': 'morphologyAndAnatomy',
  'fruiting_body': 'morphologyAndAnatomy',
  'capShape': 'morphologyAndAnatomy',
  'capColor': 'morphologyAndAnatomy',
  'cap': 'morphologyAndAnatomy',
  'hymenophore': 'morphologyAndAnatomy',
  'gills': 'morphologyAndAnatomy',
  'pores': 'morphologyAndAnatomy',
  'teeth': 'morphologyAndAnatomy',
  'stem': 'morphologyAndAnatomy',
  'stipe': 'morphologyAndAnatomy',
  'stipeLength': 'morphologyAndAnatomy',
  'stipeColor': 'morphologyAndAnatomy',
  'veil': 'morphologyAndAnatomy',
  'sporePrintColor': 'morphologyAndAnatomy',
  'gillColor': 'morphologyAndAnatomy',

  // ===== MICROSCOPY (6 felder) =====
  'microscopy': 'microscopyAndCellular',
  'spores': 'microscopyAndCellular',
  'basidia': 'microscopyAndCellular',
  'cystidia': 'microscopyAndCellular',
  'hyphae': 'microscopyAndCellular',
  'tissues': 'microscopyAndCellular',

  // ===== CHEMISTRY & COMPOUNDS (10 felder) =====
  'chemistry': 'chemicalAndProperties',
  'primaryMetabolites': 'chemicalAndProperties',
  'secondaryMetabolites': 'chemicalAndProperties',
  'volatilome': 'chemicalAndProperties',
  'enzymes': 'chemicalAndProperties',
  'compounds': 'chemicalAndProperties',
  'primaryCompounds': 'chemicalAndProperties',
  'chemicalComposition': 'chemicalAndProperties',
  'enzymeActivity': 'chemicalAndProperties',
  'bioactiveCompounds': 'chemicalAndProperties',

  // ===== SENSORY PROFILE (7 felder) =====
  'sensoryProfile': 'sensoryProfile',
  'aroma': 'sensoryProfile',
  'taste': 'sensoryProfile',
  'texture': 'sensoryProfile',
  'appearance': 'sensoryProfile',
  'sound': 'sensoryProfile',
  'odor': 'sensoryProfile',

  // ===== ECOLOGY & DISTRIBUTION (12 felder) =====
  'ecology': 'ecologyAndDistribution',
  'ecological_role': 'ecologyAndDistribution',
  'trophic_strategy': 'ecologyAndDistribution',
  'habitat': 'ecologyAndDistribution',
  'substrate': 'ecologyAndDistribution',
  'interactions': 'ecologyAndDistribution',
  'ecosystem_services': 'ecologyAndDistribution',
  'population': 'ecologyAndDistribution',
  'ecologicalNetwork': 'ecologyAndDistribution',
  'seasonality': 'ecologyAndDistribution',
  'season': 'ecologyAndDistribution',
  'distribution': 'ecologyAndDistribution',

  // ===== TEMPORAL PATTERNS (7 felder) =====
  'temporalPatterns': 'temporalPatterns',
  'lifecycle': 'temporalPatterns',
  'phenology': 'temporalPatterns',
  'circadian': 'temporalPatterns',
  'history': 'temporalPatterns',
  'projections': 'temporalPatterns',
  'fruiting_season': 'temporalPatterns',

  // ===== GEOGRAPHY (5 felder) =====
  'geography': 'geographyAndDistribution',
  'native_range': 'geographyAndDistribution',
  'introduced_range': 'geographyAndDistribution',
  'occurrences': 'geographyAndDistribution',
  'climate_envelope': 'geographyAndDistribution',
  'geographicDistribution': 'geographyAndDistribution',

  // ===== CULTIVATION (13 felder) =====
  'cultivation': 'cultivationAndGrowing',
  'cultivation_status': 'cultivationAndGrowing',
  'difficulty': 'cultivationAndGrowing',
  'parameters': 'cultivationAndGrowing',
  'substrates': 'cultivationAndGrowing',
  'production_timeline': 'cultivationAndGrowing',
  'cultivationIntelligence': 'cultivationAndGrowing',
  'cultivationDifficulty': 'cultivationAndGrowing',
  'cultivationMethods': 'cultivationAndGrowing',
  'substratePreferences': 'cultivationAndGrowing',
  'harvestTime': 'cultivationAndGrowing',
  'growthConditions': 'cultivationAndGrowing',
  'harvestingMethods': 'cultivationAndGrowing',

  // ===== MEDICINAL & HEALTH (7 felder) =====
  'medicinal': 'medicinalAndHealth',
  'medicinalProperties': 'medicinalAndHealth',
  'traditional_medicine': 'medicinalAndHealth',
  'therapeutic_categories': 'medicinalAndHealth',
  'clinical_trials': 'medicinalAndHealth',
  'safety': 'medicinalAndHealth',
  'dosing': 'medicinalAndHealth',
  'activeCompounds': 'medicinalAndHealth',
  'healthBenefits': 'medicinalAndHealth',
  'medicinalUses': 'medicinalAndHealth',
  'therapeuticApplications': 'medicinalAndHealth',

  // ===== CULINARY & NUTRITIONAL (14 felder) =====
  'culinary': 'culinaryAndNutritional',
  'edibility': 'culinaryAndNutritional',
  'edibilityRating': 'culinaryAndNutritional',
  'edible_uses': 'culinaryAndNutritional',
  'nutritional_profile': 'culinaryAndNutritional',
  'flavor_profiles': 'culinaryAndNutritional',
  'cooking_methods': 'culinaryAndNutritional',
  'pairings': 'culinaryAndNutritional',
  'tasteProfile': 'culinaryAndNutritional',
  'flavorProfile': 'culinaryAndNutritional',
  'preparationMethods': 'culinaryAndNutritional',
  'nutritionalValue': 'culinaryAndNutritional',
  'culinaryUses': 'culinaryAndNutritional',

  // ===== ECONOMIC & COMMERCIAL (15 felder) =====
  'economics': 'commercialAndMarket',
  'economicData': 'commercialAndMarket',
  'market_value': 'commercialAndMarket',
  'production_volume': 'commercialAndMarket',
  'trade_data': 'commercialAndMarket',
  'price_trends': 'commercialAndMarket',
  'commercial_products': 'commercialAndMarket',
  'supply_chains': 'commercialAndMarket',
  'marketValue': 'commercialAndMarket',
  'commercialValue': 'commercialAndMarket',
  'availability': 'commercialAndMarket',
  'tradeData': 'commercialAndMarket',
  'marketSegments': 'commercialAndMarket',
  'commercialProducts': 'commercialAndMarket',
  'commercialUses': 'commercialAndMarket',

  // ===== CONSERVATION & ENVIRONMENTAL (11 felder) =====
  'conservation': 'environmentalAndConservation',
  'conservation_status': 'environmentalAndConservation',
  'iucn_category': 'environmentalAndConservation',
  'threats': 'environmentalAndConservation',
  'conservation_actions': 'environmentalAndConservation',
  'habitat_requirements': 'environmentalAndConservation',
  'conservationStatus': 'environmentalAndConservation',
  'environmentalIntelligence': 'environmentalAndConservation',
  'ecologicalRole': 'environmentalAndConservation',
  'ecosystemServices': 'environmentalAndConservation',
  'threatsAndChallenges': 'environmentalAndConservation',

  // ===== CULTURAL & HISTORICAL (13 felder) =====
  'cultural': 'historicalAndCultural',
  'culturalSignificance': 'historicalAndCultural',
  'traditional_practices': 'historicalAndCultural',
  'folklore_mythology': 'historicalAndCultural',
  'artistic_references': 'historicalAndCultural',
  'ethnobotanical_uses': 'historicalAndCultural',
  'culturalDimensions': 'historicalAndCultural',
  'folklore': 'historicalAndCultural',
  'traditions': 'historicalAndCultural',
  'historicalSignificance': 'historicalAndCultural',
  'firstDocumented': 'historicalAndCultural',
  'traditionalUses': 'historicalAndCultural',

  // ===== RESEARCH & INNOVATION (12 felder) =====
  'research': 'researchAndInnovation',
  'researchAndInnovation': 'researchAndInnovation',
  'research_gaps': 'researchAndInnovation',
  'active_studies': 'researchAndInnovation',
  'publications': 'researchAndInnovation',
  'patent_data': 'researchAndInnovation',
  'future_potential': 'researchAndInnovation',
  'studies': 'researchAndInnovation',
  'researchInterest': 'researchAndInnovation',
  'activeResearchAreas': 'researchAndInnovation',
  'innovativeApplications': 'researchAndInnovation',
  'patentedTechnologies': 'researchAndInnovation',

  // ===== SAFETY & IDENTIFICATION (7 felder) =====
  'safetyAndIdentification': 'safetyAndIdentification',
  'toxicity': 'safetyAndIdentification',
  'toxicityLevel': 'safetyAndIdentification',
  'lookalikes': 'safetyAndIdentification',
  'lookalikeSpecies': 'safetyAndIdentification',
  'warnings': 'safetyAndIdentification',
  'identificationFeatures': 'safetyAndIdentification',

  // ===== METADATA & SYSTEM (1 feld) =====
  'metadata': 'metadata',

  // ===== RELATIONSHIPS & INTERACTIONS (2 felder) =====
  'interactionsAndRelationships': 'ecologyAndDistribution',
  'knowledgeConnections': 'ecologyAndDistribution',
};

// ============================================================================
// PERSPECTIVE DEFINITIONS - HARMONISCHES FARBSPEKTRUM
// ============================================================================
// Zentrale Farbdefinition für alle Perspektiven
// 
// Farbgruppen (harmonisches Spektrum):
// 🟢 NATUR (Grün-Spektrum): Conservation → Ecology → Cultivation → Cooking
// 🔵 IDENTITÄT (Cyan-Blau): Name → Family Tree → Evolution  
// 🟣 STRUKTUR (Violett-Magenta): Appearance → Micro → Chemistry → Senses
// 🟠 PRAKTISCH (Warm): Health → Market → Culture → Safety
//
export const perspectiveDefinitions: Record<string, {
  label: string;
  description: string;
  category: 'primary' | 'application' | 'utility';
  icon: string;
  color: string;
  order: number;
}> = {
  // === NATUR-GRUPPE (Grün-Spektrum) ===
  'environmentalAndConservation': {
    label: 'Conservation',
    description: 'Conservation status, threats, habitat requirements',
    category: 'application',
    icon: '🌿',
    color: '#059669',  // Emerald-600
    order: 1,
  },
  'ecologyAndDistribution': {
    label: 'Habitat',
    description: 'Habitat, substrate, interactions, ecosystem services',
    category: 'primary',
    icon: '🌍',
    color: '#0d9488',  // Teal-600
    order: 2,
  },
  'temporalPatterns': {
    label: 'Seasons',
    description: 'Life cycle, phenology, circadian rhythms, history',
    category: 'primary',
    icon: '📅',
    color: '#0f766e',  // Teal-700
    order: 3,
  },
  'geographyAndDistribution': {
    label: 'Location',
    description: 'Native range, climate envelope, occurrence data',
    category: 'primary',
    icon: '🗺️',
    color: '#14b8a6',  // Teal-500
    order: 4,
  },
  'cultivationAndGrowing': {
    label: 'Growing',
    description: 'Growing conditions, substrates, production timeline',
    category: 'primary',
    icon: '🌱',
    color: '#16a34a',  // Green-600
    order: 5,
  },
  'culinaryAndNutritional': {
    label: 'Cooking',
    description: 'Edibility, recipes, nutrition, flavor profiles',
    category: 'application',
    icon: '🍳',
    color: '#65a30d',  // Lime-600
    order: 6,
  },

  // === IDENTITÄT-GRUPPE (Cyan-Blau Spektrum) ===
  'identity': {
    label: 'Name',
    description: 'Names, etymology, common names, scientific nomenclature',
    category: 'primary',
    icon: '🏷️',
    color: '#0891b2',  // Cyan-600
    order: 7,
  },
  'taxonomy': {
    label: 'Family Tree',
    description: 'Hierarchical classification from kingdom to species',
    category: 'primary',
    icon: '🌳',
    color: '#0284c7',  // Sky-600
    order: 8,
  },
  'phylogeny': {
    label: 'Evolution',
    description: 'Evolutionary relationships, genetic markers, genome data',
    category: 'primary',
    icon: '🧬',
    color: '#2563eb',  // Blue-600
    order: 9,
  },
  'researchAndInnovation': {
    label: 'Science',
    description: 'Active research, publications, patents, future potential',
    category: 'application',
    icon: '🔬',
    color: '#4f46e5',  // Indigo-600
    order: 10,
  },

  // === STRUKTUR-GRUPPE (Violett-Magenta Spektrum) ===
  'morphologyAndAnatomy': {
    label: 'Appearance',
    description: 'Macro characteristics: cap, stem, gills, spore print',
    category: 'primary',
    icon: '👁️',
    color: '#7c3aed',  // Violet-600
    order: 11,
  },
  'microscopyAndCellular': {
    label: 'Micro',
    description: 'Spores, basidia, hyphae, tissue structure',
    category: 'primary',
    icon: '🔬',
    color: '#9333ea',  // Purple-600
    order: 12,
  },
  'chemicalAndProperties': {
    label: 'Chemistry',
    description: 'Nutrients, metabolites, volatilome, enzymes',
    category: 'primary',
    icon: '🧪',
    color: '#a855f7',  // Purple-500
    order: 13,
  },
  'sensoryProfile': {
    label: 'Senses',
    description: 'Aroma, taste, texture, appearance, sound',
    category: 'primary',
    icon: '👃',
    color: '#c026d3',  // Fuchsia-600
    order: 14,
  },
  'visualIdentity': {
    label: 'Visual',
    description: 'Images, colors, visual signature',
    category: 'primary',
    icon: '📸',
    color: '#d946ef',  // Fuchsia-500
    order: 15,
  },

  // === PRAKTISCH-GRUPPE (Warm Spektrum) ===
  'medicinalAndHealth': {
    label: 'Health',
    description: 'Traditional medicine, clinical trials, safety, dosing',
    category: 'application',
    icon: '❤️',
    color: '#dc2626',  // Red-600
    order: 16,
  },
  'safetyAndIdentification': {
    label: 'Safety',
    description: 'Toxicity, look-alikes, identification features, warnings',
    category: 'utility',
    icon: '⚠️',
    color: '#ea580c',  // Orange-600
    order: 17,
  },
  'commercialAndMarket': {
    label: 'Market',
    description: 'Market value, production volume, trade data, pricing',
    category: 'application',
    icon: '💰',
    color: '#ca8a04',  // Yellow-600
    order: 18,
  },
  'historicalAndCultural': {
    label: 'Culture',
    description: 'Folklore, traditions, ethnobotany, cultural significance',
    category: 'application',
    icon: '📜',
    color: '#b45309',  // Amber-700
    order: 19,
  },

  // === UTILITY ===
  'metadata': {
    label: 'Info',
    description: 'System data, quality metrics, version control',
    category: 'utility',
    icon: '📋',
    color: '#64748b',  // Slate-500
    order: 20,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get perspective color by ID
 * ZENTRALE FUNKTION - Verwende diese überall statt lokaler Farbdefinitionen!
 */
export function getPerspectiveColor(perspectiveId: string): string {
  return perspectiveDefinitions[perspectiveId]?.color || '#64748b';
}

/**
 * Get perspective definition by ID
 */
export function getPerspectiveDefinition(perspectiveId: string) {
  return perspectiveDefinitions[perspectiveId] || null;
}

/**
 * Get all perspective colors as a map
 */
export function getAllPerspectiveColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [id, def] of Object.entries(perspectiveDefinitions)) {
    colors[id] = def.color;
  }
  return colors;
}

/**
 * Get perspective for a field
 */
export function getPerspectiveForField(fieldName: string): string | null {
  return fieldToPerspectiveIndex[fieldName] || null;
}

/**
 * Get all fields for a perspective
 */
export function getFieldsForPerspective(perspectiveId: string): string[] {
  const fields: string[] = [];
  for (const [field, perspective] of Object.entries(fieldToPerspectiveIndex)) {
    if (perspective === perspectiveId) {
      fields.push(field);
    }
  }
  return Array.from(new Set(fields)); // Remove duplicates
}

/**
 * Get all perspectives with their fields count
 */
export function getPerspectivesWithCounts(): Array<{
  perspectiveId: string;
  label: string;
  fieldCount: number;
  category: string;
  order: number;
}> {
  const perspectives = new Set(Object.values(fieldToPerspectiveIndex));
  
  return Array.from(perspectives)
    .map(perspectiveId => ({
      perspectiveId,
      label: perspectiveDefinitions[perspectiveId]?.label || perspectiveId,
      fieldCount: getFieldsForPerspective(perspectiveId).length,
      category: perspectiveDefinitions[perspectiveId]?.category || 'unknown',
      order: perspectiveDefinitions[perspectiveId]?.order || 999,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get all perspectives sorted by order
 */
export function getAllPerspectives(): Array<{
  id: string;
  label: string;
  description: string;
  category: string;
  fieldCount: number;
}> {
  return Array.from(new Set(Object.values(fieldToPerspectiveIndex)))
    .map(perspectiveId => {
      const def = perspectiveDefinitions[perspectiveId];
      return {
        id: perspectiveId,
        label: def?.label || perspectiveId,
        description: def?.description || '',
        category: def?.category || 'unknown',
        fieldCount: getFieldsForPerspective(perspectiveId).length,
      };
    })
    .sort((a, b) => {
      const orderA = perspectiveDefinitions[a.id]?.order || 999;
      const orderB = perspectiveDefinitions[b.id]?.order || 999;
      return orderA - orderB;
    });
}

// ============================================================================
// PERSPECTIVE SCHEMA FIELDS
// ============================================================================
// Groups fields by perspective, used by components to display fields per perspective
// 
// Structure: { perspectiveId: { displayFields: string[] } }
// This is computed from fieldToPerspectiveIndex

export const perspectiveSchemaFields: Record<string, { displayFields: string[] }> = (() => {
  const result: Record<string, { displayFields: string[] }> = {};
  
  // Group fields by their perspective
  for (const [field, perspectiveId] of Object.entries(fieldToPerspectiveIndex)) {
    if (!result[perspectiveId]) {
      result[perspectiveId] = { displayFields: [] };
    }
    result[perspectiveId].displayFields.push(field);
  }
  
  return result;
})();

/**
 * Check if field is mapped
 */
export function isFieldMapped(fieldName: string): boolean {
  return fieldName in fieldToPerspectiveIndex;
}

/**
 * Get statistics about the mappings
 */
export function getMappingStatistics() {
  const perspectives = new Set(Object.values(fieldToPerspectiveIndex));
  const fields = Object.keys(fieldToPerspectiveIndex);
  const uniqueFields = new Set(fields);

  return {
    totalPerspectives: perspectives.size,
    totalFields: fields.length,
    uniqueFields: uniqueFields.size,
    duplicateFields: fields.length - uniqueFields.size,
    perspectiveDetails: getPerspectivesWithCounts(),
  };
}

/**
 * Get mapping of field keys to their perspective IDs
 * Used to dynamically construct perspective objects in fungi.ts
 * 
 * Returns TOP-LEVEL database field keys (like 'ecology', 'conservation')
 * mapped to their perspective IDs (like 'ecologyAndDistribution')
 */
export function getFieldKeyToPerspectiveMapping(): Record<string, string> {
  // These are the actual top-level field keys used in the database schema
  // Each maps to its corresponding perspective ID
  const topLevelFields: Record<string, string> = {
    // Identity fields
    'commonName': 'identity',
    'latinName': 'identity',
    'scientificNameSynonyms': 'identity',
    'commonNameVariants': 'identity',
    'internationalNames': 'identity',
    'nomenclatureHistory': 'identity',
    
    // Visual
    'visualIdentity': 'visualIdentity',
    
    // Taxonomy
    'taxonomy': 'taxonomy',
    
    // Phylogeny
    'phylogeny': 'phylogeny',
    
    // Morphology
    'morphology': 'morphologyAndAnatomy',
    
    // Microscopy
    'microscopy': 'microscopyAndCellular',
    
    // Chemistry
    'chemistry': 'chemicalAndProperties',
    
    // Sensory
    'sensoryProfile': 'sensoryProfile',
    
    // Ecology - NOTE: database key is 'ecology', perspective is 'ecologyAndDistribution'
    'ecology': 'ecologyAndDistribution',
    
    // Temporal
    'temporalPatterns': 'temporalPatterns',
    
    // Geography - NOTE: database key is 'geography', perspective is 'geographyAndDistribution'
    'geography': 'geographyAndDistribution',
    
    // Cultivation
    'cultivation': 'cultivationAndGrowing',
    
    // Medicinal
    'medicinal': 'medicinalAndHealth',
    
    // Culinary
    'culinary': 'culinaryAndNutritional',
    
    // Economics
    'economics': 'commercialAndMarket',
    
    // Conservation - NOTE: database key is 'conservation', perspective is 'environmentalAndConservation'
    'conservation': 'environmentalAndConservation',
    
    // Cultural - NOTE: database key is 'cultural', perspective is 'historicalAndCultural'
    'cultural': 'historicalAndCultural',
    
    // Research
    'research': 'researchAndInnovation',
    
    // Safety
    'safetyAndIdentification': 'safetyAndIdentification',
    
    // Metadata
    'metadata': 'metadata',
  };
  
  return topLevelFields;
}
