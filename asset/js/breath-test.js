/**
 * ============================================================================
 * BreatheWell - Respiratory Assessment Engine (breath-test.js)
 * ============================================================================
 * @file        asset/js/breath-test.js
 * @module      BreatheWell/BreathTest
 * @description Dedicated modular controller for Respiratory Fitness Assessment:
 *                1. Dual Assessment Modes (BOLT Test & BPM Respiratory Rate)
 *                2. Web Audio Tone Synthesizer & Countdown Audio Cues
 *                3. Interactive BOLT Stopwatch & Real-Time Circular SVG Progress Ring
 *                4. BPM Breath Tap Counter & Rate Frequency Calculator
 *                5. Clinical Diagnostic Classification & 3-Pillar Physiology Meters
 *                6. Personalized Exercise Recommendations & Direct Launching
 *                7. Historical Assessment Archive with LocalStorage Persistence
 *                8. Assessment History Analytics (Personal Best, Average BPM, Total Count)
 *                9. Social Media Result Sharing & Secure Clipboard Copy
 *                10. Deep Linking & Tab Safety Visibility Sync
 * @author      BreatheWell Development Team
 * @version     2.5.0
 * @license     MIT
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
 * 2. RUNTIME STATE & DOM SELECTOR HELPERS
 * ============================================================================
 */
let lang = localStorage.getItem("bw-lang") || "bn";
let activeTestTab = 'bolt';
let testRunning = false;
let testStartTime = 0;
let testInterval = null;
let testCountInterval = null;
let bpmTaps = 0;
let bpmCountdown = 30;
let recommendedExerciseId = 'relax46';
let lastTestResult = null;

const exercises = [
  { id: "relax46", name: { bn: "৪-৬ প্রশান্ত শ্বাস", en: "4-6 Relaxing Breath" }, benefit: { bn: "স্নায়ুতন্ত্রকে শান্ত করে ও দ্রুত শিথিলতা আনে", en: "Calms nervous system and brings deep rest" } },
  { id: "box", name: { bn: "বক্স ব্রিদিং", en: "Box Breathing" }, benefit: { bn: "মনোযোগ বৃদ্ধি ও মানসিক ভারসাম্য ফিরিয়ে আনে", en: "Sharpens focus and restores mental balance" } },
  { id: "diaphragmatic", name: { bn: "৪-৭-৮ গভীর শিথিলতা", en: "4-7-8 Deep Relaxation" }, benefit: { bn: "উদ্বেগ উপশম ও ঘুমের প্রস্তুতিতে সহায়ক", en: "Eases anxiety and prepares body for sleep" } },
  { id: "mindful", name: { bn: "মননশীল শ্বাস", en: "Mindful Breath" }, benefit: { bn: "বর্তমান মুহূর্তে সচেতন উপস্থিতি নিশ্চিত করে", en: "Anchors gentle mindful awareness in the now" } }
];

const $ = id => document.getElementById(id);
const tr = k => T[lang][k] ?? k;
const exName = e => e.name[lang];
const exBenefit = e => e.benefit[lang];

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

  loadTestHistory();
  updateTestStats();
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
 * 15. RESPIRATORY ASSESSMENT ENGINE (BOLT & BPM) & AUDIO SYNTHESIZER
 * ============================================================================
 */

let testAudioCtx = null;
let testSoundEnabled = localStorage.getItem("bw_test_sound") !== "false";
let currentHistoryFilter = "all";

/**
 * Initializes and lazily resumes the Web Audio API context on first user interaction.
 * @returns {AudioContext|null}
 */
function getTestAudioContext() {
  if (!testAudioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    testAudioCtx = new AudioCtx();
  }
  if (testAudioCtx && testAudioCtx.state === "suspended") {
    testAudioCtx.resume();
  }
  return testAudioCtx;
}

/**
 * Plays a pleasant synthetic audio tone using Web Audio oscillator.
 * @param {number} freq - Frequency in Hz
 * @param {number} duration - Tone duration in seconds
 * @param {OscillatorType} type - Waveform type ('sine', 'triangle')
 * @param {number} vol - Output volume (0.0 - 1.0)
 */
function playTestTone(freq, duration = 0.12, type = "sine", vol = 0.15) {
  if (!testSoundEnabled) return;
  try {
    const ctx = getTestAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { }
}

/**
 * Countdown beep cue for test preparation.
 * @param {boolean} isFinal - True on final start countdown tick
 */
function playCountdownBeep(isFinal = false) {
  if (isFinal) {
    playTestTone(880, 0.28, "triangle", 0.22);
  } else {
    playTestTone(440, 0.14, "sine", 0.16);
  }
}

/**
 * Soft tactile audio feedback on BPM breath recording tap.
 */
function playTapSound() {
  playTestTone(620, 0.08, "sine", 0.18);
}

/**
 * Harmonious celebration arpeggio upon test completion.
 */
function playCelebrationChime() {
  if (!testSoundEnabled) return;
  [523, 659, 784, 1046].forEach((f, idx) => {
    setTimeout(() => playTestTone(f, 0.22, "triangle", 0.14), idx * 100);
  });
}

/**
 * Toggles sound effects on/off and persists state in localStorage.
 */
function toggleTestSound() {
  testSoundEnabled = !testSoundEnabled;
  localStorage.setItem("bw_test_sound", testSoundEnabled ? "true" : "false");
  updateTestSoundUI();
  if (testSoundEnabled) playTestTone(660, 0.15, "triangle", 0.2);
}

/**
 * Updates sound toggle button icon and text.
 */
function updateTestSoundUI() {
  const icon = $("testSoundIcon");
  const label = $("testSoundLabel");
  if (icon) {
    icon.className = testSoundEnabled ? "bi bi-volume-up-fill" : "bi bi-volume-mute-fill";
  }
  if (label) {
    label.textContent = testSoundEnabled ? tr("soundOn") : tr("soundOff");
  }
}

/**
 * Switches the active diagnostic test protocol between BOLT and BPM.
 * @param {'bolt'|'bpm'} tab - The target test tab identifier.
 */
function switchTestTab(tab) {
  if (testRunning) stopCurrentTest();
  activeTestTab = tab;

  const boltBtn = $("tabBoltBtn");
  const bpmBtn = $("tabBpmBtn");
  if (boltBtn && bpmBtn) {
    boltBtn.classList.toggle("active", tab === 'bolt');
    bpmBtn.classList.toggle("active", tab === 'bpm');
    boltBtn.setAttribute("aria-selected", tab === 'bolt' ? "true" : "false");
    bpmBtn.setAttribute("aria-selected", tab === 'bpm' ? "true" : "false");
  }

  const iconEl = $("testModeIcon");
  const titleEl = $("testInstructionTitle");
  const bodyEl = $("testInstructionBody");
  const noticeEl = $("testStageNotice");
  const bpmBox = $("bpmCounterBox");
  const phaseLabel = $("boltPhaseLabel");

  if (tab === 'bolt') {
    if (iconEl) iconEl.className = "bi bi-stopwatch text-primary fs-2";
    if (titleEl) titleEl.textContent = tr("boltStepHeader");
    if (bodyEl) bodyEl.textContent = tr("boltSteps");
    if (noticeEl) noticeEl.textContent = tr("tapWhenUrge");
    if (phaseLabel) phaseLabel.textContent = tr("testActiveHolding");
    if (bpmBox) bpmBox.classList.add("d-none");

    // Update 3 Step cards for BOLT
    if ($("step1Title")) $("step1Title").textContent = tr("step1Title");
    if ($("step1Desc")) $("step1Desc").textContent = tr("step1Desc");
    if ($("step2Title")) $("step2Title").textContent = tr("step2Title");
    if ($("step2Desc")) $("step2Desc").textContent = tr("step2Desc");
    if ($("step3Title")) $("step3Title").textContent = tr("step3Title");
    if ($("step3Desc")) $("step3Desc").textContent = tr("step3Desc");
  } else {
    if (iconEl) iconEl.className = "bi bi-activity text-info fs-2";
    if (titleEl) titleEl.textContent = tr("bpmStepHeader");
    if (bodyEl) bodyEl.textContent = tr("bpmSteps");
    if (noticeEl) noticeEl.textContent = tr("bpmActiveNotice");
    if (phaseLabel) phaseLabel.textContent = tr("testActiveBpm");
    if (bpmBox) bpmBox.classList.remove("d-none");

    // Update 3 Step cards for BPM
    if ($("step1Title")) $("step1Title").textContent = tr("bpmStep1Title");
    if ($("step1Desc")) $("step1Desc").textContent = tr("bpmStep1Desc");
    if ($("step2Title")) $("step2Title").textContent = tr("bpmStep2Title");
    if ($("step2Desc")) $("step2Desc").textContent = tr("bpmStep2Desc");
    if ($("step3Title")) $("step3Title").textContent = tr("bpmStep3Title");
    if ($("step3Desc")) $("step3Desc").textContent = tr("bpmStep3Desc");
  }
  resetTest();
}

/**
 * Triggers a 3-second animated preparatory countdown with audio cues.
 */
function initiateTest() {
  getTestAudioContext();
  const startBtn = $("startTestBtn");
  const countBox = $("testCountdownBox");
  const countNum = $("testCountdownNum");
  const activeStage = $("testActiveStage");

  if (startBtn) startBtn.classList.add("d-none");
  if (countBox) countBox.classList.remove("d-none");
  if (activeStage) activeStage.classList.add("d-none");

  let c = 3;
  if (countNum) countNum.textContent = c;
  playCountdownBeep(false);

  testCountInterval = setInterval(() => {
    c--;
    if (c > 0) {
      if (countNum) {
        countNum.textContent = c;
        countNum.classList.remove("animate-pop");
        void countNum.offsetWidth; // Reflow for animation re-trigger
        countNum.classList.add("animate-pop");
      }
      playCountdownBeep(false);
    } else {
      clearInterval(testCountInterval);
      testCountInterval = null;
      playCountdownBeep(true);
      if (countBox) countBox.classList.add("d-none");
      startActiveTest();
    }
  }, 1000);
}

/**
 * Launches the active assessment timer and drives the circular SVG progress arc.
 */
function startActiveTest() {
  testRunning = true;
  testStartTime = performance.now();
  const activeStage = $("testActiveStage");
  if (activeStage) activeStage.classList.remove("d-none");

  const stopBtn = $("stopTestBtn");
  const tapBpmBtn = $("tapBpmBtn");
  const svgCircle = $("boltSvgProgress");

  if (svgCircle) {
    svgCircle.style.strokeDashoffset = "660";
  }

  if (activeTestTab === 'bolt') {
    if (stopBtn) stopBtn.classList.remove("d-none");
    if (tapBpmBtn) tapBpmBtn.classList.add("d-none");

    const timerDisp = $("boltTimerDisplay");
    testInterval = setInterval(() => {
      let elapsedMs = performance.now() - testStartTime;
      let sec = (elapsedMs / 1000).toFixed(1);
      let secNum = parseFloat(sec);
      if (timerDisp) timerDisp.textContent = sec + "s";

      // Drive SVG circular stroke (target scale 40s)
      if (svgCircle) {
        const circumference = 660;
        const pct = Math.min(1, secNum / 40);
        svgCircle.style.strokeDashoffset = circumference * (1 - pct);
      }

      // Real-time milestone feedback
      const badge = $("boltMilestoneBadge");
      const text = $("boltMilestoneText");
      if (badge && text) {
        if (secNum < 10) {
          text.textContent = lang === "bn" ? "সহনশীলতা পর্যায়..." : "Initial phase...";
          badge.className = "bolt-milestone-badge bg-primary bg-opacity-10 text-primary";
        } else if (secNum < 20) {
          text.textContent = lang === "bn" ? "১০ সে. অতিক্রম (মাঝারি)" : "10s Passed (Moderate)";
          badge.className = "bolt-milestone-badge bg-warning bg-opacity-10 text-warning-emphasis";
        } else if (secNum < 30) {
          text.textContent = lang === "bn" ? "২০ সে. অতিক্রম (ভালো)" : "20s Passed (Good Health)";
          badge.className = "bolt-milestone-badge bg-info bg-opacity-10 text-info-emphasis";
        } else {
          text.textContent = lang === "bn" ? "৩০+ সে. (চমৎকার স্তর!)" : "30s+ (Optimal Mastery!)";
          badge.className = "bolt-milestone-badge bg-success bg-opacity-10 text-success";
        }
      }
    }, 100);
  } else {
    bpmTaps = 0;
    bpmCountdown = 30;
    const bpmCountNum = $("bpmCountNum");
    if (bpmCountNum) bpmCountNum.textContent = "0";
    const bpmRateEst = $("bpmRateEst");
    if (bpmRateEst) bpmRateEst.textContent = "--";

    const countdownText = $("bpmCountdownText");
    if (countdownText) countdownText.textContent = lang === "bn" ? `বাকি সময়: ${bpmCountdown} সেকেন্ড` : `Time left: ${bpmCountdown}s`;

    if (stopBtn) stopBtn.classList.add("d-none");
    if (tapBpmBtn) tapBpmBtn.classList.remove("d-none");

    const timerDisp = $("boltTimerDisplay");
    testInterval = setInterval(() => {
      bpmCountdown--;
      let elapsedSec = Math.max(0, 30 - bpmCountdown);
      if (timerDisp) timerDisp.textContent = elapsedSec + "s";
      if (countdownText) countdownText.textContent = lang === "bn" ? `বাকি সময়: ${Math.max(0, bpmCountdown)} সেকেন্ড` : `Time left: ${Math.max(0, bpmCountdown)}s`;

      // Drive SVG circular stroke
      if (svgCircle) {
        const circumference = 660;
        const pct = Math.min(1, elapsedSec / 30);
        svgCircle.style.strokeDashoffset = circumference * (1 - pct);
      }

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
  playTapSound();
  if (navigator.vibrate) {
    try { navigator.vibrate(25); } catch (e) { }
  }

  const countEl = $("bpmCountNum");
  if (countEl) countEl.textContent = bpmTaps;

  // Live estimated rate calculation
  const elapsedSec = Math.max(1, (performance.now() - testStartTime) / 1000);
  const estRate = Math.round((bpmTaps / elapsedSec) * 60);
  const rateEstEl = $("bpmRateEst");
  if (rateEstEl) rateEstEl.textContent = estRate + " BPM";
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

  playCelebrationChime();
  const durationSec = Math.max(0.1, (performance.now() - testStartTime) / 1000);

  if (activeTestTab === 'bolt') {
    renderBoltResult(durationSec);
  } else {
    let rate = Math.round((bpmTaps / Math.min(30, durationSec)) * 60);
    renderBpmResult(rate);
  }
}

/**
 * Animates a numeric score counter element counting up smoothly from 0.
 * @param {HTMLElement} el - Target counter element
 * @param {number} target - Final value
 * @param {string} suffix - e.g. "s" or " BPM"
 */
function animateScoreCounter(el, target, suffix = "") {
  if (!el) return;
  const duration = 650;
  const startTime = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - startTime) / duration);
    const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const val = Math.round(target * ease);
    el.textContent = val + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(tick);
}

/**
 * Evaluates the BOLT score against clinical respiratory standards:
 * @param {number} sec - Measured breath-hold duration in seconds.
 */
function renderBoltResult(sec) {
  const roundedSec = Math.round(sec);
  const scoreNum = $("resultScoreNum");
  const scoreGrade = $("resultScoreGrade");
  const scoreDetail = $("resultScoreDetail");
  const recTitle = $("recExerciseTitle");
  const recReason = $("recExerciseReason");
  const needle = $("spectrumNeedle");
  const specBadge = $("spectrumScoreBadge");

  // Animate score number
  animateScoreCounter(scoreNum, roundedSec, "s");

  let grade = "", detail = "", recId = "";
  let pCo2 = "", pO2 = "", pNervous = "";
  let needlePct = 20;

  if (roundedSec < 10) {
    grade = lang === "bn" ? "খুব কম (উচ্চ মানসিক চাপ ও দুর্বল CO2 সহনশীলতা)" : "Low (Elevated Stress & Low CO2 Tolerance)";
    detail = lang === "bn"
      ? "আপনার স্কোর ইঙ্গিত করে যে আপনি হয়তো অতিরিক্ত বা অগভীরভাবে শ্বাস নিচ্ছেন। এটি শরীরকে ক্লান্ত ও নার্ভাস রাখে। ডায়াফ্রামেটিক ব্রিদিং দিয়ে পেটের মাধ্যমে গভীর শ্বাস নেওয়ার অভ্যাস তৈরি করা জরুরি।"
      : "Your score indicates potential over-breathing or shallow upper-chest breathing. Oxygen delivery to cells is constricted. Diaphragmatic breathing is highly recommended.";
    recId = "diaphragmatic";
    pCo2 = tr("levelLow");
    pO2 = tr("levelLow");
    pNervous = lang === "bn" ? "উত্তেজিত" : "Aroused";
    needlePct = Math.min(24, Math.max(5, (roundedSec / 10) * 24));
  } else if (roundedSec < 20) {
    grade = lang === "bn" ? "মাঝারি কার্যকারিতা (উন্নতির সুযোগ রয়েছে)" : "Moderate Respiratory Efficiency";
    detail = lang === "bn"
      ? "আপনার শ্বাসের ছন্দ তুলনামূলক স্বাভাবিক হলেও মানসিক চাপের সময় শ্বাস দ্রুত হয়ে পড়ার সম্ভাবনা থাকে। ৪–৬ রিল্যাক্সিং ব্রিদিং আপনার স্নায়ুতন্ত্রকে শান্ত ও সুষম রাখবে।"
      : "You have a reasonable baseline, but prolonged exhalations will train your nervous system to stay grounded under stress.";
    recId = "relax46";
    pCo2 = tr("levelFair");
    pO2 = tr("levelFair");
    pNervous = lang === "bn" ? "সতর্ক" : "Alert";
    needlePct = 25 + ((roundedSec - 10) / 10) * 24;
  } else if (roundedSec < 30) {
    grade = lang === "bn" ? "ভালো ও সুষম শ্বাস-প্রশ্বাস" : "Good Respiratory Health & Control";
    detail = lang === "bn"
      ? "আপনার ফুসফুসের কার্যকারিতা ও অক্সিজেন সহনশীলতা যথেষ্ট ভালো। মনোযোগ ও মানসিক স্থিরতা বজায় রাখতে বক্স ব্রিদিং আপনার জন্য সবচেয়ে উপযোগী।"
      : "Great breath endurance and CO2 tolerance. Your autonomic nervous system is well-regulated. Box breathing will sharpen your concentration.";
    recId = "box";
    pCo2 = tr("levelGood");
    pO2 = tr("levelGood");
    pNervous = tr("levelGood");
    needlePct = 50 + ((roundedSec - 20) / 10) * 24;
  } else {
    grade = lang === "bn" ? "চমৎকার ও উচ্চ স্তরের নিয়ন্ত্রণ" : "Optimal Respiratory Mastery";
    detail = lang === "bn"
      ? "আপনার শ্বাসপ্রশ্বাস প্রক্রিয়া অত্যন্ত সুশৃঙ্খল ও শান্ত। প্রাকৃতিক মননশীল শ্বাসের মাধ্যমে এই ভারসাম্য বজায় রাখুন।"
      : "Outstanding lung efficiency and nervous system balance. Natural mindful breathing will help you sustain effortless awareness.";
    recId = "mindful";
    pCo2 = tr("levelOptimal");
    pO2 = tr("levelOptimal");
    pNervous = tr("levelOptimal");
    needlePct = Math.min(95, 75 + ((roundedSec - 30) / 15) * 20);
  }

  // Update Spectrum Needle
  if (needle) needle.style.left = needlePct + "%";
  if (specBadge) specBadge.textContent = `${roundedSec}s — ${grade.split("(")[0].trim()}`;

  // Update 3 Clinical Pillars
  if ($("pillarCo2")) $("pillarCo2").textContent = pCo2;
  if ($("pillarO2")) $("pillarO2").textContent = pO2;
  if ($("pillarNervous")) $("pillarNervous").textContent = pNervous;

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
    scoreNum: roundedSec,
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
 * @param {number} rate - Breaths per minute frequency.
 */
function renderBpmResult(rate) {
  const scoreNum = $("resultScoreNum");
  const scoreGrade = $("resultScoreGrade");
  const scoreDetail = $("resultScoreDetail");
  const recTitle = $("recExerciseTitle");
  const recReason = $("recExerciseReason");
  const needle = $("spectrumNeedle");
  const specBadge = $("spectrumScoreBadge");

  // Animate score counter
  animateScoreCounter(scoreNum, rate, " BPM");

  let grade = "", detail = "", recId = "";
  let pCo2 = "", pO2 = "", pNervous = "";
  let needlePct = 50;

  if (rate > 18) {
    grade = lang === "bn" ? "দ্রুত গতি (উচ্চ চাপ বা উত্তেজনা)" : "Rapid Rate (Heightened Arousal / Stress)";
    detail = lang === "bn"
      ? "আপনার বিশ্রামের শ্বাসের হার স্বাভাবিকের চেয়ে বেশি। ধীর শ্বাসের মাধ্যমে প্যারাসিমপ্যাথেটিক সিস্টেমকে সক্রিয় করুন।"
      : "Your breathing rate is elevated above normal resting averages (12-16 bpm). Relaxing 4-6 breathing will help slow your breath.";
    recId = "relax46";
    pCo2 = tr("levelLow");
    pO2 = tr("levelFair");
    pNervous = lang === "bn" ? "উত্তেজিত" : "Elevated";
    needlePct = 15;
  } else if (rate >= 12) {
    grade = lang === "bn" ? "স্বাভাবিক ও স্বাস্থ্যকর রেট" : "Healthy Resting Breath Rate";
    detail = lang === "bn"
      ? "আপনার বিশ্রামের শ্বাসের হার স্বাভাবিক সীমার মধ্যে রয়েছে। বক্স ব্রিদিং অনুশীলন আপনার মনোযোগকে আরও দৃঢ় করবে।"
      : "Your breathing frequency is well within the healthy resting average. Box breathing is great to maintain balance.";
    recId = "box";
    pCo2 = tr("levelGood");
    pO2 = tr("levelGood");
    pNervous = tr("levelGood");
    needlePct = 65;
  } else {
    grade = lang === "bn" ? "অত্যন্ত শান্ত ও গভীর শ্বাস" : "Deep Calm & Low Frequency";
    detail = lang === "bn"
      ? "আপনার শ্বাসের ছন্দ অত্যন্ত ধীর ও শিথিল, যা গভীর মননশীলতার পরিচায়ক।"
      : "Your respiration rate is exceptionally calm and meditative.";
    recId = "mindful";
    pCo2 = tr("levelOptimal");
    pO2 = tr("levelOptimal");
    pNervous = tr("levelOptimal");
    needlePct = 88;
  }

  // Update Spectrum Needle
  if (needle) needle.style.left = needlePct + "%";
  if (specBadge) specBadge.textContent = `${rate} BPM — ${grade.split("(")[0].trim()}`;

  // Update 3 Clinical Pillars
  if ($("pillarCo2")) $("pillarCo2").textContent = pCo2;
  if ($("pillarO2")) $("pillarO2").textContent = pO2;
  if ($("pillarNervous")) $("pillarNervous").textContent = pNervous;

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
    scoreNum: rate,
    grade: grade,
    date: new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  });

  const instructView = $("testInstructionView");
  const resultView = $("testResultView");
  if (instructView) instructView.classList.add("d-none");
  if (resultView) resultView.classList.remove("d-none");
}


/* ============================================================================
 * 16. LOCAL STORAGE PERSISTENCE, ANALYTICS & HISTORY TRACKING
 * ============================================================================
 */

/**
 * Persists an assessment record to browser localStorage ('bw_test_history'),
 * capping stored history at the 12 most recent test entries.
 * @param {Object} record - Assessment record payload.
 */
function saveTestRecord(record) {
  try {
    let history = JSON.parse(localStorage.getItem("bw_test_history") || "[]");
    history.unshift(record);
    if (history.length > 12) history = history.slice(0, 12);
    localStorage.setItem("bw_test_history", JSON.stringify(history));
    loadTestHistory(currentHistoryFilter);
    updateTestStats();
  } catch (e) { }
}

/**
 * Calculates analytics from stored history: Personal Best BOLT, Average BPM, Total Tests.
 */
function updateTestStats() {
  try {
    const history = JSON.parse(localStorage.getItem("bw_test_history") || "[]");
    const totalEl = $("historyStatTotal");
    const bestEl = $("historyStatBest");
    const bpmEl = $("historyStatBpm");
    const heroBest = $("statHeroBestBolt");
    const heroGrade = $("statHeroBestGrade");

    if (totalEl) totalEl.textContent = history.length;

    const boltRecords = history.filter(h => h.type === "BOLT" && (h.scoreNum || h.score));
    if (boltRecords.length) {
      let maxSec = 0;
      let maxGrade = "";
      boltRecords.forEach(r => {
        let n = r.scoreNum || parseInt(r.score, 10) || 0;
        if (n > maxSec) {
          maxSec = n;
          maxGrade = r.grade || "";
        }
      });
      if (bestEl) bestEl.textContent = maxSec + "s";
      if (heroBest) heroBest.textContent = maxSec + "s";
      if (heroGrade) heroGrade.textContent = maxGrade.split("(")[0].trim();
    } else {
      if (bestEl) bestEl.textContent = "--";
      if (heroBest) heroBest.textContent = "--";
      if (heroGrade) heroGrade.textContent = tr("noTestYet");
    }

    const bpmRecords = history.filter(h => h.type === "BPM" && (h.scoreNum || h.score));
    if (bpmRecords.length) {
      let sum = 0;
      bpmRecords.forEach(r => {
        sum += (r.scoreNum || parseInt(r.score, 10) || 0);
      });
      let avg = Math.round(sum / bpmRecords.length);
      if (bpmEl) bpmEl.textContent = avg + " BPM";
    } else {
      if (bpmEl) bpmEl.textContent = "--";
    }
  } catch (e) { }
}

/**
 * Filters the history list by test type ('all' | 'BOLT' | 'BPM').
 * @param {'all'|'BOLT'|'BPM'} type
 */
function filterTestHistory(type) {
  currentHistoryFilter = type;
  ["histFilterAll", "histFilterBolt", "histFilterBpm"].forEach(id => {
    const btn = $(id);
    if (btn) btn.classList.remove("active");
  });
  if (type === "all") $("histFilterAll")?.classList.add("active");
  if (type === "BOLT") $("histFilterBolt")?.classList.add("active");
  if (type === "BPM") $("histFilterBpm")?.classList.add("active");
  loadTestHistory(type);
}

/**
 * Retrieves assessment records from localStorage and renders them in the history container.
 * @param {'all'|'BOLT'|'BPM'} filter
 */
function loadTestHistory(filter = currentHistoryFilter) {
  const container = $("testHistoryList");
  if (!container) return;
  try {
    let history = JSON.parse(localStorage.getItem("bw_test_history") || "[]");
    if (filter !== "all") {
      history = history.filter(h => h.type === filter);
    }

    if (!history.length) {
      container.innerHTML = `<p class="small text-muted mb-0" id="emptyHistoryMsg">${tr("noHistoryYet")}</p>`;
      updateTestStats();
      return;
    }

    container.innerHTML = history.map(item => {
      const isBolt = item.type === "BOLT";
      const icon = isBolt ? "bi-lungs text-primary" : "bi-activity text-info";
      const badgeClass = isBolt ? "bg-primary-subtle text-primary" : "bg-info-subtle text-info";

      return `
        <div class="test-history-card-item">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle p-2 ${badgeClass} d-grid place-items-center" style="width:34px;height:34px;">
              <i class="bi ${icon} fs-6"></i>
            </div>
            <div>
              <strong class="text-dark small">${item.type}: ${item.score}</strong>
              <div class="text-muted extra-small">${item.grade ? item.grade.split("(")[0].trim() : ""}</div>
            </div>
          </div>
          <span class="badge bg-light text-secondary border extra-small">${item.date}</span>
        </div>
      `;
    }).join("");

    updateTestStats();
    updateTestSoundUI();
  } catch (e) { }
}

/**
 * Clears all saved assessment records from localStorage and re-renders the empty view.
 */
function clearTestHistory() {
  if (confirm(lang === "bn" ? "আপনি কি নিশ্চিতভাবে সব টেস্ট রেকর্ড মুছে ফেলতে চান?" : "Are you sure you want to clear your assessment history?")) {
    localStorage.removeItem("bw_test_history");
    loadTestHistory(currentHistoryFilter);
    updateTestStats();
  }
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
  const svgCircle = $("boltSvgProgress");
  const badge = $("boltMilestoneBadge");
  const text = $("boltMilestoneText");

  if (instructView) instructView.classList.remove("d-none");
  if (resultView) resultView.classList.add("d-none");
  if (countBox) countBox.classList.add("d-none");
  if (activeStage) activeStage.classList.add("d-none");
  if (startBtn) startBtn.classList.remove("d-none");
  if (stopBtn) stopBtn.classList.add("d-none");
  if (tapBpmBtn) tapBpmBtn.classList.add("d-none");
  if (timerDisp) timerDisp.textContent = "00.0s";

  if (svgCircle) {
    svgCircle.style.strokeDashoffset = "660";
  }
  if (badge && text) {
    badge.className = "bolt-milestone-badge bg-primary bg-opacity-10 text-primary";
    text.textContent = lang === "bn" ? "পরিমাপের জন্য প্রস্তুত" : "Ready for assessment";
  }
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
 * TEST SOCIAL SHARING & CLIPBOARD COPY UTILITIES
 * ============================================================================
 */
function checkNativeShareSupport() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function getTestShareUrl() {
  return window.location.origin + window.location.pathname.replace(/breath-test\.html.*$/, 'breath-test.html');
}

function shareTestResult(platform) {
  const url = getTestShareUrl();
  const type = lastTestResult?.type || "BOLT";
  const score = lastTestResult?.score || (type === "BOLT" ? "25s" : "14 BPM");
  const grade = lastTestResult?.grade ? lastTestResult.grade.split("(")[0].trim() : "";
  const title = "BreatheWell — Respiratory Assessment";
  const text = lang === "bn"
    ? `আমি BreatheWell-এ ${type} টেস্ট সম্পন্ন করেছি! আমার স্কোর: ${score} (${grade})। আপনার ফুসফুসের সক্ষমতা পরীক্ষা করুন:`
    : `I just checked my respiratory fitness on BreatheWell! My ${type} score: ${score} (${grade}). Test yours here:`;

  executeShare(platform, text, url, title);
}

function executeShare(platform, text, url, title) {
  const fullMessage = `${text} ${url}`;
  switch (platform) {
    case "whatsapp":
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, "_blank", "noopener,noreferrer");
      break;
    case "twitter":
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=BreatheWell,LungHealth,Mindfulness`, "_blank", "noopener,noreferrer");
      break;
    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      break;
    case "copy":
    default:
      fallbackCopyText(url);
      break;
  }
}

function fallbackCopyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      toast(lang === "bn" ? "লিংক ক্লিপবোর্ডে কপি হয়েছে!" : "Link copied to clipboard!");
    }).catch(() => {
      legacyCopyText(text);
    });
  } else {
    legacyCopyText(text);
  }
}

function legacyCopyText(text) {
  try {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    toast(lang === "bn" ? "লিংক ক্লিপবোর্ডে কপি হয়েছে!" : "Link copied to clipboard!");
  } catch (e) {
    toast(lang === "bn" ? "কপি করা সম্ভব হয়নি" : "Failed to copy link");
  }
}

function toast(message) {
  const toastText = $("toastText");
  const appToast = $("appToast");
  if (!toastText || !appToast) return;
  toastText.textContent = message;
  const bsToast = bootstrap.Toast.getOrCreateInstance(appToast, { delay: 2800 });
  bsToast.show();
}

/* ============================================================================
 * BREATH TEST DEEP LINKING & APPLICATION LIFECYCLE
 * ============================================================================
 */
function isTargetCurrentPage(href) {
  if (!href) return false;
  const cleanHref = href.split("#")[0].split("?")[0].split("/").pop();
  let currentFile = window.location.pathname.split("/").pop();
  if (!currentFile || currentFile === "") currentFile = "breath-test.html";

  if (!cleanHref) return true;
  if (cleanHref === currentFile) return true;
  if (cleanHref === "breath-test.html" && currentFile === "") return true;
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
          e.preventDefault();
          window.location.href = "index.html#safety";
          return;
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

function handleUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("mode") || params.has("tab")) {
      const mode = (params.get("mode") || params.get("tab") || "").toLowerCase();
      if (mode === "bpm" || mode === "bolt") {
        setTimeout(() => {
          switchTestTab(mode);
        }, 80);
      }
    }
  } catch (e) { }
}

function initBreathTestPage() {
  setLang(lang);
  initMobileSidebar();
  loadTestHistory();
  updateTestStats();
  const soundToggle = $("testSoundToggle");
  if (soundToggle) soundToggle.addEventListener("click", toggleTestSound);
  updateTestSoundUI();
  handleUrlParams();

  // Spacebar to tap breath during active BPM test
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && testRunning && activeTestTab === "bpm") {
      e.preventDefault();
      recordBpmBreath();
    } else if (e.code === "Escape" && testRunning) {
      stopCurrentTest();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBreathTestPage);
} else {
  initBreathTestPage();
}