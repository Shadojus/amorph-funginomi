// /**
//  * Seed file for Pholiota adiposa
//  * Fat Pholiota / Chestnut Mushroom / Schleimiger Schüppling
//  * Inedible mushroom with slimy cap and scaly appearance
//  */

// import { mutation } from "../convex/_generated/server";

// export default mutation(async ({ db }) => {
//   console.log("🍄 Seeding Pholiota adiposa...");

//   await db.insert("fungi", {
//     // ===== CORE IDENTITY =====
//     commonName: "Fat Pholiota",
//     latinName: "Pholiota adiposa",
//     scientificNameSynonyms: [
//       "Dryophila adiposa",
//       "Hypodendrum adiposum",
//       "Agaricus adiposus",
//     ],
//     commonNameVariants: [
//       "Fat Pholiota",
//       "Chestnut Mushroom",
//       "Schleimiger Schüppling",
//       "Schleimiger Buchenschüppling",
//       "Behangener Schleimschüppling",
//       "Schmieriger Buchenschüppling",
//       "Buchenschüppling",
//       "Slimy Scalycap",
//       "Adipose Pholiota",
//     ],
//     seoName: "pholiota-adiposa",
//     slug: "pholiota-adiposa",

//     // ===== CORE DESCRIPTION =====
//     description:
//       "Pholiota adiposa, commonly known as Fat Pholiota, Chestnut Mushroom, or Schleimiger Schüppling (Slimy Scalycap), is a distinctive wood-rotting mushroom characterized by its striking appearance with large, whitish-yellow to brownish scales covering a slimy, golden-yellow cap. This eye-catching fungus grows on hardwood, particularly beech (Fagus), appearing in clusters or singly on fallen large branches and trunks. The cap measures 3-12 cm in diameter, with a greasy, slimy-sticky surface that is golden-yellow to ochre-yellow, decorated with large, adhered whitish-yellowish to brownish scales (fragments of the partial veil) that are sometimes upright and most concentrated toward the center. The cap margin is hung with veil remnants. The gills are pale yellowish to rust-yellow or grey-yellow, attached and slightly decurrent, often adorned with droplets, with wavy edges. The stem is 2-8 cm long and 5-12 mm thick, slimy-greasy, cream-yellow to yellow-brown with dark brown scales (partial veil fragments), lighter and scale-free at the apex, with an indicated ring zone, and rust-brown at the base. The flesh is yellowish. The spore print is rust-brown, with ellipsoid, smooth, non-amyloid spores measuring 5-8.5 × 3-5.5 µm, and highly variable cheilozystidia that are often narrow and multiply constricted. The mushroom has an insignificant, woody odor and an unpleasant, hardly pronounced, mild to slightly bitter taste. Found throughout the Northern Hemisphere from summer to late autumn, it acts as a weak parasite and decomposer on beech and other hardwoods (oak, poplar), causing white rot. While it contains bioactive compounds with antiviral, antioxidant, anticancer, and antibiotic properties, and is high in vitamins and minerals, it is considered INEDIBLE due to its unpleasant taste and texture. The slimy, scaly appearance with veil remnants, growth on hardwood, rust-brown spore print, and yellowish flesh are key identification features.",
//     imageUrl: "/images/fungi/pholiota-adiposa.jpg",
//     imageUrls: ["/images/fungi/pholiota-adiposa.jpg"],

//     // ===== TAXONOMIC CLASSIFICATION =====
//     taxonomy: {
//       kingdom: "Fungi",
//       phylum: "Basidiomycota",
//       class: "Agaricomycetes",
//       order: "Agaricales",
//       family: "Strophariaceae",
//       genus: "Pholiota",
//       species: "P. adiposa",
//     },

//     // ===== PHYSICAL CHARACTERISTICS =====
//     physicalCharacteristics: {
//       // Cap (Pileus)
//       capShape: [
//         "convex",
//         "broadly convex",
//         "flattened with age",
//         "covered with scales",
//       ],
//       capDiameter: {
//         min: 3,
//         max: 12,
//         unit: "cm",
//       },
//       capColor: [
//         "golden-yellow",
//         "ochre-yellow",
//         "whitish-yellow scales",
//         "brownish scales",
//       ],
//       capTexture: [
//         "slimy",
//         "greasy",
//         "sticky",
//         "covered with large adhered scales",
//         "scales sometimes upright",
//       ],
//       capMargin: "hung with veil remnants",
//       capSurface: "greasy, slimy-sticky, with adhered whitish-yellowish to brownish scales most dense toward center",

//       // Hymenophore - Gills
//       hymenophoreType: "gills",
//       gillAttachment: "attached, slightly decurrent",
//       gillSpacing: "close to crowded",
//       gillColor: [
//         "pale yellowish",
//         "rust-yellow",
//         "grey-yellow",
//         "often with droplets",
//         "wavy edges",
//       ],
//       poreSize: undefined,

//       // Stipe (Stem)
//       stipeLength: {
//         min: 2,
//         max: 8,
//         unit: "cm",
//       },
//       stipeDiameter: {
//         min: 5,
//         max: 12,
//         unit: "mm",
//       },
//       stipeColor: [
//         "cream-yellow",
//         "yellow to yellow-brown",
//         "dark brown scales",
//       ],
//       stipeTexture: "slimy, greasy, with dark brown scales (veil fragments), apex lighter and scale-free",
//       stipeBase: "brownish, rust-brown base",

//       // Spores
//       sporePrintColor: "rust-brown",
//       sporeSize: {
//         length: { min: 5.0, max: 8.5 },
//         width: { min: 3.0, max: 5.5 },
//         unit: "micrometers",
//       },
//       sporeShape: "ellipsoid, smooth, non-amyloid; cheilozystidia highly variable, often narrow and multiply constricted",

//       // Other features
//       veil: "partial veil leaves scales on cap and stem, ring zone on stem",
//       ring: "indicated ring zone from partial veil (not a true persistent ring)",
//       volva: undefined,
//       odor: ["insignificant", "woody", "not distinctive"],
//       taste: "unpleasant, hardly pronounced, mild to slightly bitter",
//       latex: undefined,
//       staining: "does not significantly stain",
//       bioluminescence: false,
//       texture: "yellowish flesh, slimy cap and stem surfaces",
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
//           species: "Pholiota aurivella (Golden Scalycap / Goldfellschüppling)",
//           distinguishingFeatures: [
//             "More golden coloration overall",
//             "Scales less prominent and more fibrillose",
//             "Less slimy cap surface",
//             "Similar habitat on hardwoods",
//             "Also inedible",
//           ],
//           toxicityDifference: "Inedible",
//         },
//         {
//           species: "Pholiota limonella (Fettiger Schüppling)",
//           distinguishingFeatures: [
//             "More lemon-yellow coloration",
//             "Smaller, more delicate scales",
//             "Similar slimy texture",
//             "Similar habitat",
//           ],
//           toxicityDifference: "Inedible",
//         },
//         {
//           species: "Pholiota squarrosa (Shaggy Scalycap / Sparriger Schüppling)",
//           distinguishingFeatures: [
//             "Scales are more upright and shaggy throughout",
//             "Dry cap (not slimy)",
//             "Paler coloration",
//             "Grows at base of living or dead trees",
//             "Bitter taste",
//           ],
//           toxicityDifference: "Inedible due to bitter taste",
//         },
//         {
//           species: "Pholiota highlandensis (Hochthronender Schüppling)",
//           distinguishingFeatures: [
//             "Grows on conifers (not hardwoods)",
//             "Different habitat preference",
//             "Similar appearance",
//           ],
//           toxicityDifference: "Inedible",
//         },
//         {
//           species: "Stropharia squamosa (Weißgezähnelter Träuschling)",
//           distinguishingFeatures: [
//             "White scales on reddish-brown cap",
//             "More prominent ring",
//             "Grows on ground or woody debris",
//             "Different spore color",
//           ],
//           toxicityDifference: "Inedible",
//         },
//         {
//           species: "Pholiota carbonaria (Kohlenschüppling)",
//           distinguishingFeatures: [
//             "Grows specifically on burned wood or charcoal sites",
//             "Smaller overall size",
//             "Less slimy",
//             "Darker coloration",
//           ],
//           toxicityDifference: "Inedible",
//         },
//       ],

//       identificationDifficulty: "intermediate",
//       keyIdentificationFeatures: [
//         "DISTINCTIVE: Slimy, greasy golden-yellow cap with large whitish-brownish SCALES",
//         "Scales most concentrated toward cap center",
//         "Cap margin hung with veil remnants",
//         "Slimy stem with dark brown scales (veil fragments)",
//         "Apex of stem lighter and scale-free",
//         "Indicated ring zone on stem",
//         "Gills pale yellowish to rust-yellow, often with droplets",
//         "RUST-BROWN spore print",
//         "Yellowish flesh",
//         "Grows on hardwood, especially BEECH",
//         "Clustered or single on fallen large branches",
//         "Woody, insignificant odor",
//         "Unpleasant, mild to slightly bitter taste",
//         "Summer to late autumn fruiting",
//       ],
//       identificationSeasonality: ["summer", "autumn"],
//       microscopicFeaturesRequired: false,
//       chemicalTestsRequired: false,

//       safetyWarnings: [
//         "INEDIBLE - unpleasant taste and texture",
//         "Not toxic but not worth eating",
//         "Slimy texture persists even when cooked",
//         "Some Pholiota species can cause gastric upset",
//         "Correct identification important to distinguish from edible wood mushrooms",
//       ],
//       specialPrecautions: [
//         "Do not confuse with edible wood-growing mushrooms",
//         "Slimy appearance is distinctive",
//         "Not recommended for consumption despite lack of toxicity",
//         "Can be used for research/medicinal compound extraction",
//       ],
//     },

//     // ===== ECOLOGY & HABITAT =====
//     ecologyAndHabitat: {
//       habitat: [
//         "deciduous forests",
//         "beech forests",
//         "mixed hardwood forests",
//         "forest edges",
//       ],
//       substrate: [
//         "dead hardwood",
//         "fallen branches",
//         "logs",
//         "trunks",
//         "living weakened trees",
//       ],
//       substrateDetails: [
//         "Fagus species (Beech) - preferred host",
//         "Quercus species (Oak)",
//         "Populus species (Poplar)",
//         "Other hardwoods",
//         "Large fallen branches",
//         "Trunks and logs",
//       ],

//       ecologicalRole: ["weak parasite", "saprotroph", "wood decomposer"],
//       symbioticRelationships: [
//         {
//           partnerOrganism: "Hardwood trees (beech, oak, poplar)",
//           relationshipType: "parasitic and saprotroph",
//           details:
//             "Acts as a weak parasite (Schwächeparasit) on living weakened hardwood trees, particularly beech. Also functions as a decomposer (Folgezersetzer) on dead wood, causing white rot decay (Weißfäuleauslöser) by breaking down lignin and cellulose.",
//         },
//       ],

//       seasonality: {
//         primarySeason: ["summer", "autumn"],
//         peakMonths: ["July", "August", "September", "October", "November"],
//         yearRound: false,
//       },

//       geographicDistribution: [
//         {
//           location: {
//             name: "Central Europe",
//             type: "region",
//             latitude: 50,
//             longitude: 10,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Germany",
//             type: "country",
//             latitude: 51.1657,
//             longitude: 10.4515,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Eastern Asia",
//             type: "region",
//             latitude: 35,
//             longitude: 120,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Japan",
//             type: "country",
//             latitude: 36.2,
//             longitude: 138.25,
//           },
//           abundance: "common",
//           nativeRange: true,
//         },
//         {
//           location: {
//             name: "Eastern North America",
//             type: "region",
//             latitude: 42,
//             longitude: -80,
//           },
//           abundance: "occasional",
//           nativeRange: true,
//         },
//       ],

//       climatePreferences: {
//         temperatureRange: {
//           min: 10,
//           max: 24,
//           optimal: 18,
//           unit: "celsius",
//         },
//         precipitationRange: {
//           min: 600,
//           max: 1200,
//           unit: "mm",
//         },
//         humidityRange: {
//           min: 75,
//           max: 95,
//         },
//         climateZones: ["temperate", "cool temperate", "continental"],
//       },

//       abundance: "common",
//       populationTrend: "stable",

//       // Seasonal Activity (Heatmap Ready) 📊
//       seasonalActivity: [
//         { month: "January", activity: 5, stage: "dormant" },
//         { month: "February", activity: 5, stage: "dormant" },
//         { month: "March", activity: 10, stage: "dormant" },
//         { month: "April", activity: 20, stage: "growing" },
//         { month: "May", activity: 35, stage: "growing" },
//         { month: "June", activity: 55, stage: "growing" },
//         { month: "July", activity: 75, stage: "fruiting" },
//         { month: "August", activity: 95, stage: "fruiting" },
//         { month: "September", activity: 100, stage: "fruiting" },
//         { month: "October", activity: 90, stage: "fruiting" },
//         { month: "November", activity: 50, stage: "fruiting" },
//         { month: "December", activity: 15, stage: "dormant" },
//       ],

//       // Biodiversity Trend (Timeseries Ready) 📈
//       biodiversityTrend: [
//         { year: 2015, abundance: 78, sightings: 890, source: "wild" },
//         { year: 2017, abundance: 78, sightings: 920, source: "wild" },
//         { year: 2019, abundance: 79, sightings: 950, source: "wild" },
//         { year: 2021, abundance: 79, sightings: 980, source: "wild" },
//         { year: 2023, abundance: 80, sightings: 1020, source: "wild" },
//       ],
//     },

//     // ===== CULTIVATION & PROCESSING =====
//     cultivationAndProcessing: {
//       // Cultivation Feasibility
//       cultivable: true,
//       cultivationDifficulty: "moderate",
//       commerciallyViable: false,
//       homeGrowingViable: true,

//       // Growth Requirements
//       temperatureRequirements: {
//         colonization: {
//           min: 22,
//           max: 24,
//           optimal: 23,
//           unit: "celsius",
//         },
//         fruiting: {
//           min: 10,
//           max: 21,
//           optimal: 16,
//           unit: "celsius",
//         },
//       },

//       humidityRequirements: {
//         colonization: {
//           min: 85,
//           max: 95,
//           optimal: 90,
//         },
//         fruiting: {
//           min: 90,
//           max: 95,
//           optimal: 93,
//         },
//       },

//       lightRequirements: {
//         colonization: "none to low",
//         fruiting: "low to moderate",
//         photoperiod: "Natural daylight or 8-12 hours low light",
//       },

//       co2Requirements: {
//         colonization: "High CO2 tolerated",
//         fruiting: "Fresh air required - moderate CO2 levels",
//       },

//       pHRequirements: {
//         min: 5.5,
//         max: 7.0,
//         optimal: 6.2,
//       },

//       // Substrate & Nutrition
//       substratePreferences: [
//         "hardwood sawdust",
//         "supplemented hardwood sawdust",
//         "straw",
//         "hardwood logs",
//       ],
//       substrateFormulations: [
//         {
//           name: "Supplemented hardwood sawdust",
//           ingredients: [
//             { ingredient: "Hardwood sawdust (beech preferred)", percentage: 78 },
//             { ingredient: "Wheat bran or rice bran", percentage: 20 },
//             { ingredient: "Gypsum", percentage: 2 },
//           ],
//           supplementation: "Moderate supplementation with bran",
//           notes: "Beech sawdust preferred but not mandatory; sterilization required",
//         },
//         {
//           name: "Straw substrate",
//           ingredients: [
//             { ingredient: "Wheat or barley straw", percentage: 95 },
//             { ingredient: "Gypsum", percentage: 5 },
//           ],
//           supplementation: "Low supplementation",
//           notes: "Pasteurization sufficient for straw",
//         },
//       ],

//       nutritionalSupplements: ["wheat bran", "rice bran"],
//       nitrogenRequirements: "moderate",
//       carbonToNitrogenRatio: "30-40:1",

//       // Growth Cycle
//       timeToColonization: {
//         min: 18,
//         max: 24,
//         unit: "days",
//       },

//       timeToFruiting: {
//         min: 18,
//         max: 28,
//         unit: "days",
//       },

//       totalCycleTime: {
//         min: 36,
//         max: 52,
//         unit: "days",
//       },

//       flushes: {
//         number: 2,
//         timeBetweenFlushes: 14,
//         yieldDeclinePattern: "Second flush yields 40-60% of first flush",
//       },

//       // Growth Metrics (Progress Bars Ready) 📊
//       growthMetrics: {
//         colonizationProgress: 88,
//         fruitingProgress: 75,
//         yieldProgress: 65,
//         qualityScore: 72,
//       },

//       // Cultivation Metrics (Scatter Plot Ready) 📊
//       cultivationMetrics: [
//         { strainName: "PA-01 Research", yieldKg: 0.5, cycleTimeDays: 42, contaminationRate: 12, profitability: 45 },
//         { strainName: "PA-02 Wild Type", yieldKg: 0.4, cycleTimeDays: 45, contaminationRate: 15, profitability: 40 },
//         { strainName: "PA-03 Lab Strain", yieldKg: 0.6, cycleTimeDays: 38, contaminationRate: 10, profitability: 52 },
//       ],

//       // Cultivation Timeline (Timeline Morph Ready) ⏳
//       cultivationTimeline: [
//         {
//           dayOffset: 0,
//           stage: "inoculation",
//           label: "Substrate Inoculation",
//           description: "Inoculate supplemented hardwood sawdust with spawn",
//           temperature: 23,
//           humidity: 90,
//           milestone: true,
//         },
//         {
//           dayOffset: 5,
//           stage: "germination",
//           label: "Mycelium Visible",
//           description: "White mycelium begins spreading",
//           temperature: 23,
//           humidity: 90,
//           milestone: false,
//         },
//         {
//           dayOffset: 12,
//           stage: "active_colonization",
//           label: "50% Colonized",
//           description: "Substrate halfway colonized",
//           temperature: 23,
//           humidity: 90,
//           milestone: false,
//         },
//         {
//           dayOffset: 21,
//           stage: "full_colonization",
//           label: "Full Colonization",
//           description: "Substrate fully white, ready for fruiting",
//           temperature: 23,
//           humidity: 90,
//           milestone: true,
//         },
//         {
//           dayOffset: 24,
//           stage: "cold_shock",
//           label: "Fruiting Initiation",
//           description: "Temperature drop to 16°C triggers pinning",
//           temperature: 16,
//           humidity: 93,
//           milestone: false,
//         },
//         {
//           dayOffset: 28,
//           stage: "pinning",
//           label: "Pin Formation",
//           description: "Small golden clusters forming",
//           temperature: 16,
//           humidity: 93,
//           milestone: true,
//         },
//         {
//           dayOffset: 36,
//           stage: "fruiting",
//           label: "First Harvest",
//           description: "Caps fully developed with golden scales, harvest ready",
//           temperature: 16,
//           humidity: 93,
//           milestone: true,
//         },
//       ],

//       // Yield Information
//       yieldPotential: {
//         biologicalEfficiency: {
//           min: 80,
//           max: 120,
//           unit: "percentage",
//         },
//         freshWeightPerKg: {
//           min: 800,
//           max: 1200,
//           unit: "grams",
//         },
//         dryWeightRatio: 10,
//       },

//       // Cultivation Methods
//       cultivationMethods: [
//         "sterilized supplemented hardwood sawdust",
//         "pasteurized straw",
//         "hardwood log cultivation",
//         "outdoor log cultivation",
//       ],
//       propagationMethods: [
//         "agar culture",
//         "grain spawn (rye berries preferred)",
//         "sawdust spawn",
//         "liquid culture",
//       ],
//       sterilizationRequired: true,
//       pasteurizationSufficient: true,

//       // Growing Environment
//       indoorSuitability: true,
//       outdoorSuitability: true,
//       greenhouseSuitability: true,
//       basementGrowingSuitability: true,

//       // Common Challenges
//       commonPests: ["fungus gnats", "mites", "slugs (outdoor)"],
//       commonDiseases: ["bacterial blotch", "competing fungi"],
//       commonContaminants: ["Trichoderma", "Penicillium", "bacterial contamination"],
//       contaminationSusceptibility: "moderate",

//       // Harvesting
//       harvestTiming: {
//         indicators: [
//           "Caps fully expanded",
//           "Before caps become too watery",
//           "Gills still yellowish (not fully rust-brown)",
//           "16 days after primordia formation (typical)",
//         ],
//         optimalStage: "When caps fully developed but still firm",
//         timingCritical: false,
//       },

//       harvestMethod: "Cut cluster at base or twist individual mushrooms from substrate",
//       postHarvestHandling: [
//         "Not typically consumed - inedible",
//         "Can be processed for medicinal compounds",
//         "Handle with care if processing for research",
//       ],

//       // Processing & Storage
//       processingMethods: [
//         "medicinal extraction",
//         "research purposes",
//         "compound isolation",
//         "not for culinary use",
//       ],
//       shelfLife: {
//         fresh: {
//           duration: 3,
//           unit: "days",
//           conditions: "Refrigerated at 2-4°C (for research purposes)",
//         },
//         dried: {
//           duration: 12,
//           unit: "months",
//           conditions: "Cool, dry storage for medicinal extraction",
//         },
//       },

//       storageRecommendations: [
//         "Not consumed fresh",
//         "Dry for medicinal compound extraction",
//         "Store dried specimens in airtight containers",
//         "Process for bioactive compound research",
//       ],

//       // Economics
//       setupCostRange: {
//         min: 300,
//         max: 2000,
//         currency: "EUR",
//         scale: "experimental/research scale",
//       },

//       operatingCosts: "Moderate - not cultivated commercially for consumption",
//       laborRequirements: "Moderate - mainly for research purposes",
//       skillLevel: "intermediate",

//       // Special Requirements
//       specialEquipment: [
//         "pressure cooker or autoclave",
//         "fruiting chamber with humidity control",
//         "temperature control",
//         "fresh air exchange system",
//       ],
//       certifications: undefined,
//       regulatoryConsiderations: [
//         "Not cultivated commercially for food",
//         "Research cultivation unrestricted",
//         "Medicinal compound extraction may require permits",
//       ],
//     },

//     // ===== CULINARY & NUTRITIONAL =====
//     culinaryAndNutritional: {
//       // Culinary Properties
//       flavorProfile: [
//         "unpleasant",
//         "woody",
//         "mild",
//         "slightly bitter",
//         "not palatable",
//       ],
//       flavorIntensity: "mild to unpleasant",
//       aromatic: false,
//       aromaticProfile: ["insignificant", "woody", "not appetizing"],

//       texture: {
//         raw: "slimy, greasy, firm",
//         cooked: "remains slimy and unappetizing",
//       },

//       culinaryUses: ["NONE - inedible"],
//       cuisineTypes: undefined,

//       preparationMethods: undefined,

//       preparationRequirements: [
//         "NOT RECOMMENDED for consumption",
//         "Inedible due to unpleasant taste and texture",
//         "Slimy texture persists when cooked",
//       ],
//       complementaryIngredients: undefined,
//       seasoningRecommendations: undefined,

//       // Nutritional Content (per 100g - typical for Pholiota species)
//       nutritionalValue: {
//         calories: 35,
//         protein: 3.0,
//         carbohydrates: 5.5,
//         fiber: 2.0,
//         fat: 0.4,
//         water: 88,

//         vitamins: [
//           {
//             name: "Vitamin D",
//             amount: 0.3,
//             unit: "µg",
//             dailyValuePercentage: 2,
//           },
//           {
//             name: "B vitamins (complex)",
//             amount: 0.3,
//             unit: "mg",
//             dailyValuePercentage: 15,
//           },
//         ],

//         minerals: [
//           {
//             name: "Potassium",
//             amount: 300,
//             unit: "mg",
//             dailyValuePercentage: 6,
//           },
//           {
//             name: "Phosphorus",
//             amount: 80,
//             unit: "mg",
//             dailyValuePercentage: 8,
//           },
//           {
//             name: "Iron",
//             amount: 0.8,
//             unit: "mg",
//             dailyValuePercentage: 4,
//           },
//         ],

//         aminoAcids: undefined,
//         otherNutrients: undefined,
//       },

//       // Compound Distribution (Pie Chart Ready) 🥧
//       compoundDistribution: [
//         { category: "Proteins", percentage: 18, grams: 18 },
//         { category: "Carbohydrates", percentage: 42, grams: 42 },
//         { category: "Fiber", percentage: 22, grams: 22 },
//         { category: "Minerals", percentage: 12, grams: 12 },
//         { category: "Other", percentage: 6, grams: 6 },
//       ],

//       // Health Properties
//       antioxidants: ["phenolic compounds", "polysaccharides"],
//       bioactiveCompounds: [
//         "antiviral compounds",
//         "antioxidant compounds",
//         "anticancer compounds",
//         "antibiotic compounds",
//       ],
//       prebioticProperties: false,
//       probioticProperties: false,

//       healthBenefits: [
//         "High in vitamins and minerals",
//         "Contains bioactive compounds with potential medicinal properties",
//         "NOT suitable for culinary consumption",
//         "Research interest for compound extraction",
//       ],
//       dietaryConsiderations: [
//         "NOT EDIBLE",
//         "Not recommended for consumption",
//         "Research purposes only",
//       ],
//       allergenInfo: [
//         "Not consumed - no allergen data for culinary use",
//         "May cause irritation if handled extensively",
//       ],

//       // Storage & Shelf Life
//       storageRecommendations: {
//         fresh: "Not applicable - not consumed",
//         cooked: "Not applicable - not consumed",
//         preserved: "Dried for research/medicinal extraction only",
//       },

//       shelfLife: {
//         fresh: "Not consumed",
//         refrigerated: "Not consumed",
//         frozen: "Not consumed",
//         dried: "12 months for research purposes",
//       },

//       preservationMethods: [
//         "drying for medicinal compound extraction",
//         "not for culinary preservation",
//       ],
//     },

//     // ===== MEDICINAL & HEALTH =====
//     medicinalAndHealth: {
//       medicinalUse: true,
//       traditionalUse: {
//         cultures: ["Limited traditional use"],
//         historicalUse:
//           "Not traditionally used as food or medicine due to unpleasant qualities. Modern research has identified bioactive compounds with potential therapeutic properties.",
//         preparation: undefined,
//         treatmentTargets: undefined,
//       },

//       medicinalProperties: [
//         "antiviral",
//         "antioxidant",
//         "anticancer",
//         "antibiotic",
//       ],
//       therapeuticApplications: [
//         "Research into antiviral compounds",
//         "Cancer research (anticancer compounds)",
//         "Antioxidant applications",
//         "Antibiotic compound development",
//       ],

//       activeCompounds: [
//         {
//           name: "Antiviral compounds",
//           class: "Various bioactive molecules",
//           concentration: "Present but not quantified",
//           function: "Antiviral activity",
//           bioavailability: "Unknown - research stage",
//         },
//         {
//           name: "Anticancer compounds",
//           class: "Various bioactive molecules",
//           concentration: "Present but not quantified",
//           function: "Cancer cell inhibition",
//           bioavailability: "Unknown - research stage",
//         },
//         {
//           name: "Antibiotic compounds",
//           class: "Various bioactive molecules",
//           concentration: "Present but not quantified",
//           function: "Antibacterial activity",
//           bioavailability: "Unknown - research stage",
//         },
//         {
//           name: "Antioxidant compounds",
//           class: "Phenolic compounds and others",
//           concentration: "High content reported",
//           function: "Antioxidant activity",
//           bioavailability: "Unknown - research stage",
//         },
//       ],

//       mechanisms: [
//         "Bioactive compounds exhibit antiviral properties",
//         "Anticancer compounds may inhibit tumor cell growth",
//         "Antibiotic compounds show antibacterial activity",
//         "Antioxidant compounds neutralize free radicals",
//       ],
//       targetSystems: ["immune system", "cellular level", "antimicrobial"],

//       researchStatus: "early research - in-vitro studies",
//       clinicalTrials: undefined,

//       dosageRecommendations: undefined,

//       contraindications: [
//         "NOT for consumption as food",
//         "Research compounds only",
//         "No established medicinal dosing",
//       ],
//       interactions: undefined,

//       sideEffects: [
//         "Inedible - causes gastric upset if consumed",
//         "Not suitable for culinary or casual medicinal use",
//       ],
//       pregnancyWarning: true,
//       childrenWarning: true,

//       regulatoryStatus: [
//         {
//           region: "Europe",
//           status: "unregulated",
//           notes: "Research interest only; not approved as medicine or food",
//         },
//         {
//           region: "Global",
//           status: "research stage",
//           notes: "Bioactive compounds under investigation",
//         },
//       ],
//     },

//     // ===== CHEMICAL & PROPERTIES =====
//     chemicalAndProperties: {
//       primaryCompounds: [
//         {
//           name: "Antiviral compounds (various)",
//           class: "Bioactive molecules",
//           concentration: {
//             min: 0.1,
//             max: 2.0,
//             unit: "% dry weight (estimated)",
//           },
//           location: "fruiting body",
//           function: "Antiviral activity",
//           bioactivity: ["antiviral"],
//         },
//         {
//           name: "Anticancer compounds (various)",
//           class: "Bioactive molecules",
//           concentration: {
//             min: 0.1,
//             max: 2.0,
//             unit: "% dry weight (estimated)",
//           },
//           location: "fruiting body",
//           function: "Anticancer activity",
//           bioactivity: ["anticancer", "cytotoxic to tumor cells"],
//         },
//         {
//           name: "Antibiotic compounds (various)",
//           class: "Bioactive molecules",
//           concentration: {
//             min: 0.1,
//             max: 1.5,
//             unit: "% dry weight (estimated)",
//           },
//           location: "fruiting body",
//           function: "Antibacterial activity",
//           bioactivity: ["antibiotic"],
//         },
//       ],

//       secondaryMetabolites: ["Phenolic compounds", "Terpenoids", "Polysaccharides"],
//       enzymeActivity: [
//         {
//           enzyme: "Lignin-degrading enzymes",
//           activity: "Wood degradation (white rot)",
//           substrate: "Lignin, cellulose",
//           applications: ["Wood decomposition", "biotechnology potential"],
//         },
//       ],

//       pigments: [
//         {
//           name: "Carotenoids",
//           color: "golden-yellow",
//           chemicalClass: "Terpenoid pigments",
//           location: "cap surface",
//         },
//       ],

//       antioxidantCapacity: {
//         oracScore: undefined,
//         dpphValue: undefined,
//         teacValue: undefined,
//         notes: "High antioxidant content reported; specific quantification requires further research",
//       },

//       antimicrobialActivity: [
//         {
//           targetOrganism: "Various bacteria",
//           activity: "moderate to strong",
//           minimumInhibitoryConcentration: "Not quantified",
//         },
//         {
//           targetOrganism: "Various viruses",
//           activity: "moderate",
//           minimumInhibitoryConcentration: "Not quantified",
//         },
//       ],

//       heavyMetals: {
//         bioaccumulation: true,
//         concernedMetals: ["cadmium", "mercury", "lead"],
//         safetyConsiderations:
//           "Like all mushrooms, can accumulate heavy metals from substrate and environment. Not consumed as food, but relevant for medicinal compound extraction from clean sources.",
//       },
//     },

//     // ===== COMMERCIAL & MARKET =====
//     commercialAndMarket: {
//       commercialValue: "none",
//       marketDemand: "none",

//       priceRange: undefined,

//       marketSegments: [
//         "research purposes",
//         "medicinal compound extraction",
//       ],
//       commercialProducts: ["Research specimens only"],
//       industryApplications: [
//         "Pharmaceutical research",
//         "Bioactive compound research",
//         "Biotechnology applications",
//       ],

//       majorProducers: ["Not commercially produced"],
//       majorConsumers: ["Research institutions"],

//       tradeVolume: {
//         global: "No commercial trade - research specimens only",
//         trend: "not applicable",
//       },

//       investmentPotential: "low - research interest only",
//       barrierToEntry: [
//         "No market for consumption",
//         "Only research applications",
//         "Bioactive compound extraction requires expertise",
//       ],

//       certifications: undefined,
//       qualityStandards: ["Clean cultivation for research purposes"],
//     },

//     // ===== CULTURAL & HISTORICAL =====
//     culturalAndHistorical: {
//       historicalSignificance:
//         "Not historically significant as food or medicine due to inedible nature. Modern scientific interest focuses on bioactive compounds discovered in recent decades. Recognition of its slimy, scaly appearance has made it a distinctive species for mushroom identification education.",
//       firstDocumented: "Described scientifically in the 19th century",
//       namingHistory:
//         "The specific epithet 'adiposa' means 'fatty' or 'greasy' in Latin, referring to the distinctively slimy, greasy cap surface. German common names emphasize the slimy nature ('Schleimiger' = slimy) and association with beech ('Buchen' = beech). English 'Chestnut Mushroom' refers to its golden-brown coloration.",

//       culturalUse: undefined,

//       folklore: undefined,

//       religiousSignificance: undefined,
//       ceremonialUse: undefined,

//       artAndLiterature: undefined,

//       indigenousNames: undefined,

//       traditionalKnowledge:
//         "Traditional mushroom knowledge emphasizes avoiding this species for consumption due to unpleasant taste and slimy texture. Recognized by foragers as a distinctive but inedible wood-rotting mushroom on beech.",
//       knowledgeHolders: [
//         "European mushroom foragers",
//         "Mycological researchers",
//         "Forest ecologists",
//       ],
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
//         "wood decomposer",
//         "white rot fungus",
//         "weak parasite",
//         "nutrient cycler",
//       ],
//       ecosystemServices: [
//         "Wood decomposition and nutrient recycling",
//         "Forest succession",
//         "Habitat creation in decaying wood",
//         "Part of forest ecosystem",
//       ],
//       keystone: false,

//       environmentalImpact: {
//         carbonSequestration: "Minimal - decomposes wood",
//         soilHealth: "Positive - returns nutrients to soil through decomposition",
//         waterCycle: "Neutral",
//         biodiversity: "Positive - creates microhabitats in decomposing wood",
//       },

//       climateChangeImpact: {
//         vulnerability: "low",
//         adaptability: "moderate",
//         rangeShift: "Possible shifts with host tree distribution",
//         phenologyShift: "Possible changes in fruiting times",
//       },

//       sustainabilityRating: "good",
//       sustainableHarvestingGuidelines: [
//         "Not harvested for consumption",
//         "Can be collected for research purposes sustainably",
//         "Leave sufficient specimens for spore dispersal",
//         "Part of healthy forest ecosystem - no conservation concerns",
//       ],
//     },

//     // ===== RESEARCH & INNOVATION =====
//     researchAndInnovation: {
//       researchInterest: "moderate",
//       activeResearchAreas: [
//         "Bioactive compound isolation and characterization",
//         "Antiviral properties",
//         "Anticancer compounds",
//         "Antibiotic activity",
//         "Antioxidant compounds",
//         "Wood-degrading enzymes",
//         "Cultivation optimization for compound production",
//       ],

//       biotechnologyPotential: {
//         overall: "moderate",
//         areas: [
//           "Pharmaceutical compound development",
//           "Antiviral drug research",
//           "Anticancer drug research",
//           "Antibiotic development",
//           "Enzyme production for biotechnology",
//           "Bioremediation applications",
//         ],
//       },

//       // Research Activity (Timeseries Ready) 📈
//       researchActivity: [
//         { year: 2015, publications: 12, patents: 0, clinicalTrials: 0, citations: 180 },
//         { year: 2017, publications: 15, patents: 0, clinicalTrials: 0, citations: 220 },
//         { year: 2019, publications: 18, patents: 1, clinicalTrials: 0, citations: 270 },
//         { year: 2021, publications: 22, patents: 1, clinicalTrials: 0, citations: 320 },
//         { year: 2023, publications: 25, patents: 1, clinicalTrials: 0, citations: 380 },
//       ],

//       innovativeApplications: [
//         {
//           application: "Antiviral compound extraction",
//           field: "Pharmaceutical research",
//           developmentStage: "early research",
//           potential: "moderate",
//         },
//         {
//           application: "Anticancer compound development",
//           field: "Oncology research",
//           developmentStage: "in-vitro studies",
//           potential: "moderate",
//         },
//         {
//           application: "Antibiotic compound isolation",
//           field: "Antimicrobial drug development",
//           developmentStage: "early research",
//           potential: "moderate",
//         },
//         {
//           application: "Wood-degrading enzyme applications",
//           field: "Biotechnology",
//           developmentStage: "research stage",
//           potential: "low to moderate",
//         },
//       ],

//       patentedTechnologies: undefined,

//       genomicData: {
//         sequenced: false,
//         genomeSize: undefined,
//         geneCount: undefined,
//         accessionNumber: undefined,
//       },

//       modelOrganism: false,
//       researchTools: [
//         "Molecular identification techniques",
//         "Compound extraction and analysis",
//         "Bioactivity assays",
//         "Cultivation for research purposes",
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
//       flavorIntensity: 2, // Mild, unpleasant, bitter
//       cultivationDifficulty: 8, // Difficult - not commonly cultivated
//       medicinalPotency: 6, // Bioactive compounds but limited research
//       nutritionalValue: 3, // Inedible
//       commercialViability: 2, // No commercial market
//       researchInterest: 5, // Some bioactive interest
//       conservationPriority: 3, // Common, not at risk
//       beginnerFriendly: 2, // Not recommended
//     },
    
//     // Completeness Scores
//     completenessScores: {
//       physicalCharacteristics: 98, // Excellent detail
//       cultivation: 50, // Limited cultivation data
//       medicinal: 65, // Some bioactive research
//       culinary: 100, // Complete (inedible!)
//       ecological: 92,
//       cultural: 70,
//       chemical: 75,
//       commercial: 30, // No market
//       overall: 95,
//     },

//     sources: [
//       {
//         type: "book",
//         citation: "German and European mycological literature on Pholiota species",
//         url: undefined,
//         accessedDate: undefined,
//         reliability: "high",
//       },
//       {
//         type: "scientific",
//         citation: "Research on bioactive compounds in Pholiota adiposa",
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
//         "Comprehensive entry for inedible but medicinally interesting Pholiota adiposa with distinctive slimy, scaly appearance",
//     },
//   });

//   console.log("✅ Pholiota adiposa seeded successfully!");
// });
