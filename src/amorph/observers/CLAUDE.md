# 👁️ AMORPH Observers **[KOMPLETT NEU - 2025-11-15]**

## Übersicht

**Redis Stream Observer Pattern** für Event Processing & State Management:
- ✅ **BaseObserver**: Abstract Base Class für alle Observers
- ✅ **MorphObserver**: Verwaltet morph:* Events & Morph State
- ✅ **ReactorObserver**: Verwaltet reactor:* Events & Reactor State
- ✅ **HostObserver**: Verwaltet host:* Events & Host State
- ✅ **GlobalObserver**: Verwaltet global:* Events & Global UI State
- ✅ **ArchObserver**: Verwaltet arch:* Events & System State
- ✅ **LayoutObserver**: Verwaltet layout:* Events & Layout State
- ✅ **PerformanceObserver**: Legacy Performance Monitoring (bleibt erhalten)

---

## 🏗️ ARCHITEKTUR

```
User Interaction
    ↓
amorph.streamPublish('event:name', data)
    ↓
Redis Stream (XADD)
    ↓
Consumer Groups (6 Observers)
    ├── MorphObserver    → morph:*
    ├── ReactorObserver  → reactor:*
    ├── HostObserver     → host:*
    ├── GlobalObserver   → global:*
    ├── ArchObserver     → arch:*
    └── LayoutObserver   → layout:*
    ↓
State Management (per Observer)
    ↓
UI Updates / Actions
```

---

## BaseObserver.js

### Funktion

Abstract Base Class für alle Observers:
- ✅ Auto Consumer Group Creation
- ✅ Non-blocking Poll Loop (100ms)
- ✅ Event Filtering by Prefix
- ✅ State Management (Map)
- ✅ Lifecycle Hooks (onStart, onStop)
- ✅ Auto ACK nach Processing

### Verwendung

```javascript
import { BaseObserver } from './BaseObserver.js';

export class MyObserver extends BaseObserver {
  constructor(eventBridge) {
    super(eventBridge, {
      prefix: 'myapp:',
      groupName: 'myapp-observer',
      consumerName: `myapp-observer-${Date.now()}`,
      pollInterval: 100,
      batchSize: 10
    });
  }
  
  async handle(eventName, data, meta) {
    switch (eventName) {
      case 'myapp:action':
        this.handleAction(data, meta);
        break;
    }
  }
}
```

---

## MorphObserver.js

### Funktion

Verwaltet `morph:*` Events und Morph State:
- ✅ Morph Registration Tracking
- ✅ Morph Lifecycle Monitoring
- ✅ Connection Management
- ✅ Stats & Metrics

### Events

- `morph:created` - Morph registriert
- `morph:mounted` - Morph in DOM gemountet
- `morph:updated` - Morph State aktualisiert
- `morph:destroyed` - Morph entfernt
- `morph:connected` - Morphs verbunden
- `morph:disconnected` - Verbindung getrennt

### State

```javascript
{
  morphs: Map<id, {
    id, type, element, createdAt, mounted, updateCount
  }>,
  connections: Map<connectionId, { from, to, createdAt }>,
  stats: { total, mounted, updated, destroyed }
}
```

### API

```javascript
amorph.observers.morph.getMorph(id)
amorph.observers.morph.getAllMorphs()
amorph.observers.morph.getStats()
amorph.observers.morph.getConnections()
```

---

## ReactorObserver.js

### Funktion

Verwaltet `reactor:*` Events und Reactor State.

### Events

- `reactor:registered` - Reactor registriert
- `reactor:triggered` - Reactor ausgelöst
- `reactor:completed` - Execution abgeschlossen
- `reactor:error` - Fehler während Execution

### State

```javascript
{
  reactors: Map<name, {
    name, registeredAt, triggerCount, errorCount
  }>,
  executions: Array<{ name, timestamp, duration, success }>,
  stats: { total, triggers, errors }
}
```

---

## HostObserver.js

### Funktion

Verwaltet `host:*` Events und Host State.

### Events

- `host:created` - Host erstellt
- `host:data-loaded` - Data geladen
- `host:morphs-generated` - Morphs generiert
- `host:destroyed` - Host entfernt

---

## GlobalObserver.js

### Funktion

Verwaltet `global:*` Events und Global UI State.

### Events

- `global:theme-changed` - Theme geändert
- `global:view-changed` - View Mode (grid/bubble)
- `global:search` - Suche ausgeführt
- `global:navigation` - Navigation
- `global:error` - Globaler Fehler

### State

```javascript
{
  theme: 'dark',
  viewMode: 'grid',
  searchHistory: Array,
  errorLog: Array
}
```

---

## ArchObserver.js

### Funktion

Verwaltet `arch:*` Events und System State.

### Events

- `arch:system-initialized` - System initialisiert
- `arch:system-ready` - System bereit
- `arch:system-shutdown` - Shutdown
- `arch:bridge-connected` - Redis connected
- `arch:bridge-disconnected` - Redis disconnected

---

## LayoutObserver.js

### Funktion

Verwaltet `layout:*` Events und Layout State.

### Events

- `layout:rendered` - Layout gerendert
- `layout:viewport-changed` - Viewport Size
- `layout:scroll` - Scroll Event
- `layout:resize` - Window Resize

---

## PerformanceObserver.js

### Funktion

Überwacht die Performance des AMORPH-Systems:
- ✅ FPS Monitoring
- ✅ Memory Usage
- ✅ Morph Count
- ✅ Reactor Count
- ✅ Event Count
- ✅ Render Time
- ✅ Warning System

### Verwendung

```javascript
import { PerformanceObserver } from '@/amorph/observers/PerformanceObserver';

// Starte Monitoring
const observer = new PerformanceObserver();
observer.start();

// Stoppe Monitoring
observer.stop();

// Get Metrics
const metrics = observer.getMetrics();
console.log(metrics);
```

### Metriken

```javascript
{
  fps: Number,              // Frames per Second
  memory: {
    used: Number,           // MB benutzt
    total: Number,          // MB total
    percentage: Number      // Prozent
  },
  morphCount: Number,       // Anzahl registrierter Morphs
  reactorCount: Number,     // Anzahl aktiver Reactors
  eventCount: Number,       // Events pro Sekunde
  renderTime: Number,       // Durchschnittliche Render-Zeit (ms)
  warnings: Array           // Performance-Warnungen
}
```

### Implementierung

```javascript
export class PerformanceObserver {
  constructor() {
    this.isRunning = false;
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.fps = 60;
    this.metrics = {
      fps: 60,
      memory: { used: 0, total: 0, percentage: 0 },
      morphCount: 0,
      reactorCount: 0,
      eventCount: 0,
      renderTime: 0,
      warnings: []
    };
    
    this.eventLog = [];
    this.renderTimes = [];
  }
  
  /**
   * Start performance monitoring
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    
    console.log('[PerformanceObserver] 🟢 Started monitoring');
    
    // FPS Monitoring
    this.measureFPS();
    
    // Metrics Sampling (every second)
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, 1000);
    
    // Warnings Check (every 5 seconds)
    this.warningsInterval = setInterval(() => {
      this.checkWarnings();
    }, 5000);
  }
  
  /**
   * Stop performance monitoring
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    clearInterval(this.metricsInterval);
    clearInterval(this.warningsInterval);
    
    console.log('[PerformanceObserver] 🔴 Stopped monitoring');
  }
  
  /**
   * Measure FPS
   */
  measureFPS() {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    // Calculate FPS
    this.fps = 1000 / delta;
    this.frameCount++;
    
    requestAnimationFrame(() => this.measureFPS());
  }
  
  /**
   * Collect all metrics
   */
  collectMetrics() {
    const amorph = window.amorph;
    
    // Memory
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / (1024 * 1024);
      const total = performance.memory.totalJSHeapSize / (1024 * 1024);
      
      this.metrics.memory = {
        used: used.toFixed(2),
        total: total.toFixed(2),
        percentage: ((used / total) * 100).toFixed(1)
      };
    }
    
    // FPS
    this.metrics.fps = Math.round(this.fps);
    
    // Morph Count
    this.metrics.morphCount = amorph?.morphs?.size || 0;
    
    // Reactor Count
    this.metrics.reactorCount = amorph?.reactors?.size || 0;
    
    // Event Count (per second)
    const recentEvents = this.eventLog.filter(time => 
      Date.now() - time < 1000
    );
    this.metrics.eventCount = recentEvents.length;
    
    // Render Time (average of last 10 frames)
    if (this.renderTimes.length > 0) {
      const avg = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
      this.metrics.renderTime = avg.toFixed(2);
      this.renderTimes = this.renderTimes.slice(-10);
    }
  }
  
  /**
   * Check for performance warnings
   */
  checkWarnings() {
    this.metrics.warnings = [];
    
    // Low FPS
    if (this.metrics.fps < 30) {
      this.metrics.warnings.push({
        type: 'fps',
        severity: 'high',
        message: `Low FPS: ${this.metrics.fps}`,
        recommendation: 'Reduce number of morphs or disable expensive reactors'
      });
    } else if (this.metrics.fps < 45) {
      this.metrics.warnings.push({
        type: 'fps',
        severity: 'medium',
        message: `Medium FPS: ${this.metrics.fps}`,
        recommendation: 'Consider optimizing reactor apply() functions'
      });
    }
    
    // High Memory
    if (this.metrics.memory.percentage > 90) {
      this.metrics.warnings.push({
        type: 'memory',
        severity: 'high',
        message: `High memory usage: ${this.metrics.memory.percentage}%`,
        recommendation: 'Memory leak possible, check for unreleased event listeners'
      });
    } else if (this.metrics.memory.percentage > 75) {
      this.metrics.warnings.push({
        type: 'memory',
        severity: 'medium',
        message: `Elevated memory usage: ${this.metrics.memory.percentage}%`,
        recommendation: 'Monitor memory growth over time'
      });
    }
    
    // Too many morphs
    if (this.metrics.morphCount > 500) {
      this.metrics.warnings.push({
        type: 'morphs',
        severity: 'medium',
        message: `High morph count: ${this.metrics.morphCount}`,
        recommendation: 'Consider pagination or virtualization'
      });
    }
    
    // Slow render
    if (this.metrics.renderTime > 16) {
      this.metrics.warnings.push({
        type: 'render',
        severity: 'high',
        message: `Slow render time: ${this.metrics.renderTime}ms (target: 16ms)`,
        recommendation: 'Optimize heavy DOM operations or reactor calculations'
      });
    }
    
    // Log warnings
    if (this.metrics.warnings.length > 0) {
      console.warn('[PerformanceObserver] ⚠️ Performance warnings:', this.metrics.warnings);
    }
  }
  
  /**
   * Log event (for event counting)
   */
  logEvent() {
    this.eventLog.push(Date.now());
    
    // Keep only last 1000 events
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }
  
  /**
   * Log render time
   */
  logRenderTime(time) {
    this.renderTimes.push(time);
  }
  
  /**
   * Get current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }
  
  /**
   * Log metrics to console
   */
  logMetrics() {
    console.log('[PerformanceObserver] 📊 Metrics:', {
      '🎯 FPS': this.metrics.fps,
      '💾 Memory': `${this.metrics.memory.used}MB / ${this.metrics.memory.total}MB (${this.metrics.memory.percentage}%)`,
      '🧩 Morphs': this.metrics.morphCount,
      '⚡ Reactors': this.metrics.reactorCount,
      '📡 Events/s': this.metrics.eventCount,
      '⏱️ Render': `${this.metrics.renderTime}ms`,
      '⚠️ Warnings': this.metrics.warnings.length
    });
  }
  
  /**
   * Get performance report
   */
  getReport() {
    return `
# Performance Report

## Metrics
- **FPS**: ${this.metrics.fps}
- **Memory**: ${this.metrics.memory.used}MB / ${this.metrics.memory.total}MB (${this.metrics.memory.percentage}%)
- **Morphs**: ${this.metrics.morphCount}
- **Reactors**: ${this.metrics.reactorCount}
- **Events/s**: ${this.metrics.eventCount}
- **Render Time**: ${this.metrics.renderTime}ms

## Warnings
${this.metrics.warnings.map(w => 
  `- [${w.severity.toUpperCase()}] ${w.message}\n  → ${w.recommendation}`
).join('\n')}

## Status
${this.metrics.warnings.length === 0 ? '✅ All systems nominal' : '⚠️ Performance issues detected'}
    `.trim();
  }
}
```

---

## Integration

### In DevTools

```javascript
// DevTools.js
import { PerformanceObserver } from '@/amorph/observers/PerformanceObserver';

class DevTools extends LitElement {
  constructor() {
    super();
    this.perfObserver = new PerformanceObserver();
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.perfObserver.start();
    
    // Update UI every second
    setInterval(() => {
      this.metrics = this.perfObserver.getMetrics();
      this.requestUpdate();
    }, 1000);
  }
  
  render() {
    return html`
      <div class="metrics">
        <div class="metric">
          <span class="metric__label">FPS</span>
          <span class="metric__value">${this.metrics.fps}</span>
        </div>
        
        <div class="metric">
          <span class="metric__label">Memory</span>
          <span class="metric__value">${this.metrics.memory.percentage}%</span>
        </div>
        
        <div class="metric">
          <span class="metric__label">Morphs</span>
          <span class="metric__value">${this.metrics.morphCount}</span>
        </div>
      </div>
      
      ${this.metrics.warnings.length > 0 ? html`
        <div class="warnings">
          ${this.metrics.warnings.map(w => html`
            <div class="warning warning--${w.severity}">
              <strong>${w.message}</strong>
              <p>${w.recommendation}</p>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }
}
```

---

## Thresholds

### FPS
- ✅ **>45 FPS**: Excellent
- ⚠️ **30-45 FPS**: Medium (Warning)
- 🚨 **<30 FPS**: Poor (Critical Warning)

### Memory
- ✅ **<75%**: Normal
- ⚠️ **75-90%**: Elevated (Warning)
- 🚨 **>90%**: Critical (High Warning)

### Render Time
- ✅ **<16ms**: 60 FPS target
- ⚠️ **16-33ms**: 30-60 FPS
- 🚨 **>33ms**: <30 FPS (Warning)

### Morph Count
- ✅ **<200**: Optimal
- ⚠️ **200-500**: Consider pagination
- 🚨 **>500**: Performance impact likely

---

---

## 📤 EVENT PUBLISHING

### Neu (RECOMMENDED):
```javascript
await amorph.streamPublish('morph:created', {
  id: 'morph-123',
  type: 'bubble-name'
});
```

### Alt (DEPRECATED):
```javascript
amorph.emit('morph:created', { element });
```

---

## 🚀 USAGE

```javascript
// Observer State abfragen
const morphs = amorph.observers.morph.getAllMorphs()
const stats = amorph.observers.morph.getStats()

// Check if running
console.log(amorph.observers.morph.running)

// Stream Info
await amorph.eventBridge.streamInfo()
```

---

## Status: ✅ KOMPLETT IMPLEMENTIERT (2025-11-15)

Alle 6 Stream Observers + BaseObserver sind implementiert und aktiv.
PerformanceObserver bleibt für Legacy Performance Monitoring erhalten.

**Siehe auch:**
- `STREAM_OBSERVER_SYSTEM.md` - Vollständige Architektur
- `OBSERVERS_NEW.md` - Detaillierte Observer Dokumentation
- `QUICK_START_OBSERVERS.md` - Quick Start Guide
