/**
 * 🎯 PERSPECTIVE FIELD MAPPINGS - Frontend Re-Export
 * 
 * ⚠️ SINGLE SOURCE OF TRUTH: convex/perspectiveFieldMappings.ts
 * 
 * Diese Datei re-exportiert alle Perspektiven-Definitionen aus dem Backend.
 * Alle Farben, Labels, Icons werden ZENTRAL in convex/perspectiveFieldMappings.ts definiert.
 * 
 * Verwendung im Frontend:
 * import { perspectiveDefinitions, getPerspectiveColor } from '@/amorph/core/perspectiveFieldMappings';
 */

// Re-export everything from the backend source of truth
export {
  // Field mappings
  fieldToPerspectiveIndex,
  
  // Perspective definitions (colors, labels, icons)
  perspectiveDefinitions,
  
  // Helper functions
  getPerspectiveColor,
  getPerspectiveDefinition,
  getAllPerspectiveColors,
  getPerspectiveForField,
  getFieldsForPerspective,
  getPerspectivesWithCounts,
  getAllPerspectives,
  isFieldMapped,
  getMappingStatistics,
  getFieldKeyToPerspectiveMapping,
  
  // Schema fields grouped by perspective
  perspectiveSchemaFields,
} from '../../../convex/perspectiveFieldMappings';
