/**
 * 🔗 CANVAS CONNECTION REACTOR
 * =============================
 * 
 * Rendert alle Verbindungen zwischen Nodes im BubbleView
 * 
 * Features:
 * - Similarity connections (entity <-> entity)
 * - Semantic connections (query -> entity)
 * - User-intent connections (user -> entity)
 * - Weight-based line thickness
 * - Gradient coloring
 * - Hover highlighting
 * 
 * Connection Types:
 * - 'similarity': Bidirectional, green gradient
 * - 'semantic': Query to entity, purple gradient
 * - 'user-intent': User to entity, blue gradient
 * 
 * Config:
 * - minLineWidth: Minimum line width (default: 1)
 * - maxLineWidth: Maximum line width (default: 8)
 * - minOpacity: Minimum opacity (default: 0.2)
 * - maxOpacity: Maximum opacity (default: 0.8)
 * - style: 'straight' | 'curved'
 * 
 * Usage:
 * amorph.registerReactor('canvasConnection', CanvasConnectionReactor);
 * bubbleView.enableReactor('canvasConnection');
 */

import { CanvasReactor } from './CanvasReactor.js';

export class CanvasConnectionReactor extends CanvasReactor {
  constructor(config = {}) {
    super({
      priority: 10, // Render early (behind nodes)
      minLineWidth: 1,
      maxLineWidth: 8,
      minOpacity: 0.2,
      maxOpacity: 0.8,
      style: 'curved', // 'straight' | 'curved'
      showWeightBadges: true, // Show weight as badge
      ...config
    });
    
    this.hoveredConnection = null;
  }
  
  /**
   * Render all connections
   */
  render(ctx) {
    super.render(ctx);
    if (!ctx) return;
    
    const connections = this.getConnections();
    const bubbles = this.getBubbles();
    const queryNodes = this.getQueryNodes();
    const userNode = this.getUserNode();
    
    // Log only significant changes in connection count
    if (!this.lastConnectionCount) this.lastConnectionCount = 0;
    if (connections.size !== this.lastConnectionCount) {
      console.log(`[CanvasConnectionReactor] 🔗 ${connections.size} bubble-to-bubble connections`);
      this.lastConnectionCount = connections.size;
    }
    
    // Combine all nodes
    const allNodes = new Map([
      ...bubbles,
      ...queryNodes
    ]);
    
    if (userNode) {
      allNodes.set('user-central', userNode);
    }
    
    // Render each connection
    connections.forEach((conn, connId) => {
      const fromNode = allNodes.get(conn.from);
      const toNode = allNodes.get(conn.to);
      
      if (!fromNode || !toNode) return;
      
      // Render based on connection type
      if (conn.type === 'similarity') {
        this.renderSimilarityConnection(ctx, fromNode, toNode, conn);
      } else if (conn.type === 'semantic') {
        this.renderSemanticConnection(ctx, fromNode, toNode, conn);
      } else if (conn.type === 'user-intent') {
        this.renderUserIntentConnection(ctx, fromNode, toNode, conn);
      }
    });
  }
  
  /**
   * Render similarity connection (entity <-> entity)
   */
  renderSimilarityConnection(ctx, from, to, conn) {
    const weight = conn.weight || 0;
    const lineWidth = this.config.minLineWidth + 
                     (this.config.maxLineWidth - this.config.minLineWidth) * weight;
    const opacity = this.config.minOpacity + 
                   (this.config.maxOpacity - this.config.minOpacity) * weight;
    
    // Green gradient
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, `rgba(34, 197, 94, ${opacity})`);
    gradient.addColorStop(1, `rgba(21, 128, 61, ${opacity})`);
    
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    
    if (this.config.style === 'curved') {
      this.drawCurved(ctx, from, to);
    } else {
      this.drawStraight(ctx, from, to);
    }
    
    ctx.restore();
    
    // Always show weight badge
    this.drawWeightBadge(ctx, from, to, weight, 'similarity');
  }
  
  /**
   * Render semantic connection (query -> entity)
   */
  renderSemanticConnection(ctx, from, to, conn) {
    const weight = conn.weight || 0;
    const lineWidth = this.config.minLineWidth + 
                     (this.config.maxLineWidth - this.config.minLineWidth) * weight;
    const opacity = this.config.minOpacity + 
                   (this.config.maxOpacity - this.config.minOpacity) * weight;
    
    // Purple gradient
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity})`);
    gradient.addColorStop(1, `rgba(124, 58, 237, ${opacity})`);
    
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    ctx.setLineDash([8, 4]); // Dashed for semantic
    
    if (this.config.style === 'curved') {
      this.drawCurved(ctx, from, to);
    } else {
      this.drawStraight(ctx, from, to);
    }
    
    ctx.restore();
    
    // Show weight badge for semantic connections
    this.drawWeightBadge(ctx, from, to, weight, 'semantic');
  }
  
  /**
   * Render user-intent connection (user -> entity)
   */
  renderUserIntentConnection(ctx, from, to, conn) {
    const weight = conn.weight || 0;
    const lineWidth = this.config.minLineWidth + 
                     (this.config.maxLineWidth - this.config.minLineWidth) * weight;
    const opacity = this.config.minOpacity + 
                   (this.config.maxOpacity - this.config.minOpacity) * weight;
    
    console.log('[CanvasConnectionReactor] Drawing user-intent:', {
      from: conn.from,
      to: conn.to,
      weight: weight.toFixed(3)
    });
    
    // Blue gradient
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
    gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
    
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    
    if (this.config.style === 'curved') {
      this.drawCurved(ctx, from, to);
    } else {
      this.drawStraight(ctx, from, to);
    }
    
    ctx.restore();
    
    // Show weight badge for user-intent connections
    this.drawWeightBadge(ctx, from, to, weight, 'user-intent');
  }
  
  /**
   * Draw straight line
   */
  drawStraight(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  
  /**
   * Draw curved line (Bezier)
   */
  drawCurved(ctx, from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Control point offset
    const curvature = distance * 0.2;
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
   * Draw weight badge
   */
  drawWeightBadge(ctx, from, to, weight, type = 'similarity') {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    const weightText = weight.toFixed(3);
    const badgeWidth = 42;
    const badgeHeight = 20;
    
    // Color based on connection type
    let borderColor, textColor;
    if (type === 'similarity') {
      borderColor = 'rgba(34, 197, 94, 1.0)';
      textColor = '#15803d';
    } else if (type === 'semantic') {
      borderColor = 'rgba(168, 85, 247, 1.0)';
      textColor = '#7c3aed';
    } else { // user-intent
      borderColor = 'rgba(99, 102, 241, 1.0)';
      textColor = '#3b82f6';
    }
    
    // Draw rounded rectangle background
    ctx.beginPath();
    const radius = 4;
    ctx.roundRect(midX - badgeWidth/2, midY - badgeHeight/2, badgeWidth, badgeHeight, radius);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw weight text
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(weightText, midX, midY);
  }
}

export default CanvasConnectionReactor;
