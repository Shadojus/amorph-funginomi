/**
 * ⚛️ FORCE-DIRECTED LAYOUT ENGINE
 * ================================
 * 
 * Physics engine für intelligentes Bubble-Positioning
 * Basiert auf Graph-Layout-Algorithmen (Fruchterman-Reingold, Force-Atlas)
 * 
 * Features:
 * - Attraction forces (nodes pull related items)
 * - Repulsion forces (nodes push each other away)
 * - Perspective-based clustering
 * - Equilibrium detection
 * - Temperature cooling
 * - Boundary constraints
 * 
 * Forces:
 * 1. Coulomb Repulsion - alle Bubbles stoßen sich ab
 * 2. Hooke Attraction - verwandte Bubbles ziehen sich an
 * 3. Center Gravity - leichte Anziehung zur Mitte
 * 4. Boundary Force - hält Bubbles im sichtbaren Bereich
 * 
 * Usage:
 * const layout = new ForceDirectedLayout(width, height, {
 *   repulsion: 5000,
 *   attraction: 0.1,
 *   gravity: 0.01
 * });
 * 
 * layout.addNodes(bubbles);
 * layout.step(); // One simulation step
 */

export class ForceDirectedLayout {
  constructor(width, height, config = {}) {
    this.width = width;
    this.height = height;
    this.config = {
      // Force strengths
      repulsion: 5000,        // Coulomb repulsion constant
      attraction: 0.1,        // Hooke attraction constant
      gravity: 0.01,          // Center gravity strength
      boundary: 0.1,          // Boundary force strength
      
      // Simulation
      damping: 0.85,          // Velocity damping (0-1)
      maxVelocity: 100,       // Max pixels per step
      temperature: 1.0,       // Cooling temperature
      coolingRate: 0.95,      // Temperature decrease per step
      minTemperature: 0.01,   // Stop threshold
      
      // Clustering
      clusterByPerspective: true,
      clusterStrength: 0.5,   // Perspective clustering strength
      
      ...config
    };
    
    this.nodes = [];
    this.connections = [];
    this.isStable = false;
    this.stepCount = 0;
    
    console.log('[ForceDirectedLayout] Initialized', this.config);
  }

  /**
   * Add nodes (bubbles) to layout
   */
  addNodes(nodes) {
    this.nodes = nodes;
    this.isStable = false;
    this.stepCount = 0;
    this.config.temperature = 1.0;
    
    console.log(`[ForceDirectedLayout] Added ${nodes.length} nodes`);
  }

  /**
   * Add connections between nodes
   */
  addConnections(connections) {
    this.connections = connections;
    console.log(`[ForceDirectedLayout] Added ${connections.length} connections`);
  }

  /**
   * Run one simulation step
   */
  step() {
    if (this.isStable || this.nodes.length === 0) return false;
    
    // Calculate forces for each node
    this.nodes.forEach(node => {
      node.fx = 0;
      node.fy = 0;
    });
    
    // Apply all forces
    this.applyRepulsion();
    this.applyAttraction();
    this.applyGravity();
    this.applyBoundary();
    
    if (this.config.clusterByPerspective) {
      this.applyClustering();
    }
    
    // Update positions
    this.updatePositions();
    
    // Cool down temperature
    this.config.temperature *= this.config.coolingRate;
    this.stepCount++;
    
    // Check stability
    if (this.config.temperature < this.config.minTemperature) {
      this.isStable = true;
      console.log(`[ForceDirectedLayout] Reached equilibrium after ${this.stepCount} steps`);
      return false;
    }
    
    return true; // Continue simulation
  }

  /**
   * Apply Coulomb repulsion between all nodes
   */
  applyRepulsion() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node1 = this.nodes[i];
      
      for (let j = i + 1; j < this.nodes.length; j++) {
        const node2 = this.nodes[j];
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distSq = dx * dx + dy * dy + 1; // Add 1 to prevent division by zero
        const dist = Math.sqrt(distSq);
        
        // Coulomb's law: F = k * (q1 * q2) / r²
        const force = this.config.repulsion / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        node1.fx -= fx;
        node1.fy -= fy;
        node2.fx += fx;
        node2.fy += fy;
      }
    }
  }

  /**
   * Apply Hooke attraction along connections
   */
  applyAttraction() {
    this.connections.forEach(({ source, target, strength = 1 }) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist === 0) return;
      
      // Hooke's law: F = -k * x
      const force = dist * this.config.attraction * strength;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      
      source.fx += fx;
      source.fy += fy;
      target.fx -= fx;
      target.fy -= fy;
    });
  }

  /**
   * Apply center gravity to prevent drift
   */
  applyGravity() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    this.nodes.forEach(node => {
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      
      node.fx += dx * this.config.gravity;
      node.fy += dy * this.config.gravity;
    });
  }

  /**
   * Apply boundary forces to keep nodes in viewport
   */
  applyBoundary() {
    const margin = 50;
    
    this.nodes.forEach(node => {
      // Left boundary
      if (node.x < margin) {
        node.fx += (margin - node.x) * this.config.boundary;
      }
      
      // Right boundary
      if (node.x > this.width - margin) {
        node.fx -= (node.x - (this.width - margin)) * this.config.boundary;
      }
      
      // Top boundary
      if (node.y < margin) {
        node.fy += (margin - node.y) * this.config.boundary;
      }
      
      // Bottom boundary
      if (node.y > this.height - margin) {
        node.fy -= (node.y - (this.height - margin)) * this.config.boundary;
      }
    });
  }

  /**
   * Apply clustering by perspective
   */
  applyClustering() {
    // Group nodes by perspective
    const clusters = new Map();
    
    this.nodes.forEach(node => {
      const perspective = node.perspective || 'default';
      if (!clusters.has(perspective)) {
        clusters.set(perspective, []);
      }
      clusters.get(perspective).push(node);
    });
    
    // Calculate cluster centers
    clusters.forEach((nodes, perspective) => {
      if (nodes.length < 2) return;
      
      // Calculate center of mass
      let cx = 0, cy = 0;
      nodes.forEach(node => {
        cx += node.x;
        cy += node.y;
      });
      cx /= nodes.length;
      cy /= nodes.length;
      
      // Pull nodes toward cluster center
      nodes.forEach(node => {
        const dx = cx - node.x;
        const dy = cy - node.y;
        
        node.fx += dx * this.config.clusterStrength;
        node.fy += dy * this.config.clusterStrength;
      });
    });
  }

  /**
   * Update node positions based on forces
   */
  updatePositions() {
    this.nodes.forEach(node => {
      if (node.isDragging || node.fixed) return;
      
      // Calculate acceleration (F = ma, assume m = mass)
      const mass = node.mass || 1;
      const ax = node.fx / mass;
      const ay = node.fy / mass;
      
      // Update velocity
      node.vx = (node.vx || 0) + ax;
      node.vy = (node.vy || 0) + ay;
      
      // Apply temperature scaling
      node.vx *= this.config.temperature;
      node.vy *= this.config.temperature;
      
      // Apply damping
      node.vx *= this.config.damping;
      node.vy *= this.config.damping;
      
      // Limit velocity
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > this.config.maxVelocity) {
        const scale = this.config.maxVelocity / speed;
        node.vx *= scale;
        node.vy *= scale;
      }
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
    });
  }

  /**
   * Run simulation until stable
   */
  async runUntilStable(maxSteps = 1000, callback = null) {
    let steps = 0;
    
    return new Promise((resolve) => {
      const simulate = () => {
        const shouldContinue = this.step();
        steps++;
        
        if (callback) callback(steps, this.config.temperature);
        
        if (!shouldContinue || steps >= maxSteps) {
          resolve(steps);
        } else {
          requestAnimationFrame(simulate);
        }
      };
      
      simulate();
    });
  }

  /**
   * Reset simulation
   */
  reset() {
    this.isStable = false;
    this.stepCount = 0;
    this.config.temperature = 1.0;
    
    // Reset velocities
    this.nodes.forEach(node => {
      node.vx = 0;
      node.vy = 0;
    });
  }

  /**
   * Update dimensions
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  /**
   * Get layout statistics
   */
  getStats() {
    return {
      nodes: this.nodes.length,
      connections: this.connections.length,
      temperature: this.config.temperature,
      stepCount: this.stepCount,
      isStable: this.isStable
    };
  }
}

export default ForceDirectedLayout;
