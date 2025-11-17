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
    this.data = [];
    this.amorph = null;
    this.bubbleView = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Get AMORPH instance
    if (typeof window !== 'undefined' && window.amorph) {
      this.amorph = window.amorph;
    }

    console.log('[BubbleHost] Connected');
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
   * This is DATENGETRIEBEN - data drives morph creation
   */
  setData(data) {
    this.data = Array.isArray(data) ? data : [data];
    console.log(`[BubbleHost] Data set: ${this.data.length} items`);
    
    // Wait for bubbleView to be ready
    const waitForBubbleView = () => {
      this.bubbleView = this.shadowRoot?.querySelector('bubble-view');
      
      if (this.bubbleView) {
        console.log('[BubbleHost] BubbleView found, creating morphs...');
        this.createMorphsFromData();
      } else {
        console.log('[BubbleHost] Waiting for BubbleView...');
        setTimeout(waitForBubbleView, 50);
      }
    };
    
    waitForBubbleView();
  }

  /**
   * Create morphs from data objects
   * Each fungus becomes a collection of morphs
   */
  createMorphsFromData() {
    if (!this.data || this.data.length === 0) {
      console.warn('[BubbleHost] No data to create morphs from');
      return;
    }

    // Clear any existing container
    let container = this.shadowRoot.querySelector('.morphs-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'morphs-container';
      container.style.display = 'none'; // Hidden - only for DOM registration
      this.shadowRoot.appendChild(container);
    } else {
      container.innerHTML = ''; // Clear existing
    }

    const allMorphs = [];

    // Create morphs for each fungus
    this.data.forEach((fungus, index) => {
      // Create name morphs
      if (fungus.names?.common) {
        const nameMorph = this.createNameMorph(fungus.names.common, 'culinary', `fungus-${index}`);
        container.appendChild(nameMorph); // Add to DOM first!
        allMorphs.push(nameMorph);
      }

      if (fungus.names?.scientific) {
        const nameMorph = this.createNameMorph(fungus.names.scientific, 'scientific', `fungus-${index}`);
        container.appendChild(nameMorph);
        allMorphs.push(nameMorph);
      }

      // Create image morph
      if (fungus.images?.[0]) {
        const imageMorph = this.createImageMorph(fungus.images[0].url, fungus.names?.common, `fungus-${index}`);
        container.appendChild(imageMorph);
        allMorphs.push(imageMorph);
      }

      // Create text morph for description
      if (fungus.description) {
        const textMorph = this.createTextMorph(fungus.description, 'culinary', `fungus-${index}`);
        container.appendChild(textMorph);
        allMorphs.push(textMorph);
      }

      // Create tag morphs
      if (fungus.tags) {
        fungus.tags.forEach(tag => {
          const tagMorph = this.createTagMorph(tag, `fungus-${index}`);
          container.appendChild(tagMorph);
          allMorphs.push(tagMorph);
        });
      }
    });

    console.log(`[BubbleHost] Created ${allMorphs.length} morphs from ${this.data.length} items`);

    // Wait for morphs to be registered in AMORPH, then pass to BubbleView
    setTimeout(() => {
      if (this.bubbleView && allMorphs.length > 0) {
        this.bubbleView.setMorphs(allMorphs);
        this.bubbleView.setFungiData(this.data); // Pass fungi data for similarity
        console.log(`[BubbleHost] Passed ${allMorphs.length} morphs and ${this.data.length} fungi to BubbleView`);
      }
    }, 500);
  }

  /**
   * Create a name-morph element
   */
  createNameMorph(value, perspective, group) {
    const morph = document.createElement('name-morph');
    morph.setAttribute('value', value);
    morph.setAttribute('perspective', perspective);
    morph.setAttribute('lang', perspective === 'scientific' ? 'la' : 'de');
    morph.dataset.group = group;
    return morph;
  }

  /**
   * Create an image-morph element
   */
  createImageMorph(src, alt, group) {
    const morph = document.createElement('image-morph');
    morph.setAttribute('src', src);
    morph.setAttribute('alt', alt || '');
    morph.dataset.group = group;
    return morph;
  }

  /**
   * Create a text-morph element
   */
  createTextMorph(value, perspective, group) {
    const morph = document.createElement('text-morph');
    morph.setAttribute('value', value);
    morph.setAttribute('perspective', perspective);
    morph.setAttribute('maxlines', '3');
    morph.dataset.group = group;
    return morph;
  }

  /**
   * Create a tag-morph element
   */
  createTagMorph(tag, group) {
    const morph = document.createElement('tag-morph');
    morph.setAttribute('tag', tag);
    morph.setAttribute('color', 'auto');
    morph.dataset.group = group;
    return morph;
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

// Register custom element
customElements.define('bubble-host', BubbleHost);

// Auto-register with AMORPH system
if (typeof window !== 'undefined' && window.amorph) {
  console.log('[BubbleHost] Registered');
}

export default BubbleHost;
