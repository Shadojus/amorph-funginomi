/**
 * 🎨 COLOR SHIFT REACTOR
 * ======================
 * 
 * Dynamische Farbübergänge basierend auf Perspektiven
 * Morphs ändern ihre Farbe smooth wenn Perspektiven aktiviert werden
 * 
 * Features:
 * - Perspective-based color transitions
 * - Smooth gradient shifts
 * - Multiple color blend modes
 * - CSS custom properties for theming
 * - Support for color interpolation
 * 
 * Usage:
 * amorph.enableReactor('colorShift', {
 *   mode: 'gradient',
 *   duration: 600,
 *   blendMode: 'mix',
 *   intensity: 0.8
 * });
 */

export class ColorShiftReactor {
  constructor(config = {}) {
    this.config = {
      mode: 'gradient',       // 'gradient' | 'solid' | 'overlay' | 'border'
      duration: 600,          // Transition duration in ms
      blendMode: 'mix',       // 'mix' | 'overlay' | 'multiply' | 'screen'
      intensity: 0.8,         // Color intensity (0-1)
      multiColor: true,       // Blend multiple perspective colors
      ...config
    };
    
    this.styleSheet = null;
    this.appliedMorphs = new Set();
    this.morphColors = new Map(); // Current colors for each morph
    
    // Listen to perspective changes
    const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
    amorphInstance.on('perspectives:changed', this.onPerspectivesChanged.bind(this));
    
    console.log('[ColorShiftReactor] Initialized', this.config);
  }

  /**
   * Apply color shifting to morphs
   */
  apply(morphs) {
    this.injectStyles();
    
    morphs.forEach(morph => {
      if (this.appliedMorphs.has(morph)) return;
      
      morph.classList.add('reactor-color-shift');
      morph.dataset.colorMode = this.config.mode;
      
      // Apply initial colors
      this.updateMorphColor(morph);
      
      this.appliedMorphs.add(morph);
    });
    
    console.log(`[ColorShiftReactor] Applied to ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Cleanup color shifting from morphs
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.classList.remove('reactor-color-shift');
      delete morph.dataset.colorMode;
      
      // Remove custom properties
      morph.style.removeProperty('--shift-color');
      morph.style.removeProperty('--shift-color-1');
      morph.style.removeProperty('--shift-color-2');
      morph.style.removeProperty('--shift-gradient');
      
      this.morphColors.delete(morph);
      this.appliedMorphs.delete(morph);
    });
    
    if (this.appliedMorphs.size === 0 && this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    
    console.log(`[ColorShiftReactor] Removed from ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Update morph color based on active perspectives
   */
  updateMorphColor(morph) {
    const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
    const perspectives = this.getMorphPerspectives(morph);
    const activePerspectives = perspectives.filter(p => 
      amorphInstance.state.activePerspectives.includes(p)
    );
    
    // Get colors for active perspectives
    const colors = activePerspectives.map(p => 
      amorphInstance.getPerspectiveColor(p)
    ).filter(c => c);
    
    // Fallback to all morph perspectives if none active
    if (colors.length === 0 && perspectives.length > 0) {
      colors.push(amorphInstance.getPerspectiveColor(perspectives[0]));
    }
    
    // Default color
    if (colors.length === 0) {
      colors.push('#667eea'); // AMORPH purple
    }
    
    // Apply colors based on mode
    if (this.config.multiColor && colors.length > 1) {
      this.applyMultiColor(morph, colors);
    } else {
      this.applySingleColor(morph, colors[0]);
    }
    
    this.morphColors.set(morph, colors);
  }

  /**
   * Apply single color
   */
  applySingleColor(morph, color) {
    const rgba = this.hexToRGBA(color, this.config.intensity);
    morph.style.setProperty('--shift-color', rgba);
  }

  /**
   * Apply multiple colors as gradient
   */
  applyMultiColor(morph, colors) {
    const rgbaColors = colors.map(c => this.hexToRGBA(c, this.config.intensity));
    
    // Set individual colors
    rgbaColors.forEach((color, i) => {
      morph.style.setProperty(`--shift-color-${i + 1}`, color);
    });
    
    // Create gradient
    const angle = 135; // Diagonal
    const stops = rgbaColors.map((color, i) => {
      const position = (i / (rgbaColors.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ');
    
    const gradient = `linear-gradient(${angle}deg, ${stops})`;
    morph.style.setProperty('--shift-gradient', gradient);
    morph.style.setProperty('--shift-color', rgbaColors[0]); // Fallback
  }

  /**
   * Handle perspective changes
   */
  onPerspectivesChanged(data) {
    // Update all applied morphs
    this.appliedMorphs.forEach(morph => {
      this.updateMorphColor(morph);
    });
    
    console.log(`[ColorShiftReactor] Updated colors for ${this.appliedMorphs.size} morphs`);
  }

  /**
   * Get perspectives from morph
   */
  getMorphPerspectives(morph) {
    if (morph.dataset.morphPerspectives) {
      try {
        return JSON.parse(morph.dataset.morphPerspectives);
      } catch (e) {
        return morph.dataset.morphPerspectives.split(',').map(p => p.trim());
      }
    }
    return [];
  }

  /**
   * Convert hex color to RGBA with alpha
   */
  hexToRGBA(hex, alpha = 1) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (this.styleSheet) return;
    
    this.styleSheet = document.createElement('style');
    this.styleSheet.textContent = `
      /* Base transition */
      .reactor-color-shift {
        transition: 
          background-color ${this.config.duration}ms ease-out,
          border-color ${this.config.duration}ms ease-out,
          box-shadow ${this.config.duration}ms ease-out;
      }
      
      /* Gradient mode */
      .reactor-color-shift[data-color-mode="gradient"] {
        background: var(--shift-gradient, var(--shift-color));
      }
      
      /* Solid mode */
      .reactor-color-shift[data-color-mode="solid"] {
        background-color: var(--shift-color);
      }
      
      /* Overlay mode */
      .reactor-color-shift[data-color-mode="overlay"] {
        position: relative;
      }
      
      .reactor-color-shift[data-color-mode="overlay"]::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--shift-gradient, var(--shift-color));
        opacity: ${this.config.intensity};
        pointer-events: none;
        border-radius: inherit;
        transition: opacity ${this.config.duration}ms ease-out;
      }
      
      /* Border mode */
      .reactor-color-shift[data-color-mode="border"] {
        border: 2px solid var(--shift-color);
        box-shadow: 0 0 20px var(--shift-color);
      }
      
      /* Blend modes */
      .reactor-color-shift[data-blend-mode="overlay"] {
        mix-blend-mode: overlay;
      }
      
      .reactor-color-shift[data-blend-mode="multiply"] {
        mix-blend-mode: multiply;
      }
      
      .reactor-color-shift[data-blend-mode="screen"] {
        mix-blend-mode: screen;
      }
      
      /* Smooth color interpolation */
      .reactor-color-shift * {
        transition: inherit;
      }
    `;
    
    document.head.appendChild(this.styleSheet);
  }

  /**
   * Update reactor config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Re-inject styles with new config
    if (this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    this.injectStyles();
    
    // Reapply to all morphs
    this.appliedMorphs.forEach(morph => {
      morph.dataset.colorMode = this.config.mode;
      this.updateMorphColor(morph);
    });
    
    console.log('[ColorShiftReactor] Config updated', this.config);
  }
}
