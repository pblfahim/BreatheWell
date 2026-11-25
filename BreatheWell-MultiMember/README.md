# BreatheWell Multi-Member Platform

A privacy-first, 100% client-side, bilingual (`bn` / `en`) Mindful Respiratory & Family Clinical Health Web Application structured as **15 individual modular HTML pages** with **Multi-Member Household Isolation**.

## Architecture & Key Capabilities

- **Household Accounts & Multi-Member Switching (`bw-store.js`, `bw-nav.js`):**
  - Optional access model: **Guest Preview** lets visitors test every calculator, breathing timer, BOLT stopwatch, OCR scanner, and clinical pad without signing in.
  - Signing in (`login.html`, `register.html`) or launching the **1-Click 4-Member Family Demo** (`demo@breathewell.app` / `Demo@1234`) unlocks isolated storage scoped per `accountId` AND `memberId` across `Self (Arif)`, `Father (Kamrul)`, `Mother (Nasrin)`, `Child (Ayaan)`, plus unlimited custom family members (`profile.html`).
  - Salted FIPS 180-4 SHA-256 hashing secures household passwords and optional 4-digit member-switch Privacy PINs.
- **Wellness Core (`index.html`, `exercises.html`, `breath-test.html`):**
  - Animated guided breathing studio (`Box 4-4-4-4`, `4-7-8 Calm`, `Pranayama 4-4-4`, `Diaphragmatic 4-2-6`), L1–L3 progression, `requestAnimationFrame` mandala lotus & live SVG waveform curve, Web Audio chimes, Web Speech TTS, post-session mood logging, and streak tracking.
  - Precision `0.1s` BOLT stopwatch, 30s/60s BPM tap counter, trend charts, and Bohr Effect SVG science modal (`#btOpenSafetyBtn`).
- **Clinical Vitals Telemetry Suite (`health-reading.html`, `health-history.html`, `health-charts.html`, `health-demo.html`):**
  - Real-time AHA 2017 Blood Pressure staging + Hypertensive Crisis (>180/120 mmHg) alerts.
  - Real-time ADA 2024 Blood Glucose staging (`mg/dL` <-> `mmol/L` via `18.0182`) + Hypoglycemia (<70 mg/dL) alerts.
  - jQuery DataTables 2 searchable ledger with UTF-8 BOM CSV exports, SVG safe-band trend charts, and clinical sample seeders.
- **Clinical Prescription Suite (`prescriptions-volt.html`, `prescription-history.html`, `prescription-create.html`, `prescription-pad.html`, `digitalpad-history.html`):**
  - Drag/drop Prescription Vault & Lossless PDF.js + Tesseract OCR scanner with selective field focus (`bw-ocr-filled`), manual re-parse fallback, refill countdown badges, A4 WYSIWYG Creator Studio, `contenteditable` Digital Pad, `@media print` A4 formatting, and WhatsApp summaries.

## 15-Page Directory

| Domain | Pages |
| :--- | :--- |
| **Household & Family** | `login.html`, `register.html`, `profile.html` |
| **Wellness Core** | `index.html`, `exercises.html`, `breath-test.html` |
| **Vitals Suite** | `health-reading.html`, `health-history.html`, `health-charts.html`, `health-demo.html` |
| **Prescription Suite** | `prescriptions-volt.html`, `prescription-history.html`, `prescription-create.html`, `prescription-pad.html`, `digitalpad-history.html` |

## Running Locally

Open `BreatheWell-MultiMember/index.html` directly in any modern browser or serve the `BreatheWell-MultiMember/` directory via a local static server (`python3 -m http.server`). All Bootstrap, Bootstrap Icons, Inter/Noto Sans Bengali fonts, jQuery, DataTables 2, PDF.js, and Tesseract bootstrapper assets are bundled locally under `asset/vendor/`.
