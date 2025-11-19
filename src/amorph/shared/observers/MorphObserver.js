/**
 * 🧬 MORPH OBSERVER
 * 
 * Watches 'morph:*' events und verwaltet Morph State
 * 
 * EVENTS (currently published by system):
 * - morph:created - Neuer Morph registriert
 * - morph:destroyed - Morph entfernt
 * 
 * EVENTS (not yet implemented):
 * - morph:mounted - Morph in DOM gemountet
 * - morph:updated - Morph State updated
 * - morph:connected - Morph mit anderem Morph verbunden
 * - morph:disconnected - Verbindung getrennt
 * 
 * STATE:
 * - morphs: Map<morphId, morphData>
 * - connections: Map<connectionId, {from, to}>
 * - stats: { total, created, destroyed }
 */

import { BaseObserver } from './BaseObserver.js';

export class MorphObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'morph:',
      groupName: 'morph-observer',
      consumerName: `morph-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 20
    });
    
    // Morph-specific state
    this.morphs = new Map();
    this.connections = new Map();
    this.stats = {
      total: 0,
      created: 0,
      destroyed: 0
    };
  }
  
  async onStart() {
    this.log('🧬 MorphObserver started - watching morph:* events');
  }
  
  async onStop() {
    this.log('🧬 MorphObserver stopped');
    this.morphs.clear();
    this.connections.clear();
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'morph:created':
        this.handleCreated(data, meta);
        break;
        
      case 'morph:mounted':
        this.handleMounted(data, meta);
        break;
        
      case 'morph:updated':
        this.handleUpdated(data, meta);
        break;
        
      case 'morph:destroyed':
        this.handleDestroyed(data, meta);
        break;
        
      case 'morph:connected':
        this.handleConnected(data, meta);
        break;
        
      case 'morph:disconnected':
        this.handleDisconnected(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleCreated(data, meta) {
    const { id, type, element } = data;
    
    this.morphs.set(id, {
      id,
      type,
      element,
      createdAt: meta.timestamp
    });
    
    this.stats.total++;
    this.stats.created++;
    this.log(`✅ Morph created: ${id} (${type})`);
  }
  
  handleMounted(data, meta) {
    const { id } = data;
    
    if (this.morphs.has(id)) {
      const morph = this.morphs.get(id);
      morph.mounted = true;
      morph.mountedAt = meta.timestamp;
      
      this.stats.mounted++;
      this.log(`📌 Morph mounted: ${id}`);
    }
  }
  
  handleUpdated(data, meta) {
    const { id, changes } = data;
    
    if (this.morphs.has(id)) {
      const morph = this.morphs.get(id);
      morph.updateCount++;
      morph.lastUpdate = meta.timestamp;
      
      this.stats.updated++;
      this.log(`🔄 Morph updated: ${id}`, changes);
    }
  }
  
  handleDestroyed(data, meta) {
    const { id } = data;
    
    if (this.morphs.has(id)) {
      this.morphs.delete(id);
      
      this.stats.destroyed++;
      this.stats.total--;
      this.log(`❌ Morph destroyed: ${id}`);
    }
  }
  
  handleConnected(data, meta) {
    const { from, to, connectionId } = data;
    
    this.connections.set(connectionId, {
      from,
      to,
      createdAt: meta.timestamp
    });
    
    this.log(`🔗 Morphs connected: ${from} → ${to}`);
  }
  
  handleDisconnected(data, meta) {
    const { connectionId } = data;
    
    if (this.connections.has(connectionId)) {
      this.connections.delete(connectionId);
      this.log(`🔓 Connection removed: ${connectionId}`);
    }
  }
  
  /**
   * Public API für State Queries
   */
  getMorph(id) {
    return this.morphs.get(id);
  }
  
  getAllMorphs() {
    return Array.from(this.morphs.values());
  }
  
  getStats() {
    return { ...this.stats };
  }
  
  getConnections() {
    return Array.from(this.connections.values());
  }
}
