/**
 * ✨ GLOW REACTOR
 * 
 * Fügt Glow-Effekte zu Morphs hinzu
 * Unterstützt verschiedene Glow-Intensitäten und Farben
 * 
 * Features:
 * - Perspective-basierte Glow-Farben
 * - Hover-Intensität
 * - Pulsating Glow Option
 * - Performance-optimiert mit CSS
 */

import { amorph } from '../../../core/AmorphSystem.js';

export class GlowReactor {
  constructor(config = {}) {
    this.config = {
      intensity: 'medium',        // 'low' | 'medium' | 'high'
      pulsate: true,
      duration: 2000,
      hoverBoost: 1.5,
      perspectiveColors: true,
      ...config
    };
    
    this.morphs = new Set();
    this.styleElement = null;
    this.enabled = false;
  }
  
  /**
   * Apply Reactor zu allen registrierten Morphs
   */
  apply(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    this.enabled = true;
    this.injectStyles();
    
    morphElements.forEach(morph => {
      this.applyToMorph(morph);
    });
    
    // Event Listeners
    this.setupEventListeners();
    
    console.log(`[GlowReactor] Applied to ${morphElements.length} morphs`);
  }
  
  /**
   * Cleanup Reactor von allen Morphs
   */
  cleanup(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    morphElements.forEach(morph => {
      this.removeFromMorph(morph);
    });
    
    this.removeEventListeners();
    this.removeStyles();
    this.enabled = false;
    
    console.log(`[GlowReactor] Cleaned up from ${morphElements.length} morphs`);
  }
  
  /**
   * Apply Glow zu einzelnem Morph
   */
  applyToMorph(morph) {
    if (this.morphs.has(morph)) return;
    
    const morphType = morph.dataset.morphType;
    const intensity = this.getIntensityValue();
    const color = this.getGlowColor(morph);
    
    // Basis Glow Class
    morph.classList.add('reactor-glow');
    morph.classList.add(`reactor-glow-${this.config.intensity}`);
    
    if (this.config.pulsate) {
      morph.classList.add('reactor-glow-pulsate');
    }
    
    // Custom Color via CSS Variable
    morph.style.setProperty('--glow-color', color);
    morph.style.setProperty('--glow-intensity', intensity);
    
    this.morphs.add(morph);
  }
  
  /**
   * Remove Glow von einzelnem Morph
   */
  removeFromMorph(morph) {
    if (!this.morphs.has(morph)) return;
    
    morph.classList.remove('reactor-glow');
    morph.classList.remove(`reactor-glow-${this.config.intensity}`);
    morph.classList.remove('reactor-glow-pulsate');
    
    morph.style.removeProperty('--glow-color');
    morph.style.removeProperty('--glow-intensity');
    
    this.morphs.delete(morph);
  }
  
  /**
   * Get Glow Color basierend auf Perspective oder Morph Type
   */
  getGlowColor(morph) {
    if (!this.config.perspectiveColors) {
      return 'rgba(59, 130, 246, 0.6)'; // Default Blue
    }
    
    // Hol aktive Perspectives
    const activePerspectives = amorph.state.activePerspectives;
    
    if (activePerspectives.length > 0) {
      const perspectiveId = activePerspectives[0];
      const perspective = amorph.config.perspectives.find(p => p.id === perspectiveId);
      
      if (perspective?.color) {
        // Convert hex to rgba
        return this.hexToRgba(perspective.color, 0.6);
      }
    }
    
    // Fallback: Morph-Type basierte Farben
    const morphType = morph.dataset.morphType;
    const colors = {
      name: 'rgba(34, 197, 94, 0.6)',    // Green
      image: 'rgba(168, 85, 247, 0.6)',  // Purple
      tag: 'rgba(59, 130, 246, 0.6)',    // Blue
      text: 'rgba(251, 191, 36, 0.6)'    // Yellow
    };
    
    return colors[morphType] || 'rgba(59, 130, 246, 0.6)';
  }
  
  /**
   * Convert Hex zu RGBA
   */
  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  /**
   * Get Intensity Value
   */
  getIntensityValue() {
    const intensities = {
      low: '8px',
      medium: '16px',
      high: '24px'
    };
    return intensities[this.config.intensity] || intensities.medium;
  }
  
  /**
   * Inject CSS Styles
   */
  injectStyles() {
    if (this.styleElement) return;
    
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'glow-reactor-styles';
    this.styleElement.textContent = `
      .reactor-glow {
        transition: filter 0.3s ease, transform 0.3s ease;
        filter: drop-shadow(0 0 var(--glow-intensity, 16px) var(--glow-color, rgba(59, 130, 246, 0.6)));
      }
      
      .reactor-glow:hover {
        filter: drop-shadow(0 0 calc(var(--glow-intensity, 16px) * ${this.config.hoverBoost}) var(--glow-color, rgba(59, 130, 246, 0.6)));
        transform: scale(1.02);
      }
      
      .reactor-glow-pulsate {
        animation: glow-pulse ${this.config.duration}ms ease-in-out infinite;
      }
      
      @keyframes glow-pulse {
        0%, 100% {
          filter: drop-shadow(0 0 var(--glow-intensity, 16px) var(--glow-color, rgba(59, 130, 246, 0.6)));
        }
        50% {
          filter: drop-shadow(0 0 calc(var(--glow-intensity, 16px) * 1.5) var(--glow-color, rgba(59, 130, 246, 0.8)));
        }
      }
      
      .reactor-glow-pulsate:hover {
        animation: none;
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }
  
  /**
   * Remove CSS Styles
   */
  removeStyles() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  
  /**
   * Setup Event Listeners
   */
  setupEventListeners() {
    this.handlePerspectiveChange = this.onPerspectiveChange.bind(this);
    amorph.on('perspective:changed', this.handlePerspectiveChange);
  }
  
  /**
   * Remove Event Listeners
   */
  removeEventListeners() {
    if (this.handlePerspectiveChange) {
      amorph.off('perspective:changed', this.handlePerspectiveChange);
    }
  }
  
  /**
   * Handler: Perspective Changed
   */
  onPerspectiveChange(data) {
    if (!this.config.perspectiveColors) return;
    
    // Update alle Morph Colors
    this.morphs.forEach(morph => {
      const color = this.getGlowColor(morph);
      morph.style.setProperty('--glow-color', color);
    });
  }
  
  /**
   * Update Config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Re-apply wenn enabled
    if (this.enabled && this.morphs.size > 0) {
      const morphArray = Array.from(this.morphs);
      this.remove(morphArray);
      this.apply(morphArray);
    }
  }
  
  /**
   * Cleanup
   */
  destroy() {
    this.cleanup(Array.from(this.morphs));
    this.morphs.clear();
  }
}
