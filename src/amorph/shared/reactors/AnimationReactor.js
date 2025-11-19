/**
 * 🎬 ANIMATION REACTOR
 * 
 * Fügt Entrance/Exit Animations zu Morphs hinzu
 * Unterstützt verschiedene Animation-Typen
 * 
 * Features:
 * - Entrance Animations (fade-in, slide-up, scale-in, etc.)
 * - Exit Animations
 * - Staggered Animations (Verzögerung zwischen Morphs)
 * - Smooth Transitions
 * - Performance-optimiert mit CSS
 */

import { amorph } from '../../core/AmorphSystem.js';

export class AnimationReactor {
  constructor(config = {}) {
    this.config = {
      type: 'fade-scale',         // 'fade-in' | 'slide-up' | 'fade-scale' | 'bounce'
      duration: 600,
      stagger: 50,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: 0,
      ...config
    };
    
    this.morphs = new Set();
    this.styleElement = null;
    this.enabled = false;
    this.animationQueue = [];
  }
  
  /**
   * Apply Reactor
   */
  apply(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    this.enabled = true;
    this.injectStyles();
    
    // Staggered Animation
    morphElements.forEach((morph, index) => {
      const delay = this.config.delay + (index * this.config.stagger);
      this.applyToMorph(morph, delay);
    });
    
    console.log(`[AnimationReactor] Applied to ${morphElements.length} morphs`);
  }
  
  /**
   * Cleanup Reactor
   */
  cleanup(morphElements) {
    if (!morphElements || morphElements.length === 0) return;
    
    morphElements.forEach(morph => {
      this.removeFromMorph(morph);
    });
    
    this.removeStyles();
    this.enabled = false;
    
    console.log(`[AnimationReactor] Cleaned up from ${morphElements.length} morphs`);
  }
  
  /**
   * Apply Animation zu einzelnem Morph
   */
  applyToMorph(morph, delay = 0) {
    if (this.morphs.has(morph)) return;
    
    // Set initial state (hidden)
    morph.classList.add('reactor-animation-initial');
    morph.classList.add(`reactor-animation-${this.config.type}`);
    
    // Set CSS Variables
    morph.style.setProperty('--animation-duration', `${this.config.duration}ms`);
    morph.style.setProperty('--animation-delay', `${delay}ms`);
    morph.style.setProperty('--animation-easing', this.config.easing);
    
    // Trigger animation after small delay (for initial state to apply)
    requestAnimationFrame(() => {
      setTimeout(() => {
        morph.classList.add('reactor-animation-active');
      }, 10);
    });
    
    this.morphs.add(morph);
  }
  
  /**
   * Remove Animation von Morph
   */
  removeFromMorph(morph) {
    if (!this.morphs.has(morph)) return;
    
    morph.classList.remove(
      'reactor-animation-initial',
      'reactor-animation-active',
      `reactor-animation-${this.config.type}`
    );
    
    morph.style.removeProperty('--animation-duration');
    morph.style.removeProperty('--animation-delay');
    morph.style.removeProperty('--animation-easing');
    
    this.morphs.delete(morph);
  }
  
  /**
   * Animate Out (Exit Animation)
   */
  animateOut(morph) {
    return new Promise((resolve) => {
      if (!this.morphs.has(morph)) {
        resolve();
        return;
      }
      
      morph.classList.remove('reactor-animation-active');
      morph.classList.add('reactor-animation-exit');
      
      setTimeout(() => {
        resolve();
      }, this.config.duration);
    });
  }
  
  /**
   * Batch Animate Out
   */
  async batchAnimateOut(morphElements) {
    const promises = morphElements.map((morph, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          this.animateOut(morph).then(resolve);
        }, index * this.config.stagger);
      });
    });
    
    await Promise.all(promises);
  }
  
  /**
   * Inject Styles
   */
  injectStyles() {
    if (this.styleElement) return;
    
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'animation-reactor-styles';
    this.styleElement.textContent = `
      /* Base Animation Classes */
      .reactor-animation-initial {
        opacity: 0;
        transition: all var(--animation-duration, 600ms) var(--animation-easing, cubic-bezier(0.4, 0, 0.2, 1));
        transition-delay: var(--animation-delay, 0ms);
      }
      
      .reactor-animation-active {
        opacity: 1 !important;
        transform: none !important;
      }
      
      .reactor-animation-exit {
        opacity: 0 !important;
        transform: scale(0.9) !important;
      }
      
      /* Fade In */
      .reactor-animation-fade-in.reactor-animation-initial {
        opacity: 0;
      }
      
      /* Slide Up */
      .reactor-animation-slide-up.reactor-animation-initial {
        opacity: 0;
        transform: translateY(30px);
      }
      
      /* Fade Scale */
      .reactor-animation-fade-scale.reactor-animation-initial {
        opacity: 0;
        transform: scale(0.8);
      }
      
      /* Bounce */
      .reactor-animation-bounce.reactor-animation-initial {
        opacity: 0;
        transform: scale(0.3);
      }
      
      .reactor-animation-bounce.reactor-animation-active {
        animation: bounce-in var(--animation-duration, 600ms) var(--animation-easing, cubic-bezier(0.4, 0, 0.2, 1)) var(--animation-delay, 0ms) forwards;
      }
      
      @keyframes bounce-in {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Slide Right */
      .reactor-animation-slide-right.reactor-animation-initial {
        opacity: 0;
        transform: translateX(-30px);
      }
      
      /* Slide Left */
      .reactor-animation-slide-left.reactor-animation-initial {
        opacity: 0;
        transform: translateX(30px);
      }
      
      /* Rotate In */
      .reactor-animation-rotate-in.reactor-animation-initial {
        opacity: 0;
        transform: rotate(-180deg) scale(0.5);
      }
      
      /* Flip */
      .reactor-animation-flip.reactor-animation-initial {
        opacity: 0;
        transform: perspective(400px) rotateY(90deg);
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }
  
  /**
   * Remove Styles
   */
  removeStyles() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  
  /**
   * Change Animation Type
   */
  changeType(newType) {
    this.config.type = newType;
    
    // Re-apply animations
    if (this.enabled) {
      const morphArray = Array.from(this.morphs);
      this.remove(morphArray);
      this.apply(morphArray);
    }
  }
  
  /**
   * Update Config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.enabled && this.morphs.size > 0) {
      const morphArray = Array.from(this.morphs);
      this.remove(morphArray);
      this.apply(morphArray);
    }
  }
  
  /**
   * Replay Animations
   */
  replay() {
    if (!this.enabled) return;
    
    const morphArray = Array.from(this.morphs);
    
    // Remove active state
    morphArray.forEach(morph => {
      morph.classList.remove('reactor-animation-active');
    });
    
    // Re-trigger after delay
    setTimeout(() => {
      morphArray.forEach(morph => {
        morph.classList.add('reactor-animation-active');
      });
    }, 50);
  }
  
  /**
   * Cleanup
   */
  destroy() {
    this.cleanup(Array.from(this.morphs));
    this.morphs.clear();
    this.animationQueue = [];
  }
}
