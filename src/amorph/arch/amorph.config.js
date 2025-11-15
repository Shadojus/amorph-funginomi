/**
 * 🔮 AMORPH SYSTEM - ZENTRALE KONFIGURATION
 * 
 * Hier wird ALLES konfiguriert:
 * - System Settings
 * - Perspektiven mit Farben & Icons
 * - Default States
 * - Performance Settings
 */

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
  // PERSPEKTIVEN (Aus Convex Schema)
  // ==========================================
  perspectives: [
    {
      id: 'culinaryAndNutritional',
      name: 'Culinary',
      icon: '🍳',
      color: '#22c55e',
      description: 'Kulinarische und ernährungswissenschaftliche Aspekte'
    },
    {
      id: 'medicinalProperties',
      name: 'Medicinal',
      icon: '💊',
      color: '#ef4444',
      description: 'Medizinische Eigenschaften und Heilwirkungen'
    },
    {
      id: 'cultivation',
      name: 'Cultivation',
      icon: '🌱',
      color: '#f59e0b',
      description: 'Anbau und Kultivierung'
    },
    {
      id: 'safetyAndToxicity',
      name: 'Safety',
      icon: '⚠️',
      color: '#dc2626',
      description: 'Sicherheit, Toxizität und Gefahren'
    },
    {
      id: 'ecologyAndHabitat',
      name: 'Ecology',
      icon: '🌲',
      color: '#10b981',
      description: 'Ökologie und Lebensraum'
    },
    {
      id: 'morphology',
      name: 'Morphology',
      icon: '🔬',
      color: '#8b5cf6',
      description: 'Morphologische Merkmale und Mikroskopie'
    },
    {
      id: 'biochemistry',
      name: 'Biochemistry',
      icon: '🧪',
      color: '#06b6d4',
      description: 'Biochemische Zusammensetzung und Wirkstoffe'
    },
    {
      id: 'cultural',
      name: 'Cultural',
      icon: '🎭',
      color: '#ec4899',
      description: 'Kulturelle und historische Bedeutung'
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: '💰',
      color: '#f97316',
      description: 'Kommerzielle Nutzung und Wirtschaft'
    },
    {
      id: 'legal',
      name: 'Legal',
      icon: '⚖️',
      color: '#64748b',
      description: 'Rechtlicher Status und Regulierung'
    },
    {
      id: 'research',
      name: 'Research',
      icon: '📚',
      color: '#0ea5e9',
      description: 'Wissenschaftliche Forschung und Studien'
    },
    {
      id: 'sustainability',
      name: 'Sustainability',
      icon: '♻️',
      color: '#84cc16',
      description: 'Nachhaltigkeit und Umweltschutz'
    }
  ],
  
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
