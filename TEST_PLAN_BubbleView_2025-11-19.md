# 🧪 BubbleView Diagnostic Test Plan - 19. November 2025

## ✅ Änderungen implementiert

### 1. Diagnostic Logs hinzugefügt
- ✅ **Line 310-318:** Pre-update state logging
  - Bubble count
  - UserNodeData existence
  - Connection size
  - Bubble keys array

- ✅ **Line 406-426:** Method entry diagnostics
  - Method entry confirmation (`⚡ METHOD ENTERED`)
  - State check before guard clauses
  - Detailed guard clause logging with emojis
  - Success message after passing guards

### 2. Legacy Code entfernt
- ✅ **AstroDataSearchReactor.js** - Gelöscht
- ✅ **SearchReactor.js** - Gelöscht
- ✅ **fungi/index.astro** - Usage entfernt (Lines 600-612)
- ✅ **fungi/index.astro** - Kommentar aktualisiert (Line 689)
- ✅ **search-system/CLAUDE.md** - Dokumentation aktualisiert
- ✅ **SYSTEM_ASSESSMENT_2025-11-19.md** - Status aktualisiert

---

## 🧪 Test-Durchführung

### Dev Server Status
✅ **Astro Dev Server läuft**
- URL: http://localhost:4321
- Port: 4321
- Mode: Development

### Test 1: Browser Console öffnen
**Schritte:**
1. Browser öffnen: http://localhost:4321/fungi
2. DevTools öffnen (F12)
3. Console Tab auswählen
4. Seite neu laden (Ctrl+R)

**Erwartete Logs (in dieser Reihenfolge):**

```
[BubbleView] ✅ Created Canvas data for X bubbles

[BubbleView] 🔍 Pre-update state: {
  bubblesCount: X,
  hasUserNodeData: true/false,
  userNodeConnectionsSize: X,
  bubbleKeys: [...]
}

[BubbleView] ⚡ METHOD ENTERED: updateUserNodeConnections()

[BubbleView] ⚡ State check: {
  hasUserNodeData: true/false,
  bubblesSize: X,
  userNodeDataType: "..."
}

DANN ENTWEDER:
Option A (Erfolg):
[BubbleView] ✅ Guard clauses passed, proceeding with connection updates
[BubbleView] 👤 USER NODE: X total connections...
[BubbleView] 📏 Updating bubble sizes for X bubbles
[BubbleView] 📏 User node connections: [...]
[BubbleView] 📏 slug: size XXpx, weight 0.XX
...

ODER Option B (Guard Clause blockiert):
[BubbleView] ⚠️ GUARD CLAUSE 1: No userNodeData available
[BubbleView] ⚠️ userNodeData value: undefined

ODER Option C (Guard Clause 2 blockiert):
[BubbleView] ⚠️ GUARD CLAUSE 2: No bubbles available to connect
[BubbleView] ⚠️ bubbles.size: 0
```

**Ergebnis dokumentieren:**
- [ ] Welche Logs erscheinen?
- [ ] Welche Guard Clause blockiert (falls vorhanden)?
- [ ] Erscheinen die 📏 Size-Update-Logs?

---

### Test 2: JavaScript Fehler prüfen

**Schritte:**
1. Console nach roten Fehler-Meldungen durchsuchen
2. Besonders achten auf:
   - TypeError
   - ReferenceError
   - Uncaught exceptions

**Erwartetes Ergebnis:**
- ✅ Keine roten Fehler
- ⚠️ Gelbe Warnings sind OK
- ℹ️ Info-Logs sind OK

**Ergebnis dokumentieren:**
- [ ] Fehler gefunden? (Ja/Nein)
- [ ] Fehler-Text kopieren (falls vorhanden)

---

### Test 3: BubbleView visuell prüfen

**Schritte:**
1. Warte bis Bubbles erscheinen (ca. 1-2 Sekunden)
2. Beobachte die Bubble-Größen
3. Bubble-Ansicht aktivieren (Toggle-Button)

**Erwartetes Ergebnis:**
- ✅ Bubbles werden gerendert
- ✅ Bubbles haben unterschiedliche Größen
- ✅ Size-Range: 60px - 140px
- ✅ User Node ist sichtbar (zentral, 160px)
- ✅ Verbindungslinien erscheinen

**Ergebnis dokumentieren:**
- [ ] Bubbles sichtbar? (Ja/Nein)
- [ ] Größen unterschiedlich? (Ja/Nein)
- [ ] User Node sichtbar? (Ja/Nein)
- [ ] Verbindungen sichtbar? (Ja/Nein)

---

### Test 4: Search-Funktionalität

**Schritte:**
1. In Suchfeld tippen: "beauveria"
2. Console Logs beobachten
3. Warten (300ms debounce)
4. Grid-View Highlighting prüfen

**Erwartete Logs:**
```
🔍 Search completed: { query: "beauveria", ... }
[BubbleView] 🔍 Search completed: { query: "beauveria", ... }
[BubbleView] ⚡ METHOD ENTERED: updateUserNodeConnections()
[BubbleView] 👤 USER NODE: X total connections...
[BubbleView] 📏 Updating bubble sizes...
```

**Erwartetes visuelles Ergebnis:**
- ✅ Matching cards bleiben sichtbar
- ✅ Non-matching cards ausgeblendet (display: none)
- ✅ Matching values haben blauen Gradient-Hintergrund
- ✅ Border-left: 3px solid blue auf Highlights
- ✅ Perspektiven-Buttons aktivieren sich automatisch

**Ergebnis dokumentieren:**
- [ ] Search handler feuert? (Ja/Nein)
- [ ] Size update logs nach Search? (Ja/Nein)
- [ ] Highlighting funktioniert? (Ja/Nein)
- [ ] Auto-Perspektiven aktiviert? (Ja/Nein)

---

### Test 5: Perspective-System

**Schritte:**
1. Klick auf verschiedene Perspektiven-Buttons
2. Console Logs beobachten
3. Visuelles Feedback prüfen

**Erwartete Logs:**
```
[GlobalObserver] Perspective activated: taxonomy
[BubbleView] 🔄 Perspective changed: [...]
[BubbleView] ⚡ METHOD ENTERED: updateUserNodeConnections()
[BubbleView] 👤 USER NODE: X total connections...
```

**Erwartetes visuelles Ergebnis:**
- ✅ Irrelevante Morphs dimmen (opacity 0.3)
- ✅ Relevante Morphs normal (opacity 1.0)
- ✅ FIFO Queue funktioniert (max 4 aktiv)
- ✅ Bubbles passen Größe an (wenn Perspektive Gewichtung ändert)

**Ergebnis dokumentieren:**
- [ ] Perspective Events feuern? (Ja/Nein)
- [ ] Size updates nach Perspective-Wechsel? (Ja/Nein)
- [ ] Visuelles Dimming funktioniert? (Ja/Nein)

---

### Test 6: Grid ↔ Bubble Toggle

**Schritte:**
1. Toggle zwischen Grid und Bubble View
2. Console Logs beobachten
3. Performance prüfen (flüssig?)

**Erwartetes Ergebnis:**
- ✅ Smooth Transition
- ✅ Canvas Reactors werden aktiviert/deaktiviert
- ✅ Keine Fehler beim Wechsel
- ✅ Size updates bleiben konsistent

**Ergebnis dokumentieren:**
- [ ] Toggle funktioniert? (Ja/Nein)
- [ ] Fehler beim Wechsel? (Ja/Nein)
- [ ] Performance OK? (Ja/Nein)

---

## 📊 Diagnose-Szenarien

### Szenario A: Alle Logs erscheinen ✅
**Bedeutung:** Size update pipeline funktioniert!
**Nächste Schritte:**
- Verify bubble sizes visuell
- Check if weight calculation correct
- Remove diagnostic logs (optional)
- Mark issue as RESOLVED

### Szenario B: Guard Clause 1 blockiert ⚠️
**Log:** `⚠️ GUARD CLAUSE 1: No userNodeData available`
**Bedeutung:** UserNode nicht initialisiert vor bubble creation
**Nächste Schritte:**
1. Check `initializeUserNode()` timing
2. Verify `this.userNodeData` assignment
3. Move `updateUserNodeConnections()` call später

### Szenario C: Guard Clause 2 blockiert ⚠️
**Log:** `⚠️ GUARD CLAUSE 2: No bubbles available to connect`
**Bedeutung:** Bubbles noch nicht in Map eingetragen
**Nächste Schritte:**
1. Check `createCanvasBubbles()` implementation
2. Verify `this.bubbles.set(...)` calls
3. Add setTimeout delay before connection update

### Szenario D: Keine Logs erscheinen ❌
**Bedeutung:** JavaScript Fehler BEVOR method entry
**Nächste Schritte:**
1. Check red error messages in console
2. Verify file loaded correctly
3. Check for syntax errors
4. Try browser hard reload (Ctrl+Shift+R)

### Szenario E: Method entry logs, aber keine weiteren ⚠️
**Bedeutung:** Fehler WÄHREND method execution
**Nächste Schritte:**
1. Check for errors between guard clauses and line 509
2. Look for silent exceptions
3. Add try-catch blocks
4. Verify connection weight calculation

---

## 🎯 Success Criteria

### Minimum (Issue als teilweise gelöst):
- [ ] 🔍 Pre-update state logs erscheinen
- [ ] ⚡ Method entry logs erscheinen
- [ ] ⚠️ Guard clause logs zeigen Grund für Blockierung

### Ideal (Issue als komplett gelöst):
- [ ] ✅ Guard clauses werden durchlaufen
- [ ] 👤 User node connection logs erscheinen
- [ ] 📏 Size update logs erscheinen
- [ ] 🎨 Bubbles zeigen unterschiedliche Größen
- [ ] 🔍 Search updates bubble sizes
- [ ] 🎭 Perspective changes update bubble sizes

---

## 📝 Test-Ergebnisse

**Datum:** _______________  
**Tester:** _______________  
**Browser:** _______________ (Version: _______)

### Test 1 Ergebnis:
```
[Logs hier einfügen]
```

### Test 2 Ergebnis:
```
[Fehler hier einfügen, falls vorhanden]
```

### Test 3 Ergebnis:
- Bubbles sichtbar: ______
- Größen variieren: ______
- User Node OK: ______

### Test 4 Ergebnis:
- Search handler fires: ______
- Size updates nach Search: ______
- Highlighting OK: ______

### Test 5 Ergebnis:
- Perspective events: ______
- Size updates: ______
- Dimming: ______

### Test 6 Ergebnis:
- Toggle funktioniert: ______
- Keine Fehler: ______

### Gesamtbewertung:
- [ ] ✅ ALLES FUNKTIONIERT
- [ ] ⚠️ TEILWEISE FUNKTIONIERT (Details: _______________)
- [ ] ❌ FUNKTIONIERT NICHT (Details: _______________)

### Nächste Schritte:
```
[Basierend auf Testergebnissen hier dokumentieren]
```

---

## 🛠️ Rollback Plan (falls nötig)

Falls schwerwiegende Probleme auftreten:

```powershell
# Git Status prüfen
git status

# Änderungen anzeigen
git diff

# Rollback einzelner Datei
git checkout -- src/amorph/features/bubble-view/BubbleView.js

# ODER: Alle Änderungen verwerfen
git reset --hard HEAD
```

**Wichtig:** Erst testen, dann committen!

---

**Test Plan erstellt:** 19. November 2025  
**Nächster Review:** Nach Test-Durchführung
