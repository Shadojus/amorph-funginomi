/**
 * ⚡ REACTOR KONFIGURATION
 * 
 * Definiert alle verfügbaren Reactors und ihre Defaults
 * PLUG & PLAY: Einfach enabled: true/false setzen!
 */

export const ReactorsConfig = {
  // ==========================================
  // CORE REACTORS (MVP)
  // ==========================================
  
  glow: {
    name: 'Glow Reactor',
    description: 'Lässt Morphs glühen bei Tag-Match',
    category: 'visual',
    enabled: false,
    defaultConfig: {
      color: '#00ff88',
      intensity: 1.0,
      duration: 2000,
      pulseSpeed: 1.0,
      tags: []
    },
    morphTypes: ['*']  // Wirkt auf alle Morph-Typen
  },
  
  // NEW: Convex-based search (2025-11-19)
  'convex-search': {
    name: 'Convex Search Reactor',
    description: 'Server-side search using Convex database - FAST & SCALABLE',
    category: 'filter',
    enabled: false,
    defaultConfig: {
      debounce: 300,
      minQueryLength: 2,
      apiEndpoint: '/api/search',
      highlightResults: true
    },
    morphTypes: ['*']
  },
  
  // LEGACY: Client-side search (deprecated)
  search: {
    name: 'Search Reactor (LEGACY)',
    description: '[DEPRECATED] Client-side search through Shadow DOM',
    category: 'filter',
    enabled: false,
    deprecated: true,
    defaultConfig: {
      query: '',
      fuzzy: true,
      caseSensitive: false,
      weights: {
        tag: 100,
        name: 50,
        description: 10
      },
      minScore: 10
    },
    morphTypes: ['*']
  },
  
  astroDataSearch: {
    name: 'Astro Data Search Reactor (LEGACY)',
    description: '[DEPRECATED] Client-side search through JSON attributes',
    category: 'filter',
    deprecated: true,
    enabled: false,
    defaultConfig: {
      minScore: 0,
      debounce: 150,
      hideUnmatched: true,
      fieldWeights: {
        commonName: 100,
        scientificName: 90,
        tags: 100,
        family: 80,
        genus: 80,
        edibility: 70,
        toxicityLevel: 70,
        medicinalProperties: 60,
        activeCompounds: 60,
        primaryCompounds: 60,
        secondaryMetabolites: 60,
        default: 20
      }
    },
    containerBased: true  // Works on containers, not individual morphs
  },
  
  perspective: {
    name: 'Perspective Reactor',
    description: 'Filters & highlights morphs based on active perspectives',
    category: 'filter',
    enabled: true,
    defaultConfig: {
      animate: true,
      duration: 300,
      highlightActive: true
    },
    morphTypes: ['*']
  },
  
  animation: {
    name: 'Animation Reactor',
    description: 'Eingangs-Animationen',
    category: 'animation',
    enabled: true,
    defaultConfig: {
      type: 'fade-in',  // 'fade-in' | 'slide-in' | 'scale-in'
      duration: 500,
      delay: 0,
      stagger: 50  // Verzögerung zwischen Morphs
    },
    morphTypes: ['*']
  },
  
  // ==========================================
  // EXTENDED REACTORS (Full System)
  // ==========================================
  
  pulse: {
    name: 'Pulse Reactor',
    description: 'Lässt Morphs pulsieren',
    category: 'animation',
    enabled: false,
    defaultConfig: {
      speed: 1.0,
      intensity: 0.5,
      frequency: 1000
    },
    morphTypes: ['bubble', 'card']
  },
  
  hover: {
    name: 'Hover Reactor',
    description: 'Hover-Effekte',
    category: 'interaction',
    enabled: true,
    defaultConfig: {
      style: 'lift',  // 'lift' | 'glow' | 'scale'
      intensity: 1.0,
      duration: 200
    },
    morphTypes: ['card', 'bubble']
  },
  
  sort: {
    name: 'Sort Reactor',
    description: 'Sortiert Morphs',
    category: 'layout',
    enabled: false,
    defaultConfig: {
      field: 'name',  // 'name' | 'score' | 'date'
      order: 'asc'    // 'asc' | 'desc'
    },
    morphTypes: ['*']
  },
  
  filter: {
    name: 'Filter Reactor',
    description: 'Komplexe Filterung',
    category: 'filter',
    enabled: false,
    defaultConfig: {
      rules: [],
      operator: 'AND'  // 'AND' | 'OR'
    },
    morphTypes: ['*']
  },
  
  // ==========================================
  // BUBBLEVIEW REACTORS
  // ==========================================
  
  flow: {
    name: 'Flow Reactor',
    description: 'Physics-based movement for Morphs',
    category: 'bubbleview',
    enabled: false,
    defaultConfig: {
      physics: 'spring',
      stiffness: 0.15,
      damping: 0.8,
      mass: 1,
      maxVelocity: 1000,
      threshold: 0.5
    },
    morphTypes: ['*']
  },
  
  colorShift: {
    name: 'ColorShift Reactor',
    description: 'Farb-Änderung basierend auf Perspektiven',
    category: 'bubbleview',
    enabled: false,
    defaultConfig: {
      mode: 'gradient',
      duration: 600,
      blendMode: 'mix',
      intensity: 0.8,
      multiColor: true
    },
    morphTypes: ['*']
  },
  
  // ==========================================
  // CANVAS REACTORS (BubbleView)
  // ==========================================
  
  canvasUserNode: {
    name: 'Canvas User Node Reactor',
    description: 'Visualisiert User Node mit gewichteten Verbindungen',
    category: 'canvas',
    enabled: true, // Default enabled for BubbleView
    defaultConfig: {
      scoreThreshold: 0.15,
      maxConnections: 8,
      vectorStyle: 'curved',
      showStats: true,
      centerForce: 0.05,
      pulseAnimation: true
    },
    morphTypes: ['bubble']
  },
  
  canvasPhysics: {
    name: 'Canvas Physics Reactor',
    description: 'Physics engine für BubbleView (Spring forces, Collisions)',
    category: 'canvas',
    enabled: true, // Default enabled for BubbleView
    defaultConfig: {
      springStrength: 0.005,
      damping: 0.95,
      collisionStrength: 0.1,
      boundaryMargin: 100,
      boundaryAttraction: 0.002,
      repulsionDistance: 400,
      repulsionStrength: 0.0001
    },
    morphTypes: ['bubble']
  },
  
  canvasConnection: {
    name: 'Canvas Connection Reactor',
    description: 'Rendert Verbindungen zwischen Nodes',
    category: 'canvas',
    enabled: true, // Default enabled for BubbleView
    defaultConfig: {
      minLineWidth: 1,
      maxLineWidth: 8,
      minOpacity: 0.2,
      maxOpacity: 0.8,
      style: 'curved',
      showWeightBadges: false
    },
    morphTypes: ['bubble']
  }
};

export default ReactorsConfig;
