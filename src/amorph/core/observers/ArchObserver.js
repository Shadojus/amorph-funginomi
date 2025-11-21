/**
 * 🏛️ ARCH OBSERVER
 * 
 * Watches 'arch:*' events und verwaltet Architecture State
 * 
 * EVENTS:
 * - arch:system-initialized - AMORPH System initialisiert
 * - arch:system-ready - System bereit für Morphs
 * - arch:system-shutdown - System wird heruntergefahren
 * - arch:bridge-connected - Redis Bridge connected
 * - arch:bridge-disconnected - Redis Bridge disconnected
 * 
 * STATE:
 * - systemReady: boolean
 * - bridgeConnected: boolean
 * - initTime: number
 * - uptime: number
 */

import { BaseObserver } from './BaseObserver.js';

export class ArchObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'arch:',
      groupName: 'arch-observer',
      consumerName: `arch-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 5
    });
    
    this.systemReady = false;
    this.bridgeConnected = false;
    this.initTime = null;
    this.uptime = 0;
  }
  
  async onStart() {
    this.log('🏛️ ArchObserver started - watching arch:* events');
  }
  
  async onStop() {
    this.log('🏛️ ArchObserver stopped');
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'arch:system-initialized':
        this.handleSystemInitialized(data, meta);
        break;
        
      case 'arch:system-ready':
        this.handleSystemReady(data, meta);
        break;
        
      case 'arch:system-shutdown':
        this.handleSystemShutdown(data, meta);
        break;
        
      case 'arch:bridge-connected':
        this.handleBridgeConnected(data, meta);
        break;
        
      case 'arch:bridge-disconnected':
        this.handleBridgeDisconnected(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleSystemInitialized(data, meta) {
    const { version, config } = data;
    
    this.initTime = meta.timestamp;
    this.log(`🚀 System initialized (v${version})`);
  }
  
  handleSystemReady(data, meta) {
    const { duration } = data;
    
    this.systemReady = true;
    this.uptime = Date.now() - this.initTime;
    
    this.log(`✅ System ready (${duration}ms)`);
  }
  
  handleSystemShutdown(data, meta) {
    this.systemReady = false;
    this.log(`⏹️ System shutdown`);
  }
  
  handleBridgeConnected(data, meta) {
    const { url } = data;
    
    this.bridgeConnected = true;
    this.log(`🌉 Bridge connected: ${url}`);
  }
  
  handleBridgeDisconnected(data, meta) {
    this.bridgeConnected = false;
    this.log(`🔌 Bridge disconnected`);
  }
  
  isSystemReady() {
    return this.systemReady;
  }
  
  isBridgeConnected() {
    return this.bridgeConnected;
  }
  
  getUptime() {
    return this.uptime;
  }
}
