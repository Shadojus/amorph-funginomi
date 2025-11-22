/**
 * 📜 CARD SCROLL REACTOR
 * ======================
 * 
 * Intelligenter Reactor der beim Scrollen in Card-Data das Image horizontal schmaler macht
 * und dadurch mehr Platz für die Datenanzeige schafft.
 * 
 * Verhalten:
 * - Scroll 0%: Image volle Breite (100%), 4:3 ratio
 * - Scroll 20-40%: Image wird schmaler (80%), Höhe bleibt
 * - Scroll 40-60%: Image noch schmaler (60%)
 * - Scroll 60%+: Image minimal (40%), max Platz für Daten
 * 
 * Features:
 * - Smooth CSS transitions
 * - Horizontal padding shift (zentriert image)
 * - Behält aspect ratio bei
 * - Performance optimiert (throttled scroll)
 * 
 * Usage:
 * await amorph.enableReactor('cardScroll');
 */

export class CardScrollReactor {
  constructor(config = {}) {
    this.config = {
      minWidth: 40,           // Minimum width percentage
      maxWidth: 100,          // Maximum width percentage
      transitionDuration: 300, // CSS transition in ms
      throttleDelay: 50,      // Scroll event throttle
      ...config
    };
    
    this.name = 'cardScroll';
    this.enabled = false;
    this.scrollHandlers = new Map();
    this.throttleTimers = new Map();
    
    console.log('[CardScrollReactor] Initialized', this.config);
  }
  
  /**
   * Apply reactor to cards
   */
  apply() {
    this.enabled = true;
    
    console.log('[CardScrollReactor] 🔍 Looking for .entity-card elements...');
    
    // Find all entity cards
    const cards = document.querySelectorAll('.entity-card');
    
    console.log(`[CardScrollReactor] Found ${cards.length} cards`);
    
    if (cards.length === 0) {
      console.warn('[CardScrollReactor] ⚠️ No .entity-card elements found - retrying in 500ms...');
      // Retry after a short delay (DOM might not be ready yet)
      setTimeout(() => {
        const retryCards = document.querySelectorAll('.entity-card');
        if (retryCards.length > 0) {
          console.log(`[CardScrollReactor] 🔄 Retry successful - found ${retryCards.length} cards`);
          retryCards.forEach(card => this.applyToCard(card));
          console.log(`[CardScrollReactor] ✅ Applied to ${retryCards.length} cards`);
        } else {
          console.error('[CardScrollReactor] ❌ Still no cards found after retry');
        }
      }, 500);
      return 0;
    }
    
    // Apply to each card
    cards.forEach(card => this.applyToCard(card));
    
    console.log(`[CardScrollReactor] ✅ Applied to ${cards.length} cards`);
    return cards.length;
  }
  
  /**
   * Apply scroll handling to a single card
   */
  applyToCard(card) {
    const cardData = card.querySelector('.card-data');
    const cardImage = card.querySelector('.card-image');
    
    console.log('[CardScrollReactor] 🔧 Setting up card:', {
      hasCardData: !!cardData,
      hasCardImage: !!cardImage,
      slug: card.dataset.slug
    });
    
    if (!cardData || !cardImage) {
      console.warn('[CardScrollReactor] ⚠️ Missing .card-data or .card-image in card', card);
      return;
    }
    
    // Add smooth transition to image container
    cardImage.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    // Create throttled scroll handler
    const scrollHandler = () => {
      // Throttle for performance
      const cardId = card.dataset.slug || Math.random().toString(36);
      
      if (this.throttleTimers.has(cardId)) {
        return;
      }
      
      this.throttleTimers.set(cardId, setTimeout(() => {
        this.throttleTimers.delete(cardId);
      }, this.config.throttleDelay));
      
      // Calculate scroll percentage
      const scrollTop = cardData.scrollTop;
      const scrollHeight = cardData.scrollHeight - cardData.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      // Calculate image width based on scroll (100% → 40%)
      let imageWidth = this.config.maxWidth;
      
      if (scrollPercent > 0 && scrollPercent <= 20) {
        // 0-20%: Start shrinking gradually
        imageWidth = this.config.maxWidth - (scrollPercent / 20) * 20; // 100% → 80%
      } else if (scrollPercent > 20 && scrollPercent <= 40) {
        // 20-40%: Continue shrinking
        const progress = (scrollPercent - 20) / 20;
        imageWidth = 80 - progress * 20; // 80% → 60%
      } else if (scrollPercent > 40 && scrollPercent <= 60) {
        // 40-60%: Reach minimum
        const progress = (scrollPercent - 40) / 20;
        imageWidth = 60 - progress * 20; // 60% → 40%
      } else if (scrollPercent > 60) {
        // 60%+: Stay at minimum
        imageWidth = this.config.minWidth; // 40%
      }
      
      // Apply width with horizontal centering (padding left/right)
      const paddingPercent = (100 - imageWidth) / 2;
      cardImage.style.width = `${imageWidth}%`;
      cardImage.style.marginLeft = `${paddingPercent}%`;
      cardImage.style.marginRight = `${paddingPercent}%`;
      
      // Optional: Slight opacity fade at extreme scroll
      if (scrollPercent > 80) {
        const fadeProgress = (scrollPercent - 80) / 20;
        cardImage.style.opacity = Math.max(0.6, 1 - fadeProgress * 0.4); // 1.0 → 0.6
      } else {
        cardImage.style.opacity = '1';
      }
      
      // Debug logging (only when significant change)
      if (Math.abs(scrollPercent - (card._lastScrollPercent || 0)) > 5) {
        console.log(`[CardScrollReactor] Card scroll: ${scrollPercent.toFixed(0)}% → Image: ${imageWidth.toFixed(0)}%`);
        card._lastScrollPercent = scrollPercent;
      }
    };
    
    // Attach scroll listener
    cardData.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Store handler for cleanup
    this.scrollHandlers.set(card, { element: cardData, handler: scrollHandler });
  }
  
  /**
   * Cleanup reactor from cards
   */
  cleanup() {
    this.enabled = false;
    
    // Remove all scroll listeners
    this.scrollHandlers.forEach(({ element, handler }, card) => {
      element.removeEventListener('scroll', handler);
      
      // Reset image styles
      const cardImage = card.querySelector('.card-image');
      if (cardImage) {
        cardImage.style.width = '';
        cardImage.style.marginLeft = '';
        cardImage.style.marginRight = '';
        cardImage.style.opacity = '';
        cardImage.style.transition = '';
      }
    });
    
    this.scrollHandlers.clear();
    this.throttleTimers.clear();
    
    console.log('[CardScrollReactor] 🛑 Cleaned up');
  }
}

export default CardScrollReactor;
