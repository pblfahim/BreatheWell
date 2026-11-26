/**
 * @file home.js
 * @description Unified Home Hub Controller for BreatheWell Version 3 (`index.html`):
 *   - 3-Slide 3D Hero Carousel (Mindful Breathing Orb w/ tap-giggle chime,
 *     Live Vitals ECG Console, OCR Prescription Laser Console)
 *   - Quick Multi-Member Switcher Strip & 2x2 Member Telemetry + Systolic Sparkline
 *   - Interactive Bento Live Breathing Coach (4 cadences + Chimes + Web Speech TTS)
 *   - Featured Protocols Grid w/ Goal Filters & Inline L1-L3 Chips
 *   - Interactive Clinical Vitals Sandbox Simulator (Save straight to Active Member!)
 *   - 4-Tab Safety & Emergency SOS Hub w/ Persistent Member Readiness Checklist
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. 3-Slide 3D Hero Carousel & Interactive Buddy Orb
 *   3. Member Quick Switch, Bento Coach & Telemetry Sparkline
 *   4. Featured Exercises Grid & Clinical Sandbox Simulator
 *   5. 4-Tab Safety Hub & Emergency SOS Trigger
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ব্রিদওয়েল v3 | পারিবারিক শ্বাস-প্রশ্বাস ও স্বাস্থ্য হাব',
      s1Badge: '১. মননশীল শ্বাস-প্রশ্বাস স্টুডিও',
      s1Title: 'সচেতন শ্বাস-প্রশ্বাস, শান্ত মন ও সুস্থ হৃদয়',
      s1Desc: 'বক্স, ৪-৬ রিল্যাক্স এবং ডায়াফ্র্যাগমেটিক ছন্দে মানসিক চাপ কমিয়ে অক্সিজেন প্রবাহ বাড়ান।',
      s1Btn: 'ব্যায়াম স্টুডিও শুরু করুন',
      s2Badge: '২. ক্লিনিক্যাল ভাইটালস ও চার্ট',
      s2Title: 'পরিবারের সবার রক্তচাপ ও ডায়াবেটিস এক নজরে',
      s2Desc: 'AHA 2017 ও ADA 2024 মানদণ্ডে তাৎক্ষণিক বিশ্লেষণ, স্পেকট্রাম গজ ও ট্রেন্ড চার্ট।',
      s2Btn: 'স্বাস্থ্য রিডিং যোগ করুন',
      s3Badge: '৩. প্রেসক্রিপশন ভল্ট ও OCR প্যাড',
      s3Title: 'ডিজিটাল প্রেসক্রিপশন স্ক্যান ও A4 প্যাড',
      s3Desc: 'হাতের লেখা বা PDF প্রেসক্রিপশন স্ক্যান করে সদস্যের প্রোফাইলে সুরক্ষিত রাখুন।',
      s3Btn: 'ভল্ট ও প্যাড খুলুন',
      orbTapCue: 'ট্যাপ করুন!',
      quickSwitchLbl: 'দ্রুত সদস্য পরিবর্তন:',
      bentoTitle: 'তাৎক্ষণিক বেনটো শ্বাস কোচ',
      btnBentoTts: 'ভয়েস কোচ (TTS)',
      kpiBpLbl: 'সর্বশেষ রক্তচাপ',
      kpiGlLbl: 'সর্বশেষ গ্লুকোজ',
      kpiBoltLbl: 'সর্বশেষ BOLT',
      kpiMinsLbl: 'মোট শ্বাস ব্যায়াম',
      featuredTitle: 'নির্বাচিত শ্বাস-প্রশ্বাস প্রোটোকলসমূহ',
      fAll: 'সবগুলো',
      fStress: 'চাপমুক্তি',
      fFocus: 'একাগ্রতা',
      fSleep: 'ভালো ঘুম',
      fMindful: 'মননশীলতা',
      sandboxTitle: 'ইন্টারেক্টিভ ক্লিনিক্যাল ভাইটালস সিমুলেটর',
      sandboxSaveBtn: 'সক্রিয় সদস্যের লগে সেভ করুন',
      safetyTitle: 'নিরাপত্তা কেন্দ্র ও জরুরি SOS',
      tabRules: 'মূল নিয়ম',
      tabChecklist: 'প্রস্তুতি পরীক্ষা',
      tabConditions: 'সতর্কতা',
      tabSos: 'জরুরি SOS',
      sosStartResetBtn: '৪-২-৬ জরুরি শান্ত শ্বাস শুরু করুন',
      toastSandboxSaved: 'সিমুলেটর রিডিং সক্রিয় সদস্যের ইতিহাসে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'BreatheWell v3 | Mindful Respiratory & Family Clinical Hub',
      s1Badge: '1. Mindful Breathing Studio',
      s1Title: 'Conscious Breathing, Calm Mind & Resilient Heart',
      s1Desc: 'Regulate nervous balance and boost CO₂ tolerance with Box, 4-6 Relax, and Belly cadence.',
      s1Btn: 'Launch Breathing Studio',
      s2Badge: '2. Clinical Vitals & Trends',
      s2Title: 'Family Blood Pressure & Glucose Telemetry',
      s2Desc: 'Real-time AHA 2017 & ADA 2024 analytics with interactive gauges and safe-zone charts.',
      s2Btn: 'Log Vitals Reading',
      s3Badge: '3. Smart Rx Vault & A4 Pad',
      s3Title: 'Multi-Pass OCR & Digital Prescription Studio',
      s3Desc: 'Scan prescriptions or compose printable A4 sheets kept privately inside your browser.',
      s3Btn: 'Open Rx Vault',
      orbTapCue: 'Tap Me!',
      quickSwitchLbl: 'Quick Member Switch:',
      bentoTitle: 'Pocket Bento Live Coach',
      btnBentoTts: 'Voice Coach (TTS)',
      kpiBpLbl: 'Latest BP',
      kpiGlLbl: 'Latest Glucose',
      kpiBoltLbl: 'Latest BOLT',
      kpiMinsLbl: 'Breathing Practice',
      featuredTitle: 'Featured Evidence-Based Breathing Protocols',
      fAll: 'All',
      fStress: 'Stress',
      fFocus: 'Focus',
      fSleep: 'Sleep',
      fMindful: 'Mindful',
      sandboxTitle: 'Interactive Clinical Vitals Simulator',
      sandboxSaveBtn: 'Save Reading to Active Member',
      safetyTitle: 'Safety Center & Emergency SOS Triage',
      tabRules: 'Core Rules',
      tabChecklist: 'Readiness Check',
      tabConditions: 'Conditions',
      tabSos: 'Emergency SOS',
      sosStartResetBtn: 'Start 4-2-6 Calm Reset Now',
      toastSandboxSaved: 'Reading saved cleanly under active member!'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  /* --------------------------------------------------------------------------
     2. 3-SLIDE 3D HERO CAROUSEL & BUDDY ORB
     -------------------------------------------------------------------------- */
  var slideIdx = 0;
  var slideInterval = null;

  function showSlide(idx) {
    var slides = document.querySelectorAll('.v3-hero-slide');
    var dots = document.querySelectorAll('.v3-slider-dot');
    if (!slides.length) return;
    slideIdx = ((idx % slides.length) + slides.length) % slides.length;
    Array.prototype.forEach.call(slides, function (s, i) { s.classList.toggle('active', i === slideIdx); });
    Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('active', i === slideIdx); });
    var counter = document.getElementById('heroSlideCounter');
    if (counter) counter.textContent = '0' + (slideIdx + 1) + ' / 0' + slides.length;
  }

  function initHeroSlider() {
    var prev = document.getElementById('heroSliderPrev');
    var next = document.getElementById('heroSliderNext');
    if (prev) prev.addEventListener('click', function () { showSlide(slideIdx - 1); });
    if (next) next.addEventListener('click', function () { showSlide(slideIdx + 1); });

    Array.prototype.forEach.call(document.querySelectorAll('.v3-slider-dot'), function (dot, i) {
      dot.addEventListener('click', function () { showSlide(i); });
    });

    slideInterval = setInterval(function () { showSlide(slideIdx + 1); }, 6500);
    var heroEl = document.getElementById('heroSliderSection');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', function () { clearInterval(slideInterval); });
      heroEl.addEventListener('mouseleave', function () {
        clearInterval(slideInterval);
        slideInterval = setInterval(function () { showSlide(slideIdx + 1); }, 6500);
      });
    }

    var orb = document.getElementById('homeBuddyOrb');
    var cueEl = document.getElementById('homeBuddyCue');
    var inhalePhase = true;
    setInterval(function () {
      inhalePhase = !inhalePhase;
      if (!orb || !cueEl) return;
      orb.classList.toggle('inhale', inhalePhase);
      orb.classList.toggle('exhale', !inhalePhase);
      cueEl.textContent = inhalePhase ? 'Inhale 4s' : 'Exhale 4s';
    }, 4000);

    if (orb) {
      orb.addEventListener('click', function () {
        orb.classList.remove('giggle');
        void orb.offsetWidth;
        orb.classList.add('giggle');
        global.BWAudio.playCelebrationChime();
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. BENTO COACH & ACTIVE MEMBER TELEMETRY + SPARKLINE
     -------------------------------------------------------------------------- */
  var bentoCadences = {
    box: [4, 4, 4, 4],
    478: [4, 7, 8, 0],
    deep: [4, 2, 6, 0],
    balance: [4, 4, 4, 0]
  };
  var bentoState = { mode: 'box', running: false, tickSec: 0, cycles: 0, timer: null };

  function stepBento() {
    var pat = bentoCadences[bentoState.mode] || bentoCadences.box;
    var activePhases = [];
    var names = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    pat.forEach(function (d, i) { if (d > 0) activePhases.push({ dur: d, idx: i, name: names[i] }); });
    var total = activePhases.reduce(function (s, p) { return s + p.dur; }, 0);
    var pos = bentoState.tickSec % total;
    var acc = 0, cur = activePhases[0], rem = 1;
    for (var i = 0; i < activePhases.length; i++) {
      if (pos < acc + activePhases[i].dur) {
        cur = activePhases[i];
        rem = activePhases[i].dur - (pos - acc);
        break;
      }
      acc += activePhases[i].dur;
    }

    var orb = document.getElementById('bentoOrb');
    var cueEl = document.getElementById('bentoOrbCue');
    var secEl = document.getElementById('bentoOrbSec');
    if (cueEl) cueEl.textContent = cur.name;
    if (secEl) secEl.textContent = rem + 's';
    if (orb) {
      var scale = cur.idx === 0 ? 1.15 : cur.idx === 1 ? 1.15 : 0.9;
      orb.style.transform = 'scale(' + scale + ')';
    }

    if (pos === 0 && bentoState.tickSec > 0) {
      bentoState.cycles++;
      document.getElementById('bentoCycles').textContent = String(bentoState.cycles);
    }
    if (document.getElementById('bentoChimeChk').checked && pos === acc) {
      if (cur.idx === 0) global.BWAudio.playTone(528, 792, 0.3, 0.08);
      else if (cur.idx === 2) global.BWAudio.playTone(396, 594, 0.3, 0.08);
    }
    if (document.getElementById('bentoTtsChk').checked && pos === acc && global.speechSynthesis && typeof global.SpeechSynthesisUtterance === 'function') {
      try {
        global.speechSynthesis.cancel();
        global.speechSynthesis.speak(new global.SpeechSynthesisUtterance(cur.name));
      } catch (e) { /* Ignore */ }
    }
  }

  function renderTelemetry() {
    var active = global.BWStore.getActiveMember();
    var sum = global.BWStore.getMemberSummary(active.id);
    var vitals = global.BWStore.getDomainData('vitals', active.id) || { bp: [], glucose: [] };
    var esc = global.BWI18n.escapeHtml;

    /* Hero slide 2 console values */
    document.getElementById('heroSlideBp').textContent = sum.latestBp ? (sum.latestBp.sys + '/' + sum.latestBp.dia + ' mmHg') : '120/80 mmHg';
    document.getElementById('heroSlideGl').textContent = sum.latestGlucose ? (global.BWClinical.mgdlToMmol(sum.latestGlucose.valueMgdl) + ' mmol/L') : '5.3 mmol/L';
    document.getElementById('heroSlideHr').textContent = sum.latestBp && sum.latestBp.pulse ? (sum.latestBp.pulse + ' BPM') : '72 BPM';

    /* Bento 2x2 KPIs */
    document.getElementById('homeKpiBp').textContent = sum.latestBp ? (sum.latestBp.sys + '/' + sum.latestBp.dia) : '—';
    document.getElementById('homeKpiGl').textContent = sum.latestGlucose ? (sum.latestGlucose.valueMgdl + ' mg/dL') : '—';
    document.getElementById('homeKpiBolt').textContent = sum.latestBolt ? (sum.latestBolt.score + 's') : '—';
    document.getElementById('homeKpiMins').textContent = sum.totalMinutes + 'm • ' + sum.streak + 'd';

    /* Sparkline */
    var sysSeries = (vitals.bp || []).slice(0, 10).reverse().map(function (b) { return Number(b.sys); });
    global.BWClinical.renderSparkline(document.getElementById('homeBpSparkline'), sysSeries, '#ef4444');

    /* Quick Member Chips */
    var chipRow = document.getElementById('homeQuickMemberChips');
    var isAuth = global.BWStore.isAuthenticated();
    var members = global.BWStore.getMembers();
    if (!isAuth) {
      chipRow.innerHTML =
        '<button type="button" id="homeChipDemoBtn" class="btn btn-sm btn-bw-emerald"><i class="bi bi-people-fill"></i> ' + esc(global.BWI18n.t('btnDemoFamily', PAGE_DICT)) + '</button>';
      document.getElementById('homeChipDemoBtn').addEventListener('click', function () {
        global.BWStore.loginDemoFamily();
        global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
        renderTelemetry();
      });
    } else {
      chipRow.innerHTML = members.map(function (m) {
        var act = m.id === active.id;
        return (
          '<button type="button" class="v3-quick-member-chip' + (act ? ' active' : '') + '" data-home-mid="' + esc(m.id) + '" data-home-mname="' + esc(m.name) + '">' +
          '  <span class="bw-avatar-circle bw-avatar-color-' + (m.avatarColor || 0) + '">' + esc(m.avatarInitials) + '</span>' +
          '  <span>' + esc(m.name) + '</span>' +
          '  <small class="opacity-75">(' + esc(global.BWNav.relationLabel(m.relation)) + ')</small>' +
          '</button>'
        );
      }).join('');
      Array.prototype.forEach.call(chipRow.querySelectorAll('[data-home-mid]'), function (btn) {
        btn.addEventListener('click', function () {
          var mid = btn.getAttribute('data-home-mid'), mname = btn.getAttribute('data-home-mname');
          if (mid === active.id) return;
          global.BWNav.promptPinThen(function () {
            global.BWStore.switchMember(mid);
            global.BWI18n.showToast(global.BWI18n.t('toastMemberSwitched', PAGE_DICT) + ' ' + mname, 'success');
            renderTelemetry();
          });
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. FEATURED EXERCISES & CLINICAL SANDBOX SIMULATOR
     -------------------------------------------------------------------------- */
  var PROTOCOLS = [
    { id: 'relax46', goal: 'stress', img: 'asset/image/relaxing.svg', titleBn: '৪-৬ রিল্যাক্স শ্বাস', titleEn: '4-6 Relax Breathing', descBn: 'দ্রুত স্ট্রেস ও কর্টিসল কমাতে সহজ শ্বাস', descEn: 'Lower acute tension with longer exhale pacing', levels: { 1: '3-5s', 2: '4-6s', 3: '5-8s' } },
    { id: 'box', goal: 'focus', img: 'asset/image/box-breathing.svg', titleBn: 'বক্স ব্রিদিং', titleEn: 'Box Breathing', descBn: 'মনোযোগ ও মানসিক স্থিরতা বাড়ায়', descEn: 'Balanced 4-phase rhythm for cognitive clarity', levels: { 1: '3-3-3-3s', 2: '4-4-4-4s', 3: '5-5-5-5s' } },
    { id: 'diaphragmatic', goal: 'sleep', img: 'asset/image/diaphragmatic.svg', titleBn: 'ডায়াফ্র্যাগমেটিক', titleEn: 'Belly Breathing', descBn: 'গভীর ঘুম ও ভ্যাগাস নার্ভ সক্রিয় করে', descEn: 'Deep diaphragmatic rhythm for vagal rest', levels: { 1: '3-4s', 2: '4-5s', 3: '5-7s' } },
    { id: 'mindful', goal: 'mindful', img: 'asset/image/mindful.svg', titleBn: 'মননশীল ছন্দ', titleEn: 'Mindful Coherence', descBn: 'স্বাভাবিক ছন্দে মনোযোগ স্থির রাখার অনুশীলন', descEn: 'Calm nasal awareness for sustained focus', levels: { 1: '4s', 2: '5s', 3: '6s' } }
  ];
  var activeGoalFilter = 'all';
  var cardLevels = { relax46: 2, box: 2, diaphragmatic: 1, mindful: 1 };

  function renderFeaturedCards() {
    var lang = global.BWI18n.getLang();
    var esc = global.BWI18n.escapeHtml;
    var container = document.getElementById('homeFeaturedGrid');
    var list = PROTOCOLS.filter(function (p) { return activeGoalFilter === 'all' || p.goal === activeGoalFilter; });

    container.innerHTML = list.map(function (p) {
      var lv = cardLevels[p.id] || 1;
      return (
        '<div class="col-md-6 col-xl-3"><article class="bw-card p-3 h-100 d-flex flex-column justify-content-between">' +
        '  <div>' +
        '    <div class="d-flex align-items-center justify-content-between mb-2"><img src="' + p.img + '" alt="" width="44" height="44"><span class="badge bg-primary-subtle text-primary rounded-pill text-uppercase">' + esc(p.goal) + '</span></div>' +
        '    <h3 class="h6 fw-bold mb-1">' + esc(lang === 'bn' ? p.titleBn : p.titleEn) + '</h3>' +
        '    <p class="small text-muted mb-3">' + esc(lang === 'bn' ? p.descBn : p.descEn) + '</p>' +
        '    <div class="d-flex gap-1 mb-3">' +
        [1, 2, 3].map(function (n) {
          return '<button type="button" class="v3-level-chip flex-fill' + (lv === n ? ' active' : '') + '" data-card-ex="' + p.id + '" data-card-lv="' + n + '">L' + n + ' (' + p.levels[n] + ')</button>';
        }).join('') +
        '    </div>' +
        '  </div>' +
        '  <a href="exercises.html?exercise=' + p.id + '&level=' + lv + '&action=start" class="btn btn-bw-primary btn-sm w-100"><i class="bi bi-play-fill"></i> Start L' + lv + '</a>' +
        '</article></div>'
      );
    }).join('');

    Array.prototype.forEach.call(container.querySelectorAll('[data-card-ex]'), function (btn) {
      btn.addEventListener('click', function () {
        cardLevels[btn.getAttribute('data-card-ex')] = Number(btn.getAttribute('data-card-lv'));
        renderFeaturedCards();
      });
    });
  }

  /* Interactive Vitals Sandbox */
  var simMode = 'bp';
  function updateSandboxUI() {
    var isBp = simMode === 'bp';
    document.getElementById('simBpControls').classList.toggle('d-none', !isBp);
    document.getElementById('simBgControls').classList.toggle('d-none', isBp);

    var badge = document.getElementById('simStatusBadge');
    var pin = document.getElementById('simSpectrumPin');
    if (isBp) {
      var sys = Number(document.getElementById('simSysSlider').value);
      var dia = Number(document.getElementById('simDiaSlider').value);
      document.getElementById('simReadoutVal').textContent = sys + '/' + dia + ' mmHg';
      var cls = global.BWClinical.classifyBP(sys, dia);
      badge.className = 'bw-status-pill ' + cls.badgeClass;
      badge.textContent = global.BWI18n.t(cls.labelKey, PAGE_DICT);
      pin.style.left = cls.percent + '%';
    } else {
      var mmol = Number(document.getElementById('simBgSlider').value);
      var mgdl = global.BWClinical.mmolToMgdl(mmol);
      var ctx = document.getElementById('simBgContext').value;
      document.getElementById('simReadoutVal').textContent = mmol.toFixed(1) + ' mmol/L (' + mgdl + ' mg/dL)';
      var gCls = global.BWClinical.classifyGlucose(mgdl, ctx);
      badge.className = 'bw-status-pill ' + gCls.badgeClass;
      badge.textContent = global.BWI18n.t(gCls.labelKey, PAGE_DICT);
      pin.style.left = gCls.percent + '%';
    }
  }

  function saveSandboxReading() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    if (simMode === 'bp') {
      vitals.bp = vitals.bp || [];
      vitals.bp.unshift({
        id: 'bp_' + Date.now().toString(36),
        sys: Number(document.getElementById('simSysSlider').value),
        dia: Number(document.getElementById('simDiaSlider').value),
        pulse: 72,
        arm: 'left',
        note: 'Home Sandbox Entry',
        ts: new Date().toISOString()
      });
    } else {
      vitals.glucose = vitals.glucose || [];
      vitals.glucose.unshift({
        id: 'gl_' + Date.now().toString(36),
        valueMgdl: global.BWClinical.mmolToMgdl(Number(document.getElementById('simBgSlider').value)),
        context: document.getElementById('simBgContext').value,
        note: 'Home Sandbox Entry',
        ts: new Date().toISOString()
      });
    }
    global.BWStore.setDomainData('vitals', vitals);
    global.BWI18n.showToast(tr('toastSandboxSaved'), 'success');
    renderTelemetry();
  }

  /* --------------------------------------------------------------------------
     5. SAFETY CHECKLIST & EMERGENCY RESET
     -------------------------------------------------------------------------- */
  function initSafetyChecklist() {
    var checks = document.querySelectorAll('.v3-safety-chk');
    var bar = document.getElementById('safetyCheckProgressBar');

    function syncProgress() {
      var done = Array.prototype.filter.call(checks, function (c) { return c.checked; }).length;
      if (bar) bar.style.width = Math.round((done / checks.length) * 100) + '%';
    }
    function loadFromMember() {
      var prefs = global.BWStore.getDomainData('prefs') || {};
      var saved = Array.isArray(prefs.safetyChecks) ? prefs.safetyChecks : [];
      Array.prototype.forEach.call(checks, function (c, idx) { c.checked = !!saved[idx]; });
      syncProgress();
    }
    Array.prototype.forEach.call(checks, function (c) {
      c.addEventListener('change', function () {
        var prefs = global.BWStore.getDomainData('prefs') || {};
        prefs.safetyChecks = Array.prototype.map.call(checks, function (x) { return x.checked; });
        global.BWStore.setDomainData('prefs', prefs);
        syncProgress();
      });
    });
    loadFromMember();
    global.addEventListener('bwMemberChanged', loadFromMember);
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    initHeroSlider();
    renderTelemetry();
    renderFeaturedCards();
    updateSandboxUI();
    initSafetyChecklist();

    /* Bento Coach bindings */
    Array.prototype.forEach.call(document.querySelectorAll('[data-bento-mode]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bento-mode]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        bentoState.mode = btn.getAttribute('data-bento-mode');
        bentoState.tickSec = 0;
        stepBento();
      });
    });
    document.getElementById('bentoToggleBtn').addEventListener('click', function () {
      bentoState.running = !bentoState.running;
      var btn = document.getElementById('bentoToggleBtn');
      btn.innerHTML = bentoState.running ? '<i class="bi bi-pause-fill"></i> Pause' : '<i class="bi bi-play-fill"></i> Start';
      if (bentoState.running) {
        global.BWAudio.ensureAudioCtx();
        stepBento();
        bentoState.timer = setInterval(function () { bentoState.tickSec++; stepBento(); }, 1000);
      } else {
        clearInterval(bentoState.timer);
      }
    });

    /* Goal filters */
    Array.prototype.forEach.call(document.querySelectorAll('[data-home-goal]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-home-goal]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeGoalFilter = btn.getAttribute('data-home-goal');
        renderFeaturedCards();
      });
    });

    /* Sandbox bindings */
    Array.prototype.forEach.call(document.querySelectorAll('[data-sim-mode]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-sim-mode]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        simMode = btn.getAttribute('data-sim-mode');
        updateSandboxUI();
      });
    });
    ['simSysSlider', 'simDiaSlider', 'simBgSlider', 'simBgContext'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', updateSandboxUI);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-sim-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var vals = btn.getAttribute('data-sim-preset').split(',');
        if (simMode === 'bp') {
          document.getElementById('simSysSlider').value = vals[0];
          document.getElementById('simDiaSlider').value = vals[1];
        } else {
          document.getElementById('simBgSlider').value = vals[0];
        }
        updateSandboxUI();
      });
    });
    document.getElementById('simSaveMemberBtn').addEventListener('click', saveSandboxReading);

    /* Emergency SOS 4-2-6 trigger */
    document.getElementById('homeEmergencySosBtn').addEventListener('click', function () {
      bentoState.mode = 'deep';
      bentoState.tickSec = 0;
      if (!bentoState.running) document.getElementById('bentoToggleBtn').click();
      document.getElementById('bentoCoachCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderTelemetry();
      renderFeaturedCards();
      updateSandboxUI();
    });
    global.addEventListener('bwMemberChanged', renderTelemetry);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
