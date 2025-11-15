# 📄 PAGES - Astro Pages & Routes

## Übersicht

Alle Astro Pages der Funginomi AMORPH App:
- ✅ **fungi/index.astro**: Hauptseite mit Grid & Bubble View
- ✅ **fungi/[slug].astro**: Detail-Seite für einzelnen Pilz
- ✅ **demo.astro**: Demo/Test-Seite für alle Features

---

## Architektur

Alle Pages verwenden:
- **BaseLayout.astro** als Layout Wrapper
- **Convex Client** für Server-Side Data Fetching
- **AMORPH System** für Morphs & Reactors
- **Redis Stream Events** für State Management

```
Convex (SSR) → Astro Page → BaseLayout → Morphs → AMORPH System
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

## fungi/[slug].astro

### Funktion

**Detail-Seite für einzelnen Pilz** mit allen Informationen:
- ✅ Dynamic Route (`/fungi/steinpilz`, `/fungi/mandelpilz`)
- ✅ Lädt einzelnen Pilz von Convex via Slug
- ✅ Zeigt alle 12 Perspektiven
- ✅ Vollständige Daten (Taxonomie, Morphologie, Culinary, etc.)

### Features

- ✅ Hero Section mit Bild & Namen
- ✅ Perspective Tabs (12 Perspektiven)
- ✅ Taxonomie-Baum
- ✅ Physical Characteristics
- ✅ Culinary Information
- ✅ Medicinal Properties
- ✅ Safety & Toxicity
- ✅ Ecology & Habitat
- ✅ Navigation (Back to List)

### Data Flow

```
1. URL → /fungi/steinpilz
2. Astro.params.slug → "steinpilz"
3. fetchFungus(slug) → Convex Query
4. fungusData → Full fungus object
5. Render → All perspectives & data
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
