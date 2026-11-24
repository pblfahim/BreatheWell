# BreatheWell — UI Component Specifications

> **Document ID:** BW-SPEC-COMPONENTS-2026  
> **Version:** 2.4.0  
> **Classification:** Design System & UI Engineering Specification  

---

## 1. Overview & Architectural Principles

The **BreatheWell UI Component Library** is engineered with native CSS custom properties and semantic HTML5 elements. Components adhere to three strict design constraints:
1. **Accessibility First:** Minimum touch targets of `44x44px`, WCAG 2.1 AA color contrast compliance, and explicit ARIA roles.
2. **Deterministic Responsiveness:** Seamless transition between desktop sticky headers, tablet flex layouts, and mobile bottom drawers.
3. **Clinical Clarity:** Soothing respiratory color palettes, uncluttered typography, and clear visual hierarchy designed to reduce cognitive load and promote calm.

---

## 2. Global Navigation Components

### 2.1 Desktop Top Sticky Navbar (`.navbar`)
- **Container:** `<nav class="navbar navbar-expand-lg sticky-top">`
- **Positioning:** Sticky at `top: 0`, `z-index: 1020`, backdrop blur `backdrop-filter: blur(12px)`, background `rgba(255, 255, 255, 0.95)`.
- **Brand Identity:**
  - Icon mark: `.brand-mark` with `.bi-wind` in a circular gradient container.
  - Text: `BreatheWell` in bold Inter typography (`color: #0f172a`).
- **Navigation Links (`.nav-link`):**
  - Font size `0.95rem`, font weight `600`, color `#475569`.
  - Active state: `.nav-link.active` with bottom accent border (`#1769aa`), font weight `700`, color `#1769aa`.
- **Language Switcher (`#langToggle`):**
  - Pill button with border, switching text between "English" and "বাংলা", triggering reactive document localization.

### 2.2 Dark Green Sticky Tab Header Bar (`.ht-hero-tab-bar`)
- **Container:** `<div class="ht-hero-tab-bar">`
- **Positioning:** Sticky at `top: var(--bw-navbar-height, 68px)`, `z-index: 1010`, background `#0f4c3a` (Deep Forest Green), box shadow `0 4px 14px rgba(15, 76, 58, 0.16)`.
- **Tab Strip (`.ht-hero-tabs`):**
  - Flex container with `gap: 6px`, scroll-snapping on mobile (`scroll-snap-type: x proximity`).
  - Scrollbar hidden via `scrollbar-width: none` and `::-webkit-scrollbar { display: none; }`.
- **Individual Tab (`.ht-hero-tab`):**
  - Height `48px`, minimum width `140px`, border-radius `12px 12px 0 0`.
  - Background `#ffffff`, text color `#374151`, font weight `700`.
  - Active state (`.ht-hero-tab.active`): Background `#e9f7ed` (Mint White), text color `#0f4c3a`, font weight `800`.
  - Hover state: Background `#f0fdf4`, text color `#0f4c3a`.
  - Icon: `.ht-hero-tab-icon` displaying high-contrast emoji or SVG symbol (🗄️, 📜, 📑, ✍️, 📋).

### 2.3 Mobile Bottom App Drawer (< 992px) (`#mobileBottomNav`)
- **Container:** `<nav class="mobile-bottom-nav d-lg-none" id="mobileBottomNav">`
- **Positioning:** Fixed at `bottom: 0`, `left: 0`, `right: 0`, `z-index: 1040`, height `64px`, background `#ffffff`, border-top `1px solid #e2e8f0`, box shadow `0 -2px 10px rgba(0,0,0,0.06)`.
- **Pull/Tap Handle Pill (`#mobileDrawerHandle`):**
  - Pill button at top edge (`width: 38px`, `height: 4px`, `background: #cbd5e1`, `border-radius: 9999px`). Tapping opens the mobile offcanvas sidebar drawer.
- **Nav Items (`.mobile-nav-link`):**
  - 5 evenly distributed items: Home, Exercises, Health, Prescriptions, More (Trigger for offcanvas).
  - Icon container: `.nav-icon-wrap` (`24px` icon, `margin-bottom: 2px`).
  - Label: `.nav-label` (`font-size: 0.72rem`, `font-weight: 600`).
  - Active state: `.mobile-nav-link.active` with primary color `#1769aa` and scale pulse.

### 2.4 Mobile Offcanvas Sidebar Drawer (`#mobileSidebarMenu`)
- **Container:** `<div class="offcanvas offcanvas-end mobile-sidebar-offcanvas" tabindex="-1">`
- **Header:** Brand mark, title "BreatheWell", subtitle "ডিজিটাল স্বাস্থ্য ও মাইন্ডফুলনেস", close button.
- **Language Card:** Interactive bilingual pills (`.mobile-lang-pill[data-lang="bn"]` and `[data-lang="en"]`).
- **Action Grid:** Quick action shortcuts (Emergency SOS, Lung Assessment Test).
- **Footer:** Medical disclaimer: *"সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"*

---

## 3. Core Interaction & Stage Components

### 3.1 Guided Respiration Stage
- **Container:** `.breathing-stage`
- **Outer Breathing Ring:** `.breathing-ring-outer` with dynamic box-shadow and CSS gradient.
- **Central Respiration Circle:** `.breathing-circle`
  - Animated smoothly via CSS transform scaling: `scale(1.35)` on Inhale, `scale(1.0)` on Exhale.
  - Easing: `cubic-bezier(0.42, 0, 0.58, 1)` mimicking biological lung volume changes.
- **SVG Phase Progress Ring:**
  - Circle SVG with `stroke-dasharray` and dynamic `stroke-dashoffset` calculated via rAF.
- **Phase Instructions:**
  - Primary text: `.phase-instruction` (Large bold phase title: "শ্বাস নিন", "ধরে রাখুন", "শ্বাস ছাড়ুন").
  - Countdown timer: `.phase-timer` (Tabular numbers, e.g., "04s").

### 3.2 Metric Summary Stat Cards (`.stat-card` / `.dh-stat-card`)
- **Container:** Flex/grid card with `background: #ffffff`, `border: 1px solid #e2e8f0`, `border-radius: 14px`, `padding: 1rem 1.25rem`.
- **Hover Micro-interaction:** `transform: translateY(-2px)`, `box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08)`.
- **Icon Container:** `.stat-icon-wrap` with soft pastel background and deep tinted icon (Teal, Green, Blue, Amber).
- **Value & Label:** `.stat-val` (`font-size: 1.45rem`, `font-weight: 800`) and `.stat-lbl` (`font-size: 0.78rem`, `color: #64748b`).

### 3.3 Clinical Spectrum Meter Bar (`.ht-meter-bar`)
- **Container:** Horizontal gauge with segmented clinical gradient (Green -> Amber -> Orange -> Red -> Crimson).
- **Marker Pin:** Absolute-positioned triangle/pin indicating exact user reading position.
- **Category Badge:** Highlighted chip displaying AHA or ADA clinical stage name.

---

## 4. Prescription & Medical Document Components

### 4.1 WYSIWYG Digital Doctor Prescription Pad (`.rx-paper-pad` / `.dh-modal-pad`)
- **Aspect Ratio & Canvas:** Emulates an authentic A4 medical prescription sheet with subtle drop-shadow and border.
- **Hospital Letterhead:**
  - Left: Doctor name (e.g. "Dr. A. Rahman"), degrees, BMDC registration number.
  - Right: Hospital/Clinic name ("City General Hospital"), address, contact phone.
- **Patient Bar:** 5-column light slate bar displaying Patient Name, Serial Number, Age, Gender, and Prescription Date.
- **Two-Column Clinical Layout:**
  - **Left Column (Width: 260px):** Chief Complaints (C/C), Physical Findings (O/E: BP, Pulse, Weight), Diagnosis (Dx), Investigations (Inv).
  - **Right Column (Flex 1):** Large cursive ℞ symbol, structured Rx medication table, physician advice box, follow-up visit date.
- **Doctor Signature Block:** Digital signature canvas image or handwritten signature line.

### 4.2 Interactive Clinical Data Table (`.ph-data-table` / `.dh-data-table`)
- **Powered by DataTables 2:**
  - Header: `.dh-table-card-header` with title icon and CSV export button.
  - Table: Responsive wrapper, striped hover rows, tabular numerical columns.
  - Actions: Inline pill buttons for "View" (Eye icon), "Print" (Printer icon), and "Delete" (Trash icon).

---

## 5. Modal & Feedback Components

### 5.1 Full Clinical Modal Viewer (`#dhDetailModal`)
- Modal Dialog: `modal-xl modal-dialog-centered modal-dialog-scrollable`.
- Dark top control bar: Close button, Print button (`window.print()`), WhatsApp dispatch button, Clipboard copy button.
- Printable pad content isolated for `@media print`.

### 5.2 Toast Notification Stack (`#rxToastStack` / `.toast-container`)
- Position: Fixed at `bottom: 24px`, `right: 24px`, `z-index: 1090`.
- Variants: `.success` (Green icon), `.warn` (Amber triangle), `.error` (Red octagon), `.info` (Blue circle).
- Auto-dismisses after 4000ms with smooth fade-out.
