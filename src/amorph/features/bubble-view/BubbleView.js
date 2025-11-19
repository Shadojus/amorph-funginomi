/**
 * 🫧 BUBBLE VIEW - CLEAN REWRITE
 * ================================
 * 
 * Simple, working visualization with Canvas-Reactors integration
 */

import { LitElement, html, css } from 'lit';

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
  `;

  constructor() {
    super();
    
    // Core state
    this.isSimulating = false;
    this.animationFrame = null;
    
    // Data structures
    this.bubbles = new Map(); // slug -> bubble data
    this.connections = new Map(); // id -> connection data
    this.activePerspectives = ['cultivation', 'culinary'];
    
    // User Node (central point representing user's intent)
    this.userNodeData = {
      x: 400,
      y: 300,
      vx: 0,
      vy: 0,
      size: 160,
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
    
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Update user node position to center
    if (this.userNodeData) {
      this.userNodeData.x = width / 2;
      this.userNodeData.y = height / 2;
    }
    
    console.log('[BubbleView] Resized:', { width, height });
  }

  initializeUserNode() {
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    
    this.userNodeData.x = width / 2;
    this.userNodeData.y = height / 2;
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
    
    // Clear existing bubbles
    this.bubbles.clear();
    
    // Create bubbles with random positions
    fungi.forEach((fungus, index) => {
      // Extract slug from different possible locations
      const slug = fungus.slug || fungus._id || fungus.id || `fungus-${index}`;
      const label = fungus.names?.scientific || fungus.scientificName || fungus.names?.common || fungus.commonName || `Fungus ${index + 1}`;
      
      const angle = (index / fungi.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      
      this.bubbles.set(slug, {
        slug: slug,
        label: label,
        data: fungus,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: 80,
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
    if (!this.userNodeData) {
      console.warn('[BubbleView] No userNodeData available');
      return;
    }
    
    if (this.bubbles.size === 0) {
      console.warn('[BubbleView] No bubbles available to connect');
      return;
    }
    
    this.userNodeData.connections.clear();
    
    // Initialize search matched bubbles set if not exists
    if (!this.searchMatchedBubbles) {
      this.searchMatchedBubbles = new Set();
    }
    
    // Check if we have active search
    const hasActiveSearch = this.hasActiveSearch || false;
    
    // Calculate weights based on multiple factors
    this.bubbles.forEach((bubble, slug) => {
      let weight = 0;
      let factors = [];
      
      // 1. Search Score (if search is active) - HIGHEST PRIORITY
      if (hasActiveSearch && this.searchMatchedBubbles.has(slug)) {
        // This bubble matched the search query
        weight += 1.0 * 0.6; // 60% weight for search match (full score)
        factors.push('search:1.00');
      } else if (hasActiveSearch) {
        // Search is active but this bubble didn't match
        // Give it zero search contribution
        factors.push('search:0.00');
      }
      
      // 2. Perspective Match - check if fungus has active perspectives
      if (this.activePerspectives && this.activePerspectives.length > 0 && bubble.data) {
        const fungus = bubble.data;
        let perspectiveScore = 0;
        
        // Check perspectives in fungus data
        this.activePerspectives.forEach(perspective => {
          // Check if fungus has data for this perspective
          if (fungus.cultivation && perspective === 'cultivation') perspectiveScore += 0.25;
          if (fungus.culinary && perspective === 'culinary') perspectiveScore += 0.25;
          if (fungus.medicinal && perspective === 'medicinal') perspectiveScore += 0.25;
          if (fungus.ecological && perspective === 'ecological') perspectiveScore += 0.25;
          
          // Check tags
          if (fungus.tags && fungus.tags.includes(perspective)) perspectiveScore += 0.15;
        });
        
        weight += perspectiveScore * 0.3; // 30% weight for perspective match
        if (perspectiveScore > 0) {
          factors.push(`perspective:${perspectiveScore.toFixed(2)}`);
        }
      }
      
      // 3. User Interactions (selections, hovers, clicks)
      const interactionScore = this.userNodeData.selectedBubbles.includes(slug) ? 0.5 : 0;
      weight += interactionScore * 0.1; // 10% weight for interaction
      if (interactionScore > 0) {
        factors.push(`interaction:${interactionScore.toFixed(2)}`);
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
  }

  updateSimilarityMatrix() {
    // Calculate similarity between bubbles based on real data
    this.connections.clear();
    
    const bubbleArray = Array.from(this.bubbles.values());
    
    for (let i = 0; i < bubbleArray.length; i++) {
      for (let j = i + 1; j < bubbleArray.length; j++) {
        const bubble1 = bubbleArray[i];
        const bubble2 = bubbleArray[j];
        
        if (!bubble1.data || !bubble2.data) continue;
        
        const fungus1 = bubble1.data;
        const fungus2 = bubble2.data;
        
        let similarity = 0;
        let factors = [];
        
        // 1. Tag Overlap (Jaccard similarity)
        if (fungus1.tags && fungus2.tags && fungus1.tags.length > 0 && fungus2.tags.length > 0) {
          const tags1 = new Set(fungus1.tags);
          const tags2 = new Set(fungus2.tags);
          const intersection = new Set([...tags1].filter(x => tags2.has(x)));
          const union = new Set([...tags1, ...tags2]);
          
          const tagSimilarity = intersection.size / union.size;
          similarity += tagSimilarity * 0.4; // 40% weight
          if (tagSimilarity > 0) {
            factors.push(`tags:${tagSimilarity.toFixed(2)}`);
          }
        }
        
        // 2. Shared Perspectives
        let sharedPerspectives = 0;
        const perspectives = ['cultivation', 'culinary', 'medicinal', 'ecological'];
        perspectives.forEach(p => {
          if (fungus1[p] && fungus2[p]) {
            sharedPerspectives++;
          }
        });
        
        if (sharedPerspectives > 0) {
          const perspectiveSimilarity = sharedPerspectives / perspectives.length;
          similarity += perspectiveSimilarity * 0.3; // 30% weight
          factors.push(`perspectives:${perspectiveSimilarity.toFixed(2)}`);
        }
        
        // 3. Family/Genus similarity (if available)
        if (fungus1.family && fungus2.family && fungus1.family === fungus2.family) {
          similarity += 0.2; // 20% bonus for same family
          factors.push('family:match');
        } else if (fungus1.genus && fungus2.genus && fungus1.genus === fungus2.genus) {
          similarity += 0.3; // 30% bonus for same genus
          factors.push('genus:match');
        }
        
        // 4. Common regions/habitats (if available)
        if (fungus1.regions && fungus2.regions) {
          const regions1 = new Set(fungus1.regions);
          const regions2 = new Set(fungus2.regions);
          const commonRegions = new Set([...regions1].filter(x => regions2.has(x)));
          
          if (commonRegions.size > 0) {
            const regionSimilarity = commonRegions.size / Math.max(regions1.size, regions2.size);
            similarity += regionSimilarity * 0.1; // 10% weight
            factors.push(`regions:${regionSimilarity.toFixed(2)}`);
          }
        }
        
        // Only create connection if similarity is above threshold
        if (similarity > 0.2) {
          const connId = `${bubble1.slug}-${bubble2.slug}`;
          this.connections.set(connId, {
            from: bubble1.slug,
            to: bubble2.slug,
            weight: Math.min(1.0, similarity),
            type: 'similarity',
            factors: factors
          });
          
          if (similarity > 0.5) { // Log strong connections
            console.log(`[BubbleView] Strong connection ${bubble1.slug} ↔ ${bubble2.slug}: ${similarity.toFixed(2)} [${factors.join(', ')}]`);
          }
        }
      }
    }
    
    const strongConnections = Array.from(this.connections.values()).filter(c => c.weight > 0.5).length;
    console.log(`[BubbleView] 🔗 Created ${this.connections.size} bubble-to-bubble connections, ${strongConnections} strong (>0.5)`);
  }

  handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    console.log('[BubbleView] Perspectives changed:', perspectives);
    
    this.activePerspectives = perspectives;
    this.userNodeData.activePerspectives = perspectives;
    
    // Update connections
    this.updateUserNodeConnections();
  }

  handleSearch(event) {
    const query = event.detail?.query || '';
    const totalResults = event.detail?.totalResults || 0;
    
    console.log('[BubbleView] 🔍 Search completed:', { query, totalResults, hasQuery: !!query });
    
    // Store current search query for connection weight calculation
    this.currentSearchQuery = query;
    this.hasActiveSearch = !!query && query.length >= 2;
    
    if (this.hasActiveSearch) {
      // Add to search history
      this.userNodeData.searchQueries.push({
        query,
        timestamp: Date.now()
      });
      
      // Check which bubbles are visible (matched by search)
      // Find all fungus-card containers and check which are visible
      this.searchMatchedBubbles = new Set();
      
      const allCards = document.querySelectorAll('.fungus-card');
      allCards.forEach(card => {
        // Only process visible cards
        if (card.style.display !== 'none') {
          // Extract slug from first data-morph's fungus-data
          const firstMorph = card.querySelector('[fungus-data]');
          if (firstMorph) {
            try {
              const fungusDataAttr = firstMorph.getAttribute('fungus-data');
              const fungusData = JSON.parse(fungusDataAttr);
              const slug = fungusData.slug || fungusData._id || fungusData.id;
              
              if (slug && this.bubbles.has(slug)) {
                this.searchMatchedBubbles.add(slug);
                console.log('[BubbleView] 🎯 Search matched:', slug);
              }
            } catch (e) {
              console.warn('[BubbleView] Failed to parse fungus-data:', e);
            }
          }
        }
      });
      
      console.log('[BubbleView] Search matched bubbles:', this.searchMatchedBubbles.size);
    } else {
      // Empty or short search - clear search matches
      this.searchMatchedBubbles = new Set();
      console.log('[BubbleView] Search cleared');
    }
    
    // Update connections immediately
    this.updateUserNodeConnections();
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
    
    // Always render bubbles on top
    this.renderBubbles();
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
      
      // Icon
      ctx.font = '48px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', x, y - 15);
      
      // Label
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('YOU', x, y + 25);
      
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

  /**
   * Render bubbles
   */
  renderBubbles() {
    const ctx = this.ctx;
    
    this.bubbles.forEach((bubble) => {
      ctx.save();
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
      
      const color = bubble.color;
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const label = bubble.label.substring(0, 20);
      ctx.fillText(label, bubble.x, bubble.y);
      
      ctx.restore();
    });
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
