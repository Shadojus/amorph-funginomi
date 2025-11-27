/**
 * 🔮 DETAIL VIEW MORPHS - INDEX
 * =============================
 * 
 * Central export for all detail-view morphs.
 * Import this file to register all morphs at once.
 * 
 * Usage:
 * import 'src/amorph/features/detail-view/morphs/index.js';
 * 
 * Or import specific morphs:
 * import { DataMorph, TagMorph } from 'src/amorph/features/detail-view/morphs/index.js';
 */

// Design tokens
export { globalStyles, perspectiveColors, getPerspectiveColor } from './tokens.js';

// Data-driven mapper
export { DetailMorphMapper, renderMorphs } from './DetailMorphMapper.js';

// Core Morphs
export { DataMorph } from './DataMorph.js';
export { KeyValueMorph } from './KeyValueMorph.js';
export { TagMorph } from './TagMorph.js';
export { TextMorph } from './TextMorph.js';
export { RangeMorph } from './RangeMorph.js';
export { RadarChartMorph } from './RadarChartMorph.js';
export { TimelineMorph } from './TimelineMorph.js';

// Specialized Morphs (existing)
export { View360Morph } from './View360Morph.js';
export { SafetyMorph } from './SafetyMorph.js';
export { QuickFactsMorph } from './QuickFactsMorph.js';
export { MiniBubbleView } from './MiniBubbleView.js';

// Register all custom elements
import './DataMorph.js';
import './KeyValueMorph.js';
import './TagMorph.js';
import './TextMorph.js';
import './RangeMorph.js';
import './RadarChartMorph.js';
import './TimelineMorph.js';
import './View360Morph.js';
import './SafetyMorph.js';
import './QuickFactsMorph.js';
import './MiniBubbleView.js';
