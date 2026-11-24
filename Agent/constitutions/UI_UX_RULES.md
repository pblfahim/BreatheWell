# BreatheWell — UI/UX Design Rules & Human Ergonomics

> **Document ID:** BW-CONST-UIUX-RULES-2026  
> **Version:** 2.4.0  
> **Classification:** User Experience Design Constitution  

---

## 1. Ten Universal UI/UX Laws of BreatheWell

### Law 1: Consistency Across All 16 Pages
- Every page in the application must share the exact same top desktop navbar, bottom mobile drawer (<992px), offcanvas menu, and footer disclaimer.
- The `.ht-hero-tab-bar` must strictly inherit from `style.css` across all prescription and vitals suites.

### Law 2: The 44px Touch Target Rule
- All clickable and touch-interactive elements (buttons, links, drawer handles, language pills, form inputs, pagination numbers) must have an effective touch target of at least **`44x44px`**.

### Law 3: Non-Reliance on Color Alone
- Never communicate clinical meaning solely through color.
- A critical hypertensive blood pressure reading or urgent prescription must pair red color with an alert icon (`bi-exclamation-triangle-fill`) and clear textual severity labels ("Hypertensive Crisis / জরুরি").

### Law 4: Immediate Feedback on User Action
- Button clicks, form submissions, and data deletions must trigger immediate visual confirmation within **`50ms`**.
- Long-running processes (e.g. Tesseract OCR scanning, image downsampling) must show a loading spinner, progress indicator, or active status text.

### Law 5: Error Prevention & Non-Destructive Defaults
- Destructive actions (e.g., deleting a clinical record or wiping the vault) must prompt the user with an explicit confirmation dialog before executing.
- Deletions must confirm via custom modal or standard browser `confirm()` with a clear warning.

### Law 6: Zero Content Jitter (Numerical Stability)
- Numerical metrics that count or update rapidly (stopwatches, breathing ring timers, heart rate monitors) must employ `font-variant-numeric: tabular-nums` to guarantee fixed horizontal digit width.

### Law 7: Seamless Bilingual Parity
- No user interface element shall remain untranslated when switching between Bengali (`bn`) and English (`en`).
- Switching language must occur instantaneously without page reloads or loss of in-progress form inputs.

### Law 8: Respect for Reduced Motion Preferences
- High-intensity animations (expanding breathing circles, floating bubbles, celebratory confetti) must be suppressed or simplified when `@media (prefers-reduced-motion: reduce)` is enabled on the user's OS.

### Law 9: Clean Print Fidelity
- Printing any prescription must render a pristine medical sheet on standard A4 paper without navigation bars, search inputs, or button chrome.

### Law 10: Clear Medical Disclaimers
- Every page must feature the universal healthcare disclaimer:
  *"সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।" / "For general wellness. Not a substitute for medical advice."*
