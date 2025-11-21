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
    
    // Listen for deep mode rendering completion
    window.addEventListener('data-morph:deep-mode-ready', (event) => {
      const { query } = event.detail || {};
      console.log('[SearchFilterController] 🎨 Deep mode ready, starting highlighting immediately');
      
      // Re-apply highlighting now that deep mode is rendered
      if (this.currentQuery) {
        this.highlightMatches();
      }
    });
    
    console.log('[SearchFilterController] ✅ Listening for search events');
  }
  
  /**
   * Handle search results
   */
  handleSearchResults(searchData) {
    const { results, query, totalResults, matchedFields, scores } = searchData;
    
    console.log(`[SearchFilterController] 🔍 Filtering: "${query}" → ${totalResults || 0} matches from ${this.allCards.length} cards`);
    
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
    
    // NOTE: Don't highlight immediately - wait for data-morph:deep-mode-ready event
    // This ensures DataMorphs have finished rendering deep mode content
    console.log('[SearchFilterController] ⏱️ Waiting for deep mode rendering before highlighting...');
    
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
    console.log(`[SearchFilterController] 📄 Showing all ${this.allCards.length} cards (filter cleared)`);
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
      /* Text-level search highlighting */
      .search-highlight-text {
        background: linear-gradient(90deg, rgba(250, 204, 21, 0.4), rgba(251, 191, 36, 0.5));
        color: rgba(255, 255, 255, 0.95);
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 600;
        box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.3);
        animation: search-text-pulse 2s ease-in-out infinite;
      }
      
      @keyframes search-text-pulse {
        0%, 100% {
          background: linear-gradient(90deg, rgba(250, 204, 21, 0.35), rgba(251, 191, 36, 0.45));
          box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.2);
        }
        50% {
          background: linear-gradient(90deg, rgba(250, 204, 21, 0.5), rgba(251, 191, 36, 0.6));
          box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.4), 0 0 8px rgba(250, 204, 21, 0.3);
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
    console.log(`[SearchFilterController] 🎨 Highlighting text containing: "${query}"`);
    
    // Clear previous highlights first
    this.clearHighlights();
    
    let totalHighlights = 0;
    const highlightedElements = []; // Track first highlighted element per card for scrolling
    
    this.allCards.forEach(card => {
      const slug = card.dataset.slug;
      if (!slug || !this.filteredSlugs.has(slug)) return;
      
      let cardFirstHighlight = null;
      
      // Find ALL morphs in this card (specialized morphs + data-morph)
      const allMorphSelectors = [
        'name-morph',
        'text-morph', 
        'tag-morph',
        'boolean-morph',
        'number-morph',
        'list-morph',
        'data-morph',
        '.morph-field' // Wrapper divs
      ];
      
      const morphs = card.querySelectorAll(allMorphSelectors.join(', '));
      
      morphs.forEach(morph => {
        // Skip hidden elements
        if (morph.style.display === 'none') return;
        
        // Highlight text within this element's shadow DOM or regular DOM
        const highlightedCount = this.highlightTextInElement(morph, query);
        
        if (highlightedCount > 0) {
          totalHighlights += highlightedCount;
          
          // Track first highlighted element per card
          if (!cardFirstHighlight) {
            cardFirstHighlight = morph;
          }
        }
      });
      
      // Store first highlight for this card
      if (cardFirstHighlight) {
        highlightedElements.push(cardFirstHighlight);
      }
    });
    
    console.log(`[SearchFilterController] ✨ Highlighted ${totalHighlights} text matches in ${highlightedElements.length} cards`);
    
    // Auto-scroll: scroll first highlighted element into view for each card
    if (highlightedElements.length > 0) {
      setTimeout(() => {
        highlightedElements.forEach(element => {
          const cardData = element.closest('.card-data');
          if (cardData) {
            // Scroll the element into view within its card-data container
            const elementTop = element.offsetTop;
            cardData.scrollTop = Math.max(0, elementTop - 20); // 20px offset from top
          }
        });
        console.log(`[SearchFilterController] 📍 Auto-scrolled ${highlightedElements.length} cards to first match`);
      }, 200); // Slightly longer delay to ensure rendering is complete
    }
  }
  
  /**
   * Highlight matching text within an element (works with Shadow DOM)
   * ONLY highlights exact text matches, not entire elements
   */
  highlightTextInElement(element, query) {
    let highlightCount = 0;
    
    // Check if element uses Shadow DOM
    const root = element.shadowRoot || element;
    
    // Find all text nodes that might contain the query
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style tags
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'style') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip empty nodes
          const text = node.textContent;
          if (!text || text.trim().length === 0) return NodeFilter.FILTER_REJECT;
          
          // ONLY accept if this specific text contains the query (case-insensitive)
          if (!text.toLowerCase().includes(query)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // Highlight matching text in each text node
    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      const lowerText = text.toLowerCase();
      
      // Double-check (should always pass due to filter above)
      if (!lowerText.includes(query)) return;
      
      // Create a temporary container to build highlighted HTML
      const parent = textNode.parentElement;
      if (!parent) return;
      
      // Split text and wrap matches in span
      const parts = [];
      let lastIndex = 0;
      let searchIndex = 0;
      
      while ((searchIndex = lowerText.indexOf(query, lastIndex)) !== -1) {
        // Add text before match
        if (searchIndex > lastIndex) {
          parts.push(document.createTextNode(text.substring(lastIndex, searchIndex)));
        }
        
        // Add highlighted match
        const matchSpan = document.createElement('span');
        matchSpan.className = 'search-highlight-text';
        matchSpan.textContent = text.substring(searchIndex, searchIndex + query.length);
        parts.push(matchSpan);
        
        highlightCount++;
        lastIndex = searchIndex + query.length;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(document.createTextNode(text.substring(lastIndex)));
      }
      
      // Replace original text node with highlighted parts
      if (parts.length > 0) {
        parts.forEach(part => parent.insertBefore(part, textNode));
        parent.removeChild(textNode);
      }
    });
    
    return highlightCount;
  }
  
  /**
   * Get nested object value by dot-notation path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  /**
   * Convert any value to searchable string - DEEP RECURSIVE
   */
  valueToString(value, depth = 0) {
    if (value === null || value === undefined) return '';
    if (depth > 5) return ''; // Prevent infinite recursion
    
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'yes' : 'no';
    
    // Array → recursively convert each item
    if (Array.isArray(value)) {
      return value.map(v => this.valueToString(v, depth + 1)).join(' ');
    }
    
    // Object → recursively extract all string values
    if (typeof value === 'object') {
      const allValues = [];
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const nestedValue = this.valueToString(value[key], depth + 1);
          if (nestedValue) allValues.push(nestedValue);
        }
      }
      return allValues.join(' ');
    }
    
    return String(value);
  }
  
  /**
   * Clear all highlights
   */
  clearHighlights() {
    // Remove old-style morph highlights (if any)
    document.querySelectorAll('.search-highlight-morph').forEach(el => {
      el.classList.remove('search-highlight-morph');
    });
    
    document.querySelectorAll('.search-highlight-card').forEach(el => {
      el.classList.remove('search-highlight-card');
    });
    
    // Remove text-level highlights from regular DOM
    document.querySelectorAll('.search-highlight-text').forEach(span => {
      const parent = span.parentNode;
      if (parent) {
        // Replace span with its text content
        parent.replaceChild(document.createTextNode(span.textContent), span);
        // Normalize to merge adjacent text nodes
        parent.normalize();
      }
    });
    
    // Remove text-level highlights from Shadow DOM (ALL morph types)
    const allMorphTypes = [
      'name-morph',
      'text-morph',
      'tag-morph',
      'boolean-morph',
      'number-morph',
      'list-morph',
      'data-morph',
      'image-morph'
    ];
    
    allMorphTypes.forEach(morphType => {
      document.querySelectorAll(morphType).forEach(morph => {
        if (morph.shadowRoot) {
          morph.shadowRoot.querySelectorAll('.search-highlight-text').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
              parent.replaceChild(document.createTextNode(span.textContent), span);
              parent.normalize();
            }
          });
        }
      });
    });
  }
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined') {
  window.SearchFilterController = SearchFilterController;
  console.log('[SearchFilterController] 📦 Available globally');
}
