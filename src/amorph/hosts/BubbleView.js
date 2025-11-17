/**
 * 🫧 BUBBLE VIEW
 * ==============
 * 
 * Innovative Layout-System wo Morphs als Bubbles im fluiden Space schweben
 * 
 * Features:
 * - Force-directed graph layout
 * - Morph clustering by perspectives
 * - Interactive dragging & throwing
 * - Collision detection & physics
 * - Zoom & pan navigation
 * - Visual connections between related items
 * 
 * Architecture:
 * - Lit Web Component als Container
 * - Canvas für Performance-kritisches Rendering
 * - Integration mit FlowReactor für Physik
 * - Pixie Renderer für visuelle Effekte
 * 
 * Usage:
 * <bubble-view></bubble-view>
 * 
 * const bubbleView = document.querySelector('bubble-view');
 * bubbleView.setMorphs(morphArray);
 */

import { LitElement, html, css } from 'lit';
import '../morphs/data/BubbleMorph.js';

export class BubbleView extends LitElement {
  static properties = {
    morphs: { type: Array },
    zoom: { type: Number },
    panX: { type: Number },
    panY: { type: Number },
    isSimulating: { type: Boolean },
    showConnections: { type: Boolean },
    clusterByPerspective: { type: Boolean },
    selectedBubbles: { type: Array }
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

    .bubble-container {
      position: relative;
      width: 100%;
      height: 100%;
      cursor: grab;
    }

    .bubble-container.dragging {
      cursor: grabbing;
    }

    .bubble-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .bubble-morphs {
      position: absolute;
      inset: 0;
      transform-origin: 0 0;
      z-index: 2;
      pointer-events: none;
    }

    .bubble-morph {
      position: absolute;
      transition: transform 0.3s ease-out;
      cursor: pointer;
      user-select: none;
    }

    .bubble-morph:hover {
      z-index: 100;
      transform: scale(1.1);
    }

    .bubble-controls {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
      z-index: 200;
    }

    .bubble-control-btn {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .bubble-control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .bubble-control-btn.active {
      background: rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }

    .bubble-info {
      position: absolute;
      bottom: 16px;
      left: 16px;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      color: white;
      font-size: 12px;
      z-index: 200;
    }

    .bubble-info-item {
      margin-bottom: 4px;
    }

    .bubble-info-item:last-child {
      margin-bottom: 0;
    }

    .bubble-tooltip {
      position: absolute;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      pointer-events: none;
      z-index: 300;
      min-width: 200px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .tooltip-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: white;
    }

    .tooltip-similarity {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 4px;
    }

    .tooltip-similar-items {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 12px;
    }

    .tooltip-similar-item {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .tooltip-similar-score {
      color: #667eea;
      font-weight: 600;
    }

    .bubble-loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    }

    @keyframes pulse-ring {
      0%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .bubble-morph::after {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      border: 2px solid currentColor;
      opacity: 0;
      animation: pulse-ring 2s ease-out infinite;
    }
  `;

  constructor() {
    super();
    this.morphs = [];
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isSimulating = false;
    this.showConnections = false;
    this.selectedBubbles = [];
    this.clusterByPerspective = true;
    
    // State
    this.bubbles = new Map(); // morph -> bubble data
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.lastPan = { x: 0, y: 0 };
    
    // Canvas
    this.canvas = null;
    this.ctx = null;
    
    // Animation
    this.animationFrame = null;
    
    // Similarity data
    this.similarityMatrix = new Map();
    this.activePerspectives = [];
    this.fungiData = [];
    this._matrixUpdateTimeout = null; // Debounce matrix updates
    
    // Interaction state
    this.hoveredBubble = null;
    this.draggedBubble = null;
    
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
    document.addEventListener('perspective-changed', this._boundPerspectiveHandler);

    // Listen for search events
    this._boundSearchHandler = this.handleSearch.bind(this);
    window.addEventListener('amorph:search', this._boundSearchHandler);
  }

  /**
   * Handle perspective change events
   */
  handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    // Reduced logging: only log when count changes
    if (perspectives.length !== this.activePerspectives.length) {
      console.log('[BubbleView] Perspectives changed:', perspectives);
    }
    this.updatePerspectives(perspectives);
  }

  /**
   * Handle search events
   */
  handleSearch(event) {
    const query = event.detail?.query || '';
    const results = event.detail?.results || [];
    
    console.log('[BubbleView] Search:', query, 'Results:', results.length);
    
    // Update bubble sizes based on search relevance
    this.bubbles.forEach((bubble, slug) => {
      const isMatch = results.some(r => r.slug === slug || bubble.label.toLowerCase().includes(query.toLowerCase()));
      
      if (query === '') {
        // Reset to normal
        bubble.searchRelevance = 1.0;
      } else if (isMatch) {
        bubble.searchRelevance = 1.5; // Boost matched bubbles
      } else {
        bubble.searchRelevance = 0.4; // Dim non-matched bubbles
      }
    });
    
    this.requestUpdate();
  }

  firstUpdated() {
    // Initialize canvas
    this.canvas = this.shadowRoot.querySelector('.bubble-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
    }
    
    // Add event listeners
    this.addEventListeners();
    
    // Add resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this);
    
    // Start animation loop
    this.startAnimation();
    
    // Notify MorphHeader that BubbleView is active
    this.dispatchEvent(new CustomEvent('bubble-view-active', {
      bubbles: true,
      composed: true,
      detail: { bubbleView: this }
    }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAnimation();

    // Remove event listeners
    if (this._boundPerspectiveHandler) {
      window.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
      document.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
    }
    if (this._boundSearchHandler) {
      window.removeEventListener('amorph:search', this._boundSearchHandler);
    }

    // Cleanup resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Set morphs to display in bubble view
   */
  setMorphs(morphs) {
    this.morphs = morphs;
    this.initializeBubbles();
  }

  /**
   * Set fungi data for similarity calculations
   */
  setFungiData(fungi) {
    this.fungiData = fungi;
    this.updateSimilarityMatrix();
  }

  /**
   * Update active perspectives
   */
  updatePerspectives(perspectives) {
    this.activePerspectives = perspectives;
    
    // Update all bubble elements with new perspectives
    this.bubbles.forEach((bubble, groupId) => {
      if (bubble.element) {
        bubble.element.setAttribute('perspectives', perspectives.join(','));
      }
    });
    
    this.updateSimilarityMatrix();
    // Note: updateBubbleSizes() is called automatically after matrix update (debounced)
  }

  /**
   * Update similarity matrix based on current perspectives (debounced)
   */
  async updateSimilarityMatrix() {
    if (this.fungiData.length === 0) return;
    
    // Debounce: cancel previous update if still pending
    if (this._matrixUpdateTimeout) {
      clearTimeout(this._matrixUpdateTimeout);
    }
    
    // Schedule update after 150ms
    this._matrixUpdateTimeout = setTimeout(async () => {
      // Import dynamically to avoid circular deps
      const { HilbertSpaceSimilarity } = await import('../reactors/HilbertSpaceSimilarity.js');
      this.similarityMatrix = HilbertSpaceSimilarity.calculateMatrix(
        this.fungiData,
        this.activePerspectives
      );
      console.log('[BubbleView] Similarity matrix updated');
      
      // Update bubble sizes after matrix is ready
      this.updateBubbleSizes();
    }, 150);
  }

  /**
   * Get average similarity for a fungus
   */
  getAverageSimilarity(slug) {
    const similarities = this.similarityMatrix.get(slug);
    if (!similarities) return 0.5;

    let total = 0;
    let count = 0;

    similarities.forEach((similarity, otherSlug) => {
      if (slug === otherSlug) return;
      total += similarity;
      count++;
    });

    return count > 0 ? total / count : 0.5;
  }

  /**
   * Get similarity between two fungi
   */
  getSimilarity(slug1, slug2) {
    const similarities = this.similarityMatrix.get(slug1);
    return similarities ? similarities.get(slug2) || 0 : 0;
  }

  /**
   * Initialize bubble data for each morph
   * GROUP morphs by data-group and create ONE bubble per group
   */
  initializeBubbles() {
    let width = this.offsetWidth;
    let height = this.offsetHeight;
    
    // If component is hidden, use default size
    if (width === 0 || height === 0) {
      width = 800;
      height = 600;
      console.log('[BubbleView] Using default size (component hidden)');
    }
    
    this.bubbles.clear();
    
    // GROUP morphs by data-group
    const groups = new Map();
    this.morphs.forEach(morph => {
      const group = morph.dataset.group || 'default';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push(morph);
    });
    
    console.log('[BubbleView] Found', groups.size, 'groups from', this.morphs.length, 'morphs');
    
    // Create ONE bubble per group
    let index = 0;
    groups.forEach((morphs, groupId) => {
      // Position in circle
      const angle = (index / groups.size) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      // Get name from name-morph if exists
      const nameMorph = morphs.find(m => m.tagName.toLowerCase() === 'name-morph');
      const label = nameMorph?.getAttribute('value') || `Group ${index + 1}`;
      
      // Get similarity for this fungus
      const avgSimilarity = this.getAverageSimilarity(groupId);
      
      // Bubble size based on similarity
      const minSize = 60;
      const maxSize = 150;
      const size = minSize + (maxSize - minSize) * avgSimilarity;
      
      // Opacity based on similarity
      const minOpacity = 0.3;
      const maxOpacity = 1.0;
      const opacity = minOpacity + (maxOpacity - minOpacity) * avgSimilarity;
      
      // Get perspective from first morph
      const perspective = this.getMorphPerspective(morphs[0]);
      
      // Create DOM element for this bubble (for AMORPH registration)
      const bubbleElement = this.createBubbleElement(groupId, label, avgSimilarity);
      
      // Store bubble data first
      const bubbleData = {
        x,
        y,
        vx: 0,
        vy: 0,
        size,
        opacity,
        similarity: avgSimilarity,
        perspective,
        mass: size / 80,
        isDragging: false,
        morphs: morphs,
        label: label,
        element: bubbleElement // Reference to DOM element
      };
      
      // Listen for weight updates from reactor
      bubbleElement.addEventListener('bubble-weight-update', (e) => {
        const bubble = this.bubbles.get(e.detail.slug);
        if (bubble) {
          bubble.similarity = e.detail.similarity;
          // Trigger re-render
          if (this.animationRunning) {
            this.requestAnimationFrame();
          } else {
            this.render();
          }
        }
      });
      
      this.bubbles.set(groupId, bubbleData);
      
      index++;
    });
    
    console.log(`[BubbleView] Initialized ${this.bubbles.size} bubbles`);
    // Use updateComplete to avoid change-in-update warning
    this.updateComplete.then(() => this.requestUpdate());
  }

  /**
   * Update bubble sizes based on current similarity
   */
  updateBubbleSizes() {
    const minSize = 60;
    const maxSize = 150;
    const minOpacity = 0.3;
    const maxOpacity = 1.0;

    this.bubbles.forEach((bubble, groupId) => {
      const avgSimilarity = this.getAverageSimilarity(groupId);
      
      bubble.size = minSize + (maxSize - minSize) * avgSimilarity;
      bubble.opacity = minOpacity + (maxOpacity - minOpacity) * avgSimilarity;
      bubble.similarity = avgSimilarity;
      bubble.mass = bubble.size / 80;

      // Update DOM element attributes
      if (bubble.element) {
        bubble.element.dataset.similarity = avgSimilarity;
        bubble.element.dataset.size = bubble.size;
        bubble.element.dataset.opacity = bubble.opacity;
      }
    });

    // Reduced logging: removed spam
  }

  /**
   * Create DOM element for bubble (for AMORPH registration)
   */
  createBubbleElement(slug, label, similarity) {
    // Find or create container
    let container = this.shadowRoot.querySelector('.bubble-morphs-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'bubble-morphs-container';
      container.style.display = 'none'; // Hidden - only for registration
      this.shadowRoot.appendChild(container);
    }

    // Create bubble element as custom element
    const bubbleEl = document.createElement('bubble-morph');
    bubbleEl.dataset.morph = 'true';
    bubbleEl.dataset.morphType = 'bubble';
    bubbleEl.dataset.morphId = `bubble-${slug}`;
    bubbleEl.dataset.group = slug;
    bubbleEl.setAttribute('label', label);
    bubbleEl.setAttribute('slug', slug);
    bubbleEl.setAttribute('similarity', similarity);
    
    // Set perspectives from active perspectives
    if (this.activePerspectives.length > 0) {
      bubbleEl.setAttribute('perspectives', this.activePerspectives.join(','));
    }
    
    container.appendChild(bubbleEl);

    // Register with AMORPH
    if (window.amorph) {
      window.amorph.registerMorph(bubbleEl);
    }

    return bubbleEl;
  }

  /**
   * Get morph importance (0-1)
   */
  getMorphImportance(morph) {
    // Check search score
    if (this.amorph) {
      const score = this.amorph.state.searchScores.get(morph);
      if (score) return score / 100;
    }
    
    // Check data attribute
    if (morph.dataset.importance) {
      return parseFloat(morph.dataset.importance);
    }
    
    return 0.5;
  }

  /**
   * Get primary perspective from morph
   */
  getMorphPerspective(morph) {
    // Check perspective attribute
    if (morph.hasAttribute && morph.hasAttribute('perspective')) {
      return morph.getAttribute('perspective');
    }
    if (morph.dataset.morphPerspectives) {
      try {
        const perspectives = JSON.parse(morph.dataset.morphPerspectives);
        return perspectives[0] || 'culinary';
      } catch (e) {
        return 'culinary';
      }
    }
    return 'culinary';
  }
  
  /**
   * Get color for perspective
   */
  getPerspectiveColor(perspective) {
    const colors = {
      culinary: 'rgba(102, 126, 234, 0.8)',
      scientific: 'rgba(118, 75, 162, 0.8)',
      medicinal: 'rgba(237, 100, 166, 0.8)'
    };
    return colors[perspective] || 'rgba(150, 150, 150, 0.8)';
  }

  /**
   * Get colors for active perspectives
   */
  getPerspectiveColors() {
    const colorMap = {
      taxonomy: '#ef4444',
      physicalCharacteristics: '#f97316',
      ecologyAndHabitat: '#eab308',
      culinaryAndNutritional: '#22c55e',
      medicinalAndHealth: '#06b6d4',
      cultivationAndProcessing: '#3b82f6',
      safetyAndIdentification: '#8b5cf6',
      chemicalAndProperties: '#ec4899',
      culturalAndHistorical: '#d946ef',
      commercialAndMarket: '#14b8a6',
      environmentalAndConservation: '#10b981',
      researchAndInnovation: '#0ea5e9'
    };

    return this.activePerspectives.map(p => colorMap[p] || '#ffffff');
  }

  /**
   * Add alpha to color string
   */
  addAlpha(color, alpha) {
    if (color.startsWith('#')) {
      return this.hexToRgba(color, alpha);
    }
    // If already rgba, replace alpha
    return color.replace(/[\d.]+\)$/g, `${alpha})`);
  }

  /**
   * Add event listeners for interaction
   */
  addEventListeners() {
    const container = this.shadowRoot.querySelector('.bubble-container');
    if (!container) return;
    
    // Mouse events
    container.addEventListener('mousedown', this.onMouseDown.bind(this));
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('mouseup', this.onMouseUp.bind(this));
    container.addEventListener('mouseleave', this.onMouseUp.bind(this));
    container.addEventListener('click', this.onCanvasClick.bind(this));
    
    // Wheel zoom
    container.addEventListener('wheel', this.onWheel.bind(this));
    
    // Window resize
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Handle mouse down (start drag)
   */
  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on a bubble
    this.draggedBubble = this.getBubbleAtPosition(x, y);
    
    if (this.draggedBubble) {
      this.draggedBubble.isDragging = true;
    } else {
      this.isDragging = true;
    }
    
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.lastPan = { x: this.panX, y: this.panY };
  }

  /**
   * Handle mouse move (pan view + hover)
   */
  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update hover state
    const hoveredBubble = this.getBubbleAtPosition(x, y);
    if (hoveredBubble !== this.hoveredBubble) {
      this.hoveredBubble = hoveredBubble;
      const container = this.shadowRoot.querySelector('.bubble-container');
      if (container) {
        container.style.cursor = hoveredBubble ? 'pointer' : 'grab';
      }
    }
    
    // Handle bubble dragging
    if (this.draggedBubble) {
      const [slug, bubble] = this.draggedBubble;
      bubble.x = x;
      bubble.y = y;
      bubble.vx = 0;
      bubble.vy = 0;
      return;
    }
    
    // Handle canvas panning
    if (this.isDragging) {
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      
      this.panX = this.lastPan.x + dx / this.zoom;
      this.panY = this.lastPan.y + dy / this.zoom;
    }
  }

  /**
   * Handle mouse up (stop drag)
   */
  onMouseUp() {
    this.isDragging = false;
    if (this.draggedBubble) {
      this.draggedBubble.isDragging = false;
      this.draggedBubble = null;
    }
  }

  /**
   * Handle canvas click - toggle selection (max 4, FIFO)
   */
  onCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedBubble = this.getBubbleAtPosition(x, y);
    
    if (clickedBubble) {
      const [slug] = clickedBubble;
      this.toggleBubbleSelection(slug);
    }
  }

  /**
   * Toggle bubble selection (FIFO, max 4)
   */
  toggleBubbleSelection(slug) {
    if (!this.selectedBubbles) {
      this.selectedBubbles = [];
    }

    const index = this.selectedBubbles.indexOf(slug);
    
    if (index !== -1) {
      // Deselect
      this.selectedBubbles.splice(index, 1);
      console.log(`[BubbleView] Deselected: ${slug}`);
    } else {
      // Select (FIFO: remove oldest if at max)
      if (this.selectedBubbles.length >= 4) {
        const removed = this.selectedBubbles.shift();
        console.log(`[BubbleView] FIFO: Removed oldest selection: ${removed}`);
      }
      this.selectedBubbles.push(slug);
      console.log(`[BubbleView] Selected: ${slug}`);
    }

    console.log(`[BubbleView] Current selection (${this.selectedBubbles.length}/4):`, this.selectedBubbles);
    this.requestUpdate();
  }

  /**
   * Get bubble at position (returns [slug, bubble] or null)
   */
  getBubbleAtPosition(x, y) {
    for (const [slug, bubble] of this.bubbles.entries()) {
      const dx = x - bubble.x;
      const dy = y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= bubble.size / 2) {
        return [slug, bubble];
      }
    }
    return null;
  }

  /**
   * Handle wheel (zoom)
   */
  onWheel(e) {
    e.preventDefault();
    
    const zoomSpeed = 0.001;
    const delta = -e.deltaY;
    const newZoom = Math.max(0.1, Math.min(5, this.zoom + delta * zoomSpeed));
    
    this.zoom = newZoom;
  }

  /**
   * Resize canvas to match container
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    const rect = this.getBoundingClientRect();
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;
    
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    return { oldWidth, oldHeight, newWidth: rect.width, newHeight: rect.height };
  }

  /**
   * Handle container resize - scale bubble positions proportionally
   */
  handleResize() {
    const dimensions = this.resizeCanvas();
    if (!dimensions || this.bubbles.size === 0) return;
    
    const { oldWidth, oldHeight, newWidth, newHeight } = dimensions;
    
    // Skip if no valid old dimensions
    if (!oldWidth || !oldHeight) return;
    
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    
    // Scale bubble positions proportionally
    this.bubbles.forEach((bubble) => {
      bubble.x *= scaleX;
      bubble.y *= scaleY;
    });
    
    console.log(`[BubbleView] Resized: ${oldWidth}x${oldHeight} -> ${newWidth}x${newHeight}`);
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    this.isSimulating = true;
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
    
    // Update physics
    this.updatePhysics();
    
    // Render
    this.renderCanvas();
    
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Update bubble physics with similarity-based forces
   */
  updatePhysics() {
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    const margin = 100;
    
    const bubbleArray = Array.from(this.bubbles.entries());
    
    // Apply forces between bubbles based on similarity
    for (let i = 0; i < bubbleArray.length; i++) {
      const [slug1, bubble1] = bubbleArray[i];
      if (bubble1.isDragging) continue;
      
      for (let j = i + 1; j < bubbleArray.length; j++) {
        const [slug2, bubble2] = bubbleArray[j];
        
        const dx = bubble2.x - bubble1.x;
        const dy = bubble2.y - bubble1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) continue;
        
        const similarity = this.getSimilarity(slug1, slug2);
        
        // Normalize direction
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Minimum safe distance
        const minDistance = (bubble1.size + bubble2.size) / 2 + 10;
        
        // Only apply force if too close (collision prevention)
        let totalForce = 0;
        if (distance < minDistance) {
          // Strong repulsion only when actually colliding
          totalForce = -(minDistance - distance) * 0.01;
        }
        // No attraction forces - bubbles just drift naturally
        
        // Apply forces
        bubble1.vx -= nx * totalForce;
        bubble1.vy -= ny * totalForce;
        bubble2.vx += nx * totalForce;
        bubble2.vy += ny * totalForce;
      }
    }
    
    // Apply forces to all bubbles
    this.bubbles.forEach((bubble, groupId) => {
      if (bubble.isDragging) return;
      
      // Boundary attraction - only if outside bounds
      if (bubble.x < margin || bubble.x > width - margin || 
          bubble.y < margin || bubble.y > height - margin) {
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - bubble.x;
        const dy = centerY - bubble.y;
        const attraction = 0.002;
        
        bubble.vx += dx * attraction;
        bubble.vy += dy * attraction;
      }
      
      // Apply damping
      bubble.vx *= 0.95;
      bubble.vy *= 0.95;
      
      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      
      // Keep within bounds (hard limits)
      const padding = bubble.size / 2;
      bubble.x = Math.max(padding, Math.min(width - padding, bubble.x));
      bubble.y = Math.max(padding, Math.min(height - padding, bubble.y));
    });
    
    // COLLISION RESOLUTION - prevent overlap after position update
    for (let i = 0; i < bubbleArray.length; i++) {
      const [slug1, bubble1] = bubbleArray[i];
      
      for (let j = i + 1; j < bubbleArray.length; j++) {
        const [slug2, bubble2] = bubbleArray[j];
        
        const dx = bubble2.x - bubble1.x;
        const dy = bubble2.y - bubble1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Minimum safe distance between bubble centers
        const minSafeDistance = (bubble1.size + bubble2.size) / 2 + 5;
        
        // If overlapping, separate them smoothly
        if (distance < minSafeDistance && distance > 0) {
          const overlap = minSafeDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Gentle separation - only move a small fraction each frame
          const separationForce = overlap * 0.1; // Only 10% of overlap per frame
          
          if (!bubble1.isDragging) {
            bubble1.x -= nx * separationForce * 0.5;
            bubble1.y -= ny * separationForce * 0.5;
          }
          if (!bubble2.isDragging) {
            bubble2.x += nx * separationForce * 0.5;
            bubble2.y += ny * separationForce * 0.5;
          }
          
          // Gently dampen velocity towards each other
          const relativeVx = bubble2.vx - bubble1.vx;
          const relativeVy = bubble2.vy - bubble1.vy;
          const approachSpeed = relativeVx * nx + relativeVy * ny;
          
          if (approachSpeed < 0) {
            // Softly reduce approach velocity
            const damping = 0.3; // Only remove 30% of approach velocity
            if (!bubble1.isDragging) {
              bubble1.vx -= nx * approachSpeed * damping;
              bubble1.vy -= ny * approachSpeed * damping;
            }
            if (!bubble2.isDragging) {
              bubble2.vx += nx * approachSpeed * damping;
              bubble2.vy += ny * approachSpeed * damping;
            }
          }
        }
      }
    }
  }

  /**
   * Render bubbles and connections on canvas
   */
  renderCanvas() {
    if (!this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw connections FIRST (behind bubbles)
    // Only show connections between selected bubbles
    if (this.selectedBubbles && this.selectedBubbles.length >= 2) {
      for (let i = 0; i < this.selectedBubbles.length; i++) {
        const groupId1 = this.selectedBubbles[i];
        const bubble1 = this.bubbles.get(groupId1);
        if (!bubble1) continue;
        
        for (let j = i + 1; j < this.selectedBubbles.length; j++) {
          const groupId2 = this.selectedBubbles[j];
          const bubble2 = this.bubbles.get(groupId2);
          if (!bubble2) continue;
          
          // Get similarity between these two fungi
          const similarity = this.getSimilarity(groupId1, groupId2);
          
          // Line thickness based on similarity (2-8px for selected)
          const lineWidth = 2 + (similarity * 6);
          
          // Higher opacity for selected connections
          const opacity = 0.3 + (similarity * 0.6);
          
          this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
          this.ctx.lineWidth = lineWidth;
          
          this.ctx.beginPath();
          this.ctx.moveTo(bubble1.x, bubble1.y);
          this.ctx.lineTo(bubble2.x, bubble2.y);
          this.ctx.stroke();
          
          // Draw similarity percentage label on the line
          const midX = (bubble1.x + bubble2.x) / 2;
          const midY = (bubble1.y + bubble2.y) / 2;
          const percentage = Math.round(similarity * 100);
          
          // Background for text
          this.ctx.font = 'bold 12px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          const text = `${percentage}%`;
          const metrics = this.ctx.measureText(text);
          const padding = 4;
          
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          this.ctx.fillRect(
            midX - metrics.width / 2 - padding,
            midY - 8,
            metrics.width + padding * 2,
            16
          );
          
          // Text
          this.ctx.fillStyle = `rgba(102, 126, 234, ${Math.min(1.0, opacity + 0.3)})`;
          this.ctx.fillText(text, midX, midY);
        }
      }
    }
    
    // Draw bubbles ON TOP
    this.bubbles.forEach((bubble, groupId) => {
      const isSelected = this.selectedBubbles && this.selectedBubbles.includes(groupId);
      
      // Apply search relevance to size
      const effectiveSize = bubble.size * (bubble.searchRelevance || 1.0);
      const effectiveOpacity = (bubble.opacity || 1.0) * (bubble.searchRelevance || 1.0);
      
      // Boost selected bubbles
      const selectionBoost = isSelected ? 1.3 : 1.0;
      const finalSize = effectiveSize * selectionBoost;
      const finalOpacity = isSelected ? 1.0 : effectiveOpacity;
      
      // Draw glow for selected bubbles
      if (isSelected) {
        this.ctx.beginPath();
        this.ctx.arc(bubble.x, bubble.y, finalSize / 2 + 8, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(102, 126, 234, 0.3)`;
        this.ctx.fill();
      }
      
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, finalSize / 2, 0, Math.PI * 2);
      
      // Fill - brighter for selected
      const fillOpacity = isSelected ? finalOpacity * 0.8 : finalOpacity * 0.6;
      const fillColor = isSelected ? 120 : 100;
      this.ctx.fillStyle = `rgba(${fillColor}, ${fillColor}, ${fillColor}, ${fillOpacity})`;
      this.ctx.fill();
      
      // Draw multi-perspective border (up to 4 colors)
      const perspectiveColors = this.getPerspectiveColors();
      if (perspectiveColors.length > 0) {
        const segmentAngle = (Math.PI * 2) / perspectiveColors.length;
        
        perspectiveColors.forEach((color, index) => {
          const startAngle = index * segmentAngle - Math.PI / 2;
          const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
          
          this.ctx.beginPath();
          this.ctx.arc(bubble.x, bubble.y, finalSize / 2, startAngle, endAngle);
          this.ctx.strokeStyle = this.addAlpha(color, finalOpacity);
          this.ctx.lineWidth = isSelected ? 6 : 4;
          this.ctx.stroke();
        });
      } else {
        // Default white border if no perspectives
        const borderOpacity = isSelected ? finalOpacity : finalOpacity * 0.5;
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${borderOpacity})`;
        this.ctx.lineWidth = isSelected ? 5 : 3;
        this.ctx.stroke();
      }
      
      // Draw label with opacity
      this.ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
      this.ctx.font = isSelected ? 'bold 16px sans-serif' : '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(bubble.label, bubble.x, bubble.y);
      
      // Draw similarity score (debug)
      if (bubble.similarity !== undefined) {
        this.ctx.font = '10px sans-serif';
        this.ctx.fillStyle = `rgba(255, 255, 255, ${(bubble.opacity || 1.0) * 0.6})`;
        const score = (bubble.similarity * 100).toFixed(0) + '%';
        this.ctx.fillText(score, bubble.x, bubble.y + bubble.size / 2 + 12);
      }
    });
  }

  /**
   * Convert hex color to rgba
   */
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Toggle simulation
   */
  toggleSimulation() {
    if (this.isSimulating) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
    this.requestUpdate();
  }

  /**
   * Toggle connections
   */
  toggleConnections() {
    this.showConnections = !this.showConnections;
  }

  /**
   * Reset view
   */
  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.initializeBubbles();
  }

  /**
   * Get top similar fungi for a slug
   */
  getTopSimilar(slug, count = 3) {
    const similarities = this.similarityMatrix.get(slug);
    if (!similarities) return [];

    const sorted = Array.from(similarities.entries())
      .filter(([s]) => s !== slug)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count);

    return sorted.map(([otherSlug, similarity]) => {
      const bubble = this.bubbles.get(otherSlug);
      return {
        slug: otherSlug,
        name: bubble?.label || otherSlug,
        similarity
      };
    });
  }

  render() {
    return html`
      <div class="bubble-container ${this.isDragging ? 'dragging' : ''}">
        <canvas class="bubble-canvas"></canvas>

        ${this.hoveredBubble ? html`
          <div class="bubble-tooltip" style="left: ${this.hoveredBubble[1].x + this.hoveredBubble[1].size / 2 + 10}px; top: ${this.hoveredBubble[1].y - 20}px;">
            <div class="tooltip-name">${this.hoveredBubble[1].label}</div>
            <div class="tooltip-similarity">
              Similarity: ${(this.hoveredBubble[1].similarity * 100).toFixed(0)}%
            </div>
            ${this.getTopSimilar(this.hoveredBubble[0]).length > 0 ? html`
              <div class="tooltip-similar-items">
                <div style="margin-bottom: 4px; color: rgba(255, 255, 255, 0.6); font-size: 11px;">Most Similar:</div>
                ${this.getTopSimilar(this.hoveredBubble[0]).map(item => html`
                  <div class="tooltip-similar-item">
                    <span>${item.name}</span>
                    <span class="tooltip-similar-score">${(item.similarity * 100).toFixed(0)}%</span>
                  </div>
                `)}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="bubble-info">
          <div class="bubble-info-item">
            <strong>Bubbles:</strong> ${this.bubbles.size}
          </div>
          <div class="bubble-info-item">
            <strong>Zoom:</strong> ${(this.zoom * 100).toFixed(0)}%
          </div>
          <div class="bubble-info-item">
            <strong>Status:</strong> ${this.isSimulating ? '🟢 Simulating' : '🔴 Paused'}
          </div>
        </div>
      </div>
    `;
  }
}

// Register custom element
customElements.define('bubble-view', BubbleView);

// Auto-register with AMORPH system
if (typeof window !== 'undefined' && window.amorph) {
  console.log('[BubbleView] Registered with AmorphSystem');
}

export default BubbleView;
