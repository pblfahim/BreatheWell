# BreatheWell — Iconography & Asset Guidelines

> **Document ID:** BW-THEME-ICONS-ASSETS-2026  
> **Version:** 2.4.0  
> **Classification:** Iconography, Audio & Vector Asset Standards  

---

## 1. Iconography Library: Bootstrap Icons 1.11.3

BreatheWell utilizes **Bootstrap Icons v1.11.3** as its primary vector glyph library. All webfont and CSS assets (`bootstrap-icons.min.css`, `bootstrap-icons.woff2`, `bootstrap-icons.woff`) are self-hosted locally in:
`asset/vendor/bootstrap-icons/`

### 1.1 Standard Icon Sizing Scale
- **Small (Micro-actions):** `14px - 16px` (e.g. search icons, chip capsule icons, action buttons).
- **Medium (Navigation & List Items):** `18px - 20px` (e.g. desktop navbar icons, mobile drawer links).
- **Large (Stat Cards & Features):** `24px - 28px` (e.g. `.stat-icon-wrap`, vital indicators).
- **Hero & Display (Empty States):** `48px - 64px` (e.g. `.dh-empty-icon`, celebratory trophy).

### 1.2 Icon Mapping by Domain
- **Core Navigation:**
  - Home: `bi-house-door-fill`
  - Respiration: `bi-wind`, `bi-grid-fill`
  - Vitals: `bi-heart-pulse-fill`, `bi-activity`
  - Prescriptions: `bi-file-earmark-medical-fill`, `bi-clipboard-pulse`
  - More: `bi-list`
- **Clinical Vitals:**
  - Blood Pressure: `bi-heart-pulse`
  - Blood Glucose: `bi-droplet-half`
  - Pulse / Heart Rate: `bi-heart-fill`
  - Temperature: `bi-thermometer-half`
- **Actions:**
  - View / Inspect: `bi-eye`
  - Print Document: `bi-printer`, `bi-printer-fill`
  - Share WhatsApp: `bi-whatsapp`
  - Copy to Clipboard: `bi-clipboard`, `bi-clipboard-check`
  - Download / Export: `bi-download`, `bi-file-earmark-spreadsheet`
  - Delete / Purge: `bi-trash3`

---

## 2. Procedural Web Audio Engine (Assetless Sound)

BreatheWell generates **100% of its audio procedurally** through the browser's native `AudioContext` interface, requiring **zero audio files** (`.mp3` or `.wav`).

### 2.1 Audio Synthesis Parameters
- **Inhale Bell (Ascending Solfeggio 528 Hz):**
  ```javascript
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(528, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(792, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.2);
  ```
- **Exhale Chime (Grounding Solfeggio 396 Hz):**
  - Sine oscillator transitioning from `396 Hz` to `594 Hz` with smooth exponential decay over `1.4s`.
- **Phase Transition Ticks:**
  - Gentle sub-audible wooden click (frequency: `180 Hz`, duration `0.05s`, gain `0.05`) to signal second countdowns.

---

## 3. Brand Vector Assets & Favicon

- **Brand Mark:**
  - Custom SVG circle featuring stylized wind waves inside a circular gradient.
  - Placed at `asset/image/favicon.svg`.
- **Favicon Delivery:**
  - Linked across all pages via `<link rel="icon" type="image/svg+xml" href="asset/image/favicon.svg">`.
- **Vector Optimizations:**
  - All SVG vectors are cleaned of proprietary editor metadata (Adobe Illustrator / Inkscape namespaces) and compressed with `svgo` to under `3KB` each.
