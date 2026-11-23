# BreatheWell — UI Redesign & Modernization Prompt

> **Document ID:** BW-PROMPT-UI-REDESIGN-2026  
> **Version:** 2.4.0  
> **Classification:** AI Prompt for Redesigning Existing Pages & Sections  

---

## 1. Context & Task Definition

Use this prompt when updating, modernizing, or restructuring an existing screen, section, or component in **BreatheWell**.

```markdown
You are modernizing and redesigning an existing UI section in BreatheWell.

### Redesign Directives:
1. **Preserve Functional Parity:**
   - Retain all existing element IDs, form inputs, event listeners, and data-attribute hooks so existing JavaScript controllers continue functioning seamlessly.
   - Retain all bilingual `data-*-i18n` attributes.

2. **Align with Design Tokens:**
   - Migrate any hardcoded color hex values to scoped tokens:
     - Primary Ocean Blue: `var(--bw-primary, #1769aa)`
     - Forest Green Tab Bar: `#0f4c3a`
     - Medical Teal: `var(--dh-primary, #0d9488)`
     - Healthy Emerald: `var(--bw-emerald, #10b981)`
     - Card Background: `var(--bw-surface, #ffffff)`
     - Canvas Background: `var(--bw-surface-alt, #f8fafc)`
     - Borders: `var(--bw-line, #e2e8f0)`

3. **Responsive Consistency:**
   - Ensure the updated layout renders cleanly across mobile (<576px), tablet (768px-991px), and desktop (≥992px).
   - If redesigning a prescription or medical sheet, ensure `@media print` rules strip out UI chrome and format cleanly on standard A4 paper.

4. **Zero Inline Code Policy:**
   - Never add inline `<style>` or `<script>` tags to the HTML file. Place all CSS updates in the appropriate domain stylesheet in `asset/css/`.
```
