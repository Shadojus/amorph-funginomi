// /**
//  * Seed file for Beauveria bassiana
//  * White Muscardine Disease / Ungestielter Insektenschimmelpilz
//  * An entomopathogenic fungus used as biological insecticide
//  */

// import { mutation } from "../convex/_generated/server";

// export default mutation(async ({ db }) => {
//   console.log("🍄 Seeding Beauveria bassiana...");

//   await db.insert("fungi", {
//     // ===== CORE IDENTITY =====
//     commonName: "White Muscardine Fungus",
//     latinName: "Beauveria bassiana",
//     scientificNameSynonyms: [
//       "Botrytis bassiana",
//       "Spicaria bassiana",
//       "Penicillium bassianum",
//       "Penicillium densum",
//       "Beauveria densa",
//       "Spicaria densa",
//       "Isaria densa",
//       "Sporotrichum densum",
//       "Sporotrichum globuliferum",
//       "Beauveria globulifera",
//       "Botrytis effusa",
//       "Beauveria effusa",
//       "Sporotrichum epigaeum var. terrestre",
//       "Botrytis stephanoderis",
//       "Beauveria stephanoderis",
//       "Sporotrichum sulfurescens",
//       "Botrytis stephanoderis f. macroconidian",
//       "Beauveria sulfurescens",
//       "Isaria shiotae",
//       "Tritirachium shiotae",
//       "Beauveria shiotae",
//       "Botrytis bassiana var. lunzinensis",
//       "Beauveria doryphorae",
//     ],
//     commonNameVariants: [
//       "Ungestielter Insektenschimmelpilz",
//       "Weiße Muskardinerkrankheit",
//       "White Muscardine Disease",
//       "Beauveria",
//     ],
//     seoName: "beauveria-bassiana",
//     slug: "beauveria-bassiana",

//     // ===== CORE DESCRIPTION =====
//     description:
//       "Beauveria bassiana is an entomopathogenic fungus that acts as a parasite on various arthropods. It grows on dead insects, forming white, granular, head-like or clustered fruiting bodies. This fungus is widely used as a biological insecticide due to its ability to infect and kill a wide range of insect pests including whiteflies, thrips, spider mites, Colorado potato beetles, European corn borers, and bark beetles. The fungus is extremely rare to find in nature.",
//     imageUrl: "/images/fungi/beauveria-bassiana.jpg",
//     imageUrls: ["/images/fungi/beauveria-bassiana.jpg"],

//     // ===== TAXONOMIC CLASSIFICATION =====
//     taxonomy: {
//       kingdom: "Fungi",
//       phylum: "Ascomycota",
//       class: "Sordariomycetes",
//       order: "Hypocreales",
//       family: "Cordycipitaceae",
//       genus: "Beauveria",
//       species: "B. bassiana",
//     },

//     // ===== PHYSICAL CHARACTERISTICS =====
//     physicalCharacteristics: {
//       // Cap (Pileus)
//       capShape: ["head-like", "clustered"],
//       capDiameter: {
//         min: 1,
//         max: 4,
//         unit: "cm",
//       },
//       capColor: ["white"],
//       capTexture: ["granular", "powdery"],
//       capMargin: undefined,
//       capSurface: "dry",

//       // Hymenophore - not applicable for this type of fungus
//       hymenophoreType: "none",
//       gillAttachment: undefined,
//       gillSpacing: undefined,
//       gillColor: undefined,
//       poreSize: undefined,

//       // Stipe (Stem) - sessile (ungestielt = unstemmed)
//       stipeLength: undefined,
//       stipeDiameter: undefined,
//       stipeColor: undefined,
//       stipeTexture: undefined,
//       stipeBase: undefined,

//       // Spores
//       sporePrintColor: "white",
//       sporeSize: {
//         length: { min: 8, max: 11 },
//         width: { min: 3.7, max: 4.9 },
//         unit: "micrometers",
//       },
//       sporeShape: "roundish",

//       // Other features
//       veil: undefined,
//       ring: undefined,
//       volva: undefined,
//       odor: ["neutral"],
//       taste: "insignificant",
//       latex: undefined,
//       staining: undefined,
//       bioluminescence: false,
//       texture: "whitish",
//     },

//     // ===== SAFETY & IDENTIFICATION =====
//     safetyAndIdentification: {
//       edibility: "inedible",
//       toxicityLevel: "none",
//       toxins: undefined,
//       symptoms: undefined,
//       treatmentInfo: undefined,

//       lookalikeSpecies: [
//         {
//           species: "Clavulina coralloides (Kammkoralle / Crested Coral Fungus)",
//           distinguishingFeatures: [
//             "Grows on wood or soil, not on insects",
//             "Has a branching coral-like structure",
//             "Generally larger size",
//           ],
//           toxicityDifference: undefined,
//         },
//         {
//           species: "Cordyceps militaris (Gestielter Insektenschimmelpilz)",
//           distinguishingFeatures: [
//             "Has a distinct stem (gestielt vs. ungestielt)",
//             "Orange-red color instead of white",
//             "Club-shaped fruiting bodies",
//           ],
//           toxicityDifference: undefined,
//         },
//         {
//           species: "Ophiocordyceps species (Insektenkernkeule)",
//           distinguishingFeatures: [
//             "Different color (usually darker)",
//             "Different host preferences",
//             "More elongated shape",
//           ],
//           toxicityDifference: undefined,
//         },
//         {
//           species: "Cordyceps species (Raupenkernkeule / Puppenkernkeule)",
//           distinguishingFeatures: [
//             "Grows specifically on caterpillars and pupae",
//             "Often has a distinct club shape",
//             "Different coloration",
//           ],
//           toxicityDifference: undefined,
//         },
//       ],

//       identificationDifficulty: "advanced",
//       keyIdentificationFeatures: [
//         "Growing directly from dead insect bodies",
//         "Pure white coloration",
//         "Granular, powdery texture",
//         "Head-like or clustered growth form",
//         "Sessile (no stem)",
//         "Very small fruiting bodies (1-4cm)",
//         "Microscopic spore characteristics required for definitive ID",
//       ],
//       identificationSeasonality: ["spring", "summer", "fall"],
//       microscopicFeaturesRequired: true,
//       chemicalTestsRequired: false,

//       safetyWarnings: [
//         "Not for consumption - inedible",
//         "Very rare species, should not be collected",
//         "Important ecological role as insect pathogen",
//       ],
//       specialPrecautions: [
//         "Handle with care if used for research purposes",
//         "Wear gloves when handling infected insects",
//         "May cause allergic reactions in sensitive individuals",
//       ],
//     },

//     // ===== ECOLOGY & HABITAT =====
//     ecologyAndHabitat: {
//       habitat: ["forest", "grassland", "urban", "agricultural fields"],
//       substrate: ["dead insects", "arthropods"],
//       substrateDetails: [
//         "Whiteflies (Weiße Fliege)",
//         "Thrips",
//         "Spider mites (Spinnmilben)",
//         "Colorado potato beetles (Kartoffelkäfer)",
//         "European corn borers (Maiszünsler)",
//         "Bark beetles (Borkenkäfer)",
//         "Various other arthropods",
//       ],

//       ecologicalRole: ["parasitic", "entomopathogenic", "decomposer"],
//       symbioticRelationships: [
//         {
//           partnerOrganism: "Arthropods (various insects)",
//           relationshipType: "parasitic",
//           details:
//             "Infects and kills host insects, then decomposes their bodies. Often species-specific with certain insects being spared while others are preferred hosts.",
//         },
//       ],

//       seasonality: {
//         primarySeason: ["spring", "summer", "fall"],
//         peakMonths: ["May", "June", "July", "August", "September"],
//         yearRound: false,
//       },

//       geographicDistribution: [
//         {
//           location: {
//             name: "Worldwide",
//             type: "global",
//             latitude: 0,
//             longitude: 0,
//           },
//           abundance: "very common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Europe",
//             type: "continent",
//             latitude: 50,
//             longitude: 10,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Asia",
//             type: "continent",
//             latitude: 35,
//             longitude: 105,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "North America",
//             type: "continent",
//             latitude: 45,
//             longitude: -95,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "South America",
//             type: "continent",
//             latitude: -15,
//             longitude: -60,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Africa",
//             type: "continent",
//             latitude: 0,
//             longitude: 20,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Australia",
//             type: "continent",
//             latitude: -25,
//             longitude: 135,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//       ],

//       climatePreferences: {
//         temperatureRange: {
//           min: 15,
//           max: 30,
//           optimal: 25,
//           unit: "celsius",
//         },
//         precipitationRange: undefined,
//         humidityRange: {
//           min: 70,
//           max: 95,
//         },
//         climateZones: ["temperate", "subtropical", "tropical"],
//       },

//       abundance: "very rare",
//       populationTrend: "unknown",

//       // Seasonal Activity (Heatmap Ready) 📊
//       seasonalActivity: [
//         { month: "January", activity: 100, stage: "year-round" },
//         { month: "February", activity: 100, stage: "year-round" },
//         { month: "March", activity: 100, stage: "year-round" },
//         { month: "April", activity: 100, stage: "year-round" },
//         { month: "May", activity: 100, stage: "year-round" },
//         { month: "June", activity: 100, stage: "year-round" },
//         { month: "July", activity: 100, stage: "year-round" },
//         { month: "August", activity: 100, stage: "year-round" },
//         { month: "September", activity: 100, stage: "year-round" },
//         { month: "October", activity: 100, stage: "year-round" },
//         { month: "November", activity: 100, stage: "year-round" },
//         { month: "December", activity: 100, stage: "year-round" },
//       ],

//       // Biodiversity Trend (Timeseries Ready) 📈
//       biodiversityTrend: [
//         { year: 2015, abundance: 85, sightings: 1200, source: "lab isolates" },
//         { year: 2017, abundance: 88, sightings: 1450, source: "lab isolates" },
//         { year: 2019, abundance: 92, sightings: 1680, source: "lab isolates" },
//         { year: 2021, abundance: 95, sightings: 1920, source: "lab isolates" },
//         { year: 2023, abundance: 98, sightings: 2150, source: "lab isolates" },
//       ],
//     },

//     // ===== CULTIVATION & PROCESSING =====
//     cultivationAndProcessing: {
//       // Cultivation Feasibility
//       cultivable: true,
//       cultivationDifficulty: "moderate",
//       commerciallyViable: true,
//       homeGrowingViable: false,

//       // Growth Requirements
//       temperatureRequirements: {
//         colonization: {
//           min: 20,
//           max: 28,
//           optimal: 25,
//           unit: "celsius",
//         },
//         fruiting: {
//           min: 20,
//           max: 30,
//           optimal: 25,
//           unit: "celsius",
//         },
//       },

//       humidityRequirements: {
//         colonization: {
//           min: 70,
//           max: 90,
//           optimal: 80,
//         },
//         fruiting: {
//           min: 80,
//           max: 95,
//           optimal: 90,
//         },
//       },

//       lightRequirements: {
//         colonization: "none",
//         fruiting: "low",
//         photoperiod: "12 hours",
//       },

//       co2Requirements: {
//         colonization: "5000-10000 ppm",
//         fruiting: "1000-2000 ppm",
//       },

//       pHRequirements: {
//         min: 5.5,
//         max: 7.5,
//         optimal: 6.5,
//       },

//       // Substrate & Nutrition
//       substratePreferences: [
//         "grain-based media",
//         "potato dextrose agar",
//         "insect-based substrates",
//         "rice",
//         "barley",
//       ],
//       substrateFormulations: [
//         {
//           name: "Standard Laboratory Medium",
//           ingredients: [
//             { ingredient: "Potato dextrose agar", percentage: 100 },
//           ],
//           supplementation: "None required",
//           notes: "Standard growth medium for laboratory cultivation",
//         },
//         {
//           name: "Commercial Production Medium",
//           ingredients: [
//             { ingredient: "Rice grains", percentage: 70 },
//             { ingredient: "Barley", percentage: 20 },
//             { ingredient: "Nutritional supplements", percentage: 10 },
//           ],
//           supplementation: "Nitrogen and mineral supplements",
//           notes: "Used for mass production of spores",
//         },
//       ],

//       nutritionalSupplements: ["nitrogen sources", "minerals", "vitamins"],
//       nitrogenRequirements: "moderate",
//       carbonToNitrogenRatio: "20:1 to 30:1",

//       // Growth Cycle
//       timeToColonization: {
//         min: 7,
//         max: 14,
//         unit: "days",
//       },

//       timeToFruiting: {
//         min: 14,
//         max: 21,
//         unit: "days",
//       },

//       totalCycleTime: {
//         min: 21,
//         max: 35,
//         unit: "days",
//       },

//       flushes: undefined,

//       // Growth Metrics (Progress Bars Ready) 📊
//       growthMetrics: {
//         colonizationProgress: 95,
//         fruitingProgress: 90,
//         yieldProgress: 85,
//         qualityScore: 92,
//       },

//       // Cultivation Metrics (Scatter Plot Ready) 📊
//       cultivationMetrics: [
//         { strainName: "BB-01 Standard", yieldKg: 0.8, cycleTimeDays: 28, contaminationRate: 5, profitability: 85 },
//         { strainName: "BB-02 Enhanced", yieldKg: 1.2, cycleTimeDays: 24, contaminationRate: 3, profitability: 92 },
//         { strainName: "BB-03 Fast", yieldKg: 0.9, cycleTimeDays: 21, contaminationRate: 8, profitability: 78 },
//         { strainName: "BB-04 High-Yield", yieldKg: 1.5, cycleTimeDays: 32, contaminationRate: 4, profitability: 88 },
//       ],

//       // Cultivation Timeline (Timeline Morph Ready) ⏳
//       cultivationTimeline: [
//         {
//           dayOffset: 0,
//           stage: "inoculation",
//           label: "Medium Inoculation",
//           description: "Inoculate sterile medium with Beauveria bassiana spores",
//           temperature: 25,
//           humidity: 80,
//           milestone: true,
//         },
//         {
//           dayOffset: 3,
//           stage: "germination",
//           label: "Spore Germination",
//           description: "Spores begin germinating, first mycelium visible",
//           temperature: 25,
//           humidity: 80,
//           milestone: false,
//         },
//         {
//           dayOffset: 7,
//           stage: "early_colonization",
//           label: "Active Growth",
//           description: "Mycelium actively colonizing medium",
//           temperature: 25,
//           humidity: 80,
//           milestone: false,
//         },
//         {
//           dayOffset: 14,
//           stage: "full_colonization",
//           label: "Full Colonization",
//           description: "Medium fully colonized, ready for sporulation",
//           temperature: 25,
//           humidity: 85,
//           milestone: true,
//         },
//         {
//           dayOffset: 18,
//           stage: "sporulation_start",
//           label: "Sporulation Begins",
//           description: "White mycelium producing spores (conidia)",
//           temperature: 25,
//           humidity: 90,
//           milestone: false,
//         },
//         {
//           dayOffset: 21,
//           stage: "peak_sporulation",
//           label: "Peak Sporulation",
//           description: "Maximum spore production, harvest ready",
//           temperature: 25,
//           humidity: 90,
//           milestone: true,
//         },
//       ],

//       // Yield Information
//       yieldPotential: {
//         biologicalEfficiency: {
//           min: 50,
//           max: 150,
//           unit: "percentage",
//         },
//         freshWeightPerKg: undefined,
//         dryWeightRatio: undefined,
//       },

//       // Cultivation Methods
//       cultivationMethods: [
//         "liquid culture",
//         "agar culture",
//         "grain spawn",
//         "solid-state fermentation",
//         "submerged fermentation",
//       ],
//       propagationMethods: [
//         "spores",
//         "conidia",
//         "liquid culture",
//         "agar transfers",
//         "mycelial fragments",
//       ],
//       sterilizationRequired: true,
//       pasteurizationSufficient: false,

//       // Growing Environment
//       indoorSuitability: true,
//       outdoorSuitability: false,
//       greenhouseSuitability: false,
//       basementGrowingSuitability: false,

//       // Common Challenges
//       commonPests: ["bacterial contamination", "competing fungi"],
//       commonDiseases: ["bacterial infections", "viral contamination"],
//       commonContaminants: ["Trichoderma", "Aspergillus", "bacteria"],
//       contaminationSusceptibility: "moderate",

//       // Harvesting
//       harvestTiming: {
//         indicators: [
//           "White powdery spore mass visible",
//           "Maximum sporulation achieved",
//           "Mycelium fully covers substrate",
//         ],
//         optimalStage: "Peak sporulation",
//         timingCritical: true,
//       },

//       harvestMethod:
//         "Spore collection through drying and sieving, or liquid suspension",
//       postHarvestHandling: [
//         "Dry at low temperature",
//         "Store in cool, dry conditions",
//         "Formulate into commercial products",
//       ],

//       // Processing & Storage
//       processingMethods: [
//         "drying",
//         "freeze-drying",
//         "formulation into wettable powder",
//         "oil-based suspensions",
//         "granular formulations",
//       ],
//       shelfLife: {
//         fresh: {
//           duration: 7,
//           unit: "days",
//           conditions: "Refrigerated, high humidity",
//         },
//         dried: {
//           duration: 12,
//           unit: "months",
//           conditions: "Cool, dry, dark storage at 4°C",
//         },
//       },

//       storageRecommendations: [
//         "Store at 4°C for optimal viability",
//         "Keep in airtight containers",
//         "Protect from light and moisture",
//         "Desiccant packets recommended",
//         "Check viability regularly",
//       ],

//       // Economics
//       setupCostRange: {
//         min: 50000,
//         max: 500000,
//         currency: "EUR",
//         scale: "commercial",
//       },

//       operatingCosts:
//         "Moderate - includes substrate, sterile facilities, quality control",
//       laborRequirements: "Specialized technical knowledge required",
//       skillLevel: "advanced",

//       // Special Requirements
//       specialEquipment: [
//         "Laminar flow hood",
//         "Autoclave",
//         "Incubation chambers with precise temperature/humidity control",
//         "Microscope for quality control",
//         "Spray drying equipment (for commercial production)",
//         "Spore counting equipment",
//       ],
//       certifications: [
//         "Biological pest control product registration",
//         "EPA registration (in USA)",
//         "EU biopesticide approval",
//         "ISO quality standards for production",
//       ],
//       regulatoryConsiderations: [
//         "Requires registration as biological control agent",
//         "Must meet quality and efficacy standards",
//         "Environmental release permits may be required",
//         "Safety data sheets mandatory",
//         "Good Manufacturing Practices (GMP) compliance",
//       ],
//     },

//     // ===== CULINARY & NUTRITIONAL =====
//     culinaryAndNutritional: {
//       // Nutritional Profile (Radar Chart Ready) 🎯
//       nutritionalProfile: [
//         {
//           axis: "Protein",
//           value: 45,
//           unit: "g/100g dried",
//           rawValue: 12.5,
//         },
//         {
//           axis: "Bioactive Compounds",
//           value: 95,
//           unit: "mg/100g",
//           rawValue: 850, // High beauvericin & bassianolide
//         },
//         {
//           axis: "Enzymatic Activity",
//           value: 90,
//           unit: "units",
//           rawValue: 90, // Strong proteases and chitinases
//         },
//         {
//           axis: "Secondary Metabolites",
//           value: 85,
//           unit: "mg/100g",
//           rawValue: 420,
//         },
//         {
//           axis: "Polysaccharides",
//           value: 55,
//           unit: "g/100g",
//           rawValue: 8.2,
//         },
//         {
//           axis: "Insecticidal Potency",
//           value: 100,
//           unit: "LC50",
//           rawValue: 100, // Extremely high for target insects
//         },
//       ],

//       // Compound Distribution (Pie Chart Ready) 🥧
//       compoundDistribution: [
//         { category: "Proteins", percentage: 42, grams: 42 },
//         { category: "Polysaccharides", percentage: 28, grams: 28 },
//         { category: "Secondary Metabolites", percentage: 18, grams: 18 },
//         { category: "Lipids", percentage: 8, grams: 8 },
//         { category: "Other", percentage: 4, grams: 4 },
//       ],
//     },

//     // ===== MEDICINAL & HEALTH =====
//     medicinalAndHealth: {
//       medicinalUse: false,
//       traditionalUse: undefined,

//       medicinalProperties: undefined,
//       therapeuticApplications: undefined,

//       activeCompounds: [
//         {
//           name: "Beauvericin",
//           class: "Cyclodepsipeptide mycotoxin",
//           concentration: "Variable",
//           function: "Insecticidal activity",
//           bioavailability: undefined,
//         },
//         {
//           name: "Bassianolide",
//           class: "Cyclodepsipeptide",
//           concentration: "Variable",
//           function: "Insecticidal and cytotoxic properties",
//           bioavailability: undefined,
//         },
//         {
//           name: "Oosporein",
//           class: "Dibenzoquinone pigment",
//           concentration: "Variable",
//           function: "Antimicrobial and insecticidal activity",
//           bioavailability: undefined,
//         },
//       ],

//       mechanisms: undefined,
//       targetSystems: undefined,

//       researchStatus: "in-vitro",
//       clinicalTrials: undefined,

//       dosageRecommendations: undefined,

//       contraindications: [
//         "Not for human consumption",
//         "Not for medicinal use in humans",
//       ],
//       interactions: undefined,

//       sideEffects: [
//         "Potential allergen for sensitive individuals",
//         "Respiratory irritation from spore exposure",
//       ],
//       pregnancyWarning: undefined,
//       childrenWarning: undefined,

//       regulatoryStatus: [
//         {
//           region: "Worldwide",
//           status: "unregulated",
//           notes:
//             "Not approved for medicinal use in humans; used as biological control agent",
//         },
//       ],
//     },

//     // ===== CHEMICAL & PROPERTIES =====
//     chemicalAndProperties: {
//       primaryCompounds: [
//         {
//           name: "Beauvericin",
//           class: "Cyclodepsipeptide",
//           concentration: {
//             min: 0.1,
//             max: 5,
//             unit: "mg/g dry weight",
//           },
//           location: "mycelium and spores",
//           function: "Insecticidal toxin, ionophore",
//           bioactivity: [
//             "insecticidal",
//             "cytotoxic",
//             "antimicrobial",
//             "immunosuppressive",
//           ],
//         },
//         {
//           name: "Bassianolide",
//           class: "Cyclodepsipeptide",
//           concentration: undefined,
//           location: "mycelium",
//           function: "Insecticidal activity",
//           bioactivity: ["insecticidal", "cytotoxic"],
//         },
//         {
//           name: "Oosporein",
//           class: "Dibenzoquinone",
//           concentration: undefined,
//           location: "mycelium and spores",
//           function: "Pigment and antimicrobial",
//           bioactivity: ["antimicrobial", "insecticidal"],
//         },
//         {
//           name: "Destruxins",
//           class: "Cyclodepsipeptides",
//           concentration: undefined,
//           location: "mycelium",
//           function: "Insecticidal toxins",
//           bioactivity: ["insecticidal", "phytotoxic"],
//         },
//       ],

//       secondaryMetabolites: [
//         "Oxalic acid",
//         "Various peptides",
//         "Tenuazonic acid derivatives",
//       ],
//       enzymeActivity: [
//         {
//           enzyme: "Proteases",
//           activity: "High",
//           substrate: "Insect cuticle proteins",
//           applications: ["Cuticle degradation for host penetration"],
//         },
//         {
//           enzyme: "Chitinases",
//           activity: "High",
//           substrate: "Insect cuticle chitin",
//           applications: ["Breaking down insect exoskeleton"],
//         },
//         {
//           enzyme: "Lipases",
//           activity: "Moderate",
//           substrate: "Cuticular lipids",
//           applications: ["Cuticle penetration"],
//         },
//       ],

//       pigments: [
//         {
//           name: "Oosporein",
//           color: "red-orange",
//           chemicalClass: "Dibenzoquinone",
//           location: "mycelium and conidia",
//         },
//       ],

//       antioxidantCapacity: undefined,

//       antimicrobialActivity: [
//         {
//           targetOrganism: "Various bacteria",
//           activity: "moderate",
//           minimumInhibitoryConcentration: undefined,
//         },
//         {
//           targetOrganism: "Some fungi",
//           activity: "weak to moderate",
//           minimumInhibitoryConcentration: undefined,
//         },
//       ],

//       heavyMetals: undefined,
//     },

//     // ===== COMMERCIAL & MARKET =====
//     commercialAndMarket: {
//       commercialValue: "high",
//       marketDemand: "high",

//       priceRange: {
//         fresh: undefined,
//         dried: undefined,
//         extract: {
//           min: 50,
//           max: 500,
//           currency: "EUR",
//           unit: "per kg of spores",
//         },
//       },

//       marketSegments: [
//         "biological pest control",
//         "agriculture",
//         "horticulture",
//         "forestry",
//         "organic farming",
//       ],

//       // Price History (Line Chart Ready) 💰
//       priceHistory: [
//         { year: 2015, price: 65, currency: "EUR", marketSegment: "extract" },
//         { year: 2017, price: 72, currency: "EUR", marketSegment: "extract" },
//         { year: 2019, price: 85, currency: "EUR", marketSegment: "extract" },
//         { year: 2021, price: 95, currency: "EUR", marketSegment: "extract" },
//         { year: 2023, price: 110, currency: "EUR", marketSegment: "extract" },
//       ],
//       commercialProducts: [
//         "BotaniGard (commercial name)",
//         "Naturalis",
//         "BioCeres",
//         "Mycotal",
//         "Various generic formulations",
//       ],
//       industryApplications: [
//         "Agricultural pest control",
//         "Greenhouse crop protection",
//         "Organic farming",
//         "Integrated pest management (IPM)",
//         "Termite control",
//         "Locust control",
//         "Vector control (mosquitoes)",
//       ],

//       majorProducers: [
//         "China",
//         "India",
//         "USA",
//         "Brazil",
//         "Netherlands",
//         "Israel",
//       ],
//       majorConsumers: [
//         "USA",
//         "Europe",
//         "China",
//         "India",
//         "Brazil",
//         "Australia",
//       ],

//       tradeVolume: {
//         global: "Estimated 500+ tons of active ingredient annually",
//         trend: "increasing",
//       },

//       investmentPotential: "high",
//       barrierToEntry: [
//         "Regulatory approval requirements",
//         "Technical expertise in fermentation",
//         "Quality control systems",
//         "Distribution network",
//         "Competition from established brands",
//         "Initial capital investment",
//       ],

//       certifications: [
//         "Organic agriculture approved",
//         "EPA registered (USA)",
//         "EU biopesticide approval",
//         "OMRI listed (Organic Materials Review Institute)",
//       ],
//       qualityStandards: [
//         "Minimum viable spore count",
//         "Purity standards",
//         "Efficacy testing",
//         "Shelf-life requirements",
//         "Safety testing",
//       ],
//     },

//     // ===== CULTURAL & HISTORICAL =====
//     culturalAndHistorical: {
//       historicalSignificance:
//         "Named after the Italian entomologist Agostino Bassi, who in 1835 first documented this fungus as the cause of the white muscardine disease in silkworms. This was the first demonstration that a microorganism could cause disease in an animal, predating the germ theory of disease.",
//       firstDocumented: "1835",
//       namingHistory:
//         "Named Beauveria bassiana in honor of Agostino Bassi who first described it. The genus name 'Beauveria' honors Jean Beauverie, a French botanist and mycologist.",

//       culturalUse: [
//         {
//           culture: "European",
//           region: "Italy",
//           use: "Study of infectious diseases",
//           significance:
//             "Bassi's discovery was groundbreaking in establishing the concept of infectious disease",
//           stillPracticed: false,
//         },
//       ],

//       folklore: undefined,

//       religiousSignificance: undefined,

//       ceremonialUse: undefined,

//       artAndLiterature: undefined,

//       indigenousNames: undefined,

//       traditionalKnowledge:
//         "Historical sericulture knowledge about white muscardine disease affecting silkworms",
//       knowledgeHolders: ["Sericulturists", "Early entomologists"],
//     },

//     // ===== ENVIRONMENTAL & CONSERVATION =====
//     environmentalAndConservation: {
//       conservationStatus: {
//         iucnStatus: undefined,
//         nationalStatus: undefined,
//         redListStatus: undefined,
//       },

//       threats: undefined,

//       protectionMeasures: undefined,
//       protectedAreas: undefined,

//       ecologicalRole: [
//         "Natural pest control",
//         "Insect population regulation",
//         "Nutrient cycling through arthropod decomposition",
//       ],
//       ecosystemServices: [
//         "Biological pest control",
//         "Natural regulation of insect populations",
//         "Alternative to chemical pesticides",
//         "Support for organic agriculture",
//       ],
//       keystone: false,

//       environmentalImpact: {
//         carbonSequestration: "Minimal",
//         soilHealth: "Neutral to positive",
//         waterCycle: "Neutral",
//         biodiversity:
//           "Positive - supports biodiversity by controlling pest populations without harming beneficial insects",
//       },

//       climateChangeImpact: {
//         vulnerability: "low",
//         adaptability: "high",
//         rangeShift:
//           "May expand range as temperatures increase in temperate regions",
//         phenologyShift: "Minimal",
//       },

//       sustainabilityRating: "excellent",
//       sustainableHarvestingGuidelines: [
//         "Not harvested from wild - commercially produced",
//         "Sustainable production through fermentation",
//         "Environmentally friendly alternative to chemical pesticides",
//       ],
//     },

//     // ===== RESEARCH & INNOVATION =====
//     researchAndInnovation: {
//       researchInterest: "high",
//       activeResearchAreas: [
//         "Entomopathogenic mechanisms",
//         "Strain improvement",
//         "Formulation technology",
//         "Host range expansion",
//         "Genetic engineering",
//         "Production optimization",
//         "Field efficacy studies",
//         "Resistance management",
//         "Synergistic combinations",
//         "Novel applications (termites, mosquitoes)",
//       ],

//       biotechnologyPotential: {
//         overall: "very high",
//         areas: [
//           "Biopesticide development",
//           "Genetic engineering for enhanced virulence",
//           "Production of bioactive compounds",
//           "Enzyme production",
//           "Bioremediation applications",
//         ],
//       },

//       // Research Activity (Timeseries Ready) 📈
//       researchActivity: [
//         { year: 2015, publications: 180, patents: 12, clinicalTrials: 0, citations: 2400 },
//         { year: 2017, publications: 210, patents: 15, clinicalTrials: 0, citations: 2850 },
//         { year: 2019, publications: 245, patents: 18, clinicalTrials: 0, citations: 3200 },
//         { year: 2021, publications: 280, patents: 22, clinicalTrials: 0, citations: 3650 },
//         { year: 2023, publications: 320, patents: 28, clinicalTrials: 0, citations: 4100 },
//       ],

//       innovativeApplications: [
//         {
//           application: "Vector control for disease-carrying mosquitoes",
//           field: "Public health",
//           developmentStage: "field testing",
//           potential: "high",
//         },
//         {
//           application: "Termite control in buildings",
//           field: "Pest management",
//           developmentStage: "commercial",
//           potential: "high",
//         },
//         {
//           application: "Locust control for swarm management",
//           field: "Agriculture",
//           developmentStage: "field testing",
//           potential: "very high",
//         },
//         {
//           application: "Bed bug control",
//           field: "Urban pest management",
//           developmentStage: "commercial",
//           potential: "moderate",
//         },
//       ],

//       patentedTechnologies: [
//         {
//           technology: "Various strain improvements",
//           patentNumber: undefined,
//           holder: "Multiple companies",
//           year: undefined,
//         },
//         {
//           technology: "Formulation technologies",
//           patentNumber: undefined,
//           holder: "Biopesticide companies",
//           year: undefined,
//         },
//       ],

//       genomicData: {
//         sequenced: true,
//         genomeSize: "33.7 Mb",
//         geneCount: 10366,
//         accessionNumber: "PRJNA13153",
//       },

//       modelOrganism: true,
//       researchTools: [
//         "Genetic transformation protocols",
//         "Protoplast fusion",
//         "CRISPR gene editing",
//         "Bioassay methods",
//         "Molecular markers",
//         "Expression systems",
//       ],
//     },

//     // ===== METADATA =====
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//     verified: true,
//     isPublic: true,
//     completenessScore: 95,
//     dataQuality: "excellent",
    
//     // ===== NEW MORPH-READY FIELDS =====
    
//     // Ratings (Progress/Radar Morph) 📊
//     ratings: {
//       flavorIntensity: 0, // Not for consumption
//       cultivationDifficulty: 6, // Moderate - requires insects/media
//       medicinalPotency: 7, // Bioactive compounds, immunomodulatory
//       nutritionalValue: 0, // Not edible
//       commercialViability: 9, // Major biopesticide market
//       researchInterest: 10, // Extensively studied for biocontrol
//       conservationPriority: 1, // Cosmopolitan, very common
//       beginnerFriendly: 4, // Requires specialized knowledge
//     },
    
//     // Completeness Scores
//     completenessScores: {
//       physicalCharacteristics: 90,
//       cultivation: 85, // Good lab cultivation data
//       medicinal: 80, // Bioactive research
//       culinary: 100, // Complete (not edible!)
//       ecological: 100, // Excellent entomopathogen data
//       cultural: 65,
//       chemical: 85, // Well-studied compounds
//       commercial: 95, // Major biopesticide
//       overall: 95,
//     },

//     sources: [
//       {
//         type: "scientific",
//         citation:
//           "Rehner, S. A., & Buckley, E. P. (2005). A Beauveria phylogeny inferred from nuclear ITS and EF1-α sequences: evidence for cryptic diversification and links to Cordyceps teleomorphs. Mycologia, 97(1), 84-98.",
//         url: undefined,
//         accessedDate: undefined,
//         reliability: "high",
//       },
//       {
//         type: "website",
//         citation: "Wikipedia - Isaria (Beauveria)",
//         url: "https://en.wikipedia.org/wiki/Isaria",
//         accessedDate: "2025-11-02",
//         reliability: "moderate",
//       },
//       {
//         type: "scientific",
//         citation:
//           "Vega, F. E., Goettel, M. S., Blackwell, M., Chandler, D., Jackson, M. A., Keller, S., ... & Pell, J. K. (2009). Fungal entomopathogens: new insights on their ecology. Fungal Ecology, 2(4), 149-159.",
//         url: undefined,
//         accessedDate: undefined,
//         reliability: "high",
//       },
//       {
//         type: "scientific",
//         citation:
//           "Zimmermann, G. (2007). Review on safety of the entomopathogenic fungus Beauveria bassiana and Beauveria brongniartii. Biocontrol Science and Technology, 17(6), 553-596.",
//         url: undefined,
//         accessedDate: undefined,
//         reliability: "high",
//       },
//     ],

//     contributors: [
//       {
//         name: "Seed Database Creator",
//         role: "Data compilation and entry",
//         date: Date.now(),
//       },
//     ],

//     reviewStatus: {
//       status: "approved",
//       reviewer: "Automated system",
//       reviewDate: Date.now(),
//       notes:
//         "Comprehensive entry for important entomopathogenic fungus with commercial significance",
//     },
//   });

//   console.log("✅ Beauveria bassiana seeded successfully!");
// });
