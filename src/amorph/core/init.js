/**
 * 🚀 AMORPH SYSTEM INITIALIZATION
 * 
 * Import dieses File um das AMORPH System zu starten!
 * 
 * Usage in Astro/HTML:
 * <script type="module">
 *   import '/src/amorph/core/init.js';
 * </script>
 * 
 * Das System ist dann global als `window.amorph` verfügbar!
 * 
 * FEATURE-ONLY ARCHITECTURE:
 * - core/ - Core system files + observers
 * - features/ - Self-contained features (each has own morphs + reactors)
 *   NO shared folders - components are duplicated per feature!
 */

import { amorph } from './AmorphSystem.js';

// Import Visual Reactors from grid-view (work everywhere)
import { GlowReactor } from '../features/grid-view/reactors/GlowReactor.js';
import { AnimationReactor } from '../features/grid-view/reactors/AnimationReactor.js';
import { PulseReactor } from '../features/grid-view/reactors/PulseReactor.js';
import { HoverReactor } from '../features/grid-view/reactors/HoverReactor.js';
import { SortReactor } from '../features/grid-view/reactors/SortReactor.js';
import { FilterReactor } from '../features/grid-view/reactors/FilterReactor.js';
import { CardScrollReactor } from '../features/grid-view/reactors/CardScrollReactor.js';

// Import Search System (Convex-based)
import { ConvexSearchReactor } from '../features/search-system/reactors/ConvexSearchReactor.js';
// Legacy client-side search (keep for backwards compatibility)
// import { SearchReactor } from '../features/search-system/reactors/SearchReactor.js';

// Import Perspective System
import { PerspectiveReactor } from '../features/perspective-system/PerspectiveReactor.js';

// Import BubbleView Feature
import { CanvasUserNodeReactor } from '../features/bubble-view/reactors/CanvasUserNodeReactor.js';
import { CanvasPhysicsReactor } from '../features/bubble-view/reactors/CanvasPhysicsReactor.js';
import { CanvasConnectionReactor } from '../features/bubble-view/reactors/CanvasConnectionReactor.js';
import { BubbleDetailReactor } from '../features/bubble-view/reactors/BubbleDetailReactor.js';
import { BubbleSearchReactor } from '../features/bubble-view/reactors/BubbleSearchReactor.js';

// Register Shared Reactors
amorph.registerReactor('glow', GlowReactor);
amorph.registerReactor('animation', AnimationReactor);
amorph.registerReactor('pulse', PulseReactor);
amorph.registerReactor('hover', HoverReactor);
amorph.registerReactor('sort', SortReactor);
amorph.registerReactor('filter', FilterReactor);
amorph.registerReactor('cardScroll', CardScrollReactor);

// Register Search System (Convex-based - replaces old SearchReactor)
amorph.registerReactor('convex-search', ConvexSearchReactor);
// Legacy: amorph.registerReactor('search', SearchReactor);

// Register Perspective System
amorph.registerReactor('perspective', PerspectiveReactor);

// Register BubbleView Reactors
amorph.registerReactor('canvasUserNode', CanvasUserNodeReactor);
amorph.registerReactor('canvasPhysics', CanvasPhysicsReactor);
amorph.registerReactor('canvasConnection', CanvasConnectionReactor);
amorph.registerReactor('bubbleDetail', BubbleDetailReactor);
amorph.registerReactor('bubbleSearch', BubbleSearchReactor);

// Import Data Morphs from grid-view
import '../features/grid-view/morphs/NameMorph.js';
import '../features/grid-view/morphs/ImageMorph.js';
import '../features/grid-view/morphs/TagMorph.js';
import '../features/grid-view/morphs/TextMorph.js';
import '../features/grid-view/morphs/BooleanMorph.js';
import '../features/grid-view/morphs/NumberMorph.js';
import '../features/grid-view/morphs/ListMorph.js';
import '../features/grid-view/morphs/DataMorph.js';
import '../features/grid-view/morphs/ChartMorph.js';
import '../features/grid-view/morphs/MapMorph.js';
import '../features/grid-view/morphs/TimelineMorph.js';

// Visual Data Morphs (datengetrieben)
import '../features/grid-view/morphs/RangeMorph.js';
import '../features/grid-view/morphs/ProgressMorph.js';
import '../features/grid-view/morphs/KeyValueMorph.js';

// Visual Chart Morphs (datengetrieben)
import '../features/grid-view/morphs/BarChartMorph.js';
import '../features/grid-view/morphs/PieChartMorph.js';
import '../features/grid-view/morphs/SparklineMorph.js';
import '../features/grid-view/morphs/RadarChartMorph.js';

// Import MorphHeader Feature
import '../features/morph-header/MorphHeader.js';

// Import Features
import '../features/bubble-view/BubbleView.js';
import '../features/bubble-view/BubbleHost.js';
import '../features/grid-view/GridHost.js';
import '../features/perspective-system/PerspectiveHost.js';
import '../features/perspective-system/PerspectiveCard.js';

// Import MorphMapper (Intelligent Morph Type Selection)
import { morphMapper } from '../features/grid-view/MorphMapper.js';

// Export für manuelle Imports
export { amorph, morphMapper };

// Make globally available
window.amorph = amorph;
window.amorph.morphMapper = morphMapper;

// Auto-enable essential reactors ONCE after page load
if (typeof window !== 'undefined') {
  // Wait for initial morphs to be registered
  setTimeout(() => {
    // Report total registered morphs
    const allMorphs = Array.from(document.querySelectorAll('[data-morph="true"]'));
    console.log(`📦 Registered ${allMorphs.length} morphs (silent mode for performance)`);
    
    // Enable PerspectiveReactor - should always be active
    amorph.enableReactor('perspective');
    console.log('✅ PerspectiveReactor enabled (auto)');
    
    // Enable ConvexSearchReactor (only once!)
    if (!amorph.state.enabledReactors.has('convex-search')) {
      amorph.enableReactor('convex-search');
      console.log('✅ ConvexSearchReactor enabled (auto)');
    }
    
    // Batch apply reactors to all existing morphs
    if (allMorphs.length > 0) {
      console.log(`🔄 Batch applying reactors to ${allMorphs.length} morphs...`);
      
      // Apply PerspectiveReactor in batch
      const perspectiveReactor = amorph.state.enabledReactors.get('perspective');
      if (perspectiveReactor && allMorphs.length > 0) {
        perspectiveReactor.apply(allMorphs);
        console.log(`✅ PerspectiveReactor applied to ${allMorphs.length} morphs`);
      }
    }
  }, 500);
}

// System Info ausgeben
console.log('🔮 AMORPH System loaded! (Feature-only structure)');
console.log('✅ Available as window.amorph');
console.log('📁 Structure:');
console.log('   - core/ (AmorphSystem, Redis, Observers)');
console.log('   - features/ (Each feature has its own morphs and reactors)');
console.log('System Info:', amorph.getSystemInfo());
