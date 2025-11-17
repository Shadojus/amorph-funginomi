/**
 * 🖱️ DRAG CONTROLLER
 * ==================
 * 
 * Interaktives Drag & Drop System für Morphs/Bubbles
 * 
 * Features:
 * - Mouse & Touch support
 * - Momentum throwing (physics-based)
 * - Smooth grab/release animations
 * - Multi-select support (Shift-click)
 * - Drag constraints (boundaries, snap-to-grid)
 * - Event system für externe reaktionen
 * 
 * Events:
 * - drag:start - Drag beginnt
 * - drag:move - Drag in progress
 * - drag:end - Drag endet
 * - drag:throw - Morph wird geworfen
 * 
 * Usage:
 * const dragController = new DragController(amorph, {
 *   throwEnabled: true,
 *   multiSelect: true
 * });
 * 
 * dragController.enableDrag(morphElements);
 */

export class DragController {
  constructor(amorph, config = {}) {
    this.amorph = amorph;
    this.config = {
      throwEnabled: true,
      throwFriction: 0.95,
      multiSelect: false,
      snapToGrid: false,
      gridSize: 50,
      boundary: null,  // { minX, maxX, minY, maxY }
      ...config
    };
    
    this.draggedElements = new Set();
    this.isDragging = false;
    this.dragData = new Map(); // element -> drag state
    
    // Pointer tracking
    this.pointerStart = { x: 0, y: 0 };
    this.pointerCurrent = { x: 0, y: 0 };
    this.pointerVelocity = { x: 0, y: 0 };
    this.lastPointerTime = 0;
    
    // History for velocity calculation
    this.positionHistory = [];
    this.maxHistoryLength = 5;
    
    console.log('[DragController] Initialized', this.config);
  }

  /**
   * Enable dragging for elements
   */
  enableDrag(elements) {
    elements.forEach(element => {
      if (this.dragData.has(element)) return;
      
      // Store initial state
      this.dragData.set(element, {
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        isDragging: false
      });
      
      // Add event listeners
      element.addEventListener('mousedown', this.onPointerDown.bind(this, element));
      element.addEventListener('touchstart', this.onPointerDown.bind(this, element), { passive: false });
      
      // Add cursor style
      element.style.cursor = 'grab';
    });
    
    // Global listeners for move/up
    if (!this.hasGlobalListeners) {
      document.addEventListener('mousemove', this.onPointerMove.bind(this));
      document.addEventListener('touchmove', this.onPointerMove.bind(this), { passive: false });
      document.addEventListener('mouseup', this.onPointerUp.bind(this));
      document.addEventListener('touchend', this.onPointerUp.bind(this));
      this.hasGlobalListeners = true;
    }
    
    console.log(`[DragController] Enabled drag for ${elements.length} elements`);
  }

  /**
   * Disable dragging for elements
   */
  disableDrag(elements) {
    elements.forEach(element => {
      element.removeEventListener('mousedown', this.onPointerDown);
      element.removeEventListener('touchstart', this.onPointerDown);
      element.style.cursor = '';
      
      this.dragData.delete(element);
    });
    
    console.log(`[DragController] Disabled drag for ${elements.length} elements`);
  }

  /**
   * Handle pointer down (start drag)
   */
  onPointerDown(element, e) {
    // Get pointer position
    const pointer = this.getPointerPosition(e);
    
    // Multi-select with Shift
    if (this.config.multiSelect && e.shiftKey) {
      this.draggedElements.add(element);
    } else {
      this.draggedElements.clear();
      this.draggedElements.add(element);
    }
    
    // Initialize drag state
    this.draggedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const data = this.dragData.get(el);
      
      data.startX = rect.left;
      data.startY = rect.top;
      data.offsetX = pointer.x - rect.left;
      data.offsetY = pointer.y - rect.top;
      data.isDragging = true;
    });
    
    this.isDragging = true;
    this.pointerStart = pointer;
    this.pointerCurrent = pointer;
    this.lastPointerTime = performance.now();
    this.positionHistory = [{ x: pointer.x, y: pointer.y, time: this.lastPointerTime }];
    
    // Change cursor
    this.draggedElements.forEach(el => {
      el.style.cursor = 'grabbing';
    });
    
    // Emit event
    this.amorph.streamPublish('drag:start', {
      elements: Array.from(this.draggedElements),
      pointer
    });
    
    e.preventDefault();
  }

  /**
   * Handle pointer move (dragging)
   */
  onPointerMove(e) {
    if (!this.isDragging || this.draggedElements.size === 0) return;
    
    const pointer = this.getPointerPosition(e);
    this.pointerCurrent = pointer;
    
    // Calculate delta
    const dx = pointer.x - this.pointerStart.x;
    const dy = pointer.y - this.pointerStart.y;
    
    // Update positions
    this.draggedElements.forEach(el => {
      const data = this.dragData.get(el);
      let newX = data.startX + dx;
      let newY = data.startY + dy;
      
      // Apply constraints
      if (this.config.snapToGrid) {
        newX = Math.round(newX / this.config.gridSize) * this.config.gridSize;
        newY = Math.round(newY / this.config.gridSize) * this.config.gridSize;
      }
      
      if (this.config.boundary) {
        newX = Math.max(this.config.boundary.minX, Math.min(this.config.boundary.maxX, newX));
        newY = Math.max(this.config.boundary.minY, Math.min(this.config.boundary.maxY, newY));
      }
      
      // Apply position
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
    });
    
    // Track velocity
    const now = performance.now();
    this.positionHistory.push({ x: pointer.x, y: pointer.y, time: now });
    
    if (this.positionHistory.length > this.maxHistoryLength) {
      this.positionHistory.shift();
    }
    
    this.lastPointerTime = now;
    
    // Emit event
    this.amorph.streamPublish('drag:move', {
      elements: Array.from(this.draggedElements),
      pointer,
      delta: { x: dx, y: dy }
    });
    
    e.preventDefault();
  }

  /**
   * Handle pointer up (end drag)
   */
  onPointerUp(e) {
    if (!this.isDragging) return;
    
    // Calculate final velocity
    const velocity = this.calculateVelocity();
    
    // Apply throw if enabled
    if (this.config.throwEnabled && (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1)) {
      this.throwElements(velocity);
    }
    
    // Reset state
    this.draggedElements.forEach(el => {
      const data = this.dragData.get(el);
      data.isDragging = false;
      el.style.cursor = 'grab';
    });
    
    // Emit event
    this.amorph.streamPublish('drag:end', {
      elements: Array.from(this.draggedElements),
      velocity
    });
    
    this.isDragging = false;
    this.draggedElements.clear();
    this.positionHistory = [];
  }

  /**
   * Calculate velocity from position history
   */
  calculateVelocity() {
    if (this.positionHistory.length < 2) {
      return { x: 0, y: 0 };
    }
    
    const recent = this.positionHistory.slice(-3); // Last 3 positions
    const first = recent[0];
    const last = recent[recent.length - 1];
    
    const dt = (last.time - first.time) / 1000; // Convert to seconds
    
    if (dt === 0) return { x: 0, y: 0 };
    
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    
    return { x: vx, y: vy };
  }

  /**
   * Apply throw momentum to elements
   */
  throwElements(velocity) {
    this.draggedElements.forEach(el => {
      // Start animation
      this.animateThrow(el, velocity);
    });
    
    this.amorph.streamPublish('drag:throw', {
      elements: Array.from(this.draggedElements),
      velocity
    });
  }

  /**
   * Animate throw with physics
   */
  animateThrow(element, velocity) {
    let vx = velocity.x;
    let vy = velocity.y;
    
    const animate = () => {
      // Apply friction
      vx *= this.config.throwFriction;
      vy *= this.config.throwFriction;
      
      // Stop if velocity is negligible
      if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
        return;
      }
      
      // Update position
      const rect = element.getBoundingClientRect();
      let newX = rect.left + vx * 0.016; // Assume 60fps
      let newY = rect.top + vy * 0.016;
      
      // Boundary bounce
      if (this.config.boundary) {
        if (newX < this.config.boundary.minX || newX > this.config.boundary.maxX) {
          vx *= -0.7; // Reverse and lose energy
        }
        if (newY < this.config.boundary.minY || newY > this.config.boundary.maxY) {
          vy *= -0.7;
        }
        
        newX = Math.max(this.config.boundary.minX, Math.min(this.config.boundary.maxX, newX));
        newY = Math.max(this.config.boundary.minY, Math.min(this.config.boundary.maxY, newY));
      }
      
      element.style.left = newX + 'px';
      element.style.top = newY + 'px';
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Get pointer position from event (mouse or touch)
   */
  getPointerPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else {
      return {
        x: e.clientX,
        y: e.clientY
      };
    }
  }

  /**
   * Update config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('[DragController] Config updated', this.config);
  }

  /**
   * Get currently dragged elements
   */
  getDraggedElements() {
    return Array.from(this.draggedElements);
  }

  /**
   * Check if any element is being dragged
   */
  isDraggingAny() {
    return this.isDragging;
  }
}

export default DragController;
