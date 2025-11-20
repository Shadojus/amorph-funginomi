/**
 * ⚛️ CANVAS PHYSICS REACTOR
 * ==========================
 * 
 * Physics engine für BubbleView - Extrahiert aus hardcoded Logic
 * 
 * Features:
 * - Spring-force system (Connection-based attraction)
 * - Collision detection & resolution
 * - Boundary forces
 * - Damping & Friction
 * - User Node centering force
 * 
 * Forces:
 * 1. Connection Forces - Attraction/Repulsion based on similarity
 * 2. Collision Forces - Prevent overlap
 * 3. Boundary Forces - Keep nodes in view
 * 4. Center Force - User Node stays centered
 * 
 * Config:
 * - springStrength: Connection spring strength (default: 0.005)
 * - damping: Velocity damping (default: 0.95)
 * - collisionStrength: Collision resolution force (default: 0.1)
 * - boundaryMargin: Margin from edges (default: 100)
 * 
 * Usage:
 * amorph.registerReactor('canvasPhysics', CanvasPhysicsReactor);
 * bubbleView.enableReactor('canvasPhysics');
 */

import { CanvasReactor } from './CanvasReactor.js';

export class CanvasPhysicsReactor extends CanvasReactor {
  constructor(config = {}) {
    super({
      priority: 50, // Update before rendering
      springStrength: 0.001,        // Reduced from 0.005 - gentler attraction
      damping: 0.92,                 // Reduced from 0.98 - more friction
      collisionStrength: 0.05,       // Reduced from 0.1 - softer collisions
      boundaryMargin: 100,
      boundaryAttraction: 0.0005,    // Reduced from 0.002 - subtle boundary pull
      repulsionDistance: 300,        // Reduced from 400 - smaller repulsion zone
      repulsionStrength: 0.00005,    // Reduced from 0.0001 - gentler repulsion
      ...config
    });
  }
  
  /**
   * Update physics simulation
   */
  update(deltaTime) {
    super.update(deltaTime);
    
    const { width, height } = this.getCanvasDimensions();
    const margin = this.config.boundaryMargin;
    
    // Get all nodes (bubbles + queries + user node)
    const allNodes = this.getAllNodes();
    
    // 1. Apply inter-node forces
    this.applyInterNodeForces(allNodes);
    
    // 2. Apply boundary forces
    this.applyBoundaryForces(allNodes, width, height, margin);
    
    // 3. Apply damping and update positions
    this.updatePositions(allNodes, width, height);
    
    // 4. Resolve collisions
    this.resolveCollisions(allNodes);
  }
  
  /**
   * Get all nodes (bubbles + queries + user node)
   */
  getAllNodes() {
    const bubbles = this.getBubbles();
    const queryNodes = this.getQueryNodes();
    const userNode = this.getUserNode();
    
    const nodes = [
      ...Array.from(bubbles.entries()),
      ...Array.from(queryNodes.entries())
    ];
    
    if (userNode) {
      nodes.push(['user-central', userNode]);
    }
    
    return nodes;
  }
  
  /**
   * Apply forces between all node pairs
   */
  applyInterNodeForces(allNodes) {
    for (let i = 0; i < allNodes.length; i++) {
      const [id1, node1] = allNodes[i];
      if (node1.isDragging) continue;
      
      // CRITICAL: Sync BubbleMorph position from node data
      if (node1.morph && (node1.morph.x !== node1.x || node1.morph.y !== node1.y)) {
        node1.morph.x = node1.x;
        node1.morph.y = node1.y;
        node1.morph.requestUpdate();
      }
      
      for (let j = i + 1; j < allNodes.length; j++) {
        const [id2, node2] = allNodes[j];
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) continue;
        
        // Check connection
        const hasConnection = this.hasConnection(id1, id2);
        const connectionWeight = hasConnection ? this.getConnectionWeight(id1, id2) : 0;
        
        // Normalize direction
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Minimum safe distance
        const minDistance = (node1.size + node2.size) / 2 + 20;
        
        let totalForce = 0;
        
        if (distance < minDistance) {
          // Gentle repulsion when too close
          const repulsion = (minDistance - distance) * 0.008;  // Reduced from 0.02
          totalForce = -repulsion;
        } else if (hasConnection) {
          // Spring force for connected nodes
          const targetDistance = 120 + (1 - connectionWeight) * 150;  // Shorter distances
          const distanceError = distance - targetDistance;
          const springStrength = this.config.springStrength * connectionWeight * 0.5;  // Reduced strength
          totalForce = distanceError * springStrength;
        } else {
          // Very gentle repulsion for unconnected nodes
          if (distance < this.config.repulsionDistance) {
            const repulsion = (this.config.repulsionDistance - distance) * this.config.repulsionStrength;
            totalForce = -repulsion;
          }
        }
        
        // Apply forces
        node1.vx += nx * totalForce;
        node1.vy += ny * totalForce;
        node2.vx -= nx * totalForce;
        node2.vy -= ny * totalForce;
      }
    }
  }
  
  /**
   * Check if two nodes are connected
   */
  hasConnection(id1, id2) {
    const connections = this.getConnections();
    return connections.has(`${id1}<->${id2}`) || 
           connections.has(`${id2}<->${id1}`) ||
           connections.has(`${id1}->${id2}`) ||
           connections.has(`${id2}->${id1}`);
  }
  
  /**
   * Get connection weight between two nodes
   */
  getConnectionWeight(id1, id2) {
    const connections = this.getConnections();
    const conn1 = connections.get(`${id1}<->${id2}`) || connections.get(`${id1}->${id2}`);
    const conn2 = connections.get(`${id2}<->${id1}`) || connections.get(`${id2}->${id1}`);
    return conn1?.weight || conn2?.weight || 0;
  }
  
  /**
   * Apply boundary forces to keep nodes in view
   */
  applyBoundaryForces(allNodes, width, height, margin) {
    allNodes.forEach(([id, node]) => {
      if (node.isDragging) return;
      
      // User node: Gentle center force
      if (id === 'user-central') {
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const centerAttraction = 0.01;  // Reduced from 0.05 - much gentler
        
        node.vx += dx * centerAttraction;
        node.vy += dy * centerAttraction;
        return;
      }
      
      // Other nodes: Boundary attraction only if outside
      if (node.x < margin || node.x > width - margin || 
          node.y < margin || node.y > height - margin) {
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        
        node.vx += dx * this.config.boundaryAttraction;
        node.vy += dy * this.config.boundaryAttraction;
      }
    });
  }
  
  /**
   * Update positions with damping
   */
  updatePositions(allNodes, width, height) {
    allNodes.forEach(([id, node]) => {
      if (node.isDragging) return;
      
      // Apply damping
      node.vx *= this.config.damping;
      node.vy *= this.config.damping;
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
      
      // Hard boundary limits
      const padding = node.size / 2;
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
      
      // CRITICAL: Sync BubbleMorph position (keeps connections attached!)
      if (node.morph) {
        node.morph.x = node.x;
        node.morph.y = node.y;
        node.morph.requestUpdate();
      }
    });
  }
  
  /**
   * Resolve collisions between nodes
   */
  resolveCollisions(allNodes) {
    for (let i = 0; i < allNodes.length; i++) {
      const [id1, node1] = allNodes[i];
      
      for (let j = i + 1; j < allNodes.length; j++) {
        const [id2, node2] = allNodes[j];
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Minimum safe distance
        const minSafeDistance = (node1.size + node2.size) / 2 + 5;
        
        // If overlapping, separate
        if (distance < minSafeDistance && distance > 0) {
          const overlap = minSafeDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Separation force (gentle)
          const separationForce = overlap * this.config.collisionStrength;
          
          if (!node1.isDragging) {
            node1.x -= nx * separationForce * 0.5;
            node1.y -= ny * separationForce * 0.5;
          }
          if (!node2.isDragging) {
            node2.x += nx * separationForce * 0.5;
            node2.y += ny * separationForce * 0.5;
          }
          
          // Dampen approach velocity
          const relativeVx = node2.vx - node1.vx;
          const relativeVy = node2.vy - node1.vy;
          const approachSpeed = relativeVx * nx + relativeVy * ny;
          
          if (approachSpeed < 0) {
            const damping = 0.3;
            if (!node1.isDragging) {
              node1.vx -= nx * approachSpeed * damping;
              node1.vy -= ny * approachSpeed * damping;
            }
            if (!node2.isDragging) {
              node2.vx += nx * approachSpeed * damping;
              node2.vy += ny * approachSpeed * damping;
            }
          }
        }
      }
    }
  }
}

export default CanvasPhysicsReactor;
