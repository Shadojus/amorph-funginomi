/**
 * 🎨 CANVAS REACTORS
 * ==================
 * 
 * Spezialisierte Reactors für Canvas-basierte Visualisierungen
 * 
 * Im Gegensatz zu DOM-Reactors arbeiten diese mit:
 * - Canvas 2D Context
 * - requestAnimationFrame Loop
 * - Eigene Datenstrukturen (Maps, Arrays)
 * 
 * Verwendung:
 * import { CanvasUserNodeReactor } from '@/amorph/reactors/canvas';
 * amorph.registerReactor('canvasUserNode', CanvasUserNodeReactor);
 * bubbleView.enableReactor('canvasUserNode');
 */

export { CanvasReactor } from './CanvasReactor.js';
export { CanvasUserNodeReactor } from './CanvasUserNodeReactor.js';
export { CanvasPhysicsReactor } from './CanvasPhysicsReactor.js';
export { CanvasConnectionReactor } from './CanvasConnectionReactor.js';
