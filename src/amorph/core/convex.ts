/**
 * 🔮 CONVEX CLIENT
 * ================
 * 
 * Convex client for server-side data fetching in Astro
 * 
 * Usage in Astro:
 * import { fetchQuery } from '@/lib/convex';
 * const fungi = await fetchQuery(api.fungi.list);
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
export async function fetchFungi() {
  try {
    // @ts-ignore - Dynamic import
    const { api } = await import('../../../convex/_generated/api');
    const fungi = await fetchQuery(api.fungi.list, {});
    
    // Transform to match expected format
    return fungi?.map((fungus: any) => ({
      _id: fungus._id,
      slug: fungus.seoName || fungus.slug,
      names: {
        common: fungus.commonName,
        scientific: fungus.latinName,
      },
      images: [
        {
          url: `/images/fungi/${fungus.seoName}.jpg`,
          alt: `${fungus.commonName} (${fungus.latinName})`,
          caption: fungus.commonName
        }
      ],
      tags: extractTags(fungus),
      description: extractDescription(fungus),
      // Pass through all perspectives as-is from schema (top-level properties)
      taxonomy: fungus.taxonomy,
      physicalCharacteristics: fungus.physicalCharacteristics,
      safetyAndIdentification: fungus.safetyAndIdentification,
      ecologyAndHabitat: fungus.ecologyAndHabitat,
      culinaryAndNutritional: fungus.culinaryAndNutritional,
      medicinalAndHealth: fungus.medicinalAndHealth,
      cultivationAndProcessing: fungus.cultivationAndProcessing,
      chemicalAndProperties: fungus.chemicalAndProperties,
      culturalAndHistorical: fungus.culturalAndHistorical,
      commercialAndMarket: fungus.commercialAndMarket,
      environmentalAndConservation: fungus.environmentalAndConservation,
      researchAndInnovation: fungus.researchAndInnovation,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch fungi:', error);
    return [];
  }
}

/**
 * Extract tags from fungus data
 */
function extractTags(fungus: any): string[] {
  const tags: string[] = [];
  
  // Culinary tags
  if (fungus.culinaryAndNutritional?.edibleRaw) tags.push('edible');
  if (fungus.culinaryAndNutritional?.toxicity) tags.push('toxic');
  if (fungus.culinaryAndNutritional?.cookingRequired) tags.push('cook-required');
  
  // Medicinal tags
  if (fungus.medicinalAndHealth?.medicinalUses?.length > 0) tags.push('medicinal');
  
  // Ecology tags
  if (fungus.ecologyAndHabitat?.season) {
    fungus.ecologyAndHabitat.season.forEach((s: string) => tags.push(s.toLowerCase()));
  }
  
  // Morphology
  if (fungus.morphologyAndIdentification?.capColor) {
    fungus.morphologyAndIdentification.capColor.forEach((c: string) => tags.push(c.toLowerCase()));
  }
  
  return tags.slice(0, 8); // Max 8 tags
}

/**
 * Extract description from fungus data
 */
function extractDescription(fungus: any): string {
  // Try description field first
  if (fungus.description) {
    return fungus.description.substring(0, 200) + '...';
  }
  
  // Try different perspectives for description
  if (fungus.culinaryAndNutritional?.culinaryUses?.[0]) {
    return fungus.culinaryAndNutritional.culinaryUses[0];
  }
  
  if (fungus.medicinalAndHealth?.medicinalUses?.[0]) {
    return fungus.medicinalAndHealth.medicinalUses[0];
  }
  
  if (fungus.ecologyAndHabitat?.ecologicalRole) {
    return fungus.ecologyAndHabitat.ecologicalRole;
  }
  
  return `${fungus.commonName} (${fungus.latinName})`;
}

/**
 * Extract active perspectives from fungus data
 */
function extractPerspectives(fungus: any): string[] {
  const perspectives: string[] = [];
  
  if (fungus.culinaryAndNutritional) perspectives.push('culinary');
  if (fungus.medicinalAndHealth) perspectives.push('medicinal');
  if (fungus.cultivationAndProcessing) perspectives.push('cultivation');
  if (fungus.safetyAndIdentification) perspectives.push('safety');
  if (fungus.ecologyAndHabitat) perspectives.push('ecology');
  if (fungus.morphologyAndIdentification) perspectives.push('morphology');
  
  return perspectives;
}

/**
 * Fetch single fungus by slug (seoName)
 * Returns full fungus data with all perspectives
 */
export async function fetchFungus(slug: string) {
  try {
    // @ts-ignore - Dynamic import
    const { api } = await import('../../../convex/_generated/api');
    const fungus = await fetchQuery(api.fungi.getBySlug, { slug });
    
    if (!fungus) return null;
    
    return {
      _id: fungus._id,
      slug: fungus.seoName,
      commonName: fungus.commonName,
      latinName: fungus.latinName,
      description: fungus.description,
      imageUrl: fungus.imageUrl,
      imageUrls: fungus.imageUrls || [],
      taxonomy: fungus.taxonomy,
      physicalCharacteristics: fungus.physicalCharacteristics,
      ecologyAndHabitat: fungus.ecologyAndHabitat,
      culinaryAndNutritional: fungus.culinaryAndNutritional,
      medicinalAndHealth: fungus.medicinalAndHealth,
      cultivationAndProcessing: fungus.cultivationAndProcessing,
      safetyAndIdentification: fungus.safetyAndIdentification,
      chemicalAndProperties: fungus.chemicalAndProperties,
      culturalAndHistorical: fungus.culturalAndHistorical,
      commercialAndMarket: fungus.commercialAndMarket,
      environmentalAndConservation: fungus.environmentalAndConservation,
      researchAndInnovation: fungus.researchAndInnovation,
    };
  } catch (error) {
    console.error(`Failed to fetch fungus with slug "${slug}":`, error);
    return null;
  }
}

export default convexClient;
