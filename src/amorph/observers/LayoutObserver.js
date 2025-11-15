/**
 * 📄 LAYOUT OBSERVER
 * 
 * Watches 'layout:*' events und verwaltet Layout State
 * 
 * EVENTS:
 * - layout:rendered - Layout wurde gerendert
 * - layout:viewport-changed - Viewport Size geändert
 * - layout:scroll - Scroll Event
 * - layout:resize - Window Resize
 * 
 * STATE:
 * - viewport: { width, height }
 * - scrollPosition: { x, y }
 * - layoutsRendered: Array
 */

import { BaseObserver } from './BaseObserver.js';

export class LayoutObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'layout:',
      groupName: 'layout-observer',
      consumerName: `layout-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 10
    });
    
    this.viewport = { width: 0, height: 0 };
    this.scrollPosition = { x: 0, y: 0 };
    this.layoutsRendered = [];
  }
  
  async onStart() {
    this.log('📄 LayoutObserver started - watching layout:* events');
  }
  
  async onStop() {
    this.log('📄 LayoutObserver stopped');
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'layout:rendered':
        this.handleRendered(data, meta);
        break;
        
      case 'layout:viewport-changed':
        this.handleViewportChanged(data, meta);
        break;
        
      case 'layout:scroll':
        this.handleScroll(data, meta);
        break;
        
      case 'layout:resize':
        this.handleResize(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleRendered(data, meta) {
    const { layoutName, duration } = data;
    
    this.layoutsRendered.push({
      layoutName,
      duration,
      timestamp: meta.timestamp
    });
    
    // Keep only last 20
    if (this.layoutsRendered.length > 20) {
      this.layoutsRendered.shift();
    }
    
    this.log(`📄 Layout rendered: ${layoutName} (${duration}ms)`);
  }
  
  handleViewportChanged(data, meta) {
    const { width, height } = data;
    
    this.viewport = { width, height };
    this.log(`📐 Viewport changed: ${width}x${height}`);
  }
  
  handleScroll(data, meta) {
    const { x, y } = data;
    
    this.scrollPosition = { x, y };
    // Don't log every scroll (too noisy)
  }
  
  handleResize(data, meta) {
    const { width, height } = data;
    
    this.viewport = { width, height };
    this.log(`📏 Window resized: ${width}x${height}`);
  }
  
  getViewport() {
    return { ...this.viewport };
  }
  
  getScrollPosition() {
    return { ...this.scrollPosition };
  }
  
  getLayoutHistory(limit = 10) {
    return this.layoutsRendered.slice(-limit);
  }
}
