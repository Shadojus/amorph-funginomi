/**
 * 🌉 REDIS EVENT BRIDGE
 * 
 * Verbindet das AMORPH System mit Redis als Event Bus
 * 
 * ZWEI MODI:
 * 1. Pub/Sub: publish() + on() - Legacy Support
 * 2. Streams: streamPublish() + streamRead() - NEW Observer Pattern
 * 
 * WICHTIG: Redis ist optional! System funktioniert auch ohne.
 * Redis funktioniert NUR im Backend (Node.js), nicht im Browser!
 */

// Redis wird nur im Backend geladen
let createClient = null;

export class RedisEventBridge {
  constructor(config = {}) {
    this.config = {
      url: config.url || 'redis://localhost:6379',
      channel: config.channel || 'amorph:events',
      streamName: config.streamName || 'amorph:stream',
      streamMaxLen: config.streamMaxLen || 10000, // MAXLEN für Stream (NEW)
      reconnectDelay: config.reconnectDelay || 1000,
      maxRetries: config.maxRetries || 5,
      enableLogging: config.enableLogging || true
    };
    
    this.publisher = null;
    this.subscriber = null;
    this.streamClient = null; // Separate Client für Streams
    this.connected = false;
    this.retryCount = 0;
    this.listeners = new Map();
  }
  
  /**
   * Verbinde mit Redis
   */
  async connect() {
    // Check if we're in Browser
    if (typeof window !== 'undefined') {
      console.warn('[RedisEventBridge] Redis is not available in browser. Skipping.');
      return false;
    }
    
    // Dynamically import redis in Node.js environment only
    if (!createClient) {
      try {
        const redisModule = await import('redis');
        createClient = redisModule.createClient;
      } catch (error) {
        console.warn('[RedisEventBridge] Redis module not available:', error.message);
        return false;
      }
    }
    
    try {
      // Publisher Client (für Pub/Sub)
      this.publisher = createClient({ url: this.config.url });
      await this.publisher.connect();
      
      // Subscriber Client (für Pub/Sub)
      this.subscriber = createClient({ url: this.config.url });
      await this.subscriber.connect();
      
      // Stream Client (für Redis Streams)
      this.streamClient = createClient({ url: this.config.url });
      await this.streamClient.connect();
      
      // Subscribe zu Channel (Legacy Pub/Sub)
      await this.subscriber.subscribe(this.config.channel, (message) => {
        this.handleMessage(message);
      });
      
      this.connected = true;
      this.retryCount = 0;
      this.log('✅ Redis Event Bridge connected (Pub/Sub + Streams)');
      
      return true;
    } catch (err) {
      this.error('Failed to connect to Redis:', err);
      this.warn('⚠️ System works without Redis - local events only');
      
      // Auto-Reconnect (optional)
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        this.log(`Retrying connection (${this.retryCount}/${this.config.maxRetries})...`);
        setTimeout(() => this.connect(), this.config.reconnectDelay);
      }
      
      return false;
    }
  }
  
  /**
   * Disconnect von Redis
   */
  async disconnect() {
    try {
      if (this.subscriber) await this.subscriber.quit();
      if (this.publisher) await this.publisher.quit();
      if (this.streamClient) await this.streamClient.quit();
      
      this.connected = false;
      this.log('Redis Event Bridge disconnected');
    } catch (err) {
      this.error('Error disconnecting from Redis:', err);
    }
  }
  
  /**
   * Publish Event zu Redis
   */
  async publish(eventName, data) {
    if (!this.connected) {
      this.warn('Not connected to Redis, event not published:', eventName);
      return false;
    }
    
    try {
      const message = JSON.stringify({
        event: eventName,
        data,
        timestamp: Date.now(),
        source: 'amorph'
      });
      
      await this.publisher.publish(this.config.channel, message);
      this.log(`📤 Event published: ${eventName}`);
      
      return true;
    } catch (err) {
      this.error(`Failed to publish event "${eventName}":`, err);
      return false;
    }
  }
  
  /**
   * Handle eingehende Redis Messages
   */
  handleMessage(message) {
    try {
      const { event, data, timestamp, source } = JSON.parse(message);
      
      this.log(`📥 Event received: ${event}`, data);
      
      // Call alle Listeners für diesen Event
      const listeners = this.listeners.get(event) || [];
      listeners.forEach(callback => {
        try {
          callback(data, { timestamp, source });
        } catch (err) {
          this.error(`Error in listener for "${event}":`, err);
        }
      });
      
      // Call Wildcard Listeners
      const wildcardListeners = this.listeners.get('*') || [];
      wildcardListeners.forEach(callback => {
        try {
          callback({ event, data }, { timestamp, source });
        } catch (err) {
          this.error('Error in wildcard listener:', err);
        }
      });
      
    } catch (err) {
      this.error('Failed to parse Redis message:', err);
    }
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
   * Check ob connected
   */
  isConnected() {
    return this.connected;
  }
  
  // ==========================================
  // 🌊 REDIS STREAMS - NEW OBSERVER PATTERN
  // ==========================================
  
  /**
   * Publish Event zu Redis Stream (XADD)
   * 
   * @param {string} eventName - Event Name (z.B. 'morph:created')
   * @param {object} data - Event Data
   * @returns {Promise<string|false>} Stream Entry ID oder false
   */
  async streamPublish(eventName, data) {
    if (!this.connected || !this.streamClient) {
      this.warn('Not connected to Redis, stream event not published:', eventName);
      return false;
    }
    
    try {
      // XADD amorph:stream * event "morph:created" data "{...}" timestamp "..."
      const entryId = await this.streamClient.xAdd(
        this.config.streamName,
        '*', // Auto-generate ID
        {
          event: eventName,
          data: JSON.stringify(data),
          timestamp: Date.now().toString(),
          source: 'amorph'
        },
        {
          TRIM: {
            strategy: 'MAXLEN',
            strategyModifier: '~', // Approximate
            threshold: this.config.streamMaxLen
          }
        }
      );
      
      this.log(`🌊 Stream event published: ${eventName} → ${entryId}`);
      return entryId;
    } catch (err) {
      this.error(`Failed to publish stream event "${eventName}":`, err);
      return false;
    }
  }
  
  /**
   * Create Consumer Group für Stream
   * 
   * @param {string} groupName - Consumer Group Name (z.B. 'morph-observer')
   * @param {string} startId - Start ID ('0' = von Anfang, '$' = nur neue)
   */
  async createConsumerGroup(groupName, startId = '$') {
    if (!this.connected || !this.streamClient) {
      return false;
    }
    
    try {
      await this.streamClient.xGroupCreate(
        this.config.streamName,
        groupName,
        startId,
        { MKSTREAM: true } // Create Stream if not exists
      );
      
      this.log(`📦 Consumer Group created: ${groupName}`);
      return true;
    } catch (err) {
      // BUSYGROUP = Group already exists, das ist OK
      if (err.message.includes('BUSYGROUP')) {
        this.log(`📦 Consumer Group already exists: ${groupName}`);
        return true;
      }
      
      this.error(`Failed to create consumer group "${groupName}":`, err);
      return false;
    }
  }
  
  /**
   * Read from Stream (XREADGROUP)
   * 
   * @param {string} groupName - Consumer Group Name
   * @param {string} consumerName - Consumer Name (unique per observer instance)
   * @param {object} options - Read Options
   * @returns {Promise<Array>} Array of stream entries
   */
  async streamRead(groupName, consumerName, options = {}) {
    if (!this.connected || !this.streamClient) {
      return [];
    }
    
    try {
      const result = await this.streamClient.xReadGroup(
        groupName,
        consumerName,
        [
          {
            key: this.config.streamName,
            id: '>' // Nur neue ungelesene Messages
          }
        ],
        {
          COUNT: options.count || 10,
          BLOCK: options.block || 0 // 0 = non-blocking
        }
      );
      
      if (!result || result.length === 0) {
        return [];
      }
      
      // Parse result: [{ name: 'amorph:stream', messages: [{id, message}] }]
      const messages = result[0]?.messages || [];
      
      // Transform to usable format
      const entries = messages.map(msg => ({
        id: msg.id,
        event: msg.message.event,
        data: JSON.parse(msg.message.data),
        timestamp: parseInt(msg.message.timestamp),
        source: msg.message.source
      }));
      
      return entries;
    } catch (err) {
      this.error('Failed to read from stream:', err);
      return [];
    }
  }
  
  /**
   * Acknowledge Stream Message (XACK)
   * 
   * @param {string} groupName - Consumer Group Name
   * @param {string} messageId - Message ID to acknowledge
   */
  async streamAck(groupName, messageId) {
    if (!this.connected || !this.streamClient) {
      return false;
    }
    
    try {
      await this.streamClient.xAck(
        this.config.streamName,
        groupName,
        messageId
      );
      
      return true;
    } catch (err) {
      this.error('Failed to acknowledge stream message:', err);
      return false;
    }
  }
  
  /**
   * Get Stream Info
   */
  async streamInfo() {
    if (!this.connected || !this.streamClient) {
      return null;
    }
    
    try {
      const info = await this.streamClient.xInfoStream(this.config.streamName);
      return info;
    } catch (err) {
      this.error('Failed to get stream info:', err);
      return null;
    }
  }
  
  log(...args) {
    if (this.config.enableLogging) {
      console.log('[Redis Bridge]', ...args);
    }
  }
  
  warn(...args) {
    if (this.config.enableLogging) {
      console.warn('[Redis Bridge]', ...args);
    }
  }
  
  error(...args) {
    console.error('[Redis Bridge]', ...args);
  }
}
