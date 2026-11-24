# BreatheWell — UI Implementation Prompt

> **Document ID:** BW-PROMPT-UI-IMPLEMENT-2026  
> **Version:** 2.4.0  
> **Classification:** AI Prompt for Implementing New Features & Components  

---

## 1. Context & Task Definition

Use this prompt when implementing a new user-facing interface, screen, component, or interactive tool in **BreatheWell**.

```markdown
You are implementing a new UI component/page for BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব).

### Requirements Checklist:
1. **Semantic HTML:**
   - Use semantic tags (<header>, <nav>, <main id="main">, <section>, <footer>).
   - Include skip link: `<a class="visually-hidden-focusable position-absolute top-0 start-0 p-3 bg-white" href="#main" data-i18n="skip">মূল কনটেন্টে যান</a>`.
   - Never use inline `<style>` or `<script>` tags.

2. **Styling & Design Tokens:**
   - Use CSS custom properties defined in `style.css` (--bw-primary: #1769aa, --bw-teal: #00897b, --bw-emerald: #10b981, --bw-surface: #ffffff, --bw-line: #e2e8f0).
   - If adding a tab header bar, use `.ht-hero-tab-bar` with `.ht-hero-tabs` and `.ht-hero-tab` without overriding its CSS.
   - Maintain minimum touch target size of 44x44px.
   - Support mobile viewports (<992px) with bottom clearance for `#mobileBottomNav`.

3. **Controller & JavaScript:**
   - Wrap JS in strict IIFE `(function () { "use strict"; ... })();`.
   - Use defensive element querying with optional chaining (`$("element")?.addEventListener(...)`).
   - Sanitize all dynamic string interpolations via `escapeHtml()`.
   - Support bilingual switching by reading `bw_lang` ('bn' or 'en') and listening for the `bwLanguageChanged` event.

4. **Dependencies:**
   - Link only local vendor assets from `asset/vendor/` (Bootstrap 5.3.3, Bootstrap Icons 1.11.3, fonts).
   - Never use external CDNs.
```
