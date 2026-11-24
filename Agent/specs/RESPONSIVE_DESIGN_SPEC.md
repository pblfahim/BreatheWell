# BreatheWell — Responsive Design Specification

> **Document ID:** BW-SPEC-RESPONSIVE-2026  
> **Version:** 2.4.0  
> **Classification:** Front-End Architecture & Responsive Design Guidelines  

---

## 1. Responsive Philosophy & Mobile-First Foundation

BreatheWell is engineered to deliver an uncompromising, pixel-perfect user experience across all form factors:
- **Smartphones:** Small devices (<400px), standard modern phones (375px - 430px).
- **Phablets & Foldables:** Large phones and unfolded devices (576px - 767px).
- **Tablets:** Portrait and landscape iPads/Android tablets (768px - 991px).
- **Laptops & Desktops:** Standard desktop monitors (992px - 1440px) and ultrawide displays (>1440px).
- **Physical Paper Output:** Standard A4 paper printouts via `@media print`.

---

## 2. Standardized Breakpoint Scale

BreatheWell adopts Bootstrap 5.3.3 responsive grid breakpoints augmented by custom micro-device tokens:

```
+---------------------------------------------------------------------------------------------------------+
| BreatheWell Viewport Breakpoints Scale                                                                  |
+-------------------+----------------+--------------------------------------------------------------------+
| Tier Name         | Breakpoint     | Key Architectural Adaptations                                      |
+-------------------+----------------+--------------------------------------------------------------------+
| Extra Small (xs)  | < 576px        | - Sticky top navbar collapses to minimal brand + lang button       |
|                   |                | - Mobile bottom app drawer (#mobileBottomNav) active (height: 64px)|
|                   |                | - Hero tab bar scrolls horizontally with scroll-snap               |
|                   |                | - Stat cards stack in 1 column; DataTables wrap horizontally       |
+-------------------+----------------+--------------------------------------------------------------------+
| Small Mobile      | < 400px        | - Tab min-width reduces to 104px; height to 38px                   |
|                   |                | - Padding inside cards reduces to 0.75rem                          |
+-------------------+----------------+--------------------------------------------------------------------+
| Small (sm)        | ≥ 576px        | - Stat cards render in 2-column auto-fit grid                      |
|                   |                | - Prescription cards display 2 per row                             |
+-------------------+----------------+--------------------------------------------------------------------+
| Medium / Tab (md) | 768px - 991px  | - Hero tab bar stretches evenly across container (`flex: 1 1 0`)   |
|                   |                | - Mobile bottom drawer remains visible for touch ergonomics        |
|                   |                | - Prescription studio displays side-by-side on wide tablets        |
+-------------------+----------------+--------------------------------------------------------------------+
| Large / Desk (lg) | 992px - 1199px | - Mobile bottom drawer and handle hide completely (`d-lg-none`)    |
|                   |                | - Full desktop navigation links display in top navbar              |
|                   |                | - Studio dual-pane active (Editor 50% / Live WYSIWYG Pad 50%)      |
+-------------------+----------------+--------------------------------------------------------------------+
| Extra Large (xl)  | ≥ 1200px       | - Container max-width: 1140px; comfortable whitespace breathing    |
| Extra Extra (xxl) | ≥ 1400px       | - Container max-width: 1320px                                      |
+-------------------+----------------+--------------------------------------------------------------------+
```

---

## 3. Responsive Navigation Transformations

### 3.1 Desktop (≥ 992px)
- **Top Sticky Navbar:** Displays brand identity, full navigation link list (Home, Exercises, Health Tracker, Prescriptions, Safety), and the language toggle button.
- **Hero Tab Bar:** Sticky beneath top navbar at `top: 68px`.
- **Bottom Navigation:** Completely hidden (`display: none !important`).

### 3.2 Mobile & Tablet (< 992px)
- **Top Sticky Navbar:** Retains brand logo and language switcher button; collapses navigation links to prevent top clutter.
- **Bottom App Drawer (`#mobileBottomNav`):** Fixed to bottom with 5 essential quick-touch icons (Home, Exercises, Health, Prescriptions, More).
- **Sliding Offcanvas Drawer (`#mobileSidebarMenu`):** Triggered by the "More" button or tapping the `.drawer-handle-pill`. Slides from right to provide language selection, full page routing, emergency SOS shortcut, and lung test utilities.

---

## 4. Specific Module Layout Adaptations

### 4.1 Prescription Creator Studio (`prescription-create.html`)
- **Desktop (≥ 992px):** Two-column split layout. Left: Editor form (`flex: 0 0 52%`). Right: Live sticky WYSIWYG hospital paper pad preview (`flex: 0 0 48%`).
- **Mobile (< 992px):** Editor form stacks above the live pad preview. Action toolbar moves to a floating bottom position for thumb accessibility.

### 4.2 Prescription Pad WYSIWYG (`prescription-pad.html`)
- **Desktop:** Authentic centered A4 canvas (`width: 820px`).
- **Mobile (< 768px):** Two-column clinical body (C/C vs Rx) collapses into a single stacked column: clinical examination findings appear directly above the medication table.

### 4.3 Data Tables (`health-history.html`, `prescription-history.html`, `digitalpad-history.html`)
- Wrapped in `.table-responsive` with custom smooth momentum scrolling (`-webkit-overflow-scrolling: touch`).
- Cell typography uses `white-space: nowrap` for dates and badges, with flexible wrapping for clinical complaint texts.

---

## 5. Print Media Optimization (`@media print`)

When a user initiates printing (`Ctrl+P`, `Cmd+P`, or clicking "Print" in studio):
1. **Suppressed Elements:**
   - Top navbar, mobile bottom navigation, offcanvas menus.
   - Action buttons, breadcrumbs, search toolbars, filter pills, pagination controls.
   - Modals and background backdrops.
2. **Paper Formatting:**
   - Page margins forced to `0` or standard medical `15mm`.
   - Body background forced to pure `#ffffff`.
   - Prescription pad expands to `100%` width without drop-shadows or borders.
   - Text rendered in crisp, high-contrast black/slate for clinical legibility.
