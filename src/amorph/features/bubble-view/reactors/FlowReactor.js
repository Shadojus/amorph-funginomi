/**
 * 🌊 FLOW REACTOR
 * ===============
 * 
 * Smooth movement und positioning für Morphs
 * Foundation für BubbleView und physik-basierte Layouts
 * 
 * Features:
 * - Physics-based easing (spring, bounce, friction)
 * - Velocity tracking
 * - Collision detection prep
 * - Smooth position transitions
 * - requestAnimationFrame optimization
 * 
 * Usage:
 * amorph.enableReactor('flow', {
 *   physics: 'spring',
 *   stiffness: 0.15,
 *   damping: 0.8,
 *   mass: 1
 * });
 */

export class FlowReactor {
  constructor(config = {}) {
    this.config = {
      physics: 'spring',      // 'spring' | 'bounce' | 'friction' | 'linear'
      stiffness: 0.15,       // Spring stiffness (0-1)
      damping: 0.8,          // Damping/friction (0-1)
      mass: 1,               // Morph mass
      maxVelocity: 1000,     // Max pixels per second
      threshold: 0.5,        // Stop threshold in pixels
      ...config
    };
    
    this.appliedMorphs = new Set();
    this.morphStates = new Map(); // Store position, velocity for each morph
    this.animationFrame = null;
    this.isRunning = false;
    
    console.log('[FlowReactor] Initialized', this.config);
  }

  /**
   * Apply flow physics to morphs
   */
  apply(morphs) {
    morphs.forEach(morph => {
      if (this.appliedMorphs.has(morph)) return;
      
      // Initialize state
      const rect = morph.getBoundingClientRect();
      this.morphStates.set(morph, {
        x: rect.left,
        y: rect.top,
        vx: 0,  // Velocity X
        vy: 0,  // Velocity Y
        targetX: rect.left,
        targetY: rect.top
      });
      
      // Make position absolute for physics
      morph.style.position = 'absolute';
      morph.style.left = rect.left + 'px';
      morph.style.top = rect.top + 'px';
      
      this.appliedMorphs.add(morph);
    });
    
    // Start animation loop
    if (!this.isRunning && this.appliedMorphs.size > 0) {
      this.startAnimation();
    }
    
    console.log(`[FlowReactor] Applied to ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Cleanup flow effect from morphs
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.style.position = '';
      morph.style.left = '';
      morph.style.top = '';
      morph.style.transform = '';
      
      this.morphStates.delete(morph);
      this.appliedMorphs.delete(morph);
    });
    
    // Stop animation loop if no more morphs
    if (this.appliedMorphs.size === 0) {
      this.stopAnimation();
    }
    
    console.log(`[FlowReactor] Removed from ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Set target position for a morph
   */
  setTarget(morph, x, y) {
    const state = this.morphStates.get(morph);
    if (!state) return;
    
    state.targetX = x;
    state.targetY = y;
  }

  /**
   * Add velocity impulse to a morph
   */
  addImpulse(morph, vx, vy) {
    const state = this.morphStates.get(morph);
    if (!state) return;
    
    state.vx += vx;
    state.vy += vy;
    
    // Clamp velocity
    const speed = Math.sqrt(state.vx ** 2 + state.vy ** 2);
    if (speed > this.config.maxVelocity) {
      const scale = this.config.maxVelocity / speed;
      state.vx *= scale;
      state.vy *= scale;
    }
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Stop animation loop
   */
  stopAnimation() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Animation loop
   */
  animate = () => {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1); // Max 100ms delta
    this.lastTime = now;
    
    let activeCount = 0;
    
    // Update each morph
    this.appliedMorphs.forEach(morph => {
      const state = this.morphStates.get(morph);
      if (!state) return;
      
      // Calculate forces based on physics mode
      const { fx, fy } = this.calculateForces(state);
      
      // Update velocity
      state.vx += fx * deltaTime;
      state.vy += fy * deltaTime;
      
      // Apply damping
      state.vx *= this.config.damping;
      state.vy *= this.config.damping;
      
      // Update position
      state.x += state.vx * deltaTime;
      state.y += state.vy * deltaTime;
      
      // Check if still moving
      const dx = state.targetX - state.x;
      const dy = state.targetY - state.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const speed = Math.sqrt(state.vx ** 2 + state.vy ** 2);
      
      if (distance > this.config.threshold || speed > this.config.threshold) {
        activeCount++;
      } else {
        // Snap to target
        state.x = state.targetX;
        state.y = state.targetY;
        state.vx = 0;
        state.vy = 0;
      }
      
      // Apply transform
      morph.style.transform = `translate(${state.x - state.targetX}px, ${state.y - state.targetY}px)`;
    });
    
    // Continue animation if any morph is moving
    if (activeCount > 0) {
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
    }
  };

  /**
   * Calculate physics forces
   */
  calculateForces(state) {
    const dx = state.targetX - state.x;
    const dy = state.targetY - state.y;
    
    switch (this.config.physics) {
      case 'spring': {
        // Hooke's Law: F = -k * x
        const fx = dx * this.config.stiffness / this.config.mass;
        const fy = dy * this.config.stiffness / this.config.mass;
        return { fx, fy };
      }
      
      case 'bounce': {
        // Spring with extra bounce
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const force = distance * this.config.stiffness * 2;
        const fx = (dx / distance) * force / this.config.mass;
        const fy = (dy / distance) * force / this.config.mass;
        return { fx, fy };
      }
      
      case 'friction': {
        // Direct velocity damping
        const fx = dx * 5 / this.config.mass;
        const fy = dy * 5 / this.config.mass;
        return { fx, fy };
      }
      
      case 'linear': {
        // Constant velocity
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const speed = 200; // pixels per second
        const fx = distance > 0 ? (dx / distance) * speed : 0;
        const fy = distance > 0 ? (dy / distance) * speed : 0;
        return { fx, fy };
      }
      
      default:
        return { fx: 0, fy: 0 };
    }
  }

  /**
   * Get current state of a morph
   */
  getState(morph) {
    return this.morphStates.get(morph);
  }

  /**
   * Update physics config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('[FlowReactor] Config updated', this.config);
  }
}
