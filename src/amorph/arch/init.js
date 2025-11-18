/**
 * 🚀 AMORPH SYSTEM INITIALIZATION
 * 
 * Import dieses File um das AMORPH System zu starten!
 * 
 * Usage in Astro/HTML:
 * <script type="module">
 *   import '/src/amorph/init.js';
 * </script>
 * 
 * Das System ist dann global als `window.amorph` verfügbar!
 */

import { amorph } from './AmorphSystem.js';

// Import DOM Reactors
import { GlowReactor } from '../reactors/GlowReactor.js';
import { SearchReactor } from '../reactors/SearchReactor.js';
import { AnimationReactor } from '../reactors/AnimationReactor.js';
import { PulseReactor } from '../reactors/PulseReactor.js';
import { HoverReactor } from '../reactors/HoverReactor.js';
import { SortReactor } from '../reactors/SortReactor.js';
import { FilterReactor } from '../reactors/FilterReactor.js';
import { FlowReactor } from '../reactors/FlowReactor.js';
import { ColorShiftReactor } from '../reactors/ColorShiftReactor.js';
import { PerspectiveReactor } from '../reactors/PerspectiveReactor.js';
// PerspectiveWeightReactor REMOVED - used bubble-morph DOM elements that don't exist in Canvas BubbleView

// Import Canvas Reactors (BubbleView-specific)
import { CanvasUserNodeReactor } from '../reactors/canvas/CanvasUserNodeReactor.js';
import { CanvasPhysicsReactor } from '../reactors/canvas/CanvasPhysicsReactor.js';
import { CanvasConnectionReactor } from '../reactors/canvas/CanvasConnectionReactor.js';

// Register DOM Reactors
amorph.registerReactor('glow', GlowReactor);
amorph.registerReactor('search', SearchReactor);
amorph.registerReactor('animation', AnimationReactor);
amorph.registerReactor('pulse', PulseReactor);
amorph.registerReactor('hover', HoverReactor);
amorph.registerReactor('sort', SortReactor);
amorph.registerReactor('filter', FilterReactor);
amorph.registerReactor('flow', FlowReactor);
amorph.registerReactor('colorShift', ColorShiftReactor);
amorph.registerReactor('perspective', PerspectiveReactor);
// perspectiveWeight REMOVED - used bubble-morph DOM elements that don't exist in Canvas BubbleView

// Register Canvas Reactors
amorph.registerReactor('canvasUserNode', CanvasUserNodeReactor);
amorph.registerReactor('canvasPhysics', CanvasPhysicsReactor);
amorph.registerReactor('canvasConnection', CanvasConnectionReactor);

// Import Atomic Morphs
import '../morphs/data/NameMorph.js';
import '../morphs/data/ImageMorph.js';
import '../morphs/data/TagMorph.js';
import '../morphs/data/TextMorph.js';
import '../morphs/data/BooleanMorph.js';
import '../morphs/data/NumberMorph.js';
import '../morphs/data/ListMorph.js';
import '../morphs/data/DataMorph.js';
// BubbleMorph REMOVED - BubbleView now uses Canvas rendering, no DOM elements

// Import Advanced Morphs
import '../morphs/data/ChartMorph.js';
import '../morphs/data/MapMorph.js';
import '../morphs/data/TimelineMorph.js';

// Import Global Components
import '../morphs/global/MorphHeader.js';

// Import Views
import '../hosts/BubbleView.js';

// Import Hosts
import '../hosts/GridHost.js';
import '../hosts/BubbleHost.js';
import '../hosts/PerspectiveCard.js';

// Export für manuelle Imports
export { amorph };

// Make globally available
window.amorph = amorph;

// System Info ausgeben
console.log('🔮 AMORPH System loaded!');
console.log('✅ Available as window.amorph');
console.log('System Info:', amorph.getSystemInfo());
