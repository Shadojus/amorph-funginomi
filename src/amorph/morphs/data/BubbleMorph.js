/**
 * 🫧 BUBBLE MORPH
 * ===============
 * 
 * Lightweight element representing a bubble in BubbleView
 * Registered with AMORPH system so reactors can interact with it
 * 
 * This is a "virtual" morph - the actual rendering happens on canvas
 * But this element provides the AMORPH integration point
 */

export class BubbleMorph extends HTMLElement {
  constructor() {
    super();
    
    // Set morph attributes for AMORPH
    this.dataset.morph = 'true';
    this.dataset.morphType = 'bubble';
  }

  connectedCallback() {
    // Register with AMORPH system
    if (window.amorph) {
      window.amorph.registerMorph(this);
    }
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  // Getter/Setter for reactive properties
  get slug() {
    return this.getAttribute('slug');
  }

  set slug(value) {
    this.setAttribute('slug', value);
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get similarity() {
    return parseFloat(this.getAttribute('similarity')) || 0;
  }

  set similarity(value) {
    this.setAttribute('similarity', value);
  }

  get perspectives() {
    const attr = this.getAttribute('perspectives');
    return attr ? attr.split(',').map(p => p.trim()) : [];
  }

  set perspectives(value) {
    this.setAttribute('perspectives', Array.isArray(value) ? value.join(',') : value);
  }
}

// Register custom element
customElements.define('bubble-morph', BubbleMorph);

export default BubbleMorph;
