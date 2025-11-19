/**
 * 🔴 REDIS EVENT BUS
 * ==================
 * 
 * Multi-User Synchronization mit Redis Pub/Sub
 * 
 * Features:
 * - Real-time state synchronization
 * - User presence tracking
 * - Event broadcasting
 * - Conflict resolution (CRDT-inspired)
 * - Reconnection handling
 * - Local-first architecture
 * 
 * Events:
 * - morph:created
 * - morph:updated
 * - morph:deleted
 * - perspective:changed
 * - user:joined
 * - user:left
 * - cursor:moved
 * 
 * Usage:
 * const eventBus = new RedisEventBus(amorph, {
 *   redisUrl: 'redis://localhost:6379',
 *   channel: 'amorph:events'
 * });
 * 
 * await eventBus.connect();
 * eventBus.broadcast('morph:created', morphData);
 */

export class RedisEventBus {
  constructor(amorph, config = {}) {
    this.amorph = amorph;
    this.config = {
      redisUrl: 'redis://localhost:6379',
      channel: 'amorph:events',
      presenceChannel: 'amorph:presence',
      userId: this.generateUserId(),
      reconnectDelay: 1000,
      heartbeatInterval: 5000,
      ...config
    };
    
    this.isConnected = false;
    this.redis = null;
    this.subscribers = new Map();
    this.presence = new Map(); // userId -> user data
    this.messageQueue = [];
    this.lastHeartbeat = Date.now();
    
    // CRDT state for conflict resolution
    this.vectorClock = new Map();
    
    console.log('[RedisEventBus] Initialized', this.config.userId);
  }

  /**
   * Connect to Redis (simulated for now - in production use ioredis)
   */
  async connect() {
    try {
      // In production: this.redis = new Redis(this.config.redisUrl);
      // For now: simulate connection
      console.log('[RedisEventBus] Connecting to Redis...');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.isConnected = true;
      
      // Subscribe to channels
      this.subscribeToChannels();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Announce presence
      this.announcePresence();
      
      console.log('[RedisEventBus] Connected successfully');
      
      this.amorph.emit('redis:connected', { userId: this.config.userId });
      
      return true;
    } catch (error) {
      console.error('[RedisEventBus] Connection failed', error);
      
      // Retry connection
      setTimeout(() => this.connect(), this.config.reconnectDelay);
      
      return false;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (!this.isConnected) return;
    
    // Announce departure
    this.broadcast('user:left', {
      userId: this.config.userId,
      timestamp: Date.now()
    });
    
    // Stop heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    this.isConnected = false;
    
    console.log('[RedisEventBus] Disconnected');
    this.amorph.emit('redis:disconnected', {});
  }

  /**
   * Subscribe to Redis channels
   */
  subscribeToChannels() {
    // In production würde man hier Redis SUBSCRIBE verwenden
    // Für lokales Testing simulieren wir das mit localStorage events
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
    
    console.log('[RedisEventBus] Subscribed to channels');
  }

  /**
   * Handle storage event (simulates Redis pub/sub)
   */
  handleStorageEvent(e) {
    if (e.key !== this.config.channel) return;
    
    try {
      const message = JSON.parse(e.newValue);
      
      // Ignore own messages
      if (message.userId === this.config.userId) return;
      
      this.handleMessage(message);
    } catch (error) {
      console.error('[RedisEventBus] Error parsing message', error);
    }
  }

  /**
   * Handle incoming message
   */
  handleMessage(message) {
    const { event, data, userId, timestamp, vectorClock } = message;
    
    // Update vector clock
    if (vectorClock) {
      this.updateVectorClock(userId, vectorClock);
    }
    
    // Emit to subscribers
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data, userId, timestamp));
    }
    
    // Handle special events
    switch (event) {
      case 'user:joined':
        this.handleUserJoined(data, userId);
        break;
      case 'user:left':
        this.handleUserLeft(userId);
        break;
      case 'heartbeat':
        this.handleHeartbeat(userId, timestamp);
        break;
    }
    
    // Emit to AMORPH system
    this.amorph.emit(`redis:${event}`, { ...data, userId, timestamp });
  }

  /**
   * Broadcast event to all users
   */
  broadcast(event, data) {
    if (!this.isConnected) {
      this.messageQueue.push({ event, data });
      return;
    }
    
    const message = {
      event,
      data,
      userId: this.config.userId,
      timestamp: Date.now(),
      vectorClock: this.getVectorClock()
    };
    
    // In production: await this.redis.publish(this.config.channel, JSON.stringify(message));
    // For now: use localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.config.channel, JSON.stringify(message));
        // Clear immediately to trigger event again next time
        setTimeout(() => localStorage.removeItem(this.config.channel), 10);
      } catch (e) {
        console.warn('[RedisEventBus] localStorage full, skipping broadcast');
      }
    }
    
    console.log(`[RedisEventBus] Broadcasted ${event}`, data);
  }

  /**
   * Subscribe to event
   */
  on(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Start heartbeat to show presence
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.broadcast('heartbeat', {
        userId: this.config.userId,
        timestamp: Date.now()
      });
      
      this.lastHeartbeat = Date.now();
      
      // Check for stale users
      this.checkStalePresence();
    }, this.config.heartbeatInterval);
  }

  /**
   * Announce user presence
   */
  announcePresence() {
    this.broadcast('user:joined', {
      userId: this.config.userId,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    });
  }

  /**
   * Handle user joined
   */
  handleUserJoined(data, userId) {
    this.presence.set(userId, {
      ...data,
      lastSeen: Date.now()
    });
    
    console.log(`[RedisEventBus] User joined: ${userId}`);
  }

  /**
   * Handle user left
   */
  handleUserLeft(userId) {
    this.presence.delete(userId);
    console.log(`[RedisEventBus] User left: ${userId}`);
  }

  /**
   * Handle heartbeat
   */
  handleHeartbeat(userId, timestamp) {
    const user = this.presence.get(userId);
    if (user) {
      user.lastSeen = timestamp;
    }
  }

  /**
   * Check for stale users (no heartbeat)
   */
  checkStalePresence() {
    const now = Date.now();
    const timeout = this.config.heartbeatInterval * 3;
    
    this.presence.forEach((user, userId) => {
      if (now - user.lastSeen > timeout) {
        this.handleUserLeft(userId);
      }
    });
  }

  /**
   * Get active users
   */
  getActiveUsers() {
    return Array.from(this.presence.values());
  }

  /**
   * Generate unique user ID
   */
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Vector clock for conflict resolution
   */
  getVectorClock() {
    return Object.fromEntries(this.vectorClock);
  }

  updateVectorClock(userId, remoteClock) {
    // Merge vector clocks
    Object.entries(remoteClock).forEach(([user, timestamp]) => {
      const current = this.vectorClock.get(user) || 0;
      this.vectorClock.set(user, Math.max(current, timestamp));
    });
    
    // Increment own clock
    const current = this.vectorClock.get(this.config.userId) || 0;
    this.vectorClock.set(this.config.userId, current + 1);
  }

  /**
   * Check if event happened before another (for conflict resolution)
   */
  happenedBefore(clock1, clock2) {
    let anyLess = false;
    
    for (const [user, time] of Object.entries(clock1)) {
      if (time > (clock2[user] || 0)) {
        return false;
      }
      if (time < (clock2[user] || 0)) {
        anyLess = true;
      }
    }
    
    return anyLess;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      userId: this.config.userId,
      activeUsers: this.presence.size,
      lastHeartbeat: this.lastHeartbeat,
      queuedMessages: this.messageQueue.length
    };
  }
}
