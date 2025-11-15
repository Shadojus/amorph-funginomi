/**
 * NOEMI-Enhanced Convex Schema v3.0
 * 
 * Comprehensive Knowledge Domain Architecture:
 * - Central fungi table with complete morphological and identification data
 * - Separate knowledge domain tables for deep, interconnected research data
 * - Rich citation and source tracking for all claims
 * - Enables scalable, queryable knowledge networks
 * - Optimized for both quick access and deep analysis
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * ============================================================================
 * CENTRAL FUNGI TABLE
 * ============================================================================
 * The core entity containing all essential attributes for identification,
 * basic characteristics, and quick-access information. This table remains
 * lean for fast queries while linking to detailed knowledge domains.
 */
const fungi = defineTable({
  // ===== CORE IDENTITY =====
  commonName: v.string(),
  latinName: v.string(),
  scientificNameSynonyms: v.optional(v.array(v.string())),
  commonNameVariants: v.optional(v.array(v.string())),
  seoName: v.string(), // URL-friendly slug
  
  // ===== CORE DESCRIPTION =====
  description: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  imageUrls: v.optional(v.array(v.string())),
  
  // ===== TAXONOMIC CLASSIFICATION =====
  taxonomy: v.object({
    kingdom: v.string(),
    phylum: v.string(),
    class: v.string(),
    order: v.string(),
    family: v.string(),
    genus: v.string(),
    species: v.string(),
  }),
  
  // ===== PHYSICAL CHARACTERISTICS =====
  // Detailed morphological features for identification
  physicalCharacteristics: v.object({
    // Cap (Pileus)
    capShape: v.optional(v.array(v.string())), // convex, campanulate, umbonate, etc.
    capDiameter: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(), // cm, mm
    })),
    capColor: v.optional(v.array(v.string())),
    capTexture: v.optional(v.array(v.string())), // smooth, scaly, fibrillose, etc.
    capMargin: v.optional(v.string()), // incurved, straight, decurved, etc.
    capSurface: v.optional(v.string()), // dry, viscid, sticky, slimy
    
    // Hymenophore (Gills/Pores/Teeth)
    hymenophoreType: v.optional(v.string()), // gills, pores, teeth, smooth
    gillAttachment: v.optional(v.string()), // free, adnate, decurrent, etc.
    gillSpacing: v.optional(v.string()), // crowded, close, distant
    gillColor: v.optional(v.array(v.string())),
    poreSize: v.optional(v.string()), // for polypores
    
    // Stipe (Stem)
    stipeLength: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(),
    })),
    stipeDiameter: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(),
    })),
    stipeColor: v.optional(v.array(v.string())),
    stipeTexture: v.optional(v.string()),
    stipeBase: v.optional(v.string()), // bulbous, tapered, equal
    
    // Spores
    sporePrintColor: v.optional(v.string()),
    sporeSize: v.optional(v.object({
      length: v.optional(v.object({ min: v.number(), max: v.number() })),
      width: v.optional(v.object({ min: v.number(), max: v.number() })),
      unit: v.string(), // micrometers
    })),
    sporeShape: v.optional(v.string()),
    
    // Other features
    veil: v.optional(v.string()), // partial, universal, absent
    ring: v.optional(v.string()), // present, absent, position
    volva: v.optional(v.string()), // present, absent, type
    odor: v.optional(v.array(v.string())),
    taste: v.optional(v.string()), // only for edible species
    latex: v.optional(v.string()), // present, absent, color
    staining: v.optional(v.string()), // color changes when bruised
    bioluminescence: v.optional(v.boolean()),
    texture: v.optional(v.string()), // firm, brittle, tough, etc.
  }),
  
  // ===== SAFETY & IDENTIFICATION =====
  safetyAndIdentification: v.object({
    edibility: v.string(), // edible, poisonous, toxic, medicinal, unknown, inedible
    toxicityLevel: v.optional(v.string()), // none, mild, moderate, severe, deadly
    toxins: v.optional(v.array(v.string())), // specific toxins present
    symptoms: v.optional(v.array(v.string())), // poisoning symptoms
    treatmentInfo: v.optional(v.string()),
    
    lookalikeSpecies: v.optional(v.array(v.object({
      species: v.string(),
      distinguishingFeatures: v.array(v.string()),
      toxicityDifference: v.optional(v.string()),
    }))),
    
    identificationDifficulty: v.string(), // beginner, intermediate, advanced, expert
    keyIdentificationFeatures: v.array(v.string()),
    identificationSeasonality: v.optional(v.array(v.string())),
    microscopicFeaturesRequired: v.optional(v.boolean()),
    chemicalTestsRequired: v.optional(v.boolean()),
    
    safetyWarnings: v.optional(v.array(v.string())),
    specialPrecautions: v.optional(v.array(v.string())),
  }),
  
  // ===== ECOLOGY & HABITAT =====
  ecologyAndHabitat: v.object({
    habitat: v.array(v.string()), // forest, grassland, urban, wetland, etc.
    substrate: v.array(v.string()), // wood, soil, dung, living trees, etc.
    substrateDetails: v.optional(v.array(v.string())), // specific tree species, wood type
    
    ecologicalRole: v.array(v.string()), // decomposer, mycorrhizal, parasitic, etc.
    symbioticRelationships: v.optional(v.array(v.object({
      partnerOrganism: v.string(),
      relationshipType: v.string(), // mutualistic, parasitic, commensal
      details: v.optional(v.string()),
    }))),
    
    seasonality: v.object({
      primarySeason: v.array(v.string()), // spring, summer, fall, winter
      peakMonths: v.optional(v.array(v.string())),
      yearRound: v.optional(v.boolean()),
    }),
    
    geographicDistribution: v.object({
      continents: v.array(v.string()),
      countries: v.optional(v.array(v.string())),
      regions: v.optional(v.array(v.string())),
      endemic: v.optional(v.boolean()),
      invasive: v.optional(v.boolean()),
    }),
    
    climatePreferences: v.object({
      temperatureRange: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
        unit: v.string(), // celsius, fahrenheit
      })),
      precipitationRange: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(), // mm, inches
      })),
      humidityRange: v.optional(v.object({
        min: v.number(),
        max: v.number(),
      })),
      climateZones: v.optional(v.array(v.string())), // temperate, tropical, boreal, etc.
    }),
    
    abundance: v.optional(v.string()), // rare, uncommon, common, abundant
    populationTrend: v.optional(v.string()), // increasing, stable, declining, unknown
  }),
  
  // ===== CULTIVATION & PROCESSING =====
  // Comprehensive cultivation data for growers
  cultivationAndProcessing: v.optional(v.object({
    // Cultivation Feasibility
    cultivable: v.boolean(),
    cultivationDifficulty: v.optional(v.string()), // easy, moderate, difficult, very difficult
    commerciallyViable: v.optional(v.boolean()),
    homeGrowingViable: v.optional(v.boolean()),
    
    // Growth Requirements
    temperatureRequirements: v.optional(v.object({
      colonization: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
        unit: v.string(),
      })),
      fruiting: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
        unit: v.string(),
      })),
    })),
    
    humidityRequirements: v.optional(v.object({
      colonization: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
      })),
      fruiting: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        optimal: v.number(),
      })),
    })),
    
    lightRequirements: v.optional(v.object({
      colonization: v.string(), // none, low, moderate, high
      fruiting: v.string(),
      photoperiod: v.optional(v.string()), // hours of light needed
    })),
    
    co2Requirements: v.optional(v.object({
      colonization: v.optional(v.string()), // ppm range or description
      fruiting: v.optional(v.string()),
    })),
    
    pHRequirements: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      optimal: v.number(),
    })),
    
    // Substrate & Nutrition
    substratePreferences: v.optional(v.array(v.string())), // sawdust, straw, manure, grain, etc.
    substrateFormulations: v.optional(v.array(v.object({
      name: v.string(),
      ingredients: v.array(v.object({
        ingredient: v.string(),
        percentage: v.number(),
      })),
      supplementation: v.optional(v.string()),
      notes: v.optional(v.string()),
    }))),
    
    nutritionalSupplements: v.optional(v.array(v.string())),
    nitrogenRequirements: v.optional(v.string()),
    carbonToNitrogenRatio: v.optional(v.string()),
    
    // Growth Cycle
    timeToColonization: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      unit: v.string(), // days, weeks
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
    
    flushes: v.optional(v.object({
      number: v.number(), // typical number of flushes
      timeBetweenFlushes: v.optional(v.number()), // days
      yieldDeclinePattern: v.optional(v.string()),
    })),
    
    // Yield Information
    yieldPotential: v.optional(v.object({
      biologicalEfficiency: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(), // percentage
      })),
      freshWeightPerKg: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(), // grams
      })),
      dryWeightRatio: v.optional(v.number()), // percentage
    })),
    
    // Cultivation Methods
    cultivationMethods: v.optional(v.array(v.string())), // bag culture, log culture, bottle, etc.
    propagationMethods: v.optional(v.array(v.string())), // spores, liquid culture, agar, etc.
    sterilizationRequired: v.optional(v.boolean()),
    pasteurizationSufficient: v.optional(v.boolean()),
    
    // Growing Environment
    indoorSuitability: v.optional(v.boolean()),
    outdoorSuitability: v.optional(v.boolean()),
    greenhouseSuitability: v.optional(v.boolean()),
    basementGrowingSuitability: v.optional(v.boolean()),
    
    // Common Challenges
    commonPests: v.optional(v.array(v.string())),
    commonDiseases: v.optional(v.array(v.string())),
    commonContaminants: v.optional(v.array(v.string())),
    contaminationSusceptibility: v.optional(v.string()), // low, moderate, high
    
    // Harvesting
    harvestTiming: v.optional(v.object({
      indicators: v.array(v.string()),
      optimalStage: v.string(),
      timingCritical: v.optional(v.boolean()),
    })),
    
    harvestMethod: v.optional(v.string()), // twist, cut, pick, etc.
    postHarvestHandling: v.optional(v.array(v.string())),
    
    // Processing & Storage
    processingMethods: v.optional(v.array(v.string())), // drying, freezing, extract, etc.
    shelfLife: v.optional(v.object({
      fresh: v.optional(v.object({
        duration: v.number(),
        unit: v.string(), // days, weeks
        conditions: v.optional(v.string()),
      })),
      dried: v.optional(v.object({
        duration: v.number(),
        unit: v.string(), // months, years
        conditions: v.optional(v.string()),
      })),
    })),
    
    storageRecommendations: v.optional(v.array(v.string())),
    
    // Economics
    setupCostRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      currency: v.string(),
      scale: v.string(), // small, medium, large
    })),
    
    operatingCosts: v.optional(v.string()),
    laborRequirements: v.optional(v.string()),
    skillLevel: v.optional(v.string()), // beginner, intermediate, advanced
    
    // Special Requirements
    specialEquipment: v.optional(v.array(v.string())),
    certifications: v.optional(v.array(v.string())),
    regulatoryConsiderations: v.optional(v.array(v.string())),
  })),
  
  // ===== CULINARY & NUTRITIONAL =====
  culinaryAndNutritional: v.optional(v.object({
    // Culinary Properties
    flavorProfile: v.optional(v.array(v.string())), // earthy, nutty, umami, fruity, etc.
    flavorIntensity: v.optional(v.string()), // mild, moderate, strong
    aromatic: v.optional(v.boolean()),
    aromaticProfile: v.optional(v.array(v.string())),
    
    texture: v.optional(v.object({
      raw: v.optional(v.string()),
      cooked: v.optional(v.string()),
    })),
    
    culinaryUses: v.optional(v.array(v.string())), // soup, stir-fry, grilling, etc.
    cuisineTypes: v.optional(v.array(v.string())), // Italian, Asian, French, etc.
    
    preparationMethods: v.optional(v.array(v.object({
      method: v.string(),
      duration: v.optional(v.string()),
      notes: v.optional(v.string()),
    }))),
    
    preparationRequirements: v.optional(v.array(v.string())), // must be cooked, remove stems, etc.
    complementaryIngredients: v.optional(v.array(v.string())),
    seasoningRecommendations: v.optional(v.array(v.string())),
    
    // Nutritional Content (per 100g)
    nutritionalValue: v.optional(v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()), // grams
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
    
    // Health Properties
    antioxidants: v.optional(v.array(v.string())),
    bioactiveCompounds: v.optional(v.array(v.string())),
    prebioticProperties: v.optional(v.boolean()),
    probioticProperties: v.optional(v.boolean()),
    
    healthBenefits: v.optional(v.array(v.string())),
    dietaryConsiderations: v.optional(v.array(v.string())), // vegan, keto-friendly, etc.
    allergenInfo: v.optional(v.array(v.string())),
    
    // Storage & Shelf Life
    storageRecommendations: v.optional(v.object({
      fresh: v.optional(v.string()),
      cooked: v.optional(v.string()),
      preserved: v.optional(v.string()),
    })),
    
    shelfLife: v.optional(v.object({
      fresh: v.optional(v.string()),
      refrigerated: v.optional(v.string()),
      frozen: v.optional(v.string()),
      dried: v.optional(v.string()),
    })),
    
    preservationMethods: v.optional(v.array(v.string())), // drying, freezing, pickling, etc.
  })),
  
  // ===== MEDICINAL & HEALTH =====
  medicinalAndHealth: v.optional(v.object({
    medicinalUse: v.boolean(),
    traditionalUse: v.optional(v.object({
      cultures: v.optional(v.array(v.string())),
      historicalUse: v.optional(v.string()),
      preparation: v.optional(v.array(v.string())),
      treatmentTargets: v.optional(v.array(v.string())),
    })),
    
    medicinalProperties: v.optional(v.array(v.string())), // antimicrobial, anti-inflammatory, etc.
    therapeuticApplications: v.optional(v.array(v.string())),
    
    activeCompounds: v.optional(v.array(v.object({
      name: v.string(),
      class: v.optional(v.string()), // polysaccharide, terpenoid, etc.
      concentration: v.optional(v.string()),
      function: v.optional(v.string()),
      bioavailability: v.optional(v.string()),
    }))),
    
    mechanisms: v.optional(v.array(v.string())), // how it works
    targetSystems: v.optional(v.array(v.string())), // immune, cardiovascular, etc.
    
    researchStatus: v.optional(v.string()), // traditional, in-vitro, animal, clinical, approved
    clinicalTrials: v.optional(v.array(v.object({
      phase: v.optional(v.string()),
      condition: v.string(),
      results: v.optional(v.string()),
      status: v.optional(v.string()),
    }))),
    
    dosageRecommendations: v.optional(v.array(v.object({
      form: v.string(), // powder, extract, tea, capsule
      amount: v.string(),
      frequency: v.string(),
      duration: v.optional(v.string()),
      notes: v.optional(v.string()),
    }))),
    
    contraindications: v.optional(v.array(v.string())),
    interactions: v.optional(v.array(v.object({
      substance: v.string(), // drug, supplement, food
      effect: v.string(),
      severity: v.optional(v.string()),
    }))),
    
    sideEffects: v.optional(v.array(v.string())),
    pregnancyWarning: v.optional(v.boolean()),
    childrenWarning: v.optional(v.boolean()),
    
    regulatoryStatus: v.optional(v.array(v.object({
      region: v.string(),
      status: v.string(), // approved, supplement, unregulated, banned
      notes: v.optional(v.string()),
    }))),
  })),
  
  // ===== CHEMICAL & PROPERTIES =====
  chemicalAndProperties: v.optional(v.object({
    primaryCompounds: v.optional(v.array(v.object({
      name: v.string(),
      class: v.string(), // polysaccharide, protein, terpenoid, etc.
      concentration: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        unit: v.string(),
      })),
      location: v.optional(v.string()), // cap, stem, spores, mycelium
      function: v.optional(v.string()),
      bioactivity: v.optional(v.array(v.string())),
    }))),
    
    secondaryMetabolites: v.optional(v.array(v.string())),
    enzymeActivity: v.optional(v.array(v.object({
      enzyme: v.string(),
      activity: v.optional(v.string()),
      substrate: v.optional(v.string()),
      applications: v.optional(v.array(v.string())),
    }))),
    
    pigments: v.optional(v.array(v.object({
      name: v.string(),
      color: v.string(),
      chemicalClass: v.optional(v.string()),
      location: v.optional(v.string()),
    }))),
    
    antioxidantCapacity: v.optional(v.object({
      oracScore: v.optional(v.number()),
      dpphValue: v.optional(v.number()),
      teacValue: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
    
    antimicrobialActivity: v.optional(v.array(v.object({
      targetOrganism: v.string(),
      activity: v.string(), // strong, moderate, weak
      minimumInhibitoryConcentration: v.optional(v.string()),
    }))),
    
    heavyMetals: v.optional(v.object({
      bioaccumulation: v.optional(v.boolean()),
      concernedMetals: v.optional(v.array(v.string())),
      safetyConsiderations: v.optional(v.string()),
    })),
  })),
  
  // ===== COMMERCIAL & MARKET =====
  commercialAndMarket: v.optional(v.object({
    commercialValue: v.optional(v.string()), // none, low, moderate, high
    marketDemand: v.optional(v.string()), // none, niche, growing, established, high
    
    priceRange: v.optional(v.object({
      fresh: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
        unit: v.string(), // per kg, per lb
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
    
    marketSegments: v.optional(v.array(v.string())), // gourmet, medicinal, supplement, etc.
    commercialProducts: v.optional(v.array(v.string())),
    industryApplications: v.optional(v.array(v.string())),
    
    majorProducers: v.optional(v.array(v.string())), // countries/regions
    majorConsumers: v.optional(v.array(v.string())),
    
    tradeVolume: v.optional(v.object({
      global: v.optional(v.string()),
      trend: v.optional(v.string()), // increasing, stable, declining
    })),
    
    investmentPotential: v.optional(v.string()),
    barrierToEntry: v.optional(v.array(v.string())),
    
    certifications: v.optional(v.array(v.string())), // organic, fair-trade, etc.
    qualityStandards: v.optional(v.array(v.string())),
  })),
  
  // ===== CULTURAL & HISTORICAL =====
  culturalAndHistorical: v.optional(v.object({
    historicalSignificance: v.optional(v.string()),
    firstDocumented: v.optional(v.string()), // year or era
    namingHistory: v.optional(v.string()),
    
    culturalUse: v.optional(v.array(v.object({
      culture: v.string(),
      region: v.optional(v.string()),
      use: v.string(),
      significance: v.optional(v.string()),
      stillPracticed: v.optional(v.boolean()),
    }))),
    
    folklore: v.optional(v.array(v.object({
      culture: v.string(),
      story: v.string(),
      symbolism: v.optional(v.string()),
    }))),
    
    religiousSignificance: v.optional(v.array(v.object({
      religion: v.string(),
      role: v.string(),
      practices: v.optional(v.array(v.string())),
    }))),
    
    ceremonialUse: v.optional(v.array(v.object({
      ceremony: v.string(),
      culture: v.string(),
      purpose: v.string(),
    }))),
    
    artAndLiterature: v.optional(v.array(v.object({
      type: v.string(), // painting, poetry, novel, etc.
      title: v.optional(v.string()),
      creator: v.optional(v.string()),
      period: v.optional(v.string()),
    }))),
    
    indigenousNames: v.optional(v.array(v.object({
      language: v.string(),
      name: v.string(),
      meaning: v.optional(v.string()),
      culture: v.string(),
    }))),
    
    traditionalKnowledge: v.optional(v.string()),
    knowledgeHolders: v.optional(v.array(v.string())), // cultural groups
  })),
  
  // ===== ENVIRONMENTAL & CONSERVATION =====
  environmentalAndConservation: v.optional(v.object({
    conservationStatus: v.optional(v.object({
      iucnStatus: v.optional(v.string()), // LC, NT, VU, EN, CR, EW, EX
      nationalStatus: v.optional(v.array(v.object({
        country: v.string(),
        status: v.string(),
        year: v.optional(v.number()),
      }))),
      redListStatus: v.optional(v.string()),
    })),
    
    threats: v.optional(v.array(v.object({
      threat: v.string(),
      severity: v.optional(v.string()), // low, moderate, high, critical
      trend: v.optional(v.string()), // increasing, stable, decreasing
    }))),
    
    protectionMeasures: v.optional(v.array(v.string())),
    protectedAreas: v.optional(v.array(v.string())),
    
    ecologicalRole: v.array(v.string()),
    ecosystemServices: v.optional(v.array(v.string())),
    keystone: v.optional(v.boolean()), // keystone species status
    
    environmentalImpact: v.optional(v.object({
      carbonSequestration: v.optional(v.string()),
      soilHealth: v.optional(v.string()),
      waterCycle: v.optional(v.string()),
      biodiversity: v.optional(v.string()),
    })),
    
    climateChangeImpact: v.optional(v.object({
      vulnerability: v.optional(v.string()), // low, moderate, high
      adaptability: v.optional(v.string()),
      rangeShift: v.optional(v.string()),
      phenologyShift: v.optional(v.string()),
    })),
    
    sustainabilityRating: v.optional(v.string()),
    sustainableHarvestingGuidelines: v.optional(v.array(v.string())),
  })),
  
  // ===== RESEARCH & INNOVATION =====
  researchAndInnovation: v.optional(v.object({
    researchInterest: v.optional(v.string()), // low, moderate, high
    activeResearchAreas: v.optional(v.array(v.string())),
    
    biotechnologyPotential: v.optional(v.object({
      overall: v.optional(v.string()),
      areas: v.optional(v.array(v.string())),
    })),
    
    innovativeApplications: v.optional(v.array(v.object({
      application: v.string(),
      field: v.string(),
      developmentStage: v.optional(v.string()),
      potential: v.optional(v.string()),
    }))),
    
    patentedTechnologies: v.optional(v.array(v.object({
      technology: v.string(),
      patentNumber: v.optional(v.string()),
      holder: v.optional(v.string()),
      year: v.optional(v.number()),
    }))),
    
    genomicData: v.optional(v.object({
      sequenced: v.optional(v.boolean()),
      genomeSize: v.optional(v.string()),
      geneCount: v.optional(v.number()),
      accessionNumber: v.optional(v.string()),
    })),
    
    modelOrganism: v.optional(v.boolean()),
    researchTools: v.optional(v.array(v.string())),
  })),
  
  // ===== METADATA =====
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
  verified: v.optional(v.boolean()),
  isPublic: v.optional(v.boolean()),
  completenessScore: v.optional(v.number()), // 0-100
  dataQuality: v.optional(v.string()), // preliminary, good, excellent
  
  sources: v.optional(v.array(v.object({
    type: v.string(), // scientific, book, website, traditional
    citation: v.string(),
    url: v.optional(v.string()),
    accessedDate: v.optional(v.string()),
    reliability: v.optional(v.string()), // low, moderate, high
  }))),
  
  contributors: v.optional(v.array(v.object({
    name: v.string(),
    role: v.string(),
    date: v.optional(v.number()),
  }))),
  
  reviewStatus: v.optional(v.object({
    status: v.string(), // draft, review, approved
    reviewer: v.optional(v.string()),
    reviewDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  })),
})
  .index("by_commonName", ["commonName"])
  .index("by_latinName", ["latinName"])
  .index("by_seoName", ["seoName"])
  .index("by_edibility", ["safetyAndIdentification.edibility"])
  .index("by_family", ["taxonomy.family"])
  .index("by_genus", ["taxonomy.genus"])
  .searchIndex("search_fungi", {
    searchField: "commonName",
    filterFields: ["safetyAndIdentification.edibility"],
  });

/**
 * ============================================================================
 * KNOWLEDGE DOMAIN TABLES
 * ============================================================================
 * Separate tables for deep, research-grade information with full citations
 */

/**
 * Scientific Papers & Research
 * Links to published scientific research about fungi
 */
const scientificPapers = defineTable({
  fungusId: v.id("fungi"),
  
  // Paper Identity
  title: v.string(),
  authors: v.array(v.string()),
  journal: v.optional(v.string()),
  year: v.number(),
  doi: v.optional(v.string()),
  pmid: v.optional(v.string()),
  url: v.optional(v.string()),
  
  // Content
  abstract: v.optional(v.string()),
  keywords: v.optional(v.array(v.string())),
  
  // Classification
  researchArea: v.array(v.string()), // taxonomy, ecology, medicinal, cultivation, etc.
  studyType: v.optional(v.string()), // experimental, observational, review, meta-analysis
  
  // Key Findings
  keyFindings: v.optional(v.array(v.string())),
  methodology: v.optional(v.string()),
  
  // Quality Metrics
  citationCount: v.optional(v.number()),
  impactFactor: v.optional(v.number()),
  peerReviewed: v.optional(v.boolean()),
  
  // Relevance
  relevanceScore: v.optional(v.number()), // 0-10
  applicationAreas: v.optional(v.array(v.string())),
  
  // Metadata
  addedDate: v.optional(v.number()),
  lastUpdated: v.optional(v.number()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_year", ["year"])
  .index("by_research_area", ["researchArea"]);

/**
 * Climate Impact Data
 * Climate-related observations and predictions
 */
const climateImpact = defineTable({
  fungusId: v.id("fungi"),
  
  // Study Information
  title: v.string(),
  studyYear: v.optional(v.number()),
  region: v.array(v.string()),
  
  // Climate Observations
  historicalData: v.optional(v.object({
    temperatureChange: v.optional(v.number()), // degrees
    precipitationChange: v.optional(v.number()), // percentage
    phenologyShift: v.optional(v.number()), // days
    abundanceChange: v.optional(v.string()),
  })),
  
  // Future Projections
  projections: v.optional(v.array(v.object({
    scenario: v.string(), // RCP2.6, RCP4.5, RCP8.5
    timeframe: v.string(), // 2050, 2100
    habitatSuitabilityChange: v.optional(v.number()), // percentage
    rangeShift: v.optional(v.string()),
    extinctionRisk: v.optional(v.string()),
  }))),
  
  // Indigenous Climate Knowledge
  traditionalObservations: v.optional(v.array(v.object({
    community: v.string(),
    observation: v.string(),
    timeframe: v.optional(v.string()),
    reliability: v.optional(v.string()),
  }))),
  
  // Bioclimatic Variables
  bioclimaticFactors: v.optional(v.array(v.object({
    factor: v.string(),
    optimalRange: v.optional(v.string()),
    currentTrend: v.optional(v.string()),
  }))),
  
  // Sources
  sources: v.optional(v.array(v.string())),
  dataQuality: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_region", ["region"]);

/**
 * Economic Data
 * Market, trade, and economic information
 */
const economicData = defineTable({
  fungusId: v.id("fungi"),
  
  // Market Data
  marketSegment: v.string(), // fresh, dried, extract, supplement
  region: v.string(),
  year: v.number(),
  
  // Pricing
  priceData: v.optional(v.object({
    average: v.number(),
    min: v.number(),
    max: v.number(),
    currency: v.string(),
    unit: v.string(),
  })),
  
  // Trade Volume
  productionVolume: v.optional(v.object({
    amount: v.number(),
    unit: v.string(),
    growthRate: v.optional(v.number()), // percentage
  })),
  
  tradeVolume: v.optional(v.object({
    exports: v.optional(v.number()),
    imports: v.optional(v.number()),
    unit: v.string(),
  })),
  
  // Market Analysis
  marketTrends: v.optional(v.array(v.string())),
  demandDrivers: v.optional(v.array(v.string())),
  supplyConstraints: v.optional(v.array(v.string())),
  
  // Investment
  investmentActivity: v.optional(v.object({
    level: v.string(),
    areas: v.optional(v.array(v.string())),
    majorInvestors: v.optional(v.array(v.string())),
  })),
  
  // Value Chain
  valueChainData: v.optional(v.array(v.object({
    stage: v.string(),
    valueAddition: v.optional(v.number()), // percentage
    keyPlayers: v.optional(v.array(v.string())),
  }))),
  
  // Sources
  dataSource: v.string(),
  reliability: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_year", ["year"])
  .index("by_region", ["region"]);

/**
 * Cultivation Records
 * Detailed cultivation experiences and data from growers
 */
const cultivationRecords = defineTable({
  fungusId: v.id("fungi"),
  
  // Grower Information
  growerType: v.string(), // commercial, research, hobbyist
  scale: v.string(), // small, medium, large
  location: v.optional(v.string()),
  
  // Growing Conditions
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
  
  // Timeline
  timeline: v.object({
    colonizationDays: v.optional(v.number()),
    fruitingDays: v.optional(v.number()),
    totalCycleDays: v.optional(v.number()),
  }),
  
  // Yield Data
  yieldData: v.object({
    freshWeight: v.optional(v.number()),
    dryWeight: v.optional(v.number()),
    biologicalEfficiency: v.optional(v.number()),
    flushCount: v.optional(v.number()),
  }),
  
  // Quality Assessment
  quality: v.optional(v.object({
    appearance: v.optional(v.string()),
    size: v.optional(v.string()),
    marketGrade: v.optional(v.string()),
  })),
  
  // Challenges & Solutions
  challenges: v.optional(v.array(v.object({
    issue: v.string(),
    solution: v.optional(v.string()),
    effectiveness: v.optional(v.string()),
  }))),
  
  // Economics
  economics: v.optional(v.object({
    setupCost: v.optional(v.number()),
    operatingCost: v.optional(v.number()),
    revenue: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    currency: v.string(),
  })),
  
  // Notes & Recommendations
  notes: v.optional(v.string()),
  recommendations: v.optional(v.array(v.string())),
  
  // Verification
  verified: v.optional(v.boolean()),
  dateRecorded: v.optional(v.number()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_scale", ["scale"]);

/**
 * Traditional Knowledge
 * Ethnomycological and indigenous knowledge
 */
const traditionalKnowledge = defineTable({
  fungusId: v.id("fungi"),
  
  // Cultural Context
  culture: v.string(),
  region: v.string(),
  indigenousName: v.optional(v.string()),
  language: v.optional(v.string()),
  
  // Knowledge Type
  knowledgeCategory: v.array(v.string()), // medicinal, culinary, ceremonial, ecological
  
  // Traditional Use
  uses: v.array(v.object({
    use: v.string(),
    preparation: v.optional(v.string()),
    application: v.optional(v.string()),
    seasonality: v.optional(v.string()),
  })),
  
  // Cultural Significance
  culturalSignificance: v.optional(v.string()),
  spiritualSignificance: v.optional(v.string()),
  ceremonies: v.optional(v.array(v.string())),
  
  // Knowledge Transmission
  knowledgeHolders: v.optional(v.string()),
  transmissionMethod: v.optional(v.string()),
  stillPracticed: v.optional(v.boolean()),
  
  // Documentation
  documentedBy: v.optional(v.string()),
  documentationDate: v.optional(v.number()),
  consent: v.optional(v.boolean()), // FPIC
  accessRestrictions: v.optional(v.string()),
  
  // Benefit Sharing
  benefitSharingAgreement: v.optional(v.boolean()),
  communityApproval: v.optional(v.boolean()),
  
  // Verification
  verificationStatus: v.optional(v.string()),
  reliability: v.optional(v.string()),
})
  .index("by_fungus", ["fungusId"])
  .index("by_culture", ["culture"]);

/**
 * Observations
 * Field observations from mycologists and citizen scientists
 */
const observations = defineTable({
  fungusId: v.id("fungi"),
  
  // Observer
  observerId: v.optional(v.string()),
  observerType: v.string(), // professional, amateur, citizen scientist
  
  // Location
  location: v.object({
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    region: v.string(),
    habitat: v.string(),
    substrate: v.optional(v.string()),
    elevation: v.optional(v.number()),
  }),
  
  // Timing
  observationDate: v.number(),
  season: v.string(),
  
  // Environmental Conditions
  conditions: v.optional(v.object({
    temperature: v.optional(v.number()),
    precipitation: v.optional(v.string()),
    humidity: v.optional(v.number()),
    recentWeather: v.optional(v.string()),
  })),
  
  // Observation Details
  abundance: v.optional(v.string()), // rare, occasional, common, abundant
  developmentStage: v.optional(v.string()), // button, young, mature, old
  associatedSpecies: v.optional(v.array(v.string())), // plants, other fungi
  
  // Photos
  photoUrls: v.optional(v.array(v.string())),
  
  // Notes
  notes: v.optional(v.string()),
  unusualFeatures: v.optional(v.string()),
  
  // Verification
  identificationConfidence: v.optional(v.string()), // low, medium, high
  expertVerified: v.optional(v.boolean()),
  verifiedBy: v.optional(v.string()),
  
  // Contribution
  publicObservation: v.optional(v.boolean()),
  contributeToCitizen: v.optional(v.boolean()), // contribute to citizen science
})
  .index("by_fungus", ["fungusId"])
  .index("by_date", ["observationDate"])
  .index("by_region", ["location.region"]);

/**
 * Semantic Relationships
 * Auto-computed relationships based on similarity
 */
const relationships = defineTable({
  sourceFungusId: v.id("fungi"),
  targetFungusId: v.id("fungi"),
  relationshipType: v.string(), // lookalike, same_habitat, same_family, similar_compounds, etc.
  strength: v.number(), // 0-1
  dimensions: v.array(v.string()), // which attributes drive this relationship
  metadata: v.optional(v.any()),
  computedAt: v.optional(v.number()),
})
  .index("by_source", ["sourceFungusId"])
  .index("by_target", ["targetFungusId"])
  .index("by_type", ["relationshipType"]);

/**
 * Search Tracking
 * Analytics for popular searches
 */
const searchTracking = defineTable({
  searchTerm: v.string(),
  count: v.number(),
  lastSearched: v.number(),
  resultCount: v.optional(v.number()),
})
  .index("by_term", ["searchTerm"])
  .index("by_count", ["count"]);

export default defineSchema({
  fungi,
  scientificPapers,
  climateImpact,
  economicData,
  cultivationRecords,
  traditionalKnowledge,
  observations,
  relationships,
  searchTracking,
});
