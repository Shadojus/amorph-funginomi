/**
 * 🔮 AMORPH SYSTEM - ZENTRALE KONFIGURATION
 * 
 * Hier wird ALLES konfiguriert:
 * - System Settings
 * - Default States
 * - Performance Settings
 * 
 * ⚠️ WICHTIG: Perspektiv-Farben & Icons
 * =====================================
 * Alle Perspektiv-Definitionen (Farben, Labels, Icons) sind ZENTRAL in:
 * → convex/perspectiveFieldMappings.ts (SINGLE SOURCE OF TRUTH)
 * 
 * Diese Datei importiert die Perspektiven von dort!
 */

import { perspectiveDefinitions } from '../../../convex/perspectiveFieldMappings';

// Build perspectives array from central definitions
const buildPerspectivesFromDefinitions = () => {
  return Object.entries(perspectiveDefinitions).map(([id, def]) => ({
    id,
    name: def.label,
    icon: def.icon,
    color: def.color,
    description: def.description
  }));
};

export const AmorphConfig = {
  // ==========================================
  // SYSTEM SETTINGS
  // ==========================================
  system: {
    name: 'Funginomi AMORPH',
    version: '1.0.0',
    debug: true,              // Console-Logging
    devTools: true,           // Zeige Control Panel
    mode: 'development'       // 'development' | 'production'
  },
  
  // ==========================================
  // PERSPEKTIVEN (Importiert aus convex/perspectiveFieldMappings.ts)
  // ==========================================
  perspectives: buildPerspectivesFromDefinitions(),
  
  // ==========================================
  // MULTI-PERSPEKTIVEN SETTINGS
  // ==========================================
  multiPerspective: {
    enabled: true,
    maxSelection: 4,                    // Max. 4 Perspektiven gleichzeitig
    defaultPerspectives: ['culinaryAndNutritional'],  // Initial aktiv
    allowEmpty: false                    // Mind. 1 Perspektive muss aktiv sein
  },
  
  // ==========================================
  // REACTOR DEFAULTS
  // ==========================================
  defaultReactors: {
    animation: { 
      enabled: true, 
      type: 'fade-in',
      duration: 500,
      delay: 0
    },
    glow: { 
      enabled: false,
      color: '#00ff88',
      intensity: 1.0
    },
    search: {
      enabled: false,
      fuzzy: true,
      caseSensitive: false
    },
    perspective: {
      enabled: false, // Disabled - PerspectiveCard handles data switching
      animate: true,
      duration: 300,
      highlightActive: true
    },
    // Canvas-Reactors (BubbleView)
    canvasUserNode: {
      enabled: true,
      scoreThreshold: 0.3,
      maxConnections: 8,
      vectorStyle: 'curved',
      showStats: true,
      centerForce: 0.05,
      pulseAnimation: true
    },
    canvasPhysics: {
      enabled: true,
      springStrength: 0.005,
      damping: 0.95,
      collisionStrength: 0.1,
      boundaryMargin: 100,
      boundaryAttraction: 0.002
    },
    canvasConnection: {
      enabled: true,
      minScore: 0.3,
      maxConnections: 8,
      lineStyle: 'curved',
      colorByScore: true,
      showWeights: false
    }
  },
  
  // ==========================================
  // SEARCH SETTINGS (Weighted Scoring)
  // ==========================================
  search: {
    weights: {
      tag: 100,           // Tags haben höchste Priorität
      name: 50,           // Name mittlere Priorität
      description: 10     // Description niedrigste Priorität
    },
    debounce: 300,        // ms - Verzögerung vor Search-Trigger
    minScore: 10,         // Minimum Score für Match
    fuzzyMatch: true,     // Fuzzy Matching aktiviert
    caseSensitive: false  // Groß-/Kleinschreibung ignorieren
  },
  
  // ==========================================
  // TAG EXTRACTION SETTINGS
  // ==========================================
  tags: {
    maxPerMorph: 20,      // Max. Tags pro Morph
    separator: ',',       // Tag-Separator
    excludeEmpty: true,   // Leere Tags ignorieren
    slugify: true,        // Tags in Slugs konvertieren
    prefixWithCategory: true  // z.B. "taste:nutty" statt nur "nutty"
  },
  
  // ==========================================
  // CONVEX SETTINGS
  // ==========================================
  convex: {
    url: typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_CONVEX_URL || 'http://localhost:3210',
    deployment: typeof import.meta !== 'undefined' && import.meta.env?.CONVEX_DEPLOYMENT || 'dev:local',
    realtimeUpdates: true  // Live Updates aktiviert
  },
  
  // ==========================================
  // REDIS EVENT BUS SETTINGS
  // ==========================================
  redis: {
    url: typeof import.meta !== 'undefined' && import.meta.env?.REDIS_URL || 'redis://localhost:6379',
    channel: 'amorph:events',
    reconnectDelay: 1000,
    maxRetries: 5,
    enableLogging: true
  },
  
  // ==========================================
  // PIXIE RENDERER SETTINGS
  // ==========================================
  pixie: {
    antialias: true,
    backgroundColor: 0x000000,
    resolution: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1,
    autoDensity: true,
    width: 800,
    height: 600,
    autoResize: true
  },
  
  // ==========================================
  // PERFORMANCE SETTINGS
  // ==========================================
  performance: {
    lazyLoad: true,           // Lazy Loading für Morphs
    virtualScroll: false,     // Virtuelles Scrolling (MVP: false)
    debounceResize: 150,      // ms - Window Resize Debounce
    throttleScroll: 16,       // ms - Scroll Throttle (~60fps)
    maxMorphsPerPage: 100,    // Max. Morphs gleichzeitig rendern
    caching: {
      enabled: true,
      ttl: 300000             // 5 Minuten Cache
    }
  },
  
  // ==========================================
  // BUBBLE VIEW SETTINGS (für später)
  // ==========================================
  bubbleView: {
    enabled: false,           // Initial deaktiviert
    renderer: 'pixie',        // Verwende Pixie Renderer
    physics: {
      gravity: 0.1,
      repulsion: 100,
      attraction: 0.01,
      friction: 0.9
    },
    similarity: {
      threshold: 0.3,         // Min. Similarity für Connection
      algorithm: 'cosine'     // 'cosine' | 'jaccard' | 'euclidean'
    },
    animation: {
      duration: 1000,
      easing: 'ease-in-out'
    },
    pixieSettings: {
      nodeRadius: { min: 20, max: 80 },
      connectionWidth: { min: 1, max: 5 },
      particleSize: 4,
      particleSpeed: 1.0
    }
  },
  
  // ==========================================
  // MORPH TYPES (Atomic Design)
  // ==========================================
  morphTypes: {
    // Data Field Morphs (Atomic)
    atomic: [
      'name',
      'image',
      'text',
      'tag',
      'boolean',
      'number',
      'list'
    ],
    
    // Category Morphs (Container)
    category: [
      'edibility',
      'taste',
      'habitat',
      'medicinal',
      'cultivation'
    ],
    
    // Composite Morphs (Card/Grid)
    composite: [
      'card',
      'grid-item'
    ],
    
    // BubbleView Morphs
    bubble: [
      'bubble',
      'connection',
      'sphere'
    ]
  }
};

export default AmorphConfig;
