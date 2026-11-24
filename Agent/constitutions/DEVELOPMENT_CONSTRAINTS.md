# BreatheWell — Development Constraints & Invariants

> **Document ID:** BW-CONST-CONSTRAINTS-2026  
> **Version:** 2.4.0  
> **Classification:** Non-Negotiable Engineering Invariants  

---

## 1. Absolute Architectural Constraints

These six constraints are non-negotiable architectural invariants of BreatheWell. Any pull request, refactor, or AI-generated modification that violates any of these rules must be rejected immediately:

```
+-----------------------------------------------------------------------------------------+
| BreatheWell Hard Constraints Matrix                                                     |
+-------------------+---------------------------------------------------------------------+
| Invariant         | Exact Specification & Enforcement Rule                              |
+-------------------+---------------------------------------------------------------------+
| 1. Zero Cloud     | 0 bytes of PHI or user data transmitted externally. No analytics,   |
|    Phoning        | no cloud databases, no telemetry endpoints.                         |
+-------------------+---------------------------------------------------------------------+
| 2. Zero Inline    | 0 inline <style> tags and 0 inline <script> tags across all HTML.   |
|    Code Policy    | Enforces strict Content Security Policy (CSP).                      |
+-------------------+---------------------------------------------------------------------+
| 3. Local Vendor   | 100% of vendor scripts, CSS, and fonts must be hosted locally in   |
|    Assets Only    | asset/vendor/. Zero external CDN dependencies permitted.            |
+-------------------+---------------------------------------------------------------------+
| 4. Script         | Byte-for-byte SHA256 equality must be maintained between            |
|    Mirroring      | asset/js/script.js and asset/js/script.jt.                          |
+-------------------+---------------------------------------------------------------------+
| 5. Zero Build     | Native web standards only (HTML5, CSS3, ES6+). No Webpack, Vite,   |
|    Step Required  | Babel, TypeScript, or JSX compilation needed to run the app.        |
+-------------------+---------------------------------------------------------------------+
| 6. Tag Balance    | Automated HTML parsing must return 0 tag mismatch/unclosed errors   |
|    Integrity      | across all 16 HTML pages.                                           |
+-------------------+---------------------------------------------------------------------+
```

---

## 2. Verification Protocol for Constraints

To verify compliance prior to deployment:
```bash
# 1. Verify Zero External CDN links in HTML files
grep -E "https?://(cdn|unpkg|cdnjs|fonts\.googleapis)" *.html

# 2. Verify Zero Inline Styles and Scripts
grep -n "<style" *.html
grep -n "<script>" *.html

# 3. Verify Deterministic Script Mirroring
diff asset/js/script.js asset/js/script.jt
shasum -a 256 asset/js/script.js asset/js/script.jt

# 4. Verify HTML Tag Balance Across All 16 Pages
python3 -c "
import html.parser
for path in ['index.html', 'exercises.html', 'breath-test.html', 'health-reading.html', 'health-history.html', 'health-charts.html', 'health-demo.html', 'prescriptions-volt.html', 'prescription-history.html', 'prescription-create.html', 'prescription-pad.html', 'digitalpad-history.html', 'login.html', 'register.html', 'profile.html']:
    with open(path) as f:
        html.parser.HTMLParser().feed(f.read())
print('All 16 pages balanced!')
"
```
