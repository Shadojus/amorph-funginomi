/**
 * AMORPH Ultimate Holistic Schema v5.0
 * 
 * Complete Integration: Combines ALL fields from both schemas
 * - Every field from the archived detailed schema
 * - All new visualization patterns from v4.0
 * - Enhanced for automatic morph detection
 * - Lateral cross-references throughout
 * - Maximum detail preservation
 * 
 * Core Principles:
 * - COMPLETENESS: No data loss from either schema
 * - VISUALIZATION: Every field optimized for MorphMapper
 * - HOLISTIC: Multi-dimensional interconnections
 * - LATERAL: Unconventional relationships captured
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * ============================================================================
 * MASTER FUNGI TABLE - Complete Integration
 * ============================================================================
 */
const fungi = defineTable({
  // ===== CORE IDENTITY (Enhanced from both) =====
  commonName: v.string(),
  latinName: v.string(),
  scientificNameSynonyms: v.optional(v.array(v.string())),
  commonNameVariants: v.optional(v.array(v.string())),
  seoName: v.string(),
  slug: v.string(),
  
  // Multi-language names (v4 enhancement)
  internationalNames: v.optional(v.array(v.object({
    language: v.string(),
    name: v.string(),
    script: v.optional(v.string()),
  }))),
  
  // Core description (from archived)
  description: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  imageUrls: v.optional(v.array(v.string())),
  
  // ===== VISUAL IDENTITY (Enhanced v4) =====
  visualIdentity: v.object({
    primaryImage: v.optional(v.string()),
    
    imageGallery: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      viewAngle: v.optional(v.string()),
      developmentStage: v.optional(v.string()),
      season: v.optional(v.string()),
      photographer: v.optional(v.string()),
      license: v.optional(v.string()),
    }))),
    
    view360: v.optional(v.object({
      frames: v.array(v.string()),
      frameCount: v.number(),
      rotationAxis: v.string(),
    })),
    
    colorPalette: v.optional(v.array(v.object({
      hex: v.string(),
      name: v.string(),
      dominance: v.number(),
      location: v.string(),
    }))),
    
    visualSignature: v.optional(v.object({
      shape: v.array(v.number()),
      texture: v.array(v.number()),
      color: v.array(v.number()),
    })),
  }),
  
  // ===== TAXONOMY (Combined & Enhanced) =====
  taxonomy: v.object({
    kingdom: v.string(),
    phylum: v.string(),
    class: v.string(),
    order: v.string(),
    family: v.string(),
    genus: v.string(),
    species: v.string(),
    subspecies: v.optional(v.string()),
    variety: v.optional(v.string()),
    forma: v.optional(v.string()),
    
    confidence: v.optional(v.object({
      level: v.number(),
      disputed: v.boolean(),
      alternativeClassifications: v.optional(v.array(v.string())),
    })),
    
    phylogeny: v.optional(v.object({
      clade: v.string(),
      sister_species: v.optional(v.array(v.string())),
      divergence_time: v.optional(v.number()),
      evolutionary_traits: v.optional(v.array(v.string())),
    })),
  }),
  
  // ===== MORPHOLOGY & PHYSICAL CHARACTERISTICS (Merged & Enhanced) =====
  morphology: v.object({
    // 3D Shape parameters (v4)
    shapeParameters: v.optional(v.object({
      cap: v.object({
        profile: v.array(v.object({ x: v.number(), y: v.number() })),
        curvature: v.number(),
        symmetry: v.number(),
        irregularity: v.number(),
      }),
      stem: v.object({
        taper: v.number(),
        curve: v.number(),
        hollowness: v.number(),
      }),
    })),
    
    // Physical Characteristics (from archived, reorganized)
    cap: v.object({
      shape: v.optional(v.array(v.string())), // convex, campanulate, umbonate
      diameter: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        typical: v.optional(v.number()),
        unit: v.string(),
      })),
      thickness: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(),
      })),
      color: v.optional(v.array(v.string())),
      texture: v.optional(v.array(v.string())), // smooth, scaly, fibrillose
      margin: v.optional(v.string()), // incurved, straight, decurved
      surface: v.optional(v.string()), // dry, viscid, sticky, slimy
      patterns: v.optional(v.array(v.string())), // concentric, radial, spotted
    }),
    
    hymenophore: v.object({
      type: v.optional(v.string()), // gills, pores, teeth, smooth
      gillAttachment: v.optional(v.string()), // free, adnate, decurrent
      gillSpacing: v.optional(v.string()), // crowded, close, distant
      gillColor: v.optional(v.array(v.string())),
      poreSize: v.optional(v.string()), // for polypores
      poreShape: v.optional(v.string()),
    }),
    
    stem: v.object({
      height: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        typical: v.optional(v.number()),
        unit: v.string(),
      })),
      diameter: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        typical: v.optional(v.number()),
        unit: v.string(),
      })),
      color: v.optional(v.array(v.string())),
      texture: v.optional(v.string()),
      base: v.optional(v.string()), // bulbous, tapered, equal
      ornamentation: v.optional(v.array(v.string())), // reticulate, scaly
    }),
    
    veil: v.optional(v.object({
      type: v.optional(v.string()), // partial, universal
      presence: v.optional(v.string()), // present, absent
      remnants: v.optional(v.string()),
    })),
    
    ring: v.optional(v.object({
      presence: v.optional(v.string()),
      position: v.optional(v.string()),
      texture: v.optional(v.string()),
    })),
    
    volva: v.optional(v.object({
      presence: v.optional(v.string()),
      type: v.optional(v.string()),
      color: v.optional(v.string()),
    })),
    
    // Special features (from archived)
    latex: v.optional(v.object({
      presence: v.boolean(),
      color: v.optional(v.string()),
      staining: v.optional(v.string()),
    })),
    
    staining: v.optional(v.object({
      when: v.string(), // bruised, cut, aged
      color: v.string(),
      location: v.optional(v.string()),
    })),
    
    bioluminescence: v.optional(v.object({
      present: v.boolean(),
      intensity: v.optional(v.number()), // 0-10
      color: v.optional(v.string()),
    })),
    
    // Biomass (v4)
    biomass: v.optional(v.object({
      fresh_weight: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
      dry_weight: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
      water_content: v.number(),
    })),
    
    // Microscopy (combined)
    microscopy: v.optional(v.object({
      spores: v.object({
        printColor: v.optional(v.string()),
        dimensions: v.object({
          length: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
          width: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
        }),
        shape: v.string(),
        ornamentation: v.optional(v.string()),
        color_in_mass: v.optional(v.string()),
        density_per_mm2: v.optional(v.number()),
        amyloid: v.optional(v.boolean()),
      }),
      basidia: v.optional(v.object({
        type: v.string(),
        sterigmata_count: v.number(),
        dimensions: v.optional(v.object({
          length: v.number(),
          width: v.number(),
        })),
      })),
      cystidia: v.optional(v.object({
        present: v.boolean(),
        types: v.optional(v.array(v.string())),
        location: v.optional(v.array(v.string())),
      })),
      hyphae: v.optional(v.object({
        type: v.string(),
        clamps: v.optional(v.boolean()),
        septa: v.optional(v.string()),
      })),
    })),
  }),
  
  // ===== SENSORY PROFILE (v4 Enhanced) =====
  sensoryProfile: v.object({
    aroma: v.optional(v.object({
      intensity: v.number(),
      notes: v.array(v.object({
        category: v.string(),
        specific: v.string(),
        strength: v.number(),
      })),
      volatiles: v.optional(v.array(v.object({
        compound: v.string(),
        concentration: v.number(),
        threshold: v.number(),
      }))),
      aromaEvolution: v.optional(v.array(v.object({
        stage: v.string(),
        profile: v.array(v.string()),
      }))),
    })),
    
    taste: v.optional(v.object({
      basic_tastes: v.object({
        sweet: v.number(),
        sour: v.number(),
        salty: v.number(),
        bitter: v.number(),
        umami: v.number(),
      }),
      flavor_notes: v.array(v.string()),
      mouthfeel: v.array(v.string()),
      aftertaste: v.optional(v.string()),
      taste_timeline: v.optional(v.array(v.object({
        seconds: v.number(),
        dominant_taste: v.string(),
        intensity: v.number(),
      }))),
      raw_taste: v.optional(v.string()), // from archived
      cooked_taste: v.optional(v.string()),
    })),
    
    texture: v.object({
      firmness: v.number(),
      elasticity: v.number(),
      moisture: v.number(),
      roughness: v.number(),
      stickiness: v.number(),
      brittleness: v.optional(v.number()), // from archived
      toughness: v.optional(v.number()),
      texture_conditions: v.optional(v.array(v.object({
        condition: v.string(),
        properties: v.object({
          firmness: v.number(),
          elasticity: v.number(),
          moisture: v.number(),
        }),
      }))),
    }),
    
    sound: v.optional(v.object({
      spore_discharge: v.optional(v.string()),
      breaking_sound: v.optional(v.string()),
      cooking_sounds: v.optional(v.array(v.string())),
    })),
  }),
  
  // ===== SAFETY & IDENTIFICATION (Archived Enhanced) =====
  safetyAndIdentification: v.object({
    edibility: v.string(), // edible, poisonous, toxic, medicinal, unknown, inedible
    edibilityScore: v.optional(v.number()), // 0-10 (10 = excellent edible)
    toxicityLevel: v.optional(v.string()), // none, mild, moderate, severe, deadly
    toxins: v.optional(v.array(v.object({
      name: v.string(),
      concentration: v.optional(v.string()),
      effects: v.optional(v.array(v.string())),
      mechanism: v.optional(v.string()),
    }))),
    symptoms: v.optional(v.array(v.object({
      symptom: v.string(),
      onset: v.optional(v.string()), // time after consumption
      severity: v.optional(v.string()),
      duration: v.optional(v.string()),
    }))),
    treatmentInfo: v.optional(v.string()),
    antidote: v.optional(v.string()),
    
    lookalikeSpecies: v.optional(v.array(v.object({
      species: v.string(),
      scientificName: v.optional(v.string()),
      distinguishingFeatures: v.array(v.string()),
      toxicityDifference: v.optional(v.string()),
      confusionRisk: v.optional(v.number()), // 0-10
    }))),
    
    identificationDifficulty: v.string(), // beginner, intermediate, advanced, expert
    keyIdentificationFeatures: v.array(v.string()),
    identificationSeasonality: v.optional(v.array(v.string())),
    microscopicFeaturesRequired: v.optional(v.boolean()),
    chemicalTestsRequired: v.optional(v.boolean()),
    chemicalTests: v.optional(v.array(v.object({
      reagent: v.string(),
      reaction: v.string(),
      location: v.string(), // cap, stem, flesh
    }))),
    
    safetyWarnings: v.optional(v.array(v.string())),
    specialPrecautions: v.optional(v.array(v.string())),
    
    // Risk matrix (for visualization)
    riskMatrix: v.optional(v.object({
      toxicity_risk: v.number(), // 0-10
      misidentification_risk: v.number(),
      allergic_risk: v.number(),
      interaction_risk: v.number(),
      overall_safety: v.number(),
    })),
  }),
  
  // ===== ECOLOGICAL NETWORK (Combined & Enhanced) =====
  ecologicalNetwork: v.object({
    trophicLevel: v.number(),
    ecologicalRole: v.array(v.string()), // decomposer, mycorrhizal, parasitic
    
    // Habitat (from archived)
    habitat: v.array(v.string()), // forest, grassland, urban, wetland
    substrate: v.array(v.string()), // wood, soil, dung, living trees
    substrateDetails: v.optional(v.array(v.string())), // specific tree species
    
    // Symbiotic network (v4 enhanced)
    symbioticPartners: v.optional(v.array(v.object({
      partner_type: v.string(),
      partner_species: v.string(),
      relationship_type: v.string(),
      interaction_strength: v.number(),
      bidirectional: v.boolean(),
      seasonal: v.optional(v.boolean()),
      benefits_given: v.array(v.string()),
      benefits_received: v.array(v.string()),
      network_centrality: v.optional(v.number()),
      details: v.optional(v.string()), // from archived
    }))),
    
    substratePreferences: v.array(v.object({
      substrate_type: v.string(),
      preference_score: v.number(),
      specificity: v.string(),
      decomposition_rate: v.optional(v.number()),
    })),
    
    competitors: v.optional(v.array(v.object({
      species: v.string(),
      competition_intensity: v.number(),
      resource_overlap: v.number(),
      outcome: v.string(),
    }))),
    
    facilitators: v.optional(v.array(v.object({
      species: v.string(),
      facilitation_type: v.string(),
      effect_magnitude: v.number(),
    }))),
    
    dispersalVectors: v.optional(v.array(v.object({
      vector: v.string(),
      effectiveness: v.number(),
      distance_class: v.string(),
      seasonal_pattern: v.optional(v.array(v.number())),
    }))),
    
    // Ecosystem services (from archived)
    ecosystemServices: v.optional(v.array(v.object({
      service: v.string(),
      importance: v.number(),
      scale: v.string(),
      beneficiaries: v.array(v.string()),
      economic_value: v.optional(v.number()),
    }))),
    
    keystoneIndex: v.optional(v.number()), // 0-10
  }),
  
  // ===== TEMPORAL PATTERNS (v4 + Archived) =====
  temporalPatterns: v.object({
    // Life cycle (v4)
    lifeCycle: v.array(v.object({
      stage: v.string(),
      duration_days: v.object({ min: v.number(), max: v.number(), typical: v.number() }),
      temperature_requirement: v.optional(v.object({ min: v.number(), max: v.number() })),
      trigger_conditions: v.optional(v.array(v.string())),
      morphological_changes: v.array(v.string()),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),
    })),
    
    // Seasonality (combined)
    seasonality: v.object({
      primarySeason: v.array(v.string()), // from archived
      peakMonths: v.optional(v.array(v.string())),
      year_round: v.boolean(),
      
      monthly_activity: v.array(v.object({
        month: v.number(),
        fruiting_probability: v.number(),
        growth_rate: v.number(),
        spore_production: v.number(),
        visibility: v.number(),
      })),
      
      climate_variations: v.optional(v.array(v.object({
        zone: v.string(),
        pattern: v.array(v.number()),
      }))),
    }),
    
    // Circadian rhythm (v4)
    circadianRhythm: v.optional(v.object({
      spore_release_pattern: v.array(v.object({
        hour: v.number(),
        intensity: v.number(),
      })),
      growth_pattern: v.array(v.object({
        hour: v.number(),
        rate: v.number(),
      })),
      metabolic_activity: v.array(v.object({
        hour: v.number(),
        level: v.number(),
      })),
    })),
    
    // Historical timeline (v4)
    historicalTimeline: v.optional(v.array(v.object({
      year: v.number(),
      event: v.string(),
      event_type: v.string(),
      significance: v.number(),
      location: v.optional(v.string()),
    }))),
    
    // Projections (v4)
    projections: v.optional(v.object({
      climate_suitability: v.array(v.object({
        year: v.number(),
        suitability_score: v.number(),
        scenario: v.string(),
      })),
      habitat_availability: v.array(v.object({
        year: v.number(),
        area_km2: v.number(),
        change_percent: v.number(),
      })),
    })),
    
    // Biodiversity trend (from archived)
    biodiversityTrend: v.optional(v.array(v.object({
      year: v.number(),
      abundance: v.number(),
      sightings: v.optional(v.number()),
      source: v.optional(v.string()),
    }))),
  }),
  
  // ===== GEOGRAPHIC PATTERNS (Combined) =====
  geographicPatterns: v.object({
    distribution: v.object({
      occurrences: v.optional(v.array(v.object({
        lat: v.number(),
        lon: v.number(),
        date: v.optional(v.number()),
        abundance: v.optional(v.string()),
        verified: v.boolean(),
        elevation_m: v.optional(v.number()),
        habitat: v.optional(v.string()),
      }))),
      
      ranges: v.optional(v.array(v.object({
        type: v.string(),
        polygon: v.array(v.object({ lat: v.number(), lon: v.number() })),
        status: v.string(),
        quality: v.string(),
      }))),
      
      density: v.optional(v.array(v.object({
        lat: v.number(),
        lon: v.number(),
        radius_km: v.number(),
        observations: v.number(),
        relative_abundance: v.number(),
      }))),
      
      bioregions: v.optional(v.array(v.object({
        name: v.string(),
        code: v.string(),
        presence: v.string(),
        abundance: v.optional(v.string()),
      }))),
      
      elevationProfile: v.optional(v.object({
        min_m: v.number(),
        max_m: v.number(),
        optimal_m: v.number(),
        distribution: v.array(v.object({
          elevation_m: v.number(),
          frequency: v.number(),
        })),
      })),
      
      migration: v.optional(v.object({
        dispersal_routes: v.array(v.object({
          from: v.object({ lat: v.number(), lon: v.number() }),
          to: v.object({ lat: v.number(), lon: v.number() }),
          strength: v.number(),
          mechanism: v.string(),
        })),
        colonization_history: v.array(v.object({
          year: v.number(),
          location: v.string(),
          source: v.optional(v.string()),
        })),
      })),
      
      // Legacy fields (from archived)
      continents: v.optional(v.array(v.string())),
      countries: v.optional(v.array(v.string())),
      regions: v.optional(v.array(v.string())),
      endemic: v.optional(v.boolean()),
      invasive: v.optional(v.boolean()),
    }),
    
    climateEnvelope: v.object({
      temperature: v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
        tolerance_range: v.number(),
        unit: v.optional(v.string()),
      }),
      precipitation: v.object({
        min_annual_mm: v.number(),
        max_annual_mm: v.number(),
        optimal_annual_mm: v.number(),
        seasonal_preference: v.optional(v.string()),
      }),
      humidity: v.object({
        min_percent: v.number(),
        max_percent: v.number(),
        optimal_percent: v.number(),
      }),
      climateZones: v.optional(v.array(v.string())),
      bioclim: v.optional(v.array(v.object({
        variable: v.string(),
        value: v.number(),
        importance: v.number(),
      }))),
    }),
    
    abundance: v.optional(v.string()), // from archived
    populationTrend: v.optional(v.string()),
  }),
  
  // ===== CHEMICAL UNIVERSE (Combined & Enhanced) =====
  chemicalUniverse: v.object({
    // Primary metabolites (v4)
    primaryMetabolites: v.object({
      macronutrients: v.array(v.object({
        nutrient: v.string(),
        amount_g_per_100g: v.number(),
        calories: v.number(),
        bioavailability: v.optional(v.number()),
      })),
      
      aminoAcids: v.optional(v.array(v.object({
        name: v.string(),
        amount_mg_per_g: v.number(),
        essential: v.boolean(),
        limiting: v.boolean(),
      }))),
      
      fattyAcids: v.optional(v.array(v.object({
        name: v.string(),
        type: v.string(),
        amount_mg_per_g: v.number(),
        omega_class: v.optional(v.string()),
      }))),
      
      micronutrients: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
        dv_percent: v.optional(v.number()),
        bioavailability: v.optional(v.number()),
      }))),
    }),
    
    // Secondary metabolites (combined)
    secondaryMetabolites: v.object({
      compounds: v.optional(v.array(v.object({
        name: v.string(),
        iupac_name: v.optional(v.string()),
        formula: v.optional(v.string()),
        smiles: v.optional(v.string()),
        class: v.string(),
        subclass: v.optional(v.string()),
        concentration: v.optional(v.object({
          value: v.number(),
          unit: v.string(),
          variance: v.optional(v.number()),
          location: v.optional(v.string()), // from archived
        })),
        bioactivity: v.array(v.string()),
        targets: v.optional(v.array(v.string())),
        function: v.optional(v.string()), // from archived
        toxicity: v.optional(v.object({
          ld50: v.optional(v.number()),
          toxic_dose: v.optional(v.number()),
          mechanism: v.optional(v.string()),
        })),
      }))),
      
      pathways: v.optional(v.array(v.object({
        name: v.string(),
        type: v.string(),
        precursors: v.array(v.string()),
        intermediates: v.array(v.string()),
        products: v.array(v.string()),
        enzymes: v.optional(v.array(v.string())),
        regulation: v.optional(v.string()),
      }))),
      
      fingerprint: v.optional(v.object({
        terpene_score: v.number(),
        alkaloid_score: v.number(),
        phenolic_score: v.number(),
        polysaccharide_score: v.number(),
        peptide_score: v.number(),
        unique_compounds: v.number(),
      }))
    }),
    
    // Enzyme activity (from archived)
    enzymeActivity: v.optional(v.array(v.object({
      enzyme: v.string(),
      activity: v.optional(v.string()),
      substrate: v.optional(v.string()),
      applications: v.optional(v.array(v.string())),
      ec_number: v.optional(v.string()),
    }))),
    
    // Pigments (from archived)
    pigments: v.optional(v.array(v.object({
      name: v.string(),
      color: v.string(),
      chemicalClass: v.optional(v.string()),
      location: v.optional(v.string()),
      wavelength_nm: v.optional(v.number()),
    }))),
    
    // Antioxidants (from archived)
    antioxidantCapacity: v.optional(v.object({
      oracScore: v.optional(v.number()),
      dpphValue: v.optional(v.number()),
      teacValue: v.optional(v.number()),
      frapValue: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
    
    // Antimicrobial (from archived)
    antimicrobialActivity: v.optional(v.array(v.object({
      targetOrganism: v.string(),
      activity: v.string(),
      minimumInhibitoryConcentration: v.optional(v.string()),
      zone_of_inhibition_mm: v.optional(v.number()),
    }))),
    
    // Heavy metals (from archived)
    heavyMetals: v.optional(v.object({
      bioaccumulation: v.optional(v.boolean()),
      concernedMetals: v.optional(v.array(v.object({
        metal: v.string(),
        concentration_ppm: v.optional(v.number()),
        safety_limit_ppm: v.optional(v.number()),
      }))),
      safetyConsiderations: v.optional(v.string()),
    })),
    
    // Volatilome (v4)
    volatilome: v.optional(v.object({
      total_vocs: v.number(),
      major_components: v.array(v.object({
        compound: v.string(),
        percent_of_total: v.number(),
        aroma_descriptor: v.string(),
        threshold_ppb: v.optional(v.number()),
      })),
      aroma_profile: v.array(v.object({
        category: v.string(),
        intensity: v.number(),
        compounds: v.array(v.string()),
      })),
      evolution: v.optional(v.array(v.object({
        time_hours: v.number(),
        profile_change: v.array(v.object({
          compound: v.string(),
          relative_amount: v.number(),
        })),
      }))),
    })),
  }),
  
  // ===== CULTIVATION INTELLIGENCE (Combined) =====
  cultivationIntelligence: v.object({
    // Basic feasibility (from archived)
    cultivable: v.boolean(),
    cultivationDifficulty: v.optional(v.string()),
    commerciallyViable: v.optional(v.boolean()),
    homeGrowingViable: v.optional(v.boolean()),
    
    // Difficulty matrix (v4)
    difficultyMatrix: v.object({
      overall: v.number(),
      factors: v.array(v.object({
        factor: v.string(),
        difficulty: v.number(),
        critical: v.boolean(),
        solutions: v.optional(v.array(v.string())),
      })),
    }),
    
    // Growth parameters (combined)
    growthParameters: v.object({
      temperature: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        storage: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        unit: v.optional(v.string()),
      }),
      humidity: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
      }),
      co2: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        unit: v.optional(v.string()), // ppm
      }),
      light: v.object({
        intensity_lux: v.optional(v.object({ min: v.number(), max: v.number() })),
        photoperiod_hours: v.optional(v.object({ min: v.number(), max: v.number() })),
        spectrum: v.optional(v.array(v.string())),
        colonization_requirement: v.optional(v.string()), // from archived
        fruiting_requirement: v.optional(v.string()),
      }),
      pH: v.object({
        substrate: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        casing: v.optional(v.object({ min: v.number(), max: v.number(), optimal: v.number() })),
      }),
    }),
    
    // Substrate (combined)
    substrateMatrix: v.array(v.object({
      substrate: v.string(),
      suitability: v.number(),
      yield_potential: v.number(),
      colonization_speed: v.number(),
      contamination_risk: v.number(),
      cost_effectiveness: v.number(),
      sustainability: v.number(),
      preparation_method: v.optional(v.string()),
    })),
    
    // Substrate formulations (from archived)
    substrateFormulations: v.optional(v.array(v.object({
      name: v.string(),
      ingredients: v.array(v.object({
        ingredient: v.string(),
        percentage: v.number(),
      })),
      supplementation: v.optional(v.string()),
      notes: v.optional(v.string()),
    }))),
    
    // Nutrition (from archived)
    nutritionalSupplements: v.optional(v.array(v.string())),
    nitrogenRequirements: v.optional(v.string()),
    carbonToNitrogenRatio: v.optional(v.string()),
    
    // Production cycle (v4)
    productionCycle: v.array(v.object({
      phase: v.string(),
      day_start: v.number(),
      day_end: v.number(),
      tasks: v.array(v.string()),
      critical_parameters: v.array(v.string()),
      checkpoint_criteria: v.optional(v.array(v.string())),
      common_issues: v.optional(v.array(v.string())),
    })),
    
    // Timeline (from archived)
    cultivationTimeline: v.optional(v.array(v.object({
      dayOffset: v.number(),
      stage: v.string(),
      label: v.string(),
      description: v.optional(v.string()),
      temperature: v.optional(v.number()),
      humidity: v.optional(v.number()),
      milestone: v.optional(v.boolean()),
    }))),
    
    // Time metrics (from archived)
    timeToColonization: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(),
    })),
    timeToFruiting: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(),
    })),
    totalCycleTime: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(),
    })),
    
    // Flushes (from archived)
    flushes: v.optional(v.object({
      number: v.number(),
      timeBetweenFlushes: v.optional(v.number()),
      yieldDeclinePattern: v.optional(v.string()),
    })),
    
    // Yield model (v4)
    yieldModel: v.optional(v.object({
      base_yield_g_per_kg: v.number(),
      biologicalEfficiency: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(),
      })),
      flushes: v.array(v.object({
        number: v.number(),
        yield_percent: v.number(),
        days_after_first: v.number(),
      })),
      factors: v.array(v.object({
        factor: v.string(),
        impact: v.number(),
        optimal_value: v.optional(v.number()),
      })),
      economics: v.optional(v.object({
        setup_cost: v.number(),
        operating_cost_per_kg: v.number(),
        market_price_per_kg: v.number(),
        roi_months: v.number(),
        break_even_kg: v.number(),
        currency: v.string(),
      })),
    })),
    
    // Methods (from archived)
    cultivationMethods: v.optional(v.array(v.string())),
    propagationMethods: v.optional(v.array(v.string())),
    sterilizationRequired: v.optional(v.boolean()),
    pasteurizationSufficient: v.optional(v.boolean()),
    
    // Growing environment (from archived)
    indoorSuitability: v.optional(v.boolean()),
    outdoorSuitability: v.optional(v.boolean()),
    greenhouseSuitability: v.optional(v.boolean()),
    basementGrowingSuitability: v.optional(v.boolean()),
    
    // Challenges (from archived)
    commonPests: v.optional(v.array(v.string())),
    commonDiseases: v.optional(v.array(v.string())),
    commonContaminants: v.optional(v.array(v.string())),
    contaminationSusceptibility: v.optional(v.string()),
    
    // Harvesting (from archived)
    harvestTiming: v.optional(v.object({
      indicators: v.array(v.string()),
      optimalStage: v.string(),
      timingCritical: v.optional(v.boolean()),
    })),
    harvestMethod: v.optional(v.string()),
    postHarvestHandling: v.optional(v.array(v.string())),
    
    // Processing & Storage (from archived)
    processingMethods: v.optional(v.array(v.string())),
    shelfLife: v.optional(v.object({
      fresh: v.optional(v.object({
        duration: v.number(),
        unit: v.string(),
        conditions: v.optional(v.string()),
      })),
      dried: v.optional(v.object({
        duration: v.number(),
        unit: v.string(),
        conditions: v.optional(v.string()),
      })),
      frozen: v.optional(v.object({
        duration: v.number(),
        unit: v.string(),
        conditions: v.optional(v.string()),
      })),
    })),
    
    // Special requirements (from archived)
    specialEquipment: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    regulatoryConsiderations: v.optional(v.array(v.string())),
    laborRequirements: v.optional(v.string()),
    skillLevel: v.optional(v.string()),
    
    // Strain comparison (v4)
    strainComparison: v.optional(v.array(v.object({
      strain_name: v.string(),
      origin: v.optional(v.string()),
      characteristics: v.object({
        yield_index: v.number(),
        growth_speed: v.number(),
        contamination_resistance: v.number(),
        temperature_tolerance: v.number(),
        shelf_life: v.number(),
        flavor_quality: v.number(),
      }),
      optimal_conditions: v.optional(v.any()),
    }))),
    
    // Growth metrics (from archived)
    growthMetrics: v.optional(v.object({
      colonizationProgress: v.optional(v.number()),
      fruitingProgress: v.optional(v.number()),
      yieldProgress: v.optional(v.number()),
      qualityScore: v.optional(v.number()),
    })),
    
    // Cultivation metrics (from archived)
    cultivationMetrics: v.optional(v.array(v.object({
      strainName: v.optional(v.string()),
      yieldKg: v.number(),
      cycleTimeDays: v.number(),
      contaminationRate: v.optional(v.number()),
      profitability: v.optional(v.number()),
    }))),
  }),
  
  // ===== MEDICINAL INTELLIGENCE (Combined) =====
  medicinalIntelligence: v.object({
    // Therapeutic profile (v4)
    therapeuticProfile: v.array(v.object({
      category: v.string(),
      strength: v.number(),
      evidence_level: v.string(),
      mechanisms: v.array(v.string()),
      active_compounds: v.array(v.string()),
    })),
    
    // Medicinal properties (from archived)
    medicinalProperties: v.optional(v.array(v.object({
      property: v.string(),
      evidence: v.optional(v.string()),
      activeCompounds: v.optional(v.array(v.string())),
      mechanism: v.optional(v.string()),
      strength: v.optional(v.string()),
    }))),
    
    // Clinical evidence (combined)
    clinicalEvidence: v.optional(v.array(v.object({
      condition: v.string(),
      evidence_type: v.string(),
      sample_size: v.optional(v.number()),
      effect_size: v.optional(v.number()),
      p_value: v.optional(v.number()),
      year: v.number(),
      dosage: v.optional(v.string()),
      duration: v.optional(v.string()),
      adverse_events: v.optional(v.array(v.string())),
      results: v.optional(v.string()), // from archived
      status: v.optional(v.string()),
    }))),
    
    // Bioactivity spectrum (v4)
    bioactivitySpectrum: v.optional(v.object({
      antibacterial: v.number(),
      antiviral: v.number(),
      antifungal: v.number(),
      antiparasitic: v.number(),
      anticancer: v.number(),
      immunomodulatory: v.number(),
      anti_inflammatory: v.number(),
      antioxidant: v.number(),
      neuroprotective: v.number(),
      hepatoprotective: v.number(),
      cardioprotective: v.number(),
      antidiabetic: v.number(),
      adaptogenic: v.optional(v.number()), // additional
      anxiolytic: v.optional(v.number()),
      analgesic: v.optional(v.number()),
    })),
    
    // Molecular targets (v4)
    molecularTargets: v.optional(v.array(v.object({
      target: v.string(),
      interaction_type: v.string(),
      affinity: v.optional(v.number()),
      selectivity: v.optional(v.number()),
      validated: v.boolean(),
    }))),
    
    // Traditional medicine (combined)
    traditionalMedicine: v.optional(v.array(v.object({
      system: v.string(),
      name: v.string(),
      uses: v.array(v.string()),
      preparation: v.string(),
      contraindications: v.optional(v.array(v.string())),
      cultural_significance: v.optional(v.number()),
      still_practiced: v.optional(v.boolean()), // from archived
    }))),
    
    // Dosage (from archived)
    dosageRecommendations: v.optional(v.array(v.object({
      form: v.string(),
      amount: v.string(),
      frequency: v.string(),
      duration: v.optional(v.string()),
      notes: v.optional(v.string()),
    }))),
    
    // Contraindications (from archived)
    contraindications: v.optional(v.array(v.string())),
    interactions: v.optional(v.array(v.object({
      substance: v.string(),
      effect: v.string(),
      severity: v.optional(v.string()),
    }))),
    
    sideEffects: v.optional(v.array(v.string())),
    pregnancyWarning: v.optional(v.boolean()),
    childrenWarning: v.optional(v.boolean()),
    
    // Regulatory (from archived)
    regulatoryStatus: v.optional(v.array(v.object({
      region: v.string(),
      status: v.string(),
      notes: v.optional(v.string()),
    }))),
    
    // Preparations (v4)
    preparations: v.optional(v.array(v.object({
      form: v.string(),
      extraction_method: v.optional(v.string()),
      concentration: v.optional(v.string()),
      standardization: v.optional(v.string()),
      bioavailability: v.optional(v.number()),
      shelf_life_months: v.optional(v.number()),
    }))),
  }),
  
  // ===== CULINARY DIMENSIONS (Combined) =====
  culinaryDimensions: v.object({
    // Flavor wheel (v4)
    flavorWheel: v.object({
      primary: v.array(v.object({
        category: v.string(),
        intensity: v.number(),
        descriptors: v.array(v.string()),
      })),
      secondary: v.optional(v.array(v.object({
        note: v.string(),
        intensity: v.number(),
        develops_with: v.optional(v.string()),
      }))),
      comparison: v.optional(v.array(v.object({
        similar_to: v.string(),
        similarity_score: v.number(),
      }))),
    }),
    
    // Culinary properties (from archived)
    flavorProfile: v.optional(v.array(v.string())),
    flavorIntensity: v.optional(v.string()),
    aromatic: v.optional(v.boolean()),
    aromaticProfile: v.optional(v.array(v.string())),
    
    // Texture evolution (v4)
    textureEvolution: v.array(v.object({
      state: v.string(),
      texture_descriptors: v.array(v.string()),
      moisture_percent: v.number(),
      firmness: v.number(),
      optimal_for: v.array(v.string()),
    })),
    
    // Uses (from archived)
    culinaryUses: v.optional(v.array(v.string())),
    cuisineTypes: v.optional(v.array(v.string())),
    
    // Preparation (from archived)
    preparationMethods: v.optional(v.array(v.object({
      method: v.string(),
      temperature: v.optional(v.object({ min: v.number(), max: v.number() })),
      duration_minutes: v.optional(v.object({ min: v.number(), max: v.number() })),
      yield_percent: v.number(),
      nutrient_retention: v.optional(v.object({
        vitamins: v.number(),
        minerals: v.number(),
        antioxidants: v.number(),
      })),
      flavor_development: v.array(v.string()),
      texture_change: v.string(),
      notes: v.optional(v.string()),
    }))),
    
    preparationRequirements: v.optional(v.array(v.string())),
    
    // Pairing network (v4)
    pairingNetwork: v.optional(v.array(v.object({
      ingredient: v.string(),
      affinity: v.number(),
      pairing_type: v.string(),
      shared_compounds: v.optional(v.array(v.string())),
      cuisine_origin: v.optional(v.array(v.string())),
      dishes: v.optional(v.array(v.string())),
    }))),
    
    complementaryIngredients: v.optional(v.array(v.string())),
    seasoningRecommendations: v.optional(v.array(v.string())),
    
    // Nutritional density (combined)
    nutritionalDensity: v.object({
      caloric_density: v.number(),
      protein_quality: v.number(),
      vitamin_density: v.number(),
      mineral_density: v.number(),
      fiber_content: v.number(),
      water_content: v.number(),
      ratios: v.object({
        protein_to_carb: v.number(),
        omega6_to_omega3: v.optional(v.number()),
        sodium_to_potassium: v.optional(v.number()),
      }),
    }),
    
    // Full nutritional value (from archived)
    nutritionalValue: v.optional(v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()),
      carbohydrates: v.optional(v.number()),
      fiber: v.optional(v.number()),
      fat: v.optional(v.number()),
      water: v.optional(v.number()),
      
      vitamins: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
        dailyValuePercentage: v.optional(v.number()),
      }))),
      
      minerals: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
        dailyValuePercentage: v.optional(v.number()),
      }))),
      
      aminoAcids: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
      }))),
      
      otherNutrients: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
      }))),
    })),
    
    // Nutritional profile for radar chart (from archived)
    nutritionalProfile: v.optional(v.array(v.object({
      axis: v.string(),
      value: v.number(),
      unit: v.optional(v.string()),
      rawValue: v.optional(v.number()),
    }))),
    
    // Health properties (from archived)
    antioxidants: v.optional(v.array(v.string())),
    bioactiveCompounds: v.optional(v.array(v.string())),
    prebioticProperties: v.optional(v.boolean()),
    probioticProperties: v.optional(v.boolean()),
    healthBenefits: v.optional(v.array(v.string())),
    dietaryConsiderations: v.optional(v.array(v.string())),
    allergenInfo: v.optional(v.array(v.string())),
    
    // Storage (from archived)
    storageRecommendations: v.optional(v.object({
      fresh: v.optional(v.object({
        temperature: v.string(),
        humidity: v.string(),
        duration: v.string(),
        container: v.string(),
      })),
      dried: v.optional(v.object({
        temperature: v.string(),
        humidity: v.string(),
        duration: v.string(),
        container: v.string(),
      })),
      frozen: v.optional(v.object({
        temperature: v.string(),
        duration: v.string(),
        preparation: v.string(),
      })),
    })),
    
    // Traditions (combined)
    culinaryTraditions: v.optional(v.array(v.object({
      culture: v.string(),
      dishes: v.array(v.string()),
      preparation_style: v.string(),
      seasonal_use: v.optional(v.string()),
      symbolic_meaning: v.optional(v.string()),
      popularity: v.number(),
    }))),
    
    // Recipe categories (from archived)
    recipeSuitability: v.optional(v.array(v.string())),
    
    // Compound distribution for pie charts (from archived)
    compoundDistribution: v.optional(v.array(v.object({
      category: v.string(),
      percentage: v.number(),
      grams: v.optional(v.number()),
    }))),
  }),
  
  // ===== ENVIRONMENTAL INTELLIGENCE (Combined) =====
  environmentalIntelligence: v.object({
    // Carbon dynamics (v4)
    carbonDynamics: v.optional(v.object({
      sequestration_rate: v.number(),
      biomass_carbon: v.number(),
      soil_carbon_impact: v.number(),
      lifecycle_emissions: v.number(),
      carbon_efficiency: v.number(),
    })),
    
    // Ecosystem services (already in ecological network)
    
    // Bioremediation (v4)
    bioremediationPotential: v.optional(v.object({
      heavy_metals: v.array(v.object({
        metal: v.string(),
        accumulation_factor: v.number(),
        tolerance_ppm: v.number(),
      })),
      organic_pollutants: v.array(v.object({
        pollutant: v.string(),
        degradation_rate: v.number(),
        metabolites: v.array(v.string()),
      })),
      applications: v.array(v.string()),
    })),
    
    // Climate resilience (combined)
    climateResilience: v.object({
      temperature_tolerance: v.number(),
      drought_tolerance: v.number(),
      flood_tolerance: v.number(),
      adaptation_potential: v.number(),
      migration_capacity: v.number(),
      vulnerability: v.optional(v.string()), // from archived
      adaptability: v.optional(v.string()),
      rangeShift: v.optional(v.string()),
      phenologyShift: v.optional(v.string()),
      scenarios: v.optional(v.array(v.object({
        scenario: v.string(),
        year: v.number(),
        suitability_change: v.number(),
        range_shift_km: v.optional(v.number()),
      }))),
    }),
    
    // Biodiversity role (v4)
    biodiversityRole: v.object({
      species_associations: v.number(),
      keystone_index: v.number(),
      rarity_index: v.number(),
      endemism_index: v.number(),
      functional_uniqueness: v.number(),
      conservation_priority: v.number(),
    }),
    
    // Conservation status (from archived)
    conservationStatus: v.optional(v.object({
      iucnStatus: v.optional(v.string()),
      nationalStatus: v.optional(v.array(v.object({
        country: v.string(),
        status: v.string(),
        year: v.optional(v.number()),
      }))),
      redListStatus: v.optional(v.string()),
    })),
    
    // Threats (from archived)
    threats: v.optional(v.array(v.object({
      threat: v.string(),
      severity: v.optional(v.string()),
      trend: v.optional(v.string()),
    }))),
    
    protectionMeasures: v.optional(v.array(v.string())),
    protectedAreas: v.optional(v.array(v.string())),
    
    // Environmental impact (from archived)
    environmentalImpact: v.optional(v.object({
      carbonSequestration: v.optional(v.string()),
      soilHealth: v.optional(v.string()),
      waterCycle: v.optional(v.string()),
      biodiversity: v.optional(v.string()),
    })),
    
    sustainabilityRating: v.optional(v.string()),
    sustainableHarvestingGuidelines: v.optional(v.array(v.string())),
  }),
  
  // ===== ECONOMIC DIMENSIONS (Combined) =====
  economicDimensions: v.object({
    // Market dynamics (combined)
    marketDynamics: v.optional(v.object({
      commercialValue: v.optional(v.string()), // from archived
      marketDemand: v.optional(v.string()),
      
      current_price: v.object({
        wholesale: v.number(),
        retail: v.number(),
        premium: v.optional(v.number()),
        currency: v.string(),
        unit: v.string(),
      }),
      
      // Extended price ranges (from archived)
      priceRange: v.optional(v.object({
        fresh: v.optional(v.object({
          min: v.number(),
          max: v.number(),
          currency: v.string(),
          unit: v.string(),
        })),
        dried: v.optional(v.object({
          min: v.number(),
          max: v.number(),
          currency: v.string(),
          unit: v.string(),
        })),
        extract: v.optional(v.object({
          min: v.number(),
          max: v.number(),
          currency: v.string(),
          unit: v.string(),
        })),
      })),
      
      price_history: v.array(v.object({
        date: v.optional(v.number()),
        year: v.optional(v.number()), // from archived
        price: v.number(),
        volume: v.optional(v.number()),
        market: v.optional(v.string()),
        currency: v.string(),
        marketSegment: v.optional(v.string()),
      })),
      
      price_volatility: v.number(),
      seasonal_pattern: v.array(v.object({
        month: v.number(),
        relative_price: v.number(),
      })),
      
      segments: v.array(v.object({
        segment: v.string(),
        share_percent: v.number(),
        growth_rate: v.number(),
        value_usd: v.optional(v.number()),
      })),
      
      // From archived
      marketSegments: v.optional(v.array(v.string())),
      commercialProducts: v.optional(v.array(v.string())),
      industryApplications: v.optional(v.array(v.string())),
    })),
    
    // Supply chain (v4)
    supplyChain: v.optional(v.object({
      production_regions: v.array(v.object({
        region: v.string(),
        production_tons: v.number(),
        export_percent: v.number(),
      })),
      majorProducers: v.optional(v.array(v.string())), // from archived
      majorConsumers: v.optional(v.array(v.string())),
      trade_flows: v.array(v.object({
        from: v.string(),
        to: v.string(),
        volume_tons: v.number(),
        value_usd: v.number(),
      })),
      value_addition: v.array(v.object({
        stage: v.string(),
        value_multiplier: v.number(),
        loss_percent: v.number(),
      })),
      tradeVolume: v.optional(v.object({
        global: v.optional(v.string()),
        trend: v.optional(v.string()),
      })),
    })),
    
    // Economic indicators (combined)
    economicIndicators: v.optional(v.object({
      market_size_usd: v.number(),
      growth_rate_percent: v.number(),
      employment: v.number(),
      roi: v.number(),
      payback_period_months: v.number(),
      value_per_hectare: v.number(),
      investmentPotential: v.optional(v.string()), // from archived
      barrierToEntry: v.optional(v.array(v.string())),
    })),
    
    // Certifications (from archived)
    certifications: v.optional(v.array(v.string())),
    qualityStandards: v.optional(v.array(v.string())),
  }),
  
  // ===== CULTURAL DIMENSIONS (Combined) =====
  culturalDimensions: v.object({
    // Cultural significance (combined)
    culturalSignificance: v.optional(v.array(v.object({
      culture: v.string(),
      significance_type: v.string(),
      importance: v.number(),
      time_period: v.optional(v.string()),
      practices: v.array(v.string()),
      symbols: v.optional(v.array(v.string())),
      stories: v.optional(v.array(v.string())),
      region: v.optional(v.string()), // from archived
      stillPracticed: v.optional(v.boolean()),
    }))),
    
    // Historical (from archived)
    historicalSignificance: v.optional(v.string()),
    firstDocumented: v.optional(v.string()),
    namingHistory: v.optional(v.string()),
    
    // Folklore (from archived)
    folklore: v.optional(v.array(v.object({
      culture: v.string(),
      story: v.string(),
      symbolism: v.optional(v.string()),
    }))),
    
    // Religious (from archived)
    religiousSignificance: v.optional(v.array(v.object({
      religion: v.string(),
      role: v.string(),
      practices: v.optional(v.array(v.string())),
    }))),
    
    // Ceremonial (from archived)
    ceremonialUse: v.optional(v.array(v.object({
      ceremony: v.string(),
      culture: v.string(),
      purpose: v.string(),
    }))),
    
    // Etymology (v4)
    etymology: v.optional(v.object({
      name_origin: v.string(),
      language_family: v.string(),
      historical_names: v.array(v.object({
        name: v.string(),
        language: v.string(),
        period: v.string(),
        meaning: v.optional(v.string()),
      })),
      linguistic_connections: v.array(v.string()),
    })),
    
    // Indigenous names (from archived)
    indigenousNames: v.optional(v.array(v.object({
      language: v.string(),
      name: v.string(),
      meaning: v.optional(v.string()),
      culture: v.string(),
    }))),
    
    // Art and literature (combined)
    culturalReferences: v.optional(v.array(v.object({
      type: v.string(),
      work: v.string(),
      creator: v.string(),
      year: v.optional(v.number()),
      period: v.optional(v.string()), // from archived
      title: v.optional(v.string()),
      significance: v.string(),
      image_url: v.optional(v.string()),
    }))),
    
    // Traditional knowledge (from archived)
    traditionalKnowledge: v.optional(v.string()),
    knowledgeHolders: v.optional(v.array(v.string())),
  }),
  
  // ===== RESEARCH & INNOVATION (Combined) =====
  researchAndInnovation: v.object({
    researchInterest: v.optional(v.string()),
    activeResearchAreas: v.optional(v.array(v.string())),
    
    // Biotechnology (from archived)
    biotechnologyPotential: v.optional(v.object({
      overall: v.optional(v.string()),
      areas: v.optional(v.array(v.string())),
    })),
    
    // Innovative applications (from archived)
    innovativeApplications: v.optional(v.array(v.object({
      application: v.string(),
      field: v.string(),
      developmentStage: v.optional(v.string()),
      potential: v.optional(v.string()),
    }))),
    
    // Patents (from archived)
    patentedTechnologies: v.optional(v.array(v.object({
      technology: v.string(),
      patentNumber: v.optional(v.string()),
      holder: v.optional(v.string()),
      year: v.optional(v.number()),
    }))),
    
    // Genomic data (from archived)
    genomicData: v.optional(v.object({
      sequenced: v.optional(v.boolean()),
      genomeSize: v.optional(v.string()),
      geneCount: v.optional(v.number()),
      accessionNumber: v.optional(v.string()),
    })),
    
    modelOrganism: v.optional(v.boolean()),
    researchTools: v.optional(v.array(v.string())),
    
    // Research activity (from archived)
    researchActivity: v.optional(v.array(v.object({
      year: v.number(),
      publications: v.number(),
      patents: v.optional(v.number()),
      clinicalTrials: v.optional(v.number()),
      citations: v.optional(v.number()),
    }))),
    
    // Research metrics (v4)
    researchMetrics: v.optional(v.object({
      publication_count: v.number(),
      citation_count: v.number(),
      h_index: v.optional(v.number()),
      research_trend: v.string(),
      hot_topics: v.array(v.string()),
      funding_usd: v.optional(v.number()),
    })),
  }),
  
  // ===== INTERACTION MATRICES (v4) =====
  interactionMatrices: v.object({
    speciesInteractions: v.optional(v.array(v.object({
      species: v.string(),
      interaction_type: v.string(),
      strength: v.number(),
      mechanism: v.string(),
      evidence: v.string(),
      reciprocal: v.boolean(),
    }))),
    
    compoundSynergies: v.optional(v.array(v.object({
      compound1: v.string(),
      compound2: v.string(),
      effect_type: v.string(),
      magnitude: v.number(),
      biological_target: v.optional(v.string()),
    }))),
    
    environmentalResponses: v.optional(v.array(v.object({
      factor1: v.string(),
      factor2: v.string(),
      response_matrix: v.array(v.array(v.number())),
      optimal_point: v.object({ x: v.number(), y: v.number() }),
    }))),
  }),
  
  // ===== RATINGS & SCORES (from archived) =====
  ratings: v.optional(v.object({
    flavorIntensity: v.optional(v.number()),
    cultivationDifficulty: v.optional(v.number()),
    medicinalPotency: v.optional(v.number()),
    nutritionalValue: v.optional(v.number()),
    commercialViability: v.optional(v.number()),
    researchInterest: v.optional(v.number()),
    conservationPriority: v.optional(v.number()),
    beginnerFriendly: v.optional(v.number()),
    overallQuality: v.optional(v.number()),
    rarityScore: v.optional(v.number()),
    sustainabilityScore: v.optional(v.number()),
  })),
  
  // Completeness scores (from archived)
  completenessScores: v.optional(v.object({
    physicalCharacteristics: v.optional(v.number()),
    cultivation: v.optional(v.number()),
    medicinal: v.optional(v.number()),
    culinary: v.optional(v.number()),
    ecological: v.optional(v.number()),
    cultural: v.optional(v.number()),
    chemical: v.optional(v.number()),
    commercial: v.optional(v.number()),
    overall: v.optional(v.number()),
  })),
  
  // ===== KNOWLEDGE CONNECTIONS (v4) =====
  knowledgeConnections: v.object({
    relatedSpecies: v.array(v.object({
      species: v.string(),
      relationship: v.string(),
      similarity: v.number(),
      shared_features: v.array(v.string()),
    })),
    
    crossReferences: v.optional(v.array(v.object({
      type: v.string(),
      reference_id: v.string(),
      relevance: v.number(),
    }))),
    
    tags: v.array(v.string()),
    
    ontologies: v.optional(v.array(v.object({
      ontology: v.string(),
      id: v.string(),
      uri: v.optional(v.string()),
    }))),
  }),
  
  // ===== META INFORMATION (Combined) =====
  metaInfo: v.object({
    // Data quality (v4)
    dataQuality: v.object({
      completeness: v.number(),
      accuracy_confidence: v.number(),
      last_updated: v.number(),
      update_frequency: v.optional(v.string()),
      verification_status: v.string(),
      data_sources: v.array(v.string()),
      dataQuality: v.optional(v.string()), // from archived
    }),
    
    // Research metrics moved to researchAndInnovation
    
    // User engagement (v4)
    engagement: v.optional(v.object({
      views: v.number(),
      bookmarks: v.number(),
      contributions: v.number(),
      quality_ratings: v.array(v.object({
        aspect: v.string(),
        rating: v.number(),
        count: v.number(),
      })),
    })),
    
    // Conservation moved to environmentalIntelligence
    
    // Sources (from archived)
    sources: v.optional(v.array(v.object({
      type: v.string(),
      citation: v.string(),
      url: v.optional(v.string()),
      accessedDate: v.optional(v.string()),
      reliability: v.optional(v.string()),
    }))),
    
    // Contributors (from archived)
    contributors: v.optional(v.array(v.object({
      name: v.string(),
      role: v.string(),
      date: v.optional(v.number()),
    }))),
    
    // Review status (from archived)
    reviewStatus: v.optional(v.object({
      status: v.string(),
      reviewer: v.optional(v.string()),
      reviewDate: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
    
    // Basic metadata (from archived)
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    verified: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
  }),
})
  .index("by_seoName", ["seoName"])
  .index("by_slug", ["slug"])
  .index("by_commonName", ["commonName"])
  .index("by_latinName", ["latinName"])
  .index("by_genus", ["taxonomy.genus"])
  .index("by_family", ["taxonomy.family"])
  .index("by_edibility", ["safetyAndIdentification.edibility"])
  .index("by_cultivation", ["cultivationIntelligence.difficultyMatrix.overall"])
  .searchIndex("search_fungi", {
    searchField: "commonName",
    filterFields: ["safetyAndIdentification.edibility"],
  });

// ===== SUPPORTING TABLES (All from both schemas) =====

/**
 * Scientific Papers & Research (from archived)
 */
const scientificPapers = defineTable({
  fungusId: v.id("fungi"),
  
  title: v.string(),
  authors: v.array(v.string()),
  journal: v.optional(v.string()),
  year: v.number(),
  doi: v.optional(v.string()),
  pmid: v.optional(v.string()),
  url: v.optional(v.string()),
  
  abstract: v.optional(v.string()),
  keywords: v.optional(v.array(v.string())),
  
  researchArea: v.array(v.string()),
  studyType: v.optional(v.string()),
  
  keyFindings: v.optional(v.array(v.string())),
  methodology: v.optional(v.string()),
  
  citationCount: v.optional(v.number()),
  impactFactor: v.optional(v.number()),
  peerReviewed: v.optional(v.boolean()),
  
  relevanceScore: v.optional(v.number()),
  applicationAreas: v.optional(v.array(v.string())),
  
  addedDate: v.optional(v.number()),
  lastUpdated: v.optional(v.number()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_year", ["year"])
  .index("by_research_area", ["researchArea"]);

/**
 * Climate Impact Data (from archived)
 */
const climateImpact = defineTable({
  fungusId: v.id("fungi"),
  
  title: v.string(),
  studyYear: v.optional(v.number()),
  region: v.array(v.string()),
  
  observationType: v.string(),
  
  temperatureChange: v.optional(v.object({
    observed: v.optional(v.number()),
    projected: v.optional(v.number()),
    unit: v.string(),
  })),
  
  precipitationChange: v.optional(v.object({
    observed: v.optional(v.number()),
    projected: v.optional(v.number()),
    unit: v.string(),
  })),
  
  habitatChange: v.optional(v.object({
    currentArea: v.optional(v.number()),
    projectedArea: v.optional(v.number()),
    changePercent: v.optional(v.number()),
  })),
  
  rangeShift: v.optional(v.object({
    direction: v.optional(v.string()),
    distance: v.optional(v.number()),
    elevationChange: v.optional(v.number()),
  })),
  
  phenologyShift: v.optional(v.object({
    fruitingShift: v.optional(v.number()),
    seasonalityChange: v.optional(v.string()),
  })),
  
  adaptationStrategies: v.optional(v.array(v.string())),
  conservationRecommendations: v.optional(v.array(v.string())),
  
  confidenceLevel: v.optional(v.string()),
  dataSource: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_year", ["studyYear"])
  .index("by_region", ["region"]);

/**
 * Economic Data (from archived)
 */
const economicData = defineTable({
  fungusId: v.id("fungi"),
  
  year: v.number(),
  region: v.string(),
  
  productionVolume: v.optional(v.object({
    amount: v.number(),
    unit: v.string(),
  })),
  
  marketValue: v.optional(v.object({
    amount: v.number(),
    currency: v.string(),
  })),
  
  pricePerUnit: v.optional(v.object({
    amount: v.number(),
    currency: v.string(),
    unit: v.string(),
  })),
  
  employmentImpact: v.optional(v.number()),
  
  exportData: v.optional(v.object({
    volume: v.optional(v.number()),
    value: v.optional(v.number()),
    destinations: v.optional(v.array(v.string())),
  })),
  
  importData: v.optional(v.object({
    volume: v.optional(v.number()),
    value: v.optional(v.number()),
    sources: v.optional(v.array(v.string())),
  })),
  
  marketTrend: v.optional(v.string()),
  growthRate: v.optional(v.number()),
  
  certifications: v.optional(v.array(v.string())),
  qualityGrade: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_year", ["year"])
  .index("by_region", ["region"]);

/**
 * Cultivation Records (from archived)
 */
const cultivationRecords = defineTable({
  fungusId: v.id("fungi"),
  
  growerType: v.string(),
  scale: v.string(),
  location: v.optional(v.string()),
  
  substrate: v.string(),
  substrateFormulation: v.optional(v.string()),
  
  environmentalConditions: v.object({
    temperature: v.optional(v.object({
      colonization: v.optional(v.number()),
      fruiting: v.optional(v.number()),
    })),
    humidity: v.optional(v.object({
      colonization: v.optional(v.number()),
      fruiting: v.optional(v.number()),
    })),
    co2Levels: v.optional(v.string()),
    lightingSetup: v.optional(v.string()),
  }),
  
  timeline: v.object({
    colonizationDays: v.optional(v.number()),
    fruitingDays: v.optional(v.number()),
    totalCycleDays: v.optional(v.number()),
  }),
  
  yieldData: v.object({
    freshWeight: v.optional(v.number()),
    dryWeight: v.optional(v.number()),
    biologicalEfficiency: v.optional(v.number()),
    flushCount: v.optional(v.number()),
  }),
  
  quality: v.optional(v.object({
    appearance: v.optional(v.string()),
    size: v.optional(v.string()),
    marketGrade: v.optional(v.string()),
  })),
  
  challenges: v.optional(v.array(v.object({
    issue: v.string(),
    solution: v.optional(v.string()),
    effectiveness: v.optional(v.string()),
  }))),
  
  economics: v.optional(v.object({
    setupCost: v.optional(v.number()),
    operatingCost: v.optional(v.number()),
    revenue: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    currency: v.string(),
  })),
  
  notes: v.optional(v.string()),
  recommendations: v.optional(v.array(v.string())),
  
  verified: v.optional(v.boolean()),
  dateRecorded: v.optional(v.number()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_scale", ["scale"]);

/**
 * Traditional Knowledge (from archived)
 */
const traditionalKnowledge = defineTable({
  fungusId: v.id("fungi"),
  
  culture: v.string(),
  region: v.string(),
  indigenousName: v.optional(v.string()),
  language: v.optional(v.string()),
  
  knowledgeCategory: v.array(v.string()),
  
  uses: v.array(v.object({
    use: v.string(),
    preparation: v.optional(v.string()),
    application: v.optional(v.string()),
    seasonality: v.optional(v.string()),
  })),
  
  culturalSignificance: v.optional(v.string()),
  spiritualSignificance: v.optional(v.string()),
  ceremonies: v.optional(v.array(v.string())),
  
  knowledgeHolders: v.optional(v.string()),
  transmissionMethod: v.optional(v.string()),
  stillPracticed: v.optional(v.boolean()),
  
  documentedBy: v.optional(v.string()),
  documentationDate: v.optional(v.number()),
  consent: v.optional(v.boolean()),
  accessRestrictions: v.optional(v.string()),
  
  benefitSharingAgreement: v.optional(v.boolean()),
  communityApproval: v.optional(v.boolean()),
  
  verificationStatus: v.optional(v.string()),
  reliability: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_culture", ["culture"]);

/**
 * Dynamic Relationships (v4)
 */
const relationships = defineTable({
  sourceFungusId: v.id("fungi"),
  targetFungusId: v.id("fungi"),
  
  relationshipType: v.string(),
  dimension: v.string(),
  
  strength: v.number(),
  directionality: v.string(),
  confidence: v.number(),
  
  sharedFeatures: v.array(v.string()),
  differentiatingFeatures: v.array(v.string()),
  
  temporal: v.optional(v.object({
    seasonal: v.boolean(),
    peak_months: v.optional(v.array(v.number())),
    stability: v.number(),
  })),
  
  metrics: v.optional(v.object({
    similarity_score: v.number(),
    interaction_frequency: v.optional(v.number()),
    co_occurrence: v.optional(v.number()),
  })),
  
  computedAt: v.number(),
  algorithm: v.string(),
  version: v.string(),
})
  .index("by_source", ["sourceFungusId"])
  .index("by_target", ["targetFungusId"])
  .index("by_type", ["relationshipType"])
  .index("by_strength", ["strength"]);

/**
 * User Collections (v4)
 */
const userCollections = defineTable({
  userId: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  
  type: v.string(),
  visibility: v.string(),
  
  fungiIds: v.array(v.id("fungi")),
  
  notes: v.optional(v.array(v.object({
    fungusId: v.id("fungi"),
    note: v.string(),
    tags: v.optional(v.array(v.string())),
  }))),
  
  tags: v.array(v.string()),
  created: v.number(),
  updated: v.number(),
  
  sharedWith: v.optional(v.array(v.string())),
  shareLink: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_type", ["type"])
  .index("by_visibility", ["visibility"]);

/**
 * Observations (Combined from both)
 */
const observations = defineTable({
  fungusId: v.id("fungi"),
  observerId: v.string(),
  
  observerType: v.optional(v.string()), // from archived
  
  location: v.object({
    coordinates: v.object({
      lat: v.number(),
      lon: v.number(),
      accuracy_m: v.optional(v.number()),
    }),
    elevation_m: v.optional(v.number()),
    habitat: v.string(),
    substrate: v.string(),
    microhabitat: v.optional(v.string()),
    
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    locality: v.optional(v.string()),
  }),
  
  observationDate: v.number(),
  time: v.optional(v.string()),
  season: v.string(),
  
  weather: v.optional(v.object({
    temperature_c: v.optional(v.number()),
    humidity_percent: v.optional(v.number()),
    precipitation: v.optional(v.string()),
    days_since_rain: v.optional(v.number()),
    recentWeather: v.optional(v.string()), // from archived
  })),
  
  abundance: v.string(),
  developmentStage: v.string(),
  health: v.string(),
  size_cm: v.optional(v.object({
    cap_diameter: v.optional(v.number()),
    stem_height: v.optional(v.number()),
  })),
  
  associatedPlants: v.optional(v.array(v.string())),
  associatedFungi: v.optional(v.array(v.string())),
  associatedSpecies: v.optional(v.array(v.string())), // from archived
  
  photos: v.optional(v.array(v.object({
    url: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
  }))),
  photoUrls: v.optional(v.array(v.string())), // from archived
  
  identificationConfidence: v.string(),
  verificationStatus: v.string(),
  verifiedBy: v.optional(v.string()),
  verificationDate: v.optional(v.number()),
  expertVerified: v.optional(v.boolean()), // from archived
  
  notes: v.optional(v.string()),
  unusualFeatures: v.optional(v.array(v.string())),
  
  public: v.boolean(),
  obscureLocation: v.boolean(),
  publicObservation: v.optional(v.boolean()), // from archived
  contributeToCitizen: v.optional(v.boolean()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_observer", ["observerId"])
  .index("by_date", ["observationDate"])
  .index("by_location", ["location.country"]);

/**
 * Search Analytics (v4)
 */
const searchAnalytics = defineTable({
  query: v.string(),
  timestamp: v.number(),
  
  userId: v.optional(v.string()),
  sessionId: v.string(),
  searchType: v.string(),
  filters: v.optional(v.array(v.string())),
  
  resultCount: v.number(),
  clickedResults: v.optional(v.array(v.object({
    fungusId: v.id("fungi"),
    position: v.number(),
    dwellTime: v.optional(v.number()),
  }))),
  
  responseTime_ms: v.number(),
  relevanceScore: v.optional(v.number()),
  
  // From archived searchTracking
  count: v.optional(v.number()),
  lastSearched: v.optional(v.number()),
})
  .index("by_query", ["query"])
  .index("by_timestamp", ["timestamp"])
  .index("by_user", ["userId"]);

/**
 * Visualization Analytics (v4)
 */
const visualizationAnalytics = defineTable({
  userId: v.optional(v.string()),
  sessionId: v.string(),
  timestamp: v.number(),
  
  visualizationType: v.string(),
  dataType: v.string(),
  fungusIds: v.optional(v.array(v.id("fungi"))),
  
  interaction: v.string(),
  parameters: v.optional(v.any()),
  duration_ms: v.optional(v.number()),
  
  useful: v.optional(v.boolean()),
  feedback: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_type", ["visualizationType"])
  .index("by_timestamp", ["timestamp"]);

/**
 * User Interactions (for BubbleView v2.0)
 */
const userInteractions = defineTable({
  userId: v.optional(v.string()),
  sessionId: v.optional(v.string()),
  timestamp: v.number(),
  
  type: v.string(), // 'click', 'hover', 'search', 'filter', 'sort'
  entitySlug: v.optional(v.string()),
  entityType: v.optional(v.string()), // 'fungus', 'paper', etc.
  
  // Search-specific
  query: v.optional(v.string()),
  resultsCount: v.optional(v.number()),
  
  // Interaction context
  perspectiveId: v.optional(v.string()),
  viewType: v.optional(v.string()), // 'bubble', 'grid', etc.
  
  // Metadata
  duration_ms: v.optional(v.number()),
  metadata: v.optional(v.any()),
})
  .index("by_entity", ["entitySlug"])
  .index("by_user", ["userId"])
  .index("by_session", ["sessionId"])
  .index("by_timestamp", ["timestamp"]);

export default defineSchema({
  // Core tables
  fungi,
  
  // Knowledge domain tables
  scientificPapers,
  climateImpact,
  economicData,
  cultivationRecords,
  traditionalKnowledge,
  
  // Relationship and collection tables
  relationships,
  userCollections,
  observations,
  
  // Analytics
  searchAnalytics,
  visualizationAnalytics,
  userInteractions,
});