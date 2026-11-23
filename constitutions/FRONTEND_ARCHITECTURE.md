# BreatheWell — Frontend Architecture Constitution

> **Document ID:** BW-CONST-ARCHITECTURE-2026  
> **Version:** 2.4.0  
> **Classification:** Architectural Governance & System Design Constitution  

---

## 1. Architectural Architecture Pattern

BreatheWell is built on a **Modular Native Multi-Page Architecture (MPA)**. Each page functions as an independent, deterministic entry point that coordinates with shared navigation and design tokens:

```
+-----------------------------------------------------------------------------------------+
|                                    BreatheWell MPA Architecture                         |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   | Presentation Tier (Semantic HTML5 Living Standard)                              |   |
|   | - 16 Static HTML Pages with zero inline style/script                            |   |
|   +---------------------------------------------------------------------------------+   |
|                                         |                                               |
|   +---------------------------------------------------------------------------------+   |
|   | Styling Tier (Modular CSS3 & Local Design Tokens)                               |   |
|   | - Master: style.css                                                             |   |
|   | - Domain Modules: health-tracker.css, prescription-create.css, digitalpad-*.css |   |
|   | - Local Vendor: Bootstrap 5.3.3 & Bootstrap Icons 1.11.3                        |   |
|   +---------------------------------------------------------------------------------+   |
|                                         |                                               |
|   +---------------------------------------------------------------------------------+   |
|   | Logic & State Tier (Vanilla ES6+ Controllers)                                   |   |
|   | - Global Navigation: global-nav.js                                              |   |
|   | - Page Controllers: exercises.js, health-*.js, prescription-*.js                |   |
|   | - Vendor Libraries: DataTables 2, jQuery 3.7.1, Tesseract.js v5, PDF.js 3.11   |   |
|   +---------------------------------------------------------------------------------+   |
|                                         |                                               |
|   +---------------------------------------------------------------------------------+   |
|   | Storage Tier (Isolated Client-Side Persistence)                                 |   |
|   | - localStorage (JSON Serialized Schemas)                                        |   |
|   +---------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Mandatory Architectural Directives

### Directive 1: Strict DOM & Script Decoupling
- HTML files must contain purely declarative semantic markup.
- All event handling must be attached via `addEventListener` in external JavaScript modules during or after `DOMContentLoaded`.
- Inline JavaScript event attributes (`onclick=""`, `onchange=""`, `onsubmit=""`) are strictly prohibited in core application scaffolding.

### Directive 2: Reactive Event-Driven Communication
- When global state mutations occur (such as toggling the active language), components communicate via decoupled Custom Events:
  ```javascript
  // Dispatching global language change
  window.dispatchEvent(new CustomEvent("bwLanguageChanged", {
    detail: { lang: currentLang }
  }));

  // Sub-controllers listen and reactively update
  window.addEventListener("bwLanguageChanged", (e) => {
    applyTranslations();
    reRenderActiveViews();
  });
  ```

### Directive 3: Local Storage Budget & Data Integrity
- Because browser `localStorage` enforces an origin quota (typically 5 MB to 10 MB), all large binary objects (e.g. photos of medical prescriptions) must be pre-processed on an HTML5 canvas to downsample resolution (maximum 1200px) and compress to JPEG format at 72% quality before persistence.
- Any storage operation must be encapsulated within defensive `try...catch` blocks to gracefully handle quota exceptions.

### Directive 4: Self-Contained Local Dependencies
- Every script tag, stylesheet link, font file, and icon package must reference relative paths within the `asset/` folder.
- No network requests to external CDNs (`unpkg.com`, `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`) are permitted.
