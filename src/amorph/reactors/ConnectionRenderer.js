/**
 * 🔗 CONNECTION RENDERER
 * ======================
 * 
 * Rendert visuelle Verbindungen zwischen verwandten Morphs/Bubbles
 * 
 * Features:
 * - SVG & Canvas rendering modes
 * - Spring-based curve rendering
 * - Perspective color coding
 * - Animated connections
 * - Strength visualization (line thickness)
 * - Hover effects
 * - Connection labels
 * 
 * Connection Types:
 * - Same perspective (strong)
 * - Shared tags (medium)
 * - Related fungi (weak)
 * - Custom relationships
 * 
 * Usage:
 * const renderer = new ConnectionRenderer(canvas, {
 *   mode: 'canvas',
 *   style: 'bezier'
 * });
 * 
 * renderer.addConnection({
 *   source: bubble1,
 *   target: bubble2,
 *   strength: 0.8,
 *   color: '#667eea'
 * });
 * 
 * renderer.render();
 */

export class ConnectionRenderer {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = {
      mode: 'canvas',           // 'canvas' | 'svg'
      style: 'bezier',          // 'straight' | 'bezier' | 'spring'
      minStrength: 0.1,         // Don't render weak connections
      maxConnections: 100,      // Performance limit
      lineWidthMin: 1,
      lineWidthMax: 4,
      opacity: 0.3,
      hoverOpacity: 0.8,
      animate: true,
      animationSpeed: 0.02,
      showLabels: false,
      ...config
    };
    
    this.connections = [];
    this.hoveredConnection = null;
    this.animationOffset = 0;
    
    console.log('[ConnectionRenderer] Initialized', this.config);
  }

  /**
   * Add a connection between two nodes
   */
  addConnection(connection) {
    // Validate
    if (!connection.source || !connection.target) {
      console.warn('[ConnectionRenderer] Invalid connection', connection);
      return;
    }
    
    // Set defaults
    const conn = {
      strength: 0.5,
      color: '#667eea',
      label: '',
      ...connection
    };
    
    // Filter weak connections
    if (conn.strength < this.config.minStrength) return;
    
    this.connections.push(conn);
    
    // Limit connections for performance
    if (this.connections.length > this.config.maxConnections) {
      this.connections.shift();
    }
  }

  /**
   * Clear all connections
   */
  clearConnections() {
    this.connections = [];
  }

  /**
   * Render all connections
   */
  render() {
    if (this.config.mode === 'canvas') {
      this.renderCanvas();
    } else {
      this.renderSVG();
    }
  }

  /**
   * Render connections on canvas
   */
  renderCanvas() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update animation
    if (this.config.animate) {
      this.animationOffset += this.config.animationSpeed;
      if (this.animationOffset > 1) this.animationOffset = 0;
    }
    
    // Render each connection
    this.connections.forEach(conn => {
      this.renderConnection(conn);
    });
  }

  /**
   * Render a single connection
   */
  renderConnection(conn) {
    const { source, target, strength, color } = conn;
    
    // Calculate line width based on strength
    const lineWidth = this.config.lineWidthMin + 
      (this.config.lineWidthMax - this.config.lineWidthMin) * strength;
    
    // Calculate opacity
    const isHovered = conn === this.hoveredConnection;
    const opacity = isHovered ? this.config.hoverOpacity : this.config.opacity;
    
    // Set style
    this.ctx.strokeStyle = this.hexToRGBA(color, opacity);
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    
    // Render based on style
    switch (this.config.style) {
      case 'straight':
        this.renderStraightLine(source, target);
        break;
      case 'bezier':
        this.renderBezierCurve(source, target);
        break;
      case 'spring':
        this.renderSpringCurve(source, target, strength);
        break;
      default:
        this.renderStraightLine(source, target);
    }
    
    // Render label if enabled
    if (this.config.showLabels && conn.label) {
      this.renderLabel(source, target, conn.label, color);
    }
    
    // Animated dash
    if (this.config.animate && isHovered) {
      this.renderAnimatedDash(source, target);
    }
  }

  /**
   * Render straight line
   */
  renderStraightLine(source, target) {
    this.ctx.beginPath();
    this.ctx.moveTo(source.x, source.y);
    this.ctx.lineTo(target.x, target.y);
    this.ctx.stroke();
  }

  /**
   * Render bezier curve
   */
  renderBezierCurve(source, target) {
    // Calculate control points for smooth curve
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Control points offset perpendicular to line
    const offset = dist * 0.2;
    const perpX = -dy / dist * offset;
    const perpY = dx / dist * offset;
    
    const cp1x = source.x + dx * 0.25 + perpX;
    const cp1y = source.y + dy * 0.25 + perpY;
    const cp2x = source.x + dx * 0.75 + perpX;
    const cp2y = source.y + dy * 0.75 + perpY;
    
    this.ctx.beginPath();
    this.ctx.moveTo(source.x, source.y);
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
    this.ctx.stroke();
  }

  /**
   * Render spring curve (oscillating)
   */
  renderSpringCurve(source, target, strength) {
    const steps = 50;
    const amplitude = 20 * strength;
    const frequency = 3;
    
    this.ctx.beginPath();
    this.ctx.moveTo(source.x, source.y);
    
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      
      // Linear interpolation
      const x = source.x + (target.x - source.x) * t;
      const y = source.y + (target.y - source.y) * t;
      
      // Perpendicular offset with sine wave
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const perpX = -dy / dist;
      const perpY = dx / dist;
      
      const offset = Math.sin(t * Math.PI * frequency + this.animationOffset * Math.PI * 2) * amplitude * (1 - t) * t * 4;
      
      this.ctx.lineTo(
        x + perpX * offset,
        y + perpY * offset
      );
    }
    
    this.ctx.stroke();
  }

  /**
   * Render animated dash on connection
   */
  renderAnimatedDash(source, target) {
    const dashLength = 10;
    const gapLength = 10;
    const offset = this.animationOffset * (dashLength + gapLength);
    
    this.ctx.save();
    this.ctx.setLineDash([dashLength, gapLength]);
    this.ctx.lineDashOffset = -offset;
    this.ctx.strokeStyle = this.hexToRGBA('#ffffff', 0.5);
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(source.x, source.y);
    this.ctx.lineTo(target.x, target.y);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  /**
   * Render label at midpoint
   */
  renderLabel(source, target, label, color) {
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    this.ctx.save();
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Background
    const metrics = this.ctx.measureText(label);
    const padding = 4;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(
      midX - metrics.width / 2 - padding,
      midY - 6 - padding,
      metrics.width + padding * 2,
      12 + padding * 2
    );
    
    // Text
    this.ctx.fillStyle = color;
    this.ctx.fillText(label, midX, midY);
    
    this.ctx.restore();
  }

  /**
   * Check if point is near connection (for hover)
   */
  isNearConnection(x, y, conn, threshold = 10) {
    const { source, target } = conn;
    
    // Distance from point to line segment
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) return false;
    
    let t = ((x - source.x) * dx + (y - source.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = source.x + t * dx;
    const projY = source.y + t * dy;
    
    const distSq = (x - projX) * (x - projX) + (y - projY) * (y - projY);
    
    return distSq < threshold * threshold;
  }

  /**
   * Handle hover (call from outside with mouse position)
   */
  updateHover(x, y) {
    let foundHover = null;
    
    for (const conn of this.connections) {
      if (this.isNearConnection(x, y, conn)) {
        foundHover = conn;
        break;
      }
    }
    
    if (foundHover !== this.hoveredConnection) {
      this.hoveredConnection = foundHover;
      return true; // Needs redraw
    }
    
    return false;
  }

  /**
   * Generate connections from bubbles based on relationships
   */
  generateConnections(bubbles, amorph) {
    this.clearConnections();
    
    // Create connections between bubbles with same perspective
    for (let i = 0; i < bubbles.length; i++) {
      const bubble1 = bubbles[i];
      
      for (let j = i + 1; j < bubbles.length; j++) {
        const bubble2 = bubbles[j];
        
        // Check relationship
        const strength = this.calculateStrength(bubble1, bubble2, amorph);
        
        if (strength > this.config.minStrength) {
          const color = this.getConnectionColor(bubble1, bubble2, amorph);
          
          this.addConnection({
            source: bubble1,
            target: bubble2,
            strength,
            color
          });
        }
      }
    }
    
    console.log(`[ConnectionRenderer] Generated ${this.connections.length} connections`);
  }

  /**
   * Calculate connection strength between two bubbles
   */
  calculateStrength(bubble1, bubble2, amorph) {
    let strength = 0;
    
    // Same perspective = strong connection
    if (bubble1.perspective === bubble2.perspective) {
      strength += 0.8;
    }
    
    // TODO: Add more relationship logic
    // - Shared tags
    // - Related fungi
    // - User connections
    
    return Math.min(1, strength);
  }

  /**
   * Get connection color based on perspectives
   */
  getConnectionColor(bubble1, bubble2, amorph) {
    if (!amorph) return '#667eea';
    
    // Use perspective color if same
    if (bubble1.perspective === bubble2.perspective) {
      return amorph.getPerspectiveColor(bubble1.perspective) || '#667eea';
    }
    
    // Mix colors if different
    const color1 = amorph.getPerspectiveColor(bubble1.perspective);
    const color2 = amorph.getPerspectiveColor(bubble2.perspective);
    
    if (color1 && color2) {
      return this.mixColors(color1, color2);
    }
    
    return '#667eea';
  }

  /**
   * Mix two hex colors
   */
  mixColors(color1, color2) {
    const c1 = this.hexToRGB(color1);
    const c2 = this.hexToRGB(color2);
    
    const r = Math.round((c1.r + c2.r) / 2);
    const g = Math.round((c1.g + c2.g) / 2);
    const b = Math.round((c1.b + c2.b) / 2);
    
    return this.rgbToHex(r, g, b);
  }

  /**
   * Convert hex to RGB
   */
  hexToRGB(hex) {
    hex = hex.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }

  /**
   * Convert RGB to hex
   */
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Convert hex to RGBA string
   */
  hexToRGBA(hex, alpha = 1) {
    const rgb = this.hexToRGB(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  /**
   * Update config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('[ConnectionRenderer] Config updated', this.config);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      connections: this.connections.length,
      hoveredConnection: this.hoveredConnection ? 'yes' : 'no'
    };
  }
}

export default ConnectionRenderer;
