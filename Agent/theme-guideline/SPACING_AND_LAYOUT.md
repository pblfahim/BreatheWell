# BreatheWell — Spacing & Layout System

> **Document ID:** BW-THEME-SPACING-LAYOUT-2026  
> **Version:** 2.4.0  
> **Classification:** Layout Architecture, Grid & Spatial Guidelines  

---

## 1. 8-Point Spatial Grid System

BreatheWell is built on an **8-point geometric grid system** (with a 4-point sub-grid for micro-adjustments). Every margin, padding, container gap, and component dimension is a multiple of `4px` or `8px`:

```text
  --bw-space-1  : 4px   (Micro-gap, icon offsets, badge paddings)
  --bw-space-2  : 8px   (Button inline gap, tight card paddings)
  --bw-space-3  : 12px  (Form field gap, card header inline gap)
  --bw-space-4  : 16px  (Standard component padding, grid gaps)
  --bw-space-5  : 20px  (Card margins, toolbar row gaps)
  --bw-space-6  : 24px  (Section dividers, modal header padding)
  --bw-space-8  : 32px  (Section vertical spacing, hero top margin)
  --bw-space-10 : 40px  (Breathing stage padding)
  --bw-space-12 : 48px  (Major section gaps on tablet/desktop)
  --bw-space-16 : 64px  (Page footer top margin, hero container)
```

---

## 2. Container Hierarchy & Max-Widths

The platform enforces responsive container boundaries to prevent excessive line lengths on wide monitors while ensuring comfortable breathing room:

```css
/* Container Hierarchy */
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
}

@media (min-width: 576px)  { .container { max-width: 540px; } }
@media (min-width: 768px)  { .container { max-width: 720px; } }
@media (min-width: 992px)  { .container { max-width: 960px; } }
@media (min-width: 1200px) { .container { max-width: 1140px; } }
@media (min-width: 1400px) { .container { max-width: 1320px; } }
```

### Specialized Component Containers
- **WYSIWYG Hospital Paper Pad:** Fixed maximum width of `820px` to mirror physical A4 proportion (`1:1.414`).
- **Authentication & Onboarding Cards:** Centered container with max-width `460px`.
- **Guided Respiration Stage:** Centered container with max-width `520px` to keep the user's attention anchored.

---

## 3. Spacing Standards by Component

### 3.1 Content Cards (`.card`, `.stat-card`, `.dh-card`)
- **Desktop Padding:** `1.25rem 1.5rem` (20px top/bottom, 24px left/right).
- **Mobile Padding (<768px):** `1rem 1.15rem` (16px top/bottom, 18px left/right).
- **Border Radius:** `14px` (`--dh-radius-md`) for cards, `20px` (`--dh-radius-lg`) for major containers.

### 3.2 Sticky Hero Tab Bar (`.ht-hero-tab-bar`)
- **Top Offset:** Sticky at `var(--bw-navbar-height, 68px)` desktop / `64px` mobile.
- **Top Padding:** `14px` on desktop, `12px` on tablet, `10px` on mobile.
- **Bottom Margin:** `24px` on desktop, `20px` on tablet, `16px` on mobile.
- **Tab Gaps:** `6px` between adjacent folder tabs.

### 3.3 Mobile Bottom Navigation Clearance
- On viewports `< 992px`, the mobile bottom navigation bar has a fixed height of `64px`.
- To prevent the bottom bar from obscuring form submission buttons or table paginations, all pages enforce a bottom padding clearance on `<main>` or `<body>`:
  ```css
  @media (max-width: 991.98px) {
    body {
      padding-bottom: 74px !important;
    }
  }
  ```
