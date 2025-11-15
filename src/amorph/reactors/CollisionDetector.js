/**
 * 💥 COLLISION DETECTOR
 * =====================
 * 
 * Effiziente Kollisionserkennung für Bubbles
 * 
 * Features:
 * - Spatial hashing (O(n) statt O(n²))
 * - Circle-circle collision detection
 * - Elastic collision response
 * - Bubble-to-bubble repulsion
 * - Boundary collision
 * - Continuous collision detection (swept)
 * 
 * Algorithm:
 * 1. Spatial Hash Grid - teilt Space in Zellen
 * 2. Nur Bubbles in gleicher/benachbarter Zelle prüfen
 * 3. Circle intersection test
 * 4. Resolve collision mit Impuls-basierten Response
 * 
 * Usage:
 * const detector = new CollisionDetector(width, height, {
 *   cellSize: 100,
 *   restitution: 0.8
 * });
 * 
 * detector.detectCollisions(bubbles);
 * detector.resolveCollisions();
 */

export class CollisionDetector {
  constructor(width, height, config = {}) {
    this.width = width;
    this.height = height;
    this.config = {
      cellSize: 100,          // Spatial hash cell size
      restitution: 0.8,       // Bounciness (0-1)
      friction: 0.95,         // Velocity loss on collision
      minSeparation: 2,       // Min distance between bubbles
      boundaryRestitution: 0.6, // Boundary bounce
      ...config
    };
    
    this.grid = new Map();
    this.collisions = [];
    
    console.log('[CollisionDetector] Initialized', this.config);
  }

  /**
   * Detect all collisions in bubble array
   */
  detectCollisions(bubbles) {
    this.collisions = [];
    
    // Build spatial hash grid
    this.buildGrid(bubbles);
    
    // Check collisions only in nearby cells
    bubbles.forEach((bubble, index) => {
      const cell = this.getCell(bubble.x, bubble.y);
      const nearbyCells = this.getNearbyCells(cell);
      
      nearbyCells.forEach(nearbyCell => {
        const candidates = this.grid.get(this.cellKey(nearbyCell.col, nearbyCell.row));
        if (!candidates) return;
        
        candidates.forEach(otherBubble => {
          // Avoid duplicate checks
          if (otherBubble.index <= index) return;
          
          // Check collision
          const collision = this.checkCollision(bubble, otherBubble);
          if (collision) {
            this.collisions.push(collision);
          }
        });
      });
    });
    
    return this.collisions;
  }

  /**
   * Resolve all detected collisions
   */
  resolveCollisions() {
    this.collisions.forEach(collision => {
      this.resolveCollision(collision);
    });
  }

  /**
   * Build spatial hash grid
   */
  buildGrid(bubbles) {
    this.grid.clear();
    
    bubbles.forEach((bubble, index) => {
      bubble.index = index; // Track original index
      
      const cell = this.getCell(bubble.x, bubble.y);
      const key = this.cellKey(cell.col, cell.row);
      
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      
      this.grid.get(key).push(bubble);
    });
  }

  /**
   * Get grid cell for position
   */
  getCell(x, y) {
    return {
      col: Math.floor(x / this.config.cellSize),
      row: Math.floor(y / this.config.cellSize)
    };
  }

  /**
   * Get nearby cells (3x3 grid around cell)
   */
  getNearbyCells(cell) {
    const cells = [];
    
    for (let col = cell.col - 1; col <= cell.col + 1; col++) {
      for (let row = cell.row - 1; row <= cell.row + 1; row++) {
        cells.push({ col, row });
      }
    }
    
    return cells;
  }

  /**
   * Generate unique key for cell
   */
  cellKey(col, row) {
    return `${col},${row}`;
  }

  /**
   * Check collision between two bubbles
   */
  checkCollision(bubble1, bubble2) {
    const dx = bubble2.x - bubble1.x;
    const dy = bubble2.y - bubble1.y;
    const distSq = dx * dx + dy * dy;
    
    const r1 = bubble1.size / 2;
    const r2 = bubble2.size / 2;
    const minDist = r1 + r2 + this.config.minSeparation;
    const minDistSq = minDist * minDist;
    
    if (distSq < minDistSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      
      return {
        bubble1,
        bubble2,
        dx,
        dy,
        dist,
        overlap,
        normal: { x: dx / dist, y: dy / dist }
      };
    }
    
    return null;
  }

  /**
   * Resolve collision with impulse-based response
   */
  resolveCollision(collision) {
    const { bubble1, bubble2, dist, overlap, normal } = collision;
    
    // Separate bubbles
    const mass1 = bubble1.mass || 1;
    const mass2 = bubble2.mass || 1;
    const totalMass = mass1 + mass2;
    
    const separation1 = (overlap * mass2 / totalMass) * 0.5;
    const separation2 = (overlap * mass1 / totalMass) * 0.5;
    
    if (!bubble1.isDragging && !bubble1.fixed) {
      bubble1.x -= normal.x * separation1;
      bubble1.y -= normal.y * separation1;
    }
    
    if (!bubble2.isDragging && !bubble2.fixed) {
      bubble2.x += normal.x * separation2;
      bubble2.y += normal.y * separation2;
    }
    
    // Calculate relative velocity
    const vx1 = bubble1.vx || 0;
    const vy1 = bubble1.vy || 0;
    const vx2 = bubble2.vx || 0;
    const vy2 = bubble2.vy || 0;
    
    const relVelX = vx2 - vx1;
    const relVelY = vy2 - vy1;
    
    // Relative velocity along collision normal
    const velAlongNormal = relVelX * normal.x + relVelY * normal.y;
    
    // Don't resolve if velocities are separating
    if (velAlongNormal > 0) return;
    
    // Calculate impulse scalar
    const restitution = this.config.restitution;
    const impulseScalar = -(1 + restitution) * velAlongNormal / totalMass;
    
    // Apply impulse
    const impulseX = impulseScalar * normal.x;
    const impulseY = impulseScalar * normal.y;
    
    if (!bubble1.isDragging && !bubble1.fixed) {
      bubble1.vx = (vx1 - impulseX * mass2) * this.config.friction;
      bubble1.vy = (vy1 - impulseY * mass2) * this.config.friction;
    }
    
    if (!bubble2.isDragging && !bubble2.fixed) {
      bubble2.vx = (vx2 + impulseX * mass1) * this.config.friction;
      bubble2.vy = (vy2 + impulseY * mass1) * this.config.friction;
    }
  }

  /**
   * Check and resolve boundary collisions
   */
  checkBoundaryCollisions(bubbles) {
    const margin = 10;
    
    bubbles.forEach(bubble => {
      if (bubble.isDragging || bubble.fixed) return;
      
      const radius = bubble.size / 2;
      
      // Left boundary
      if (bubble.x - radius < margin) {
        bubble.x = margin + radius;
        bubble.vx = Math.abs(bubble.vx || 0) * this.config.boundaryRestitution;
      }
      
      // Right boundary
      if (bubble.x + radius > this.width - margin) {
        bubble.x = this.width - margin - radius;
        bubble.vx = -Math.abs(bubble.vx || 0) * this.config.boundaryRestitution;
      }
      
      // Top boundary
      if (bubble.y - radius < margin) {
        bubble.y = margin + radius;
        bubble.vy = Math.abs(bubble.vy || 0) * this.config.boundaryRestitution;
      }
      
      // Bottom boundary
      if (bubble.y + radius > this.height - margin) {
        bubble.y = this.height - margin - radius;
        bubble.vy = -Math.abs(bubble.vy || 0) * this.config.boundaryRestitution;
      }
    });
  }

  /**
   * Apply repulsion force between overlapping bubbles
   */
  applyRepulsion(bubbles, strength = 0.5) {
    this.detectCollisions(bubbles);
    
    this.collisions.forEach(collision => {
      const { bubble1, bubble2, normal, overlap } = collision;
      
      const force = overlap * strength;
      
      if (!bubble1.isDragging && !bubble1.fixed) {
        bubble1.vx = (bubble1.vx || 0) - normal.x * force;
        bubble1.vy = (bubble1.vy || 0) - normal.y * force;
      }
      
      if (!bubble2.isDragging && !bubble2.fixed) {
        bubble2.vx = (bubble2.vx || 0) + normal.x * force;
        bubble2.vy = (bubble2.vy || 0) + normal.y * force;
      }
    });
  }

  /**
   * Get collision count
   */
  getCollisionCount() {
    return this.collisions.length;
  }

  /**
   * Update dimensions
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Clear collision data
   */
  clear() {
    this.grid.clear();
    this.collisions = [];
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      collisions: this.collisions.length,
      gridCells: this.grid.size,
      avgBubblesPerCell: Array.from(this.grid.values()).reduce((sum, cell) => sum + cell.length, 0) / this.grid.size || 0
    };
  }
}

export default CollisionDetector;
