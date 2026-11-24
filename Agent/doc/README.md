# BreatheWell — Technical Documentation Suite

Welcome to the technical documentation repository for **BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব)**.

This directory contains the foundational product charter, feature specifications, release history, and links to the comprehensive engineering standards that govern the BreatheWell platform.

---

## Documentation Index

### 1. Core Project Governance
- **[PROJECT_CHARTER.md](PROJECT_CHARTER.md):** The official project charter detailing the executive summary, problem statement, business justification, SMART objectives, scope boundaries, and risk management framework.
- **[FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md):** Exhaustive technical and functional breakdown of all platform modules, including respiratory algorithms, vital sign telemetry, and dual-engine prescription processing.
- **[MILESTONES.md](MILESTONES.md):** Release history and phased roadmap tracking progress from Milestone 1 (`v1.0.0`) through Milestone 6 (`v1.5.0`), with future targets for PWA caching and WebAuthn integration.

---

## Architectural & Engineering Specifications

The broader documentation ecosystem is organized across specialized directories in `Agent/`:

```
Agent/
├── constitutions/            # Architectural mandates & development standards
│   ├── PROJECT_PRINCIPLES.md        # Core ethical & operational tenets
│   ├── FRONTEND_ARCHITECTURE.md     # Multi-page native architecture & event bus
│   ├── CODING_STANDARDS.md          # JavaScript, HTML, and CSS conventions
│   ├── UI_UX_RULES.md               # User experience and accessibility laws
│   └── DEVELOPMENT_CONSTRAINTS.md   # Hard engineering constraints & invariants
│
├── specs/                    # Detailed technical specifications
│   ├── PROJECT_OVERVIEW.md          # High-level architecture and platform summary
│   ├── FUNCTIONAL_REQUIREMENTS.md   # Complete functional requirement matrix
│   ├── UI_COMPONENT_SPECIFICATIONS.md # Design system components & UI states
│   ├── PAGE_SPECIFICATIONS.md       # Technical specs for all 16 HTML pages
│   ├── RESPONSIVE_DESIGN_SPEC.md    # Multi-device layout transformations
│   └── ACCESSIBILITY_SPEC.md        # WCAG 2.1 AA compliance & keyboard navigation
│
├── theme-guideline/          # Visual design system & styling rules
│   ├── DESIGN_SYSTEM.md             # Design tokens & elevation hierarchy
│   ├── COLOR_PALETTE.md             # Scoped color tokens & clinical guidelines
│   ├── TYPOGRAPHY.md                # Multi-script typography & tabular numbers
│   ├── SPACING_AND_LAYOUT.md        # 8-point spatial grid & container hierarchy
│   ├── COMPONENT_STYLING.md         # Button, card, form, and modal CSS rules
│   └── ICONOGRAPHY_AND_ASSETS.md    # Vector icon mapping & procedural Web Audio
│
├── plan/                     # Engineering roadmaps & quality assurance
│   ├── IMPLEMENTATION_PLAN.md       # Phase-by-phase delivery breakdown
│   ├── DEVELOPMENT_ROADMAP.md       # Strategic horizons (v1.6.0 PWA & v2.0.0)
│   ├── COMPONENT_REFACTORING.md     # Code consolidation & debt elimination
│   ├── RESPONSIVE_OPTIMIZATION.md   # Viewport stability & touch performance
│   └── TESTING_PLAN.md              # Quality assurance & verification suites
│
└── prompts/                  # Operational prompts for AI-assisted engineering
    ├── MASTER_PROJECT_PROMPT.md     # Primary context prompt for AI agents
    ├── UI_IMPLEMENTATION_PROMPT.md  # Guidelines for adding new features
    ├── UI_REDESIGN_PROMPT.md        # Protocol for modernizing existing views
    ├── BUG_FIXING_PROMPT.md         # Diagnostic & defect resolution guide
    ├── CODE_REFACTORING_PROMPT.md   # Structural code optimization prompt
    └── CODE_REVIEW_PROMPT.md        # 10-point pre-merge review checklist
```

---

## Key Invariants Summary

Every contributor and automated system working in this repository must maintain the following architectural standards:

1. **Zero External Telemetry:** All patient biometrics, respiratory logs, and prescription records remain exclusively on the user's device (`localStorage`).
2. **Zero Inline Code Policy:** All HTML files maintain 0 inline `<style>` and 0 inline `<script>` tags.
3. **Local Vendor Self-Sufficiency:** All third-party libraries (Bootstrap, Bootstrap Icons, DataTables, Tesseract.js, PDF.js) reside in `asset/vendor/`. No runtime CDN dependencies.
4. **Deterministic Script Mirroring:** Byte-for-byte SHA256 equality is maintained between `asset/js/script.js` and `asset/js/script.jt`.
5. **Universal Bilingual Parity:** 100% dictionary key parity between Bengali (`bn`) and English (`en`).
