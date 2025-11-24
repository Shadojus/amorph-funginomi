
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This object matches the full fungi schema for Hericium erinaceus (Lion's Mane)
export const hericiumErinaceusSeed = {
  // ===== CORE IDENTITY =====
  commonName: "Lion's Mane",
  latinName: "Hericium erinaceus",
  scientificNameSynonyms: [
    "Hericium coralloides var. erinaceus",
    "Hydnum erinaceus"
  ],
  commonNameVariants: [
    "Bearded Tooth",
    "Monkey Head Mushroom",
    "Pom Pom Blanc",
    "Yamabushitake"
  ],
  seoName: "hericium-erinaceus",
  slug: "hericium-erinaceus",
  internationalNames: [
    { language: "Japanese", name: "ヤマブシタケ", script: "Kanji" },
    { language: "Chinese", name: "猴头菇", script: "Simplified" },
    { language: "French", name: "Hydne hérisson" }
  ],
  description: "Hericium erinaceus, commonly known as Lion's Mane, is a distinctive white, edible, and medicinal mushroom with cascading spines. It grows on hardwoods in temperate forests and is renowned for its neuroprotective and culinary properties.",
  imageUrl: "https://example.com/images/hericium_erinaceus_main.jpg",
  imageUrls: [
    "https://example.com/images/hericium_erinaceus_1.jpg",
    "https://example.com/images/hericium_erinaceus_2.jpg"
  ],

  // ===== VISUAL IDENTITY =====
  visualIdentity: {
    primaryImage: "https://example.com/images/hericium_erinaceus_main.jpg",
    imageGallery: [
      {
        url: "https://example.com/images/hericium_erinaceus_side.jpg",
        type: "side",
        viewAngle: "side",
        developmentStage: "mature",
        season: "autumn",
        photographer: "Jane Doe",
        license: "CC-BY-SA"
      }
    ],
    view360: {
      frames: [
        "https://example.com/360/frame1.jpg",
        "https://example.com/360/frame2.jpg"
      ],
      frameCount: 2,
      rotationAxis: "vertical"
    },
    colorPalette: [
      { hex: "#ffffff", name: "White", dominance: 0.9, location: "spines" },
      { hex: "#e5e5e5", name: "Off-white", dominance: 0.1, location: "base" }
    ],
    visualSignature: {
      shape: [1, 0.8, 0.6],
      texture: [0.9, 0.7, 0.2],
      color: [1, 0.95, 0.1]
    }
  },

  // ===== TAXONOMY =====
  taxonomy: {
    kingdom: "Fungi",
    phylum: "Basidiomycota",
    class: "Agaricomycetes",
    order: "Russulales",
    family: "Hericiaceae",
    genus: "Hericium",
    species: "erinaceus",
    subspecies: undefined,
    variety: undefined,
    forma: undefined,
    confidence: {
      level: 10,
      disputed: false,
      alternativeClassifications: []
    },
    phylogeny: {
      clade: "Hericium",
      sister_species: ["Hericium coralloides", "Hericium americanum"],
      divergence_time: 12000000,
      evolutionary_traits: ["toothed hymenophore", "wood decay"]
    }
  },

  // ===== MORPHOLOGY & PHYSICAL CHARACTERISTICS =====
  morphology: {
    shapeParameters: {
      cap: {
        profile: [{ x: 0, y: 0 }, { x: 1, y: 0.5 }],
        curvature: 0.2,
        symmetry: 1,
        irregularity: 0.1
      },
      stem: {
        taper: 0.1,
        curve: 0,
        hollowness: 0
      }
    },
    cap: {
      shape: ["globose", "irregular"],
      diameter: { min: 5, max: 25, typical: 15, unit: "cm" },
      thickness: { min: 2, max: 5, unit: "cm" },
      color: ["white", "cream"],
      texture: ["soft", "spiny"],
      margin: "irregular",
      surface: "dry",
      patterns: ["cascading spines"]
    },
    hymenophore: {
      type: "teeth",
      gillAttachment: undefined,
      gillSpacing: undefined,
      gillColor: undefined,
      poreSize: undefined,
      poreShape: undefined
    },
    stem: {
      height: { min: 2, max: 5, typical: 3, unit: "cm" },
      diameter: { min: 1, max: 3, typical: 2, unit: "cm" },
      color: ["white"],
      texture: "fibrous",
      base: "attached",
      ornamentation: []
    },
    veil: undefined,
    ring: undefined,
    volva: undefined,
    latex: undefined,
    staining: undefined,
    bioluminescence: undefined,
    biomass: {
      fresh_weight: { min: 100, max: 2000, unit: "g" },
      dry_weight: { min: 10, max: 200, unit: "g" },
      water_content: 0.92
    },
    microscopy: {
      spores: {
        printColor: "white",
        dimensions: {
          length: { min: 5, max: 7, unit: "µm" },
          width: { min: 4, max: 6, unit: "µm" }
        },
        shape: "ellipsoid",
        ornamentation: "smooth",
        color_in_mass: "white",
        density_per_mm2: 1200000,
        amyloid: false
      },
      basidia: {
        type: "clavate",
        sterigmata_count: 4,
        dimensions: { length: 25, width: 6 }
      },
      cystidia: {
        present: false,
        types: [],
        location: []
      },
      hyphae: {
        type: "monomitic",
        clamps: true,
        septa: "regular"
      }
    }
  },

  // ===== SENSORY PROFILE =====
  sensoryProfile: {
    aroma: {
      intensity: 6,
      notes: [
        { category: "mushroom", specific: "mild", strength: 4 },
        { category: "seafood", specific: "crab", strength: 2 }
      ],
      volatiles: [
        { compound: "octen-3-ol", concentration: 0.8, threshold: 0.1 }
      ],
      aromaEvolution: [
        { stage: "fresh", profile: ["mild", "sweet"] },
        { stage: "cooked", profile: ["seafood", "nutty"] }
      ]
    },
    taste: {
      basic_tastes: {
        sweet: 3,
        sour: 1,
        salty: 2,
        bitter: 0,
        umami: 7
      },
      flavor_notes: ["seafood", "nutty", "mild"],
      mouthfeel: ["tender", "juicy"],
      aftertaste: "slightly sweet",
      taste_timeline: [
        { seconds: 0, dominant_taste: "umami", intensity: 7 },
        { seconds: 5, dominant_taste: "sweet", intensity: 3 }
      ],
      raw_taste: "mild, slightly sweet",
      cooked_taste: "crab-like, savory"
    },
    texture: {
      firmness: 5,
      elasticity: 4,
      moisture: 8,
      roughness: 2,
      stickiness: 1,
      brittleness: 1,
      toughness: 2,
      texture_conditions: [
        {
          condition: "cooked",
          properties: { firmness: 4, elasticity: 3, moisture: 7 }
        }
      ]
    },
    sound: {
      spore_discharge: undefined,
      breaking_sound: "soft snap",
      cooking_sounds: ["sizzling"]
    }
  },

  // ===== SAFETY & IDENTIFICATION =====
  safetyAndIdentification: {
    edibility: "edible",
    edibilityScore: 10,
    toxicityLevel: "none",
    toxins: [],
    symptoms: [],
    treatmentInfo: undefined,
    antidote: undefined,
    lookalikeSpecies: [
      {
        species: "Hericium coralloides",
        scientificName: "Hericium coralloides",
        distinguishingFeatures: ["branched structure", "shorter spines"],
        toxicityDifference: "none",
        confusionRisk: 2
      }
    ],
    identificationDifficulty: "beginner",
    keyIdentificationFeatures: [
      "long cascading spines",
      "unbranched fruiting body",
      "white color"
    ],
    identificationSeasonality: ["late summer", "autumn"],
    microscopicFeaturesRequired: false,
    chemicalTestsRequired: false,
    chemicalTests: [],
    safetyWarnings: [],
    specialPrecautions: [],
    riskMatrix: {
      toxicity_risk: 0,
      misidentification_risk: 2,
      allergic_risk: 1,
      interaction_risk: 0,
      overall_safety: 9
    }
  },

  // ===== ECOLOGICAL NETWORK =====
  ecologicalNetwork: {
    trophicLevel: 2,
    ecologicalRole: ["saprotrophic"],
    habitat: ["deciduous forest", "hardwood logs"],
    substrate: ["wood"],
    substrateDetails: ["oak", "beech", "maple"],
    symbioticPartners: [],
    substratePreferences: [
      {
        substrate_type: "hardwood",
        preference_score: 9,
        specificity: "high",
        decomposition_rate: 0.8
      }
    ],
    competitors: [
      {
        species: "Trametes versicolor",
        competition_intensity: 5,
        resource_overlap: 0.7,
        outcome: "coexist"
      }
    ],
    facilitators: [
      {
        species: "wood-decay bacteria",
        facilitation_type: "substrate softening",
        effect_magnitude: 0.3
      }
    ],
    dispersalVectors: [
      {
        vector: "wind",
        effectiveness: 0.9,
        distance_class: "medium",
        seasonal_pattern: [0.8, 0.9, 0.7, 0.5]
      }
    ],
    ecosystemServices: [
      {
        service: "wood decomposition",
        importance: 9,
        scale: "local",
        beneficiaries: ["forest ecosystem"],
        economic_value: 1000
      }
    ],
    keystoneIndex: 5
  },

  // ===== TEMPORAL PATTERNS =====
  temporalPatterns: {
    lifeCycle: [
      {
        stage: "spore",
        duration_days: { min: 1, max: 7, typical: 3 },
        temperature_requirement: { min: 10, max: 30 },
        trigger_conditions: ["moisture", "wood substrate"],
        morphological_changes: ["germination"],
        icon: "spore_icon.png",
        color: "#e5e5e5"
      },
      {
        stage: "mycelium",
        duration_days: { min: 10, max: 30, typical: 20 },
        temperature_requirement: { min: 18, max: 24 },
        trigger_conditions: ["nutrient availability"],
        morphological_changes: ["hyphal growth"],
        icon: "mycelium_icon.png",
        color: "#cccccc"
      },
      {
        stage: "fruiting body",
        duration_days: { min: 7, max: 21, typical: 14 },
        temperature_requirement: { min: 16, max: 22 },
        trigger_conditions: ["humidity", "fresh air"],
        morphological_changes: ["spine formation"],
        icon: "fruiting_icon.png",
        color: "#ffffff"
      }
    ],
    seasonality: {
      primarySeason: ["late summer", "autumn"],
      peakMonths: ["September", "October"],
      year_round: false,
      monthly_activity: [
        { month: 8, fruiting_probability: 0.2, growth_rate: 0.3, spore_production: 0.1, visibility: 0.2 },
        { month: 9, fruiting_probability: 0.8, growth_rate: 0.9, spore_production: 0.7, visibility: 0.8 },
        { month: 10, fruiting_probability: 0.9, growth_rate: 1, spore_production: 0.9, visibility: 1 },
        { month: 11, fruiting_probability: 0.3, growth_rate: 0.4, spore_production: 0.2, visibility: 0.3 }
      ],
      climate_variations: [
        { zone: "temperate", pattern: [0, 0, 0, 0, 0, 0, 0, 0.2, 0.8, 1, 0.3, 0] }
      ]
    },
    circadianRhythm: {
      spore_release_pattern: [
        { hour: 6, intensity: 0.2 },
        { hour: 12, intensity: 0.7 },
        { hour: 18, intensity: 1 },
        { hour: 0, intensity: 0.1 }
      ],
      growth_pattern: [
        { hour: 0, rate: 0.1 },
        { hour: 12, rate: 0.3 }
      ],
      metabolic_activity: [
        { hour: 0, level: 0.2 },
        { hour: 12, level: 0.8 }
      ]
    },
    historicalTimeline: [
      { year: 1800, event: "First described in Europe", event_type: "taxonomy", significance: 7, location: "Europe" },
      { year: 1960, event: "Medicinal use documented in Asia", event_type: "medicine", significance: 8, location: "China" }
    ],
    projections: {
      climate_suitability: [
        { year: 2030, suitability_score: 0.95, scenario: "RCP4.5" },
        { year: 2050, suitability_score: 0.9, scenario: "RCP8.5" }
      ],
      habitat_availability: [
        { year: 2030, area_km2: 12000, change_percent: -5 },
        { year: 2050, area_km2: 11000, change_percent: -8 }
      ]
    },
    biodiversityTrend: [
      { year: 2000, abundance: 0.7, sightings: 50, source: "field survey" },
      { year: 2020, abundance: 0.8, sightings: 70, source: "citizen science" }
    ]
  },

  // ===== GEOGRAPHIC PATTERNS =====
  geographicPatterns: {
    distribution: {
      occurrences: [
        { lat: 35.7, lon: 139.7, date: 20220901, abundance: "common", verified: true, elevation_m: 200, habitat: "deciduous forest" },
        { lat: 48.8, lon: 2.3, date: 20221015, abundance: "occasional", verified: true, elevation_m: 50, habitat: "hardwood forest" }
      ],
      ranges: [
        { type: "native", polygon: [{ lat: 30, lon: 120 }, { lat: 50, lon: 10 }], status: "stable", quality: "high" }
      ],
      density: [
        { lat: 40, lon: 20, radius_km: 50, observations: 10, relative_abundance: 0.8 }
      ],
      bioregions: [
        { name: "Eastern North America", code: "ENA", presence: "present", abundance: "common" }
      ],
      elevationProfile: {
        min_m: 0,
        max_m: 1200,
        optimal_m: 400,
        distribution: [
          { elevation_m: 200, frequency: 0.5 },
          { elevation_m: 400, frequency: 1 }
        ]
      },
      migration: {
        dispersal_routes: [
          { from: { lat: 35, lon: 135 }, to: { lat: 40, lon: 140 }, strength: 0.7, mechanism: "wind" }
        ],
        colonization_history: [
          { year: 1900, location: "Japan", source: "native" }
        ]
      },
      continents: ["Asia", "Europe", "North America"],
      countries: ["Japan", "China", "France", "USA"],
      regions: ["Honshu", "Burgundy", "Appalachia"],
      endemic: false,
      invasive: false
    },
    climateEnvelope: {
      temperature: {
        min: 5,
        max: 30,
        optimal: 20,
        tolerance_range: 25,
        unit: "°C"
      },
      precipitation: {
        min_annual_mm: 600,
        max_annual_mm: 2000,
        optimal_annual_mm: 1200,
        seasonal_preference: "autumn"
      },
      humidity: {
        min_percent: 60,
        max_percent: 95,
        optimal_percent: 85
      },
      climateZones: ["temperate", "subtropical"],
      bioclim: [
        { variable: "BIO1", value: 12, importance: 0.8 }
      ]
    },
    abundance: "locally common",
    populationTrend: "stable"
  },

  // ===== CHEMICAL UNIVERSE =====
  chemicalUniverse: {
    primaryMetabolites: {
      macronutrients: [
        { nutrient: "protein", amount_g_per_100g: 2.4, calories: 10 },
        { nutrient: "carbohydrate", amount_g_per_100g: 3.6, calories: 14 },
        { nutrient: "fat", amount_g_per_100g: 0.2, calories: 2 }
      ],
      aminoAcids: [
        { name: "lysine", amount_mg_per_g: 12, essential: true, limiting: false },
        { name: "methionine", amount_mg_per_g: 2, essential: true, limiting: true }
      ],
      fattyAcids: [
        { name: "linoleic acid", type: "PUFA", amount_mg_per_g: 1.2, omega_class: "omega-6" }
      ],
      micronutrients: [
        { name: "potassium", amount: 300, unit: "mg", dv_percent: 6, bioavailability: 0.8 },
        { name: "vitamin D2", amount: 1.5, unit: "µg", dv_percent: 15 }
      ]
    },
    secondaryMetabolites: {
      compounds: [
        {
          name: "erinacine A",
          iupac_name: "N/A",
          formula: "C27H40O8",
          smiles: "N/A",
          class: "diterpene",
          subclass: "cyathane",
          concentration: { value: 0.05, unit: "mg/g", variance: 0.01, location: "fruiting body" },
          bioactivity: ["NGF synthesis", "neuroprotection"],
          targets: ["nerve growth factor"],
          function: "stimulates NGF",
          toxicity: { ld50: undefined, toxic_dose: undefined, mechanism: undefined }
        }
      ],
      pathways: [
        {
          name: "cyathane diterpene biosynthesis",
          type: "secondary",
          precursors: ["acetyl-CoA"],
          intermediates: ["cyathane skeleton"],
          products: ["erinacines"],
          enzymes: ["cyathane synthase"],
          regulation: "substrate-induced"
        }
      ],
      fingerprint: {
        terpene_score: 8,
        alkaloid_score: 0,
        phenolic_score: 2,
        polysaccharide_score: 7,
        peptide_score: 1,
        unique_compounds: 12
      }
    },
    enzymeActivity: [
      {
        enzyme: "laccase",
        activity: "high",
        substrate: "lignin",
        applications: ["bioremediation"],
        ec_number: "1.10.3.2"
      }
    ],
    pigments: [
      { name: "hericenone pigment", color: "white", chemicalClass: "phenol", location: "spines", wavelength_nm: 420 }
    ],
    antioxidantCapacity: {
      oracScore: 1200,
      dpphValue: 0.8,
      teacValue: 0.7,
      frapValue: 0.6,
      notes: "High antioxidant activity"
    },
    antimicrobialActivity: [
      { targetOrganism: "Staphylococcus aureus", activity: "moderate", minimumInhibitoryConcentration: "1 mg/ml", zone_of_inhibition_mm: 12 }
    ],
    heavyMetals: {
      bioaccumulation: false,
      concernedMetals: [
        { metal: "lead", concentration_ppm: 0.01, safety_limit_ppm: 0.1 }
      ],
      safetyConsiderations: "Generally safe"
    },
    volatilome: {
      total_vocs: 15,
      major_components: [
        { compound: "octen-3-ol", percent_of_total: 0.3, aroma_descriptor: "mushroom", threshold_ppb: 1 }
      ],
      aroma_profile: [
        { category: "mushroom", intensity: 7, compounds: ["octen-3-ol"] }
      ],
      evolution: [
        { time_hours: 0, profile_change: [{ compound: "octen-3-ol", relative_amount: 1 }] }
      ]
    }
  },

  // ===== CULTIVATION INTELLIGENCE =====
  cultivationIntelligence: {
    cultivable: true,
    cultivationDifficulty: "moderate",
    commerciallyViable: true,
    homeGrowingViable: true,
    difficultyMatrix: {
      overall: 5,
      factors: [
        { factor: "sterility", difficulty: 6, critical: true, solutions: ["HEPA filter"] },
        { factor: "humidity", difficulty: 4, critical: true }
      ]
    },
    growthParameters: {
      temperature: {
        colonization: { min: 20, max: 24, optimal: 22 },
        fruiting: { min: 16, max: 20, optimal: 18 },
        storage: { min: 2, max: 8, optimal: 4 },
        unit: "°C"
      },
      humidity: {
        colonization: { min: 70, max: 80, optimal: 75 },
        fruiting: { min: 85, max: 95, optimal: 90 }
      },
      co2: {
        colonization: { min: 1000, max: 5000, optimal: 2000 },
        fruiting: { min: 400, max: 1000, optimal: 600 },
        unit: "ppm"
      },
      light: {
        intensity_lux: { min: 200, max: 1000 },
        photoperiod_hours: { min: 8, max: 12 },
        spectrum: ["white", "blue"],
        colonization_requirement: "dark",
        fruiting_requirement: "indirect light"
      },
      pH: {
        substrate: { min: 5.5, max: 6.5, optimal: 6 },
        casing: { min: 6, max: 7, optimal: 6.5 }
      }
    },
    substrateMatrix: [
      {
        substrate: "hardwood sawdust",
        suitability: 9,
        yield_potential: 8,
        colonization_speed: 7,
        contamination_risk: 5,
        cost_effectiveness: 7,
        sustainability: 8,
        preparation_method: "sterilized"
      }
    ],
    substrateFormulations: [
      {
        name: "standard sawdust mix",
        ingredients: [
          { ingredient: "oak sawdust", percentage: 80 },
          { ingredient: "wheat bran", percentage: 20 }
        ],
        supplementation: "gypsum",
        notes: "Common for commercial production"
      }
    ],
    nutritionalSupplements: ["wheat bran", "gypsum"],
    nitrogenRequirements: "moderate",
    carbonToNitrogenRatio: "30:1",
    productionCycle: [
      {
        phase: "spawn run",
        day_start: 0,
        day_end: 14,
        tasks: ["inoculation", "incubation"],
        critical_parameters: ["temperature", "humidity"],
        checkpoint_criteria: ["full colonization"],
        common_issues: ["contamination"]
      },
      {
        phase: "fruiting",
        day_start: 15,
        day_end: 28,
        tasks: ["ventilation", "humidity control"],
        critical_parameters: ["CO2", "light"],
        checkpoint_criteria: ["primordia formation"],
        common_issues: ["drying"]
      }
    ],
    cultivationTimeline: [
      { dayOffset: 0, stage: "inoculation", label: "Start", description: "Introduce spawn", temperature: 22, humidity: 75, milestone: true },
      { dayOffset: 14, stage: "fruiting", label: "Fruiting", description: "Move to fruiting chamber", temperature: 18, humidity: 90, milestone: true }
    ],
    timeToColonization: { min: 10, max: 20, unit: "days" },
    timeToFruiting: { min: 7, max: 14, unit: "days" },
    totalCycleTime: { min: 21, max: 35, unit: "days" },
    flushes: { number: 2, timeBetweenFlushes: 7, yieldDeclinePattern: "linear" },
    yieldModel: {
      base_yield_g_per_kg: 800,
      biologicalEfficiency: { min: 60, max: 90, unit: "%" },
      flushes: [
        { number: 1, yield_percent: 70, days_after_first: 0 },
        { number: 2, yield_percent: 30, days_after_first: 7 }
      ],
      factors: [
        { factor: "substrate", impact: 0.8, optimal_value: 8 },
        { factor: "humidity", impact: 0.7, optimal_value: 90 }
      ],
      economics: {
        setup_cost: 500,
        operating_cost_per_kg: 2,
        market_price_per_kg: 15,
        roi_months: 6,
        break_even_kg: 100,
        currency: "USD"
      }
    },
    cultivationMethods: ["bag culture", "log culture"],
    propagationMethods: ["tissue culture", "spore print"],
    sterilizationRequired: true,
    pasteurizationSufficient: false,
    indoorSuitability: true,
    outdoorSuitability: true,
    greenhouseSuitability: true,
    basementGrowingSuitability: true,
    commonPests: ["fungus gnats"],
    commonDiseases: ["green mold"],
    commonContaminants: ["Trichoderma"],
    contaminationSusceptibility: "moderate",
    harvestTiming: {
      indicators: ["spines >1cm", "white color"],
      optimalStage: "young mature",
      timingCritical: true
    },
    harvestMethod: "cut at base",
    postHarvestHandling: ["cooling", "drying"],
    processingMethods: ["drying", "freezing", "powdering"],
    shelfLife: {
      fresh: { duration: 7, unit: "days", conditions: "refrigerated" },
      dried: { duration: 180, unit: "days", conditions: "airtight" },
      frozen: { duration: 365, unit: "days", conditions: "below -18°C" }
    },
    specialEquipment: ["laminar flow hood"],
    certifications: ["organic"],
    regulatoryConsiderations: ["food safety"],
    laborRequirements: "moderate",
    skillLevel: "intermediate",
    strainComparison: [
      {
        strain_name: "HE-01",
        origin: "Japan",
        characteristics: {
          yield_index: 8,
          growth_speed: 7,
          contamination_resistance: 6,
          temperature_tolerance: 8,
          shelf_life: 7,
          flavor_quality: 9
        },
        optimal_conditions: undefined
      }
    ],
    growthMetrics: {
      colonizationProgress: 1,
      fruitingProgress: 1,
      yieldProgress: 0.8,
      qualityScore: 9
    },
    cultivationMetrics: [
      { strainName: "HE-01", yieldKg: 1.2, cycleTimeDays: 28, contaminationRate: 0.05, profitability: 0.7 }
    ]
  },

  // ===== MEDICINAL INTELLIGENCE =====
  medicinalIntelligence: {
    therapeuticProfile: [
      {
        category: "nootropic",
        strength: 8,
        evidence_level: "clinical",
        mechanisms: ["NGF stimulation"],
        active_compounds: ["erinacine A", "hericenone B"]
      },
      {
        category: "anti-inflammatory",
        strength: 6,
        evidence_level: "preclinical",
        mechanisms: ["cytokine modulation"],
        active_compounds: ["hericenone C"]
      }
    ],
    medicinalProperties: [
      {
        property: "neuroprotective",
        evidence: "clinical",
        activeCompounds: ["erinacine A"],
        mechanism: "NGF upregulation",
        strength: "strong"
      }
    ],
    clinicalEvidence: [
      {
        condition: "mild cognitive impairment",
        evidence_type: "randomized controlled trial",
        sample_size: 30,
        effect_size: 0.4,
        p_value: 0.03,
        year: 2009,
        dosage: "3g/day",
        duration: "16 weeks",
        adverse_events: [],
        results: "Improved cognitive function",
        status: "published"
      }
    ],
    bioactivitySpectrum: {
      antibacterial: 3,
      antiviral: 2,
      antifungal: 2,
      antiparasitic: 1,
      anticancer: 4,
      immunomodulatory: 6,
      anti_inflammatory: 6,
      antioxidant: 7,
      neuroprotective: 9,
      hepatoprotective: 3,
      cardioprotective: 2,
      antidiabetic: 3,
      adaptogenic: 2,
      anxiolytic: 4,
      analgesic: 2
    },
    molecularTargets: [
      {
        target: "nerve growth factor receptor",
        interaction_type: "agonist",
        affinity: 0.8,
        selectivity: 0.9,
        validated: true
      }
    ],
    traditionalMedicine: [
      {
        system: "Traditional Chinese Medicine",
        name: "Houtougu",
        uses: ["digestive health", "general tonic"],
        preparation: "decoction",
        contraindications: ["allergy"],
        cultural_significance: 8,
        still_practiced: true
      }
    ],
    dosageRecommendations: [
      {
        form: "dried powder",
        amount: "1-3g",
        frequency: "daily",
        duration: "up to 16 weeks",
        notes: "Consult physician"
      }
    ],
    contraindications: ["mushroom allergy"],
    interactions: [
      { substance: "anticoagulants", effect: "may increase bleeding risk", severity: "moderate" }
    ],
    sideEffects: ["mild digestive upset"],
    pregnancyWarning: true,
    childrenWarning: false,
    regulatoryStatus: [
      { region: "USA", status: "dietary supplement", notes: "GRAS" }
    ],
    preparations: [
      {
        form: "extract",
        extraction_method: "hot water",
        concentration: "10:1",
        standardization: "erinacine A",
        bioavailability: 0.7,
        shelf_life_months: 24
      }
    ]
  },

  // ===== CULINARY DIMENSIONS =====
  culinaryDimensions: {
    flavorWheel: {
      primary: [
        { category: "umami", intensity: 8, descriptors: ["savory", "meaty"] },
        { category: "sweet", intensity: 3, descriptors: ["mild", "nutty"] }
      ],
      secondary: [
        { note: "seafood", intensity: 4, develops_with: "cooking" }
      ],
      comparison: [
        { similar_to: "crab", similarity_score: 0.7 }
      ]
    },
    flavorProfile: ["mild", "seafood", "nutty"],
    flavorIntensity: "medium",
    aromatic: true,
    aromaticProfile: ["mushroom", "sweet"],
    textureEvolution: [
      {
        state: "raw",
        texture_descriptors: ["spongy", "tender"],
        moisture_percent: 92,
        firmness: 5,
        optimal_for: ["salads"]
      },
      {
        state: "cooked",
        texture_descriptors: ["meaty", "juicy"],
        moisture_percent: 80,
        firmness: 6,
        optimal_for: ["stir-fry", "grilling"]
      }
    ],
    culinaryUses: ["sautéed", "soups", "tempura"],
    cuisineTypes: ["Japanese", "Chinese", "French"],
    preparationMethods: [
      {
        method: "sauté",
        temperature: { min: 160, max: 180 },
        duration_minutes: { min: 5, max: 10 },
        yield_percent: 90,
        nutrient_retention: { vitamins: 0.8, minerals: 0.9, antioxidants: 0.85 },
        flavor_development: ["umami", "nutty"],
        texture_change: "firmer",
        notes: "Do not overcook"
      }
    ],
    preparationRequirements: ["clean gently", "do not soak"],
    pairingNetwork: [
      {
        ingredient: "butter",
        affinity: 0.9,
        pairing_type: "complementary",
        shared_compounds: ["octen-3-ol"],
        cuisine_origin: ["French"],
        dishes: ["sautéed Lion's Mane"]
      }
    ],
    complementaryIngredients: ["garlic", "soy sauce", "lemon"],
    seasoningRecommendations: ["salt", "pepper", "parsley"],
    nutritionalDensity: {
      caloric_density: 35,
      protein_quality: 7,
      vitamin_density: 6,
      mineral_density: 7,
      fiber_content: 2,
      water_content: 92,
      ratios: {
        protein_to_carb: 0.7,
        omega6_to_omega3: 5,
        sodium_to_potassium: 0.02
      }
    },
    nutritionalValue: {
      calories: 35,
      protein: 2.4,
      carbohydrates: 3.6,
      fiber: 2,
      fat: 0.2,
      water: 92,
      vitamins: [
        { name: "Vitamin D2", amount: 1.5, unit: "µg", dailyValuePercentage: 15 }
      ],
      minerals: [
        { name: "Potassium", amount: 300, unit: "mg", dailyValuePercentage: 6 }
      ],
      aminoAcids: [
        { name: "lysine", amount: 12, unit: "mg" }
      ],
      otherNutrients: [
        { name: "beta-glucans", amount: 0.5, unit: "g" }
      ]
    },
    nutritionalProfile: [
      { axis: "protein", value: 2.4, unit: "g", rawValue: 2.4 }
    ],
    antioxidants: ["ergothioneine"],
    bioactiveCompounds: ["erinacine A", "hericenone B"],
    prebioticProperties: true,
    probioticProperties: false,
    healthBenefits: ["cognitive support", "immune support"],
    dietaryConsiderations: ["vegan", "gluten-free"],
    allergenInfo: [],
    storageRecommendations: {
      fresh: { temperature: "4°C", humidity: "high", duration: "7 days", container: "paper bag" },
      dried: { temperature: "room temp", humidity: "low", duration: "6 months", container: "airtight" },
      frozen: { temperature: "-18°C", duration: "1 year", preparation: "blanch before freezing" }
    },
    culinaryTraditions: [
      {
        culture: "Chinese",
        dishes: ["Lion's Mane soup"],
        preparation_style: "stewed",
        seasonal_use: "autumn",
        symbolic_meaning: "longevity",
        popularity: 8
      }
    ],
    recipeSuitability: ["soup", "stir-fry", "grill"],
    compoundDistribution: [
      { category: "protein", percentage: 7, grams: 2.4 },
      { category: "carbohydrate", percentage: 10, grams: 3.6 }
    ]
  },

  // ===== ENVIRONMENTAL INTELLIGENCE =====
  environmentalIntelligence: {
    carbonDynamics: {
      sequestration_rate: 0.2,
      biomass_carbon: 0.1,
      soil_carbon_impact: 0.05,
      lifecycle_emissions: 0.01,
      carbon_efficiency: 0.8
    },
    bioremediationPotential: {
      heavy_metals: [
        { metal: "lead", accumulation_factor: 0.1, tolerance_ppm: 0.2 }
      ],
      organic_pollutants: [
        { pollutant: "phenol", degradation_rate: 0.5, metabolites: ["catechol"] }
      ],
      applications: ["wood waste remediation"]
    },
    climateResilience: {
      temperature_tolerance: 7,
      drought_tolerance: 4,
      flood_tolerance: 3,
      adaptation_potential: 6,
      migration_capacity: 5,
      vulnerability: "moderate",
      adaptability: "good",
      rangeShift: "northward",
      phenologyShift: "earlier fruiting",
      scenarios: [
        { scenario: "RCP4.5", year: 2050, suitability_change: -0.1, range_shift_km: 100 }
      ]
    },
    biodiversityRole: {
      species_associations: 10,
      keystone_index: 5,
      rarity_index: 2,
      endemism_index: 1,
      functional_uniqueness: 8,
      conservation_priority: 4
    },
    conservationStatus: {
      iucnStatus: "Least Concern",
      nationalStatus: [
        { country: "Japan", status: "protected", year: 2010 }
      ],
      redListStatus: "not listed"
    },
    threats: [
      { threat: "habitat loss", severity: "moderate", trend: "increasing" }
    ],
    protectionMeasures: ["habitat conservation"],
    protectedAreas: ["Shimane Forest"],
    environmentalImpact: {
      carbonSequestration: "moderate",
      soilHealth: "improves",
      waterCycle: "neutral",
      biodiversity: "supports"
    },
    sustainabilityRating: "high",
    sustainableHarvestingGuidelines: ["harvest mature specimens only"]
  },

  // ===== ECONOMIC DIMENSIONS =====
  economicDimensions: {
    marketDynamics: {
      commercialValue: "high",
      marketDemand: "increasing",
      current_price: {
        wholesale: 10,
        retail: 15,
        premium: 25,
        currency: "USD",
        unit: "kg"
      },
      priceRange: {
        fresh: { min: 8, max: 20, currency: "USD", unit: "kg" },
        dried: { min: 40, max: 80, currency: "USD", unit: "kg" },
        extract: { min: 100, max: 300, currency: "USD", unit: "kg" }
      },
      price_history: [
        { year: 2020, price: 12, volume: 100, market: "USA", currency: "USD", marketSegment: "fresh" }
      ],
      price_volatility: 0.2,
      seasonal_pattern: [
        { month: 9, relative_price: 1 },
        { month: 10, relative_price: 1.1 }
      ],
      segments: [
        { segment: "fresh", share_percent: 60, growth_rate: 0.1, value_usd: 6000000 },
        { segment: "extract", share_percent: 30, growth_rate: 0.15, value_usd: 3000000 }
      ],
      marketSegments: ["fresh", "dried", "extract"],
      commercialProducts: ["capsules", "powder", "fresh mushroom"],
      industryApplications: ["nutraceuticals", "functional foods"]
    },
    supplyChain: {
      production_regions: [
        { region: "China", production_tons: 5000, export_percent: 80 }
      ],
      majorProducers: ["China", "USA"],
      majorConsumers: ["Japan", "USA"],
      trade_flows: [
        { from: "China", to: "USA", volume_tons: 2000, value_usd: 20000000 }
      ],
      value_addition: [
        { stage: "processing", value_multiplier: 2, loss_percent: 10 }
      ],
      tradeVolume: { global: "7000 tons", trend: "increasing" }
    },
    economicIndicators: {
      market_size_usd: 10000000,
      growth_rate_percent: 12,
      employment: 5000,
      roi: 0.3,
      payback_period_months: 12,
      value_per_hectare: 20000,
      investmentPotential: "high",
      barrierToEntry: ["sterility", "market access"]
    },
    certifications: ["organic", "GAP"],
    qualityStandards: ["ISO 22000"]
  },

  // ===== CULTURAL DIMENSIONS =====
  culturalDimensions: {
    culturalSignificance: [
      {
        culture: "Chinese",
        significance_type: "medicinal",
        importance: 9,
        time_period: "modern",
        practices: ["tonic", "cognitive health"],
        symbols: ["longevity"],
        stories: ["used by monks"],
        region: "China",
        stillPracticed: true
      }
    ],
    historicalSignificance: "Used in traditional medicine for centuries.",
    firstDocumented: "Tang Dynasty",
    namingHistory: "Named for its resemblance to a lion's mane.",
    folklore: [
      { culture: "Japanese", story: "Monks ate it for focus", symbolism: "wisdom" }
    ],
    religiousSignificance: [
      { religion: "Buddhism", role: "monastic food", practices: ["meditation support"] }
    ],
    ceremonialUse: [
      { ceremony: "longevity festival", culture: "Chinese", purpose: "health blessing" }
    ],
    etymology: {
      name_origin: "Latin",
      language_family: "Indo-European",
      historical_names: [
        { name: "Houtougu", language: "Chinese", period: "ancient", meaning: "monkey head" }
      ],
      linguistic_connections: ["hericius (Latin: hedgehog)"]
    },
    indigenousNames: [
      { language: "Japanese", name: "Yamabushitake", meaning: "mountain monk mushroom", culture: "Japanese" }
    ],
    culturalReferences: [
      { type: "literature", work: "Materia Medica", creator: "Li Shizhen", year: 1596, period: "Ming", title: "Bencao Gangmu", significance: "medicinal use", image_url: undefined }
    ],
    traditionalKnowledge: "Used for digestive and cognitive health.",
    knowledgeHolders: ["monks", "herbalists"]
  },

  // ===== RESEARCH & INNOVATION =====
  researchAndInnovation: {
    researchInterest: "high",
    activeResearchAreas: ["neuroprotection", "immunomodulation"],
    biotechnologyPotential: {
      overall: "good",
      areas: ["enzyme production", "bioremediation"]
    },
    innovativeApplications: [
      { application: "mycelium-based packaging", field: "biomaterials", developmentStage: "pilot", potential: "high" }
    ],
    patentedTechnologies: [
      { technology: "NGF-enhancing extract", patentNumber: "US1234567", holder: "BioLion Inc.", year: 2018 }
    ],
    genomicData: {
      sequenced: true,
      genomeSize: "39 Mb",
      geneCount: 12000,
      accessionNumber: "GCA_000123456.1"
    },
    modelOrganism: false,
    researchTools: ["genome", "transcriptome"],
    researchActivity: [
      { year: 2020, publications: 50, patents: 2, clinicalTrials: 1, citations: 300 }
    ],
    researchMetrics: {
      publication_count: 200,
      citation_count: 5000,
      h_index: 35,
      research_trend: "increasing",
      hot_topics: ["NGF", "cognition", "extracts"],
      funding_usd: 2000000
    }
  },

  // ===== INTERACTION MATRICES =====
  interactionMatrices: {
    speciesInteractions: [
      {
        species: "Hericium coralloides",
        interaction_type: "competition",
        strength: 0.5,
        mechanism: "substrate overlap",
        evidence: "field observation",
        reciprocal: true
      }
    ],
    compoundSynergies: [
      {
        compound1: "erinacine A",
        compound2: "hericenone B",
        effect_type: "synergistic",
        magnitude: 0.8,
        biological_target: "NGF"
      }
    ],
    environmentalResponses: [
      {
        factor1: "temperature",
        factor2: "humidity",
        response_matrix: [[0.5, 0.7], [0.8, 1]],
        optimal_point: { x: 18, y: 90 }
      }
    ]
  },

  // ===== RATINGS & SCORES =====
  ratings: {
    flavorIntensity: 7,
    cultivationDifficulty: 5,
    medicinalPotency: 8,
    nutritionalValue: 7,
    commercialViability: 8,
    researchInterest: 9,
    conservationPriority: 4,
    beginnerFriendly: 7,
    overallQuality: 8,
    rarityScore: 3,
    sustainabilityScore: 8
  },

  completenessScores: {
    physicalCharacteristics: 1,
    cultivation: 1,
    medicinal: 1,
    culinary: 1,
    ecological: 1,
    cultural: 1,
    chemical: 1,
    commercial: 1,
    overall: 1
  },

  // ===== KNOWLEDGE CONNECTIONS =====
  knowledgeConnections: {
    relatedSpecies: [
      {
        species: "Hericium coralloides",
        relationship: "close relative",
        similarity: 0.8,
        shared_features: ["toothed hymenophore", "white color"]
      }
    ],
    crossReferences: [
      { type: "paper", reference_id: "doi:10.1000/xyz123", relevance: 0.9 }
    ],
    tags: ["edible", "medicinal", "saprotrophic", "temperate"],
    ontologies: [
      { ontology: "NCBI", id: "12345", uri: "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=12345" }
    ]
  },

  // ===== META INFORMATION =====
  metaInfo: {
    dataQuality: {
      completeness: 1,
      accuracy_confidence: 0.99,
      last_updated: 20240601,
      update_frequency: "annual",
      verification_status: "verified",
      data_sources: ["MycoBank", "PubMed", "field survey"],
      dataQuality: "high"
    },
    engagement: {
      views: 1000,
      bookmarks: 200,
      contributions: 10,
      quality_ratings: [
        { aspect: "accuracy", rating: 5, count: 20 },
        { aspect: "completeness", rating: 4, count: 15 }
      ]
    },
    sources: [
      { type: "database", citation: "MycoBank", url: "https://www.mycobank.org", accessedDate: "2024-06-01", reliability: "high" }
    ],
    contributors: [
      { name: "Jane Doe", role: "mycologist", date: 20240601 }
    ],
    reviewStatus: {
      status: "peer reviewed",
      reviewer: "Dr. John Smith",
      reviewDate: 20240601,
      notes: "All data verified"
    },
    createdAt: 20240601,
    updatedAt: 20240601,
    verified: true,
    isPublic: true
  }

};

export default mutation(async ({ db }) => {
  console.log("🍄 Seeding Hericium erinaceus...");
  await db.insert("fungi", hericiumErinaceusSeed);
});
