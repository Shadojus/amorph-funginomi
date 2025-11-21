/**
 * 🎯 HOVER REACTOR
 * ================
 * 
 * Erweiterte Hover-Effekte für Morphs:
 * - Parallax-Effekt (3D Tilt)
 * - Scale Boost
 * - Shadow Enhancement
 * - Info Reveal (versteckte Details zeigen)
 * 
 * Features:
 * - Smooth CSS transitions
 * - Mouse tracking für Parallax
 * - Z-Index boost on hover
 * - Perspective color glow
 * 
 * Usage:
 * amorph.enableReactor('hover', {
 *   scale: 1.08,
 *   parallax: true,
 *   shadow: true,
 *   reveal: true
 * });
 */

export class HoverReactor {
  constructor(config = {}) {
    this.config = {
      scale: 1.08,
      parallax: true,
      shadow: true,
      reveal: true,
      duration: 300,
      ...config
    };
    
    this.styleSheet = null;
    this.appliedMorphs = new Set();
    this.hoverHandlers = new Map();
    
    console.log('[HoverReactor] Initialized', this.config);
  }

  /**
   * Apply hover effects to morphs
   */
  apply(morphs) {
    this.injectStyles();
    
    morphs.forEach(morph => {
      if (this.appliedMorphs.has(morph)) return;
      
      morph.classList.add('reactor-hover');
      
      // Parallax Effect
      if (this.config.parallax) {
        const parallaxHandler = this.createParallaxHandler(morph);
        morph.addEventListener('mousemove', parallaxHandler);
        morph.addEventListener('mouseleave', () => {
          morph.style.transform = '';
        });
        this.hoverHandlers.set(morph, parallaxHandler);
      }
      
      // Perspective Color Glow
      const perspective = this.getPerspective(morph);
      const amorphInstance = (typeof window !== 'undefined' && window.amorph) ? window.amorph : amorph;
      const color = amorphInstance.getPerspectiveColor(perspective);
      if (color) {
        morph.style.setProperty('--hover-color', color);
      }
      
      this.appliedMorphs.add(morph);
    });
    
    console.log(`[HoverReactor] Applied to ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Cleanup hover effects from morphs
   */
  cleanup(morphs) {
    morphs.forEach(morph => {
      morph.classList.remove('reactor-hover');
      morph.style.removeProperty('--hover-color');
      morph.style.transform = '';
      
      // Remove parallax handler
      const handler = this.hoverHandlers.get(morph);
      if (handler) {
        morph.removeEventListener('mousemove', handler);
        this.hoverHandlers.delete(morph);
      }
      
      this.appliedMorphs.delete(morph);
    });
    
    if (this.appliedMorphs.size === 0 && this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    
    console.log(`[HoverReactor] Removed from ${morphs.length} morphs`);
    return morphs.length;
  }

  /**
   * Create parallax effect handler
   */
  createParallaxHandler(morph) {
    return (e) => {
      const rect = morph.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const tiltX = deltaY * 10; // Max 10deg tilt
      const tiltY = -deltaX * 10;
      
      morph.style.transform = `
        scale(${this.config.scale})
        perspective(1000px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    };
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
   * Inject CSS styles
   */
  injectStyles() {
    if (this.styleSheet) return;
    
    this.styleSheet = document.createElement('style');
    this.styleSheet.textContent = `
      /* Base Hover State */
      .reactor-hover {
        transition: all ${this.config.duration}ms ease-out;
        cursor: pointer;
        position: relative;
      }
      
      .reactor-hover:hover {
        transform: scale(${this.config.scale});
        z-index: 100;
      }
      
      /* Shadow Enhancement */
      ${this.config.shadow ? `
        .reactor-hover:hover {
          box-shadow: 
            0 10px 40px var(--hover-color, rgba(102, 126, 234, 0.4)),
            0 0 20px var(--hover-color, rgba(102, 126, 234, 0.2));
        }
      ` : ''}
      
      /* Reveal Hidden Details */
      ${this.config.reveal ? `
        .reactor-hover .morph-details {
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: all ${this.config.duration}ms ease-out;
        }
        
        .reactor-hover:hover .morph-details {
          opacity: 1;
          max-height: 500px;
        }
      ` : ''}
      
      /* Smooth Transform Origin */
      .reactor-hover {
        transform-origin: center;
        transform-style: preserve-3d;
      }
      
      /* Disable parallax on touch devices */
      @media (hover: none) {
        .reactor-hover:hover {
          transform: scale(${this.config.scale}) !important;
        }
      }
    `;
    
    document.head.appendChild(this.styleSheet);
  }
}

export default HoverReactor;
