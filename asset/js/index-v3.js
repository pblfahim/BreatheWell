/**
 * ============================================================================
 * BreatheWell - Clinical Bento & Wellness Hub Controller (index-v3.js)
 * ============================================================================
 * @file        asset/js/index-v3.js
 * @module      BreatheWell/IndexV3
 * @version     3.0.0
 * @license     MIT
 * @description
 *   Interactive ES6+ controller for index-v3.html. Coordinates:
 *     1. Bilingual localization synced with global-nav.js (bwLanguageChanged)
 *     2. Live Autonomic Respiration Studio (rAF ring, Web Audio chimes, TTS)
 *     3. Real-Time LocalStorage Telemetry Snapshot & SVG Trend Sparkline
 *     4. Interactive Diagnostics Workbench (AHA/ADA Triage + Quick Save,
 *        BOLT Stopwatch & BPM Tap Counter, JSON Vault Backup)
 *     5. Interactive Readiness Checklist & One-Tap 4-6 SOS Calm Pacer
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. STORAGE KEYS & APPLICATION STATE
  // ============================================================================
  const KEYS = {
    HEALTH_V1: "bw_health_records_v1",
    HEALTH_LEGACY: "bw_health_tracker_records",
    TEST_HISTORY: "bw_test_history",
    BOLT_LEGACY: "bw_bolt_history",
    RX_VAULT: "bw_prescriptions",
    RX_PAD: "bw_digitalpad_prescriptions",
    ACTIVE_USER: "bw_active_user",
    SESSIONS: "bw_session_history",
    LANG: "bw_lang"
  };

  const RING_CIRCUMFERENCE = 2 * Math.PI * 96; // 603.1858

  let currentLang = getInitialLang();

  // Respiration studio state
  let activeCadence = "box";
  let isBreathRunning = true;
  let breathSoundOn = true;
  let breathTtsOn = false;
  let breathPhase = "inhale"; // inhale | hold1 | exhale | hold2
  let phaseStartMs = 0;
  let cycleCount = 0;
  let breathRafId = null;
  let audioCtx = null;
  let hasUserGesture = false;

  const CADENCES = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    478: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    deep: { inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
    balance: { inhale: 4, hold1: 4, exhale: 4, hold2: 0 }
  };

  // Workbench state
  let wbMode = "bp"; // bp | bg
  let wbPreset = "normal";
  let bgUnit = "mmol"; // mmol | mgdl
  let bgTiming = "fasting"; // fasting | postmeal

  // BOLT & BPM state
  let boltRunning = false;
  let boltStartMs = 0;
  let boltRafId = null;
  let lastBoltSec = 0;
  let bpmTaps = [];
  let bpmElapsedInterval = null;

  // ============================================================================
  // 2. BILINGUAL DICTIONARY (100% PARITY BETWEEN BN & EN)
  // ============================================================================
  const NX_T = {
    bn: {
      pageTitle: "BreatheWell | ক্লিনিক্যাল বেন্টো ওয়েলনেস হাব",
      ctxBadge: "দৈনিক ক্লিনিক্যাল ও মাইন্ডফুলনেস ওয়ার্কস্পেস",
      heroGreeting: "সুস্থতা ও প্রশান্তির সমন্বিত হাব",
      heroGreetingUser: "স্বাগতম, {name} — আপনার দৈনিক স্বাস্থ্য ড্যাশবোর্ড",
      heroSubtitle: "নির্দেশিত শ্বাসপ্রশ্বাস, AHA ২০১৭ ও ADA ২০২৪ ভাইটালস ট্র্যাকিং এবং অফলাইন প্রেসক্রিপশন স্টুডিও—সম্পূর্ণ ব্যক্তিগত ও দ্রুতগতির।",
      privacyPill: "১০০% অফলাইন ও প্রাইভেট",
      demoDataBtn: "নমুনা ডেটা",
      accountLogin: "সদস্য লগইন",
      accountProfile: "প্রোফাইল",
      bentoBreathEyebrow: "লাইভ অটোনমিক ব্রিদিং ল্যাব",
      cadenceBox: "বক্স ৪-৪-৪-৪",
      cadence478: "৪-৭-৮ স্লিপ",
      cadenceDeep: "ডিপ ৪-২-৬",
      cadenceBalance: "নাড়ী ৪-৪-৪",
      phaseReady: "প্রস্তুত",
      phaseInhale: "শ্বাস নিন",
      phaseHold: "ধরে রাখুন",
      phaseExhale: "শ্বাস ছাড়ুন",
      phaseRest: "স্বাভাবিক থাকুন",
      noteBox: "বক্স ব্রিদিং (সমানাবৃত্তি): ৪ সেকেন্ড শ্বাস, ৪ সেকেন্ড ধরে রাখা, ৪ সেকেন্ড ত্যাগ ও ৪ সেকেন্ড বিরতি—স্নায়ুতন্ত্র শান্ত করতে কার্যকর।",
      note478: "৪-৭-৮ রিল্যাক্সিং শ্বাস: দীর্ঘ প্রশ্বাসের মাধ্যমে হৃদস্পন্দন কমায় ও গভীর ঘুম আনতে সহায়তা করে।",
      noteDeep: "ডিপ ডায়াফ্রাগম্যাটিক শ্বাস: প্যারাসিম্প্যাথেটিক স্নায়ু সক্রিয় করে তাৎক্ষণিক উদ্বেগ ও চাপ হ্রাস করে।",
      noteBalance: "নাড়ী শোধন (৪-৪-৪): মানসিক একাগ্রতা বৃদ্ধি ও অভ্যন্তরীণ ভারসাম্য ফিরিয়ে আনতে সহায়ক।",
      btnPausePlay: "বিরতি",
      btnResumePlay: "শুরু করুন",
      openFullStudio: "সম্পূর্ণ স্টুডিও",
      telemetryKicker: "লাইভ লোকাল টেলিমেট্রি",
      telemetryHeading: "আপনার স্বাস্থ্য সারসংক্ষেপ",
      btnQuickLog: "নতুন এন্ট্রি",
      kpiBp: "রক্তচাপ (BP)",
      kpiGlucose: "রক্তের শর্করা",
      kpiBolt: "ফুসফুস (BOLT)",
      kpiRx: "প্রেসক্রিপশন",
      sparkTitle: "সিস্টোলিক রক্তচাপ ট্রেন্ড",
      sparkDemoLabel: "প্রিভিউ • চার্ট দেখুন",
      sparkLiveLabel: "{n}টি রেকর্ড • চার্ট দেখুন",
      suitesEyebrow: "৪টি সমন্বিত ক্লিনিক্যাল স্যুট",
      suitesTitle: "সকল স্বাস্থ্য ও ডায়াগনস্টিক মডিউল",
      suitesDesc: "শ্বাসপ্রশ্বাস অনুশীলন, ভাইটালস টেলিমেট্রি, OCR প্রেসক্রিপশন ভল্ট এবং ডিজিটাল হসপিটাল প্যাডে সরাসরি প্রবেশ করুন।",
      suite1Title: "শ্বাস ব্যায়াম ও ফুসফুস ল্যাব",
      suite1Desc: "বক্স, ৪-৭-৮ ও নাড়িশোধন শ্বাস ব্যায়াম, BOLT অক্সিজেন পরীক্ষা এবং রেস্টিং BPM কাউন্টার।",
      suite1Link1: "ব্যায়াম স্টুডিও",
      suite1Link2: "BOLT ও BPM টেস্ট",
      suite2Title: "ক্লিনিক্যাল ভাইটালস ট্র্যাকার",
      suite2Desc: "AHA ২০১৭ রক্তচাপ ও ADA ২০২৪ ডায়াবেটিস বিশ্লেষণ, SVG চার্ট এবং DataTables ২ লগ এক্সপোর্ট।",
      suite2Link1: "নতুন রিডিং লগ",
      suite2Link2: "চার্ট",
      suite2Link3: "ইতিহাস",
      suite3Title: "ওসিআর প্রেসক্রিপশন ভল্ট",
      suite3Desc: "ব্রাউজারে Tesseract.js ওসিআর ও PDF স্ক্যানার, ওষুধ রিফিল অ্যালার্ট এবং ডুয়াল ইতিহাস গ্যালারি।",
      suite3Link1: "ভল্ট ও OCR স্ক্যান",
      suite3Link2: "সংরক্ষিত ইতিহাস",
      suite4Title: "ডিজিটাল প্রেসক্রিপশন স্টুডিও",
      suite4Desc: "লাইভ WYSIWYG হসপিটাল প্যাড ক্রিয়েটর, ইন-প্লেস এডিটিং, A4 প্রিন্ট ও ডিজিটাল প্যাড আর্কাইভ।",
      suite4Link1: "প্রেসক্রিপশন তৈরি",
      suite4Link2: "প্যাড",
      suite4Link3: "আর্কাইভ",
      wbEyebrow: "ইন্টারেক্টিভ ডায়াগনস্টিক ওয়ার্কবেঞ্চ",
      wbTitle: "ক্লিনিক্যাল ট্রায়াজ, BOLT চেক ও ডেটা ভল্ট",
      wbDesc: "সরাসরি মান যাচাই করে হেলথ ট্র্যাকারে সংরক্ষণ করুন বা তাৎক্ষণিক ফুসফুস সক্ষমতা পরিমাপ করুন।",
      wbTabVitals: "ভাইটালস ট্রায়াজ",
      wbTabPulmonary: "BOLT ও BPM চেক",
      wbTabPrivacy: "ডেটা ও ব্যাকআপ",
      modeBp: "রক্তচাপ (AHA)",
      modeBg: "রক্তের শর্করা (ADA)",
      btnReset: "রিসেট",
      lblSys: "সিস্টোলিক রক্তচাপ (Systolic)",
      lblDia: "ডায়াস্টোলিক রক্তচাপ (Diastolic)",
      lblBg: "রক্তের গ্লুকোজ",
      timingFasting: "খালি পেটে",
      timingPost: "খাবারের ২ ঘণ্টা পর",
      tierLow: "কম",
      tierNormal: "স্বাভাবিক",
      tierElev: "সামান্য বেশি",
      tierHigh: "উচ্চ",
      btnSaveRecord: "ট্র্যাকারে সংরক্ষণ করুন",
      btnOpenFull: "বিস্তারিত এন্ট্রি",
      openFullLab: "সম্পূর্ণ ল্যাব →",
      boltTitle: "বডি অক্সিজেন লেভেল টেস্ট (BOLT)",
      boltDesc: "স্বাভাবিক শ্বাস ত্যাগ করে নাক চেপে ধরুন। প্রথম শ্বাস নেওয়ার তাগিদ অনুভব করামাত্রই থামান।",
      boltReadyTag: "প্রস্তুত",
      boltRunningTag: "চলমান...",
      btnBoltStart: "টেস্ট শুরু করুন",
      btnBoltStop: "থামুন (Stop)",
      btnSaveScore: "সেভ",
      bpmTitle: "রেস্টিং BPM ট্যাপ কাউন্টার",
      bpmDesc: "প্রতিটি সম্পূর্ণ শ্বাস (নেওয়া + ছাড়া) শেষে নিচের বাটনে ট্যাপ করুন। ন্যূনতম ৩ ট্যাপে হার নির্ণয় হবে।",
      bpmTapCount: "০ ট্যাপ",
      btnTapBreath: "শ্বাস গণনা (Tap)",
      vaultTitle: "১০০% লোকাল স্টোরেজ স্বচ্ছতা ও ব্যাকআপ",
      vaultDesc: "আপনার কোনো স্বাস্থ্য তথ্য বা প্রেসক্রিপশন ছবি কোনো ক্লাউড সার্ভারে পাঠানো হয় না। নিচে আপনার ব্রাউজারে সংরক্ষিত মোট রেকর্ডের বিবরণ দেখুন:",
      storeVitals: "ভাইটালস রেকর্ড",
      storeTests: "BOLT / শ্বাস পরীক্ষা",
      storeVault: "OCR ভল্ট প্রেসক্রিপশন",
      storePad: "ডিজিটাল প্যাড রেকর্ড",
      backupHead: "সুরক্ষিত JSON ব্যাকআপ নিন",
      backupSub: "আপনার সকল ভাইটালস, প্রেসক্রিপশন ও প্রোফাইল ডেটা এক ক্লিকে আপনার ডিভাইসে ডাউনলোড করুন।",
      btnExportBackup: "সম্পূর্ণ JSON ব্যাকআপ ডাউনলোড",
      btnManageProfile: "প্রোফাইল ও ডেটা ম্যানেজার",
      safeChecklistTag: "নিরাপত্তা ও প্রস্তুতি",
      safeChecklistTitle: "অনুশীলনের ৩ মূল নিয়ম ও প্রস্তুতি",
      chk1: "মেরুদণ্ড সোজা রেখে আরামদায়ক আসনে বসা",
      chk2: "জোর না করে নাক দিয়ে শান্ত ও স্বাভাবিক শ্বাস নেওয়া",
      chk3: "ভারী খাবারের অন্তত ১.৫–২ ঘণ্টা পর অনুশীলন করা",
      chk4: "মাথা ঘোরানো বা অস্বস্তি হলে সাথে সাথে স্বাভাবিক শ্বাসে ফেরা",
      precautionNote: "গর্ভাবস্থা, তীব্র হাঁপানি, সম্প্রতি অস্ত্রোপচার বা অনিয়িত উচ্চ রক্তচাপে শ্বাস ধরে রাখা (Hold) পরিহার করুন।",
      sosTag: "জরুরি এসওএস প্রশান্তি (SOS)",
      sosTitle: "৪ ধাপে তাৎক্ষণিক উদ্বেগ নিয়ন্ত্রণ",
      btnSosPacer: "৪-৬ SOS পেসার চালান",
      sosStep1: "১. স্থির হোন: দুই পা মেঝেতে শক্তভাবে রাখুন ও কাঁধ শিথিল করুন।",
      sosStep2: "২. শ্বাস গ্রহণ (৪ সেকেন্ড): নাক দিয়ে ধীরে ও গভীরভাবে শ্বাস নিন।",
      sosStep3: "৩. দীর্ঘ ত্যাগ (৬ সেকেন্ড): ঠোঁট সামান্য খুলে ধীরে শ্বাস ছাড়ুন।",
      sosStep4: "৪. পুনরাবৃত্তি: অন্তত ৩–৫ মিনিট এই শান্ত ছন্দ বজায় রাখুন।",
      hotlineWarn: "বুকে ব্যথা, তীব্র শ্বাসকষ্ট বা রক্তচাপ ১৮০+ হলে অবিলম্বে জরুরি চিকিৎসা নিন:",
      tel999: "জাতীয় জরুরি সেবা ৯৯৯",
      tel16263: "স্বাস্থ্য বাতায়ন ১৬২৬৩"
    },
    en: {
      pageTitle: "BreatheWell | Clinical Bento Wellness Hub",
      ctxBadge: "Daily Clinical & Mindfulness Workspace",
      heroGreeting: "Unified Clinical Health & Mindfulness Hub",
      heroGreetingUser: "Welcome back, {name} — Daily Health Workspace",
      heroSubtitle: "Guided autonomic breathing, AHA 2017 & ADA 2024 vitals tracking, and an offline digital prescription studio—fast and 100% private.",
      privacyPill: "100% Offline & Private",
      demoDataBtn: "Demo Data",
      accountLogin: "Member Login",
      accountProfile: "Profile",
      bentoBreathEyebrow: "Live Autonomic Breathing Lab",
      cadenceBox: "Box 4-4-4-4",
      cadence478: "4-7-8 Sleep",
      cadenceDeep: "Deep 4-2-6",
      cadenceBalance: "Balance 4-4-4",
      phaseReady: "Ready",
      phaseInhale: "Inhale",
      phaseHold: "Hold",
      phaseExhale: "Exhale",
      phaseRest: "Rest",
      noteBox: "Box Breathing: 4s inhale, 4s hold, 4s exhale, 4s rest—proven to calm sympathetic stress.",
      note478: "4-7-8 Relaxing Breath: extended exhalation slows heart rate and promotes deep sleep.",
      noteDeep: "Deep Diaphragmatic Breath: stimulates vagal tone to alleviate acute tension quickly.",
      noteBalance: "Nadi Shodhana (4-4-4): balances hemispheric focus and restores autonomic calm.",
      btnPausePlay: "Pause",
      btnResumePlay: "Start",
      openFullStudio: "Full Studio",
      telemetryKicker: "Live Local Telemetry",
      telemetryHeading: "Your Health Snapshot",
      btnQuickLog: "New Entry",
      kpiBp: "Blood Pressure",
      kpiGlucose: "Blood Glucose",
      kpiBolt: "Pulmonary BOLT",
      kpiRx: "Prescriptions",
      sparkTitle: "Systolic BP Trend",
      sparkDemoLabel: "Preview • View Charts",
      sparkLiveLabel: "{n} records • View Charts",
      suitesEyebrow: "4 Integrated Clinical Suites",
      suitesTitle: "All Wellness & Diagnostic Modules",
      suitesDesc: "Jump directly into guided respiration protocols, clinical vitals telemetry, OCR prescription vault, or the WYSIWYG Rx pad.",
      suite1Title: "Respiration & Lung Lab",
      suite1Desc: "Box, 4-7-8, and Nadi Shodhana sessions plus BOLT oxygen efficiency & resting BPM tests.",
      suite1Link1: "Breathing Studio",
      suite1Link2: "BOLT & BPM Tests",
      suite2Title: "Clinical Vitals Tracker",
      suite2Desc: "AHA 2017 BP & ADA 2024 glucose analysis, interactive SVG trend charts, and DataTables 2 logs.",
      suite2Link1: "Log New Reading",
      suite2Link2: "Charts",
      suite2Link3: "History",
      suite3Title: "OCR Prescription Vault",
      suite3Desc: "Client-side Tesseract.js OCR & PDF scanner, refill alerts, and dual gallery/table history.",
      suite3Link1: "Vault & OCR Scan",
      suite3Link2: "Saved History",
      suite4Title: "Digital Rx Pad Studio",
      suite4Desc: "Live WYSIWYG hospital pad creator, direct editable sheet, A4 printing & pad archive.",
      suite4Link1: "Create Prescription",
      suite4Link2: "Live Pad",
      suite4Link3: "Archive",
      wbEyebrow: "Interactive Diagnostics Workbench",
      wbTitle: "Clinical Triage, BOLT Self-Check & Data Vault",
      wbDesc: "Evaluate vitals against clinical ranges and save straight to Health Tracker, or run an instant respiratory check.",
      wbTabVitals: "Vitals Triage",
      wbTabPulmonary: "BOLT & BPM Check",
      wbTabPrivacy: "Vault & Backup",
      modeBp: "Blood Pressure (AHA)",
      modeBg: "Blood Glucose (ADA)",
      btnReset: "Reset",
      lblSys: "Systolic Pressure (mmHg)",
      lblDia: "Diastolic Pressure (mmHg)",
      lblBg: "Blood Glucose",
      timingFasting: "Fasting",
      timingPost: "2h Post-meal",
      tierLow: "Low",
      tierNormal: "Normal",
      tierElev: "Elevated",
      tierHigh: "High",
      btnSaveRecord: "Save to Tracker",
      btnOpenFull: "Full Entry Form",
      openFullLab: "Open Full Lab →",
      boltTitle: "Body Oxygen Level Test (BOLT)",
      boltDesc: "Exhale normally, pinch your nose, and start. Stop at the very first physical urge to breathe.",
      boltReadyTag: "Ready",
      boltRunningTag: "Timing...",
      btnBoltStart: "Start BOLT Test",
      btnBoltStop: "Stop Timer",
      btnSaveScore: "Save",
      bpmTitle: "Resting BPM Tap Counter",
      bpmDesc: "Tap once after each complete breath cycle (inhale + exhale). Computes BPM cleanly after 3+ taps.",
      bpmTapCount: "0 taps",
      btnTapBreath: "Tap on Breath",
      vaultTitle: "100% Local Storage Transparency & Backup",
      vaultDesc: "Zero bytes of personal health records or prescription scans leave your browser. Inspect your stored counts below:",
      storeVitals: "Vitals Records",
      storeTests: "BOLT / Breath Tests",
      storeVault: "OCR Vault Scans",
      storePad: "Digital Pad Records",
      backupHead: "Download JSON Snapshot",
      backupSub: "Export all vitals, breath tests, prescriptions, and profile preferences in one portable JSON file.",
      btnExportBackup: "Export Complete JSON Backup",
      btnManageProfile: "Profile & Data Manager",
      safeChecklistTag: "Safety & Readiness",
      safeChecklistTitle: "3 Golden Rules & Pre-Session Check",
      chk1: "Sit comfortably with an upright, relaxed spine",
      chk2: "Breathe gently through your nose without straining",
      chk3: "Practice at least 1.5–2 hours after heavy meals",
      chk4: "Return to normal breathing immediately if dizzy",
      precautionNote: "Avoid breath holds during pregnancy, acute asthma flares, recent surgery, or uncontrolled hypertension.",
      sosTag: "Emergency SOS Calm",
      sosTitle: "4-Step Panic & Anxiety Relief",
      btnSosPacer: "Launch 4-6 SOS Pacer",
      sosStep1: "1. Ground: Plant both feet firmly on the floor and drop your shoulders.",
      sosStep2: "2. Inhale (4s): Draw a calm, unforced breath through your nose.",
      sosStep3: "3. Slow Exhale (6s): Purse lips slightly and breathe out smoothly.",
      sosStep4: "4. Repeat: Continue this grounding cadence for 3–5 minutes.",
      hotlineWarn: "If experiencing chest pain, severe breathlessness, or BP > 180 mmHg, seek immediate emergency help:",
      tel999: "National Emergency 999",
      tel16263: "Health Hotline 16263"
    }
  };

  // ============================================================================
  // 3. UTILITIES & STORAGE HELPERS
  // ============================================================================
  function $(id) {
    return document.getElementById(id);
  }

  function getInitialLang() {
    try {
      return localStorage.getItem(KEYS.LANG) || localStorage.getItem("bw-lang") || "bn";
    } catch (_) {
      return "bn";
    }
  }

  function tr(key) {
    const dict = NX_T[currentLang] || NX_T.bn;
    return dict[key] !== undefined ? dict[key] : key;
  }

  function readJsonArray(primaryKey, fallbackKey) {
    try {
      const raw = localStorage.getItem(primaryKey) || (fallbackKey ? localStorage.getItem(fallbackKey) : null);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function readJsonObject(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function showToast(message, type = "success") {
    const stack = $("nxToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `nx-toast ${type}`;
    const iconCls = type === "error"
      ? "bi-exclamation-octagon-fill text-danger"
      : type === "warn"
        ? "bi-exclamation-triangle-fill text-warning"
        : "bi-check-circle-fill text-success";

    const icon = document.createElement("i");
    icon.className = `bi ${iconCls}`;
    const textSpan = document.createElement("span");
    textSpan.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(textSpan);
    stack.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3800);
  }

  // ============================================================================
  // 4. PROCEDURAL AUDIO & WEB SPEECH TTS ENGINE
  // ============================================================================
  function playChime(f1, f2) {
    if (!breathSoundOn || !hasUserGesture) return;
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + 0.38);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.1);
    } catch (_) {}
  }

  function speakPhase(text) {
    if (!breathTtsOn || !hasUserGesture) return;
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = currentLang === "bn" ? "bn-BD" : "en-US";
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  // ============================================================================
  // 5. BENTO LIVE RESPIRATION ENGINE
  // ============================================================================
  function initRespirationStudio() {
    const cadenceTabs = document.querySelectorAll(".nx-cadence-tab");
    const orbBtn = $("nxBreathOrb");
    const toggleBtn = $("nxBtnBreathToggle");
    const soundBtn = $("nxBtnSound");
    const ttsBtn = $("nxBtnTts");

    cadenceTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        hasUserGesture = true;
        const target = tab.getAttribute("data-cadence") || "box";
        switchCadence(target);
      });
    });

    function togglePlayState() {
      hasUserGesture = true;
      isBreathRunning = !isBreathRunning;
      syncPlayButtonUi();
      if (isBreathRunning) {
        phaseStartMs = performance.now();
        enterPhase("inhale");
        if (!breathRafId) breathRafId = requestAnimationFrame(tickBreathingLoop);
      }
    }

    toggleBtn?.addEventListener("click", togglePlayState);
    orbBtn?.addEventListener("click", togglePlayState);

    soundBtn?.addEventListener("click", () => {
      hasUserGesture = true;
      breathSoundOn = !breathSoundOn;
      soundBtn.classList.toggle("active", breathSoundOn);
      soundBtn.setAttribute("aria-pressed", breathSoundOn ? "true" : "false");
      const icon = $("nxSoundIcon");
      if (icon) icon.className = breathSoundOn ? "bi bi-volume-up-fill" : "bi bi-volume-mute-fill";
      if (breathSoundOn) playChime(528, 792);
    });

    ttsBtn?.addEventListener("click", () => {
      hasUserGesture = true;
      breathTtsOn = !breathTtsOn;
      ttsBtn.classList.toggle("active", breathTtsOn);
      ttsBtn.setAttribute("aria-pressed", breathTtsOn ? "true" : "false");
      const icon = $("nxTtsIcon");
      if (icon) icon.className = breathTtsOn ? "bi bi-megaphone-fill" : "bi bi-megaphone";
      showToast(
        currentLang === "bn"
          ? (breathTtsOn ? "ভয়েস গাইড চালু হয়েছে" : "ভয়েস গাইড বন্ধ হয়েছে")
          : (breathTtsOn ? "Voice coach enabled" : "Voice coach muted"),
        "info"
      );
    });

    phaseStartMs = performance.now();
    enterPhase("inhale");
    syncPlayButtonUi();
    breathRafId = requestAnimationFrame(tickBreathingLoop);
  }

  function switchCadence(cadenceId) {
    if (!CADENCES[cadenceId]) return;
    activeCadence = cadenceId;
    document.querySelectorAll(".nx-cadence-tab").forEach((tab) => {
      const isMatch = tab.getAttribute("data-cadence") === cadenceId;
      tab.classList.toggle("active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    const noteMap = {
      box: "noteBox",
      478: "note478",
      deep: "noteDeep",
      balance: "noteBalance"
    };
    const noteEl = $("nxProtocolNote");
    if (noteEl && noteMap[cadenceId]) {
      noteEl.setAttribute("data-nx-i18n", noteMap[cadenceId]);
      noteEl.textContent = tr(noteMap[cadenceId]);
    }

    breathPhase = "inhale";
    phaseStartMs = performance.now();
    const timerEl = $("nxPhaseTimer");
    const initDur = (CADENCES[cadenceId]?.inhale || 4);
    if (timerEl) timerEl.textContent = `${String(initDur).padStart(2, "0")}s`;
    const ring = $("nxRingProgress");
    if (ring) ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE.toFixed(2));
    enterPhase("inhale");
  }

  function syncPlayButtonUi() {
    const icon = $("nxPlayIcon");
    const txt = $("nxPlayText");
    if (icon) icon.className = isBreathRunning ? "bi bi-pause-fill" : "bi bi-play-fill";
    if (txt) {
      const k = isBreathRunning ? "btnPausePlay" : "btnResumePlay";
      txt.setAttribute("data-nx-i18n", k);
      txt.textContent = tr(k);
    }
  }

  function getPhaseLabelText(phase) {
    if (phase === "inhale") return tr("phaseInhale");
    if (phase === "hold1") return tr("phaseHold");
    if (phase === "exhale") return tr("phaseExhale");
    return tr("phaseRest");
  }

  function enterPhase(phase) {
    breathPhase = phase;
    phaseStartMs = performance.now();

    const orb = $("nxBreathOrb");
    const labelEl = $("nxPhaseLabel");
    if (orb) {
      orb.classList.remove("phase-inhale", "phase-hold1", "phase-exhale", "phase-hold2");
      orb.classList.add(`phase-${phase}`);
    }

    const txt = getPhaseLabelText(phase);
    if (labelEl) labelEl.textContent = txt;

    if (phase === "inhale") {
      playChime(528, 792);
      speakPhase(txt);
    } else if (phase === "exhale") {
      playChime(396, 594);
      speakPhase(txt);
    } else if (phase === "hold1") {
      speakPhase(txt);
    }
  }

  function getNextPhase(currentPhase, config) {
    if (currentPhase === "inhale") return config.hold1 > 0 ? "hold1" : "exhale";
    if (currentPhase === "hold1") return "exhale";
    if (currentPhase === "exhale") return config.hold2 > 0 ? "hold2" : "inhale";
    return "inhale";
  }

  function tickBreathingLoop(now) {
    if (isBreathRunning) {
      const config = CADENCES[activeCadence] || CADENCES.box;
      const durSec = config[breathPhase] || 4;
      const durMs = durSec * 1000;
      const elapsed = now - phaseStartMs;
      const progress = Math.min(1, Math.max(0, elapsed / durMs));
      const remSec = Math.max(1, Math.ceil((durMs - elapsed) / 1000));

      const timerEl = $("nxPhaseTimer");
      if (timerEl) timerEl.textContent = `${String(remSec).padStart(2, "0")}s`;

      const ring = $("nxRingProgress");
      if (ring) {
        ring.style.strokeDashoffset = String((RING_CIRCUMFERENCE * (1 - progress)).toFixed(2));
      }

      if (elapsed >= durMs) {
        const next = getNextPhase(breathPhase, config);
        if (next === "inhale") {
          cycleCount += 1;
          const cycEl = $("nxCycleCounter");
          if (cycEl) {
            cycEl.textContent = currentLang === "bn" ? `সাইকেল ${cycleCount}` : `Cycle ${cycleCount}`;
          }
        }
        enterPhase(next);
      }
    }
    breathRafId = requestAnimationFrame(tickBreathingLoop);
  }

  // ============================================================================
  // 6. CLINICAL EVALUATION ENGINES (AHA 2017 & ADA 2024)
  // ============================================================================
  function evaluateBP(sys, dia) {
    const isEn = currentLang === "en";
    if (sys > 180 || dia > 120) {
      return {
        tier: "high",
        badgeCls: "danger",
        icon: "bi-exclamation-triangle-fill",
        label: isEn ? "Hypertensive Crisis (>180/>120)" : "সংকটাপন্ন উচ্চ রক্তচাপ (Crisis)",
        advice: isEn ? "Emergency care recommended immediately." : "অবিলম্বে জরুরি চিকিৎসা সেবা গ্রহণ করুন।",
        pinPct: 94
      };
    }
    if (sys >= 140 || dia >= 90) {
      return {
        tier: "high",
        badgeCls: "danger",
        icon: "bi-exclamation-circle-fill",
        label: isEn ? "Hypertension Stage 2 (≥140/≥90)" : "উচ্চ রক্তচাপ স্টেজ-২",
        advice: isEn ? "Consult physician promptly for evaluation." : "চিকিৎসকের পরামর্শ নিয়ে নিয়মিত পর্যবেক্ষণ করুন।",
        pinPct: 84
      };
    }
    if (sys >= 130 || dia >= 80) {
      return {
        tier: "elevated",
        badgeCls: "warn",
        icon: "bi-exclamation-triangle-fill",
        label: isEn ? "Hypertension Stage 1 (130–139 / 80–89)" : "স্টেজ-১ হাইপারটেনশন",
        advice: isEn ? "Reduce sodium intake and increase walking." : "লবণ কমান ও নিয়মিত ৩০ মিনিট হাঁটুন।",
        pinPct: 68
      };
    }
    if (sys >= 120 && dia < 80) {
      return {
        tier: "elevated",
        badgeCls: "warn",
        icon: "bi-info-circle-fill",
        label: isEn ? "Elevated BP (120–129 / <80)" : "সামান্য বৃদ্ধি (Elevated)",
        advice: isEn ? "Monitor regularly and practice stress relief." : "নিয়মিত পর্যবেক্ষণ ও শ্বাস অনুশীলন বজায় রাখুন।",
        pinPct: 50
      };
    }
    if (sys < 90 || dia < 60) {
      return {
        tier: "low",
        badgeCls: "low",
        icon: "bi-arrow-down-circle-fill",
        label: isEn ? "Hypotension (<90/<60)" : "নিম্ন রক্তচাপ (Low BP)",
        advice: isEn ? "Hydrate with fluids and electrolytes." : "পর্যাপ্ত পানি ও ওরাল স্যালাইন পান করুন।",
        pinPct: 10
      };
    }
    return {
      tier: "normal",
      badgeCls: "optimal",
      icon: "bi-check-circle-fill",
      label: isEn ? "Optimal Normal (<120/<80)" : "সর্বোত্তম ও স্বাভাবিক (Optimal)",
      advice: isEn ? "Ideal cardiovascular range. Keep active." : "আদর্শ রক্তচাপ। সুষম খাদ্যাভ্যাস ও হাঁটা অব্যাহত রাখুন।",
      pinPct: 30
    };
  }

  function evaluateGlucose(valRaw, unit, timing) {
    const isEn = currentLang === "en";
    const mgdl = unit === "mmol" ? valRaw * 18.0182 : valRaw;
    const isFasting = timing === "fasting";

    if (mgdl < 70) {
      return {
        tier: "low",
        badgeCls: "low",
        icon: "bi-arrow-down-circle-fill",
        label: isEn ? "Hypoglycemia (<3.9 mmol/L)" : "হাইপোগ্লাইসেমিয়া (শর্করা কম)",
        advice: isEn ? "Consume 15g fast carbs immediately." : "দ্রুত ১৫ গ্রাম চিনি বা জুস গ্রহণ করুন (15-15 Rule)।",
        pinPct: 10
      };
    }
    const normalMax = isFasting ? 99.5 : 139.5;
    const preMax = isFasting ? 125.5 : 199.5;

    if (mgdl <= normalMax) {
      return {
        tier: "normal",
        badgeCls: "optimal",
        icon: "bi-check-circle-fill",
        label: isEn
          ? (isFasting ? "Normal Fasting (ADA)" : "Normal Post-meal (ADA)")
          : (isFasting ? "স্বাভাবিক খালি পেটে (ADA)" : "স্বাভাবিক ভরা পেটে (ADA)"),
        advice: isEn ? "Well-controlled glycemic levels." : "শর্করা আদর্শ নিয়ন্ত্রণে আছে।",
        pinPct: 30
      };
    }
    if (mgdl <= preMax) {
      return {
        tier: "elevated",
        badgeCls: "warn",
        icon: "bi-exclamation-triangle-fill",
        label: isEn ? "Pre-diabetes Range" : "প্রি-ডায়াবেটিস সীমা",
        advice: isEn ? "Limit refined sugar and add dietary fiber." : "চিনিযুক্ত খাবার পরিহার করুন ও আঁশযুক্ত খাবার বাড়ান।",
        pinPct: 55
      };
    }
    return {
      tier: "high",
      badgeCls: "danger",
      icon: "bi-exclamation-circle-fill",
      label: isEn ? "Diabetic Range (High)" : "ডায়াবেটিস সীমা (উচ্চ শর্করা)",
      advice: isEn ? "Seek clinical physician review & HbA1c test." : "চিকিৎসকের পরামর্শ ও নিয়মিত শর্করা মনিটরিং করুন।",
      pinPct: 86
    };
  }

  function setKpiBadge(el, badgeCls, iconCls, labelText) {
    if (!el) return;
    el.className = `nx-kpi-status ${badgeCls}`;
    el.textContent = "";
    const ic = document.createElement("i");
    ic.className = `bi ${iconCls}`;
    const sp = document.createElement("span");
    sp.textContent = labelText;
    el.appendChild(ic);
    el.appendChild(sp);
  }

  // ============================================================================
  // 7. REAL-TIME LOCAL TELEMETRY SYNC & SVG SPARKLINE
  // ============================================================================
  function syncRealTelemetry() {
    // 1. User Account Sync
    const activeUser = readJsonObject(KEYS.ACTIVE_USER);
    const profileLabel = $("nxProfileLabel");
    const profilePill = $("nxProfilePill");
    const welcomeHeading = $("nxWelcomeHeading");

    if (activeUser && activeUser.name) {
      const firstName = String(activeUser.name).trim().split(" ")[0];
      if (profileLabel) {
        profileLabel.textContent = currentLang === "bn" ? `প্রোফাইল (${firstName})` : `Profile (${firstName})`;
      }
      if (profilePill) profilePill.href = "profile.html";
      if (welcomeHeading) {
        welcomeHeading.textContent = tr("heroGreetingUser").replace("{name}", String(activeUser.name));
      }
    } else {
      if (profileLabel) {
        profileLabel.setAttribute("data-nx-i18n", "accountLogin");
        profileLabel.textContent = tr("accountLogin");
      }
      if (profilePill) profilePill.href = "login.html";
      if (welcomeHeading) welcomeHeading.textContent = tr("heroGreeting");
    }

    // 2. Vitals Telemetry Records
    const healthAll = readJsonArray(KEYS.HEALTH_V1, KEYS.HEALTH_LEGACY)
      .slice()
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const bpRecords = healthAll.filter((r) => r.type === "bp" || (r.systolic && r.diastolic) || (r.sys && r.dia));
    const bgRecords = healthAll.filter((r) => r.type === "bg" || r.value !== undefined || r.glucose !== undefined);

    const bpValEl = $("nxStatBpVal");
    const bpStatusEl = $("nxStatBpStatus");
    if (bpRecords.length > 0) {
      const topBp = bpRecords[0];
      const sys = Number(topBp.systolic || topBp.sys);
      const dia = Number(topBp.diastolic || topBp.dia);
      if (bpValEl) bpValEl.textContent = `${sys} / ${dia}`;
      const res = evaluateBP(sys, dia);
      setKpiBadge(bpStatusEl, res.badgeCls, res.icon, res.label);
    } else {
      if (bpValEl) bpValEl.textContent = "120 / 80";
      setKpiBadge(
        bpStatusEl,
        "optimal",
        "bi-check-circle-fill",
        currentLang === "bn" ? "স্বাভাবিক (AHA)" : "Optimal (AHA)"
      );
    }

    const bgValEl = $("nxStatBgVal");
    const bgStatusEl = $("nxStatBgStatus");
    if (bgRecords.length > 0) {
      const topBg = bgRecords[0];
      const rawVal = Number(topBg.value !== undefined ? topBg.value : topBg.glucose);
      const unit = topBg.unit === "mg/dL" ? "mgdl" : "mmol";
      const timing = topBg.timing || "fasting";
      if (bgValEl) bgValEl.textContent = unit === "mgdl" ? `${rawVal} mg/dL` : `${rawVal} mmol/L`;
      const res = evaluateGlucose(rawVal, unit, timing);
      setKpiBadge(bgStatusEl, res.badgeCls, res.icon, res.label);
    } else {
      if (bgValEl) bgValEl.textContent = "5.2 mmol/L";
      setKpiBadge(
        bgStatusEl,
        "optimal",
        "bi-check-circle-fill",
        currentLang === "bn" ? "স্বাভাবিক (ADA)" : "Normal (ADA)"
      );
    }

    // 3. Pulmonary Test History
    const testHistory = readJsonArray(KEYS.TEST_HISTORY, KEYS.BOLT_LEGACY);
    const boltTests = testHistory.filter((t) => t.type === "bolt" || t.bolt !== undefined || t.score !== undefined);
    const boltValEl = $("nxStatBoltVal");
    const boltStatusEl = $("nxStatBoltStatus");
    if (boltTests.length > 0) {
      const latest = boltTests[0];
      const sec = Number(latest.score !== undefined ? latest.score : (latest.bolt || latest.duration || 20));
      if (boltValEl) boltValEl.textContent = `${sec.toFixed(1)}s`;
      let cls = "optimal";
      let icon = "bi-wind";
      let label = currentLang === "bn" ? "ভালো ফিটনেস" : "Good Fitness";
      if (sec < 10) {
        cls = "danger";
        icon = "bi-exclamation-triangle-fill";
        label = currentLang === "bn" ? "দুর্বল (<১০s)" : "Poor (<10s)";
      } else if (sec < 20) {
        cls = "warn";
        icon = "bi-info-circle-fill";
        label = currentLang === "bn" ? "মধ্যম (১০-২০s)" : "Moderate (10-20s)";
      } else if (sec >= 30) {
        label = currentLang === "bn" ? "অ্যাথলেটিক (>৩০s)" : "Superior (>30s)";
      }
      setKpiBadge(boltStatusEl, cls, icon, label);
    } else {
      if (boltValEl) boltValEl.textContent = "24.0s";
      setKpiBadge(
        boltStatusEl,
        "optimal",
        "bi-wind",
        currentLang === "bn" ? "উত্তম ফিটনেস" : "Good Fitness"
      );
    }

    // 4. Prescription Counts
    const vaultRx = readJsonArray(KEYS.RX_VAULT);
    const padRx = readJsonArray(KEYS.RX_PAD);
    const rxIds = new Set([...vaultRx.map((r) => r.id), ...padRx.map((r) => r.id)]);
    const rxValEl = $("nxStatRxVal");
    const rxStatusEl = $("nxStatRxStatus");
    if (rxValEl) rxValEl.textContent = String(rxIds.size);
    setKpiBadge(
      rxStatusEl,
      "info",
      "bi-folder2-open",
      currentLang === "bn" ? "ভল্ট ও ডিজিটাল প্যাড" : "Vault & Digital Pad"
    );

    // 5. Storage Tab Breakdown
    if ($("nxStoreVitalsCount")) $("nxStoreVitalsCount").textContent = String(healthAll.length);
    if ($("nxStoreTestsCount")) $("nxStoreTestsCount").textContent = String(testHistory.length);
    if ($("nxStoreVaultCount")) $("nxStoreVaultCount").textContent = String(vaultRx.length);
    if ($("nxStorePadCount")) $("nxStorePadCount").textContent = String(padRx.length);

    // 6. SVG Systolic Sparkline
    renderSparkline(bpRecords);
  }

  function renderSparkline(bpRecords) {
    const lineEl = $("nxSparkLine");
    const areaEl = $("nxSparkArea");
    const metaEl = $("nxSparkMeta");
    if (!lineEl || !areaEl) return;

    let series = [];
    if (bpRecords.length >= 2) {
      series = bpRecords.slice(0, 8).reverse().map((r) => Number(r.systolic || r.sys || 120));
      if (metaEl) metaEl.textContent = tr("sparkLiveLabel").replace("{n}", String(bpRecords.length));
    } else {
      series = [118, 122, 119, 124, 120, 118];
      if (metaEl) metaEl.textContent = tr("sparkDemoLabel");
    }

    const W = 320;
    const H = 68;
    const minV = Math.min(85, ...series) - 5;
    const maxV = Math.max(150, ...series) + 5;
    const range = Math.max(10, maxV - minV);

    const pts = series.map((v, idx) => {
      const x = (idx / Math.max(1, series.length - 1)) * (W - 12) + 6;
      const y = H - 8 - ((v - minV) / range) * (H - 16);
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    });

    const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    const areaD = `${lineD} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;

    lineEl.setAttribute("d", lineD);
    areaEl.setAttribute("d", areaD);
  }

  // ============================================================================
  // 8. DIAGNOSTIC WORKBENCH (VITALS TRIAGE, BOLT/BPM, JSON BACKUP)
  // ============================================================================
  function initWorkbench() {
    // Workbench Top Tab Switcher
    const wbTabs = document.querySelectorAll(".nx-wb-tab");
    const wbPanels = document.querySelectorAll(".nx-wb-pane");
    wbTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-wb-target");
        wbTabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        wbPanels.forEach((p) => p.classList.add("d-none"));
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        if (target && $(target)) $(target).classList.remove("d-none");
      });
    });

    // Sub-mode BP vs BG
    const btnModeBp = $("nxWbModeBp");
    const btnModeBg = $("nxWbModeBg");
    const bpGroup = $("nxWbBpGroup");
    const bgGroup = $("nxWbBgGroup");

    btnModeBp?.addEventListener("click", () => {
      wbMode = "bp";
      wbPreset = "normal";
      btnModeBp.classList.add("active");
      btnModeBg?.classList.remove("active");
      bpGroup?.classList.remove("d-none");
      bgGroup?.classList.add("d-none");
      renderWorkbenchPresets();
      updateWorkbenchResult();
    });

    btnModeBg?.addEventListener("click", () => {
      wbMode = "bg";
      wbPreset = "normal";
      btnModeBg.classList.add("active");
      btnModeBp?.classList.remove("active");
      bgGroup?.classList.remove("d-none");
      bpGroup?.classList.add("d-none");
      renderWorkbenchPresets();
      updateWorkbenchResult();
    });

    // Timing & Unit Switches for Glucose
    document.querySelectorAll(".nx-timing-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".nx-timing-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        bgTiming = chip.getAttribute("data-timing") || "fasting";
        updateWorkbenchResult();
      });
    });

    document.querySelectorAll(".nx-unit-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const nextUnit = chip.getAttribute("data-unit") || "mmol";
        if (nextUnit === bgUnit) return;
        const slider = $("nxBgRange");
        if (slider) {
          const cur = Number(slider.value);
          if (nextUnit === "mgdl") {
            slider.min = "50";
            slider.max = "320";
            slider.step = "1";
            slider.value = String(Math.round(cur * 18.0182));
          } else {
            slider.min = "2.8";
            slider.max = "18.0";
            slider.step = "0.1";
            slider.value = (cur / 18.0182).toFixed(1);
          }
        }
        bgUnit = nextUnit;
        document.querySelectorAll(".nx-unit-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        renderWorkbenchPresets();
        updateWorkbenchResult();
      });
    });

    // Sliders & Steppers
    const sysR = $("nxSysRange");
    const diaR = $("nxDiaRange");
    const bgR = $("nxBgRange");

    const bindRange = (el) => el?.addEventListener("input", () => {
      wbPreset = null;
      renderWorkbenchPresets();
      updateWorkbenchResult();
    });
    bindRange(sysR);
    bindRange(diaR);
    bindRange(bgR);

    function stepRange(slider, delta) {
      if (!slider) return;
      const min = Number(slider.min);
      const max = Number(slider.max);
      const decimals = Number(slider.step) < 1 ? 1 : 0;
      const next = Math.min(max, Math.max(min, Number(slider.value) + delta));
      slider.value = next.toFixed(decimals);
      wbPreset = null;
      renderWorkbenchPresets();
      updateWorkbenchResult();
    }

    $("nxSysMinus")?.addEventListener("click", () => stepRange(sysR, -2));
    $("nxSysPlus")?.addEventListener("click", () => stepRange(sysR, 2));
    $("nxDiaMinus")?.addEventListener("click", () => stepRange(diaR, -2));
    $("nxDiaPlus")?.addEventListener("click", () => stepRange(diaR, 2));
    $("nxBgMinus")?.addEventListener("click", () => stepRange(bgR, bgUnit === "mmol" ? -0.2 : -5));
    $("nxBgPlus")?.addEventListener("click", () => stepRange(bgR, bgUnit === "mmol" ? 0.2 : 5));

    $("nxWbReset")?.addEventListener("click", () => {
      wbPreset = "normal";
      if (wbMode === "bp") {
        if (sysR) sysR.value = "120";
        if (diaR) diaR.value = "80";
      } else {
        if (bgR) bgR.value = bgUnit === "mmol" ? "5.2" : "95";
      }
      renderWorkbenchPresets();
      updateWorkbenchResult();
    });

    // Quick Save directly to Health Tracker Storage
    $("nxBtnQuickSaveVital")?.addEventListener("click", saveWorkbenchVitalRecord);

    // Pulmonary Self-Check (BOLT + BPM)
    initPulmonarySelfCheck();

    // JSON Backup Export
    $("nxBtnExportJson")?.addEventListener("click", exportJsonBackup);

    renderWorkbenchPresets();
    updateWorkbenchResult();
  }

  function renderWorkbenchPresets() {
    const container = $("nxWbPresets");
    if (!container) return;
    const isEn = currentLang === "en";

    let items = [];
    if (wbMode === "bp") {
      items = [
        { id: "normal", sys: 118, dia: 76, label: isEn ? "Optimal (118/76)" : "সর্বোত্তম (118/76)" },
        { id: "elevated", sys: 126, dia: 78, label: isEn ? "Elevated (126/78)" : "সামান্য বেশি (126/78)" },
        { id: "stage1", sys: 135, dia: 85, label: isEn ? "Stage 1 (135/85)" : "স্টেজ-১ (135/85)" },
        { id: "high", sys: 155, dia: 96, label: isEn ? "Stage 2 (155/96)" : "উচ্চ-২ (155/96)" },
        { id: "low", sys: 85, dia: 55, label: isEn ? "Low (85/55)" : "নিম্ন (85/55)" }
      ];
    } else {
      items = [
        { id: "normal", mmol: 5.2, mgdl: 94, label: isEn ? "Normal" : "স্বাভাবিক" },
        { id: "elevated", mmol: 6.4, mgdl: 115, label: isEn ? "Pre-diabetes" : "প্রি-ডায়াবেটিস" },
        { id: "high", mmol: 9.2, mgdl: 166, label: isEn ? "Diabetic" : "ডায়াবেটিস" },
        { id: "low", mmol: 3.3, mgdl: 60, label: isEn ? "Hypo" : "হাইপো" }
      ];
    }

    container.innerHTML = "";
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `nx-preset-pill ${wbPreset === item.id ? "active" : ""}`;
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        wbPreset = item.id;
        if (wbMode === "bp") {
          if ($("nxSysRange")) $("nxSysRange").value = String(item.sys);
          if ($("nxDiaRange")) $("nxDiaRange").value = String(item.dia);
        } else {
          if ($("nxBgRange")) $("nxBgRange").value = bgUnit === "mmol" ? String(item.mmol) : String(item.mgdl);
        }
        renderWorkbenchPresets();
        updateWorkbenchResult();
      });
      container.appendChild(btn);
    });
  }

  function updateWorkbenchResult() {
    const isEn = currentLang === "en";
    let res = null;

    if (wbMode === "bp") {
      const sys = Number($("nxSysRange")?.value || 120);
      const dia = Number($("nxDiaRange")?.value || 80);
      if ($("nxSysReadout")) $("nxSysReadout").textContent = `${sys} mmHg`;
      if ($("nxDiaReadout")) $("nxDiaReadout").textContent = `${dia} mmHg`;
      if ($("nxResultStandard")) $("nxResultStandard").textContent = isEn ? "AHA 2017 Clinical Criteria" : "AHA 2017 ক্লিনিক্যাল মানদণ্ড";
      if ($("nxResultNum")) $("nxResultNum").textContent = `${sys} / ${dia}`;
      if ($("nxResultUnit")) $("nxResultUnit").textContent = "mmHg";
      if ($("nxBtnOpenTrackerLink")) $("nxBtnOpenTrackerLink").href = `health-reading.html?sys=${sys}&dia=${dia}`;
      res = evaluateBP(sys, dia);
    } else {
      const val = Number($("nxBgRange")?.value || 5.2);
      const uStr = bgUnit === "mmol" ? "mmol/L" : "mg/dL";
      const valStr = bgUnit === "mmol" ? val.toFixed(1) : String(Math.round(val));
      if ($("nxBgReadout")) $("nxBgReadout").textContent = `${valStr} ${uStr}`;
      if ($("nxResultStandard")) $("nxResultStandard").textContent = isEn ? "ADA 2024 Glycemic Criteria" : "ADA 2024 গ্লাইসেমিক মানদণ্ড";
      if ($("nxResultNum")) $("nxResultNum").textContent = valStr;
      if ($("nxResultUnit")) $("nxResultUnit").textContent = uStr;
      if ($("nxBtnOpenTrackerLink")) $("nxBtnOpenTrackerLink").href = `health-reading.html?bg=${valStr}&timing=${bgTiming}`;
      res = evaluateGlucose(val, bgUnit, bgTiming);
    }

    if (res) {
      if ($("nxSpectrumPin")) $("nxSpectrumPin").style.left = `${res.pinPct}%`;
      if ($("nxStatusLabel")) $("nxStatusLabel").textContent = res.label;
      if ($("nxStatusAdvice")) $("nxStatusAdvice").textContent = res.advice;

      const banner = $("nxStatusBanner");
      if (banner) banner.className = `nx-status-banner ${res.tier} mb-3`;

      const stIcon = $("nxStatusIcon");
      if (stIcon) stIcon.className = `bi ${res.icon} fs-5`;

      const badgeIcon = $("nxRiskBadgeIcon");
      if (badgeIcon) {
        const iconEl = badgeIcon.querySelector("i");
        if (iconEl) iconEl.className = `bi ${res.icon}`;
      }
    }
  }

  function saveWorkbenchVitalRecord() {
    const existing = readJsonArray(KEYS.HEALTH_V1, KEYS.HEALTH_LEGACY);
    const nowIso = new Date().toISOString();

    if (wbMode === "bp") {
      const sys = parseInt($("nxSysRange")?.value || "120", 10);
      const dia = parseInt($("nxDiaRange")?.value || "80", 10);
      if (sys <= dia) {
        showToast(
          currentLang === "bn"
            ? "সিস্টোলিক রক্তচাপ ডায়াস্টোলিকের চেয়ে বড় হতে হবে"
            : "Systolic pressure must exceed Diastolic pressure",
          "error"
        );
        return;
      }
      existing.push({
        id: `bp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: "bp",
        age: null,
        systolic: sys,
        diastolic: dia,
        date: nowIso,
        notes: "Logged via BreatheWell Workspace"
      });
    } else {
      const raw = Number($("nxBgRange")?.value || 5.2);
      const mmolVal = bgUnit === "mgdl" ? Number((raw / 18.0182).toFixed(1)) : Number(raw.toFixed(1));
      existing.push({
        id: `bg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: "bg",
        value: mmolVal,
        unit: "mmol/L",
        timing: bgTiming,
        date: nowIso,
        notes: "Logged via BreatheWell Workspace"
      });
    }

    try {
      const serialized = JSON.stringify(existing);
      localStorage.setItem(KEYS.HEALTH_V1, serialized);
      localStorage.setItem(KEYS.HEALTH_LEGACY, serialized);
      syncRealTelemetry();
      showToast(
        currentLang === "bn" ? "রিডিং সফলভাবে হেলথ ট্র্যাকারে সংরক্ষিত হয়েছে!" : "Reading saved directly to Health Tracker!",
        "success"
      );
    } catch (_) {
      showToast(
        currentLang === "bn" ? "লোকাল স্টোরেজ সংরক্ষণে সমস্যা হয়েছে" : "Could not save to local storage",
        "error"
      );
    }
  }

  // ============================================================================
  // 9. PULMONARY QUICK CHECK (BOLT STOPWATCH & BPM TAP COUNTER)
  // ============================================================================
  function initPulmonarySelfCheck() {
    const boltToggle = $("nxBtnBoltToggle");
    const boltSave = $("nxBtnBoltSave");
    const boltTimerEl = $("nxBoltTimer");
    const boltTierEl = $("nxBoltTier");

    function updateBoltLoop() {
      if (!boltRunning) return;
      const elapsedSec = (performance.now() - boltStartMs) / 1000;
      if (boltTimerEl) boltTimerEl.textContent = `${elapsedSec.toFixed(1).padStart(4, "0")}s`;
      boltRafId = requestAnimationFrame(updateBoltLoop);
    }

    boltToggle?.addEventListener("click", () => {
      if (!boltRunning) {
        boltRunning = true;
        boltStartMs = performance.now();
        lastBoltSec = 0;
        if (boltSave) boltSave.disabled = true;
        boltToggle.textContent = tr("btnBoltStop");
        boltToggle.classList.replace("btn-teal", "btn-danger");
        if (boltTierEl) boltTierEl.textContent = tr("boltRunningTag");
        boltRafId = requestAnimationFrame(updateBoltLoop);
      } else {
        boltRunning = false;
        if (boltRafId) cancelAnimationFrame(boltRafId);
        lastBoltSec = Number(((performance.now() - boltStartMs) / 1000).toFixed(1));
        boltToggle.textContent = tr("btnBoltStart");
        boltToggle.classList.replace("btn-danger", "btn-teal");
        if (boltSave) boltSave.disabled = lastBoltSec < 1;

        if (boltTierEl) {
          if (lastBoltSec < 10) boltTierEl.textContent = currentLang === "bn" ? "কম (<১০s)" : "Poor (<10s)";
          else if (lastBoltSec < 20) boltTierEl.textContent = currentLang === "bn" ? "মধ্যম (১০-২০s)" : "Moderate";
          else if (lastBoltSec < 30) boltTierEl.textContent = currentLang === "bn" ? "উত্তম (২০-৩০s)" : "Good";
          else boltTierEl.textContent = currentLang === "bn" ? "চমৎকার (>৩০s)" : "Superior";
        }
      }
    });

    boltSave?.addEventListener("click", () => {
      if (lastBoltSec < 1) return;
      try {
        const hist = readJsonArray(KEYS.TEST_HISTORY, KEYS.BOLT_LEGACY);
        hist.unshift({
          id: `bolt_${Date.now()}`,
          type: "bolt",
          score: lastBoltSec,
          date: new Date().toISOString()
        });
        localStorage.setItem(KEYS.TEST_HISTORY, JSON.stringify(hist.slice(0, 20)));
        boltSave.disabled = true;
        syncRealTelemetry();
        showToast(
          currentLang === "bn" ? `BOLT স্কোর ${lastBoltSec}s সংরক্ষিত হয়েছে` : `BOLT score ${lastBoltSec}s saved`,
          "success"
        );
      } catch (_) {}
    });

    // BPM Tap Counter
    const bpmTapBtn = $("nxBtnBpmTap");
    const bpmResetBtn = $("nxBtnBpmReset");
    const bpmRateEl = $("nxBpmRate");
    const bpmStatusEl = $("nxBpmStatus");
    const bpmElapsedEl = $("nxBpmElapsed");

    bpmTapBtn?.addEventListener("click", () => {
      const now = Date.now();
      bpmTaps.push(now);
      if (bpmTaps.length === 1 && !bpmElapsedInterval) {
        bpmElapsedInterval = setInterval(() => {
          if (bpmTaps.length === 0) return;
          const sec = Math.floor((Date.now() - bpmTaps[0]) / 1000);
          if (bpmElapsedEl) bpmElapsedEl.textContent = `${sec}s`;
        }, 500);
      }

      if (bpmTaps.length >= 3) {
        const elapsedMin = Math.max(0.05, (now - bpmTaps[0]) / 60000);
        const bpm = Math.round((bpmTaps.length - 1) / elapsedMin);
        if (bpmRateEl) bpmRateEl.textContent = `${bpm} BPM`;
        if (bpmStatusEl) {
          if (bpm > 24) bpmStatusEl.textContent = currentLang === "bn" ? "দ্রুত শ্বাস (>২৪)" : "Elevated (>24)";
          else if (bpm >= 12) bpmStatusEl.textContent = currentLang === "bn" ? "স্বাভাবিক (১২-২৪)" : "Normal Adult";
          else bpmStatusEl.textContent = currentLang === "bn" ? "গভীর শান্ত শ্বাস" : "Deep Calm";
        }
      } else if (bpmStatusEl) {
        bpmStatusEl.textContent = currentLang === "bn" ? `${bpmTaps.length} ট্যাপ` : `${bpmTaps.length} taps`;
      }
    });

    bpmResetBtn?.addEventListener("click", () => {
      bpmTaps = [];
      if (bpmElapsedInterval) {
        clearInterval(bpmElapsedInterval);
        bpmElapsedInterval = null;
      }
      if (bpmRateEl) bpmRateEl.textContent = "-- BPM";
      if (bpmElapsedEl) bpmElapsedEl.textContent = "0s";
      if (bpmStatusEl) bpmStatusEl.textContent = tr("bpmTapCount");
    });
  }

  function exportJsonBackup() {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        platform: "BreatheWell v3",
        vitals: readJsonArray(KEYS.HEALTH_V1, KEYS.HEALTH_LEGACY),
        breathTests: readJsonArray(KEYS.TEST_HISTORY, KEYS.BOLT_LEGACY),
        prescriptionsVault: readJsonArray(KEYS.RX_VAULT),
        digitalPadPrescriptions: readJsonArray(KEYS.RX_PAD)
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `breathewell-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(
        currentLang === "bn" ? "JSON ব্যাকআপ ফাইল ডাউনলোড শুরু হয়েছে" : "JSON backup download started",
        "success"
      );
    } catch (_) {
      showToast(currentLang === "bn" ? "ব্যাকআপ তৈরি ব্যর্থ হয়েছে" : "Export failed", "error");
    }
  }

  function updateReadinessBadgeUi() {
    const checkboxes = document.querySelectorAll(".nx-readiness-cb");
    const badge = $("nxReadinessBadge");
    if (!badge) return;
    let checked = 0;
    checkboxes.forEach((cb) => { if (cb.checked) checked += 1; });
    badge.textContent = currentLang === "bn"
      ? `${checked}/৪ প্রস্তুত`
      : `${checked}/4 Ready`;
  }

  // ============================================================================
  // 10. SAFETY CHECKLIST & ONE-TAP SOS PACER
  // ============================================================================
  function initSafetyAndSos() {
    const checkboxes = document.querySelectorAll(".nx-readiness-cb");
    checkboxes.forEach((cb) => cb.addEventListener("change", updateReadinessBadgeUi));
    updateReadinessBadgeUi();

    $("nxBtnStartSos")?.addEventListener("click", () => {
      hasUserGesture = true;
      switchCadence("deep");
      isBreathRunning = true;
      syncPlayButtonUi();
      const stage = document.querySelector(".nx-bento-stage");
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      showToast(
        currentLang === "bn"
          ? "৪-২-৬ জরুরি প্রশান্তি পেসার সক্রিয় হয়েছে। ধীরে শ্বাস নিন।"
          : "4-2-6 Emergency calm pacer activated. Breathe smoothly.",
        "warn"
      );
    });
  }

  // ============================================================================
  // 11. TRANSLATION SYNCHRONIZATION
  // ============================================================================
  function applyAllTranslations() {
    document.documentElement.lang = currentLang;
    document.body?.classList.remove("bn", "en");
    document.body?.classList.add(currentLang);

    document.querySelectorAll("[data-nx-i18n]").forEach((el) => {
      const k = el.getAttribute("data-nx-i18n");
      if (k && NX_T[currentLang] && NX_T[currentLang][k] !== undefined) {
        el.textContent = tr(k);
      }
    });

    const cycEl = $("nxCycleCounter");
    if (cycEl) {
      cycEl.textContent = currentLang === "bn" ? `সাইকেল ${cycleCount}` : `Cycle ${cycleCount}`;
    }

    syncRealTelemetry();
    renderWorkbenchPresets();
    updateWorkbenchResult();
    syncPlayButtonUi();
    updateReadinessBadgeUi();
  }

  function initLocalizationListener() {
    applyAllTranslations();
    window.addEventListener("bwLanguageChanged", (e) => {
      const nextLang = e.detail?.lang;
      if (nextLang && (nextLang === "bn" || nextLang === "en")) {
        currentLang = nextLang;
        applyAllTranslations();
      }
    });
  }

  // ============================================================================
  // 12. BOOTSTRAP LIFECYCLE
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLocalizationListener();
    initRespirationStudio();
    initWorkbench();
    initSafetyAndSos();
  });
})();
