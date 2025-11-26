/**
 * 🔮 AMORPH SYSTEM - MORPHHEADER GLOBAL
 * =====================================
 * 
 * Globale Header-Komponente für das AMORPH System
 * DATA-DRIVEN from perspectiveFieldMappings.ts
 * 
 * Features:
 * - Perspective Selector (max 4 gleichzeitig, FIFO)
 * - All perspectives loaded from schema (perspectiveDefinitions)
 * - Tag-to-Perspective Auto-Activation
 * - Global Search Bar
 * - Glassmorphism Design
 * 
 * @author AMORPH System
 * @version 3.0.0 - Data-Driven
 */

import { LitElement, html, css } from 'lit';
import { globalStyles } from './tokens.js';
import { perspectiveDefinitions, getAllPerspectives } from '../../core/perspectiveFieldMappings.ts';

/**
 * Tag to Perspective Mapping
 * Lightweight - tags trigger relevant perspectives
 */
const TAG_TO_PERSPECTIVE = {
  // Culinary & Nutritional
  'edible': 'culinaryAndNutritional',
  'delicious': 'culinaryAndNutritional',
  'gourmet': 'culinaryAndNutritional',
  'cooking': 'culinaryAndNutritional',
  'culinary': 'culinaryAndNutritional',
  'taste': 'culinaryAndNutritional',
  'nutrition': 'culinaryAndNutritional',
  
  // Safety & Identification
  'toxic': 'safetyAndIdentification',
  'poisonous': 'safetyAndIdentification',
  'deadly': 'safetyAndIdentification',
  'warning': 'safetyAndIdentification',
  'lookalike': 'safetyAndIdentification',
  'caution': 'safetyAndIdentification',
  
  // Medicinal & Health
  'medicinal': 'medicinalAndHealth',
  'therapeutic': 'medicinalAndHealth',
  'antioxidant': 'medicinalAndHealth',
  'health': 'medicinalAndHealth',
  'healing': 'medicinalAndHealth',
  'immune-boost': 'medicinalAndHealth',
  
  // Ecology & Habitat
  'forest': 'ecologyAndHabitat',
  'grassland': 'ecologyAndHabitat',
  'spring': 'ecologyAndHabitat',
  'summer': 'ecologyAndHabitat',
  'fall': 'ecologyAndHabitat',
  'winter': 'ecologyAndHabitat',
  'parasitic': 'ecologyAndHabitat',
  'decomposer': 'ecologyAndHabitat',
  'mycorrhizal': 'ecologyAndHabitat',
  'habitat': 'ecologyAndHabitat',
  
  // Cultivation & Processing
  'cultivation': 'cultivationAndProcessing',
  'farming': 'cultivationAndProcessing',
  'substrate': 'cultivationAndProcessing',
  'harvest': 'cultivationAndProcessing',
  'growing': 'cultivationAndProcessing',
  
  // Research & Innovation
  'research': 'researchAndInnovation',
  'study': 'researchAndInnovation',
  'innovation': 'researchAndInnovation',
  'biotechnology': 'researchAndInnovation',
  'scientific': 'researchAndInnovation',
  
  // Chemical & Properties
  'compound': 'chemicalAndProperties',
  'molecule': 'chemicalAndProperties',
  'enzyme': 'chemicalAndProperties',
  'chemical': 'chemicalAndProperties',
  'bioactive': 'chemicalAndProperties',
  
  // Cultural & Historical
  'traditional': 'culturalAndHistorical',
  'folklore': 'culturalAndHistorical',
  'cultural': 'culturalAndHistorical',
  'history': 'culturalAndHistorical',
  'mythology': 'culturalAndHistorical',
  
  // Commercial & Market
  'commercial': 'commercialAndMarket',
  'market': 'commercialAndMarket',
  'price': 'commercialAndMarket',
  'trade': 'commercialAndMarket',
  'business': 'commercialAndMarket',
  
  // Environmental & Conservation
  'endangered': 'environmentalAndConservation',
  'protected': 'environmentalAndConservation',
  'conservation': 'environmentalAndConservation',
  'sustainable': 'environmentalAndConservation',
  'biodiversity': 'environmentalAndConservation',
  
  // Taxonomy (generic)
  'taxonomy': 'taxonomy',
  'classification': 'taxonomy',
  'scientific': 'taxonomy'
};

export class MorphHeader extends LitElement {
  static properties = {
    // Perspectives
    perspectives: { type: Array },
    activePerspectives: { type: Array },
    maxPerspectives: { type: Number },
    showPerspectiveMenu: { type: Boolean },
    
    // Reactors
    enabledReactors: { type: Array },
    
    // Search
    searchQuery: { type: String },
    searchResults: { type: Number },
    totalMorphs: { type: Number },
    matchedPerspectives: { type: Object },
    
    // View Mode
    viewMode: { type: String },
    
    // BubbleView Controls
    bubbleViewActive: { type: Boolean },
    bubbleViewInstance: { type: Object },
    isSimulating: { type: Boolean },
    showConnections: { type: Boolean },
    
    // UI State
    isMobileMenuOpen: { type: Boolean },
    isScrolled: { type: Boolean },
  };

  static styles = [
    globalStyles,
    css`
      :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* ===== DARK GLASSMORPHISM HEADER ===== */
    .header {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(20px) saturate(150%);
      -webkit-backdrop-filter: blur(20px) saturate(150%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      padding: 0.5rem 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* ===== SCROLLED/COMPACT STATE ===== */
    .header.scrolled {
      padding: 0.25rem 0.75rem;
      background: rgba(0, 0, 0, 0.7);
    }
    
    .header.scrolled .header-content {
      gap: 0.1875rem;
    }
    
    .header.scrolled .search-perspectives-wrapper {
      gap: 0.25rem;
    }
    
    .header.scrolled .search-input {
      height: 30px;
      font-size: 0.75rem;
    }
    
    .header.scrolled .view-mode-btn {
      width: 30px;
      height: 30px;
    }
    
    .header.scrolled .perspectives-row.active-row {
      gap: 0.375rem;
      margin-bottom: 0.25rem;
    }
    
    .header.scrolled .perspectives-row.inactive-row {
      gap: 0.1875rem;
    }
    
    /* Compact inactive buttons: shrink smoothly */
    .header.scrolled .perspective-btn.inactive {
      padding: 0.125rem 0.25rem;
      font-size: 0.4375rem;
      max-width: 3rem;
      overflow: hidden;
    }
    
    .header.scrolled .perspective-btn.inactive .perspective-label {
      max-width: 2rem;
      overflow: hidden;
      white-space: nowrap;
    }
    
    /* Active buttons stay prominent but more compact */
    .header.scrolled .perspective-btn.active {
      padding: 0.25rem 0.4rem;
      font-size: 0.625rem;
    }
    
    .header.scrolled .perspective-btn.active .perspective-icon {
      font-size: 0.5rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
      padding: 0 1rem;
    }
    
    /* Branding row: Funginomi left, Part of Bifroest right */
    .branding-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 800px;
      padding: 0 0.25rem;
    }
    
    .brand-title {
      font-size: 0.9rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.04em;
      /* Multicolor Gradient Text */
      background: linear-gradient(135deg, 
        #10b981,    /* Emerald */
        #06b6d4,    /* Cyan */
        #6366f1,    /* Indigo */
        #a855f7,    /* Purple */
        #ec4899     /* Pink */
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      /* Glow effect */
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))
              drop-shadow(0 0 16px rgba(168, 85, 247, 0.2));
      text-transform: uppercase;
    }
    
    .brand-subtitle {
      font-size: 0.625rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      font-weight: 400;
      letter-spacing: 0.03em;
    }
    
    .brand-subtitle a {
      color: rgba(139, 92, 246, 0.8);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .brand-subtitle a:hover {
      color: rgba(139, 92, 246, 1);
    }
    
    /* Hide branding on scroll */
    .header.scrolled .branding-row {
      display: none;
    }
    
    /* Responsive branding - keep left/right layout */
    @media (max-width: 480px) {
      .branding-row {
        padding: 0 0.125rem;
      }
      .brand-title {
        font-size: 0.625rem;
      }
      .brand-subtitle {
        font-size: 0.5rem;
      }
    }
    
    /* Central container for search + perspectives (wider, full width on smaller screens) */
    .search-perspectives-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      max-width: 800px;
      width: 100%;
    }
    
    /* Search row with view buttons */
    .search-container {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      width: 100%;
    }

    /* ===== SEARCH BAR ===== */
    .search-section {
      flex: 1;
      position: relative;
      min-width: 0; /* Important for flex shrinking */
      display: flex;
      align-items: center;
      background: rgba(10, 15, 30, 0.7);
      border: 1.5px solid transparent;
      border-radius: 12px;
      backdrop-filter: blur(12px) saturate(140%);
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      /* Multicolor gradient border */
      background: 
        linear-gradient(rgba(10, 15, 30, 0.85), rgba(10, 15, 30, 0.85)) padding-box,
        linear-gradient(135deg, 
          rgba(5, 150, 105, 0.5),    /* Emerald */
          rgba(8, 145, 178, 0.5),    /* Cyan */
          rgba(79, 70, 229, 0.5),    /* Indigo */
          rgba(147, 51, 234, 0.5),   /* Purple */
          rgba(236, 72, 153, 0.5)    /* Pink */
        ) border-box;
      box-shadow: 
        0 0 20px rgba(79, 70, 229, 0.2),
        0 0 40px rgba(147, 51, 234, 0.1),
        0 0 60px rgba(5, 150, 105, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      animation: search-bar-pulse 3s ease-in-out infinite;
      height: 36px;
      padding-right: 0.25rem;
    }
    
    .search-section:focus-within {
      background: 
        linear-gradient(rgba(10, 15, 30, 0.9), rgba(10, 15, 30, 0.9)) padding-box,
        linear-gradient(135deg, 
          rgba(5, 150, 105, 0.8),    /* Emerald */
          rgba(8, 145, 178, 0.8),    /* Cyan */
          rgba(79, 70, 229, 0.8),    /* Indigo */
          rgba(147, 51, 234, 0.8),   /* Purple */
          rgba(236, 72, 153, 0.8)    /* Pink */
        ) border-box;
      box-shadow: 
        0 0 0 3px rgba(79, 70, 229, 0.15),
        0 0 30px rgba(79, 70, 229, 0.3),
        0 0 50px rgba(147, 51, 234, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      animation: none;
    }
    
    /* Active perspectives inside search bar */
    .active-perspectives-inside {
      display: flex;
      align-items: center;
      gap: 0.1875rem;
      flex-shrink: 0;
      padding-right: 0.1875rem;
      margin-left: 0.375rem;
    }
    
    .active-perspectives-inside .perspective-btn.active {
      padding: 0.0625rem 0.125rem;
      font-size: 0.65rem;
      height: 16px;
      min-height: 18px;
      gap: 0.0625rem;
      line-height: 1;
    }
    
    .active-perspectives-inside .perspective-btn.active .perspective-icon {
      font-size: 0.4375rem;
    }
    
    .active-perspectives-inside .perspective-btn.active .perspective-label {
      transform: scaleX(0.88);
      transform-origin: center;
      display: inline-block;
    }
    
    /* On smaller screens: hide icons, more compact */
    @media (max-width: 768px) {
      .active-perspectives-inside .perspective-btn.active .perspective-icon {
        display: none;
      }
      .active-perspectives-inside .perspective-btn.active {
        gap: 0;
      }
    }
    
    @media (max-width: 600px) {
      .active-perspectives-inside .perspective-btn.active .perspective-label {
        transform: scaleX(0.80);
      }
      .active-perspectives-inside .perspective-btn.active {
        padding: 0.125rem 0.125rem;
      }
    }

    .search-input {
      flex: 1;
      min-width: 60px;
      padding: 0.5rem 0.75rem 0.5rem 2rem;
      border: 2px solid transparent;
      border-radius: 10px;
      font-size: 0.8125rem;
      /* Farbiger Gradient-Hintergrund mit dunklem Overlay */
      background: linear-gradient(135deg, 
        rgba(5, 150, 105, 0.15),    /* Emerald */
        rgba(8, 145, 178, 0.15),    /* Cyan */
        rgba(79, 70, 229, 0.18),    /* Indigo */
        rgba(147, 51, 234, 0.18),   /* Purple */
        rgba(236, 72, 153, 0.15)    /* Pink */
      );
      color: rgba(255, 255, 255, 0.95);
      transition: all 0.3s ease;
      outline: none;
      box-sizing: border-box;
      height: 32px;
      margin: 4px 0 4px 4px;
      box-shadow: 
        0 0 12px rgba(79, 70, 229, 0.15),
        inset 0 0 30px rgba(0, 0, 0, 0.5);
    }
    
    .search-input:focus {
      border: 2px solid transparent;
      background: 
        linear-gradient(#0a0a0f, #0a0a0f) padding-box,
        linear-gradient(135deg, 
          rgba(5, 150, 105, 0.8),    /* Emerald */
          rgba(8, 145, 178, 0.8),    /* Cyan */
          rgba(79, 70, 229, 0.8),    /* Indigo */
          rgba(147, 51, 234, 0.8),   /* Purple */
          rgba(236, 72, 153, 0.8)    /* Pink */
        ) border-box;
      box-shadow: 
        0 0 20px rgba(79, 70, 229, 0.25),
        0 0 35px rgba(147, 51, 234, 0.15),
        inset 0 0 25px rgba(0, 0, 0, 0.4);
    }
    
    @keyframes search-bar-pulse {
      0%, 100% {
        box-shadow: 
          0 0 20px rgba(79, 70, 229, 0.2),
          0 0 40px rgba(147, 51, 234, 0.1),
          0 0 60px rgba(5, 150, 105, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      50% {
        box-shadow: 
          0 0 25px rgba(79, 70, 229, 0.3),
          0 0 50px rgba(147, 51, 234, 0.18),
          0 0 80px rgba(236, 72, 153, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8125rem;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.4);
      pointer-events: none;
      font-size: 0.75rem;
      z-index: 1;
    }

    .search-results {
      flex-shrink: 0;
      font-size: 0.625rem;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      pointer-events: none;
      padding: 0 0.5rem;
    }

    /* ===== REACTOR TOGGLES ===== */
    .reactors-section {
      display: flex;
      gap: 0.5rem;
    }

    .reactor-toggle {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
    }

    .reactor-toggle:hover {
      border-color: rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }

    .reactor-toggle.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .reactor-icon {
      font-size: 1rem;
    }

    /* ===== ACTIVE PERSPECTIVES INLINE (in search bar) ===== */
    /* ===== PERSPECTIVE BUTTONS (BELOW SEARCH) ===== */
    .perspectives-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Inactive row: smaller gap, tighter layout */
    .perspectives-row.inactive-row {
      gap: 0.25rem;
    }

    .perspective-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.125rem;
      padding: 0.1625rem 0.125rem;
      border-radius: 6px;
      font-size: 0.6875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(8px);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      text-transform: capitalize;
      line-height: 1;
    }

    /* Inactive buttons: slightly bigger, dimmed, no icons */
    .perspective-btn.inactive {
      padding: 0.08rem 0.24rem;
      font-size: 0.6875rem;
      opacity: 0.55;
      background: rgba(255, 255, 255, 0.02);
    }
    
    .perspective-btn.inactive .perspective-icon {
      display: none;
    }

    /* Active buttons: smaller padding, same font, smaller icons */
    .perspective-btn.active {
      padding: 0.3125rem 0.5rem;
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
      font-weight: 600;
      opacity: 0.9;
      animation: perspective-pulse 4s ease-in-out infinite;
    }

    .perspective-btn.active .perspective-icon {
      display: inline;
      font-size: 0.625rem;
    }

    /* Hide icon on smaller screens */
    @media (max-width: 1200px) {
      .perspective-btn .perspective-icon {
        display: none;
      }
      .perspective-btn {
        gap: 0;
      }
    }

    @keyframes perspective-pulse {
      0%, 100% {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
      }
      50% {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 6px var(--btn-color, rgba(255, 255, 255, 0.1));
      }
    }

    .perspective-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0.85;
    }

    .perspective-btn.active:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    .perspective-btn.has-matches {
      position: relative;
    }

    .perspective-btn.has-matches::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
      animation: match-indicator-pulse 1.5s ease-in-out infinite;
    }

    @keyframes match-indicator-pulse {
      0%, 100% {
        opacity: 0.8;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    .perspective-icon {
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .perspective-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ===== VIEW MODE SWITCHER (neben Suche) ===== */
    .search-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }
    
    .view-mode-buttons {
      display: flex;
      gap: 0.375rem;
      flex-shrink: 0;
    }

    .view-mode-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(0, 0, 0, 0.35);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9375rem;
      color: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      flex-shrink: 0;
    }

    .view-mode-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
      color: rgba(255, 255, 255, 0.8);
    }

    .view-mode-btn.active {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.5);
      color: #667eea;
      box-shadow: 0 0 12px rgba(102, 126, 234, 0.3);
    }

    /* ===== MOBILE MENU ===== */
    .mobile-menu-toggle {
      display: none;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
    }

    .mobile-menu-toggle span {
      width: 24px;
      height: 2px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .search-perspectives-wrapper {
        max-width: 700px;
      }
      
      .perspective-btn.inactive {
        font-size: 0.625rem;
        padding: 0.25rem 0.5rem;
      }
      
      .perspective-btn.active {
        font-size: 0.8125rem;
        padding: 0.4375rem 0.75rem;
        margin: 0.0625rem 0.125rem;
      }
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 0.375rem 0.5rem;
      }

      .header-content {
        gap: 0.25rem;
        padding: 0 0.5rem;
      }

      .brand-title {
        font-size: 1rem;
      }

      .brand-subtitle {
        font-size: 0.5625rem;
      }
      
      .search-perspectives-wrapper {
        max-width: 100%;
        gap: 0.25rem;
      }
      
      .search-container {
        gap: 0.25rem;
      }

      .search-input {
        padding: 0.4375rem 0.875rem 0.4375rem 2rem;
        font-size: 0.75rem;
        border-radius: 10px;
        height: 32px;
      }

      .search-icon {
        left: 0.625rem;
        font-size: 0.8125rem;
      }
      
      .view-mode-btn {
        width: 32px;
        height: 32px;
        font-size: 0.8125rem;
        border-radius: 6px;
      }

      .perspectives-row {
        gap: 0.25rem;
      }

      .perspective-btn.inactive {
        font-size: 0.5625rem;
        padding: 0.21875rem 0.4375rem;
      }

      .perspective-btn.active {
        font-size: 0.6875rem;
        padding: 0.3125rem 0.625rem;
        margin: 0.0625rem 0.0625rem;
      }
    }
    
    /* Very small screens */
    @media (max-width: 480px) {
      .header {
        padding: 0.3125rem 0.375rem;
      }
      
      .header-content {
        gap: 0.1875rem;
        padding: 0 0.25rem;
      }
      
      .branding {
        gap: 0;
      }
      
      .brand-title {
        font-size: 0.9375rem;
      }
      
      .brand-subtitle {
        font-size: 0.5rem;
      }
      
      .search-input {
        padding: 0.375rem 0.75rem 0.375rem 1.75rem;
        font-size: 0.6875rem;
        border-radius: 8px;
        height: 30px;
      }
      
      .search-icon {
        left: 0.5rem;
        font-size: 0.75rem;
      }
      
      .view-mode-btn {
        width: 30px;
        height: 30px;
        font-size: 0.75rem;
        border-radius: 6px;
      }
      
      .perspectives-row {
        gap: 0.1875rem;
      }
      
      .perspective-btn.inactive {
        font-size: 0.5rem;
        padding: 0.1875rem 0.375rem;
        border-radius: 4px;
      }
      
      .perspective-btn.active {
        font-size: 0.5625rem;
        padding: 0.25rem 0.5rem;
        margin: 0.0625rem;
      }
    }

    /* ===== DARK MODE ===== */
    @media (prefers-color-scheme: dark) {
      .header {
        background: rgba(0, 0, 0, 0.75);
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }

      .perspective-pill,
      .reactor-toggle,
      .view-mode-btn.active {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
      }

      .perspective-menu {
        background: rgba(30, 30, 30, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .perspective-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .add-perspective-btn {
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.5);
      }

      .add-perspective-btn:hover {
        border-color: #667eea;
        color: #667eea;
      }
    `
  ];

  constructor() {
    super();
    
    // State - Match schema perspectives from perspectiveFieldMappings.ts
    // 🔮 DATA-DRIVEN PERSPECTIVES FROM SCHEMA
    // All perspectives are loaded from perspectiveFieldMappings.ts (perspectiveDefinitions)
    // This ensures the MorphHeader always reflects the complete schema
    this.perspectives = this._loadPerspectivesFromSchema();
    
    console.log('[MorphHeader] 📊 Loaded', this.perspectives.length, 'perspectives from schema:', 
      this.perspectives.map(p => p.name));
    
    // 4 DEFAULT PERSPECTIVES - Pre-selected on page load
    // Using first 4 perspectives from schema (sorted by order)
    const defaultPerspectiveNames = ['identity', 'taxonomy', 'morphologyAndAnatomy', 'ecologyAndDistribution'];
    this.activePerspectives = this.perspectives
      .filter(p => defaultPerspectiveNames.includes(p.name))
      .slice(0, 4);
    
    this.maxPerspectives = 4;
    this.showPerspectiveMenu = false;
    
    this.enabledReactors = [];
    
    this.searchQuery = '';
    this.searchResults = 0;
    this.totalMorphs = 0;
    this.matchedPerspectives = {};
    
    this.viewMode = 'grid'; // 'grid', 'list', 'compact'
    
    // BubbleView State
    this.bubbleViewActive = false;
    this.bubbleViewInstance = null;
    this.isSimulating = false;
    this.showConnections = false;
    
    this.isMobileMenuOpen = false;
    this.isScrolled = false;
    this.scrollTicking = false;
    
    // Auto-switch debounce timer
    this.autoSwitchTimer = null;
    
    // Scroll handler for compact mode
    this.handleScroll = this.handleScroll.bind(this);
    
    // AMORPH System Reference
    this.amorph = null;
  }

  /**
   * 🔮 Load all perspectives from perspectiveDefinitions (schema-driven)
   * Converts perspectiveDefinitions to the format expected by MorphHeader
   */
  _loadPerspectivesFromSchema() {
    const perspectives = [];
    
    // Convert perspectiveDefinitions to array format with sorting by order
    const sortedEntries = Object.entries(perspectiveDefinitions)
      .sort(([, a], [, b]) => (a.order || 999) - (b.order || 999));
    
    for (const [id, def] of sortedEntries) {
      perspectives.push({
        name: id,
        label: def.label || id,
        icon: def.icon || '📦',
        color: def.color || '#6366f1',
        description: def.description || '',
        category: def.category || 'unknown',
        order: def.order || 999,
      });
    }
    
    return perspectives;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Connect to AMORPH System
    if (window.amorph) {
      this.amorph = window.amorph;
      this.initializeFromSystem();
      this.attachEventListeners();
    } else {
      console.warn('[MorphHeader] AMORPH System not found on window.amorph');
    }
    
    // Dispatch initial perspective-changed event with default perspectives
    // This activates the 4 default perspectives on page load
    setTimeout(() => {
      this.dispatchPerspectiveChange();
      console.log('[MorphHeader] ✅ Initialized with', this.activePerspectives.length, 'default perspectives:', 
        this.activePerspectives.map(p => p.name));
      console.log('[MorphHeader] 📋 Total perspectives available:', this.perspectives.length);
    }, 100);
    
    // Listen for bubble-view-active event
    document.addEventListener('bubble-view-active', (e) => {
      this.bubbleViewActive = true;
      this.bubbleViewInstance = e.detail.bubbleView;
      this.isSimulating = e.detail.bubbleView.isSimulating;
      this.showConnections = e.detail.bubbleView.showConnections;
      console.log('[MorphHeader] BubbleView activated');
    });
    
    // Close menu on outside click
    this.handleOutsideClick = (e) => {
      if (this.showPerspectiveMenu && !e.composedPath().includes(this)) {
        this.showPerspectiveMenu = false;
      }
    };
    document.addEventListener('click', this.handleOutsideClick);
    
    // Scroll listener for compact header
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }
  
  handleScroll() {
    if (this.scrollTicking) return;
    
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      
      // Simple position-based with hysteresis
      if (y > 150 && !this.isScrolled) {
        this.isScrolled = true;
      } else if (y < 50 && this.isScrolled) {
        this.isScrolled = false;
      }
      
      this.scrollTicking = false;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('scroll', this.handleScroll);
    
    // Clear auto-switch timer
    if (this.autoSwitchTimer) {
      clearTimeout(this.autoSwitchTimer);
    }
    
    if (this.amorph) {
      this.detachEventListeners();
    }
  }

  initializeFromSystem() {
    // Get enabled reactors
    const info = this.amorph.getSystemInfo();
    this.enabledReactors = info.enabledReactors || [];
    this.totalMorphs = info.morphCount || 0;
    
    // Randomly select 2 perspectives from available ones (excluding taxonomy which is always interesting)
    const availablePerspectives = this.perspectives.filter(p => p.name !== 'taxonomy');
    const shuffled = [...availablePerspectives].sort(() => Math.random() - 0.5);
    const randomTwo = shuffled.slice(0, 2);
    
    // Start with 2 random perspectives
    this.activePerspectives = randomTwo;
    
    // Dispatch initial perspective change
    if (this.activePerspectives.length > 0) {
      this.dispatchPerspectiveChange();
    }
  }

  attachEventListeners() {
    // Listen to reactor changes
    this.onReactorEnabled = (data) => {
      if (!this.enabledReactors.includes(data.name)) {
        this.enabledReactors = [...this.enabledReactors, data.name];
      }
    };
    
    this.onReactorDisabled = (data) => {
      this.enabledReactors = this.enabledReactors.filter(r => r !== data.name);
    };
    
    // Listen to search changes
    this.onSearchCompleted = (data) => {
      console.log('[MorphHeader] 🔥 Search completed EVENT RECEIVED!', data);
      this.searchResults = data.totalResults;
      this.totalMorphs = data.totalMorphs;
      this.matchedPerspectives = data.perspectiveMatchCounts || {};
      
      // CRITICAL: If auto-activation is already in progress, don't start a new one
      if (this._isAutoActivating) {
        console.log('[MorphHeader] ⏭️ Auto-activation already in progress, skipping duplicate timer');
        return;
      }
      
      // Clear previous auto-switch timer (debounce)
      if (this.autoSwitchTimer) {
        clearTimeout(this.autoSwitchTimer);
      }
      
      // Auto-activate perspectives with matches (debounced to prevent switching while typing)
      const matchedPerspectiveNames = data.matchedPerspectives || [];
      console.log('[MorphHeader] 🎯 Matched perspectives for auto-activation:', matchedPerspectiveNames);
      
      if (matchedPerspectiveNames.length > 0) {
        // Debounce: Wait 400ms before auto-switching (user might still be typing)
        this.autoSwitchTimer = setTimeout(async () => {
          console.log('[MorphHeader] ⏰ Auto-switch timer fired, checking for perspectives to activate...');
          
          // PERFORMANCE FIX: Only activate the FIRST missing perspective
          // Activating all 7 causes a FIFO cascade loop
          let activatedCount = 0;
          for (const perspectiveName of matchedPerspectiveNames) {
            if (activatedCount >= 1) break; // STOP after first activation
            
            const perspective = this.perspectives.find(p => p.name === perspectiveName);
            const isAlreadyActive = this.activePerspectives.find(p => p.name === perspectiveName);
            console.log('[MorphHeader] Checking perspective:', {
              perspectiveName,
              foundPerspective: !!perspective,
              isAlreadyActive: !!isAlreadyActive
            });
            
            if (perspective && !isAlreadyActive) {
              console.log('[MorphHeader] Auto-activating perspective from search:', perspectiveName);
              // Mark as auto-activation so SearchFilterController doesn't duplicate highlight
              this._isAutoActivating = true;
              this.togglePerspective(perspective);
              activatedCount++;
            }
          }
          
          // CRITICAL: Only dispatch deep-mode-ready if we actually activated a perspective
          // Otherwise, SearchFilterController will handle highlighting naturally
          if (activatedCount > 0) {
            // Wait for perspective changes and deep mode switches to complete
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // NOW trigger highlighting after perspective switch completes
            console.log('[MorphHeader] 🎨 Triggering highlighting after perspective auto-activation');
            // Ensure flag is reset
            this._isAutoActivating = false;
            window.dispatchEvent(new CustomEvent('data-morph:deep-mode-ready', {
              detail: { query: data.query }
            }));
          } else {
            // No perspectives activated - let SearchFilterController handle highlighting naturally
            console.log('[MorphHeader] ⏭️ No perspectives auto-activated - SearchFilterController will handle highlighting');
            this._isAutoActivating = false;
          }
        }, 400); // 400ms debounce - nearly unnoticeable but prevents accidental switches
      } else {
        // No perspectives to activate, trigger highlighting after deep mode completes
        // Reduced to 200ms for faster response
        setTimeout(() => {
          console.log('[MorphHeader] 🎨 Triggering highlighting (no perspective auto-activation)');
          window.dispatchEvent(new CustomEvent('data-morph:deep-mode-ready', {
            detail: { query: data.query }
          }));
        }, 200);
      }
    };
    
    this.onSearchChanged = (data) => {
      this.searchQuery = data.new;
    };
    
    // Listen to morph changes
    this.onMorphRegistered = () => {
      const info = this.amorph.getSystemInfo();
      this.totalMorphs = info.morphCount || 0;
    };
    
    // Listen to tag clicks
    this.onTagClicked = (data) => {
      console.log('[MorphHeader] Tag clicked:', data.tag);
      
      // Map tag to perspective
      const perspectiveName = TAG_TO_PERSPECTIVE[data.tag.toLowerCase()];
      if (!perspectiveName) {
        console.log('[MorphHeader] No perspective mapping for tag:', data.tag);
        return;
      }
      
      // Find perspective object
      const perspective = this.perspectives.find(p => p.name === perspectiveName);
      if (!perspective) {
        console.warn('[MorphHeader] Perspective not found:', perspectiveName);
        return;
      }
      
      // Toggle perspective (FIFO logic inside)
      if (!this.activePerspectives.find(p => p.name === perspectiveName)) {
        console.log('[MorphHeader] Auto-activating perspective from tag:', perspectiveName);
        this.togglePerspective(perspective);
      }
    };
    
    // Listen to search perspective activation
    this.onSearchActivatePerspectives = (event) => {
      const perspectiveNames = event.detail?.perspectives || [];
      console.log('[MorphHeader] Search wants to activate perspectives:', perspectiveNames);
      
      perspectiveNames.forEach(perspectiveName => {
        const perspective = this.perspectives.find(p => p.name === perspectiveName);
        if (perspective && !this.activePerspectives.find(p => p.name === perspectiveName)) {
          console.log('[MorphHeader] Auto-activating perspective from search:', perspectiveName);
          this.togglePerspective(perspective);
        }
      });
    };
    
    // Attach
    this.amorph.on('reactor:enabled', this.onReactorEnabled);
    this.amorph.on('reactor:disabled', this.onReactorDisabled);
    this.amorph.on('search:completed', this.onSearchCompleted);
    this.amorph.on('search:changed', this.onSearchChanged);
    this.amorph.on('morph:registered', this.onMorphRegistered);
    this.amorph.on('tag:clicked', this.onTagClicked);
    
    // Listen to window events for search perspective activation
    window.addEventListener('search:activate-perspectives', this.onSearchActivatePerspectives);
  }

  detachEventListeners() {
    this.amorph.off('reactor:enabled', this.onReactorEnabled);
    this.amorph.off('reactor:disabled', this.onReactorDisabled);
    this.amorph.off('search:completed', this.onSearchCompleted);
    this.amorph.off('search:changed', this.onSearchChanged);
    this.amorph.off('morph:registered', this.onMorphRegistered);
    this.amorph.off('tag:clicked', this.onTagClicked);
    
    window.removeEventListener('search:activate-perspectives', this.onSearchActivatePerspectives);
  }

  // ==========================================
  // PERSPECTIVE METHODS
  // ==========================================

  togglePerspective(perspective) {
    const isActive = this.activePerspectives.find(p => p.name === perspective.name);
    
    if (isActive) {
      // Remove if already active
      this.removePerspective(perspective);
    } else {
      // Add with FIFO logic - NEW perspective goes to FRONT (position 0)
      if (this.activePerspectives.length >= this.maxPerspectives) {
        console.log(`[MorphHeader] FIFO: Removing oldest perspective`);
        // Remove the LAST one (oldest, since new ones go to front)
        const removed = this.activePerspectives[this.activePerspectives.length - 1];
        this.activePerspectives = this.activePerspectives.slice(0, -1);
        console.log(`[MorphHeader] Removed:`, removed.name);
      }
      
      // Insert at FRONT
      this.activePerspectives = [perspective, ...this.activePerspectives];
      this.dispatchPerspectiveChange();
      
      this.dispatchEvent(new CustomEvent('perspective-added', {
        detail: perspective,
        bubbles: true,
        composed: true,
      }));
    }
  }

  removePerspective(perspective) {
    this.activePerspectives = this.activePerspectives.filter(p => p.name !== perspective.name);
    
    // Dispatch global event for PerspectiveHosts
    this.dispatchPerspectiveChange();
    
    // Emit event
    this.dispatchEvent(new CustomEvent('perspective-removed', {
      detail: perspective,
      bubbles: true,
      composed: true,
    }));
  }

  dispatchPerspectiveChange() {
    // PERFORMANCE FIX: Debounce to prevent cascade loops
    if (this._perspectiveChangeDebounce) {
      clearTimeout(this._perspectiveChangeDebounce);
    }
    
    this._perspectiveChangeDebounce = setTimeout(() => {
      const perspectiveIds = this.activePerspectives.map(p => p.name);
      
      console.log('[MorphHeader] Dispatching perspective change:', perspectiveIds);
    
    // Store in AMORPH state for easy access
    if (this.amorph) {
      if (!this.amorph.state) this.amorph.state = {};
      this.amorph.state.activePerspectives = this.activePerspectives;
    }
    
    // Dispatch on window for PerspectiveHosts to listen (with FULL perspective objects)
    // NOTE: Only dispatch once - bubbles:true means it will reach document listeners anyway
    const eventDetail = { 
      perspectives: this.activePerspectives
    };
    
    // Mark as auto-activation if triggered by search
    if (this._isAutoActivating) {
      eventDetail.source = 'search-auto-activation';
      this._isAutoActivating = false; // Reset flag
    }
    
    window.dispatchEvent(new CustomEvent('perspective-changed', {
      detail: eventDetail,
      bubbles: true,
      composed: true
    }));
    
      // ALSO dispatch via AMORPH event system for Reactors
      if (this.amorph) {
        this.amorph.emit('perspectives:changed', {
          perspectives: perspectiveIds
        });
      }
      
      console.log('[MorphHeader] Active perspectives:', perspectiveIds);
    }, 50); // 50ms debounce - prevents cascade loops
  }

  // ==========================================
  // REACTOR METHODS
  // ==========================================

  async toggleReactor(reactorName) {
    if (!this.amorph) return;
    
    // Prevent double-clicks
    if (this._toggleInProgress) return;
    this._toggleInProgress = true;
    
    try {
      // Get FRESH state from system, not from local state
      const info = this.amorph.getSystemInfo();
      const isEnabled = info.enabledReactors.includes(reactorName);
      
      if (isEnabled) {
        await this.amorph.disableReactor(reactorName);
      } else {
        await this.amorph.enableReactor(reactorName);
      }
    } finally {
      // Small delay to prevent rapid toggles
      setTimeout(() => {
        this._toggleInProgress = false;
      }, 100);
    }
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  
  /**
   * Get currently active perspectives (for external access)
   */
  getActivePerspectives() {
    return this.activePerspectives || [];
  }

  // ==========================================
  // SEARCH METHODS
  // ==========================================

  handleSearchInput(e) {
    const query = e.target.value;
    this.searchQuery = query;
    
    // SearchReactor handles its own debouncing
    if (this.amorph) {
      this.amorph.streamPublish('search:input', { query });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.amorph) {
      this.amorph.streamPublish('search:input', { query: '' });
    }
  }

  // ==========================================
  // VIEW MODE METHODS
  // ==========================================

  setViewMode(mode) {
    this.viewMode = mode;
    
    // Emit event on component
    this.dispatchEvent(new CustomEvent('view-mode-changed', {
      detail: { mode },
      bubbles: true,
      composed: true,
    }));
    
    // Also emit on window for global listeners (like index.astro)
    window.dispatchEvent(new CustomEvent('view-mode-changed', {
      detail: { mode }
    }));
    
    console.log('[MorphHeader] View mode changed to:', mode);
  }

  // ==========================================
  // BUBBLEVIEW CONTROL METHODS
  // ==========================================

  toggleBubbleSimulation() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.toggleSimulation();
      this.isSimulating = this.bubbleViewInstance.isSimulating;
    }
  }

  toggleBubbleConnections() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.toggleConnections();
      this.showConnections = this.bubbleViewInstance.showConnections;
    }
  }

  resetBubbleView() {
    if (this.bubbleViewInstance) {
      this.bubbleViewInstance.resetView();
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  render() {
    return html`
      <header class="header ${this.isScrolled ? 'scrolled' : ''}">
        <div class="header-content">
          <!-- Branding Row: Funginomi left, Part of Bifroest right -->
          <div class="branding-row">
            <h1 class="brand-title">${window.amorph?.domainConfig?.instance?.name || 'Funginomi'}</h1>
            <p class="brand-subtitle">
              Part of the <a href="${window.amorph?.domainConfig?.externalLinks?.bifroest || 'https://bifroest.io'}" target="_blank" rel="noopener noreferrer">Bifroest</a>
            </p>
          </div>

          <!-- Search + Perspectives Wrapper -->
          <div class="search-perspectives-wrapper">
            <!-- Search Row: Input with Active Buttons inside + View Mode -->
            <div class="search-container">
              <div class="search-section">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  class="search-input"
                  placeholder="keyword.."
                  maxlength="24"
                  .value=${this.searchQuery}
                  @input=${this.handleSearchInput}
                />
                <!-- Active Perspective Buttons INSIDE search bar -->
                ${this.activePerspectives.length > 0 ? html`
                  <div class="active-perspectives-inside">
                    ${this.activePerspectives.map(p => {
                      const hasMatches = this.matchedPerspectives[p.name] > 0;
                      const btnClass = `active ${hasMatches ? 'has-matches' : ''}`;
                      const matchCount = this.matchedPerspectives[p.name] || 0;
                      const title = matchCount > 0 ? `${p.label} (${matchCount} matches)` : p.label;
                      return html`
                        <button 
                          class="perspective-btn ${btnClass}"
                          style="border-color: ${p.color}; color: ${p.color}; --btn-color: ${p.color};"
                          @click=${() => this.togglePerspective(p)}
                          title="${title}"
                        >
                          <span class="perspective-icon">${p.icon}</span>
                          <span class="perspective-label">${p.label}</span>
                        </button>
                      `;
                    })}
                  </div>
                ` : ''}
              </div>
              
              <!-- View Mode Buttons -->
              <div class="view-mode-buttons">
                <button 
                  class="view-mode-btn ${this.viewMode === 'grid' ? 'active' : ''}"
                  @click=${() => this.setViewMode('grid')}
                  title="Grid View"
                >📊</button>
                <button 
                  class="view-mode-btn ${this.viewMode === 'bubble' ? 'active' : ''}"
                  @click=${() => this.setViewMode('bubble')}
                  title="Bubble View"
                >🫧</button>
              </div>
            </div>

            <!-- Inactive Perspective Buttons (second row) -->
            <div class="perspectives-row inactive-row">
            ${(() => {
              const activePerspectiveNames = this.activePerspectives.map(p => p.name);
              const inactivePerspectives = this.perspectives.filter(p => !activePerspectiveNames.includes(p.name));
              
              return inactivePerspectives.map(p => {
                const hasMatches = this.matchedPerspectives[p.name] > 0;
                const btnClass = `inactive ${hasMatches ? 'has-matches' : ''}`;
                const matchCount = this.matchedPerspectives[p.name] || 0;
                const title = matchCount > 0 ? `${p.label} (${matchCount} matches)` : p.label;
                return html`
                  <button 
                    class="perspective-btn ${btnClass}"
                    style="border-color: ${p.color}; color: ${p.color}; --btn-color: ${p.color};"
                    @click=${() => this.togglePerspective(p)}
                    title="${title}"
                  >
                    <span class="perspective-icon">${p.icon}</span>
                    <span class="perspective-label">${p.label}</span>
                  </button>
                `;
              });
            })()}
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

// Register Web Component
customElements.define('morph-header', MorphHeader);
