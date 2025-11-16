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
  
  search: {
    name: 'Search Reactor',
    description: 'Filtert & sortiert Morphs mit weighted Scoring',
    category: 'filter',
    enabled: false,
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
  }
};

export default ReactorsConfig;
