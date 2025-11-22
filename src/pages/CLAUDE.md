# 📄 PAGES - Astro Pages & Routes (Funginomi Instance)

**Last Updated:** 22. November 2025

**⚠️ INSTANCE-SPECIFIC:** Diese Pages sind **Funginomi-spezifisch**. Das AMORPH Framework selbst ist page-agnostic. Andere Instanzen haben andere Routes (z.B. `/plants/[slug]` für Phytonomi), aber nutzen die gleichen Features (GridView, BubbleView, PerspectiveSystem).

## Übersicht

Alle Astro Pages der Funginomi AMORPH App:
- ✅ **fungi/index.astro**: Hauptseite mit Grid & Bubble View (framework-powered)
- ✅ **fungi/[slug].astro**: Detail-Seite für einzelnen Pilz (framework-powered)
- ✅ **[slug].astro**: Top-level slug route
- ✅ **api/search.ts**: Server-side search API endpoint (Convex-specific)

## Structure

```
pages/
├── [slug].astro              # Top-level dynamic route
├── api/
│   └── search.ts             # POST /api/search - Convex search endpoint
├── fungi/
│   ├── index.astro           # Main fungi listing page
│   └── [slug].astro          # Individual fungus detail page
└── CLAUDE.md                 # This file
```

**✨ NEW (2025-11-19) - Visual Design:**
- 🪵 **Wood floor background** - Natural texture on all cards
- 👆 **Touch-friendly interactions** - Hover stays until next touch
- 🔍 **Enhanced search highlighting** - Background gradient with border accent
- 📦 **Ultra-compact layout** - 40% less whitespace

---

## Architektur

Alle Pages verwenden:
- **BaseLayout.astro** als Layout Wrapper
- **Convex Client** für Server-Side Data Fetching
- **AMORPH System** für Morphs & Reactors
- **ConvexSearchReactor** für Server-Side Search
- **SearchFilterController** für Client-Side Highlighting

```
Convex (SSR) → Astro Page → BaseLayout → Morphs → AMORPH System
                                      ↓
                            SearchFilterController → Highlighting
```

---

## fungi/index.astro

### Funktion

**Hauptseite der Pilz-Datenbank** mit zwei Ansichten:
- ✅ **Grid View**: Standard-Ansicht (default)
- ✅ **Bubble View**: Force-directed Graph Visualization

### Features

- ✅ Lädt alle Fungi von Convex (SSR)
- ✅ View Toggle (Grid ↔ Bubble)
- ✅ BubbleHost mit data-driven Morph Creation
- ✅ GridHost für Standard-Ansicht
- ✅ Event System Integration

### Data Flow

```
1. Convex (SSR) → fetchFungi()
2. Astro → fungi array (3 Pilze)
3. BubbleHost.setData(fungi)
4. BubbleHost → createMorphsFromData()
5. Morphs → data-group Attribute (fungus-0, fungus-1, fungus-2)
6. BubbleView.setMorphs()
7. BubbleView → initializeBubbles() (gruppiert nach data-group)
8. Result: 3 Fungi → 12 Morphs → 3 Bubbles
```

### Code Structure

```astro
---
import BaseLayout from '@/amorph/arch/layouts/BaseLayout.astro';
import { fetchFungi } from '@/amorph/arch/convex';

const fungi = await fetchFungi();
---

<BaseLayout 
  title="Pilze - Funginomi AMORPH"
  enableGlow={true}
  enableSearch={true}
  enableAnimation={true}
>
  <!-- View Toggle -->
  <div class="view-toggle">
    <button data-view="grid">📊 Grid View</button>
    <button data-view="bubble">🫧 Bubble View</button>
  </div>

  <!-- Bubble Host (hidden by default) -->
  <bubble-host id="bubble-view-host" style="display: none;"></bubble-host>

  <!-- Grid Host (visible by default) -->
  <grid-host id="grid-view-host">
    {fungi.map((fungus) => (
      <!-- Grid items -->
    ))}
  </grid-host>
</BaseLayout>

<script define:vars={{ fungi }}>
  // View switching logic
  // Data injection for BubbleHost
  const bubbleHost = document.getElementById('bubble-view-host');
  bubbleHost.setData(fungi);
</script>
```

### Events Published

- `global:view-changed` - Beim View Toggle
- `host:data-loaded` - Wenn Daten geladen
- `host:morphs-generated` - Wenn Morphs erstellt

---

## fungi/[slug].astro **[KOMPLETT NEU 2025-11-15]**

### Funktion

**Detail-Seite mit PerspectiveHost Architektur** und Deep Recursive Rendering:
- ✅ Dynamic Route (`/fungi/pholiota-adiposa`)
- ✅ Lädt einzelnen Pilz von Convex via Slug
- ✅ **12 PerspectiveHosts** (ein Host pro Perspektive)
- ✅ **Deep Recursive Rendering** (automatisch alle Daten, 5 Levels tief)
- ✅ **FIFO-Logik** (max 4 Perspektiven gleichzeitig)
- ✅ **Event-Driven** (perspective-changed Events)

### Architektur

```
Convex (SSR)
    ↓
[slug].astro
    ↓
fungi object with 12 perspectives
    ↓
flattenObject(perspectiveData, maxDepth=5)
    ↓
Array<{ type, label, key, value/values/children }>
    ↓
renderField(field, depth)
    ↓
<perspective-host perspective="medicinalAndHealth">
    <tag-morph>, <text-morph>, nested sections
</perspective-host>
```

### Deep Recursive Flattening

**Philosophie:** KEINE hardcoded Felder - ALLES automatisch aus Schema:

```javascript
function flattenObject(obj, prefix='', maxDepth=5, currentDepth=0) {
  if (!obj || currentDepth >= maxDepth) return [];
  const results = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    // Array of strings → tags
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      results.push({ type: 'tags', label, key: fullKey, values: value });
      continue;
    }
    
    // Array of objects → recurse each item
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      value.forEach((item, idx) => {
        const subItems = flattenObject(item, `${fullKey}[${idx}]`, maxDepth, currentDepth + 1);
        results.push(...subItems);
      });
      continue;
    }
    
    // Empty array → skip
    if (Array.isArray(value) && value.length === 0) continue;
    
    // Object with min/max/unit → range
    if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
      results.push({ 
        type: 'text', 
        label, 
        key: fullKey, 
        value: `${value.min}-${value.max} ${value.unit || ''}`.trim() 
      });
      continue;
    }
    
    // Plain object → recurse into it
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenObject(value, fullKey, maxDepth, currentDepth + 1);
      if (nested.length > 0) {
        results.push({ type: 'section', label, key: fullKey, children: nested });
      }
      continue;
    }
    
    // Primitive values
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      results.push({ type: 'text', label, key: fullKey, value: String(value) });
    }
  }
  
  return results;
}
```

### Recursive Rendering mit visueller Hierarchie

```javascript
function renderField(field, depth = 0) {
  // Tags → Horizontal Tag-Liste
  if (field.type === 'tags') {
    return (
      <div class="morph-wrapper" style={`margin-left: ${depth * 1}rem`}>
        <label class="morph-label">{field.label}</label>
        <div class="tags-container">
          {field.values.map((tag) => <tag-morph tag={tag}></tag-morph>)}
        </div>
      </div>
    );
  }
  
  // Text → Text-Morph
  if (field.type === 'text') {
    return <text-morph value={field.value} label={field.label} 
                       style={`margin-left: ${depth * 1}rem`}></text-morph>;
  }
  
  // Section → Nested mit Kinder
  if (field.type === 'section') {
    return (
      <div class="nested-section" style={`margin-left: ${depth * 1}rem`}>
        <h4 class="nested-title">{field.label}</h4>
        {field.children.map((child) => renderField(child, depth + 1))}
      </div>
    );
  }
  
  return null;
}
```

### Perspectives Array (EXAKTE Schema-Feldnamen!)

```javascript
const perspectives = [
  { id: 'taxonomy', title: 'Taxonomy', icon: '🧬', color: '#ef4444', data: fungus.taxonomy },
  { id: 'physicalCharacteristics', title: 'Physical', icon: '👁️', color: '#f97316', data: fungus.physicalCharacteristics },
  { id: 'ecologyAndHabitat', title: 'Ecology', icon: '🌍', color: '#eab308', data: fungus.ecologyAndHabitat },
  { id: 'culinaryAndNutritional', title: 'Culinary', icon: '🍳', color: '#22c55e', data: fungus.culinaryAndNutritional },
  { id: 'medicinalAndHealth', title: 'Medicinal', icon: '⚕️', color: '#06b6d4', data: fungus.medicinalAndHealth },
  { id: 'cultivationAndProcessing', title: 'Cultivation', icon: '🌱', color: '#3b82f6', data: fungus.cultivationAndProcessing },
  { id: 'safetyAndIdentification', title: 'Safety', icon: '⚠️', color: '#8b5cf6', data: fungus.safetyAndIdentification },
  { id: 'chemicalAndProperties', title: 'Chemical', icon: '🧪', color: '#ec4899', data: fungus.chemicalAndProperties },
  { id: 'culturalAndHistorical', title: 'Cultural', icon: '📜', color: '#d946ef', data: fungus.culturalAndHistorical },
  { id: 'commercialAndMarket', title: 'Commercial', icon: '💰', color: '#14b8a6', data: fungus.commercialAndMarket },
  { id: 'environmentalAndConservation', title: 'Environment', icon: '🌿', color: '#10b981', data: fungus.environmentalAndConservation },
  { id: 'researchAndInnovation', title: 'Innovation', icon: '🔬', color: '#0ea5e9', data: fungus.researchAndInnovation }
];
```

### Data Flow

```
1. URL → /fungi/pholiota-adiposa
2. Astro.params.slug → "pholiota-adiposa"
3. fetchFungus(slug) → Convex Query (mit korrekten Feldnamen!)
4. fungus object → 12 perspective data objects
5. perspectives.map() → Create PerspectiveHost for each
6. flattenObject(p.data) → Recursive flattening (maxDepth=5)
7. renderField(field, depth) → Morphs mit visual hierarchy
8. Result: 12 PerspectiveHosts mit datengetriebenen Morphs
```

### Default Perspectives (Initial State)

```javascript
const defaultPerspectives = [
  'taxonomy', 
  'ecologyAndHabitat', 
  'culinaryAndNutritional', 
  'safetyAndIdentification'
];

window.addEventListener('DOMContentLoaded', () => {
  window.dispatchEvent(new CustomEvent('perspective-changed', {
    detail: { perspectives: defaultPerspectives }
  }));
  console.log('[Detail Page] Initialized with deep recursion. Default perspectives:', defaultPerspectives);
});
```

### Code Structure

```astro
---
import BaseLayout from '@/amorph/arch/layouts/BaseLayout.astro';
import { fetchFungus } from '@/amorph/arch/convex';

const { slug } = Astro.params;
const fungusData = await fetchFungus(slug);

if (!fungusData) {
  return Astro.redirect('/fungi');
}
---

<BaseLayout title={`${fungusData.commonName} - Funginomi`}>
  <!-- Hero Section -->
  <section class="hero">
    <img src={fungusData.imageUrl} alt={fungusData.commonName} />
    <h1>{fungusData.commonName}</h1>
    <p class="latin-name">{fungusData.latinName}</p>
  </section>

  <!-- Perspective Tabs -->
  <div class="perspective-tabs">
    {perspectives.map((p) => (
      <button data-perspective={p.id}>{p.icon} {p.name}</button>
    ))}
  </div>

  <!-- Content Sections (per Perspective) -->
  <div class="perspective-content">
    <!-- Taxonomie -->
    <!-- Morphologie -->
    <!-- Culinary -->
    <!-- etc. -->
  </div>
</BaseLayout>
```

---

## demo.astro

### Funktion

**Demo/Test-Seite für alle AMORPH Features**:
- ✅ Alle Morph-Typen (Name, Image, Tag, Text, Boolean, Number, List)
- ✅ Alle Reactors (Glow, Search, Animation, Pulse, Hover)
- ✅ Perspective System
- ✅ Search System
- ✅ Tag System
- ✅ Performance Monitoring
- ✅ DevTools Integration

### Features

- ✅ Hero Section mit System Stats
- ✅ Atomic Morphs Showcase
- ✅ Reactor Controls (Enable/Disable)
- ✅ Perspective Picker (Multi-Select)
- ✅ Search Bar
- ✅ Tag Cloud
- ✅ Performance Metrics
- ✅ Event Log

### Use Cases

- Testing neuer Features
- Debugging Reactor Behavior
- Performance Testing
- Visual Regression Testing
- Documentation Showcase

### Code Structure

```astro
---
import BaseLayout from '@/amorph/arch/layouts/BaseLayout.astro';
---

<BaseLayout title="AMORPH Demo">
  <!-- Stats -->
  <div class="stats">
    <div class="stat">Morphs: <span id="morph-count">0</span></div>
    <div class="stat">Reactors: <span id="reactor-count">9</span></div>
    <div class="stat">Perspectives: <span id="perspective-count">12</span></div>
  </div>

  <!-- Morph Showcase -->
  <section class="section">
    <h2>📦 Atomic Morphs</h2>
    <div class="morph-grid">
      <name-morph primary="Amanita muscaria"></name-morph>
      <image-morph src="/images/fungi.jpg"></image-morph>
      <tag-morph tag="edible"></tag-morph>
      <text-morph text="Lorem ipsum..."></text-morph>
      <!-- etc. -->
    </div>
  </section>

  <!-- Reactor Controls -->
  <section class="section">
    <h2>⚡ Reactors</h2>
    <div class="reactor-controls">
      <button data-reactor="glow">Glow</button>
      <button data-reactor="search">Search</button>
      <button data-reactor="animation">Animation</button>
      <!-- etc. -->
    </div>
  </section>

  <!-- Perspective Picker -->
  <section class="section">
    <h2>👁️ Perspectives</h2>
    <div class="perspective-picker">
      <!-- 12 perspective buttons -->
    </div>
  </section>
</BaseLayout>
```

---

## Routing

```
/                          → (redirect to /fungi)
/fungi                     → fungi/index.astro
/fungi/steinpilz           → fungi/[slug].astro
/fungi/mandelpilz          → fungi/[slug].astro
/demo                      → demo.astro
```

---

## Shared Patterns

Alle Pages folgen diesen Patterns:

### 1. **Layout Wrapper**
```astro
<BaseLayout title="..." enableGlow={true}>
  <!-- Content -->
</BaseLayout>
```

### 2. **Data Fetching (SSR)**
```astro
---
import { fetchFungi } from '@/amorph/arch/convex';
const data = await fetchFungi();
---
```

### 3. **Client-Side Hydration**
```astro
<script define:vars={{ data }}>
  // Client-side logic
  const host = document.getElementById('host');
  host.setData(data);
</script>
```

### 4. **Event Publishing**
```javascript
await amorph.streamPublish('global:view-changed', { viewMode: 'bubble' });
await amorph.streamPublish('layout:rendered', { layoutName: 'fungi-index' });
```

---

## Performance

### SSR (Server-Side)
- Convex Queries sind **fast** (< 10ms)
- Data wird **cached** (Convex Edge Cache)
- Pages werden **pre-rendered** (Astro SSG möglich)

### Client-Side
- Morphs registrieren sich **automatisch**
- Reactors werden **lazy** applied
- BubbleView rendert mit **requestAnimationFrame**
- Events werden **batched** (Redis Streams)

---

## SEO

### Meta Tags
Alle Pages haben:
- `<title>` mit Pilzname
- `<meta name="description">` mit Beschreibung
- Open Graph Tags (für Social Media)
- JSON-LD Structured Data (für Google)

### URLs
- SEO-friendly Slugs (`/fungi/steinpilz` statt `/fungi/123`)
- Canonical URLs
- Sitemap (via Astro)

---

## Accessibility

- ✅ Semantic HTML (`<main>`, `<section>`, `<article>`)
- ✅ ARIA Labels für Buttons
- ✅ Keyboard Navigation (Tab, Enter, Space)
- ✅ Focus Styles
- ✅ Screen Reader Support

---

## Status: ✅ ALLE PAGES IMPLEMENTIERT

Alle 3 Pages sind fertig und produktionsbereit.

**Latest Updates (2025-11-15):**
- ✅ fungi/index.astro mit Grid & Bubble View Toggle
- ✅ BubbleHost Integration mit data-driven Morphs
- ✅ fungi/[slug].astro mit allen 12 Perspektiven
- ✅ demo.astro als vollständiges Feature Showcase
- ✅ Redis Stream Events für alle Page Actions
- ✅ SSR Data Fetching mit Convex

**Event System:**
- `global:view-changed` - View Toggle
- `layout:rendered` - Page Rendered
- `global:navigation` - Navigation Events
- `host:data-loaded` - Data Loading Complete

Siehe auch: `STREAM_OBSERVER_SYSTEM.md`
