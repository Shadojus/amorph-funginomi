/**
 * 🎨 CANVAS REACTOR BASE CLASS
 * ============================
 * 
 * Foundation für alle Canvas-based Reactors
 * Unterscheidet sich von DOM-Reactors durch Canvas-spezifische APIs
 * 
 * Canvas Reactors arbeiten mit:
 * - Canvas-Context (ctx)
 * - BubbleView-Datenstrukturen (Maps, Arrays)
 * - requestAnimationFrame statt DOM-Events
 * 
 * DOM Reactors arbeiten mit:
 * - HTMLElement queries
 * - CSS styles
 * - DOM events
 * 
 * Architecture:
 * - apply(canvasHost) - Initialize reactor on canvas host
 * - update(deltaTime) - Called every frame in animation loop
 * - render(ctx) - Draw to canvas (optional)
 * - cleanup() - Remove reactor effects
 * 
 * Usage:
 * class MyCanvasReactor extends CanvasReactor {
 *   update(deltaTime) {
 *     // Update logic per frame
 *   }
 *   render(ctx) {
 *     // Draw to canvas
 *   }
 * }
 */

export class CanvasReactor {
  constructor(config = {}) {
    this.config = {
      enabled: true,
      priority: 0, // Execution order (higher = earlier)
      ...config
    };
    
    this.canvasHost = null; // Reference to BubbleView or similar
    this.ctx = null; // Canvas 2D context
    this.enabled = true;
    this.initialized = false;
    
    // Performance tracking
    this.lastUpdateTime = 0;
    this.updateCount = 0;
    this.renderCount = 0;
    
    console.log(`[CanvasReactor] ${this.constructor.name} created`, this.config);
  }
  
  /**
   * Apply reactor to canvas host
   * Override this to set up references
   */
  apply(canvasHost) {
    if (!canvasHost) {
      console.error(`[${this.constructor.name}] No canvas host provided`);
      return false;
    }
    
    this.canvasHost = canvasHost;
    
    // Get canvas context if available
    if (canvasHost.canvas && canvasHost.canvas.getContext) {
      this.ctx = canvasHost.canvas.getContext('2d');
    }
    
    this.initialized = true;
    console.log(`[${this.constructor.name}] Applied to canvas host`);
    
    return true;
  }
  
  /**
   * Update reactor state (called every frame)
   * Override this for frame-by-frame logic
   */
  update(deltaTime = 16) {
    if (!this.enabled || !this.initialized) return;
    
    this.lastUpdateTime = performance.now();
    this.updateCount++;
    
    // Override in subclass
  }
  
  /**
   * Render reactor visuals to canvas
   * Override this for custom drawing
   */
  render(ctx) {
    if (!this.enabled || !this.initialized) return;
    
    this.renderCount++;
    
    // Override in subclass
  }
  
  /**
   * Cleanup reactor
   */
  cleanup() {
    this.enabled = false;
    this.initialized = false;
    this.canvasHost = null;
    this.ctx = null;
    
    console.log(`[${this.constructor.name}] Cleaned up`);
  }
  
  /**
   * Enable/disable reactor
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  /**
   * Check if reactor is active
   */
  isActive() {
    return this.enabled && this.initialized;
  }
  
  /**
   * Get performance stats
   */
  getStats() {
    return {
      name: this.constructor.name,
      enabled: this.enabled,
      initialized: this.initialized,
      updates: this.updateCount,
      renders: this.renderCount,
      lastUpdate: this.lastUpdateTime
    };
  }
  
  /**
   * Helper: Get canvas dimensions
   */
  getCanvasDimensions() {
    if (!this.canvasHost) return { width: 0, height: 0 };
    return {
      width: this.canvasHost.offsetWidth || 800,
      height: this.canvasHost.offsetHeight || 600
    };
  }
  
  /**
   * Helper: Get all bubbles from host
   */
  getBubbles() {
    return this.canvasHost?.bubbles || new Map();
  }
  
  /**
   * Helper: Get all connections from host
   */
  getConnections() {
    return this.canvasHost?.connections || new Map();
  }
  
  /**
   * Helper: Get user node data
   */
  getUserNode() {
    return this.canvasHost?.userNodeData || null;
  }
  
  /**
   * Helper: Get query nodes
   */
  getQueryNodes() {
    return this.canvasHost?.queryNodes || new Map();
  }
}

export default CanvasReactor;
