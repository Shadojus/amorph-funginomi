/**
 * 🔍 BUBBLE DETAIL REACTOR
 * =========================
 * 
 * Shows detail card overlay when bubble is clicked.
 * Similar to Grid View cards but for BubbleView.
 * 
 * Features:
 * - Click to show detail panel
 * - Perspective-aware data display
 * - Wood floor background like Grid View
 * - Close on ESC or outside click
 */

export class BubbleDetailReactor {
  constructor() {
    this.name = 'bubbleDetail';
    this.version = '1.0.0';
    this.amorph = null;
    this.detailPanel = null;
    this.selectedBubble = null;
  }

  /**
   * Apply reactor to AMORPH system
   */
  apply(amorph) {
    this.amorph = amorph;
    console.log('[BubbleDetailReactor] Applying...');

    // Listen for bubble clicks via window (CustomEvent from BubbleMorph)
    this.boundHandleBubbleClick = this.handleBubbleClick.bind(this);
    window.addEventListener('bubble:clicked', this.boundHandleBubbleClick);

    // Create detail panel
    this.createDetailPanel();

    // Listen for ESC key
    this.boundHandleEscape = (e) => {
      if (e.key === 'Escape' && this.detailPanel.classList.contains('visible')) {
        this.hideDetailPanel();
      }
    };
    document.addEventListener('keydown', this.boundHandleEscape);

    console.log('[BubbleDetailReactor] ✅ Applied');
  }

  /**
   * Create detail panel overlay
   */
  createDetailPanel() {
    this.detailPanel = document.createElement('div');
    this.detailPanel.className = 'bubble-detail-panel';
    this.detailPanel.innerHTML = `
      <div class="detail-overlay"></div>
      <div class="detail-card">
        <button class="detail-close">✕</button>
        <div class="detail-content"></div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .bubble-detail-panel {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: none;
        pointer-events: none;
      }

      .bubble-detail-panel.visible {
        display: block;
        pointer-events: all;
      }

      .detail-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .detail-card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        background: url('/images/woodfloor/Moss_Woodsf_Laub.png');
        background-size: cover;
        background-position: center;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
        animation: slideUp 0.3s ease;
        position: relative;
      }

      .detail-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.65));
        pointer-events: none;
        z-index: 1;
      }

      .detail-card > * {
        position: relative;
        z-index: 2;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translate(-50%, -40%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }

      .detail-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
      }

      .detail-close:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        transform: rotate(90deg);
      }

      .detail-content {
        padding: 2rem;
        max-height: 80vh;
        overflow-y: auto;
      }

      .detail-content::-webkit-scrollbar {
        width: 8px;
      }

      .detail-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .detail-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }

      .detail-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      .detail-header {
        margin-bottom: 1.5rem;
      }

      .detail-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.5rem;
      }

      .detail-scientific {
        font-size: 1rem;
        font-style: italic;
        color: rgba(255, 255, 255, 0.7);
      }

      .detail-data-grid {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.detailPanel);

    // Close on overlay click
    this.detailPanel.querySelector('.detail-overlay').addEventListener('click', () => {
      this.hideDetailPanel();
    });

    // Close button
    this.detailPanel.querySelector('.detail-close').addEventListener('click', () => {
      this.hideDetailPanel();
    });
  }

  /**
   * Handle bubble click
   */
  handleBubbleClick(event) {
    const data = event.detail;
    console.log('[BubbleDetailReactor] Bubble clicked:', data.fungusData.slug);
    this.selectedBubble = data.morph;
    this.showDetailPanel(data.fungusData, data.morph);
  }

  /**
   * Show detail panel with connection & relationship info
   */
  showDetailPanel(fungusData, bubbleMorph) {
    const content = this.detailPanel.querySelector('.detail-content');
    
    // Get BubbleView to access connections data
    const bubbleView = document.querySelector('bubble-view');
    const userNodeConnections = bubbleView?.userNodeData?.connections || new Map();
    const bubbleConnections = bubbleView?.connections || new Map();
    
    // Get connection info for this bubble
    const userNodeConnection = userNodeConnections.get(fungusData.slug);
    const connectionScore = userNodeConnection ? userNodeConnection[1] : 0;
    
    // Get connected bubbles (bubble-to-bubble connections)
    const connectedBubbles = this.getConnectedBubbles(fungusData.slug, bubbleConnections, bubbleView);
    
    // Get active perspectives
    const activePerspectives = bubbleView?.activePerspectives || [];
    
    // Get key facts
    const keyFacts = this.extractKeyFacts(fungusData, activePerspectives);
    
    // Generate content
    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-name">${fungusData.commonName || 'Unknown'}</div>
        <div class="detail-scientific">${fungusData.scientificName || ''}</div>
      </div>

      ${this.renderConnectionInfo(connectionScore, activePerspectives)}
      
      ${connectedBubbles.length > 0 ? this.renderConnectedBubbles(connectedBubbles) : ''}
      
      ${this.renderKeyFacts(keyFacts)}
      
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <a href="/fungi/${fungusData.slug}" 
           style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; 
                  background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4);
                  border-radius: 8px; color: white; text-decoration: none; font-weight: 600;
                  transition: all 0.3s ease;">
          📖 Alle Details anzeigen
        </a>
      </div>
    `;

    // Show panel
    this.detailPanel.classList.add('visible');
  }

  /**
   * Get connected bubbles with similarity scores
   */
  getConnectedBubbles(slug, connections, bubbleView) {
    const connected = [];
    const bubbles = bubbleView?.bubbles || new Map();
    
    // Find all connections involving this bubble
    connections.forEach((connection, key) => {
      const [id1, id2] = key.split('-');
      const otherSlug = id1 === slug ? id2 : (id2 === slug ? id1 : null);
      
      if (otherSlug && otherSlug !== 'user-central') {
        const otherBubble = bubbles.get(otherSlug);
        if (otherBubble) {
          connected.push({
            slug: otherSlug,
            name: otherBubble.commonName || otherBubble.scientificName,
            score: connection.similarity
          });
        }
      }
    });
    
    // Sort by similarity score
    return connected.sort((a, b) => b.score - a.score);
  }

  /**
   * Extract key facts from fungus data
   */
  extractKeyFacts(fungusData, activePerspectives) {
    const facts = [];
    
    // Edibility (always show if available)
    if (fungusData.edibility) {
      facts.push({ label: 'Essbarkeit', value: fungusData.edibility, icon: '🍄' });
    }
    
    // From active perspectives
    if (activePerspectives.includes('cultivationAndProcessing')) {
      const cultivation = fungusData.cultivationAndProcessing;
      if (cultivation?.cultivationDifficulty) {
        facts.push({ 
          label: 'Anbau-Schwierigkeit', 
          value: cultivation.cultivationDifficulty, 
          icon: '🌱' 
        });
      }
    }
    
    if (activePerspectives.includes('medicinalAndHealth')) {
      const medicinal = fungusData.medicinalAndHealth;
      if (medicinal?.primaryHealthBenefits?.length > 0) {
        facts.push({ 
          label: 'Gesundheitliche Vorteile', 
          value: medicinal.primaryHealthBenefits.slice(0, 3).join(', '), 
          icon: '⚕️' 
        });
      }
    }
    
    if (activePerspectives.includes('culinaryAndNutritional')) {
      const culinary = fungusData.culinaryAndNutritional;
      if (culinary?.flavorProfile) {
        facts.push({ 
          label: 'Geschmacksprofil', 
          value: culinary.flavorProfile, 
          icon: '🍳' 
        });
      }
    }
    
    if (activePerspectives.includes('chemicalAndProperties')) {
      const chemical = fungusData.chemicalAndProperties;
      if (chemical?.primaryCompounds?.length > 0) {
        facts.push({ 
          label: 'Hauptinhaltsstoffe', 
          value: chemical.primaryCompounds.slice(0, 2).join(', '), 
          icon: '🧪' 
        });
      }
    }
    
    // Limit to 5 facts
    return facts.slice(0, 5);
  }

  /**
   * Render connection info (why this bubble is here)
   */
  renderConnectionInfo(score, perspectives) {
    const percentage = Math.round(score * 100);
    const strength = score > 0.5 ? 'Stark' : score >= 0.3 ? 'Mittel' : 'Schwach';
    
    return `
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); 
                  border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.75rem; font-weight: 600; color: rgba(255, 255, 255, 0.6); 
                    text-transform: uppercase; margin-bottom: 0.5rem;">
          🔗 Verbindung zum User Node
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2rem; font-weight: 700; color: rgba(59, 130, 246, 1);">
            ${percentage}%
          </div>
          <div>
            <div style="color: white; font-weight: 600;">${strength}</div>
            <div style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.7);">
              ${perspectives.length > 0 
                ? `Durch ${perspectives.length} aktive Perspektive${perspectives.length > 1 ? 'n' : ''}`
                : 'Durch Suche'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render connected bubbles
   */
  renderConnectedBubbles(connected) {
    return `
      <div style="margin-bottom: 1rem;">
        <div style="font-size: 0.75rem; font-weight: 600; color: rgba(255, 255, 255, 0.6); 
                    text-transform: uppercase; margin-bottom: 0.75rem;">
          🫧 Verbundene Pilze (${connected.length})
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${connected.map(bubble => `
            <a href="/fungi/${bubble.slug}" 
               style="display: flex; justify-content: space-between; align-items: center; 
                      padding: 0.75rem; background: rgba(255, 255, 255, 0.05); 
                      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px;
                      color: white; text-decoration: none; transition: all 0.3s ease;">
              <span style="font-weight: 500;">${bubble.name}</span>
              <span style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.6);">
                ${Math.round(bubble.score * 100)}% ähnlich
              </span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render key facts
   */
  renderKeyFacts(facts) {
    if (facts.length === 0) return '';
    
    return `
      <div style="margin-bottom: 1rem;">
        <div style="font-size: 0.75rem; font-weight: 600; color: rgba(255, 255, 255, 0.6); 
                    text-transform: uppercase; margin-bottom: 0.75rem;">
          ⚡ Wichtigste Eigenschaften
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${facts.map(fact => `
            <div style="display: flex; gap: 0.75rem;">
              <div style="font-size: 1.5rem; flex-shrink: 0;">${fact.icon}</div>
              <div style="flex: 1;">
                <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); 
                            text-transform: uppercase; margin-bottom: 0.25rem;">
                  ${fact.label}
                </div>
                <div style="color: white; font-weight: 500; line-height: 1.4;">
                  ${fact.value}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Hide detail panel
   */
  hideDetailPanel() {
    this.detailPanel.classList.remove('visible');
    this.selectedBubble = null;
  }

  /**
   * Remove reactor
   */
  remove() {
    if (this.detailPanel) {
      this.detailPanel.remove();
    }
    if (this.boundHandleBubbleClick) {
      window.removeEventListener('bubble:clicked', this.boundHandleBubbleClick);
    }
    if (this.boundHandleEscape) {
      document.removeEventListener('keydown', this.boundHandleEscape);
    }
    console.log('[BubbleDetailReactor] Removed');
  }
}
