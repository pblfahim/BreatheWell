/**
 * ============================================================================
 * BreatheWell - Home Page Application Engine (script.js)
 * ============================================================================
 * @file        asset/js/script.js
 * @module      BreatheWell/Home
 * @description Dedicated controller for BreatheWell Landing & Home Experience:
 *                1. Bilingual Localization Engine (Bengali / English)
 *                2. Interactive Hero BreatheBuddy Mascot & Live Rhythm Stage
 *                3. Multi-Module Hero Carousel Slider (Auto-rotation, swipe, dots)
 *                4. Featured Breathing Exercises Grid & Goal-based Filtering
 *                5. Interactive 4-Pillar Safety Hub & Pre-Session Readiness System
 *                6. Respiratory Assessment Teaser Callout
 *                7. Cross-Page Routing & Navigation Orchestration
 *
 * NOTE: Modular page scripts have been extracted for enhanced performance:
 *       - Breathing Exercises Studio -> asset/js/exercises.js
 *       - Respiratory Assessment Engine -> asset/js/breath-test.js
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
    navExercises: "শ্বাসের অনুশীলন",
    navTest: "শ্বাসের পরীক্ষা",
    tabExercises: "শ্বাসের অনুশীলন",
    tabBreathTest: "শ্বাসের পরীক্ষা",
    navSafety: "নিরাপত্তা",
    navHealth: "স্বাস্থ্য ট্র্যাকার",
    navRx: "প্রেসক্রিপশন",
    navMore: "আরও",
    sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ও মাইন্ডফুলনেস",
    navPagesTitle: "পেজ ও মডিউল",
    navHomeSub: "মূল পাতা ও ফিচারসমূহ",
    navExercisesSub: "শ্বাস-প্রশ্বাসের ব্যায়াম ও BOLT টেস্ট",
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
    heroSlide2Badge: "ক্লিনিক্যাল ভাইটাল ট্র্যাকার 🩺",
    heroSlide2Title: "রক্তচাপ ও ডায়াবেটিস সহজ ট্র্যাকিং",
    heroSlide2Desc: "আমেরিকান হার্ট অ্যাসোসিয়েশন (AHA 2017) ও ADA স্ট্যান্ডার্ড অনুযায়ী লাইভ ডায়াগনস্টিক স্কেল, ট্রেন্ড অ্যানালিটিক্স ও পরিবারের সাথে সরাসরি হোয়াটসঅ্যাপ রিপোর্ট শেয়ারিং।",
    heroSlide2Cta: "হেলথ ট্র্যাকার খুলুন",
    heroSlide2Sec: "লগ যোগ করুন",
    heroSlide2Perk1: "AHA ও ADA স্কেল",
    heroSlide2Perk2: "হোয়াটসঅ্যাপ ফ্যামিলি শেয়ার",
    heroSlide2Perk3: "ডক্টর রিপোর্ট সামারি",
    heroSlide2Live: "লাইভ মনিটর",
    heroSlide2BpLabel: "রক্তচাপ (BP)",
    heroSlide2BpStatus: "স্বাভাবিক",
    heroSlide2BgLabel: "রক্তের গ্লুকোজ",
    heroSlide2BgStatus: "খাবার পূর্বে",
    heroSlide2PulseLabel: "পালস রেট",
    heroSlide2PulseStatus: "সুষম ছন্দ",
    heroSlide2Pill1: "AHA 2017 স্ট্যান্ডার্ড",
    heroSlide2Pill2: "৭-৩০ দিনের ট্রেন্ড",
    heroSlide2Pill3: "পিন লক সুরক্ষিত",
    heroSlide3Badge: "স্মার্ট এআই প্রেসক্রিপশন ও ওসিআর 📄",
    heroSlide3Title: "প্রেসক্রিপশন স্ক্যান ও ডিজিটাল ব্যবস্থাপনা",
    heroSlide3Desc: "প্রেসক্রিপশনের ছবি আপলোড করুন; ক্লায়েন্ট-সাইড Tesseract OCR দিয়ে তাৎক্ষণিক ওষুধ, মাত্রা ও নিয়মাবলী স্ক্যান করে স্বয়ংক্রিয় ডিজিটাল প্যাডে রূপান্তর করুন।",
    heroSlide3Cta: "ওসিআর দিয়ে স্ক্যান করুন",
    heroSlide3Sec: "প্রেসক্রিপশন ভল্ট",
    heroSlide3Perk1: "ক্লায়েন্ট-সাইড Tesseract OCR",
    heroSlide3Perk2: "১০০% ডিভাইসে সুরক্ষিত (Offline)",
    heroSlide3Perk3: "প্রিন্ট ও PDF রেডি",
    heroSlide3PadTitle: "সিটি কেয়ার হাসপাতাল · ডিজিটাল প্রেসক্রিপশন",
    heroSlide3Doc: "ডাঃ এম. এ. রহমান (MBBS, FCPS)",
    heroSlide3ScanStatus: "ওসিআর স্ক্যান সক্রিয়...",
    heroSlide3Accuracy: "৯৮% ওসিআর সঠিকতা",
    heroSlide3Med1: "Tab. Napa Extra 500mg",
    heroSlide3Dose1: "১+০+১ (ভরা পেটে)",
    heroSlide3Med2: "Cap. Seclo 20mg",
    heroSlide3Dose2: "১+০+১ (খাবার পূর্বে)",
    heroSlide3Pill1: "অটো মেডিসিন ডিটেকশন",
    heroSlide3Pill2: "ডিজিটাল সিগনেচার",
    heroSlide3Pill3: "হোয়াটসঅ্যাপে শেয়ার",
    heroSlide3Stamp: "ডিজিটাল ভেরিফাইড",
    heroSlide3Date: "আজকের প্রেসক্রিপশন",
    sliderPrev: "পূর্ববর্তী স্লাইড",
    sliderNext: "পরবর্তী স্লাইড",
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
    soundOn: "শব্দ চালু",
    soundOff: "শব্দ বন্ধ",
    clinicalValidated: "ক্লিনিক্যাল প্রোটোকল",
    pillBolt: "BOLT CO2 সহনশীলতা",
    pillBpm: "৩০-সেকেন্ড রেসপিরেটরি রেট",
    pillAi: "স্মার্ট এক্সারসাইজ প্রেসক্রিপশন",
    statBestBolt: "ব্যক্তিগত সেরা BOLT",
    noTestYet: "এখনো কোনো টেস্ট নেই",
    tabBoltSub: "রক্তে কার্বন ডাই অক্সাইড সহনশীলতা ও ফুসফুস ক্যাপাসিটি",
    tabBpmSub: "বিশ্রামকালীন প্রতি মিনিটে শ্বাসের স্বাভাবিক হার",
    goldStandard: "গোল্ড স্ট্যান্ডার্ড",
    live30s: "৩০ সেকেন্ড লাইভ",
    testActiveHolding: "শ্বাস আটকে রাখুন (স্বাভাবিকভাবে)",
    testActiveBpm: "স্বাভাবিক শ্বাস নিয়ে নিচে ট্যাপ করুন",
    co2Tolerance: "CO2 সহনশীলতা",
    o2Delivery: "টিস্যু অক্সিজেন সরবরাহ",
    nervousBalance: "স্নায়ুতন্ত্রের ভারসাম্য",
    levelLow: "সংকুচিত",
    levelFair: "মাঝারি",
    levelGood: "সুষম",
    levelOptimal: "অনুকূল ও গভীর",
    spectrumTitle: "ক্লিনিক্যাল স্পেকট্রাম স্কেল:",
    printSummary: "সামারি প্রিন্ট / সেভ",
    filterAll: "সকল",
    filterBolt: "BOLT",
    filterBpm: "BPM",
    statTotalTests: "মোট টেস্ট",
    statAvgBpm: "গড় BPM",
    faqTitle: "শ্বাস-প্রশ্বাস বিজ্ঞানের প্রশ্নোত্তর",
    faq1Q: "কার্বন ডাই অক্সাইড (CO2) কেন ফুসফুসের বন্ধু?",
    faq1A: "বোর ইফেক্ট অনুযায়ী, রক্তে পর্যাপ্ত কার্বন ডাই অক্সাইড না থাকলে হিমোগ্লোবিন কোষে অক্সিজেন ছাড়তে পারে না। অতিরিক্ত দ্রুত শ্বাস নিলে CO2 কমে যায় এবং কোষে অক্সিজেনের ঘাটতি তৈরি হয়।",
    faq2Q: "কীভাবে দ্রুত BOLT স্কোর বাড়ানো যায়?",
    faq2A: "সবসময় নাক দিয়ে শ্বাস নিন, প্রতিদিন ১০-১৫ মিনিট ডায়াফ্রামেটিক বা বক্স ব্রিদিং অনুশীলন করুন এবং জোর করে শ্বাস নেওয়া পরিহার করুন।",
    step1Title: "১. স্বাভাবিক শ্বাস",
    step1Desc: "আরাম করে বসে স্বাভাবিকভাবে নাক দিয়ে শ্বাস নিন ও ছাড়ুন।",
    step2Title: "২. নাক চেপে শুরু",
    step2Desc: "শ্বাস ছাড়ার পর নাক চেপে ধরে স্টার্ট বাটন চাপুন।",
    step3Title: "৩. প্রথম তাড়নায় থামুন",
    step3Desc: "প্রথম শ্বাসের তাগিদ অনুভব করলেই থামুন চাপুন। জোর করবেন না।",
    bpmStep1Title: "১. স্থির হয়ে বসুন",
    bpmStep1Desc: "সোজা হয়ে আরামদায়ক অবস্থানে বসুন ও শান্ত হোন।",
    bpmStep2Title: "২. প্রাকৃতিক শ্বাস",
    bpmStep2Desc: "শ্বাস ধরে রাখবেন না, স্বাভাবিক গতিতে চলতে দিন।",
    bpmStep3Title: "৩. প্রতিটি চক্রে ট্যাপ",
    bpmStep3Desc: "প্রতিটি পূর্ণ শ্বাস গ্রহণ ও ত্যাগের পর ট্যাপ করুন।",
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
    navExercises: "Breathing Exercises",
    navTest: "Breath Test",
    tabExercises: "Breathing Exercises",
    tabBreathTest: "Breath Test",
    navSafety: "Safety",
    navHealth: "Health Tracker",
    navRx: "Prescriptions",
    navMore: "More",
    sidebarBrandSub: "Digital Health & Mindfulness",
    navPagesTitle: "Pages & Modules",
    navHomeSub: "Home page & core features",
    navExercisesSub: "Breathing exercises & BOLT test",
    navTestSub: "BOLT & BPM respiratory tests",
    navHealthSub: "Blood pressure & diabetes tracker",
    navRxSub: "Digital prescription vault & OCR",
    navSafetySub: "3 core safety rules & guidance",
    quickToolsTitle: "Quick Tools",
    quickEmergencyLabel: "Emergency Calm Breath (SOS)",
    quickEmergencySub: "Immediate calmness in 4 quick steps",
    quickTestLabel: "Breath Fitness Test",
    quickTestSub: "Check BOLT & BPM breath score",
    langSelectTitle: "Language",
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
    heroSlide2Badge: "Clinical Vitals Monitor 🩺",
    heroSlide2Title: "Day-wise Blood Pressure & Diabetes Tracking",
    heroSlide2Desc: "Real-time AHA 2017 & ADA diagnostic spectrum gauges, 7-30 day interactive trends, and instant family WhatsApp summary sharing.",
    heroSlide2Cta: "Open Health Tracker",
    heroSlide2Sec: "Log New Reading",
    heroSlide2Perk1: "AHA & ADA Standards",
    heroSlide2Perk2: "WhatsApp Family Share",
    heroSlide2Perk3: "Doctor Report Summary",
    heroSlide2Live: "Live Monitor",
    heroSlide2BpLabel: "Blood Pressure (BP)",
    heroSlide2BpStatus: "Normal",
    heroSlide2BgLabel: "Blood Glucose",
    heroSlide2BgStatus: "Fasting",
    heroSlide2PulseLabel: "Pulse Rate",
    heroSlide2PulseStatus: "Resting Rhythm",
    heroSlide2Pill1: "AHA 2017 Protocol",
    heroSlide2Pill2: "7-30 Day Trends",
    heroSlide2Pill3: "PIN Protected",
    heroSlide3Badge: "Smart Digital Rx Studio & OCR 📄",
    heroSlide3Title: "Scan Prescriptions with Client-Side OCR",
    heroSlide3Desc: "Upload or drop prescription photos; client-side Tesseract OCR instantly extracts medications, dosage, and instructions into a clean digital prescription pad.",
    heroSlide3Cta: "Scan with OCR",
    heroSlide3Sec: "Open Rx Vault",
    heroSlide3Perk1: "Client-Side Tesseract OCR",
    heroSlide3Perk2: "100% Private on Device (Offline)",
    heroSlide3Perk3: "Print & PDF Ready",
    heroSlide3PadTitle: "City Care Hospital · Digital Rx Studio",
    heroSlide3Doc: "Dr. M. A. Rahman (MBBS, FCPS)",
    heroSlide3ScanStatus: "OCR Scanning Active...",
    heroSlide3Accuracy: "98% OCR Accuracy",
    heroSlide3Med1: "Tab. Napa Extra 500mg",
    heroSlide3Dose1: "1+0+1 (After meal)",
    heroSlide3Med2: "Cap. Seclo 20mg",
    heroSlide3Dose2: "1+0+1 (Before meal)",
    heroSlide3Pill1: "Auto Rx Extraction",
    heroSlide3Pill2: "Doctor Signature",
    heroSlide3Pill3: "WhatsApp Sharing",
    heroSlide3Stamp: "Digitally Verified",
    heroSlide3Date: "Today's Prescription",
    sliderPrev: "Previous slide",
    sliderNext: "Next slide",
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
    soundOn: "Sound ON",
    soundOff: "Sound OFF",
    clinicalValidated: "Clinical Protocol",
    pillBolt: "BOLT CO2 Tolerance",
    pillBpm: "30s Respiration Rate",
    pillAi: "Smart Exercise Rx",
    statBestBolt: "Personal Best BOLT",
    noTestYet: "No tests yet",
    tabBoltSub: "Blood CO2 tolerance & lung oxygen capacity",
    tabBpmSub: "Resting respiratory rate per minute",
    goldStandard: "Gold Standard",
    live30s: "30s Live",
    testActiveHolding: "Holding breath naturally...",
    testActiveBpm: "Breathe naturally & tap below",
    co2Tolerance: "CO2 Tolerance",
    o2Delivery: "Cellular O2 Delivery",
    nervousBalance: "Nervous System Tone",
    levelLow: "Constricted",
    levelFair: "Moderate",
    levelGood: "Balanced",
    levelOptimal: "Optimal & Deep",
    spectrumTitle: "Clinical Spectrum Scale:",
    printSummary: "Print / Save Summary",
    filterAll: "All",
    filterBolt: "BOLT",
    filterBpm: "BPM",
    statTotalTests: "Total Tests",
    statAvgBpm: "Avg BPM",
    faqTitle: "Respiratory Science FAQs",
    faq1Q: "Why is CO2 essential for oxygen delivery?",
    faq1A: "According to the Bohr Effect, hemoglobin cannot release oxygen to cells without sufficient CO2. Chronic over-breathing depletes CO2, depriving brain and tissues of oxygen.",
    faq2Q: "How can I improve my BOLT score?",
    faq2A: "Always breathe through your nose, practice diaphragmatic or box breathing for 10-15 minutes daily, and avoid chronic over-breathing.",
    step1Title: "1. Normal Breath",
    step1Desc: "Sit comfortably and breathe in and out naturally through nose.",
    step2Title: "2. Pinch & Start",
    step2Desc: "After exhaling, gently pinch nose and tap start button.",
    step3Title: "3. Stop at First Urge",
    step3Desc: "Tap stop at the very first definite urge to breathe.",
    bpmStep1Title: "1. Sit Relaxed",
    bpmStep1Desc: "Sit upright in a comfortable, relaxed posture.",
    bpmStep2Title: "2. Natural Breath",
    bpmStep2Desc: "Do not hold your breath, allow natural rhythm.",
    bpmStep3Title: "3. Tap Each Cycle",
    bpmStep3Desc: "Tap the button after each full inhalation + exhalation.",
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
let lang = localStorage.getItem("bw-lang") || "bn";
let selected = exercises[0];
let selectedLevel = "intermediate";
let filter = "all";
let exploreGoal = "all";

/* ============================================================================
 * 4. LOCALIZATION HELPERS & LANGUAGE SWITCH CONTROLLER
 * ============================================================================
 */
const $ = id => document.getElementById(id);
const tr = k => T[lang][k] ?? k;
const exName = e => e.name[lang];
const exDesc = e => e.desc[lang];
const exBadge = e => e.badge[lang];
const exBenefit = e => e.benefit[lang];
const exWhen = e => e.when[lang];

function getLevelPhases(ex, lvlKey) {
  if (ex && ex.levels && ex.levels[lvlKey]) {
    return ex.levels[lvlKey].phases;
  }
  return ex ? ex.phases : [["inhale", 4], ["exhale", 6]];
}

function getLevelLabel(lvlKey) {
  const map = {
    beginner: { bn: "লেভেল ১ · শুরুর জন্য", en: "Level 1 · Beginner" },
    intermediate: { bn: "লেভেল ২ · মাঝারি", en: "Level 2 · Intermediate" },
    advanced: { bn: "লেভেল ৩ · উন্নত", en: "Level 3 · Advanced" }
  };
  return map[lvlKey] ? map[lvlKey][lang] : lvlKey;
}

function setLang(next) {
  lang = next;
  localStorage.setItem("bw-lang", lang);
  document.documentElement.lang = lang;
  document.body.classList.toggle("bn", lang === "bn");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    let k = el.dataset.i18n;
    if (T[lang][k]) el.innerHTML = T[lang][k];
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    let k = el.getAttribute("data-i18n-title");
    if (T[lang][k]) el.setAttribute("title", T[lang][k]);
  });
  const langToggleBtn = $("langToggle");
  if (langToggleBtn) langToggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";
  document.querySelectorAll(".mobile-lang-pill").forEach(btn => {
    const isTarget = btn.dataset.lang === lang;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-pressed", isTarget ? "true" : "false");
  });
  localStorage.setItem("bw_lang", lang);
  localStorage.setItem("bw_rx_lang", lang);
  renderCards();
  if (typeof initHeroBreathGuide === "function") initHeroBreathGuide();
}

const langToggleBtn = $("langToggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => setLang(lang === "bn" ? "en" : "bn"));
}

if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("bwLanguageChanged", (e) => {
    if (e.detail && e.detail.lang && e.detail.lang !== lang) {
      setLang(e.detail.lang);
    }
  });
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

  // Sync mobile sidebar drawer navigation items
  const sidebarLinks = document.querySelectorAll("#mobileSidebarMenu .mobile-sidebar-nav-item");
  sidebarLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    let matches = false;
    if (screenId === "safety" && href.includes("#safety")) {
      matches = true;
    } else if (screenId === "home" && (href.endsWith("index.html") || href === "/")) {
      matches = true;
    } else if ((screenId === "library" || screenId === "details" || screenId === "complete") && href.includes("exercises.html")) {
      matches = true;
    } else if (screenId === "test" && (href.includes("test.html") || href.includes("breath-test.html"))) {
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

  // If safety or offcanvas screen is active, highlight the "More" hamburger button
  const moreBtn = $("mobileMoreBtn");
  if (moreBtn) {
    if (screenId === "safety") {
      moreBtn.classList.add("active");
      moreBtn.setAttribute("aria-current", "page");
    } else if (screenId === "home" || screenId === "library" || screenId === "test") {
      moreBtn.classList.remove("active");
      moreBtn.removeAttribute("aria-current");
    }
  }
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
    const mobileSidebar = $("mobileSidebarMenu");
    if (mobileSidebar && typeof bootstrap !== "undefined" && bootstrap.Offcanvas) {
      const inst = bootstrap.Offcanvas.getInstance(mobileSidebar);
      if (inst) inst.hide();
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
const cardSelectedLevels = {
  relax46: "beginner",
  box: "intermediate",
  diaphragmatic: "beginner",
  mindful: "beginner"
};

function getCadenceText(ex, lvlKey = "beginner") {
  const lvlObj = ex.levels ? ex.levels[lvlKey] : null;
  const phases = lvlObj ? lvlObj.phases : ex.phases;
  const secUnit = lang === "bn" ? "সে." : "s";
  if (phases && phases[0] && phases[0][0] === "natural") {
    return lang === "bn" ? "স্বাভাবিক ছন্দ" : "Natural Rhythm";
  }
  return phases.map(p => p[1] + secUnit).join("-");
}

function getLevelShortName(ex, lvlKey = "beginner") {
  const lvlObj = ex.levels ? ex.levels[lvlKey] : null;
  if (lvlObj && lvlObj.label && lvlObj.label[lang]) {
    return lvlObj.label[lang].split("·").pop().trim();
  }
  return getLevelLabel(lvlKey).split("·").pop().trim();
}

function selectCardLevel(id, lvlKey, btnEl) {
  cardSelectedLevels[id] = lvlKey;
  const cardEl = btnEl ? btnEl.closest(".exercise-card") : null;
  if (cardEl) {
    cardEl.querySelectorAll(".level-chip").forEach(c => c.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    const nameEl = $("activeLvlName_" + id);
    const ex = exercises.find(e => e.id === id);
    if (nameEl && ex) nameEl.textContent = getLevelShortName(ex, lvlKey);
    const cadenceEl = document.querySelector("#cadencePill_" + id + " .cadence-text");
    if (cadenceEl && ex) cadenceEl.textContent = getCadenceText(ex, lvlKey);
  }
}

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
 * Renders exercise cards into the Featured grid (#featuredCards) on the Home page.
 */
function renderCards() {
  const featEl = $("featuredCards");
  const goalFilteredList = exploreGoal === "all"
    ? exercises
    : exercises.filter(e => e.tag === exploreGoal || (e.goals && e.goals.includes(exploreGoal)));
  if (featEl) {
    featEl.innerHTML = goalFilteredList.map((e, i) => cardHTML(e, i)).join("");
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

/**
 * Cross-page redirect: Launches a guided session directly from a featured card.
 */
function quickStartSession(id) {
  const lvl = cardSelectedLevels[id] || "beginner";
  window.location.href = `exercises.html?exercise=${id}&level=${lvl}&action=start`;
}

/**
 * Cross-page redirect: Opens the exercise details view on exercises.html.
 */
function openDetails(id) {
  const lvl = cardSelectedLevels[id] || "beginner";
  window.location.href = `exercises.html?exercise=${id}&level=${lvl}&action=details`;
}

/**
 * Opens Safety Information modal.
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
  const mobileSidebar = $("mobileSidebarMenu");
  if (mobileSidebar && typeof bootstrap !== "undefined" && bootstrap.Offcanvas) {
    const inst = bootstrap.Offcanvas.getInstance(mobileSidebar);
    if (inst) inst.hide();
  }
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
 * 17. MULTI-PAGE DEEP LINKING & APPLICATION LIFECYCLE
 * ============================================================================
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

function isTargetCurrentPage(href) {
  if (!href) return false;
  const cleanHref = href.split("#")[0].split("?")[0].split("/").pop();
  let currentFile = window.location.pathname.split("/").pop();
  if (!currentFile || currentFile === "") currentFile = "index.html";

  if (!cleanHref) return true;
  if (cleanHref === currentFile) return true;
  if (cleanHref === "index.html" && currentFile === "") return true;
  return false;
}

function initMobileSidebar() {
  document.querySelectorAll(".mobile-lang-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetLang = btn.dataset.lang;
      if (targetLang && targetLang !== lang) {
        setLang(targetLang);
      }
    });
  });

  const sidebar = $("mobileSidebarMenu");
  if (sidebar) {
    sidebar.querySelectorAll(".mobile-sidebar-nav-item, .mobile-sidebar-action-card").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        const action = link.dataset.action;

        if (typeof bootstrap !== "undefined" && bootstrap.Offcanvas) {
          const inst = bootstrap.Offcanvas.getInstance(sidebar);
          if (inst) inst.hide();
        }

        if (action === "emergency-sos" || href.includes("#safety")) {
          const safetyEl = $("safety");
          if (safetyEl) {
            e.preventDefault();
            go("home");
            updateNavActive("safety");
            setTimeout(() => {
              safetyEl.scrollIntoView({ behavior: "smooth" });
              const emergBox = $("emergencyGuidance") || safetyEl;
              emergBox.classList.add("pulse-highlight");
              setTimeout(() => emergBox.classList.remove("pulse-highlight"), 1600);
            }, 120);
            return;
          } else {
            e.preventDefault();
            window.location.href = "index.html#safety";
            return;
          }
        }

        if (isTargetCurrentPage(href)) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (href && !href.startsWith("javascript:")) {
          e.preventDefault();
          window.location.href = href;
        }
      });
    });
  }
}

// ----------------------------------------------------------------------------
// HERO MULTI-MODULE SLIDER CONTROLLER
// ----------------------------------------------------------------------------
let currentHeroSlideIndex = 0;
let heroSlideTimer = null;
const HERO_SLIDE_INTERVAL = 6500;

function initHeroSlider() {
  const slider = $("heroSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = $("heroSliderPrev");
  const nextBtn = $("heroSliderNext");
  const counter = $("heroSlideCounter");

  function showSlide(idx) {
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    currentHeroSlideIndex = idx;

    slides.forEach((s, i) => {
      const isAct = i === idx;
      s.classList.toggle("active", isAct);
      s.setAttribute("aria-hidden", isAct ? "false" : "true");
    });

    dots.forEach((d, i) => {
      const isAct = i === idx;
      d.classList.toggle("active", isAct);
      d.setAttribute("aria-selected", isAct ? "true" : "false");
    });

    if (counter) {
      counter.textContent = `0${idx + 1} / 0${slides.length}`;
    }
  }

  function nextSlide() {
    showSlide(currentHeroSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentHeroSlideIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    heroSlideTimer = setInterval(nextSlide, HERO_SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (heroSlideTimer) {
      clearInterval(heroSlideTimer);
      heroSlideTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  }

  dots.forEach(d => {
    d.addEventListener("click", () => {
      const target = parseInt(d.dataset.slide, 10);
      if (!isNaN(target)) {
        showSlide(target);
        startAutoSlide();
      }
    });
  });

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    stopAutoSlide();
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    startAutoSlide();
  }, { passive: true });

  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      startAutoSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      startAutoSlide();
    }
  });

  showSlide(0);
  startAutoSlide();
}

// ----------------------------------------------------------------------------
// APPLICATION BOOTSTRAP SEQUENCE
// ----------------------------------------------------------------------------
setLang(lang);
initMobileSidebar();
initHeroSlider();
renderCards();
handleHashOnLoad();

/**
 * IntersectionObserver for Safety Hub scrollspy on Home screen:
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