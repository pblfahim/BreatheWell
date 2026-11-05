/**
 * ============================================================================
 * BreatheWell — Core Client-Side Application Engine
 * ============================================================================
 *
 * @file        script.jt / script.js
 * @description Central client-side JavaScript engine for the BreatheWell
 *              mindfulness and respiratory wellness web platform.
 *              Provides multi-page & single-page client routing, an interactive
 *              guided breathing engine driven by requestAnimationFrame,
 *              SpeechSynthesis audio cues, Web Audio API harmonic sound
 *              synthesis, procedural confetti celebration particle system,
 *              BOLT & BPM breath capacity self-assessments, multi-tier
 *              progression cadences, and bilingual localization (Bengali/English).
 *
 * @version     2.4.0
 * @author      BreatheWell Engineering Team
 * @license     MIT
 *
 * ----------------------------------------------------------------------------
 * TABLE OF CONTENTS
 * ----------------------------------------------------------------------------
 * 1.  BILINGUAL LOCALIZATION DICTIONARIES (i18n: bn, en)
 * 2.  EXERCISE CATALOG & MULTI-LEVEL PROGRESSION DEFINITIONS
 * 3.  GLOBAL RUNTIME STATE & DOM SELECTOR HELPERS
 * 4.  LOCALIZATION HELPERS & LANGUAGE SWITCH CONTROLLER
 * 5.  CLIENT-SIDE ROUTING & NAVIGATION CONTROLLER
 * 6.  HERO BREATHEBUDDY MASCOT & LIVE RHYTHM GUIDE
 * 7.  EXERCISE CARDS RENDERING & INTERACTIVE LEVEL PICKER
 * 8.  EXERCISE DETAILS & CADENCE LEVEL SELECTOR
 * 9.  INTERACTIVE SAFETY HUB & READINESS PROTOCOL
 * 10. GUIDED BREATHING SESSION ENGINE (Timer & requestAnimationFrame Loop)
 * 11. AUDIO GUIDANCE (SpeechSynthesis & Web Audio Chime Synthesizer)
 * 12. CELEBRATION ENGINE: ANIMATED CHAMPION CUP & CONFETTI CANVAS
 * 13. POST-SESSION MINDFUL MOOD REFLECTION CHECK-IN
 * 14. SOCIAL MEDIA SHARING & CLIPBOARD COPY UTILITIES
 * 15. RESPIRATORY ASSESSMENT ENGINE (BOLT & BPM COUNTER)
 * 16. LOCAL STORAGE PERSISTENCE & HISTORY TRACKING
 * 17. MULTI-PAGE DEEP LINKING & APPLICATION LIFECYCLE
 * ============================================================================
 */

/* ============================================================================
 * 1. BILINGUAL LOCALIZATION DICTIONARIES (i18n)
 * ============================================================================
 * Contains complete bilingual key-value dictionaries for Bengali (bn) and
 * English (en). Both dictionaries maintain 100% key parity across all screens.
 */
const T = {
  bn: {
    skip: "মূল কনটেন্টে যান",
    navHome: "হোম",
    navExercises: "অনুশীলন",
    navTest: "শ্বাসের পরীক্ষা",
    navSafety: "নিরাপত্তা",
    navHealth: "স্বাস্থ্য ট্র্যাকার",
    navRx: "প্রেসক্রিপশন",
    heroEyebrow: "প্রতিদিনের ছোট্ট বিরতি",
    heroBadge: "সহজ ও আনন্দদায়ক মাইন্ডফুলনেস ✨",
    heroTitle: "প্রতিটি নিঃশ্বাসে খুঁজে নিন প্রশান্তি",
    heroDesc: "সহজ নির্দেশিত শ্বাস-প্রশ্বাসের অনুশীলনের মাধ্যমে ধীরে চলুন, আরাম করুন এবং বর্তমান মুহূর্তে মনোযোগ দিন।",
    startBreathing: "অনুশীলন শুরু করুন",
    explore: "অনুশীলন দেখুন",
    noAccount: "অ্যাকাউন্ট প্রয়োজন নেই",
    mobileReady: "মোবাইল উপযোগী",
    gentlePractice: "নরম ও স্বচ্ছন্দ অনুশীলন",
    minutes: "মিনিট",
    heroLiveBreathing: "মৃদু শ্বাস নিন...",
    heroLiveExhale: "ধীরে শ্বাস ছাড়ুন...",
    heroPillStress: "চাপ হ্রাস",
    heroPillHeart: "প্রশান্ত হৃদয়",
    heroPillQuick: "১ মিনিটে প্রশান্তি",
    heroVibePrompt: "আজ আপনার লক্ষ্য কী?",
    vibeCalm: "চাপ মুক্তি",
    vibeFocus: "গভীর মনোযোগ",
    vibeSleep: "ভালো ঘুম",
    vibeEnergy: "সতেজ অনুভূতি",
    heroOrbTap: "আমাকে ট্যাপ করুন!",
    heroOrbSmile: "দারুণ! একটি গভীর শ্বাস নিন 😊",
    minOne: "১ মিনিট",
    levelLabel: "স্তর",
    lvlGentle: "সহজ",
    lvlClassic: "ক্লাসিক",
    lvlDeep: "গভীর",
    startSimple: "সহজভাবে শুরু করুন",
    featuredTitle: "আপনার অনুশীলন বেছে নিন",
    featuredDesc: "নিজের স্বাচ্ছন্দ্য অনুযায়ী একটি সহজ অনুশীলন নির্বাচন করুন।",
    allExercises: "সব অনুশীলন",
    exploreEyebrow: "প্রয়োজন অনুযায়ী নির্বাচন",
    exploreHeading: "শ্বাসের অনুশীলন অন্বেষণ করুন",
    exploreSub: "আপনার বর্তমান শারীরিক ও মানসিক অবস্থা অনুযায়ী সঠিক কৌশলটি বেছে নিন। প্রতিটি অনুশীলনের রয়েছে সুনির্দিষ্ট বিজ্ঞানসম্মত উপকারিতা।",
    goalAll: "সব অনুশীলন (৪টি)",
    goalStress: "🌿 চাপ ও উদ্বেগ",
    goalFocus: "🎯 মনোযোগ ও ভারসাম্য",
    goalSleep: "🌙 ঘুম ও বিশ্রাম",
    goalMindful: "🧘 সচেতন উপস্থিতি",
    whenToUse: "কখন করবেন",
    quickStart: "শুরু করুন",
    viewDetails: "বিস্তারিত",
    benefit1Title: "বিজ্ঞানসম্মত কার্যকারিতা",
    benefit1Desc: "ধীর শ্বাস হৃদস্পন্দন হ্রাস করে এবং প্যারাসিমপ্যাথেটিক স্নায়ুতন্ত্রকে উদ্দীপ্ত করে দ্রুত শান্ত অনুভূতি আনে।",
    benefit2Title: "১-৩ মিনিটে ইতিবাচক পরিবর্তন",
    benefit2Desc: "মাত্র ১ থেকে ৩ মিনিটের সচেতন অনুশীলন মস্তিষ্কে স্থিরতা, সতেজতা ও মানসিক স্পষ্টতা ফিরিয়ে আনে।",
    benefit3Title: "১০০% নিরাপদ ও ব্যক্তিগত",
    benefit3Desc: "কোনো অ্যাকাউন্ট বা ট্র্যাকিং নেই। আপনার ব্রাউজারেই সরাসরি সম্পূর্ণ গোপনীয়তায় পরিচালিত হয়।",
    testBadge: "নতুন ফিচার: শ্বাসের সক্ষমতা টেস্ট",
    testBannerTitle: "আপনার শ্বাসের সক্ষমতা কতটুকু?",
    testBannerDesc: "BOLT (Body Oxygen Level Test) এর মাধ্যমে মাত্র ১ মিনিটে জেনে নিন আপনার ফুসফুসের দক্ষতা, কার্বন ডাই অক্সাইড সহনশীলতা ও মানসিক চাপের স্তর।",
    startTestBtn: "টেস্ট শুরু করুন",
    testSafeNotice: "১০০% নিরাপদ ও সহজ সেলফ-চেক",
    testEyebrow: "রেসপিরেটরি ফিটনেস অ্যাসেসমেন্ট",
    testMainTitle: "আপনার শ্বাসের সক্ষমতা যাচাই করুন",
    testMainDesc: "বৈজ্ঞানিক BOLT টেস্ট ও রেসপিরেটরি রেট ট্র্যাকিং এর মাধ্যমে আপনার ফুসফুসের কার্যকারিতা ও অক্সিজেন সহনশীলতা পরিমাপ করুন।",
    tabBoltTitle: "BOLT সহনশীলতা টেস্ট",
    tabBpmTitle: "শ্বাসের গতি (BPM Counter)",
    boltStepHeader: "কীভাবে টেস্ট করবেন?",
    boltSteps: "স্বাভাবিকভাবে নাক দিয়ে শ্বাস নিন এবং ছাড়ুন। এরপর নাক চেপে ধরে 'স্টার্ট' চাপুন। প্রথম শ্বাসের তাগিদ অনুভব করা মাত্র 'থামুন' চাপুন। জোর করে শ্বাস আটকে রাখবেন না।",
    bpmStepHeader: "শ্বাসের গতি পরিমাপ করুন",
    bpmSteps: "আরামদায়কভাবে বসুন। স্বাভাবিকভাবে শ্বাস নিন। প্রতিবার শ্বাস নিয়ে ছাড়ার পর (১টি পূর্ণ শ্বাসচক্র) নিচের সবুজ বাটনে ট্যাপ করুন। ৩০ সেকেন্ড পর আপনার প্রতি মিনিটের গড় রেট নির্ধারিত হবে।",
    prepareToHold: "স্বাভাবিক শ্বাস ছাড়ুন ও প্রস্তুত হন...",
    tapWhenUrge: "প্রথম শ্বাসের তাগিদে থামুন চাপুন",
    bpmActiveNotice: "প্রতি পূর্ণ শ্বাসচক্র শেষে নিচে ট্যাপ করুন",
    breathsRecorded: "গণনাকৃত শ্বাস:",
    startTestBtnText: "টেস্ট শুরু করুন",
    stopTestBtnText: "থামুন (শ্বাস নেওয়ার তাগিদ)",
    tapBpmBtnText: "১টি পূর্ণ শ্বাস নিলাম (ট্যাপ)",
    boltSafetyAlert: "এটি কোনো সহনশীলতা পরীক্ষা নয়। অস্বস্তি বা মাথা ঘোরার আগেই টেস্ট সম্পন্ন করুন।",
    testCompleteBadge: "টেস্ট সম্পন্ন হয়েছে",
    retryTest: "আবার পরীক্ষা করুন",
    recHeading: "আপনার ফলাফলের ভিত্তিতে প্রস্তাবিত অনুশীলন",
    startRecExercise: "অনুশীলন শুরু করুন",
    scoreGuideTitle: "স্কোর গাইড (BOLT স্কেল):",
    gradeLow: "খুব কম",
    gradeModerate: "মাঝারি",
    gradeGood: "ভালো",
    gradeOptimal: "চমৎকার",
    scienceTitle: "টেস্টের বৈজ্ঞানিক গুরুত্ব",
    scienceDesc: "BOLT টেস্ট আপনার রক্তে কার্বন ডাই অক্সাইডের প্রতি মস্তিষ্কের শ্বাস নিয়ন্ত্রণ কেন্দ্রের সংবেদনশীলতা পরিমাপ করে। স্কোর ২০ সেকেন্ডের বেশি হওয়া মানে শরীরের কোষে অক্সিজেন সরবরাহ ভালো এবং স্নায়ুতন্ত্র শান্ত রয়েছে।",
    sciPt1: "অক্সিজেন ব্যবহার ও ফুসফুসের ক্ষমতা বৃদ্ধি।",
    sciPt2: "মানসিক উদ্বেগ ও ঘুমের সমস্যা কমাতে সহায়ক।",
    sciPt3: "প্রতিদিন সকালে টেস্ট করে অগ্রগতি পর্যবেক্ষণ করা যায়।",
    historyTitle: "আপনার পূর্ববর্তী রেকর্ড",
    clearHistory: "মুছে ফেলুন",
    noHistoryYet: "এখনো কোনো টেস্টের রেকর্ড নেই। প্রথম টেস্টটি সম্পন্ন করুন!",
    how1Title: "১. একটি অনুশীলন বাছুন",
    how1Desc: "আপনার জন্য আরামদায়ক একটি শ্বাসের প্যাটার্ন নির্বাচন করুন।",
    how2Title: "২. নির্দেশনা অনুসরণ করুন",
    how2Desc: "অ্যানিমেশন ও সময় দেখে স্বাভাবিকভাবে শ্বাস নিন ও ছাড়ুন।",
    how3Title: "৩. স্বাভাবিক শ্বাসে ফিরুন",
    how3Desc: "শেষে কিছুক্ষণ বিশ্রাম নিন এবং নিজের অনুভূতি লক্ষ্য করুন।",
    safetyTitle: "নিরাপদ অনুশীলন",
    safetyShort: "আরামদায়কভাবে শ্বাস নিন। শ্বাস জোর করে টানবেন না বা ধরে রাখবেন না। মাথা ঘোরা, অস্বস্তি বা অস্বাভাবিক শ্বাসকষ্ট হলে সঙ্গে সঙ্গে থামুন।",
    readSafety: "সম্পূর্ণ নিরাপত্তা নির্দেশনা",
    safetyEyebrow: "চিকিৎসা ও সুস্থতা নির্দেশিকা",
    safetyMainHeading: "নিরাপদ শ্বাসের নির্দেশিকা ও সেলফ-চেক",
    safetyMainDesc: "শ্বাস-প্রশ্বাস সম্পূর্ণ প্রাকৃতিক হলেও সঠিক সচেতনতা ও নিরাপত্তা বজায় রাখা জরুরি। স্বাস্থ্যসম্মত ও আরামদায়ক অনুশীলনের জন্য এই নির্দেশিকাগুলো মেনে চলুন।",
    safetyTabRules: "🛡️ ৩টি মূল নিরাপত্তা নিয়ম",
    safetyTabChecklist: "✅ সেলফ-চেক চেকলিস্ট",
    safetyTabConditions: "🩺 বিশেষ শারীরিক অবস্থা",
    safetyTabEmergency: "🆘 তাৎক্ষণিক স্থিরতা",
    safetyPillar1Title: "আরামদায়ক ভঙ্গি ও প্রস্তুতি",
    safetyPillar1Desc: "নিরাপদ স্থানে সোজা হয়ে কিন্তু আরাম করে বসুন বা শুয়ে পড়ুন। কাঁধ ও চোয়াল শিথিল রাখুন।",
    safetyPillar1Pt1: "নাক দিয়ে ধীরে ও স্বাভাবিক শ্বাস নিন",
    safetyPillar1Pt2: "পেটের স্বাভাবিক ওঠা-নামা লক্ষ্য করুন",
    safetyPillar1Pt3: "চোখ বন্ধ বা দৃষ্টি নরম রাখুন",
    safetyPillar2Title: "কখনই জোর করবেন না",
    safetyPillar2Desc: "শ্বাস ধরে রাখার কোনো ধাপে কষ্ট বা অস্বস্তি হলে তৎক্ষণাৎ ছেড়ে দিন এবং স্বাভাবিক শ্বাসে ফিরুন।",
    safetyPillar2Pt1: "শ্বাস জোর করে অতিরিক্ত দীর্ঘ করবেন না",
    safetyPillar2Pt2: "ড্রাইভিং বা ভারী কাজের সময় করবেন না",
    safetyPillar2Pt3: "শরীরকে সবসময় নিজের গতিতে চলতে দিন",
    safetyPillar3Title: "অবিলম্বে থামার লক্ষণসমূহ",
    safetyPillar3Desc: "নিচের যেকোনো লক্ষণ দেখা দিলে অনুশীলন তৎক্ষণাৎ বন্ধ করুন এবং স্বাভাবিক শান্ত শ্বাসে ফিরুন।",
    safetyPillar3Pt1: "মাথা ঘোরা, ঝিমঝিম বা হালকা লাগা",
    safetyPillar3Pt2: "বুকে চাপ, ব্যথা বা বুক ধড়ফড় করা",
    safetyPillar3Pt3: "হাত-পা অসাড় বা অস্বাভাবিক শিহরণ",
    checkTitle: "প্রি-সেশন নিরাপত্তা সেলফ-চেক",
    checkDesc: "অনুশীলন শুরুর আগে মাত্র ২০ সেকেন্ডে নিচের ৩টি বিষয় নিশ্চিত করে নিন:",
    checkProgressLabel: "চেকলিস্ট অগ্রগতি:",
    checkItem1: "আমি একটি নিরাপদ, শান্ত ও আরামদায়ক স্থানে বসেছি বা শুয়েছি।",
    checkItem2: "আমি গাড়ি চালাচ্ছি না, সাঁতার কাটছি না বা ঝুঁকিপূর্ণ কাজ করছি না।",
    checkItem3: "অস্বস্তি বা মাথা ঘোরা অনুভব করামাত্র আমি স্বাভাবিক শ্বাসে ফিরে যাব।",
    checkReadyBadge: "🎉 আপনি সম্পূর্ণ প্রস্তুত ও নিরাপদ!",
    checkReadyBtn: "অনুশীলন শুরু করুন",
    checkResetBtn: "রিসেট",
    condAsthmaTitle: "অ্যাজমা ও সিওপিডি (Asthma & COPD)",
    condAsthmaDesc: "দীর্ঘ শ্বাস ধরে রাখার ধাপগুলো এড়িয়ে চলুন। শুধুমাত্র ডায়াফ্রামেটিক ব্রিদিং বা ৪-৬ রিল্যাক্সিং ব্রিদিংয়ের মতো নরম ও মসৃণ শ্বাস অনুশীলন করুন। সবসময় প্রয়োজনীয় ইনহেলার কাছে রাখুন।",
    condHeartTitle: "উচ্চ রক্তচাপ ও হৃদরোগ (Hypertension & Cardiac)",
    condHeartDesc: "শ্বাস ধরে রাখলে রক্তচাপের সাময়িক তারতম্য হতে পারে। বক্স ব্রিদিংয়ের শ্বাস ধারণ বাদ দিয়ে কেবল ৪ সেকেন্ড নেওয়া ও ৬ সেকেন্ড ছাড়ার ছন্দ অনুসরণ করুন।",
    condPregnancyTitle: "গর্ভাবস্থা (Pregnancy)",
    condPregnancyDesc: "গর্ভাবস্থায় কোনো ধরনের তীব্র শ্বাস আটকানো নিষিদ্ধ। হালকা ডায়াফ্রামেটিক ব্রিদিং এবং প্রাকৃতিক মননশীল শ্বাস মা ও শিশুর জন্য নিরাপদ এবং মানসিক চাপ কমাতে জাদুকরী।",
    condPanicTitle: "প্যানিক বা তীব্র উদ্বেগ (Panic & Hyperventilation)",
    condPanicDesc: "উদ্বেগের সময় অতিরিক্ত বাতাস ভেতরে টানার প্রবণতা থাকে। শ্বাস নেওয়ার চেয়ে নিঃশ্বাস ধীরে ও লম্বা করে ছাড়ার দিকে মনোযোগ দিন। এটি স্নায়ুতন্ত্রকে শান্ত করে।",
    emergencyTitle: "🆘 তাৎক্ষণিক স্থিরতা ও প্রশান্তি প্রোটোকল",
    emergencyDesc: "অনুশীলনে কোনো কারণে মাথা ঘুরলে বা অস্বস্তি লাগলে নিচের বোতামে চাপুন। এটি তৎক্ষণাৎ সেশন থামিয়ে শরীরকে শান্ত করবে:",
    emergencyBtnText: "তাৎক্ষণিক স্বাভাবিক শ্বাসে ফিরুন (ইমার্জেন্সি রিসেট)",
    emergencyStep1: "১. চোখ বন্ধ করুন এবং কেবল ধীরে ধীরে ফুসফুসের সব বাতাস ছেড়ে দিন।",
    emergencyStep2: "২. দুই পা মেঝেতে শক্তভাবে স্পর্শ করান এবং পায়ের নিচে মাটির অস্তিত্ব অনুভব করুন।",
    emergencyStep3: "৩. কোনো নির্দিষ্ট ছন্দ ছাড়া নিজের স্বাভাবিক গতিতে ৫টি শান্ত শ্বাস নিন।",
    emergencyStep4: "৪. চোখ খুলে এক ঢোক পানি পান করুন এবং ১ মিনিট বিশ্রাম নিন।",
    emergencyToastMsg: "শান্ত হোন। সেশন বন্ধ করা হয়েছে। আরাম করে স্বাভাবিক শ্বাস নিন।",
    libraryEyebrow: "প্রয়োজন অনুযায়ী নির্বাচন",
    libraryTitle: "আপনার শ্বাসের অনুশীলন বেছে নিন",
    libraryDesc: "প্রতিটি অনুশীলনের সময় ও নির্দেশনা দেখে নিজের উপযোগীটি নির্বাচন করুন।",
    filterAll: "সব",
    filterBeginner: "শুরুর জন্য",
    filterStructured: "নির্দিষ্ট ছন্দ",
    filterMindful: "মনোযোগ",
    detailsLabel: "বিস্তারিত",
    exerciseDetails: "অনুশীলনের বিবরণ",
    pattern: "শ্বাসের প্যাটার্ন",
    sessionDuration: "অনুশীলনের সময়",
    dur1Min: "১ মিনিট (মিনিমাম)",
    dur2Min: "২ মিনিট",
    dur3Min: "৩ মিনিট",
    dur5Min: "৫ মিনিট",
    dur10Min: "১০ মিনিট",
    audioGuidance: "অডিও নির্দেশনা",
    audioOff: "বন্ধ",
    audioOn: "চালু (সমর্থিত ব্রাউজারে)",
    beforeStart: "শুরু করার আগে",
    detailSafety: "স্বাভাবিকভাবে শ্বাস নিন। কোনো ধাপ অস্বস্তিকর হলে থামুন এবং নিজের স্বাভাবিক শ্বাসে ফিরে যান।",
    startSession: "অনুশীলন শুরু করুন",
    exitSession: "বের হন",
    sessionSafety: "শ্বাস জোর করে নেবেন না। অস্বস্তি হলে থামুন।",
    wellDone: "সম্পন্ন",
    completeTitle: "আপনার অনুশীলন সম্পন্ন হয়েছে!",
    completeDesc: "এবার স্বাভাবিকভাবে শ্বাস নিন এবং কিছুক্ষণ বিশ্রাম করুন।",
    summaryExercise: "অনুশীলন",
    summaryDuration: "সময়",
    summaryCycles: "সম্পূর্ণ চক্র",
    summaryStatus: "অবস্থা",
    completed: "সম্পন্ন",
    tapCupConfetti: "ট্রফিতে ট্যাপ করুন!",
    tapCupCheers: "🎉 দারুণ অর্জন!",
    badgeMindfulMaster: "মাইন্ডফুলনেস চ্যাম্পিয়ন",
    badgeLevel1: "লেভেল ১ বিজয়ী 🏅",
    badgeLevel2: "লেভেল ২ মাস্টার 🥈",
    badgeLevel3: "লেভেল ৩ গ্র্যান্ডমাস্টার 🥇",
    moodCheckBadge: "সেলফ-রিফ্লেকশন",
    moodCheckTitle: "অনুশীলনের পর এখন কেমন অনুভূতি হচ্ছে?",
    moodCheckSub: "আপনার অনুভূতি চিহ্নিত করে মানসিক পরিবর্তনের পর্যবেক্ষণ রাখুন।",
    moodCalm: "শান্ত ও নির্ভার",
    moodRefreshed: "সতেজ ও উদ্যমী",
    moodFocused: "মনোযোগী",
    moodSleepy: "শিথিল ও তন্দ্রাচ্ছন্ন",
    moodCalmMsg: "দারুণ! ধীর শ্বাসে আপনার স্নায়ুতন্ত্র এখন পুরোপুরি শিথিল ও শান্ত।",
    moodRefreshedMsg: "চমৎকার! অক্সিজেন প্রবাহ বৃদ্ধি পেয়ে মস্তিষ্কে সতেজতা ফিরে এসেছে।",
    moodFocusedMsg: "মনোযোগ বৃদ্ধি পেয়েছে! আপনার মন এখন স্থির ও স্পষ্ট ভাবনার জন্য প্রস্তুত।",
    moodSleepyMsg: "বিশ্রামের চমৎকার প্রস্তুতি! গভীর শিথিলতা আপনার ঘুমকে প্রশান্ত করবে।",
    practiceAgain: "আবার অনুশীলন করুন",
    otherExercises: "অন্য অনুশীলন দেখুন",
    disclaimer: "এই ওয়েবসাইট সাধারণ সুস্থতা ও শিথিলতার তথ্য দেয়; এটি চিকিৎসা বা পেশাদার স্বাস্থ্যসেবার বিকল্প নয়।",
    footerTag: "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
    footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
    inhale: "শ্বাস নিন",
    exhale: "শ্বাস ছাড়ুন",
    hold: "ধরে রাখুন",
    rest: "বিরতি",
    prepare: "প্রস্তুত হন",
    prepareSub: "আরাম করে বসুন বা শুয়ে পড়ুন",
    paused: "অনুশীলন বিরতিতে আছে",
    pausedSub: "আবার শুরু করতে প্লে চাপুন",
    sessionStarted: "অনুশীলন শুরু হয়েছে",
    stopped: "অনুশীলন থামানো হয়েছে",
    confirmStop: "অনুশীলন থামাতে চান? আপনার বর্তমান সেশন শেষ হবে।",
    resume: "আবার শুরু",
    pause: "বিরতি",
    levelBeginner: "শুরুর জন্য",
    levelIntermediate: "মাঝারি",
    levelAdvanced: "উন্নত",
    levelSelectLabel: "অনুশীলন স্তর (লেভেল)",
    levelBadgeText: "৩টি লেভেল (১-৩)",
    lvlPrefix: "লেভেল",
    summaryLevel: "অনুশীলনের স্তর",
    shareBadge: "আপনার অর্জন শেয়ার করুন",
    shareHeading: "বন্ধুদের সাথে প্রশান্তি ও সুস্থতা শেয়ার করুন",
    shareSub: "আপনার সফল শ্বাস-প্রশ্বাস সেশনের অনুভূতি সোশ্যাল মিডিয়ায় ভাগ করে নিন।",
    copyLinkBtn: "লিঙ্ক কপি",
    moreShareBtn: "আরও শেয়ার",
    shareTestPrompt: "আপনার টেস্ট রেজাল্ট শেয়ার করুন:",
    copyLinkMini: "কপি",
    linkCopied: "ক্লিপবোর্ডে কপি হয়েছে!",
    minLabel: "মিনিট",
    phaseInhale: "শ্বাস নিন",
    phaseExhale: "শ্বাস ছাড়ুন",
    phaseHold: "ধরে রাখুন",
    phaseRest: "বিরতি",
    safetyItems: [
      "আরামদায়কভাবে বসুন বা নিরাপদ স্থানে শুয়ে পড়ুন।",
      "শ্বাস ধীরে ও স্বাভাবিকভাবে নিন; জোর করে গভীর শ্বাস নেবেন না।",
      "শ্বাস ধরে রাখার কোনো ধাপ অস্বস্তিকর হলে সেটি বাদ দিন বা অনুশীলন বন্ধ করুন।",
      "মাথা ঘোরা, অস্বস্তি, বুকব্যথা বা অস্বাভাবিক শ্বাসকষ্ট হলে সঙ্গে সঙ্গে থামুন এবং স্বাভাবিক শ্বাসে ফিরুন।",
      "শ্বাস-প্রশ্বাস বা অন্য কোনো স্বাস্থ্যগত সমস্যা থাকলে নতুন অনুশীলন শুরুর আগে স্বাস্থ্য-পেশাজীবীর পরামর্শ নিন।"
    ],
    cycleUnit: "চক্র",
    startOver: "আবার শুরু করুন"
  },
  en: {
    skip: "Skip to content",
    navHome: "Home",
    navExercises: "Exercises",
    navTest: "Breath Test",
    navSafety: "Safety",
    navHealth: "Health Tracker",
    navRx: "Prescriptions",
    heroEyebrow: "A small pause in your day",
    heroBadge: "Simple & Joyful Mindfulness ✨",
    heroTitle: "Find your calm, one breath at a time",
    heroDesc: "Explore simple guided breathing practices to slow down, relax and bring your attention to the present moment.",
    startBreathing: "Start breathing",
    explore: "Explore exercises",
    noAccount: "No account needed",
    mobileReady: "Mobile friendly",
    gentlePractice: "Gentle, comfortable practice",
    minutes: "minutes",
    heroLiveBreathing: "Breathe in gently...",
    heroLiveExhale: "Breathe out slowly...",
    heroPillStress: "Stress Relief",
    heroPillHeart: "Calm Heart Rate",
    heroPillQuick: "Calm in 1 Min",
    heroVibePrompt: "What is your goal right now?",
    vibeCalm: "Relieve Stress",
    vibeFocus: "Sharp Focus",
    vibeSleep: "Better Sleep",
    vibeEnergy: "Gentle Refresh",
    heroOrbTap: "Tap me to breathe!",
    heroOrbSmile: "Wonderful! Take a deep breath 😊",
    minOne: "1 min",
    levelLabel: "Level",
    lvlGentle: "Gentle",
    lvlClassic: "Classic",
    lvlDeep: "Deep",
    startSimple: "A simple place to begin",
    featuredTitle: "Choose your practice",
    featuredDesc: "Select a gentle exercise that feels comfortable for you.",
    allExercises: "All exercises",
    exploreEyebrow: "Targeted Practices",
    exploreHeading: "Explore Breathing Exercises",
    exploreSub: "Select the ideal breathing rhythm for your current mental and physical state. Each practice offers proven physiological benefits.",
    goalAll: "All Exercises (4)",
    goalStress: "🌿 Stress & Anxiety",
    goalFocus: "🎯 Focus & Energy",
    goalSleep: "🌙 Sleep & Rest",
    goalMindful: "🧘 Mindfulness",
    whenToUse: "Best time",
    quickStart: "Start",
    viewDetails: "Details",
    benefit1Title: "Evidence-Based Rhythms",
    benefit1Desc: "Paced exhalations engage the parasympathetic nervous system, lowering heart rate and relieving stress.",
    benefit2Title: "Rapid 1-3 Minute Shift",
    benefit2Desc: "Just a 1 to 3-minute session resets cognitive fatigue, restores calm, and enhances focus.",
    benefit3Title: "Zero Friction & 100% Private",
    benefit3Desc: "No signup, cookies or telemetry. Runs completely locally and privately in your browser.",
    testBadge: "New Feature: Breath Fitness Test",
    testBannerTitle: "How Healthy Is Your Breathing?",
    testBannerDesc: "Take the 60-second BOLT (Body Oxygen Level Test) to measure your functional lung efficiency, CO2 tolerance, and nervous system state.",
    startTestBtn: "Start Breath Test",
    testSafeNotice: "100% safe & gentle self-check",
    testEyebrow: "Respiratory Fitness Assessment",
    testMainTitle: "Evaluate Your Breathing Performance",
    testMainDesc: "Scientifically measure CO2 tolerance, lung efficiency, and resting respiration rate with immediate personalized guidance.",
    tabBoltTitle: "BOLT Endurance Test",
    tabBpmTitle: "Breathing Rate (BPM Counter)",
    boltStepHeader: "How to perform the BOLT test",
    boltSteps: "Take a normal breath in and out through your nose. Pinch your nose and tap 'Start'. Stop at the very first definite urge to breathe. Do NOT hold until gasping!",
    bpmStepHeader: "Measure your resting breathing rate",
    bpmSteps: "Sit comfortably. Each time you complete a natural breath cycle (inhale + exhale), tap the button below. We'll calculate your average resting breaths per minute over 30 seconds.",
    prepareToHold: "Exhale normally and prepare...",
    tapWhenUrge: "Tap stop at the first urge to breathe",
    bpmActiveNotice: "Tap below after each full breath cycle",
    breathsRecorded: "Recorded breaths:",
    startTestBtnText: "Start Test",
    stopTestBtnText: "Stop (First Urge to Breathe)",
    tapBpmBtnText: "Completed 1 Breath Cycle",
    boltSafetyAlert: "This is not a maximal breath-hold test. Stop as soon as you feel the first urge to breathe.",
    testCompleteBadge: "Test Completed",
    retryTest: "Test Again",
    recHeading: "Personalized Exercise Recommendation",
    startRecExercise: "Start Recommended Exercise",
    scoreGuideTitle: "Score Guide (BOLT Scale):",
    gradeLow: "Low",
    gradeModerate: "Moderate",
    gradeGood: "Good",
    gradeOptimal: "Optimal",
    scienceTitle: "The Science Behind This Test",
    scienceDesc: "The BOLT score measures your chemoreceptors' sensitivity to carbon dioxide. Scores above 20 seconds signify efficient cellular oxygen delivery, open airways, and a calm autonomic nervous system.",
    sciPt1: "Improves oxygen delivery and lung efficiency.",
    sciPt2: "Reduces anxiety, breathlessness, and sleep disturbances.",
    sciPt3: "Track daily baseline progress upon waking.",
    historyTitle: "Your Test History",
    clearHistory: "Clear History",
    noHistoryYet: "No test records yet. Complete your first test to track your journey!",
    how1Title: "1. Choose an exercise",
    how1Desc: "Select a breathing pattern that feels comfortable for you.",
    how2Title: "2. Follow the guide",
    how2Desc: "Use the animation and timing to guide a natural breath in and out.",
    how3Title: "3. Return to normal",
    how3Desc: "Rest for a moment and notice how you feel.",
    safetyTitle: "Practice safely",
    safetyShort: "Breathe comfortably. Do not force your breath or hold it unnecessarily. Stop immediately if you feel dizzy, uncomfortable or unusually short of breath.",
    readSafety: "Read full safety guidance",
    safetyEyebrow: "Clinical & Wellness Standards",
    safetyMainHeading: "Safety Guidelines & Pre-Check",
    safetyMainDesc: "While breathwork is completely natural and restorative, practicing with awareness ensures a safe, comfortable, and grounding experience.",
    safetyTabRules: "🛡️ 3 Golden Rules",
    safetyTabChecklist: "✅ Readiness Checklist",
    safetyTabConditions: "🩺 Health Conditions",
    safetyTabEmergency: "🆘 Calming Reset",
    safetyPillar1Title: "Comfortable Posture",
    safetyPillar1Desc: "Sit upright yet relaxed, or lie down in a safe space. Keep jaw, neck, and shoulders loose.",
    safetyPillar1Pt1: "Breathe gently and smoothly through your nose",
    safetyPillar1Pt2: "Focus on natural abdominal expansion",
    safetyPillar1Pt3: "Close eyes or maintain a soft downward gaze",
    safetyPillar2Title: "Never Force the Breath",
    safetyPillar2Desc: "If holding the breath feels strained or uncomfortable, release immediately and breathe naturally.",
    safetyPillar2Pt1: "Do not force unnaturally deep or prolonged breaths",
    safetyPillar2Pt2: "Never practice while driving or operating machinery",
    safetyPillar2Pt3: "Respect your biological rhythm without judgment",
    safetyPillar3Title: "When to Stop Immediately",
    safetyPillar3Desc: "Stop the session immediately and return to natural breathing if you notice any of these signs:",
    safetyPillar3Pt1: "Dizziness, vertigo, or sudden lightheadedness",
    safetyPillar3Pt2: "Chest tightness, pain, or palpitations",
    safetyPillar3Pt3: "Tingling sensations in fingers, toes, or face",
    checkTitle: "Pre-Session Safety Self-Check",
    checkDesc: "Take 20 seconds before starting to verify these 3 essential safety items:",
    checkProgressLabel: "Checklist Progress:",
    checkItem1: "I am seated or lying down comfortably in a safe, stable place.",
    checkItem2: "I am not driving, in water, or operating any equipment.",
    checkItem3: "I will stop immediately and breathe naturally if I feel any discomfort.",
    checkReadyBadge: "🎉 You are fully ready and safe to practice!",
    checkReadyBtn: "Start Practice Now",
    checkResetBtn: "Reset",
    condAsthmaTitle: "Asthma & Respiratory Conditions",
    condAsthmaDesc: "Avoid prolonged breath holds. Focus on gentle diaphragmatic breathing or 4-6 relaxation. Keep prescribed inhalers nearby.",
    condHeartTitle: "Hypertension & Cardiovascular Health",
    condHeartDesc: "Holding your breath can transiently elevate blood pressure. Choose gentle exhalation rhythms (4-6 Relaxing) over breath-hold practices.",
    condPregnancyTitle: "Pregnancy & Prenatal Breathing",
    condPregnancyDesc: "Strictly avoid forceful breath holds or hyperventilation. Gentle diaphragmatic and natural mindful breathing are safe, relaxing, and soothing.",
    condPanicTitle: "Panic & Hyperventilation Attacks",
    condPanicDesc: "During anxiety spikes, resist gasping deep inhales. Focus on extending your exhalations slowly through pursed lips to calm your heart rate.",
    emergencyTitle: "🆘 Instant Calming & Grounding Protocol",
    emergencyDesc: "If you feel overwhelmed, breathless, or lightheaded, trigger this emergency calm reset to stop and ground yourself:",
    emergencyBtnText: "Trigger Grounding & Calming Reset",
    emergencyStep1: "1. Close your eyes and softly sigh out all the air from your lungs.",
    emergencyStep2: "2. Plant both feet firmly on the ground and feel the solid surface beneath you.",
    emergencyStep3: "3. Take 5 unforced, natural breaths at whatever pace feels easiest.",
    emergencyStep4: "4. Open your eyes, sip some water, and rest quietly for a moment.",
    emergencyToastMsg: "Stay calm. Session reset. Breathe naturally and ground yourself.",
    libraryEyebrow: "Practice collection",
    libraryTitle: "Choose a breathing exercise",
    libraryDesc: "Review each exercise's timing and instructions before choosing one.",
    filterAll: "All",
    filterBeginner: "Beginner",
    filterStructured: "Structured",
    filterMindful: "Mindfulness",
    detailsLabel: "Details",
    exerciseDetails: "Exercise details",
    pattern: "Breathing pattern",
    sessionDuration: "Session duration",
    dur1Min: "1 min (Minimum)",
    dur2Min: "2 min",
    dur3Min: "3 min",
    dur5Min: "5 min",
    dur10Min: "10 min",
    audioGuidance: "Audio guidance",
    audioOff: "Off",
    audioOn: "On (supported browsers)",
    beforeStart: "Before you begin",
    detailSafety: "Breathe naturally. If any phase feels uncomfortable, stop and return to your normal breathing.",
    startSession: "Start exercise",
    exitSession: "Exit",
    sessionSafety: "Do not force your breath. Stop if you feel uncomfortable.",
    wellDone: "Completed",
    completeTitle: "Your session is complete!",
    completeDesc: "Return to your natural breathing and rest for a moment.",
    summaryExercise: "Exercise",
    summaryDuration: "Duration",
    summaryCycles: "Completed cycles",
    summaryStatus: "Status",
    completed: "Completed",
    tapCupConfetti: "Tap the trophy!",
    tapCupCheers: "🎉 Great achievement!",
    badgeMindfulMaster: "Mindfulness Champion",
    badgeLevel1: "Level 1 Conqueror 🏅",
    badgeLevel2: "Level 2 Master 🥈",
    badgeLevel3: "Level 3 Grandmaster 🥇",
    moodCheckBadge: "Self-Reflection",
    moodCheckTitle: "How are you feeling after this session?",
    moodCheckSub: "Check in with your body and notice the calming shift.",
    moodCalm: "Calm & Relaxed",
    moodRefreshed: "Refreshed & Energized",
    moodFocused: "Sharp & Focused",
    moodSleepy: "Sleepy & Rested",
    moodCalmMsg: "Wonderful! Slow breathing has brought deep relaxation to your nervous system.",
    moodRefreshedMsg: "Fantastic! Enhanced oxygenation has revitalized your energy and clarity.",
    moodFocusedMsg: "Focus sharpened! Your mind is grounded and ready for clear thinking.",
    moodSleepyMsg: "Perfect relaxation! Your body is prepared for peaceful, restorative sleep.",
    practiceAgain: "Practice again",
    otherExercises: "Explore other exercises",
    disclaimer: "This website provides general wellness and relaxation information; it is not a substitute for medical care or professional healthcare advice.",
    footerTag: "A little calm in every breath",
    footerDisclaimer: "For general wellness. Not a medical treatment.",
    inhale: "Breathe in",
    exhale: "Breathe out",
    hold: "Hold",
    rest: "Rest",
    prepare: "Get comfortable",
    prepareSub: "Sit or lie down somewhere safe",
    paused: "Practice paused",
    pausedSub: "Press play when you're ready",
    sessionStarted: "Practice started",
    stopped: "Practice stopped",
    confirmStop: "Stop this exercise? Your current session will end.",
    resume: "Resume",
    pause: "Pause",
    levelBeginner: "Beginner",
    levelIntermediate: "Intermediate",
    levelAdvanced: "Advanced",
    levelSelectLabel: "Practice Level",
    levelBadgeText: "3 Levels (1-3)",
    lvlPrefix: "Level",
    summaryLevel: "Practice Level",
    shareBadge: "Share Your Milestone",
    shareHeading: "Share Calm & Wellness With Friends",
    shareSub: "Spread mindfulness and inspire others to take a relaxing breath.",
    copyLinkBtn: "Copy Link",
    moreShareBtn: "Share More",
    shareTestPrompt: "Share your test result:",
    copyLinkMini: "Copy",
    linkCopied: "Copied to clipboard!",
    minLabel: "min",
    phaseInhale: "Breathe in",
    phaseExhale: "Breathe out",
    phaseHold: "Hold",
    phaseRest: "Rest",
    safetyItems: [
      "Sit comfortably or lie down somewhere safe.",
      "Breathe gently and naturally; do not force deep breaths.",
      "If a breath-hold phase feels uncomfortable, skip it or stop the exercise.",
      "Stop immediately if you feel dizzy, uncomfortable, have chest pain or become unusually short of breath; return to normal breathing.",
      "If you have a respiratory or other relevant health condition, consult a healthcare professional before starting a new practice."
    ],
    cycleUnit: "cycles",
    startOver: "Start again"
  }
};

/* ============================================================================
 * 2. EXERCISE CATALOG & MULTI-LEVEL PROGRESSION DEFINITIONS
 * ============================================================================
 * Catalog of 4 evidence-based breathing techniques with 3 distinct progression
 * levels (Beginner L1, Intermediate L2, Advanced L3) per exercise:
 * 1. 4-6 Gentle Breathing (id: 'relax46', parasympathetic activation & calm)
 * 2. Box Breathing (id: 'box', 4-equal-side autonomic regulation & focus)
 * 3. 4-7-8 Deep Relaxation (id: 'diaphragmatic', sedative vagal stimulation)
 * 4. Mindful Presence (id: 'mindful', natural open monitoring awareness)
 *
 * @typedef {Object} LocalizedText
 * @property {string} bn - Bengali localized string
 * @property {string} en - English localized string
 *
 * @typedef {Object} LevelConfig
 * @property {number} num - Level numeric identifier (1, 2, or 3)
 * @property {LocalizedText} name - Level badge name
 * @property {LocalizedText} desc - Detailed cadence description
 * @property {Array<[string, number]>} phases - Cadence phase durations in seconds
 *
 * @typedef {Object} Exercise
 * @property {string} id - Unique exercise slug
 * @property {string} icon - Bootstrap icon class name
 * @property {string} image - SVG illustration filename in asset/image/
 * @property {string} level - Default difficulty category
 * @property {string} category - Category identifier for filtering
 * @property {string} tag - Wellness goal tag (stress, focus, sleep, mindful)
 * @property {number} duration - Default minimum session duration in seconds (60s)
 * @property {Array<[string, number]>} phases - Default phase durations
 * @property {Object<string, LevelConfig>} levels - Level 1, 2, 3 progression variants
 * @property {LocalizedText} name - Localized exercise title
 * @property {LocalizedText} desc - Localized primary description
 * @property {LocalizedText} badge - Goal badge label
 * @property {LocalizedText} benefit - Physiological/neuroscience benefit summary
 * @property {LocalizedText} when - Optimal time-of-day or situation to practice
 *
 * @type {Array<Exercise>}
 */
const exercises = [
  {
    id: "relax46",
    icon: "bi-water",
    image: "relaxing.svg",
    level: "beginner",
    category: "beginner",
    tag: "stress",
    duration: 60,
    phases: [["inhale", 4], ["exhale", 6]],
    levels: {
      beginner: {
        num: 1,
        name: { bn: "লেভেল ১ · শান্ত শুরু (৩–৫ সে)", en: "Level 1 · Gentle (3–5s)" },
        desc: { bn: "নতুনদের জন্য সহজ ৩-৫ সেকেন্ডের ছন্দ। ৩ সেকেন্ড শ্বাস নিন এবং ৫ সেকেন্ড ধীরে ছাড়ুন।", en: "Gentle 3-5s cadence for beginners: 3s inhale, 5s exhale." },
        phases: [["inhale", 3], ["exhale", 5]]
      },
      intermediate: {
        num: 2,
        name: { bn: "লেভেল ২ · ক্লাসিক রিল্যাক্স (৪–৬ সে)", en: "Level 2 · Classic (4–6s)" },
        desc: { bn: "স্বাভাবিক ৪-৬ সেকেন্ডের বিজ্ঞানসম্মত ছন্দ। ৪ সেকেন্ড শ্বাস নিন এবং ৬ সেকেন্ডে ধীরে ছাড়ুন।", en: "Evidence-based standard cadence: 4s inhale, 6s exhale." },
        phases: [["inhale", 4], ["exhale", 6]]
      },
      advanced: {
        num: 3,
        name: { bn: "লেভেল ৩ · গভীর শিথিলতা (৫–৮ সে)", en: "Level 3 · Deep Vagal (5–8s)" },
        desc: { bn: "উন্নত ৫-৮ সেকেন্ডের দীর্ঘ নিঃশ্বাসের ছন্দ। ৫ সেকেন্ড শ্বাস নিন এবং ৮ সেকেন্ডে ছাড়ুন।", en: "Extended exhalation for experienced breathers: 5s inhale, 8s exhale." },
        phases: [["inhale", 5], ["exhale", 8]]
      }
    },
    name: { bn: "রিল্যাক্সিং ব্রিদিং", en: "Relaxing Breathing" },
    badge: { bn: "🌿 চাপ উপশম", en: "🌿 Stress Relief" },
    benefit: {
      bn: "হৃদস্পন্দন ধীর করে দ্রুত মানসিক চাপ ও উদ্বেগ উপশম করে।",
      en: "Slows heart rate and triggers the body's natural calming response."
    },
    when: {
      bn: "উদ্বেগের মুহূর্তে বা কাজের বিরতিতে",
      en: "During anxiety spikes or busy work breaks"
    },
    desc: {
      bn: "চার সেকেন্ডে নরমভাবে শ্বাস নিন এবং ছয় সেকেন্ডে ধীরে ছাড়ুন। শ্বাস ধরে রাখার প্রয়োজন নেই।",
      en: "Breathe in gently for four seconds and breathe out for six. No breath hold is required."
    }
  },
  {
    id: "box",
    icon: "bi-bounding-box",
    image: "box-breathing.svg",
    level: "intermediate",
    category: "structured",
    tag: "focus",
    duration: 60,
    phases: [["inhale", 4], ["hold", 4], ["exhale", 4], ["rest", 4]],
    levels: {
      beginner: {
        num: 1,
        name: { bn: "লেভেল ১ · সহজ বর্গ (৩-৩-৩-৩ সে)", en: "Level 1 · Easy Square (3s)" },
        desc: { bn: "সহজ শ্বাস ধারণ: ৩ সে নিন, ৩ সে রাখুন, ৩ সে ছাড়ুন, ৩ সে বিরতি।", en: "Gentle square intervals: 3s inhale, 3s hold, 3s exhale, 3s rest." },
        phases: [["inhale", 3], ["hold", 3], ["exhale", 3], ["rest", 3]]
      },
      intermediate: {
        num: 2,
        name: { bn: "লেভেল ২ · ক্লাসিক বক্স (৪-৪-৪-৪ সে)", en: "Level 2 · Classic Box (4s)" },
        desc: { bn: "মানক নেভি সিল বক্স ছন্দ: ৪ সে নিন, ৪ সে রাখুন, ৪ সে ছাড়ুন, ৪ সে বিরতি।", en: "Standard Navy SEAL 4-second box cadence." },
        phases: [["inhale", 4], ["hold", 4], ["exhale", 4], ["rest", 4]]
      },
      advanced: {
        num: 3,
        name: { bn: "লেভেল ৩ · গভীর মনোযোগ (৫-৫-৫-৫ সে)", en: "Level 3 · Deep Focus (5s)" },
        desc: { bn: "উচ্চ একাগ্রতা ও সহনশীলতা: ৫ সে নিন, ৫ সে রাখুন, ৫ সে ছাড়ুন, ৫ সে বিরতি।", en: "Deep concentration & CO2 control: 5s inhale, 5s hold, 5s exhale, 5s rest." },
        phases: [["inhale", 5], ["hold", 5], ["exhale", 5], ["rest", 5]]
      }
    },
    name: { bn: "বক্স ব্রিদিং", en: "Box Breathing" },
    badge: { bn: "🎯 মনোযোগ ও ভারসাম্য", en: "🎯 Focus & Reset" },
    benefit: {
      bn: "মস্তিষ্কে স্থিরতা আনে, সতর্কতা বাড়ায় এবং স্নায়ুর ভারসাম্য রক্ষা করে।",
      en: "Centers the mind, enhances concentration, and stabilizes emotions."
    },
    when: {
      bn: "কাজের শুরুতে বা গুরুত্বপূর্ণ কাজের আগে",
      en: "Before focused tasks, study, or presentations"
    },
    desc: {
      bn: "সমান সময়ের চারটি ধাপের একটি কাঠামোবদ্ধ অনুশীলন। বিরতি বা শ্বাস ধরে রাখার ধাপ অস্বস্তিকর হলে এটি বাদ দিন।",
      en: "A structured pattern with four equal phases. Skip the pause or hold if it feels uncomfortable."
    }
  },
  {
    id: "diaphragmatic",
    icon: "bi-lungs",
    image: "diaphragmatic.svg",
    level: "beginner",
    category: "beginner",
    tag: "sleep",
    duration: 60,
    phases: [["inhale", 4], ["exhale", 5]],
    levels: {
      beginner: {
        num: 1,
        name: { bn: "লেভেল ১ · প্রাথমিক বিস্তার (৩–৪ সে)", en: "Level 1 · Light Expansion (3–4s)" },
        desc: { bn: "পেটের বিস্তার শুরু করতে ৩ সেকেন্ড শ্বাস নিন এবং ৪ সেকেন্ডে ছাড়ুন।", en: "Gentle belly expansion: 3s inhale, 4s exhale." },
        phases: [["inhale", 3], ["exhale", 4]]
      },
      intermediate: {
        num: 2,
        name: { bn: "লেভেল ২ · পূর্ণ ডায়াফ্রাম (৪–৫ সে)", en: "Level 2 · Full Diaphragm (4–5s)" },
        desc: { bn: "ফুসফুস ও পেটের গভীর ৪ সেকেন্ড শ্বাস নিন এবং ৫ সেকেন্ডে ছাড়ুন।", en: "Full diaphragmatic exchange: 4s inhale, 5s exhale." },
        phases: [["inhale", 4], ["exhale", 5]]
      },
      advanced: {
        num: 3,
        name: { bn: "লেভেল ৩ · প্রশান্ত ঘুম (৫–৭ সে)", en: "Level 3 · Deep Rest (5–7s)" },
        desc: { bn: "গভীর শারীরিক শিথিলতায় ৫ সেকেন্ড শ্বাস নিন এবং ৭ সেকেন্ডে ছাড়ুন।", en: "Restorative deep sleep cadence: 5s inhale, 7s exhale." },
        phases: [["inhale", 5], ["exhale", 7]]
      }
    },
    name: { bn: "ডায়াফ্রামেটিক ব্রিদিং", en: "Diaphragmatic Breathing" },
    badge: { bn: "🌙 গভীর শিথিলতা ও ঘুম", en: "🌙 Deep Calm & Sleep" },
    benefit: {
      bn: "ফুসফুসের পূর্ণ ব্যবহার নিশ্চিত করে এবং শরীরকে শিথিল করে বিশ্রামে নেয়।",
      en: "Encourages full oxygen exchange and eases physical tension."
    },
    when: {
      bn: "রাতে ঘুমানোর আগে বা শুয়ে বিশ্রাম নেওয়ার সময়",
      en: "Before sleep or when lying down to unwind"
    },
    desc: {
      bn: "পেটের স্বাভাবিক ওঠানামা লক্ষ্য করে নরম ও আরামদায়কভাবে শ্বাস নেওয়ার অনুশীলন।",
      en: "Practise gentle, comfortable breathing while noticing the natural movement of your abdomen."
    }
  },
  {
    id: "mindful",
    icon: "bi-flower1",
    image: "mindful.svg",
    level: "beginner",
    category: "mindful",
    tag: "mindful",
    duration: 60,
    phases: [["natural", 0]],
    levels: {
      beginner: {
        num: 1,
        name: { bn: "লেভেল ১ · নাসারন্ধ্রে সচেতনতা", en: "Level 1 · Breath Awareness" },
        desc: { bn: "কোনো ছন্দ চাপানো ছাড়া নাসারন্ধ্রে শ্বাসের হালকা ছোঁয়া লক্ষ্য করুন।", en: "Observe the subtle flow of air at your nostrils without changing pace." },
        phases: [["natural", 4]]
      },
      intermediate: {
        num: 2,
        name: { bn: "লেভেল ২ · পূর্ণ প্রবাহ ও বিরতি", en: "Level 2 · Flow Awareness" },
        desc: { bn: "বুক ও পেটের ওঠানামা এবং দুই শ্বাসের মধ্যকার স্বাভাবিক বিরতি লক্ষ্য করুন।", en: "Notice chest and belly movement and the natural pauses between breaths." },
        phases: [["natural", 5]]
      },
      advanced: {
        num: 3,
        name: { bn: "লেভেল ৩ · নিবিড় স্থিরতা", en: "Level 3 · Deep Stillness" },
        desc: { bn: "সম্পূর্ণ স্থিরতায় প্রতিটি শ্বাসের সাথে গভীরভাবে একাত্ম থাকা।", en: "Effortless unity of mind and breath in quiet contemplation." },
        phases: [["natural", 6]]
      }
    },
    name: { bn: "স্বাভাবিক মননশীল শ্বাস", en: "Natural Mindful Breathing" },
    badge: { bn: "🧘 সচেতন উপস্থিতি", en: "🧘 Mindfulness" },
    benefit: {
      bn: "কোনো চাপ ছাড়া কেবল শ্বাসের অনুভূতির সাথে থেকে মনকে শান্ত করে।",
      en: "Quietens mental clutter by simply observing the natural flow of breath."
    },
    when: {
      bn: "দিনের যেকোনো সময়ে মানসিক সতেজতা পেতে",
      en: "Anytime you need a peaceful mental reset"
    },
    desc: {
      bn: "শ্বাসের গতি পরিবর্তন না করে স্বাভাবিক শ্বাস-প্রশ্বাসের অনুভূতিতে মনোযোগ দিন।",
      en: "Notice the sensations of natural breathing without trying to change its rhythm."
    }
  }
];

/* ============================================================================
 * 3. GLOBAL RUNTIME STATE & DOM SELECTOR HELPERS
 * ============================================================================
 */

/** @type {string} Active application language code ('bn' or 'en'). */
let lang = localStorage.getItem("bw-lang") || "bn";

/** @type {Exercise} Currently selected exercise for details or session. */
let selected = exercises[0];

/** @type {string} Active progression level ('beginner', 'intermediate', 'advanced'). */
let selectedLevel = "intermediate";

/** @type {string} Active exercise category filter ('all' or 'beginner'). */
let filter = "all";

/** @type {string} Active wellness goal filter tag ('all', 'stress', 'focus', etc.). */
let exploreGoal = "all";

/** @type {Object|null} Runtime state machine of the active guided breathing session. */
let run = null;

/** @type {number|null} Animation frame request ID for cancelAnimationFrame(). */
let raf = null;

/** @type {boolean} Indicates whether the active session timer is currently paused. */
let paused = false;

/** @type {boolean} Indicates whether SpeechSynthesis voice guidance is enabled. */
let audioEnabled = false;

// Sharing & Persistence State
/** @type {Object|null} Snapshot of the most recently finished breathing session. */
let lastCompletedSession = null;

/** @type {Object|null} Snapshot of the most recent BOLT or BPM assessment result. */
let lastTestResult = null;

// Breathing Test State
/** @type {'bolt'|'bpm'} Active assessment mode on the breath test screen. */
let activeTestTab = 'bolt';

/** @type {boolean} Indicates whether a breath test stopwatch/countdown is active. */
let testRunning = false;

/** @type {number} High-resolution timestamp (performance.now()) when test started. */
let testStartTime = 0;

/** @type {number|null} Interval ID for the test stopwatch/countdown timer. */
let testInterval = null;

/** @type {number|null} Interval ID for the 3-2-1 get-ready preparation countdown. */
let testCountInterval = null;

/** @type {number} Accumulated breath tap counter during 30s BPM assessment. */
let bpmTaps = 0;

/** @type {number} Remaining seconds in the 30-second breath rate counter. */
let bpmCountdown = 30;

/** @type {string} Exercise ID recommended to the user based on test score. */
let recommendedExerciseId = 'relax46';

/* ============================================================================
 * 4. LOCALIZATION HELPERS & LANGUAGE SWITCH CONTROLLER
 * ============================================================================
 */

/**
 * Shorthand document.getElementById lookup.
 * @param {string} id - Element ID.
 * @returns {HTMLElement|null}
 */
const $ = id => document.getElementById(id);

/**
 * Translates an i18n key in the current language with fallback to key name.
 * @param {string} k - Translation key.
 * @returns {string} Localized string.
 */
const tr = k => T[lang][k] ?? k;

/**
 * Resolves localized name for an exercise.
 * @param {Exercise} e - Exercise object.
 * @returns {string}
 */
const exName = e => e.name[lang];

/**
 * Resolves localized description for an exercise.
 * @param {Exercise} e - Exercise object.
 * @returns {string}
 */
const exDesc = e => e.desc[lang];

/**
 * Resolves localized badge tag for an exercise.
 * @param {Exercise} e - Exercise object.
 * @returns {string}
 */
const exBadge = e => e.badge[lang];

/**
 * Resolves localized physiological benefit summary.
 * @param {Exercise} e - Exercise object.
 * @returns {string}
 */
const exBenefit = e => e.benefit[lang];

/**
 * Resolves localized optimal timing statement.
 * @param {Exercise} e - Exercise object.
 * @returns {string}
 */
const exWhen = e => e.when[lang];

/**
 * Resolves the array of phase tuples [phaseName, durationInSeconds] for an exercise
 * based on selected level.
 *
 * @param {Exercise} ex - Target exercise definition.
 * @param {string} lvlKey - Level key ('beginner', 'intermediate', 'advanced').
 * @returns {Array<[string, number]>} Phase tuple list.
 */
function getLevelPhases(ex, lvlKey) {
  if (ex && ex.levels && ex.levels[lvlKey]) {
    return ex.levels[lvlKey].phases;
  }
  return ex ? ex.phases : [["inhale", 4], ["exhale", 6]];
}

/**
 * Returns localized label for an exercise progression level.
 *
 * @param {string} lvlKey - Level key ('beginner', 'intermediate', 'advanced').
 * @returns {string} Localized level title.
 */
function getLevelLabel(lvlKey) {
  const map = {
    beginner: { bn: "লেভেল ১ · শুরুর জন্য", en: "Level 1 · Beginner" },
    intermediate: { bn: "লেভেল ২ · মাঝারি", en: "Level 2 · Intermediate" },
    advanced: { bn: "লেভেল ৩ · উন্নত", en: "Level 3 · Advanced" }
  };
  return map[lvlKey] ? map[lvlKey][lang] : lvlKey;
}

/**
 * Switches global language, updates localStorage, triggers full DOM translation,
 * and refreshes all active card lists, details views, and hero guides.
 *
 * @param {string} next - Target language code ('bn' or 'en').
 */
function setLang(next) {
  lang = next;
  localStorage.setItem("bw-lang", lang);
  document.documentElement.lang = lang;
  document.body.classList.toggle("bn", lang === "bn");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    let k = el.dataset.i18n;
    if (T[lang][k]) el.innerHTML = T[lang][k];
  });
  const langToggleBtn = $("langToggle");
  if (langToggleBtn) langToggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";
  renderCards();
  const detailsEl = $("details");
  if (detailsEl && detailsEl.classList.contains("active")) renderDetails();
  if (run) {
    updateSessionText();
    const sessionLevelBadge = $("sessionLevelBadge");
    if (sessionLevelBadge) sessionLevelBadge.textContent = getLevelLabel(run.level);
  }
  const completeEl = $("complete");
  if (completeEl && completeEl.classList.contains("active")) {
    renderSummary(lastCompletedSession?.cycles || 0, run?.elapsed || 0, getLevelLabel(run?.level || selectedLevel), lastCompletedSession?.level || selectedLevel);
    if (currentSessionMood) {
      const feedback = $("moodFeedback");
      if (feedback && !feedback.classList.contains("d-none")) {
        const msgMap = {
          calm: tr("moodCalmMsg"),
          refreshed: tr("moodRefreshedMsg"),
          focused: tr("moodFocusedMsg"),
          sleepy: tr("moodSleepyMsg")
        };
        feedback.textContent = msgMap[currentSessionMood] || "";
      }
    }
  }
  initHeroBreathGuide();
  loadTestHistory();
}

const langToggleBtn = $("langToggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => setLang(lang === "bn" ? "en" : "bn"));
}

/* ============================================================================
 * 5. CLIENT-SIDE ROUTING & NAVIGATION CONTROLLER
 * ============================================================================
 */

/**
 * Synchronizes active navigation states across desktop top navbar links and
 * the mobile bottom app drawer. Automatically adds `.nav-hidden` during active
 * breathing sessions to ensure an immersive, distraction-free environment.
 *
 * @param {string} screenId - ID of active screen or conceptual section.
 */
function updateNavActive(screenId) {
  const bottomNav = $("mobileBottomNav");
  let targetTab = screenId;
  if (screenId === "details" || screenId === "complete") {
    targetTab = "library";
  }

  if (bottomNav) {
    if (screenId === "session") {
      bottomNav.classList.add("nav-hidden");
    } else {
      bottomNav.classList.remove("nav-hidden");
    }

    const links = bottomNav.querySelectorAll(".mobile-nav-link");
    links.forEach(link => {
      const scr = link.dataset.screen;
      if (scr === targetTab) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // Also sync desktop navbar active class
  const desktopLinks = document.querySelectorAll("#navMenu .nav-link");
  desktopLinks.forEach(link => {
    const scr = link.dataset.screen;
    const fn = link.getAttribute("onclick") || "";
    const href = link.getAttribute("href") || "";
    let matches = false;

    if (screenId === "safety" && (scr === "safety" || fn.includes("goToSafety") || href.includes("#safety"))) {
      matches = true;
    } else if (screenId === "home" && (scr === "home" || fn.includes("go('home')") || href.endsWith("index.html") || href === "/")) {
      matches = true;
    } else if ((screenId === "library" || screenId === "details" || screenId === "complete") && (scr === "library" || fn.includes("go('library')") || href.includes("exercises.html"))) {
      matches = true;
    } else if (screenId === "test" && (scr === "test" || fn.includes("go('test')") || href.includes("test.html") || href.includes("breath-test.html"))) {
      matches = true;
    }
    if (matches) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

/**
 * Screen transition router.
 * Confirms user intent if navigating away from a running session, stops active
 * assessment timers, updates active screen classes, resets scroll position,
 * and collapses mobile menus.
 *
 * @param {string} id - Target screen section ID.
 */
function go(id) {
  if (run && id !== "session" && id !== "complete") {
    if (!confirm(tr("confirmStop"))) return;
    stopRun(false);
  }
  if (testRunning && id !== "test") {
    stopCurrentTest();
  }
  const target = $(id);
  if (target) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nav = $("navMenu");
    if (nav && nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
    if (id === 'test') {
      loadTestHistory();
    }
    updateNavActive(id);
  } else {
    // Navigate across pages if screen is not on this page
    if (id === 'home') {
      window.location.href = 'index.html';
    } else if (id === 'library' || id === 'exercises') {
      window.location.href = 'exercises.html';
    } else if (id === 'test') {
      window.location.href = 'breath-test.html';
    } else if (id === 'safety') {
      window.location.href = 'index.html#safety';
    }
  }
}

/* ============================================================================
 * 6. HERO BREATHEBUDDY MASCOT & LIVE RHYTHM GUIDE
 * ============================================================================
 */

/**
 * 1-click quick-start handler triggered by Hero Vibe Selector chips.
 * Immediately opens the exercise details screen for the target exercise.
 *
 * @param {string} id - Exercise identifier (e.g., 'relax46', 'box', etc.).
 */
function quickStartExercise(id) {
  const ex = exercises.find(e => e.id === id);
  if (ex) {
    selected = ex;
    selectedLevel = cardSelectedLevels[id] || "beginner";
    openDetails(id);
  } else {
    go("library");
  }
}

/** @type {number|null} Timer interval reference for the rhythmic hero breathing guide. */
let heroBreathTimer = null;

/** @type {boolean} State flag indicating whether the mascot is currently inhaling. */
let heroIsInhale = true;

/**
 * Initializes the rhythmic 3s-inhale / 3s-exhale live breathing guide pill
 * displayed directly under the BreatheBuddy mascot orb.
 */
function initHeroBreathGuide() {
  const guideEl = $("heroOrbGuide");
  if (!guideEl) return;
  if (heroBreathTimer) clearInterval(heroBreathTimer);

  heroIsInhale = true;
  guideEl.textContent = tr("heroLiveBreathing");
  guideEl.classList.remove("exhaling");

  heroBreathTimer = setInterval(() => {
    heroIsInhale = !heroIsInhale;
    if (guideEl && !guideEl.dataset.customText) {
      guideEl.textContent = heroIsInhale ? tr("heroLiveBreathing") : tr("heroLiveExhale");
      guideEl.classList.toggle("exhaling", !heroIsInhale);
    }
  }, 3000);
}

/**
 * Click/Tap handler for the BreatheBuddy mascot.
 * Triggers a joyful giggle bounce animation, spawns floating heart/star bubbles,
 * plays a Web Audio celebration chime, and displays an encouraging smile message.
 */
function tapHeroBuddy() {
  const orb = $("heroBuddyOrb");
  if (orb) {
    orb.classList.remove("buddy-giggle");
    void orb.offsetWidth;
    orb.classList.add("buddy-giggle");
  }

  spawnBuddyHearts();
  playCelebrationChime();

  const guideEl = $("heroOrbGuide");
  if (guideEl) {
    guideEl.dataset.customText = "true";
    guideEl.textContent = tr("heroOrbSmile");
    setTimeout(() => {
      delete guideEl.dataset.customText;
      if (guideEl) {
        guideEl.textContent = heroIsInhale ? tr("heroLiveBreathing") : tr("heroLiveExhale");
      }
    }, 2400);
  }
}

/**
 * Spawns 4 animated floating heart, sparkle, and blossom icons that drift
 * upward from the mascot orb and clean themselves up from the DOM.
 */
function spawnBuddyHearts() {
  const wrap = $("heroArtWrap");
  if (!wrap) return;
  const icons = ["🌸", "✨", "💙", "💨", "⭐"];
  for (let i = 0; i < 4; i++) {
    const heart = document.createElement("span");
    heart.className = "buddy-float-item";
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = (32 + Math.random() * 36) + "%";
    heart.style.top = (28 + Math.random() * 32) + "%";
    heart.style.animationDelay = (i * 0.1) + "s";
    wrap.appendChild(heart);
    setTimeout(() => {
      if (heart.parentElement) heart.remove();
    }, 1400);
  }
}

/* ============================================================================
 * 7. EXERCISE CARDS RENDERING & INTERACTIVE LEVEL PICKER
 * ============================================================================
 */

/**
 * Tracks the actively selected progression level on each exercise card.
 * @type {Object<string, string>}
 */
const cardSelectedLevels = {
  relax46: "beginner",
  box: "intermediate",
  diaphragmatic: "beginner",
  mindful: "beginner"
};

/**
 * Formats a concise cadence string for an exercise and level (e.g. "4s-6s", "4s-4s-4s-4s").
 *
 * @param {Exercise} ex - Target exercise.
 * @param {string} [lvlKey="beginner"] - Level key.
 * @returns {string} Formatted cadence text with seconds units.
 */
function getCadenceText(ex, lvlKey = "beginner") {
  const lvlObj = ex.levels ? ex.levels[lvlKey] : null;
  const phases = lvlObj ? lvlObj.phases : ex.phases;
  const secUnit = lang === "bn" ? "সে." : "s";
  if (phases && phases[0] && phases[0][0] === "natural") {
    return lang === "bn" ? "স্বাভাবিক ছন্দ" : "Natural Rhythm";
  }
  return phases.map(p => p[1] + secUnit).join("-");
}

/**
 * Returns localized compact level title for card badges.
 *
 * @param {Exercise} ex - Target exercise.
 * @param {string} [lvlKey="beginner"] - Level key.
 * @returns {string} Localized badge title.
 */
function getLevelShortName(ex, lvlKey = "beginner") {
  if (ex && ex.levels && ex.levels[lvlKey] && ex.levels[lvlKey].name) {
    return ex.levels[lvlKey].name[lang];
  }
  if (lvlKey === "beginner" || lvlKey === 1) return lang === "bn" ? "লেভেল ১ · সহজ" : "Level 1 · Gentle";
  if (lvlKey === "intermediate" || lvlKey === 2) return lang === "bn" ? "লেভেল ২ · ক্লাসিক" : "Level 2 · Classic";
  if (lvlKey === "advanced" || lvlKey === 3) return lang === "bn" ? "লেভেল ৩ · গভীর" : "Level 3 · Deep";
  return lang === "bn" ? "লেভেল ১" : "Level 1";
}

/**
 * Event handler for the interactive 1-click L1/L2/L3 level chips on cards.
 * Updates the card cadence pill, re-animates the soundwave bars, and syncs
 * the active level in cardSelectedLevels.
 *
 * @param {string} exId - Exercise ID.
 * @param {string} lvlKey - Selected level key ('beginner', 'intermediate', 'advanced').
 * @param {HTMLElement} btnEl - The clicked chip button element.
 */
function selectCardLevel(exId, lvlKey, btnEl) {
  cardSelectedLevels[exId] = lvlKey;
  const card = btnEl.closest(".exercise-card");
  if (card) {
    card.querySelectorAll(".level-chip").forEach(c => c.classList.remove("active"));
    btnEl.classList.add("active");

    const ex = exercises.find(e => e.id === exId);
    if (ex) {
      const activeNameEl = card.querySelector(`#activeLvlName_${exId}`);
      if (activeNameEl) {
        activeNameEl.style.opacity = '0';
        setTimeout(() => {
          activeNameEl.textContent = getLevelShortName(ex, lvlKey);
          activeNameEl.style.opacity = '1';
        }, 100);
      }
      const cadenceEl = card.querySelector(".art-cadence-pill");
      if (cadenceEl) {
        const textSpan = cadenceEl.querySelector(".cadence-text");
        if (textSpan) {
          textSpan.textContent = getCadenceText(ex, lvlKey);
        } else {
          cadenceEl.innerHTML = `
            <span class="cadence-wave" aria-hidden="true">
              <span class="cadence-bar bar-1"></span>
              <span class="cadence-bar bar-2"></span>
              <span class="cadence-bar bar-3"></span>
            </span>
            <span class="cadence-text">${getCadenceText(ex, lvlKey)}</span>
          `;
        }
        cadenceEl.classList.remove("cadence-pulse-update");
        void cadenceEl.offsetWidth;
        cadenceEl.classList.add("cadence-pulse-update");
      }
    }
  }
}

/**
 * Generates the responsive HTML markup string for an exercise card component.
 *
 * @param {Exercise} e - Exercise data object.
 * @param {number} [index=0] - Card index for staggered CSS entrance animations.
 * @returns {string} Card HTML string.
 */
function cardHTML(e, index = 0) {
  const iconFile = e.image || 'mindful.svg';
  const curLevelKey = cardSelectedLevels[e.id] || "beginner";

  return `<div class="col-md-6 col-xl-3 exercise-card-col" style="--card-index: ${index};">
    <article class="exercise-card theme-${e.id}">
      <!-- Top Floating Badges Bar -->
      <div class="card-top-bar d-flex justify-content-between align-items-center mb-2.5">
        <span class="exercise-goal-badge goal-${e.tag}">${exBadge(e)}</span>
        <span class="card-duration-badge"><i class="bi bi-clock-history me-1"></i>${tr("minOne")}</span>
      </div>

      <!-- Playful Animated Micro-Stage Art Box -->
      <div class="exercise-art art-${e.id}" onclick="openDetails('${e.id}')" role="button" tabindex="0" title="${exName(e)} · ${tr("viewDetails")}">
        <div class="art-ambient-glow" aria-hidden="true"></div>
        <div class="art-pulse-ring" aria-hidden="true"></div>
        <div class="art-orbit-ring" aria-hidden="true">
          <span class="orbit-sparkle"></span>
        </div>
        <div class="art-symbol">
          <img src="asset/image/${iconFile}" width="54" height="54" alt="${exName(e)}">
        </div>
        <!-- Live Cadence Rhythm Pill with animated soundwave bars -->
        <div class="art-cadence-pill" id="cadencePill_${e.id}" onclick="event.stopPropagation()">
          <span class="cadence-wave" aria-hidden="true">
            <span class="cadence-bar bar-1"></span>
            <span class="cadence-bar bar-2"></span>
            <span class="cadence-bar bar-3"></span>
          </span>
          <span class="cadence-text">${getCadenceText(e, curLevelKey)}</span>
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-body-content d-flex flex-column flex-grow-1">
        <h3 class="card-title" onclick="openDetails('${e.id}')" role="button" tabindex="0">${exName(e)}</h3>
                <!-- Playful Benefit Strip -->
        <div class="benefit-box">
          <div class="benefit-text"><i class="bi bi-stars text-primary me-1"></i>${exBenefit(e)}</div>
          <div class="when-text"><i class="bi bi-clock-history me-1"></i><strong>${tr("whenToUse")}:</strong> ${exWhen(e)}</div>
        </div>

        <!-- Interactive 1-Click Level Chooser -->
        <div class="card-level-picker">
          <div class="level-picker-header d-flex justify-content-between align-items-center">
            <span class="level-picker-label"><i class="bi bi-speedometer2 text-primary me-1"></i>${tr("levelLabel")}</span>
            <span class="level-picker-active-name" id="activeLvlName_${e.id}">${getLevelShortName(e, curLevelKey)}</span>
          </div>
          <div class="level-chips">
            <button type="button" class="btn level-chip ${curLevelKey === 'beginner' ? 'active' : ''}" onclick="selectCardLevel('${e.id}', 'beginner', this)" aria-label="${tr("lvlGentle")}">
              <span>L1</span> <small>${tr("lvlGentle")}</small>
            </button>
            <button type="button" class="btn level-chip ${curLevelKey === 'intermediate' ? 'active' : ''}" onclick="selectCardLevel('${e.id}', 'intermediate', this)" aria-label="${tr("lvlClassic")}">
              <span>L2</span> <small>${tr("lvlClassic")}</small>
            </button>
            <button type="button" class="btn level-chip ${curLevelKey === 'advanced' ? 'active' : ''}" onclick="selectCardLevel('${e.id}', 'advanced', this)" aria-label="${tr("lvlDeep")}">
              <span>L3</span> <small>${tr("lvlDeep")}</small>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2 mt-auto pt-2">
          <button class="btn btn-primary flex-grow-1 card-start-btn" onclick="quickStartSession('${e.id}')">
            <i class="bi bi-play-fill me-1 fs-5"></i><span>${tr("quickStart")}</span>
          </button>
          <button class="btn btn-outline-primary card-details-btn px-3" onclick="openDetails('${e.id}')" title="${tr("viewDetails")}">
            <i class="bi bi-info-circle me-1"></i><span>${tr("detailsLabel")}</span>
          </button>
        </div>
      </div>
    </article>
  </div>`;
}

/**
 * Renders exercise cards into the Featured grid (#featuredCards) on the Home page
 * and into the Library grid (#libraryCards) on the Exercises page, applying
 * active goal and category filters.
 */
function renderCards() {
  const featEl = $("featuredCards");
  const libEl = $("libraryCards");
  const goalFilteredList = exploreGoal === "all"
    ? exercises
    : exercises.filter(e => e.tag === exploreGoal);

  if (featEl) {
    featEl.innerHTML = goalFilteredList.map((e, i) => cardHTML(e, i)).join("");
  }
  if (libEl) {
    const hasGoalPills = !!$("exploreGoalPills");
    const libList = hasGoalPills
      ? goalFilteredList
      : exercises.filter(e => filter === "all" || e.category === filter || (filter === "beginner" && e.level === "beginner"));
    libEl.innerHTML = libList.map((e, i) => cardHTML(e, i)).join("");
  }
}

const goalPillsEl = $("exploreGoalPills");
if (goalPillsEl) {
  goalPillsEl.addEventListener("click", e => {
    let b = e.target.closest("[data-goal]");
    if (!b) return;
    exploreGoal = b.dataset.goal;
    document.querySelectorAll(".goal-pill").forEach(x => {
      x.classList.toggle("btn-primary", x === b);
      x.classList.toggle("btn-outline-primary", x !== b);
    });
    renderCards();
  });
}

const filtersEl = $("filters");
if (filtersEl) {
  filtersEl.addEventListener("click", e => {
    let b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(x => {
      x.classList.toggle("btn-primary", x === b);
      x.classList.toggle("btn-outline-primary", x !== b);
    });
    renderCards();
  });
}

/* ============================================================================
 * 8. EXERCISE DETAILS & CADENCE LEVEL SELECTOR
 * ============================================================================
 */

/**
 * Launches a guided breathing session directly from a card or button.
 * Navigates across pages if the session screen is not on the current page.
 *
 * @param {string} id - Exercise identifier.
 */
function quickStartSession(id) {
  selected = exercises.find(e => e.id === id) || exercises[0];
  selectedLevel = cardSelectedLevels[id] || "beginner";
  if (!$("session")) {
    window.location.href = `exercises.html?exercise=${id}&level=${selectedLevel}&action=start`;
    return;
  }
  startSession();
}

/**
 * Opens the exercise details view with full science explanation and pattern steps.
 * Handles cross-page navigation if invoked from outside exercises.html.
 *
 * @param {string} id - Exercise identifier.
 */
function openDetails(id) {
  selected = exercises.find(e => e.id === id) || exercises[0];
  selectedLevel = cardSelectedLevels[id] || "beginner";
  if (!$("details")) {
    window.location.href = `exercises.html?exercise=${id}&level=${selectedLevel}&action=details`;
    return;
  }
  renderDetails();
  go("details");
}

/**
 * Selects an active cadence progression level on the details screen and updates UI.
 *
 * @param {string} lvl - Level key ('beginner', 'intermediate', 'advanced').
 */
function selectLevel(lvl) {
  selectedLevel = lvl;
  document.querySelectorAll(".level-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === lvl);
  });
  updateLevelDetails();
}

/**
 * Refreshes the details screen level badge, description, and phase pattern cards.
 */
function updateLevelDetails() {
  const badgeEl = $("detailLevelBadge");
  if (badgeEl) badgeEl.textContent = getLevelLabel(selectedLevel);

  const descEl = $("detailLevelDesc");
  if (descEl && selected && selected.levels && selected.levels[selectedLevel]) {
    descEl.textContent = selected.levels[selectedLevel].desc[lang];
  }

  const patternEl = $("detailPattern");
  if (patternEl && selected) {
    const phases = getLevelPhases(selected, selectedLevel);
    if (phases[0][0] === "natural") {
      patternEl.innerHTML = `<div class="col-12"><div class="pattern-step"><strong>${lang === "bn" ? "স্বাভাবিক মননশীল শ্বাস" : "Natural Mindful Breathing"}</strong><small>${lang === "bn" ? "কোনো নির্দিষ্ট সময় নির্ধারিত নয় (সহজ উপস্থিতি)" : "No forced timing (gentle awareness)"}</small></div></div>`;
    } else {
      patternEl.innerHTML = phases.map(p => `
        <div class="col-${phases.length === 4 ? 6 : 6}">
          <div class="pattern-step">
            <strong>${phaseName(p[0])}</strong>
            <small>${p[1]} ${lang === "bn" ? "সেকেন্ড" : "seconds"}</small>
          </div>
        </div>
      `).join("");
    }
  }
}

/**
 * Populates the exercise details screen with the currently selected exercise's
 * title, illustration, description, and progression levels.
 */
function renderDetails() {
  const detailsEl = $("details");
  if (!detailsEl) return;
  const art = detailsEl.querySelector(".detail-visual");
  if (art) {
    art.className = "detail-visual h-100 art-" + (selected.id === "diaphragmatic" ? "diaph" : selected.id === "relax46" ? "relax" : selected.id === "box" ? "box" : "mindful");
    let iconFile = selected.image || 'mindful.svg';
    art.innerHTML = `<div class="orb"><div class="orb-core"><img src="asset/image/${iconFile}" width="64" height="64" alt="${exName(selected)}"></div></div>`;
  }
  const titleEl = $("detailTitle");
  if (titleEl) titleEl.textContent = exName(selected);
  const descEl = $("detailDesc");
  if (descEl) descEl.textContent = exDesc(selected);

  selectLevel(selectedLevel);
}

/**
 * Translates phase technical key into human-friendly localized title.
 *
 * @param {string} p - Phase type ('inhale', 'hold', 'exhale', 'rest', 'natural').
 * @returns {string} Localized phase name.
 */
function phaseName(p) {
  return ({
    inhale: tr("inhale"),
    exhale: tr("exhale"),
    hold: tr("hold"),
    rest: tr("rest"),
    natural: lang === "bn" ? "স্বাভাবিক" : "Natural"
  })[p];
}

/**
 * Displays the modal containing safety guidelines and clinical disclaimers.
 */
function showSafety() {
  const safetyList = $("safetyList");
  if (safetyList) {
    safetyList.innerHTML = T[lang].safetyItems.map(x => `<li>${x}</li>`).join("");
  }
  const modalEl = $("safetyModal");
  if (modalEl) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

/* ============================================================================
 * 9. INTERACTIVE SAFETY HUB & READINESS PROTOCOL
 * ============================================================================
 */

/** @type {'rules'|'checklist'|'conditions'|'emergency'} Active Safety Hub tab. */
let activeSafetyTab = 'rules';

/**
 * Toggles visible tab in the Safety Hub (Rules, Checklist, Conditions, Emergency).
 *
 * @param {'rules'|'checklist'|'conditions'|'emergency'} tab - Target tab slug.
 */
function switchSafetyTab(tab) {
  activeSafetyTab = tab;
  const buttons = document.querySelectorAll('.safety-tab-btn');
  buttons.forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('btn-primary', isActive);
    btn.classList.toggle('btn-outline-primary', !isActive);
  });

  const views = {
    rules: $('safetyViewRules'),
    checklist: $('safetyViewChecklist'),
    conditions: $('safetyViewConditions'),
    emergency: $('safetyViewEmergency')
  };

  Object.keys(views).forEach(k => {
    if (views[k]) {
      views[k].classList.toggle('d-none', k !== tab);
    }
  });
}

/**
 * Evaluates the 3-item pre-session readiness checklist, updates the progress
 * bar percentage, and toggles the ready confirmation banner.
 */
function updateSafetyChecklist() {
  const c1 = $('safetyCheck1')?.checked ? 1 : 0;
  const c2 = $('safetyCheck2')?.checked ? 1 : 0;
  const c3 = $('safetyCheck3')?.checked ? 1 : 0;
  const total = c1 + c2 + c3;

  const countBadge = $('safetyCheckProgressCount');
  if (countBadge) {
    countBadge.textContent = lang === 'bn' ? `${total}/৩` : `${total}/3`;
  }

  const progressBar = $('safetyCheckProgressBar');
  if (progressBar) {
    const pct = Math.round((total / 3) * 100);
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
    if (total === 3) {
      progressBar.classList.remove('bg-primary');
      progressBar.classList.add('bg-success');
    } else {
      progressBar.classList.remove('bg-success');
      progressBar.classList.add('bg-primary');
    }
  }

  const readyBanner = $('safetyReadyBanner');
  if (readyBanner) {
    readyBanner.classList.toggle('d-none', total < 3);
  }
}

/**
 * Clears all readiness checklist checkboxes and resets the progress meter.
 */
function resetSafetyCheck() {
  const c1 = $('safetyCheck1');
  const c2 = $('safetyCheck2');
  const c3 = $('safetyCheck3');
  if (c1) c1.checked = false;
  if (c2) c2.checked = false;
  if (c3) c3.checked = false;
  updateSafetyChecklist();
}

/**
 * Emergency calming reset button handler. Immediately halts running sessions
 * and tests, cancels speech audio, alerts user, and provides reassurance.
 */
function triggerSafetyReset() {
  if (run) stopRun(false);
  if (testRunning) stopCurrentTest();
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  toast(tr("emergencyToastMsg"));

  const resetBtn = $('emergencyResetBtn');
  if (resetBtn) {
    resetBtn.classList.remove('btn-danger');
    resetBtn.classList.add('btn-success');
    const origHtml = resetBtn.innerHTML;
    resetBtn.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${lang === 'bn' ? 'সেশন থামানো হয়েছে · স্বাভাবিক শ্বাস নিন' : 'Session Stopped · Breathe Gently'}`;
    setTimeout(() => {
      resetBtn.classList.remove('btn-success');
      resetBtn.classList.add('btn-danger');
      resetBtn.innerHTML = origHtml;
    }, 4000);
  }
}

/**
 * Smoothly scrolls to the #safety hub section, switching to the home page if
 * currently on another page.
 */
function goToSafety() {
  const el = $("safety");
  if (el) {
    go('home');
    updateNavActive('safety');
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth" });
    }, 80);
  } else {
    window.location.href = "index.html#safety";
  }
}

/* ============================================================================
 * 10. GUIDED BREATHING SESSION ENGINE (Timer & requestAnimationFrame Loop)
 * ============================================================================
 */

/**
 * Initializes and starts a new guided breathing practice session.
 * Configures the active duration (minimum 60s), audio guidance, level phase sequence,
 * resets the circular SVG progress ring, transitions to the 'session' screen,
 * and kicks off the high-precision requestAnimationFrame animation loop.
 */
function startSession() {
  if (run) stopRun(false);
  const durationSelect = $("durationSelect");
  const audioSelect = $("audioSelect");
  const duration = Number(durationSelect?.value || 60);
  audioEnabled = audioSelect?.value === "on" && "speechSynthesis" in window;
  const phases = getLevelPhases(selected, selectedLevel);

  run = {
    exercise: selected,
    level: selectedLevel,
    phases: phases,
    duration,
    elapsed: 0,
    completedCycles: 0,
    phaseIndex: 0,
    phaseElapsed: 0,
    startedAt: performance.now(),
    lastFrame: performance.now(),
    prepareRemaining: 3,
    preparing: true,
    pausedTotal: 0
  };
  paused = false;

  const sessionName = $("sessionName");
  if (sessionName) sessionName.textContent = exName(selected);
  const sessionLevelBadge = $("sessionLevelBadge");
  if (sessionLevelBadge) sessionLevelBadge.textContent = getLevelLabel(selectedLevel);
  const pauseBtn = $("pauseBtn");
  if (pauseBtn) {
    pauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    pauseBtn.setAttribute("aria-label", tr("pause"));
  }
  const progressBar = $("progressBar");
  if (progressBar) progressBar.style.width = "0%";
  const remainingTime = $("remainingTime");
  if (remainingTime) remainingTime.textContent = formatTime(duration);

  const breathStage = $("breathStage");
  if (breathStage) {
    breathStage.className = "breath-stage preparing";
    breathStage.style.setProperty("--phase-duration", "3s");
  }
  const breathRing = $("breathRing");
  if (breathRing) {
    breathRing.className = "breath-ring";
    breathRing.style.setProperty("--phase-duration", "3s");
  }
  const progRing = $("phaseProgressRing");
  if (progRing) progRing.style.strokeDashoffset = "892.21";
  const iconEl = $("phaseIcon");
  if (iconEl) iconEl.className = "bi bi-wind";

  const phaseLabel = $("phaseLabel");
  if (phaseLabel) phaseLabel.textContent = tr("prepare");
  const phaseCount = $("phaseCount");
  if (phaseCount) phaseCount.textContent = "3";
  const instructionText = $("instructionText");
  if (instructionText) instructionText.textContent = tr("prepareSub");
  const subInstruction = $("subInstruction");
  if (subInstruction) subInstruction.textContent = tr("sessionStarted");

  go("session");
  speak(tr("prepare"));
  raf = requestAnimationFrame(tick);
}

/**
 * Formats a duration in seconds into a standard MM:SS string representation.
 *
 * @param {number} s - Duration in seconds.
 * @returns {string} Formatted MM:SS time string (e.g. "01:30").
 */
function formatTime(s) {
  s = Math.max(0, Math.ceil(s));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

/**
 * Re-evaluates and updates the active exercise title and level badge in the session header
 * when language changes during an active run.
 */
function updateSessionText() {
  if (!run) return;
  const sessionName = $("sessionName");
  if (sessionName) sessionName.textContent = exName(run.exercise);
  const sessionLevelBadge = $("sessionLevelBadge");
  if (sessionLevelBadge) sessionLevelBadge.textContent = getLevelLabel(run.level);
}

/**
 * Returns the currently active phase tuple for the ongoing session.
 *
 * @returns {[string, number]} Phase tuple array (e.g. ['inhale', 4] or ['natural', 5]).
 */
function currentPhase() {
  return run.phases[run.phaseIndex];
}

/**
 * High-precision animation frame tick loop executed via requestAnimationFrame.
 * Clamps delta-time (dt <= 0.25s) to guard against browser background throttling spikes,
 * manages the 3-second preparation countdown, progresses cycle phases, updates the
 * SVG circular progress ring stroke offset, and triggers session completion.
 *
 * @param {DOMHighResTimeStamp} now - Timestamp provided by requestAnimationFrame.
 */
function tick(now) {
  if (!run || paused) return;
  let dt = Math.min((now - run.lastFrame) / 1000, .25);
  run.lastFrame = now;

  if (run.preparing) {
    run.prepareRemaining -= dt;
    const phaseCount = $("phaseCount");
    if (phaseCount) phaseCount.textContent = Math.max(0, Math.ceil(run.prepareRemaining));

    let prepPct = Math.max(0, Math.min(1, 1 - (run.prepareRemaining / 3)));
    const progRing = $("phaseProgressRing");
    if (progRing) progRing.style.strokeDashoffset = (892.21 * (1 - prepPct)).toFixed(2);

    if (run.prepareRemaining <= 0) {
      run.preparing = false;
      enterPhase();
    }
  } else {
    run.elapsed += dt;
    run.phaseElapsed += dt;
    let p = currentPhase(), dur = p[0] === "natural" ? 5 : p[1];
    if (p[0] === "natural") {
      if (run.phaseElapsed >= dur) {
        run.phaseElapsed %= dur;
        run.completedCycles++;
      }
    } else if (run.phaseElapsed >= dur) {
      run.phaseElapsed -= dur;
      run.phaseIndex++;
      if (run.phaseIndex >= run.phases.length) {
        run.phaseIndex = 0;
        run.completedCycles++;
      }
      enterPhase();
    }

    let phasePct = dur > 0 ? Math.max(0, Math.min(1, run.phaseElapsed / dur)) : 0;
    const progRing = $("phaseProgressRing");
    if (progRing) progRing.style.strokeDashoffset = (892.21 * (1 - phasePct)).toFixed(2);

    const phaseCount = $("phaseCount");
    if (phaseCount) phaseCount.textContent = p[0] === "natural" ? "" : Math.max(0, Math.ceil(dur - run.phaseElapsed));
  }

  const remaining = Math.max(0, run.duration - run.elapsed);
  const remainingTime = $("remainingTime");
  if (remainingTime) remainingTime.textContent = formatTime(remaining);
  const progressBar = $("progressBar");
  if (progressBar) progressBar.style.width = Math.min(100, run.elapsed / run.duration * 100) + "%";

  if (run.elapsed >= run.duration) {
    completeSession();
    return;
  }
  raf = requestAnimationFrame(tick);
}

/**
 * Transitions the visual breathing stage into the current phase.
 * Configures the CSS custom property '--phase-duration', updates stage class names
 * for expanding/contracting circle animations, updates phase icons and instructional copy,
 * and triggers voice guidance via Web Speech API.
 */
function enterPhase() {
  let p = currentPhase(), type = p[0], dur = type === "natural" ? 5 : p[1];

  const breathStage = $("breathStage");
  if (breathStage) {
    breathStage.className = "breath-stage " + type;
    breathStage.dataset.exercise = run.exercise.id;
    breathStage.style.setProperty("--phase-duration", dur + "s");
  }

  const breathRing = $("breathRing");
  if (breathRing) {
    breathRing.className = "breath-ring " + (type === "natural" ? "rest" : type);
    breathRing.dataset.exercise = run.exercise.id;
    breathRing.style.setProperty("--phase-duration", dur + "s");
  }

  const iconEl = $("phaseIcon");
  if (iconEl) {
    const iconMap = {
      inhale: "bi bi-arrow-up-circle-fill text-primary",
      hold: "bi bi-pause-circle-fill text-info",
      exhale: "bi bi-arrow-down-circle-fill text-primary",
      rest: "bi bi-heart-fill text-success",
      natural: "bi bi-flower1 text-success"
    };
    iconEl.className = iconMap[type] || "bi bi-wind";
  }

  const phaseLabel = $("phaseLabel");
  if (phaseLabel) {
    phaseLabel.textContent = type === "natural" ? (lang === "bn" ? "স্বাভাবিক শ্বাস" : "Natural breath") : phaseName(type);
  }
  const instructionText = $("instructionText");
  if (instructionText) {
    instructionText.textContent = type === "natural" ? (lang === "bn" ? "শ্বাসের স্বাভাবিক অনুভূতি লক্ষ্য করুন" : "Notice your natural breath") : phaseName(type);
  }
  const subInstruction = $("subInstruction");
  if (subInstruction) {
    subInstruction.textContent = type === "natural" ? (lang === "bn" ? "শ্বাসের গতি বদলানোর চেষ্টা করবেন না" : "Do not try to change its rhythm") : (lang === "bn" ? "ধীরে ও স্বচ্ছন্দে" : "Gently and comfortably");
  }
  const phaseCount = $("phaseCount");
  if (phaseCount) {
    phaseCount.textContent = type === "natural" ? "" : dur;
  }
  speak(type === "natural" ? (lang === "bn" ? "স্বাভাবিকভাবে শ্বাস নিন" : "Breathe naturally") : phaseName(type));
}

/**
 * Toggles the pause state of an ongoing breathing exercise session.
 * When paused, cancels requestAnimationFrame, cancels speech utterances,
 * freezes CSS breathing transitions, and toggles the pause/resume icon.
 */
function togglePause() {
  if (!run) return;
  paused = !paused;
  const breathStage = $("breathStage");
  const breathRing = $("breathRing");
  const instructionText = $("instructionText");
  const subInstruction = $("subInstruction");
  const pauseBtn = $("pauseBtn");

  if (paused) {
    cancelAnimationFrame(raf);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (breathStage) breathStage.classList.add("paused");
    if (breathRing) breathRing.style.transitionDuration = ".1s";
    if (instructionText) instructionText.textContent = tr("paused");
    if (subInstruction) subInstruction.textContent = tr("pausedSub");
    if (pauseBtn) {
      pauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      pauseBtn.setAttribute("aria-label", tr("resume"));
    }
  } else {
    run.lastFrame = performance.now();
    if (breathStage) breathStage.classList.remove("paused");
    if (pauseBtn) {
      pauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
      pauseBtn.setAttribute("aria-label", tr("pause"));
    }
    if (run.preparing) {
      if (instructionText) instructionText.textContent = tr("prepareSub");
    } else {
      enterPhase();
    }
    raf = requestAnimationFrame(tick);
  }
}

/**
 * Prompts the user with a confirmation alert before halting an active session prematurely.
 */
function confirmStop() {
  if (!run) return;
  if (confirm(tr("confirmStop"))) {
    stopRun(true);
  }
}

/**
 * Cleanly halts and tears down an ongoing breathing exercise session.
 * Cancels active animation frames, clears any pending speech synthesis,
 * resets the stage styling, and optionally navigates to the exercise library.
 *
 * @param {boolean} showHome - Whether to navigate back to the exercise library view.
 */
function stopRun(showHome) {
  cancelAnimationFrame(raf);
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  run = null;
  paused = false;
  const breathStage = $("breathStage");
  if (breathStage) breathStage.className = "breath-stage";
  if (showHome) go("library");
}

/* ============================================================================
 * 11. AUDIO GUIDANCE (SpeechSynthesis & Web Audio Chime Synthesizer)
 * ============================================================================
 */

/**
 * Vocalizes guidance instructions and phase changes using the Web Speech API.
 * Uses a relaxed playback rate (0.88x) and selects the appropriate BCP 47 language tag.
 *
 * @param {string} text - The instruction text to speak aloud.
 */
function speak(text) {
  if (!audioEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  let u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "bn" ? "bn-BD" : "en-US";
  u.rate = .88;
  window.speechSynthesis.speak(u);
}

/**
 * Synthesizes a celebratory four-note harmonic chord (C5, E5, G5, C6) using the Web Audio API.
 * Employs exponential gain attenuation envelopes for a crystal-clear, chime-like bell effect.
 * Completely self-contained and operates offline without external audio files.
 */
function playCelebrationChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Triumphant harmonic chord)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.9);
    });
  } catch (err) {
    // Non-blocking: AudioContext blocked or not supported
  }
}

/* ============================================================================
 * 12. CELEBRATION ENGINE: ANIMATED CHAMPION CUP & CONFETTI CANVAS
 * ============================================================================
 */

/**
 * Handles graceful session completion when the target timer reaches zero.
 * Cancels timers, captures completed metrics into `lastCompletedSession`,
 * displays the summary screen, triggers confetti physics, and sounds the victory chime.
 */
function completeSession() {
  cancelAnimationFrame(raf);
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  const completed = run.completedCycles, elapsed = run.elapsed;
  const lvlName = getLevelLabel(run.level);
  const curLevel = run.level;
  lastCompletedSession = {
    exName: exName(run.exercise),
    levelName: lvlName,
    duration: formatTime(elapsed || 0),
    cycles: completed,
    level: curLevel
  };
  renderSummary(completed, elapsed, lvlName, curLevel);
  checkNativeShareSupport();
  resetMoodSelection();
  go("complete");

  setTimeout(() => {
    triggerConfetti(65);
    playCelebrationChime();
  }, 220);
}

/**
 * Populates the completion celebration summary card with session metrics,
 * level progression badges, and tap hint for the interactive Champion Cup.
 *
 * @param {number} cycles - Completed breathing cycle count.
 * @param {number} elapsed - Total elapsed seconds.
 * @param {string} lvlName - Localized progression level label.
 * @param {string|number} curLevel - Active level identifier.
 */
function renderSummary(cycles, elapsed, lvlName, curLevel) {
  const summaryName = $("summaryName");
  if (summaryName) summaryName.textContent = exName(selected);
  const summaryLevel = $("summaryLevel");
  if (summaryLevel) summaryLevel.textContent = lvlName || getLevelLabel(selectedLevel);
  const summaryDuration = $("summaryDuration");
  if (summaryDuration) summaryDuration.textContent = formatTime(elapsed || 0);
  const summaryCycles = $("summaryCycles");
  if (summaryCycles) summaryCycles.textContent = cycles + " " + tr("cycleUnit");

  const lvl = curLevel || lastCompletedSession?.level || selectedLevel;
  const achievementText = $("achievementText");
  if (achievementText) {
    if (lvl === 1) achievementText.textContent = tr("badgeLevel1");
    else if (lvl === 2) achievementText.textContent = tr("badgeLevel2");
    else if (lvl === 3) achievementText.textContent = tr("badgeLevel3");
    else achievementText.textContent = tr("badgeMindfulMaster");
  }

  const cupBox = $("championCupBox");
  if (cupBox) {
    cupBox.classList.remove("cup-bounce-anim");
  }

  const tapHint = $("tapCupHint");
  if (tapHint) {
    tapHint.textContent = tr("tapCupConfetti");
  }
}

/** @type {Array<Object>} Active confetti particle simulation instances. */
let confettiParticles = [];

/** @type {number|null} requestAnimationFrame loop ID for active confetti animation. */
let confettiAnimationId = null;

/**
 * Spawns a burst of physics-based celebration confetti particles rendered on an HTML5 canvas.
 * Particles feature randomized trajectories, gravity, angular velocity, colors, and shapes.
 *
 * @param {number} [count=55] - Number of confetti particles to spawn.
 */
function triggerConfetti(count = 55) {
  const canvas = $("confettiCanvas");
  if (!canvas) return;
  const parent = canvas.parentElement;
  const width = (canvas.width = parent ? parent.clientWidth : window.innerWidth);
  const height = (canvas.height = parent ? parent.clientHeight : window.innerHeight);

  const colors = [
    "#FFD700", "#F59E0B", "#10B981", "#06B6D4", "#38BDF8",
    "#EC4899", "#8B5CF6", "#F97316", "#A7F3D0", "#FDE047"
  ];

  const originX = width / 2;
  const originY = Math.min(180, height * 0.3);

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * Math.random();
    const velocity = 4 + Math.random() * 8;
    confettiParticles.push({
      x: originX + (Math.random() - 0.5) * 60,
      y: originY + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 3.5,
      size: 6 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : (Math.random() > 0.5 ? "circle" : "star"),
      gravity: 0.16 + Math.random() * 0.12,
      life: 0,
      maxLife: 130 + Math.random() * 70
    });
  }

  if (!confettiAnimationId) {
    renderConfettiLoop();
  }
}

/**
 * 2D Canvas rendering loop for the physics-based confetti engine.
 * Updates velocity, gravity drag, rotational transforms, and alpha decay.
 */
function renderConfettiLoop() {
  const canvas = $("confettiCanvas");
  if (!canvas) {
    confettiParticles = [];
    confettiAnimationId = null;
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.985;
    p.rotation += p.rotationSpeed;

    if (p.life > p.maxLife - 25) {
      p.opacity = Math.max(0, (p.maxLife - p.life) / 25);
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.65);
    } else if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      for (let s = 0; s < 4; s++) {
        ctx.lineTo(Math.cos((s * 90 * Math.PI) / 180) * p.size, Math.sin((s * 90 * Math.PI) / 180) * p.size);
        ctx.lineTo(Math.cos(((s * 90 + 45) * Math.PI) / 180) * (p.size * 0.38), Math.sin(((s * 90 + 45) * Math.PI) / 180) * (p.size * 0.38));
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    if (p.life >= p.maxLife || p.y > canvas.height + 25) {
      confettiParticles.splice(i, 1);
    }
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(renderConfettiLoop);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiAnimationId = null;
  }
}

/**
 * Click handler for the interactive Champion Cup on the celebration screen.
 * Triggers an energetic bounce animation, bursts fresh confetti, plays the celebratory chime,
 * and updates the tap hint to an enthusiastic cheer.
 */
function celebrateAgain() {
  const cupBox = $("championCupBox");
  if (cupBox) {
    cupBox.classList.remove("cup-bounce-anim");
    void cupBox.offsetWidth;
    cupBox.classList.add("cup-bounce-anim");
  }

  triggerConfetti(45);
  playCelebrationChime();

  const hint = $("tapCupHint");
  if (hint) {
    hint.textContent = tr("tapCupCheers");
    setTimeout(() => {
      if (hint) hint.textContent = tr("tapCupConfetti");
    }, 2400);
  }
}

/* ============================================================================
 * 13. POST-SESSION MINDFUL MOOD REFLECTION CHECK-IN
 * ============================================================================
 */

/** @type {string|null} Currently selected post-session mood key ('calm', 'refreshed', 'focused', 'sleepy'). */
let currentSessionMood = null;

/**
 * Clears the active mood selection state and hides the reflection feedback message.
 */
function resetMoodSelection() {
  currentSessionMood = null;
  const allBtns = document.querySelectorAll("#moodOptions .mood-btn");
  allBtns.forEach(b => b.classList.remove("active"));
  const feedback = $("moodFeedback");
  if (feedback) feedback.classList.add("d-none");
}

/**
 * Records the user's post-session emotional reflection check-in and renders
 * a warm, affirming feedback message with a smooth fade-in transition.
 *
 * @param {string} moodKey - Selected mood identifier ('calm', 'refreshed', 'focused', 'sleepy').
 * @param {HTMLElement} btnEl - Button element that received the user's click/tap.
 */
function selectMood(moodKey, btnEl) {
  currentSessionMood = moodKey;
  const allBtns = document.querySelectorAll("#moodOptions .mood-btn");
  allBtns.forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  const feedback = $("moodFeedback");
  if (!feedback) return;

  const msgMap = {
    calm: tr("moodCalmMsg"),
    refreshed: tr("moodRefreshedMsg"),
    focused: tr("moodFocusedMsg"),
    sleepy: tr("moodSleepyMsg")
  };

  feedback.textContent = msgMap[moodKey] || "";
  feedback.classList.remove("d-none");
  feedback.style.animation = "none";
  void feedback.offsetWidth;
  feedback.style.animation = "moodFadeIn 0.35s ease";
}

/* ============================================================================
 * 14. SOCIAL MEDIA SHARING & CLIPBOARD COPY UTILITIES
 * ============================================================================
 */

/**
 * Inspects `navigator.share` availability and displays the native OS share sheet button
 * on supported modern mobile and desktop browsers.
 */
function checkNativeShareSupport() {
  const nativeBtn = $("nativeShareSessionBtn");
  if (nativeBtn && navigator.share) {
    nativeBtn.classList.remove("d-none");
  }
}

/**
 * Constructs the canonical web application share URL by extracting the origin and pathname.
 *
 * @returns {string} Sanitized base application URL.
 */
function getShareUrl() {
  return window.location.origin + window.location.pathname;
}

/**
 * Assembles a localized session milestone message and initiates social sharing.
 *
 * @param {string} platform - Target platform key ('whatsapp', 'twitter', 'facebook', 'linkedin', 'copy', 'native').
 */
function shareSession(platform) {
  const ex = lastCompletedSession?.exName || exName(selected);
  const lvl = lastCompletedSession?.levelName || getLevelLabel(selectedLevel);
  const dur = lastCompletedSession?.duration || "01:00";
  const cyc = (lastCompletedSession?.cycles ?? 0) + " " + tr("cycleUnit");
  const siteUrl = getShareUrl();

  const msg = lang === "bn"
    ? `🧘 আমি BreatheWell-এ "${ex}" (${lvl}) সফলভাবে সম্পন্ন করেছি! সময়: ${dur}, সম্পন্ন চক্র: ${cyc}। মানসিক প্রশান্তি পেতে আপনিও শ্বাস চর্চা করুন: ${siteUrl}`
    : `🧘 I just completed a ${lvl} session of "${ex}" on BreatheWell! Time: ${dur}, Completed: ${cyc}. Practice mindful breathing with me: ${siteUrl}`;

  executeShare(platform, msg, siteUrl, "BreatheWell Session");
}

/**
 * Assembles a localized breath test result message (BOLT / BPM) and initiates social sharing.
 *
 * @param {string} platform - Target platform key ('whatsapp', 'twitter', 'facebook', 'linkedin', 'copy', 'native').
 */
function shareTestResult(platform) {
  const type = lastTestResult?.type || (activeTestTab === 'bolt' ? 'BOLT' : 'BPM');
  const score = lastTestResult?.score || $("resultScoreNum")?.textContent || "";
  const grade = lastTestResult?.grade || $("resultScoreGrade")?.textContent || "";
  const siteUrl = getShareUrl();

  const msg = lang === "bn"
    ? `🫁 BreatheWell-এ আমার শ্বাসের ${type} পরীক্ষার ফলাফল: ${score} (${grade})! মাত্র ১ মিনিটে আপনার ফুসফুসের কার্যকারিতা ও মানসিক সুস্থতা যাচাই করুন: ${siteUrl}`
    : `🫁 My BreatheWell ${type} respiratory fitness score: ${score} (${grade})! Take a 1-minute science-backed breath test here: ${siteUrl}`;

  executeShare(platform, msg, siteUrl, "BreatheWell Test Result");
}

/**
 * Dispatches sharing intents to external social platform dialogs or the Clipboard API.
 * Supports WhatsApp, X / Twitter, Facebook, LinkedIn, Clipboard copy, and Web Share API.
 *
 * @param {string} platform - Selected sharing platform target.
 * @param {string} text - Message text to share.
 * @param {string} url - Application URL.
 * @param {string} title - Window or share sheet title.
 */
function executeShare(platform, text, url, title) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case "whatsapp":
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank", "noopener,noreferrer");
      break;
    case "twitter":
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank", "noopener,noreferrer");
      break;
    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, "_blank", "noopener,noreferrer,width=600,height=500");
      break;
    case "linkedin":
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank", "noopener,noreferrer,width=600,height=500");
      break;
    case "copy":
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          toast(tr("linkCopied"));
        }).catch(() => {
          fallbackCopyText(text);
        });
      } else {
        fallbackCopyText(text);
      }
      break;
    case "native":
      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url }).catch(() => { });
      } else {
        executeShare("copy", text, url, title);
      }
      break;
  }
}

/**
 * Fallback clipboard copy utility utilizing a temporary off-screen textarea element
 * and document.execCommand('copy') for environments without navigator.clipboard support.
 *
 * @param {string} text - Text to copy into clipboard.
 */
function fallbackCopyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
    toast(tr("linkCopied"));
  } catch (e) { }
  document.body.removeChild(ta);
}

/**
 * Displays a non-intrusive Bootstrap toast notification.
 *
 * @param {string} message - Notification text to present to the user.
 */
function toast(message) {
  const toastText = $("toastText");
  const appToast = $("appToast");
  if (toastText) toastText.textContent = message;
  if (appToast) bootstrap.Toast.getOrCreateInstance(appToast).show();
}

/* ============================================================================
 * 15. RESPIRATORY ASSESSMENT ENGINE (BOLT & BPM COUNTER)
 * ============================================================================
 */

/**
 * Toggles the active respiratory test mode between BOLT and BPM.
 * Updates instructional text, mode iconography, stage notices, and resets test state.
 *
 * @param {'bolt'|'bpm'} tab - The target test tab identifier.
 */
function switchTestTab(tab) {
  if (testRunning) stopCurrentTest();
  activeTestTab = tab;
  const boltBtn = $("tabBoltBtn");
  const bpmBtn = $("tabBpmBtn");
  if (boltBtn && bpmBtn) {
    boltBtn.classList.toggle("btn-primary", tab === 'bolt');
    boltBtn.classList.toggle("btn-outline-primary", tab !== 'bolt');
    bpmBtn.classList.toggle("btn-primary", tab === 'bpm');
    bpmBtn.classList.toggle("btn-outline-primary", tab !== 'bpm');
  }

  const iconEl = $("testModeIcon");
  const titleEl = $("testInstructionTitle");
  const bodyEl = $("testInstructionBody");
  const noticeEl = $("testStageNotice");
  const bpmBox = $("bpmCounterBox");

  if (tab === 'bolt') {
    if (iconEl) iconEl.className = "bi bi-stopwatch text-primary fs-2";
    if (titleEl) titleEl.textContent = tr("boltStepHeader");
    if (bodyEl) bodyEl.textContent = tr("boltSteps");
    if (noticeEl) noticeEl.textContent = tr("tapWhenUrge");
    if (bpmBox) bpmBox.classList.add("d-none");
  } else {
    if (iconEl) iconEl.className = "bi bi-activity text-primary fs-2";
    if (titleEl) titleEl.textContent = tr("bpmStepHeader");
    if (bodyEl) bodyEl.textContent = tr("bpmSteps");
    if (noticeEl) noticeEl.textContent = tr("bpmActiveNotice");
    if (bpmBox) bpmBox.classList.remove("d-none");
  }
  resetTest();
}

/**
 * Triggers a 3-second preparatory countdown before starting the active test measurement.
 */
function initiateTest() {
  const startBtn = $("startTestBtn");
  const countBox = $("testCountdownBox");
  const countNum = $("testCountdownNum");
  const activeStage = $("testActiveStage");

  if (startBtn) startBtn.classList.add("d-none");
  if (countBox) countBox.classList.remove("d-none");
  if (activeStage) activeStage.classList.add("d-none");

  let c = 3;
  if (countNum) countNum.textContent = c;

  testCountInterval = setInterval(() => {
    c--;
    if (c > 0) {
      if (countNum) countNum.textContent = c;
    } else {
      clearInterval(testCountInterval);
      testCountInterval = null;
      if (countBox) countBox.classList.add("d-none");
      startActiveTest();
    }
  }, 1000);
}

/**
 * Launches the active assessment timer.
 * For BOLT: Measures elapsed seconds until first natural urge to breathe.
 * For BPM: Counts breath taps across a 30-second window to calculate resting rate.
 */
function startActiveTest() {
  testRunning = true;
  testStartTime = performance.now();
  const activeStage = $("testActiveStage");
  if (activeStage) activeStage.classList.remove("d-none");

  const stopBtn = $("stopTestBtn");
  const tapBpmBtn = $("tapBpmBtn");

  if (activeTestTab === 'bolt') {
    if (stopBtn) stopBtn.classList.remove("d-none");
    if (tapBpmBtn) tapBpmBtn.classList.add("d-none");

    const timerDisp = $("boltTimerDisplay");
    testInterval = setInterval(() => {
      let sec = ((performance.now() - testStartTime) / 1000).toFixed(1);
      if (timerDisp) timerDisp.textContent = sec + "s";
    }, 100);
  } else {
    bpmTaps = 0;
    bpmCountdown = 30;
    const bpmCountNum = $("bpmCountNum");
    if (bpmCountNum) bpmCountNum.textContent = "0";
    const countdownText = $("bpmCountdownText");
    if (countdownText) countdownText.textContent = lang === "bn" ? `বাকি সময়: ${bpmCountdown} সেকেন্ড` : `Time left: ${bpmCountdown}s`;

    if (stopBtn) stopBtn.classList.add("d-none");
    if (tapBpmBtn) tapBpmBtn.classList.remove("d-none");

    const timerDisp = $("boltTimerDisplay");
    testInterval = setInterval(() => {
      bpmCountdown--;
      let elapsed = ((performance.now() - testStartTime) / 1000).toFixed(1);
      if (timerDisp) timerDisp.textContent = elapsed + "s";
      if (countdownText) countdownText.textContent = lang === "bn" ? `বাকি সময়: ${Math.max(0, bpmCountdown)} সেকেন্ড` : `Time left: ${Math.max(0, bpmCountdown)}s`;
      if (bpmCountdown <= 0) {
        stopCurrentTest();
      }
    }, 1000);
  }
}

/**
 * Tap listener for BPM assessment; records each full breath cycle tap and updates UI.
 */
function recordBpmBreath() {
  if (!testRunning || activeTestTab !== 'bpm') return;
  bpmTaps++;
  const countEl = $("bpmCountNum");
  if (countEl) countEl.textContent = bpmTaps;
}

/**
 * Halts an active assessment, cleans up intervals, calculates scores,
 * and delegates to renderBoltResult or renderBpmResult.
 */
function stopCurrentTest() {
  if (!testRunning) return;
  testRunning = false;
  if (testInterval) {
    clearInterval(testInterval);
    testInterval = null;
  }
  if (testCountInterval) {
    clearInterval(testCountInterval);
    testCountInterval = null;
  }

  const durationSec = Math.max(0.1, (performance.now() - testStartTime) / 1000);

  if (activeTestTab === 'bolt') {
    renderBoltResult(durationSec);
  } else {
    let rate = Math.round((bpmTaps / Math.min(30, durationSec)) * 60);
    renderBpmResult(rate);
  }
}

/**
 * Evaluates the BOLT score against clinical respiratory standards:
 * - <10s: Poor CO2 tolerance & chronic stress (Recommends Diaphragmatic)
 * - 10-19s: Moderate respiratory efficiency (Recommends 4-6 Relaxing)
 * - 20-29s: Good respiratory health and balance (Recommends Box Breathing)
 * - >=30s: Optimal respiratory mastery (Recommends Mindful Breathing)
 *
 * @param {number} sec - Measured breath-hold duration in seconds.
 */
function renderBoltResult(sec) {
  const roundedSec = Math.round(sec);
  const scoreNum = $("resultScoreNum");
  const scoreGrade = $("resultScoreGrade");
  const scoreDetail = $("resultScoreDetail");
  const recTitle = $("recExerciseTitle");
  const recReason = $("recExerciseReason");

  if (scoreNum) scoreNum.textContent = roundedSec + "s";

  let grade = "", detail = "", recId = "";
  if (roundedSec < 10) {
    grade = lang === "bn" ? "খুব কম (উচ্চ মানসিক চাপ ও দুর্বল CO2 সহনশীলতা)" : "Low (Elevated Stress & Low CO2 Tolerance)";
    detail = lang === "bn"
      ? "আপনার স্কোর ইঙ্গিত করে যে আপনি হয়তো অতিরিক্ত বা অগভীরভাবে শ্বাস নিচ্ছেন। এটি শরীরকে ক্লান্ত ও নার্ভাস রাখে। ডায়াফ্রামেটিক ব্রিদিং দিয়ে পেটের মাধ্যমে গভীর শ্বাস নেওয়ার অভ্যাস তৈরি করা জরুরি।"
      : "Your score indicates potential over-breathing or shallow upper-chest breathing. Oxygen delivery to cells is constricted. Diaphragmatic breathing is highly recommended.";
    recId = "diaphragmatic";
  } else if (roundedSec < 20) {
    grade = lang === "bn" ? "মাঝারি কার্যকারিতা (উন্নতির সুযোগ রয়েছে)" : "Moderate Respiratory Efficiency";
    detail = lang === "bn"
      ? "আপনার শ্বাসের ছন্দ তুলনামূলক স্বাভাবিক হলেও মানসিক চাপের সময় শ্বাস দ্রুত হয়ে পড়ার সম্ভাবনা থাকে। ৪–৬ রিল্যাক্সিং ব্রিদিং আপনার স্নায়ুতন্ত্রকে শান্ত ও সুষম রাখবে।"
      : "You have a reasonable baseline, but prolonged exhalations will train your nervous system to stay grounded under stress.";
    recId = "relax46";
  } else if (roundedSec < 30) {
    grade = lang === "bn" ? "ভালো ও সুষম শ্বাস-প্রশ্বাস" : "Good Respiratory Health & Control";
    detail = lang === "bn"
      ? "আপনার ফুসফুসের কার্যকারিতা ও অক্সিজেন সহনশীলতা যথেষ্ট ভালো। মনোযোগ ও মানসিক স্থিরতা বজায় রাখতে বক্স ব্রিদিং আপনার জন্য সবচেয়ে উপযোগী।"
      : "Great breath endurance and CO2 tolerance. Your autonomic nervous system is well-regulated. Box breathing will sharpen your concentration.";
    recId = "box";
  } else {
    grade = lang === "bn" ? "চমৎকার ও উচ্চ স্তরের নিয়ন্ত্রণ" : "Optimal Respiratory Mastery";
    detail = lang === "bn"
      ? "আপনার শ্বাসপ্রশ্বাস প্রক্রিয়া অত্যন্ত সুশৃঙ্খল ও শান্ত। প্রাকৃতিক মননশীল শ্বাসের মাধ্যমে এই ভারসাম্য বজায় রাখুন।"
      : "Outstanding lung efficiency and nervous system balance. Natural mindful breathing will help you sustain effortless awareness.";
    recId = "mindful";
  }

  recommendedExerciseId = recId;
  const targetEx = exercises.find(e => e.id === recId) || exercises[0];

  if (scoreGrade) scoreGrade.textContent = grade;
  if (scoreDetail) scoreDetail.textContent = detail;
  if (recTitle) recTitle.textContent = exName(targetEx);
  if (recReason) recReason.textContent = exBenefit(targetEx);

  lastTestResult = {
    type: "BOLT",
    score: roundedSec + "s",
    grade: grade
  };

  saveTestRecord({
    type: "BOLT",
    score: roundedSec + "s",
    grade: grade,
    date: new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  });

  const instructView = $("testInstructionView");
  const resultView = $("testResultView");
  if (instructView) instructView.classList.add("d-none");
  if (resultView) resultView.classList.remove("d-none");
}

/**
 * Evaluates resting breath frequency (BPM):
 * - >18 BPM: Rapid rate / sympathetic arousal (Recommends 4-6 Relaxing)
 * - 12-18 BPM: Healthy resting breath frequency (Recommends Box Breathing)
 * - <12 BPM: Deep calm / parasympathetic tone (Recommends Mindful Breathing)
 *
 * @param {number} rate - Breaths per minute frequency.
 */
function renderBpmResult(rate) {
  const scoreNum = $("resultScoreNum");
  const scoreGrade = $("resultScoreGrade");
  const scoreDetail = $("resultScoreDetail");
  const recTitle = $("recExerciseTitle");
  const recReason = $("recExerciseReason");

  if (scoreNum) scoreNum.textContent = rate + " BPM";

  let grade = "", detail = "", recId = "";
  if (rate > 18) {
    grade = lang === "bn" ? "দ্রুত গতি (উচ্চ চাপ বা উত্তেজনা)" : "Rapid Rate (Heightened Arousal / Stress)";
    detail = lang === "bn"
      ? "আপনার বিশ্রামের শ্বাসের হার স্বাভাবিকের চেয়ে বেশি। ধীর শ্বাসের মাধ্যমে প্যারাসিমপ্যাথেটিক সিস্টেমকে সক্রিয় করুন।"
      : "Your breathing rate is elevated above normal resting averages (12-16 bpm). Relaxing 4-6 breathing will help slow your breath.";
    recId = "relax46";
  } else if (rate >= 12) {
    grade = lang === "bn" ? "স্বাভাবিক ও স্বাস্থ্যকর রেট" : "Healthy Resting Breath Rate";
    detail = lang === "bn"
      ? "আপনার বিশ্রামের শ্বাসের হার স্বাভাবিক সীমার মধ্যে রয়েছে। বক্স ব্রিদিং অনুশীলন আপনার মনোযোগকে আরও দৃঢ় করবে।"
      : "Your breathing frequency is well within the healthy resting average. Box breathing is great to maintain balance.";
    recId = "box";
  } else {
    grade = lang === "bn" ? "অত্যন্ত শান্ত ও গভীর শ্বাস" : "Deep Calm & Low Frequency";
    detail = lang === "bn"
      ? "আপনার শ্বাসের ছন্দ অত্যন্ত ধীর ও শিথিল, যা গভীর মননশীলতার পরিচায়ক।"
      : "Your respiration rate is exceptionally calm and meditative.";
    recId = "mindful";
  }

  recommendedExerciseId = recId;
  const targetEx = exercises.find(e => e.id === recId) || exercises[0];

  if (scoreGrade) scoreGrade.textContent = grade;
  if (scoreDetail) scoreDetail.textContent = detail;
  if (recTitle) recTitle.textContent = exName(targetEx);
  if (recReason) recReason.textContent = exBenefit(targetEx);

  lastTestResult = {
    type: "BPM",
    score: rate + " BPM",
    grade: grade
  };

  saveTestRecord({
    type: "BPM",
    score: rate + " BPM",
    grade: grade,
    date: new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  });

  const instructView = $("testInstructionView");
  const resultView = $("testResultView");
  if (instructView) instructView.classList.add("d-none");
  if (resultView) resultView.classList.remove("d-none");
}

/* ============================================================================
 * 16. LOCAL STORAGE PERSISTENCE & HISTORY TRACKING
 * ============================================================================
 */

/**
 * Persists an assessment record to browser localStorage ('bw_test_history'),
 * capping stored history at the 8 most recent test entries.
 *
 * @param {Object} record - Assessment record payload.
 * @param {string} record.type - Test type ('BOLT' or 'BPM').
 * @param {string} record.score - Formatted score with units.
 * @param {string} record.grade - Evaluation grade tier.
 * @param {string} record.date - Localized date and time string.
 */
function saveTestRecord(record) {
  try {
    let history = JSON.parse(localStorage.getItem("bw_test_history") || "[]");
    history.unshift(record);
    if (history.length > 8) history = history.slice(0, 8);
    localStorage.setItem("bw_test_history", JSON.stringify(history));
    loadTestHistory();
  } catch (e) { }
}

/**
 * Retrieves assessment records from localStorage and renders them in the history container.
 * Displays a friendly empty-state prompt if no prior records exist.
 */
function loadTestHistory() {
  const container = $("testHistoryList");
  if (!container) return;
  try {
    const history = JSON.parse(localStorage.getItem("bw_test_history") || "[]");
    if (!history.length) {
      container.innerHTML = `<p class="small text-muted mb-0" id="emptyHistoryMsg">${tr("noHistoryYet")}</p>`;
      return;
    }
    container.innerHTML = history.map(item => `
      <div class="test-history-item">
        <div>
          <strong class="text-primary">${item.type}: ${item.score}</strong>
          <div class="text-muted" style="font-size:0.75rem">${item.grade}</div>
        </div>
        <span class="badge bg-light text-secondary border">${item.date}</span>
      </div>
    `).join("");
  } catch (e) { }
}

/**
 * Clears all saved assessment records from localStorage and re-renders the empty view.
 */
function clearTestHistory() {
  localStorage.removeItem("bw_test_history");
  loadTestHistory();
}

/**
 * Resets the breathing test interface to its initial state, clearing active timers
 * and restoring the instructional start view.
 */
function resetTest() {
  if (testRunning) stopCurrentTest();
  testRunning = false;
  if (testInterval) clearInterval(testInterval);
  if (testCountInterval) clearInterval(testCountInterval);

  const instructView = $("testInstructionView");
  const resultView = $("testResultView");
  const countBox = $("testCountdownBox");
  const activeStage = $("testActiveStage");
  const startBtn = $("startTestBtn");
  const stopBtn = $("stopTestBtn");
  const tapBpmBtn = $("tapBpmBtn");
  const timerDisp = $("boltTimerDisplay");

  if (instructView) instructView.classList.remove("d-none");
  if (resultView) resultView.classList.add("d-none");
  if (countBox) countBox.classList.add("d-none");
  if (activeStage) activeStage.classList.add("d-none");
  if (startBtn) startBtn.classList.remove("d-none");
  if (stopBtn) stopBtn.classList.add("d-none");
  if (tapBpmBtn) tapBpmBtn.classList.add("d-none");
  if (timerDisp) timerDisp.textContent = "00.0s";
}

/**
 * Launches the personalized exercise recommended by the user's latest assessment score.
 * Handles cross-page navigation if the session container is not on the current page.
 */
function launchRecommendedExercise() {
  selected = exercises.find(e => e.id === recommendedExerciseId) || exercises[0];
  if (!$("session")) {
    window.location.href = `exercises.html?exercise=${recommendedExerciseId}&action=start`;
    return;
  }
  startSession();
}

/* ============================================================================
 * 17. MULTI-PAGE DEEP LINKING & APPLICATION LIFECYCLE
 * ============================================================================
 */

/**
 * Background tab safety listener: Automatically pauses any running exercise session
 * when the document visibility changes to hidden (e.g. user switches tabs).
 */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && run && !paused) {
    togglePause();
    toast(lang === "bn" ? "ট্যাবটি আড়ালে যাওয়ায় অনুশীলন বিরতিতে রাখা হয়েছে।" : "Practice paused because this tab is no longer visible.");
  }
});

/**
 * Determines the initial active screen identifier based on document body data-page attribute,
 * active .screen DOM class, or URL pathname heuristics.
 *
 * @returns {string} Initial screen ID ('home', 'library', 'test', etc.).
 */
function getInitialScreen() {
  const page = document.body.dataset.page;
  if (page) return page === "exercises" ? "library" : page;
  const activeScreen = document.querySelector(".screen.active");
  if (activeScreen) return activeScreen.id;
  const path = window.location.pathname.toLowerCase();
  if (path.includes("exercise")) return "library";
  if (path.includes("test")) return "test";
  return "home";
}

/**
 * Parses deep-linking URL parameters (?goal=..., ?exercise=..., ?level=..., ?action=...)
 * on initial page load and routes directly to the requested exercise or category filter.
 */
function handleUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("goal")) {
      const g = params.get("goal");
      if (["all", "stress", "focus", "sleep", "mindful"].includes(g)) {
        exploreGoal = g;
        document.querySelectorAll(".goal-pill").forEach(x => {
          const isActive = x.dataset.goal === g;
          x.classList.toggle("btn-primary", isActive);
          x.classList.toggle("btn-outline-primary", !isActive);
        });
        renderCards();
      }
    }
    if (params.has("exercise")) {
      const exId = params.get("exercise");
      const ex = exercises.find(e => e.id === exId);
      if (ex) {
        selected = ex;
        if (params.has("level")) {
          const lvl = params.get("level");
          if (["beginner", "intermediate", "advanced"].includes(lvl)) {
            selectedLevel = lvl;
            cardSelectedLevels[exId] = lvl;
          }
        }
        const action = params.get("action");
        if (action === "start") {
          setTimeout(() => {
            startSession();
          }, 80);
        } else {
          setTimeout(() => {
            openDetails(exId);
          }, 50);
        }
      }
    }
  } catch (e) { }
}

/**
 * Smoothly scrolls to target hash anchors on page load (e.g. #safety) and updates navigation.
 */
function handleHashOnLoad() {
  if (window.location.hash === "#safety") {
    setTimeout(() => {
      const el = $("safety");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        updateNavActive("safety");
      }
    }, 120);
  }
}

// ----------------------------------------------------------------------------
// APPLICATION BOOTSTRAP SEQUENCE
// ----------------------------------------------------------------------------
setLang(lang);
renderCards();
const currentScreen = getInitialScreen();
updateNavActive(currentScreen);
if (currentScreen === "test") {
  loadTestHistory();
}
handleUrlParams();
handleHashOnLoad();

/**
 * IntersectionObserver for Safety Hub scrollspy on Home screen:
 * Dynamically highlights the Safety tab in the mobile bottom drawer navigation
 * whenever the user scrolls past the 25% threshold of the #safety section.
 */
if ("IntersectionObserver" in window) {
  const safetyObserver = new IntersectionObserver((entries) => {
    const homeScreen = $("home");
    if (!homeScreen || !homeScreen.classList.contains("active")) return;
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
        updateNavActive("safety");
      } else if (!entry.isIntersecting) {
        const rect = entry.boundingClientRect;
        if (rect.top > 0) {
          updateNavActive("home");
        }
      }
    });
  }, { threshold: [0.25] });
  const safetyEl = $("safety");
  if (safetyEl) safetyObserver.observe(safetyEl);
}
