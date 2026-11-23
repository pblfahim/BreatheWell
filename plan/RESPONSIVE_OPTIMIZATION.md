# BreatheWell — Responsive Optimization & Performance Plan

> **Document ID:** BW-PLAN-RESPONSIVE-OPT-2026  
> **Version:** 2.4.0  
> **Classification:** Responsive Performance, Mobile Ergonomics & Viewport Optimization  

---

## 1. Overview & Mobile-First Principles

BreatheWell operates across a diverse spectrum of mobile hardware—from budget Android smartphones with small viewports (320px–360px) to foldable devices, iPads, and high-DPI desktop displays.

The **Responsive Optimization Plan** targets three primary metrics:
1. **Cumulative Layout Shift (CLS):** `0.00` across all page transitions and device rotations.
2. **First Input Delay (FID) / Interaction to Next Paint (INP):** `< 50ms` on touch interactions.
3. **Viewport Height Stability:** Eradicating content jumping caused by mobile browser address bar expansion/retraction (`dvh`/`svh` units).

---

## 2. Key Optimization Strategies

### 2.1 Dynamic Viewport Units (`dvh` & `svh`)
- On mobile browsers (Safari iOS, Chrome Android), `100vh` causes content clipping when bottom address bars toggle.
- BreatheWell utilizes dynamic viewport height tokens with fallbacks:
  ```css
  :root {
    --bw-vh: 100vh;
  }
  @supports (height: 100dvh) {
    :root {
      --bw-vh: 100dvh;
    }
  }
  .full-stage-container {
    min-height: calc(var(--bw-vh) - var(--bw-navbar-height));
  }
  ```

### 2.2 Mobile Bottom Drawer Viewport Clearance
- On screens `< 992px`, the mobile navigation bar (`#mobileBottomNav`) is fixed to the bottom (`height: 64px`).
- To prevent content clipping, a global bottom padding of `74px` is applied to `body`, ensuring that submit buttons, DataTables paginators, and footer notes remain completely accessible without overlap.

### 2.3 Horizontal Scroll-Snapping for Hero Tab Bars
- On mobile screens, the 5-tab prescription bar and 4-tab vitals bar exceed viewport width.
- To prevent clunky horizontal dragging, BreatheWell implements CSS scroll-snapping:
  ```css
  .ht-hero-tabs {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .ht-hero-tab {
    flex: 0 0 auto;
    min-width: 116px;
    scroll-snap-align: start;
  }
  ```

### 2.4 Critical Rendering Path & Zero-Jitter Touch Affordances
- Touch targets strictly enforce `min-width: 44px; min-height: 44px;`.
- Active buttons feature instant touch feedback (`transform: scale(0.98)`) without delaying for 300ms click emulation (`touch-action: manipulation`).
