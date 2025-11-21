/**
 * 🫧 BUBBLE VIEW - CLEAN REWRITE
 * ================================
 * 
 * Simple, working visualization with Canvas-Reactors integration
 */

import { LitElement, html, css } from 'lit';
import { HilbertSpaceSimilarity } from './services/HilbertSpaceSimilarity.js';

export class BubbleView extends LitElement {
  static properties = {
    isSimulating: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000000;
      border-radius: 12px;
    }

    .bubble-canvas {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .bubble-morphs {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    
    .bubble-morphs > * {
      pointer-events: all;
    }
  `;

  constructor() {
    super();
    
    // Core state
    this.isSimulating = false;
    this.animationFrame = null;
    
    // Data structures
    this.bubbles = new Map(); // slug -> bubble data
    this.connections = new Map(); // id -> connection data
    this.cachedFungusData = new Map(); // slug -> full fungus data
    this.activePerspectives = ['cultivation', 'culinary'];
    this.searchScores = new Map(); // slug → normalized score (0-1)
    this.searchMatchedFields = new Map(); // slug → array of matched field paths
    this.hasActiveSearch = false;
    this.currentSearchQuery = '';
    
    // User Node (central point representing user's intent)
    // FIXED SIZE: 3x smaller than before (160 → 53px)
    // FIXED POSITION: Excluded from physics simulation
    this.userNodeData = {
      x: 400,
      y: 300,
      vx: 0,
      vy: 0,
      size: 53,  // 3x smaller for subtle central anchor
      isActive: true,
      interactions: [],
      searchQueries: [],
      activePerspectives: [],
      selectedBubbles: [],
      connections: new Map() // slug -> weight
    };
    
    // Canvas Reactors
    this.canvasReactors = {
      physics: null,
      connection: null,
      userNode: null
    };
    this.reactorsEnabled = false;
    
    console.log('[BubbleView] Initialized');
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH instance
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
    }

    // Listen for perspective changes
    this._boundPerspectiveHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundPerspectiveHandler);
    
    // Listen for search events - use astro-search:completed for actual search results
    this._boundSearchHandler = this.handleSearch.bind(this);
    window.addEventListener('amorph:astro-search:completed', this._boundSearchHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAnimation();
    
    if (this._boundPerspectiveHandler) {
      window.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
    }
    if (this._boundSearchHandler) {
      window.removeEventListener('amorph:astro-search:completed', this._boundSearchHandler);
    }
  }

  firstUpdated() {
    // Get canvas
    this.canvas = this.shadowRoot.querySelector('.bubble-canvas');
    if (!this.canvas) {
      console.error('[BubbleView] Canvas not found!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.handleResize();
    
    // Initialize user node at center
    this.initializeUserNode();
    
    // Enable Canvas Reactors
    setTimeout(() => {
      this.enableCanvasReactors();
    }, 100);
    
    // Start animation loop
    this.startAnimation();
    
    // Add resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this);
    
    console.log('[BubbleView] First updated - ready to rock!');
  }

  handleResize() {
    if (!this.canvas) return;
    
    const containerWidth = this.offsetWidth || 800;
    const containerHeight = this.offsetHeight || 600;
    
    this.canvas.width = containerWidth;
    this.canvas.height = containerHeight;
    
    // Update user node position to center of canvas
    if (this.userNodeData) {
      this.userNodeData.x = containerWidth / 2;
      this.userNodeData.y = containerHeight / 2;
    }
    
    console.log(`[BubbleView] 📐 Canvas resized: ${containerWidth}x${containerHeight}px`, {
      userNodeCenter: this.userNodeData ? `(${Math.round(this.userNodeData.x)}, ${Math.round(this.userNodeData.y)})` : 'none'
    });
  }

  initializeUserNode() {
    const containerWidth = this.offsetWidth || 800;
    const containerHeight = this.offsetHeight || 600;
    
    this.userNodeData.x = containerWidth / 2;
    this.userNodeData.y = containerHeight / 2;
    this.userNodeData.activePerspectives = [...this.activePerspectives];
    
    console.log('[BubbleView] User node initialized at center');
  }

  /**
   * Enable Canvas Reactors
   */
  async enableCanvasReactors() {
    if (!window.amorph) {
      console.warn('[BubbleView] ⚠️ AmorphSystem not available');
      return false;
    }
    
    if (this.reactorsEnabled) {
      console.log('[BubbleView] ✅ Reactors already enabled');
      return true;
    }
    
    console.log('[BubbleView] 🎨 Enabling Canvas Reactors...');
    
    try {
      // Get reactor instances
      this.canvasReactors.physics = window.amorph.getReactor('canvasPhysics');
      this.canvasReactors.connection = window.amorph.getReactor('canvasConnection');
      this.canvasReactors.userNode = window.amorph.getReactor('canvasUserNode');
      
      console.log('[BubbleView] Reactors retrieved:', {
        physics: !!this.canvasReactors.physics,
        connection: !!this.canvasReactors.connection,
        userNode: !!this.canvasReactors.userNode
      });
      
      // Apply reactors to this BubbleView instance
      let appliedCount = 0;
      Object.entries(this.canvasReactors).forEach(([name, reactor]) => {
        if (reactor && reactor.apply) {
          const success = reactor.apply(this);
          if (success) {
            appliedCount++;
            console.log(`[BubbleView] ✅ ${reactor.constructor.name} applied`);
          } else {
            console.error(`[BubbleView] ❌ ${reactor.constructor.name} apply failed`);
          }
        } else {
          console.warn(`[BubbleView] ⚠️ Reactor ${name} not available or missing apply method`);
        }
      });
      
      if (appliedCount > 0) {
        this.reactorsEnabled = true;
        console.log(`[BubbleView] 🎨 ${appliedCount}/3 Canvas Reactors enabled successfully`);
        return true;
      } else {
        console.error('[BubbleView] ❌ No reactors could be applied');
        return false;
      }
    } catch (error) {
      console.error('[BubbleView] Failed to enable reactors:', error);
      return false;
    }
  }

  /**
   * Set morphs (called by BubbleHost)
   */
  setMorphs(morphs) {
    console.log(`[BubbleView] Received ${morphs.length} morphs`);
    // We don't need morphs for canvas rendering, but log it for compatibility
  }
  
  /**
   * Set cached fungus data (called by BubbleHost)
   */
  setCachedData(fungiData) {
    this.cachedFungusData = new Map();
    fungiData.forEach(fungus => {
      if (fungus.slug) {
        this.cachedFungusData.set(fungus.slug, fungus);
        console.log('[BubbleView] 📦 Caching fungus:', {
          slug: fungus.slug,
          commonName: fungus.commonName,
          scientificName: fungus.scientificName
        });
      }
    });
    console.log('[BubbleView] 📦 Cached', this.cachedFungusData.size, 'fungi for dynamic bubble creation');
  }
  
  /**
   * Set active bubbles (called by BubbleHost with BubbleMorph elements)
   */
  setActiveBubbles(bubbleMorphs, scores = {}, matchedFields = {}) {
    console.log('[BubbleView] 🫧 Setting', bubbleMorphs.length, 'active bubbles');
    
    // Clear existing bubbles
    this.bubbles.clear();
    
    // Get the morphs container in the shadow DOM
    const morphsContainer = this.shadowRoot.querySelector('.bubble-morphs');
    if (!morphsContainer) {
      console.error('[BubbleView] No .bubble-morphs container found');
      return;
    }
    
    // Clear existing bubble morphs in container
    morphsContainer.innerHTML = '';
    
    // Add each bubble morph to container and create canvas data
    bubbleMorphs.forEach((bubbleMorph, index) => {
      const fungusData = bubbleMorph.fungusData;
      if (!fungusData || !fungusData.slug) {
        console.warn('[BubbleView] BubbleMorph missing fungusData or slug');
        return;
      }
      
      const slug = fungusData.slug;
      
      // Add morph to DOM container (will be positioned by BubbleMorph itself)
      morphsContainer.appendChild(bubbleMorph);
      
      // Store canvas bubble data for connections
      this.bubbles.set(slug, {
        slug,
        label: fungusData.commonName || fungusData.scientificName || slug,
        x: bubbleMorph.x,
        y: bubbleMorph.y,
        vx: 0,
        vy: 0,
        size: bubbleMorph.size,
        color: this.hexToRgb(bubbleMorph.color),
        data: fungusData,
        morph: bubbleMorph
      });
    });
    
    console.log('[BubbleView] ✅ Created Canvas data for', this.bubbles.size, 'bubbles');
    
    // 🔍 DIAGNOSTIC: Verify state before updateUserNodeConnections
    console.log('[BubbleView] 🔍 Pre-update state:', {
      bubblesCount: this.bubbles.size,
      hasUserNodeData: !!this.userNodeData,
      userNodeConnectionsSize: this.userNodeData?.connections?.size || 0,
      bubbleKeys: Array.from(this.bubbles.keys())
    });
    
    // Update connections and sizes
    this.updateUserNodeConnections();
    this.updateSimilarityMatrix();
    // Note: updateBubbleSizes() is called in updateUserNodeConnections()
  }
  
  /**
   * Convert hex color to RGB object
   */
  hexToRgb(hex) {
    const defaultColor = { r: 144, g: 202, b: 249 };
    if (!hex) return defaultColor;
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : defaultColor;
  }

  /**
   * Set fungi data
   */
  setFungiData(fungi) {
    if (!fungi || !Array.isArray(fungi)) {
      console.warn('[BubbleView] Invalid fungi data');
      return;
    }
    
    console.log(`[BubbleView] 📊 Setting ${fungi.length} fungi`, fungi);
    
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    
    // RESPONSIVE: Adjust radius and initial size based on viewport
    const isSmallScreen = width < 600;
    const isMediumScreen = width >= 600 && width < 1024;
    
    // Smaller radius on small screens to prevent overlap
    let radiusMultiplier = 0.3;
    let initialSize = 80;
    
    if (isSmallScreen) {
      radiusMultiplier = 0.25; // Tighter circle
      initialSize = 60;        // Smaller bubbles
    } else if (isMediumScreen) {
      radiusMultiplier = 0.28;
      initialSize = 70;
    }
    
    const radius = Math.min(width, height) * radiusMultiplier;
    
    console.log(`[BubbleView] 📱 Viewport: ${width}x${height}, radius: ${radius.toFixed(0)}px, initial size: ${initialSize}px`);
    
    // Clear existing bubbles
    this.bubbles.clear();
    
    // Create bubbles with responsive positions
    fungi.forEach((fungus, index) => {
      // Extract slug from different possible locations
      const slug = fungus.slug || fungus._id || fungus.id || `fungus-${index}`;
      const label = fungus.names?.scientific || fungus.scientificName || fungus.names?.common || fungus.commonName || `Fungus ${index + 1}`;
      
      const angle = (index / fungi.length) * Math.PI * 2;
      
      this.bubbles.set(slug, {
        slug: slug,
        label: label,
        data: fungus,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: initialSize,  // Responsive initial size
        color: this.getColorForPerspective(fungus),
        isDragging: false
      });
      
      console.log(`[BubbleView] ✅ Bubble created: ${slug} at (${Math.round(width / 2 + Math.cos(angle) * radius)}, ${Math.round(height / 2 + Math.sin(angle) * radius)})`);
    });
    
    console.log(`[BubbleView] 🎯 Created ${this.bubbles.size} bubbles, now calculating connections...`);
    console.log(`[BubbleView] UserNodeData before connections:`, {
      x: this.userNodeData.x,
      y: this.userNodeData.y,
      connections: this.userNodeData.connections.size
    });
    
    // Calculate initial connections AFTER bubbles are created
    this.updateUserNodeConnections();
    this.updateSimilarityMatrix();
    
    console.log(`[BubbleView] UserNodeData after connections:`, {
      connections: this.userNodeData.connections.size,
      connectionsList: Array.from(this.userNodeData.connections.entries())
    });
    
    this.requestUpdate();
  }

  getColorForPerspective(fungus) {
    // Simple color assignment based on primary perspective
    const colors = {
      cultivation: { r: 34, g: 197, b: 94 },   // Green
      culinary: { r: 249, g: 115, b: 22 },     // Orange
      medicinal: { r: 168, g: 85, b: 247 },    // Purple
      ecological: { r: 59, g: 130, b: 246 }    // Blue
    };
    
    return colors.cultivation; // Default
  }

  updateUserNodeConnections() {
    // 🔍 DIAGNOSTIC: Method entry confirmation
    console.log('[BubbleView] ⚡ METHOD ENTERED: updateUserNodeConnections()');
    console.log('[BubbleView] ⚡ State check:', {
      hasUserNodeData: !!this.userNodeData,
      bubblesSize: this.bubbles.size,
      userNodeDataType: this.userNodeData?.constructor?.name
    });
    
    if (!this.userNodeData) {
      console.warn('[BubbleView] ⚠️ GUARD CLAUSE 1: No userNodeData available');
      console.log('[BubbleView] ⚠️ userNodeData value:', this.userNodeData);
      return;
    }
    
    if (this.bubbles.size === 0) {
      console.warn('[BubbleView] ⚠️ GUARD CLAUSE 2: No bubbles available to connect');
      console.log('[BubbleView] ⚠️ bubbles.size:', this.bubbles.size);
      return;
    }
    
    console.log('[BubbleView] ✅ Guard clauses passed, proceeding with connection updates');
    
    this.userNodeData.connections.clear();
    
    // Check if we have active search
    const hasActiveSearch = this.hasActiveSearch || false;
    
    // Calculate weights based on multiple factors
    this.bubbles.forEach((bubble, slug) => {
      let weight = 0;
      let factors = [];
      
      // 1. Search Score (if search is active) - HIGHEST PRIORITY (70% weight)
      if (hasActiveSearch && this.searchScores.has(slug)) {
        // Use normalized search score (0-1 range)
        const searchScore = this.searchScores.get(slug);
        const searchWeight = searchScore * 0.7;
        weight += searchWeight;
        factors.push(`search:${searchWeight.toFixed(2)}`);
      } else if (hasActiveSearch) {
        // Search is active but this bubble didn't match
        factors.push('search:0.00');
      }
      
      // 2. Perspective Data Quality (20% weight)
      const fungusData = this.cachedFungusData.get(slug);
      if (this.activePerspectives && this.activePerspectives.length > 0 && fungusData) {
        const perspectiveMapping = {
          'taxonomy': 'taxonomy',
          'physicalCharacteristics': 'physicalCharacteristics',
          'ecologyAndHabitat': 'ecologyAndHabitat',
          'culinaryAndNutritional': 'culinaryAndNutritional',
          'medicinalAndHealth': 'medicinalAndHealth',
          'cultivationAndProcessing': 'cultivationAndProcessing',
          'safetyAndIdentification': 'safetyAndIdentification',
          'chemicalAndProperties': 'chemicalAndProperties',
          'culturalAndHistorical': 'culturalAndHistorical',
          'commercialAndMarket': 'commercialAndMarket',
          'environmentalAndConservation': 'environmentalAndConservation',
          'researchAndInnovation': 'researchAndInnovation'
        };
        
        let perspectiveDataQuality = 0;
        const activePerspectiveKeys = this.activePerspectives.map(p => perspectiveMapping[p]).filter(Boolean);
        
        activePerspectiveKeys.forEach(perspectiveKey => {
          const perspectiveData = fungusData[perspectiveKey];
          if (perspectiveData && typeof perspectiveData === 'object') {
            // Count non-empty fields in this perspective
            const fields = Object.values(perspectiveData).filter(v => 
              v !== null && v !== undefined && v !== ''
            );
            perspectiveDataQuality += fields.length > 0 ? 1 : 0;
          }
        });
        
        if (perspectiveDataQuality > 0 && activePerspectiveKeys.length > 0) {
          const perspectiveWeight = (perspectiveDataQuality / activePerspectiveKeys.length) * 0.2;
          weight += perspectiveWeight;
          factors.push(`perspective:${perspectiveWeight.toFixed(2)}`);
        }
      }
      
      // 3. User Interactions (10% weight - selections, hovers, clicks)
      const interactionScore = this.userNodeData.selectedBubbles.includes(slug) ? 1.0 : 0;
      const interactionWeight = interactionScore * 0.1;
      if (interactionWeight > 0) {
        weight += interactionWeight;
        factors.push(`interaction:${interactionWeight.toFixed(2)}`);
      }
      
      // 4. Base weight - ensure all bubbles have some connection
      const baseWeight = 0.1;
      weight += baseWeight;
      
      // Normalize weight to 0-1 range
      weight = Math.min(1.0, Math.max(0, weight));
      
      this.userNodeData.connections.set(slug, weight);
      
      if (weight > 0.3) { // Log significant connections
        console.log(`[BubbleView] Connection to ${slug}: ${weight.toFixed(2)} [${factors.join(', ') || 'base'}]`);
      }
    });
    
    const strongConnections = Array.from(this.userNodeData.connections.values()).filter(w => w > 0.3).length;
    const searchStatus = hasActiveSearch ? `Active (${this.searchMatchedBubbles.size} matches)` : 'Inactive';
    console.log(`[BubbleView] 👤 USER NODE: ${this.userNodeData.connections.size} total connections, ${strongConnections} strong (>0.3) [Search: ${searchStatus}, Perspectives: ${this.activePerspectives.length}]`);
    
    // Log all connection weights for debugging
    Array.from(this.userNodeData.connections.entries()).forEach(([targetId, weight]) => {
      console.log(`  → ${targetId}: ${weight.toFixed(3)}`);
    });
    
    // UPDATE BUBBLE SIZES based on weights (visualize importance)
    this.updateBubbleSizes();
  }

  /**
   * Update bubble sizes based on weights (search scores + user connections)
   */
  updateBubbleSizes() {
    // RESPONSIVE: Adjust size ranges based on viewport
    const width = this.offsetWidth || 800;
    const isSmallScreen = width < 600;
    const isMediumScreen = width >= 600 && width < 1024;
    
    let minSize = 60;
    let maxSize = 140;
    
    if (isSmallScreen) {
      minSize = 50;   // Smaller minimum on mobile
      maxSize = 100;  // Smaller maximum on mobile
    } else if (isMediumScreen) {
      minSize = 55;
      maxSize = 120;
    }
    
    console.log(`[BubbleView] 📏 Updating bubble sizes for ${this.bubbles.size} bubbles (screen: ${width}px, range: ${minSize}-${maxSize}px)`);
    console.log(`[BubbleView] 📏 User node connections:`, Array.from(this.userNodeData.connections.entries()));
    
    this.bubbles.forEach((bubble, slug) => {
      let weight = 0;
      
      // Get weight from user node connections (includes search score)
      if (this.userNodeData.connections.has(slug)) {
        weight = this.userNodeData.connections.get(slug);
      }
      
      // Calculate size: higher weight = larger bubble
      let newSize = minSize + (maxSize - minSize) * weight;
      
      // Clamp to min/max
      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      
      // Update canvas bubble data
      bubble.size = newSize;
      
      // Update BubbleMorph element (CRITICAL for visual update)
      if (bubble.morph) {
        // Set size property (triggers Lit reactivity)
        bubble.morph.size = newSize;
        
        // Force immediate style update (bypasses Lit's update cycle)
        bubble.morph.style.width = `${newSize}px`;
        bubble.morph.style.height = `${newSize}px`;
        bubble.morph.style.left = `${bubble.x - newSize / 2}px`;
        bubble.morph.style.top = `${bubble.y - newSize / 2}px`;
        
        // Request Lit update for internal content scaling
        bubble.morph.requestUpdate();
      }
      
      console.log(`[BubbleView] 📏 ${slug}: size ${newSize.toFixed(0)}px (weight: ${weight.toFixed(2)})`);
    });
  }

  updateSimilarityMatrix() {
    // Calculate similarity between bubbles using HilbertSpaceSimilarity
    this.connections.clear();
    
    const bubbleArray = Array.from(this.bubbles.values());
    
    console.log('[BubbleView] 🔬 Updating similarity matrix with perspectives:', this.activePerspectives);
    
    // Get perspective field mappings (convert perspective names to data structure paths)
    const perspectiveMapping = {
      'taxonomy': 'taxonomy',
      'physicalCharacteristics': 'physicalCharacteristics',
      'ecologyAndHabitat': 'ecologyAndHabitat',
      'culinaryAndNutritional': 'culinaryAndNutritional',
      'medicinalAndHealth': 'medicinalAndHealth',
      'cultivationAndProcessing': 'cultivationAndProcessing',
      'safetyAndIdentification': 'safetyAndIdentification',
      'chemicalAndProperties': 'chemicalAndProperties',
      'culturalAndHistorical': 'culturalAndHistorical',
      'commercialAndMarket': 'commercialAndMarket',
      'environmentalAndConservation': 'environmentalAndConservation',
      'researchAndInnovation': 'researchAndInnovation'
    };
    
    // Map active perspectives to data structure keys
    const activePerspectiveKeys = this.activePerspectives.map(p => perspectiveMapping[p]).filter(Boolean);
    
    for (let i = 0; i < bubbleArray.length; i++) {
      for (let j = i + 1; j < bubbleArray.length; j++) {
        const bubble1 = bubbleArray[i];
        const bubble2 = bubbleArray[j];
        
        // Get full fungus data from cache (populated by BubbleHost.setData)
        const fungus1 = this.cachedFungusData.get(bubble1.slug);
        const fungus2 = this.cachedFungusData.get(bubble2.slug);
        
        if (!fungus1 || !fungus2) {
          console.warn('[BubbleView] Missing cached data for:', bubble1.slug, bubble2.slug);
          continue;
        }
        
        // Use HilbertSpaceSimilarity with active perspectives
        const similarity = HilbertSpaceSimilarity.calculate(
          fungus1, 
          fungus2, 
          activePerspectiveKeys.length > 0 ? activePerspectiveKeys : undefined
        );
        
        // Only create connection if similarity is above threshold
        if (similarity > 0.2) {
          const connId = `${bubble1.slug}-${bubble2.slug}`;
          this.connections.set(connId, {
            from: bubble1.slug,
            to: bubble2.slug,
            weight: similarity,
            type: 'similarity'
          });
          
          if (similarity > 0.5) { // Log strong connections
            console.log(`[BubbleView] Strong Hilbert similarity ${bubble1.slug} ↔ ${bubble2.slug}: ${similarity.toFixed(3)}`);
          }
        }
      }
    }
    
    const strongConnections = Array.from(this.connections.values()).filter(c => c.weight > 0.5).length;
    console.log(`[BubbleView] 🔗 Created ${this.connections.size} bubble-to-bubble connections, ${strongConnections} strong (>0.5)`);
  }

  handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    console.log(`[BubbleView] 🎭 Perspective change: ${perspectives.length} active - ${perspectives.join(', ')}`);
    
    this.activePerspectives = perspectives;
    this.userNodeData.activePerspectives = perspectives;
    
    // Update connections
    this.updateUserNodeConnections();
  }

  handleSearch(event) {
    const query = event.detail?.query || '';
    const totalResults = event.detail?.totalResults || 0;
    const scores = event.detail?.scores || {}; // slug → numeric score
    const matchedFields = event.detail?.matchedFields || {}; // slug → array of field paths
    const results = event.detail?.results || []; // array of fungus objects
    
    console.log('[BubbleView] 🔍 Search completed:', { query, totalResults, hasQuery: !!query, scoresCount: Object.keys(scores).length });
    
    // Store current search query for connection weight calculation
    this.currentSearchQuery = query;
    this.hasActiveSearch = !!query && query.length >= 2;
    
    if (this.hasActiveSearch) {
      // Add to search history
      this.userNodeData.searchQueries.push({
        query,
        timestamp: Date.now()
      });
      
      // Store search scores and matched fields from ConvexSearchReactor
      this.searchScores.clear();
      this.searchMatchedFields.clear();
      this.searchMatchedBubbles = new Set();
      
      // Process results to extract scores and normalize them
      const maxScore = Math.max(...Object.values(scores), 1);
      
      results.forEach(fungus => {
        const slug = fungus.slug;
        if (this.bubbles.has(slug)) {
          this.searchMatchedBubbles.add(slug);
          
          // Normalize score to 0-1 range
          const rawScore = scores[slug] || 0;
          const normalizedScore = maxScore > 0 ? rawScore / maxScore : 0;
          this.searchScores.set(slug, normalizedScore);
          
          // Store matched fields for detail display
          const fields = matchedFields[slug] || [];
          this.searchMatchedFields.set(slug, fields);
          
          console.log('[BubbleView] 🎯 Search matched:', slug, 'score:', normalizedScore.toFixed(3), 'fields:', fields.length);
        }
      });
      
      console.log('[BubbleView] Search matched bubbles:', this.searchMatchedBubbles.size);
    } else {
      // Empty or short search - clear search matches
      this.searchMatchedBubbles = new Set();
      this.searchScores.clear();
      this.searchMatchedFields.clear();
      console.log('[BubbleView] Search cleared');
    }
    
    // Update connections and sizes immediately
    this.updateUserNodeConnections();
    // Note: updateBubbleSizes() is called in updateUserNodeConnections()
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    if (this.isSimulating) return;
    
    this.isSimulating = true;
    console.log('[BubbleView] Animation started');
    this.animate();
  }

  /**
   * Stop animation loop
   */
  stopAnimation() {
    this.isSimulating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Animation loop
   */
  animate = () => {
    if (!this.isSimulating) return;
    
    const deltaTime = 16; // ~60fps
    
    // Update Canvas Reactors
    if (this.reactorsEnabled) {
      Object.values(this.canvasReactors).forEach(reactor => {
        if (reactor && reactor.isActive && reactor.isActive()) {
          reactor.update(deltaTime);
        }
      });
    } else {
      // Fallback physics
      this.updatePhysicsFallback();
    }
    
    // Render
    this.renderCanvas();
    
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Fallback physics (if reactors not enabled)
   */
  updatePhysicsFallback() {
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    
    // Simple centering force for user node
    const centerX = width / 2;
    const centerY = height / 2;
    
    const dx = centerX - this.userNodeData.x;
    const dy = centerY - this.userNodeData.y;
    
    this.userNodeData.vx += dx * 0.05;
    this.userNodeData.vy += dy * 0.05;
    
    this.userNodeData.vx *= 0.9;
    this.userNodeData.vy *= 0.9;
    
    this.userNodeData.x += this.userNodeData.vx;
    this.userNodeData.y += this.userNodeData.vy;
    
    // Simple repulsion for bubbles
    this.bubbles.forEach((bubble) => {
      if (bubble.isDragging) return;
      
      // Repel from edges
      const margin = 50;
      if (bubble.x < margin) bubble.vx += 0.5;
      if (bubble.x > width - margin) bubble.vx -= 0.5;
      if (bubble.y < margin) bubble.vy += 0.5;
      if (bubble.y > height - margin) bubble.vy -= 0.5;
      
      bubble.vx *= 0.95;
      bubble.vy *= 0.95;
      
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      
      // CRITICAL FIX: Synchronize BubbleMorph position with canvas data
      if (bubble.morph) {
        bubble.morph.x = bubble.x;
        bubble.morph.y = bubble.y;
        bubble.morph.requestUpdate();
      }
    });
  }

  /**
   * Render canvas
   */
  renderCanvas() {
    if (!this.ctx || !this.canvas) return;
    
    const { width, height } = this.canvas;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Render with Canvas Reactors
    if (this.reactorsEnabled) {
      const allReactors = Object.values(this.canvasReactors).filter(r => r);
      const activeReactors = allReactors.filter(r => r.isActive && r.isActive());
      
      if (activeReactors.length > 0) {
        // Sort by priority
        const sortedReactors = activeReactors.sort((a, b) => 
          (a.config?.priority || 100) - (b.config?.priority || 100)
        );
        
        // Render each reactor
        sortedReactors.forEach(reactor => {
          try {
            if (reactor.render) {
              reactor.render(this.ctx);
            }
          } catch (error) {
            console.error(`[BubbleView] Error rendering reactor:`, error);
          }
        });
      } else {
        // No active reactors, use fallback
        this.renderFallback();
      }
    } else {
      // Reactors not enabled, use fallback
      this.renderFallback();
    }
    
    // Bubbles are rendered as DOM elements (BubbleMorph), not on canvas
  }

  /**
   * Fallback rendering
   */
  renderFallback() {
    const ctx = this.ctx;
    
    // Draw connections
    this.connections.forEach((conn) => {
      const fromBubble = this.bubbles.get(conn.from);
      const toBubble = this.bubbles.get(conn.to);
      
      if (!fromBubble || !toBubble) return;
      
      ctx.save();
      ctx.strokeStyle = `rgba(102, 126, 234, ${0.3 + conn.weight * 0.4})`;
      ctx.lineWidth = 1 + conn.weight * 2;
      ctx.beginPath();
      ctx.moveTo(fromBubble.x, fromBubble.y);
      ctx.lineTo(toBubble.x, toBubble.y);
      ctx.stroke();
      ctx.restore();
    });
    
    // Draw user node
    if (this.userNodeData) {
      const x = this.userNodeData.x;
      const y = this.userNodeData.y;
      const size = this.userNodeData.size;
      
      ctx.save();
      
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.restore();
      
      // Draw user node connections
      this.userNodeData.connections.forEach((weight, slug) => {
        const bubble = this.bubbles.get(slug);
        if (!bubble || weight < 0.3) return;
        
        ctx.save();
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 + weight * 0.5})`;
        ctx.lineWidth = 2 + weight * 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(bubble.x, bubble.y);
        ctx.stroke();
        ctx.restore();
      });
    }
  }

  render() {
    return html`
      <div class="bubble-container">
        <canvas class="bubble-canvas"></canvas>
        <div class="bubble-morphs"></div>
      </div>
    `;
  }
}

customElements.define('bubble-view', BubbleView);
