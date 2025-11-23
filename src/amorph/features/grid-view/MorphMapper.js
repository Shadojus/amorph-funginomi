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
    
    // Check for Range objects

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
        const maxLength = Math.max(...value.map(item => item?.length || 0));
        
        // Tags: Kurze Strings ODER kleine Arrays mit mäßig langen Strings
        if (avgLength < 20 || (value.length <= 6 && maxLength < 40)) {
          console.log(`[MorphMapper] ✅ tag-morph: "${fieldName}" (${value.length} items)`);
          return 'tag-morph';
        }
        // Longer strings → List
        return 'list-morph';
      }

      // Array of numbers → Data-driven detection
      if (itemType === 'number') {
        // 2-4 values: Too few for charts, use list
        if (value.length < 5) {
          return 'list-morph';
        }
        // 5-15 Werte: Sparkline (Trend macht Sinn)
        if (value.length >= 5 && value.length <= 15) {
          return 'sparkline-morph';
        }
        // Mehr als 15: Liste (zu viele Werte für Chart)
        return 'list-morph';
      }

      // Array of booleans → List
      if (itemType === 'boolean') {
        return 'list-morph';
      }

      // Array of objects → NUR für klar strukturierte Chart-Daten
      if (itemType === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem);
        
        // MAP CHECK FIRST: [{location: {latitude, longitude}, ...}] or [{lat, lon, ...}]
        if (keys.includes('location') && firstItem.location && 
            typeof firstItem.location === 'object' &&
            (firstItem.location.latitude !== undefined || firstItem.location.lat !== undefined)) {
          return 'map-morph';
        }
        // Direct lat/lon format: [{lat, lon, ...}]
        if ((keys.includes('lat') || keys.includes('latitude')) && 
            (keys.includes('lon') || keys.includes('lng') || keys.includes('longitude'))) {
          return 'map-morph';
        }
        
        // TIMELINE CHECK: [{dayOffset, stage, ...}] or [{day_start, phase, ...}] or [{date, event, ...}]
        if ((keys.includes('dayOffset') || keys.includes('day_start') || keys.includes('day_end') || 
             keys.includes('date') || keys.includes('timestamp') || keys.includes('year')) &&
            (keys.includes('stage') || keys.includes('phase') || keys.includes('label') || 
             keys.includes('event') || keys.includes('tasks'))) {
          return 'timeline-morph';
        }
        
        // Chart detection: Focus on REQUIRED fields only, ignore extra metadata fields
        // This allows rich objects like {category, strength, evidence_level, mechanisms} to work
        
        // Radar Chart: category/axis/dimension + value/score/strength/intensity (3-12 items, flexible structure)
        const hasRadarLabel = keys.includes('axis') || keys.includes('dimension') || 
                              keys.includes('category') || keys.includes('factor');
        const hasRadarValue = keys.includes('value') || keys.includes('score') || 
                              keys.includes('rating') || keys.includes('strength') || 
                              keys.includes('intensity') || keys.includes('difficulty');
        
        if (value.length >= 3 && value.length <= 12 && hasRadarLabel && hasRadarValue) {
          // Verify all items have these required fields (ignore extra fields)
          const allHaveRequiredFields = value.every(item => {
            const itemKeys = Object.keys(item);
            const hasLabel = itemKeys.includes('axis') || itemKeys.includes('dimension') || 
                            itemKeys.includes('category') || itemKeys.includes('factor');
            const hasValue = itemKeys.includes('value') || itemKeys.includes('score') || 
                            itemKeys.includes('rating') || itemKeys.includes('strength') || 
                            itemKeys.includes('intensity') || itemKeys.includes('difficulty');
            return hasLabel && hasValue;
          });
          
          if (allHaveRequiredFields) {
            console.log(`[MorphMapper] ✅ radar-chart-morph: Array with ${value.length} items`);
            return 'radar-chart-morph';
          }
        }
        
        // Pie Chart: category/type/name + count/percentage/value/dominance (2-8 items, flexible structure)
        const hasPieLabel = keys.includes('category') || keys.includes('type') || 
                           keys.includes('name') || keys.includes('hex') || keys.includes('color');
        const hasPieValue = keys.includes('count') || keys.includes('percentage') || 
                           keys.includes('value') || keys.includes('dominance') || keys.includes('proportion');
        
        if (value.length >= 2 && value.length <= 8 && hasPieLabel && hasPieValue) {
          const allHaveRequiredFields = value.every(item => {
            const itemKeys = Object.keys(item);
            const hasLabel = itemKeys.includes('category') || itemKeys.includes('type') || 
                            itemKeys.includes('name') || itemKeys.includes('hex') || itemKeys.includes('color');
            const hasValue = itemKeys.includes('count') || itemKeys.includes('percentage') || 
                            itemKeys.includes('value') || itemKeys.includes('dominance') || itemKeys.includes('proportion');
            return hasLabel && hasValue;
          });
          
          if (allHaveRequiredFields) {
            console.log(`[MorphMapper] ✅ pie-chart-morph: Array with ${value.length} items`);
            return 'pie-chart-morph';
          }
        }
        
        // Bar Chart: label/name/nutrient/compound + value/amount/concentration (3-15 items, flexible structure)
        const hasBarLabel = keys.includes('label') || keys.includes('month') || keys.includes('period') || 
                           keys.includes('nutrient') || keys.includes('compound') || keys.includes('name') ||
                           keys.includes('substrate') || keys.includes('factor');
        const hasBarValue = keys.includes('value') || keys.includes('amount') || keys.includes('concentration') ||
                           keys.includes('suitability') || keys.includes('score') || keys.includes('amount_g_per_100g');
        
        if (value.length >= 3 && value.length <= 15 && hasBarLabel && hasBarValue) {
          const allHaveRequiredFields = value.every(item => {
            const itemKeys = Object.keys(item);
            const hasLabel = itemKeys.includes('label') || itemKeys.includes('month') || itemKeys.includes('period') || 
                            itemKeys.includes('nutrient') || itemKeys.includes('compound') || itemKeys.includes('name') ||
                            itemKeys.includes('substrate') || itemKeys.includes('factor');
            const hasValue = itemKeys.includes('value') || itemKeys.includes('amount') || itemKeys.includes('concentration') ||
                            itemKeys.includes('suitability') || itemKeys.includes('score') || itemKeys.includes('amount_g_per_100g');
            return hasLabel && hasValue;
          });
          
          if (allHaveRequiredFields) {
            console.log(`[MorphMapper] ✅ bar-chart-morph: Array with ${value.length} items`);
            return 'bar-chart-morph';
          }
        }
        
        // Komplexe Objekte (wie activeCompounds, lookalikeSpecies) → ListMorph
        // Diese haben > 3 Felder oder verschachtelte Strukturen
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

      // Range object (min/max values) → RangeMorph
      // Direkt: {min: 5, max: 40, unit: "cm"}
      if ('min' in value && 'max' in value && typeof value.min === 'number' && typeof value.max === 'number') {
        console.log(`[MorphMapper] ✅ range-morph: "${fieldName}"`);
        return 'range-morph';
      }
      
      // Verschachtelte Range-Strukturen (z.B. temperatureRequirements: {colonization: {min, max}, fruiting: {min, max}})
      const values = Object.values(value);
      const allAreRanges = values.length > 0 && values.length <= 5 && values.every(v => 
        typeof v === 'object' && v !== null && 'min' in v && 'max' in v && typeof v.min === 'number'
      );
      if (allAreRanges) {
        // Spezialfall: Jedes Unterfeld ist ein Range → Verwende data-morph der die Ranges rekursiv rendert
        return 'data-morph';
      }

      // Progress/Percentage object → ProgressMorph
      if (('value' in value && 'max' in value) || 'percentage' in value) {
        return 'progress-morph';
      }

      // Special: Score objects (all numeric values 0-10) → Convert to Radar Chart!
      // e.g., {antibacterial: 5, antiviral: 3, antifungal: 4, ...}
      const entries = Object.entries(value);
      const allNumericScores = entries.length >= 3 && entries.length <= 12 && 
        entries.every(([k, v]) => typeof v === 'number' && v >= 0 && v <= 10);
      
      if (allNumericScores) {
        // This is a score object - treat as radar-chart-morph compatible!
        // We'll convert it to [{axis, value}, ...] format in createMorphElement
        return 'radar-chart-morph';
      }
      
      // Small flat objects (≤5 fields) → KeyValueMorph (kompakt)
      const primitiveFields = entries.filter(([_, v]) => 
        typeof v !== 'object' || v === null
      );
      const hasArrays = Object.values(value).some(v => Array.isArray(v));
      
      // Erlaube kleine Objekte mit Primitives ODER mit Range-Objekten als Werte
      const hasOnlySimpleRanges = entries.every(([_, v]) => {
        if (v === null || typeof v !== 'object' || Array.isArray(v)) return typeof v !== 'object' || v === null;
        // Ist es ein Range-Objekt?
        return 'min' in v && 'max' in v && typeof v.min === 'number';
      });
      
      if (entries.length > 0 && entries.length <= 5 && !hasArrays && 
          (primitiveFields.length === entries.length || hasOnlySimpleRanges)) {
        console.log(`[MorphMapper] ✅ key-value-morph: "${fieldName}" (${entries.length} fields)`);
        return 'key-value-morph';
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
      'name-morph': 900,         // Names usually important
      'image-morph': 850,         // Visual content
      'tag-morph': 750,           // Categories
      'text-morph': 700,          // Descriptions
      'radar-chart-morph': 690,   // Multi-dimensional visual
      'range-morph': 680,         // Visual ranges (helpful!)
      'progress-morph': 670,      // Visual progress
      'bar-chart-morph': 665,     // Comparison visual
      'sparkline-morph': 660,     // Trend visual
      'pie-chart-morph': 655,     // Distribution visual
      'number-morph': 650,        // Simple numbers
      'key-value-morph': 620,     // Compact object display
      'boolean-morph': 600,       // Yes/No facts
      'list-morph': 550,          // Lists
      'data-morph': 400,          // Nested objects
      'map-morph': 350,           // Maps
      'chart-morph': 300,         // Generic charts
      'timeline-morph': 200,      // Dates (often metadata)
    };

    let priority = basePriorities[morphType] || 500;

    // Semantic hints (boost/reduce based on field name)
    // These are HINTS only - they don't determine morph type!
    const lowerName = fieldName.toLowerCase();
    
    // CRITICAL SAFETY INFO → Highest priority
    if (lowerName.includes('edib') || lowerName.includes('toxic') || 
        lowerName.includes('poison') || lowerName.includes('deadly') ||
        lowerName.includes('lookalike') || lowerName.includes('danger')) {
      priority += 300; // Critical for user safety!
    }
    
    // Identity terms → boost priority
    if (lowerName.includes('name') || lowerName.includes('title')) {
      priority += 100;
    }
    
    // Visuelle Morphs (Range, Charts) → Extra Boost!
    if (morphType === 'range-morph' || morphType === 'progress-morph' ||
        morphType.includes('chart') || morphType === 'sparkline-morph' ||
        morphType === 'radar-chart-morph' || morphType === 'key-value-morph') {
      priority += 120; // Visuelle Darstellungen bevorzugen!
    }
    
    // Visual identification → high priority
    if (lowerName.includes('color') || lowerName.includes('shape') || 
        lowerName.includes('spore') || lowerName.includes('cap') ||
        lowerName.includes('stem') || lowerName.includes('gill') ||
        lowerName.includes('diameter') || lowerName.includes('length') ||
        lowerName.includes('size') || lowerName.includes('temperature') ||
        lowerName.includes('humidity') || lowerName.includes('range')) {
      priority += 100;
    }
    
    // Location/Habitat → useful for finding
    if (lowerName.includes('habitat') || lowerName.includes('season') || 
        lowerName.includes('location') || lowerName.includes('substrate')) {
      priority += 70;
    }
    
    // Practical use → medium priority
    if (lowerName.includes('culinary') || lowerName.includes('medicinal') || 
        lowerName.includes('cultivation') || lowerName.includes('use')) {
      priority += 50;
    }
    
    // Description terms → medium boost
    if (lowerName.includes('description') || lowerName.includes('summary')) {
      priority += 40;
    }
    
    // Technical/Scientific → lower priority
    if (lowerName.includes('scientific') || lowerName.includes('taxonomy') || 
        lowerName.includes('classification') || lowerName.includes('research')) {
      priority -= 50;
    }
    
    // Metadata → lowest priority
    if (lowerName.includes('created') || lowerName.includes('updated') || 
        lowerName.includes('modified') || lowerName.includes('_id') ||
        lowerName.includes('slug')) {
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

    // ❌ REMOVED HARDCODED CHECKS - Now FULLY data-driven!
    // MorphMapper now relies ONLY on data structure analysis in getMorphByValueAnalysis()
    // No more hardcoded field name checks like "nutritionalProfile" or "cultivationTimeline"

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

      // For nested objects: FLATTEN one level to expose visual morphs!
      // This extracts capDiameter, stipeLength, etc. from physicalCharacteristics
      if (morphType === 'data-morph' && typeof value === 'object' && !Array.isArray(value) && currentDepth < maxDepth) {
        // Extract nested fields (ONE level only!)
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (nestedValue === null || nestedValue === undefined) continue;
          
          const nestedPath = `${fullPath}.${nestedKey}`;
          const nestedMorphType = this.getMorphType(nestedKey, nestedValue, { parentPath: fullPath });
          const nestedPriority = this.getFieldPriority(nestedKey, nestedMorphType);
          
          // Only add if it's a VISUAL morph (not another nested data-morph)
          if (nestedMorphType !== 'data-morph' && nestedMorphType !== 'list-morph') {
            fields.push({
              fieldName: nestedKey,
              fullPath: nestedPath,
              morphType: nestedMorphType,
              value: nestedValue,
              priority: nestedPriority + 50 // Boost nested visual morphs!
            });
          }
        }
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
  createMorphElement(fieldConfig, entityData) {
    const { fieldName, morphType, value, fullPath } = fieldConfig;
    
    // Create wrapper for morphs that need labels
    const needsWrapper = [
      'name-morph', 'text-morph', 'tag-morph',
      'range-morph', 'progress-morph', 'key-value-morph',
      'bar-chart-morph', 'pie-chart-morph', 'sparkline-morph', 'radar-chart-morph',
      'timeline-morph', 'map-morph'
    ];
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
      // Get entity name from domain config or fallback
      const nameField = window.amorph?.domainConfig?.dataSource?.nameField || 'commonName';
      element.setAttribute('alt', entityData?.[nameField] || fieldName);
      element.setAttribute('aspect-ratio', '16/9');
      element.setAttribute('lazy', 'true');
      
    } else if (morphType === 'tag-morph') {
      // Handle both single values and arrays - pass as-is
      if (Array.isArray(value)) {
        element.tags = value; // Set as property for arrays
      } else {
        element.value = String(value); // Single string
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
      element.setAttribute('entity-data', JSON.stringify(entityData));
      element.setAttribute('field', fullPath || fieldName);
      element.setAttribute('mode', 'simple');
      
    } else if (morphType === 'range-morph') {
      // Range object {min, max, optimal, unit}
      element.data = value; // Set as property, not attribute!
      
    } else if (morphType === 'progress-morph') {
      // Progress object {value, max} or {percentage}
      element.data = value;
      
    } else if (morphType === 'key-value-morph') {
      // Small flat object
      element.data = value;
      
    } else if (morphType === 'bar-chart-morph') {
      // Array of numbers or [{label, value}, ...]
      element.data = value;
      
    } else if (morphType === 'pie-chart-morph') {
      // Array of [{category, count}, ...]
      element.data = value;
      
    } else if (morphType === 'sparkline-morph') {
      // Array of numbers
      element.data = value;
      
    } else if (morphType === 'radar-chart-morph') {
      // Array of [{axis, value}, ...] OR score object {key: score, ...}
      // If it's an object, convert to array format
      if (!Array.isArray(value) && typeof value === 'object' && value !== null) {
        const converted = Object.entries(value).map(([k, v]) => ({
          axis: this.formatFieldName(k),
          value: typeof v === 'number' ? v : 0
        }));
        element.data = converted;
      } else {
        element.data = value;
      }
      
    } else if (morphType === 'timeline-morph') {
      // Array of [{dayOffset, stage, label}, ...]
      element.data = value;
      
    } else if (morphType === 'map-morph') {
      // Array of [{location: {latitude, longitude}, name}, ...]
      element.data = value;
      
    } else if (morphType === 'progress-morph') {
      // Progress/ratings object
      element.data = value;
      
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
