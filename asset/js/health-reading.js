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
      quickAdd: "নতুন রিডিং",
      quickTrends: "ট্রেন্ড চার্ট",
      quickLog: "ইতিহাস লগ",
      quickDemo: "নমুনা ডেটা",
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
      lblAge: "বয়স",
      unitYears: "বছর",
      lblSystolic: "সিস্টোলিক",
      lblDiastolic: "ডায়াস্টোলিক",
      lblGlucose: "গ্লুকোজ মান",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      gaugeTitleBP: "লাইভ রক্তচাপ স্পেকট্রাম নির্দেশক",
      gaugeTitleBG: "লাইভ গ্লুকোজ রেঞ্জ নির্দেশক",
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
      chipOptimal: "🌟 সর্বোত্তম",
      chipNormal: "✅ স্বাভাবিক",
      chipNormalHigh: "⚠️ স্বাভাবিক থেকে উচ্চ",
      chipHigh: "🚨 উচ্চ",
      chipElevated: "⚠️ উচ্চতর",
      chipCrisis: "🛑 ক্রাইসিস",
      chipLow: "ℹ️ কম",
      chipPrediab: "⚠️ প্রি-ডায়াবেটিস",
      chipDiabetic: "🚨 ডায়াবেটিস",
      chipHypo: "⚠️ কম (হাইপো)",
      bpLowLabel: "কম (<৯০)",
      bpOptimalLabel: "সর্বোত্তম (<১২০)",
      bpNormalLabel: "স্বাভাবিক (১২০–১২৯)",
      bpNormalHighLabel: "স্বাভাবিক-উচ্চ (১৩০–১৩৯)",
      bpHighLabel: "উচ্চ (>১৪০)",
      toastBPSaved: "✅ রক্তচাপ সফলভাবে সংরক্ষণ করা হয়েছে!",
      toastBGSaved: "✅ গ্লুকোজ সফলভাবে সংরক্ষণ করা হয়েছে!",
      toastEnterValidAge: "⚠️ অনুগ্রহ করে সঠিক বয়স লিখুন (০–১২০ বছর)।",
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
      quickAdd: "Add Reading",
      quickTrends: "Trends & Charts",
      quickLog: "History Log",
      quickDemo: "Demo Data",
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
      lblAge: "Age",
      unitYears: "years",
      lblSystolic: "Systolic",
      lblDiastolic: "Diastolic",
      lblGlucose: "Glucose Level",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      gaugeTitleBP: "Live BP Diagnostic Spectrum",
      gaugeTitleBG: "Live Glycemic Range Meter",
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
      chipOptimal: "🌟 Optimal",
      chipNormal: "✅ Normal",
      chipNormalHigh: "⚠️ Normal to High",
      chipHigh: "🚨 High",
      chipElevated: "⚠️ Elevated",
      chipCrisis: "🛑 Crisis",
      chipLow: "ℹ️ Low",
      chipPrediab: "⚠️ Pre-diabetes",
      chipDiabetic: "🚨 Diabetic",
      chipHypo: "⚠️ Hypo (Low)",
      bpLowLabel: "Low (<90)",
      bpOptimalLabel: "Optimal (<120)",
      bpNormalLabel: "Normal (120-129)",
      bpNormalHighLabel: "Normal-high (130-139)",
      bpHighLabel: "High (>140)",
      toastBPSaved: "✅ Blood pressure saved successfully!",
      toastBGSaved: "✅ Blood glucose saved successfully!",
      toastEnterValidAge: "⚠️ Please enter a valid age (0–120 years).",
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
   * 4. CLINICAL DIAGNOSTIC ALGORITHMS (BASED ON REFERENCE TABLES)
   * ============================================================================
   */
  /**
   * Classifies Blood Pressure readings according to Table 1 of the clinical reference:
   * - Low: Systolic < 90 or Diastolic < 60
   * - Optimal: Systolic < 120 and Diastolic < 80 (with SBP >= 90 and DBP >= 60)
   * - Normal: Systolic 120–129 or Diastolic 80–84
   * - Normal to high: Systolic 130–139 or Diastolic 85–89
   * - High: Systolic >= 140 or Diastolic >= 90
   *
   * Also computes continuous proportional spectrum gauge positioning (0% to 100%)
   * and matches age & gender benchmarks according to Tables 2 and 3.
   *
   * @param {number} sys - Systolic blood pressure (mmHg).
   * @param {number} dia - Diastolic blood pressure (mmHg).
   * @param {number|null} [age] - Age in years.
   * @returns {{category: string, pct: number, chip: string, cls: string, age: number|null, ageBenchmark: Object|null}}
   */
  function classifyBP(sys, dia, age = null) {
    const s = parseInt(sys, 10);
    const d = parseInt(dia, 10);
    const a = (age !== null && age !== "" && !isNaN(age)) ? parseInt(age, 10) : null;

    if (isNaN(s) || isNaN(d)) {
      return {
        category: "optimal",
        pct: 32,
        chip: T[hrLang].chipOptimal || (hrLang === "bn" ? "🌟 সর্বোত্তম" : "🌟 Optimal"),
        cls: "optimal",
        age: a,
        ageBenchmark: null
      };
    }

    let category = "optimal";
    let chip = T[hrLang].chipOptimal || (hrLang === "bn" ? "🌟 সর্বোত্তম" : "🌟 Optimal");
    let cls = "optimal";

    // Table 1 Classification Rules
    if (s < 90 || d < 60) {
      category = "low";
      chip = T[hrLang].chipLow;
      cls = "low";
    } else if (s >= 140 || d >= 90) {
      category = "high";
      chip = T[hrLang].chipHigh;
      cls = "high";
    } else if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) {
      category = "normal_high";
      chip = T[hrLang].chipNormalHigh || (hrLang === "bn" ? "⚠️ স্বাভাবিক থেকে উচ্চ" : "⚠️ Normal to High");
      cls = "normal_high";
    } else if ((s >= 120 && s <= 129) || (d >= 80 && d <= 84)) {
      category = "normal";
      chip = T[hrLang].chipNormal;
      cls = "normal";
    } else {
      category = "optimal";
      chip = T[hrLang].chipOptimal || (hrLang === "bn" ? "🌟 সর্বোত্তম" : "🌟 Optimal");
      cls = "optimal";
    }

    // Continuous Proportional Gauge Pointer Placement (0% to 100%)
    // Zones:
    // 0% - 18%: Low (<90)
    // 18% - 45%: Optimal (90-119)
    // 45% - 65%: Normal (120-129)
    // 65% - 82%: Normal to high (130-139)
    // 82% - 100%: High (>=140)
    let pct = 32;
    if (s < 90) {
      pct = Math.max(4, Math.min(18, 4 + ((s - 50) / 40) * 14));
    } else if (s < 120) {
      pct = 18 + ((s - 90) / 30) * 27; // 90->18%, 119->44%
    } else if (s < 130) {
      pct = 45 + ((s - 120) / 10) * 20; // 120->45%, 129->63%
    } else if (s < 140) {
      pct = 65 + ((s - 130) / 10) * 17; // 130->65%, 139->80%
    } else {
      pct = Math.min(96, 82 + ((s - 140) / 50) * 14); // 140->82%, 190->96%
    }

    // If Diastolic puts patient into a higher category, adjust pointer smoothly
    if (category === "high" && pct < 82) pct = 85;
    else if (category === "normal_high" && pct < 65) pct = 70;
    else if (category === "normal" && pct < 45) pct = 50;

    // Age benchmark evaluation (Tables 2 & 3)
    let ageBenchmark = null;
    if (a !== null) {
      ageBenchmark = getAgeBenchmarkData(a, s, d);
    }

    return {
      category,
      pct: Math.round(pct),
      chip,
      cls,
      age: a,
      ageBenchmark
    };
  }

  /**
   * Retrieves pediatric and adult benchmark comparison data according to Tables 2 and 3.
   * @param {number} age - Patient age in years.
   * @param {number} s - Systolic reading.
   * @param {number} d - Diastolic reading.
   * @returns {Object} Benchmark comparison metadata.
   */
  function getAgeBenchmarkData(age, s, d) {
    const isBn = hrLang === "bn";
    if (age < 1) {
      return {
        type: "pediatric",
        groupLabel: isBn ? "নবজাতক / শিশু (১ মাস পর্যন্ত)" : "Newborns (up to 1 month)",
        refSys: "60–90",
        refDia: "20–60",
        inRange: s >= 60 && s <= 90 && d >= 20 && d <= 60
      };
    } else if (age >= 1 && age <= 3) {
      return {
        type: "pediatric",
        groupLabel: isBn ? "টডলার (১–৩ বছর)" : "Toddlers (1–3 years)",
        refSys: "95–105",
        refDia: "53–66",
        inRange: s >= 95 && s <= 105 && d >= 53 && d <= 66
      };
    } else if (age >= 4 && age <= 5) {
      return {
        type: "pediatric",
        groupLabel: isBn ? "প্রিস্কুলার (৩–৫ বছর)" : "Preschoolers (3–5 years)",
        refSys: "95–110",
        refDia: "56–70",
        inRange: s >= 95 && s <= 110 && d >= 56 && d <= 70
      };
    } else if (age >= 6 && age <= 12) {
      return {
        type: "pediatric",
        groupLabel: isBn ? "স্কুলগামী শিশু (৬–১২ বছর)" : "School-aged children (6–12 years)",
        refSys: "97–112",
        refDia: "57–71",
        inRange: s >= 97 && s <= 112 && d >= 57 && d <= 71
      };
    } else if (age >= 13 && age <= 17) {
      return {
        type: "pediatric",
        groupLabel: isBn ? "কিশোর-কিশোরী (১৩–১৭ বছর)" : "Adolescents (13–17 years)",
        refSys: "112–128",
        refDia: "66–80",
        inRange: s >= 112 && s <= 128 && d >= 66 && d <= 80
      };
    } else if (age >= 18 && age <= 39) {
      return {
        type: "adult",
        groupLabel: isBn ? "প্রাপ্তবয়স্ক (১৮–৩৯ বছর)" : "Adults (18–39 years)",
        women: "110/68 mm Hg",
        men: "119/70 mm Hg"
      };
    } else if (age >= 40 && age <= 59) {
      return {
        type: "adult",
        groupLabel: isBn ? "প্রাপ্তবয়স্ক (৪০–৫৯ বছর)" : "Adults (40–59 years)",
        women: "122/74 mm Hg",
        men: "124/77 mm Hg"
      };
    } else {
      // 60+
      return {
        type: "adult",
        groupLabel: isBn ? "প্রবীণ (৬০+ বছর)" : "Seniors (60+ years)",
        women: "139/68 mm Hg",
        men: "133/69 mm Hg"
      };
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
        case "optimal": return "🌟 Optimal blood pressure (<120 / <80 mmHg). Around 120/80 mm Hg is considered a typical blood pressure reading.";
        case "normal": return "✅ Normal blood pressure (120–129 / 80–84 mmHg). Healthy range.";
        case "normal_high": return "⚠️ Normal to high blood pressure (130–139 / 85–89 mmHg). Lifestyle moderation advised.";
        case "high": return "🚨 High blood pressure (>140 / >90 mmHg). Consult physician for medical advice.";
        case "low": return "ℹ️ Low blood pressure (<90 / <60 mmHg). Maintain adequate hydration.";
        default: return "Enter age, systolic, and diastolic values to view live clinical guidance.";
      }
    } else {
      switch (cat) {
        case "optimal": return "🌟 সর্বোত্তম রক্তচাপ (<১২০ / <৮০ mmHg)। সাধারণত ১২০/৮০ mmHg একটি আদর্শ রিডিং হিসেবে বিবেচনা করা হয়।";
        case "normal": return "✅ স্বাভাবিক রক্তচাপ (১২০–১২৯ / ৮০–৮৪ mmHg)।";
        case "normal_high": return "⚠️ স্বাভাবিক থেকে উচ্চ রক্তচাপ (১৩০–১৩৯ / ৮৫–৮৯ mmHg)। জীবনযাত্রার সচেতনতা প্রয়োজন।";
        case "high": return "🚨 উচ্চ রক্তচাপ (>১৪০ / >৯০ mmHg)। চিকিৎসকের পরামর্শ গ্রহণ করুন।";
        case "low": return "ℹ️ নিম্ন রক্তচাপ (<৯০ / <৬০ mmHg)। পর্যাপ্ত পানি ও স্যালাইন গ্রহণ করুন।";
        default: return "বয়স, সিস্টোলিক ও ডায়াস্টোলিক মান লিখলে লাইভ স্বাস্থ্য নির্দেশক ও পরামর্শ দেখতে পাবেন।";
      }
    }
  }

  /**
   * Generates rich HTML clinical advice based on the 3 tables from the reference image.
   * @param {string} category - Table 1 category.
   * @param {number} sys - Systolic reading.
   * @param {number} dia - Diastolic reading.
   * @param {number|null} age - Patient age.
   * @param {Object|null} ageBenchmark - Benchmark metadata.
   * @returns {string} Rich HTML advice content.
   */
  function getBPAdviceHTML(category, sys, dia, age, ageBenchmark) {
    const isBn = hrLang === "bn";
    let title = "";
    let guidance = "";

    if (isBn) {
      switch (category) {
        case "optimal":
          title = "🌟 সর্বোত্তম রক্তচাপ (Optimal: <120 / <80 mmHg)";
          guidance = "চমৎকার! আপনার রক্তচাপ সম্পূর্ণ আদর্শ ও সর্বোত্তম স্বাস্থ্যকর সীমায় রয়েছে। সুষম পুষ্টিকর খাবার ও নিয়মিত শরীরচর্চা বজায় রাখুন।";
          break;
        case "normal":
          title = "✅ স্বাভাবিক রক্তচাপ (Normal: 120–129 / 80–84 mmHg)";
          guidance = "আপনার রক্তচাপ স্বাভাবিক সীমায় রয়েছে। স্বাস্থ্যকর জীবনধারা, পরিমিত লবণ গ্রহণ ও মানসিক প্রশান্তি বজায় রাখুন।";
          break;
        case "normal_high":
          title = "⚠️ স্বাভাবিক থেকে উচ্চ (Normal to High: 130–139 / 85–89 mmHg)";
          guidance = "রক্তচাপ স্বাভাবিক থেকে কিছুটা উচ্চতর। সোডিয়াম/লবণ খাওয়ার পরিমাণ কমান, নিয়মিত ৩০ মিনিট হাঁটুন এবং স্ট্রেস ম্যানেজমেন্ট করুন।";
          break;
        case "high":
          title = "🚨 উচ্চ রক্তচাপ (High: >140 / >90 mmHg)";
          guidance = "উচ্চ রক্তচাপ শনাক্ত হয়েছে। বিলম্ব না করে একজন চিকিৎসকের পরামর্শ নিন এবং নিয়মিত রক্তচাপ ট্র্যাকিং বজায় রাখুন।";
          break;
        case "low":
          title = "ℹ️ নিম্ন রক্তচাপ (Low: <90 / <60 mmHg)";
          guidance = "রক্তচাপ স্বাভাবিকের চেয়ে কম। পর্যাপ্ত পানি, ডাবের পানি ও ওরাল স্যালাইন পান করুন। মাথা ঘোরানো থাকলে ডাক্তারের পরামর্শ নিন।";
          break;
        default:
          title = "রক্তচাপ নির্দেশনা";
          guidance = "বয়স, সিস্টোলিক ও ডায়াস্টোলিক মান লিখলে লাইভ স্বাস্থ্য নির্দেশক ও চার্ট অনুযায়ী পরামর্শ দেখতে পাবেন।";
      }
    } else {
      switch (category) {
        case "optimal":
          title = "🌟 Optimal Blood Pressure (<120 / <80 mmHg)";
          guidance = "Excellent! Blood pressure is within the optimal healthy target range. Keep up a balanced diet and regular physical activity.";
          break;
        case "normal":
          title = "✅ Normal Blood Pressure (120–129 / 80–84 mmHg)";
          guidance = "Blood pressure is in the normal range. Maintain healthy eating habits and regular daily movement.";
          break;
        case "normal_high":
          title = "⚠️ Normal to High (130–139 / 85–89 mmHg)";
          guidance = "Blood pressure is slightly elevated. Recommend reducing sodium/salt intake, managing stress, and gentle daily walking.";
          break;
        case "high":
          title = "🚨 High Blood Pressure (>140 / >90 mmHg)";
          guidance = "High blood pressure detected. Prompt physician consultation recommended along with lifestyle and dietary adjustments.";
          break;
        case "low":
          title = "ℹ️ Low Blood Pressure (<90 / <60 mmHg)";
          guidance = "Blood pressure is below standard levels. Ensure adequate hydration and electrolytes. Consult doctor if experiencing dizziness.";
          break;
        default:
          title = "Blood Pressure Guidance";
          guidance = "Enter age, systolic, and diastolic values to view live clinical guidance.";
      }
    }

    // Typical reading reference from image
    const typicalText = isBn
      ? "সাধারণত ১২০/৮০ mmHg মানকে একটি সাধারণ ও আদর্শ রক্তচাপ রিডিং হিসেবে বিবেচনা করা হয়।"
      : "Around 120/80 mm Hg is often considered a typical blood pressure reading.";

    // Age & Gender benchmark box
    let ageBenchmarkHtml = "";
    if (ageBenchmark) {
      if (ageBenchmark.type === "adult") {
        ageBenchmarkHtml = `
          <div class="mt-2 p-2 bg-light border rounded-3 small">
            <div class="fw-bold text-dark mb-1">
              <i class="bi bi-people-fill text-primary me-1"></i>${isBn ? `বয়সভিত্তিক গড় রক্তচাপ (${ageBenchmark.groupLabel}):` : `Average BP by age and gender (${ageBenchmark.groupLabel}):`}
            </div>
            <div class="d-flex flex-wrap gap-3 text-secondary">
              <div>👩 ${isBn ? "নারী (Women)" : "Women"}: <strong class="text-dark">${ageBenchmark.women}</strong></div>
              <div>👨 ${isBn ? "পুরুষ (Men)" : "Men"}: <strong class="text-dark">${ageBenchmark.men}</strong></div>
            </div>
          </div>
        `;
      } else if (ageBenchmark.type === "pediatric") {
        const rangeStatus = ageBenchmark.inRange
          ? (isBn ? `<span class="badge bg-success-subtle text-success ms-1">গড় রেঞ্জের মধ্যে রয়েছে</span>` : `<span class="badge bg-success-subtle text-success ms-1">Within average range</span>`)
          : (isBn ? `<span class="badge bg-warning-subtle text-warning-emphasis ms-1">গড় রেঞ্জ থেকে ভিন্ন</span>` : `<span class="badge bg-warning-subtle text-warning-emphasis ms-1">Outside typical range</span>`);

        ageBenchmarkHtml = `
          <div class="mt-2 p-2 bg-light border rounded-3 small">
            <div class="fw-bold text-dark mb-1">
              <i class="bi bi-person-heart text-primary me-1"></i>${isBn ? `শিশু ও কিশোরদের গড় রক্তচাপ (${ageBenchmark.groupLabel}):` : `Average BP for children and teens (${ageBenchmark.groupLabel}):`} ${rangeStatus}
            </div>
            <div class="d-flex flex-wrap gap-3 text-secondary">
              <div>${isBn ? "সিস্টোলিক (উপরের সংখ্যা)" : "Systolic"}: <strong class="text-dark">${ageBenchmark.refSys} mm Hg</strong></div>
              <div>${isBn ? "ডায়াস্টোলিক (নিচের সংখ্যা)" : "Diastolic"}: <strong class="text-dark">${ageBenchmark.refDia} mm Hg</strong></div>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="ht-advice-header d-flex justify-content-between align-items-center mb-1">
        <strong class="fs-6">${title}</strong>
      </div>
      <div class="text-muted small mb-1"><i class="bi bi-info-circle me-1"></i>${typicalText}</div>
      ${ageBenchmarkHtml}
      <div class="ht-advice-guidance mt-2">${guidance}</div>
    `;
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
   * evaluates Table 1 category, age and gender benchmarks from Tables 2 & 3,
   * updates status chips, active spectrum labels, diagnostic advice card, and preview banner.
   */
  function updateBPMeter() {
    const ageEl = $("bpAge");
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    if (!sysEl || !diaEl) return;

    const ageVal = ageEl ? ageEl.value.trim() : "";
    const sysVal = sysEl.value.trim();
    const diaVal = diaEl.value.trim();

    const age = ageVal !== "" ? parseInt(ageVal, 10) : null;
    const sys = parseInt(sysVal, 10);
    const dia = parseInt(diaVal, 10);

    const errAge = $("errBpAge");
    const errSys = $("errBpSys");
    const errDia = $("errBpDia");

    if (errAge) errAge.textContent = "";
    if (errSys) errSys.textContent = "";
    if (errDia) errDia.textContent = "";

    const pointer = $("bpGaugePointer");
    const badge = $("bpPointerBadge");
    const chip = $("bpLiveChip");
    const advice = $("bpAdviceBox");
    const preview = $("bpPreviewWrap");

    if (isNaN(sys) || isNaN(dia)) {
      if (pointer) pointer.style.left = "32%";
      if (badge) badge.textContent = "120/80";
      if (chip) {
        chip.className = "ht-status-chip optimal ms-auto";
        chip.textContent = T[hrLang].chipOptimal || (hrLang === "bn" ? "🌟 সর্বোত্তম" : "🌟 Optimal");
      }
      if (advice) {
        advice.className = "ht-advice-box optimal";
        advice.innerHTML = `<span class="text-muted">${getBPAdvice("")}</span>`;
      }
      if (preview) preview.innerHTML = "";
      return;
    }

    if (age !== null && (isNaN(age) || age < 0 || age > 120)) {
      if (errAge) errAge.textContent = hrLang === "bn" ? "সঠিক বয়স লিখুন (০–১২০ বছর)" : "Please enter valid age (0–120 yrs)";
    }

    if (sys <= dia) {
      if (errDia) errDia.textContent = hrLang === "bn" ? "সিস্টোলিক অবশ্যই ডায়াস্টোলিক থেকে বেশি হতে হবে" : "Systolic must be strictly greater than diastolic";
      if (chip) {
        chip.className = "ht-status-chip neutral ms-auto";
        chip.textContent = "—";
      }
      return;
    }

    const { category, pct, chip: chipTxt, cls, ageBenchmark } = classifyBP(sys, dia, age);

    if (pointer) pointer.style.left = `${pct}%`;
    if (badge) badge.textContent = `${sys}/${dia}${age !== null ? ` (${age}y)` : ""}`;

    if (chip) {
      chip.className = `ht-status-chip ${cls} ms-auto`;
      chip.textContent = chipTxt;
    }

    // Highlight active label on the spectrum meter
    document.querySelectorAll("#bpGaugeLabels [data-bp-target]").forEach(btn => {
      const target = btn.getAttribute("data-bp-target");
      let matches = false;
      if (target === "low" && category === "low") matches = true;
      else if (target === "optimal" && category === "optimal") matches = true;
      else if (target === "normal" && category === "normal") matches = true;
      else if (target === "normal-high" && category === "normal_high") matches = true;
      else if (target === "high" && category === "high") matches = true;
      btn.classList.toggle("active", matches);
    });

    if (advice) {
      advice.className = `ht-advice-box ${cls}`;
      advice.innerHTML = getBPAdviceHTML(category, sys, dia, age, ageBenchmark);
    }

    if (preview) {
      const ageLabel = age !== null ? (hrLang === "bn" ? `বয়স: ${age} বছর` : `Age: ${age} yrs`) : "";
      preview.innerHTML = `
        <div class="ht-reading-preview alert alert-light border mt-3 mb-0 p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold fs-5">${sys}/${dia} mmHg</div>
            <div class="small text-muted">${ageLabel ? ageLabel + " · " : ""}${chipTxt}</div>
          </div>
          <span class="badge bg-${cls === 'optimal' || cls === 'normal' ? 'success' : (cls === 'normal_high' ? 'warning' : (cls === 'low' ? 'info' : 'danger'))}-subtle text-${cls === 'optimal' || cls === 'normal' ? 'success' : (cls === 'normal_high' ? 'warning' : (cls === 'low' ? 'info' : 'danger'))} px-3 py-2 rounded-pill fw-bold">${chipTxt}</span>
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
   * 6. CRISIS DETECTION & WHATSAPP PREVIEW CONTROLLER
   * ============================================================================
   */
  /**
   * Evaluates historical records to toggle emergency crisis alert banner and
   * synchronize the family/physician WhatsApp sharing preview.
   */
  function renderStats() {
    const records = loadRecords();
    let latestBP = null;
    let latestBG = null;

    records.forEach(r => {
      if (r.type === "bp" && !latestBP) latestBP = r;
      if (r.type === "bg" && !latestBG) latestBG = r;
    });

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
        const ageStr = latestBP.age ? ` · Age: ${latestBP.age} yrs` : "";
        msg += `❤️ Blood Pressure: ${latestBP.systolic}/${latestBP.diastolic} mmHg${ageStr}\n`;
      }
      if (latestBG) {
        msg += `🩸 Blood Glucose: ${parseFloat(latestBG.value).toFixed(1)} mmol/L (${latestBG.timing || "Fasting"})\n`;
      }
      msg += `\nTracked securely via BreatheWell Digital Health.`;
    } else {
      msg = `*BreatheWell স্বাস্থ্য রিপোর্ট*\nতারিখ: ${new Date().toLocaleDateString("bn-BD", { dateStyle: "medium" })}\n\n`;
      if (latestBP) {
        const ageStr = latestBP.age ? ` · বয়স: ${latestBP.age} বছর` : "";
        msg += `❤️ রক্তচাপ: ${latestBP.systolic}/${latestBP.diastolic} mmHg${ageStr}\n`;
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
    const ageEl = $("bpAge");
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    const dateEl = $("bpDate");
    const notesEl = $("bpNotes");

    if (!sysEl || !diaEl) return;

    let age = null;
    if (ageEl && ageEl.value.trim() !== "") {
      age = parseInt(ageEl.value.trim(), 10);
      if (isNaN(age) || age < 0 || age > 120) {
        showToast(T[hrLang].toastEnterValidAge || (hrLang === "bn" ? "সঠিক বয়স লিখুন (০–১২০ বছর)" : "Please enter valid age (0–120 yrs)"), "warning");
        return;
      }
    }

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
      age: age,
      systolic: sys,
      diastolic: dia,
      date: dateEl && dateEl.value ? new Date(dateEl.value).toISOString() : new Date().toISOString(),
      notes: notesEl ? notesEl.value.trim() : ""
    };

    const records = loadRecords();
    records.push(record);
    saveRecords(records);

    showToast(T[hrLang].toastBPSaved, "success");
    renderStats();

    // Reset inputs, re-init datetime
    if (ageEl) ageEl.value = "";
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
    const langBtn = $("langToggle") || $("hrLangToggle") || $("arLangToggle");
    if (langBtn) langBtn.textContent = (hrLang === "bn") ? "English" : "বাংলা";

    // Synchronize mobile sidebar language pills
    document.querySelectorAll(".mobile-lang-pill").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-lang") === hrLang);
    });

    // Translate all [data-hr-i18n], [data-ar-i18n] and [data-ht-i18n]
    document.querySelectorAll("[data-hr-i18n], [data-ar-i18n], [data-ht-i18n]").forEach(el => {
      const k = el.getAttribute("data-hr-i18n") || el.getAttribute("data-ar-i18n") || el.getAttribute("data-ht-i18n");
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
    const langBtn = $("langToggle") || $("hrLangToggle") || $("arLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        hrSetLang(hrLang === "bn" ? "en" : "bn");
      });
    }

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail && e.detail.lang && e.detail.lang !== hrLang) {
          hrSetLang(e.detail.lang);
        }
      });
    }

    document.querySelectorAll(".mobile-lang-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        hrSetLang(pill.getAttribute("data-lang"));
      });
    });

    // 3. Real-time Meter Listeners
    const ageEl = $("bpAge");
    const sysEl = $("bpSystolic");
    const diaEl = $("bpDiastolic");
    if (ageEl) ageEl.addEventListener("input", updateBPMeter);
    if (sysEl) sysEl.addEventListener("input", updateBPMeter);
    if (diaEl) diaEl.addEventListener("input", updateBPMeter);

    // Target preset clicks on BP meter labels (Table 1 Reference)
    document.querySelectorAll("[data-bp-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-bp-target");
        let s = 115, d = 75;
        if (target === "low") { s = 85; d = 55; }
        else if (target === "optimal") { s = 115; d = 75; }
        else if (target === "normal") { s = 124; d = 82; }
        else if (target === "normal-high") { s = 135; d = 86; }
        else if (target === "high") { s = 145; d = 95; }
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

    // 4. BG Timing Cards
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

    // Dynamic Sticky Navbar Offset Synchronizer
    function syncStickyNavOffset() {
      const nav = document.querySelector("nav.navbar");
      if (nav && document.documentElement && document.documentElement.style && document.documentElement.style.setProperty) {
        document.documentElement.style.setProperty("--bw-navbar-height", `${nav.offsetHeight}px`);
      }
    }
    syncStickyNavOffset();
    window.addEventListener("resize", syncStickyNavOffset);

    // Auto-scroll active tab into view on mobile touch devices
    const activeHeroTab = document.querySelector(".ht-hero-tab.active");
    if (activeHeroTab && typeof activeHeroTab.scrollIntoView === "function") {
      try {
        activeHeroTab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      } catch (_) {}
    }

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

