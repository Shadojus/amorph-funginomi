/**
 * 🔍 SEARCH API ENDPOINT
 * ======================
 * 
 * Server-side search using Convex
 * Replaces client-side SearchReactor for better performance
 * 
 * POST /api/search
 * Body: { query: string, perspectives?: string[], limit?: number }
 * Returns: { results, scores, matchedPerspectives, totalResults }
 */

import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL = import.meta.env.PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(CONVEX_URL);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { query, perspectives, limit } = body;

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query parameter required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Import Convex API
    const { api } = await import('../../../convex/_generated/api');

    // Call Convex search
    const searchResults = await convex.query(api.fungi.advancedSearch, {
      query,
      perspectives,
      limit,
    });

    return new Response(
      JSON.stringify(searchResults),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Search failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Also support GET for simple queries
export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('q') || url.searchParams.get('query');
    const limit = url.searchParams.get('limit');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Import Convex API
    const { api } = await import('../../../convex/_generated/api');

    // Call Convex search
    const searchResults = await convex.query(api.fungi.advancedSearch, {
      query,
      limit: limit ? parseInt(limit) : undefined,
    });

    return new Response(
      JSON.stringify(searchResults),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Search failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
