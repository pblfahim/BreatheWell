/**
 * ============================================================================
 * @file health-reading.js
 * @module BreatheWell/HealthReading
 * @description Health reading controller handling blood pressure and blood glucose input validation,
 *              live diagnostic spectrum meters compliant with AHA 2017 and ADA 2024 clinical standards,
 *              LocalStorage persistence, i18n localization (Bengali & English), and WhatsApp summary generation.
 * @author BreatheWell Development Team
 * @version 2.4.0
 * @license MIT
 * ============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. CONSTANTS, STORAGE KEYS & STATE INITIALIZATION
 * 2. INTERNATIONALIZATION (I18N) DICTIONARY (BN & EN)
 * 3. DATA LAYER (LOCALSTORAGE INTEROPERABILITY & SYNC)
 * 4. CLINICAL DIAGNOSTIC ALGORITHMS (AHA 2017 & ADA 2024)
 * 5. LIVE SPECTRUM METERS & READING PREVIEW CONTROLLERS
 * 6. PULL-UP STATS CALCULATION & CRISIS DETECTION
 * 7. ACCESSIBLE TOAST NOTIFICATIONS
 * 8. FORM SUBMISSION HANDLERS & INPUT VALIDATION
 * 9. ADAPTIVE FORM MODE SWITCHER (ALL / BP / BG)
 * 10. LANGUAGE TOGGLER & DOM SYNC
 * 11. BOOTSTRAP, EVENT LISTENERS & LIFECYCLE HOOKS
 * ============================================================================
 */

(function () {
  "use strict";

  /* ============================================================================
   * 1. CONSTANTS, STORAGE KEYS & STATE INITIALIZATION
   * ============================================================================
   */
  /** @const {string} HT_KEY_V1 - Primary LocalStorage key for normalized health records array */
  const HT_KEY_V1 = "bw_health_records_v1";

  /** @const {string} HT_KEY_LEGACY - Fallback LocalStorage key for backward compatibility */
  const HT_KEY_LEGACY = "bw_health_tracker_records";

  /** @const {string} HT_LANG_KEY - LocalStorage key storing user's selected language ('bn' | 'en') */
  const HT_LANG_KEY = "bw_ht_lang_v1";

  /** @type {string} hrLang - Active application language code */
  let hrLang = localStorage.getItem(HT_LANG_KEY) || localStorage.getItem("bw-lang") || "bn";

  /** @type {string} activeMode - Active form display layout: 'all' | 'bp' | 'bg' */
  let activeMode = "all";

  /** @type {string} activeArm - Currently selected arm for BP measurement: 'right' | 'left' */
  let activeArm = "right";

  /** @type {string} activeTiming - Timing context for blood glucose reading: 'fasting' | 'postmeal' | 'random' */
  let activeTiming = "fasting";

  /**
   * Helper utility for fast DOM element retrieval by ID.
   * @param {string} id - The DOM element ID.
   * @returns {HTMLElement|null} The DOM element or null if not found.
   */
  const $ = id => document.getElementById(id);

  /* ============================================================================
   * 2. INTERNATIONALIZATION (I18N) DICTIONARY (BN & EN)
   * ============================================================================
   * Bi-directional dictionary containing comprehensive clinical terminology,
   * accessibility labels, and interface strings.
   */
  const T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      heroBadge: "নতুন স্বাস্থ্য পরিমাপ অন্তর্ভুক্তি",
      heroTitle: "➕ নতুন রিডিং যোগ করুন",
      heroSub: "দৈনিক রক্তচাপ ও রক্তের গ্লুকোজ (সুগার) মান সহজে সংরক্ষণ করুন, লাইভ স্পেকট্রাম অ্যানালাইসিস এবং তাৎক্ষণিক চিকিৎসা নির্দেশিকা পান।",
      quickAdd: "➕ নতুন রিডিং",
      quickTrends: "📈 ট্রেন্ড চার্ট",
      quickLog: "📋 ইতিহাস লগ",
      quickDemo: "🧪 নমুনা ডেটা",
      btnViewLog: "📋 পূর্বের ইতিহাস দেখুন",
      statLatestBP: "সর্বশেষ রক্তচাপ",
      statLatestBG: "সর্বশেষ গ্লুকোজ",
      statToday: "আজকের রেকর্ড",
      statStreak: "ধারাবাহিক দিন",
      days: "দিন",
      todayLabel: "আজকে",
      streakLabel: "ধারাবাহিকতা",
      crisisTitle: "জরুরি স্বাস্থ্য সতর্কতা!",
      crisisSub: "আপনার সর্বশেষ রক্তচাপ বা সুগারের মাত্রা আশঙ্কাজনক সীমায় রয়েছে। অবিলম্বে শান্ত হয়ে বিশ্রাম নিন এবং প্রয়োজনে ডাক্তারের সাথে যোগাযোগ করুন।",
      modeAll: "উভয় একসাথে",
      modeBP: "রক্তচাপ",
      modeBG: "গ্লুকোজ",
      bpTitle: "রক্তচাপ এন্ট্রি",
      bpSub: "সিস্টোলিক / ডায়াস্টোলিক (mmHg)",
      bgTitle: "রক্তের গ্লুকোজ এন্ট্রি",
      bgSub: "ডায়াবেটিস পর্যবেক্ষণ (mmol/L)",
      lblSystolic: "সিস্টোলিক",
      lblDiastolic: "ডায়াস্টোলিক",
      lblGlucose: "গ্লুকোজ মান",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      gaugeTitleBP: "লাইভ রক্তচাপ স্পেকট্রাম নির্দেশক",
      gaugeTitleBG: "লাইভ গ্লুকোজ রেঞ্জ নির্দেশক",
      lblArm: "কোন হাত?",
      armRight: "💪 ডান হাত",
      armLeft: "💪 বাম হাত",
      lblTiming: "পরিমাপের সময়",
      timingFasting: "খালি পেটে",
      timingPostmeal: "খাবার ২ ঘণ্টা পর",
      timingRandom: "যেকোনো সময়",
      lblDate: "তারিখ ও সময়",
      lblNotes: "নোট (ঐচ্ছিক)",
      phNotesBP: "যেমন: বিশ্রামের পর, চা খাবার পর ইত্যাদি...",
      phNotesBG: "যেমন: মিষ্টি খাওয়ার পর, ইনসুলিনের আগে ইত্যাদি...",
      btnSaveBP: "রক্তচাপ সংরক্ষণ করুন",
      btnSaveBG: "গ্লুকোজ সংরক্ষণ করুন",
      waTitle: "পারিবারিক ও ডক্টর রিপোর্ট",
      waSub: "সংরক্ষিত সাম্প্রতিক রিডিং সরাসরি হোয়াটসঅ্যাপে আত্মীয় বা ডাক্তারকে পাঠান।",
      btnSendWA: "হোয়াটসঅ্যাপে শেয়ার করুন",
      footerTag: "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
      chipNormal: "✅ স্বাভাবিক",
      chipElevated: "⚠️ উচ্চতর",
      chipHigh: "🚨 উচ্চ রক্তচাপ",
      chipCrisis: "🛑 ক্রাইসিস",
      chipLow: "ℹ️ নিম্ন",
      chipPrediab: "⚠️ প্রি-ডায়াবেটিস",
      chipDiabetic: "🚨 ডায়াবেটিস",
      chipHypo: "⚠️ কম (হাইপো)",
      toastBPSaved: "✅ রক্তচাপ সফলভাবে সংরক্ষণ করা হয়েছে!",
      toastBGSaved: "✅ গ্লুকোজ সফলভাবে সংরক্ষণ করা হয়েছে!",
      toastEnterValidBP: "⚠️ অনুগ্রহ করে সঠিক সিস্টোলিক ও ডায়াস্টোলিক মান লিখুন।",
      toastEnterValidBG: "⚠️ অনুগ্রহ করে সঠিক গ্লুকোজ মান লিখুন (১.০ - ৩৫.০)।",
      toastInvalidSysDia: "⚠️ সিস্টোলিক মান অবশ্যই ডায়াস্টোলিক থেকে বেশি হতে হবে।"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      heroBadge: "Log New Clinical Measurement",
      heroTitle: "➕ Add Health Reading",
      heroSub: "Log daily blood pressure and blood glucose with real-time diagnostic spectrum meters and instant evidence-based guidelines.",
      quickAdd: "➕ Add Reading",
      quickTrends: "📈 Trends & Charts",
      quickLog: "📋 History Log",
      quickDemo: "🧪 Demo Lab",
      btnViewLog: "📋 View History Log",
      statLatestBP: "Latest Blood Pressure",
      statLatestBG: "Latest Glucose",
      statToday: "Logged Today",
      statStreak: "Logging Streak",
      days: "days",
      todayLabel: "Today",
      streakLabel: "Streak",
      crisisTitle: "Emergency Health Alert!",
      crisisSub: "Your latest blood pressure or blood glucose is in a critical range. Rest in a calm environment and consult a physician immediately if symptoms persist.",
      modeAll: "Both Together",
      modeBP: "Blood Pressure",
      modeBG: "Blood Glucose",
      bpTitle: "Blood Pressure Entry",
      bpSub: "Systolic / Diastolic (mmHg)",
      bgTitle: "Blood Glucose Entry",
      bgSub: "Glycemic Monitoring (mmol/L)",
      lblSystolic: "Systolic",
      lblDiastolic: "Diastolic",
      lblGlucose: "Glucose Level",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      gaugeTitleBP: "Live BP Diagnostic Spectrum",
      gaugeTitleBG: "Live Glycemic Range Meter",
      lblArm: "Which Arm?",
      armRight: "💪 Right Arm",
      armLeft: "💪 Left Arm",
      lblTiming: "Measurement Timing",
      timingFasting: "Fasting",
      timingPostmeal: "2h Post-Meal",
      timingRandom: "Random / Any Time",
      lblDate: "Date & Time",
      lblNotes: "Notes (Optional)",
      phNotesBP: "e.g., After 5 mins resting, after morning tea...",
      phNotesBG: "e.g., Before breakfast, 2 hrs after lunch...",
      btnSaveBP: "Save Blood Pressure",
      btnSaveBG: "Save Blood Glucose",
      waTitle: "Family & Physician WhatsApp Report",
      waSub: "Share your latest clinical vitals directly with family or your physician via WhatsApp.",
      btnSendWA: "Share via WhatsApp",
      footerTag: "Peace of mind in every breath",
      footerDisclaimer: "For wellness tracking only. Not a substitute for clinical diagnosis.",
      chipNormal: "✅ Normal",
      chipElevated: "⚠️ Elevated",
      chipHigh: "🚨 High BP",
      chipCrisis: "🛑 Crisis",
      chipLow: "ℹ️ Low",
      chipPrediab: "⚠️ Pre-diabetes",
      chipDiabetic: "🚨 Diabetic",
      chipHypo: "⚠️ Hypo (Low)",
      toastBPSaved: "✅ Blood pressure saved successfully!",
      toastBGSaved: "✅ Blood glucose saved successfully!",
      toastEnterValidBP: "⚠️ Please enter valid systolic and diastolic values.",
      toastEnterValidBG: "⚠️ Please enter a valid glucose value (1.0 - 35.0 mmol/L).",
      toastInvalidSysDia: "⚠️ Systolic value must be strictly greater than diastolic."
    }
  };

  /* ============================================================================
   * 3. DATA LAYER (LOCALSTORAGE INTEROPERABILITY & SYNC)
   * ============================================================================
   */
  /**
   * Retrieves and normalizes stored records across both current and legacy storage keys.
   * Sorts chronologically descending (newest record first).
   * @returns {Array<Object>} Sorted array of health record objects.
   */
  function loadRecords() {
    try {
      const rawV1 = localStorage.getItem(HT_KEY_V1);
      const rawLegacy = localStorage.getItem(HT_KEY_LEGACY);
      const raw = rawV1 || rawLegacy || "[]";
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];

      // Normalize schema variations (legacy sys/dia -> systolic/diastolic)
      data.forEach(r => {
        if (r.type === "bp") {
          if (r.sys && !r.systolic) r.systolic = Number(r.sys);
          if (r.dia && !r.diastolic) r.diastolic = Number(r.dia);
        }
      });
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      return data;
    } catch {
      return [];
    }
  }

  /**
   * Persists health records atomically to both primary and legacy LocalStorage keys.
   * @param {Array<Object>} data - The records array to serialize and store.
   */
  function saveRecords(data) {
    try {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const str = JSON.stringify(data);
      localStorage.setItem(HT_KEY_V1, str);
      localStorage.setItem(HT_KEY_LEGACY, str);
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }

  /**
   * Formats a Date object into an ISO-like string suitable for `<input type="datetime-local">`.
   * @param {Date} [date] - Target date or defaults to current moment.
   * @returns {string} Formatted string "YYYY-MM-DDTHH:mm".
   */
  function formatLocalIso(date) {
    const d = date || new Date();
    const off = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - off).toISOString().slice(0, 16);
  }

  /* ============================================================================
   * 4. CLINICAL DIAGNOSTIC ALGORITHMS (AHA 2017 & ADA 2024)
   * ============================================================================
   */
  /**
   * Classifies Blood Pressure readings according to the 2017 ACC/AHA Guideline.
   *
   * Thresholds:
   * - Hypertensive Crisis: Systolic > 180 mmHg and/or Diastolic > 120 mmHg
   * - Stage 2 Hypertension: Systolic >= 140 mmHg and/or Diastolic >= 90 mmHg
   * - Stage 1 Hypertension: Systolic 130-139 mmHg or Diastolic 80-89 mmHg
   * - Elevated BP: Systolic 120-129 mmHg and Diastolic < 80 mmHg
   * - Normal BP: Systolic 90-119 mmHg and Diastolic 60-79 mmHg
   * - Hypotension: Systolic < 90 mmHg or Diastolic < 60 mmHg
   *
   * @param {number} sys - Systolic blood pressure (mmHg).
   * @param {number} dia - Diastolic blood pressure (mmHg).
   * @returns {{category: string, pct: number, chip: string, cls: string}} Classification metadata.
   */
  function classifyBP(sys, dia) {
    if (sys > 180 || dia > 120) {
      return { category: "crisis", pct: 95, chip: T[hrLang].chipCrisis, cls: "danger" };
    }
    if (sys >= 140 || dia >= 90) {
      return { category: "high2", pct: 80, chip: T[hrLang].chipHigh, cls: "danger" };
    }
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return { category: "high1", pct: 62, chip: T[hrLang].chipHigh, cls: "danger" };
    }
    if (sys >= 120 && sys <= 129 && dia < 80) {
      return { category: "elevated", pct: 45, chip: T[hrLang].chipElevated, cls: "elevated" };
    }
    if (sys >= 90 && sys <= 119 && dia >= 60 && dia <= 79) {
      return { category: "normal", pct: 28, chip: T[hrLang].chipNormal, cls: "normal" };
    }
    if (sys < 90 || dia < 60) {
      return { category: "low", pct: 8, chip: T[hrLang].chipLow, cls: "neutral" };
    }
    return { category: "normal", pct: 28, chip: T[hrLang].chipNormal, cls: "normal" };
  }

  /**
   * Classifies Blood Glucose readings according to ADA Standards of Care 2024.
   *
   * Fasting targets:
   * - Hypoglycemia: < 4.0 mmol/L
   * - Normal: 4.0 - 5.5 mmol/L
   * - Pre-diabetes: 5.6 - 6.9 mmol/L
   * - Diabetes: >= 7.0 mmol/L
   *
   * Post-prandial (2-hour) / Random targets:
   * - Hypoglycemia: < 4.0 mmol/L
   * - Normal: <= 7.7 mmol/L
   * - Pre-diabetes: 7.8 - 11.0 mmol/L
   * - Diabetes: > 11.0 mmol/L
   *
   * @param {number|string} val - Blood glucose in mmol/L.
   * @param {string} [timing] - 'fasting' | 'postmeal' | 'random'.
   * @returns {{category: string, pct: number, chip: string, cls: string}} Classification metadata.
   */
  function classifyBG(val, timing) {
    const v = parseFloat(val);
    const t = timing || activeTiming;
    if (isNaN(v)) return { category: "normal", pct: 30, chip: T[hrLang].chipNormal, cls: "normal" };

    if (t === "fasting") {
      if (v < 4.0) return { category: "hypo", pct: 8, chip: T[hrLang].chipHypo, cls: "neutral" };
      if (v <= 5.5) return { category: "normal", pct: 30, chip: T[hrLang].chipNormal, cls: "normal" };
      if (v <= 6.9) return { category: "prediab", pct: 60, chip: T[hrLang].chipPrediab, cls: "elevated" };
      return { category: "diabetic", pct: 90, chip: T[hrLang].chipDiabetic, cls: "danger" };
    } else {
      if (v < 4.0) return { category: "hypo", pct: 8, chip: T[hrLang].chipHypo, cls: "neutral" };
      if (v <= 7.7) return { category: "normal", pct: 35, chip: T[hrLang].chipNormal, cls: "normal" };
      if (v <= 11.0) return { category: "prediab", pct: 65, chip: T[hrLang].chipPrediab, cls: "elevated" };
      return { category: "diabetic", pct: 92, chip: T[hrLang].chipDiabetic, cls: "danger" };
    }
  }

  /**
   * Generates localized clinical guidance commentary for blood pressure.
   * @param {string} cat - Classification category key.
   * @returns {string} Localized advice narrative.
   */
  function getBPAdvice(cat) {
    if (hrLang === "en") {
      switch (cat) {
        case "normal": return "✅ Excellent! Blood pressure is within optimal healthy range (AHA 2017). Continue a balanced diet and regular exercise.";
        case "elevated": return "⚠️ Elevated range. Recommend reducing sodium intake, managing stress, and gentle daily walking.";
        case "high1": return "🚨 Stage 1 Hypertension. Regular monitoring recommended. Consult physician regarding lifestyle or medication.";
        case "high2": return "🚨 Stage 2 Hypertension. Blood pressure is significantly elevated. Physician consultation required.";
        case "crisis": return "🛑 Hypertensive Crisis. Rest in a calm environment for 5 mins. If it remains high, seek immediate emergency care!";
        case "low": return "ℹ️ Low blood pressure (Hypotension). Ensure adequate hydration and electrolytes. Consult doctor if feeling dizzy.";
        default: return "Enter systolic and diastolic values to view live clinical guidance.";
      }
    } else {
      switch (cat) {
        case "normal": return "✅ চমৎকার! রক্তচাপ সম্পূর্ণ স্বাভাবিক সীমায় রয়েছে (AHA 2017)। সুষম খাবার ও নিয়মিত হাঁটাচলা বজায় রাখুন।";
        case "elevated": return "⚠️ রক্তচাপ কিছুটা উচ্চতর। লবণের পরিমাণ কমান, পর্যাপ্ত পানি পান করুন এবং মানসিক চাপমুক্ত থাকুন।";
        case "high1": return "🚨 স্টেজ-১ উচ্চ রক্তচাপ। নিয়মিত ট্র্যাকিং করুন এবং চিকিৎসকের সাথে জীবনযাত্রা বা ওষুধ নিয়ে পরামর্শ করুন।";
        case "high2": return "🚨 স্টেজ-২ উচ্চ রক্তচাপ। রক্তচাপ বিপজ্জনক মাত্রায় উন্নীত। দ্রুত চিকিৎসকের পরামর্শ গ্রহণ করুন।";
        case "crisis": return "🛑 জরুরি ক্রাইসিস মাত্রা! অবিলম্বে শান্ত হয়ে শুয়ে থাকুন। ৫ মিনিট পরও একই থাকলে জরুরি হাসপাতালে যোগাযোগ করুন!";
        case "low": return "ℹ️ নিম্ন রক্তচাপ (হাইপোটেনশন)। পর্যাপ্ত পানি ও স্যালাইন পান করুন। মাথা ঘোরানো থাকলে ডাক্তারের পরামর্শ নিন।";
        default: return "সিস্টোলিক ও ডায়াস্টোলিক মান লিখলে লাইভ স্বাস্থ্য নির্দেশক ও পরামর্শ দেখতে পাবেন।";
      }
    }
  }

  /**
   * Generates localized clinical guidance commentary for blood glucose.
   * @param {string} cat - Classification category key.
   * @param {string} timing - Measurement timing mode.
   * @returns {string} Localized advice narrative.
   */
  function getBGAdvice(cat, timing) {
    if (hrLang === "en") {
      switch (cat) {
        case "normal": return `✅ Healthy glucose control (${timing}). Within ADA 2024 target range. Keep up healthy eating habits.`;
        case "prediab": return `⚠️ Pre-diabetic range (${timing}). Consider reducing refined sugars and simple carbs; increase fiber and daily movement.`;
        case "diabetic": return `🚨 Elevated diabetic range (${timing}). Take prescribed medications on time and review diet with your doctor.`;
        case "hypo": return "⚠️ Hypoglycemia (Low blood sugar). Consume 15g fast-acting carbs (juice, honey) and re-check in 15 minutes.";
        default: return "Enter glucose level to inspect real-time clinical diagnostics.";
      }
    } else {
      switch (cat) {
        case "normal": return `✅ চমৎকার ডায়াবেটিস নিয়ন্ত্রণ (${timing === "fasting" ? "খালি পেটে" : "খাবার পর"})। ADA 2024 টার্গেটের মধ্যে রয়েছে।`;
        case "prediab": return `⚠️ প্রি-ডায়াবেটিস মাত্রা (${timing === "fasting" ? "খালি পেটে" : "খাবার পর"})। মিষ্টি ও কোমল পানীয় এড়িয়ে চলুন, আঁশযুক্ত খাবার বাড়ান।`;
        case "diabetic": return `🚨 ডায়াবেটিস মাত্রা (${timing === "fasting" ? "খালি পেটে" : "খাবার পর"})। সময়মতো ওষুধ বা ইনসুলিন নিন এবং চিকিৎসকের পরামর্শ গ্রহণ করুন।`;
        case "hypo": return "⚠️ হাইপোগ্লাইসেমিয়া (রক্তে সুগার কমে গেছে)! দ্রুত মিষ্টি শরবত, গ্লুকোজ বা ৩-৪টি মিষ্টি বিস্কুট গ্রহণ করুন।";
        default: return "গ্লুকোজ মান লিখলে লাইভ ডায়াবেটিস রেঞ্জ ও ডায়াগনস্টিক দেখতে পাবেন।";
      }
    }
  }

  /* ============================================================================
   * 5. LIVE SPECTRUM METERS & READING PREVIEW CONTROLLERS
   * ============================================================================
   */
  /**
   * Dynamically repositions the Blood Pressure spectrum meter pointer,
   * updates status chips, diagnostic advice card, and preview banner.
   */
  function updateBPMeter() {
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    if (!sysEl || !diaEl) return;

    const sys = parseInt(sysEl.value, 10);
    const dia = parseInt(diaEl.value, 10);

    const pointer = $("bpGaugePointer");
    const badge = $("bpPointerBadge");
    const chip = $("bpLiveChip");
    const advice = $("bpAdviceBox");
    const preview = $("bpPreviewWrap");

    if (isNaN(sys) || isNaN(dia)) {
      if (pointer) pointer.style.left = "32%";
      if (badge) badge.textContent = "120/80";
      if (chip) {
        chip.className = "ht-status-chip normal ms-auto";
        chip.textContent = T[hrLang].chipNormal;
      }
      if (advice) advice.innerHTML = `<span class="text-muted">${getBPAdvice("")}</span>`;
      if (preview) preview.innerHTML = "";
      return;
    }

    const { category, pct, chip: chipTxt, cls } = classifyBP(sys, dia);

    if (pointer) pointer.style.left = `${pct}%`;
    if (badge) badge.textContent = `${sys}/${dia}`;
    if (chip) {
      chip.className = `ht-status-chip ${cls} ms-auto`;
      chip.textContent = chipTxt;
    }
    if (advice) {
      advice.innerHTML = `<span class="text-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')} fw-bold">${getBPAdvice(category)}</span>`;
    }
    if (preview) {
      preview.innerHTML = `
        <div class="ht-reading-preview alert alert-light border mt-3 mb-0 p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">${sys}/${dia} mmHg</div>
            <div class="small text-muted">${activeArm === "right" ? T[hrLang].armRight : T[hrLang].armLeft}</div>
          </div>
          <span class="badge bg-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')}-subtle text-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')} px-3 py-2 rounded-pill fw-bold">${chipTxt}</span>
        </div>
      `;
    }
  }

  /**
   * Dynamically repositions the Blood Glucose range meter pointer,
   * performs mmol/L to mg/dL conversion, updates status chips and guidance.
   */
  function updateBGMeter() {
    const valEl = $("bgValue");
    if (!valEl) return;

    const val = parseFloat(valEl.value);
    const pointer = $("bgGaugePointer");
    const badge = $("bgPointerBadge");
    const chip = $("bgLiveChip");
    const advice = $("bgAdviceBox");
    const preview = $("bgPreviewWrap");
    const mgdlDisplay = $("bgMgdlDisplay");

    if (isNaN(val)) {
      if (pointer) pointer.style.left = "35%";
      if (badge) badge.textContent = "5.6";
      if (chip) {
        chip.className = "ht-status-chip normal ms-auto";
        chip.textContent = T[hrLang].chipNormal;
      }
      if (advice) advice.innerHTML = `<span class="text-muted">${getBGAdvice("", activeTiming)}</span>`;
      if (mgdlDisplay) mgdlDisplay.textContent = "—";
      if (preview) preview.innerHTML = "";
      return;
    }

    // Standard clinical conversion: 1 mmol/L = 18.0182 mg/dL
    const mgdl = Math.round(val * 18.0182);
    if (mgdlDisplay) mgdlDisplay.textContent = `${mgdl} mg/dL`;

    const { category, pct, chip: chipTxt, cls } = classifyBG(val, activeTiming);

    if (pointer) pointer.style.left = `${pct}%`;
    if (badge) badge.textContent = val.toFixed(1);
    if (chip) {
      chip.className = `ht-status-chip ${cls} ms-auto`;
      chip.textContent = chipTxt;
    }
    if (advice) {
      advice.innerHTML = `<span class="text-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')} fw-bold">${getBGAdvice(category, activeTiming)}</span>`;
    }
    if (preview) {
      preview.innerHTML = `
        <div class="ht-reading-preview alert alert-light border mt-3 mb-0 p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">${val.toFixed(1)} mmol/L (${mgdl} mg/dL)</div>
            <div class="small text-muted">${activeTiming === "fasting" ? T[hrLang].timingFasting : (activeTiming === "postmeal" ? T[hrLang].timingPostmeal : T[hrLang].timingRandom)}</div>
          </div>
          <span class="badge bg-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')}-subtle text-${cls === 'normal' ? 'success' : (cls === 'elevated' ? 'warning' : 'danger')} px-3 py-2 rounded-pill fw-bold">${chipTxt}</span>
        </div>
      `;
    }
  }

  /* ============================================================================
   * 6. PULL-UP STATS CALCULATION & CRISIS DETECTION
   * ============================================================================
   */
  /**
   * Evaluates all historical records to populate the four pull-up metric cards:
   * 1. Latest Blood Pressure (value, badge, timestamp)
   * 2. Latest Blood Glucose (value, badge, timestamp)
   * 3. Today's Total Readings
   * 4. Consecutive Logging Streak (distinct calendar days)
   * Also toggles the emergency hypertensive/hypoglycemic crisis alert banner.
   */
  function renderStats() {
    const records = loadRecords();
    let latestBP = null;
    let latestBG = null;
    const todayIso = new Date().toDateString();
    let todayCount = 0;
    const uniqueDays = new Set();

    records.forEach(r => {
      const d = new Date(r.date);
      if (d.toDateString() === todayIso) todayCount++;
      uniqueDays.add(d.toDateString());

      if (r.type === "bp" && !latestBP) latestBP = r;
      if (r.type === "bg" && !latestBG) latestBG = r;
    });

    // 1. Latest BP
    const bpVal = $("statBPVal");
    const bpBadge = $("statBPBadge");
    const bpSub = $("statBPSub");
    if (latestBP) {
      if (bpVal) bpVal.textContent = `${latestBP.systolic}/${latestBP.diastolic}`;
      const { category, chip } = classifyBP(latestBP.systolic, latestBP.diastolic);
      if (bpBadge) {
        bpBadge.textContent = chip;
        bpBadge.className = `ht-stat-badge ${category === 'normal' ? 'normal' : (category === 'elevated' ? 'elevated' : 'critical')}`;
      }
      if (bpSub) bpSub.textContent = new Date(latestBP.date).toLocaleDateString(hrLang === "en" ? "en-US" : "bn-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } else {
      if (bpVal) bpVal.textContent = "—";
      if (bpBadge) { bpBadge.textContent = "—"; bpBadge.className = "ht-stat-badge neutral"; }
      if (bpSub) bpSub.textContent = hrLang === "en" ? "No records" : "কোনো রেকর্ড নেই";
    }

    // 2. Latest BG
    const bgVal = $("statBGVal");
    const bgBadge = $("statBGBadge");
    const bgSub = $("statBGSub");
    if (latestBG) {
      if (bgVal) bgVal.textContent = `${parseFloat(latestBG.value).toFixed(1)} mmol/L`;
      const { category, chip } = classifyBG(latestBG.value, latestBG.timing || "fasting");
      if (bgBadge) {
        bgBadge.textContent = chip;
        bgBadge.className = `ht-stat-badge ${category === 'normal' ? 'normal' : (category === 'prediab' ? 'elevated' : 'critical')}`;
      }
      if (bgSub) bgSub.textContent = new Date(latestBG.date).toLocaleDateString(hrLang === "en" ? "en-US" : "bn-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } else {
      if (bgVal) bgVal.textContent = "—";
      if (bgBadge) { bgBadge.textContent = "—"; bgBadge.className = "ht-stat-badge neutral"; }
      if (bgSub) bgSub.textContent = hrLang === "en" ? "No records" : "কোনো রেকর্ড নেই";
    }

    // 3. Today Count
    const todayVal = $("statTodayVal");
    const todaySub = $("statTodaySub");
    if (todayVal) todayVal.textContent = String(todayCount);
    if (todaySub) todaySub.textContent = `${todayCount} ${T[hrLang].todayLabel}`;

    // 4. Streak
    const streakVal = $("statStreakVal");
    if (streakVal) streakVal.textContent = String(uniqueDays.size);

    // Crisis Banner Check
    const crisisBanner = $("crisisAlertBanner");
    let isCrisis = false;
    if (latestBP && (latestBP.systolic > 180 || latestBP.diastolic > 120)) isCrisis = true;
    if (latestBG && (latestBG.value > 16.5 || latestBG.value < 3.0)) isCrisis = true;

    if (crisisBanner) {
      if (isCrisis) crisisBanner.classList.remove("d-none");
      else crisisBanner.classList.add("d-none");
    }

    // Update WhatsApp summary
    updateWAPreview(latestBP, latestBG);
  }

  /**
   * Generates a pre-filled WhatsApp report string and binds it to the dispatch button.
   * @param {Object|null} latestBP - Latest Blood Pressure record.
   * @param {Object|null} latestBG - Latest Blood Glucose record.
   */
  function updateWAPreview(latestBP, latestBG) {
    const waTextEl = $("waPreviewText");
    const waBtn = $("btnSendWA");
    if (!waTextEl || !waBtn) return;

    let msg = "";
    if (hrLang === "en") {
      msg = `*BreatheWell Health Report*\nDate: ${new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}\n\n`;
      if (latestBP) {
        msg += `❤️ Blood Pressure: ${latestBP.systolic}/${latestBP.diastolic} mmHg (${latestBP.arm === "right" ? "Right Arm" : "Left Arm"})\n`;
      }
      if (latestBG) {
        msg += `🩸 Blood Glucose: ${parseFloat(latestBG.value).toFixed(1)} mmol/L (${latestBG.timing || "Fasting"})\n`;
      }
      msg += `\nTracked securely via BreatheWell Digital Health.`;
    } else {
      msg = `*BreatheWell স্বাস্থ্য রিপোর্ট*\nতারিখ: ${new Date().toLocaleDateString("bn-BD", { dateStyle: "medium" })}\n\n`;
      if (latestBP) {
        msg += `❤️ রক্তচাপ: ${latestBP.systolic}/${latestBP.diastolic} mmHg (${latestBP.arm === "right" ? "ডান হাত" : "বাম হাত"})\n`;
      }
      if (latestBG) {
        msg += `🩸 গ্লুকোজ: ${parseFloat(latestBG.value).toFixed(1)} mmol/L (${latestBG.timing === "fasting" ? "খালি পেটে" : (latestBG.timing === "postmeal" ? "খাবার পর" : "যেকোনো সময়")})\n`;
      }
      msg += `\nBreatheWell ডিজিটাল স্বাস্থ্য ট্র্যাকারের মাধ্যমে সংরক্ষিত।`;
    }

    waTextEl.textContent = msg;
    waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  }

  /* ============================================================================
   * 7. ACCESSIBLE TOAST NOTIFICATIONS
   * ============================================================================
   */
  /**
   * Displays an accessible floating toast message with automatic dismissal.
   * @param {string} msg - Message to display.
   * @param {"success"|"warning"|"danger"} [type="success"] - Notification style.
   */
  function showToast(msg, type = "success") {
    let stack = $("hrToastStack") || $("arToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "hrToastStack";
      stack.className = "hr-toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `hr-toast ${type}`;
    toast.textContent = msg;
    stack.appendChild(toast);

    setTimeout(() => {
      if (toast.remove) {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3800);
  }

  /* ============================================================================
   * 8. FORM SUBMISSION HANDLERS & INPUT VALIDATION
   * ============================================================================
   */
  /**
   * Validates and commits a Blood Pressure entry to LocalStorage.
   * @param {Event} e - Form submission event.
   */
  function handleBPSubmit(e) {
    e.preventDefault();
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    const dateEl = $("bpDate");
    const notesEl = $("bpNotes");

    if (!sysEl || !diaEl) return;

    const sys = parseInt(sysEl.value, 10);
    const dia = parseInt(diaEl.value, 10);

    if (isNaN(sys) || isNaN(dia) || sys < 50 || dia < 30) {
      showToast(T[hrLang].toastEnterValidBP, "warning");
      return;
    }

    if (sys <= dia) {
      showToast(T[hrLang].toastInvalidSysDia, "danger");
      return;
    }

    const record = {
      id: "bp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      type: "bp",
      systolic: sys,
      diastolic: dia,
      arm: activeArm,
      date: dateEl && dateEl.value ? new Date(dateEl.value).toISOString() : new Date().toISOString(),
      notes: notesEl ? notesEl.value.trim() : ""
    };

    const records = loadRecords();
    records.push(record);
    saveRecords(records);

    showToast(T[hrLang].toastBPSaved, "success");
    renderStats();

    // Reset inputs, re-init datetime
    sysEl.value = "";
    diaEl.value = "";
    if (notesEl) notesEl.value = "";
    if (dateEl) dateEl.value = formatLocalIso();
    updateBPMeter();
  }

  /**
   * Validates and commits a Blood Glucose entry to LocalStorage.
   * @param {Event} e - Form submission event.
   */
  function handleBGSubmit(e) {
    e.preventDefault();
    const valEl = $("bgValue");
    const dateEl = $("bgDate");
    const notesEl = $("bgNotes");

    if (!valEl) return;

    const val = parseFloat(valEl.value);
    if (isNaN(val) || val < 1.0 || val > 35.0) {
      showToast(T[hrLang].toastEnterValidBG, "warning");
      return;
    }

    const record = {
      id: "bg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      type: "bg",
      value: parseFloat(val.toFixed(1)),
      unit: "mmol/L",
      timing: activeTiming,
      date: dateEl && dateEl.value ? new Date(dateEl.value).toISOString() : new Date().toISOString(),
      notes: notesEl ? notesEl.value.trim() : ""
    };

    const records = loadRecords();
    records.push(record);
    saveRecords(records);

    showToast(T[hrLang].toastBGSaved, "success");
    renderStats();

    // Reset inputs, re-init datetime
    valEl.value = "";
    if (notesEl) notesEl.value = "";
    if (dateEl) dateEl.value = formatLocalIso();
    updateBGMeter();
  }

  /* ============================================================================
   * 9. ADAPTIVE FORM MODE SWITCHER (ALL / BP / BG)
   * ============================================================================
   */
  /**
   * Switches active form view mode between 'all' (split columns), 'bp' (centered single), and 'bg' (centered single).
   * @param {"all"|"bp"|"bg"} mode - Selected layout mode.
   */
  function setFormMode(mode) {
    activeMode = mode;
    const colBP = $("colBPForm");
    const colBG = $("colBGForm");
    const buttons = document.querySelectorAll(".ht-mode-btn");

    buttons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-mode") === mode);
    });

    if (mode === "all") {
      if (colBP) {
        colBP.classList.remove("d-none", "col-lg-8", "mx-auto");
        colBP.classList.add("col-lg-6");
      }
      if (colBG) {
        colBG.classList.remove("d-none", "col-lg-8", "mx-auto");
        colBG.classList.add("col-lg-6");
      }
    } else if (mode === "bp") {
      if (colBP) {
        colBP.classList.remove("d-none", "col-lg-6");
        colBP.classList.add("col-lg-8", "mx-auto");
      }
      if (colBG) colBG.classList.add("d-none");
    } else if (mode === "bg") {
      if (colBG) {
        colBG.classList.remove("d-none", "col-lg-6");
        colBG.classList.add("col-lg-8", "mx-auto");
      }
      if (colBP) colBP.classList.add("d-none");
    }
  }

  /* ============================================================================
   * 10. LANGUAGE TOGGLER & DOM SYNC
   * ============================================================================
   */
  /**
   * Updates application language, persists to storage, and re-renders all translated DOM nodes.
   * Supports both `data-hr-i18n` (modern) and `data-ar-i18n` (legacy) attributes.
   * @param {"bn"|"en"} lang - Language code to activate.
   */
  function hrSetLang(lang) {
    hrLang = (lang === "en") ? "en" : "bn";
    try {
      localStorage.setItem(HT_LANG_KEY, hrLang);
      localStorage.setItem("bw-lang", hrLang);
    } catch (_) {}

    if (document.documentElement) document.documentElement.lang = hrLang;
    if (document.body) document.body.className = hrLang;

    // Toggle button text in navbar
    const langBtn = $("hrLangToggle") || $("arLangToggle");
    if (langBtn) langBtn.textContent = (hrLang === "bn") ? "English" : "বাংলা";

    // Synchronize mobile sidebar language pills
    document.querySelectorAll(".mobile-lang-pill").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-lang") === hrLang);
    });

    // Translate all [data-hr-i18n] and [data-ar-i18n]
    document.querySelectorAll("[data-hr-i18n], [data-ar-i18n]").forEach(el => {
      const k = el.getAttribute("data-hr-i18n") || el.getAttribute("data-ar-i18n");
      if (T[hrLang] && T[hrLang][k]) {
        el.textContent = T[hrLang][k];
      }
    });

    // Translate input placeholders [data-hr-i18n-ph] and [data-ar-i18n-ph]
    document.querySelectorAll("[data-hr-i18n-ph], [data-ar-i18n-ph]").forEach(el => {
      const k = el.getAttribute("data-hr-i18n-ph") || el.getAttribute("data-ar-i18n-ph");
      if (T[hrLang] && T[hrLang][k]) {
        el.placeholder = T[hrLang][k];
      }
    });

    // Re-render live meters & pull-up stats
    updateBPMeter();
    updateBGMeter();
    renderStats();
  }

  /* ============================================================================
   * 11. BOOTSTRAP, EVENT LISTENERS & LIFECYCLE HOOKS
   * ============================================================================
   */
  /**
   * Initializes date inputs, registers event handlers, and performs initial render.
   */
  function init() {
    // 1. Initial Dates to Local Time
    const bpDate = $("bpDate");
    const bgDate = $("bgDate");
    const nowIso = formatLocalIso();
    if (bpDate && !bpDate.value) bpDate.value = nowIso;
    if (bgDate && !bgDate.value) bgDate.value = nowIso;

    // 2. Language Toggle Buttons
    const langBtn = $("hrLangToggle") || $("arLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        hrSetLang(hrLang === "bn" ? "en" : "bn");
      });
    }

    document.querySelectorAll(".mobile-lang-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        hrSetLang(pill.getAttribute("data-lang"));
      });
    });

    // 3. Real-time Meter Listeners
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    if (sysEl) sysEl.addEventListener("input", updateBPMeter);
    if (diaEl) diaEl.addEventListener("input", updateBPMeter);

    // Target preset clicks on BP meter labels
    document.querySelectorAll("[data-bp-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-bp-target");
        let s = 120, d = 80;
        if (target === "low") { s = 85; d = 55; }
        else if (target === "normal") { s = 118; d = 78; }
        else if (target === "elevated") { s = 126; d = 78; }
        else if (target === "high1") { s = 135; d = 85; }
        else if (target === "crisis") { s = 185; d = 115; }
        if (sysEl) sysEl.value = s;
        if (diaEl) diaEl.value = d;
        updateBPMeter();
      });
    });

    const valEl = $("bgValue");
    if (valEl) valEl.addEventListener("input", updateBGMeter);

    // Target preset clicks on BG meter labels
    document.querySelectorAll("[data-bg-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-bg-target");
        let v = 5.6;
        if (target === "hypo") v = 3.6;
        else if (target === "normal") v = 5.2;
        else if (target === "prediab") v = 6.4;
        else if (target === "diabetic") v = 8.5;
        if (valEl) valEl.value = v;
        updateBGMeter();
      });
    });

    // 4. Arm Selector Toggle
    document.querySelectorAll("[data-arm]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-arm]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeArm = btn.getAttribute("data-arm");
        const bpArmHidden = $("bpArm");
        if (bpArmHidden) bpArmHidden.value = activeArm;
        updateBPMeter();
      });
    });

    // 5. BG Timing Cards
    document.querySelectorAll(".ht-timing-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".ht-timing-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        activeTiming = card.getAttribute("data-timing");
        const bgTimingHidden = $("bgTiming");
        if (bgTimingHidden) bgTimingHidden.value = activeTiming;
        updateBGMeter();
      });
    });

    // 6. Form Mode Switcher
    document.querySelectorAll(".ht-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setFormMode(btn.getAttribute("data-mode"));
      });
    });

    // 7. Form Submissions
    const bpForm = $("bpForm");
    if (bpForm) bpForm.addEventListener("submit", handleBPSubmit);

    const bgForm = $("bgForm");
    if (bgForm) bgForm.addEventListener("submit", handleBGSubmit);

    // Initial render & I18N synchronization
    hrSetLang(hrLang);
  }

  // Global window exposure for debugging and external invocation
  window.hrSetLang = hrSetLang;
  window.arSetLang = hrSetLang;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

