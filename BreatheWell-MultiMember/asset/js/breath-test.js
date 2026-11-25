/**
 * @file breath-test.js
 * @description BOLT Oxygen Tolerance Timer, Respiratory Rate (BPM) Tap Counter,
 * Active Member SVG History Chart, CSV Export & Bohr Effect Science Modal (`btOpenSafetyBtn`).
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Page Dictionary (`PAGE_DICT`)
 *   2. BOLT 0.1s Precision Stopwatch & Clinical Tier Gauge
 *   3. Respiratory Rate (BPM) 30s/60s Tap Counter
 *   4. Member History Table, SVG Trend Chart & Bohr Science Modal
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ব্রিদ টেস্ট ও ফিটনেস পরীক্ষা | ব্রিদওয়েল',
      heroTitle: 'BOLT এবং শ্বাস-প্রশ্বাস ফিটনেস পরীক্ষা',
      heroSub: 'শরীরের অক্সিজেন ও CO₂ সহনশীলতা পরিমাপ করুন — প্রতিটি পরিবারের সদস্যের আলাদা স্কোর ইতিহাসসহ।',
      btnScienceModal: 'বিজ্ঞান, বোর ইফেক্ট ডায়াগ্রাম ও FAQ দেখুন',
      tabBolt: 'BOLT স্কোর পরীক্ষা',
      tabBpm: 'শ্বাসের হার (BPM)',
      boltStepGuide: 'স্বাভাবিক শ্বাস নিন -> স্বাভাবিকভাবে ছেড়ে নাক চেপে ধরুন -> প্রথম শ্বাস নেওয়ার তাগিদ এলে স্টপ চাপুন (জোর করবেন না)।',
      btnBoltStart: 'টাইমার শুরু করুন',
      btnBoltStop: 'স্টপ করুন',
      btnBoltSave: 'সদস্যের স্কোর সেভ করুন',
      btnBoltReset: 'রিসেট',
      tierPoor: 'দুর্বল (<10s) — উচ্চ শ্বাস-চাপ প্রবণতা',
      tierFair: 'মধ্যম (10-19.9s) — উন্নতির সুযোগ রয়েছে',
      tierGood: 'উত্তম (20-30s) — সুস্থ অক্সিজেন সহনশীলতা',
      tierExcellent: 'অসাধারণ (>30s) — উচ্চতর শ্বাস ফিটনেস',
      bpmGuide: '৩০ বা ৬০ সেকেন্ড বেছে নিয়ে প্রতিবার শ্বাস নেওয়ার সময় নিচের বড় বাটনে ট্যাপ করুন।',
      bpmTapLabel: 'শ্বাস নিয়েছেন (ট্যাপ)',
      bpmStartTimer: 'কাউন্টডাউন শুরু করুন',
      bpmSaveScore: 'BPM সেভ করুন',
      chartTitle: 'সক্রিয় সদস্যের BOLT ও BPM ট্রেন্ড চার্ট',
      historyTitle: 'সংরক্ষিত ব্রিদ টেস্ট ইতিহাস',
      scienceModalTitle: 'BOLT বিজ্ঞান, বোর ইফেক্ট (Bohr Effect) ও প্রশ্নোত্তর',
      scienceBohrTitle: 'বোর ইফেক্ট কিভাবে কাজ করে?',
      scienceBohrDesc: 'রক্তে সুস্থ মাত্রার CO₂ থাকলে হিমোগ্লোবিন সহজেই পেশি ও মস্তিষ্কে অক্সিজেন ছেড়ে দেয়। দ্রুত মুখ দিয়ে শ্বাস নিলে CO₂ অতিরিক্ত কমে যায় এবং টিস্যুতে অক্সিজেন পৌঁছানো ব্যাহত হয়।',
      faqQ1: 'BOLT কি সর্বোচ্চ শ্বাস ধরে রাখার পরীক্ষা?',
      faqA1: 'না। প্রথম হালকা শ্বাস নেওয়ার অনুভূতি আসলেই থামতে হবে — শ্বাসরুদ্ধ হওয়া পর্যন্ত নয়।',
      faqQ2: 'কখন পরীক্ষা করা সেরা?',
      faqA2: 'সকালে ঘুম থেকে ওঠার পর শান্ত হয়ে বসে পরীক্ষা করলে সবচেয়ে সঠিক তুলনা পাওয়া যায়।',
      toastTestSaved: 'ব্রিদ টেস্ট রেকর্ড সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Breath Test & BOLT Lab | BreatheWell',
      heroTitle: 'BOLT & Respiratory Fitness Lab',
      heroSub: 'Measure CO₂ tolerance and resting breaths per minute with per-member historical trends.',
      btnScienceModal: 'Science Insight, Bohr Diagram & FAQs',
      tabBolt: 'BOLT Score Test',
      tabBpm: 'Breaths/Min (BPM)',
      boltStepGuide: 'Inhale normally -> Exhale gently -> Pinch nose & Start Timer -> Stop at the FIRST comfortable urge to breathe.',
      btnBoltStart: 'Start BOLT Timer',
      btnBoltStop: 'Stop at First Urge',
      btnBoltSave: 'Save Score',
      btnBoltReset: 'Reset',
      tierPoor: 'Poor (<10s) — Hyperventilation Tendency',
      tierFair: 'Fair (10-19.9s) — Building Tolerance',
      tierGood: 'Good (20-30s) — Healthy Respiratory Fitness',
      tierExcellent: 'Optimal (>30s) — High Oxygen Delivery Efficiency',
      bpmGuide: 'Choose 30s or 60s window, start countdown, and tap the orb once on every natural inhale.',
      bpmTapLabel: 'Tap on Inhale',
      bpmStartTimer: 'Start BPM Window',
      bpmSaveScore: 'Save BPM Result',
      chartTitle: 'Active Member BOLT & BPM Trend',
      historyTitle: 'Saved Breath Test Log',
      scienceModalTitle: 'Respiratory Science, Bohr Effect & Interactive FAQs',
      scienceBohrTitle: 'How the Bohr Effect Drives Tissue Oxygenation',
      scienceBohrDesc: 'CO₂ is not merely waste — healthy arterial CO₂ lowers blood pH slightly so hemoglobin releases O₂ into cells and brain tissue efficiently.',
      faqQ1: 'Is BOLT a maximum willpower breath-hold contest?',
      faqA1: 'No! Always stop at the very first subtle diaphragm tug or urge to breathe, so your next breath stays calm and quiet.',
      faqQ2: 'When should I measure my BOLT score?',
      faqA2: 'Measure seated at rest first thing in the morning for consistent week-over-week family tracking.',
      toastTestSaved: 'Breath assessment saved!'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var boltState = { running: false, startTs: 0, elapsedSec: 0, rafId: null };
  var bpmState = { windowSec: 30, running: false, taps: 0, remSec: 30, timerId: null, calculatedBpm: 0 };

  /* --------------------------------------------------------------------------
     2. BOLT STOPWATCH LOGIC
     -------------------------------------------------------------------------- */
  function updateBoltUI(sec) {
    document.getElementById('boltReadout').textContent = sec.toFixed(1) + 's';
    var ring = document.getElementById('boltProgressRing');
    var circum = 2 * Math.PI * 96;
    var norm = Math.min(1, sec / 40);
    ring.style.strokeDasharray = circum.toFixed(1);
    ring.style.strokeDashoffset = (circum * (1 - norm)).toFixed(1);

    var cls = global.BWClinical.classifyBOLT(sec);
    var tierKey = cls.tier === 'poor' ? 'tierPoor' : cls.tier === 'fair' ? 'tierFair' : cls.tier === 'good' ? 'tierGood' : 'tierExcellent';
    var badge = document.getElementById('boltTierBadge');
    badge.className = 'bw-status-pill ' + cls.badgeClass;
    badge.textContent = sec > 0 ? tr(tierKey) : '—';
    document.getElementById('boltNeedle').style.left = cls.percent + '%';
    ring.style.stroke = cls.color;
  }

  function boltFrame(ts) {
    if (!boltState.running) return;
    boltState.elapsedSec = (ts - boltState.startTs) / 1000;
    updateBoltUI(boltState.elapsedSec);
    boltState.rafId = global.requestAnimationFrame(boltFrame);
  }

  function toggleBoltTimer() {
    var btn = document.getElementById('boltToggleBtn');
    var saveBtn = document.getElementById('boltSaveBtn');
    if (!boltState.running) {
      boltState.running = true;
      boltState.startTs = performance.now();
      saveBtn.disabled = true;
      btn.className = 'btn btn-danger px-4';
      btn.innerHTML = '<i class="bi bi-stop-circle-fill"></i> <span>' + tr('btnBoltStop') + '</span>';
      boltState.rafId = global.requestAnimationFrame(boltFrame);
    } else {
      boltState.running = false;
      if (boltState.rafId) global.cancelAnimationFrame(boltState.rafId);
      saveBtn.disabled = boltState.elapsedSec < 1;
      btn.className = 'btn btn-bw-primary px-4';
      btn.innerHTML = '<i class="bi bi-play-fill"></i> <span>' + tr('btnBoltStart') + '</span>';
    }
  }

  function saveBoltTest() {
    if (boltState.elapsedSec < 1) return;
    var list = global.BWStore.getDomainData('breath_tests') || [];
    list.unshift({
      id: 'bt_' + Date.now().toString(36),
      type: 'bolt',
      score: Number(boltState.elapsedSec.toFixed(1)),
      bpm: bpmState.calculatedBpm || null,
      note: document.getElementById('btNoteInput').value.trim(),
      ts: new Date().toISOString()
    });
    global.BWStore.setDomainData('breath_tests', list);
    document.getElementById('boltSaveBtn').disabled = true;
    global.BWI18n.showToast(tr('toastTestSaved'), 'success');
    renderHistoryAndCharts();
  }

  /* --------------------------------------------------------------------------
     3. BPM TAP COUNTER LOGIC
     -------------------------------------------------------------------------- */
  function startBpmWindow() {
    if (bpmState.timerId) clearInterval(bpmState.timerId);
    bpmState.running = true;
    bpmState.taps = 0;
    bpmState.remSec = bpmState.windowSec;
    bpmState.calculatedBpm = 0;
    document.getElementById('bpmCountDisplay').textContent = '0';
    document.getElementById('bpmRemDisplay').textContent = bpmState.remSec + 's';
    document.getElementById('bpmSaveBtn').disabled = true;

    bpmState.timerId = setInterval(function () {
      bpmState.remSec--;
      document.getElementById('bpmRemDisplay').textContent = Math.max(0, bpmState.remSec) + 's';
      if (bpmState.remSec <= 0) {
        clearInterval(bpmState.timerId);
        bpmState.running = false;
        bpmState.calculatedBpm = Math.round(bpmState.taps * (60 / bpmState.windowSec));
        document.getElementById('bpmResultDisplay').textContent = bpmState.calculatedBpm + ' BPM';
        document.getElementById('bpmSaveBtn').disabled = bpmState.calculatedBpm <= 0;
      }
    }, 1000);
  }

  function saveBpmOnly() {
    if (!bpmState.calculatedBpm) return;
    var list = global.BWStore.getDomainData('breath_tests') || [];
    list.unshift({
      id: 'bt_' + Date.now().toString(36),
      type: 'bpm',
      score: list.length && list[0].score ? list[0].score : 0,
      bpm: bpmState.calculatedBpm,
      note: 'BPM Rate Assessment',
      ts: new Date().toISOString()
    });
    global.BWStore.setDomainData('breath_tests', list);
    document.getElementById('bpmSaveBtn').disabled = true;
    global.BWI18n.showToast(tr('toastTestSaved'), 'success');
    renderHistoryAndCharts();
  }

  /* --------------------------------------------------------------------------
     4. HISTORY TABLE & SVG CHART
     -------------------------------------------------------------------------- */
  function renderHistoryAndCharts() {
    var list = global.BWStore.getDomainData('breath_tests') || [];
    var tbody = document.getElementById('btHistoryBody');
    var esc = global.BWI18n.escapeHtml;

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</td></tr>';
    } else {
      tbody.innerHTML = list.map(function (item) {
        var cls = item.score ? global.BWClinical.classifyBOLT(item.score) : { badgeClass: 'bw-status-info', tier: 'fair' };
        return (
          '<tr>' +
          '  <td>' + esc(global.BWI18n.fmtDate(item.ts, true)) + '</td>' +
          '  <td class="fw-bold tabular-nums">' + (item.score ? esc(item.score) + 's' : '—') + '</td>' +
          '  <td class="tabular-nums">' + (item.bpm ? esc(item.bpm) + ' BPM' : '—') + '</td>' +
          '  <td>' + esc(item.note || '—') + '</td>' +
          '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-bt="' + esc(item.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button></td>' +
          '</tr>'
        );
      }).join('');

      Array.prototype.forEach.call(tbody.querySelectorAll('[data-del-bt]'), function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-del-bt');
          var next = (global.BWStore.getDomainData('breath_tests') || []).filter(function (x) { return x.id !== id; });
          global.BWStore.setDomainData('breath_tests', next);
          renderHistoryAndCharts();
        });
      });
    }

    var chrono = list.slice().reverse();
    global.BWClinical.renderSvgLineChart(document.getElementById('btChartContainer'), {
      labels: chrono.map(function (x) { return String(x.ts || '').slice(0, 10); }),
      series: [
        { name: 'BOLT (s)', color: '#00897b', values: chrono.map(function (x) { return x.score || 0; }) },
        { name: 'BPM', color: '#1769aa', values: chrono.map(function (x) { return x.bpm || null; }) }
      ],
      yMin: 0,
      safeBand: { min: 20, max: 35, color: 'rgba(16,185,129,0.12)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });
  }

  /* --------------------------------------------------------------------------
     5. INIT & MODAL HOOKS
     -------------------------------------------------------------------------- */
  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    document.getElementById('boltToggleBtn').addEventListener('click', toggleBoltTimer);
    document.getElementById('boltResetBtn').addEventListener('click', function () {
      boltState.running = false;
      boltState.elapsedSec = 0;
      if (boltState.rafId) global.cancelAnimationFrame(boltState.rafId);
      updateBoltUI(0);
      document.getElementById('boltSaveBtn').disabled = true;
      var btn = document.getElementById('boltToggleBtn');
      btn.className = 'btn btn-bw-primary px-4';
      btn.innerHTML = '<i class="bi bi-play-fill"></i> <span>' + tr('btnBoltStart') + '</span>';
    });
    document.getElementById('boltSaveBtn').addEventListener('click', saveBoltTest);

    Array.prototype.forEach.call(document.querySelectorAll('[data-bpm-win]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bpm-win]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        bpmState.windowSec = Number(btn.getAttribute('data-bpm-win')) || 30;
        document.getElementById('bpmRemDisplay').textContent = bpmState.windowSec + 's';
      });
    });

    document.getElementById('bpmStartBtn').addEventListener('click', startBpmWindow);
    document.getElementById('bpmTapBtn').addEventListener('click', function () {
      if (!bpmState.running) startBpmWindow();
      bpmState.taps++;
      document.getElementById('bpmCountDisplay').textContent = String(bpmState.taps);
      bpmState.calculatedBpm = Math.round(bpmState.taps * (60 / bpmState.windowSec));
      document.getElementById('bpmResultDisplay').textContent = bpmState.calculatedBpm + ' BPM';
    });
    document.getElementById('bpmSaveBtn').addEventListener('click', saveBpmOnly);

    document.getElementById('btOpenSafetyBtn').addEventListener('click', function () {
      var modalEl = document.getElementById('btScienceModal');
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    });

    document.getElementById('btExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = global.BWStore.getDomainData('breath_tests') || [];
      global.BWI18n.downloadCsv(
        'breath-tests-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.csv',
        ['Date', 'BOLT (s)', 'BPM', 'Note'],
        list.map(function (i) { return [i.ts, i.score, i.bpm || '', i.note || '']; })
      );
    });

    updateBoltUI(0);
    renderHistoryAndCharts();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      updateBoltUI(boltState.elapsedSec);
      renderHistoryAndCharts();
    });
    global.addEventListener('bwMemberChanged', renderHistoryAndCharts);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
