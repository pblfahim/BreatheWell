# BreatheWell — Version 3 (Unified Multi-Member Architecture)

**Version 3** synthesizes the visual design, clinical depth, and individual-page structure of **Version 1** with the clean modular multi-member household architecture of **Version 2**, while resolving every identified gap between the two prior versions.

## Key Integrations (Version 1 + Version 2)

- **Multi-Member Household Engine (`bw-store.js`, `bw-nav.js`):**
  - Strictly isolates `vitals`, `breath_tests`, `exercises`, `rx_vault`, `rx_pad`, `prefs`, and `signature` per account AND active member ID (`bwmm_v3_data::<accountId>::<memberId>::<domain>`).
  - Supports Guest Preview (`sessionStorage`), Salted FIPS 180-4 SHA-256 authentication & optional 4-digit Privacy PIN, **15 family relationships** from Version 1, and a **1-Click 4-Member Family Demo** (`demo@breathewell.app` / `Demo@1234`).
  - Fixes Version 1's omitted top-navbar member slot across all **15 individual HTML pages**.
- **Wellness & Home Showcase (`index.html`, `exercises.html`, `breath-test.html`):**
  - Combines Version 1's **3-Slide 3D Hero Carousel** (interactive orb w/ Web Audio celebration chime, Vitals ECG trace console, OCR scan laser console), **Bento Live Breathing Coach**, **Featured Protocol Grid**, **Vitals Simulator Sandbox**, and **4-Tab Safety & Emergency SOS Hub**.
  - Full 4-Screen `exercises.html` Studio w/ `#detailWaveformSvg`, Lotus Halo, Soundscapes (`chimes`, `rain`, `drone`, `off`), TTS Coach, Physics Confetti Canvas, Champion Trophy, and Mood Check-In.
  - Full `breath-test.html` Pulmonary Lab w/ Composite Readiness Index (`0-100`), 10s Calm Prep Pacer, BOLT + BPM Haptics, 3 Bio-Marker Bars, SVG Chart, and Bohr Effect Science Modal.
- **Clinical Vitals & Prescription Suites:**
  - Consistent V1 signature forest-green `#0f4c3a` `.ht-hero-tab-bar` across `exercises`/`breath-test`, Vitals (`health-reading`, `health-history`, `health-charts`, `health-demo`), and Rx (`prescriptions-volt`, `prescription-history`, `digitalpad-history`, `prescription-create`, `prescription-pad`).
  - Reconciles all orphaned V1 JS/HTML elements: Vitals Mode Toggle, Live WhatsApp Preview Card, Charts Pull-Up Sparklines, Demo 4-Preset Scenarios + Parametric Generator, Creator Studio OCR Import button, Direct Pad `#padSerialNo` & Physician Signature Upload, and Selective `.ocr-highlight` field focusing.
