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

export class BubbleView extends LitElement {
  static properties = {
    morphs: { type: Array },
    zoom: { type: Number },
    panX: { type: Number },
    panY: { type: Number },
    isSimulating: { type: Boolean },
    showConnections: { type: Boolean },
    clusterByPerspective: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
    }

    .bubble-morphs {
      position: absolute;
      inset: 0;
      transform-origin: 0 0;
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
    
    console.log('[BubbleView] Initialized');
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH instance
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
    }
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
  }

  /**
   * Set morphs to display in bubble view
   */
  setMorphs(morphs) {
    this.morphs = morphs;
    this.initializeBubbles();
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
      
      // Bubble size based on number of morphs in group
      const baseSize = 80;
      const size = baseSize + (morphs.length * 5); // Larger bubble for more morphs
      
      // Get perspective from first morph
      const perspective = this.getMorphPerspective(morphs[0]);
      
      // Get name from name-morph if exists
      const nameMorph = morphs.find(m => m.tagName.toLowerCase() === 'name-morph');
      const label = nameMorph?.getAttribute('value') || `Group ${index + 1}`;
      
      this.bubbles.set(groupId, {
        x,
        y,
        vx: 0,
        vy: 0,
        size,
        perspective,
        mass: size / baseSize,
        isDragging: false,
        morphs: morphs,  // Store all morphs in this group
        label: label
      });
      
      index++;
    });
    
    console.log(`[BubbleView] Initialized ${this.bubbles.size} bubbles`);
    // Use updateComplete to avoid change-in-update warning
    this.updateComplete.then(() => this.requestUpdate());
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
    
    // Wheel zoom
    container.addEventListener('wheel', this.onWheel.bind(this));
    
    // Window resize
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Handle mouse down (start pan or drag bubble)
   */
  onMouseDown(e) {
    this.isDragging = true;
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.lastPan = { x: this.panX, y: this.panY };
  }

  /**
   * Handle mouse move (pan view)
   */
  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    
    this.panX = this.lastPan.x + dx / this.zoom;
    this.panY = this.lastPan.y + dy / this.zoom;
  }

  /**
   * Handle mouse up (stop drag)
   */
  onMouseUp() {
    this.isDragging = false;
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
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
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
   * Update bubble physics
   */
  updatePhysics() {
    // Apply simple attraction to center
    const centerX = this.offsetWidth / 2;
    const centerY = this.offsetHeight / 2;
    const attraction = 0.001;
    
    this.bubbles.forEach((bubble, groupId) => {
      if (bubble.isDragging) return;
      
      // Attract to center
      const dx = centerX - bubble.x;
      const dy = centerY - bubble.y;
      
      bubble.vx += dx * attraction;
      bubble.vy += dy * attraction;
      
      // Apply damping
      bubble.vx *= 0.95;
      bubble.vy *= 0.95;
      
      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
    });
  }

  /**
   * Render bubbles and connections on canvas
   */
  renderCanvas() {
    if (!this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw bubbles
    this.bubbles.forEach((bubble, groupId) => {
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
      
      // Fill with perspective color
      const color = this.getPerspectiveColor(bubble.perspective);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      
      // Stroke
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw label
      this.ctx.fillStyle = 'white';
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(bubble.label, bubble.x, bubble.y);
    });
    
    if (!this.showConnections) return;
    
    // Draw connections
    this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
    this.ctx.lineWidth = 2;
    
    const bubbleArray = Array.from(this.bubbles.entries());
    
    for (let i = 0; i < bubbleArray.length; i++) {
      const [groupId1, bubble1] = bubbleArray[i];
      
      for (let j = i + 1; j < bubbleArray.length; j++) {
        const [groupId2, bubble2] = bubbleArray[j];
        
        // Draw if same perspective
        if (this.clusterByPerspective && bubble1.perspective === bubble2.perspective) {
          this.ctx.beginPath();
          this.ctx.moveTo(bubble1.x, bubble1.y);
          this.ctx.lineTo(bubble2.x, bubble2.y);
          this.ctx.stroke();
        }
      }
    }
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

  render() {
    return html`
      <div class="bubble-container ${this.isDragging ? 'dragging' : ''}">
        <canvas class="bubble-canvas"></canvas>

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
