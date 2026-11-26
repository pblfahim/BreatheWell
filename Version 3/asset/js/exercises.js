/**
 * @file exercises.js
 * @description Breathing Sanctuary Studio Controller (`exercises.html`):
 *   Merges Version 1's 4-screen flow (`#exLibraryScreen`, `#exDetailScreen`,
 *   `#exSessionScreen`, `#exCompleteScreen`), `#detailWaveformSvg` lung-volume tracer,
 *   Lotus halo, Soundscapes (`chimes`/`rain`/`drone`/`off`), Web Speech TTS,
 *   Keyboard shortcuts (`Space`/`Escape`), `#confettiCanvas`, Interactive Champion Trophy,
 *   Mood post-check & Social Share with Version 2's Member-Scoped persistence.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`) & Protocol Catalog (`relax46`, `box`, `diaphragmatic`, `mindful`)
 *   2. 4-Screen Navigation & Deep Linking (`?exercise=...&level=...&action=start`)
 *   3. Detail Screen Lung Volume Waveform SVG & Motion Tracer
 *   4. Procedural Soundscapes (`chimes`, pink-noise `rain`, warm `drone`) & TTS Coach
 *   5. 60fps `requestAnimationFrame` Lotus Engine & Visibility Auto-Pause
 *   6. Physics Confetti Canvas, Champion Trophy, Mood Check & Member Session Save
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'শ্বাস-প্রশ্বাস ব্যায়াম স্টুডিও | ব্রিদওয়েল v3',
      heroTitle: 'সচেতন শ্বাস-প্রশ্বাস ও মননশীল স্টুডিও',
      heroSub: 'লাইভ লোটাস গাইড, সাউন্ডস্কেপ এবং সক্রিয় পরিবারের সদস্যের জন্য স্বয়ংক্রিয় অগ্রগতি ট্র্যাকিং।',
      btnBackLibrary: 'লাইব্রেরিতে ফিরুন',
      btnStartSession: 'সেশন শুরু করুন',
      btnPause: 'বিরতি',
      btnResume: 'চালিয়ে যান',
      btnExit: 'সমাপ্ত করুন',
      cuePrep: 'প্রস্তুত হোন',
      cueInhale: 'গভীর শ্বাস নিন',
      cueHold: 'শ্বাস ধরে রাখুন',
      cueExhale: 'ধীরে শ্বাস ছাড়ুন',
      cueRest: 'শান্তভাবে বিশ্রাম',
      completeTitle: 'অভিনন্দন! সেশন সম্পন্ন হয়েছে',
      completeSub: 'কাপে ট্যাপ করে সেলিব্রেশন দেখুন, মুড নির্বাচন করুন এবং সদস্যের প্রোফাইলে সংরক্ষণ করুন।',
      btnSaveMoodSession: 'সক্রিয় সদস্যে সেভ করুন',
      btnGoBolt: 'এখন BOLT টেস্ট দিন',
      recentTitle: 'সক্রিয় সদস্যের সাম্প্রতিক সেশনসমূহ',
      toastSaved: 'সেশন সক্রিয় সদস্যের ইতিহাসে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Guided Breathing Studio | BreatheWell v3',
      heroTitle: 'Mindful Breathing Sanctuary Studio',
      heroSub: 'Immersive 4-stage mandala pacing, procedural soundscapes & isolated per-member session history.',
      btnBackLibrary: 'Back to Library',
      btnStartSession: 'Start Guided Session',
      btnPause: 'Pause',
      btnResume: 'Resume',
      btnExit: 'Finish Session',
      cuePrep: 'Settle In',
      cueInhale: 'Inhale Gently',
      cueHold: 'Hold Softly',
      cueExhale: 'Exhale Slowly',
      cueRest: 'Calm Pause',
      completeTitle: 'Session Complete — Well Done!',
      completeSub: 'Tap the Champion Trophy to celebrate, pick how you feel, and save to the active family member.',
      btnSaveMoodSession: 'Save to Active Member',
      btnGoBolt: 'Measure BOLT Score Next',
      recentTitle: 'Active Member Recent Sessions',
      toastSaved: 'Breathing session saved under active member!'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var CATALOG = {
    relax46: {
      id: 'relax46', goal: 'stress', img: 'asset/image/relaxing.svg',
      titleBn: '৪-৬ রিল্যাক্স শ্বাস', titleEn: '4-6 Calm Relax',
      descBn: 'দীর্ঘ শ্বাস ত্যাগের মাধ্যমে দ্রুত চাপ কমানো ও নার্ভ শান্ত করা।', descEn: 'Extend exhales to rapidly engage parasympathetic rest.',
      levels: { 1: [3, 0, 5, 0], 2: [4, 0, 6, 0], 3: [5, 0, 8, 0] }
    },
    box: {
      id: 'box', goal: 'focus', img: 'asset/image/box-breathing.svg',
      titleBn: 'বক্স ব্রিদিং (৪-৪-৪-৪)', titleEn: 'Box Breathing (4-4-4-4)',
      descBn: 'সমান চারটি ধাপে একাগ্রতা ও হৃদ-স্পন্দনের ছন্দ স্থির রাখা।', descEn: 'Balanced 4-phase square pacing for clarity under pressure.',
      levels: { 1: [3, 3, 3, 3], 2: [4, 4, 4, 4], 3: [5, 5, 5, 5] }
    },
    diaphragmatic: {
      id: 'diaphragmatic', goal: 'sleep', img: 'asset/image/diaphragmatic.svg',
      titleBn: 'ডায়াফ্র্যাগমেটিক বেলি ব্রেথ', titleEn: 'Diaphragmatic Pacing',
      descBn: 'গভীর পেটের শ্বাসে ফুসফুসের পূর্ণ ব্যবহার এবং আরামদায়ক ঘুম।', descEn: 'Slow belly expansion ideal for pre-sleep recovery.',
      levels: { 1: [3, 0, 4, 0], 2: [4, 0, 5, 0], 3: [5, 0, 7, 0] }
    },
    mindful: {
      id: 'mindful', goal: 'mindful', img: 'asset/image/mindful.svg',
      titleBn: 'মননশীল ছন্দ', titleEn: 'Mindful Coherence',
      descBn: 'নাক দিয়ে মৃদু ও স্বাভাবিক ছন্দে দীর্ঘ মনোযোগ অনুশীলন।', descEn: 'Effortless coherent nasal flow for sustained calm.',
      levels: { 1: [4, 0, 4, 0], 2: [5, 0, 5, 0], 3: [6, 0, 6, 0] }
    }
  };

  var state = {
    screen: 'exLibraryScreen',
    goalFilter: 'all',
    selectedEx: 'relax46',
    selectedLevel: 2,
    durationMin: 2,
    soundscape: 'chimes',
    ttsEnabled: false,
    running: false,
    paused: false,
    elapsedMs: 0,
    lastFrameTs: 0,
    rafId: null,
    cycles: 0,
    lastPhaseIdx: -1,
    mood: 'calm',
    ambientNode: null
  };

  /* --------------------------------------------------------------------------
     2. SCREEN SWITCHING & LIBRARY RENDERER
     -------------------------------------------------------------------------- */
  function showScreen(screenId) {
    state.screen = screenId;
    Array.prototype.forEach.call(document.querySelectorAll('.ex-screen'), function (s) {
      s.classList.toggle('active', s.id === screenId);
    });
    if (screenId === 'exDetailScreen') renderDetailView();
    if (screenId === 'exLibraryScreen') renderSessionHistory();
  }

  function renderLibraryCards() {
    var lang = global.BWI18n.getLang();
    var esc = global.BWI18n.escapeHtml;
    var grid = document.getElementById('exLibraryCards');
    var list = Object.keys(CATALOG).map(function (k) { return CATALOG[k]; }).filter(function (c) {
      return state.goalFilter === 'all' || c.goal === state.goalFilter;
    });

    grid.innerHTML = list.map(function (item) {
      return (
        '<div class="col-md-6">' +
        '  <article class="ex-protocol-card">' +
        '    <div>' +
        '      <div class="ex-art-box">' +
        '        <img src="' + item.img + '" alt="" width="56" height="56">' +
        '        <span class="badge bg-primary-subtle text-primary rounded-pill text-uppercase">' + esc(item.goal) + '</span>' +
        '      </div>' +
        '      <h2 class="h5 fw-bold mb-1">' + esc(lang === 'bn' ? item.titleBn : item.titleEn) + '</h2>' +
        '      <p class="small text-muted mb-3">' + esc(lang === 'bn' ? item.descBn : item.descEn) + '</p>' +
        '    </div>' +
        '    <div>' +
        '      <div class="d-flex flex-wrap gap-2 mb-3">' +
        [1, 2, 3].map(function (n) {
          var pat = item.levels[n].filter(function (v) { return v > 0; }).join('-');
          return '<button type="button" class="ex-level-pill flex-fill" data-quick-ex="' + item.id + '" data-quick-lv="' + n + '">L' + n + ' (' + pat + 's)</button>';
        }).join('') +
        '      </div>' +
        '      <button type="button" class="btn btn-bw-outline w-100" data-open-detail="' + item.id + '"><i class="bi bi-sliders"></i> Configure & Preview</button>' +
        '    </div>' +
        '  </article>' +
        '</div>'
      );
    }).join('');

    Array.prototype.forEach.call(grid.querySelectorAll('[data-open-detail]'), function (btn) {
      btn.addEventListener('click', function () {
        state.selectedEx = btn.getAttribute('data-open-detail');
        showScreen('exDetailScreen');
      });
    });

    Array.prototype.forEach.call(grid.querySelectorAll('[data-quick-ex]'), function (btn) {
      btn.addEventListener('click', function () {
        state.selectedEx = btn.getAttribute('data-quick-ex');
        state.selectedLevel = Number(btn.getAttribute('data-quick-lv')) || 2;
        startGuidedSession();
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. DETAIL WAVEFORM SVG & TRACER
     -------------------------------------------------------------------------- */
  function getPhases() {
    var proto = CATALOG[state.selectedEx] || CATALOG.box;
    var pat = proto.levels[state.selectedLevel] || proto.levels[2];
    var names = [tr('cueInhale'), tr('cueHold'), tr('cueExhale'), tr('cueRest')];
    var list = [];
    pat.forEach(function (sec, idx) {
      if (sec > 0) list.push({ idx: idx, dur: sec, label: names[idx] });
    });
    return list;
  }

  function renderDetailView() {
    var lang = global.BWI18n.getLang();
    var item = CATALOG[state.selectedEx] || CATALOG.box;
    document.getElementById('detailExTitle').textContent = lang === 'bn' ? item.titleBn : item.titleEn;
    document.getElementById('detailExDesc').textContent = lang === 'bn' ? item.descBn : item.descEn;

    var phases = getPhases();
    document.getElementById('detailPatternTxt').textContent = phases.map(function (p) { return p.label + ' ' + p.dur + 's'; }).join(' → ');

    Array.prototype.forEach.call(document.querySelectorAll('[data-detail-lv]'), function (btn) {
      btn.classList.toggle('active', Number(btn.getAttribute('data-detail-lv')) === state.selectedLevel);
    });

    /* Build lung volume SVG curve */
    var svg = document.getElementById('detailWaveformSvg');
    var total = phases.reduce(function (s, p) { return s + p.dur; }, 0);
    var W = 420, H = 90, x = 14, y = H - 16;
    var pts = [x + ',' + y];
    phases.forEach(function (p) {
      x += (p.dur / total) * (W - 28);
      if (p.idx === 0) y = 16;
      else if (p.idx === 2) y = H - 16;
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    });
    svg.innerHTML =
      '<polyline fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" points="' + pts.join(' ') + '" />' +
      '<circle id="detailTracerDot" cx="14" cy="' + (H - 16) + '" r="6" fill="#6ee7b7" />';
  }

  /* --------------------------------------------------------------------------
     4. SOUNDSCAPES (CHIMES / RAIN / DRONE) & SESSION ENGINE
     -------------------------------------------------------------------------- */
  function stopAmbientSoundscape() {
    if (state.ambientNode) {
      try { state.ambientNode.stop(); } catch (e) { /* Ignore */ }
      try { state.ambientNode.disconnect(); } catch (e2) { /* Ignore */ }
      state.ambientNode = null;
    }
  }

  function startAmbientSoundscape() {
    stopAmbientSoundscape();
    if (state.soundscape === 'off') return;
    var ctx = global.BWAudio.ensureAudioCtx();
    if (!ctx) return;
    try {
      if (state.soundscape === 'rain') {
        var bufSize = ctx.sampleRate * 2;
        var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        var ch = buf.getChannelData(0);
        var lastOut = 0;
        for (var i = 0; i < bufSize; i++) {
          var white = Math.random() * 2 - 1;
          ch[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = ch[i];
        }
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 680;
        var gain = ctx.createGain();
        gain.gain.value = 0.14;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start();
        state.ambientNode = src;
      } else if (state.soundscape === 'drone') {
        var osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 216;
        var g2 = ctx.createGain();
        g2.gain.value = 0.03;
        osc.connect(g2);
        g2.connect(ctx.destination);
        osc.start();
        state.ambientNode = osc;
      }
    } catch (e) { /* Ignore audio policy errors */ }
  }

  function sessionFrame(ts) {
    if (!state.running || state.paused) return;
    if (!state.lastFrameTs) state.lastFrameTs = ts;
    state.elapsedMs += ts - state.lastFrameTs;
    state.lastFrameTs = ts;

    var totalTargetMs = state.durationMin * 60 * 1000;
    if (state.elapsedMs >= totalTargetMs) {
      finishGuidedSession();
      return;
    }

    var phases = getPhases();
    var cycleSec = phases.reduce(function (s, p) { return s + p.dur; }, 0);
    var elapsedSec = state.elapsedMs / 1000;
    var cyc = Math.floor(elapsedSec / cycleSec);
    if (cyc !== state.cycles) {
      state.cycles = cyc;
      document.getElementById('sessionCycleStat').textContent = String(state.cycles);
    }

    var into = elapsedSec % cycleSec;
    var acc = 0, active = phases[0], pElapsed = 0;
    for (var i = 0; i < phases.length; i++) {
      if (into < acc + phases[i].dur) {
        active = phases[i];
        pElapsed = into - acc;
        break;
      }
      acc += phases[i].dur;
    }

    if (state.lastPhaseIdx !== active.idx) {
      state.lastPhaseIdx = active.idx;
      if (state.soundscape !== 'off') {
        if (active.idx === 0) global.BWAudio.playTone(528, 792, 0.35, 0.09);
        else if (active.idx === 2) global.BWAudio.playTone(396, 594, 0.35, 0.09);
        else global.BWAudio.playTone(440, 440, 0.18, 0.06);
      }
      if (state.ttsEnabled && global.speechSynthesis && typeof global.SpeechSynthesisUtterance === 'function') {
        try {
          global.speechSynthesis.cancel();
          global.speechSynthesis.speak(new global.SpeechSynthesisUtterance(active.label));
        } catch (e) { /* Ignore */ }
      }
    }

    var pNorm = Math.min(1, pElapsed / active.dur);
    var scale = active.idx === 0 ? (0.85 + 0.35 * pNorm) : active.idx === 1 ? 1.2 : active.idx === 2 ? (1.2 - 0.35 * pNorm) : 0.85;
    document.getElementById('sessionBreathCore').style.transform = 'scale(' + scale.toFixed(3) + ')';
    document.getElementById('sessionLotusHalo').style.transform = 'scale(' + (scale * 1.1).toFixed(3) + ') rotate(' + (pNorm * 35).toFixed(1) + 'deg)';
    document.getElementById('sessionCueText').textContent = active.label;
    document.getElementById('sessionPhaseSec').textContent = Math.max(1, Math.ceil(active.dur - pElapsed)) + 's';

    var rem = Math.max(0, Math.ceil((totalTargetMs - state.elapsedMs) / 1000));
    document.getElementById('sessionRemStat').textContent = Math.floor(rem / 60) + ':' + ('0' + (rem % 60)).slice(-2);

    var ring = document.getElementById('sessionRingCircle');
    var circum = 2 * Math.PI * 124;
    ring.style.strokeDasharray = circum.toFixed(1);
    ring.style.strokeDashoffset = (circum * (1 - state.elapsedMs / totalTargetMs)).toFixed(1);

    state.rafId = global.requestAnimationFrame(sessionFrame);
  }

  function startGuidedSession() {
    showScreen('exSessionScreen');
    state.running = true;
    state.paused = false;
    state.elapsedMs = 0;
    state.cycles = 0;
    state.lastPhaseIdx = -1;
    state.lastFrameTs = 0;
    document.getElementById('sessionCycleStat').textContent = '0';
    document.getElementById('sessionPauseBtn').textContent = tr('btnPause');
    startAmbientSoundscape();
    state.rafId = global.requestAnimationFrame(sessionFrame);
  }

  function finishGuidedSession() {
    state.running = false;
    state.paused = false;
    if (state.rafId) global.cancelAnimationFrame(state.rafId);
    stopAmbientSoundscape();
    showScreen('exCompleteScreen');
    global.BWAudio.playCelebrationChime();
    launchConfetti();
  }

  /* --------------------------------------------------------------------------
     5. CONFETTI CANVAS, MOOD SAVE & HISTORY
     -------------------------------------------------------------------------- */
  function launchConfetti() {
    var canvas = document.getElementById('exConfettiCanvas');
    if (!canvas || !canvas.getContext) return;
    canvas.width = global.innerWidth || 800;
    canvas.height = global.innerHeight || 600;
    canvas.classList.remove('d-none');
    var ctx = canvas.getContext('2d');
    var colors = ['#10b981', '#2e9be5', '#f59e0b', '#ec4899', '#8b5cf6'];
    var parts = [];
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 5,
        vy: 3 + Math.random() * 4,
        size: 5 + Math.random() * 6,
        c: colors[i % colors.length]
      });
    }
    var frames = 0;
    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.7);
      });
      frames++;
      if (frames < 110) global.requestAnimationFrame(step);
      else canvas.classList.add('d-none');
    }
    global.requestAnimationFrame(step);
  }

  function renderSessionHistory() {
    var exData = global.BWStore.getDomainData('exercises') || { sessions: [], streak: 0, totalSeconds: 0 };
    document.getElementById('exLibStreakStat').textContent = (exData.streak || 0) + 'd';
    document.getElementById('exLibMinsStat').textContent = Math.round((exData.totalSeconds || 0) / 60) + 'm';

    var tbody = document.getElementById('exHistoryBody');
    var esc = global.BWI18n.escapeHtml;
    var sessions = exData.sessions || [];
    if (!sessions.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</td></tr>';
      return;
    }
    tbody.innerHTML = sessions.slice(0, 12).map(function (s) {
      return '<tr><td>' + esc(global.BWI18n.fmtDate(s.ts, true)) + '</td><td class="fw-semibold text-uppercase">' + esc(s.protocol) + ' L' + esc(s.level || 1) + '</td><td class="tabular-nums">' + Math.round((s.durationSec || 0) / 60) + 'm</td><td class="tabular-nums">' + esc(s.cycles || 0) + '</td><td><span class="bw-status-pill bw-status-normal">' + esc(s.mood || 'calm') + '</span></td></tr>';
    }).join('');
  }

  function saveCompletedSession() {
    var exData = global.BWStore.getDomainData('exercises') || { sessions: [], streak: 0, lastDate: null, totalSeconds: 0, level: 1 };
    var today = new Date().toISOString().slice(0, 10);
    if (exData.lastDate !== today) {
      exData.streak = (exData.streak || 0) + 1;
      exData.lastDate = today;
    }
    var durSec = Math.max(30, Math.round(state.elapsedMs / 1000) || (state.durationMin * 60));
    exData.totalSeconds = (exData.totalSeconds || 0) + durSec;
    exData.sessions.unshift({
      id: 'ex_' + Date.now().toString(36),
      protocol: state.selectedEx,
      level: state.selectedLevel,
      durationSec: durSec,
      cycles: Math.max(1, state.cycles),
      mood: state.mood,
      ts: new Date().toISOString()
    });
    global.BWStore.setDomainData('exercises', exData);
    global.BWI18n.showToast(tr('toastSaved'), 'success');
    showScreen('exLibraryScreen');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    /* Load active member defaults */
    var prefs = global.BWStore.getDomainData('prefs') || {};
    state.soundscape = prefs.soundscape || 'chimes';
    state.ttsEnabled = !!prefs.voiceEnabled;
    document.getElementById('detailTtsChk').checked = state.ttsEnabled;

    Array.prototype.forEach.call(document.querySelectorAll('[data-ex-goal]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ex-goal]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.goalFilter = btn.getAttribute('data-ex-goal');
        renderLibraryCards();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-soundscape]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-soundscape]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.soundscape = btn.getAttribute('data-soundscape');
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-detail-lv]'), function (btn) {
      btn.addEventListener('click', function () {
        state.selectedLevel = Number(btn.getAttribute('data-detail-lv'));
        renderDetailView();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-detail-dur]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-detail-dur]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.durationMin = Number(btn.getAttribute('data-detail-dur'));
      });
    });

    document.getElementById('detailTtsChk').addEventListener('change', function (e) { state.ttsEnabled = e.target.checked; });
    document.getElementById('detailStartBtn').addEventListener('click', startGuidedSession);
    document.getElementById('detailBackBtn').addEventListener('click', function () { showScreen('exLibraryScreen'); });

    document.getElementById('sessionPauseBtn').addEventListener('click', function () {
      state.paused = !state.paused;
      state.lastFrameTs = 0;
      document.getElementById('sessionPauseBtn').textContent = state.paused ? tr('btnResume') : tr('btnPause');
      if (!state.paused) state.rafId = global.requestAnimationFrame(sessionFrame);
    });
    document.getElementById('sessionFinishBtn').addEventListener('click', finishGuidedSession);

    document.getElementById('completeTrophyBtn').addEventListener('click', function () {
      global.BWAudio.playCelebrationChime();
      launchConfetti();
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mood]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-mood]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.mood = btn.getAttribute('data-mood');
      });
    });
    document.getElementById('completeSaveBtn').addEventListener('click', saveCompletedSession);
    document.getElementById('completeShareWaBtn').addEventListener('click', function () {
      var msg = 'Completed a mindful ' + state.selectedEx + ' breathing session on BreatheWell v3!';
      global.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
    });

    /* Keyboard shortcuts during active session */
    document.addEventListener('keydown', function (ev) {
      if (state.screen !== 'exSessionScreen') return;
      if (ev.code === 'Space') { ev.preventDefault(); document.getElementById('sessionPauseBtn').click(); }
      if (ev.code === 'Escape') { finishGuidedSession(); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state.running && !state.paused) {
        document.getElementById('sessionPauseBtn').click();
      }
    });

    renderLibraryCards();
    renderSessionHistory();

    /* Parse query deep links cleanly */
    var params = new URLSearchParams(global.location ? global.location.search : '');
    var qEx = params.get('exercise');
    var qLv = Number(params.get('level'));
    var qAct = params.get('action');
    if (qEx && CATALOG[qEx]) {
      state.selectedEx = qEx;
      if (qLv >= 1 && qLv <= 3) state.selectedLevel = qLv;
      if (qAct === 'start') startGuidedSession();
      else showScreen('exDetailScreen');
    }

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderLibraryCards();
      renderSessionHistory();
      if (state.screen === 'exDetailScreen') renderDetailView();
    });
    global.addEventListener('bwMemberChanged', renderSessionHistory);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
