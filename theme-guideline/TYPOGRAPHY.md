# BreatheWell — Typography System Specification

> **Document ID:** BW-THEME-TYPOGRAPHY-2026  
> **Version:** 2.4.0  
> **Classification:** Typography & Multi-Script Guidelines  

---

## 1. Multi-Script Font Stack

BreatheWell is built with native bilingual inclusivity. To render English and Bengali scripts with equal elegance and zero font rendering collisions, the platform employs a dual-font architecture:

```css
/* Primary Application Font Stack (Latin First, Bengali Integrated) */
font-family: Inter, "Noto Sans Bengali", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Monospace & Tabular Number Stack (Stopwatches, Vitals, Serials) */
font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
font-variant-numeric: tabular-nums;
```

All font files are hosted locally within `asset/vendor/fonts/` (WOFF2 and TTF formats). **Zero external font requests** (`fonts.googleapis.com` or `fonts.gstatic.com`) are executed.

---

## 2. Typographical Hierarchy & Scale

```
+---------------------------------------------------------------------------------------------------------+
| Type Scale Hierarchy                                                                                    |
+-------------------+----------------+-------------+-------------+----------------------------------------+
| Level             | Size (Desktop) | Size (Phone)| Weight      | Application                            |
+-------------------+----------------+-------------+-------------+----------------------------------------+
| Display 1         | 2.75rem (44px) | 2.1rem      | 800 (Bold)  | Landing Hero Headline                  |
| Heading 1 (h1)    | 2.00rem (32px) | 1.65rem     | 800 (Bold)  | Primary Page Titles                    |
| Heading 2 (h2)    | 1.60rem (25px) | 1.40rem     | 700 (Semi)  | Section Titles (Exercises, Vitals)     |
| Heading 3 (h3)    | 1.30rem (20px) | 1.15rem     | 700 (Semi)  | Card Titles, Doctor Letterhead         |
| Heading 4 (h4)    | 1.10rem (17px) | 1.00rem     | 600 (Med)   | Sub-card headers, Section Dividers     |
| Body Large        | 1.05rem (17px) | 1.00rem     | 400 (Norm)  | Hero Subtitles, Phase Instructions     |
| Body Regular      | 0.95rem (15px) | 0.90rem     | 400 (Norm)  | Standard copy, prescription items      |
| Body Small        | 0.85rem (13.6) | 0.80rem     | 500 (Med)   | Form labels, table cells, advice       |
| Micro Caption     | 0.75rem (12px) | 0.72rem     | 600 (Semi)  | Status badges, timestamps, units       |
+-------------------+----------------+-------------+-------------+----------------------------------------+
```

---

## 3. Dual-Script Harmony: Bengali (`bn`) & English (`en`)

Bengali typography presents unique structural characteristics, including complex conjunct characters (*যুক্তাক্ষর*) and ascending/descending vowel diacritics (*ই-কার, ঈ-কার, উ-কার*).

To maintain visual balance between Bengali and English modes:
1. **Line-Height Expansion:**
   Body text line-height is set to `1.6` for Bengali (compared to `1.5` for Latin) to prevent top and bottom diacritic clipping.
2. **Optical Size Balancing:**
   Noto Sans Bengali glyphs appear slightly more delicate than Latin Inter glyphs at identical font weights. Therefore, Bengali headings and tab labels use `font-weight: 700` and `800` to maintain visual parity with English titles.
3. **Punctuation & Numerals:**
   Numbers in clinical readouts (blood pressure, blood glucose, heart rate) can be displayed in localized Bengali numerals (১, ২, ৩) or standard Arabic numerals (1, 2, 3), styled with `tabular-nums` to prevent layout shift during countdowns.

---

## 4. Tabular Figures & Numerical Stability

During active breathing sessions, BOLT stopwatch timing, and live BPM pulse counting, changing digits must not cause adjacent text to oscillate or jitter.

All timers, countdowns, and vitals readouts are explicitly styled with:
```css
.phase-timer,
.bolt-stopwatch,
.stat-val,
.ph-data-table td[data-order] {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```
This forces all digits (0–9) to occupy identical horizontal widths.
