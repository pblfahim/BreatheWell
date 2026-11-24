# BreatheWell — Master Design System Specification

> **Document ID:** BW-THEME-DESIGN-SYSTEM-2026  
> **Version:** 2.4.0  
> **Classification:** Master Theme & Visual Design Guidelines  

---

## 1. Design System Philosophy: The Triad of Mindful Health

The BreatheWell design system is founded on the **Triad of Mindful Health**:
1. **Calm (প্রশান্তি):** Visual elements are crafted to evoke serenity, reduce stress-induced sympathetic arousal, and prevent sensory overload. Soft curves, breathing micro-animations, and balanced whitespace guide the eye gently.
2. **Clinical Precision (ক্লিনিক্যাল নির্ভুলতা):** Vitals measurements, diagnostic results, and medical prescriptions adhere to rigorous medical informatics standards (AHA 2017, ADA 2024, BMDC prescription format). Data is unambiguous, structured, and legible at a glance.
3. **Inclusive Clarity (সার্বজনীন সহজবোধ্যতা):** Seamless bilingual ergonomics for Bengali and English users. Typography, iconography, and touch affordances are adapted to be intuitive regardless of user digital literacy.

---

## 2. Design Token Architecture

All design parameters are codified as CSS custom properties in the `:root` scope of `asset/css/style.css`, inherited and augmented by specialized submodule stylesheets (`health-tracker.css`, `prescriptions-volt.css`, `digitalpad-history.css`).

```
+-----------------------------------------------------------------------------------------+
|                                BreatheWell Token Hierarchy                              |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   | Global Tokens (:root in style.css)                                              |   |
|   | - Colors: --bw-primary, --bw-teal, --bw-emerald, --bw-amber, --bw-rose, --bw-ink|   |
|   | - Surfaces: --bw-surface, --bw-surface-alt, --bw-line                           |   |
|   | - Shadows: --bw-shadow-sm, --bw-shadow-md, --bw-shadow-lg                       |   |
|   | - Nav Heights: --bw-navbar-height (68px desktop / 64px mobile)                  |   |
|   +---------------------------------------------------------------------------------+   |
|                                         |                                               |
|                    +--------------------+--------------------+                          |
|                    |                                         |                          |
|   +----------------------------------+      +---------------------------------------+   |
|   | Health Tracker Domain Tokens     |      | Digital Prescription Domain Tokens    |   |
|   | (:root in health-tracker.css)    |      | (:root in digitalpad-history.css)     |   |
|   | - --ht-bp-normal, --ht-bp-crisis |      | - --dh-primary (#0d9488)              |   |
|   | - --ht-bg-normal, --ht-bg-diab   |      | - --dh-primary-hover, --dh-primary-lt |   |
|   | - --ht-shadow-glow-bp            |      | - --dh-radius-md, --dh-radius-lg      |   |
|   +----------------------------------+      +---------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Surface & Elevation Scale

BreatheWell utilizes a three-tier surface hierarchy and three elevated shadow levels to establish spatial depth without visual harshness:

| Token | CSS Value | Visual Intent | Usage Example |
| :--- | :--- | :--- | :--- |
| **Canvas** | `#f8fafc` (`--bw-surface-alt`) | Calm neutral page background | Body background, off-duty stages |
| **Surface** | `#ffffff` (`--bw-surface`) | Primary content cards | Exercise cards, forms, modals |
| **Surface Subtle** | `#f1f5f9` (`--bw-surface-subtle`) | Recessed secondary wells | Input fields, table headers, filter bars |
| **Shadow Small** | `0 2px 10px rgba(15, 23, 42, 0.05)` | Resting elevation | Unfocused cards, stats tiles |
| **Shadow Medium** | `0 8px 30px rgba(15, 23, 42, 0.08)` | Interactive hover elevation | Hovered cards, active modals |
| **Shadow Large** | `0 20px 50px rgba(15, 23, 42, 0.12)` | Floating focus elevation | Lightbox frame, clinical pad modal |
| **Shadow Glow BP** | `0 10px 28px rgba(239, 68, 68, 0.18)` | Vital alert glow | Hypertensive crisis warning card |

---

## 4. Motion & Easing Curves

Animations in BreatheWell are purposeful and mimic physiological biological rhythms:

1. **Natural Breath Easing (`--bw-ease-breath`):**
   - Value: `cubic-bezier(0.42, 0, 0.58, 1)`
   - Used for the expanding and contracting central breathing circle. Features soft sinusoidal acceleration and deceleration matching human lung compliance.
2. **Snappy Micro-Feedback (`--bw-ease-feedback`):**
   - Value: `cubic-bezier(0.16, 1, 0.3, 1)`
   - Used for button clicks, card hover lifts (`translateY(-2px)`), and tab switching.
3. **Mascot & Celebration Elasticity (`--bw-ease-bounce`):**
   - Value: `cubic-bezier(0.34, 1.56, 0.64, 1)`
   - Used for the completion trophy drop-in and mascot badge animations.

---

## 5. Z-Index Hierarchy Scale

To prevent layering conflicts across sticky bars, modals, and floating navigation:

```text
  0 - 3   : Ambient floating canvas blur bubbles & confetti canvas
 10 - 20  : Interactive content cards, prescription pad sheets, SVG charts
 1010     : Dark green sticky tab bar (.ht-hero-tab-bar)
 1020     : Desktop top fixed navigation bar (.navbar)
 1040     : Mobile bottom app drawer navigation (#mobileBottomNav)
 1045     : Mobile bottom drawer pull-up handle pill
 1050     : Bootstrap modal backdrops and offcanvas overlays
 1060     : Interactive modal dialogs (#dhDetailModal, session complete)
 1090     : System feedback alerts and toast notifications (#rxToastStack)
```
