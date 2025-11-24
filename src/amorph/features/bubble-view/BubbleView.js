/**
 * 🫧 BUBBLE VIEW - PIXI.JS REWRITE v2.0
 * =====================================
 * 
 * High-performance GPU-accelerated visualization with:
 * - Pixi.js rendering (PixieRenderer)
 * - Backend similarity calculations (Convex)
 * - User interaction tracking (Backend)
 * 
 * Created: 23. November 2025
 */

import { LitElement, html, css } from 'lit';
import { PixieRenderer } from '../../core/PixieRenderer.js';
import { BackendSimilarity } from './services/BackendSimilarity.js';

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

    .pixi-container {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
  `;

  constructor() {
    super();
    
    // Core state
    this.isSimulating = false;
    this.animationFrame = null;
    
    // Pixi.js
    this.pixieRenderer = new PixieRenderer({
      width: 800,
      height: 600,
      backgroundColor: 0x000000,
      autoResize: true
    });
    
    // Backend similarity
    this.backendSimilarity = new BackendSimilarity();
    
    // Data structures
    this.bubbles = new Map(); // slug -> bubble data
    this.cachedEntityData = new Map(); // slug -> full entity
    this.activePerspectives = [];
    this.currentSearchQuery = '';
    
    // User Node
    this.userNodeData = {
      x: 400,
      y: 300,
      size: 60,
      connections: new Map() // slug -> weight
    };
    
    console.log('[BubbleView] 🚀 Initialized with Pixi.js v2.0');
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH & Convex
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
      
      // Initialize backend similarity
      if (this.amorph.convex) {
        await this.backendSimilarity.init(this.amorph.convex);
      }
    }

    // Listen for events
    this._boundPerspectiveHandler = this.handlePerspectiveChange.bind(this);
    window.addEventListener('perspective-changed', this._boundPerspectiveHandler);
    
    this._boundSearchHandler = this.handleSearchComplete.bind(this);
    window.addEventListener('convex-search:completed', this._boundSearchHandler);
    
    console.log('[BubbleView] Connected, waiting for Pixi init...');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this._boundPerspectiveHandler) {
      window.removeEventListener('perspective-changed', this._boundPerspectiveHandler);
    }
    if (this._boundSearchHandler) {
      window.removeEventListener('convex-search:completed', this._boundSearchHandler);
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.pixieRenderer) {
      this.pixieRenderer.clear();
    }
  }

  async firstUpdated() {
    // Initialize Pixi.js
    const container = this.shadowRoot.querySelector('.pixi-container');
    const success = await this.pixieRenderer.init(container);
    
    if (success) {
      console.log('[BubbleView] ✅ Pixi.js initialized');
      this.setupResize();
      this.startRenderLoop();
    } else {
      console.error('[BubbleView] ❌ Pixi.js init failed');
    }
  }

  setupResize() {
    // Update UserNode position on resize
    const updateUserNode = () => {
      const width = this.offsetWidth || 800;
      const height = this.offsetHeight || 600;
      this.userNodeData.x = width / 2;
      this.userNodeData.y = height / 2;
      
      if (this.bubbles.has('user-node')) {
        this.pixieRenderer.updateNode('user-node', {
          x: this.userNodeData.x,
          y: this.userNodeData.y
        });
      }
    };
    
    window.addEventListener('resize', updateUserNode);
    updateUserNode();
  }

  /**
   * Main render loop (Pixi.js)
   */
  startRenderLoop() {
    const animate = () => {
      // Pixi.js handles rendering automatically
      // We only need to update physics/positions here if needed
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Handle perspective change
   */
  async handlePerspectiveChange(event) {
    const perspectives = event.detail?.perspectives || [];
    this.activePerspectives = perspectives.map(p => p.name || p);
    
    console.log('[BubbleView] 🎭 Perspective changed:', this.activePerspectives);
    
    // Track interaction
    await this.backendSimilarity.trackInteraction('perspective_change', {
      perspectives: this.activePerspectives
    });
    
    // Recalculate similarities
    await this.updateSimilarities();
  }

  /**
   * Handle search complete
   */
  async handleSearchComplete(event) {
    const { results, query } = event.detail || {};
    
    if (!results || results.length === 0) {
      console.log('[BubbleView] Search returned no results');
      return;
    }
    
    this.currentSearchQuery = query;
    
    console.log('[BubbleView] 🔍 Search completed:', {
      query,
      results: results.length
    });
    
    // Track search
    await this.backendSimilarity.trackInteraction('search', {
      query,
      perspectives: this.activePerspectives
    });
    
    // Update bubbles with search results
    await this.setEntitiesData(results);
  }

  /**
   * Set entities data and render bubbles
   */
  async setEntitiesData(entities) {
    if (!entities || entities.length === 0) return;
    
    console.log(`[BubbleView] 📊 Setting ${entities.length} entities`);
    
    // Cache entity data
    this.cachedEntityData.clear();
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'slug';
    entities.forEach(entity => {
      if (entity[slugField]) {
        this.cachedEntityData.set(entity[slugField], entity);
      }
    });
    
    // Clear existing bubbles
    this.bubbles.clear();
    this.pixieRenderer.clear();
    
    // Render UserNode first
    await this.renderUserNode();
    
    // Render bubbles
    await this.renderBubbles(entities);
    
    // Calculate similarities from backend
    await this.updateSimilarities();
  }

  /**
   * Render UserNode
   */
  async renderUserNode() {
    const nodeId = 'user-node';
    
    await this.pixieRenderer.renderNode(nodeId, {
      x: this.userNodeData.x,
      y: this.userNodeData.y,
      radius: this.userNodeData.size / 2,
      color: 0x3b82f6, // Blue
      borderWidth: 3,
      borderColor: 0xffffff,
      glowRadius: 20,
      glowColor: 0x3b82f6,
      glowAlpha: 0.5,
      label: '👤 You',
      icon: '👤'
    });
    
    console.log('[BubbleView] ✅ UserNode rendered');
  }

  /**
   * Render all bubbles
   */
  async renderBubbles(entities) {
    const width = this.offsetWidth || 800;
    const height = this.offsetHeight || 600;
    const radius = Math.min(width, height) * 0.3;
    
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'slug';
    const nameField = window.amorph?.domainConfig?.dataSource?.nameField || 'commonName';
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const slug = entity[slugField];
      const label = entity[nameField] || slug;
      
      // Calculate initial position (circle layout)
      const angle = (i / entities.length) * Math.PI * 2;
      const x = this.userNodeData.x + Math.cos(angle) * radius;
      const y = this.userNodeData.y + Math.sin(angle) * radius;
      
      // Store bubble data
      this.bubbles.set(slug, {
        slug,
        label,
        x,
        y,
        size: 80,
        color: 0x10b981, // Green default
        data: entity
      });
      
      // Render bubble
      await this.pixieRenderer.renderNode(slug, {
        x,
        y,
        radius: 40,
        color: 0x10b981,
        borderWidth: 2,
        borderColor: 0xffffff,
        label: label.length > 20 ? label.substring(0, 17) + '...' : label
      });
      
      // Enable interactions
      this.pixieRenderer.enableNodeInteraction(slug, {
        onClick: (id) => this.handleBubbleClick(id),
        onHover: (id, isHovering) => this.handleBubbleHover(id, isHovering)
      });
    }
    
    console.log(`[BubbleView] ✅ Rendered ${entities.length} bubbles`);
  }

  /**
   * Update similarities from backend
   */
  async updateSimilarities() {
    const slugs = Array.from(this.bubbles.keys());
    
    if (slugs.length === 0) return;
    
    console.log('[BubbleView] 🔬 Requesting similarities from backend...');
    
    const result = await this.backendSimilarity.calculateSimilarities(
      slugs,
      this.activePerspectives,
      true // Include UserNode
    );
    
    if (!result) {
      console.warn('[BubbleView] No similarity data received');
      return;
    }
    
    // Update UserNode connections
    this.userNodeData.connections = new Map(
      Object.entries(result.userNodeConnections)
    );
    
    console.log('[BubbleView] ✅ Updated similarities:', {
      userNodeConnections: this.userNodeData.connections.size,
      calculationTime: result.metadata.calculationTime + 'ms'
    });
    
    // Update bubble sizes based on connections
    this.updateBubbleSizes();
    
    // Render connections
    this.renderConnections(result.bubbleSimilarities);
  }

  /**
   * Update bubble sizes based on UserNode connections
   */
  updateBubbleSizes() {
    const minSize = 60;
    const maxSize = 140;
    
    this.bubbles.forEach((bubble, slug) => {
      const weight = this.userNodeData.connections.get(slug) || 0.1;
      const newSize = minSize + (maxSize - minSize) * weight;
      
      bubble.size = newSize;
      
      // Update Pixi node
      this.pixieRenderer.updateNode(slug, {
        radius: newSize / 2
      });
    });
  }

  /**
   * Render connections between bubbles and UserNode
   */
  renderConnections(bubbleSimilarities) {
    // Clear existing connections
    this.pixieRenderer.connections.forEach((_, id) => {
      if (id.startsWith('conn-')) {
        this.pixieRenderer.removeConnection(id);
      }
    });
    
    // Render UserNode connections
    this.userNodeData.connections.forEach((weight, slug) => {
      const bubble = this.bubbles.get(slug);
      if (!bubble || weight < 0.2) return; // Skip weak connections
      
      const connectionId = `conn-user-${slug}`;
      
      this.pixieRenderer.renderConnection(connectionId, 'user-node', slug, {
        color: 0x3b82f6,
        alpha: weight,
        width: Math.max(1, weight * 5),
        curve: 0.3
      });
    });
    
    console.log('[BubbleView] ✅ Rendered UserNode connections');
  }

  /**
   * Handle bubble click
   */
  async handleBubbleClick(slug) {
    console.log('[BubbleView] 🖱️ Bubble clicked:', slug);
    
    // Track interaction
    await this.backendSimilarity.trackInteraction('bubble_click', {
      entitySlug: slug
    });
    
    // Open detail dialog (BubbleDetailReactor handles this)
    window.dispatchEvent(new CustomEvent('bubble:clicked', {
      detail: { slug }
    }));
    
    // Recalculate similarities (click increases weight)
    await this.updateSimilarities();
  }

  /**
   * Handle bubble hover
   */
  async handleBubbleHover(slug, isHovering) {
    if (isHovering) {
      // Add glow effect
      this.pixieRenderer.updateNode(slug, {
        glowRadius: 15,
        glowColor: 0x10b981,
        glowAlpha: 0.6
      });
      
      // Track hover (throttled)
      if (!this._lastHoverTrack || Date.now() - this._lastHoverTrack > 2000) {
        await this.backendSimilarity.trackInteraction('bubble_hover', {
          entitySlug: slug
        });
        this._lastHoverTrack = Date.now();
      }
    } else {
      // Remove glow
      this.pixieRenderer.updateNode(slug, {
        glowRadius: 0
      });
    }
  }

  render() {
    return html`
      <div class="pixi-container"></div>
    `;
  }
}

customElements.define('bubble-view', BubbleView);
