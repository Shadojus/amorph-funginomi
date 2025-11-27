/**
 * 🎨 PIXIE RENDERER
 * 
 * Verwendet Pixi.js für performante Node-Darstellung
 * Rendert Bubbles, Connections und Particles (für BubbleView - Phase 11+)
 * 
 * Erweitert mit Bildern, Text, Icons für volle BubbleView-Unterstützung!
 */

import { Application, Graphics, Container, Text, Sprite, Assets } from 'pixi.js';

export class PixieRenderer {
  constructor(config = {}) {
    this.config = {
      antialias: config.antialias !== false,
      backgroundColor: config.backgroundColor || 0x000000,
      resolution: config.resolution || (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1),
      autoDensity: config.autoDensity !== false,
      width: config.width || 800,
      height: config.height || 600,
      autoResize: config.autoResize !== false
    };
    
    this.app = null;
    this.container = null;
    this.nodes = new Map();  // id → Container (Graphics + Text + Sprite)
    this.connections = new Map();  // id → Container (Graphics + Text)
    this.particles = new Map();  // id → Graphics
    this.imageCache = new Map();  // url → Texture
  }
  
  /**
   * Initialisiere Pixie App
   */
  async init(containerElement) {
    try {
      this.app = new Application();
      
      await this.app.init({
        antialias: this.config.antialias,
        backgroundColor: this.config.backgroundColor,
        resolution: this.config.resolution,
        autoDensity: this.config.autoDensity,
        width: this.config.width,
        height: this.config.height
      });
      
      // Append Canvas zu Container
      containerElement.appendChild(this.app.canvas);
      
      // Main Container für alle Objekte
      this.container = new Container();
      this.app.stage.addChild(this.container);
      
      // Auto-Resize
      if (this.config.autoResize) {
        window.addEventListener('resize', () => this.resize());
        this.resize();
      }
      
      this.log('✅ Pixie Renderer initialized');
      return true;
    } catch (err) {
      this.error('Failed to initialize Pixie:', err);
      return false;
    }
  }
  
  /**
   * Resize Canvas
   */
  resize() {
    if (!this.app) return;
    
    const parent = this.app.canvas.parentElement;
    if (!parent) return;
    
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
  
  /**
   * Rendere einen Node (Bubble) mit Bild, Text, Icons
   */
  async renderNode(id, options = {}) {
    const {
      x = 0,
      y = 0,
      radius = 30,
      color = 0x00ff88,
      alpha = 1.0,
      borderWidth = 2,
      borderColor = 0xffffff,
      glowRadius = 0,
      glowColor = 0xffffff,
      glowAlpha = 0.3,
      image = null,        // Image URL
      icon = null,         // Emoji icon
      label = null,        // Text label
      badge = null,        // Badge object { text, color, bgColor }
      gradient = null      // Gradient { inner, outer }
    } = options;
    
    // Erstelle oder hole Node Container
    let nodeContainer = this.nodes.get(id);
    if (!nodeContainer) {
      nodeContainer = new Container();
      this.nodes.set(id, nodeContainer);
      this.container.addChild(nodeContainer);
    }
    
    // Clear children
    nodeContainer.removeChildren();
    
    // Position setzen
    nodeContainer.position.set(x, y);
    
    // 1. Glow effect (optional)
    if (glowRadius > 0) {
      const glow = new Graphics();
      glow.circle(0, 0, radius + glowRadius);
      glow.fill({ color: glowColor, alpha: glowAlpha });
      nodeContainer.addChild(glow);
    }
    
    // 2. Main bubble
    const bubble = new Graphics();
    
    // Gradient oder einfache Farbe
    if (gradient) {
      // Radial gradient simulation mit mehreren Kreisen
      const steps = 5;
      for (let i = steps; i > 0; i--) {
        const r = radius * (i / steps);
        const t = i / steps;
        const gradColor = this.interpolateColor(gradient.inner, gradient.outer, 1 - t);
        bubble.circle(0, 0, r);
        bubble.fill({ color: gradColor, alpha: alpha });
      }
    } else {
      bubble.circle(0, 0, radius);
      bubble.fill({ color, alpha });
    }
    
    // Border
    if (borderWidth > 0) {
      bubble.circle(0, 0, radius);
      bubble.stroke({ width: borderWidth, color: borderColor });
    }
    
    nodeContainer.addChild(bubble);
    
    // 3. Image (wenn vorhanden)
    if (image) {
      try {
        const imageContainer = await this.loadImageSprite(image, radius * 2);
        if (imageContainer) {
          // imageContainer is already positioned at (0,0) from loadImageSprite
          nodeContainer.addChild(imageContainer);
        }
      } catch (err) {
        this.error('Failed to load image:', image, err);
      }
    }
    
    // 4. Icon (Emoji als Text)
    if (icon) {
      const iconText = new Text({
        text: icon,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: radius * 0.8,
          fill: 0xffffff,
          align: 'center'
        }
      });
      iconText.anchor.set(0.5, 0.6);
      iconText.position.set(0, -radius * 0.15);
      nodeContainer.addChild(iconText);
    }
    
    // 5. Label (Text unter Icon)
    if (label) {
      const labelText = new Text({
        text: label,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: Math.min(radius * 0.35, 14),
          fontWeight: 'bold',
          fill: 0xffffff,
          align: 'center',
          wordWrap: true,
          wordWrapWidth: radius * 1.6
        }
      });
      labelText.anchor.set(0.5, 0);
      labelText.position.set(0, radius * 0.25);
      nodeContainer.addChild(labelText);
    }
    
    // 6. Badge (Connection count, etc.)
    if (badge) {
      const badgeContainer = new Container();
      const badgeX = radius - 12;
      const badgeY = -radius + 12;
      badgeContainer.position.set(badgeX, badgeY);
      
      // Badge background
      const badgeBg = new Graphics();
      badgeBg.circle(0, 0, 12);
      badgeBg.fill({ color: badge.bgColor || 0xa855f7 });
      badgeBg.circle(0, 0, 12);
      badgeBg.stroke({ width: 2, color: 0x000000 });
      badgeContainer.addChild(badgeBg);
      
      // Badge text
      const badgeText = new Text({
        text: badge.text || '0',
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 11,
          fontWeight: 'bold',
          fill: 0xffffff,
          align: 'center'
        }
      });
      badgeText.anchor.set(0.5);
      badgeContainer.addChild(badgeText);
      
      nodeContainer.addChild(badgeContainer);
    }
    
    return nodeContainer;
  }
  
  /**
   * Load image as Pixi Sprite with caching
   */
  async loadImageSprite(url, size) {
    this.log('🖼️ Loading image:', url, 'size:', size);
    
    // Create container to hold sprite + mask
    const imageContainer = new Container();
    
    // Check cache
    if (this.imageCache.has(url)) {
      const texture = this.imageCache.get(url);
      const sprite = new Sprite(texture);
      
      // Center and scale sprite
      sprite.anchor.set(0.5);
      const scale = size / Math.max(texture.width, texture.height);
      sprite.scale.set(scale);
      
      // Create circular mask (must be added to container, not sprite)
      const mask = new Graphics();
      mask.circle(0, 0, size / 2);
      mask.fill({ color: 0xffffff });
      
      // Add mask to container first, then set it as mask
      imageContainer.addChild(mask);
      imageContainer.addChild(sprite);
      sprite.mask = mask;
      
      this.log('🖼️ ✅ Image loaded from cache:', url);
      return imageContainer;
    }
    
    // Load new texture
    try {
      this.log('🖼️ Loading new texture:', url);
      const texture = await Assets.load(url);
      this.imageCache.set(url, texture);
      
      const sprite = new Sprite(texture);
      
      // Center and scale sprite
      sprite.anchor.set(0.5);
      const scale = size / Math.max(texture.width, texture.height);
      sprite.scale.set(scale);
      
      // Create circular mask
      const mask = new Graphics();
      mask.circle(0, 0, size / 2);
      mask.fill({ color: 0xffffff });
      
      // Add mask to container first, then set it as mask
      imageContainer.addChild(mask);
      imageContainer.addChild(sprite);
      sprite.mask = mask;
      
      this.log('🖼️ ✅ Image loaded:', url, 'texture size:', texture.width, 'x', texture.height);
      return imageContainer;
    } catch (err) {
      this.error('🖼️ ❌ Failed to load texture:', url, err);
      return null;
    }
  }
  
  /**
   * Interpolate between two colors
   */
  interpolateColor(color1, color2, t) {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;
    
    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return (r << 16) | (g << 8) | b;
  }
  
  /**
   * Rendere eine Connection (Linie zwischen Nodes) mit Label
   */
  renderConnection(id, options = {}) {
    const {
      from = { x: 0, y: 0 },
      to = { x: 100, y: 100 },
      width = 2,
      color = 0x00ff88,
      alpha = 0.5,
      label = null  // Optional: Label text (z.B. "23%")
    } = options;
    
    // Erstelle oder hole Connection Container
    let connContainer = this.connections.get(id);
    if (!connContainer) {
      connContainer = new Container();
      this.connections.set(id, connContainer);
      // Connections HINTER Nodes rendern
      this.container.addChildAt(connContainer, 0);
    }
    
    // Clear children
    connContainer.removeChildren();
    
    // Line
    const line = new Graphics();
    line.moveTo(from.x, from.y);
    line.lineTo(to.x, to.y);
    line.stroke({ width, color, alpha });
    connContainer.addChild(line);
    
    // Label (optional)
    if (label) {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      
      // Background
      const labelBg = new Graphics();
      const padding = 6;
      const textWidth = label.length * 7; // Approximate
      labelBg.rect(
        midX - textWidth / 2 - padding,
        midY - 8,
        textWidth + padding * 2,
        16
      );
      labelBg.fill({ color: 0x000000, alpha: 0.9 });
      connContainer.addChild(labelBg);
      
      // Text
      const labelText = new Text({
        text: label,
        style: {
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: 'bold',
          fill: color,
          align: 'center'
        }
      });
      labelText.anchor.set(0.5);
      labelText.position.set(midX, midY);
      connContainer.addChild(labelText);
    }
    
    return connContainer;
  }
  
  /**
   * Rendere ein Particle (Flow auf Connection)
   */
  renderParticle(id, options = {}) {
    const {
      x = 0,
      y = 0,
      radius = 4,
      color = 0x00ff88,
      alpha = 1.0
    } = options;
    
    // Erstelle oder hole Particle
    let particle = this.particles.get(id);
    if (!particle) {
      particle = new Graphics();
      this.particles.set(id, particle);
      this.container.addChild(particle);
    }
    
    // Clear & Redraw
    particle.clear();
    particle.circle(x, y, radius);
    particle.fill({ color, alpha });
    
    return particle;
  }
  
  /**
   * Update Node Position
   */
  updateNodePosition(id, x, y) {
    const node = this.nodes.get(id);
    if (node) {
      node.position.set(x, y);
    }
  }
  
  /**
   * Update Node Properties (radius, color, glow, etc.)
   */
  updateNode(id, options = {}) {
    const container = this.nodes.get(id);
    if (!container) {
      console.warn(`[PixieRenderer] updateNode: Node "${id}" not found`);
      return false;
    }
    
    // Update position if provided
    if (options.x !== undefined && options.y !== undefined) {
      container.position.set(options.x, options.y);
    }
    
    // Update radius by scaling
    if (options.radius !== undefined) {
      const currentRadius = container._originalRadius || 40;
      const scale = options.radius / currentRadius;
      container.scale.set(scale, scale);
    }
    
    // Update glow if we have a glow child
    const glowChild = container.children.find(c => c._isGlow);
    if (glowChild) {
      if (options.glowRadius !== undefined) {
        glowChild.visible = options.glowRadius > 0;
        if (options.glowRadius > 0) {
          glowChild.scale.set(options.glowRadius / 20);
        }
      }
      if (options.glowAlpha !== undefined) {
        glowChild.alpha = options.glowAlpha;
      }
    }
    
    return true;
  }
  
  /**
   * Remove Node
   */
  removeNode(id) {
    const node = this.nodes.get(id);
    if (node) {
      this.container.removeChild(node);
      node.destroy();
      this.nodes.delete(id);
    }
  }
  
  /**
   * Remove Connection
   */
  removeConnection(id) {
    const connection = this.connections.get(id);
    if (connection) {
      this.container.removeChild(connection);
      connection.destroy();
      this.connections.delete(id);
    }
  }
  
  /**
   * Remove Particle
   */
  removeParticle(id) {
    const particle = this.particles.get(id);
    if (particle) {
      this.container.removeChild(particle);
      particle.destroy();
      this.particles.delete(id);
    }
  }
  
  /**
   * Enable interactive events on a node (NEW - BubbleView v2)
   */
  enableNodeInteraction(id, callbacks = {}) {
    const container = this.nodes.get(id);
    if (!container) {
      console.warn(`[PixieRenderer] Node ${id} not found for interaction`);
      return false;
    }
    
    // Make interactive
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    // Attach event listeners
    if (callbacks.onClick) {
      container.on('pointerdown', (event) => {
        callbacks.onClick(id, event);
      });
    }
    
    if (callbacks.onHover) {
      container.on('pointerover', (event) => {
        callbacks.onHover(id, true, event);
      });
      container.on('pointerout', (event) => {
        callbacks.onHover(id, false, event);
      });
    }
    
    if (callbacks.onDrag) {
      let dragData = null;
      
      container.on('pointerdown', (event) => {
        dragData = {
          startX: event.global.x,
          startY: event.global.y,
          nodeX: container.x,
          nodeY: container.y
        };
        callbacks.onDrag(id, 'start', dragData, event);
      });
      
      container.on('pointermove', (event) => {
        if (dragData) {
          const dx = event.global.x - dragData.startX;
          const dy = event.global.y - dragData.startY;
          container.x = dragData.nodeX + dx;
          container.y = dragData.nodeY + dy;
          callbacks.onDrag(id, 'move', { x: container.x, y: container.y }, event);
        }
      });
      
      container.on('pointerup', (event) => {
        if (dragData) {
          callbacks.onDrag(id, 'end', { x: container.x, y: container.y }, event);
          dragData = null;
        }
      });
      
      container.on('pointerupoutside', (event) => {
        if (dragData) {
          callbacks.onDrag(id, 'end', { x: container.x, y: container.y }, event);
          dragData = null;
        }
      });
    }
    
    return true;
  }
  
  /**
   * Get all node positions (for physics) (NEW - BubbleView v2)
   */
  getAllNodePositions() {
    const positions = new Map();
    
    this.nodes.forEach((container, id) => {
      positions.set(id, {
        x: container.x,
        y: container.y
      });
    });
    
    return positions;
  }
  
  /**
   * Batch update node positions (performance!) (NEW - BubbleView v2)
   */
  batchUpdatePositions(updates) {
    updates.forEach((position, id) => {
      const container = this.nodes.get(id);
      if (container) {
        container.x = position.x;
        container.y = position.y;
      }
    });
  }
  
  /**
   * Clear alles
   */
  clear() {
    // Remove all nodes
    this.nodes.forEach((node, id) => this.removeNode(id));
    
    // Remove all connections
    this.connections.forEach((connection, id) => this.removeConnection(id));
    
    // Remove all particles
    this.particles.forEach((particle, id) => this.removeParticle(id));
  }
  
  /**
   * Destroy Renderer
   */
  destroy() {
    this.clear();
    
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
    
    this.log('Pixie Renderer destroyed');
  }
  
  log(...args) {
    console.log('[Pixie Renderer]', ...args);
  }
  
  error(...args) {
    console.error('[Pixie Renderer]', ...args);
  }
}
