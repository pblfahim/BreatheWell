# BreatheWell — Color Palette & Semantic Tokens

> **Document ID:** BW-THEME-COLOR-PALETTE-2026  
> **Version:** 2.4.0  
> **Classification:** Color System & Accessibility Compliance  

---

## 1. Palette Philosophy

The BreatheWell color palette pairs **calming mindfulness tones** with **standardized clinical telemetry colors**. Color is never used in isolation; all clinical status indications are reinforced by typography, iconography, and structural cues to ensure universal comprehension and accessibility.

---

## 2. Core Brand Palette

```
+---------------------------------------------------------------------------------------------------+
| Primary Brand Tones (Mindful Ocean & Twilight)                                                    |
+-------------------+---------+--------------------+------------------------------------------------+
| Token Name        | Hex Code| RGB Value          | Semantic Application                           |
+-------------------+---------+--------------------+------------------------------------------------+
| --bw-primary      | #1769aa | rgb(23, 105, 170)  | Primary brand accent, active tabs, CTA buttons |
| --bw-primary-hover| #0f5287 | rgb(15, 82, 135)   | Hover state for primary buttons                |
| --bw-primary-dark | #0d47a1 | rgb(13, 71, 161)   | Active state, deeply focused buttons           |
| --bw-primary-light| #e8f3fb | rgb(232, 243, 251) | Active button backgrounds, light icon wells    |
+-------------------+---------+--------------------+------------------------------------------------+
| Respiratory Teal & Clinical Emerald (Vitality & Respiration)                                      |
+-------------------+---------+--------------------+------------------------------------------------+
| --bw-teal         | #00897b | rgb(0, 137, 123)   | Respiratory companion badges, secondary CTAs   |
| --bw-teal-hover   | #00695c | rgb(0, 105, 92)    | Teal button hover                              |
| --bw-teal-light   | #e0f2f1 | rgb(224, 242, 241) | Subtle teal pill backgrounds                   |
| --ht-hero-tab-bg  | #0f4c3a | rgb(15, 76, 58)    | Deep forest green for sticky hero tab bars     |
| --bw-emerald      | #10b981 | rgb(16, 185, 129)  | Normal clinical vital badge, success alerts    |
| --bw-emerald-hover| #059669 | rgb(5, 150, 105)   | Success button hover                           |
| --bw-emerald-light| #d1fae5 | rgb(209, 250, 229) | Healthy normal badge background                |
+-------------------+---------+--------------------+------------------------------------------------+
```

---

## 3. Clinical Diagnostic & Telemetry Palette

BreatheWell strictly maps biometric thresholds to established medical guidelines:

### 3.1 Blood Pressure (AHA 2017)
- **Normal (<120/<80):** `#10b981` (`--ht-bp-normal`), background `#d1fae5`.
- **Elevated (120-129/<80):** `#f59e0b` (`--ht-bp-elevated`), background `#fef3c7`.
- **Hypertension Stage 1 (130-139/80-89):** `#ea580c` (`--ht-bp-high1`), background `#ffedd5`.
- **Hypertension Stage 2 (≥140/≥90):** `#ef4444` (`--ht-bp-high2`), background `#fee2e2`.
- **Hypertensive Crisis (>180/>120):** `#991b1b` (`--ht-bp-crisis`), glowing red aura `#ef4444`.
- **Hypotension (<90/<60):** `#8b5cf6` (`--ht-bp-low`), background `#ede9fe`.

### 3.2 Blood Glucose (ADA 2024)
- **Normal:** `#10b981` (`--ht-bg-normal`), background `#d1fae5`.
- **Pre-diabetes:** `#f59e0b` (`--ht-bg-prediab`), background `#fef3c7`.
- **Diabetes:** `#ef4444` (`--ht-bg-diabetic`), background `#fee2e2`.
- **Hypoglycemia (<70 mg/dL):** `#8b5cf6` (`--ht-bg-hypo`), background `#ede9fe`.

---

## 4. Neutral & Slate Typographical Hierarchy

A calibrated slate scale ensures high contrast without eye strain:

```text
  #0f172a (--bw-ink)            : Main headings, doctor names, active tab text
  #1e293b (--bw-text-primary)   : Body text, clinical diagnosis, medication labels
  #334155 (--bw-text-secondary) : Form labels, table data, patient details
  #64748b (--bw-muted)          : Secondary captions, timestamps, instructions
  #94a3b8 (--bw-subtle)         : Icons, signature lines, placeholder text
  #cbd5e1 (--bw-border-light)   : Unfocused borders, divider rules
  #e2e8f0 (--bw-line)           : Standard card borders, table dividers
  #f1f5f9 (--bw-surface-subtle) : Input backgrounds, table headers
  #f8fafc (--bw-surface-alt)    : Canvas background, off-duty stages
  #ffffff (--bw-surface)        : Pure white content cards, paper pads
```

---

## 5. Contrast Ratios & WCAG 2.1 AA Compliance

Every text-to-background pairing in the interface meets or exceeds WCAG AA requirements:

| Text Color | Background | Contrast Ratio | WCAG Compliance |
| :--- | :--- | :--- | :--- |
| `#0f172a` (Ink) | `#ffffff` (Card Surface) | **17.8:1** | AAA Pass |
| `#1e293b` (Body) | `#f8fafc` (Canvas Alt) | **13.5:1** | AAA Pass |
| `#1769aa` (Primary) | `#ffffff` (Card Surface) | **5.4:1** | AA Pass |
| `#0f4c3a` (Forest) | `#e9f7ed` (Mint Active) | **7.8:1** | AAA Pass |
| `#ffffff` (White Text)| `#0f4c3a` (Forest Header) | **10.1:1** | AAA Pass |
| `#991b1b` (Crisis Red)| `#fee2e2` (Rose Background) | **6.1:1** | AA Pass |
