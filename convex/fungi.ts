import { query } from "./_generated/server";
import { v } from "convex/values";
import { 
  fieldToPerspectiveIndex,
  getFieldKeyToPerspectiveMapping,
  getPerspectiveForField
} from "./perspectiveFieldMappings";

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
    return allFungi.filter((fungus) => {
      const commonName = fungus.commonName?.value || "";
      return typeof commonName === "string" && commonName.toLowerCase().includes(args.name.toLowerCase());
    });
  },
});

/**
 * Get fungi by latin name (partial match)
 */
export const getByLatinName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const allFungi = await ctx.db.query("fungi").collect();
    return allFungi.filter((fungus) => {
      const latinName = fungus.latinName?.value || "";
      return typeof latinName === "string" && latinName.toLowerCase().includes(args.name.toLowerCase());
    });
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
    const searchQuery = args.query.toLowerCase().trim();

    if (searchQuery.length < 2) {
      return {
        results: allFungi,
        matchedPerspectives: {},
        totalResults: allFungi.length,
      };
    }

    // Multi-word support: split query into terms
    // "edible mushroom autumn" → ["edible", "mushroom", "autumn"]
    const searchTerms = searchQuery
      .split(/\s+/)
      .filter(term => term.length >= 2);  // Filter out single letters
    
    console.log(`[advancedSearch] Query: "${searchQuery}" → ${searchTerms.length} terms:`, searchTerms);

    // NOW USING CENTRALIZED MAPPINGS from perspectiveFieldMappings.ts
    // When schema changes, only update perspectiveFieldMappings.ts!
    const fieldToPerspective = fieldToPerspectiveIndex;

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

      // Helper to check if value matches ANY search term (OR logic)
      // Returns: { matched: boolean, matchCount: number, exactMatch: boolean }
      const matches = (value: any): { matched: boolean; matchCount: number; exactMatch: boolean } => {
        if (!value) return { matched: false, matchCount: 0, exactMatch: false };
        
        if (typeof value === "string") {
          const lowerValue = value.toLowerCase();
          let matchCount = 0;
          let exactMatch = false;
          
          // Check each search term
          for (const term of searchTerms) {
            if (lowerValue.includes(term)) {
              matchCount++;
              // Exact word match gets bonus
              const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
              if (wordBoundaryRegex.test(value)) {
                exactMatch = true;
              }
            }
          }
          
          return { 
            matched: matchCount > 0, 
            matchCount, 
            exactMatch 
          };
        }
        
        if (Array.isArray(value)) {
          let totalMatches = 0;
          let hasExactMatch = false;
          let matched = false;
          
          for (const item of value) {
            const result = matches(item);
            if (result.matched) {
              matched = true;
              totalMatches += result.matchCount;
              if (result.exactMatch) hasExactMatch = true;
            }
          }
          
          return { matched, matchCount: totalMatches, exactMatch: hasExactMatch };
        }
        
        if (typeof value === "object") {
          let totalMatches = 0;
          let hasExactMatch = false;
          let matched = false;
          
          for (const v of Object.values(value)) {
            const result = matches(v);
            if (result.matched) {
              matched = true;
              totalMatches += result.matchCount;
              if (result.exactMatch) hasExactMatch = true;
            }
          }
          
          return { matched, matchCount: totalMatches, exactMatch: hasExactMatch };
        }
        
        return { matched: false, matchCount: 0, exactMatch: false };
      };

      // Check high-priority fields first
      const commonNameMatch = matches(fungus.commonName?.value);
      if (commonNameMatch.matched) {
        // Score multiplier based on match quality
        const multiplier = commonNameMatch.exactMatch ? 2 : 1;
        totalScore += weights.commonName * commonNameMatch.matchCount * multiplier;
        matchedFields.push("commonName");
      }

      const latinNameMatch = matches(fungus.latinName?.value);
      if (latinNameMatch.matched) {
        const multiplier = latinNameMatch.exactMatch ? 2 : 1;
        totalScore += weights.latinName * latinNameMatch.matchCount * multiplier;
        matchedFields.push("latinName");
      }

      // Check taxonomy
      if (fungus.taxonomy?.value) {
        const taxonomy = fungus.taxonomy.value as Record<string, any>;
        const familyMatch = matches(taxonomy.family);
        if (familyMatch.matched) {
          const multiplier = familyMatch.exactMatch ? 2 : 1;
          totalScore += weights.family * familyMatch.matchCount * multiplier;
          matchedFields.push("taxonomy.family");
          matchedPerspectives.add("taxonomy");
        }
        
        const genusMatch = matches(taxonomy.genus);
        if (genusMatch.matched) {
          const multiplier = genusMatch.exactMatch ? 2 : 1;
          totalScore += weights.genus * genusMatch.matchCount * multiplier;
          matchedFields.push("taxonomy.genus");
          matchedPerspectives.add("taxonomy");
        }
        
        // Check other taxonomy fields
        const taxonomyFields = ['kingdom', 'phylum', 'class', 'order', 'species'] as const;
        for (const field of taxonomyFields) {
          const match = matches(taxonomy[field]);
          if (match.matched) {
            totalScore += weights.default * match.matchCount;
            matchedPerspectives.add("taxonomy");
          }
        }
      }

      // Deep search all perspective objects
      // Dynamically build perspectives array from field mapping
      const perspectiveMapping = getFieldKeyToPerspectiveMapping();
      const perspectives = Object.entries(perspectiveMapping).map(([key, perspectiveId]) => ({
        key,
        perspectiveId,
        data: fungus[key as keyof typeof fungus]
      }));

      // Check each perspective
      for (const perspective of perspectives) {
        if (!perspective.data) continue;
        
        // Check each field in perspective
        for (const [field, value] of Object.entries(perspective.data)) {
          const match = matches(value);
          if (match.matched) {
            const fieldPath = `${perspective.key}.${field}`;
            matchedFields.push(fieldPath);
            matchedPerspectives.add(perspective.perspectiveId);

            // Get weight for this field
            const weight = weights[field as keyof typeof weights] || weights.default;
            // Multi-term bonus: more terms matched = higher score
            const multiplier = match.exactMatch ? 2 : 1;
            totalScore += weight * match.matchCount * multiplier;
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
