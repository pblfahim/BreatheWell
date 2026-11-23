# BreatheWell — Component Refactoring & Code Quality Plan

> **Document ID:** BW-PLAN-REFACTORING-2026  
> **Version:** 2.4.0  
> **Classification:** Architectural Debt Elimination & Code Refactoring Blueprint  

---

## 1. Objectives of Component Refactoring

As BreatheWell expanded from an interactive breathing tool into a multi-page clinical wellness ecosystem, architectural enhancements were identified to maximize maintainability, eradicate code duplication, and enforce deterministic reliability:

1. **Centralization of Shared Utilities:** Extract duplicate date formatting, HTML escaping, and storage serialization into unified helper modules.
2. **Standardization of Hero Tab Bars:** Ensure the `.ht-hero-tab-bar` strictly inherits from `style.css` without local stylesheet overrides.
3. **DataTables 2 Controller Hardening:** Standardize table re-initialization and clean destruction lifecycle routines across `health-history.js`, `prescription-history.js`, and `digitalpad-history.js`.
4. **Bilingual Key Synchronization:** Maintain 100% parity across all localized page dictionaries.

---

## 2. Refactoring Focus Areas

### 2.1 Refactoring Item 1: Storage Layer Abstraction (`bwStorage`)
- **Current State:** Pages interact directly with `localStorage.getItem` and `localStorage.setItem` inside scattered try/catch blocks.
- **Target Architecture:** Standardized client-side repository wrapper:
  ```javascript
  const bwStorage = {
    get(key, fallback = []) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      } catch (err) {
        console.warn(`[bwStorage] Read error for ${key}:`, err);
        return fallback;
      }
    },
    set(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (err) {
        console.error(`[bwStorage] Write error for ${key}:`, err);
        return false;
      }
    }
  };
  ```

### 2.2 Refactoring Item 2: DataTables 2 Instance Lifecycle
- **Problem Statement:** Switching view modes or filtering records without proper DataTable instance destruction causes memory leaks and jQuery re-initialization warnings.
- **Implemented Fix & Standard:**
  ```javascript
  if (dataTableInstance) {
    dataTableInstance.destroy();
    dataTableInstance = null;
  }
  // Populate innerHTML
  tbody.innerHTML = records.map(renderRow).join("");
  // Re-initialize with clean configuration
  dataTableInstance = new DataTable("#myTable", {
    pageLength: 10,
    responsive: true,
    destroy: true,
    order: [[0, "desc"]]
  });
  ```

### 2.3 Refactoring Item 3: Universal Hero Tab Bar Styling
- **Action Taken:** Removed custom overriding rules from `digitalpad-history.css` (lines 41-92).
- **Rule Enforced:** All 5 prescription-related pages (`prescriptions-volt.html`, `prescription-history.html`, `digitalpad-history.html`, `prescription-create.html`, `prescription-pad.html`) and 4 health tracker pages (`health-reading.html`, `health-history.html`, `health-charts.html`, `health-demo.html`) strictly consume the master `.ht-hero-tab-bar` styles defined in `asset/css/style.css` (lines 3113–3245).
