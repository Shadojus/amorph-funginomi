/**
 * 🔍 BUBBLE SEARCH REACTOR
 * =========================
 * 
 * Highlights bubbles that match search query.
 * Works with ConvexSearchReactor events.
 * 
 * Features:
 * - Highlights matched bubbles
 * - Dims non-matched bubbles
 * - Updates on search
 * - Clears on empty search
 */

export class BubbleSearchReactor {
  constructor() {
    this.name = 'bubbleSearch';
    this.version = '1.0.0';
    this.amorph = null;
    this.matchedSlugs = new Set();
  }

  /**
   * Apply reactor to AMORPH system
   */
  apply(amorph) {
    this.amorph = amorph;
    console.log('[BubbleSearchReactor] Applying...');

    // Listen for Convex search results
    window.addEventListener('convex-search:completed', this.handleSearchCompleted.bind(this));

    console.log('[BubbleSearchReactor] ✅ Applied');
  }

  /**
   * Handle search completed event
   */
  handleSearchCompleted(event) {
    const { results, query } = event.detail;

    console.log('[BubbleSearchReactor] Search completed:', {
      query,
      results: results?.length || 0
    });

    // Clear previous highlights
    this.clearHighlights();

    // If no query, exit
    if (!query || query.trim() === '') {
      return;
    }

    // Store matched slugs
    this.matchedSlugs = new Set(results.map(r => r.slug));

    // Highlight matched bubbles
    this.highlightBubbles();
  }

  /**
   * Highlight matched bubbles
   */
  highlightBubbles() {
    // Get all bubble morphs from all bubble-hosts
    const bubbleHosts = document.querySelectorAll('bubble-host');
    let totalBubbles = 0;
    let highlightedCount = 0;

    bubbleHosts.forEach(host => {
      const bubbles = host.shadowRoot?.querySelectorAll('bubble-morph') || [];
      
      bubbles.forEach(bubble => {
        totalBubbles++;
        const slug = bubble.entityData?.slug;
        
        if (this.matchedSlugs.has(slug)) {
          // Matched - highlight
          bubble.isHighlighted = true;
          bubble.setAttribute('is-highlighted', '');
          bubble.style.opacity = '';
          bubble.style.filter = '';
          highlightedCount++;
        } else {
          // Not matched - dim
          bubble.isHighlighted = false;
          bubble.removeAttribute('is-highlighted');
          bubble.style.opacity = '0.3';
          bubble.style.filter = 'grayscale(0.5)';
        }
      });
    });

    console.log(`[BubbleSearchReactor] Highlighted ${highlightedCount}/${totalBubbles} bubbles`);
  }

  /**
   * Clear all highlights
   */
  clearHighlights() {
    const bubbleHosts = document.querySelectorAll('bubble-host');
    
    bubbleHosts.forEach(host => {
      const bubbles = host.shadowRoot?.querySelectorAll('bubble-morph') || [];
      
      bubbles.forEach(bubble => {
        bubble.isHighlighted = false;
        bubble.removeAttribute('is-highlighted');
        bubble.style.opacity = '';
        bubble.style.filter = '';
      });
    });

    this.matchedSlugs.clear();
    console.log('[BubbleSearchReactor] Cleared all highlights');
  }

  /**
   * Remove reactor
   */
  remove() {
    this.clearHighlights();
    console.log('[BubbleSearchReactor] Removed');
  }
}
