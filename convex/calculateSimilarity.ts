/**
 * 🔬 SIMILARITY CALCULATION ENGINE
 * ================================
 * 
 * Backend similarity calculations using Hilbert space logic
 * Moved from client to server for performance
 * 
 * Created: 23. November 2025
 */

import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Calculate similarity between entities based on Hilbert space
 * Uses HilbertSpaceSimilarity logic server-side
 */
export const calculate = query({
  args: {
    entitySlugs: v.array(v.string()), // Entities to calculate for
    activePerspectives: v.array(v.string()), // Current perspectives
    userInteractionIds: v.optional(v.array(v.id('userInteractions'))), // Recent interactions
    includeUserNode: v.optional(v.boolean()) // Calculate UserNode connections
  },
  handler: async (ctx, args) => {
    // Fetch all entities
    const entities = await Promise.all(
      args.entitySlugs.map(slug => 
        ctx.db
          .query('fungi')
          .filter(q => q.eq(q.field('slug'), slug))
          .first()
      )
    );
    
    const validEntities = entities.filter(e => e !== null);
    
    if (validEntities.length === 0) {
      return {
        userNodeConnections: {},
        bubbleSimilarities: {},
        metadata: { calculationTime: 0, entitiesProcessed: 0 }
      };
    }
    
    const startTime = Date.now();
    
    // Map perspective names to schema fields
    const perspectiveMapping: Record<string, string> = {
      'taxonomy': 'taxonomy',
      'physicalCharacteristics': 'physicalCharacteristics',
      'ecologyAndHabitat': 'ecologyAndHabitat',
      'culinaryAndNutritional': 'culinaryAndNutritional',
      'medicinalAndHealth': 'medicinalAndHealth',
      'cultivationAndProcessing': 'cultivationAndProcessing',
      'safetyAndIdentification': 'safetyAndIdentification',
      'chemicalAndProperties': 'chemicalAndProperties',
      'culturalAndHistorical': 'culturalAndHistorical',
      'commercialAndMarket': 'commercialAndMarket',
      'environmentalAndConservation': 'environmentalAndConservation',
      'researchAndInnovation': 'researchAndInnovation'
    };
    
    const perspectiveFields = args.activePerspectives
      .map(p => perspectiveMapping[p])
      .filter(Boolean);
    
    // Calculate UserNode connections (based on interactions + perspective relevance)
    const userNodeConnections: Record<string, number> = {};
    
    if (args.includeUserNode && args.userInteractionIds) {
      // Fetch interactions
      const interactions = await Promise.all(
        args.userInteractionIds.map(id => ctx.db.get(id))
      );
      
      const interactionMap = new Map<string, number>();
      interactions.forEach(interaction => {
        if (interaction && interaction.entitySlug) {
          interactionMap.set(
            interaction.entitySlug,
            (interactionMap.get(interaction.entitySlug) || 0) + 1
          );
        }
      });
      
      // Calculate connection weight for each entity
      validEntities.forEach(entity => {
        if (!entity) return;
        
        let weight = 0.1; // Base weight
        
        // Interaction weight (30%)
        const interactionCount = interactionMap.get(entity.slug) || 0;
        if (interactionCount > 0) {
          weight += Math.min(0.3, interactionCount * 0.1);
        }
        
        // Perspective data quality (70%)
        let perspectiveScore = 0;
        perspectiveFields.forEach(field => {
          const data = entity[field as keyof typeof entity];
          if (data && typeof data === 'object') {
            const fieldCount = Object.values(data).filter(v => 
              v !== null && v !== undefined && v !== ''
            ).length;
            if (fieldCount > 0) perspectiveScore += 1;
          }
        });
        
        if (perspectiveFields.length > 0) {
          weight += (perspectiveScore / perspectiveFields.length) * 0.7;
        }
        
        userNodeConnections[entity.slug] = Math.min(1.0, weight);
      });
    }
    
    // Calculate bubble-to-bubble similarities
    const bubbleSimilarities: Record<string, Record<string, number>> = {};
    
    for (let i = 0; i < validEntities.length; i++) {
      const entity1 = validEntities[i];
      if (!entity1) continue;
      
      bubbleSimilarities[entity1.slug] = {};
      
      for (let j = i + 1; j < validEntities.length; j++) {
        const entity2 = validEntities[j];
        if (!entity2) continue;
        
        // Calculate similarity based on active perspectives
        let totalSimilarity = 0;
        let comparedFields = 0;
        
        perspectiveFields.forEach(field => {
          const data1 = entity1[field as keyof typeof entity1];
          const data2 = entity2[field as keyof typeof entity2];
          
          if (!data1 || !data2) return;
          
          // Compare perspective data
          const similarity = comparePerspectiveData(data1, data2);
          totalSimilarity += similarity;
          comparedFields++;
        });
        
        const score = comparedFields > 0 ? totalSimilarity / comparedFields : 0;
        
        // Store bidirectional
        bubbleSimilarities[entity1.slug][entity2.slug] = score;
        if (!bubbleSimilarities[entity2.slug]) {
          bubbleSimilarities[entity2.slug] = {};
        }
        bubbleSimilarities[entity2.slug][entity1.slug] = score;
      }
    }
    
    const calculationTime = Date.now() - startTime;
    
    return {
      userNodeConnections,
      bubbleSimilarities,
      metadata: {
        calculationTime,
        entitiesProcessed: validEntities.length,
        perspectivesUsed: args.activePerspectives,
        interactionsConsidered: args.userInteractionIds?.length || 0
      }
    };
  }
});

/**
 * Compare two perspective data objects
 */
function comparePerspectiveData(data1: any, data2: any): number {
  if (!data1 || !data2) return 0;
  
  let matches = 0;
  let totalFields = 0;
  
  const fields = new Set([
    ...Object.keys(data1),
    ...Object.keys(data2)
  ]);
  
  for (const field of fields) {
    const value1 = data1[field];
    const value2 = data2[field];
    
    if (value1 === undefined && value2 === undefined) continue;
    
    totalFields++;
    
    // Compare values (simplified - same logic as HilbertSpaceSimilarity)
    if (Array.isArray(value1) && Array.isArray(value2)) {
      const commonElements = value1.filter(v => value2.includes(v));
      if (commonElements.length > 0) matches++;
    } else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
      // Nested object comparison
      const nestedSimilarity = comparePerspectiveData(value1, value2);
      if (nestedSimilarity > 0.5) matches++;
    } else if (value1 === value2) {
      matches++;
    }
  }
  
  return totalFields > 0 ? matches / totalFields : 0;
}
