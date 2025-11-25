/**
 * 🔍 SEARCH FILTER CONTROLLER
 * ============================
 * 
 * Client-side controller that filters entity cards based on Convex search results
 * Works with statically rendered Astro pages
 * 
 * Usage in Astro:
 * <script type="module">
 *   import { SearchFilterController } from '@/amorph/features/search-system/SearchFilterController.js';
 *   new SearchFilterController('.entity-grid', '.entity-card');
 * </script>
 * 
 * Features:
 * - Listens to 'convex-search:completed' events
 * - Shows/hides cards based on search results
 * - Animates filtering for smooth UX
 * - Updates BubbleView with filtered data
 */

export class SearchFilterController {
  constructor(containerSelector = '.entity-grid', cardSelector = '.entity-card') {
    this.containerSelector = containerSelector;
    this.cardSelector = cardSelector;
    this.container = null;
    this.allCards = [];
    this.filteredSlugs = new Set();
    this.isFiltering = false;
    this.matchedFields = {}; // Store matched fields per entity
    this.currentQuery = '';
    this.styleElement = null;
    this.highlightTimer = null; // Debounce timer for highlighting
    
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
    
    // Listen for deep mode rendering completion (legacy event from MorphHeader)
    window.addEventListener('data-morph:deep-mode-ready', (event) => {
      const { query } = event.detail || {};
      console.log('[SearchFilterController] 🎨 Deep mode ready (MorphHeader), starting highlighting');
      
      // Only re-highlight if we're not already highlighting
      // This prevents clearing highlights during perspective auto-activation
      if (this.currentQuery && !this._isHighlighting) {
        this.debouncedHighlight();
      } else if (this._isHighlighting) {
        console.log('[SearchFilterController] ⏭️ Skipping deep-mode-ready highlight (already in progress)');
      }
    });
    
    // NEW: Listen for individual DataMorph rendering completion
    window.addEventListener('data-morph:rendering-complete', (event) => {
      const { field, morph } = event.detail || {};
      
      // Re-apply highlighting to this specific morph if search is active
      if (this.currentQuery && morph) {
        console.log('[SearchFilterController] 🎨 Re-highlighting morph after rendering:', field);
        this.highlightTextInElement(morph, this.currentQuery.toLowerCase().trim());
      }
    });
    
    // Listen for perspective changes to re-highlight newly visible morphs
    window.addEventListener('perspective-changed', (event) => {
      // Skip if no search is active
      if (!this.currentQuery || this.currentQuery.trim().length < 2) return;
      
      const detail = event.detail || {};
      
      // For AUTO-ACTIVATION: Skip here, wait for deep-mode-ready (MorphHeader will trigger it)
      // For MANUAL SWITCH: Re-highlight immediately
      if (detail.source === 'search-auto-activation') {
        console.log('[SearchFilterController] ⏭️ Auto-activation - waiting for deep-mode-ready to highlight + scroll');
        return;
      }
      
      // Cancel any pending highlights to prevent duplicates
      if (this._perspectiveChangeTimeout) {
        clearTimeout(this._perspectiveChangeTimeout);
      }
      
      // MANUAL perspective switch while search is active → re-highlight + scroll
      this._perspectiveChangeTimeout = setTimeout(() => {
        console.log('[SearchFilterController] 🎨 Re-highlighting after MANUAL perspective change');
        this.highlightMatches(); // This includes scroll
      }, 600); // Delay to ensure morphs are fully visible
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
    
    // Mark container as search-active to disable PerspectiveReactor highlighting
    if (this.container) {
      this.container.dataset.searchActive = query ? 'true' : 'false';
    }
    
    // If no query or empty results, show all
    if (!query || query.trim().length < 2) {
      this.showAllCards();
      return;
    }
    
    // Extract slugs from results using the configured slug field
    const slugField = window.amorph?.domainConfig?.dataSource?.slugField || 'slug';
    
    this.filteredSlugs = new Set(
      results.map(entity => entity[slugField]).filter(Boolean)
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
    
    // Use debounced highlighting to prevent freezing during typing/deleting
    this.debouncedHighlight();
  }
  
  /**
   * Show all cards (reset filter)
   */
  showAllCards() {
    console.log(`[SearchFilterController] 📄 Showing all cards`);
    this.isFiltering = false;
    this.filteredSlugs.clear();
    this.currentQuery = '';
    this.matchedFields = {};
    this.scores = {};
    
    // Clear any pending highlight timers
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
      this.highlightTimer = null;
    }
    
    // Clear search-active flag to re-enable PerspectiveReactor
    if (this.container) {
      this.container.dataset.searchActive = 'false';
    }
    
    // Clear highlights
    this.clearHighlights();
    
    // Simple show - no animation
    this.allCards.forEach(card => {
      card.style.display = '';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  /**
   * Show a card (no animation)
   */
  showCard(card) {
    card.style.display = '';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }
  
  /**
   * Hide a card (no animation)
   */
  hideCard(card) {
    card.style.display = 'none';
  }
  
  /**
   * Get slug from card
   */
  getCardSlug(card) {
    // Try data attribute
    if (card.dataset.slug) return card.dataset.slug;
    
    // Try to extract from link
    const domain = window.amorph?.domainConfig?.instance?.domain || 'entity';
    const link = card.querySelector(`a[href*="/${domain}/"]`);
    if (link) {
      const regex = new RegExp(`\/${domain}\/([^/]+)`);
      const match = link.href.match(regex);
      if (match) return match[1];
    }
    
    // Try to extract from image
    const img = card.querySelector('image-morph');
    if (img && img.src) {
      const domain = window.amorph?.domainConfig?.instance?.domain || 'entity';
      const regex = new RegExp(`\/${domain}\/([^/.]+)`);
      const match = img.src.match(regex);
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
   * Debounced highlight - prevents freezing during rapid typing/deleting
   */
  debouncedHighlight() {
    // Clear existing timer
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
    }
    
    // Schedule new highlighting after 300ms of no typing
    // (clearHighlights will be called inside highlightMatches)
    this.highlightTimer = setTimeout(() => {
      this.highlightMatches();
    }, 300);
  }
  
  /**
   * Highlight matched morphs in visible cards
   */
  highlightMatches() {
    if (!this.currentQuery) return;
    
    // CRITICAL: Prevent duplicate highlighting while one is already in progress
    if (this._isHighlighting) {
      console.log('[SearchFilterController] ⏭️ Skipping duplicate highlight (already in progress)');
      return;
    }
    
    this._isHighlighting = true;
    
    // Clear old highlights FIRST, before creating new ones
    this.clearHighlights();
    
    const query = this.currentQuery.toLowerCase().trim();
    console.log(`[SearchFilterController] 🎨 Highlighting text containing: "${query}"`, {
      filteredSlugs: Array.from(this.filteredSlugs),
      allCardsCount: this.allCards.length,
      cardSlugs: this.allCards.map(c => c.dataset.slug)
    });
    
    let totalHighlights = 0;
    let cardsProcessed = 0;
    const highlightedElements = []; // Track first highlighted element per card for scrolling
    
    this.allCards.forEach(card => {
      const slug = card.dataset.slug;
      if (!slug || !this.filteredSlugs.has(slug)) {
        console.log(`[SearchFilterController] ⏭️ Skipping card: slug="${slug}", inFilteredSlugs=${this.filteredSlugs.has(slug)}`);
        return;
      }
      cardsProcessed++;
      
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
      console.log(`[SearchFilterController] 🔍 Card ${slug}: found ${morphs.length} morphs`);
      
      let morphsChecked = 0;
      let morphsSkippedHidden = 0;
      let morphsSkippedPerspective = 0;
      
      morphs.forEach(morph => {
        morphsChecked++;
        
        // Skip hidden elements (display:none = not in active perspective)
        if (morph.style.display === 'none') {
          morphsSkippedHidden++;
          return;
        }
        
        // CRITICAL: Skip morphs from inactive perspectives
        // Check if morph has perspective attribute and if it's in active perspectives
        const morphPerspective = morph.getAttribute('perspective');
        if (morphPerspective) {
          // Get active perspectives from AMORPH state
          const activePerspectives = window.amorph?.state?.activePerspectives || [];
          const activePerspectiveNames = activePerspectives.map(p => p.name || p);
          
          // Skip if this morph's perspective is not active
          if (!activePerspectiveNames.includes(morphPerspective)) {
            morphsSkippedPerspective++;
            return;
          }
        }
        
        // Highlight text within this element's shadow DOM or regular DOM
        const highlightedCount = this.highlightTextInElement(morph, query);
        
        if (highlightedCount > 0) {
          console.log(`[SearchFilterController] ✅ Highlighted ${highlightedCount} matches in`, morph.tagName, morphPerspective || 'no-perspective');
        }
        
        if (highlightedCount > 0) {
          totalHighlights += highlightedCount;
          
          // Track first highlighted element per card (only from active perspectives!)
          if (!cardFirstHighlight) {
            cardFirstHighlight = morph;
          }
        }
      });
      
      console.log(`[SearchFilterController] 📊 Card ${slug} summary:`, {
        morphsChecked,
        morphsSkippedHidden,
        morphsSkippedPerspective,
        morphsProcessed: morphsChecked - morphsSkippedHidden - morphsSkippedPerspective
      });
      
      // Store first highlight for this card
      if (cardFirstHighlight) {
        highlightedElements.push(cardFirstHighlight);
      }
    });
    
    console.log(`[SearchFilterController] ✨ Highlighted ${totalHighlights} text matches in ${highlightedElements.length} cards`);
    
    // Auto-scroll: scroll within card-data container ONLY (no page scroll)
    if (highlightedElements.length > 0) {
      // Cancel any pending scroll from previous highlight
      if (this._scrollTimeout) {
        clearTimeout(this._scrollTimeout);
      }
      
      // Wait for highlights to render in DOM, THEN scroll
      this._scrollTimeout = setTimeout(() => {
        let scrolledCount = 0;
        
        highlightedElements.forEach(element => {
          // Find the card-data container for this morph
          const cardData = element.closest('.card-data');
          if (!cardData) {
            console.warn('[SearchFilterController] ⚠️ No card-data container found for element:', element);
            return;
          }
          
          // Find the first highlight element (actual highlighted text) within this morph
          let highlightElement = null;
          
          // Try regular DOM first
          highlightElement = element.querySelector('.search-highlight-text');
          console.log('[SearchFilterController] 🔍 Search in regular DOM:', {
            found: !!highlightElement,
            morphType: element.tagName,
            hasShadowRoot: !!element.shadowRoot
          });
          
          // If no highlight found directly, check shadow DOM
          if (!highlightElement && element.shadowRoot) {
            highlightElement = element.shadowRoot.querySelector('.search-highlight-text');
            console.log('[SearchFilterController] 🔍 Search in shadow DOM:', {
              found: !!highlightElement
            });
          }
          
          // If still not found, try within nested elements (including their shadow DOMs)
          if (!highlightElement) {
            const nestedElements = element.querySelectorAll('*');
            console.log('[SearchFilterController] 🔍 Searching nested elements:', {
              nestedCount: nestedElements.length,
              nestedWithShadow: Array.from(nestedElements).filter(n => n.shadowRoot).length
            });
            
            for (const nested of nestedElements) {
              if (nested.shadowRoot) {
                highlightElement = nested.shadowRoot.querySelector('.search-highlight-text');
                if (highlightElement) {
                  console.log('[SearchFilterController] ✅ Found in nested shadow DOM:', nested.tagName);
                  break;
                }
              }
            }
          }
          
          // Use the highlight element if found, otherwise fall back to morph element
          const scrollTarget = highlightElement || element;
          
          console.log('[SearchFilterController] 🎯 Scrolling to:', {
            hasHighlightElement: !!highlightElement,
            morphType: element.tagName,
            targetElement: scrollTarget.tagName || 'SPAN'
          });
          
          // Calculate position relative to card-data container using offsetTop
          // This is more reliable than getBoundingClientRect for elements in complex layouts
          let elementTop = 0;
          let currentElement = scrollTarget;
          
          // Walk up the DOM tree to calculate total offset
          while (currentElement && currentElement !== cardData) {
            elementTop += currentElement.offsetTop || 0;
            currentElement = currentElement.offsetParent;
            
            // Break if we've left the card-data container
            if (currentElement && !cardData.contains(currentElement)) break;
          }
          
          const containerHeight = cardData.clientHeight;
          const elementHeight = scrollTarget.offsetHeight || 50; // Fallback to 50px
          
          // Center the element in the visible area
          const scrollTarget_value = Math.max(0, elementTop - (containerHeight / 2) + (elementHeight / 2));
          
          console.log('[SearchFilterController] 📏 Scroll calculation:', {
            elementTop,
            containerHeight,
            elementHeight,
            scrollTarget: scrollTarget_value,
            currentScroll: cardData.scrollTop
          });
          
          // Smooth scroll within container
          cardData.scrollTo({
            top: scrollTarget_value,
            behavior: 'smooth'
          });
          
          scrolledCount++;
        });
        
        console.log(`[SearchFilterController] 📍 Auto-scrolled ${scrolledCount} cards to first highlight (container-only)`);
        
        // Reset highlighting flag after scroll completes
        setTimeout(() => {
          this._isHighlighting = false;
        }, 600); // Extra delay for smooth scroll to complete
      }, 500); // Longer delay to ensure highlights are fully rendered
    } else {
      // No highlights found, reset flag immediately
      this._isHighlighting = false;
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
    console.log('[SearchFilterController] 🧹 Clearing all highlights');
    
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
