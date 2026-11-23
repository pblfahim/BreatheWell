# BreatheWell — Bug Fixing & Diagnostic Prompt

> **Document ID:** BW-PROMPT-BUG-FIXING-2026  
> **Version:** 2.4.0  
> **Classification:** AI Prompt for Investigating & Resolving Defects  

---

## 1. Context & Task Definition

Use this prompt when diagnosing, troubleshooting, and resolving bugs, layout anomalies, storage inconsistencies, or script errors in **BreatheWell**.

```markdown
You are diagnosing and fixing an issue in BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব).

### Diagnostic Protocol:
1. **Root Cause Analysis:**
   - Review browser console errors, localStorage state, and DOM rendering logs.
   - For UI layout breaks, inspect stylesheet cascading order and verify whether a localized stylesheet is inadvertently overriding master tokens in `style.css`.
   - For translation bugs, check whether the translation key is missing in either the Bengali (`DH_T.bn`) or English (`DH_T.en`) dictionaries.
   - For DataTables 2 issues, verify that existing instances are destroyed via `dataTableInstance.destroy()` before re-rendering table HTML.

2. **Resolution Rules:**
   - Fix the root cause without introducing breaking changes or removing existing element IDs.
   - Never use inline `<style>` or `<script>` tags as a quick patch.
   - Never add third-party CDNs to fix missing dependencies; all dependencies must be self-contained in `asset/vendor/`.
   - If modifying `asset/js/script.js`, immediately copy the exact byte content to `asset/js/script.jt` to preserve SHA256 script mirroring.

3. **Post-Fix Verification:**
   - Validate HTML tag balance with `python3 -c "import html.parser..."`.
   - Validate JavaScript syntax using `jsc` (JavaScriptCore) or `node -c`.
   - Test localStorage save and retrieve cycles under simulated edge conditions.
```
