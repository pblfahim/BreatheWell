# BreatheWell — Accessibility Specification (a11y)

> **Document ID:** BW-SPEC-A11Y-2026  
> **Version:** 2.4.0  
> **Compliance Target:** WCAG 2.1 Level AA  
> **Classification:** Accessibility & Inclusive Design Standards  

---

## 1. Accessibility Commitment & Principles

BreatheWell is built on the principle that digital healthcare tools must be accessible to everyone, including elderly patients, individuals with motor or visual impairments, individuals experiencing acute panic/anxiety episodes, and bilingual users with varied literacy levels.

The platform targets full compliance with the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**, organized across the four POUR pillars:
1. **Perceivable:** Information and UI components must be presentable in ways users can perceive.
2. **Operable:** User interface components and navigation must be operable via diverse input methods (mouse, keyboard, touch, screen readers).
3. **Understandable:** Information and operation of the user interface must be clear, predictable, and bilingual.
4. **Robust:** Content must be robust enough to be interpreted reliably by assistive technologies.

---

## 2. Landmark & Semantic Structure

### 2.1 Semantic Landmarks
Every page in BreatheWell is strictly organized with semantic HTML5 elements:
- `<a class="visually-hidden-focusable" href="#main">`: Top skip navigation link.
- `<header>` / `<nav class="navbar">`: Primary navigation landmark.
- `<main id="main">`: Unique main content landmark.
- `<section>` / `<article>`: Thematic content regions.
- `<footer>`: Global footer landmark.

### 2.2 Skip Navigation Link
Every page includes an immediate keyboard bypass link as the first focusable element:
```html
<a class="visually-hidden-focusable position-absolute top-0 start-0 p-3 bg-white" href="#main" data-i18n="skip">
  মূল কনটেন্টে যান
</a>
```
When tabbed to via keyboard, the link becomes visible at the top-left corner, allowing keyboard and screen-reader users to bypass repetitive top navigation bars and jump straight to primary content.

---

## 3. Keyboard Navigation & Focus Management

- **Focus Visibility:**
  - All interactive controls (buttons, links, inputs, selects, segmented pills) have a visible high-contrast focus ring:
    `outline: 2px solid #1769aa; outline-offset: 2px;` or `box-shadow: 0 0 0 3px rgba(23, 105, 170, 0.25);`.
  - Focus is never removed with `outline: none` without providing a distinct replacement style.
- **Logical Tab Order:**
  - Tab order strictly mirrors visual reading order (top-to-bottom, left-to-right).
  - No positive `tabindex` attributes are used.
- **Escape Key Handlers:**
  - Fullscreen lightbox viewer (`#phLightbox`) and prescription detail modal (`#dhDetailModal`) listen for `Escape` key events to dismiss immediately and return focus to the triggering element.
- **Interactive Role Attributes:**
  - Hero tabs utilize `role="tablist"` with `role="tab"` and `aria-selected="true|false"`.
  - Filter bars utilize `role="group"` with descriptive `aria-label`.

---

## 4. Visual Ergonomics & Color Contrast

- **Contrast Ratios:**
  - Normal text (< 18pt regular): Minimum contrast ratio of **4.5:1** against backgrounds.
  - Large text (≥ 18pt or ≥ 14pt bold): Minimum contrast ratio of **3.0:1**.
  - UI components and graphical objects: Minimum contrast ratio of **3.0:1** against adjacent colors.
- **Non-Reliance on Color Alone:**
  - Clinical status tiers (Normal, Elevated, Stage 1, Stage 2, Crisis) always pair color badges with explicit text labels and iconography (e.g. check circle for normal, alert triangle for high).
- **Reduced Motion Sensitivity:**
  All stylesheet modules include `@media (prefers-reduced-motion: reduce)` rules that disable or reduce non-essential transitions, scaling pulses, and spinning animations:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 5. Screen Reader Announcements & ARIA Strategy

- **`aria-live="polite"` Regions:**
  - Respiration instruction text and stopwatch timers announce phase transitions without interrupting ongoing user tasks.
  - Dynamic galleries (`#phGallery`, `#dhGallery`) use `aria-live="polite"` to notify screen readers when search filters update the visible card list.
  - Toast notification stacks (`#rxToastStack`) use `role="status"` and `aria-live="polite"`.
- **Form Labels & Accessibility:**
  - Every form input has an associated explicit `<label for="...">` or `aria-label`.
  - Number inputs for vitals (Systolic, Diastolic, Glucose) have descriptive placeholder and unit annotations (`aria-describedby`).

---

## 6. Dual-Script Typographical Accessibility

- **Bengali Script Support:**
  - Noto Sans Bengali glyphs are rendered with optimized line-heights (`1.6` for body text) to prevent diacritic clipping (হ্রস্ব-ই কার, দীর্ঘ-ঈ কার, য-ফলা).
  - Font scaling allows user browser font resizing up to 200% without horizontal truncation or layout breakdown.
- **Tabular Figures:**
  - All numerical countdowns, timers, and clinical metrics use `font-variant-numeric: tabular-nums` to ensure monospaced digit widths, preventing visual text jitter during live session updates.
