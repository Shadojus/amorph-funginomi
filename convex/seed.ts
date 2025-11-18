/**
 * 🌱 SEED ALL FUNGI
 * =================
 * 
 * Seeds all fungi data by directly inserting into database
 * 
 * Usage:
 * npx convex run seed:default
 * 
 * Note: Run individual seed files with:
 * npx convex run seed_beauveria_bassiana:default
 * npx convex run seed_hypsizygus_tessellatus:default  
 * npx convex run seed_pholiota_adiposa:default
 * npx convex run seed_cordyceps_militaris:default
 * npx convex run seed_fomitopsis_betulina:default
 * npx convex run seed_hericium_erinaceus:default
 * npx convex run seed_panellus_stipticus:default
 */

import { mutation } from "./_generated/server";

export default mutation(async ({ db }) => {
  console.log("🌱 Starting seed process...");
  
  try {
    // Clear existing data
    const existing = await db.query("fungi").collect();
    console.log(`🗑️ Clearing ${existing.length} existing fungi...`);
    for (const fungus of existing) {
      await db.delete(fungus._id);
    }
    
    console.log("\n📦 Please run individual seed files:");
    console.log("  npx convex run seed_beauveria_bassiana:default");
    console.log("  npx convex run seed_hypsizygus_tessellatus:default");
    console.log("  npx convex run seed_pholiota_adiposa:default");
    console.log("  npx convex run seed_cordyceps_militaris:default");
    console.log("  npx convex run seed_fomitopsis_betulina:default");
    console.log("  npx convex run seed_hericium_erinaceus:default");
    console.log("  npx convex run seed_panellus_stipticus:default");
    
    // Count results
    const total = await db.query("fungi").collect();
    
    return {
      success: true,
      count: total.length,
      message: "Database cleared. Please run individual seed files."
    };
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
});
