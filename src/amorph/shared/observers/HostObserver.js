/**
 * 🏠 HOST OBSERVER
 * 
 * Watches 'host:*' events und verwaltet Host State
 * 
 * EVENTS:
 * - host:created - Neuer Host erstellt
 * - host:data-loaded - Host hat Data geladen
 * - host:morphs-generated - Host hat Morphs generiert
 * - host:destroyed - Host entfernt
 * 
 * STATE:
 * - hosts: Map<hostId, hostData>
 * - stats: { total, active, destroyed }
 */

import { BaseObserver } from './BaseObserver.js';

export class HostObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'host:',
      groupName: 'host-observer',
      consumerName: `host-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 10
    });
    
    this.hosts = new Map();
    this.stats = {
      total: 0,
      active: 0,
      destroyed: 0
    };
  }
  
  async onStart() {
    this.log('🏠 HostObserver started - watching host:* events');
  }
  
  async onStop() {
    this.log('🏠 HostObserver stopped');
    this.hosts.clear();
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'host:created':
        this.handleCreated(data, meta);
        break;
        
      case 'host:data-loaded':
        this.handleDataLoaded(data, meta);
        break;
        
      case 'host:morphs-generated':
        this.handleMorphsGenerated(data, meta);
        break;
        
      case 'host:destroyed':
        this.handleDestroyed(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleCreated(data, meta) {
    const { id, type } = data;
    
    this.hosts.set(id, {
      id,
      type,
      createdAt: meta.timestamp,
      dataLoaded: false,
      morphCount: 0
    });
    
    this.stats.total++;
    this.stats.active++;
    this.log(`✅ Host created: ${id} (${type})`);
  }
  
  handleDataLoaded(data, meta) {
    const { id, dataSize } = data;
    
    if (this.hosts.has(id)) {
      const host = this.hosts.get(id);
      host.dataLoaded = true;
      host.dataSize = dataSize;
      host.dataLoadedAt = meta.timestamp;
    }
    
    this.log(`📦 Host data loaded: ${id} (${dataSize} items)`);
  }
  
  handleMorphsGenerated(data, meta) {
    const { id, morphCount } = data;
    
    if (this.hosts.has(id)) {
      const host = this.hosts.get(id);
      host.morphCount = morphCount;
      host.morphsGeneratedAt = meta.timestamp;
    }
    
    this.log(`🧬 Host morphs generated: ${id} (${morphCount} morphs)`);
  }
  
  handleDestroyed(data, meta) {
    const { id } = data;
    
    if (this.hosts.has(id)) {
      this.hosts.delete(id);
      
      this.stats.destroyed++;
      this.stats.active--;
      this.log(`❌ Host destroyed: ${id}`);
    }
  }
  
  getHost(id) {
    return this.hosts.get(id);
  }
  
  getAllHosts() {
    return Array.from(this.hosts.values());
  }
  
  getStats() {
    return { ...this.stats };
  }
}
