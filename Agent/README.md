# BreatheWell — Architecture, Specifications & Agent Hub

Welcome to the central documentation, specifications, and governance directory for **BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব)**.

This directory houses the complete technical blueprints, design systems, architectural constitutions, engineering plans, and operational prompts that define the BreatheWell platform.

---

## Directory Navigation

```
Agent/
├── specs/                    # Functional, component, page, responsive & a11y specifications
├── theme-guideline/          # Master design system, color tokens, typography & layout rules
├── plan/                     # Implementation phases, development roadmap & testing protocols
├── constitutions/            # Core principles, frontend architecture & coding standards
├── prompts/                  # AI agent context prompts & quality review checklists
└── doc/                      # Project charters, feature specifications & release milestones
```

---

## Detailed Directory Breakdown

### 1. [Specifications (`specs/`)](specs/)
- **[PROJECT_OVERVIEW.md](specs/PROJECT_OVERVIEW.md):** High-level architectural layout, technology stack, and module matrix.
- **[FUNCTIONAL_REQUIREMENTS.md](specs/FUNCTIONAL_REQUIREMENTS.md):** Detailed requirement specifications (`FR-xxx`) across all platform features.
- **[UI_COMPONENT_SPECIFICATIONS.md](specs/UI_COMPONENT_SPECIFICATIONS.md):** Specifications for navigation bars, buttons, cards, gauges, and tables.
- **[PAGE_SPECIFICATIONS.md](specs/PAGE_SPECIFICATIONS.md):** Technical breakdowns for all 16 production HTML pages.
- **[RESPONSIVE_DESIGN_SPEC.md](specs/RESPONSIVE_DESIGN_SPEC.md):** Viewport breakpoints scale, mobile transformations, and print layout rules.
- **[ACCESSIBILITY_SPEC.md](specs/ACCESSIBILITY_SPEC.md):** WCAG 2.1 AA compliance, skip navigation, and keyboard focus management.

### 2. [Theme & Design System (`theme-guideline/`)](theme-guideline/)
- **[DESIGN_SYSTEM.md](theme-guideline/DESIGN_SYSTEM.md):** The Triad of Mindful Health, token hierarchy, and spatial elevations.
- **[COLOR_PALETTE.md](theme-guideline/COLOR_PALETTE.md):** Scoped CSS color variables, AHA/ADA clinical spectrum shades, and contrast ratios.
- **[TYPOGRAPHY.md](theme-guideline/TYPOGRAPHY.md):** Multi-script font stack (Latin + Bengali), font scale, and tabular numbers.
- **[SPACING_AND_LAYOUT.md](theme-guideline/SPACING_AND_LAYOUT.md):** 8-point spatial grid system, container hierarchy, and viewport clearances.
- **[COMPONENT_STYLING.md](theme-guideline/COMPONENT_STYLING.md):** Button hierarchy, form controls, badges, chips, and modal dialog styles.
- **[ICONOGRAPHY_AND_ASSETS.md](theme-guideline/ICONOGRAPHY_AND_ASSETS.md):** Bootstrap Icons mapping, vector assets, and procedural Web Audio synthesis.

### 3. [Engineering Plans (`plan/`)](plan/)
- **[IMPLEMENTATION_PLAN.md](plan/IMPLEMENTATION_PLAN.md):** Delivery breakdown of Milestones 1 through 6 and data flow architecture.
- **[DEVELOPMENT_ROADMAP.md](plan/DEVELOPMENT_ROADMAP.md):** Future horizons: PWA offline caching (v1.6.0) and WebAuthn biometrics (v2.0.0).
- **[COMPONENT_REFACTORING.md](plan/COMPONENT_REFACTORING.md):** Code consolidation, storage abstraction, and hero tab bar standardization.
- **[RESPONSIVE_OPTIMIZATION.md](plan/RESPONSIVE_OPTIMIZATION.md):** Layout stability, dynamic viewport units (`dvh`), and touch latency reduction.
- **[TESTING_PLAN.md](plan/TESTING_PLAN.md):** Cross-browser test matrix, automated HTML validation, and storage stress testing.

### 4. [Constitutions & Governance (`constitutions/`)](constitutions/)
- **[PROJECT_PRINCIPLES.md](constitutions/PROJECT_PRINCIPLES.md):** Fundamental ethical tenets: Privacy-by-Design, Open Access, and Bilingual Parity.
- **[FRONTEND_ARCHITECTURE.md](constitutions/FRONTEND_ARCHITECTURE.md):** Multi-page native architecture, decoupled event buses, and storage budgets.
- **[CODING_STANDARDS.md](constitutions/CODING_STANDARDS.md):** ES6+ strict mode rules, defensive DOM querying, and HTML entity escaping.
- **[UI_UX_RULES.md](constitutions/UI_UX_RULES.md):** Ten universal UI/UX design laws including the 44px touch target rule.
- **[DEVELOPMENT_CONSTRAINTS.md](constitutions/DEVELOPMENT_CONSTRAINTS.md):** Non-negotiable invariants (0 inline code, 0 external CDN links, SHA256 mirroring).

### 5. [AI Agent & Operational Prompts (`prompts/`)](prompts/)
- **[MASTER_PROJECT_PROMPT.md](prompts/MASTER_PROJECT_PROMPT.md):** Comprehensive context prompt for AI coding assistants.
- **[UI_IMPLEMENTATION_PROMPT.md](prompts/UI_IMPLEMENTATION_PROMPT.md):** Instructions for implementing new UI components.
- **[UI_REDESIGN_PROMPT.md](prompts/UI_REDESIGN_PROMPT.md):** Directives for modernizing existing views while retaining functionality.
- **[BUG_FIXING_PROMPT.md](prompts/BUG_FIXING_PROMPT.md):** Systematic protocol for diagnosing and resolving software defects.
- **[CODE_REFACTORING_PROMPT.md](prompts/CODE_REFACTORING_PROMPT.md):** Guidelines for code simplification without behavioral regressions.
- **[CODE_REVIEW_PROMPT.md](prompts/CODE_REVIEW_PROMPT.md):** Ten-point pre-merge code review checklist.

### 6. [Project Documents (`doc/`)](doc/)
- **[PROJECT_CHARTER.md](doc/PROJECT_CHARTER.md):** Formal project charter, SMART goals, and risk matrix.
- **[FEATURE_DOCUMENTATION.md](doc/FEATURE_DOCUMENTATION.md):** Detailed module-by-module feature descriptions.
- **[MILESTONES.md](doc/MILESTONES.md):** Release tracking from v1.0.0 through v1.5.0.
