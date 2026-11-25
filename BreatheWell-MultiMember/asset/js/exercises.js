/**
 * @file exercises.js
 * @description Breathing Sanctuary Studio Controller (`exercises.html`):
 *   - 4 Protocols: Box (`4-4-4-4`), `4-7-8` Calm (`4-7-8`), Pranayama (`4-4-4`), Diaphragmatic (`4-2-6`)
 *   - Levels L1 (1.0x), L2 (1.25x), L3 (1.5x) & Durations (`2m`, `5m`, `10m`)
 *   - 60fps `requestAnimationFrame` Lotus Expansion + Radial SVG Ring + Live Waveform SVG
 *   - Web Audio API Harmonic Chimes (`528->792Hz` Inhale, `396->594Hz` Exhale, `180Hz` Tick)
 *   - Optional SpeechSynthesis Voice Coach + Post-Session Mood Save scoped per Member
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`) & Protocol Definitions
 *   2. Web Audio & Speech Synthesis Coaches
 *   3. Waveform SVG & Lotus Frame Animation Engine
 *   4. Session Completion, Mood Save & Member History Table
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'শ্বাস-প্রশ্বাস ব্যায়াম স্টুডিও | ব্রিদওয়েল',
      heroTitle: 'সচেতন শ্বাস-প্রশ্বাস ও মননশীল স্টুডিও',
      heroSub: 'বৈজ্ঞানিক শ্বাস ছন্দের মাধ্যমে স্নায়ুতন্ত্র শান্ত করুন — সক্রিয় সদস্যের অগ্রগতি স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।',
      secSelectProtocol: '১. ব্যায়াম প্রোটোকল বেছে নিন',
      pBoxTitle: 'বক্স শ্বাস-প্রশ্বাস',
      pBoxRatio: '৪ - ৪ - ৪ - ৪ ছন্দ • ফোকাস ও চাপ নিয়ন্ত্রণ',
      p478Title: '৪-৭-৮ শান্তি পদ্ধতি',
      p478Ratio: '৪ - ৭ - ৮ ছন্দ • দ্রুত ঘুম ও উদ্বেগ কমানো',
      pPranaTitle: 'সহজ প্রাণায়াম',
      pPranaRatio: '৪ - ৪ - ৪ ছন্দ • ফুসফুস প্রসারণ ও শক্তি',
      pDiaTitle: 'ডায়াফ্র্যাগমেটিক শ্বাস',
      pDiaRatio: '৪ - ২ - ৬ ছন্দ • গভীর হৃদ-স্পন্দন ভারসাম্য',
      lblLevel: 'স্তর (গতি):',
      lblDuration: 'সময়কাল:',
      optAudio: 'শব্দ সংকেত (Chime)',
      optTts: 'ভয়েস কোচ (TTS)',
      cueReady: 'প্রস্তুত',
      cueInhale: 'গভীর শ্বাস নিন',
      cueHold: 'শ্বাস ধরে রাখুন',
      cueExhale: 'ধীরে শ্বাস ছাড়ুন',
      cueSustain: 'শান্তভাবে স্থির থাকুন',
      btnStart: 'সেশন শুরু করুন',
      btnPause: 'বিরতি',
      btnResume: 'চালিয়ে যান',
      btnReset: 'রিসেট',
      statCycles: 'সম্পন্ন চক্র',
      statRemaining: 'বাকি সময়',
      statStreak: 'ধারাবাহিক দিন',
      statTotalMin: 'মোট মিনিট',
      recentTitle: 'সক্রিয় সদস্যের সাম্প্রতিক সেশনসমূহ',
      moodModalTitle: 'অভিনন্দন! সেশন সম্পন্ন হয়েছে',
      moodModalSub: 'সেশনের পর এখন কেমন অনুভব করছেন তা নির্বাচন করুন এবং প্রোফাইলে সংরক্ষণ করুন:',
      moodCalm: 'শান্ত',
      moodFocused: 'মনোযোগী',
      moodSleepy: 'তন্দ্রাচ্ছন্ন',
      moodEnergized: 'সতেজ',
      btnSaveSession: 'সদস্যের প্রোফাইলে সেভ করুন'
    },
    en: {
      pageTitle: 'Guided Breathing Studio | BreatheWell',
      heroTitle: 'Mindful Breathing Sanctuary Studio',
      heroSub: 'Regulate autonomic balance with synchronized visual cadence, harmonic chimes & per-member session history.',
      secSelectProtocol: '1. Choose Breathing Protocol',
      pBoxTitle: 'Box Breathing',
      pBoxRatio: '4 - 4 - 4 - 4 cadence • Stress reset & clarity',
      p478Title: '4-7-8 Calm Method',
      p478Ratio: '4 - 7 - 8 cadence • Deep sleep & anxiety relief',
      pPranaTitle: 'Pranayama Coherence',
      pPranaRatio: '4 - 4 - 4 cadence • Lung expansion & focus',
      pDiaTitle: 'Diaphragmatic Pacing',
      pDiaRatio: '4 - 2 - 6 cadence • Vagal tone & HRV balance',
      lblLevel: 'Level:',
      lblDuration: 'Duration:',
      optAudio: 'Harmonic Chimes',
      optTts: 'Voice Coach (TTS)',
      cueReady: 'Ready',
      cueInhale: 'Inhale Gently',
      cueHold: 'Hold softly',
      cueExhale: 'Exhale Slowly',
      cueSustain: 'Rest Empty',
      btnStart: 'Start Session',
      btnPause: 'Pause',
      btnResume: 'Resume',
      btnReset: 'Reset',
      statCycles: 'Cycles',
      statRemaining: 'Remaining',
      statStreak: 'Day Streak',
      statTotalMin: 'Total Min',
      recentTitle: 'Active Member Recent Sessions',
      moodModalTitle: 'Session Complete — Well Done!',
      moodModalSub: 'How do you feel right now? Pick a mood to log this session to the active family member:',
      moodCalm: 'Calm',
      moodFocused: 'Focused',
      moodSleepy: 'Restful',
      moodEnergized: 'Energized',
      btnSaveSession: 'Save to Active Member'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  /* Protocol base cadence in seconds: [inhale, holdAfterInhale, exhale, holdAfterExhale] */
  var PROTOCOLS = {
    box: [4, 4, 4, 4],
    478: [4, 7, 8, 0],
    pranayama: [4, 4, 4, 0],
    diaphragmatic: [4, 2, 6, 0]
  };

  var LEVEL_MULT = { 1: 1.0, 2: 1.25, 3: 1.5 };

  var state = {
    protocol: 'box',
    level: 1,
    durationMin: 2,
    running: false,
    paused: false,
    rafId: null,
    elapsedMs: 0,
    lastFrameTs: 0,
    cyclesCompleted: 0,
    lastPhaseIdx: -1,
    lastTickSec: -1,
    selectedMood: 'calm',
    pendingDurationSec: 0
  };

  var audioCtx = null;

  /* --------------------------------------------------------------------------
     2. WEB AUDIO SYNTHESIS & TTS COACH
     -------------------------------------------------------------------------- */
  function ensureAudio() {
    if (!audioCtx && typeof (global.AudioContext || global.webkitAudioContext) === 'function') {
      var Ctx = global.AudioContext || global.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChime(f1, f2, duration) {
    if (!document.getElementById('exAudioToggle').checked) return;
    var ctx = ensureAudio();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.11, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      /* Ignore autoplay policies gracefully */
    }
  }

  function speakCue(text) {
    if (!document.getElementById('exTtsToggle').checked) return;
    if (!global.speechSynthesis || typeof global.SpeechSynthesisUtterance !== 'function') return;
    try {
      global.speechSynthesis.cancel();
      var u = new global.SpeechSynthesisUtterance(text);
      u.lang = global.BWI18n.getLang() === 'bn' ? 'bn-BD' : 'en-US';
      u.rate = 0.95;
      global.speechSynthesis.speak(u);
    } catch (e) {
      /* Ignore TTS errors */
    }
  }

  /* --------------------------------------------------------------------------
     3. PHASE TIMINGS & WAVEFORM RENDERER
     -------------------------------------------------------------------------- */
  function getScaledPhases() {
    var base = PROTOCOLS[state.protocol] || PROTOCOLS.box;
    var mult = LEVEL_MULT[state.level] || 1.0;
    var labels = [tr('cueInhale'), tr('cueHold'), tr('cueExhale'), tr('cueSustain')];
    var list = [];
    base.forEach(function (sec, idx) {
      if (sec > 0) {
        list.push({ idx: idx, dur: Math.round(sec * mult * 10) / 10, label: labels[idx] });
      }
    });
    return list;
  }

  function renderWaveformSvg(progressNorm) {
    var svg = document.getElementById('exWaveformSvg');
    if (!svg) return;
    var phases = getScaledPhases();
    var totalCycleSec = phases.reduce(function (acc, p) { return acc + p.dur; }, 0);
    var W = 400, H = 74;
    var x = 12, curY = H - 14;
    var pts = [x + ',' + curY];
    var usableW = W - 24;

    phases.forEach(function (p) {
      var segW = (p.dur / totalCycleSec) * usableW;
      x += segW;
      if (p.idx === 0) curY = 14;
      else if (p.idx === 2) curY = H - 14;
      pts.push(x.toFixed(1) + ',' + curY.toFixed(1));
    });

    var dotX = 12 + (progressNorm || 0) * usableW;
    svg.innerHTML =
      '<polyline fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="3" points="' + pts.join(' ') + '" />' +
      '<line x1="' + dotX.toFixed(1) + '" y1="6" x2="' + dotX.toFixed(1) + '" y2="' + (H - 6) + '" stroke="#6ee7b7" stroke-width="2" stroke-dasharray="3 3" />' +
      '<circle cx="' + dotX.toFixed(1) + '" cy="' + (H / 2) + '" r="5" fill="#a7f3d0" />';
  }

  function updateVisualStage(phase, secLeft, cycleNorm, overallNorm) {
    var core = document.getElementById('exMandalaCore');
    var petal = document.getElementById('exMandalaPetal');
    var cueEl = document.getElementById('exCueText');
    var countEl = document.getElementById('exPhaseCount');
    var ringCircle = document.getElementById('exProgressCircle');

    var scale = 1.0;
    if (phase.idx === 0) {
      scale = 0.86 + 0.34 * cycleNorm;
    } else if (phase.idx === 1) {
      scale = 1.20;
    } else if (phase.idx === 2) {
      scale = 1.20 - 0.34 * cycleNorm;
    } else {
      scale = 0.86;
    }

    core.style.transform = 'scale(' + scale.toFixed(3) + ')';
    petal.style.transform = 'scale(' + (scale * 1.12).toFixed(3) + ') rotate(' + (cycleNorm * 45).toFixed(1) + 'deg)';
    cueEl.textContent = phase.label;
    countEl.textContent = Math.max(1, Math.ceil(secLeft)) + 's';

    var circum = 2 * Math.PI * 108;
    ringCircle.style.strokeDasharray = circum.toFixed(1);
    ringCircle.style.strokeDashoffset = (circum * (1 - overallNorm)).toFixed(1);
  }

  /* --------------------------------------------------------------------------
     4. ANIMATION LOOP, SESSION SAVE & HISTORY
     -------------------------------------------------------------------------- */
  function frame(ts) {
    if (!state.running || state.paused) return;
    if (!state.lastFrameTs) state.lastFrameTs = ts;
    var dt = ts - state.lastFrameTs;
    state.lastFrameTs = ts;
    state.elapsedMs += dt;

    var totalTargetMs = state.durationMin * 60 * 1000;
    if (state.elapsedMs >= totalTargetMs) {
      finishSession();
      return;
    }

    var phases = getScaledPhases();
    var cycleSec = phases.reduce(function (s, p) { return s + p.dur; }, 0);
    var elapsedSec = state.elapsedMs / 1000;
    var currentCycle = Math.floor(elapsedSec / cycleSec);
    if (currentCycle !== state.cyclesCompleted) {
      state.cyclesCompleted = currentCycle;
      document.getElementById('exCyclesStat').textContent = String(state.cyclesCompleted);
    }

    var intoCycle = elapsedSec % cycleSec;
    var acc = 0;
    var activePhase = phases[0];
    var phaseElapsed = 0;
    for (var i = 0; i < phases.length; i++) {
      if (intoCycle < acc + phases[i].dur) {
        activePhase = phases[i];
        phaseElapsed = intoCycle - acc;
        break;
      }
      acc += phases[i].dur;
    }

    /* Trigger Audio/Voice transitions once when entering a new phase */
    if (state.lastPhaseIdx !== activePhase.idx) {
      state.lastPhaseIdx = activePhase.idx;
      if (activePhase.idx === 0) {
        playChime(528, 792, 0.35);
      } else if (activePhase.idx === 2) {
        playChime(396, 594, 0.35);
      } else {
        playChime(440, 440, 0.18);
      }
      speakCue(activePhase.label);
    }

    /* Gentle second metronome tick */
    var wholeSec = Math.floor(elapsedSec);
    if (wholeSec !== state.lastTickSec) {
      state.lastTickSec = wholeSec;
      var remSec = Math.max(0, Math.ceil((totalTargetMs - state.elapsedMs) / 1000));
      var mm = Math.floor(remSec / 60);
      var ss = ('0' + (remSec % 60)).slice(-2);
      document.getElementById('exRemainingStat').textContent = mm + ':' + ss;
    }

    var phaseProgress = Math.min(1, phaseElapsed / activePhase.dur);
    updateVisualStage(activePhase, activePhase.dur - phaseElapsed, phaseProgress, state.elapsedMs / totalTargetMs);
    renderWaveformSvg(intoCycle / cycleSec);

    state.rafId = global.requestAnimationFrame(frame);
  }

  function startOrResume() {
    ensureAudio();
    if (!state.running) {
      state.running = true;
      state.paused = false;
      state.elapsedMs = 0;
      state.cyclesCompleted = 0;
      state.lastPhaseIdx = -1;
      state.lastFrameTs = 0;
    } else if (state.paused) {
      state.paused = false;
      state.lastFrameTs = 0;
    } else {
      state.paused = true;
    }
    syncButtons();
    if (state.running && !state.paused) {
      state.rafId = global.requestAnimationFrame(frame);
    }
  }

  function resetSession() {
    state.running = false;
    state.paused = false;
    state.elapsedMs = 0;
    state.cyclesCompleted = 0;
    state.lastPhaseIdx = -1;
    if (state.rafId) global.cancelAnimationFrame(state.rafId);

    document.getElementById('exCueText').textContent = tr('cueReady');
    document.getElementById('exPhaseCount').textContent = '0s';
    document.getElementById('exCyclesStat').textContent = '0';
    document.getElementById('exRemainingStat').textContent = state.durationMin + ':00';
    document.getElementById('exMandalaCore').style.transform = 'scale(1)';
    document.getElementById('exMandalaPetal').style.transform = 'scale(1)';
    var ring = document.getElementById('exProgressCircle');
    var circum = 2 * Math.PI * 108;
    ring.style.strokeDasharray = circum.toFixed(1);
    ring.style.strokeDashoffset = circum.toFixed(1);
    renderWaveformSvg(0);
    syncButtons();
  }

  function finishSession() {
    state.running = false;
    state.paused = false;
    state.pendingDurationSec = Math.max(30, Math.round(state.elapsedMs / 1000));
    playChime(528, 792, 0.5);
    resetSession();

    var modalEl = document.getElementById('exCompleteModal');
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  function syncButtons() {
    var mainBtn = document.getElementById('exMainActionBtn');
    if (!state.running) {
      mainBtn.innerHTML = '<i class="bi bi-play-fill"></i> <span>' + tr('btnStart') + '</span>';
    } else if (state.paused) {
      mainBtn.innerHTML = '<i class="bi bi-play-fill"></i> <span>' + tr('btnResume') + '</span>';
    } else {
      mainBtn.innerHTML = '<i class="bi bi-pause-fill"></i> <span>' + tr('btnPause') + '</span>';
    }
  }

  function renderMemberHistory() {
    var exData = global.BWStore.getDomainData('exercises') || { sessions: [], streak: 0, totalSeconds: 0 };
    document.getElementById('exStreakStat').textContent = String(exData.streak || 0);
    document.getElementById('exTotalMinStat').textContent = String(Math.round((exData.totalSeconds || 0) / 60));

    var tbody = document.getElementById('exHistoryBody');
    var sessions = exData.sessions || [];
    var esc = global.BWI18n.escapeHtml;
    if (!sessions.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</td></tr>';
      return;
    }

    tbody.innerHTML = sessions.slice(0, 12).map(function (s) {
      return (
        '<tr>' +
        '  <td>' + esc(global.BWI18n.fmtDate(s.ts, true)) + '</td>' +
        '  <td class="text-uppercase fw-semibold">' + esc(s.protocol) + ' (L' + esc(s.level || 1) + ')</td>' +
        '  <td class="tabular-nums">' + Math.round((s.durationSec || 0) / 60) + 'm</td>' +
        '  <td class="tabular-nums">' + esc(s.cycles || 0) + '</td>' +
        '  <td><span class="bw-status-pill bw-status-normal">' + esc(s.mood || 'calm') + '</span></td>' +
        '</tr>'
      );
    }).join('');
  }

  function saveCompletedSession() {
    var exData = global.BWStore.getDomainData('exercises') || { sessions: [], streak: 0, lastDate: null, totalSeconds: 0, level: 1 };
    var todayStr = new Date().toISOString().slice(0, 10);
    if (exData.lastDate !== todayStr) {
      exData.streak = (exData.streak || 0) + 1;
      exData.lastDate = todayStr;
    }
    exData.totalSeconds = (exData.totalSeconds || 0) + (state.pendingDurationSec || state.durationMin * 60);
    exData.sessions.unshift({
      id: 'ex_' + Date.now().toString(36),
      protocol: state.protocol,
      level: state.level,
      durationSec: state.pendingDurationSec || state.durationMin * 60,
      cycles: Math.max(1, state.cyclesCompleted),
      mood: state.selectedMood,
      ts: new Date().toISOString()
    });
    global.BWStore.setDomainData('exercises', exData);

    var modalEl = document.getElementById('exCompleteModal');
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    }
    var msgKey = global.BWStore.isAuthenticated() ? 'toastSavedMember' : 'toastSavedGuest';
    global.BWI18n.showToast(global.BWI18n.t(msgKey, PAGE_DICT), 'success');
    renderMemberHistory();
  }

  /* --------------------------------------------------------------------------
     5. INIT & EVENT WIRING
     -------------------------------------------------------------------------- */
  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-protocol]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-protocol]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.protocol = btn.getAttribute('data-protocol');
        resetSession();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-ex-level]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ex-level]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.level = Number(btn.getAttribute('data-ex-level')) || 1;
        resetSession();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-ex-dur]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ex-dur]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.durationMin = Number(btn.getAttribute('data-ex-dur')) || 2;
        resetSession();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-mood]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-mood]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.selectedMood = btn.getAttribute('data-mood');
      });
    });

    document.getElementById('exMainActionBtn').addEventListener('click', startOrResume);
    document.getElementById('exResetBtn').addEventListener('click', resetSession);
    document.getElementById('exSaveModalBtn').addEventListener('click', saveCompletedSession);

    resetSession();
    renderMemberHistory();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      syncButtons();
      renderMemberHistory();
    });
    global.addEventListener('bwMemberChanged', renderMemberHistory);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
