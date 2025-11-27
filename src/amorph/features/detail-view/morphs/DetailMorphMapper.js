/**
 * 🔮 DETAIL MORPH MAPPER
 * ======================
 * 
 * Data-driven morph creation for detail view.
 * Analyzes data structure and creates appropriate morphs automatically.
 * 
 * Based on grid-view MorphMapper pattern but optimized for detail pages.
 * 
 * Usage:
 * import { DetailMorphMapper } from './DetailMorphMapper.js';
 * 
 * const mapper = new DetailMorphMapper();
 * const morphConfigs = mapper.getMappedFields(perspectiveData);
 * 
 * morphConfigs.forEach(config => {
 *   const element = mapper.createMorphElement(config);
 *   container.appendChild(element);
 * });
 */

import { getPerspectiveColor } from './morphs/tokens.js';

/**
 * Morph type detection priorities
 */
const MORPH_TYPES = {
  TIMELINE: 'timeline',
  RADAR: 'radar',
  RANGE: 'range',
  TAGS: 'tags',
  KEY_VALUE: 'keyvalue',
  DATA: 'data',
  TEXT: 'text'
};

/**
 * Field names that suggest specific morph types
 */
const FIELD_HINTS = {
  timeline: ['lifecycle', 'stages', 'timeline', 'growth', 'cultivation', 'process', 'cycle'],
  radar: ['scores', 'ratings', 'profile', 'properties', 'compounds', 'metrics', 'levels'],
  range: ['temperature', 'humidity', 'ph', 'range', 'pressure', 'duration', 'time'],
  tags: ['tags', 'categories', 'keywords', 'types', 'classifications', 'uses', 'applications']
};

export class DetailMorphMapper {
  constructor(options = {}) {
    this.perspective = options.perspective || '';
    this.color = options.color || getPerspectiveColor(this.perspective);
  }

  /**
   * Unwrap citedValue wrapper if present
   */
  unwrapCitedValue(value) {
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  }

  /**
   * Format field name for display
   */
  formatFieldName(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Check if value is a range object
   */
  isRangeObject(value) {
    return typeof value === 'object' && value !== null && 
           'min' in value && 'max' in value;
  }

  /**
   * Check if array looks like timeline data
   */
  isTimelineArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    const first = this.unwrapCitedValue(arr[0]);
    return typeof first === 'object' && 
           (first.dayOffset !== undefined || first.day !== undefined || first.stage !== undefined);
  }

  /**
   * Check if array/object looks like radar data
   */
  isRadarData(value) {
    // Array format: [{ axis: 'Flavor', value: 80 }, ...]
    if (Array.isArray(value) && value.length >= 3) {
      const first = this.unwrapCitedValue(value[0]);
      if (typeof first === 'object' && 
          (first.axis || first.value !== undefined || first.score !== undefined)) {
        return true;
      }
    }
    // Object format: { flavor: 80, potency: 60, ... }
    if (typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value);
      if (entries.length >= 3 && entries.every(([_, v]) => typeof v === 'number')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Detect the best morph type for a field
   */
  detectMorphType(key, value) {
    const unwrapped = this.unwrapCitedValue(value);
    const lowerKey = key.toLowerCase();

    // Check field name hints first
    for (const [morphType, hints] of Object.entries(FIELD_HINTS)) {
      if (hints.some(hint => lowerKey.includes(hint))) {
        // Verify the data structure matches
        if (morphType === 'timeline' && this.isTimelineArray(unwrapped)) {
          return MORPH_TYPES.TIMELINE;
        }
        if (morphType === 'radar' && this.isRadarData(unwrapped)) {
          return MORPH_TYPES.RADAR;
        }
        if (morphType === 'range' && this.isRangeObject(unwrapped)) {
          return MORPH_TYPES.RANGE;
        }
        if (morphType === 'tags' && Array.isArray(unwrapped)) {
          return MORPH_TYPES.TAGS;
        }
      }
    }

    // Data structure based detection
    if (this.isRangeObject(unwrapped)) {
      return MORPH_TYPES.RANGE;
    }

    if (this.isTimelineArray(unwrapped)) {
      return MORPH_TYPES.TIMELINE;
    }

    if (this.isRadarData(unwrapped)) {
      return MORPH_TYPES.RADAR;
    }

    // Array of primitives → tags
    if (Array.isArray(unwrapped)) {
      if (unwrapped.every(item => typeof item !== 'object' || item === null)) {
        return MORPH_TYPES.TAGS;
      }
    }

    // Simple string
    if (typeof unwrapped === 'string') {
      return MORPH_TYPES.TEXT;
    }

    // Small flat object → key-value
    if (typeof unwrapped === 'object' && unwrapped !== null) {
      const entries = Object.entries(unwrapped);
      const allPrimitive = entries.every(([_, v]) => {
        const uv = this.unwrapCitedValue(v);
        return typeof uv !== 'object' || uv === null || this.isRangeObject(uv);
      });
      if (allPrimitive && entries.length <= 8) {
        return MORPH_TYPES.KEY_VALUE;
      }
    }

    // Default: generic data morph
    return MORPH_TYPES.DATA;
  }

  /**
   * Calculate display priority for a field
   */
  calculatePriority(key, morphType, value) {
    const unwrapped = this.unwrapCitedValue(value);
    let priority = 50;

    // Boost visual morphs
    if (morphType === MORPH_TYPES.RADAR) priority += 20;
    if (morphType === MORPH_TYPES.TIMELINE) priority += 15;
    if (morphType === MORPH_TYPES.RANGE) priority += 10;

    // Boost based on data richness
    if (Array.isArray(unwrapped)) {
      priority += Math.min(unwrapped.length * 2, 20);
    }
    if (typeof unwrapped === 'object' && unwrapped !== null) {
      const keys = Object.keys(unwrapped);
      priority += Math.min(keys.length * 2, 20);
    }

    // Boost important field names
    const importantFields = ['edibility', 'toxicity', 'habitat', 'season', 'uses', 'compounds'];
    if (importantFields.some(f => key.toLowerCase().includes(f))) {
      priority += 15;
    }

    return priority;
  }

  /**
   * Analyze data object and return morph configurations
   */
  getMappedFields(dataObject, options = {}) {
    if (!dataObject || typeof dataObject !== 'object') {
      return [];
    }

    const unwrapped = this.unwrapCitedValue(dataObject);
    if (!unwrapped || typeof unwrapped !== 'object') {
      return [];
    }

    const configs = [];

    for (const [key, value] of Object.entries(unwrapped)) {
      const unwrappedValue = this.unwrapCitedValue(value);
      
      // Skip null/undefined values
      if (unwrappedValue === null || unwrappedValue === undefined) continue;
      
      // Skip empty arrays
      if (Array.isArray(unwrappedValue) && unwrappedValue.length === 0) continue;
      
      // Skip empty objects
      if (typeof unwrappedValue === 'object' && 
          !Array.isArray(unwrappedValue) && 
          Object.keys(unwrappedValue).length === 0) continue;

      const morphType = this.detectMorphType(key, value);
      const priority = this.calculatePriority(key, morphType, value);

      configs.push({
        fieldName: key,
        label: this.formatFieldName(key),
        morphType,
        value: unwrappedValue,
        priority
      });
    }

    // Sort by priority (highest first)
    configs.sort((a, b) => b.priority - a.priority);

    return configs;
  }

  /**
   * Create a morph DOM element from config
   */
  createMorphElement(config) {
    const { fieldName, label, morphType, value } = config;
    let element;

    switch (morphType) {
      case MORPH_TYPES.TIMELINE:
        element = document.createElement('timeline-morph');
        element.data = value;
        element.label = label;
        element.perspective = this.perspective;
        element.color = this.color;
        break;

      case MORPH_TYPES.RADAR:
        element = document.createElement('radar-chart-morph');
        element.data = value;
        element.label = label;
        element.perspective = this.perspective;
        element.color = this.color;
        break;

      case MORPH_TYPES.RANGE:
        element = document.createElement('range-morph');
        element.data = value;
        element.label = label;
        element.color = this.color;
        break;

      case MORPH_TYPES.TAGS:
        element = document.createElement('tag-morph');
        element.tags = value;
        element.label = label;
        element.color = this.color;
        break;

      case MORPH_TYPES.KEY_VALUE:
        element = document.createElement('key-value-morph');
        element.data = value;
        element.label = label;
        break;

      case MORPH_TYPES.TEXT:
        element = document.createElement('text-morph');
        element.value = value;
        element.label = label;
        break;

      case MORPH_TYPES.DATA:
      default:
        element = document.createElement('data-morph');
        element.entityData = { [fieldName]: value };
        element.field = fieldName;
        element.label = label;
        element.perspective = this.perspective;
        break;
    }

    // Add data attributes for search/filtering
    element.dataset.morph = 'true';
    element.dataset.morphType = morphType;
    element.dataset.field = fieldName;

    return element;
  }

  /**
   * Create all morph elements for a data object
   */
  createMorphElements(dataObject, options = {}) {
    const configs = this.getMappedFields(dataObject, options);
    return configs.map(config => this.createMorphElement(config));
  }
}

/**
 * Convenience function to render morphs into a container
 */
export function renderMorphs(container, dataObject, options = {}) {
  const mapper = new DetailMorphMapper(options);
  const elements = mapper.createMorphElements(dataObject);
  
  // Clear container
  container.innerHTML = '';
  
  // Append all morphs
  elements.forEach(el => container.appendChild(el));
  
  return elements;
}

export default DetailMorphMapper;
