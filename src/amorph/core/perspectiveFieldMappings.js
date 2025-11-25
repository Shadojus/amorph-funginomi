/**
 * 🎯 PERSPECTIVE FIELD MAPPINGS - Complete Schema v5.0
 * 
 * ✨ VOLLSTÄNDIG AKTUALISIERT - Alle Schema-Felder abgedeckt!
 * JavaScript Version (pure JS, no TypeScript)
 * 
 * Mapping aller Top-Level Felder aus schema.ts zu ihren Perspektiven
 * Verwendet in:
 * - PerspectiveCard.js
 * - PerspectiveReactor.js
 * - Grid-View & Bubble-View Rendering
 * - SearchFilterController.js
 * 
 * Schema v5.0 Feldstruktur:
 * 20 Hauptperspektiven + 12 Unterkategorien
 * Gesamt: ~195 explizit gemappte Felder
 */

// ============================================================================
// PRIMARY FIELD TO PERSPECTIVE INDEX
// ============================================================================
export const fieldToPerspectiveIndex = {
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
// PERSPECTIVE DEFINITIONS
// ============================================================================
// Definiert alle eindeutigen Perspektiven mit Metadaten
export const perspectiveDefinitions: Record<string, {
  label: string;
  description: string;
  category: 'primary' | 'application' | 'utility';
  icon?: string;
  order: number;
}> = {
  // Primary Perspectives (14)
  'identity': {
    label: 'Identity & Nomenclature',
    description: 'Names, etymology, common names, scientific nomenclature',
    category: 'primary',
    order: 1,
  },
  'visualIdentity': {
    label: 'Visual Identity',
    description: 'Images, colors, 360° views, visual signatures',
    category: 'primary',
    order: 2,
  },
  'taxonomy': {
    label: 'Taxonomy',
    description: 'Hierarchical classification from kingdom to species',
    category: 'primary',
    order: 3,
  },
  'phylogeny': {
    label: 'Phylogeny & Evolution',
    description: 'Evolutionary relationships, genetic markers, genome data',
    category: 'primary',
    order: 4,
  },
  'morphologyAndAnatomy': {
    label: 'Morphology & Anatomy',
    description: 'Macro characteristics: cap, stem, gills, spore print',
    category: 'primary',
    order: 5,
  },
  'microscopyAndCellular': {
    label: 'Microscopy & Cellular',
    description: 'Spores, basidia, hyphae, tissue structure',
    category: 'primary',
    order: 6,
  },
  'chemicalAndProperties': {
    label: 'Chemistry & Compounds',
    description: 'Nutrients, metabolites, volatilome, enzymes',
    category: 'primary',
    order: 7,
  },
  'sensoryProfile': {
    label: 'Sensory Profile',
    description: 'Aroma, taste, texture, appearance, sound',
    category: 'primary',
    order: 8,
  },
  'ecologyAndDistribution': {
    label: 'Ecology & Distribution',
    description: 'Habitat, substrate, interactions, ecosystem services',
    category: 'primary',
    order: 9,
  },
  'temporalPatterns': {
    label: 'Temporal Patterns',
    description: 'Life cycle, phenology, circadian rhythms, history',
    category: 'primary',
    order: 10,
  },
  'geographyAndDistribution': {
    label: 'Geography & Distribution',
    description: 'Native range, climate envelope, occurrence data',
    category: 'primary',
    order: 11,
  },
  'cultivationAndGrowing': {
    label: 'Cultivation & Growing',
    description: 'Growing conditions, substrates, production timeline',
    category: 'primary',
    order: 12,
  },

  // Application Perspectives (6)
  'medicinalAndHealth': {
    label: 'Medicinal & Health',
    description: 'Traditional medicine, clinical trials, safety, dosing',
    category: 'application',
    order: 13,
  },
  'culinaryAndNutritional': {
    label: 'Culinary & Nutritional',
    description: 'Edibility, recipes, nutrition, flavor profiles',
    category: 'application',
    order: 14,
  },
  'commercialAndMarket': {
    label: 'Commercial & Market',
    description: 'Market value, production volume, trade data, pricing',
    category: 'application',
    order: 15,
  },
  'environmentalAndConservation': {
    label: 'Environmental & Conservation',
    description: 'Conservation status, threats, habitat requirements',
    category: 'application',
    order: 16,
  },
  'historicalAndCultural': {
    label: 'Historical & Cultural',
    description: 'Folklore, traditions, ethnobotany, cultural significance',
    category: 'application',
    order: 17,
  },
  'researchAndInnovation': {
    label: 'Research & Innovation',
    description: 'Active research, publications, patents, future potential',
    category: 'application',
    order: 18,
  },

  // Utility Perspectives (3)
  'safetyAndIdentification': {
    label: 'Safety & Identification',
    description: 'Toxicity, look-alikes, identification features, warnings',
    category: 'utility',
    order: 19,
  },
  'metadata': {
    label: 'Metadata',
    description: 'System data, quality metrics, version control',
    category: 'utility',
    order: 20,
  },
};

// ============================================================================
// PERSPECTIVE SCHEMA FIELDS - Maps perspective names to their display fields
// ============================================================================
export const perspectiveSchemaFields: Record<string, { displayFields: string[] }> = (() => {
  const result: Record<string, { displayFields: string[] }> = {};
  
  // Group all fields by their perspective
  for (const [fieldKey, perspectiveId] of Object.entries(fieldToPerspectiveIndex)) {
    if (!result[perspectiveId]) {
      result[perspectiveId] = {
        displayFields: []
      };
    }
    result[perspectiveId].displayFields.push(fieldKey);
  }
  
  return result;
})();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
 */
export function getFieldKeyToPerspectiveMapping(): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  const perspectiveIds = new Set(Object.values(fieldToPerspectiveIndex));
  
  for (const perspectiveId of perspectiveIds) {
    const mainFieldKey = Object.entries(fieldToPerspectiveIndex).find(
      ([key, perspective]) => 
        perspective === perspectiveId && key === perspectiveId
    )?.[0];
    
    if (mainFieldKey) {
      mapping[mainFieldKey] = perspectiveId;
    }
  }
  
  return mapping;
}
