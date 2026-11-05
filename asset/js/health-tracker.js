/**
 * ============================================================================
 * BreatheWell - Health Tracker Engine  (health-tracker.js)
 * ============================================================================
 * Description:
 *   Complete client-side engine for the Day-wise Blood Pressure & Diabetes
 *   (Blood Sugar) Health Tracker. All data is stored exclusively in
 *   localStorage — no server, no account required.
 *
 * Table of Contents:
 *   1.  Constants & Configuration
 *   2.  LocalStorage Data Layer
 *   3.  Internationalization (Bengali / English)
 *   4.  Utility Helpers
 *   5.  Blood-Pressure Classification Engine
 *   6.  Blood-Glucose Classification Engine
 *   7.  Form Handling — Blood Pressure Entry
 *   8.  Form Handling — Blood Glucose Entry
 *   9.  History Log — Render & Pagination
 *   10. SVG Chart Engine (pure JS, no library dependency)
 *   11. Stats Banner — Live Summary Calculations
 *   12. Share & Export Engine (CSV, JSON, URL)
 *   13. Family Monitor — PIN Authentication & View
 *   14. Toast Notification System
 *   15. Language Toggle Integration
 *   16. Application Bootstrap & Event Bindings
 * ============================================================================
 */

/* ============================================================================
 * 1. CONSTANTS & CONFIGURATION
 * ============================================================================ */

/** localStorage key for all health records */
const HT_KEY = "bw_health_tracker_records";

/** localStorage key for user's family PIN (if set) */
const HT_PIN_KEY = "bw_health_tracker_pin";

/** localStorage key for language preference (shared with script.js) */
const HT_LANG_KEY = "bw_lang";

/** Number of history rows shown per page */
const ROWS_PER_PAGE = 8;

/** Maximum records kept per type to avoid bloating localStorage */
const MAX_RECORDS = 365;

/**
 * Blood-pressure classification thresholds (systolic / diastolic).
 * AHA 2017 guidelines.
 */
const BP_RANGES = [
  { key: "low",     label_bn: "নিম্ন রক্তচাপ",        label_en: "Hypotension",           cls: "low",    icon: "⬇️",  sys: [0, 90],   dia: [0, 60]  },
  { key: "normal",  label_bn: "স্বাভাবিক",              label_en: "Normal",                cls: "normal", icon: "✅",  sys: [90, 120], dia: [60, 80] },
  { key: "elevated",label_bn: "উচ্চতর",                 label_en: "Elevated",              cls: "elevated",icon: "⚠️", sys: [120, 130],dia: [60, 80] },
  { key: "high1",   label_bn: "উচ্চ রক্তচাপ (পর্যায় ১)", label_en: "High BP – Stage 1",   cls: "high1",  icon: "🔴",  sys: [130, 140],dia: [80, 90] },
  { key: "high2",   label_bn: "উচ্চ রক্তচাপ (পর্যায় ২)", label_en: "High BP – Stage 2",   cls: "high2",  icon: "🚨",  sys: [140, 180],dia: [90, 120]},
  { key: "crisis",  label_bn: "জরুরি অবস্থা",           label_en: "Hypertensive Crisis",   cls: "crisis", icon: "🆘",  sys: [180, 999],dia: [120, 999]},
];

/**
 * Blood-glucose classification (mg/dL).
 * ADA 2024 guidelines.
 */
const BG_RANGES = {
  fasting: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",  label_en: "Hypoglycemia",      cls: "low",     icon: "⬇️",  min: 0,   max: 70  },
    { key: "normal",   label_bn: "স্বাভাবিক",           label_en: "Normal",            cls: "normal",  icon: "✅",  min: 70,  max: 100 },
    { key: "prediab",  label_bn: "প্রি-ডায়াবেটিস",     label_en: "Pre-diabetes",      cls: "elevated",icon: "⚠️", min: 100, max: 126 },
    { key: "diabetic", label_bn: "ডায়াবেটিস",           label_en: "Diabetes (Fasting)",cls: "high2",   icon: "🚨",  min: 126, max: 9999},
  ],
  postmeal: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",  label_en: "Hypoglycemia",      cls: "low",     icon: "⬇️",  min: 0,   max: 70  },
    { key: "normal",   label_bn: "স্বাভাবিক",           label_en: "Normal (Post-meal)",cls: "normal",  icon: "✅",  min: 70,  max: 140 },
    { key: "prediab",  label_bn: "প্রি-ডায়াবেটিস",     label_en: "Pre-diabetes",      cls: "elevated",icon: "⚠️", min: 140, max: 200 },
    { key: "diabetic", label_bn: "ডায়াবেটিস",           label_en: "Diabetes",          cls: "high2",   icon: "🚨",  min: 200, max: 9999},
  ],
  random: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",  label_en: "Hypoglycemia",      cls: "low",     icon: "⬇️",  min: 0,   max: 70  },
    { key: "normal",   label_bn: "স্বাভাবিক",           label_en: "Normal (Random)",   cls: "normal",  icon: "✅",  min: 70,  max: 140 },
    { key: "prediab",  label_bn: "মধ্যবর্তী",            label_en: "Intermediate",      cls: "elevated",icon: "⚠️", min: 140, max: 200 },
    { key: "diabetic", label_bn: "ডায়াবেটিস সম্ভাব্য",  label_en: "Possible Diabetes", cls: "high2",   icon: "🚨",  min: 200, max: 9999},
  ],
};

/* ============================================================================
 * 2. LOCALSTORAGE DATA LAYER
 * ============================================================================ */

/**
 * @typedef {Object} BPRecord
 * @property {"bp"} type
 * @property {string} id        - Unique UUID
 * @property {string} date      - ISO 8601 date-time string
 * @property {number} sys       - Systolic pressure (mmHg)
 * @property {number} dia       - Diastolic pressure (mmHg)
 * @property {number} [pulse]   - Heart rate (bpm)
 * @property {string} [arm]     - "left" | "right"
 * @property {string} [notes]   - Free-text notes
 * @property {string} status    - BP classification key
 */

/**
 * @typedef {Object} BGRecord
 * @property {"bg"} type
 * @property {string} id
 * @property {string} date
 * @property {number} value     - Blood glucose (mg/dL)
 * @property {string} timing    - "fasting" | "postmeal" | "random"
 * @property {string} [notes]
 * @property {string} status    - BG classification key
 */

/**
 * Loads all health records from localStorage.
 * @returns {(BPRecord|BGRecord)[]} Sorted newest-first array.
 */
function htLoadRecords() {
  try {
    const raw = localStorage.getItem(HT_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Persists the given record array to localStorage.
 * Trims excess records per type if MAX_RECORDS is exceeded.
 * @param {(BPRecord|BGRecord)[]} records
 */
function htSaveRecords(records) {
  // Sort newest first
  records.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Cap BP records
  let bpCount = 0;
  let bgCount = 0;
  const trimmed = records.filter(r => {
    if (r.type === "bp") { bpCount++; return bpCount <= MAX_RECORDS; }
    if (r.type === "bg") { bgCount++; return bgCount <= MAX_RECORDS; }
    return true;
  });

  localStorage.setItem(HT_KEY, JSON.stringify(trimmed));
}

/**
 * Generates a lightweight unique identifier (no external library).
 * @returns {string}
 */
function htUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* ============================================================================
 * 3. INTERNATIONALIZATION (Bengali / English)
 * ============================================================================ */

/** Active language — synced with main app's localStorage key */
let htLang = localStorage.getItem(HT_LANG_KEY) || "bn";

/** Translation strings for health tracker UI */
const HT_T = {
  bn: {
    pageTitle:        "স্বাস্থ্য পর্যবেক্ষণ",
    pageEyebrow:      "দৈনিক স্বাস্থ্য লগ",
    pageHeadline:     "রক্তচাপ ও ডায়াবেটিস ট্র্যাকার",
    pageSub:          "প্রতিদিনের রিডিং লিখে রাখুন। পরিবারের সদস্যদের সাথে শেয়ার করুন।",
    statBPTitle:      "সর্বশেষ রক্তচাপ",
    statBGTitle:      "সর্বশেষ গ্লুকোজ",
    statTodayTitle:   "আজকের রেকর্ড",
    statStreakTitle:   "ধারাবাহিক দিন",
    statNoData:       "কোনো ডেটা নেই",

    bpFormTitle:      "রক্তচাপ এন্ট্রি",
    bpFormSub:        "সিস্টোলিক / ডায়াস্টোলিক (mmHg)",
    lblSystolic:      "সিস্টোলিক",
    lblDiastolic:     "ডায়াস্টোলিক",
    lblPulse:         "নাড়ির স্পন্দন",
    lblArm:           "কোন হাত?",
    armLeft:          "বাম হাত",
    armRight:         "ডান হাত",
    lblDate:          "তারিখ ও সময়",
    lblNotes:         "নোট (ঐচ্ছিক)",
    btnSaveBP:        "রক্তচাপ সংরক্ষণ করুন",
    unitMmhg:         "mmHg",
    unitBpm:          "bpm",

    bgFormTitle:      "রক্তের গ্লুকোজ এন্ট্রি",
    bgFormSub:        "ডায়াবেটিস পর্যবেক্ষণ (mg/dL)",
    lblGlucose:       "গ্লুকোজ মান",
    lblTiming:        "পরিমাপের সময়",
    timingFasting:    "উপবাসে (খালি পেটে)",
    timingPostmeal:   "খাবার পরে (২ ঘণ্টা)",
    timingRandom:     "যেকোনো সময়",
    btnSaveBG:        "গ্লুকোজ সংরক্ষণ করুন",
    unitMgdl:         "mg/dL",

    historyTitle:     "ইতিহাস লগ",
    tabAll:           "সব",
    tabBP:            "রক্তচাপ",
    tabBG:            "গ্লুকোজ",
    colDate:          "তারিখ",
    colType:          "ধরন",
    colValue:         "মান",
    colStatus:        "অবস্থা",
    colNotes:         "নোট",
    colAction:        "",
    noHistory:        "এখনো কোনো রেকর্ড নেই",
    noHistorySub:     "উপরের ফর্মে ডেটা যোগ করুন",
    paginInfo:        "{from}–{to} / {total}টি রেকর্ড",

    chartBPTitle:     "রক্তচাপের প্রবণতা (শেষ ১৪ দিন)",
    chartBGTitle:     "গ্লুকোজের প্রবণতা (শেষ ১৪ দিন)",
    chartNoData:      "চার্টের জন্য পর্যাপ্ত ডেটা নেই",
    chartNoDataSub:   "কমপক্ষে দুটি রিডিং যোগ করুন",

    shareTitle:       "পরিবারের সাথে শেয়ার করুন",
    shareSub:         "আপনার ছেলে বা মেয়ে দূর থেকে আপনার স্বাস্থ্য পর্যবেক্ষণ করতে পারবেন",
    btnCsv:           "CSV ডাউনলোড",
    btnJson:          "JSON ডাউনলোড",
    btnLink:          "শেয়ার লিংক",
    btnPrint:         "প্রিন্ট করুন",
    copyLinkLabel:    "শেয়ার লিংক কপি করুন",
    btnCopy:          "কপি",
    btnCopied:        "কপি হয়েছে ✓",

    familyTitle:      "পারিবারিক মনিটর",
    familyDesc:       "একটি ৪ সংখ্যার পিন সেট করুন। পিন শেয়ার করলে পরিবার সদস্যরা শুধু দেখতে পাবেন — পরিবর্তন করতে পারবেন না।",
    pinPlaceholder:   "• • • •",
    btnSetPin:        "পিন সেট করুন",
    btnResetPin:      "পিন পরিবর্তন করুন",
    pinSetOk:         "পিন সেট হয়েছে ✓",

    toastBPSaved:     "রক্তচাপ সংরক্ষিত হয়েছে",
    toastBGSaved:     "গ্লুকোজ সংরক্ষিত হয়েছে",
    toastDeleted:     "রেকর্ড মুছে ফেলা হয়েছে",
    toastCopied:      "লিংক ক্লিপবোর্ডে কপি হয়েছে",
    toastCSVDone:     "CSV ফাইল ডাউনলোড হয়েছে",
    toastJSONDone:    "JSON ফাইল ডাউনলোড হয়েছে",
    toastPinSaved:    "পারিবারিক পিন সংরক্ষিত হয়েছে",

    errSysRange:      "সিস্টোলিক মান ৬০–২৫০ এর মধ্যে হওয়া চাই",
    errDiaRange:      "ডায়াস্টোলিক মান ৪০–১৫০ এর মধ্যে হওয়া চাই",
    errBGRange:       "গ্লুকোজ মান ২০–৬০০ এর মধ্যে হওয়া চাই",
    errPulseRange:    "নাড়ির স্পন্দন ৩০–২২০ এর মধ্যে হওয়া চাই",
    errPinFormat:     "পিন অবশ্যই ৪ সংখ্যার হতে হবে",

    confirmDelete:    "এই রেকর্ড মুছে ফেলবেন?",
    days:             "দিন",
    readings:         "টি রিডিং",

    navHome:          "হোম",
    navExercises:     "অনুশীলন",
    navTest:          "শ্বাসের পরীক্ষা",
    navSafety:        "নিরাপত্তা",
    navHealth:        "স্বাস্থ্য",
    skip:             "মূল কনটেন্টে যান",
    langToggle:       "English",

    footerTag:        "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
    footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
  },
  en: {
    pageTitle:        "Health Monitor",
    pageEyebrow:      "Daily Health Log",
    pageHeadline:     "Blood Pressure & Diabetes Tracker",
    pageSub:          "Log your daily readings. Share with your family to monitor together.",
    statBPTitle:      "Latest BP",
    statBGTitle:      "Latest Glucose",
    statTodayTitle:   "Today's Records",
    statStreakTitle:   "Day Streak",
    statNoData:       "No data",

    bpFormTitle:      "Blood Pressure Entry",
    bpFormSub:        "Systolic / Diastolic (mmHg)",
    lblSystolic:      "Systolic",
    lblDiastolic:     "Diastolic",
    lblPulse:         "Pulse Rate",
    lblArm:           "Which Arm?",
    armLeft:          "Left arm",
    armRight:         "Right arm",
    lblDate:          "Date & Time",
    lblNotes:         "Notes (optional)",
    btnSaveBP:        "Save Blood Pressure",
    unitMmhg:         "mmHg",
    unitBpm:          "bpm",

    bgFormTitle:      "Blood Glucose Entry",
    bgFormSub:        "Diabetes monitoring (mg/dL)",
    lblGlucose:       "Glucose Value",
    lblTiming:        "Measurement Timing",
    timingFasting:    "Fasting (empty stomach)",
    timingPostmeal:   "Post-meal (2 hours after)",
    timingRandom:     "Random (any time)",
    btnSaveBG:        "Save Blood Glucose",
    unitMgdl:         "mg/dL",

    historyTitle:     "History Log",
    tabAll:           "All",
    tabBP:            "Blood Pressure",
    tabBG:            "Glucose",
    colDate:          "Date",
    colType:          "Type",
    colValue:         "Value",
    colStatus:        "Status",
    colNotes:         "Notes",
    colAction:        "",
    noHistory:        "No records yet",
    noHistorySub:     "Add data using the forms above",
    paginInfo:        "{from}–{to} of {total} records",

    chartBPTitle:     "BP Trend (last 14 days)",
    chartBGTitle:     "Glucose Trend (last 14 days)",
    chartNoData:      "Not enough data for chart",
    chartNoDataSub:   "Add at least two readings",

    shareTitle:       "Share with Family",
    shareSub:         "Your son or daughter can monitor your health remotely",
    btnCsv:           "Download CSV",
    btnJson:          "Download JSON",
    btnLink:          "Share Link",
    btnPrint:         "Print",
    copyLinkLabel:    "Copy share link",
    btnCopy:          "Copy",
    btnCopied:        "Copied ✓",

    familyTitle:      "Family Monitor",
    familyDesc:       "Set a 4-digit PIN. Share it with family so they can view (but not edit) your records.",
    pinPlaceholder:   "• • • •",
    btnSetPin:        "Set PIN",
    btnResetPin:      "Change PIN",
    pinSetOk:         "PIN saved ✓",

    toastBPSaved:     "Blood pressure saved",
    toastBGSaved:     "Blood glucose saved",
    toastDeleted:     "Record deleted",
    toastCopied:      "Link copied to clipboard",
    toastCSVDone:     "CSV downloaded",
    toastJSONDone:    "JSON downloaded",
    toastPinSaved:    "Family PIN saved",

    errSysRange:      "Systolic must be between 60–250 mmHg",
    errDiaRange:      "Diastolic must be between 40–150 mmHg",
    errBGRange:       "Glucose must be between 20–600 mg/dL",
    errPulseRange:    "Pulse must be between 30–220 bpm",
    errPinFormat:     "PIN must be exactly 4 digits",

    confirmDelete:    "Delete this record?",
    days:             "days",
    readings:         "readings",

    navHome:          "Home",
    navExercises:     "Exercises",
    navTest:          "Breath Test",
    navSafety:        "Safety",
    navHealth:        "Health",
    skip:             "Skip to main content",
    langToggle:       "বাংলা",

    footerTag:        "A little calm with every breath",
    footerDisclaimer: "For general wellness. Not a substitute for medical advice.",
  }
};

/**
 * Returns a translated string for the active language.
 * @param {string} key
 * @returns {string}
 */
function ht(key) {
  return (HT_T[htLang] && HT_T[htLang][key]) || HT_T.bn[key] || key;
}

/* ============================================================================
 * 4. UTILITY HELPERS
 * ============================================================================ */

/**
 * Shorthand getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const $ = id => document.getElementById(id);

/**
 * Formats a date string for display.
 * @param {string} isoString
 * @returns {string}
 */
function htFormatDate(isoString) {
  const d = new Date(isoString);
  if (isNaN(d)) return "—";
  const opts = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return d.toLocaleString(htLang === "bn" ? "bn-BD" : "en-GB", opts);
}

/**
 * Returns today's date in YYYY-MM-DDTHH:MM format for datetime-local inputs.
 * @returns {string}
 */
function htNowLocal() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

/**
 * Escapes special characters for safe CSV cell embedding.
 * @param {string|number} val
 * @returns {string}
 */
function csvEsc(val) {
  const s = String(val ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"` : s;
}

/* ============================================================================
 * 5. BLOOD-PRESSURE CLASSIFICATION ENGINE
 * ============================================================================ */

/**
 * Classifies a blood-pressure reading per AHA 2017 guidelines.
 * @param {number} sys - Systolic pressure (mmHg)
 * @param {number} dia - Diastolic pressure (mmHg)
 * @returns {{ key: string, label: string, cls: string, icon: string }}
 */
function classifyBP(sys, dia) {
  if (sys >= 180 || dia >= 120)
    return { key: "crisis",   label: ht("high2"),   cls: "crisis",   icon: "🆘" };
  if (sys >= 140 || dia >= 90)
    return { key: "high2",    label: ht("high2"),   cls: "high2",    icon: "🚨" };
  if (sys >= 130 || dia >= 80)
    return { key: "high1",    label: ht("high1"),   cls: "high1",    icon: "🔴" };
  if (sys >= 120 && dia < 80)
    return { key: "elevated", label: ht("elevated"),cls: "elevated", icon: "⚠️" };
  if (sys < 90 || dia < 60)
    return { key: "low",      label: ht("low"),     cls: "low",      icon: "⬇️" };
  return   { key: "normal",   label: ht("normal"),  cls: "normal",   icon: "✅" };
}

/**
 * Returns a human-readable BP classification label for the current language.
 * @param {string} key - Classification key
 * @returns {string}
 */
function bpLabel(key) {
  const map = {
    normal:   { bn: "স্বাভাবিক",              en: "Normal"             },
    elevated: { bn: "উচ্চতর",                 en: "Elevated"           },
    high1:    { bn: "উচ্চ রক্তচাপ (পর্যায় ১)",en: "High BP – Stage 1" },
    high2:    { bn: "উচ্চ রক্তচাপ (পর্যায় ২)",en: "High BP – Stage 2" },
    crisis:   { bn: "জরুরি অবস্থা",           en: "Crisis"             },
    low:      { bn: "নিম্ন রক্তচাপ",          en: "Hypotension"        },
  };
  return (map[key] && map[key][htLang]) || key;
}

/* ============================================================================
 * 6. BLOOD-GLUCOSE CLASSIFICATION ENGINE
 * ============================================================================ */

/**
 * Classifies a blood glucose reading per ADA 2024 guidelines.
 * @param {number} val - Blood glucose (mg/dL)
 * @param {"fasting"|"postmeal"|"random"} timing
 * @returns {{ key: string, label: string, cls: string, icon: string }}
 */
function classifyBG(val, timing) {
  const ranges = BG_RANGES[timing] || BG_RANGES.random;
  for (const r of [...ranges].reverse()) {
    if (val >= r.min) {
      return {
        key:   r.key,
        label: htLang === "bn" ? r.label_bn : r.label_en,
        cls:   r.cls,
        icon:  r.icon,
      };
    }
  }
  return { key: "unknown", label: "—", cls: "normal", icon: "❓" };
}

/**
 * Returns a timing label for the given timing key.
 * @param {string} timing
 * @returns {string}
 */
function bgTimingLabel(timing) {
  const map = {
    fasting:  { bn: "খালি পেটে",    en: "Fasting"   },
    postmeal: { bn: "খাবার পরে",    en: "Post-meal" },
    random:   { bn: "যেকোনো সময়",  en: "Random"    },
  };
  return (map[timing] && map[timing][htLang]) || timing;
}

/* ============================================================================
 * 7. FORM HANDLING — BLOOD PRESSURE ENTRY
 * ============================================================================ */

/** Active preview record for the BP form */
let bpPreview = null;

/**
 * Validates the BP entry form.
 * @returns {boolean} True if all fields are valid.
 */
function validateBPForm() {
  let valid = true;

  const sys  = parseFloat($("bpSystolic")?.value);
  const dia  = parseFloat($("bpDiastolic")?.value);
  const pulse = parseFloat($("bpPulse")?.value);

  const sysErr  = $("errBpSys");
  const diaErr  = $("errBpDia");
  const pulErr  = $("errBpPulse");

  // Systolic
  if (isNaN(sys) || sys < 60 || sys > 250) {
    if (sysErr) sysErr.textContent = ht("errSysRange");
    $("bpSystolic")?.classList.add("has-error");
    valid = false;
  } else {
    if (sysErr) sysErr.textContent = "";
    $("bpSystolic")?.classList.remove("has-error");
  }

  // Diastolic
  if (isNaN(dia) || dia < 40 || dia > 150) {
    if (diaErr) diaErr.textContent = ht("errDiaRange");
    $("bpDiastolic")?.classList.add("has-error");
    valid = false;
  } else {
    if (diaErr) diaErr.textContent = "";
    $("bpDiastolic")?.classList.remove("has-error");
  }

  // Pulse (optional)
  if (!isNaN(pulse) && $("bpPulse")?.value !== "" && (pulse < 30 || pulse > 220)) {
    if (pulErr) pulErr.textContent = ht("errPulseRange");
    $("bpPulse")?.classList.add("has-error");
    valid = false;
  } else {
    if (pulErr) pulErr.textContent = "";
    $("bpPulse")?.classList.remove("has-error");
  }

  return valid;
}

/**
 * Handles blood-pressure form submission: validates, classifies, stores.
 * @param {Event} e
 */
function handleBPSubmit(e) {
  e.preventDefault();
  if (!validateBPForm()) return;

  const sys   = parseFloat($("bpSystolic").value);
  const dia   = parseFloat($("bpDiastolic").value);
  const pulse = $("bpPulse").value ? parseFloat($("bpPulse").value) : null;
  const arm   = $("bpArm").value;
  const date  = $("bpDate").value || htNowLocal();
  const notes = $("bpNotes").value.trim();

  const classification = classifyBP(sys, dia);

  /** @type {BPRecord} */
  const record = {
    type: "bp",
    id:   htUUID(),
    date: new Date(date).toISOString(),
    sys, dia, pulse, arm, notes,
    status: classification.key,
  };

  const records = htLoadRecords();
  records.push(record);
  htSaveRecords(records);

  // Update live preview
  bpPreview = { record, classification };
  renderBPPreview();

  // Refresh everything
  renderHistory();
  renderStats();
  renderBPChart();

  htToast(ht("toastBPSaved"), "success", "bi-heart-pulse");

  // Reset form (keep date/arm preference)
  $("bpSystolic").value = "";
  $("bpDiastolic").value = "";
  $("bpPulse").value = "";
  $("bpNotes").value = "";
  $("bpDate").value = htNowLocal();
}

/**
 * Renders the latest BP reading preview below the form.
 */
function renderBPPreview() {
  const wrap = $("bpPreviewWrap");
  if (!wrap || !bpPreview) return;

  const { record, classification } = bpPreview;
  const pulse = record.pulse ? ` · ${record.pulse} ${ht("unitBpm")}` : "";

  wrap.innerHTML = `
    <div class="ht-reading-preview">
      <div class="ht-stat-icon bp">❤️</div>
      <div class="flex-grow-1">
        <div class="ht-stat-label">${ht("bpFormSub")}</div>
        <div class="big-val">${record.sys}/${record.dia}</div>
        <div class="big-unit">${ht("unitMmhg")}${pulse}</div>
      </div>
      <span class="ht-status-chip ${classification.cls}">
        ${classification.icon} ${bpLabel(classification.key)}
      </span>
    </div>`;
}

/* ============================================================================
 * 8. FORM HANDLING — BLOOD GLUCOSE ENTRY
 * ============================================================================ */

/** Active preview record for the BG form */
let bgPreview = null;

/**
 * Validates the BG entry form.
 * @returns {boolean}
 */
function validateBGForm() {
  const val = parseFloat($("bgValue")?.value);
  const errEl = $("errBgVal");

  if (isNaN(val) || val < 20 || val > 600) {
    if (errEl) errEl.textContent = ht("errBGRange");
    $("bgValue")?.classList.add("has-error");
    return false;
  }
  if (errEl) errEl.textContent = "";
  $("bgValue")?.classList.remove("has-error");
  return true;
}

/**
 * Handles blood-glucose form submission: validates, classifies, stores.
 * @param {Event} e
 */
function handleBGSubmit(e) {
  e.preventDefault();
  if (!validateBGForm()) return;

  const val    = parseFloat($("bgValue").value);
  const timing = $("bgTiming").value;
  const date   = $("bgDate").value || htNowLocal();
  const notes  = $("bgNotes").value.trim();

  const classification = classifyBG(val, timing);

  /** @type {BGRecord} */
  const record = {
    type: "bg",
    id:   htUUID(),
    date: new Date(date).toISOString(),
    value: val, timing, notes,
    status: classification.key,
  };

  const records = htLoadRecords();
  records.push(record);
  htSaveRecords(records);

  bgPreview = { record, classification };
  renderBGPreview();

  renderHistory();
  renderStats();
  renderBGChart();

  htToast(ht("toastBGSaved"), "success", "bi-droplet-half");

  $("bgValue").value = "";
  $("bgNotes").value = "";
  $("bgDate").value  = htNowLocal();
}

/**
 * Renders the latest BG reading preview below the form.
 */
function renderBGPreview() {
  const wrap = $("bgPreviewWrap");
  if (!wrap || !bgPreview) return;

  const { record, classification } = bgPreview;
  wrap.innerHTML = `
    <div class="ht-reading-preview">
      <div class="ht-stat-icon bg">🩸</div>
      <div class="flex-grow-1">
        <div class="ht-stat-label">${bgTimingLabel(record.timing)}</div>
        <div class="big-val">${record.value}</div>
        <div class="big-unit">${ht("unitMgdl")}</div>
      </div>
      <span class="ht-status-chip ${classification.cls}">
        ${classification.icon} ${classification.label}
      </span>
    </div>`;
}

/* ============================================================================
 * 9. HISTORY LOG — RENDER & PAGINATION
 * ============================================================================ */

/** Current active tab filter: "all" | "bp" | "bg" */
let historyTab = "all";

/** Current page (1-indexed) */
let historyPage = 1;

/**
 * Renders the history table based on current tab and page.
 */
function renderHistory() {
  const records = htLoadRecords();
  const filtered = historyTab === "all"
    ? records
    : records.filter(r => r.type === historyTab);

  const tbody = $("historyTbody");
  const paginInfo = $("paginInfo");
  const paginBtns = $("paginBtns");

  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="ht-empty">
          <span class="ht-empty-icon">📋</span>
          <div class="ht-empty-title">${ht("noHistory")}</div>
          <div class="ht-empty-desc">${ht("noHistorySub")}</div>
        </div>
      </td></tr>`;
    if (paginInfo) paginInfo.textContent = "";
    if (paginBtns) paginBtns.innerHTML = "";
    return;
  }

  // Clamp page
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  if (historyPage > totalPages) historyPage = totalPages;
  const from = (historyPage - 1) * ROWS_PER_PAGE;
  const to   = Math.min(from + ROWS_PER_PAGE, filtered.length);
  const page = filtered.slice(from, to);

  // Render rows
  tbody.innerHTML = page.map((r, idx) => {
    const delay = idx * 40;
    if (r.type === "bp") {
      const cls = classifyBP(r.sys, r.dia);
      const pulse = r.pulse ? ` · ${r.pulse} ${ht("unitBpm")}` : "";
      return `
        <tr style="animation-delay:${delay}ms">
          <td>${htFormatDate(r.date)}</td>
          <td><span class="badge bg-danger-subtle text-danger fw-semibold">❤️ ${ht("tabBP")}</span></td>
          <td><span class="ht-val-bp">${r.sys}/${r.dia}</span><span class="text-muted small ms-1">${ht("unitMmhg")}${pulse}</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${bpLabel(cls.key)}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td><button class="ht-row-del" onclick="htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
            <i class="bi bi-trash3"></i>
          </button></td>
        </tr>`;
    } else {
      const cls = classifyBG(r.value, r.timing);
      return `
        <tr style="animation-delay:${delay}ms">
          <td>${htFormatDate(r.date)}</td>
          <td><span class="badge bg-purple-subtle text-purple fw-semibold" style="background:#ede9fe;color:#6d28d9">🩸 ${ht("tabBG")}</span></td>
          <td><span class="ht-val-bg">${r.value}</span><span class="text-muted small ms-1">${ht("unitMgdl")} · ${bgTimingLabel(r.timing)}</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${cls.label}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td><button class="ht-row-del" onclick="htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
            <i class="bi bi-trash3"></i>
          </button></td>
        </tr>`;
    }
  }).join("");

  // Pagination info
  if (paginInfo) {
    paginInfo.textContent = ht("paginInfo")
      .replace("{from}", from + 1)
      .replace("{to}", to)
      .replace("{total}", filtered.length);
  }

  // Pagination buttons
  if (paginBtns) {
    let btns = `<button class="ht-page-btn" onclick="htChangePage(${historyPage - 1})" ${historyPage <= 1 ? "disabled" : ""}><i class="bi bi-chevron-left"></i></button>`;
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - historyPage) <= 1) {
        btns += `<button class="ht-page-btn ${p === historyPage ? "active" : ""}" onclick="htChangePage(${p})">${p}</button>`;
      } else if (Math.abs(p - historyPage) === 2) {
        btns += `<button class="ht-page-btn" disabled>…</button>`;
      }
    }
    btns += `<button class="ht-page-btn" onclick="htChangePage(${historyPage + 1})" ${historyPage >= totalPages ? "disabled" : ""}><i class="bi bi-chevron-right"></i></button>`;
    paginBtns.innerHTML = btns;
  }
}

/**
 * Changes the history page.
 * @param {number} page
 */
function htChangePage(page) {
  const records  = htLoadRecords();
  const filtered = historyTab === "all" ? records : records.filter(r => r.type === historyTab);
  const total    = Math.ceil(filtered.length / ROWS_PER_PAGE);
  if (page < 1 || page > total) return;
  historyPage = page;
  renderHistory();
}

/**
 * Deletes a record by id after user confirmation.
 * @param {string} id
 */
function htDeleteRecord(id) {
  if (!confirm(ht("confirmDelete"))) return;
  const records = htLoadRecords().filter(r => r.id !== id);
  htSaveRecords(records);
  renderHistory();
  renderStats();
  renderBPChart();
  renderBGChart();
  htToast(ht("toastDeleted"), "info", "bi-trash3");
}

/* ============================================================================
 * 10. SVG CHART ENGINE (pure JS, no external library)
 * ============================================================================ */

/**
 * Returns the last 14 days' worth of records for the given type.
 * @param {"bp"|"bg"} type
 * @returns {(BPRecord|BGRecord)[]} Sorted oldest-first
 */
function getLast14Days(type) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return htLoadRecords()
    .filter(r => r.type === type && new Date(r.date) >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Renders the SVG blood-pressure trend chart.
 */
function renderBPChart() {
  const wrap = $("bpChartWrap");
  if (!wrap) return;

  const data = getLast14Days("bp");

  if (data.length < 2) {
    wrap.innerHTML = `
      <div class="ht-chart-empty">
        <i class="bi bi-graph-up"></i>
        <p>${ht("chartNoData")}<br><span class="small opacity-75">${ht("chartNoDataSub")}</span></p>
      </div>`;
    return;
  }

  wrap.innerHTML = renderLineChart(data, [
    { key: "sys",   color: "var(--ht-systolic)",  label: `${ht("lblSystolic")} (${ht("unitMmhg")})` },
    { key: "dia",   color: "var(--ht-diastolic)", label: `${ht("lblDiastolic")} (${ht("unitMmhg")})` },
    { key: "pulse", color: "var(--ht-pulse)",      label: `${ht("lblPulse")} (${ht("unitBpm")})`,   dashed: true },
  ]);
}

/**
 * Renders the SVG blood-glucose trend chart.
 */
function renderBGChart() {
  const wrap = $("bgChartWrap");
  if (!wrap) return;

  const data = getLast14Days("bg");

  if (data.length < 2) {
    wrap.innerHTML = `
      <div class="ht-chart-empty">
        <i class="bi bi-droplet-half"></i>
        <p>${ht("chartNoData")}<br><span class="small opacity-75">${ht("chartNoDataSub")}</span></p>
      </div>`;
    return;
  }

  wrap.innerHTML = renderLineChart(data, [
    { key: "value", color: "var(--ht-glucose)", label: `${ht("lblGlucose")} (${ht("unitMgdl")})` },
  ]);
}

/**
 * Builds an SVG polyline chart from the given data array.
 * @param {Object[]} data - Array of records
 * @param {{ key: string, color: string, label: string, dashed?: boolean }[]} series
 * @returns {string} SVG HTML string
 */
function renderLineChart(data, series) {
  const W = 600, H = 220, PAD = 40;
  const drawW = W - PAD * 2;
  const drawH = H - PAD * 2;

  // Compute value ranges across all series
  let minVal = Infinity, maxVal = -Infinity;
  data.forEach(d => {
    series.forEach(s => {
      const v = d[s.key];
      if (v != null && !isNaN(v)) {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      }
    });
  });

  if (minVal === Infinity) return "";

  const range = maxVal - minVal || 1;
  minVal = Math.max(0, minVal - range * 0.15);
  maxVal = maxVal + range * 0.15;
  const valRange = maxVal - minVal || 1;

  /**
   * Converts data index + value to SVG (x,y).
   * @param {number} i
   * @param {number} val
   * @returns {{ x: number, y: number }}
   */
  const toXY = (i, val) => ({
    x: PAD + (i / (data.length - 1)) * drawW,
    y: PAD + drawH - ((val - minVal) / valRange) * drawH,
  });

  // Y-axis gridlines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const y = PAD + drawH - t * drawH;
    const v = Math.round(minVal + t * valRange);
    return `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>
            <text x="${PAD - 6}" y="${y + 4}" font-size="9" fill="#94a3b8" text-anchor="end">${v}</text>`;
  }).join("");

  // X-axis labels
  const xLabels = data.map((d, i) => {
    const pt = toXY(i, minVal);
    const date = new Date(d.date);
    const label = `${date.getDate()}/${date.getMonth() + 1}`;
    const show = data.length <= 7 || i === 0 || i === data.length - 1 || i % 2 === 0;
    return show
      ? `<text x="${pt.x}" y="${H - 8}" font-size="9" fill="#94a3b8" text-anchor="middle">${label}</text>`
      : "";
  }).join("");

  // Series polylines + area fills
  const seriesSVG = series.map(s => {
    const pts = data.map((d, i) => {
      const v = d[s.key];
      if (v == null || isNaN(v)) return null;
      return toXY(i, v);
    }).filter(Boolean);

    if (pts.length < 2) return "";

    const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const areaPoints = `${pts[0].x.toFixed(1)},${PAD + drawH} ${polyPoints} ${pts[pts.length-1].x.toFixed(1)},${PAD + drawH}`;
    const dash = s.dashed ? 'stroke-dasharray="6 3"' : "";

    return `
      <polygon points="${areaPoints}" fill="${s.color}" opacity="0.07"/>
      <polyline points="${polyPoints}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" ${dash}/>
      ${pts.map((p, i) => `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${s.color}" stroke="#fff" stroke-width="2"
          data-val="${data[i][s.key]}" data-date="${htFormatDate(data[i].date)}"
          class="ht-chart-dot" style="cursor:pointer"/>
      `).join("")}`;
  }).join("");

  return `
    <svg viewBox="0 0 ${W} ${H}" class="ht-chart-svg" role="img" aria-label="Health trend chart">
      ${gridLines}
      ${xLabels}
      ${seriesSVG}
    </svg>`;
}

/* ============================================================================
 * 11. STATS BANNER — LIVE SUMMARY CALCULATIONS
 * ============================================================================ */

/**
 * Updates the four summary stat cards with current data.
 */
function renderStats() {
  const records = htLoadRecords();
  const bpRecs  = records.filter(r => r.type === "bp");
  const bgRecs  = records.filter(r => r.type === "bg");

  // Latest BP
  const latestBP = bpRecs[0];
  const bpEl     = $("statBPVal");
  const bpSubEl  = $("statBPSub");
  if (bpEl) bpEl.textContent = latestBP ? `${latestBP.sys}/${latestBP.dia}` : ht("statNoData");
  if (bpSubEl) bpSubEl.textContent = latestBP ? `${ht("unitMmhg")} · ${bpLabel(latestBP.status)}` : "";

  // Latest BG
  const latestBG = bgRecs[0];
  const bgEl     = $("statBGVal");
  const bgSubEl  = $("statBGSub");
  if (bgEl) bgEl.textContent = latestBG ? `${latestBG.value}` : ht("statNoData");
  if (bgSubEl) bgSubEl.textContent = latestBG ? `${ht("unitMgdl")} · ${bgTimingLabel(latestBG.timing)}` : "";

  // Today's records
  const today = new Date().toDateString();
  const todayCount = records.filter(r => new Date(r.date).toDateString() === today).length;
  const todayEl = $("statTodayVal");
  if (todayEl) todayEl.textContent = todayCount;
  const todaySubEl = $("statTodaySub");
  if (todaySubEl) todaySubEl.textContent = `${ht("readings")} ${htFormatDate(new Date().toISOString()).split(",")[0]}`;

  // Streak (consecutive days with at least one record)
  let streak = 0;
  const check = new Date();
  check.setHours(23, 59, 59, 999);
  while (true) {
    const dayStr = check.toDateString();
    const hasRecord = records.some(r => new Date(r.date).toDateString() === dayStr);
    if (!hasRecord) break;
    streak++;
    check.setDate(check.getDate() - 1);
  }
  const streakEl    = $("statStreakVal");
  const streakSubEl = $("statStreakSub");
  if (streakEl)    streakEl.textContent    = streak;
  if (streakSubEl) streakSubEl.textContent = ht("days");

  // Update sparklines
  renderSparklines(bpRecs.slice(0, 10).reverse(), bgRecs.slice(0, 10).reverse());
}

/**
 * Draws animated mini sparkline bars in the stat cards.
 * @param {BPRecord[]} bpRecs
 * @param {BGRecord[]} bgRecs
 */
function renderSparklines(bpRecs, bgRecs) {
  const bpSpark = $("bpSparkline");
  const bgSpark = $("bgSparkline");

  if (bpSpark && bpRecs.length) {
    const vals = bpRecs.map(r => r.sys);
    const mx   = Math.max(...vals);
    bpSpark.innerHTML = vals.map((v, i) => `
      <div class="ht-spark-bar ${i === vals.length - 1 ? "active" : ""}"
        style="height:${Math.round((v / mx) * 24)}px;color:#ef4444;animation-delay:${i * 50}ms"></div>
    `).join("");
  }

  if (bgSpark && bgRecs.length) {
    const vals = bgRecs.map(r => r.value);
    const mx   = Math.max(...vals);
    bgSpark.innerHTML = vals.map((v, i) => `
      <div class="ht-spark-bar ${i === vals.length - 1 ? "active" : ""}"
        style="height:${Math.round((v / mx) * 24)}px;color:#8b5cf6;animation-delay:${i * 50}ms"></div>
    `).join("");
  }
}

/* ============================================================================
 * 12. SHARE & EXPORT ENGINE (CSV, JSON, URL)
 * ============================================================================ */

/**
 * Downloads all records as a CSV file.
 */
function htExportCSV() {
  const records = htLoadRecords();
  if (!records.length) return;

  const rows = [["Type", "Date", "Systolic", "Diastolic", "Pulse", "Glucose", "Timing", "Status", "Notes"]];

  records.forEach(r => {
    if (r.type === "bp") {
      rows.push(["BP", r.date, r.sys, r.dia, r.pulse || "", "", "", bpLabel(r.status), r.notes || ""]);
    } else {
      rows.push(["BG", r.date, "", "", "", r.value, r.timing, r.status, r.notes || ""]);
    }
  });

  const csv    = rows.map(r => r.map(csvEsc).join(",")).join("\n");
  const blob   = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url    = URL.createObjectURL(blob);
  const link   = document.createElement("a");
  link.href    = url;
  link.download = `breathewell-health-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  htToast(ht("toastCSVDone"), "success", "bi-file-earmark-spreadsheet");
}

/**
 * Downloads all records as a JSON file.
 */
function htExportJSON() {
  const records = htLoadRecords();
  if (!records.length) return;

  const json   = JSON.stringify({ exported: new Date().toISOString(), records }, null, 2);
  const blob   = new Blob([json], { type: "application/json" });
  const url    = URL.createObjectURL(blob);
  const link   = document.createElement("a");
  link.href    = url;
  link.download = `breathewell-health-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);

  htToast(ht("toastJSONDone"), "success", "bi-file-earmark-code");
}

/**
 * Generates a compact share URL containing the last 30 records as base64.
 * The URL can be opened on any device with this app to view the data read-only.
 * @returns {string}
 */
function htGenerateShareURL() {
  const records = htLoadRecords().slice(0, 30);
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(records))));
  const base    = window.location.href.split("?")[0];
  return `${base}?view=${payload}`;
}

/**
 * Updates the share link input field with the generated URL.
 */
function htRefreshShareLink() {
  const input = $("shareUrlInput");
  if (input) input.value = htGenerateShareURL();
}

/**
 * Copies the share URL to clipboard.
 */
function htCopyLink() {
  const input = $("shareUrlInput");
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = $("copyLinkBtn");
    if (btn) {
      btn.textContent = ht("btnCopied");
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = ht("btnCopy");
        btn.classList.remove("copied");
      }, 2500);
    }
    htToast(ht("toastCopied"), "success", "bi-clipboard-check");
  }).catch(() => {
    input.select();
    document.execCommand("copy");
    htToast(ht("toastCopied"), "success", "bi-clipboard-check");
  });
}

/**
 * If the URL contains ?view=... data, renders a read-only view.
 */
function htHandleViewMode() {
  const params  = new URLSearchParams(window.location.search);
  const payload = params.get("view");
  if (!payload) return;

  try {
    const records = JSON.parse(decodeURIComponent(escape(atob(payload))));
    const notice  = $("viewModeNotice");
    if (notice) {
      notice.classList.remove("d-none");
      notice.innerHTML = `
        <div class="alert alert-info d-flex align-items-center gap-2 mb-4" role="alert">
          <i class="bi bi-eye-fill fs-5"></i>
          <div>
            <strong>${htLang === "bn" ? "পরিবার দেখার মোড" : "Family View Mode"}</strong> —
            ${htLang === "bn"
              ? `এটি একটি শেয়ার করা ভিউ। মোট <strong>${records.length}</strong>টি রেকর্ড দেখানো হচ্ছে।`
              : `Viewing shared data. <strong>${records.length}</strong> records shown.`}
          </div>
        </div>`;
    }

    // Temporarily load records into view — do NOT persist to localStorage
    const tbody = $("historyTbody");
    if (!tbody) return;

    // Render shared records directly
    tbody.innerHTML = records.slice(0, 30).map((r, idx) => {
      const delay = idx * 30;
      if (r.type === "bp") {
        const cls = classifyBP(r.sys, r.dia);
        return `<tr style="animation-delay:${delay}ms">
          <td>${htFormatDate(r.date)}</td>
          <td><span class="badge bg-danger-subtle text-danger fw-semibold">❤️ BP</span></td>
          <td><span class="ht-val-bp">${r.sys}/${r.dia}</span> <span class="text-muted small">${ht("unitMmhg")}</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${bpLabel(cls.key)}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td></td></tr>`;
      } else {
        const cls = classifyBG(r.value, r.timing);
        return `<tr style="animation-delay:${delay}ms">
          <td>${htFormatDate(r.date)}</td>
          <td><span class="badge fw-semibold" style="background:#ede9fe;color:#6d28d9">🩸 BG</span></td>
          <td><span class="ht-val-bg">${r.value}</span> <span class="text-muted small">${ht("unitMgdl")}</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${cls.label}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td></td></tr>`;
      }
    }).join("");
  } catch {
    /* ignore malformed share URLs */
  }
}

/* ============================================================================
 * 13. FAMILY MONITOR — PIN AUTHENTICATION & VIEW
 * ============================================================================ */

/**
 * Sets or updates the family access PIN.
 */
function htSetPin() {
  const pinEl = $("familyPin");
  if (!pinEl) return;
  const pin = pinEl.value.trim();

  if (!/^\d{4}$/.test(pin)) {
    htToast(ht("errPinFormat"), "error", "bi-exclamation-circle");
    pinEl.classList.add("has-error");
    return;
  }
  pinEl.classList.remove("has-error");

  localStorage.setItem(HT_PIN_KEY, pin);
  htRefreshShareLink();

  const btn = $("setPinBtn");
  if (btn) {
    btn.textContent = ht("pinSetOk");
    setTimeout(() => { btn.textContent = ht("btnResetPin"); }, 2000);
  }
  htToast(ht("toastPinSaved"), "success", "bi-shield-lock");
}

/**
 * Reflects whether a PIN is already saved in the UI.
 */
function htRenderPinStatus() {
  const existing = localStorage.getItem(HT_PIN_KEY);
  const btn = $("setPinBtn");
  const pinEl = $("familyPin");
  if (btn) btn.textContent = existing ? ht("btnResetPin") : ht("btnSetPin");
  if (pinEl && existing) pinEl.placeholder = "••••";
}

/* ============================================================================
 * 14. TOAST NOTIFICATION SYSTEM
 * ============================================================================ */

/** Timeout durations per type (ms) */
const TOAST_DURATION = { success: 3000, error: 5000, info: 3000, warn: 4000 };

/** Icon map per type */
const TOAST_ICONS = { success: "bi-check-circle-fill", error: "bi-exclamation-circle-fill", info: "bi-info-circle-fill", warn: "bi-exclamation-triangle-fill" };

/**
 * Shows a branded toast notification.
 * @param {string} message  - Toast message text
 * @param {"success"|"error"|"info"|"warn"} type
 * @param {string} [iconClass]  - Optional Bootstrap icon class override
 */
function htToast(message, type = "info", iconClass) {
  const stack = $("htToastStack");
  if (!stack) return;

  const toast  = document.createElement("div");
  const icon   = iconClass || TOAST_ICONS[type] || TOAST_ICONS.info;
  toast.className = `ht-toast ${type}`;
  toast.innerHTML = `
    <div class="ht-toast-icon"><i class="bi ${icon}"></i></div>
    <div class="ht-toast-body">
      <p class="ht-toast-ttl">${message}</p>
    </div>`;

  stack.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("ht-toast-out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, TOAST_DURATION[type] || 3000);
}

/* ============================================================================
 * 15. LANGUAGE TOGGLE INTEGRATION
 * ============================================================================ */

/**
 * Sets the application language and re-renders all dynamic content.
 * @param {"bn"|"en"} lang
 */
function htSetLang(lang) {
  htLang = lang;
  localStorage.setItem(HT_LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.body.className = lang;

  // Update all data-i18n elements
  document.querySelectorAll("[data-ht-i18n]").forEach(el => {
    const key = el.dataset.htI18n;
    if (key) el.textContent = ht(key);
  });

  // Update placeholder attributes
  document.querySelectorAll("[data-ht-i18n-ph]").forEach(el => {
    const key = el.dataset.htI18nPh;
    if (key) el.placeholder = ht(key);
  });

  // Update options in selects
  document.querySelectorAll("[data-ht-i18n-opt]").forEach(el => {
    const key = el.dataset.htI18nOpt;
    if (key) el.textContent = ht(key);
  });

  const toggleBtn = $("htLangToggle");
  if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

  // Re-render dynamic sections
  renderStats();
  renderHistory();
  renderBPChart();
  renderBGChart();
  renderBPPreview();
  renderBGPreview();
  htRenderPinStatus();
}

/* ============================================================================
 * 16. APPLICATION BOOTSTRAP & EVENT BINDINGS
 * ============================================================================ */

/** Initialises the health tracker on DOMContentLoaded. */
document.addEventListener("DOMContentLoaded", () => {

  // Set initial date-time inputs to now
  const bpDate = $("bpDate");
  const bgDate = $("bgDate");
  if (bpDate) bpDate.value = htNowLocal();
  if (bgDate) bgDate.value = htNowLocal();

  // Check for view-only mode (family share URL)
  htHandleViewMode();

  // Initial render
  htSetLang(htLang);

  // History tab switching
  document.querySelectorAll(".ht-tab[data-hist-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      historyTab  = btn.dataset.histTab;
      historyPage = 1;
      document.querySelectorAll(".ht-tab[data-hist-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderHistory();
    });
  });

  // BP form
  const bpForm = $("bpForm");
  if (bpForm) bpForm.addEventListener("submit", handleBPSubmit);

  // BG form
  const bgForm = $("bgForm");
  if (bgForm) bgForm.addEventListener("submit", handleBGSubmit);

  // Language toggle
  const htLangBtn = $("htLangToggle");
  if (htLangBtn) {
    htLangBtn.addEventListener("click", () => {
      htSetLang(htLang === "bn" ? "en" : "bn");
    });
  }

  // Export buttons
  const csvBtn  = $("btnExportCSV");
  const jsonBtn = $("btnExportJSON");
  const prtBtn  = $("btnPrint");
  const lnkBtn  = $("btnShareLink");
  const cpyBtn  = $("copyLinkBtn");
  const pinBtn  = $("setPinBtn");

  if (csvBtn)  csvBtn.addEventListener("click",  htExportCSV);
  if (jsonBtn) jsonBtn.addEventListener("click",  htExportJSON);
  if (prtBtn)  prtBtn.addEventListener("click",  () => window.print());
  if (lnkBtn)  lnkBtn.addEventListener("click",  htRefreshShareLink);
  if (cpyBtn)  cpyBtn.addEventListener("click",  htCopyLink);
  if (pinBtn)  pinBtn.addEventListener("click",  htSetPin);

  // Real-time BP live preview on input change
  ["bpSystolic", "bpDiastolic"].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => {
      const sys = parseFloat($("bpSystolic")?.value);
      const dia = parseFloat($("bpDiastolic")?.value);
      if (!isNaN(sys) && !isNaN(dia) && sys >= 60 && dia >= 40) {
        const cls = classifyBP(sys, dia);
        const liveChip = $("bpLiveChip");
        if (liveChip) {
          liveChip.className = `ht-status-chip ${cls.cls}`;
          liveChip.innerHTML = `${cls.icon} ${bpLabel(cls.key)}`;
        }
      } else {
        const liveChip = $("bpLiveChip");
        if (liveChip) liveChip.innerHTML = "";
      }
    });
  });

  // Real-time BG live preview on input change
  const bgValEl   = $("bgValue");
  const bgTimingEl = $("bgTiming");
  if (bgValEl && bgTimingEl) {
    const updateBGChip = () => {
      const val    = parseFloat(bgValEl.value);
      const timing = bgTimingEl.value;
      const liveChip = $("bgLiveChip");
      if (!isNaN(val) && val >= 20 && liveChip) {
        const cls = classifyBG(val, timing);
        liveChip.className = `ht-status-chip ${cls.cls}`;
        liveChip.innerHTML = `${cls.icon} ${cls.label}`;
      } else if (liveChip) {
        liveChip.innerHTML = "";
      }
    };
    bgValEl.addEventListener("input", updateBGChip);
    bgTimingEl.addEventListener("change", updateBGChip);
  }

  // Auto-refresh share link whenever user opens the share section
  htRefreshShareLink();
});

