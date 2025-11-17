/**
 * 🎯 PERSPECTIVE WEIGHT REACTOR
 * =============================
 * 
 * Steuert Bubble-Größe und Transparenz basierend auf Hilbert-Space-Ähnlichkeit
 * Je ähnlicher Pilze in aktiven Perspektiven sind, desto größer und opaker die Bubbles
 * 
 * Features:
 * - Dynamische Größenanpassung basierend auf Similarity
 * - Transparenz-Steuerung für Relevanz
 * - Live-Updates bei Perspektivenwechsel
 * - Smooth Transitions
 * 
 * Usage:
 * await amorph.enableReactor('perspectiveWeight', {
 *   minSize: 60,
 *   maxSize: 150,
 *   minOpacity: 0.3,
 *   maxOpacity: 1.0
 * });
 */

import { HilbertSpaceSimilarity } from './HilbertSpaceSimilarity.js';

export class PerspectiveWeightReactor {
  constructor(config = {}) {
    this.config = {
      minSize: 60,
      maxSize: 150,
      minOpacity: 0.3,
      maxOpacity: 1.0,
      transitionDuration: 600,
      ...config
    };

    this.activePerspectives = [];
    this.fungi = [];
    this.similarityMatrix = new Map();
    
    console.log('[PerspectiveWeightReactor] Initialized', this.config);
  }

  /**
   * Apply reactor to morphs/bubbles
   */
  apply(morphs = []) {
    if (morphs.length === 0) return;

    // Separate bubble-morphs from regular morphs
    const bubbleMorphs = morphs.filter(m => m.tagName?.toLowerCase() === 'bubble-morph');
    const regularMorphs = morphs.filter(m => m.tagName?.toLowerCase() !== 'bubble-morph');

    // Handle bubble morphs (in BubbleView)
    if (bubbleMorphs.length > 0) {
      console.log(`[PerspectiveWeightReactor] Applying to ${bubbleMorphs.length} bubble morphs`);
      this.applyToBubbles(bubbleMorphs);
    }

    // Handle regular morphs (Grid View)
    if (regularMorphs.length > 0) {
      const fungiGroups = this.groupMorphsByFungus(regularMorphs);
      console.log(`[PerspectiveWeightReactor] Applying to ${fungiGroups.length} fungi groups`);
      
      // Calculate similarity matrix
      if (this.activePerspectives.length > 0 && this.fungi.length > 0) {
        this.similarityMatrix = HilbertSpaceSimilarity.calculateMatrix(
          this.fungi,
          this.activePerspectives
        );
      }

      // Apply weights to each fungus group
      fungiGroups.forEach(({ slug, morphs, fungusData }) => {
        const avgSimilarity = this.getAverageSimilarity(slug);
        this.applyWeightToGroup(morphs, avgSimilarity, fungusData);
      });
    }
  }

  /**
   * Apply weights to bubble morphs
   */
  applyToBubbles(bubbleMorphs) {
    bubbleMorphs.forEach(bubbleMorph => {
      const slug = bubbleMorph.getAttribute('slug');
      if (!slug) return;

      const avgSimilarity = this.getAverageSimilarity(slug);
      
      // Notify BubbleView to update this bubble
      const event = new CustomEvent('bubble-weight-update', {
        bubbles: true,
        composed: true,
        detail: {
          slug,
          similarity: avgSimilarity
        }
      });
      bubbleMorph.dispatchEvent(event);
    });
  }

  /**
   * Group morphs by fungus slug (from data-group)
   */
  groupMorphsByFungus(morphs) {
    const groups = new Map();

    morphs.forEach(morph => {
      const slug = morph.dataset.group;
      if (!slug) return;

      if (!groups.has(slug)) {
        groups.set(slug, []);
      }
      groups.get(slug).push(morph);
    });

    return Array.from(groups.entries()).map(([slug, morphs]) => ({
      slug,
      morphs,
      fungusData: this.fungi.find(f => f.slug === slug)
    }));
  }

  /**
   * Get average similarity of a fungus to all others
   */
  getAverageSimilarity(slug) {
    const similarities = this.similarityMatrix.get(slug);
    if (!similarities) return 0.5; // Default mid-value

    let total = 0;
    let count = 0;

    similarities.forEach((similarity, otherSlug) => {
      if (slug === otherSlug) return; // Skip self
      total += similarity;
      count++;
    });

    return count > 0 ? total / count : 0.5;
  }

  /**
   * Apply weight (size & opacity) to a group of morphs
   */
  applyWeightToGroup(morphs, similarity, fungusData) {
    // Calculate size based on similarity
    const size = this.config.minSize + 
      (this.config.maxSize - this.config.minSize) * similarity;

    // Calculate opacity based on similarity
    const opacity = this.config.minOpacity + 
      (this.config.maxOpacity - this.config.minOpacity) * similarity;

    // Apply to all morphs in group
    morphs.forEach(morph => {
      this.applyStylesToMorph(morph, size, opacity, similarity);
    });

    // Store data for BubbleView
    if (morphs.length > 0) {
      morphs[0].dataset.bubbleSize = size;
      morphs[0].dataset.bubbleOpacity = opacity;
      morphs[0].dataset.similarity = similarity;
    }
  }

  /**
   * Apply visual styles to a morph
   */
  applyStylesToMorph(morph, size, opacity, similarity = 0.5) {
    morph.style.transition = `all ${this.config.transitionDuration}ms ease-out`;
    morph.style.opacity = opacity;

    // Scale based on similarity (subtle effect)
    const scale = 0.8 + (similarity * 0.4); // 0.8 - 1.2
    morph.style.transform = `scale(${scale})`;

    // Visual indicator
    morph.dataset.perspectiveWeight = similarity.toFixed(2);
  }

  /**
   * Update active perspectives
   */
  updatePerspectives(perspectives = []) {
    this.activePerspectives = perspectives;
    console.log(`[PerspectiveWeightReactor] Perspectives updated:`, perspectives);
    
    // Recalculate similarity matrix
    if (this.fungi.length > 0) {
      this.similarityMatrix = HilbertSpaceSimilarity.calculateMatrix(
        this.fungi,
        this.activePerspectives
      );
    }
  }

  /**
   * Set fungi data for similarity calculations
   */
  setFungiData(fungi = []) {
    this.fungi = fungi;
    console.log(`[PerspectiveWeightReactor] Fungi data set: ${fungi.length} items`);
  }

  /**
   * Get similarity between two fungi
   */
  getSimilarity(slug1, slug2) {
    const similarities = this.similarityMatrix.get(slug1);
    return similarities ? similarities.get(slug2) || 0 : 0;
  }

  /**
   * Get all similarities for a fungus
   */
  getSimilarities(slug) {
    return this.similarityMatrix.get(slug) || new Map();
  }

  /**
   * Remove reactor
   */
  remove() {
    // Reset all morph styles
    if (window.amorph) {
      const morphs = window.amorph.getAllMorphs();
      morphs.forEach(morph => {
        morph.style.transition = '';
        morph.style.opacity = '';
        morph.style.transform = '';
        delete morph.dataset.bubbleSize;
        delete morph.dataset.bubbleOpacity;
        delete morph.dataset.similarity;
        delete morph.dataset.perspectiveWeight;
      });
    }
    
    console.log('[PerspectiveWeightReactor] Removed');
  }
}

export default PerspectiveWeightReactor;
