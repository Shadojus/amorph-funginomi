/**
 * 🔬 HILBERT SPACE SIMILARITY
 * ===========================
 * 
 * Berechnet Ähnlichkeit zwischen Pilzen im Hilbert-Raum basierend auf aktiven Perspektiven
 * Je mehr gemeinsame Eigenschaften in aktiven Perspektiven, desto höher die Similarity
 * 
 * Usage:
 * const similarity = HilbertSpaceSimilarity.calculate(fungus1, fungus2, activePerspectives);
 * // Returns 0-1 (0 = komplett unterschiedlich, 1 = identisch)
 */

export class HilbertSpaceSimilarity {
  /**
   * Calculate similarity between two fungi in Hilbert space
   * @param {Object} fungus1 - First fungus data
   * @param {Object} fungus2 - Second fungus data
   * @param {Array<string>} activePerspectives - Active perspective names
   * @returns {number} Similarity score 0-1
   */
  static calculate(fungus1, fungus2, activePerspectives = []) {
    if (!fungus1 || !fungus2) return 0;
    if (activePerspectives.length === 0) {
      // If no perspectives active, use all
      activePerspectives = [
        'taxonomy',
        'physicalCharacteristics',
        'ecologyAndHabitat',
        'culinaryAndNutritional',
        'medicinalAndHealth',
        'cultivationAndProcessing',
        'safetyAndIdentification',
        'chemicalAndProperties',
        'culturalAndHistorical',
        'commercialAndMarket',
        'environmentalAndConservation',
        'researchAndInnovation'
      ];
    }

    let totalSimilarity = 0;
    let perspectiveCount = 0;

    // Calculate similarity for each active perspective
    for (const perspective of activePerspectives) {
      const data1 = fungus1[perspective];
      const data2 = fungus2[perspective];

      if (!data1 || !data2) continue;

      const similarity = this.comparePerspectiveData(data1, data2);
      totalSimilarity += similarity;
      perspectiveCount++;
    }

    return perspectiveCount > 0 ? totalSimilarity / perspectiveCount : 0;
  }

  /**
   * Compare two perspective data objects
   * @param {Object} data1 - First perspective data
   * @param {Object} data2 - Second perspective data
   * @returns {number} Similarity score 0-1
   */
  static comparePerspectiveData(data1, data2) {
    if (!data1 || !data2) return 0;

    let matches = 0;
    let totalFields = 0;

    // Get all unique field names
    const fields = new Set([
      ...Object.keys(data1),
      ...Object.keys(data2)
    ]);

    for (const field of fields) {
      const value1 = data1[field];
      const value2 = data2[field];

      if (value1 === undefined && value2 === undefined) continue;

      totalFields++;

      if (this.compareValues(value1, value2)) {
        matches++;
      }
    }

    return totalFields > 0 ? matches / totalFields : 0;
  }

  /**
   * Compare two values (handles arrays, objects, primitives)
   * @param {*} value1 - First value
   * @param {*} value2 - Second value
   * @returns {boolean} True if similar
   */
  static compareValues(value1, value2) {
    // Both undefined/null
    if (value1 == null && value2 == null) return true;
    if (value1 == null || value2 == null) return false;

    // Arrays
    if (Array.isArray(value1) && Array.isArray(value2)) {
      return this.compareArrays(value1, value2);
    }

    // Objects
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return this.compareObjects(value1, value2);
    }

    // Primitives
    return value1 === value2;
  }

  /**
   * Compare two arrays (Jaccard similarity)
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {boolean} True if similarity > 0.5
   */
  static compareArrays(arr1, arr2) {
    if (arr1.length === 0 && arr2.length === 0) return true;
    if (arr1.length === 0 || arr2.length === 0) return false;

    // Convert to sets for intersection/union
    const set1 = new Set(arr1.map(v => JSON.stringify(v)));
    const set2 = new Set(arr2.map(v => JSON.stringify(v)));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const jaccardSimilarity = intersection.size / union.size;
    return jaccardSimilarity > 0.3; // 30% overlap threshold
  }

  /**
   * Compare two objects recursively
   * @param {Object} obj1 - First object
   * @param {Object} obj2 - Second object
   * @returns {boolean} True if similarity > 0.5
   */
  static compareObjects(obj1, obj2) {
    const keys = new Set([
      ...Object.keys(obj1),
      ...Object.keys(obj2)
    ]);

    let matches = 0;
    let total = keys.size;

    for (const key of keys) {
      if (this.compareValues(obj1[key], obj2[key])) {
        matches++;
      }
    }

    return matches / total > 0.5;
  }

  /**
   * Calculate weighted similarity based on perspective importance
   * @param {Object} fungus1 - First fungus
   * @param {Object} fungus2 - Second fungus
   * @param {Map<string, number>} perspectiveWeights - Perspective -> weight (0-1)
   * @returns {number} Weighted similarity 0-1
   */
  static calculateWeighted(fungus1, fungus2, perspectiveWeights) {
    if (!fungus1 || !fungus2 || !perspectiveWeights) return 0;

    let totalWeightedSimilarity = 0;
    let totalWeight = 0;

    for (const [perspective, weight] of perspectiveWeights.entries()) {
      const data1 = fungus1[perspective];
      const data2 = fungus2[perspective];

      if (!data1 || !data2) continue;

      const similarity = this.comparePerspectiveData(data1, data2);
      totalWeightedSimilarity += similarity * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalWeightedSimilarity / totalWeight : 0;
  }

  /**
   * Get perspective weights from active perspectives (FIFO-based)
   * Newer perspectives have higher weight
   * @param {Array<string>} activePerspectives - Ordered array (oldest first)
   * @returns {Map<string, number>} Perspective -> weight
   */
  static getPerspectiveWeights(activePerspectives) {
    const weights = new Map();
    const count = activePerspectives.length;

    if (count === 0) return weights;

    // Weight increases with recency (FIFO: oldest = index 0, newest = last)
    activePerspectives.forEach((perspective, index) => {
      // Linear weight: oldest = 0.25, newest = 1.0
      const weight = 0.25 + (index / Math.max(1, count - 1)) * 0.75;
      weights.set(perspective, weight);
    });

    return weights;
  }

  /**
   * Calculate similarity matrix for all fungi
   * @param {Array<Object>} fungi - Array of fungus data
   * @param {Array<string>} activePerspectives - Active perspectives
   * @returns {Map<string, Map<string, number>>} Matrix of similarities
   */
  static calculateMatrix(fungi, activePerspectives) {
    const matrix = new Map();

    for (let i = 0; i < fungi.length; i++) {
      const fungus1 = fungi[i];
      const similarities = new Map();

      for (let j = 0; j < fungi.length; j++) {
        if (i === j) {
          similarities.set(fungus1.slug, 1.0); // Self-similarity is 1
          continue;
        }

        const fungus2 = fungi[j];
        const similarity = this.calculate(fungus1, fungus2, activePerspectives);
        similarities.set(fungus2.slug, similarity);
      }

      matrix.set(fungus1.slug, similarities);
    }

    return matrix;
  }
}

export default HilbertSpaceSimilarity;
