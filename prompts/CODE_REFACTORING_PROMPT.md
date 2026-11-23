# BreatheWell — Code Refactoring Prompt

> **Document ID:** BW-PROMPT-CODE-REFACTOR-2026  
> **Version:** 2.4.0  
> **Classification:** AI Prompt for Systematic Code Refactoring  

---

## 1. Context & Task Definition

Use this prompt when performing structural code refactoring, dead code removal, or architectural consolidation across **BreatheWell**.

```markdown
You are refactoring code in BreatheWell to improve maintainability, reduce redundancy, and enhance performance.

### Refactoring Guidelines:
1. **Behavioral Invariance:**
   - The refactored code must produce identical outputs, DOM states, and localStorage side effects as the original code.
   - All existing user workflows (breathing sessions, vitals logging, prescription creation, printing, and CSV export) must remain fully intact.

2. **Code Simplification:**
   - Eliminate duplicated helper functions (e.g. date formatting, HTML entity escaping, CSV cell escaping) by standardizing on unified utilities.
   - Replace complex nested conditional logic with clean early returns.
   - Use descriptive, semantic variable and function names.

3. **Storage Hygiene:**
   - Ensure all `localStorage` reads and writes are guarded with `try...catch` blocks to prevent unhandled quota errors.
   - Maintain backwards-compatibility for existing storage keys (`bw_vitals_records`, `bw_prescriptions`, `bw_digitalpad_prescriptions`).

4. **Architectural Guardrails:**
   - Maintain 0 inline styles and 0 inline scripts.
   - Maintain byte-for-byte SHA256 equality between `asset/js/script.js` and `asset/js/script.jt`.
```
