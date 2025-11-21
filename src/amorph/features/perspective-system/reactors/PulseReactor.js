/**
 * 💓 PULSE REACTOR
 * ================
 * 
 * Macht Morphs pulsieren - entweder kontinuierlich oder auf Hover
 * Kann Wichtigkeit durch Puls-Intensität signalisieren
 * 
 * Features:
 * - Pulsing Animation (CSS transform scale)
 * - Hover-triggered Pulse
 * - Importance-based Intensity
 * - Perspective-based Color Pulse
 * 
 * Usage:
 * amorph.enableReactor('pulse', {
 *   mode: 'hover',        // 'continuous' | 'hover' | 'importance'
 *   intensity: 1.05,      // Scale factor
 *   duration: 800,        // Animation duration in ms
 *   colorShift: true      // Pulse perspective color
 * });
 */

export class PulseReactor {
  constructor(config = {}) {
    this.config = {
      mode: 'hover',
      intensity: 1.05,
      duration: 800,
      colorShift: false,
      ...config
    };
    
    this.styleSheet = null;
    this.appliedMorphs = new Set();
    
    console.log('[PulseReactor] Initialized', this.config);
  }

  /**
   * Apply pulse to morphs
   */
  apply(morphs) {
    this.injectStyles();
    
    morphs.forEach(morph => {
      if (this.appliedMorphs.has(morph)) return;
      
      // Add pulse class based on mode
      if (this.config.mode === 'continuous') {
        morph.classList.add('reactor-pulse-continuous');
      } else if (this.config.mode === 'hover') {
        morph.classList.add('reactor-pulse-hover');
      } else if (this.config.mode === 'importance') {
        const importance = this.getImportance(morph);
        morph.classList.add('reactor-pulse-importance');
        morph.style.setProperty('--pulse-importance', importance);
      }
      
      // Color shift based on perspective
      if (this.config.colorShift) {
        const perspective = this.getPerspective(morph);
        const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
        const color = amorphInstance.getPerspectiveColor(perspective);
        if (color) {
          morph.style.setProperty('--pulse-color', color);
        }
      }
      
      this.appliedMorphs.add(morph);
    });
    
          console.log(`[PulseReactor] Applied to ${morphs.length} morphs`);
  }

  /**
   * Check importance of morph
   */
  shouldPulseByImportance(morph) {
    // Check if in search results
    const searchScore = (typeof window !== 'undefined' && window.amorph) 
      ? window.amorph.state.searchScores.get(morph)
      : amorph.state.searchScores.get(morph);
    return searchScore && searchScore > 0;
  }

  /**
   * Cleanup pulse from morphs
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.classList.remove('reactor-pulse-continuous');
      morph.classList.remove('reactor-pulse-hover');
      morph.classList.remove('reactor-pulse-importance');
      morph.style.removeProperty('--pulse-importance');
      morph.style.removeProperty('--pulse-color');
      
      this.appliedMorphs.delete(morph);
    });
    
    if (this.appliedMorphs.size === 0 && this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    
    console.log(`[PulseReactor] Removed from ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Get importance score (0-1) from morph
   */
  getImportance(morph) {
    // Check data attributes for importance hints
    const importance = morph.dataset.importance;
    if (importance) return parseFloat(importance);
    
    // Check if morph has high search score
    const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
    const searchScore = amorphInstance.state.searchScores.get(morph);
    if (searchScore) return searchScore / 100;
    
    // Check if morph has active perspectives
    const perspectives = morph.dataset.morphPerspectives;
    if (perspectives) {
      try {
        const perspectiveArray = JSON.parse(perspectives);
        const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
        const activeCount = perspectiveArray.filter(p => 
          amorphInstance.state.activePerspectives.includes(p)
        ).length;
        return activeCount / perspectiveArray.length;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    return 0.5; // Default medium importance
  }

  /**
   * Get primary perspective from morph
   */
  getPerspective(morph) {
    const perspectives = morph.dataset.morphPerspectives;
    if (perspectives) {
      try {
        const perspectiveArray = JSON.parse(perspectives);
        return perspectiveArray[0];
      } catch (e) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Inject CSS animations
   */
  injectStyles() {
    if (this.styleSheet) return;
    
    this.styleSheet = document.createElement('style');
    this.styleSheet.textContent = `
      /* Continuous Pulse */
      @keyframes reactor-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(${this.config.intensity});
        }
      }
      
      .reactor-pulse-continuous {
        animation: reactor-pulse ${this.config.duration}ms ease-in-out infinite;
      }
      
      /* Hover Pulse */
      .reactor-pulse-hover {
        transition: transform ${this.config.duration / 2}ms ease-out;
      }
      
      .reactor-pulse-hover:hover {
        transform: scale(${this.config.intensity});
        animation: reactor-pulse ${this.config.duration}ms ease-in-out infinite;
      }
      
      /* Importance-based Pulse */
      .reactor-pulse-importance {
        animation: reactor-pulse calc(${this.config.duration}ms / var(--pulse-importance, 0.5)) ease-in-out infinite;
      }
      
      /* Color Shift */
      ${this.config.colorShift ? `
        .reactor-pulse-continuous,
        .reactor-pulse-hover:hover,
        .reactor-pulse-importance {
          box-shadow: 0 0 20px var(--pulse-color, rgba(102, 126, 234, 0.4));
        }
      ` : ''}
    `;
    
    document.head.appendChild(this.styleSheet);
  }
}

export default PulseReactor;
