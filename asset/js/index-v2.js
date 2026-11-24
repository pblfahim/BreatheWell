/**
 * ============================================================================
 * BreatheWell - Clinical Wellness & Unified Hub Controller (index-v2.js)
 * ============================================================================
 * @file        asset/js/index-v2.js
 * @module      BreatheWell/IndexV2
 * @version     2.4.0
 * @license     MIT
 * @description
 *   Client-side controller for index-v2.html. Powers the interactive breathing
 *   sphere, procedural Web Audio chimes, live localStorage telemetry reader,
 *   interactive AHA/ADA vitals sandbox simulator, safety tabs, and 100%
 *   bilingual (Bengali/English) reactive localization.
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. CONSTANTS & APPLICATION STATE
  // ============================================================================
  const STORAGE_KEYS = {
    VITALS: "bw_vitals_records",
    VAULT_RX: "bw_prescriptions",
    DIGITALPAD_RX: "bw_digitalpad_prescriptions",
    BOLT: "bw_bolt_history",
    PROFILE: "bw_user_profile",
    LANG: "bw_lang"
  };

  let currentLang = localStorage.getItem(STORAGE_KEYS.LANG) || "bn";
  let soundEnabled = true;
  let audioCtx = null;

  // Breathing loop state
  let activeCadence = "box";
  let isBreathingActive = true;
  let breathingPhase = "inhale"; // inhale, hold1, exhale, hold2
  let phaseStartTime = 0;
  let phaseDuration = 4000;
  let rAfId = null;

  const CADENCES = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, name: "Box (4-4-4-4)" },
    478: { inhale: 4, hold1: 7, exhale: 8, hold2: 0, name: "Relax (4-7-8)" },
    deep: { inhale: 4, hold1: 2, exhale: 6, hold2: 0, name: "Deep (4-2-6)" }
  };

  const $ = (id) => document.getElementById(id);

  // ============================================================================
  // 2. BILINGUAL I18N DICTIONARY
  // ============================================================================
  const HUB_T = {
    bn: {
      pageTitle: "BreatheWell | ক্লিনিক্যাল ওয়েলনেস ও ডিজিটাল স্বাস্থ্য হাব",
      metaDesc: "BreatheWell — নির্দেশিত শ্বাস ব্যায়াম, রক্তচাপ ও গ্লুকোজ ট্র্যাকিং, স্মার্ট প্রেসক্রিপশন ভল্ট ও ডিজিটাল প্রেসক্রিপশন স্টুডিওর সমন্বিত হাব।",
      skip: "মূল কনটেন্টে যান",
      heroBadge: "ক্লিনিক্যাল ওয়েলনেস ও ডিজিটাল স্বাস্থ্য হাব ✨",
      heroTitlePrefix: "সম্পূর্ণ শারীরিক ও মানসিক সুস্থতার ",
      heroTitleHighlight: "সমন্বিত প্ল্যাটফর্ম",
      heroDesc: "প্রমাণভিত্তিক শ্বাসপ্রশ্বাস অনুশীলন, আমেরিকান হার্ট অ্যাসোসিয়েশন (AHA 2017) ও ADA স্ট্যান্ডার্ডে ভাইটালস ট্র্যাকিং এবং স্মার্ট ডিজিটাল প্রেসক্রিপশন স্টুডিও—সবকিছু আপনার হাতের মুঠোয় ১০০% প্রাইভেট ও অফলাইন।",
      btnStartBreathing: "অনুশীলন শুরু করুন",
      btnLogVitals: "ভাইটালস রেকর্ড করুন",
      btnCreateRx: "প্রেসক্রিপশন স্টুডিও",
      perkOffline: "১০০% ডিভাইসে সুরক্ষিত (Offline)",
      perkPrivate: "জিরো ক্লাউড ট্র্যাকিং (Privacy)",
      perkClinical: "ক্লিনিক্যাল নির্ভুল মান (AHA/ADA)",
      consoleLiveTitle: "লাইভ রেসপিরেটরি গাইড",
      cadenceBox: "বক্স ৪-৪-৪-৪",
      cadence478: "৪-৭-৮ রিল্যাক্স",
      cadenceDeep: "ডিপ ৪-২-৬",
      phaseInhale: "শ্বাস নিন...",
      phaseHold: "ধরে রাখুন...",
      phaseExhale: "শ্বাস ছাড়ুন...",
      phaseRest: "স্বাভাবিক থাকুন...",
      vitalStreakTitle: "মাইন্ডফুলনেস স্ট্রিক",
      vitalStreakSub: "দিন সক্রিয়",
      vitalBpTitle: "রক্তচাপ (BP)",
      vitalBpSub: "সর্বশেষ রিডিং",
      vitalBgTitle: "রক্তের গ্লুকোজ",
      vitalBgSub: "সর্বশেষ রিডিং",
      vitalRxTitle: "প্রেসক্রিপশন আর্কাইভ",
      vitalRxSub: "টি সংরক্ষিত",
      moduleSectionEyebrow: "সমন্বিত মডিউলসমূহ",
      moduleSectionTitle: "৪টি প্রধান স্বাস্থ্য ও সুস্থতা স্তম্ভ",
      moduleSectionDesc: "শারীরিক সুস্থতা পর্যবেক্ষণ এবং মানসিক প্রশান্তি বজায় রাখতে তৈরি বিজ্ঞানসম্মত ডিজিটাল টুলস।",
      mod1Title: "শ্বাস ব্যায়াম ও মাইন্ডফুলনেস ল্যাব",
      mod1Desc: "বক্স ব্রিদিং, ৪-৭-৮, নাড়িশোধন ও ডায়াফ্রাগম্যাটিক শ্বাসপ্রশ্বাসের সাহায্যে কর্টিসল হরমোন হ্রাস ও স্নায়ুতন্ত্রের ভারসাম্য বজায় রাখুন।",
      mod1Link: "ব্যায়াম স্টুডিও খুলুন",
      mod2Title: "ক্লিনিক্যাল ভাইটালস ট্র্যাকার",
      mod2Desc: "AHA 2017 মানদণ্ডে রক্তচাপ এবং ADA 2024 মানদণ্ডে ডায়াবেটিসের লাইভ স্পেকট্রাম অ্যানালাইসিস ও DataTables 2 লগ এক্সপোর্ট।",
      mod2Link: "ভাইটালস ড্যাশবোর্ড খুলুন",
      mod3Title: "প্রেসক্রিপশন ভল্ট ও ডিজিটাল প্যাড",
      mod3Desc: "Tesseract.js ওসিআর স্ক্যানার দিয়ে প্রেসক্রিপশন সংরক্ষণ এবং চিকিৎসকদের জন্য লাইভ WYSIWYG হসপিটাল প্যাড ক্রিয়েটর।",
      mod3Link: "প্রেসক্রিপশন স্টুডিও খুলুন",
      mod4Title: "ফুসফুস ও শ্বাসপ্রশ্বাস পরীক্ষা",
      mod4Desc: "বডি অক্সিজেন লেভেল টেস্ট (BOLT) দিয়ে ফুসফুসের ক্ষমতা পরিমাপ এবং রেস্টিং BPM কাউন্টারে দ্রুত শ্বাসকষ্ট বিশ্লেষণ।",
      mod4Link: "শ্বাস পরীক্ষা শুরু করুন",
      simEyebrow: "লাইভ এডুকেশন স্যান্ডবক্স",
      simTitle: "ইন্টারেক্টিভ ভাইটালস সিমুলেটর ও শিক্ষা কর্নার",
      simDesc: "স্লাইডার পরিবর্তন করে দেখুন কীভাবে রক্তচাপ ও গ্লুকোজের রিডিং আন্তর্জাতিক ক্লিনিক্যাল ক্যাটাগরিতে শ্রেণিবদ্ধ হয়।",
      simSystolicLabel: "সিস্টোলিক রক্তচাপ (Systolic)",
      simDiastolicLabel: "ডায়াস্টোলিক রক্তচাপ (Diastolic)",
      simGlucoseLabel: "রক্তের গ্লুকোজ (Blood Sugar)",
      simDiagnosisLabel: "ক্লিনিক্যাল স্ট্যাটাস:",
      simLogCta: "এই রিডিং সংরক্ষণ করুন",
      simChartsCta: "চার্ট দেখুন",
      simResetBtn: "রিসেট",
      simTabBp: "রক্তচাপ (AHA 2017)",
      simTabGlucose: "রক্তের গ্লুকোজ (ADA 2024)",
      simFastingLabel: "খালি পেটে (Fasting)",
      simPostMealLabel: "খাবারের ২ ঘণ্টা পর (Post-meal)",
      simAdviceHeader: "চিকিৎসক নির্দেশিত পরামর্শ:",
      safetyTitle: "নিরাপত্তা নির্দেশিকা ও জরুরি এসওএস",
      safetyDesc: "শ্বাসপ্রশ্বাস ও স্বাস্থ্য ট্র্যাকিংয়ের সময় আপনার শারীরিক সুরক্ষা নিশ্চিত করতে নির্দেশনাবলী মেনে চলুন।",
      tabRules: "৩টি মূল নিয়ম",
      tabReadiness: "প্রস্তুতি চেকলিস্ট",
      tabPrecautions: "স্বাস্থ্য সতর্কতা",
      tabSOS: "জরুরি শান্ত শ্বাস (SOS)",
      sosEmergencyText: "তীব্র শ্বাসকষ্ট, বুকে ব্যথা বা রক্তচাপ ১৮০+ হলে অবিলম্বে জরুরি চিকিৎসা সেবা নিন বা কল করুন:"
    },
    en: {
      pageTitle: "BreatheWell | Clinical Wellness & Unified Health Hub",
      metaDesc: "BreatheWell — Integrated hub for guided respiration, blood pressure & glucose telemetry, smart OCR prescription vault, and digital prescription studio.",
      skip: "Skip to main content",
      heroBadge: "Clinical Wellness & Digital Health Hub ✨",
      heroTitlePrefix: "Integrated Platform for ",
      heroTitleHighlight: "Mindful Health & Vitals",
      heroDesc: "Evidence-based breathing protocols, AHA 2017 & ADA 2024 vitals tracking, and a digital hospital prescription studio—100% private, client-side, and offline.",
      btnStartBreathing: "Start Breathing",
      btnLogVitals: "Log Vitals",
      btnCreateRx: "Prescription Studio",
      perkOffline: "100% Device Protected (Offline)",
      perkPrivate: "Zero Cloud Phoning (Privacy)",
      perkClinical: "Clinical Diagnostic Standards (AHA/ADA)",
      consoleLiveTitle: "Live Respiration Guide",
      cadenceBox: "Box (4-4-4-4)",
      cadence478: "Relax (4-7-8)",
      cadenceDeep: "Deep (4-2-6)",
      phaseInhale: "Inhale...",
      phaseHold: "Hold...",
      phaseExhale: "Exhale...",
      phaseRest: "Rest...",
      vitalStreakTitle: "Mindful Streak",
      vitalStreakSub: "Days Active",
      vitalBpTitle: "Blood Pressure (BP)",
      vitalBpSub: "Latest Reading",
      vitalBgTitle: "Blood Glucose",
      vitalBgSub: "Latest Reading",
      vitalRxTitle: "Prescription Archive",
      vitalRxSub: "Files Stored",
      moduleSectionEyebrow: "Integrated Modules",
      moduleSectionTitle: "4 Core Health & Wellness Pillars",
      moduleSectionDesc: "Scientifically grounded digital tools built to promote autonomic calm and clinical vital telemetry.",
      mod1Title: "Respiration Studio & Mindful Lab",
      mod1Desc: "Box Breathing, 4-7-8, Diaphragmatic & Pranayama practices to lower sympathetic tone and cortisol.",
      mod1Link: "Open Breathing Studio",
      mod2Title: "Clinical Vitals Telemetry Suite",
      mod2Desc: "AHA 2017 Blood Pressure & ADA 2024 Glucose live spectrum gauges, SVG charts, and DataTables 2 logs.",
      mod2Link: "Open Vitals Dashboard",
      mod3Title: "Prescription Vault & Digital Pad",
      mod3Desc: "In-browser Tesseract OCR scan, drag-and-drop vault, and live WYSIWYG hospital paper pad creator.",
      mod3Link: "Open Prescription Studio",
      mod4Title: "Pulmonary Diagnostic Lab",
      mod4Desc: "Body Oxygen Level Test (BOLT) stopwatch and resting BPM tap counter with tachypnea evaluation.",
      mod4Link: "Start Breath Test",
      simEyebrow: "Live Education Sandbox",
      simTitle: "Interactive Vitals Simulator & Education Sandbox",
      simDesc: "Slide vitals metrics to observe real-time AHA 2017 and ADA 2024 clinical spectrum classifications.",
      simSystolicLabel: "Systolic Pressure (mmHg)",
      simDiastolicLabel: "Diastolic Pressure (mmHg)",
      simGlucoseLabel: "Blood Glucose (Blood Sugar)",
      simDiagnosisLabel: "Clinical Status:",
      simLogCta: "Log This Reading",
      simChartsCta: "View Charts",
      simResetBtn: "Reset",
      simTabBp: "Blood Pressure (AHA 2017)",
      simTabGlucose: "Blood Glucose (ADA 2024)",
      simFastingLabel: "Fasting",
      simPostMealLabel: "2h Post-meal",
      simAdviceHeader: "Physician Clinical Advice:",
      safetyTitle: "Safety Guidelines & Emergency SOS",
      safetyDesc: "Ensure personal safety and medical awareness during respiration and health monitoring.",
      tabRules: "3 Core Rules",
      tabReadiness: "Readiness Checklist",
      tabPrecautions: "Health Precautions",
      tabSOS: "Emergency SOS Breath",
      sosEmergencyText: "If experiencing severe breathlessness, chest pain, or BP > 180 mmHg, seek immediate medical care:"
    }
  };

  function tr(key) {
    const dict = HUB_T[currentLang] || HUB_T.bn;
    return dict[key] || key;
  }

  // ============================================================================
  // 3. PROCEDURAL WEB AUDIO SYNTHESIS
  // ============================================================================
  function playHarmonicChime(freq1, freq2) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq1, now);
      osc.frequency.exponentialRampToValueAtTime(freq2, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.15);
    } catch (_) {}
  }

  // ============================================================================
  // 4. INTERACTIVE RESPIRATION COACH LOOP (rAF)
  // ============================================================================
  function startBreathingLoop() {
    phaseStartTime = performance.now();
    scheduleNextPhase();
    requestAnimationFrame(breathingRenderTick);
  }

  function scheduleNextPhase() {
    const cfg = CADENCES[activeCadence] || CADENCES.box;

    if (breathingPhase === "inhale") {
      phaseDuration = cfg.inhale * 1000;
      updateSphereVisual("inhale", cfg.inhale);
      playHarmonicChime(528, 792);
    } else if (breathingPhase === "hold1") {
      if (cfg.hold1 > 0) {
        phaseDuration = cfg.hold1 * 1000;
        updateSphereVisual("hold1", cfg.hold1);
      } else {
        breathingPhase = "exhale";
        scheduleNextPhase();
        return;
      }
    } else if (breathingPhase === "exhale") {
      phaseDuration = cfg.exhale * 1000;
      updateSphereVisual("exhale", cfg.exhale);
      playHarmonicChime(396, 594);
    } else if (breathingPhase === "hold2") {
      if (cfg.hold2 > 0) {
        phaseDuration = cfg.hold2 * 1000;
        updateSphereVisual("hold2", cfg.hold2);
      } else {
        breathingPhase = "inhale";
        scheduleNextPhase();
        return;
      }
    }
  }

  function advancePhase() {
    if (breathingPhase === "inhale") breathingPhase = "hold1";
    else if (breathingPhase === "hold1") breathingPhase = "exhale";
    else if (breathingPhase === "exhale") breathingPhase = "hold2";
    else if (breathingPhase === "hold2") breathingPhase = "inhale";

    phaseStartTime = performance.now();
    scheduleNextPhase();
  }

  function breathingRenderTick(now) {
    if (!isBreathingActive) return;

    const elapsed = now - phaseStartTime;
    const remainingMs = Math.max(0, phaseDuration - elapsed);
    const remainingSec = Math.ceil(remainingMs / 1000);

    const countEl = $("hubCountdownText");
    if (countEl) countEl.textContent = `0${remainingSec}s`.slice(-3);

    // Update SVG progress ring
    const progress = Math.min(1, elapsed / phaseDuration);
    const circleBar = $("hubSvgBar");
    if (circleBar) {
      const circumference = 628; // 2 * PI * 100
      circleBar.style.strokeDashoffset = (circumference * (1 - progress)).toString();
    }

    if (elapsed >= phaseDuration) {
      advancePhase();
    }

    rAfId = requestAnimationFrame(breathingRenderTick);
  }

  function updateSphereVisual(phase, durationSec) {
    const sphere = $("hubBreathingSphere");
    const phaseLabel = $("hubPhaseText");
    if (!sphere || !phaseLabel) return;

    if (phase === "inhale") {
      phaseLabel.textContent = tr("phaseInhale");
      sphere.style.transition = `transform ${durationSec}s cubic-bezier(0.42, 0, 0.58, 1)`;
      sphere.style.transform = "scale(1.35)";
    } else if (phase === "hold1") {
      phaseLabel.textContent = tr("phaseHold");
      sphere.style.transition = "none";
      sphere.style.transform = "scale(1.35)";
    } else if (phase === "exhale") {
      phaseLabel.textContent = tr("phaseExhale");
      sphere.style.transition = `transform ${durationSec}s cubic-bezier(0.42, 0, 0.58, 1)`;
      sphere.style.transform = "scale(1.0)";
    } else if (phase === "hold2") {
      phaseLabel.textContent = tr("phaseRest");
      sphere.style.transition = "none";
      sphere.style.transform = "scale(1.0)";
    }
  }

  // ============================================================================
  // 5. LIVE TELEMETRY LOADER (LOCALSTORAGE SYNC)
  // ============================================================================
  function loadLiveTelemetry() {
    try {
      // 1. Streak & Mindful Minutes
      const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || "{}");
      const streakVal = $("statStreakVal");
      if (streakVal) streakVal.textContent = profile.streak || "3";

      // 2. Latest Blood Pressure
      const vitalsAll = JSON.parse(localStorage.getItem(STORAGE_KEYS.VITALS) || "[]");
      const bpRecords = vitalsAll.filter((r) => r.sys && r.dia);
      const bpVal = $("statBpVal");
      const bpBadge = $("statBpBadge");

      if (bpRecords.length > 0) {
        const latestBp = bpRecords[0];
        if (bpVal) bpVal.textContent = `${latestBp.sys} / ${latestBp.dia}`;
        if (bpBadge) {
          const cat = evaluateAhaBp(Number(latestBp.sys), Number(latestBp.dia));
          bpBadge.textContent = cat.label;
          bpBadge.className = `hub-vitality-badge ${cat.cssClass}`;
        }
      } else {
        if (bpVal) bpVal.textContent = "120 / 80";
        if (bpBadge) {
          bpBadge.textContent = "স্বাভাবিক (Normal)";
          bpBadge.className = "hub-vitality-badge bg-success-subtle text-success";
        }
      }

      // 3. Latest Blood Glucose
      const bgRecords = vitalsAll.filter((r) => r.glucose || r.bg);
      const bgVal = $("statBgVal");
      const bgBadge = $("statBgBadge");

      if (bgRecords.length > 0) {
        const latestBg = bgRecords[0];
        const val = latestBg.glucose || latestBg.bg;
        if (bgVal) bgVal.textContent = `${val} mg/dL`;
        if (bgBadge) {
          const gCat = evaluateAdaGlucose(Number(val));
          bgBadge.textContent = gCat.label;
          bgBadge.className = `hub-vitality-badge ${gCat.cssClass}`;
        }
      } else {
        if (bgVal) bgVal.textContent = "95 mg/dL";
        if (bgBadge) {
          bgBadge.textContent = "খালি পেটে স্বাভাবিক";
          bgBadge.className = "hub-vitality-badge bg-success-subtle text-success";
        }
      }

      // 4. Prescription Vault Records
      const rxVault = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULT_RX) || "[]");
      const rxPad = JSON.parse(localStorage.getItem(STORAGE_KEYS.DIGITALPAD_RX) || "[]");
      const allRxIds = new Set([...rxVault.map((r) => r.id), ...rxPad.map((r) => r.id)]);
      const rxCountVal = $("statRxVal");
      if (rxCountVal) rxCountVal.textContent = allRxIds.size > 0 ? allRxIds.size : "4";
    } catch (err) {
      console.warn("Telemetry loading notice:", err);
    }
  }

  let refreshSimulatorView = null;

  // ============================================================================
  // 6. CLINICAL EVALUATION ENGINES (AHA 2017 & ADA 2024)
  // ============================================================================
  function evaluateAhaBp(sys, dia, lang = currentLang) {
    const isEn = lang === "en";
    if (sys > 180 || dia > 120) {
      return {
        label: isEn ? "Hypertensive Crisis" : "⚠️ উচ্চ রক্তচাপ সংকট (Crisis)",
        category: "crisis",
        cssClass: "bg-danger text-white",
        bannerStyle: "background: #450a0a; border-color: #991b1b; color: #fecaca;",
        heartBg: "#fee2e2",
        heartColor: "#dc2626",
        heartIcon: "bi bi-exclamation-triangle-fill",
        pinPct: 92,
        advice: isEn
          ? "Medical Emergency: Immediate emergency clinical care required! Proceed to the nearest hospital or call SOS."
          : "জরুরি সতর্কতা: অবিলম্বে নিকটস্থ হাসপাতালে জরুরি বিভাগে যান বা জরুরি চিকিৎসকের সহায়তা নিন!"
      };
    } else if (sys >= 140 || dia >= 90) {
      return {
        label: isEn ? "Stage 2 Hypertension" : "স্টেজ-২ উচ্চ রক্তচাপ",
        category: "stage2",
        cssClass: "bg-danger-subtle text-danger",
        bannerStyle: "background: #fef2f2; border-color: #fecaca; color: #991b1b;",
        heartBg: "#fee2e2",
        heartColor: "#ef4444",
        heartIcon: "bi bi-heart-pulse-fill",
        pinPct: 75,
        advice: isEn
          ? "Stage 2 Hypertension indicated. Consult a physician for diagnostic evaluation and prescription management."
          : "স্টেজ-২ উচ্চ রক্তচাপ নির্দেশিত। চিকিৎসকের পরামর্শ নিয়ে অবিলম্বে ওষুধ ও খাদ্যাভ্যাস সমন্বয় করুন।"
      };
    } else if (sys >= 130 || dia >= 80) {
      return {
        label: isEn ? "Stage 1 Hypertension" : "স্টেজ-১ হাইপারটেনশন",
        category: "stage1",
        cssClass: "bg-warning-subtle text-dark",
        bannerStyle: "background: #fff7ed; border-color: #fed7aa; color: #9a3412;",
        heartBg: "#ffedd5",
        heartColor: "#f97316",
        heartIcon: "bi bi-heart-pulse-fill",
        pinPct: 58,
        advice: isEn
          ? "Stage 1 Hypertension. Restrict dietary sodium, avoid processed foods, and establish aerobic activity routine."
          : "স্টেজ-১ উচ্চ রক্তচাপ। অতিরিক্ত লবণ ও চর্বিযুক্ত খাবার বর্জন করুন, নিয়মিত শরীরচর্চা শুরু করুন।"
      };
    } else if (sys >= 120 && dia < 80) {
      return {
        label: isEn ? "Elevated BP" : "সামান্য বৃদ্ধি (Elevated)",
        category: "elevated",
        cssClass: "bg-warning-subtle text-warning",
        bannerStyle: "background: #fefce8; border-color: #fef08a; color: #854d0e;",
        heartBg: "#fef3c7",
        heartColor: "#d97706",
        heartIcon: "bi bi-heart-pulse-fill",
        pinPct: 40,
        advice: isEn
          ? "Blood pressure is mildly elevated. Practice daily stress reduction, optimize sleep, and hydrate."
          : "রক্তচাপ কিছুটা ঊর্ধ্বমুখী। মানসিক চাপ কমান, পর্যাপ্ত ঘুমান এবং স্বাস্থ্যকর খাদ্যাভ্যাস গড়ে তুলুন।"
      };
    } else if (sys < 90 || dia < 60) {
      return {
        label: isEn ? "Hypotension (Low BP)" : "নিম্ন রক্তচাপ (Low BP)",
        category: "hypo",
        cssClass: "bg-purple-subtle text-purple",
        bannerStyle: "background: #faf5ff; border-color: #e9d5ff; color: #6b21a8;",
        heartBg: "#f3e8ff",
        heartColor: "#9333ea",
        heartIcon: "bi bi-arrow-down-circle-fill",
        pinPct: 8,
        advice: isEn
          ? "Low blood pressure detected. Increase fluid and electrolyte intake. Rest if experiencing lightheadedness."
          : "রক্তচাপ স্বাভাবিকের চেয়ে কম। পর্যাপ্ত স্যালাইন বা তরল পান করুন এবং মাথা ঘোরানো থাকলে বিশ্রাম নিন।"
      };
    } else {
      return {
        label: isEn ? "Normal & Optimal" : "স্বাভাবিক (Normal)",
        category: "normal",
        cssClass: "bg-success-subtle text-success",
        bannerStyle: "background: #ecfdf5; border-color: #a7f3d0; color: #065f46;",
        heartBg: "#d1fae5",
        heartColor: "#059669",
        heartIcon: "bi bi-heart-pulse-fill",
        pinPct: 24,
        advice: isEn
          ? "Your blood pressure is within the optimal clinical range. Maintain active lifestyle and balanced diet."
          : "আপনার রক্তচাপ আদর্শ মাত্রায় রয়েছে। সুষম খাদ্যাভ্যাস ও দৈনিক ৩০ মিনিট স্বাভাবিক হাঁটা অব্যাহত রাখুন।"
      };
    }
  }

  function evaluateAdaGlucose(val, isFasting = true, lang = currentLang) {
    const isEn = lang === "en";
    if (val < 70) {
      return {
        label: isEn ? "Hypoglycemia (Low)" : "হাইপোগ্লাইসেমিয়া (Low)",
        category: "hypo",
        cssClass: "bg-purple-subtle text-purple",
        bannerStyle: "background: #faf5ff; border-color: #e9d5ff; color: #6b21a8;",
        heartBg: "#f3e8ff",
        heartColor: "#9333ea",
        heartIcon: "bi bi-droplet-half",
        pinPct: 8,
        advice: isEn
          ? "Critically low blood glucose! Follow the 15-15 rule: consume 15g fast-acting carbs or juice immediately."
          : "রক্তে সুগারের মাত্রা বিপজ্জনকভাবে কম! অবিলম্বে ১৫ গ্রাম দ্রুত শোষণযোগ্য চিনি বা জুস গ্রহণ করুন (15-15 Rule)।"
      };
    }

    const normalMax = isFasting ? 99 : 139;
    const impairedMax = isFasting ? 125 : 199;

    if (val <= normalMax) {
      return {
        label: isEn
          ? isFasting ? "Normal Fasting" : "Normal Post-meal"
          : isFasting ? "খালি পেটে স্বাভাবিক" : "ভরা পেটে স্বাভাবিক",
        category: "normal",
        cssClass: "bg-success-subtle text-success",
        bannerStyle: "background: #ecfdf5; border-color: #a7f3d0; color: #065f46;",
        heartBg: "#d1fae5",
        heartColor: "#059669",
        heartIcon: "bi bi-droplet-fill",
        pinPct: 24,
        advice: isEn
          ? "Blood glucose is well-regulated within ADA criteria. Continue balanced macronutrients and regular sleep."
          : "রক্তের গ্লুকোজ আদর্শ নিয়ন্ত্রণে আছে। সুষম কার্বোহাইড্রেট ও প্রোটিনসমৃদ্ধ খাদ্যতালিকা বজায় রাখুন।"
      };
    } else if (val <= impairedMax) {
      return {
        label: isEn ? "Pre-diabetes (Impaired)" : "প্রি-ডায়াবেটিস (Impaired)",
        category: "elevated",
        cssClass: "bg-warning-subtle text-warning",
        bannerStyle: "background: #fefce8; border-color: #fef08a; color: #854d0e;",
        heartBg: "#fef3c7",
        heartColor: "#d97706",
        heartIcon: "bi bi-droplet-half",
        pinPct: 45,
        advice: isEn
          ? "Pre-diabetic threshold detected. Eliminate refined sugars, increase dietary fiber, and exercise regularly."
          : "গ্লুকোজ প্রি-ডায়াবেটিস মাত্রায় রয়েছে। চিনিযুক্ত পানীয় পরিহার করুন এবং ওজন নিয়ন্ত্রণে মনোযোগী হোন।"
      };
    } else if (val < 200) {
      return {
        label: isEn ? "Diabetic Hyperglycemia" : "ডায়াবেটিস রেঞ্জ (Diabetes)",
        category: "stage1",
        cssClass: "bg-danger-subtle text-danger",
        bannerStyle: "background: #fff7ed; border-color: #fed7aa; color: #9a3412;",
        heartBg: "#ffedd5",
        heartColor: "#ea580c",
        heartIcon: "bi bi-droplet-fill",
        pinPct: 70,
        advice: isEn
          ? "Elevated diabetic range. Clinical evaluation, HbA1c confirmation, and dietary management needed."
          : "ডায়াবেটিস সীমার রক্তে শর্করা। একজন এন্ডোক্রিনোলজিস্ট বা চিকিৎসকের সাথে পরামর্শ করে HbA1c টেস্ট করান।"
      };
    } else {
      return {
        label: isEn ? "Severe Hyperglycemia" : "⚠️ তীব্র হাইপারগ্লাইসেমিয়া",
        category: "crisis",
        cssClass: "bg-danger text-white",
        bannerStyle: "background: #450a0a; border-color: #991b1b; color: #fecaca;",
        heartBg: "#fee2e2",
        heartColor: "#dc2626",
        heartIcon: "bi bi-exclamation-triangle-fill",
        pinPct: 92,
        advice: isEn
          ? "Very high glucose level! Risk of diabetic ketoacidosis (DKA); seek prompt medical attention."
          : "অতি উচ্চ মাত্রার গ্লুকোজ! কিটোঅ্যাসিডোসিস (DKA) ঝুঁকি এড়াতে দ্রুত চিকিৎসকের শরণাপন্ন হোন।"
      };
    }
  }

  // ============================================================================
  // 7. INTERACTIVE VITALS SIMULATOR ENGINE
  // ============================================================================
  function initVitalsSimulator() {
    let simMode = "bp"; // "bp" or "glucose"
    let currentPreset = "normal";

    const btnTabBp = $("btnSimTabBp");
    const btnTabGlucose = $("btnSimTabGlucose");
    const groupBp = $("simGroupBp");
    const groupGlucose = $("simGroupGlucose");
    const resetBtn = $("btnResetSim");

    const sysSlider = $("simSysSlider");
    const diaSlider = $("simDiaSlider");
    const gluSlider = $("simGluSlider");
    const sysVal = $("simSysVal");
    const diaVal = $("simDiaVal");
    const gluVal = $("simGluVal");

    const btnSysMinus = $("btnSysMinus");
    const btnSysPlus = $("btnSysPlus");
    const btnDiaMinus = $("btnDiaMinus");
    const btnDiaPlus = $("btnDiaPlus");
    const btnGluMinus = $("btnGluMinus");
    const btnGluPlus = $("btnGluPlus");

    const displayTitle = $("simDisplayTitle");
    const primaryNumber = $("simPrimaryNumber");
    const primaryUnit = $("simPrimaryUnit");
    const heartBadge = $("simHeartBadge");
    const spectrumPin = $("simSpectrumPin");
    const categoryBanner = $("simCategoryBanner");
    const categoryIcon = $("simCategoryIcon");
    const diagnosisBadge = $("simDiagnosisBadge");
    const standardBadge = $("simStandardBadge");
    const adviceTitle = $("simAdviceTitle");
    const adviceText = $("simAdviceText");
    const btnLog = $("btnLogSimulatedValue");
    const presetWrap = $("simPresetPills");

    const BP_PRESETS = {
      normal: { sys: 120, dia: 80, labelBn: "স্বাভাবিক (120/80)", labelEn: "Normal (120/80)" },
      elevated: { sys: 125, dia: 78, labelBn: "সামান্য বৃদ্ধি (125/78)", labelEn: "Elevated (125/78)" },
      stage1: { sys: 135, dia: 85, labelBn: "স্টেজ-১ হাইপারটেনশন (135/85)", labelEn: "Stage 1 HTN (135/85)" },
      stage2: { sys: 150, dia: 95, labelBn: "স্টেজ-২ হাইপারটেনশন (150/95)", labelEn: "Stage 2 HTN (150/95)" },
      crisis: { sys: 190, dia: 125, labelBn: "⚠️ ক্রাইসিস (190/125)", labelEn: "⚠️ Crisis (190/125)" },
      hypo: { sys: 85, dia: 55, labelBn: "লো প্রেশার (85/55)", labelEn: "Hypotension (85/55)" }
    };

    const GLUCOSE_PRESETS = {
      normal: { glu: 95, ctx: "fasting", labelBn: "স্বাভাবিক খালি পেটে (৯৫)", labelEn: "Normal Fasting (95)" },
      elevated: { glu: 115, ctx: "fasting", labelBn: "প্রি-ডায়াবেটিস (১১৫)", labelEn: "Pre-diabetes (115)" },
      stage1: { glu: 140, ctx: "fasting", labelBn: "ডায়াবেটিস রেঞ্জ (১৪০)", labelEn: "Diabetes Range (140)" },
      stage2: { glu: 180, ctx: "fasting", labelBn: "উচ্চ মাত্রা (১৮০)", labelEn: "High Glucose (180)" },
      crisis: { glu: 260, ctx: "fasting", labelBn: "⚠️ তীব্র হাইপার (২৬০)", labelEn: "⚠️ Severe Hyper (260)" },
      hypo: { glu: 58, ctx: "fasting", labelBn: "হাইপোগ্লাইসেমিয়া (৫৮)", labelEn: "Hypoglycemia (58)" }
    };

    function renderPresets() {
      if (!presetWrap) return;
      const isEn = currentLang === "en";
      const dict = simMode === "bp" ? BP_PRESETS : GLUCOSE_PRESETS;
      presetWrap.innerHTML = Object.keys(dict).map((key) => {
        const p = dict[key];
        const activeCls = currentPreset === key ? "active" : "";
        const label = isEn ? p.labelEn : p.labelBn;
        return `<button type="button" class="hub-preset-chip ${activeCls}" data-preset="${key}">${label}</button>`;
      }).join("");

      presetWrap.querySelectorAll(".hub-preset-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const key = chip.getAttribute("data-preset");
          applyPreset(key);
        });
      });
    }

    function applyPreset(key) {
      currentPreset = key;
      if (simMode === "bp") {
        const p = BP_PRESETS[key];
        if (p) {
          if (sysSlider) sysSlider.value = p.sys;
          if (diaSlider) diaSlider.value = p.dia;
        }
      } else {
        const p = GLUCOSE_PRESETS[key];
        if (p) {
          if (gluSlider) gluSlider.value = p.glu;
          const r = document.querySelector(`input[name="simMealCtx"][value="${p.ctx}"]`);
          if (r) {
            r.checked = true;
            document.querySelectorAll(".hub-radio-pill").forEach((lbl) => {
              lbl.classList.toggle("active", lbl.contains(r));
            });
          }
        }
      }
      updateSimulation();
      renderPresets();
    }

    function applyDisplayResult(res) {
      if (spectrumPin) {
        spectrumPin.style.left = `${res.pinPct}%`;
      }
      if (diagnosisBadge) {
        diagnosisBadge.textContent = res.label;
      }
      if (categoryBanner) {
        categoryBanner.setAttribute("style", res.bannerStyle);
      }
      if (categoryIcon) {
        if (res.category === "crisis") {
          categoryIcon.className = "bi bi-exclamation-triangle-fill fs-5";
        } else if (res.category === "hypo") {
          categoryIcon.className = "bi bi-arrow-down-circle-fill fs-5";
        } else if (res.category === "normal") {
          categoryIcon.className = "bi bi-shield-check fs-5";
        } else {
          categoryIcon.className = "bi bi-info-circle-fill fs-5";
        }
      }
      if (heartBadge) {
        heartBadge.style.background = res.heartBg;
        heartBadge.style.color = res.heartColor;
        const heartI = heartBadge.querySelector("i");
        if (heartI) heartI.className = res.heartIcon;
      }
      if (adviceTitle) {
        adviceTitle.textContent = currentLang === "en" ? "Physician Clinical Advice:" : "চিকিৎসক নির্দেশিত পরামর্শ:";
      }
      if (adviceText) {
        adviceText.textContent = res.advice;
      }
    }

    function updateSimulation() {
      const isEn = currentLang === "en";

      if (simMode === "bp") {
        const sys = Number(sysSlider?.value || 120);
        const dia = Number(diaSlider?.value || 80);

        if (sysVal) sysVal.textContent = `${sys} mmHg`;
        if (diaVal) diaVal.textContent = `${dia} mmHg`;

        if (displayTitle) displayTitle.textContent = isEn ? "AHA 2017 Blood Pressure Telemetry" : "AHA 2017 রক্তচাপ বিশ্লেষণ";
        if (primaryNumber) primaryNumber.textContent = `${sys} / ${dia}`;
        if (primaryUnit) primaryUnit.textContent = "mmHg";
        if (standardBadge) standardBadge.textContent = "AHA 2017";

        const res = evaluateAhaBp(sys, dia, currentLang);
        applyDisplayResult(res);

        if (btnLog) {
          btnLog.href = `health-reading.html?sys=${sys}&dia=${dia}`;
          btnLog.title = isEn ? `Log BP ${sys}/${dia} mmHg` : `রক্তচাপ ${sys}/${dia} mmHg সংরক্ষণ করুন`;
        }
      } else {
        const glu = Number(gluSlider?.value || 95);
        const mealRadio = document.querySelector('input[name="simMealCtx"]:checked');
        const mealCtx = mealRadio ? mealRadio.value : "fasting";
        const isFasting = mealCtx === "fasting";

        if (gluVal) gluVal.textContent = `${glu} mg/dL`;

        if (displayTitle) displayTitle.textContent = isEn ? "ADA 2024 Blood Glucose Telemetry" : "ADA 2024 রক্তের গ্লুকোজ বিশ্লেষণ";
        if (primaryNumber) primaryNumber.textContent = `${glu}`;
        if (primaryUnit) primaryUnit.textContent = "mg/dL";
        if (standardBadge) standardBadge.textContent = "ADA 2024";

        const res = evaluateAdaGlucose(glu, isFasting, currentLang);
        applyDisplayResult(res);

        if (btnLog) {
          btnLog.href = `health-reading.html?glucose=${glu}&context=${mealCtx}`;
          btnLog.title = isEn ? `Log Blood Sugar ${glu} mg/dL` : `রক্তের গ্লুকোজ ${glu} mg/dL সংরক্ষণ করুন`;
        }
      }
    }

    // Slider input listeners
    sysSlider?.addEventListener("input", () => {
      currentPreset = null;
      renderPresets();
      updateSimulation();
    });
    diaSlider?.addEventListener("input", () => {
      currentPreset = null;
      renderPresets();
      updateSimulation();
    });
    gluSlider?.addEventListener("input", () => {
      currentPreset = null;
      renderPresets();
      updateSimulation();
    });

    // Stepper buttons
    btnSysMinus?.addEventListener("click", () => {
      if (sysSlider) {
        sysSlider.value = Math.max(Number(sysSlider.min), Number(sysSlider.value) - 2);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });
    btnSysPlus?.addEventListener("click", () => {
      if (sysSlider) {
        sysSlider.value = Math.min(Number(sysSlider.max), Number(sysSlider.value) + 2);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });

    btnDiaMinus?.addEventListener("click", () => {
      if (diaSlider) {
        diaSlider.value = Math.max(Number(diaSlider.min), Number(diaSlider.value) - 2);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });
    btnDiaPlus?.addEventListener("click", () => {
      if (diaSlider) {
        diaSlider.value = Math.min(Number(diaSlider.max), Number(diaSlider.value) + 2);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });

    btnGluMinus?.addEventListener("click", () => {
      if (gluSlider) {
        gluSlider.value = Math.max(Number(gluSlider.min), Number(gluSlider.value) - 5);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });
    btnGluPlus?.addEventListener("click", () => {
      if (gluSlider) {
        gluSlider.value = Math.min(Number(gluSlider.max), Number(gluSlider.value) + 5);
        currentPreset = null;
        renderPresets();
        updateSimulation();
      }
    });

    // Meal context radio pills
    document.querySelectorAll('input[name="simMealCtx"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        document.querySelectorAll(".hub-radio-pill").forEach((lbl) => {
          lbl.classList.toggle("active", lbl.contains(radio));
        });
        updateSimulation();
      });
    });

    // Mode switching tabs
    btnTabBp?.addEventListener("click", () => {
      if (simMode === "bp") return;
      simMode = "bp";
      btnTabBp.classList.add("active");
      btnTabGlucose?.classList.remove("active");
      groupBp?.classList.remove("d-none");
      groupGlucose?.classList.add("d-none");
      currentPreset = "normal";
      if (sysSlider) sysSlider.value = 120;
      if (diaSlider) diaSlider.value = 80;
      renderPresets();
      updateSimulation();
    });

    btnTabGlucose?.addEventListener("click", () => {
      if (simMode === "glucose") return;
      simMode = "glucose";
      btnTabGlucose.classList.add("active");
      btnTabBp?.classList.remove("active");
      groupGlucose?.classList.remove("d-none");
      groupBp?.classList.add("d-none");
      currentPreset = "normal";
      if (gluSlider) gluSlider.value = 95;
      renderPresets();
      updateSimulation();
    });

    // Reset button
    resetBtn?.addEventListener("click", () => {
      currentPreset = "normal";
      if (simMode === "bp") {
        if (sysSlider) sysSlider.value = 120;
        if (diaSlider) diaSlider.value = 80;
      } else {
        if (gluSlider) gluSlider.value = 95;
        const rFasting = document.querySelector('input[name="simMealCtx"][value="fasting"]');
        if (rFasting) {
          rFasting.checked = true;
          document.querySelectorAll(".hub-radio-pill").forEach((lbl) => {
            lbl.classList.toggle("active", lbl.contains(rFasting));
          });
        }
      }
      renderPresets();
      updateSimulation();
    });

    // Initial render
    renderPresets();
    updateSimulation();

    // Register refresh hook for language changes
    refreshSimulatorView = () => {
      renderPresets();
      updateSimulation();
    };
  }

  // ============================================================================
  // 8. SAFETY TABS CONTROLLER
  // ============================================================================
  function initSafetyTabs() {
    const tabBtns = document.querySelectorAll(".hub-safety-tab-btn");
    const tabPanes = document.querySelectorAll(".hub-safety-pane");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.add("d-none"));

        btn.classList.add("active");
        const activePane = $(targetId);
        if (activePane) activePane.classList.remove("d-none");
      });
    });
  }

  // ============================================================================
  // 9. EVENT BINDINGS & LIFECYCLE
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    startBreathingLoop();
    loadLiveTelemetry();
    initVitalsSimulator();
    initSafetyTabs();

    // Cadence switcher pills
    document.querySelectorAll(".hub-cadence-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".hub-cadence-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeCadence = pill.getAttribute("data-cadence") || "box";
        breathingPhase = "inhale";
        scheduleNextPhase();
      });
    });

    // Sound toggle button
    $("hubSoundToggle")?.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      const icon = $("hubSoundIcon");
      if (icon) {
        icon.className = soundEnabled ? "bi bi-volume-up-fill" : "bi bi-volume-mute-fill";
      }
    });

    // Tap sphere to trigger mindful breath pulse
    $("hubBreathingSphere")?.addEventListener("click", () => {
      playHarmonicChime(528, 792);
      const sphere = $("hubBreathingSphere");
      if (sphere) {
        sphere.style.transform = "scale(1.45)";
        setTimeout(() => {
          sphere.style.transform = "scale(1.35)";
        }, 300);
      }
    });
  });

  function initLanguage() {
    applyTranslations();

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail?.lang && e.detail.lang !== currentLang) {
          currentLang = e.detail.lang;
          applyTranslations();
          loadLiveTelemetry();
        }
      });
    }
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-hub-i18n]").forEach((el) => {
      const k = el.getAttribute("data-hub-i18n");
      if (k && tr(k)) {
        el.textContent = tr(k);
      }
    });

    document.querySelectorAll("[data-hub-i18n-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-hub-i18n-placeholder");
      if (k && tr(k)) {
        el.placeholder = tr(k);
      }
    });

    if (typeof refreshSimulatorView === "function") {
      refreshSimulatorView();
    }
  }
})();
