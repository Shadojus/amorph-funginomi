/**
 * 📊 PERFORMANCE OBSERVER
 * ======================
 * 
 * Überwacht Performance-Metriken des AMORPH Systems:
 * - Morph Registration Time
 * - Reactor Apply Time
 * - Search Performance
 * - Memory Usage
 * - Frame Rate
 * 
 * @author AMORPH System
 * @version 1.0.0
 */

export class PerformanceObserver {
  constructor(amorph) {
    this.amorph = amorph;
    this.metrics = {
      morphRegistrations: [],
      reactorApplications: [],
      searchOperations: [],
      frameRates: [],
      memorySnapshots: []
    };
    
    this.maxMetrics = 100; // Keep last 100 measurements
    this.enabled = true;
    
    this.init();
  }

  init() {
    // Start FPS monitoring
    this.startFPSMonitoring();
    
    // Memory monitoring (if available)
    if (performance.memory) {
      this.startMemoryMonitoring();
    }
    
    // Listen to AMORPH events
    this.attachEventListeners();
    
    console.log('[PerformanceObserver] Monitoring started');
  }

  startFPSMonitoring() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = (currentTime) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.recordFPS(fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      if (this.enabled) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  }

  startMemoryMonitoring() {
    setInterval(() => {
      if (!this.enabled) return;
      
      const memory = performance.memory;
      this.recordMemory({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    }, 5000); // Every 5 seconds
  }

  attachEventListeners() {
    this.amorph.on('amorph:morph:registered', (data) => {
      // Measure registration performance
      // Note: This would need timing data from AmorphSystem
    });
    
    this.amorph.on('amorph:reactor:enabled', (data) => {
      const start = performance.now();
      // Reactor application is async, so we track via another event
      this.pendingReactorStart = start;
    });
    
    this.amorph.on('amorph:search:completed', (data) => {
      // Search timing is embedded in the event data ideally
      if (data.duration) {
        this.recordSearch({
          query: data.query,
          results: data.totalResults,
          duration: data.duration,
          timestamp: Date.now()
        });
      }
    });
  }

  recordMorphRegistration(data) {
    this.metrics.morphRegistrations.push({
      morphId: data.morphId,
      morphType: data.morphType,
      duration: data.duration,
      timestamp: Date.now()
    });
    
    this.trimMetrics('morphRegistrations');
  }

  recordReactorApplication(data) {
    this.metrics.reactorApplications.push({
      reactorName: data.reactorName,
      morphsAffected: data.morphsAffected,
      duration: data.duration,
      timestamp: Date.now()
    });
    
    this.trimMetrics('reactorApplications');
  }

  recordSearch(data) {
    this.metrics.searchOperations.push(data);
    this.trimMetrics('searchOperations');
    
    // Warn if search is slow
    if (data.duration > 100) {
      console.warn(`[PerformanceObserver] Slow search detected: ${data.duration}ms for "${data.query}"`);
    }
  }

  recordFPS(fps) {
    this.metrics.frameRates.push({
      fps,
      timestamp: Date.now()
    });
    
    this.trimMetrics('frameRates');
    
    // Warn if FPS drops
    if (fps < 30) {
      console.warn(`[PerformanceObserver] Low FPS detected: ${fps}`);
    }
  }

  recordMemory(data) {
    this.metrics.memorySnapshots.push(data);
    this.trimMetrics('memorySnapshots');
    
    // Warn if memory usage is high
    const usagePercent = (data.usedJSHeapSize / data.jsHeapSizeLimit) * 100;
    if (usagePercent > 80) {
      console.warn(`[PerformanceObserver] High memory usage: ${usagePercent.toFixed(1)}%`);
    }
  }

  trimMetrics(metricName) {
    const metrics = this.metrics[metricName];
    if (metrics.length > this.maxMetrics) {
      metrics.shift();
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      summary: this.getSummary()
    };
  }

  getSummary() {
    const avgFPS = this.metrics.frameRates.length > 0
      ? this.metrics.frameRates.reduce((sum, m) => sum + m.fps, 0) / this.metrics.frameRates.length
      : 0;
    
    const avgSearchDuration = this.metrics.searchOperations.length > 0
      ? this.metrics.searchOperations.reduce((sum, m) => sum + m.duration, 0) / this.metrics.searchOperations.length
      : 0;
    
    const latestMemory = this.metrics.memorySnapshots.length > 0
      ? this.metrics.memorySnapshots[this.metrics.memorySnapshots.length - 1]
      : null;
    
    return {
      avgFPS: Math.round(avgFPS),
      avgSearchDuration: Math.round(avgSearchDuration),
      currentMemoryUsageMB: latestMemory 
        ? Math.round(latestMemory.usedJSHeapSize / 1048576)
        : null,
      totalMorphRegistrations: this.metrics.morphRegistrations.length,
      totalReactorApplications: this.metrics.reactorApplications.length,
      totalSearchOperations: this.metrics.searchOperations.length
    };
  }

  logSummary() {
    const summary = this.getSummary();
    console.log('📊 AMORPH Performance Summary:', summary);
  }

  stop() {
    this.enabled = false;
    console.log('[PerformanceObserver] Monitoring stopped');
  }
}

export default PerformanceObserver;
