/**
 * 🫧 BUBBLE HOST
 * ==============
 * 
 * Host component for displaying data in bubble/force-directed view
 * DATENGETRIEBEN - bekommt Fungi-Daten, nicht DOM-Morphs!
 * 
 * Usage:
 * <bubble-host></bubble-host>
 * 
 * In Astro:
 * <bubble-host id="bubble-view-host"></bubble-host>
 * <script>
 *   const bubbleHost = document.getElementById('bubble-view-host');
 *   bubbleHost.setData(fungiData);
 * </script>
 * 
 * Props:
 * - height: Container height (default: 600px)
 */

import { LitElement, html, css } from 'lit';

class BubbleHost extends LitElement {
  static properties = {
    height: { type: String },
    data: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: var(--bubble-height, 600px);
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      background: #000000;
    }

    bubble-view {
      width: 100%;
      height: 100%;
      display: block;
    }

    .bubble-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.5rem;
    }
  `;

  constructor() {
    super();
    this.height = '600px';
    this.data = []; // Cached data for dynamic morph creation
    this.activeBubbles = new Map(); // slug -> bubble-morph element
    this.amorph = null;
    this.bubbleView = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH instance
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
      
      // Listen to perspective changes - update visible data in bubbles
      this.amorph.on('perspective-changed', this.handlePerspectiveChanged.bind(this));
    }

    // Listen to convex-search:completed (has results array with full fungus objects)
    // This is dispatched directly to window, not through AMORPH event system
    this.boundHandleSearchCompleted = this.handleSearchCompleted.bind(this);
    window.addEventListener('convex-search:completed', this.boundHandleSearchCompleted);
    
    // Also listen to Astro search as fallback
    if (this.amorph) {
      this.amorph.on('amorph:astro-search:completed', this.handleAstroSearchCompleted.bind(this));
    }

    console.log('[BubbleHost] 🫧 Connected - USER NODE only mode, waiting for search/perspective events');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove window event listener
    if (this.boundHandleSearchCompleted) {
      window.removeEventListener('convex-search:completed', this.boundHandleSearchCompleted);
    }
    
    if (this.amorph) {
      this.amorph.off('amorph:astro-search:completed', this.handleAstroSearchCompleted.bind(this));
      this.amorph.off('perspective-changed', this.handlePerspectiveChanged.bind(this));
    }
  }

  firstUpdated() {
    // Get bubble-view element
    this.bubbleView = this.shadowRoot.querySelector('bubble-view');
    
    // If we already have data, create morphs
    if (this.data.length > 0) {
      this.createMorphsFromData();
    }
  }

  /**
   * Set data (Fungi objects from Convex)
   * Only CACHES data - does NOT create bubbles automatically!
   * Bubbles are created dynamically via search/perspective events
   */
  setData(data) {
    // Normalize data structure: flatten names.common/scientific to commonName/scientificName
    const normalizeData = (fungi) => {
      return fungi.map(fungus => ({
        ...fungus,
        commonName: fungus.names?.common || fungus.commonName,
        scientificName: fungus.names?.scientific || fungus.scientificName
      }));
    };
    
    this.data = normalizeData(Array.isArray(data) ? data : [data]);
    console.log(`[BubbleHost] 📦 Data cached: ${this.data.length} fungi available for dynamic creation`);
    
    // Pass to BubbleView for similarity calculations
    const waitForBubbleView = () => {
      this.bubbleView = this.shadowRoot?.querySelector('bubble-view');
      
      if (this.bubbleView) {
        this.bubbleView.setCachedData(this.data);
        console.log('[BubbleHost] ✅ Data passed to BubbleView');
      } else {
        setTimeout(waitForBubbleView, 50);
      }
    };
    
    waitForBubbleView();
  }

  /**
   * Handle search completed - create bubbles for matched fungi
   */
  handleSearchCompleted(event) {
    const detail = event.detail || {};
    const query = detail.query || '';
    
    // Extract slugs and scores from results (ConvexSearchReactor provides comprehensive data)
    let matchedSlugs = [];
    const rawScores = detail.scores || {}; // _id → numeric score from Convex
    const rawMatchedFields = detail.matchedFields || {}; // _id → array of matched field paths
    
    // Map scores from Convex _id to slug
    const scores = {};
    const matchedFields = {};
    
    if (detail.results && Array.isArray(detail.results)) {
      detail.results.forEach(fungus => {
        if (fungus.slug && fungus._id) {
          matchedSlugs.push(fungus.slug);
          scores[fungus.slug] = rawScores[fungus._id] || 0;
          matchedFields[fungus.slug] = rawMatchedFields[fungus._id] || [];
        }
      });
    } else if (detail.matchedSlugs && Array.isArray(detail.matchedSlugs)) {
      // Fallback for other reactors that might emit slugs directly
      matchedSlugs = detail.matchedSlugs;
    }
    
    if (!matchedSlugs || matchedSlugs.length === 0) {
      console.log(`[BubbleHost] 🔍 Search "${query}" → 0 matches, clearing bubbles`);
      this.clearAllBubbles();
      return;
    }
    
    console.log(`[BubbleHost] 🔍 Search "${query}" → ${matchedSlugs.length} matches: ${matchedSlugs.join(', ')}`);
    this.createBubblesForSlugs(matchedSlugs, scores, matchedFields);
  }

  /**
   * Handle Astro search completed (alternative event)
   */
  handleAstroSearchCompleted(event) {
    console.log('[BubbleHost] 🔍 Astro search completed:', event);
    
    const detail = event.detail || {};
    
    // Extract slugs from matched containers (AstroDataSearchReactor doesn't provide results)
    // We need to get slugs from visible containers or let regular search:completed handle it
    let matchedSlugs = detail.matchedSlugs || [];
    
    if (!matchedSlugs || matchedSlugs.length === 0) {
      return; // Let regular search:completed handle it
    }
    
    console.log('[BubbleHost] Creating bubbles for astro search slugs:', matchedSlugs);
    this.createBubblesForSlugs(matchedSlugs);
  }

  /**
   * Handle perspective changed - update visible fields in existing bubbles
   */
  handlePerspectiveChanged(event) {
    console.log('[BubbleHost] 🎨 Perspective changed:', event);
    
    const { perspectives } = event.detail || {};
    if (!perspectives) return;
    
    // Update all active bubbles with new perspectives
    this.activeBubbles.forEach((bubbleMorph, slug) => {
      bubbleMorph.activePerspectives = perspectives;
    });
    
    console.log(`[BubbleHost] Updated ${this.activeBubbles.size} bubbles with new perspectives`);
  }

  /**
   * Create bubbles for specific slugs (from search results)
   */
  createBubblesForSlugs(slugs, scores = {}, matchedFields = {}) {
    if (!this.data || this.data.length === 0) {
      console.warn('[BubbleHost] ⚠️ No cached data to create bubbles from');
      return;
    }

    // Import BubbleMorph if needed
    if (!customElements.get('bubble-morph')) {
      import('./morphs/BubbleMorph.js').then(() => {
        this.createBubbleMorphsForSlugs(slugs, scores, matchedFields);
      });
    } else {
      this.createBubbleMorphsForSlugs(slugs, scores, matchedFields);
    }
  }

  /**
   * Clear all active bubbles
   */
  clearAllBubbles() {
    const container = this.shadowRoot.querySelector('.morphs-container');
    if (container) {
      container.innerHTML = '';
    }
    
    this.activeBubbles.clear();
    console.log('[BubbleHost] 🧹 Cleared all bubbles');
  }

  /**
   * Create BubbleMorph ONLY for matched slugs (from search)
   */
  createBubbleMorphsForSlugs(slugs, scores = {}, matchedFields = {}) {
    const slugSet = new Set(slugs);
    
    // Get or create container
    let container = this.shadowRoot.querySelector('.morphs-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'morphs-container';
      this.shadowRoot.appendChild(container);
    }

    // Clear existing bubbles
    container.innerHTML = '';
    this.activeBubbles.clear();

    const viewWidth = this.bubbleView?.offsetWidth || 800;
    const viewHeight = this.bubbleView?.offsetHeight || 600;
    
    // RESPONSIVE: Adjust layout based on viewport size
    const isSmallScreen = viewWidth < 600;
    const isMediumScreen = viewWidth >= 600 && viewWidth < 1024;
    
    let radiusMultiplier = 0.3;
    let minSize = 80;
    let maxSize = 200;
    
    if (isSmallScreen) {
      radiusMultiplier = 0.25;  // Tighter circle
      minSize = 60;             // Smaller minimum
      maxSize = 120;            // Smaller maximum
    } else if (isMediumScreen) {
      radiusMultiplier = 0.28;
      minSize = 70;
      maxSize = 150;
    }
    
    // Viewport size range: ${minSize}-${maxSize}px
    
    // Get active perspectives from AMORPH state
    const activePerspectives = window.amorph?.state?.activePerspectives || 
      ['cultivationAndProcessing', 'chemicalAndProperties', 'medicinalAndHealth'];

    // Filter data to ONLY matched slugs
    const matchedFungi = this.data.filter(fungus => slugSet.has(fungus.slug));
    
    console.log(`[BubbleHost] 🎯 Creating ${matchedFungi.length} bubbles for matched slugs:`, Array.from(slugSet));

    // Map scores from Convex IDs to slugs (scores are keyed by _id, need to map to slug)
    const slugScores = {};
    const slugMatchedFields = {};
    
    matchedFungi.forEach(fungus => {
      // Scores are keyed by _id in ConvexSearchReactor
      const convexId = fungus._id;
      if (scores[convexId] !== undefined) {
        slugScores[fungus.slug] = scores[convexId];
      }
      if (matchedFields[convexId]) {
        slugMatchedFields[fungus.slug] = matchedFields[convexId];
      }
    });
    
    // Normalize scores to 0-1 range for sizing
    const maxScore = Math.max(...Object.values(slugScores), 1);
    
    // Create BubbleMorph ONLY for matched fungi
    matchedFungi.forEach((fungus, index) => {
      // Calculate position (circular layout around user node) - RESPONSIVE
      const angle = (index / matchedFungi.length) * Math.PI * 2;
      const radius = Math.min(viewWidth, viewHeight) * radiusMultiplier;
      const x = viewWidth / 2 + Math.cos(angle) * radius;
      const y = viewHeight / 2 + Math.sin(angle) * radius;

      // Calculate size based on search score - RESPONSIVE RANGE
      const rawScore = slugScores[fungus.slug] || maxScore * 0.1; // Default to 10% if no score
      const normalizedScore = maxScore > 0 ? rawScore / maxScore : 0.5;
      const size = minSize + (normalizedScore * (maxSize - minSize)); // Responsive range
      
      // Calculate color based on number of matched fields
      const fieldsCount = slugMatchedFields[fungus.slug]?.length || 0;
      let color = '#90CAF9'; // Default blue
      if (fieldsCount >= 4) {
        color = '#4CAF50'; // Green - excellent match (4+ fields)
      } else if (fieldsCount >= 2) {
        color = '#FFC107'; // Amber - good match (2-3 fields)
      } else if (fieldsCount >= 1) {
        color = '#FF9800'; // Orange - fair match (1 field)
      }

      // Create bubble morph
      const bubbleMorph = document.createElement('bubble-morph');
      bubbleMorph.fungusData = fungus;
      bubbleMorph.x = x;
      bubbleMorph.y = y;
      bubbleMorph.size = size; // Score-based sizing
      bubbleMorph.color = color; // Match-quality coloring
      bubbleMorph.searchScore = normalizedScore;
      bubbleMorph.matchedFields = slugMatchedFields[fungus.slug] || []; // Pass matched fields!
      bubbleMorph.setAttribute('data-slug', fungus.slug);
      bubbleMorph.activePerspectives = activePerspectives;
      
      // Bubble created: ${fungus.slug}
      
      container.appendChild(bubbleMorph);
      this.activeBubbles.set(fungus.slug, bubbleMorph);
    });

    console.log(`[BubbleHost] ✅ Created ${this.activeBubbles.size} BubbleMorphs with weighted sizes and colors`);

    // Notify BubbleView about active bubbles for similarity calculations
    // Pass slug-mapped scores and fields for connection weighting
    if (this.bubbleView) {
      this.bubbleView.setActiveBubbles(
        Array.from(this.activeBubbles.values()),
        slugScores,
        slugMatchedFields
      );
    }
  }

  /**
   * Update height CSS variable
   */
  updated(changedProperties) {
    if (changedProperties.has('height')) {
      this.style.setProperty('--bubble-height', this.height);
    }
  }

  render() {
    return html`
      ${this.data.length === 0 ? html`
        <div class="bubble-loading">
          🫧 Waiting for data...
        </div>
      ` : html`
        <bubble-view></bubble-view>
      `}
    `;
  }
}

customElements.define('bubble-host', BubbleHost);

export { BubbleHost };
