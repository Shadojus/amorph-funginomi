/**
 * 🔍 SEARCH FILTER CONTROLLER
 * ============================
 * 
 * Client-side controller that filters fungus cards based on Convex search results
 * Works with statically rendered Astro pages
 * 
 * Usage in Astro:
 * <script type="module">
 *   import { SearchFilterController } from '@/amorph/features/search-system/SearchFilterController.js';
 *   new SearchFilterController('.fungi-grid', '.fungus-card');
 * </script>
 * 
 * Features:
 * - Listens to 'convex-search:completed' events
 * - Shows/hides cards based on search results
 * - Animates filtering for smooth UX
 * - Updates BubbleView with filtered data
 */

export class SearchFilterController {
  constructor(containerSelector = '.fungi-grid', cardSelector = '.fungus-card') {
    this.containerSelector = containerSelector;
    this.cardSelector = cardSelector;
    this.container = null;
    this.allCards = [];
    this.filteredSlugs = new Set();
    this.isFiltering = false;
    this.matchedFields = {}; // Store matched fields per fungus
    this.currentQuery = '';
    this.styleElement = null;
    
    this.init();
  }
  
  /**
   * Initialize controller
   */
  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  /**
   * Setup controller
   */
  setup() {
    // Get container
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.warn(`[SearchFilterController] Container not found: ${this.containerSelector}`);
      return;
    }
    
    // Get all cards
    this.allCards = Array.from(document.querySelectorAll(this.cardSelector));
    console.log(`[SearchFilterController] Found ${this.allCards.length} cards`);
    
    // Extract slugs from cards
    this.allCards.forEach(card => {
      const slug = this.getCardSlug(card);
      if (slug) {
        card.dataset.slug = slug;
      }
    });
    
    // Listen for search events
    this.setupEventListeners();
    
    // Inject highlight styles
    this.injectHighlightStyles();
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener('convex-search:completed', (event) => {
      this.handleSearchResults(event.detail);
    });
    
    window.addEventListener('convex-search:reset', () => {
      this.showAllCards();
    });
    
    console.log('[SearchFilterController] ✅ Listening for search events');
  }
  
  /**
   * Handle search results
   */
  handleSearchResults(searchData) {
    const { results, query, totalResults, matchedFields, scores } = searchData;
    
    console.log(`[SearchFilterController] Filtering ${this.allCards.length} cards to ${totalResults} results`);
    
    // Store current query and matched fields
    this.currentQuery = query || '';
    this.matchedFields = matchedFields || {};
    this.scores = scores || {};
    
    // If no query or empty results, show all
    if (!query || query.trim().length < 2) {
      this.showAllCards();
      return;
    }
    
    // Extract slugs from results
    this.filteredSlugs = new Set(
      results.map(fungus => fungus.seoName || fungus.slug).filter(Boolean)
    );
    
    // Filter cards
    this.filterCards();
    
    // Highlight matched morphs
    if (this.currentQuery) {
      this.highlightMatches();
    }
    
    // Update BubbleView if it exists
    this.updateBubbleView(results);
  }
  
  /**
   * Filter cards based on search results
   */
  filterCards() {
    this.isFiltering = true;
    
    this.allCards.forEach(card => {
      const slug = card.dataset.slug;
      const shouldShow = this.filteredSlugs.has(slug);
      
      if (shouldShow) {
        this.showCard(card);
      } else {
        this.hideCard(card);
      }
    });
  }
  
  /**
   * Show all cards (reset filter)
   */
  showAllCards() {
    console.log('[SearchFilterController] Showing all cards');
    this.isFiltering = false;
    this.filteredSlugs.clear();
    this.currentQuery = '';
    this.matchedFields = {};
    this.scores = {};
    
    // Clear highlights
    this.clearHighlights();
    
    this.allCards.forEach(card => {
      this.showCard(card);
    });
    
    // Reset BubbleView to show all
    this.updateBubbleView(null);
  }
  
  /**
   * Show a card with animation
   */
  showCard(card) {
    card.style.display = '';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Animate in
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  /**
   * Hide a card with animation
   */
  hideCard(card) {
    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      card.style.display = 'none';
    }, 200);
  }
  
  /**
   * Get slug from card
   */
  getCardSlug(card) {
    // Try data attribute
    if (card.dataset.slug) return card.dataset.slug;
    
    // Try to extract from link
    const link = card.querySelector('a[href*="/fungi/"]');
    if (link) {
      const match = link.href.match(/\/fungi\/([^/]+)/);
      if (match) return match[1];
    }
    
    // Try to extract from image
    const img = card.querySelector('image-morph');
    if (img && img.src) {
      const match = img.src.match(/\/fungi\/([^/.]+)/);
      if (match) return match[1];
    }
    
    // Try name-morph
    const nameMorph = card.querySelector('name-morph');
    if (nameMorph && nameMorph.value) {
      // Convert name to slug
      return nameMorph.value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    }
    
    return null;
  }
  
  /**
   * Update BubbleView with filtered data
   */
  updateBubbleView(results) {
    const bubbleHost = document.querySelector('bubble-host');
    if (!bubbleHost) return;
    
    // Dispatch event for BubbleView to re-render
    window.dispatchEvent(new CustomEvent('search-filter:updated', {
      detail: {
        results: results || [],
        isFiltering: this.isFiltering,
        filteredSlugs: Array.from(this.filteredSlugs),
      }
    }));
  }
  
  /**
   * Get currently visible cards
   */
  getVisibleCards() {
    return this.allCards.filter(card => card.style.display !== 'none');
  }
  
  /**
   * Get current filter state
   */
  getState() {
    return {
      isFiltering: this.isFiltering,
      totalCards: this.allCards.length,
      visibleCards: this.getVisibleCards().length,
      filteredSlugs: Array.from(this.filteredSlugs),
      currentQuery: this.currentQuery,
    };
  }
  
  /**
   * Inject highlight styles
   */
  injectHighlightStyles() {
    if (this.styleElement) return;
    
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      /* Set CSS variable for highlighted morphs - DataMorph will use this */
      .search-highlight-morph {
        --search-highlight: 1;
      }
      
      @keyframes search-highlight-pulse {
        0%, 100% {
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }
  
  /**
   * Highlight matched morphs in visible cards
   */
  highlightMatches() {
    if (!this.currentQuery) return;
    
    const query = this.currentQuery.toLowerCase().trim();
    console.log(`[SearchFilterController] 🎨 Highlighting morphs containing: "${query}"`);
    
    // Clear previous highlights first
    this.clearHighlights();
    
    let firstHighlightedMorph = null;
    
    this.allCards.forEach(card => {
      const slug = card.dataset.slug;
      if (!slug || !this.filteredSlugs.has(slug)) return;
      
      // Find all data-morphs in this card
      const morphs = card.querySelectorAll('data-morph[data-morph="true"]');
      
      let cardHasMatches = false;
      
      morphs.forEach(morph => {
        // Get fungus data from the morph (it stores the full fungus object)
        const fungusDataAttr = morph.getAttribute('fungus-data');
        const field = morph.getAttribute('field');
        
        if (!fungusDataAttr || !field) return;
        
        try {
          // Parse the fungus data JSON
          const fungusData = JSON.parse(fungusDataAttr);
          
          // Get value from the field path (e.g., "edibility" or "ecologyAndHabitat.seasonality.primarySeason")
          const fieldValue = this.getNestedValue(fungusData, field);
          
          // Convert value to searchable string
          const valueStr = this.valueToString(fieldValue).toLowerCase();
          
          // Check if value contains the search query
          if (valueStr.includes(query)) {
            morph.classList.add('search-highlight-morph');
            cardHasMatches = true;
            
            // Store first highlighted morph for scrolling
            if (!firstHighlightedMorph) {
              firstHighlightedMorph = morph;
            }
            
            console.log(`[SearchFilterController] ✨ Highlighted field "${field}" in ${slug}:`, valueStr.substring(0, 50));
          }
        } catch (e) {
          console.warn(`[SearchFilterController] Failed to parse morph data:`, e);
        }
      });
      
      // Only highlight card if we found matching morphs
      if (cardHasMatches) {
        card.classList.add('search-highlight-card');
      }
    });
    
    // Scroll first highlighted morph into view
    if (firstHighlightedMorph) {
      setTimeout(() => {
        firstHighlightedMorph.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        console.log('[SearchFilterController] 📍 Scrolled to first match');
      }, 300); // Wait for card animations to complete
    }
  }
  
  /**
   * Get nested object value by dot-notation path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  /**
   * Convert any value to searchable string
   */
  valueToString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'yes' : 'no';
    if (Array.isArray(value)) return value.map(v => this.valueToString(v)).join(' ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  
  /**
   * Clear all highlights
   */
  clearHighlights() {
    document.querySelectorAll('.search-highlight-morph').forEach(el => {
      el.classList.remove('search-highlight-morph');
    });
    
    document.querySelectorAll('.search-highlight-card').forEach(el => {
      el.classList.remove('search-highlight-card');
    });
  }
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined') {
  window.SearchFilterController = SearchFilterController;
  console.log('[SearchFilterController] 📦 Available globally');
}
