# BreatheWell — Comprehensive QA & Testing Plan

> **Document ID:** BW-PLAN-TESTING-2026  
> **Version:** 2.4.0  
> **Classification:** Quality Assurance Protocols & Verification Gates  

---

## 1. Overview & Quality Objectives

The **BreatheWell Testing Plan** guarantees that every feature, clinical classification algorithm, storage operation, and responsive view is verified against strict deterministic quality gates prior to production releases:

1. **Zero Runtime Exceptions:** Zero unhandled JavaScript errors in the browser console.
2. **Deterministic HTML Balance:** Perfect semantic HTML tag balances (`div`, `nav`, `section`, `footer`) validated via automated CI parser scripts.
3. **Clinical Math Accuracy:** 100% adherence to AHA 2017 BP and ADA 2024 Glucose categorization standards.
4. **Offline Integrity:** 100% functionality with network disabled.

---

## 2. Testing Matrices

### 2.1 Cross-Browser & Device Matrix

| Environment | Engine | Resolution / Viewport | Focus Areas |
| :--- | :--- | :--- | :--- |
| **Google Chrome (Desktop)** | Blink / V8 | 1920x1080, 1440x900 | Core animation rAF, Web Audio synthesis, OCR worker |
| **Mozilla Firefox (Desktop)**| Gecko / SpiderMonkey| 1920x1080 | Canvas downsampling, DataTables 2 sorting, Print layout |
| **Apple Safari (macOS)** | WebKit / JSC | 1440x900, 2560x1440 | Backdrop blur filters, SVG chart rendering, Web Speech |
| **Microsoft Edge (Desktop)** | Blink / V8 | 1920x1080 | Dual-pane studio layout, PDF canvas rasterization |
| **Apple Safari (iOS)** | WebKit Mobile | 390x844 (iPhone 14/15) | Mobile bottom nav, touch drag, address bar dvh stability |
| **Google Chrome (Android)** | Blink Mobile | 412x915 (Pixel / Galaxy)| Touch-scroll hero tabs, camera photo upload, storage |

---

## 3. Automated & Systematic Test Suites

### 3.1 Automated HTML Parser Verification
A Python-based automated syntax validator validates all 16 HTML pages for tag balance and structural integrity:
```python
import html.parser

class BalancedParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
    def handle_starttag(self, tag, attrs):
        if tag not in ['meta', 'link', 'br', 'hr', 'input', 'img']:
            self.tags.append(tag)
    def handle_endtag(self, tag):
        if tag not in ['meta', 'link', 'br', 'hr', 'input', 'img']:
            assert self.tags.pop() == tag
```

### 3.2 JavaScriptCore (JSC) Engine Syntax Evaluation
All scripts are evaluated against the native JavaScriptCore engine to ensure clean syntax, strict mode compliance, and zero undeclared variables:
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc asset/js/digitalpad-history.js
```

### 3.3 Clinical Classification Unit Verification
- **Systolic 118 / Diastolic 76** -> Must classify as `Normal` (Green).
- **Systolic 124 / Diastolic 78** -> Must classify as `Elevated` (Amber).
- **Systolic 134 / Diastolic 84** -> Must classify as `Hypertension Stage 1` (Orange).
- **Systolic 150 / Diastolic 95** -> Must classify as `Hypertension Stage 2` (Rose).
- **Systolic 190 / Diastolic 125** -> Must classify as `Hypertensive Crisis` (Crimson Glow).
- **Glucose 88 mg/dL (Fasting)** -> Must classify as `Normal`.
- **Glucose 115 mg/dL (Fasting)** -> Must classify as `Pre-diabetes`.
- **Glucose 145 mg/dL (Fasting)** -> Must classify as `Diabetes`.

### 3.4 LocalStorage Boundary & Stress Testing
- Test persistence of 100+ simulated prescription records and 500+ vitals entries.
- Verify canvas downsampling keeps average record size under `85 KB`, allowing hundreds of documents to comfortably fit inside the standard `5 MB` client `localStorage` budget.
