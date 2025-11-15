/**
 * 🎨 PIXIE RENDERER
 * 
 * Verwendet Pixi.js für performante Node-Darstellung
 * Rendert Bubbles, Connections und Particles (für BubbleView - Phase 11+)
 * 
 * MVP: Wird noch nicht genutzt, aber ist bereit für BubbleView!
 */

import { Application, Graphics, Container } from 'pixi.js';

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
    this.nodes = new Map();  // id → PIXI.Graphics
    this.connections = new Map();  // id → PIXI.Graphics
    this.particles = new Map();  // id → PIXI.Graphics
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
   * Rendere einen Node (Bubble)
   */
  renderNode(id, options = {}) {
    const {
      x = 0,
      y = 0,
      radius = 30,
      color = 0x00ff88,
      alpha = 1.0,
      borderWidth = 2,
      borderColor = 0xffffff
    } = options;
    
    // Erstelle oder hole Node
    let node = this.nodes.get(id);
    if (!node) {
      node = new Graphics();
      this.nodes.set(id, node);
      this.container.addChild(node);
    }
    
    // Clear & Redraw
    node.clear();
    
    // Border
    if (borderWidth > 0) {
      node.circle(x, y, radius);
      node.stroke({ width: borderWidth, color: borderColor });
    }
    
    // Fill
    node.circle(x, y, radius);
    node.fill({ color, alpha });
    
    return node;
  }
  
  /**
   * Rendere eine Connection (Linie zwischen Nodes)
   */
  renderConnection(id, options = {}) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 100,
      y2 = 100,
      width = 2,
      color = 0x00ff88,
      alpha = 0.5
    } = options;
    
    // Erstelle oder hole Connection
    let connection = this.connections.get(id);
    if (!connection) {
      connection = new Graphics();
      this.connections.set(id, connection);
      this.container.addChild(connection);
    }
    
    // Clear & Redraw
    connection.clear();
    connection.moveTo(x1, y1);
    connection.lineTo(x2, y2);
    connection.stroke({ width, color, alpha });
    
    return connection;
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
