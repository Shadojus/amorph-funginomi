# 🔮 PERSPECTIVE HOST ARCHITECTURE
## Implementation Status: ✅ Ready

## Overview
Jede Perspektive auf den Detailseiten bekommt ihren eigenen `PerspectiveHost` mit eigenen Morphs. Der MorphHeader hat einen Multi-Perspektiven-Switcher (max 4 aktiv, FIFO-Prinzip).

## Created Files

### 1. `/src/amorph/hosts/PerspectiveHost.js`
**Status:** ✅ Created
**Purpose:** Custom Web Component (Lit) für einzelne Perspektiven

**Features:**
- `perspective` property - ID der Perspektive (z.B. "taxonomy")
- `active` property - Boolean, ob diese Perspektive angezeigt wird
- `title`, `icon`, `color` - Visuelle Eigenschaften
- Smooth animations (fade in/out, translateY)
- Auto-hide wenn nicht aktiv (position: absolute, visibility: hidden)
- Slot für Morphs
- Event listener für `perspective-changed` Events

**Usage:**
```astro
<perspective-host
  perspective="taxonomy"
  title="Taxonomy"
  icon="🧬"
  color="#ef4444"
>
  <text-morph value="Fungi" label="Kingdom"></text-morph>
  <text-morph value="Basidiomycota" label="Phylum"></text-morph>
</perspective-host>
```

## Modified Files

### 2. `/src/amorph/morphs/global/MorphHeader.js`
**Status:** ✅ Extended
**Changes:**
- Added `dispatchPerspectiveChange()` method
- Modified `addPerspective()` - Now implements FIFO (removes oldest when max 4 reached)
- Modified `removePerspective()` - Dispatches global event
- Dispatches `window.dispatchEvent('perspective-changed', { perspectives: [] })`

**How it works:**
1. User clicks perspective chip in header
2. `addPerspective()` called
3. If 4 perspectives already active → removes first (oldest)
4. Adds new perspective to array
5. Calls `dispatchPerspectiveChange()`
6. Window event dispatched with active perspective IDs
7. All `PerspectiveHost` components listen and show/hide themselves

### 3. `/src/pages/[slug].astro` 
**Status:** ⚠️ Needs Manual Update
**What needs to change:**

**OLD Structure:**
```astro
<section class="perspective-section">
  <h3>🔬 Taxonomy</h3>
  <div class="data-grid">
    <text-morph value="Fungi" label="Kingdom"></text-morph>
  </div>
</section>
```

**NEW Structure:**
```astro
<perspective-host
  perspective="taxonomy"
  title="Taxonomy"
  icon="🧬"
  color="#ef4444"
>
  <text-morph value="Fungi" label="Kingdom"></text-morph>
</perspective-host>
```

**Steps to Update:**
1. Replace all `<section class="perspective-section">` with `<perspective-host>`
2. Add perspective properties: `perspective`, `title`, `icon`, `color`
3. Remove section headers (h3) - PerspectiveHost handles this
4. Add BaseLayout prop: `showPerspectives={true}`
5. Add script to import PerspectiveHost and initialize default perspectives

## Perspective Definitions

```typescript
const perspectives = [
  { id: 'taxonomy', title: 'Taxonomy', icon: '🧬', color: '#ef4444' },
  { id: 'physicalCharacteristics', title: 'Physical', icon: '👁️', color: '#f97316' },
  { id: 'ecologyAndHabitat', title: 'Ecology', icon: '🌍', color: '#eab308' },
  { id: 'culinaryAndNutritional', title: 'Culinary', icon: '🍳', color: '#22c55e' },
  { id: 'medicinalAndBioactive', title: 'Medicinal', icon: '⚕️', color: '#06b6d4' },
  { id: 'cultivationAndProcessing', title: 'Cultivation', icon: '🌱', color: '#3b82f6' },
  { id: 'safetyAndIdentification', title: 'Safety', icon: '⚠️', color: '#8b5cf6' },
  { id: 'biochemistry', title: 'Biochemistry', icon: '🧪', color: '#ec4899' },
  { id: 'culturalAndHistorical', title: 'Cultural', icon: '📜', color: '#d946ef' },
  { id: 'commercialAndEconomic', title: 'Commercial', icon: '💰', color: '#14b8a6' },
  { id: 'legalAndRegulatory', title: 'Legal', icon: '⚖️', color: '#64748b' },
  { id: 'researchAndInnovation', title: 'Research', icon: '🔬', color: '#0ea5e9' }
];
```

## Event Flow

```mermaid
User clicks perspective chip
    ↓
MorphHeader.addPerspective()
    ↓
Check if 4 active → Remove oldest (FIFO)
    ↓
Add new perspective to activePerspectives array
    ↓
dispatchPerspectiveChange()
    ↓
window.dispatchEvent('perspective-changed', { perspectives: ['taxonomy', 'ecology', ...] })
    ↓
All PerspectiveHost components listen
    ↓
Each checks if its perspective ID is in array
    ↓
Sets this.active = true/false
    ↓
CSS animations fade in/out
```

## FIFO Logic

```javascript
// Example: Max 4 perspectives
// Active: ['taxonomy', 'ecology', 'culinary', 'safety']
// User clicks 'medicinal'

// BEFORE:
activePerspectives = ['taxonomy', 'ecology', 'culinary', 'safety']

// AFTER (removes 'taxonomy', adds 'medicinal'):
activePerspectives = ['ecology', 'culinary', 'safety', 'medicinal']
```

## BaseLayout Integration

Add `showPerspectives` prop to show perspective switcher in header:

```astro
<BaseLayout 
  title="Detail Page"
  showPerspectives={true}
>
```

This enables the perspective chips row in MorphHeader.

## Next Steps

1. **Manually update** `/src/pages/[slug].astro`:
   - Replace all sections with perspective-hosts
   - Add script to import PerspectiveHost.js
   - Add DOMContentLoaded listener to dispatch initial state
   
2. **Set default perspectives:**
   ```javascript
   const defaultPerspectives = [
     'taxonomy',
     'ecologyAndHabitat',
     'culinaryAndNutritional',
     'safetyAndIdentification'
   ];
   ```

3. **Test in browser:**
   - Navigate to detail page
   - Click perspective chips in header
   - Verify FIFO behavior (click 5th perspective, oldest should disappear)
   - Verify smooth animations

## Technical Notes

- **Web Components:** PerspectiveHost uses Lit 3.x
- **Shadow DOM:** Yes, for encapsulated styles
- **Events:** Window-level for cross-component communication
- **Performance:** Only 4 hosts rendered at once, others hidden with CSS
- **Accessibility:** Keyboard navigation supported in MorphHeader chips

## Integration Checklist

- [x] Create PerspectiveHost.js
- [x] Extend MorphHeader with FIFO logic
- [x] Add dispatchPerspectiveChange() method
- [ ] Update [slug].astro with perspective-hosts
- [ ] Add script to import PerspectiveHost
- [ ] Add default perspective initialization
- [ ] Test in browser
- [ ] Verify FIFO behavior
- [ ] Test animations
