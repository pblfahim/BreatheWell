# BreatheWell — Code Review & Quality Assurance Prompt

> **Document ID:** BW-PROMPT-CODE-REVIEW-2026  
> **Version:** 2.4.0  
> **Classification:** AI Prompt for Pre-Merge Code Reviews  

---

## 1. Context & Task Definition

Use this prompt to execute a rigorous, multi-point code review on any proposed code change, pull request, or file modification in **BreatheWell**.

```markdown
You are performing a strict pre-merge code review for BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব).

Evaluate the proposed code changes against the following 10-point checklist:

### Pre-Merge Review Checklist:
1. [ ] **Privacy & Security:** Are 0 bytes of PHI/data transmitted externally? Are there zero analytics, trackers, or remote API endpoints?
2. [ ] **Zero Inline Code Policy:** Are there 0 inline `<style>` and 0 inline `<script>` tags introduced into HTML files?
3. [ ] **Local Vendor Assets Only:** Do all stylesheet links, script tags, fonts, and icons point exclusively to local `asset/vendor/` paths with zero CDN calls?
4. [ ] **Script Mirroring:** If `asset/js/script.js` was modified, is `asset/js/script.jt` updated to be byte-for-byte identical?
5. [ ] **HTML Tag Balance:** Are all opened HTML tags explicitly and correctly closed? (Run `python3 -c "import html.parser..."` to verify).
6. [ ] **JavaScript Quality:** Does the script run in strict mode? Are all DOM queries guarded against null references? Are dynamic inputs sanitized with `escapeHtml()`?
7. [ ] **Bilingual Parity:** Are all user-facing strings localized in both Bengali (`bn`) and English (`en`) with matching dictionary keys?
8. [ ] **Hero Tab Bar Integrity:** If `.ht-hero-tab-bar` is used, does it strictly inherit master styles from `style.css` without overriding rules?
9. [ ] **Touch & Responsiveness:** Are all interactive touch targets ≥ 44x44px? Does the layout render cleanly on mobile (<576px), tablet, and desktop viewports?
10. [ ] **Print Readiness:** If modifying medical or prescription sheets, does `@media print` hide web chrome and format cleanly on standard A4 paper?

### Review Verdict Format:
- **STATUS:** [APPROVED | CHANGES_REQUIRED]
- **VIOLATIONS FOUND:** [List any non-compliant items with exact file and line references]
- **CORRECTIVE ACTIONS:** [Provide exact code replacements to resolve violations]
```
