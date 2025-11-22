/**
 * Generic Data Adapter for AMORPH Framework
 * 
 * Provides a unified interface for different data sources (Convex, REST, GraphQL, etc.)
 * The framework uses this adapter, staying agnostic to the actual data source.
 */

import DomainConfig from './domain.config.js';

/**
 * Base DataAdapter interface
 * All adapters must implement these methods
 */
class BaseDataAdapter {
  constructor(config) {
    this.config = config;
    this.table = config.dataSource.table;
    this.slugField = config.dataSource.slugField;
    this.nameField = config.dataSource.nameField;
  }

  /**
   * Fetch all entities
   * @returns {Promise<Array>} Array of entities
   */
  async fetchAll() {
    throw new Error('fetchAll() must be implemented by subclass');
  }

  /**
   * Fetch entity by slug
   * @param {string} slug - Entity identifier
   * @returns {Promise<Object>} Entity data
   */
  async fetchBySlug(slug) {
    throw new Error('fetchBySlug() must be implemented by subclass');
  }

  /**
   * Search entities
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results with scores
   */
  async search(query, options = {}) {
    throw new Error('search() must be implemented by subclass');
  }

  /**
   * Fetch related entities
   * @param {string} slug - Entity identifier
   * @param {number} limit - Max number of related entities
   * @returns {Promise<Array>} Related entities
   */
  async fetchRelated(slug, limit = 10) {
    throw new Error('fetchRelated() must be implemented by subclass');
  }
}

/**
 * Convex Data Adapter
 * Connects to Convex backend
 */
class ConvexDataAdapter extends BaseDataAdapter {
  constructor(config) {
    super(config);
    this.client = null; // Will be initialized when needed
  }

  /**
   * Initialize Convex client
   * @private
   */
  async _ensureClient() {
    if (this.client) return;

    // Dynamic import to avoid bundling if not used
    const { ConvexHttpClient } = await import('convex/browser');
    
    // Get Convex URL from environment or config
    const convexUrl = import.meta.env.PUBLIC_CONVEX_URL || 
                      this.config.dataSource.endpoint;
    
    this.client = new ConvexHttpClient(convexUrl);
  }

  async fetchAll() {
    await this._ensureClient();
    const results = await this.client.query('fungi:list');
    return results || [];
  }

  async fetchBySlug(slug) {
    await this._ensureClient();
    const result = await this.client.query('fungi:getBySlug', { slug });
    return result;
  }

  async search(query, options = {}) {
    await this._ensureClient();
    
    const {
      searchFields = this.config.search.searchFields,
      fieldWeights = this.config.search.fieldWeights,
      minScore = 0.1
    } = options;

    const results = await this.client.query('fungi:search', {
      query,
      searchFields,
      fieldWeights,
      minScore
    });

    return {
      results: results.matches || [],
      scores: results.scores || {},
      matchedFields: results.matchedFields || {},
      query
    };
  }

  async fetchRelated(slug, limit = 10) {
    await this._ensureClient();
    
    // Get current entity
    const entity = await this.fetchBySlug(slug);
    if (!entity) return [];

    // Get all entities for client-side similarity
    const allEntities = await this.fetchAll();
    
    // Calculate similarity using framework's similarity service
    const { calculateSimilarity } = await import('../features/bubble-view/services/HilbertSpaceSimilarity.js');
    
    const similarities = allEntities
      .filter(e => e[this.slugField] !== slug)
      .map(e => ({
        entity: e,
        similarity: calculateSimilarity(entity, e, this.config.similarity.propertyWeights)
      }))
      .filter(s => s.similarity >= this.config.similarity.minThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities.map(s => s.entity);
  }
}

/**
 * REST API Data Adapter
 * Connects to generic REST API
 */
class RestDataAdapter extends BaseDataAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.dataSource.endpoint;
    this.headers = config.dataSource.headers || {
      'Content-Type': 'application/json'
    };
  }

  async _fetch(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...options.headers }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async fetchAll() {
    return this._fetch(`/${this.table}`);
  }

  async fetchBySlug(slug) {
    return this._fetch(`/${this.table}/${slug}`);
  }

  async search(query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    return this._fetch(`/${this.table}/search?${params}`);
  }

  async fetchRelated(slug, limit = 10) {
    return this._fetch(`/${this.table}/${slug}/related?limit=${limit}`);
  }
}

/**
 * GraphQL Data Adapter
 * Connects to GraphQL API
 */
class GraphQLDataAdapter extends BaseDataAdapter {
  constructor(config) {
    super(config);
    this.endpoint = config.dataSource.endpoint;
    this.headers = config.dataSource.headers || {
      'Content-Type': 'application/json'
    };
  }

  async _query(query, variables = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const { data, errors } = await response.json();
    
    if (errors) {
      throw new Error(`GraphQL Error: ${errors[0].message}`);
    }
    
    return data;
  }

  async fetchAll() {
    const query = `
      query GetAll {
        ${this.table} {
          ${this.slugField}
          ${this.nameField}
        }
      }
    `;
    
    const data = await this._query(query);
    return data[this.table];
  }

  async fetchBySlug(slug) {
    const query = `
      query GetBySlug($slug: String!) {
        ${this.table}(${this.slugField}: $slug) {
          ${this.slugField}
          ${this.nameField}
        }
      }
    `;
    
    const data = await this._query(query, { slug });
    return data[this.table];
  }

  async search(query, options = {}) {
    const gqlQuery = `
      query Search($query: String!) {
        search${this.table}(query: $query) {
          results {
            ${this.slugField}
            ${this.nameField}
          }
          scores
        }
      }
    `;
    
    const data = await this._query(gqlQuery, { query });
    return data[`search${this.table}`];
  }

  async fetchRelated(slug, limit = 10) {
    const query = `
      query GetRelated($slug: String!, $limit: Int!) {
        ${this.table}(${this.slugField}: $slug) {
          related(limit: $limit) {
            ${this.slugField}
            ${this.nameField}
          }
        }
      }
    `;
    
    const data = await this._query(query, { slug, limit });
    return data[this.table]?.related || [];
  }
}

/**
 * Factory function to create appropriate adapter
 * @param {Object} config - Domain configuration
 * @returns {BaseDataAdapter} Data adapter instance
 */
export function createDataAdapter(config = DomainConfig) {
  const { type } = config.dataSource;

  switch (type) {
    case 'convex':
      return new ConvexDataAdapter(config);
    
    case 'rest':
      return new RestDataAdapter(config);
    
    case 'graphql':
      return new GraphQLDataAdapter(config);
    
    default:
      throw new Error(`Unknown data source type: ${type}`);
  }
}

/**
 * Singleton instance for the current domain
 */
let _adapterInstance = null;

export function getDataAdapter() {
  if (!_adapterInstance) {
    _adapterInstance = createDataAdapter(DomainConfig);
  }
  return _adapterInstance;
}

export default getDataAdapter;
