/**
 * Example Seed: Amanita muscaria (Fly Agaric)
 * Demonstrating the full holistic schema with rich visualization data
 */

import { api } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    const Amanita_muscaria = {
      // ===== CORE IDENTITY =====
      commonName: "Fly Agaric",
      latinName: "Amanita muscaria",
      scientificNameSynonyms: ["Agaricus muscarius", "Venenarius muscarius"],
      commonNameVariants: ["Fly Amanita", "Fliegenpilz", "Tue-mouche", "Мухомор"],
      seoName: "fly-agaric",
      slug: "fly-agaric",
      
      internationalNames: [
        { language: "German", name: "Fliegenpilz", script: "latin" },
        { language: "Russian", name: "Мухомор", script: "cyrillic" },
        { language: "Japanese", name: "ベニテングタケ", script: "japanese" },
        { language: "Chinese", name: "毒蝇伞", script: "chinese" },
      ],
      
      // ===== VISUAL IDENTITY =====
      visualIdentity: {
        primaryImage: "/images/fungi/fly-agaric.jpg",
        
        imageGallery: [
          {
            url: "/images/amanita-muscaria-top.jpg",
            type: "photograph",
            viewAngle: "top",
            developmentStage: "mature",
            season: "autumn",
            photographer: "John Smith",
            license: "CC BY-SA 4.0"
          },
          {
            url: "/images/amanita-muscaria-young.jpg",
            type: "photograph",
            viewAngle: "side",
            developmentStage: "young",
            season: "summer"
          }
        ],
        
        view360: {
          frames: Array(36).fill(0).map((_, i) => `/images/360/amanita-${i * 10}.jpg`),
          frameCount: 36,
          rotationAxis: "vertical"
        },
        
        colorPalette: [
          { hex: "#DC143C", name: "Crimson Cap", dominance: 45, location: "cap" },
          { hex: "#FFFFFF", name: "White Spots", dominance: 15, location: "cap" },
          { hex: "#F5F5DC", name: "Beige Stem", dominance: 25, location: "stem" },
          { hex: "#FFFAF0", name: "Floral White", dominance: 15, location: "gills" }
        ],
        
        visualSignature: {
          shape: [0.9, 0.85, 0.3, 0.7, 0.2], // roundness, symmetry, complexity, regularity, uniqueness
          texture: [0.7, 0.9, 0.8, 0.6], // smoothness, pattern regularity, contrast, detail
          color: [0, 50, 80] // LAB color space coordinates
        }
      },
      
      // ===== TAXONOMY =====
      taxonomy: {
        kingdom: "Fungi",
        phylum: "Basidiomycota",
        class: "Agaricomycetes",
        order: "Agaricales",
        family: "Amanitaceae",
        genus: "Amanita",
        species: "muscaria",
        variety: "var. muscaria",
        
        confidence: {
          level: 98,
          disputed: false,
          alternativeClassifications: []
        },
        
        phylogeny: {
          clade: "Pluteoid clade",
          sister_species: ["Amanita pantherina", "Amanita regalis"],
          divergence_time: 23, // million years ago
          evolutionary_traits: ["Ectomycorrhizal", "Toxin production", "Spore dispersal"]
        }
      },
      
      // ===== MORPHOLOGY =====
      morphology: {
        shapeParameters: {
          cap: {
            profile: [
              {x: 0, y: 0}, {x: 10, y: 2}, {x: 20, y: 5}, 
              {x: 30, y: 7}, {x: 40, y: 8}, {x: 50, y: 8}
            ],
            curvature: 0.7, // Convex
            symmetry: 0.9,
            irregularity: 0.2
          },
          stem: {
            taper: 0.3, // Slightly bulbous base
            curve: 0.1, // Nearly straight
            hollowness: 0.0 // Solid
          }
        },
        
        dimensions: {
          cap: {
            diameter: { min: 8, max: 20, typical: 15, unit: "cm" },
            thickness: { min: 1, max: 3, unit: "cm" }
          },
          stem: {
            height: { min: 8, max: 25, typical: 15, unit: "cm" },
            diameter: { min: 1, max: 2.5, typical: 2, unit: "cm" }
          },
          biomass: {
            fresh_weight: { min: 50, max: 300, unit: "g" },
            dry_weight: { min: 5, max: 30, unit: "g" },
            water_content: 90
          }
        },
        
        surfaces: {
          cap: {
            texture: ["smooth", "slightly viscid"],
            patterns: ["spotted", "concentric zones"],
            moisture: "moist"
          },
          stem: {
            texture: ["smooth", "slightly scaly"],
            ornamentation: ["ring", "volva remnants"]
          }
        },
        
        microscopy: {
          spores: {
            dimensions: {
              length: { min: 9, max: 13, unit: "μm" },
              width: { min: 6.5, max: 9, unit: "μm" }
            },
            shape: "ellipsoid",
            ornamentation: "smooth",
            color_in_mass: "white",
            density_per_mm2: 40000
          },
          basidia: {
            type: "clavate",
            sterigmata_count: 4
          },
          cystidia: {
            present: true,
            types: ["pleurocystidia", "cheilocystidia"]
          }
        }
      },
      
      // ===== SENSORY PROFILE =====
      sensoryProfile: {
        aroma: {
          intensity: 3,
          notes: [
            { category: "earthy", specific: "soil", strength: 5 },
            { category: "metallic", specific: "iron", strength: 2 },
            { category: "fungal", specific: "mushroom", strength: 7 }
          ],
          volatiles: [
            { compound: "1-octen-3-ol", concentration: 12.5, threshold: 0.01 },
            { compound: "geosmin", concentration: 0.5, threshold: 0.001 }
          ],
          aromaEvolution: [
            { stage: "fresh", profile: ["earthy", "metallic"] },
            { stage: "dried", profile: ["musty", "hay-like"] },
            { stage: "cooked", profile: ["umami", "nutty"] }
          ]
        },
        
        taste: {
          basic_tastes: {
            sweet: 1,
            sour: 2,
            salty: 1,
            bitter: 6,
            umami: 3
          },
          flavor_notes: ["metallic", "acrid", "slightly nutty"],
          mouthfeel: ["firm", "slightly fibrous"],
          aftertaste: "lingering bitterness",
          taste_timeline: [
            { seconds: 0, dominant_taste: "umami", intensity: 3 },
            { seconds: 5, dominant_taste: "bitter", intensity: 6 },
            { seconds: 30, dominant_taste: "metallic", intensity: 4 }
          ]
        },
        
        texture: {
          firmness: 6,
          elasticity: 4,
          moisture: 7,
          roughness: 2,
          stickiness: 3,
          texture_conditions: [
            {
              condition: "fresh",
              properties: { firmness: 6, elasticity: 4, moisture: 7 }
            },
            {
              condition: "cooked",
              properties: { firmness: 3, elasticity: 2, moisture: 8 }
            },
            {
              condition: "dried",
              properties: { firmness: 8, elasticity: 1, moisture: 1 }
            }
          ]
        },
        
        sound: {
          breaking_sound: "crisp snap",
          cooking_sounds: ["gentle sizzling", "moisture release"]
        }
      },
      
      // ===== ECOLOGICAL NETWORK =====
      ecologicalNetwork: {
        trophicLevel: 2,
        
        symbioticPartners: [
          {
            partner_type: "plant",
            partner_species: "Betula pendula",
            relationship_type: "mutualistic",
            interaction_strength: 9,
            bidirectional: true,
            seasonal: false,
            benefits_given: ["nutrients", "water", "pathogen protection"],
            benefits_received: ["carbohydrates", "vitamins"],
            network_centrality: 0.85
          },
          {
            partner_type: "plant",
            partner_species: "Picea abies",
            relationship_type: "mutualistic",
            interaction_strength: 8,
            bidirectional: true,
            seasonal: false,
            benefits_given: ["phosphorus", "nitrogen"],
            benefits_received: ["sugars"],
            network_centrality: 0.75
          }
        ],
        
        substratePreferences: [
          {
            substrate_type: "forest_soil",
            preference_score: 10,
            specificity: "preferential",
            decomposition_rate: 2.5
          },
          {
            substrate_type: "acidic_soil",
            preference_score: 8,
            specificity: "preferential"
          }
        ],
        
        competitors: [
          {
            species: "Boletus edulis",
            competition_intensity: 4,
            resource_overlap: 60,
            outcome: "coexists"
          }
        ],
        
        facilitators: [
          {
            species: "Cenococcum geophilum",
            facilitation_type: "nutrient_sharing",
            effect_magnitude: 6
          }
        ],
        
        dispersalVectors: [
          {
            vector: "wind",
            effectiveness: 8,
            distance_class: "medium",
            seasonal_pattern: [3, 4, 5, 6, 7, 8, 9, 8, 7, 5, 4, 3] // Monthly 0-10
          },
          {
            vector: "animal",
            effectiveness: 6,
            distance_class: "long",
            seasonal_pattern: [2, 2, 3, 4, 5, 6, 7, 8, 9, 7, 4, 2]
          }
        ]
      },
      
      // ===== TEMPORAL PATTERNS =====
      temporalPatterns: {
        lifeCycle: [
          {
            stage: "Spore germination",
            duration_days: { min: 3, max: 7, typical: 5 },
            temperature_requirement: { min: 15, max: 25 },
            trigger_conditions: ["moisture", "host root presence"],
            morphological_changes: ["hyphae emergence"],
            icon: "🌱",
            color: "#90EE90"
          },
          {
            stage: "Mycelial growth",
            duration_days: { min: 60, max: 180, typical: 120 },
            temperature_requirement: { min: 10, max: 25 },
            trigger_conditions: ["nutrient availability"],
            morphological_changes: ["mycelial network expansion"],
            icon: "🕸️",
            color: "#F0E68C"
          },
          {
            stage: "Primordium formation",
            duration_days: { min: 3, max: 5, typical: 4 },
            temperature_requirement: { min: 12, max: 18 },
            trigger_conditions: ["temperature drop", "moisture increase"],
            morphological_changes: ["button formation"],
            icon: "⚪",
            color: "#FFE4B5"
          },
          {
            stage: "Fruiting body development",
            duration_days: { min: 5, max: 10, typical: 7 },
            temperature_requirement: { min: 10, max: 20 },
            morphological_changes: ["cap expansion", "stem elongation"],
            icon: "🍄",
            color: "#DC143C"
          },
          {
            stage: "Spore release",
            duration_days: { min: 3, max: 7, typical: 5 },
            trigger_conditions: ["maturity", "humidity"],
            morphological_changes: ["cap flattening", "gill darkening"],
            icon: "💨",
            color: "#8B4513"
          }
        ],
        
        seasonality: {
          monthly_activity: [
            { month: 1, fruiting_probability: 0, growth_rate: 10, spore_production: 0, visibility: 0 },
            { month: 2, fruiting_probability: 0, growth_rate: 15, spore_production: 0, visibility: 0 },
            { month: 3, fruiting_probability: 5, growth_rate: 30, spore_production: 5, visibility: 5 },
            { month: 4, fruiting_probability: 15, growth_rate: 50, spore_production: 10, visibility: 10 },
            { month: 5, fruiting_probability: 25, growth_rate: 70, spore_production: 20, visibility: 20 },
            { month: 6, fruiting_probability: 40, growth_rate: 85, spore_production: 35, visibility: 35 },
            { month: 7, fruiting_probability: 60, growth_rate: 95, spore_production: 55, visibility: 55 },
            { month: 8, fruiting_probability: 85, growth_rate: 100, spore_production: 80, visibility: 80 },
            { month: 9, fruiting_probability: 95, growth_rate: 90, spore_production: 90, visibility: 95 },
            { month: 10, fruiting_probability: 75, growth_rate: 60, spore_production: 70, visibility: 75 },
            { month: 11, fruiting_probability: 30, growth_rate: 35, spore_production: 25, visibility: 30 },
            { month: 12, fruiting_probability: 5, growth_rate: 15, spore_production: 5, visibility: 5 }
          ],
          peak_seasons: ["late summer", "autumn"],
          year_round: false,
          climate_variations: [
            {
              zone: "temperate",
              pattern: [0, 0, 5, 15, 25, 40, 60, 85, 95, 75, 30, 5]
            },
            {
              zone: "boreal",
              pattern: [0, 0, 0, 5, 15, 35, 75, 90, 80, 50, 15, 0]
            }
          ]
        },
        
        circadianRhythm: {
          spore_release_pattern: [
            { hour: 0, intensity: 30 },
            { hour: 6, intensity: 40 },
            { hour: 12, intensity: 60 },
            { hour: 18, intensity: 80 },
            { hour: 22, intensity: 50 }
          ],
          growth_pattern: [
            { hour: 0, rate: 70 },
            { hour: 6, rate: 60 },
            { hour: 12, rate: 40 },
            { hour: 18, rate: 50 },
            { hour: 22, rate: 65 }
          ],
          metabolic_activity: [
            { hour: 0, level: 60 },
            { hour: 6, level: 70 },
            { hour: 12, level: 85 },
            { hour: 18, level: 75 },
            { hour: 22, level: 65 }
          ]
        },
        
        historicalTimeline: [
          { year: 1256, event: "First documented illustration", event_type: "discovery", significance: 7, location: "Germany" },
          { year: 1753, event: "Linnaeus classification", event_type: "scientific", significance: 9, location: "Sweden" },
          { year: 1869, event: "Muscarine isolated", event_type: "scientific", significance: 8, location: "Germany" },
          { year: 1964, event: "Muscimol identified", event_type: "scientific", significance: 8, location: "Japan" },
          { year: 2010, event: "Genome sequenced", event_type: "scientific", significance: 7, location: "USA" }
        ],
        
        projections: {
          climate_suitability: [
            { year: 2030, suitability_score: 85, scenario: "RCP 2.6" },
            { year: 2050, suitability_score: 82, scenario: "RCP 2.6" },
            { year: 2030, suitability_score: 78, scenario: "RCP 4.5" },
            { year: 2050, suitability_score: 72, scenario: "RCP 4.5" }
          ],
          habitat_availability: [
            { year: 2030, area_km2: 4500000, change_percent: -5 },
            { year: 2050, area_km2: 4200000, change_percent: -12 }
          ]
        }
      },
      
      // ===== GEOGRAPHIC PATTERNS =====
      geographicPatterns: {
        distribution: {
          occurrences: [
            { lat: 60.1699, lon: 24.9384, date: Date.now(), abundance: "common", verified: true, elevation_m: 50, habitat: "boreal forest" },
            { lat: 52.5200, lon: 13.4050, date: Date.now(), abundance: "occasional", verified: true, elevation_m: 100, habitat: "mixed forest" },
            { lat: 47.3769, lon: 8.5417, date: Date.now(), abundance: "common", verified: true, elevation_m: 800, habitat: "coniferous forest" }
          ],
          
          ranges: [
            {
              type: "native",
              polygon: [
                { lat: 70, lon: -10 }, { lat: 70, lon: 180 }, 
                { lat: 35, lon: 180 }, { lat: 35, lon: -10 }
              ],
              status: "stable",
              quality: "confirmed"
            }
          ],
          
          density: [
            { lat: 60, lon: 25, radius_km: 100, observations: 450, relative_abundance: 85 },
            { lat: 55, lon: 10, radius_km: 100, observations: 320, relative_abundance: 65 }
          ],
          
          bioregions: [
            { name: "Boreal Forests/Taiga", code: "BF", presence: "native", abundance: "common" },
            { name: "Temperate Conifer Forests", code: "TCF", presence: "native", abundance: "common" },
            { name: "Temperate Broadleaf Forests", code: "TBF", presence: "native", abundance: "occasional" }
          ],
          
          elevationProfile: {
            min_m: 0,
            max_m: 2400,
            optimal_m: 800,
            distribution: [
              { elevation_m: 0, frequency: 20 },
              { elevation_m: 500, frequency: 60 },
              { elevation_m: 1000, frequency: 85 },
              { elevation_m: 1500, frequency: 40 },
              { elevation_m: 2000, frequency: 15 }
            ]
          }
        },
        
        climateEnvelope: {
          temperature: {
            min: -5,
            max: 25,
            optimal: 15,
            tolerance_range: 30
          },
          precipitation: {
            min_annual_mm: 400,
            max_annual_mm: 1600,
            optimal_annual_mm: 800,
            seasonal_preference: "summer-autumn"
          },
          humidity: {
            min_percent: 60,
            max_percent: 95,
            optimal_percent: 80
          },
          bioclim: [
            { variable: "BIO1", value: 10, importance: 85 },
            { variable: "BIO12", value: 800, importance: 75 },
            { variable: "BIO15", value: 25, importance: 60 }
          ]
        }
      },
      
      // ===== CHEMICAL UNIVERSE =====
      chemicalUniverse: {
        primaryMetabolites: {
          macronutrients: [
            { nutrient: "protein", amount_g_per_100g: 2.1, calories: 8.4, bioavailability: 75 },
            { nutrient: "carbohydrate", amount_g_per_100g: 3.3, calories: 13.2, bioavailability: 85 },
            { nutrient: "fat", amount_g_per_100g: 0.3, calories: 2.7, bioavailability: 90 },
            { nutrient: "fiber", amount_g_per_100g: 1.0, calories: 0, bioavailability: 100 }
          ],
          
          aminoAcids: [
            { name: "leucine", amount_mg_per_g: 1.8, essential: true, limiting: false },
            { name: "lysine", amount_mg_per_g: 1.5, essential: true, limiting: true },
            { name: "glutamic acid", amount_mg_per_g: 3.2, essential: false, limiting: false }
          ],
          
          fattyAcids: [
            { name: "palmitic acid", type: "saturated", amount_mg_per_g: 0.8 },
            { name: "oleic acid", type: "monounsaturated", amount_mg_per_g: 0.5 },
            { name: "linoleic acid", type: "polyunsaturated", amount_mg_per_g: 1.2, omega_class: "omega-6" }
          ],
          
          micronutrients: [
            { name: "vitamin D", amount: 0.2, unit: "μg", dv_percent: 1, bioavailability: 60 },
            { name: "potassium", amount: 318, unit: "mg", dv_percent: 9, bioavailability: 85 },
            { name: "selenium", amount: 9.3, unit: "μg", dv_percent: 13, bioavailability: 70 }
          ]
        },
        
        secondaryMetabolites: {
          compounds: [
            {
              name: "Ibotenic acid",
              iupac_name: "(2S)-2-amino-3-(3-oxo-1,2-oxazol-5-yl)propanoic acid",
              formula: "C5H8N2O4",
              smiles: "C1=C(ON=C1O)CC(C(=O)O)N",
              class: "amino acid derivative",
              concentration: { value: 0.1, unit: "% dry weight", variance: 0.03 },
              bioactivity: ["neurotoxic", "psychoactive"],
              targets: ["NMDA receptor", "metabotropic glutamate receptor"],
              toxicity: {
                ld50: 45,
                toxic_dose: 30,
                mechanism: "excitotoxicity"
              }
            },
            {
              name: "Muscimol",
              iupac_name: "5-(aminomethyl)-3-oxo-1,2-oxazole",
              formula: "C4H6N2O2",
              smiles: "C1=C(ON=C1O)CN",
              class: "isoxazole",
              concentration: { value: 0.05, unit: "% dry weight", variance: 0.02 },
              bioactivity: ["psychoactive", "GABA agonist"],
              targets: ["GABA-A receptor"]
            },
            {
              name: "Muscarine",
              formula: "C9H20NO2+",
              class: "alkaloid",
              concentration: { value: 0.0002, unit: "% dry weight" },
              bioactivity: ["toxic", "cholinergic"],
              targets: ["muscarinic acetylcholine receptor"],
              toxicity: {
                ld50: 0.2,
                toxic_dose: 0.05,
                mechanism: "cholinergic crisis"
              }
            }
          ],
          
          pathways: [
            {
              name: "Ibotenic acid biosynthesis",
              type: "secondary",
              precursors: ["glutamate", "hydroxylamine"],
              intermediates: ["3-hydroxyglutamate"],
              products: ["ibotenic acid"],
              enzymes: ["IboH hydroxylase", "IboF synthase"],
              regulation: "nitrogen availability"
            }
          ],
          
          fingerprint: {
            terpene_score: 15,
            alkaloid_score: 65,
            phenolic_score: 10,
            polysaccharide_score: 45,
            peptide_score: 20,
            unique_compounds: 8
          }
        },
        
        volatilome: {
          total_vocs: 42,
          major_components: [
            { compound: "1-octen-3-ol", percent_of_total: 35, aroma_descriptor: "mushroom", threshold_ppb: 10 },
            { compound: "3-octanone", percent_of_total: 12, aroma_descriptor: "earthy", threshold_ppb: 50 },
            { compound: "benzaldehyde", percent_of_total: 8, aroma_descriptor: "almond", threshold_ppb: 350 }
          ],
          aroma_profile: [
            { category: "earthy", intensity: 8, compounds: ["geosmin", "2-methylisoborneol"] },
            { category: "fungal", intensity: 9, compounds: ["1-octen-3-ol", "3-octanone"] },
            { category: "metallic", intensity: 3, compounds: ["dimethyl disulfide"] }
          ]
        }
      },
      
      // ===== CULTIVATION INTELLIGENCE =====
      cultivationIntelligence: {
        difficultyMatrix: {
          overall: 9, // Very difficult
          factors: [
            { factor: "mycorrhizal requirement", difficulty: 10, critical: true, solutions: ["inoculated seedlings"] },
            { factor: "contamination", difficulty: 6, critical: false },
            { factor: "temperature", difficulty: 5, critical: false },
            { factor: "substrate specificity", difficulty: 8, critical: true }
          ]
        },
        
        growthParameters: {
          temperature: {
            colonization: { min: 10, max: 25, optimal: 18 },
            fruiting: { min: 8, max: 20, optimal: 15 },
            storage: { min: 2, max: 8, optimal: 4 }
          },
          humidity: {
            colonization: { min: 70, max: 85, optimal: 75 },
            fruiting: { min: 80, max: 95, optimal: 90 }
          },
          co2: {
            colonization: { min: 5000, max: 20000, optimal: 10000 },
            fruiting: { min: 400, max: 1500, optimal: 800 }
          },
          light: {
            intensity_lux: { min: 500, max: 2000 },
            photoperiod_hours: { min: 8, max: 12 },
            spectrum: ["blue", "white"]
          },
          pH: {
            substrate: { min: 4.5, max: 6.5, optimal: 5.5 }
          }
        },
        
        substrateMatrix: [
          {
            substrate: "birch_roots",
            suitability: 10,
            yield_potential: 0, // Not cultivated commercially
            colonization_speed: 180,
            contamination_risk: 3,
            cost_effectiveness: 1,
            sustainability: 8,
            preparation_method: "seedling inoculation"
          },
          {
            substrate: "spruce_roots",
            suitability: 8,
            yield_potential: 0,
            colonization_speed: 200,
            contamination_risk: 3,
            cost_effectiveness: 1,
            sustainability: 8
          }
        ],
        
        productionCycle: [
          {
            phase: "Tree inoculation",
            day_start: 0,
            day_end: 1,
            tasks: ["prepare inoculum", "inoculate seedlings"],
            critical_parameters: ["sterility", "inoculum viability"],
            checkpoint_criteria: ["visible root colonization"],
            common_issues: ["contamination", "poor inoculation"]
          },
          {
            phase: "Mycorrhizal establishment",
            day_start: 1,
            day_end: 365,
            tasks: ["maintain trees", "monitor colonization"],
            critical_parameters: ["soil pH", "moisture"],
            checkpoint_criteria: ["mycorrhizal root tips visible"],
            common_issues: ["slow colonization", "tree stress"]
          },
          {
            phase: "Maturation",
            day_start: 365,
            day_end: 1825, // 5 years
            tasks: ["tree care", "soil management"],
            critical_parameters: ["tree health", "soil conditions"],
            checkpoint_criteria: ["first fruiting bodies"],
            common_issues: ["no fruiting", "tree mortality"]
          }
        ]
      },
      
      // ===== MEDICINAL INTELLIGENCE =====
      medicinalIntelligence: {
        therapeuticProfile: [
          {
            category: "neurological",
            strength: 8,
            evidence_level: "preclinical",
            mechanisms: ["GABA-A agonism", "NMDA antagonism"],
            active_compounds: ["muscimol", "ibotenic acid"]
          },
          {
            category: "anti-inflammatory",
            strength: 4,
            evidence_level: "traditional",
            mechanisms: ["COX inhibition"],
            active_compounds: ["ergosterol", "polysaccharides"]
          },
          {
            category: "antimicrobial",
            strength: 5,
            evidence_level: "in_vitro",
            mechanisms: ["cell wall disruption"],
            active_compounds: ["various"]
          }
        ],
        
        bioactivitySpectrum: {
          antibacterial: 5,
          antiviral: 3,
          antifungal: 4,
          antiparasitic: 2,
          anticancer: 2,
          immunomodulatory: 4,
          anti_inflammatory: 4,
          antioxidant: 3,
          neuroprotective: 1, // Actually neurotoxic!
          hepatoprotective: 2,
          cardioprotective: 2,
          antidiabetic: 1
        },
        
        traditionalMedicine: [
          {
            system: "Siberian shamanism",
            name: "Mukhomor",
            uses: ["spiritual journeys", "pain relief", "strength enhancement"],
            preparation: "dried caps consumed",
            contraindications: ["pregnancy", "children", "heart conditions"],
            cultural_significance: 10
          },
          {
            system: "European folk medicine",
            name: "Fliegenpilz",
            uses: ["insecticide", "rheumatism"],
            preparation: "tincture for external use",
            cultural_significance: 6
          }
        ]
      },
      
      // ===== CULINARY DIMENSIONS =====
      culinaryDimensions: {
        flavorWheel: {
          primary: [
            { category: "umami", intensity: 4, descriptors: ["savory", "brothy"] },
            { category: "bitter", intensity: 7, descriptors: ["acrid", "metallic"] },
            { category: "earthy", intensity: 6, descriptors: ["soil", "forest floor"] }
          ],
          secondary: [
            { note: "nutty", intensity: 3, develops_with: "parboiling" },
            { note: "sweet", intensity: 2, develops_with: "drying" }
          ]
        },
        
        textureEvolution: [
          { state: "raw", texture_descriptors: ["firm", "crisp"], moisture_percent: 90, firmness: 7, optimal_for: ["not consumed raw"] },
          { state: "parboiled", texture_descriptors: ["tender", "slightly chewy"], moisture_percent: 85, firmness: 4, optimal_for: ["detoxification"] },
          { state: "dried", texture_descriptors: ["leathery", "tough"], moisture_percent: 10, firmness: 9, optimal_for: ["storage"] }
        ],
        
        nutritionalDensity: {
          caloric_density: 27,
          protein_quality: 0.65,
          vitamin_density: 45,
          mineral_density: 62,
          fiber_content: 1.0,
          water_content: 90,
          ratios: {
            protein_to_carb: 0.64,
            omega6_to_omega3: 2.4,
            sodium_to_potassium: 0.03
          }
        },
        
        preparationMethods: [
          {
            method: "parboiling",
            temperature: { min: 95, max: 100 },
            duration_minutes: { min: 10, max: 20 },
            yield_percent: 70,
            nutrient_retention: {
              vitamins: 40,
              minerals: 60,
              antioxidants: 30
            },
            flavor_development: ["reduced bitterness", "mellowed flavor"],
            texture_change: "softened, more tender"
          },
          {
            method: "drying",
            temperature: { min: 40, max: 60 },
            duration_minutes: { min: 240, max: 480 },
            yield_percent: 10,
            nutrient_retention: {
              vitamins: 70,
              minerals: 95,
              antioxidants: 60
            },
            flavor_development: ["concentrated flavor", "slightly sweet"],
            texture_change: "leathery, must rehydrate"
          }
        ],
        
        culinaryTraditions: [
          {
            culture: "Japanese",
            dishes: ["historically avoided"],
            preparation_style: "not used",
            popularity: 0
          },
          {
            culture: "Northern European",
            dishes: ["occasionally detoxified and consumed"],
            preparation_style: "multiple parboiling",
            seasonal_use: "autumn",
            symbolic_meaning: "danger and magic",
            popularity: 1
          }
        ]
      },
      
      // ===== ENVIRONMENTAL INTELLIGENCE =====
      environmentalIntelligence: {
        carbonDynamics: {
          sequestration_rate: 2.5,
          biomass_carbon: 0.45,
          soil_carbon_impact: 7,
          lifecycle_emissions: 0.2,
          carbon_efficiency: 85
        },
        
        ecosystemServices: [
          { service: "nutrient cycling", importance: 9, scale: "local", beneficiaries: ["forest trees", "soil organisms"], economic_value: 1000 },
          { service: "tree health", importance: 8, scale: "local", beneficiaries: ["host trees"], economic_value: 5000 },
          { service: "soil formation", importance: 6, scale: "local", beneficiaries: ["ecosystem"], economic_value: 500 }
        ],
        
        climateResilience: {
          temperature_tolerance: 7,
          drought_tolerance: 5,
          flood_tolerance: 3,
          adaptation_potential: 6,
          migration_capacity: 7,
          scenarios: [
            { scenario: "RCP 2.6", year: 2050, suitability_change: -5, range_shift_km: 50 },
            { scenario: "RCP 4.5", year: 2050, suitability_change: -15, range_shift_km: 150 },
            { scenario: "RCP 8.5", year: 2050, suitability_change: -35, range_shift_km: 300 }
          ]
        },
        
        biodiversityRole: {
          species_associations: 47,
          keystone_index: 7,
          rarity_index: 2,
          endemism_index: 1,
          functional_uniqueness: 6,
          conservation_priority: 3
        }
      },
      
      // ===== ECONOMIC DIMENSIONS =====
      economicDimensions: {
        marketDynamics: {
          current_price: {
            wholesale: 0, // Not traded commercially
            retail: 0,
            currency: "USD",
            unit: "kg"
          },
          price_history: [
            { date: Date.UTC(2020, 0, 1), price: 0 },
            { date: Date.UTC(2021, 0, 1), price: 0 },
            { date: Date.UTC(2022, 0, 1), price: 0 },
            { date: Date.UTC(2023, 0, 1), price: 0 },
            { date: Date.UTC(2024, 0, 1), price: 0 }
          ],
          price_volatility: 0,
          seasonal_pattern: [
            { month: 1, relative_price: 0 },
            { month: 2, relative_price: 0 },
            { month: 3, relative_price: 0 },
            { month: 4, relative_price: 0 },
            { month: 5, relative_price: 0 },
            { month: 6, relative_price: 0 },
            { month: 7, relative_price: 0 },
            { month: 8, relative_price: 0 },
            { month: 9, relative_price: 0 },
            { month: 10, relative_price: 0 },
            { month: 11, relative_price: 0 },
            { month: 12, relative_price: 0 }
          ],
          segments: [
            { segment: "ornamental", share_percent: 80, growth_rate: 2, value_usd: 1000000 },
            { segment: "research", share_percent: 15, growth_rate: 5, value_usd: 500000 },
            { segment: "traditional", share_percent: 5, growth_rate: 0, value_usd: 50000 }
          ]
        },
        
        economicIndicators: {
          market_size_usd: 1550000,
          growth_rate_percent: 2.5,
          employment: 100,
          roi: -100, // Not commercially viable
          payback_period_months: 0,
          value_per_hectare: 0
        }
      },
      
      // ===== CULTURAL DIMENSIONS =====
      culturalDimensions: {
        culturalSignificance: [
          {
            culture: "European",
            significance_type: "folklore",
            importance: 9,
            time_period: "medieval to present",
            practices: ["fairy rings", "witch circles"],
            symbols: ["magic", "otherworld", "danger"],
            stories: ["Alice in Wonderland", "Smurfs", "Santa's helpers"]
          },
          {
            culture: "Siberian",
            significance_type: "spiritual",
            importance: 10,
            time_period: "prehistoric to present",
            practices: ["shamanic rituals", "vision quests"],
            symbols: ["divine mushroom", "spirit guide"]
          }
        ],
        
        etymology: {
          name_origin: "Latin: musca (fly) + -arius (pertaining to)",
          language_family: "Indo-European",
          historical_names: [
            { name: "Agaricus muscarius", language: "Latin", period: "1753", meaning: "fly agaric" },
            { name: "Fliegenpilz", language: "German", period: "medieval", meaning: "fly mushroom" },
            { name: "Tue-mouche", language: "French", period: "medieval", meaning: "fly killer" }
          ],
          linguistic_connections: ["insecticidal properties", "fly death"]
        },
        
        culturalReferences: [
          {
            type: "literature",
            work: "Alice's Adventures in Wonderland",
            creator: "Lewis Carroll",
            year: 1865,
            significance: "Size-changing mushroom"
          },
          {
            type: "art",
            work: "Various medieval manuscripts",
            creator: "Unknown",
            year: 1400,
            significance: "Symbol of the forest mysterious"
          },
          {
            type: "film",
            work: "Fantasia",
            creator: "Walt Disney",
            year: 1940,
            significance: "Dancing mushrooms sequence"
          }
        ]
      },
      
      // ===== INTERACTION MATRICES =====
      interactionMatrices: {
        speciesInteractions: [
          {
            species: "Betula pendula",
            interaction_type: "mutualistic",
            strength: 9,
            mechanism: "ectomycorrhizal",
            evidence: "extensive research",
            reciprocal: true
          },
          {
            species: "Boletus edulis",
            interaction_type: "competitive",
            strength: -3,
            mechanism: "resource competition",
            evidence: "field observations",
            reciprocal: true
          }
        ],
        
        compoundSynergies: [
          {
            compound1: "ibotenic acid",
            compound2: "muscimol",
            effect_type: "synergistic",
            magnitude: 2.5,
            biological_target: "GABA system"
          }
        ]
      },
      
      // ===== KNOWLEDGE CONNECTIONS =====
      knowledgeConnections: {
        relatedSpecies: [
          {
            species: "Amanita pantherina",
            relationship: "taxonomic",
            similarity: 85,
            shared_features: ["genus", "toxins", "morphology"]
          },
          {
            species: "Amanita phalloides",
            relationship: "taxonomic",
            similarity: 75,
            shared_features: ["genus", "morphology", "habitat"]
          }
        ],
        
        tags: [
          "toxic", "psychoactive", "mycorrhizal", "iconic", "red-and-white",
          "fairy-tale", "shamanic", "fly-agaric", "muscimol", "ibotenic-acid",
          "christmas", "folklore", "forest", "birch-associated"
        ],
        
        ontologies: [
          { ontology: "MycoBank", id: "MB#204096", uri: "http://www.mycobank.org/MB/204096" },
          { ontology: "Index Fungorum", id: "IF#204096", uri: "http://www.indexfungorum.org/names/NamesRecord.asp?RecordID=204096" },
          { ontology: "GBIF", id: "2519098", uri: "https://www.gbif.org/species/2519098" }
        ]
      },
      
      // ===== META INFORMATION =====
      metaInfo: {
        dataQuality: {
          completeness: 95,
          accuracy_confidence: 98,
          last_updated: Date.now(),
          update_frequency: "monthly",
          verification_status: "expert_verified",
          data_sources: ["MycoBank", "scientific literature", "field guides", "research papers"]
        },
        
        researchMetrics: {
          publication_count: 1847,
          citation_count: 45239,
          h_index: 89,
          research_trend: "increasing",
          hot_topics: ["neurotoxicology", "ethnomycology", "climate adaptation"],
          funding_usd: 2500000
        },
        
        engagement: {
          views: 285439,
          bookmarks: 12847,
          contributions: 342,
          quality_ratings: [
            { aspect: "identification", rating: 4.8, count: 1523 },
            { aspect: "information", rating: 4.9, count: 1122 },
            { aspect: "images", rating: 4.7, count: 987 }
          ]
        },
        
        conservation: {
          iucn_status: "Least Concern",
          threats: ["habitat loss", "climate change"],
          conservation_actions: ["habitat protection", "monitoring"],
          population_trend: "stable"
        }
      }
    };
    
    // Insert into database
    const id = await ctx.db.insert("fungi", Amanita_muscaria);
    
    console.log(`✅ Seeded Amanita muscaria with ID: ${id}`);
    console.log(`📊 This comprehensive example demonstrates:`);
    console.log(`   - 20+ visualization patterns for MorphMapper`);
    console.log(`   - Multi-dimensional relationships`);
    console.log(`   - Temporal patterns across multiple scales`);
    console.log(`   - Rich sensory and cultural data`);
    console.log(`   - Complete ecological and chemical networks`);
    
    return id;
  }
});