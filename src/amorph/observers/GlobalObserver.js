/**
 * 🌍 GLOBAL OBSERVER
 * 
 * Watches 'global:*' events und verwaltet Global State
 * 
 * EVENTS:
 * - global:theme-changed - Theme wurde geändert
 * - global:view-changed - View Mode geändert (grid/bubble)
 * - global:search - Suche ausgeführt
 * - global:navigation - Navigation Event
 * - global:error - Globaler Fehler
 * 
 * STATE:
 * - theme: string
 * - viewMode: string
 * - searchHistory: Array
 * - errorLog: Array
 */

import { BaseObserver } from './BaseObserver.js';

export class GlobalObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'global:',
      groupName: 'global-observer',
      consumerName: `global-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 10
    });
    
    this.theme = 'dark';
    this.viewMode = 'grid';
    this.searchHistory = [];
    this.errorLog = [];
  }
  
  async onStart() {
    this.log('🌍 GlobalObserver started - watching global:* events');
  }
  
  async onStop() {
    this.log('🌍 GlobalObserver stopped');
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'global:theme-changed':
        this.handleThemeChanged(data, meta);
        break;
        
      case 'global:view-changed':
        this.handleViewChanged(data, meta);
        break;
        
      case 'global:search':
        this.handleSearch(data, meta);
        break;
        
      case 'global:navigation':
        this.handleNavigation(data, meta);
        break;
        
      case 'global:error':
        this.handleError(data, meta);
        break;
        
      default:
        this.warn(`Unknown event: ${eventName}`);
    }
  }
  
  handleThemeChanged(data, meta) {
    const { theme } = data;
    
    this.theme = theme;
    this.log(`🎨 Theme changed: ${theme}`);
  }
  
  handleViewChanged(data, meta) {
    const { viewMode } = data;
    
    this.viewMode = viewMode;
    this.log(`👁️ View mode changed: ${viewMode}`);
  }
  
  handleSearch(data, meta) {
    const { query, results } = data;
    
    this.searchHistory.push({
      query,
      results,
      timestamp: meta.timestamp
    });
    
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
      this.searchHistory.shift();
    }
    
    this.log(`🔍 Search: "${query}" (${results} results)`);
  }
  
  handleNavigation(data, meta) {
    const { from, to } = data;
    
    this.log(`🧭 Navigation: ${from} → ${to}`);
  }
  
  handleError(data, meta) {
    const { message, stack, source } = data;
    
    this.errorLog.push({
      message,
      stack,
      source,
      timestamp: meta.timestamp
    });
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
    
    this.error(`❌ Global error: ${message}`, stack);
  }
  
  getTheme() {
    return this.theme;
  }
  
  getViewMode() {
    return this.viewMode;
  }
  
  getSearchHistory(limit = 10) {
    return this.searchHistory.slice(-limit);
  }
  
  getErrorLog(limit = 10) {
    return this.errorLog.slice(-limit);
  }
}
