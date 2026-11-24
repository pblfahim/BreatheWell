# BreatheWell — Coding Standards & Style Conventions

> **Document ID:** BW-CONST-CODING-STANDARDS-2026  
> **Version:** 2.4.0  
> **Classification:** Engineering Standards & Code Quality Guidelines  

---

## 1. JavaScript (ES6+) Standards

### 1.1 Strict Mode & Scoping
- All JavaScript files must execute in strict mode via `"use strict";` or immediate-invoked function expressions (IIFE):
  ```javascript
  (function () {
    "use strict";
    // Component logic
  })();
  ```
- No global variable leaks: all variables must be declared with `const` (preferred) or `let`. `var` is strictly disallowed.

### 1.2 Defensive Programming & Error Handling
- Never assume a DOM element exists before attaching an event listener or querying its properties. Always use optional chaining or explicit null checks:
  ```javascript
  // Standard BreatheWell DOM binding
  $("btnSubmit")?.addEventListener("click", handleSubmit);
  ```
- All JSON parsing and localStorage access must be wrapped in `try...catch` blocks with sensible fallbacks:
  ```javascript
  function loadRecords(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn(`[BreatheWell] Storage read error for ${key}:`, err);
      return fallback;
    }
  }
  ```

### 1.3 HTML Sanitization & XSS Prevention
- Dynamic text insertion from user input must always be sanitized before being injected into the DOM.
- Use `textContent` for plain text, or a robust HTML entity escaper when interpolating into template literals:
  ```javascript
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  ```

---

## 2. HTML5 Semantic Conventions

1. **Tag Balancing:** Every opened tag must be cleanly and explicitly closed. Automated parsers enforce 0 tag balance errors.
2. **Standard Document Skeleton:**
   ```html
   <!DOCTYPE html>
   <html lang="bn">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title data-*-i18n="...">Page Title - BreatheWell</title>
     <!-- Local CSS Dependencies -->
   </head>
   <body class="bn" data-page="page-identifier">
     <a class="visually-hidden-focusable position-absolute top-0 start-0 p-3 bg-white" href="#main" data-i18n="skip">মূল কনটেন্টে যান</a>
     <!-- Global Top Navigation -->
     <main id="main">
       <!-- Primary Content -->
     </main>
     <!-- Global Footer & Mobile Navigation -->
   </body>
   </html>
   ```
3. **Zero Inline Code Policy:** `0` inline `<style>` and `0` inline `<script>` tags across all HTML pages.

---

## 3. CSS3 & BEM-Inspired Naming

1. **Scoped Prefixes:**
   - Global classes: `.bw-*`
   - Health tracker: `.ht-*`
   - Prescription vault: `.rx-*`
   - Prescription history: `.ph-*`
   - Prescription creator studio: `.cp-*`
   - Prescription pad: `.pp-*`
   - Digital pad history: `.dh-*`
2. **Explicit CSS Variables:**
   - Avoid hardcoding color hex codes inside rule blocks. Always map to design tokens:
   `background: var(--dh-primary, #0d9488);`
3. **Print Media Rules:**
   - Every domain stylesheet must include `@media print` rules ensuring clean A4 output without navigation elements.
