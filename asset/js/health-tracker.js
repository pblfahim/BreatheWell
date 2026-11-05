/**
 * ============================================================================
 * BreatheWell - Health Tracker Engine (health-tracker.js)
 * ============================================================================
 * Description:
 *   Complete client-side engine for the Day-wise Blood Pressure & Diabetes
 *   (Blood Sugar) Health Tracker. Features real-time diagnostic spectrum
 *   gauges, quick stepper nudge controls, preset pills, interactive SVG
 *   charts with timeframe filters and hover tooltips, one-tap WhatsApp family
 *   sharing, weekly automated health insights, and offline localStorage
 *   persistence with zero server dependence.
 *
 * Table of Contents:
 *   1.  Constants & Configuration
 *   2.  LocalStorage Data Layer
 *   3.  Internationalization (Bengali / English)
 *   4.  Utility Helpers
 *   5.  Blood-Pressure Classification & Diagnostic Advice Engine
 *   6.  Blood-Glucose Classification & Diagnostic Advice Engine
 *   7.  Form Handling & Stepper / Preset Controls
 *   8.  Live Diagnostic Spectrum Gauges
 *   9.  History Log — Render, Live Search & Pagination
 *   10. Interactive SVG Chart Engine with Tooltips & Timeframes
 *   11. Stats Banner & Sparklines
 *   12. Smart Health Insights & Breath Exercise Recommendation
 *   13. Family Direct WhatsApp & Multi-Channel Sharing
 *   14. Family Monitor — PIN Authentication & Read-Only View Mode
 *   15. Toast Notification System & Demo Data Generator
 *   16. Language Toggle Integration
 *   17. Application Bootstrap & Event Bindings
 * ============================================================================
 */

/* ============================================================================
 * 1. CONSTANTS & CONFIGURATION
 * ============================================================================ */

/** localStorage key for all health records */
const HT_KEY = "bw_health_tracker_records";

/** localStorage key for user's family PIN */
const HT_PIN_KEY = "bw_health_tracker_pin";

/** localStorage key for language preference */
const HT_LANG_KEY = "bw_lang";

/** Number of history rows shown per page */
const ROWS_PER_PAGE = 8;

/** Maximum records kept per type to avoid bloating localStorage */
const MAX_RECORDS = 365;

/** Active chart timeframe filter: '7d' | '14d' | '30d' | 'all' */
let currentChartTimeframe = "14d";

/** Active form layout mode: 'all' | 'bp' | 'bg' */
let currentFormMode = "all";

/**
 * Blood-pressure classification thresholds (systolic / diastolic).
 * AHA 2017 guidelines.
 */
const BP_RANGES = [
  { key: "low",      label_bn: "নিম্ন রক্তচাপ",          label_en: "Hypotension",           cls: "low",      icon: "⬇️", sys: [0, 90],    dia: [0, 60]   },
  { key: "normal",   label_bn: "স্বাভাবিক",              label_en: "Normal",                cls: "normal",   icon: "✅", sys: [90, 120],  dia: [60, 80]  },
  { key: "elevated", label_bn: "উচ্চতর",                 label_en: "Elevated",              cls: "elevated", icon: "⚠️", sys: [120, 130], dia: [60, 80]  },
  { key: "high1",    label_bn: "উচ্চ রক্তচাপ (পর্যায় ১)", label_en: "High BP – Stage 1",     cls: "high1",    icon: "🔴", sys: [130, 140], dia: [80, 90]  },
  { key: "high2",    label_bn: "উচ্চ রক্তচাপ (পর্যায় ২)", label_en: "High BP – Stage 2",     cls: "high2",    icon: "🚨", sys: [140, 180], dia: [90, 120] },
  { key: "crisis",   label_bn: "জরুরি অবস্থা",           label_en: "Hypertensive Crisis",   cls: "crisis",   icon: "🆘", sys: [180, 999], dia: [120, 999]},
];

/**
 * Blood-glucose classification (mg/dL).
 * ADA 2024 guidelines.
 */
const BG_RANGES = {
  fasting: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",   label_en: "Hypoglycemia",      cls: "low",      icon: "⬇️", min: 0,   max: 70   },
    { key: "normal",   label_bn: "স্বাভাবিক",            label_en: "Normal",            cls: "normal",   icon: "✅", min: 70,  max: 100  },
    { key: "prediab",  label_bn: "প্রি-ডায়াবেটিস",      label_en: "Pre-diabetes",      cls: "elevated", icon: "⚠️", min: 100, max: 126  },
    { key: "diabetic", label_bn: "ডায়াবেটিস",            label_en: "Diabetes (Fasting)",cls: "high2",    icon: "🚨", min: 126, max: 9999 },
  ],
  postmeal: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",   label_en: "Hypoglycemia",      cls: "low",      icon: "⬇️", min: 0,   max: 70   },
    { key: "normal",   label_bn: "স্বাভাবিক (খাবার পর)", label_en: "Normal (Post-meal)",cls: "normal",   icon: "✅", min: 70,  max: 140  },
    { key: "prediab",  label_bn: "প্রি-ডায়াবেটিস",      label_en: "Pre-diabetes",      cls: "elevated", icon: "⚠️", min: 140, max: 200  },
    { key: "diabetic", label_bn: "ডায়াবেটিস",            label_en: "Diabetes",          cls: "high2",    icon: "🚨", min: 200, max: 9999 },
  ],
  random: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",   label_en: "Hypoglycemia",      cls: "low",      icon: "⬇️", min: 0,   max: 70   },
    { key: "normal",   label_bn: "স্বাভাবিক",            label_en: "Normal (Random)",   cls: "normal",   icon: "✅", min: 70,  max: 140  },
    { key: "prediab",  label_bn: "মধ্যবর্তী",             label_en: "Intermediate",      cls: "elevated", icon: "⚠️", min: 140, max: 200  },
    { key: "diabetic", label_bn: "ডায়াবেটিস সম্ভাব্য",   label_en: "Possible Diabetes", cls: "high2",    icon: "🚨", min: 200, max: 9999 },
  ],
  bedtime: [
    { key: "hypo",     label_bn: "হাইপোগ্লাইসেমিয়া",   label_en: "Hypoglycemia",      cls: "low",      icon: "⬇️", min: 0,   max: 80   },
    { key: "normal",   label_bn: "স্বাভাবিক",            label_en: "Normal (Bedtime)",  cls: "normal",   icon: "✅", min: 80,  max: 140  },
    { key: "prediab",  label_bn: "মধ্যবর্তী",             label_en: "Intermediate",      cls: "elevated", icon: "⚠️", min: 140, max: 180  },
    { key: "diabetic", label_bn: "উচ্চ সুগার",           label_en: "High at Bedtime",   cls: "high2",    icon: "🚨", min: 180, max: 9999 },
  ]
};

/* ============================================================================
 * 2. LOCALSTORAGE DATA LAYER
 * ============================================================================ */

/**
 * Loads all health records from localStorage.
 * @returns {Array<Object>} Sorted newest-first.
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
 * Persists records to localStorage, sorting and capping.
 * @param {Array<Object>} records
 */
function htSaveRecords(records) {
  records.sort((a, b) => new Date(b.date) - new Date(a.date));

  let bpCount = 0;
  let bgCount = 0;
  const trimmed = records.filter(r => {
    if (r.type === "bp") { bpCount++; return bpCount <= MAX_RECORDS; }
    if (r.type === "bg") { bgCount++; return bgCount <= MAX_RECORDS; }
    return true;
  });

  localStorage.setItem(HT_KEY, JSON.stringify(trimmed));
}

/** Generates a lightweight unique ID */
function htUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* ============================================================================
 * 3. INTERNATIONALIZATION (Bengali / English)
 * ============================================================================ */

let htLang = localStorage.getItem(HT_LANG_KEY) || "bn";

const HT_T = {
  bn: {
    pageTitle:        "স্বাস্থ্য পর্যবেক্ষণ",
    pageEyebrow:      "দৈনিক স্বাস্থ্য লগ",
    pageHeadline:     "রক্তচাপ ও ডায়াবেটিস ট্র্যাকার",
    pageSub:          "প্রতিদিনের রক্তচাপ ও ব্লাড সুগার সহজে ট্র্যাক করুন, লাইভ বিশ্লেষণ দেখুন এবং পরিবারকে নিরাপদে পাঠান।",
    heroPillBP:       "রক্তচাপ ট্র্যাকিং",
    heroPillBG:       "সুগার পর্যবেক্ষণ",
    heroPillFamily:   "পারিবারিক সংযোগ",

    quickNavAdd:      "➕ নতুন রিডিং",
    quickNavCharts:   "📈 ট্রেন্ড চার্ট",
    quickNavLog:      "📋 ইতিহাস লগ",
    quickNavShare:    "📲 পরিবারকে পাঠান",
    quickNavDemo:     "🧪 নমুনা ডেটা",

    statBPTitle:      "সর্বশেষ রক্তচাপ",
    statBGTitle:      "সর্বশেষ গ্লুকোজ",
    statTodayTitle:   "আজকের রেকর্ড",
    statStreakTitle:  "ধারাবাহিক দিন",
    statNoData:       "কোনো ডেটা নেই",

    modeAll:          "⚡ উভয় একসাথে",
    modeBP:           "❤️ শুধু রক্তচাপ",
    modeBG:           "🩸 শুধু গ্লুকোজ",

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
    timingFasting:    "খালি পেটে",
    timingPostmeal:   "খাবার ২ ঘণ্টা পর",
    timingRandom:     "যেকোনো সময়",
    timingBedtime:    "ঘুমানোর আগে",
    btnSaveBG:        "গ্লুকোজ সংরক্ষণ করুন",
    unitMgdl:         "mg/dL",

    gaugeTitleBP:     "লাইভ রক্তচাপ স্পেকট্রাম নির্দেশক",
    gaugeTitleBG:     "লাইভ গ্লুকোজ রেঞ্জ নির্দেশক",

    insightTitle:     "সাপ্তাহিক স্বাস্থ্য বিশ্লেষণ ও পরামর্শ",
    insightRelaxTip:  "রক্তচাপ নিয়ন্ত্রণ ও মানসিক স্থিরতা বজায় রাখতে BreatheWell-এর ৪-৭-৮ বা বক্স ব্রিদিং ৫ মিনিট অনুশীলন করতে পারেন।",
    btnStartBreathing:"শ্বাসের অনুশীলন শুরু করুন",

    chartBPTitle:     "রক্তচাপের ধারাবাহিক প্রবণতা",
    chartBGTitle:     "গ্লুকোজের ধারাবাহিক প্রবণতা",
    chartNoData:      "চার্টের জন্য পর্যাপ্ত ডেটা নেই",
    chartNoDataSub:   "কমপক্ষে দুটি রিডিং যোগ করুন",

    tf7d:             "৭ দিন",
    tf14d:            "১৪ দিন",
    tf30d:            "৩০ দিন",
    tfAll:            "সব রেকর্ড",

    historyTitle:     "ইতিহাস ও বিস্তারিত রেকর্ড",
    searchPlaceholder:"তারিখ, মান বা নোট দিয়ে খুঁজুন...",
    tabAll:           "সব",
    tabBP:            "রক্তচাপ",
    tabBG:            "গ্লুকোজ",
    colDate:          "তারিখ ও সময়",
    colType:          "ধরন",
    colValue:         "রিডিং মান",
    colStatus:        "অবস্থা",
    colNotes:         "নোট",
    noHistory:        "এখনো কোনো রেকর্ড নেই",
    noHistorySub:     "উপরের ফর্মে ডেটা যোগ করুন অথবা নমুনা ডেটা দিয়ে দেখুন",
    paginInfo:        "{from}–{to} / {total}টি রেকর্ড",

    shareTitle:       "পরিবারের সাথে শেয়ার ও মনিটরিং",
    shareSub:         "আপনার ছেলে, মেয়ে বা পরিবারের সদস্যরা যেকোনো দূরত্ব থেকে আপনার স্বাস্থ্য পর্যবেক্ষণ করতে পারবেন।",
    btnWhatsAppShare: "ছেলে/মেয়েকে WhatsApp-এ পাঠান",
    btnCopyReport:    "মেসেজ টেক্সট কপি করুন",
    btnCsv:           "CSV ডাউনলোড",
    btnJson:          "JSON ব্যাকআপ",
    btnLink:          "শেয়ার লিংক",
    btnPrint:         "মেডিকেল রিপোর্ট প্রিন্ট",
    btnCopy:          "কপি",
    btnCopied:        "কপি হয়েছে ✓",

    familyTitle:      "পারিবারিক মনিটর লক",
    familyDesc:       "একটি ৪ সংখ্যার পিন সেট করুন। শেয়ার লিংক দিলে পরিবার সদস্যরা শুধু দেখতে পারবেন — কোনো ডেটা পরিবর্তন করতে পারবেন না।",
    pinPlaceholder:   "• • • •",
    btnSetPin:        "পিন সেট করুন",
    btnResetPin:      "পিন পরিবর্তন করুন",
    pinSetOk:         "পিন সেট হয়েছে ✓",

    btnLoadDemo:      "🧪 নমুনা ডেটা যোগ করুন",
    btnClearAll:      "🗑️ সব ডেটা মুছুন",

    toastBPSaved:     "রক্তচাপ সফলভাবে সংরক্ষিত হয়েছে!",
    toastBGSaved:     "রক্তের গ্লুকোজ সংরক্ষিত হয়েছে!",
    toastDeleted:     "রেকর্ড মুছে ফেলা হয়েছে",
    toastCopied:      "লিংক ক্লিপবোর্ডে কপি হয়েছে",
    toastReportCopied:"স্বাস্থ্য রিপোর্ট কপি হয়েছে",
    toastCSVDone:     "CSV ফাইল ডাউনলোড হয়েছে",
    toastJSONDone:    "JSON ফাইল ডাউনলোড হয়েছে",
    toastPinSaved:    "পারিবারিক পিন সংরক্ষিত হয়েছে",
    toastDemoLoaded:  "৭ দিনের নমুনা ডেটা সফলভাবে যোগ হয়েছে!",
    toastAllCleared:  "সব স্বাস্থ্য রেকর্ড মুছে ফেলা হয়েছে।",

    errSysRange:      "সিস্টোলিক মান ৬০–২৫০ এর মধ্যে হওয়া চাই",
    errDiaRange:      "ডায়াস্টোলিক মান ৪০–১৫০ এর মধ্যে হওয়া চাই",
    errBGRange:       "গ্লুকোজ মান ২০–৬০০ এর মধ্যে হওয়া চাই",
    errPulseRange:    "নাড়ির স্পন্দন ৩০–২২০ এর মধ্যে হওয়া চাই",
    errPinFormat:     "পিন অবশ্যই ৪ সংখ্যার হতে হবে",

    confirmDelete:    "এই রেকর্ড মুছে ফেলবেন?",
    confirmClearAll:  "আপনি কি নিশ্চিত যে সব রেকর্ড মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।",
    days:             "দিন",
    readings:         "টি রিডিং",

    crisisAlertTitle: "জরুরি স্বাস্থ্য সতর্কতা!",
    crisisAlertMsg:   "আপনার সর্বশেষ রক্তচাপ বা সুগারের মাত্রা আশঙ্কাজনক সীমায় রয়েছে। অবিলম্বে শান্ত হয়ে বিশ্রাম নিন এবং প্রয়োজনে ডাক্তারের সাথে যোগাযোগ করুন।",

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
    pageSub:          "Effortlessly log blood pressure and sugar levels, view instant diagnostics, and share updates securely with family.",
    heroPillBP:       "BP Tracking",
    heroPillBG:       "Glucose Monitor",
    heroPillFamily:   "Family Connected",

    quickNavAdd:      "➕ Add Reading",
    quickNavCharts:   "📈 Trends & Charts",
    quickNavLog:      "📋 History Log",
    quickNavShare:    "📲 Share Report",
    quickNavDemo:     "🧪 Demo Data",

    statBPTitle:      "Latest BP",
    statBGTitle:      "Latest Glucose",
    statTodayTitle:   "Today's Records",
    statStreakTitle:  "Day Streak",
    statNoData:       "No data",

    modeAll:          "⚡ Side by Side",
    modeBP:           "❤️ BP Only",
    modeBG:           "🩸 Glucose Only",

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
    bgFormSub:        "Diabetes Monitoring (mg/dL)",
    lblGlucose:       "Glucose Value",
    lblTiming:        "Timing",
    timingFasting:    "Fasting",
    timingPostmeal:   "Post-meal (2h)",
    timingRandom:     "Random",
    timingBedtime:    "Bedtime",
    btnSaveBG:        "Save Blood Glucose",
    unitMgdl:         "mg/dL",

    gaugeTitleBP:     "Live BP Spectrum Meter",
    gaugeTitleBG:     "Live Glucose Range Meter",

    insightTitle:     "Weekly Health Insights & Guidance",
    insightRelaxTip:  "To help naturally regulate blood pressure and nervous tension, practice 5 minutes of BreatheWell Relaxing or Box Breathing.",
    btnStartBreathing:"Start Breathing Exercise",

    chartBPTitle:     "Blood Pressure Trends",
    chartBGTitle:     "Blood Glucose Trends",
    chartNoData:      "Not enough data for chart",
    chartNoDataSub:   "Add at least two readings",

    tf7d:             "7 Days",
    tf14d:            "14 Days",
    tf30d:            "30 Days",
    tfAll:            "All",

    historyTitle:     "Detailed History Records",
    searchPlaceholder:"Search by date, value, or notes...",
    tabAll:           "All",
    tabBP:            "Blood Pressure",
    tabBG:            "Glucose",
    colDate:          "Date & Time",
    colType:          "Type",
    colValue:         "Reading Value",
    colStatus:        "Status",
    colNotes:         "Notes",
    noHistory:        "No records yet",
    noHistorySub:     "Add your readings above or explore with sample data",
    paginInfo:        "{from}–{to} of {total} records",

    shareTitle:       "Share with Family",
    shareSub:         "Your son, daughter, or family members can monitor your vital signs remotely from any device.",
    btnWhatsAppShare: "Send Report to Family via WhatsApp",
    btnCopyReport:    "Copy Message Text",
    btnCsv:           "Download CSV",
    btnJson:          "Download JSON",
    btnLink:          "Share Link",
    btnPrint:         "Print Doctor Report",
    btnCopy:          "Copy",
    btnCopied:        "Copied ✓",

    familyTitle:      "Family Monitor Lock",
    familyDesc:       "Set a 4-digit PIN. Anyone opening the share link can only view your readings without altering any data.",
    pinPlaceholder:   "• • • •",
    btnSetPin:        "Set PIN",
    btnResetPin:      "Change PIN",
    pinSetOk:         "PIN saved ✓",

    btnLoadDemo:      "🧪 Load Sample Data",
    btnClearAll:      "🗑️ Clear All Records",

    toastBPSaved:     "Blood pressure saved successfully!",
    toastBGSaved:     "Blood glucose saved successfully!",
    toastDeleted:     "Record deleted",
    toastCopied:      "Link copied to clipboard",
    toastReportCopied:"Health report copied to clipboard",
    toastCSVDone:     "CSV downloaded",
    toastJSONDone:    "JSON downloaded",
    toastPinSaved:    "Family PIN saved",
    toastDemoLoaded:  "7 days of realistic sample data loaded!",
    toastAllCleared:  "All health records cleared.",

    errSysRange:      "Systolic must be between 60–250 mmHg",
    errDiaRange:      "Diastolic must be between 40–150 mmHg",
    errBGRange:       "Glucose must be between 20–600 mg/dL",
    errPulseRange:    "Pulse must be between 30–220 bpm",
    errPinFormat:     "PIN must be exactly 4 digits",

    confirmDelete:    "Delete this record?",
    confirmClearAll:  "Are you sure you want to clear all health records? This action cannot be undone.",
    days:             "days",
    readings:         "readings",

    crisisAlertTitle: "Urgent Health Alert!",
    crisisAlertMsg:   "Your latest reading falls into a critical range. Please rest comfortably and consult a healthcare professional promptly.",

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

function ht(key) {
  return (HT_T[htLang] && HT_T[htLang][key]) || HT_T.bn[key] || key;
}

const $ = id => document.getElementById(id);

function htFormatDate(isoString) {
  const d = new Date(isoString);
  if (isNaN(d)) return "—";
  const opts = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return d.toLocaleString(htLang === "bn" ? "bn-BD" : "en-GB", opts);
}

function htNowLocal() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

function csvEsc(val) {
  const s = String(val ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"` : s;
}

/* ============================================================================
 * 5. BLOOD-PRESSURE CLASSIFICATION & DIAGNOSTIC ADVICE ENGINE
 * ============================================================================ */

function classifyBP(sys, dia) {
  if (sys >= 180 || dia >= 120)
    return { key: "crisis",   label: bpLabel("crisis"),   cls: "crisis",   icon: "🆘", pct: 96 };
  if (sys >= 140 || dia >= 90)
    return { key: "high2",    label: bpLabel("high2"),    cls: "high2",    icon: "🚨", pct: 86 };
  if (sys >= 130 || dia >= 80)
    return { key: "high1",    label: bpLabel("high1"),    cls: "high1",    icon: "🔴", pct: 72 };
  if (sys >= 120 && dia < 80)
    return { key: "elevated", label: bpLabel("elevated"), cls: "elevated", icon: "⚠️", pct: 54 };
  if (sys < 90 || dia < 60)
    return { key: "low",      label: bpLabel("low"),      cls: "low",      icon: "⬇️", pct: 10 };
  return   { key: "normal",   label: bpLabel("normal"),   cls: "normal",   icon: "✅", pct: 32 };
}

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

function getBPAdvice(classificationKey) {
  const adviceMap = {
    normal: {
      bn: "আপনার রক্তচাপ চমৎকার স্বাভাবিক সীমায় রয়েছে (<১২০/৮০)। নিয়মিত হাঁটাহাঁটি ও পর্যাপ্ত ঘুম বজায় রাখুন।",
      en: "Your blood pressure is in the optimal normal range (<120/80). Keep up your healthy lifestyle!"
    },
    elevated: {
      bn: "রক্তচাপ কিছুটা বেশি (১২০-১২৯ সিস্টোলিক)। লবণযুক্ত খাবার কমিয়ে প্রচুর পানি পান করুন ও হালকা বিশ্রাম নিন।",
      en: "Slightly elevated. Consider reducing sodium intake, staying well-hydrated, and resting."
    },
    high1: {
      bn: "উচ্চ রক্তচাপ পর্যায় ১। মানসিক চাপ কমাতে BreatheWell-এর রিল্যাক্সিং বা বক্স ব্রিদিং ৫ মিনিট অনুশীলন করুন।",
      en: "Stage 1 Hypertension. Practice 5 minutes of BreatheWell Relaxing or Box Breathing to reduce stress."
    },
    high2: {
      bn: "উচ্চ রক্তচাপ পর্যায় ২ (≥১৪০/৯০)। নিয়মিত ঔষধ গ্রহণ করুন এবং চিকিৎসকের নির্দেশনা মেনে চলুন।",
      en: "Stage 2 Hypertension. Adhere strictly to your prescribed medication and consult your physician."
    },
    crisis: {
      bn: "জরুরি অবস্থা (≥১৮০/১২০)! অবিলম্বে শান্ত হয়ে বিশ্রাম নিন এবং অবিলম্বে চিকিৎসকের সাথে যোগাযোগ করুন।",
      en: "Hypertensive Crisis (≥180/120)! Rest in a calm position and seek immediate medical care."
    },
    low: {
      bn: "নিম্ন রক্তচাপ (<৯০/৬০)। শরীর দুর্বল লাগলে স্যালাইন বা পর্যাপ্ত তরল খাবার গ্রহণ করুন।",
      en: "Low Blood Pressure. Drink oral fluids, stay hydrated, and avoid abrupt standing."
    }
  };
  return (adviceMap[classificationKey] && adviceMap[classificationKey][htLang]) || "";
}

/* ============================================================================
 * 6. BLOOD-GLUCOSE CLASSIFICATION & DIAGNOSTIC ADVICE ENGINE
 * ============================================================================ */

function classifyBG(val, timing) {
  const ranges = BG_RANGES[timing] || BG_RANGES.random;
  for (const r of [...ranges].reverse()) {
    if (val >= r.min) {
      const pct = Math.min(96, Math.max(8, ((val - 40) / 220) * 100));
      return {
        key:   r.key,
        label: htLang === "bn" ? r.label_bn : r.label_en,
        cls:   r.cls,
        icon:  r.icon,
        pct:   Math.round(pct)
      };
    }
  }
  return { key: "unknown", label: "—", cls: "normal", icon: "❓", pct: 30 };
}

function bgTimingLabel(timing) {
  const map = {
    fasting:  { bn: "খালি পেটে",     en: "Fasting"   },
    postmeal: { bn: "খাবার ২ ঘণ্টা পর",en: "Post-meal" },
    random:   { bn: "যেকোনো সময়",   en: "Random"    },
    bedtime:  { bn: "ঘুমানোর আগে",   en: "Bedtime"   }
  };
  return (map[timing] && map[timing][htLang]) || timing;
}

function getBGAdvice(classificationKey, timing) {
  const adviceMap = {
    normal: {
      bn: "আপনার রক্তের শর্করা স্বাভাবিক মাত্রায় রয়েছে। নিয়মিত সুষম খাদ্য ও ব্যায়াম বজায় রাখুন।",
      en: "Your blood glucose is in the target healthy range. Great job keeping it balanced!"
    },
    prediab: {
      bn: "প্রি-ডায়াবেটিস সীমা নির্দেশ করছে। চিনিযুক্ত খাবার ও কোমল পানীয় এড়িয়ে চলুন এবং প্রতিদিন ৩০ মিনিট হাঁটুন।",
      en: "Pre-diabetes range. Reduce refined carbohydrates, avoid sugary drinks, and walk 30 mins daily."
    },
    diabetic: {
      bn: "শর্করার মাত্রা ডায়াবেটিস সীমার বেশি। সময়মতো ঔষধ বা ইনসুলিন গ্রহণ করুন ও নিয়মিত মনিটর করুন।",
      en: "Elevated glucose level. Take prescribed diabetes medicine on time and track your carbohydrate intake."
    },
    hypo: {
      bn: "হাইপোগ্লাইসেমিয়া (খুব কম শর্করা)! মিষ্টি ফল, শরবত বা গ্লুকোজ গ্রহণ করুন এবং ১৫ মিনিট পর আবার মাপুন।",
      en: "Hypoglycemia (Low blood sugar)! Consume fast-acting sugar or juice immediately and recheck in 15 mins."
    }
  };
  return (adviceMap[classificationKey] && adviceMap[classificationKey][htLang]) || "";
}

/* ============================================================================
 * 7. FORM HANDLING & STEPPER / PRESET CONTROLS
 * ============================================================================ */

let bpPreview = null;
let bgPreview = null;

function validateBPForm() {
  let valid = true;
  const sys  = parseFloat($("bpSystolic")?.value);
  const dia  = parseFloat($("bpDiastolic")?.value);
  const pulse = parseFloat($("bpPulse")?.value);

  const sysErr  = $("errBpSys");
  const diaErr  = $("errBpDia");
  const pulErr  = $("errBpPulse");

  if (isNaN(sys) || sys < 60 || sys > 250) {
    if (sysErr) sysErr.textContent = ht("errSysRange");
    $("bpSystolic")?.classList.add("has-error");
    valid = false;
  } else {
    if (sysErr) sysErr.textContent = "";
    $("bpSystolic")?.classList.remove("has-error");
  }

  if (isNaN(dia) || dia < 40 || dia > 150) {
    if (diaErr) diaErr.textContent = ht("errDiaRange");
    $("bpDiastolic")?.classList.add("has-error");
    valid = false;
  } else {
    if (diaErr) diaErr.textContent = "";
    $("bpDiastolic")?.classList.remove("has-error");
  }

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

function handleBPSubmit(e) {
  e.preventDefault();
  if (!validateBPForm()) return;

  const sys   = parseFloat($("bpSystolic").value);
  const dia   = parseFloat($("bpDiastolic").value);
  const pulse = $("bpPulse").value ? parseFloat($("bpPulse").value) : null;
  const arm   = $("bpArm")?.value || "right";
  const date  = $("bpDate").value || htNowLocal();
  const notes = $("bpNotes").value.trim();

  const classification = classifyBP(sys, dia);

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

  bpPreview = { record, classification };
  renderBPPreview();

  renderHistory();
  renderStats();
  renderBPChart();
  renderInsights();
  checkCrisisAlert(records);

  htToast(ht("toastBPSaved"), "success", "bi-heart-pulse");

  $("bpSystolic").value = "";
  $("bpDiastolic").value = "";
  $("bpPulse").value = "";
  $("bpNotes").value = "";
  $("bpDate").value = htNowLocal();
  updateBPGauge(0, 0);
}

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

function handleBGSubmit(e) {
  e.preventDefault();
  if (!validateBGForm()) return;

  const val    = parseFloat($("bgValue").value);
  const timing = $("bgTiming").value;
  const date   = $("bgDate").value || htNowLocal();
  const notes  = $("bgNotes").value.trim();

  const classification = classifyBG(val, timing);

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
  renderInsights();
  checkCrisisAlert(records);

  htToast(ht("toastBGSaved"), "success", "bi-droplet-half");

  $("bgValue").value = "";
  $("bgNotes").value = "";
  $("bgDate").value  = htNowLocal();
  updateBGGauge(0, timing);
}

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

/** Nudges an input value by step */
function htNudgeInput(id, delta, min = 0, max = 999) {
  const el = $(id);
  if (!el) return;
  let val = parseFloat(el.value);
  if (isNaN(val)) val = delta > 0 ? min : max;
  else val += delta;
  val = Math.max(min, Math.min(max, val));
  el.value = val;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Sets preset values for BP */
function htApplyBPPreset(sys, dia) {
  const sEl = $("bpSystolic");
  const dEl = $("bpDiastolic");
  if (sEl) sEl.value = sys;
  if (dEl) dEl.value = dia;
  if (sEl) sEl.dispatchEvent(new Event("input", { bubbles: true }));
  if (dEl) dEl.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Sets preset values for BG */
function htApplyBGPreset(val, timing) {
  const vEl = $("bgValue");
  const tEl = $("bgTiming");
  if (vEl) vEl.value = val;
  if (tEl && timing) {
    tEl.value = timing;
    htSelectTimingCard(timing);
  }
  if (vEl) vEl.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Selects arm toggle pill */
function htSelectArm(arm) {
  const select = $("bpArm");
  if (select) select.value = arm;
  document.querySelectorAll(".ht-pill-toggle[data-arm]").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.arm === arm);
  });
}

/** Selects glucose timing card */
function htSelectTimingCard(timing) {
  const select = $("bgTiming");
  if (select) select.value = timing;
  document.querySelectorAll(".ht-timing-card[data-timing]").forEach(card => {
    card.classList.toggle("active", card.dataset.timing === timing);
  });
  const val = parseFloat($("bgValue")?.value);
  if (!isNaN(val)) updateBGGauge(val, timing);
}

/* ============================================================================
 * 8. LIVE DIAGNOSTIC SPECTRUM GAUGES
 * ============================================================================ */

function updateBPGauge(sys, dia) {
  const pointer = $("bpGaugePointer");
  const adviceEl = $("bpAdviceBox");
  const chipEl   = $("bpLiveChip");

  if (!sys || !dia || sys < 60 || dia < 40) {
    if (pointer) pointer.style.left = "32%";
    if (adviceEl) adviceEl.innerHTML = `<span class="text-muted">${htLang === "bn" ? "সিস্টোলিক ও ডায়াস্টোলিক মান লিখলে লাইভ স্বাস্থ্য নির্দেশক ও পরামর্শ দেখতে পাবেন।" : "Enter systolic and diastolic values to view live medical diagnostics."}</span>`;
    if (chipEl) chipEl.innerHTML = "";
    return;
  }

  const cls = classifyBP(sys, dia);
  if (pointer) pointer.style.left = `${cls.pct}%`;
  if (chipEl) {
    chipEl.className = `ht-status-chip ${cls.cls}`;
    chipEl.innerHTML = `${cls.icon} ${bpLabel(cls.key)}`;
  }
  if (adviceEl) {
    adviceEl.className = `ht-advice-box ${cls.cls}`;
    adviceEl.innerHTML = `<strong>${cls.icon} ${bpLabel(cls.key)}:</strong> ${getBPAdvice(cls.key)}`;
  }
}

function updateBGGauge(val, timing) {
  const pointer  = $("bgGaugePointer");
  const adviceEl = $("bgAdviceBox");
  const chipEl   = $("bgLiveChip");
  const mmolEl   = $("bgMmolDisplay");

  if (!val || val < 20) {
    if (pointer) pointer.style.left = "35%";
    if (adviceEl) adviceEl.innerHTML = `<span class="text-muted">${htLang === "bn" ? "গ্লুকোজ মান লিখলে লাইভ ডায়াবেটিস রেঞ্জ ও ডায়াগনস্টিক দেখতে পাবেন।" : "Enter glucose reading to view live diabetes range analysis."}</span>`;
    if (chipEl) chipEl.innerHTML = "";
    if (mmolEl) mmolEl.textContent = "—";
    return;
  }

  const cls = classifyBG(val, timing);
  if (pointer) pointer.style.left = `${cls.pct}%`;
  if (chipEl) {
    chipEl.className = `ht-status-chip ${cls.cls}`;
    chipEl.innerHTML = `${cls.icon} ${cls.label}`;
  }
  if (adviceEl) {
    adviceEl.className = `ht-advice-box ${cls.cls}`;
    adviceEl.innerHTML = `<strong>${cls.icon} ${cls.label}:</strong> ${getBGAdvice(cls.key, timing)}`;
  }
  if (mmolEl) {
    const mmol = (val / 18.0182).toFixed(1);
    mmolEl.textContent = `${mmol} mmol/L`;
  }
}

/* ============================================================================
 * 9. HISTORY LOG — RENDER, LIVE SEARCH & PAGINATION
 * ============================================================================ */

let historyTab = "all";
let historyPage = 1;
let historySearch = "";

function renderHistory() {
  const records = htLoadRecords();
  let filtered = historyTab === "all" ? records : records.filter(r => r.type === historyTab);

  if (historySearch) {
    const q = historySearch.toLowerCase();
    filtered = filtered.filter(r => {
      const dateStr = htFormatDate(r.date).toLowerCase();
      const notes = (r.notes || "").toLowerCase();
      const valStr = r.type === "bp" ? `${r.sys}/${r.dia}` : `${r.value}`;
      return dateStr.includes(q) || notes.includes(q) || valStr.includes(q);
    });
  }

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

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  if (historyPage > totalPages) historyPage = totalPages;
  const from = (historyPage - 1) * ROWS_PER_PAGE;
  const to   = Math.min(from + ROWS_PER_PAGE, filtered.length);
  const page = filtered.slice(from, to);

  tbody.innerHTML = page.map((r, idx) => {
    const delay = idx * 30;
    if (r.type === "bp") {
      const cls = classifyBP(r.sys, r.dia);
      const pulse = r.pulse ? ` · ${r.pulse} ${ht("unitBpm")}` : "";
      return `
        <tr style="animation-delay:${delay}ms">
          <td><i class="bi bi-clock me-1 text-muted"></i>${htFormatDate(r.date)}</td>
          <td><span class="badge bg-danger-subtle text-danger fw-bold">❤️ ${ht("tabBP")}</span></td>
          <td><span class="ht-val-bp">${r.sys}/${r.dia}</span> <span class="text-muted small">${ht("unitMmhg")}${pulse}</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${bpLabel(cls.key)}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td>
            <button class="ht-row-del" onclick="htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>`;
    } else {
      const cls = classifyBG(r.value, r.timing);
      const mmol = (r.value / 18.0182).toFixed(1);
      return `
        <tr style="animation-delay:${delay}ms">
          <td><i class="bi bi-clock me-1 text-muted"></i>${htFormatDate(r.date)}</td>
          <td><span class="badge bg-purple-subtle text-purple fw-bold" style="background:#ede9fe;color:#6d28d9">🩸 ${ht("tabBG")}</span></td>
          <td><span class="ht-val-bg">${r.value}</span> <span class="text-muted small">${ht("unitMgdl")} (${mmol} mmol/L)</span></td>
          <td><span class="ht-status-chip ${cls.cls}">${cls.icon} ${cls.label}</span></td>
          <td class="text-muted small">${r.notes || "—"}</td>
          <td>
            <button class="ht-row-del" onclick="htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>`;
    }
  }).join("");

  if (paginInfo) {
    paginInfo.textContent = ht("paginInfo")
      .replace("{from}", from + 1)
      .replace("{to}", to)
      .replace("{total}", filtered.length);
  }

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

function htChangePage(page) {
  const records  = htLoadRecords();
  const filtered = historyTab === "all" ? records : records.filter(r => r.type === historyTab);
  const total    = Math.ceil(filtered.length / ROWS_PER_PAGE);
  if (page < 1 || page > total) return;
  historyPage = page;
  renderHistory();
}

function htDeleteRecord(id) {
  if (!confirm(ht("confirmDelete"))) return;
  const records = htLoadRecords().filter(r => r.id !== id);
  htSaveRecords(records);
  renderHistory();
  renderStats();
  renderBPChart();
  renderBGChart();
  renderInsights();
  checkCrisisAlert(records);
  htToast(ht("toastDeleted"), "info", "bi-trash3");
}

function htClearAllRecords() {
  if (!confirm(ht("confirmClearAll"))) return;
  localStorage.removeItem(HT_KEY);
  renderHistory();
  renderStats();
  renderBPChart();
  renderBGChart();
  renderInsights();
  checkCrisisAlert([]);
  htToast(ht("toastAllCleared"), "info", "bi-trash3");
}

/* ============================================================================
 * 10. INTERACTIVE SVG CHART ENGINE WITH TOOLTIPS & TIMEFRAMES
 * ============================================================================ */

function getFilteredChartRecords(type) {
  const all = htLoadRecords().filter(r => r.type === type);
  if (currentChartTimeframe === "all") {
    return all.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  const days = parseInt(currentChartTimeframe, 10) || 14;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return all
    .filter(r => new Date(r.date) >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderBPChart() {
  const wrap = $("bpChartWrap");
  if (!wrap) return;

  const data = getFilteredChartRecords("bp");

  if (data.length < 2) {
    wrap.innerHTML = `
      <div class="ht-chart-empty">
        <i class="bi bi-graph-up text-danger"></i>
        <p>${ht("chartNoData")}<br><span class="small opacity-75">${ht("chartNoDataSub")}</span></p>
      </div>`;
    return;
  }

  wrap.innerHTML = renderLineChart(data, [
    { key: "sys",   color: "var(--ht-systolic)",  label: `${ht("lblSystolic")} (${ht("unitMmhg")})` },
    { key: "dia",   color: "var(--ht-diastolic)", label: `${ht("lblDiastolic")} (${ht("unitMmhg")})` },
    { key: "pulse", color: "var(--ht-pulse)",     label: `${ht("lblPulse")} (${ht("unitBpm")})`, dashed: true },
  ], "bp");
}

function renderBGChart() {
  const wrap = $("bgChartWrap");
  if (!wrap) return;

  const data = getFilteredChartRecords("bg");

  if (data.length < 2) {
    wrap.innerHTML = `
      <div class="ht-chart-empty">
        <i class="bi bi-droplet-half text-purple" style="color:#8b5cf6"></i>
        <p>${ht("chartNoData")}<br><span class="small opacity-75">${ht("chartNoDataSub")}</span></p>
      </div>`;
    return;
  }

  wrap.innerHTML = renderLineChart(data, [
    { key: "value", color: "var(--ht-glucose)", label: `${ht("lblGlucose")} (${ht("unitMgdl")})` },
  ], "bg");
}

function renderLineChart(data, series, chartType) {
  const W = 620, H = 230, PAD = 42;
  const drawW = W - PAD * 2;
  const drawH = H - PAD * 2;

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

  const toXY = (i, val) => ({
    x: PAD + (i / Math.max(1, data.length - 1)) * drawW,
    y: PAD + drawH - ((val - minVal) / valRange) * drawH,
  });

  // Target safe zone shaded band
  let targetBand = "";
  if (chartType === "bp") {
    // Normal systolic: 90-120
    const yTop = toXY(0, Math.min(maxVal, 120)).y;
    const yBtm = toXY(0, Math.max(minVal, 90)).y;
    if (yBtm > yTop) {
      targetBand = `<rect x="${PAD}" y="${yTop}" width="${drawW}" height="${yBtm - yTop}" fill="#22c55e" opacity="0.08"/>
                    <text x="${W - PAD - 4}" y="${yTop + 12}" font-size="8.5" fill="#16a34a" font-weight="bold" text-anchor="end">Safe Zone (90–120)</text>`;
    }
  } else if (chartType === "bg") {
    // Normal fasting/random: 70-140
    const yTop = toXY(0, Math.min(maxVal, 140)).y;
    const yBtm = toXY(0, Math.max(minVal, 70)).y;
    if (yBtm > yTop) {
      targetBand = `<rect x="${PAD}" y="${yTop}" width="${drawW}" height="${yBtm - yTop}" fill="#22c55e" opacity="0.08"/>
                    <text x="${W - PAD - 4}" y="${yTop + 12}" font-size="8.5" fill="#16a34a" font-weight="bold" text-anchor="end">Target Range (70–140)</text>`;
    }
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const y = PAD + drawH - t * drawH;
    const v = Math.round(minVal + t * valRange);
    return `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>
            <text x="${PAD - 6}" y="${y + 4}" font-size="9" fill="#94a3b8" text-anchor="end">${v}</text>`;
  }).join("");

  const xLabels = data.map((d, i) => {
    const pt = toXY(i, minVal);
    const date = new Date(d.date);
    const label = `${date.getDate()}/${date.getMonth() + 1}`;
    const show = data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0;
    return show
      ? `<text x="${pt.x}" y="${H - 10}" font-size="9" fill="#94a3b8" text-anchor="middle">${label}</text>`
      : "";
  }).join("");

  const seriesSVG = series.map(s => {
    const pts = data.map((d, i) => {
      const v = d[s.key];
      if (v == null || isNaN(v)) return null;
      return toXY(i, v);
    }).filter(Boolean);

    if (pts.length < 2) return "";

    const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const areaPoints = `${pts[0].x.toFixed(1)},${PAD + drawH} ${polyPoints} ${pts[pts.length-1].x.toFixed(1)},${PAD + drawH}`;
    const dash = s.dashed ? 'stroke-dasharray="5 3"' : "";

    const dots = pts.map((p, i) => {
      const d = data[i];
      const valText = chartType === "bp"
        ? `${d.sys}/${d.dia} mmHg${d.pulse ? " (" + d.pulse + " bpm)" : ""}`
        : `${d.value} mg/dL (${bgTimingLabel(d.timing)})`;
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${s.color}" stroke="#fff" stroke-width="2"
        data-chart-tooltip="${valText} · ${htFormatDate(d.date)}"
        class="ht-chart-dot" style="cursor:pointer"/>`;
    }).join("");

    return `
      <polygon points="${areaPoints}" fill="${s.color}" opacity="0.08"/>
      <polyline points="${polyPoints}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${dash}/>
      ${dots}`;
  }).join("");

  return `
    <svg viewBox="0 0 ${W} ${H}" class="ht-chart-svg" role="img" aria-label="Health trend chart">
      ${targetBand}
      ${gridLines}
      ${xLabels}
      ${seriesSVG}
    </svg>
    <div class="ht-chart-tooltip" id="chartTooltip_${chartType}"></div>`;
}

function bindChartTooltips() {
  document.querySelectorAll(".ht-chart-svg-wrap").forEach(wrap => {
    const tooltip = wrap.querySelector(".ht-chart-tooltip");
    if (!tooltip) return;

    wrap.addEventListener("mousemove", e => {
      const dot = e.target.closest(".ht-chart-dot");
      if (dot && dot.dataset.chartTooltip) {
        const wrapRect = wrap.getBoundingClientRect();
        const x = e.clientX - wrapRect.left;
        const y = e.clientY - wrapRect.top;
        tooltip.textContent = dot.dataset.chartTooltip;
        tooltip.style.left = `${x}px`;
        tooltip.style.top  = `${y}px`;
        tooltip.classList.add("visible");
      } else {
        tooltip.classList.remove("visible");
      }
    });

    wrap.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
}

function htSetChartTimeframe(tf) {
  currentChartTimeframe = tf;
  document.querySelectorAll(".ht-chart-tf-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tf === tf);
  });
  renderBPChart();
  renderBGChart();
  bindChartTooltips();
}

/* ============================================================================
 * 11. STATS BANNER & SPARKLINES
 * ============================================================================ */

function renderStats() {
  const records = htLoadRecords();
  const bpRecs  = records.filter(r => r.type === "bp");
  const bgRecs  = records.filter(r => r.type === "bg");

  const latestBP = bpRecs[0];
  const bpEl     = $("statBPVal");
  const bpSubEl  = $("statBPSub");
  const bpBadge  = $("statBPBadge");
  if (bpEl) bpEl.textContent = latestBP ? `${latestBP.sys}/${latestBP.dia}` : ht("statNoData");
  if (bpSubEl) bpSubEl.textContent = latestBP ? `${ht("unitMmhg")} · ${htFormatDate(latestBP.date).split(",")[0]}` : "";
  if (bpBadge) {
    if (latestBP) {
      const cls = classifyBP(latestBP.sys, latestBP.dia);
      bpBadge.className = `ht-stat-badge ${cls.cls === "normal" ? "normal" : cls.cls === "elevated" ? "elevated" : "high"}`;
      bpBadge.textContent = bpLabel(cls.key);
    } else {
      bpBadge.className = "ht-stat-badge neutral";
      bpBadge.textContent = "—";
    }
  }

  const latestBG = bgRecs[0];
  const bgEl     = $("statBGVal");
  const bgSubEl  = $("statBGSub");
  const bgBadge  = $("statBGBadge");
  if (bgEl) bgEl.textContent = latestBG ? `${latestBG.value}` : ht("statNoData");
  if (bgSubEl) bgSubEl.textContent = latestBG ? `${ht("unitMgdl")} · ${bgTimingLabel(latestBG.timing)}` : "";
  if (bgBadge) {
    if (latestBG) {
      const cls = classifyBG(latestBG.value, latestBG.timing);
      bgBadge.className = `ht-stat-badge ${cls.cls === "normal" ? "normal" : cls.cls === "elevated" ? "elevated" : "high"}`;
      bgBadge.textContent = cls.label;
    } else {
      bgBadge.className = "ht-stat-badge neutral";
      bgBadge.textContent = "—";
    }
  }

  const today = new Date().toDateString();
  const todayCount = records.filter(r => new Date(r.date).toDateString() === today).length;
  const todayEl = $("statTodayVal");
  if (todayEl) todayEl.textContent = todayCount;
  const todaySubEl = $("statTodaySub");
  if (todaySubEl) todaySubEl.textContent = `${ht("readings")} · ${todayCount > 0 ? "আপডেট করা হয়েছে" : "আজকে মাপুন"}`;

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
  if (streakSubEl) streakSubEl.textContent = streak > 0 ? `${streak} ${ht("days")} সক্রিয়` : "শুরু করুন";

  renderSparklines(bpRecs.slice(0, 10).reverse(), bgRecs.slice(0, 10).reverse());
}

function renderSparklines(bpRecs, bgRecs) {
  const bpSpark = $("bpSparkline");
  const bgSpark = $("bgSparkline");

  if (bpSpark && bpRecs.length) {
    const vals = bpRecs.map(r => r.sys);
    const mx   = Math.max(...vals, 140);
    bpSpark.innerHTML = vals.map((v, i) => `
      <div class="ht-spark-bar ${i === vals.length - 1 ? "active" : ""}"
        style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#ef4444;"></div>
    `).join("");
  }

  if (bgSpark && bgRecs.length) {
    const vals = bgRecs.map(r => r.value);
    const mx   = Math.max(...vals, 180);
    bgSpark.innerHTML = vals.map((v, i) => `
      <div class="ht-spark-bar ${i === vals.length - 1 ? "active" : ""}"
        style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#8b5cf6;"></div>
    `).join("");
  }
}

/* ============================================================================
 * 12. SMART HEALTH INSIGHTS & BREATH EXERCISE RECOMMENDATION
 * ============================================================================ */

function renderInsights() {
  const card = $("smartInsightCard");
  if (!card) return;

  const records = htLoadRecords();
  if (records.length === 0) {
    card.classList.add("d-none");
    return;
  }
  card.classList.remove("d-none");

  // Calculate 7-day stats
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const weekRecs = records.filter(r => new Date(r.date) >= cutoff);

  const bpWeek = weekRecs.filter(r => r.type === "bp");
  const bgWeek = weekRecs.filter(r => r.type === "bg");

  let avgSys = 0, avgDia = 0, avgBG = 0;
  if (bpWeek.length) {
    avgSys = Math.round(bpWeek.reduce((s, r) => s + r.sys, 0) / bpWeek.length);
    avgDia = Math.round(bpWeek.reduce((s, r) => s + r.dia, 0) / bpWeek.length);
  }
  if (bgWeek.length) {
    avgBG = Math.round(bgWeek.reduce((s, r) => s + r.value, 0) / bgWeek.length);
  }

  const chipsEl = $("insightChips");
  if (chipsEl) {
    chipsEl.innerHTML = `
      ${bpWeek.length ? `<span class="ht-insight-chip"><i class="bi bi-heart-pulse text-danger"></i> ৭ দিনের গড় রক্তচাপ: ${avgSys}/${avgDia} mmHg</span>` : ""}
      ${bgWeek.length ? `<span class="ht-insight-chip"><i class="bi bi-droplet text-purple" style="color:#8b5cf6"></i> ৭ দিনের গড় গ্লুকোজ: ${avgBG} mg/dL</span>` : ""}
      <span class="ht-insight-chip"><i class="bi bi-check-circle text-success"></i> মোট এন্ট্রি: ${weekRecs.length}টি</span>
    `;
  }

  const bodyEl = $("insightBodyText");
  if (bodyEl) {
    if (avgSys >= 135 || avgDia >= 88) {
      bodyEl.textContent = htLang === "bn"
        ? "গত ৭ দিনের হিসেবে আপনার রক্তচাপ কিছুটা উচ্চতর প্রবণতা দেখাচ্ছে। প্রতিদিন নিয়মিত ৫ মিনিট ধীর ও শান্ত শ্বাসচর্চা হৃদস্পন্দন স্বাভাবিক রাখতে অত্যন্ত সহায়ক।"
        : "Your average blood pressure over the last 7 days is slightly elevated. A daily 5-minute deep breathing session significantly supports autonomic regulation.";
    } else {
      bodyEl.textContent = htLang === "bn"
        ? "চমৎকার! আপনার সাম্প্রতিক রিডিংগুলো সার্বিকভাবে নিয়ন্ত্রিত ও ইতিবাচক অবস্থায় রয়েছে। এই সুস্থ রুটিন বজায় রাখুন।"
        : "Great job! Your recent health readings are well-balanced and stable. Keep maintaining this healthy routine.";
    }
  }
}

function checkCrisisAlert(records) {
  const alertEl = $("crisisAlertBanner");
  if (!alertEl) return;

  const latestBP = records.find(r => r.type === "bp");
  const latestBG = records.find(r => r.type === "bg");

  const bpCrisis = latestBP && (latestBP.sys >= 180 || latestBP.dia >= 120);
  const bgCrisis = latestBG && (latestBG.value <= 50 || latestBG.value >= 350);

  if (bpCrisis || bgCrisis) {
    alertEl.classList.remove("d-none");
  } else {
    alertEl.classList.add("d-none");
  }
}

/* ============================================================================
 * 13. FAMILY DIRECT WHATSAPP & MULTI-CHANNEL SHARING
 * ============================================================================ */

function generateFormattedHealthReport() {
  const records = htLoadRecords();
  const latestBP = records.find(r => r.type === "bp");
  const latestBG = records.find(r => r.type === "bg");

  const dateNow = new Date().toLocaleDateString(htLang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const bpText = latestBP
    ? `${latestBP.sys}/${latestBP.dia} mmHg (${bpLabel(latestBP.status)})`
    : "রেকর্ড নেই / No entry";

  const bgText = latestBG
    ? `${latestBG.value} mg/dL (${bgTimingLabel(latestBG.timing)})`
    : "রেকর্ড নেই / No entry";

  const shareLink = htGenerateShareURL();

  if (htLang === "bn") {
    return `🏥 BreatheWell স্বাস্থ্য রিপোর্ট
━━━━━━━━━━━━━━━━━━━━
📅 তারিখ: ${dateNow}

❤️ রক্তচাপ: ${bpText}
🩸 ব্লাড সুগার: ${bgText}

📊 সম্পূর্ণ চার্ট ও রিপোর্ট দেখুন:
${shareLink}
━━━━━━━━━━━━━━━━━━━━
প্রতিদিনের নিঃশ্বাসে একটু প্রশান্তি — BreatheWell`;
  } else {
    return `🏥 BreatheWell Health Update
━━━━━━━━━━━━━━━━━━━━
📅 Date: ${dateNow}

❤️ Blood Pressure: ${bpText}
🩸 Blood Glucose: ${bgText}

📊 View full history & charts:
${shareLink}
━━━━━━━━━━━━━━━━━━━━
A little calm with every breath — BreatheWell`;
  }
}

function htShareWhatsApp() {
  const msg = generateFormattedHealthReport();
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function htCopyFormattedReport() {
  const msg = generateFormattedHealthReport();
  navigator.clipboard.writeText(msg).then(() => {
    htToast(ht("toastReportCopied"), "success", "bi-whatsapp");
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = msg;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    htToast(ht("toastReportCopied"), "success", "bi-whatsapp");
  });
}

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

function htGenerateShareURL() {
  const records = htLoadRecords().slice(0, 30);
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(records))));
  const base    = window.location.href.split("?")[0];
  return `${base}?view=${payload}`;
}

function htRefreshShareLink() {
  const input = $("shareUrlInput");
  if (input) input.value = htGenerateShareURL();

  const msgBox = $("whatsappMsgPreview");
  if (msgBox) msgBox.textContent = generateFormattedHealthReport();
}

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
              ? `এটি একটি শেয়ার করা লাইভ ভিউ। মোট <strong>${records.length}</strong>টি রেকর্ড দেখানো হচ্ছে।`
              : `Viewing shared data. <strong>${records.length}</strong> records shown.`}
          </div>
        </div>`;
    }
  } catch {
    /* ignore */
  }
}

/* ============================================================================
 * 14. FAMILY MONITOR — PIN AUTHENTICATION & VIEW
 * ============================================================================ */

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

function htRenderPinStatus() {
  const existing = localStorage.getItem(HT_PIN_KEY);
  const btn = $("setPinBtn");
  const pinEl = $("familyPin");
  if (btn) btn.textContent = existing ? ht("btnResetPin") : ht("btnSetPin");
  if (pinEl && existing) pinEl.placeholder = "••••";
}

/* ============================================================================
 * 15. TOAST NOTIFICATION SYSTEM & DEMO DATA GENERATOR
 * ============================================================================ */

const TOAST_DURATION = { success: 3200, error: 5000, info: 3200, warn: 4200 };
const TOAST_ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-circle-fill",
  info: "bi-info-circle-fill",
  warn: "bi-exclamation-triangle-fill"
};

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
  }, TOAST_DURATION[type] || 3200);
}

/** Loads 7 days of realistic demo records */
function htLoadDemoData() {
  const demo = [];
  const now = new Date();

  const bpSamples = [
    { sys: 118, dia: 76, pulse: 72, notes: "সকালে ঘুম থেকে উঠে স্বাভাবিক" },
    { sys: 122, dia: 80, pulse: 75, notes: "ব্যায়ামের পর" },
    { sys: 126, dia: 82, pulse: 74, notes: "অফিসের কাজের পর" },
    { sys: 119, dia: 78, pulse: 70, notes: "বিশ্রামের পর" },
    { sys: 132, dia: 84, pulse: 78, notes: "চা খাওয়ার পর" },
    { sys: 120, dia: 79, pulse: 71, notes: "সন্ধ্যায় হাঁটাহাঁটির পর" },
    { sys: 116, dia: 75, pulse: 68, notes: "ছুটির দিন সকালে" },
  ];

  const bgSamples = [
    { value: 92,  timing: "fasting",  notes: "খালি পেটে পরিমাপ" },
    { value: 135, timing: "postmeal", notes: "দুপুরের খাবারের ২ ঘণ্টা পর" },
    { value: 98,  timing: "fasting",  notes: "সকালের রিডিং" },
    { value: 142, timing: "postmeal", notes: "রাতের খাবারের পর" },
    { value: 88,  timing: "fasting",  notes: "নিয়ন্ত্রিত সুগার" },
    { value: 128, timing: "random",   notes: "বিকালে পরিমাপ" },
    { value: 94,  timing: "bedtime",  notes: "ঘুমানোর আগে" },
  ];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    // Morning BP
    const bp = bpSamples[6 - i];
    d.setHours(8, 15, 0, 0);
    demo.push({
      type: "bp",
      id: htUUID(),
      date: d.toISOString(),
      sys: bp.sys,
      dia: bp.dia,
      pulse: bp.pulse,
      arm: "right",
      notes: bp.notes,
      status: classifyBP(bp.sys, bp.dia).key
    });

    // Fasting / Postmeal BG
    const bg = bgSamples[6 - i];
    d.setHours(10, 30, 0, 0);
    demo.push({
      type: "bg",
      id: htUUID(),
      date: d.toISOString(),
      value: bg.value,
      timing: bg.timing,
      notes: bg.notes,
      status: classifyBG(bg.value, bg.timing).key
    });
  }

  htSaveRecords(demo);
  renderHistory();
  renderStats();
  renderBPChart();
  renderBGChart();
  renderInsights();
  bindChartTooltips();
  checkCrisisAlert(demo);
  htRefreshShareLink();

  htToast(ht("toastDemoLoaded"), "success", "bi-magic");
}

/* ============================================================================
 * 16. LANGUAGE TOGGLE INTEGRATION
 * ============================================================================ */

function htSetLang(lang) {
  htLang = lang;
  localStorage.setItem(HT_LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.body.className = lang;

  document.querySelectorAll("[data-ht-i18n]").forEach(el => {
    const key = el.dataset.htI18n;
    if (key) el.textContent = ht(key);
  });

  document.querySelectorAll("[data-ht-i18n-ph]").forEach(el => {
    const key = el.dataset.htI18nPh;
    if (key) el.placeholder = ht(key);
  });

  document.querySelectorAll("[data-ht-i18n-opt]").forEach(el => {
    const key = el.dataset.htI18nOpt;
    if (key) el.textContent = ht(key);
  });

  const toggleBtn = $("htLangToggle");
  if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

  renderStats();
  renderHistory();
  renderBPChart();
  renderBGChart();
  bindChartTooltips();
  renderBPPreview();
  renderBGPreview();
  renderInsights();
  htRenderPinStatus();
  htRefreshShareLink();
}

/** Form mode switch: 'all' | 'bp' | 'bg' */
function htSetFormMode(mode) {
  currentFormMode = mode;
  document.querySelectorAll(".ht-mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const colBP = $("colBPForm");
  const colBG = $("colBGForm");

  if (!colBP || !colBG) return;

  if (mode === "all") {
    colBP.className = "col-lg-6";
    colBG.className = "col-lg-6";
    colBP.classList.remove("d-none");
    colBG.classList.remove("d-none");
  } else if (mode === "bp") {
    colBP.className = "col-lg-8 mx-auto";
    colBP.classList.remove("d-none");
    colBG.classList.add("d-none");
  } else if (mode === "bg") {
    colBG.className = "col-lg-8 mx-auto";
    colBG.classList.remove("d-none");
    colBP.classList.add("d-none");
  }
}

/* ============================================================================
 * 17. APPLICATION BOOTSTRAP & EVENT BINDINGS
 * ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const bpDate = $("bpDate");
  const bgDate = $("bgDate");
  if (bpDate) bpDate.value = htNowLocal();
  if (bgDate) bgDate.value = htNowLocal();

  htHandleViewMode();
  htSetLang(htLang);
  bindChartTooltips();
  renderInsights();
  checkCrisisAlert(htLoadRecords());

  // History Tab Switching
  document.querySelectorAll(".ht-tab[data-hist-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      historyTab  = btn.dataset.histTab;
      historyPage = 1;
      document.querySelectorAll(".ht-tab[data-hist-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderHistory();
    });
  });

  // History Search
  const searchInput = $("historySearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      historySearch = e.target.value.trim();
      historyPage = 1;
      renderHistory();
    });
  }

  // Form Mode Switcher
  document.querySelectorAll(".ht-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      htSetFormMode(btn.dataset.mode);
    });
  });

  // Chart Timeframe Switcher
  document.querySelectorAll(".ht-chart-tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      htSetChartTimeframe(btn.dataset.tf);
    });
  });

  // Arm Pills
  document.querySelectorAll(".ht-pill-toggle[data-arm]").forEach(pill => {
    pill.addEventListener("click", () => {
      htSelectArm(pill.dataset.arm);
    });
  });

  // Timing Cards
  document.querySelectorAll(".ht-timing-card[data-timing]").forEach(card => {
    card.addEventListener("click", () => {
      htSelectTimingCard(card.dataset.timing);
    });
  });

  // Forms
  const bpForm = $("bpForm");
  if (bpForm) bpForm.addEventListener("submit", handleBPSubmit);

  const bgForm = $("bgForm");
  if (bgForm) bgForm.addEventListener("submit", handleBGSubmit);

  // Language toggle
  const htLangBtn = $("htLangToggle");
  if (htLangBtn) {
    htLangBtn.addEventListener("click", () => {
      htSetLang(htLang === "bn" ? "en" : "bn");
    });
  }

  // Export & Action buttons
  const csvBtn       = $("btnExportCSV");
  const jsonBtn      = $("btnExportJSON");
  const prtBtn       = $("btnPrint");
  const lnkBtn       = $("btnShareLink");
  const cpyBtn       = $("copyLinkBtn");
  const pinBtn       = $("setPinBtn");
  const waBtn        = $("btnShareWhatsApp");
  const copyMsgBtn   = $("btnCopyMsg");
  const loadDemoBtn  = $("btnLoadDemo");
  const clearAllBtn  = $("btnClearAll");

  if (csvBtn)      csvBtn.addEventListener("click", htExportCSV);
  if (jsonBtn)     jsonBtn.addEventListener("click", htExportJSON);
  if (prtBtn)      prtBtn.addEventListener("click", () => window.print());
  if (lnkBtn)      lnkBtn.addEventListener("click", htRefreshShareLink);
  if (cpyBtn)      cpyBtn.addEventListener("click", htCopyLink);
  if (pinBtn)      pinBtn.addEventListener("click", htSetPin);
  if (waBtn)       waBtn.addEventListener("click", htShareWhatsApp);
  if (copyMsgBtn)  copyMsgBtn.addEventListener("click", htCopyFormattedReport);
  if (loadDemoBtn) loadDemoBtn.addEventListener("click", htLoadDemoData);
  if (clearAllBtn) clearAllBtn.addEventListener("click", htClearAllRecords);

  // Live input listening for BP gauge
  ["bpSystolic", "bpDiastolic"].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => {
      const sys = parseFloat($("bpSystolic")?.value);
      const dia = parseFloat($("bpDiastolic")?.value);
      updateBPGauge(sys, dia);
    });
  });

  // Live input listening for BG gauge
  const bgValEl   = $("bgValue");
  const bgTimingEl = $("bgTiming");
  if (bgValEl) {
    bgValEl.addEventListener("input", () => {
      const val    = parseFloat(bgValEl.value);
      const timing = bgTimingEl?.value || "fasting";
      updateBGGauge(val, timing);
    });
  }

  htRefreshShareLink();
});
