/**
 * AMORPH-Optimized Holistic Schema v4.0
 * 
 * Visualization-First Architecture:
 * Every field structure is designed for automatic pattern recognition by MorphMapper
 * Supporting 20+ visualization morphs with rich, interconnected data
 * 
 * Core Principles:
 * - Holistic: Complete multi-dimensional representation
 * - Lateral: Unconventional connections and perspectives
 * - Visual: Optimized for automatic visualization generation
 * - Semantic: Rich relationships for network graphs
 * - Temporal: Multi-scale time-based patterns
 * - Sensorial: Multi-sensory data representation
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * ============================================================================
 * MASTER FUNGI TABLE - Enhanced for Visualization
 * ============================================================================
 */
const fungi = defineTable({
  // ===== CORE IDENTITY (Enhanced) =====
  commonName: v.string(),
  latinName: v.string(),
  scientificNameSynonyms: v.optional(v.array(v.string())),
  commonNameVariants: v.optional(v.array(v.string())),
  seoName: v.string(),
  slug: v.string(),
  
  // Multi-language names (for internationalization)
  internationalNames: v.optional(v.array(v.object({
    language: v.string(),
    name: v.string(),
    script: v.optional(v.string()), // latin, cyrillic, arabic, chinese, etc.
  }))),
  
  // ===== VISUAL IDENTITY (For Image Morphs) =====
  visualIdentity: v.object({
    primaryImage: v.optional(v.string()),
    
    // Image gallery with metadata (For carousel/gallery morphs)
    imageGallery: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(), // photograph, illustration, microscopy, diagram
      viewAngle: v.optional(v.string()), // top, side, bottom, cross-section
      developmentStage: v.optional(v.string()), // spore, button, young, mature, old
      season: v.optional(v.string()),
      photographer: v.optional(v.string()),
      license: v.optional(v.string()),
    }))),
    
    // 360° view data (For 3D morphs)
    view360: v.optional(v.object({
      frames: v.array(v.string()), // URLs for each rotation frame
      frameCount: v.number(),
      rotationAxis: v.string(), // vertical, horizontal
    })),
    
    // Color palette (For color morphs)
    colorPalette: v.optional(v.array(v.object({
      hex: v.string(),
      name: v.string(),
      dominance: v.number(), // 0-100 percentage
      location: v.string(), // cap, stem, gills, spores
    }))),
    
    // Visual similarity signature (For similarity networks)
    visualSignature: v.optional(v.object({
      shape: v.array(v.number()), // Shape vector [roundness, symmetry, complexity...]
      texture: v.array(v.number()), // Texture vector [smoothness, patterns, regularity...]
      color: v.array(v.number()), // Color vector in LAB space
    })),
  }),
  
  // ===== TAXONOMY (Enhanced for Tree Visualization) =====
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
    
    // Taxonomic confidence (For uncertainty visualization)
    confidence: v.optional(v.object({
      level: v.number(), // 0-100
      disputed: v.boolean(),
      alternativeClassifications: v.optional(v.array(v.string())),
    })),
    
    // Phylogenetic position (For evolutionary trees)
    phylogeny: v.optional(v.object({
      clade: v.string(),
      sister_species: v.optional(v.array(v.string())),
      divergence_time: v.optional(v.number()), // millions of years ago
      evolutionary_traits: v.optional(v.array(v.string())),
    })),
  }),
  
  // ===== MORPHOLOGICAL CHARACTERISTICS (Enhanced for 3D Models) =====
  morphology: v.object({
    // 3D Shape parameters (For procedural 3D generation)
    shapeParameters: v.optional(v.object({
      cap: v.object({
        profile: v.array(v.object({ x: v.number(), y: v.number() })), // 2D profile curve
        curvature: v.number(), // -1 to 1 (concave to convex)
        symmetry: v.number(), // 0 to 1
        irregularity: v.number(), // 0 to 1
      }),
      stem: v.object({
        taper: v.number(), // 0 to 1 (cylindrical to tapered)
        curve: v.number(), // 0 to 1 (straight to curved)
        hollowness: v.number(), // 0 to 1
      }),
    })),
    
    // Size ranges (For scale comparisons)
    dimensions: v.object({
      cap: v.object({
        diameter: v.object({ min: v.number(), max: v.number(), typical: v.number(), unit: v.string() }),
        thickness: v.optional(v.object({ min: v.number(), max: v.number(), unit: v.string() })),
      }),
      stem: v.object({
        height: v.object({ min: v.number(), max: v.number(), typical: v.number(), unit: v.string() }),
        diameter: v.object({ min: v.number(), max: v.number(), typical: v.number(), unit: v.string() }),
      }),
      // Biomass (For size/weight visualizations)
      biomass: v.optional(v.object({
        fresh_weight: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
        dry_weight: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
        water_content: v.number(), // percentage
      })),
    }),
    
    // Surface features (For texture mapping)
    surfaces: v.object({
      cap: v.object({
        texture: v.array(v.string()), // smooth, scaly, viscid, fibrillose, etc.
        patterns: v.optional(v.array(v.string())), // concentric, radial, spotted, etc.
        moisture: v.string(), // dry, moist, viscid, glutinous
      }),
      stem: v.object({
        texture: v.array(v.string()),
        ornamentation: v.optional(v.array(v.string())), // reticulate, scaly, smooth, etc.
      }),
    }),
    
    // Microscopic features (For detail views)
    microscopy: v.optional(v.object({
      spores: v.object({
        dimensions: v.object({
          length: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
          width: v.object({ min: v.number(), max: v.number(), unit: v.string() }),
        }),
        shape: v.string(),
        ornamentation: v.optional(v.string()),
        color_in_mass: v.string(),
        // Spore density (For scatter plots)
        density_per_mm2: v.optional(v.number()),
      }),
      basidia: v.optional(v.object({
        type: v.string(),
        sterigmata_count: v.number(),
      })),
      cystidia: v.optional(v.object({
        present: v.boolean(),
        types: v.optional(v.array(v.string())),
      })),
    })),
  }),
  
  // ===== SENSORY PROFILE (Multi-sensory Data) =====
  sensoryProfile: v.object({
    // Visual (Already covered above)
    
    // Olfactory (For aroma wheels)
    aroma: v.optional(v.object({
      intensity: v.number(), // 0-10
      notes: v.array(v.object({
        category: v.string(), // floral, fruity, earthy, chemical, etc.
        specific: v.string(), // rose, apple, soil, bleach, etc.
        strength: v.number(), // 0-10
      })),
      volatiles: v.optional(v.array(v.object({
        compound: v.string(),
        concentration: v.number(),
        threshold: v.number(), // detection threshold
      }))),
      // Aroma timeline (For temporal visualization)
      aromaEvolution: v.optional(v.array(v.object({
        stage: v.string(), // fresh, cooking, dried, aged
        profile: v.array(v.string()),
      }))),
    })),
    
    // Gustatory (For taste profiles)
    taste: v.optional(v.object({
      basic_tastes: v.object({
        sweet: v.number(), // 0-10
        sour: v.number(),
        salty: v.number(),
        bitter: v.number(),
        umami: v.number(),
      }),
      flavor_notes: v.array(v.string()),
      mouthfeel: v.array(v.string()), // creamy, grainy, fibrous, slimy, etc.
      aftertaste: v.optional(v.string()),
      // Taste evolution (For timeline morphs)
      taste_timeline: v.optional(v.array(v.object({
        seconds: v.number(),
        dominant_taste: v.string(),
        intensity: v.number(),
      }))),
    })),
    
    // Tactile (For texture visualization)
    texture: v.object({
      firmness: v.number(), // 0-10 (soft to hard)
      elasticity: v.number(), // 0-10 (brittle to elastic)
      moisture: v.number(), // 0-10 (dry to wet)
      roughness: v.number(), // 0-10 (smooth to rough)
      stickiness: v.number(), // 0-10
      // Texture under different conditions
      texture_conditions: v.optional(v.array(v.object({
        condition: v.string(), // fresh, cooked, dried, rehydrated
        properties: v.object({
          firmness: v.number(),
          elasticity: v.number(),
          moisture: v.number(),
        }),
      }))),
    }),
    
    // Auditory (Yes, mushrooms can make sounds!)
    sound: v.optional(v.object({
      spore_discharge: v.optional(v.string()), // some species audibly discharge spores
      breaking_sound: v.optional(v.string()), // crisp, soft, silent
      cooking_sounds: v.optional(v.array(v.string())), // sizzling, popping, etc.
    })),
  }),
  
  // ===== ECOLOGICAL NETWORK (Graph Visualization Ready) =====
  ecologicalNetwork: v.object({
    // Trophic relationships (For food web graphs)
    trophicLevel: v.number(), // 1-5 (primary decomposer to top)
    
    // Symbiotic network (For network graphs)
    symbioticPartners: v.optional(v.array(v.object({
      partner_type: v.string(), // plant, fungus, bacteria, animal
      partner_species: v.string(),
      relationship_type: v.string(), // mutualistic, parasitic, commensal
      interaction_strength: v.number(), // 0-10
      bidirectional: v.boolean(),
      seasonal: v.optional(v.boolean()),
      benefits_given: v.array(v.string()),
      benefits_received: v.array(v.string()),
      // Network position (For force-directed layouts)
      network_centrality: v.optional(v.number()), // 0-1
    }))),
    
    // Substrate network (For substrate preference graphs)
    substratePreferences: v.array(v.object({
      substrate_type: v.string(),
      preference_score: v.number(), // 0-10
      specificity: v.string(), // obligate, preferential, opportunistic
      decomposition_rate: v.optional(v.number()), // kg/year
    })),
    
    // Competition network
    competitors: v.optional(v.array(v.object({
      species: v.string(),
      competition_intensity: v.number(), // 0-10
      resource_overlap: v.number(), // 0-100%
      outcome: v.string(), // dominates, dominated, coexists
    }))),
    
    // Facilitation network
    facilitators: v.optional(v.array(v.object({
      species: v.string(),
      facilitation_type: v.string(),
      effect_magnitude: v.number(), // 0-10
    }))),
    
    // Dispersal vectors (For flow visualization)
    dispersalVectors: v.optional(v.array(v.object({
      vector: v.string(), // wind, water, animal, human
      effectiveness: v.number(), // 0-10
      distance_class: v.string(), // short, medium, long
      seasonal_pattern: v.optional(v.array(v.number())), // 12 months, 0-10 each
    }))),
  }),
  
  // ===== TEMPORAL PATTERNS (Timeline & Cycle Visualizations) =====
  temporalPatterns: v.object({
    // Life cycle (For circular timeline)
    lifeCycle: v.array(v.object({
      stage: v.string(),
      duration_days: v.object({ min: v.number(), max: v.number(), typical: v.number() }),
      temperature_requirement: v.optional(v.object({ min: v.number(), max: v.number() })),
      trigger_conditions: v.optional(v.array(v.string())),
      morphological_changes: v.array(v.string()),
      // Visual representation
      icon: v.optional(v.string()), // emoji or icon name
      color: v.optional(v.string()), // hex color
    })),
    
    // Seasonal patterns (For radial charts)
    seasonality: v.object({
      monthly_activity: v.array(v.object({
        month: v.number(), // 1-12
        fruiting_probability: v.number(), // 0-100
        growth_rate: v.number(), // 0-100
        spore_production: v.number(), // 0-100
        visibility: v.number(), // 0-100 (how easy to find)
      })),
      peak_seasons: v.array(v.string()),
      year_round: v.boolean(),
      // Climate zone variations
      climate_variations: v.optional(v.array(v.object({
        zone: v.string(), // tropical, temperate, boreal, etc.
        pattern: v.array(v.number()), // 12 months, 0-100 activity
      }))),
    }),
    
    // Circadian rhythms (For daily cycle viz)
    circadianRhythm: v.optional(v.object({
      spore_release_pattern: v.array(v.object({
        hour: v.number(), // 0-23
        intensity: v.number(), // 0-100
      })),
      growth_pattern: v.array(v.object({
        hour: v.number(),
        rate: v.number(), // 0-100
      })),
      metabolic_activity: v.array(v.object({
        hour: v.number(),
        level: v.number(), // 0-100
      })),
    })),
    
    // Historical timeline (For temporal charts)
    historicalTimeline: v.optional(v.array(v.object({
      year: v.number(),
      event: v.string(),
      event_type: v.string(), // discovery, cultivation, commercial, scientific
      significance: v.number(), // 0-10
      location: v.optional(v.string()),
    }))),
    
    // Future projections (For forecast viz)
    projections: v.optional(v.object({
      climate_suitability: v.array(v.object({
        year: v.number(),
        suitability_score: v.number(), // 0-100
        scenario: v.string(), // RCP 2.6, 4.5, 6.0, 8.5
      })),
      habitat_availability: v.array(v.object({
        year: v.number(),
        area_km2: v.number(),
        change_percent: v.number(),
      })),
    })),
  }),
  
  // ===== GEOGRAPHIC PATTERNS (Map-Ready) =====
  geographicPatterns: v.object({
    // Distribution (Enhanced for multiple map types)
    distribution: v.object({
      // Point occurrences (For dot maps)
      occurrences: v.optional(v.array(v.object({
        lat: v.number(),
        lon: v.number(),
        date: v.optional(v.number()),
        abundance: v.optional(v.string()),
        verified: v.boolean(),
        elevation_m: v.optional(v.number()),
        habitat: v.optional(v.string()),
      }))),
      
      // Range polygons (For range maps)
      ranges: v.optional(v.array(v.object({
        type: v.string(), // native, introduced, cultivated
        polygon: v.array(v.object({ lat: v.number(), lon: v.number() })),
        status: v.string(), // stable, expanding, contracting
        quality: v.string(), // confirmed, probable, possible
      }))),
      
      // Density heatmap data
      density: v.optional(v.array(v.object({
        lat: v.number(),
        lon: v.number(),
        radius_km: v.number(),
        observations: v.number(),
        relative_abundance: v.number(), // 0-100
      }))),
      
      // Biogeographic regions
      bioregions: v.optional(v.array(v.object({
        name: v.string(),
        code: v.string(),
        presence: v.string(), // native, introduced, absent
        abundance: v.optional(v.string()),
      }))),
      
      // Elevation profile (For elevation charts)
      elevationProfile: v.optional(v.object({
        min_m: v.number(),
        max_m: v.number(),
        optimal_m: v.number(),
        distribution: v.array(v.object({
          elevation_m: v.number(),
          frequency: v.number(), // 0-100
        })),
      })),
      
      // Migration patterns (For flow maps)
      migration: v.optional(v.object({
        dispersal_routes: v.array(v.object({
          from: v.object({ lat: v.number(), lon: v.number() }),
          to: v.object({ lat: v.number(), lon: v.number() }),
          strength: v.number(), // 0-10
          mechanism: v.string(),
        })),
        colonization_history: v.array(v.object({
          year: v.number(),
          location: v.string(),
          source: v.optional(v.string()),
        })),
      })),
    }),
    
    // Climate envelope (For climate maps)
    climateEnvelope: v.object({
      temperature: v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
        tolerance_range: v.number(), // degrees of tolerance
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
      // Bioclimatic variables (For species distribution modeling)
      bioclim: v.optional(v.array(v.object({
        variable: v.string(), // BIO1-BIO19
        value: v.number(),
        importance: v.number(), // 0-100
      }))),
    }),
  }),
  
  // ===== CHEMICAL UNIVERSE (Network & Composition Viz) =====
  chemicalUniverse: v.object({
    // Primary metabolites (For composition charts)
    primaryMetabolites: v.object({
      // Macronutrients (For pie/donut charts)
      macronutrients: v.array(v.object({
        nutrient: v.string(), // protein, carbohydrate, fat, fiber
        amount_g_per_100g: v.number(),
        calories: v.number(),
        bioavailability: v.optional(v.number()), // 0-100%
      })),
      
      // Amino acid profile (For radar charts)
      aminoAcids: v.optional(v.array(v.object({
        name: v.string(),
        amount_mg_per_g: v.number(),
        essential: v.boolean(),
        limiting: v.boolean(),
      }))),
      
      // Fatty acid profile (For stacked bar charts)
      fattyAcids: v.optional(v.array(v.object({
        name: v.string(),
        type: v.string(), // saturated, monounsaturated, polyunsaturated
        amount_mg_per_g: v.number(),
        omega_class: v.optional(v.string()),
      }))),
      
      // Vitamins & minerals (For parallel coordinates)
      micronutrients: v.optional(v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
        dv_percent: v.optional(v.number()), // % daily value
        bioavailability: v.optional(v.number()),
      }))),
    }),
    
    // Secondary metabolites (For chemical similarity networks)
    secondaryMetabolites: v.object({
      // Bioactive compounds
      compounds: v.optional(v.array(v.object({
        name: v.string(),
        iupac_name: v.optional(v.string()),
        formula: v.optional(v.string()),
        smiles: v.optional(v.string()), // For molecular viz
        class: v.string(), // alkaloid, terpenoid, phenolic, etc.
        subclass: v.optional(v.string()),
        concentration: v.optional(v.object({
          value: v.number(),
          unit: v.string(),
          variance: v.optional(v.number()),
        })),
        bioactivity: v.array(v.string()),
        targets: v.optional(v.array(v.string())), // molecular targets
        toxicity: v.optional(v.object({
          ld50: v.optional(v.number()),
          toxic_dose: v.optional(v.number()),
          mechanism: v.optional(v.string()),
        })),
      }))),
      
      // Biosynthetic pathways (For pathway visualization)
      pathways: v.optional(v.array(v.object({
        name: v.string(),
        type: v.string(), // primary, secondary, hybrid
        precursors: v.array(v.string()),
        intermediates: v.array(v.string()),
        products: v.array(v.string()),
        enzymes: v.optional(v.array(v.string())),
        regulation: v.optional(v.string()),
      }))),
      
      // Chemical fingerprint (For similarity calculations)
      fingerprint: v.optional(v.object({
        terpene_score: v.number(), // 0-100
        alkaloid_score: v.number(),
        phenolic_score: v.number(),
        polysaccharide_score: v.number(),
        peptide_score: v.number(),
        unique_compounds: v.number(), // count
      })),
    }),
    
    // Volatile profile (For aroma wheels)
    volatilome: v.optional(v.object({
      total_vocs: v.number(), // count
      major_components: v.array(v.object({
        compound: v.string(),
        percent_of_total: v.number(),
        aroma_descriptor: v.string(),
        threshold_ppb: v.optional(v.number()),
      })),
      aroma_profile: v.array(v.object({
        category: v.string(), // fruity, floral, earthy, etc.
        intensity: v.number(), // 0-10
        compounds: v.array(v.string()),
      })),
      // Temporal evolution (For time-based aroma charts)
      evolution: v.optional(v.array(v.object({
        time_hours: v.number(),
        profile_change: v.array(v.object({
          compound: v.string(),
          relative_amount: v.number(),
        })),
      }))),
    })),
  }),
  
  // ===== CULTIVATION INTELLIGENCE (Process Viz) =====
  cultivationIntelligence: v.object({
    // Cultivation difficulty matrix (For heatmap)
    difficultyMatrix: v.object({
      overall: v.number(), // 0-10
      factors: v.array(v.object({
        factor: v.string(), // contamination, temperature, humidity, nutrients
        difficulty: v.number(), // 0-10
        critical: v.boolean(),
        solutions: v.optional(v.array(v.string())),
      })),
    }),
    
    // Growth parameters (For parallel coordinates)
    growthParameters: v.object({
      // Optimal ranges (For range morphs)
      temperature: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        storage: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
      }),
      humidity: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
      }),
      co2: v.object({
        colonization: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        fruiting: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
      }),
      light: v.object({
        intensity_lux: v.optional(v.object({ min: v.number(), max: v.number() })),
        photoperiod_hours: v.optional(v.object({ min: v.number(), max: v.number() })),
        spectrum: v.optional(v.array(v.string())),
      }),
      pH: v.object({
        substrate: v.object({ min: v.number(), max: v.number(), optimal: v.number() }),
        casing: v.optional(v.object({ min: v.number(), max: v.number(), optimal: v.number() })),
      }),
    }),
    
    // Substrate compatibility (For matrix viz)
    substrateMatrix: v.array(v.object({
      substrate: v.string(),
      suitability: v.number(), // 0-10
      yield_potential: v.number(), // kg/m²
      colonization_speed: v.number(), // days
      contamination_risk: v.number(), // 0-10
      cost_effectiveness: v.number(), // 0-10
      sustainability: v.number(), // 0-10
      preparation_method: v.optional(v.string()),
    })),
    
    // Production timeline (For Gantt charts)
    productionCycle: v.array(v.object({
      phase: v.string(),
      day_start: v.number(),
      day_end: v.number(),
      tasks: v.array(v.string()),
      critical_parameters: v.array(v.string()),
      checkpoint_criteria: v.optional(v.array(v.string())),
      common_issues: v.optional(v.array(v.string())),
    })),
    
    // Yield projections (For forecast charts)
    yieldModel: v.optional(v.object({
      base_yield_g_per_kg: v.number(),
      flushes: v.array(v.object({
        number: v.number(),
        yield_percent: v.number(), // % of total yield
        days_after_first: v.number(),
      })),
      factors: v.array(v.object({
        factor: v.string(),
        impact: v.number(), // -100 to +100% change
        optimal_value: v.optional(v.number()),
      })),
      // Economic model
      economics: v.optional(v.object({
        setup_cost: v.number(),
        operating_cost_per_kg: v.number(),
        market_price_per_kg: v.number(),
        roi_months: v.number(),
        break_even_kg: v.number(),
      })),
    })),
    
    // Strain variations (For scatter plots)
    strainComparison: v.optional(v.array(v.object({
      strain_name: v.string(),
      origin: v.optional(v.string()),
      characteristics: v.object({
        yield_index: v.number(), // 0-100
        growth_speed: v.number(), // 0-100
        contamination_resistance: v.number(), // 0-100
        temperature_tolerance: v.number(), // 0-100
        shelf_life: v.number(), // days
        flavor_quality: v.number(), // 0-100
      }),
      optimal_conditions: v.optional(v.any()),
    }))),
  }),
  
  // ===== MEDICINAL INTELLIGENCE (Clinical Viz) =====
  medicinalIntelligence: v.object({
    // Therapeutic categories (For sunburst chart)
    therapeuticProfile: v.array(v.object({
      category: v.string(), // immunomodulation, neuroprotection, etc.
      strength: v.number(), // 0-10
      evidence_level: v.string(), // traditional, preclinical, clinical
      mechanisms: v.array(v.string()),
      active_compounds: v.array(v.string()),
    })),
    
    // Clinical evidence (For evidence pyramid)
    clinicalEvidence: v.optional(v.array(v.object({
      condition: v.string(),
      evidence_type: v.string(), // case_report, rct, meta_analysis
      sample_size: v.optional(v.number()),
      effect_size: v.optional(v.number()),
      p_value: v.optional(v.number()),
      year: v.number(),
      dosage: v.optional(v.string()),
      duration: v.optional(v.string()),
      adverse_events: v.optional(v.array(v.string())),
    }))),
    
    // Bioactivity spectrum (For spider charts)
    bioactivitySpectrum: v.optional(v.object({
      antibacterial: v.number(), // 0-10
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
    })),
    
    // Molecular targets (For network viz)
    molecularTargets: v.optional(v.array(v.object({
      target: v.string(), // protein, receptor, enzyme
      interaction_type: v.string(), // inhibition, activation, modulation
      affinity: v.optional(v.number()), // Ki, IC50, etc.
      selectivity: v.optional(v.number()),
      validated: v.boolean(),
    }))),
    
    // Traditional medicine systems (For cultural maps)
    traditionalMedicine: v.optional(v.array(v.object({
      system: v.string(), // TCM, Ayurveda, Native American, etc.
      name: v.string(), // local/traditional name
      uses: v.array(v.string()),
      preparation: v.string(),
      contraindications: v.optional(v.array(v.string())),
      cultural_significance: v.optional(v.number()), // 0-10
    }))),
    
    // Dosage forms (For preparation flowchart)
    preparations: v.optional(v.array(v.object({
      form: v.string(), // extract, powder, tincture, tea, capsule
      extraction_method: v.optional(v.string()),
      concentration: v.optional(v.string()),
      standardization: v.optional(v.string()),
      bioavailability: v.optional(v.number()), // 0-100%
      shelf_life_months: v.optional(v.number()),
    }))),
  }),
  
  // ===== CULINARY DIMENSIONS (Flavor & Pairing Networks) =====
  culinaryDimensions: v.object({
    // Flavor profile (For flavor wheels)
    flavorWheel: v.object({
      primary: v.array(v.object({
        category: v.string(), // savory, sweet, earthy, nutty, etc.
        intensity: v.number(), // 0-10
        descriptors: v.array(v.string()),
      })),
      secondary: v.optional(v.array(v.object({
        note: v.string(),
        intensity: v.number(),
        develops_with: v.optional(v.string()), // cooking, aging, drying
      }))),
      comparison: v.optional(v.array(v.object({
        similar_to: v.string(), // e.g., "lobster", "hazelnut"
        similarity_score: v.number(), // 0-10
      }))),
    }),
    
    // Texture evolution (For state diagrams)
    textureEvolution: v.array(v.object({
      state: v.string(), // raw, blanched, sauteed, grilled, dried
      texture_descriptors: v.array(v.string()),
      moisture_percent: v.number(),
      firmness: v.number(), // 0-10
      optimal_for: v.array(v.string()), // dishes/preparations
    })),
    
    // Pairing network (For network graphs)
    pairingNetwork: v.optional(v.array(v.object({
      ingredient: v.string(),
      affinity: v.number(), // 0-10
      pairing_type: v.string(), // complementary, contrasting, bridging
      shared_compounds: v.optional(v.array(v.string())),
      cuisine_origin: v.optional(v.array(v.string())),
      dishes: v.optional(v.array(v.string())),
    }))),
    
    // Nutritional density (For bubble charts)
    nutritionalDensity: v.object({
      caloric_density: v.number(), // kcal/100g
      protein_quality: v.number(), // PDCAAS score 0-1
      vitamin_density: v.number(), // aggregate score 0-100
      mineral_density: v.number(), // aggregate score 0-100
      fiber_content: v.number(), // g/100g
      water_content: v.number(), // percentage
      // Nutrient ratios (For ratio visualizations)
      ratios: v.object({
        protein_to_carb: v.number(),
        omega6_to_omega3: v.optional(v.number()),
        sodium_to_potassium: v.optional(v.number()),
      }),
    }),
    
    // Preparation methods (For process flow)
    preparationMethods: v.array(v.object({
      method: v.string(),
      temperature: v.optional(v.object({ min: v.number(), max: v.number() })),
      duration_minutes: v.optional(v.object({ min: v.number(), max: v.number() })),
      yield_percent: v.number(), // % of original weight
      nutrient_retention: v.optional(v.object({
        vitamins: v.number(), // % retained
        minerals: v.number(),
        antioxidants: v.number(),
      })),
      flavor_development: v.array(v.string()),
      texture_change: v.string(),
    })),
    
    // Culinary traditions (For cultural maps)
    culinaryTraditions: v.optional(v.array(v.object({
      culture: v.string(),
      dishes: v.array(v.string()),
      preparation_style: v.string(),
      seasonal_use: v.optional(v.string()),
      symbolic_meaning: v.optional(v.string()),
      popularity: v.number(), // 0-10
    }))),
  }),
  
  // ===== ENVIRONMENTAL INTELLIGENCE (Impact Viz) =====
  environmentalIntelligence: v.object({
    // Carbon dynamics (For flow diagrams)
    carbonDynamics: v.optional(v.object({
      sequestration_rate: v.number(), // kg CO2/year/m²
      biomass_carbon: v.number(), // kg C/kg dry weight
      soil_carbon_impact: v.number(), // -10 to +10
      lifecycle_emissions: v.number(), // kg CO2 equivalent
      carbon_efficiency: v.number(), // 0-100
    })),
    
    // Ecosystem services (For service maps)
    ecosystemServices: v.array(v.object({
      service: v.string(), // nutrient cycling, soil formation, etc.
      importance: v.number(), // 0-10
      scale: v.string(), // local, regional, global
      beneficiaries: v.array(v.string()),
      economic_value: v.optional(v.number()),
    })),
    
    // Bioremediation potential (For capability matrix)
    bioremediationPotential: v.optional(v.object({
      heavy_metals: v.array(v.object({
        metal: v.string(),
        accumulation_factor: v.number(),
        tolerance_ppm: v.number(),
      })),
      organic_pollutants: v.array(v.object({
        pollutant: v.string(),
        degradation_rate: v.number(), // % per day
        metabolites: v.array(v.string()),
      })),
      applications: v.array(v.string()),
    })),
    
    // Climate resilience (For vulnerability maps)
    climateResilience: v.object({
      temperature_tolerance: v.number(), // 0-10
      drought_tolerance: v.number(),
      flood_tolerance: v.number(),
      adaptation_potential: v.number(),
      migration_capacity: v.number(),
      // Future scenarios (For scenario planning)
      scenarios: v.optional(v.array(v.object({
        scenario: v.string(), // RCP 2.6, 4.5, 6.0, 8.5
        year: v.number(),
        suitability_change: v.number(), // -100 to +100%
        range_shift_km: v.optional(v.number()),
      }))),
    }),
    
    // Biodiversity interactions (For diversity indices)
    biodiversityRole: v.object({
      species_associations: v.number(), // count
      keystone_index: v.number(), // 0-10
      rarity_index: v.number(), // 0-10
      endemism_index: v.number(), // 0-10
      functional_uniqueness: v.number(), // 0-10
      conservation_priority: v.number(), // 0-10
    }),
  }),
  
  // ===== ECONOMIC DIMENSIONS (Market Analysis) =====
  economicDimensions: v.object({
    // Market dynamics (For price charts)
    marketDynamics: v.optional(v.object({
      current_price: v.object({
        wholesale: v.number(),
        retail: v.number(),
        premium: v.optional(v.number()),
        currency: v.string(),
        unit: v.string(),
      }),
      price_history: v.array(v.object({
        date: v.number(),
        price: v.number(),
        volume: v.optional(v.number()),
        market: v.optional(v.string()),
      })),
      price_volatility: v.number(), // coefficient of variation
      seasonal_pattern: v.array(v.object({
        month: v.number(),
        relative_price: v.number(), // % of annual average
      })),
      // Market segmentation (For treemaps)
      segments: v.array(v.object({
        segment: v.string(), // fresh, dried, extract, pharmaceutical
        share_percent: v.number(),
        growth_rate: v.number(), // annual %
        value_usd: v.optional(v.number()),
      })),
    })),
    
    // Supply chain (For flow diagrams)
    supplyChain: v.optional(v.object({
      production_regions: v.array(v.object({
        region: v.string(),
        production_tons: v.number(),
        export_percent: v.number(),
      })),
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
    })),
    
    // Economic indicators (For dashboard viz)
    economicIndicators: v.optional(v.object({
      market_size_usd: v.number(),
      growth_rate_percent: v.number(),
      employment: v.number(),
      roi: v.number(), // return on investment %
      payback_period_months: v.number(),
      value_per_hectare: v.number(),
    })),
  }),
  
  // ===== CULTURAL DIMENSIONS (Heritage Networks) =====
  culturalDimensions: v.object({
    // Cultural significance (For cultural maps)
    culturalSignificance: v.optional(v.array(v.object({
      culture: v.string(),
      significance_type: v.string(), // food, medicine, spiritual, artistic
      importance: v.number(), // 0-10
      time_period: v.optional(v.string()),
      practices: v.array(v.string()),
      symbols: v.optional(v.array(v.string())),
      stories: v.optional(v.array(v.string())),
    }))),
    
    // Etymology (For word trees)
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
    
    // Art and literature (For cultural timelines)
    culturalReferences: v.optional(v.array(v.object({
      type: v.string(), // painting, literature, music, film
      work: v.string(),
      creator: v.string(),
      year: v.number(),
      significance: v.string(),
      image_url: v.optional(v.string()),
    }))),
  }),
  
  // ===== INTERACTION MATRICES (Multi-dimensional relationships) =====
  interactionMatrices: v.object({
    // Species interactions (For chord diagrams)
    speciesInteractions: v.optional(v.array(v.object({
      species: v.string(),
      interaction_type: v.string(),
      strength: v.number(), // -10 to +10 (negative = antagonistic)
      mechanism: v.string(),
      evidence: v.string(),
      reciprocal: v.boolean(),
    }))),
    
    // Compound synergies (For synergy maps)
    compoundSynergies: v.optional(v.array(v.object({
      compound1: v.string(),
      compound2: v.string(),
      effect_type: v.string(), // additive, synergistic, antagonistic
      magnitude: v.number(), // fold change
      biological_target: v.optional(v.string()),
    }))),
    
    // Environmental responses (For response surfaces)
    environmentalResponses: v.optional(v.array(v.object({
      factor1: v.string(),
      factor2: v.string(),
      response_matrix: v.array(v.array(v.number())), // 2D grid of responses
      optimal_point: v.object({ x: v.number(), y: v.number() }),
    }))),
  }),
  
  // ===== KNOWLEDGE GRAPH CONNECTIONS =====
  knowledgeConnections: v.object({
    // Related species (For similarity networks)
    relatedSpecies: v.array(v.object({
      species: v.string(),
      relationship: v.string(), // taxonomic, ecological, chemical, morphological
      similarity: v.number(), // 0-100
      shared_features: v.array(v.string()),
    })),
    
    // Cross-references (For knowledge maps)
    crossReferences: v.optional(v.array(v.object({
      type: v.string(), // research, cultivation, culinary, medicinal
      reference_id: v.string(),
      relevance: v.number(), // 0-10
    }))),
    
    // Semantic tags (For tag clouds and filtering)
    tags: v.array(v.string()),
    
    // Ontology mappings (For semantic web)
    ontologies: v.optional(v.array(v.object({
      ontology: v.string(), // NCBI, EOL, MycoBank, etc.
      id: v.string(),
      uri: v.optional(v.string()),
    }))),
  }),
  
  // ===== META INFORMATION =====
  metaInfo: v.object({
    // Data quality indicators
    dataQuality: v.object({
      completeness: v.number(), // 0-100%
      accuracy_confidence: v.number(), // 0-100%
      last_updated: v.number(),
      update_frequency: v.optional(v.string()),
      verification_status: v.string(),
      data_sources: v.array(v.string()),
    }),
    
    // Research metrics (For research impact viz)
    researchMetrics: v.optional(v.object({
      publication_count: v.number(),
      citation_count: v.number(),
      h_index: v.optional(v.number()),
      research_trend: v.string(), // increasing, stable, decreasing
      hot_topics: v.array(v.string()),
      funding_usd: v.optional(v.number()),
    })),
    
    // User engagement metrics (For popularity viz)
    engagement: v.optional(v.object({
      views: v.number(),
      bookmarks: v.number(),
      contributions: v.number(),
      quality_ratings: v.array(v.object({
        aspect: v.string(),
        rating: v.number(), // 0-5
        count: v.number(),
      })),
    })),
    
    // Conservation status
    conservation: v.optional(v.object({
      iucn_status: v.string(),
      national_status: v.optional(v.array(v.object({
        country: v.string(),
        status: v.string(),
      }))),
      threats: v.array(v.string()),
      conservation_actions: v.array(v.string()),
      population_trend: v.string(),
    })),
  }),
})
  .index("by_seoName", ["seoName"])
  .index("by_slug", ["slug"])
  .index("by_commonName", ["commonName"])
  .index("by_latinName", ["latinName"])
  .index("by_genus", ["taxonomy.genus"])
  .index("by_edibility", ["sensoryProfile.taste"])
  .index("by_cultivation", ["cultivationIntelligence.difficultyMatrix.overall"]);

// ===== SUPPORTING TABLES (Relationships, Analytics, etc.) =====

/**
 * Dynamic Relationships Table
 * Computed relationships between entities based on various dimensions
 */
const relationships = defineTable({
  sourceFungusId: v.id("fungi"),
  targetFungusId: v.id("fungi"),
  
  // Relationship metadata
  relationshipType: v.string(), // similarity, ecological, chemical, morphological, culinary
  dimension: v.string(), // specific dimension of relationship
  
  // Relationship strength and direction
  strength: v.number(), // 0-100
  directionality: v.string(), // unidirectional, bidirectional, asymmetric
  confidence: v.number(), // 0-100
  
  // Relationship details
  sharedFeatures: v.array(v.string()),
  differentiatingFeatures: v.array(v.string()),
  
  // Temporal aspects
  temporal: v.optional(v.object({
    seasonal: v.boolean(),
    peak_months: v.optional(v.array(v.number())),
    stability: v.number(), // 0-100 (how stable is this relationship)
  })),
  
  // Computed metrics
  metrics: v.optional(v.object({
    similarity_score: v.number(),
    interaction_frequency: v.optional(v.number()),
    co_occurrence: v.optional(v.number()),
  })),
  
  // Metadata
  computedAt: v.number(),
  algorithm: v.string(),
  version: v.string(),
})
  .index("by_source", ["sourceFungusId"])
  .index("by_target", ["targetFungusId"])
  .index("by_type", ["relationshipType"])
  .index("by_strength", ["strength"]);

/**
 * User Collections
 * Personal collections and lists created by users
 */
const userCollections = defineTable({
  userId: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  
  // Collection type and purpose
  type: v.string(), // favorites, research, cultivation, foraging, cooking
  visibility: v.string(), // private, public, shared
  
  // Fungi in collection
  fungiIds: v.array(v.id("fungi")),
  
  // Custom notes per fungus
  notes: v.optional(v.array(v.object({
    fungusId: v.id("fungi"),
    note: v.string(),
    tags: v.optional(v.array(v.string())),
  }))),
  
  // Collection metadata
  tags: v.array(v.string()),
  created: v.number(),
  updated: v.number(),
  
  // Sharing
  sharedWith: v.optional(v.array(v.string())), // user IDs
  shareLink: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_type", ["type"])
  .index("by_visibility", ["visibility"]);

/**
 * Observation Records
 * Field observations and sightings
 */
const observations = defineTable({
  fungusId: v.id("fungi"),
  observerId: v.string(),
  
  // Location (detailed for mapping)
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
    
    // Administrative location
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    locality: v.optional(v.string()),
  }),
  
  // Temporal data
  observationDate: v.number(),
  time: v.optional(v.string()), // HH:MM
  season: v.string(),
  
  // Environmental conditions
  weather: v.optional(v.object({
    temperature_c: v.optional(v.number()),
    humidity_percent: v.optional(v.number()),
    precipitation: v.optional(v.string()),
    days_since_rain: v.optional(v.number()),
  })),
  
  // Observation details
  abundance: v.string(), // single, few, many, abundant
  developmentStage: v.string(),
  health: v.string(), // healthy, diseased, parasitized
  size_cm: v.optional(v.object({
    cap_diameter: v.optional(v.number()),
    stem_height: v.optional(v.number()),
  })),
  
  // Associated species
  associatedPlants: v.optional(v.array(v.string())),
  associatedFungi: v.optional(v.array(v.string())),
  
  // Documentation
  photos: v.optional(v.array(v.object({
    url: v.string(),
    type: v.string(), // habitat, specimen, detail, microscopy
    description: v.optional(v.string()),
  }))),
  
  // Verification
  identificationConfidence: v.string(), // certain, probable, uncertain
  verificationStatus: v.string(), // unverified, community, expert
  verifiedBy: v.optional(v.string()),
  verificationDate: v.optional(v.number()),
  
  // Notes
  notes: v.optional(v.string()),
  unusualFeatures: v.optional(v.array(v.string())),
  
  // Privacy
  public: v.boolean(),
  obscureLocation: v.boolean(), // for rare species
})
  .index("by_fungus", ["fungusId"])
  .index("by_observer", ["observerId"])
  .index("by_date", ["observationDate"])
  .index("by_location", ["location.country"]);

// ===== ANALYTICS TABLES =====

/**
 * Search Analytics
 * Track search patterns for improving discovery
 */
const searchAnalytics = defineTable({
  query: v.string(),
  timestamp: v.number(),
  
  // Search context
  userId: v.optional(v.string()),
  sessionId: v.string(),
  searchType: v.string(), // text, visual, chemical, location
  filters: v.optional(v.array(v.string())),
  
  // Results
  resultCount: v.number(),
  clickedResults: v.optional(v.array(v.object({
    fungusId: v.id("fungi"),
    position: v.number(),
    dwellTime: v.optional(v.number()),
  }))),
  
  // Performance
  responseTime_ms: v.number(),
  relevanceScore: v.optional(v.number()),
})
  .index("by_query", ["query"])
  .index("by_timestamp", ["timestamp"])
  .index("by_user", ["userId"]);

/**
 * Visualization Interactions
 * Track how users interact with visualizations
 */
const visualizationAnalytics = defineTable({
  userId: v.optional(v.string()),
  sessionId: v.string(),
  timestamp: v.number(),
  
  // Visualization details
  visualizationType: v.string(), // chart, map, network, timeline, etc.
  dataType: v.string(), // what data is being visualized
  fungusIds: v.optional(v.array(v.id("fungi"))),
  
  // Interaction
  interaction: v.string(), // view, zoom, filter, select, export
  parameters: v.optional(v.any()), // interaction-specific params
  duration_ms: v.optional(v.number()),
  
  // User feedback
  useful: v.optional(v.boolean()),
  feedback: v.optional(v.string()),
})
  .index("by_user", ["userId"])
  .index("by_type", ["visualizationType"])
  .index("by_timestamp", ["timestamp"]);

export default defineSchema({
  // Core tables
  fungi,
  relationships,
  
  // User-generated content
  userCollections,
  observations,
  
  // Analytics
  searchAnalytics,
  visualizationAnalytics,
});