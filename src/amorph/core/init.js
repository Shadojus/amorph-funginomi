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
 * NEW FEATURE-BASED STRUCTURE:
 * - core/ - Core system files
 * - features/ - Feature-specific components (bubble-view, grid-view, etc.)
 * - shared/ - Shared components (morphs, reactors, observers)
 */

import { amorph } from './AmorphSystem.js';

// Import Shared Reactors (work everywhere)
import { GlowReactor } from '../shared/reactors/GlowReactor.js';
import { AnimationReactor } from '../shared/reactors/AnimationReactor.js';
import { PulseReactor } from '../shared/reactors/PulseReactor.js';
import { HoverReactor } from '../shared/reactors/HoverReactor.js';
import { SortReactor } from '../shared/reactors/SortReactor.js';
import { FilterReactor } from '../shared/reactors/FilterReactor.js';

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

// Register Shared Reactors
amorph.registerReactor('glow', GlowReactor);
amorph.registerReactor('animation', AnimationReactor);
amorph.registerReactor('pulse', PulseReactor);
amorph.registerReactor('hover', HoverReactor);
amorph.registerReactor('sort', SortReactor);
amorph.registerReactor('filter', FilterReactor);

// Register Search System (Convex-based - replaces old SearchReactor)
amorph.registerReactor('convex-search', ConvexSearchReactor);
// Legacy: amorph.registerReactor('search', SearchReactor);

// Register Perspective System
amorph.registerReactor('perspective', PerspectiveReactor);

// Register BubbleView Reactors
amorph.registerReactor('canvasUserNode', CanvasUserNodeReactor);
amorph.registerReactor('canvasPhysics', CanvasPhysicsReactor);
amorph.registerReactor('canvasConnection', CanvasConnectionReactor);

// Import Shared Morphs
import '../shared/morphs/data/NameMorph.js';
import '../shared/morphs/data/ImageMorph.js';
import '../shared/morphs/data/TagMorph.js';
import '../shared/morphs/data/TextMorph.js';
import '../shared/morphs/data/BooleanMorph.js';
import '../shared/morphs/data/NumberMorph.js';
import '../shared/morphs/data/ListMorph.js';
import '../shared/morphs/data/DataMorph.js';
import '../shared/morphs/data/ChartMorph.js';
import '../shared/morphs/data/MapMorph.js';
import '../shared/morphs/data/TimelineMorph.js';

// Import Global Components
import '../shared/morphs/global/MorphHeader.js';

// Import Features
import '../features/bubble-view/BubbleView.js';
import '../features/bubble-view/BubbleHost.js';
import '../features/grid-view/GridHost.js';
import '../features/perspective-system/PerspectiveHost.js';
import '../features/perspective-system/PerspectiveCard.js';

// Export für manuelle Imports
export { amorph };

// Make globally available
window.amorph = amorph;

// System Info ausgeben
console.log('🔮 AMORPH System loaded! (Feature-based structure)');
console.log('✅ Available as window.amorph');
console.log('📁 Structure:');
console.log('   - core/ (AmorphSystem, Redis, etc.)');
console.log('   - features/ (bubble-view, grid-view, perspective-system, search-system)');
console.log('   - shared/ (morphs, reactors, observers)');
console.log('System Info:', amorph.getSystemInfo());
