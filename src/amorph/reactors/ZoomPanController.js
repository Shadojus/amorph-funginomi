/**
 * 🔍 ZOOM & PAN CONTROLLER
 * ========================
 * 
 * Smooth navigation system für BubbleView
 * 
 * Features:
 * - Mouse wheel zoom
 * - Pinch gesture zoom (touch)
 * - Pan dragging
 * - Smooth easing animations
 * - Zoom to fit / Zoom to point
 * - Bounds limiting
 * - Keyboard shortcuts (+ / - für zoom)
 * 
 * Events:
 * - zoom:changed
 * - pan:changed
 * - view:reset
 * 
 * Usage:
 * const controller = new ZoomPanController(container, {
 *   minZoom: 0.1,
 *   maxZoom: 5,
 *   smoothing: 0.15
 * });
 */

export class ZoomPanController {
  constructor(container, config = {}) {
    this.container = container;
    this.config = {
      minZoom: 0.1,
      maxZoom: 5,
      zoomSpeed: 0.001,
      smoothing: 0.15,         // Smooth zoom/pan (0-1)
      pinchEnabled: true,
      keyboardEnabled: true,
      bounds: null,            // { minX, maxX, minY, maxY }
      ...config
    };
    
    // Current state
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    
    // Target state (for smoothing)
    this.targetZoom = 1;
    this.targetPanX = 0;
    this.targetPanY = 0;
    
    // Interaction state
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.lastPan = { x: 0, y: 0 };
    
    // Pinch state
    this.isPinching = false;
    this.pinchStart = { distance: 0, zoom: 1 };
    
    // Animation
    this.animationFrame = null;
    
    // Event listeners
    this.listeners = new Map();
    
    console.log('[ZoomPanController] Initialized', this.config);
  }

  /**
   * Initialize event listeners
   */
  init() {
    // Mouse wheel zoom
    this.container.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    
    // Pan dragging
    this.container.addEventListener('mousedown', this.onPanStart.bind(this));
    document.addEventListener('mousemove', this.onPanMove.bind(this));
    document.addEventListener('mouseup', this.onPanEnd.bind(this));
    
    // Touch gestures
    if (this.config.pinchEnabled) {
      this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
      this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
      this.container.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
    
    // Keyboard shortcuts
    if (this.config.keyboardEnabled) {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    
    // Start animation loop
    this.startAnimation();
    
    console.log('[ZoomPanController] Event listeners initialized');
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.stopAnimation();
    // Remove all event listeners
    // (In production würde man hier alle removeEventListener calls machen)
  }

  /**
   * Handle mouse wheel (zoom)
   */
  onWheel(e) {
    e.preventDefault();
    
    // Get mouse position relative to container
    const rect = this.container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom
    const delta = -e.deltaY;
    const zoomFactor = 1 + delta * this.config.zoomSpeed;
    
    this.zoomToPoint(mouseX, mouseY, this.targetZoom * zoomFactor);
  }

  /**
   * Zoom to a specific point
   */
  zoomToPoint(x, y, newZoom) {
    // Clamp zoom
    newZoom = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, newZoom));
    
    // Calculate new pan to keep point under cursor
    const zoomRatio = newZoom / this.zoom;
    
    this.targetPanX = x - (x - this.panX) * zoomRatio;
    this.targetPanY = y - (y - this.panY) * zoomRatio;
    this.targetZoom = newZoom;
    
    this.amorph.streamPublish('zoom:changed', { zoom: newZoom, x, y });
  }

  /**
   * Handle pan start
   */
  onPanStart(e) {
    // Don't pan if clicking on interactive elements
    if (e.target !== this.container && !e.target.classList.contains('bubble-morphs')) {
      return;
    }
    
    this.isPanning = true;
    this.panStart = { x: e.clientX, y: e.clientY };
    this.lastPan = { x: this.panX, y: this.panY };
    
    this.container.style.cursor = 'grabbing';
  }

  /**
   * Handle pan move
   */
  onPanMove(e) {
    if (!this.isPanning) return;
    
    const dx = (e.clientX - this.panStart.x);
    const dy = (e.clientY - this.panStart.y);
    
    this.targetPanX = this.lastPan.x + dx;
    this.targetPanY = this.lastPan.y + dy;
    
    this.amorph.streamPublish('pan:changed', { x: this.targetPanX, y: this.targetPanY });
  }

  /**
   * Handle pan end
   */
  onPanEnd() {
    if (!this.isPanning) return;
    
    this.isPanning = false;
    this.container.style.cursor = '';
  }

  /**
   * Handle touch start (pinch zoom)
   */
  onTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      this.isPinching = true;
      this.pinchStart.distance = this.getTouchDistance(e.touches[0], e.touches[1]);
      this.pinchStart.zoom = this.targetZoom;
      this.pinchStart.center = this.getTouchCenter(e.touches[0], e.touches[1]);
    }
  }

  /**
   * Handle touch move (pinch zoom)
   */
  onTouchMove(e) {
    if (!this.isPinching || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
    const currentCenter = this.getTouchCenter(e.touches[0], e.touches[1]);
    
    // Calculate zoom from pinch
    const zoomFactor = currentDistance / this.pinchStart.distance;
    const newZoom = this.pinchStart.zoom * zoomFactor;
    
    // Zoom to pinch center
    const rect = this.container.getBoundingClientRect();
    const centerX = currentCenter.x - rect.left;
    const centerY = currentCenter.y - rect.top;
    
    this.zoomToPoint(centerX, centerY, newZoom);
  }

  /**
   * Handle touch end
   */
  onTouchEnd(e) {
    if (e.touches.length < 2) {
      this.isPinching = false;
    }
  }

  /**
   * Get distance between two touches
   */
  getTouchDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get center point between two touches
   */
  getTouchCenter(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }

  /**
   * Handle keyboard shortcuts
   */
  onKeyDown(e) {
    // + or = for zoom in
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      this.zoomToPoint(centerX, centerY, this.targetZoom * 1.2);
    }
    
    // - for zoom out
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      this.zoomToPoint(centerX, centerY, this.targetZoom / 1.2);
    }
    
    // 0 for reset
    if (e.key === '0') {
      e.preventDefault();
      this.reset();
    }
  }

  /**
   * Start animation loop for smooth transitions
   */
  startAnimation() {
    this.animate();
  }

  /**
   * Stop animation loop
   */
  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Animation loop
   */
  animate = () => {
    // Smooth interpolation
    this.zoom += (this.targetZoom - this.zoom) * this.config.smoothing;
    this.panX += (this.targetPanX - this.panX) * this.config.smoothing;
    this.panY += (this.targetPanY - this.panY) * this.config.smoothing;
    
    // Apply bounds
    if (this.config.bounds) {
      this.panX = Math.max(this.config.bounds.minX, Math.min(this.config.bounds.maxX, this.panX));
      this.panY = Math.max(this.config.bounds.minY, Math.min(this.config.bounds.maxY, this.panY));
    }
    
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Reset zoom and pan to defaults
   */
  reset() {
    this.targetZoom = 1;
    this.targetPanX = 0;
    this.targetPanY = 0;
    
    this.amorph.streamPublish('view:reset', {});
  }

  /**
   * Zoom to fit content
   */
  zoomToFit(bounds, padding = 50) {
    const rect = this.container.getBoundingClientRect();
    
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    
    const scaleX = (rect.width - padding * 2) / contentWidth;
    const scaleY = (rect.height - padding * 2) / contentHeight;
    
    const newZoom = Math.min(scaleX, scaleY);
    
    // Center content
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    this.targetZoom = newZoom;
    this.targetPanX = rect.width / 2 - centerX * newZoom;
    this.targetPanY = rect.height / 2 - centerY * newZoom;
    
    this.amorph.streamPublish('zoom:changed', { zoom: newZoom });
  }

  /**
   * Get current transform as CSS string
   */
  getTransform() {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      zoom: this.zoom,
      panX: this.panX,
      panY: this.panY
    };
  }

  /**
   * Set state directly
   */
  setState(zoom, panX, panY, smooth = true) {
    if (smooth) {
      this.targetZoom = zoom;
      this.targetPanX = panX;
      this.targetPanY = panY;
    } else {
      this.zoom = this.targetZoom = zoom;
      this.panX = this.targetPanX = panX;
      this.panY = this.targetPanY = panY;
    }
  }

  /**
   * Event emitter
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  /**
   * Update config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('[ZoomPanController] Config updated', this.config);
  }
}

export default ZoomPanController;
