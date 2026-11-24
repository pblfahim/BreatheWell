# BreatheWell — Project Principles & Ethical Tenets

> **Document ID:** BW-CONST-PRINCIPLES-2026  
> **Version:** 2.4.0  
> **Classification:** Project Constitution & Fundamental Tenets  

---

## 1. Preamble

The **BreatheWell Constitution** defines the ethical, architectural, and operational laws governing all development, enhancement, and maintenance of the BreatheWell digital health platform. Every developer, architect, AI agent, and healthcare contributor must strictly honor these principles.

---

## 2. The Five Pillars of BreatheWell

### Pillar 1: Total Privacy by Design (সম্পূর্ণ তথ্য গোপনীয়তা)
- **Tenet:** Health data belongs solely to the individual.
- **Law:** Zero bytes of personal health information (PHI), biometric telemetry, diagnostic tests, or uploaded prescription scans shall ever be transmitted across external networks.
- **Application:** No third-party analytics (Google Analytics, Mixpanel), no tracking pixels, no telemetry beacons, and no external cloud database integrations shall be introduced.

### Pillar 2: Zero-Friction Human Ergonomics (সহজ ও উন্মুক্ত ব্যবহার)
- **Tenet:** Healthcare tools must be immediately accessible during moments of acute need.
- **Law:** Essential health features—breathing exercises, emergency SOS, vitals logging, and prescription management—must never be gated behind paywalls, mandatory user accounts, or verification emails.

### Pillar 3: Scientific & Clinical Integrity (চিকিৎসাবিজ্ঞানের নির্ভুল মান)
- **Tenet:** Wellness applications must honor validated clinical science.
- **Law:** All respiration cadences, diagnostic thresholds, and vital sign classifications must strictly map to peer-reviewed medical standards (AHA 2017, ADA 2024, Oxygen Advantage BOLT guidelines).
- **Disclaimer:** The interface must clearly state that BreatheWell is an adjunctive wellness tool and not a substitute for certified medical diagnosis or emergency hospital triage.

### Pillar 4: Native Standards Supremacy (নেটিভ ওয়েব মানদণ্ড)
- **Tenet:** Depend on the web platform, not fragile third-party framework ecosystems.
- **Law:** BreatheWell shall be engineered using pure vanilla web standards (HTML5, modern CSS3, and ES6+ JavaScript). No runtime compilation, no heavy SPA frameworks (React, Angular, Vue), and no external runtime CDN dependencies.

### Pillar 5: Bilingual Equality (বাংলা ও ইংরেজির সমান মর্যাদা)
- **Tenet:** Language must never be a barrier to physical and mental wellness.
- **Law:** Native Bengali (`bn`) and English (`en`) must maintain 100% feature and content parity. Any feature added to the platform must include immediate, verified translations in both languages.
