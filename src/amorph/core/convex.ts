/**
 * 🔮 CONVEX CLIENT
 * ================
 * 
 * Convex client for server-side data fetching in Astro
 * 
 * Usage in Astro:
 * import { fetchQuery } from '@/lib/convex';
 * const entities = await fetchQuery(api.fungi.list);
 */

import { ConvexHttpClient } from 'convex/browser';

// Get Convex URL from environment
const CONVEX_URL = import.meta.env?.PUBLIC_CONVEX_URL as string | undefined;

if (!CONVEX_URL) {
  console.warn('⚠️ CONVEX_URL not found in environment variables');
}

// Create HTTP client for SSR
export const convexClient = new ConvexHttpClient(CONVEX_URL || '');

/**
 * Fetch query with error handling
 */
export async function fetchQuery(query: any, args: any = {}) {
  try {
    return await convexClient.query(query, args);
  } catch (error) {
    console.error('Convex query failed:', error);
    return null;
  }
}

/**
 * Type-safe query wrapper
 */
export async function fetchEntities() {
  try {
    // @ts-ignore - Dynamic import
    const { api } = await import('../../../convex/_generated/api');
    const entities = await fetchQuery(api.fungi.list, {});
    
    // Transform to match expected format
    return entities?.map((entity: any) => ({
      _id: entity._id,
      slug: entity.seoName || entity.slug,
      names: {
        common: entity.commonName,
        scientific: entity.latinName,
      },
      images: [
        {
          // Uses domain from convex backend - hardcoded per instance
          url: `/images/fungi/${entity.seoName}.jpg`,
          alt: `${entity.commonName} (${entity.latinName})`,
          caption: entity.commonName
        }
      ],
      tags: extractTags(entity),
      description: extractDescription(entity),
      // Pass through all perspectives as-is from schema (top-level properties)
      taxonomy: entity.taxonomy,
      physicalCharacteristics: entity.physicalCharacteristics,
      safetyAndIdentification: entity.safetyAndIdentification,
      ecologyAndHabitat: entity.ecologyAndHabitat,
      culinaryAndNutritional: entity.culinaryAndNutritional,
      medicinalAndHealth: entity.medicinalAndHealth,
      cultivationAndProcessing: entity.cultivationAndProcessing,
      chemicalAndProperties: entity.chemicalAndProperties,
      culturalAndHistorical: entity.culturalAndHistorical,
      commercialAndMarket: entity.commercialAndMarket,
      environmentalAndConservation: entity.environmentalAndConservation,
      researchAndInnovation: entity.researchAndInnovation,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch entities:', error);
    return [];
  }
}

/**
 * Extract tags from entity data
 */
function extractTags(entity: any): string[] {
  const tags: string[] = [];
  
  // Culinary tags
  if (entity.culinaryAndNutritional?.edibleRaw) tags.push('edible');
  if (entity.culinaryAndNutritional?.toxicity) tags.push('toxic');
  if (entity.culinaryAndNutritional?.cookingRequired) tags.push('cook-required');
  
  // Medicinal tags
  if (entity.medicinalAndHealth?.medicinalUses?.length > 0) tags.push('medicinal');
  
  // Ecology tags
  if (entity.ecologyAndHabitat?.season) {
    entity.ecologyAndHabitat.season.forEach((s: string) => tags.push(s.toLowerCase()));
  }
  
  // Morphology
  if (entity.morphologyAndIdentification?.capColor) {
    entity.morphologyAndIdentification.capColor.forEach((c: string) => tags.push(c.toLowerCase()));
  }
  
  return tags.slice(0, 8); // Max 8 tags
}

/**
 * Extract description from entity data
 */
function extractDescription(entity: any): string {
  // Try description field first
  if (entity.description) {
    return entity.description.substring(0, 200) + '...';
  }
  
  // Try different perspectives for description
  if (entity.culinaryAndNutritional?.culinaryUses?.[0]) {
    return entity.culinaryAndNutritional.culinaryUses[0];
  }
  
  if (entity.medicinalAndHealth?.medicinalUses?.[0]) {
    return entity.medicinalAndHealth.medicinalUses[0];
  }
  
  if (entity.ecologyAndHabitat?.ecologicalRole) {
    return entity.ecologyAndHabitat.ecologicalRole;
  }
  
  return `${entity.commonName} (${entity.latinName})`;
}

/**
 * Extract active perspectives from entity data
 */
function extractPerspectives(entity: any): string[] {
  const perspectives: string[] = [];
  
  if (entity.culinaryAndNutritional) perspectives.push('culinary');
  if (entity.medicinalAndHealth) perspectives.push('medicinal');
  if (entity.cultivationAndProcessing) perspectives.push('cultivation');
  if (entity.safetyAndIdentification) perspectives.push('safety');
  if (entity.ecologyAndHabitat) perspectives.push('ecology');
  if (entity.morphologyAndIdentification) perspectives.push('morphology');
  
  return perspectives;
}

/**
 * Fetch single entity by slug (seoName)
 * Returns full entity data with all perspectives
 */
export async function fetchEntity(slug: string) {
  try {
    // @ts-ignore - Dynamic import
    const { api } = await import('../../../convex/_generated/api');
    const entity = await fetchQuery(api.fungi.getBySlug, { slug });
    
    if (!entity) return null;
    
    return {
      _id: entity._id,
      slug: entity.seoName,
      commonName: entity.commonName,
      latinName: entity.latinName,
      description: entity.description,
      imageUrl: entity.imageUrl,
      imageUrls: entity.imageUrls || [],
      taxonomy: entity.taxonomy,
      physicalCharacteristics: entity.physicalCharacteristics,
      ecologyAndHabitat: entity.ecologyAndHabitat,
      culinaryAndNutritional: entity.culinaryAndNutritional,
      medicinalAndHealth: entity.medicinalAndHealth,
      cultivationAndProcessing: entity.cultivationAndProcessing,
      safetyAndIdentification: entity.safetyAndIdentification,
      chemicalAndProperties: entity.chemicalAndProperties,
      culturalAndHistorical: entity.culturalAndHistorical,
      commercialAndMarket: entity.commercialAndMarket,
      environmentalAndConservation: entity.environmentalAndConservation,
      researchAndInnovation: entity.researchAndInnovation,
    };
  } catch (error) {
    console.error(`Failed to fetch entity with slug "${slug}":`, error);
    return null;
  }
}

export default convexClient;
