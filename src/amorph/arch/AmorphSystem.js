/**
 * 🎯 AMORPH CORE SYSTEM
 * 
 * Das Gehirn des AMORPH Systems!
 * 
 * Zentrale Registry die ALLES verwaltet:
 * - Reactor-Management (register, enable, disable, toggle) - PLUG & PLAY! 🔌
 * - Morph-Discovery & Registration
 * - Event-System (lokal + Redis)
 * - Multi-Perspektiven State (bis zu 4)
 * - Search State mit Weighted Scoring
 * - Pixie Renderer Integration (für BubbleView)
 * 
 * WICHTIG: Das ist ein Singleton - global als `window.amorph` verfügbar!
 */

import { AmorphConfig } from './amorph.config.js';
import { ReactorsConfig } from './reactors.config.js';
import { MorphsConfig } from './morphs.config.js';
import { RedisEventBridge } from './RedisEventBridge.js';
import { PerformanceObserver } from '../observers/PerformanceObserver.js';

// Import all Stream Observers
import { MorphObserver } from '../observers/MorphObserver.js';
import { ReactorObserver } from '../observers/ReactorObserver.js';
import { HostObserver } from '../observers/HostObserver.js';
import { GlobalObserver } from '../observers/GlobalObserver.js';
import { ArchObserver } from '../observers/ArchObserver.js';
import { LayoutObserver } from '../observers/LayoutObserver.js';

export class AmorphSystem {
  constructor(config = {}) {
    // Merge Configs
    this.config = { ...AmorphConfig, ...config };
    
    // Registries
    this.reactors = new Map();           // name → ReactorClass
    this.morphs = new Set();             // Set aller registrierten Morphs (DOM elements)
    
    // Event Listeners (lokal, für sync handling) - MUSS VOR PerformanceObserver kommen!
    this.listeners = new Map();
    
    // Redis Event Bridge (optional)
    this.eventBridge = new RedisEventBridge(this.config.redis);
    
    // Stream Observers (NEW - Redis Streams Pattern)
    this.observers = {
      morph: null,
      reactor: null,
      host: null,
      global: null,
      arch: null,
      layout: null
    };
    
    // State
    this.state = {
      initTime: Date.now(),
      activePerspectives: [...this.config.multiPerspective.defaultPerspectives],
      selectedTags: [],
      searchQuery: '',
      searchScores: new Map(),      // morph element → score
      enabledReactors: new Map()   // name → reactor instance
    };
    
    // Performance Observer (optional) - NACH listeners initialisieren!
    this.performanceObserver = this.config.system.debug 
      ? new PerformanceObserver(this)
      : null;
    
    this.log('🔮 AmorphSystem initialized', this.config.system);
    
    // Auto-connect zu Redis (non-blocking) - nur im Backend
    if (typeof window === 'undefined') {
      this.initEventBridge();
    } else {
      this.log('🌐 Running in browser - Redis disabled');
    }
    
    // Emit arch:system-initialized event (after connection)
    setTimeout(() => {
      this.streamPublish('arch:system-initialized', {
        version: '1.0.0',
        config: this.config.system
      });
    }, 100);
  }
  
  /**
   * Initialisiere Redis Event Bridge (optional, non-blocking)
   */
  async initEventBridge() {
    try {
      await this.eventBridge.connect();
      
      // Subscribe zu wichtigen Events (Legacy Pub/Sub)
      this.eventBridge.on('reactor:enabled', (data) => {
        this.log('📥 Redis Event: reactor:enabled', data);
      });
      
      this.eventBridge.on('reactor:disabled', (data) => {
        this.log('📥 Redis Event: reactor:disabled', data);
      });
      
      this.eventBridge.on('perspectives:changed', (data) => {
        this.log('📥 Redis Event: perspectives:changed', data);
      });
      
      this.log('✅ Event Bridge initialized');
      
      // Start Stream Observers (NEW)
      await this.initStreamObservers();
    } catch (err) {
      this.warn('Event Bridge initialization failed (system works without Redis):', err);
    }
  }
  
  /**
   * Initialisiere alle Stream Observers (NEW)
   */
  async initStreamObservers() {
    if (!this.eventBridge.isConnected()) {
      this.warn('Cannot start observers - Redis not connected');
      return;
    }
    
    try {
      // Create all observers
      this.observers.morph = new MorphObserver(this.eventBridge);
      this.observers.reactor = new ReactorObserver(this.eventBridge);
      this.observers.host = new HostObserver(this.eventBridge);
      this.observers.global = new GlobalObserver(this.eventBridge);
      this.observers.arch = new ArchObserver(this.eventBridge);
      this.observers.layout = new LayoutObserver(this.eventBridge);
      
      // Start all observers
      await Promise.all([
        this.observers.morph.start(),
        this.observers.reactor.start(),
        this.observers.host.start(),
        this.observers.global.start(),
        this.observers.arch.start(),
        this.observers.layout.start()
      ]);
      
      this.log('✅ All Stream Observers started (6/6)');
      
      // Emit arch:system-ready event
      await this.streamPublish('arch:system-ready', {
        duration: Date.now() - this.state.initTime,
        observers: Object.keys(this.observers)
      });
    } catch (err) {
      this.error('Failed to initialize Stream Observers:', err);
    }
  }
  
  /**
   * Stop all Stream Observers
   */
  async stopStreamObservers() {
    const observerList = Object.values(this.observers).filter(o => o !== null);
    
    await Promise.all(
      observerList.map(observer => observer.stop())
    );
    
    this.log('⏹️ All Stream Observers stopped');
  }
  
  // ==========================================
  // REACTOR MANAGEMENT - PLUG & PLAY! 🔌
  // ==========================================
  
  /**
   * Registriere einen Reactor (Class wird übergeben!)
   */
  registerReactor(name, ReactorClass) {
    if (this.reactors.has(name)) {
      this.warn(`Reactor "${name}" already registered, overwriting...`);
    }
    
    // Speichere die Reactor-Klasse
    this.reactors.set(name, ReactorClass);
    this.log(`✅ Reactor registered: ${name}`);
    
    // Auto-enable wenn in defaultReactors
    const defaultConfig = this.config.defaultReactors[name];
    if (defaultConfig?.enabled) {
      this.enableReactor(name, defaultConfig);
    }
    
    return true;
  }
  
  /**
   * Aktiviere einen Reactor - PLUG & PLAY! 🔌
   */
  async enableReactor(name, config = {}) {
    const ReactorClass = this.reactors.get(name);
    
    if (!ReactorClass) {
      this.error(`Reactor "${name}" not found! Did you register it?`);
      return false;
    }
    
    // Check ob bereits enabled
    if (this.state.enabledReactors.has(name)) {
      this.warn(`Reactor "${name}" already enabled`);
      return false;
    }
    
    // Merge mit Default-Config aus reactors.config.js
    const reactorConfig = ReactorsConfig[name];
    const finalConfig = {
      ...reactorConfig?.defaultConfig,
      ...config
    };
    
    // Erstelle Instanz
    const reactorInstance = new ReactorClass(finalConfig);
    
    // Speichere Instanz
    this.state.enabledReactors.set(name, reactorInstance);
    
    // Hole alle Morphs die mit diesem Reactor kompatibel sind
    const morphTypes = reactorConfig?.morphTypes || ['*'];
    const morphs = this.getMorphsByType(morphTypes);
    
    // Apply reactor zu allen Morphs
    reactorInstance.apply(Array.from(morphs));
    
    this.log(`🔌 Reactor enabled: ${name} (${morphs.length} morphs affected)`);
    
    // Trigger event
    const eventData = { name, config: finalConfig, morphs: morphs.length };
    await this.streamPublish('reactor:enabled', eventData);
    
    return true;
  }
  
  /**
   * Deaktiviere einen Reactor
   */
  async disableReactor(name) {
    const reactorInstance = this.state.enabledReactors.get(name);
    
    if (!reactorInstance) {
      this.error(`Reactor "${name}" not enabled or not found!`);
      return false;
    }
    
    // Hole alle Morphs
    const morphs = this.getAllMorphs();
    
    // Cleanup reactor von allen Morphs
    reactorInstance.cleanup(Array.from(morphs));
    
    // Remove aus state
    this.state.enabledReactors.delete(name);
    
    this.log(`🔌 Reactor disabled: ${name} (${morphs.length} morphs cleaned)`);
    
    // Trigger event
    const eventData = { name, morphs: morphs.length };
    await this.streamPublish('reactor:disabled', eventData);
    
    return true;
  }
  
  /**
   * Toggle Reactor (enable wenn disabled, disable wenn enabled)
   */
  toggleReactor(name, config = {}) {
    if (this.state.enabledReactors.has(name)) {
      return this.disableReactor(name);
    } else {
      return this.enableReactor(name, config);
    }
  }
  
  /**
   * Ist Reactor aktiv?
   */
  isReactorActive(name) {
    return this.state.enabledReactors.has(name);
  }
  
  /**
   * Hole Reactor Instanz
   */
  getReactor(name) {
    return this.state.enabledReactors.get(name);
  }
  
  // ==========================================
  // MORPH MANAGEMENT
  // ==========================================
  
  /**
   * Registriere einen Morph
   * (wird automatisch aufgerufen wenn Morph rendered wird)
   */
  async registerMorph(element) {
    if (!element.dataset || !element.dataset.morph) {
      this.warn('Morph without data-morph attribute registered');
      return;
    }
    
    // Unique ID generieren wenn nicht vorhanden
    if (!element.dataset.morphId) {
      element.dataset.morphId = `morph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    this.morphs.add(element);
    this.log(`📦 Morph registered: ${element.dataset.morphId} (type: ${element.dataset.morphType || 'unknown'})`);
    
    // Apply alle aktiven Reactors zu diesem Morph
    this.state.enabledReactors.forEach((reactorInstance, reactorName) => {
      const reactorConfig = ReactorsConfig[reactorName];
      
      // Check ob Reactor auf diesen Morph-Type wirkt
      if (this.reactorSupportsType(reactorConfig?.morphTypes, element.dataset.morphType)) {
        try {
          reactorInstance.apply([element]);
        } catch (err) {
          this.error(`Failed to apply reactor "${reactorName}" to new morph:`, err);
        }
      }
    });
    
    // Emit event
    await this.streamPublish('morph:created', {
      id: element.id || element.dataset?.morphId || `morph-${Date.now()}`,
      type: element.dataset?.morphType || element.tagName,
      element: element.tagName
    });
  }
  
  /**
   * Deregistriere einen Morph
   */
  async unregisterMorph(element) {
    this.morphs.delete(element);
    this.log(`📦 Morph unregistered: ${element.dataset?.morphId}`);
    
    // Emit event
    await this.streamPublish('morph:destroyed', {
      id: element.id || element.dataset?.morphId || element.tagName
    });
  }
  
  /**
   * Hole alle Morphs (optional gefiltert)
   */
  getMorphs(filter = {}) {
    let morphs = Array.from(document.querySelectorAll('[data-morph]'));
    
    // Filter nach Type
    if (filter.type) {
      morphs = morphs.filter(m => m.dataset.morphType === filter.type);
    }
    
    // Filter nach Tags
    if (filter.tags && filter.tags.length > 0) {
      morphs = morphs.filter(morph => {
        const morphTags = (morph.dataset.tags || '').split(',').filter(Boolean);
        return filter.tags.some(tag => morphTags.includes(tag));
      });
    }
    
    // Filter nach Namen
    if (filter.name) {
      const query = filter.name.toLowerCase();
      morphs = morphs.filter(morph => {
        const name = (morph.dataset.name || '').toLowerCase();
        return name.includes(query);
      });
    }
    
    return morphs;
  }
  
  /**
   * Hole Morphs nach Typen (für Reactor-Kompatibilität)
   */
  getMorphsByType(types) {
    if (types.includes('*')) {
      return this.getAllMorphs();
    }
    
    return Array.from(document.querySelectorAll('[data-morph]')).filter(morph => {
      const morphType = morph.dataset.morphType || 'unknown';
      return types.includes(morphType);
    });
  }
  
  /**
   * Hole alle Morphs (ohne Filter)
   */
  getAllMorphs() {
    return Array.from(document.querySelectorAll('[data-morph]'));
  }
  
  /**
   * Check ob Reactor auf Morph-Type wirken soll
   */
  reactorSupportsType(reactorTypes, morphType) {
    if (!reactorTypes || reactorTypes.includes('*')) return true;
    return reactorTypes.includes(morphType);
  }
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  /**
   * Setze aktive Perspektiven (Multi-Select bis zu 4)
   */
  async setActivePerspectives(perspectives) {
    // Validierung
    if (perspectives.length > this.config.multiPerspective.maxSelection) {
      this.warn(`Too many perspectives selected (max: ${this.config.multiPerspective.maxSelection})`);
      perspectives = perspectives.slice(0, this.config.multiPerspective.maxSelection);
    }
    
    if (perspectives.length === 0 && !this.config.multiPerspective.allowEmpty) {
      this.warn('At least one perspective must be active');
      return false;
    }
    
    const oldPerspectives = [...this.state.activePerspectives];
    this.state.activePerspectives = perspectives;
    
    this.log(`🔄 Perspectives changed: ${perspectives.join(', ')}`);
    
    // Emit event
    const eventData = { 
      viewMode: perspectives[0], // Use first perspective as view mode
      perspectives 
    };
    await this.streamPublish('global:view-changed', eventData);
    
    return true;
  }
  
  /**
   * Hole aktive Perspektiven
   */
  getActivePerspectives() {
    return [...this.state.activePerspectives];
  }
  
  /**
   * Setze selektierte Tags (Multi-Select)
   */
  async setSelectedTags(tags) {
    const oldTags = [...this.state.selectedTags];
    this.state.selectedTags = tags;
    
    this.log(`🏷️ Tags changed: ${tags.join(', ')}`);
    
    // Emit event
    const eventData = { tags };
    await this.streamPublish('global:tags-changed', eventData);
    
    return true;
  }
  
  /**
   * Hole selektierte Tags
   */
  getSelectedTags() {
    return [...this.state.selectedTags];
  }
  
  /**
   * Setze Search Query
   */
  async setSearchQuery(query) {
    const oldQuery = this.state.searchQuery;
    this.state.searchQuery = query;
    
    this.log(`🔍 Search query changed: "${query}"`);
    
    // Emit event
    const eventData = { 
      query, 
      results: this.state.searchScores.size 
    };
    await this.streamPublish('global:search', eventData);
    
    return true;
  }
  
  /**
   * Hole Search Query
   */
  getSearchQuery() {
    return this.state.searchQuery;
  }
  
  // ==========================================
  // EVENT SYSTEM
  // ==========================================
  
  /**
   * Emit Event (lokal im Browser) - LEGACY
   * Für Redis Events, verwende eventBridge.publish()
   * 
   * DEPRECATED: Use streamPublish() for new code
   */
  emit(eventName, data) {
    const fullEventName = `amorph:${eventName}`;
    
    // CustomEvent dispatchen (lokal im Browser)
    if (typeof document !== 'undefined') {
      const event = new CustomEvent(fullEventName, {
        detail: data,
        bubbles: true,
        composed: true
      });
      document.dispatchEvent(event);
    }
    
    // Interne Listeners callen
    const listeners = this.listeners.get(eventName) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        this.error(`Error in event listener for "${eventName}":`, err);
      }
    });
    
    this.log(`📡 Local Event: ${fullEventName}`, data);
  }
  
  /**
   * Publish Event zu Redis Stream (NEW - Observer Pattern)
   * 
   * @param {string} eventName - Event Name (z.B. 'morph:created', 'reactor:enabled')
   * @param {object} data - Event Data
   * @returns {Promise<string|false>} Stream Entry ID oder false
   */
  async streamPublish(eventName, data) {
    if (!this.eventBridge.isConnected()) {
      // Fallback zu lokalem emit() (silent - Redis optional)
      // emit() expects event names WITHOUT 'amorph:' prefix (it adds it)
      const strippedEventName = eventName.replace(/^amorph:/, '');
      this.emit(strippedEventName, data);
      return false;
    }
    
    return await this.eventBridge.streamPublish(eventName, data);
  }
  
  /**
   * Subscribe zu Event
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    this.listeners.get(eventName).push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Unsubscribe von Event
   */
  off(eventName, callback) {
    const listeners = this.listeners.get(eventName);
    if (!listeners) return;
    
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
  
  // ==========================================
  // UTILITIES
  // ==========================================
  
  log(...args) {
    if (this.config.system.debug) {
      console.log('[AMORPH]', ...args);
    }
  }
  
  warn(...args) {
    if (this.config.system.debug) {
      console.warn('[AMORPH]', ...args);
    }
  }
  
  error(...args) {
    console.error('[AMORPH]', ...args);
  }
  
  /**
   * Get System Info (für DevTools & Debugging)
   */
  getSystemInfo() {
    return {
      version: this.config.system.version,
      mode: this.config.system.mode,
      registeredReactors: Array.from(this.reactors.keys()),
      enabledReactors: Array.from(this.state.enabledReactors.keys()),
      morphCount: this.morphs.size,
      activePerspectives: this.state.activePerspectives,
      selectedTags: this.state.selectedTags,
      searchQuery: this.state.searchQuery,
      redisConnected: this.eventBridge.isConnected(),
      observersRunning: Object.values(this.observers).filter(o => o?.running).length
    };
  }
  
  /**
   * Cleanup - Disconnect von Redis, destroy Pixie
   */
  async cleanup() {
    this.log('🧹 Cleaning up AmorphSystem...');
    
    // Stop all observers
    await this.stopStreamObservers();
    
    // Disconnect Redis
    await this.eventBridge.disconnect();
    
    // Clear all state
    this.morphs.clear();
    this.state.enabledReactors.clear();
    
    this.log('✅ Cleanup complete');
  }
}

// ==========================================
// SINGLETON INSTANCE - GLOBAL VERFÜGBAR! 🌍
// ==========================================

export const amorph = new AmorphSystem();

// Global verfügbar machen (für Console Debugging & Header)
if (typeof window !== 'undefined') {
  window.amorph = amorph;
  
  // Dev Mode: Zeige System Info beim Start
  if (amorph.config.system.debug) {
    console.log('🔮 AMORPH System Ready!', amorph.getSystemInfo());
  }
  
  // Listen to perspective-changed events from MorphHeader
  window.addEventListener('perspective-changed', (event) => {
    const perspectives = event.detail.perspectives || [];
    amorph.log('[AmorphSystem] Perspective changed:', perspectives);
    
    // Update PerspectiveReactor if enabled
    const perspectiveReactor = amorph.state.enabledReactors.get('perspective');
    if (perspectiveReactor) {
      amorph.log('[AmorphSystem] PerspectiveReactor found, updating...');
      
      // Map perspective names to full perspective objects
      const perspectiveObjects = perspectives.map(name => ({
        name,
        color: getPerspectiveColor(name)
      }));
      
      perspectiveReactor.updatePerspectives(perspectiveObjects);
      
      // Re-apply to all morphs
      const morphs = amorph.getAllMorphs();
      amorph.log('[AmorphSystem] Applying to', morphs.length, 'morphs');
      perspectiveReactor.apply(morphs);
    } else {
      amorph.warn('[AmorphSystem] PerspectiveReactor NOT enabled!');
      amorph.log('[AmorphSystem] Enabled reactors:', Array.from(amorph.state.enabledReactors.keys()));
    }
  });
}

/**
 * Helper: Get perspective color by name
 */
function getPerspectiveColor(name) {
  const colors = {
    'taxonomy': '#ef4444',
    'physicalCharacteristics': '#f97316',
    'ecologyAndHabitat': '#eab308',
    'culinaryAndNutritional': '#22c55e',
    'medicinalAndHealth': '#06b6d4',
    'cultivationAndProcessing': '#3b82f6',
    'safetyAndIdentification': '#8b5cf6',
    'chemicalAndProperties': '#ec4899',
    'culturalAndHistorical': '#d946ef',
    'commercialAndMarket': '#14b8a6',
    'environmentalAndConservation': '#10b981',
    'researchAndInnovation': '#0ea5e9'
  };
  return colors[name] || '#667eea';
}
