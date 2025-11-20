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

    // Listen for bubble clicks
    this.amorph.on('bubble:clicked', this.handleBubbleClick.bind(this));

    // Create detail panel
    this.createDetailPanel();

    // Listen for ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.detailPanel.classList.contains('visible')) {
        this.hideDetailPanel();
      }
    });

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
  handleBubbleClick(data) {
    console.log('[BubbleDetailReactor] Bubble clicked:', data.fungusData.slug);
    this.selectedBubble = data.morph;
    this.showDetailPanel(data.fungusData);
  }

  /**
   * Show detail panel with fungus data
   */
  showDetailPanel(fungusData) {
    const content = this.detailPanel.querySelector('.detail-content');
    
    // Get active perspectives from AMORPH or use defaults
    const activePerspectives = this.amorph?.state?.activePerspectives || 
      ['cultivationAndProcessing', 'chemicalAndProperties', 'medicinalAndHealth'];

    // Generate content
    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-name">${fungusData.commonName || 'Unknown'}</div>
        <div class="detail-scientific">${fungusData.scientificName || ''}</div>
      </div>
      <div class="detail-data-grid">
        ${this.renderDataMorphs(fungusData, activePerspectives)}
      </div>
    `;

    // Show panel
    this.detailPanel.classList.add('visible');
  }

  /**
   * Render data morphs based on active perspectives
   */
  renderDataMorphs(fungusData, activePerspectives) {
    const perspectiveFieldMap = {
      'cultivationAndProcessing': [
        'cultivationDifficulty',
        'cultivationMethods',
        'substrate'
      ],
      'chemicalAndProperties': [
        'primaryCompounds',
        'secondaryMetabolites'
      ],
      'medicinalAndHealth': [
        'medicinalProperties',
        'activeCompounds'
      ],
      'culinaryAndNutritional': [
        'flavorProfile',
        'preparationMethods'
      ],
      'ecologyAndHabitat': [
        'ecologyAndHabitat.substrate',
        'ecologyAndHabitat.seasonality.primarySeason'
      ],
      'safetyAndIdentification': [
        'edibility',
        'toxicityLevel'
      ]
    };

    let html = '';

    // Render fields for each active perspective
    for (const perspective of activePerspectives) {
      const fields = perspectiveFieldMap[perspective] || [];
      
      for (const field of fields) {
        const value = this.getNestedValue(fungusData, field);
        if (value !== null && value !== undefined) {
          html += `
            <data-morph
              fungus-data='${JSON.stringify(fungusData)}'
              field="${field}"
            ></data-morph>
          `;
        }
      }
    }

    return html || '<p style="color: rgba(255, 255, 255, 0.5);">No data available for selected perspectives.</p>';
  }

  /**
   * Get nested value from object
   */
  getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
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
    console.log('[BubbleDetailReactor] Removed');
  }
}
