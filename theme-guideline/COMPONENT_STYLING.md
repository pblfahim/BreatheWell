# BreatheWell — Component Styling Guidelines

> **Document ID:** BW-THEME-COMPONENT-STYLING-2026  
> **Version:** 2.4.0  
> **Classification:** Component CSS Rules & Architectural Standards  

---

## 1. Button Styling System

BreatheWell features a systematic button hierarchy with distinct visual weight, touch targets (≥44px), and feedback animations.

```
+---------------------------------------------------------------------------------------------------+
| Button Hierarchy                                                                                  |
+-------------------+--------------------+--------------------+-------------------------------------+
| Button Class      | Visual Style       | Focus / Active     | Typical Application                 |
+-------------------+--------------------+--------------------+-------------------------------------+
| .btn-primary      | Solid Ocean Blue   | translateY(-1px)   | Primary page CTA (Start Session,    |
|                   | (#1769aa), White   | Shadow glow        | Save Prescription, Log Vitals)      |
+-------------------+--------------------+--------------------+-------------------------------------+
| .btn-teal         | Solid Teal         | translateY(-1px)   | Secondary medical actions           |
|                   | (#0d9488), White   | Shadow glow        | (View Pad, Print Prescription)      |
+-------------------+--------------------+--------------------+-------------------------------------+
| .btn-outline-teal | Border 1.5px Teal, | Background #f0fdfa | Tertiary actions (Filter pills,     |
|                   | Transparent bg     | Text #0f766e       | Secondary toggles)                  |
+-------------------+--------------------+--------------------+-------------------------------------+
| .btn-outline-     | Border 1.5px Green,| Background #f0fdf4 | Data export triggers (CSV Export,   |
|  success          | Green text         | Text #16a34a       | Excel Download)                     |
+-------------------+--------------------+--------------------+-------------------------------------+
| .btn-outline-     | Border 1.5px Red,  | Background #fee2e2 | Destructive actions (Delete record, |
|  danger           | Red text           | Text #dc2626       | Reset clinical database)            |
+-------------------+--------------------+--------------------+-------------------------------------+
```

### Button Radius & Transitions
All primary and secondary buttons use rounded pill geometries (`border-radius: 9999px`) or soft modern radii (`border-radius: 10px`), with transitions:
```css
transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 2. Form Inputs & Control Wells

Forms in BreatheWell are designed for zero-friction entry, particularly when patients or clinicians are inputting critical biometric numbers:

- **Input Styling (`.form-control`, `.ph-search-input`):**
  - Height: `44px` on mobile, `46px` on desktop.
  - Border: `1px solid #e2e8f0`, background `#f8fafc`.
  - Border radius: `10px` or `9999px` (search fields).
  - Focus state:
    ```css
    border-color: #1769aa;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(23, 105, 170, 0.15);
    outline: none;
    ```
- **Segmented Control Switchers (`.ph-view-toggle`, `.dh-view-toggle`):**
  - Pill-shaped well with `#f8fafc` background and `1px solid #e2e8f0`.
  - Internal toggle buttons (`.dh-btn-toggle`):
    - Unselected: Transparent background, `#64748b` text.
    - Selected (`.active`): Solid `#0d9488` or `#1769aa`, white text, shadow `0 2px 8px rgba(13, 148, 136, 0.25)`.

---

## 3. Cards, Badges & Chips

### 3.1 Content Cards (`.card`, `.dh-card`)
- Solid white surface `#ffffff`, border `1px solid #e2e8f0`, border radius `14px` (`--dh-radius-md`) to `20px` (`--dh-radius-lg`).
- Subtle resting shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- Interactive hover:
  ```css
  .dh-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    border-color: #cbd5e1;
  }
  ```

### 3.2 Medication Chips (`.dh-med-chip`)
- Compact visual tokens representing prescribed medications:
  ```css
  .dh-med-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    background: #f0fdfa;
    color: #0f766e;
    font-size: 0.74rem;
    font-weight: 600;
    border: 1px solid #ccfbf1;
  }
  ```

---

## 4. Modal Dialogs & Lightbox Frame

- **Modal Backdrop:** `background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);`.
- **Modal Dialog:** Centered (`modal-dialog-centered`), scrollable body (`modal-dialog-scrollable`), border-radius `20px`.
- **Fullscreen Lightbox (`.ph-lightbox`):**
  - Dark room overlay `background: rgba(10, 15, 25, 0.92)`.
  - Top action bar with title, download button, and close button.
  - Smooth pan/zoom viewer frame and multi-file thumbnail strip at bottom.
