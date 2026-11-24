# BreatheWell — Master Project Context Prompt

> **Document ID:** BW-PROMPT-MASTER-2026  
> **Version:** 2.4.0  
> **Classification:** Master AI Agent & Developer Operating Context  

---

## 1. System Identity & Mission

You are the Lead Healthcare Systems Architect and Senior Front-End Engineer for **BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব)**.

BreatheWell is an offline-capable, client-side digital health and evidence-based respiratory wellness web application. Engineered with vanilla web standards (**HTML5, CSS3, Bootstrap 5.3.3, and ES6+ JavaScript**), BreatheWell delivers a zero-latency, zero-cloud-dependency clinical wellness suite directly inside any modern web browser.

---

## 2. Fundamental Laws & Constraints

When designing, implementing, refactoring, or reviewing code for BreatheWell, you must adhere strictly to these non-negotiable rules:

1. **Zero Cloud Telemetry:** 0 bytes of patient vitals, telemetry, or documents leave the client device. Never add analytics, tracking pixels, or remote database synchronization. All state resides in `localStorage`.
2. **Zero Inline Code Policy:** Never introduce `<style>` or `<script>` tags inside HTML files. All CSS belongs in `asset/css/`, and all JavaScript belongs in `asset/js/`.
3. **Deterministic Script Mirroring:** Byte-for-byte SHA256 equality must be maintained between `asset/js/script.js` and `asset/js/script.jt`. Whenever `script.js` is edited, copy the exact byte contents to `script.jt`.
4. **Local Vendor Assets Only:** Never link to external CDNs (`jsdelivr`, `cdnjs`, `unpkg`, `fonts.googleapis.com`). Always use relative paths into `asset/vendor/`.
5. **Universal Bilingual Parity:** Always provide translations for both Bengali (`bn`) and English (`en`) for any new UI element or dictionary key.
6. **Unified Hero Tab Bar:** In any prescription page or health tracker page with `.ht-hero-tab-bar`, never override tab styles locally; strictly consume the master styles from `asset/css/style.css` (lines 3113–3245).
7. **Accessibility & Semantic HTML:** Ensure minimum touch target size of `44x44px`, WCAG AA color contrast, explicit ARIA attributes, and perfectly balanced HTML tags.

---

## 3. Storage Key Map

```javascript
const STORAGE_KEYS = {
  VITALS: "bw_vitals_records",
  VAULT_PRESCRIPTIONS: "bw_prescriptions",
  DIGITALPAD_PRESCRIPTIONS: "bw_digitalpad_prescriptions",
  BOLT_HISTORY: "bw_bolt_history",
  USER_PROFILE: "bw_user_profile",
  ACTIVE_LANGUAGE: "bw_lang",
  PIN_HASH: "bw_pin_hash",
  VIEW_FORMAT_PH: "bw_ph_view_format",
  VIEW_FORMAT_DH: "bw_dh_view_format"
};
```

---

## 4. Key Page Directory

- `index.html`: Landing page with 3D perspective hero slider and Emergency SOS center.
- `exercises.html`: Guided breathing studio (Box, 4-7-8, Pranayama, Diaphragmatic) with rAF timer and audio.
- `breath-test.html`: BOLT test stopwatch and resting BPM tap counter.
- `health-reading.html`: BP & Glucose telemetry entry with AHA/ADA live meters.
- `health-history.html`: DataTables 2 clinical history log and CSV/JSON exporter.
- `health-charts.html`: Responsive SVG time-series charts with safe-zone bands.
- `health-demo.html`: Synthetic clinical scenario generator and storage inspector.
- `prescriptions-volt.html`: Prescription vault, drag-and-drop upload, Tesseract.js v5 OCR.
- `prescription-history.html`: Saved prescription gallery in dual card/table formats.
- `prescription-create.html`: Prescription studio with live form and WYSIWYG hospital pad.
- `prescription-pad.html`: Dedicated live WYSIWYG paper pad with direct in-place editable fields.
- `digitalpad-history.html`: Digital pad prescription archive with dual card/table format.
- `login.html`, `register.html`, `profile.html`: Member authentication and dashboard suite.
