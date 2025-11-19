/**
 * 🔷 MORPH KONFIGURATION
 * 
 * Definiert Morph-Typen und ihre Eigenschaften
 * Atomic Design Prinzip: Jedes Datenfeld = eigener Morph
 */

export const MorphsConfig = {
  // ==========================================
  // ATOMIC DATA FIELD MORPHS
  // ==========================================
  
  name: {
    type: 'atomic',
    component: 'name-morph',
    description: 'Zeigt Namen (Common oder Latin)',
    defaultConfig: {
      variant: 'common',  // 'common' | 'latin' | 'both'
      size: 'medium',     // 'small' | 'medium' | 'large'
      color: 'inherit'
    },
    searchable: true,
    searchWeight: 50
  },
  
  image: {
    type: 'atomic',
    component: 'image-morph',
    description: 'Zeigt Bild',
    defaultConfig: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      lazy: true,
      placeholder: true
    },
    searchable: false
  },
  
  text: {
    type: 'atomic',
    component: 'text-morph',
    description: 'Zeigt Text-Feld',
    defaultConfig: {
      maxLines: null,     // null = unbegrenzt
      ellipsis: true,
      markdown: false
    },
    searchable: true,
    searchWeight: 10
  },
  
  tag: {
    type: 'atomic',
    component: 'tag-morph',
    description: 'Zeigt einzelnen Tag',
    defaultConfig: {
      variant: 'pill',    // 'pill' | 'badge' | 'chip'
      color: 'auto',      // 'auto' | specific color
      clickable: true
    },
    searchable: true,
    searchWeight: 100   // Tags haben höchste Priorität!
  },
  
  boolean: {
    type: 'atomic',
    component: 'boolean-morph',
    description: 'Zeigt Boolean (Checkbox, Icon)',
    defaultConfig: {
      variant: 'icon',    // 'icon' | 'checkbox' | 'badge'
      trueIcon: '✓',
      falseIcon: '✗'
    },
    searchable: false
  },
  
  number: {
    type: 'atomic',
    component: 'number-morph',
    description: 'Zeigt Zahl mit optionaler Einheit',
    defaultConfig: {
      format: 'decimal',  // 'decimal' | 'percent' | 'currency'
      decimals: 2,
      unit: null
    },
    searchable: false
  },
  
  list: {
    type: 'atomic',
    component: 'list-morph',
    description: 'Zeigt Liste von Items',
    defaultConfig: {
      variant: 'bullets',  // 'bullets' | 'numbered' | 'chips'
      maxItems: null,
      collapsible: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  // ==========================================
  // CATEGORY CONTAINER MORPHS
  // ==========================================
  
  edibility: {
    type: 'category',
    component: 'edibility-morph',
    description: 'Container für Essbarkeits-Informationen',
    containsFields: ['edibleRaw', 'cookingRequired', 'toxicity'],
    defaultConfig: {
      layout: 'compact'   // 'compact' | 'expanded'
    },
    searchable: true,
    searchWeight: 30
  },
  
  taste: {
    type: 'category',
    component: 'taste-morph',
    description: 'Container für Geschmacks-Informationen',
    containsFields: ['flavorProfile', 'intensity', 'notes'],
    defaultConfig: {
      showChart: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  habitat: {
    type: 'category',
    component: 'habitat-morph',
    description: 'Container für Lebensraum-Informationen',
    containsFields: ['ecosystem', 'climate', 'substrate'],
    defaultConfig: {
      showMap: false
    },
    searchable: true,
    searchWeight: 20
  },
  
  medicinal: {
    type: 'category',
    component: 'medicinal-morph',
    description: 'Container für medizinische Informationen',
    containsFields: ['benefits', 'compounds', 'dosage'],
    defaultConfig: {
      highlightBenefits: true
    },
    searchable: true,
    searchWeight: 40
  },
  
  // ==========================================
  // COMPOSITE MORPHS
  // ==========================================
  
  chart: {
    type: 'composite',
    component: 'chart-morph',
    description: 'Chart/Visualization component',
    defaultConfig: {
      type: 'bar',  // 'bar' | 'pie' | 'line'
      width: '100%',
      height: '300px'
    },
    searchable: false
  },
  
  map: {
    type: 'composite',
    component: 'map-morph',
    description: 'Geographic map component',
    defaultConfig: {
      zoom: 6,
      center: [51.1657, 10.4515]  // Germany center
    },
    searchable: false
  },
  
  timeline: {
    type: 'composite',
    component: 'timeline-morph',
    description: 'Timeline visualization',
    defaultConfig: {
      orientation: 'horizontal',  // 'horizontal' | 'vertical'
      showDates: true
    },
    searchable: false
  }
};

export default MorphsConfig;
