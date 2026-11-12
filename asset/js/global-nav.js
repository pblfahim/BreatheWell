/**
 * ============================================================================
 * BreatheWell - Unified Global Navigation Engine (global-nav.js)
 * ============================================================================
 * @file        asset/js/global-nav.js
 * @module      BreatheWell/GlobalNav
 * @author      BreatheWell Engineering Team
 * @version     1.0.0
 * @license     MIT
 * @description
 *   Unified, bulletproof client-side controller for BreatheWell's global:
 *     1. Desktop & Tablet Top Sticky Navbar
 *     2. Mobile Bottom App Drawer Navigation Bar (< 992px)
 *     3. Mobile Side/Bottom Offcanvas App Drawer (#mobileSidebarMenu)
 *     4. Global Bilingual (Bengali / English) Language Synchronization
 *     5. Pull/Tap Handle Pill Drawer Opener (.drawer-handle-pill)
 *     6. Unified Footer
 * ============================================================================
 */

(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__bwGlobalNavInitialized) return;
  window.__bwGlobalNavInitialized = true;

  // Storage Keys
  const LANG_KEY = "bw_lang";
  const RX_LANG_KEY = "bw_rx_lang";
  const HT_LANG_KEY = "bw_ht_lang_v1";

  // Master Navigation & Chrome Translations Dictionary
  const NAV_T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navHealthShort: "স্বাস্থ্য",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ও মাইন্ডফুলনেস",
      navPagesTitle: "পেজ ও মডিউল",
      navHomeSub: "মূল পাতা ও ফিচারসমূহ",
      navExercisesSub: "শ্বাস-প্রশ্বাসের ব্যায়াম লাইব্রেরি",
      navTestSub: "BOLT ও BPM রেসপিরেটরি টেস্ট",
      navHealthSub: "রক্তচাপ ও ডায়াবেটিস ট্র্যাকার",
      navRxSub: "ডিজিটাল প্রেসক্রিপশন ভল্ট ও OCR",
      navSafetySub: "৩টি মূল নিয়ম ও স্বাস্থ্য নির্দেশিকা",
      quickToolsTitle: "দ্রুত অ্যাকশন",
      quickEmergencyLabel: "জরুরি শান্ত শ্বাস (SOS)",
      quickEmergencySub: "৪টি ধাপে তাৎক্ষণিক প্রশান্তি",
      quickTestLabel: "ফুসফুস পরীক্ষা",
      quickTestSub: "BOLT ও BPM স্কোর জানুন",
      langSelectTitle: "ভাষা পরিবর্তন",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navHealthShort: "Health",
      navRx: "Prescriptions",
      navSafety: "Safety",
      navMore: "More",
      sidebarBrandSub: "Digital Health & Mindfulness",
      navPagesTitle: "Pages & Modules",
      navHomeSub: "Main page & features",
      navExercisesSub: "Breathing exercise library",
      navTestSub: "BOLT & BPM respiratory tests",
      navHealthSub: "Blood pressure & diabetes logs",
      navRxSub: "Digital prescription vault & OCR",
      navSafetySub: "3 core rules & health guide",
      quickToolsTitle: "Quick Actions",
      quickEmergencyLabel: "Emergency Calm (SOS)",
      quickEmergencySub: "Immediate relief in 4 steps",
      quickTestLabel: "Lung Test",
      quickTestSub: "Discover BOLT & BPM score",
      langSelectTitle: "Language Settings",
      footerTag: "Peace in every breath",
      footerDisclaimer: "For general wellness. Not a substitute for medical advice."
    }
  };

  /**
   * Get current language code ('bn' | 'en')
   */
  function getCurrentLang() {
    try {
      return localStorage.getItem(LANG_KEY) || "bn";
    } catch (_) {
      return "bn";
    }
  }

  /**
   * Apply translations to all [data-i18n] elements
   */
  function applyNavTranslations(lang) {
    const dict = NAV_T[lang] || NAV_T.bn;
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Update Top Navbar Language Toggle Button Text
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.textContent = lang === "bn" ? "English" : "বাংলা";
      langBtn.setAttribute("aria-label", lang === "bn" ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন");
    }

    // Update Drawer Language Pills
    const pills = document.querySelectorAll(".mobile-lang-pill");
    pills.forEach((p) => {
      const targetLang = p.getAttribute("data-lang");
      const isTarget = targetLang === lang;
      p.classList.toggle("active", isTarget);
      p.setAttribute("aria-pressed", isTarget ? "true" : "false");
    });

    // Update HTML root lang attribute
    document.documentElement.lang = lang;
  }

  /**
   * Global Language Switcher
   */
  function setGlobalLanguage(lang) {
    if (lang !== "bn" && lang !== "en") lang = "bn";
    try {
      localStorage.setItem(LANG_KEY, lang);
      localStorage.setItem(RX_LANG_KEY, lang);
      localStorage.setItem(HT_LANG_KEY, lang);
    } catch (_) { }

    applyNavTranslations(lang);

    // Notify all page-specific controllers
    try {
      window.dispatchEvent(
        new CustomEvent("bwLanguageChanged", {
          detail: { lang }
        })
      );
    } catch (_) { }
  }

  /**
   * Initialize Language Controls
   */
  function initLanguageControls() {
    const lang = getCurrentLang();
    applyNavTranslations(lang);

    // Header Language Toggle Button
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const nextLang = getCurrentLang() === "bn" ? "en" : "bn";
        setGlobalLanguage(nextLang);
      });
    }

    // Drawer Language Selector Pills
    const pills = document.querySelectorAll(".mobile-lang-pill");
    pills.forEach((p) => {
      p.addEventListener("click", () => {
        const targetLang = p.getAttribute("data-lang");
        if (targetLang) {
          setGlobalLanguage(targetLang);
        }
      });
    });
  }

  /**
   * Initialize Mobile Bottom Drawer Controls
   */
  function initMobileDrawerControls() {
    const sidebar = document.getElementById("mobileSidebarMenu");

    // Drawer Drag/Tap Handle Pill (#mobileDrawerHandle or .drawer-handle-pill)
    const handlePills = document.querySelectorAll(".drawer-handle-pill, #mobileDrawerHandle");
    handlePills.forEach((handle) => {
      handle.style.cursor = "pointer";
      handle.addEventListener("click", () => {
        if (sidebar && window.bootstrap?.Offcanvas) {
          const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(sidebar);
          bsOffcanvas.show();
        }
      });
    });

    // Auto-close Offcanvas Drawer when user clicks any navigation link or action card
    if (sidebar && typeof sidebar.querySelectorAll === "function") {
      const drawerLinks = sidebar.querySelectorAll(".mobile-sidebar-nav-item, .mobile-sidebar-action-card");
      drawerLinks.forEach((link) => {
        link.addEventListener("click", () => {
          try {
            const inst = window.bootstrap?.Offcanvas?.getInstance(sidebar);
            if (inst) inst.hide();
          } catch (_) { }
        });
      });
    }
  }

  /**
   * Auto-highlight active links based on current path
   */
  function syncActiveNavLinks() {
    const path = (window.location && window.location.pathname ? window.location.pathname : "").toLowerCase();
    const hash = (window.location && window.location.hash ? window.location.hash : "").toLowerCase();
    const filename = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    let activeKey = "home";
    if (filename.includes("exercise")) {
      activeKey = "exercises";
    } else if (filename.includes("breath-test")) {
      activeKey = "test";
    } else if (filename.includes("health") || filename.includes("trend")) {
      activeKey = "health";
    } else if (filename.includes("prescription")) {
      activeKey = "rx";
    } else if (hash.includes("safety")) {
      activeKey = "safety";
    }

    // Highlight Desktop Top Navbar Links
    const navLinks = document.querySelectorAll(".navbar .nav-link");
    navLinks.forEach((l) => {
      const href = (l.getAttribute("href") || "").toLowerCase();
      let match = false;
      if (activeKey === "home" && (href === "index.html" || href === "./" || href === "/")) match = true;
      if (activeKey === "exercises" && href.includes("exercise")) match = true;
      if (activeKey === "test" && href.includes("breath-test")) match = true;
      if (activeKey === "health" && (href.includes("health") || href.includes("trend"))) match = true;
      if (activeKey === "rx" && href.includes("prescription")) match = true;
      if (activeKey === "safety" && href.includes("safety")) match = true;

      l.classList.toggle("active", match);
      if (match) {
        l.setAttribute("aria-current", "page");
      } else {
        l.removeAttribute("aria-current");
      }
    });

    // Highlight Mobile Bottom Navigation Links
    const botLinks = document.querySelectorAll(".mobile-bottom-nav .mobile-nav-link");
    botLinks.forEach((l) => {
      const href = (l.getAttribute("href") || "").toLowerCase();
      const isMore = l.id === "mobileMoreBtn";
      let match = false;

      if (activeKey === "home" && (href === "index.html" || href === "./")) match = true;
      if (activeKey === "exercises" && href.includes("exercise")) match = true;
      if (activeKey === "health" && (href.includes("health") || href.includes("trend"))) match = true;
      if (activeKey === "rx" && href.includes("prescription")) match = true;
      if (activeKey === "test" || activeKey === "safety") {
        if (isMore) match = true;
      }

      l.classList.toggle("active", match);
      if (match) {
        l.setAttribute("aria-current", "page");
      } else {
        l.removeAttribute("aria-current");
      }
    });

    // Highlight Mobile Drawer Nav Items
    const drawerItems = document.querySelectorAll(".mobile-sidebar-nav-list .mobile-sidebar-nav-item");
    drawerItems.forEach((l) => {
      const href = (l.getAttribute("href") || "").toLowerCase();
      let match = false;
      if (activeKey === "home" && (href === "index.html" || href === "./")) match = true;
      if (activeKey === "exercises" && href.includes("exercise")) match = true;
      if (activeKey === "test" && href.includes("breath-test")) match = true;
      if (activeKey === "health" && (href.includes("health") || href.includes("trend"))) match = true;
      if (activeKey === "rx" && href.includes("prescription")) match = true;
      if (activeKey === "safety" && href.includes("safety")) match = true;

      l.classList.toggle("active", match);
      if (match) {
        l.setAttribute("aria-current", "page");
      } else {
        l.removeAttribute("aria-current");
      }
    });
  }

  // DOM Ready Bootstrap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initLanguageControls();
      initMobileDrawerControls();
      syncActiveNavLinks();
    });
  } else {
    initLanguageControls();
    initMobileDrawerControls();
    syncActiveNavLinks();
  }

  // Expose API
  window.bwGlobalNav = {
    setLanguage: setGlobalLanguage,
    getLanguage: getCurrentLang,
    translations: NAV_T
  };
})();
