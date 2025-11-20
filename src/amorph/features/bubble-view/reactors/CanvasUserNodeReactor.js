/**
 * 👤 CANVAS USER NODE REACTOR
 * ============================
 * 
 * Visualisiert den User Node im BubbleView als zentralen Punkt
 * mit gewichteten Verbindungen zu relevanten Daten
 * 
 * Features:
 * - Kompakte, übersichtliche Darstellung
 * - Score-basierte Verbindungen (nur über Threshold)
 * - Vector-Lines zu verbundenen Bubbles
 * - Activity-Ring basierend auf Interaktionen
 * - Interaction-History Tracking
 * - Perspective-Color-Coding
 * 
 * Architecture:
 * - UserNode ist immer zentral positioniert
 * - Connections nur zu Bubbles mit Score > threshold
 * - Vector-Stärke basiert auf Connection-Weight
 * - Gradient-Rendering für Depth
 * 
 * Config:
 * - scoreThreshold: Minimum score für Connection (default: 0.3)
 * - maxConnections: Max. Anzahl Verbindungen (default: 8)
 * - vectorStyle: 'straight' | 'curved' | 'dashed'
 * - showStats: Info-Overlay anzeigen
 * 
 * Usage:
 * const reactor = new CanvasUserNodeReactor({
 *   scoreThreshold: 0.3,
 *   maxConnections: 8,
 *   vectorStyle: 'curved'
 * });
 * amorph.registerReactor('canvasUserNode', CanvasUserNodeReactor);
 * bubbleView.enableReactor('canvasUserNode');
 */

import { CanvasReactor } from './CanvasReactor.js';

export class CanvasUserNodeReactor extends CanvasReactor {
  constructor(config = {}) {
    super({
      priority: 100, // Render last (on top)
      scoreThreshold: 0.3, // Min. score für Connection
      maxConnections: 8, // Max. Anzahl Verbindungen
      vectorStyle: 'curved', // 'straight' | 'curved' | 'dashed'
      showStats: true, // Info-Overlay
      centerForce: 0.05, // Stärke der Zentrierung
      pulseAnimation: true, // Activity pulse
      ...config
    });
    
    // Cached connections (score > threshold)
    this.activeConnections = [];
    this.lastConnectionUpdate = 0;
    this.connectionUpdateInterval = 500; // Update alle 500ms
  }
  
  /**
   * Update logic - Filter connections by score
   */
  update(deltaTime) {
    super.update(deltaTime);
    
    const now = performance.now();
    
    // Update connections periodically
    if (now - this.lastConnectionUpdate > this.connectionUpdateInterval) {
      this.updateActiveConnections();
      this.lastConnectionUpdate = now;
    }
    
    // Keep user node centered
    this.centerUserNode();
  }
  
  /**
   * Filter connections by score threshold
   */
  updateActiveConnections() {
    const userNode = this.getUserNode();
    if (!userNode || !userNode.connections) return;
    
    // Get all connections with their weights
    const connections = Array.from(userNode.connections.entries())
      .map(([targetId, weight]) => ({
        targetId,
        weight,
        score: weight // Weight IS the score
      }))
      .filter(conn => conn.score >= this.config.scoreThreshold)
      .sort((a, b) => b.score - a.score) // Höchste Scores zuerst
      .slice(0, this.config.maxConnections); // Limit
    
    this.activeConnections = connections;
    
    console.log(`[CanvasUserNodeReactor] Active connections: ${this.activeConnections.length}/${userNode.connections.size} (threshold: ${this.config.scoreThreshold})`);
  }
  
  /**
   * Keep user node centered
   */
  centerUserNode() {
    const userNode = this.getUserNode();
    if (!userNode) return;
    
    const { width, height } = this.getCanvasDimensions();
    const centerX = width / 2;
    const centerY = height / 2;
    
    const dx = centerX - userNode.x;
    const dy = centerY - userNode.y;
    
    // Smooth centering force
    userNode.vx += dx * this.config.centerForce;
    userNode.vy += dy * this.config.centerForce;
  }
  
  /**
   * Render user node and connections
   */
  render(ctx) {
    // Don't call super.render(ctx) - it has an early return guard!
    if (!this.enabled || !this.initialized) return;
    if (!ctx) {
      console.error('[CanvasUserNodeReactor] No ctx provided to render()');
      return;
    }
    
    this.renderCount++;
    
    const userNode = this.getUserNode();
    if (!userNode) {
      console.warn('[CanvasUserNodeReactor] No user node data available');
      return;
    }
    
    // Only log every 60 frames to reduce console spam
    if (this.renderCount % 60 === 0) {
      console.log('[CanvasUserNodeReactor] 🎨 Rendering...', {
        x: userNode.x,
        y: userNode.y,
        connections: this.activeConnections.length,
        renderCount: this.renderCount
      });
    }
    
    // 1. Render Connections FIRST (behind node)
    this.renderConnections(ctx, userNode);
    
    // 2. Render User Node
    this.renderUserNode(ctx, userNode);
    
    // 3. Render Stats (optional)
    if (this.config.showStats) {
      this.renderStats(ctx, userNode);
    }
  }
  
  /**
   * Render score-based connections as vectors
   */
  renderConnections(ctx, userNode) {
    const bubbles = this.getBubbles();
    
    this.activeConnections.forEach(conn => {
      const targetBubble = bubbles.get(conn.targetId);
      if (!targetBubble) return;
      
      // Vector properties based on score
      const lineWidth = 2 + conn.score * 6; // 2-8px
      const opacity = 0.3 + conn.score * 0.7; // 0.3-1.0
      
      // Color gradient based on score
      const gradient = ctx.createLinearGradient(
        userNode.x, userNode.y,
        targetBubble.x, targetBubble.y
      );
      
      // User node color (blue)
      gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
      
      // Target bubble color (perspective-based or default)
      const targetColor = this.getBubbleColor(targetBubble);
      gradient.addColorStop(1, `rgba(${targetColor.r}, ${targetColor.g}, ${targetColor.b}, ${opacity})`);
      
      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = gradient;
      
      // Draw connection based on style
      if (this.config.vectorStyle === 'curved') {
        this.drawCurvedConnection(ctx, userNode, targetBubble);
      } else if (this.config.vectorStyle === 'dashed') {
        ctx.setLineDash([10, 5]);
        this.drawStraightConnection(ctx, userNode, targetBubble);
      } else {
        this.drawStraightConnection(ctx, userNode, targetBubble);
      }
      
      ctx.restore();
      
      // ALWAYS draw score badge to show connection weight
      this.drawScoreBadge(ctx, userNode, targetBubble, conn.score);
    });
  }
  
  /**
   * Draw straight connection line
   */
  drawStraightConnection(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  
  /**
   * Draw curved connection (Bezier)
   */
  drawCurvedConnection(ctx, from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Control point offset (perpendicular to line)
    const curvature = distance * 0.2; // 20% of distance
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    // Perpendicular offset
    const perpX = -dy / distance * curvature;
    const perpY = dx / distance * curvature;
    
    const cpX = midX + perpX;
    const cpY = midY + perpY;
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(cpX, cpY, to.x, to.y);
    ctx.stroke();
  }
  
  /**
   * Draw score badge at connection midpoint
   */
  drawScoreBadge(ctx, from, to, score) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    const badgeSize = 20;
    const scorePercent = Math.round(score * 100);
    
    // Badge background
    ctx.beginPath();
    ctx.arc(midX, midY, badgeSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(99, 102, 241, 1.0)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Score text
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#4338ca';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${scorePercent}`, midX, midY);
  }
  
  /**
   * Render user node
   */
  renderUserNode(ctx, userNode) {
    const size = userNode.size;
    const x = userNode.x;
    const y = userNode.y;
    const connectionCount = this.activeConnections.length;
    
    // Activity pulse ring (if high activity)
    if (this.config.pulseAnimation && userNode.interactions.length > 5) {
      const pulsePhase = (Date.now() % 2000) / 2000; // 0-1
      const pulseSize = size / 3 + 10 + pulsePhase * 8;
      const pulseOpacity = (1 - pulsePhase) * 0.4;
      
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(99, 102, 241, ${pulseOpacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(x, y, size / 3 + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.fill();
    
    // Main bubble with gradient
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, size / 3
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');
    
    ctx.beginPath();
    ctx.arc(x, y, size / 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Border (thicker if many connections)
    const borderWidth = 3 + Math.min(connectionCount * 0.5, 5);
    ctx.strokeStyle = 'rgba(99, 102, 241, 1.0)';
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    
    // Icon
    ctx.font = '48px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', x, y - 15);
    
    // Label
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText('YOU', x, y + 25);
    
    // Connection count badge
    if (connectionCount > 0) {
      const badgeX = x - size / 2 + 16;
      const badgeY = y - size / 2 + 16;
      
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 1.0)'; // Red badge
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(connectionCount.toString(), badgeX, badgeY);
    }
  }
  
  /**
   * Render stats overlay - ALWAYS positioned relative to user node
   */
  renderStats(ctx, userNode) {
    // Position BELOW user node, offset by its size
    const x = userNode.x;
    const y = userNode.y + userNode.size / 2 + 30;
    
    const stats = [
      `${userNode.interactions.length} interactions`,
      `${this.activeConnections.length}/${userNode.connections.size} connections`,
      `Threshold: ${Math.round(this.config.scoreThreshold * 100)}%`
    ];
    
    // Background box for better readability
    const padding = 8;
    const lineHeight = 14;
    const boxWidth = 140;
    const boxHeight = stats.length * lineHeight + padding * 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - boxWidth / 2, y - padding, boxWidth, boxHeight);
    
    // Text
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    stats.forEach((stat, i) => {
      ctx.fillText(stat, x, y + i * lineHeight);
    });
  }
  
  /**
   * Get bubble color (perspective-based or default)
   */
  getBubbleColor(bubble) {
    // Default color (green-ish)
    const defaultColor = { r: 34, g: 197, b: 94 };
    
    // TODO: Get color from perspective mapping
    // For now, return default
    return defaultColor;
  }
}

export default CanvasUserNodeReactor;
