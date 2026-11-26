/**
 * @file home.js
 * @description Controller for `index.html`: Family Hub Overview, Active Member
 * Live KPI Telemetry, Quick Member Switcher Chips, Guided Mini Breathing Orb,
 * Clean Module Navigation Cards & Emergency SOS / Safety Checklist Modal.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Page Dictionary (`PAGE_DICT`)
 *   2. Active Member KPI & Quick Switcher Renderer
 *   3. Mini Hero Breathing Cadence Animation (`4-4-4-4`)
 *   4. Emergency SOS Contact & Safety Readiness Checklist
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ব্রিদওয়েল পরিবার কেয়ার | শ্বাস-প্রশ্বাস ও স্বাস্থ্য ব্যবস্থাপনা',
      heroEyebrow: 'পারিবারিক শ্বাস ও ক্লিনিক্যাল স্বাস্থ্য হাব',
      heroTitle: 'সচেতন শ্বাস-প্রশ্বাস ও পরিবারের সম্পূর্ণ স্বাস্থ্য সুরক্ষা',
      heroSubtitle: 'একটি প্রাইভেট ব্রাউজার ড্যাশবোর্ডে আপনার ও পরিবারের সবার রক্তচাপ, ডায়াবেটিস, BOLT ফিটনেস এবং প্রেসক্রিপশন আলাদাভাবে সংরক্ষণ করুন।',
      heroBtnExercises: 'শ্বাস ব্যায়াম শুরু করুন',
      heroBtnVitals: 'স্বাস্থ্য রিডিং যোগ করুন',
      orbCueInhale: 'শ্বাস নিন',
      orbCueHold: 'ধরে রাখুন',
      orbCueExhale: 'ধীরে ছাড়ুন',
      orbTogglePause: 'থামান',
      orbTogglePlay: 'প্রিভিউ চালু',
      quickSwitchTitle: 'দ্রুত সদস্য পরিবর্তন:',
      kpiBpTitle: 'সর্বশেষ রক্তচাপ',
      kpiGlucoseTitle: 'সর্বশেষ গ্লুকোজ',
      kpiBoltTitle: 'সর্বশেষ BOLT স্কোর',
      kpiMinutesTitle: 'মোট শ্বাস ব্যায়াম',
      hubTitle: 'মূল স্বাস্থ্য মডিউলসমূহ',
      hubExercisesTitle: 'গাইডেড শ্বাস-প্রশ্বাস স্টুডিও',
      hubExercisesDesc: 'বক্স (৪-৪-৪-৪), ৪-৭-৮ শান্তি, প্রাণায়াম এবং ডায়াফ্র্যাগমেটিক ব্যায়াম — লাইভ অডিও ও গ্রাফিক্যাল গাইড সহ।',
      hubExercisesBtn: 'ব্যায়াম স্টুডিও খুলুন',
      hubBoltTitle: 'BOLT ও শ্বাস ফিটনেস পরীক্ষা',
      hubBoltDesc: 'অক্সিজেন সহনশীলতা (BOLT) স্টপওয়াচ, প্রতি মিনিটে শ্বাসের হার (BPM) এবং বোর ইফেক্ট বিজ্ঞান।',
      hubBoltBtn: 'ব্রিদ টেস্ট দিন',
      hubVitalsTitle: 'ক্লিনিক্যাল ভাইটালস ও ট্রেন্ড',
      hubVitalsDesc: 'AHA রক্তচাপ ও ADA ডায়াবেটিস মূল্যায়ন, ইন্টারেক্টিভ SVG ট্রেন্ড চার্ট এবং CSV/JSON এক্সপোর্ট।',
      hubVitalsBtn: 'রিডিং ও চার্ট দেখুন',
      hubRxTitle: 'প্রেসক্রিপশন ভল্ট ও ডিজিটাল প্যাড',
      hubRxDesc: 'প্রেসক্রিপশন স্ক্যানার (OCR), রিফিল কাউন্টডাউন, A4 ডিজিটাল প্যাড প্রিন্ট এবং হোয়াটসঅ্যাপ শেয়ার।',
      hubRxBtn: 'ভল্ট ও প্যাড খুলুন',
      sosTitle: 'জরুরি SOS ও নিরাপত্তা চেকলিস্ট',
      sosDesc: 'তীব্র হাইপোগ্লাইসেমিয়া (<70 mg/dL) বা হাইপারটেনসিভ ক্রাইসিস (>180/120 mmHg) অবস্থায় তাৎক্ষণিক জরুরি পদক্ষেপ নিন।',
      sosOpenBtn: 'জরুরি গাইড ও চেকলিস্ট খুলুন',
      sosModalTitle: 'জরুরি মেডিকেল SOS ও পূর্ব-নিরাপত্তা গাইড',
      sosCallLabel: 'জাতীয় জরুরি সেবা (বাংলাদেশ): ৯৯৯ • চিকিৎসকের সাথে দ্রুত যোগাযোগ করুন।',
      sosChecklistTitle: 'ব্যায়াম-পূর্ব ৪টি নিরাপত্তা পরীক্ষা:',
      sosChk1: 'আমি আরামদায়ক হয়ে সোজা ভঙ্গিতে বসেছি বা শুয়ে আছি।',
      sosChk2: 'শ্বাস ধরে রাখার সময় কখনোই মাথা ঘোরা বা তীব্র কষ্ট হলে সাথে সাথে থামব।',
      sosChk3: 'গর্ভাবস্থা বা তীব্র হৃদরোগের জটিলতায় ডাক্তারের পরামর্শ ছাড়া দীর্ঘ হোল্ড করব না।',
      sosChk4: 'ডায়াবেটিস (<70 mg/dL) বা উচ্চ রক্তচাপ (>180/120) হলে আগে মেডিকেল সেবা নেব।',
      scienceStrip: 'গবেষণা ভিত্তি: McKeown (BOLT/CO₂ সহনশীলতা), Lehrer & Gevirtz (HRV রেজোন্যান্স), AHA 2017 ও ADA 2024 ক্লিনিক্যাল গাইডলাইন।'
    },
    en: {
      pageTitle: 'BreatheWell Family Care | Mindful Respiratory & Clinical Suite',
      heroEyebrow: 'Multi-Member Respiratory & Clinical Telemetry Hub',
      heroTitle: 'Mindful Breathing & Unified Family Health Sanctuary',
      heroSubtitle: 'Track Box/4-7-8 sessions, BOLT breath scores, AHA blood pressure, ADA glucose trends, and prescriptions per family member — 100% private in your browser.',
      heroBtnExercises: 'Start Guided Session',
      heroBtnVitals: 'Log Vitals Reading',
      orbCueInhale: 'Inhale',
      orbCueHold: 'Hold',
      orbCueExhale: 'Exhale',
      orbTogglePause: 'Pause Orb',
      orbTogglePlay: 'Preview Cadence',
      quickSwitchTitle: 'Quick Member Switch:',
      kpiBpTitle: 'Latest Blood Pressure',
      kpiGlucoseTitle: 'Latest Blood Glucose',
      kpiBoltTitle: 'Latest BOLT Score',
      kpiMinutesTitle: 'Breathing Practice',
      hubTitle: 'Core Clinical & Wellness Modules',
      hubExercisesTitle: 'Guided Breathing Studio',
      hubExercisesDesc: 'Interactive Box (4-4-4-4), 4-7-8 Calm, Pranayama & Diaphragmatic pacing with live waveform, audio chimes & TTS.',
      hubExercisesBtn: 'Open Breathing Studio',
      hubBoltTitle: 'BOLT & Respiratory Fitness',
      hubBoltDesc: 'Precision CO₂ tolerance stopwatch, BPM tap rate counter, trend chart & interactive Bohr Effect explainer.',
      hubBoltBtn: 'Take Breath Test',
      hubVitalsTitle: 'Clinical Vitals & Trends',
      hubVitalsDesc: 'AHA 2017 BP & ADA 2024 Glucose analyzers, interactive SVG safe-zone charts, DataTables & CSV/JSON export.',
      hubVitalsBtn: 'Open Vitals Suite',
      hubRxTitle: 'Prescription Vault & Digital Pad',
      hubRxDesc: 'Lossless OCR vault scanner, refill countdown alerts, WYSIWYG A4 print studio & WhatsApp clinical summary.',
      hubRxBtn: 'Open Rx Suite',
      sosTitle: 'Emergency SOS & Safety Readiness',
      sosDesc: 'Immediate triage reference for severe hypoglycemia (<70 mg/dL) or hypertensive crisis (>180/120 mmHg), plus pre-session checks.',
      sosOpenBtn: 'Open SOS & Checklist',
      sosModalTitle: 'Emergency Triage Guide & Pre-Practice Checklist',
      sosCallLabel: 'Emergency Helpline: 999 (or your local 911/emergency number) — Seek immediate care for chest pain or stroke signs.',
      sosChecklistTitle: '4-Step Pre-Practice Safety Check:',
      sosChk1: 'I am seated comfortably upright with relaxed shoulders.',
      sosChk2: 'I will stop breath holds gently at the very first comfortable urge — zero straining.',
      sosChk3: 'During pregnancy or uncontrolled cardiac disease, I will skip long breath-hold phases.',
      sosChk4: 'If Glucose <70 mg/dL or BP >180/120 mmHg, I will prioritize immediate medical care.',
      scienceStrip: 'Clinical Foundations: McKeown (BOLT & Nasal Endurance), Lehrer & Gevirtz (HRV Coherence), AHA 2017 & ADA 2024 Standards.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  /* --------------------------------------------------------------------------
     2. ACTIVE MEMBER TELEMETRY & QUICK SWITCH CHIPS
     -------------------------------------------------------------------------- */
  function renderMemberOverview() {
    var active = global.BWStore.getActiveMember();
    var sum = global.BWStore.getMemberSummary(active.id);
    var esc = global.BWI18n.escapeHtml;

    /* Member Telemetry Cards */
    var bpVal = document.getElementById('homeKpiBp');
    var bpBadge = document.getElementById('homeKpiBpBadge');
    if (sum.latestBp) {
      var bpCls = global.BWClinical.classifyBP(sum.latestBp.sys, sum.latestBp.dia);
      bpVal.textContent = sum.latestBp.sys + '/' + sum.latestBp.dia + ' mmHg';
      bpBadge.className = 'bw-status-pill ' + bpCls.badgeClass;
      bpBadge.textContent = global.BWI18n.t(bpCls.labelKey, PAGE_DICT);
    } else {
      bpVal.textContent = '—';
      bpBadge.className = 'bw-status-pill bw-status-info';
      bpBadge.textContent = '—';
    }

    var glVal = document.getElementById('homeKpiGlucose');
    var glBadge = document.getElementById('homeKpiGlucoseBadge');
    if (sum.latestGlucose) {
      var glCls = global.BWClinical.classifyGlucose(sum.latestGlucose.valueMgdl, sum.latestGlucose.context);
      glVal.textContent = sum.latestGlucose.valueMgdl + ' mg/dL';
      glBadge.className = 'bw-status-pill ' + glCls.badgeClass;
      glBadge.textContent = global.BWI18n.t(glCls.labelKey, PAGE_DICT);
    } else {
      glVal.textContent = '—';
      glBadge.className = 'bw-status-pill bw-status-info';
      glBadge.textContent = '—';
    }

    var boltEl = document.getElementById('homeKpiBolt');
    boltEl.textContent = sum.latestBolt ? sum.latestBolt.score + 's' : '—';
    document.getElementById('homeKpiMinutes').textContent = sum.totalMinutes + 'm • ' + sum.streak + 'd';

    /* Quick Switcher Chips Row */
    var chipRow = document.getElementById('homeQuickMemberChips');
    var isAuth = global.BWStore.isAuthenticated();
    var members = global.BWStore.getMembers();
    if (!isAuth) {
      chipRow.innerHTML =
        '<button type="button" id="homeChipDemoBtn" class="btn btn-sm btn-bw-outline">' +
        '<i class="bi bi-people-fill"></i> ' + esc(global.BWI18n.t('btnDemoFamily', PAGE_DICT)) +
        '</button>';
      document.getElementById('homeChipDemoBtn').addEventListener('click', function () {
        global.BWStore.loginDemoFamily();
        global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
        renderMemberOverview();
      });
    } else {
      chipRow.innerHTML = members.map(function (m) {
        var isAct = m.id === active.id;
        return (
          '<button type="button" class="bw-quick-member-chip' + (isAct ? ' active' : '') + '" data-home-member="' + esc(m.id) + '" data-home-name="' + esc(m.name) + '">' +
          '  <span class="bw-avatar-circle bw-avatar-color-' + (m.avatarColor || 0) + '">' + esc(m.avatarInitials) + '</span>' +
          '  <span>' + esc(m.name) + '</span>' +
          '  <small class="opacity-75">(' + esc(global.BWNav.relationLabel(m.relation)) + ')</small>' +
          '</button>'
        );
      }).join('');

      Array.prototype.forEach.call(chipRow.querySelectorAll('[data-home-member]'), function (btn) {
        btn.addEventListener('click', function () {
          var mid = btn.getAttribute('data-home-member');
          var mname = btn.getAttribute('data-home-name');
          if (mid === active.id) return;
          global.BWNav.promptPinThen(function () {
            global.BWStore.switchMember(mid);
            global.BWI18n.showToast(global.BWI18n.t('toastMemberSwitched', PAGE_DICT) + ' ' + mname, 'success');
            renderMemberOverview();
          });
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. MINI HERO BREATHING ORB CADENCE LOOP (4-4-4-4)
     -------------------------------------------------------------------------- */
  var orbTimer = null;
  var orbRunning = true;
  var orbTick = 0;

  function updateOrbVisual() {
    var core = document.getElementById('homeHeroOrbCore');
    var cueEl = document.getElementById('homeOrbCue');
    var secEl = document.getElementById('homeOrbSec');
    if (!core || !cueEl || !secEl) return;

    var phaseIdx = Math.floor((orbTick % 16) / 4);
    var secInPhase = 4 - (orbTick % 4);
    secEl.textContent = secInPhase + 's';

    core.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
    if (phaseIdx === 0) {
      core.classList.add('phase-inhale');
      cueEl.textContent = tr('orbCueInhale');
    } else if (phaseIdx === 1 || phaseIdx === 3) {
      core.classList.add('phase-hold');
      cueEl.textContent = tr('orbCueHold');
    } else {
      core.classList.add('phase-exhale');
      cueEl.textContent = tr('orbCueExhale');
    }
  }

  function toggleOrb() {
    orbRunning = !orbRunning;
    var btn = document.getElementById('homeOrbToggleBtn');
    btn.textContent = orbRunning ? tr('orbTogglePause') : tr('orbTogglePlay');
  }

  function startOrbLoop() {
    if (orbTimer) clearInterval(orbTimer);
    updateOrbVisual();
    orbTimer = setInterval(function () {
      if (!orbRunning) return;
      orbTick = (orbTick + 1) % 16;
      updateOrbVisual();
    }, 1000);
  }

  /* --------------------------------------------------------------------------
     4. INIT & CHECKLIST PERSISTENCE PER MEMBER
     -------------------------------------------------------------------------- */
  function initChecklist() {
    var checks = document.querySelectorAll('.bw-sos-chk');
    function syncFromMember() {
      var prefs = global.BWStore.getDomainData('prefs') || {};
      var saved = Array.isArray(prefs.safetyChecks) ? prefs.safetyChecks : [];
      Array.prototype.forEach.call(checks, function (chk, idx) {
        chk.checked = !!saved[idx];
      });
    }
    Array.prototype.forEach.call(checks, function (chk, idx) {
      chk.addEventListener('change', function () {
        var prefs = global.BWStore.getDomainData('prefs') || {};
        prefs.safetyChecks = Array.prototype.map.call(checks, function (c) { return c.checked; });
        global.BWStore.setDomainData('prefs', prefs);
      });
    });
    syncFromMember();
    global.addEventListener('bwMemberChanged', syncFromMember);
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    document.getElementById('homeOrbToggleBtn').addEventListener('click', toggleOrb);
    startOrbLoop();
    renderMemberOverview();
    initChecklist();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      updateOrbVisual();
      document.getElementById('homeOrbToggleBtn').textContent = orbRunning ? tr('orbTogglePause') : tr('orbTogglePlay');
      renderMemberOverview();
    });
    global.addEventListener('bwMemberChanged', renderMemberOverview);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
