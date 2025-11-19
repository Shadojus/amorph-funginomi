/**
 * ⚡ REACTOR OBSERVER
 * 
 * Watches 'reactor:*' events und verwaltet Reactor State
 * 
 * EVENTS (currently published by system):
 * - reactor:enabled - Reactor wurde aktiviert
 * - reactor:disabled - Reactor wurde deaktiviert
 * 
 * EVENTS (not yet implemented):
 * - reactor:registered - Neuer Reactor registriert
 * - reactor:triggered - Reactor wurde ausgelöst
 * - reactor:completed - Reactor Execution abgeschlossen
 * - reactor:error - Fehler während Execution
 * 
 * STATE:
 * - reactors: Map<name, reactorData>
 * - executions: Array<executionLog>
 * - stats: { total, enabled, disabled, errors }
 */

import { BaseObserver } from './BaseObserver.js';

export class ReactorObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'reactor:',
      groupName: 'reactor-observer',
      consumerName: `reactor-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 20
    });
    
    this.reactors = new Map();
    this.executions = [];
    this.stats = {
      total: 0,
      triggers: 0,
      errors: 0
    };
  }
  
  async onStart() {
    this.log('⚡ ReactorObserver started - watching reactor:* events');
  }
  
  async onStop() {
    this.log('⚡ ReactorObserver stopped');
    this.reactors.clear();
    this.executions = [];
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'reactor:enabled':
        this.handleEnabled(data, meta);
        break;
        
      case 'reactor:disabled':
        this.handleDisabled(data, meta);
        break;
        
      case 'reactor:registered':
        this.handleRegistered(data, meta);
        break;
        
      case 'reactor:triggered':
        this.handleTriggered(data, meta);
        break;
        
      case 'reactor:completed':
        this.handleCompleted(data, meta);
        break;
        
      case 'reactor:error':
        this.handleError(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleEnabled(data, meta) {
    const { name, config, morphs } = data;
    
    if (!this.reactors.has(name)) {
      this.reactors.set(name, {
        name,
        enabledAt: meta.timestamp,
        triggerCount: 0,
        errorCount: 0
      });
      this.stats.total++;
    }
    
    const reactor = this.reactors.get(name);
    reactor.enabled = true;
    reactor.lastEnabled = meta.timestamp;
    reactor.config = config;
    
    this.stats.enabled = (this.stats.enabled || 0) + 1;
    this.log(`⚡ Reactor enabled: ${name} (${morphs} morphs affected)`);
  }
  
  handleDisabled(data, meta) {
    const { name, morphs } = data;
    
    if (this.reactors.has(name)) {
      const reactor = this.reactors.get(name);
      reactor.enabled = false;
      reactor.lastDisabled = meta.timestamp;
      
      this.stats.disabled = (this.stats.disabled || 0) + 1;
      this.log(`❌ Reactor disabled: ${name} (${morphs} morphs affected)`);
    }
  }
  
  handleRegistered(data, meta) {
    const { name, handler } = data;
    
    this.reactors.set(name, {
      name,
      registeredAt: meta.timestamp,
      triggerCount: 0,
      errorCount: 0
    });
    
    this.stats.total++;
    this.log(`✅ Reactor registered: ${name}`);
  }
  
  handleTriggered(data, meta) {
    const { name, eventName } = data;
    
    if (this.reactors.has(name)) {
      const reactor = this.reactors.get(name);
      reactor.triggerCount++;
      reactor.lastTriggered = meta.timestamp;
    }
    
    this.stats.triggers++;
    this.log(`⚡ Reactor triggered: ${name} (event: ${eventName})`);
  }
  
  handleCompleted(data, meta) {
    const { name, duration } = data;
    
    this.executions.push({
      name,
      timestamp: meta.timestamp,
      duration,
      success: true
    });
    
    // Keep only last 100 executions
    if (this.executions.length > 100) {
      this.executions.shift();
    }
    
    this.log(`✅ Reactor completed: ${name} (${duration}ms)`);
  }
  
  handleError(data, meta) {
    const { name, error } = data;
    
    if (this.reactors.has(name)) {
      const reactor = this.reactors.get(name);
      reactor.errorCount++;
    }
    
    this.stats.errors++;
    this.error(`❌ Reactor error: ${name}`, error);
    
    this.executions.push({
      name,
      timestamp: meta.timestamp,
      success: false,
      error
    });
    
    if (this.executions.length > 100) {
      this.executions.shift();
    }
  }
  
  getReactor(name) {
    return this.reactors.get(name);
  }
  
  getAllReactors() {
    return Array.from(this.reactors.values());
  }
  
  getStats() {
    return { ...this.stats };
  }
  
  getRecentExecutions(limit = 10) {
    return this.executions.slice(-limit);
  }
}
