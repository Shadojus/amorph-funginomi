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
