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
    // IMPORTANT: Pass through ALL entity data to preserve perspective fields
    return entities?.map((entity: any) => {
      // Extract common name for display
      const commonName = entity.commonName?.value || entity.commonName || 'Unknown';
      const latinName = entity.latinName?.value || entity.latinName || '';
      const seoName = entity.seoName || entity.slug || '';
      
      return {
        // Spread ALL entity data first to preserve all perspective fields
        ...entity,
        // Then override with formatted fields
        _id: entity._id,
        slug: seoName,
        names: {
          common: commonName,
          scientific: latinName,
        },
        images: [
          {
            url: `/images/fungi/${seoName}.jpg`,
            alt: `${commonName} (${latinName})`,
            caption: commonName
          }
        ],
        tags: extractTags(entity),
        description: extractDescription(entity),
      };
    }) || [];
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
  if (entity.culinaryDimensions?.edibleRaw) tags.push('edible');
  if (entity.culinaryDimensions?.toxicity) tags.push('toxic');
  if (entity.culinaryDimensions?.cookingRequired) tags.push('cook-required');
  
  // Medicinal tags
  if (entity.medicinalIntelligence?.medicinalUses?.length > 0) tags.push('medicinal');
  
  // Ecology tags - using temporalPatterns for seasonal data
  if (entity.temporalPatterns?.seasonality?.peak_seasons) {
    entity.temporalPatterns.seasonality.peak_seasons.forEach((s: string) => tags.push(s.toLowerCase()));
  }
  
  // Morphology
  if (entity.morphology?.colorPalette) {
    entity.morphology.colorPalette.forEach((c: any) => tags.push(c.name?.toLowerCase()));
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
  if (entity.culinaryDimensions?.culinaryTraditions?.[0]?.dishes?.[0]) {
    return `Used in ${entity.culinaryDimensions.culinaryTraditions[0].dishes[0]}`;
  }
  
  if (entity.medicinalIntelligence?.useCases?.[0]?.use) {
    return entity.medicinalIntelligence.useCases[0].use;
  }
  
  if (entity.ecologicalNetwork?.trophicLevel) {
    return `Trophic level ${entity.ecologicalNetwork.trophicLevel} organism`;
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
    
    // Return ALL entity data - spread everything to preserve all perspective fields
    return {
      ...entity,
      slug: entity.seoName || entity.slug,
    };
  } catch (error) {
    console.error(`Failed to fetch entity with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch ALL entities for similarity calculations
 * Returns array of all entities with full data
 */
export async function fetchAllEntities() {
  try {
    // @ts-ignore - Dynamic import
    const { api } = await import('../../../convex/_generated/api');
    const entities = await fetchQuery(api.fungi.list, {});
    
    if (!entities) return [];
    
    // Return ALL entity data for each
    return entities.map((entity: any) => ({
      ...entity,
      slug: entity.seoName || entity.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch all entities:', error);
    return [];
  }
}

export default convexClient;
