/**
 * 🗺️ MORPH MAPPER
 * ================
 * 
 * DATENGETRIEBENES Mapping-System das automatisch den richtigen Morph-Typ
 * NUR basierend auf dem tatsächlichen Datentyp und der Struktur auswählt.
 * 
 * KEINE HARDCODED MAPPINGS - Alles wird aus den Daten selbst bestimmt!
 * 
 * Mapping-Strategie:
 * 1. Datentyp-Analyse (boolean → BooleanMorph, number → NumberMorph)
 * 2. Inhalts-Struktur (URL-Pattern → ImageMorph, Date-Pattern → TimelineMorph)
 * 3. Array-Analyse (Strings → Tags/List, Objects → List)
 * 4. Semantische Hints aus Feldnamen (nur zur Priorität, nicht zum Typ)
 * 5. Fallback: TextMorph (für unbekannte Typen)
 */

export class MorphMapper {
  constructor() {
    // No hardcoded mappings - everything is data-driven!
  }

  /**
   * Main method: Determine morph type for a field - DATA DRIVEN
   * @param {string} fieldName - Name of the field (used only for priority hints)
   * @param {any} value - Value of the field (THIS determines the morph type)
   * @param {object} context - Additional context (parent object, etc.)
   * @returns {string} - Morph type (e.g., "name-morph")
   */
  getMorphType(fieldName, value, context = {}) {
    // ONLY analyze the VALUE - no hardcoded field name mappings!
    return this.getMorphByValueAnalysis(value, fieldName);
  }

  /**
   * Analyze value to determine morph type - PURELY DATA DRIVEN
   * NO hardcoded field name checks - only analyze the actual data!
   */
  getMorphByValueAnalysis(value, fieldName = '') {
    if (value === null || value === undefined) {
      return 'text-morph';
    }

    const type = typeof value;

    // Boolean values → BooleanMorph
    if (type === 'boolean') {
      return 'boolean-morph';
    }

    // Number values → NumberMorph
    if (type === 'number') {
      return 'number-morph';
    }

    // String values - analyze content structure
    if (type === 'string') {
      const trimmed = value.trim();
      
      // Empty strings
      if (trimmed.length === 0) {
        return 'text-morph';
      }

      // Image URL detection (ends with image extensions)
      if (this.isImageUrl(trimmed)) {
        return 'image-morph';
      }

      // Date/Time detection (ISO format, common date patterns)
      if (this.isDateString(trimmed)) {
        return 'timeline-morph';
      }

      // Single word or short phrase (< 30 chars, no line breaks) → could be name/tag
      if (trimmed.length < 30 && !trimmed.includes('\n')) {
        // Very short strings (< 15 chars) are often tags/categories
        if (trimmed.length < 15) {
          return 'tag-morph';
        }
        // 15-30 chars: names, titles, short descriptions
        return 'name-morph';
      }

      // Multi-line or longer text → TextMorph
      return 'text-morph';
    }

    // Array values - analyze array content
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'list-morph';
      }

      const firstItem = value[0];
      const itemType = typeof firstItem;
      
      // Array of strings
      if (itemType === 'string') {
        const avgLength = value.reduce((sum, item) => sum + (item?.length || 0), 0) / value.length;
        
        // Short strings (< 20 chars average) → Tags
        if (avgLength < 20) {
          return 'tag-morph';
        }
        // Longer strings → List
        return 'list-morph';
      }

      // Array of numbers → Could be chart data
      if (itemType === 'number') {
        return 'list-morph'; // or 'chart-morph' if we want visualization
      }

      // Array of booleans → List
      if (itemType === 'boolean') {
        return 'list-morph';
      }

      // Array of objects → List or nested data
      if (itemType === 'object' && firstItem !== null) {
        return 'list-morph';
      }

      return 'list-morph';
    }

    // Object values - analyze object structure
    if (type === 'object' && value !== null) {
      // Date object
      if (value instanceof Date) {
        return 'timeline-morph';
      }

      // Location object (has lat/lng or latitude/longitude)
      if (('lat' in value && 'lng' in value) || 
          ('latitude' in value && 'longitude' in value)) {
        return 'map-morph';
      }

      // Range object (has min/max)
      if ('min' in value && 'max' in value) {
        return 'number-morph';
      }

      // Check if it has min/max (range/measurement object)
      if ('min' in value && 'max' in value) {
        return 'number-morph';
      }

      // Generic object - use DataMorph to recursively render
      return 'data-morph';
    }

    return 'text-morph';
  }

  /**
   * Check if string is an image URL
   */
  isImageUrl(str) {
    if (typeof str !== 'string') return false;
    
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$/i;
    const hasImageExtension = imageExtensions.test(str);
    
    // Check if URL-like and has image extension
    const isUrlLike = str.startsWith('http') || str.startsWith('/') || str.startsWith('data:image');
    
    return isUrlLike && (hasImageExtension || str.includes('image') || str.startsWith('data:image'));
  }

  /**
   * Check if string is a date
   */
  isDateString(str) {
    if (typeof str !== 'string') return false;
    
    // ISO date format
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    if (isoDatePattern.test(str)) return true;
    
    // Try to parse as date
    const parsed = Date.parse(str);
    return !isNaN(parsed);
  }

  /**
   * Check if string is a URL
   */
  isUrl(str) {
    if (typeof str !== 'string') return false;
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//');
  }

  /**
   * Get field priority - DATA DRIVEN with semantic hints
   * Priority determines display order, NOT morph type!
   * 
   * Strategy:
   * 1. Base priority from morph type (data structure)
   * 2. Semantic hints from field name (boost/reduce priority)
   */
  getFieldPriority(fieldName, morphType) {
    // Base priorities by morph type (what the data IS)
    const basePriorities = {
      'name-morph': 900,      // Names usually important
      'image-morph': 850,      // Visual content
      'tag-morph': 750,        // Categories
      'text-morph': 700,       // Descriptions
      'boolean-morph': 600,    // Yes/No facts
      'number-morph': 650,     // Measurements
      'list-morph': 550,       // Lists
      'data-morph': 400,       // Nested objects
      'timeline-morph': 200,   // Dates (often metadata)
      'chart-morph': 300,      // Charts
      'map-morph': 350,        // Maps
    };

    let priority = basePriorities[morphType] || 500;

    // Semantic hints (boost/reduce based on field name)
    // These are HINTS only - they don't determine morph type!
    const lowerName = fieldName.toLowerCase();
    
    // Identity terms → boost priority
    if (lowerName.includes('name') || lowerName.includes('title') || lowerName.includes('id')) {
      priority += 100;
    }
    
    // Safety terms → high priority
    if (lowerName.includes('edib') || lowerName.includes('toxic') || 
        lowerName.includes('safe') || lowerName.includes('poison')) {
      priority += 80;
    }
    
    // Description terms → medium boost
    if (lowerName.includes('description') || lowerName.includes('summary')) {
      priority += 50;
    }
    
    // Metadata terms → reduce priority
    if (lowerName.includes('created') || lowerName.includes('updated') || 
        lowerName.includes('modified') || lowerName.includes('_id')) {
      priority -= 500; // Push to bottom
    }

    return priority;
  }

  /**
   * Get all relevant fields from a data object with their morph types
   * Returns array of { fieldName, morphType, value, priority }
   */
  getMappedFields(dataObject, options = {}) {
    const {
      excludeFields = ['_id', '_creationTime', 'slug', 'seoName'],
      maxDepth = 1,  // Only 1 level deep to avoid explosion
      maxFields = 15, // Limit to top 15 fields for performance
      currentDepth = 0,
      parentPath = ''
    } = options;

    const fields = [];

    for (const [key, value] of Object.entries(dataObject)) {
      // Skip excluded fields (imageUrl and taxonomy shown separately in card-image)
      if (excludeFields.includes(key)) continue;
      
      // Skip null/undefined
      if (value === null || value === undefined) continue;

      const fullPath = parentPath ? `${parentPath}.${key}` : key;
      const morphType = this.getMorphType(key, value, { parentPath });
      const priority = this.getFieldPriority(key, morphType);

      fields.push({
        fieldName: key,
        fullPath,
        morphType,
        value,
        priority
      });

      // For nested objects: use data-morph instead of recursion
      // This prevents explosion of morphs (1426 morphs -> ~15 morphs per card)
      if (morphType === 'data-morph' && typeof value === 'object' && !Array.isArray(value)) {
        // Don't recurse - data-morph will handle the nested object rendering
        // This keeps the morph count manageable
      }
    }

    // Sort by priority (highest first) and limit to maxFields
    const sorted = fields.sort((a, b) => b.priority - a.priority);
    return maxFields ? sorted.slice(0, maxFields) : sorted;
  }

  /**
   * Create morph element programmatically
   * Creates specialized morph components with proper attributes
   */
  createMorphElement(fieldConfig, fungusData) {
    const { fieldName, morphType, value, fullPath } = fieldConfig;
    
    // Create wrapper for morphs that need labels
    const needsWrapper = ['name-morph', 'text-morph', 'tag-morph'];
    const wrapper = needsWrapper.includes(morphType) ? document.createElement('div') : null;
    
    if (wrapper) {
      wrapper.className = 'morph-field';
      wrapper.setAttribute('data-field', fullPath || fieldName);
      
      // Add label
      const label = document.createElement('div');
      label.className = 'morph-label';
      label.textContent = this.formatFieldName(fieldName);
      wrapper.appendChild(label);
    }
    
    // Create the specialized morph element
    const element = document.createElement(morphType);
    
    // Set common attributes
    element.setAttribute('data-field', fullPath || fieldName);
    
    // Set type-specific attributes - DATA DRIVEN
    if (morphType === 'name-morph') {
      element.setAttribute('value', String(value));
      // Semantic hints for variant (only for display styling, not type selection)
      const lowerName = fieldName.toLowerCase();
      element.setAttribute('variant', lowerName.includes('latin') || lowerName.includes('scientific') ? 'latin' : 'common');
      element.setAttribute('size', lowerName.includes('common') ? 'large' : 'medium');
      
    } else if (morphType === 'image-morph') {
      element.setAttribute('src', String(value));
      // Try to get alt text from common name field if available
      element.setAttribute('alt', fungusData?.commonName || fieldName);
      element.setAttribute('aspect-ratio', '16/9');
      element.setAttribute('lazy', 'true');
      
    } else if (morphType === 'tag-morph') {
      // Handle both single values and arrays
      if (Array.isArray(value)) {
        element.setAttribute('value', value.join(', '));
      } else {
        element.setAttribute('value', String(value));
      }
      element.setAttribute('variant', 'pill');
      element.setAttribute('clickable', 'true');
      
    } else if (morphType === 'text-morph') {
      element.setAttribute('value', String(value));
      // Adaptive line limit based on text length
      const textLength = String(value).length;
      element.setAttribute('maxlines', textLength > 200 ? '5' : '3');
      element.setAttribute('size', 'medium');
      
    } else if (morphType === 'boolean-morph') {
      element.setAttribute('value', String(value));
      element.setAttribute('label', this.formatFieldName(fieldName));
      
    } else if (morphType === 'number-morph') {
      element.setAttribute('value', String(value));
      element.setAttribute('label', this.formatFieldName(fieldName));
      
    } else if (morphType === 'list-morph') {
      element.setAttribute('items', JSON.stringify(Array.isArray(value) ? value : [value]));
      element.setAttribute('label', this.formatFieldName(fieldName));
      element.setAttribute('max-items', '5');
      
    } else if (morphType === 'data-morph') {
      // Nested object - pass as JSON
      element.setAttribute('fungus-data', JSON.stringify(fungusData));
      element.setAttribute('field', fullPath || fieldName);
      element.setAttribute('mode', 'simple');
      
    } else {
      // Fallback: use text-morph
      element.setAttribute('value', typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
    
    if (wrapper) {
      wrapper.appendChild(element);
      return wrapper;
    }
    
    return element;
  }

  /**
   * Format field name for display
   * Converts camelCase to Title Case
   */
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

// Export singleton instance
export const morphMapper = new MorphMapper();

// Auto-register with AMORPH system
if (typeof window !== 'undefined') {
  if (!window.amorph) {
    window.amorph = {};
  }
  window.amorph.morphMapper = morphMapper;
  console.log('[MorphMapper] ✅ Registered with AMORPH system');
}
