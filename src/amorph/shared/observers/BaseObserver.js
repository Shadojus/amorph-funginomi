/**
 * 👁️ BASE OBSERVER
 * 
 * Abstract Base Class für alle AMORPH Observers
 * 
 * KONZEPT:
 * - Jeder Observer watcht den Redis Stream
 * - Filtert Events nach Prefix (z.B. 'morph:*')
 * - Verarbeitet Events und aktualisiert State
 * - Läuft in eigenem Loop (non-blocking)
 * 
 * OBSERVERS:
 * - MorphObserver: morph:*
 * - ReactorObserver: reactor:*
 * - HostObserver: host:*
 * - GlobalObserver: global:*
 * - ArchObserver: arch:*
 * - LayoutObserver: layout:*
 */

export class BaseObserver {
  constructor(eventBridge, config = {}) {
    this.eventBridge = eventBridge;
    
    this.config = {
      prefix: config.prefix || '', // Event Prefix Filter (z.B. 'morph:')
      groupName: config.groupName || 'observer', // Consumer Group Name
      consumerName: config.consumerName || `consumer-${Date.now()}`, // Unique Consumer Name
      pollInterval: config.pollInterval || 100, // Polling Interval in ms
      batchSize: config.batchSize || 10, // Events pro Read
      enableLogging: config.enableLogging !== false
    };
    
    this.running = false;
    this.pollTimer = null;
    this.state = new Map(); // Observer-specific state
  }
  
  /**
   * Start Observer
   */
  async start() {
    if (this.running) {
      this.warn('Observer already running');
      return;
    }
    
    // Create Consumer Group
    const created = await this.eventBridge.createConsumerGroup(
      this.config.groupName,
      '$' // Start from now (nicht alte Events)
    );
    
    if (!created) {
      this.error('Failed to create consumer group');
      return;
    }
    
    this.running = true;
    this.log(`✅ Observer started: ${this.config.groupName}`);
    
    // Initialize hook
    await this.onStart();
    
    // Start polling loop
    this.poll();
  }
  
  /**
   * Stop Observer
   */
  async stop() {
    this.running = false;
    
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    
    // Cleanup hook
    await this.onStop();
    
    this.log(`⏹️ Observer stopped: ${this.config.groupName}`);
  }
  
  /**
   * Polling Loop (non-blocking)
   */
  async poll() {
    if (!this.running) return;
    
    try {
      // Read from stream
      const entries = await this.eventBridge.streamRead(
        this.config.groupName,
        this.config.consumerName,
        {
          count: this.config.batchSize,
          block: 0 // Non-blocking
        }
      );
      
      // Process entries
      for (const entry of entries) {
        // Filter by prefix
        if (this.config.prefix && !entry.event.startsWith(this.config.prefix)) {
          // Acknowledge aber nicht verarbeiten
          await this.eventBridge.streamAck(this.config.groupName, entry.id);
          continue;
        }
        
        // Handle event
        try {
          await this.handle(entry.event, entry.data, entry);
          
          // Acknowledge nach erfolgreichem Processing
          await this.eventBridge.streamAck(this.config.groupName, entry.id);
        } catch (err) {
          this.error(`Error handling event "${entry.event}":`, err);
          // TODO: Dead Letter Queue für failed events?
        }
      }
      
    } catch (err) {
      this.error('Error in poll loop:', err);
    }
    
    // Schedule next poll
    this.pollTimer = setTimeout(() => this.poll(), this.config.pollInterval);
  }
  
  /**
   * Handle Event (ABSTRACT - muss von Child Class überschrieben werden)
   * 
   * @param {string} eventName - Event Name
   * @param {object} data - Event Data
   * @param {object} meta - Meta Info (id, timestamp, source)
   */
  async handle(eventName, data, meta) {
    throw new Error('handle() must be implemented by child class');
  }
  
  /**
   * Lifecycle Hooks (optional override)
   */
  async onStart() {
    // Override in child class
  }
  
  async onStop() {
    // Override in child class
  }
  
  /**
   * State Management Helpers
   */
  setState(key, value) {
    this.state.set(key, value);
  }
  
  getState(key) {
    return this.state.get(key);
  }
  
  hasState(key) {
    return this.state.has(key);
  }
  
  deleteState(key) {
    this.state.delete(key);
  }
  
  clearState() {
    this.state.clear();
  }
  
  /**
   * Logging
   */
  log(...args) {
    if (this.config.enableLogging) {
      console.log(`[${this.config.groupName}]`, ...args);
    }
  }
  
  warn(...args) {
    if (this.config.enableLogging) {
      console.warn(`[${this.config.groupName}]`, ...args);
    }
  }
  
  error(...args) {
    console.error(`[${this.config.groupName}]`, ...args);
  }
}
