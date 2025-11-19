import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all fungi in the database
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fungi").collect();
  },
});

/**
 * Get a single fungus by ID
 */
export const getById = query({
  args: { id: v.id("fungi") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get a single fungus by seoName (slug)
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fungi")
      .withIndex("by_seoName", (q) => q.eq("seoName", args.slug))
      .first();
  },
});

/**
 * Get fungi by common name (partial match)
 */
export const getByCommonName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    return allFungi.filter((fungus) =>
      fungus.commonName.toLowerCase().includes(args.name.toLowerCase())
    );
  },
});

/**
 * Get fungi by latin name (partial match)
 */
export const getByLatinName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    return allFungi.filter((fungus) =>
      fungus.latinName.toLowerCase().includes(args.name.toLowerCase())
    );
  },
});

/**
 * Search fungi by any text field
 */
export const search = query({
  args: { 
    query: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    const searchTerm = args.query.toLowerCase();
    
    const results = allFungi.filter((fungus) => {
      const searchableText = [
        fungus.commonName,
        fungus.latinName,
        fungus.description,
        fungus.seoName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
    
    return args.limit ? results.slice(0, args.limit) : results;
  },
});

/**
 * Count total fungi in database
 */
export const count = query({
  args: {},
  handler: async (ctx) => {
    const fungi = await ctx.db.query("fungi").collect();
    return fungi.length;
  },
});

/**
 * Advanced search with deep field matching and perspective detection
 * Replaces client-side SearchReactor for better performance
 */
export const advancedSearch = query({
  args: {
    query: v.string(),
    perspectives: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    const searchTerm = args.query.toLowerCase().trim();

    if (searchTerm.length < 2) {
      return {
        results: allFungi,
        matchedPerspectives: {},
        totalResults: allFungi.length,
      };
    }

    // Field to perspective mapping (same as SearchReactor)
    const fieldToPerspective: Record<string, string> = {
      // Chemical & Properties
      primaryCompounds: "chemicalAndProperties",
      secondaryMetabolites: "chemicalAndProperties",
      enzymeActivity: "chemicalAndProperties",
      bioactiveCompounds: "chemicalAndProperties",
      
      // Culinary & Nutritional
      nutritionalValue: "culinaryAndNutritional",
      flavorProfile: "culinaryAndNutritional",
      preparationMethods: "culinaryAndNutritional",
      edibleRaw: "culinaryAndNutritional",
      cookingMethods: "culinaryAndNutritional",
      
      // Cultivation & Processing
      cultivationDifficulty: "cultivationAndProcessing",
      substratePreferences: "cultivationAndProcessing",
      growthConditions: "cultivationAndProcessing",
      harvestingMethods: "cultivationAndProcessing",
      
      // Medicinal & Health
      medicinalProperties: "medicinalAndHealth",
      activeCompounds: "medicinalAndHealth",
      therapeuticApplications: "medicinalAndHealth",
      medicinalUses: "medicinalAndHealth",
      
      // Research & Innovation
      activeResearchAreas: "researchAndInnovation",
      innovativeApplications: "researchAndInnovation",
      patentedTechnologies: "researchAndInnovation",
      
      // Ecology & Habitat
      substrate: "ecologyAndHabitat",
      seasonality: "ecologyAndHabitat",
      habitat: "ecologyAndHabitat",
      distribution: "ecologyAndHabitat",
      season: "ecologyAndHabitat",
      
      // Safety & Identification
      edibility: "safetyAndIdentification",
      toxicityLevel: "safetyAndIdentification",
      lookalikeSpecies: "safetyAndIdentification",
      identificationFeatures: "safetyAndIdentification",
      
      // Physical Characteristics
      capColor: "physicalCharacteristics",
      capShape: "physicalCharacteristics",
      sporePrintColor: "physicalCharacteristics",
      gillColor: "physicalCharacteristics",
      stipeColor: "physicalCharacteristics",
      
      // Taxonomy
      kingdom: "taxonomy",
      phylum: "taxonomy",
      class: "taxonomy",
      order: "taxonomy",
      family: "taxonomy",
      genus: "taxonomy",
      species: "taxonomy",
      
      // Cultural & Historical
      culturalSignificance: "culturalAndHistorical",
      traditionalUses: "culturalAndHistorical",
      folklore: "culturalAndHistorical",
      
      // Commercial & Market
      marketValue: "commercialAndMarket",
      commercialUses: "commercialAndMarket",
      cultivation: "commercialAndMarket",
      
      // Environmental & Conservation
      conservationStatus: "environmentalAndConservation",
      threatsAndChallenges: "environmentalAndConservation",
      ecologicalRole: "environmentalAndConservation",
    };

    // Weighted scoring (same as SearchReactor)
    const weights = {
      commonName: 100,
      latinName: 90,
      tags: 80,
      family: 70,
      genus: 70,
      edibility: 60,
      habitat: 50,
      description: 30,
      default: 10,
    };

    const results: Array<{
      fungus: any;
      score: number;
      matchedFields: string[];
      matchedPerspectives: string[];
    }> = [];

    const perspectiveMatchCounts: Record<string, number> = {};

    // Search each fungus
    for (const fungus of allFungi) {
      let totalScore = 0;
      const matchedFields: string[] = [];
      const matchedPerspectives: Set<string> = new Set();

      // Helper to check if value matches search term
      const matches = (value: any): boolean => {
        if (!value) return false;
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm);
        }
        if (Array.isArray(value)) {
          return value.some((v) => matches(v));
        }
        if (typeof value === "object") {
          return Object.values(value).some((v) => matches(v));
        }
        return false;
      };

      // Check high-priority fields first
      if (matches(fungus.commonName)) {
        totalScore += weights.commonName;
        matchedFields.push("commonName");
      }

      if (matches(fungus.latinName)) {
        totalScore += weights.latinName;
        matchedFields.push("latinName");
      }

      // Check taxonomy
      if (fungus.taxonomy) {
        if (matches(fungus.taxonomy.family)) {
          totalScore += weights.family;
          matchedFields.push("taxonomy.family");
          matchedPerspectives.add("taxonomy");
        }
        if (matches(fungus.taxonomy.genus)) {
          totalScore += weights.genus;
          matchedFields.push("taxonomy.genus");
          matchedPerspectives.add("taxonomy");
        }
        if (
          matches(fungus.taxonomy.kingdom) ||
          matches(fungus.taxonomy.phylum) ||
          matches(fungus.taxonomy.class) ||
          matches(fungus.taxonomy.order) ||
          matches(fungus.taxonomy.species)
        ) {
          totalScore += weights.default;
          matchedPerspectives.add("taxonomy");
        }
      }

      // Deep search all perspective objects
      const perspectives = [
        { key: "physicalCharacteristics", data: fungus.physicalCharacteristics },
        { key: "safetyAndIdentification", data: fungus.safetyAndIdentification },
        { key: "ecologyAndHabitat", data: fungus.ecologyAndHabitat },
        { key: "culinaryAndNutritional", data: fungus.culinaryAndNutritional },
        { key: "medicinalAndHealth", data: fungus.medicinalAndHealth },
        { key: "cultivationAndProcessing", data: fungus.cultivationAndProcessing },
        { key: "chemicalAndProperties", data: fungus.chemicalAndProperties },
        { key: "culturalAndHistorical", data: fungus.culturalAndHistorical },
        { key: "commercialAndMarket", data: fungus.commercialAndMarket },
        { key: "environmentalAndConservation", data: fungus.environmentalAndConservation },
        { key: "researchAndInnovation", data: fungus.researchAndInnovation },
      ];

      for (const perspective of perspectives) {
        if (!perspective.data) continue;

        // Check each field in perspective
        for (const [field, value] of Object.entries(perspective.data)) {
          if (matches(value)) {
            const fieldPath = `${perspective.key}.${field}`;
            matchedFields.push(fieldPath);
            matchedPerspectives.add(perspective.key);

            // Get weight for this field
            const weight = weights[field as keyof typeof weights] || weights.default;
            totalScore += weight;
          }
        }
      }

      // If we have matches, add to results
      if (totalScore > 0) {
        results.push({
          fungus,
          score: totalScore,
          matchedFields,
          matchedPerspectives: Array.from(matchedPerspectives),
        });

        // Count perspective matches
        matchedPerspectives.forEach((p) => {
          perspectiveMatchCounts[p] = (perspectiveMatchCounts[p] || 0) + 1;
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply limit if specified
    const limitedResults = args.limit ? results.slice(0, args.limit) : results;

    return {
      results: limitedResults.map((r) => r.fungus),
      scores: Object.fromEntries(limitedResults.map((r) => [r.fungus._id, r.score])),
      matchedFields: Object.fromEntries(limitedResults.map((r) => [r.fungus._id, r.matchedFields])),
      matchedPerspectives: perspectiveMatchCounts,
      totalResults: results.length,
      query: args.query,
    };
  },
});
