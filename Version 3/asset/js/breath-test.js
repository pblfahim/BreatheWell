/**
 * @file breath-test.js
 * @description Breath Test & Pulmonary Assessment Lab (`breath-test.html`):
 *   - 4-Card KPI Strip w/ Composite Respiratory Readiness Index (0-100)
 *   - BOLT 0.1s Stopwatch w/ Optional 10s Calm Prep Pacer & Live Milestones
 *   - BPM Tap Rate Counter (`30s` / `60s`, Spacebar support, Undo Tap & Haptics)
 *   - Diagnostic Result Card w/ Delta Pill, 4-Segment Spectrum, 3 Bio-Marker Bars &
 *     1-Click Personalized Exercise Launch
 *   - Interactive SVG History Chart, Filterable History List & Bohr Effect Science Modal
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Member Pulmonary KPI & Readiness Renderer
 *   3. 10s Prep Pacer, BOLT Stopwatch & BPM Haptic Counter
 *   4. Diagnostic Result Engine, Chart & Bohr Science Modal
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'শ্বাসের পরীক্ষা ও ফিটনেস ল্যাব | ব্রিদওয়েল v3',
      heroTitle: 'BOLT এবং শ্বাস-প্রশ্বাস ফিটনেস পরীক্ষা',
      heroSub: 'শরীরের CO₂ ও অক্সিজেন সহনশীলতা এবং মিনিটে শ্বাসের হার পরিমাপ করুন — সক্রিয় সদস্যের আলাদা ট্রেন্ডসহ।',
      btnScienceModal: 'বিজ্ঞান, বোর ইফেক্ট ও FAQ',
      kpiBestBolt: 'সেরা BOLT স্কোর',
      kpiAvgBpm: 'গড় বিশ্রামের BPM',
      kpiTotalTests: 'মোট পরীক্ষা',
      kpiReadiness: 'শ্বাস-প্রশ্বাস রেডিনেস সূচক',
      modeBolt: 'BOLT পরীক্ষা',
      modeBpm: 'শ্বাসের হার (BPM)',
      btnPrepPacer: '১০ সে. শান্ত প্রস্তুতি চালু করুন',
      btnStartBolt: 'BOLT শুরু করুন',
      btnStopBolt: 'প্রথম তাগিদে স্টপ করুন',
      btnStartBpm: 'BPM কাউন্টার শুরু করুন',
      btnTapBpm: 'প্রতি শ্বাসে ট্যাপ করুন',
      btnUndoTap: 'ট্যাপ পূর্বাবস্থায় ফেরান',
      resTitle: 'ক্লিনিক্যাল মূল্যায়ন ফলাফল',
      lblBioCo2: 'CO₂ সহনশীলতা',
      lblBioO2: 'টিস্যু O₂ সরবরাহ',
      lblBioVagal: 'স্নায়বিক ভারসাম্য',
      btnLaunchRxExercise: 'প্রস্তাবিত শ্বাস ব্যায়াম শুরু করুন',
      btnSaveResult: 'সক্রিয় সদস্যে সেভ করুন',
      chartTitle: 'সক্রিয় সদস্যের BOLT ও BPM ট্রেন্ড চার্ট',
      historyTitle: 'সংরক্ষিত পরীক্ষার ইতিহাস',
      scienceTitle: 'বোর ইফেক্ট (Bohr Effect) বিজ্ঞান ও প্রশ্নোত্তর',
      toastSaved: 'পরীক্ষার ফলাফল সক্রিয় সদস্যের ইতিহাসে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Breath Test & Pulmonary Lab | BreatheWell v3',
      heroTitle: 'BOLT & Respiratory Fitness Lab',
      heroSub: 'Measure CO₂ oxygen tolerance and resting breaths/min with Composite Readiness scoring per family member.',
      btnScienceModal: 'Science, Bohr Effect & FAQs',
      kpiBestBolt: 'Personal Best BOLT',
      kpiAvgBpm: 'Mean Resting BPM',
      kpiTotalTests: 'Total Assessments',
      kpiReadiness: 'Respiratory Readiness Index',
      modeBolt: 'BOLT Tolerance',
      modeBpm: 'Breaths/Min (BPM)',
      btnPrepPacer: '10s Calm Prep Pacer',
      btnStartBolt: 'Start BOLT Timer',
      btnStopBolt: 'Stop at First Urge',
      btnStartBpm: 'Start BPM Window',
      btnTapBpm: 'Tap on Natural Inhale',
      btnUndoTap: 'Undo Tap',
      resTitle: 'Diagnostic Result & Action Plan',
      lblBioCo2: 'CO₂ Tolerance',
      lblBioO2: 'Tissue O₂ Delivery',
      lblBioVagal: 'Vagal Balance',
      btnLaunchRxExercise: 'Launch Prescribed Exercise',
      btnSaveResult: 'Save Result to Member',
      chartTitle: 'Active Member BOLT & BPM Trend',
      historyTitle: 'Saved Breath Test Log',
      scienceTitle: 'Bohr Effect Physiology & Interactive FAQs',
      toastSaved: 'Assessment saved under active family member!'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var mode = 'bolt';
  var boltState = { running: false, startTs: 0, elapsedSec: 0, rafId: null };
  var bpmState = { windowSec: 30, running: false, taps: 0, remSec: 30, timer: null, bpm: 0 };
  var prepTimer = null;
  var histFilter = 'all';

  /* --------------------------------------------------------------------------
     2. MEMBER PULMONARY KPI & READINESS INDEX
     -------------------------------------------------------------------------- */
  function renderMemberKpisAndHistory() {
    var active = global.BWStore.getActiveMember();
    var sum = global.BWStore.getMemberSummary(active.id);
    var list = global.BWStore.getDomainData('breath_tests', active.id) || [];
    var esc = global.BWI18n.escapeHtml;

    document.getElementById('btKpiBestBolt').textContent = sum.bestBolt ? (sum.bestBolt + 's') : '—';
    document.getElementById('btKpiAvgBpm').textContent = sum.avgBpm ? (sum.avgBpm + ' BPM') : '—';
    document.getElementById('btKpiTotal').textContent = String(list.length);

    var readiness = global.BWClinical.computeReadinessIndex(sum.bestBolt, sum.avgBpm);
    document.getElementById('btReadinessVal').textContent = readiness + '/100';
    document.getElementById('btReadinessBar').style.width = readiness + '%';

    /* History Chart */
    var chrono = list.slice().reverse();
    global.BWClinical.renderSvgLineChart(document.getElementById('btHistoryChart'), {
      labels: chrono.map(function (x) { return String(x.ts || '').slice(0, 10); }),
      series: [
        { name: 'BOLT (s)', color: '#00897b', values: chrono.map(function (x) { return Number(x.score) || 0; }) },
        { name: 'BPM', color: '#2e9be5', values: chrono.map(function (x) { return x.bpm ? Number(x.bpm) : null; }) }
      ],
      yMin: 0,
      safeBand: { min: 20, max: 35, color: 'rgba(16,185,129,0.12)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });

    /* Filtered History Table */
    var filtered = list.filter(function (item) {
      if (histFilter === 'bolt') return item.type === 'bolt' || Number(item.score) > 0;
      if (histFilter === 'bpm') return item.type === 'bpm' || Number(item.bpm) > 0;
      return true;
    });
    var tbody = document.getElementById('btHistoryBody');
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</td></tr>';
      return;
    }
    tbody.innerHTML = filtered.slice(0, 12).map(function (it) {
      return (
        '<tr>' +
        '  <td>' + esc(global.BWI18n.fmtDate(it.ts, true)) + '</td>' +
        '  <td class="fw-bold tabular-nums">' + (it.score ? esc(it.score) + 's' : '—') + '</td>' +
        '  <td class="tabular-nums">' + (it.bpm ? esc(it.bpm) + ' BPM' : '—') + '</td>' +
        '  <td>' + esc(it.note || '—') + '</td>' +
        '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-bt="' + esc(it.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button></td>' +
        '</tr>'
      );
    }).join('');
  }

  /* --------------------------------------------------------------------------
     3. PREP PACER, BOLT TIMER & BPM COUNTER
     -------------------------------------------------------------------------- */
  function startPrepPacer() {
    if (prepTimer) clearInterval(prepTimer);
    var box = document.getElementById('btPrepBox');
    var txt = document.getElementById('btPrepTxt');
    box.classList.remove('d-none');
    var sec = 10;
    txt.textContent = 'Relax & Inhale Gently... ' + sec + 's';
    prepTimer = setInterval(function () {
      sec--;
      if (sec > 5) txt.textContent = 'Normal Quiet Inhale... ' + sec + 's';
      else if (sec > 1) txt.textContent = 'Passive Gentle Exhale... ' + sec + 's';
      else if (sec === 1) { txt.textContent = 'Ready — Pinch Nose!'; global.BWAudio.playTone(880, 880, 0.2, 0.08); }
      else { clearInterval(prepTimer); box.classList.add('d-none'); }
    }, 1000);
  }

  function updateBoltDial(sec) {
    document.getElementById('boltTimerReadout').textContent = sec.toFixed(1) + 's';
    var ring = document.getElementById('boltProgressCircle');
    var circum = 2 * Math.PI * 102;
    ring.style.strokeDasharray = circum.toFixed(1);
    ring.style.strokeDashoffset = (circum * (1 - Math.min(1, sec / 40))).toFixed(1);
    var cls = global.BWClinical.classifyBOLT(sec);
    ring.style.stroke = cls.color;
  }

  function boltFrame(ts) {
    if (!boltState.running) return;
    boltState.elapsedSec = (ts - boltState.startTs) / 1000;
    updateBoltDial(boltState.elapsedSec);
    boltState.rafId = global.requestAnimationFrame(boltFrame);
  }

  function toggleBolt() {
    var btn = document.getElementById('boltToggleBtn');
    if (!boltState.running) {
      global.BWAudio.playTone(528, 660, 0.25, 0.08);
      boltState.running = true;
      boltState.startTs = performance.now();
      btn.className = 'btn btn-danger px-4';
      btn.innerHTML = '<i class="bi bi-stop-circle-fill"></i> ' + tr('btnStopBolt');
      document.getElementById('btResultCard').classList.add('d-none');
      boltState.rafId = global.requestAnimationFrame(boltFrame);
    } else {
      boltState.running = false;
      if (boltState.rafId) global.cancelAnimationFrame(boltState.rafId);
      btn.className = 'btn btn-bw-primary px-4';
      btn.innerHTML = '<i class="bi bi-play-fill"></i> ' + tr('btnStartBolt');
      if (boltState.elapsedSec >= 1) showDiagnosticResult('bolt');
    }
  }

  function startBpmWindow() {
    if (bpmState.timer) clearInterval(bpmState.timer);
    bpmState.running = true;
    bpmState.taps = 0;
    bpmState.remSec = bpmState.windowSec;
    bpmState.bpm = 0;
    document.getElementById('bpmTapCount').textContent = '0';
    document.getElementById('bpmRemSec').textContent = bpmState.remSec + 's';
    document.getElementById('bpmExtrapolated').textContent = '— BPM';
    bpmState.timer = setInterval(function () {
      bpmState.remSec--;
      document.getElementById('bpmRemSec').textContent = Math.max(0, bpmState.remSec) + 's';
      if (bpmState.remSec <= 0) {
        clearInterval(bpmState.timer);
        bpmState.running = false;
        bpmState.bpm = Math.round(bpmState.taps * (60 / bpmState.windowSec));
        document.getElementById('bpmExtrapolated').textContent = bpmState.bpm + ' BPM';
        if (bpmState.bpm > 0) showDiagnosticResult('bpm');
      }
    }, 1000);
  }

  /* --------------------------------------------------------------------------
     4. DIAGNOSTIC RESULT CARD & PRESCRIBED EXERCISE LINK
     -------------------------------------------------------------------------- */
  function showDiagnosticResult(kind) {
    var resCard = document.getElementById('btResultCard');
    resCard.classList.remove('d-none');

    var active = global.BWStore.getActiveMember();
    var existing = global.BWStore.getDomainData('breath_tests', active.id) || [];

    if (kind === 'bolt') {
      var val = Number(boltState.elapsedSec.toFixed(1));
      var cls = global.BWClinical.classifyBOLT(val);
      document.getElementById('btResScoreVal').textContent = val + 's BOLT';
      var prev = existing.length ? Number(existing[0].score) : null;
      var delta = prev ? (val - prev).toFixed(1) : null;
      document.getElementById('btResDeltaBadge').textContent = delta ? ((delta >= 0 ? '+' : '') + delta + 's vs prev') : 'Baseline';
      document.getElementById('btResNeedle').style.left = cls.percent + '%';
      document.getElementById('bioCo2Bar').style.width = cls.co2 + '%';
      document.getElementById('bioO2Bar').style.width = cls.o2 + '%';
      document.getElementById('bioVagalBar').style.width = cls.vagal + '%';
      document.getElementById('btLaunchRxLink').href = 'exercises.html?exercise=' + cls.rx + '&level=1&action=start';
    } else {
      var b = bpmState.bpm;
      var bCls = global.BWClinical.classifyBPM(b);
      document.getElementById('btResScoreVal').textContent = b + ' BPM';
      document.getElementById('btResDeltaBadge').textContent = bCls.tier.toUpperCase();
      document.getElementById('btResNeedle').style.left = (b <= 12 ? 85 : b <= 16 ? 60 : 25) + '%';
      document.getElementById('bioCo2Bar').style.width = '78%';
      document.getElementById('bioO2Bar').style.width = '80%';
      document.getElementById('bioVagalBar').style.width = b <= 14 ? '88%' : '54%';
      document.getElementById('btLaunchRxLink').href = 'exercises.html?exercise=relax46&level=2&action=start';
    }
    resCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function saveResultToMember() {
    var list = global.BWStore.getDomainData('breath_tests') || [];
    list.unshift({
      id: 'bt_' + Date.now().toString(36),
      type: mode,
      score: mode === 'bolt' ? Number(boltState.elapsedSec.toFixed(1)) : (list[0] && list[0].score ? list[0].score : 0),
      bpm: mode === 'bpm' ? bpmState.bpm : (bpmState.bpm || null),
      note: document.getElementById('btNoteInput').value.trim() || (mode === 'bolt' ? 'BOLT test' : 'BPM Rate'),
      ts: new Date().toISOString()
    });
    global.BWStore.setDomainData('breath_tests', list);
    document.getElementById('btResultCard').classList.add('d-none');
    document.getElementById('btNoteInput').value = '';
    global.BWI18n.showToast(tr('toastSaved'), 'success');
    renderMemberKpisAndHistory();
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-bt-mode]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bt-mode]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        mode = btn.getAttribute('data-bt-mode');
        document.getElementById('boltStagePane').classList.toggle('d-none', mode !== 'bolt');
        document.getElementById('bpmStagePane').classList.toggle('d-none', mode !== 'bpm');
      });
    });

    document.getElementById('btPrepPacerBtn').addEventListener('click', startPrepPacer);
    document.getElementById('boltToggleBtn').addEventListener('click', toggleBolt);
    document.getElementById('boltResetBtn').addEventListener('click', function () {
      boltState.running = false;
      boltState.elapsedSec = 0;
      if (boltState.rafId) global.cancelAnimationFrame(boltState.rafId);
      updateBoltDial(0);
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-bpm-win]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bpm-win]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        bpmState.windowSec = Number(btn.getAttribute('data-bpm-win')) || 30;
        document.getElementById('bpmRemSec').textContent = bpmState.windowSec + 's';
      });
    });

    document.getElementById('bpmStartBtn').addEventListener('click', startBpmWindow);
    document.getElementById('bpmTapOrbBtn').addEventListener('click', function () {
      if (!bpmState.running) startBpmWindow();
      bpmState.taps++;
      if (global.navigator && typeof global.navigator.vibrate === 'function') global.navigator.vibrate(25);
      document.getElementById('bpmTapCount').textContent = String(bpmState.taps);
      bpmState.bpm = Math.round(bpmState.taps * (60 / bpmState.windowSec));
      document.getElementById('bpmExtrapolated').textContent = bpmState.bpm + ' BPM';
    });
    document.getElementById('bpmUndoTapBtn').addEventListener('click', function () {
      if (bpmState.taps > 0) {
        bpmState.taps--;
        document.getElementById('bpmTapCount').textContent = String(bpmState.taps);
      }
    });

    document.getElementById('btSaveResultBtn').addEventListener('click', saveResultToMember);

    document.getElementById('btOpenSafetyBtn').addEventListener('click', function () {
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('btScienceModal')).show();
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-bt-hfilter]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bt-hfilter]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        histFilter = btn.getAttribute('data-bt-hfilter');
        renderMemberKpisAndHistory();
      });
    });

    document.getElementById('btHistoryBody').addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-del-bt]') : null;
      if (!btn) return;
      var id = btn.getAttribute('data-del-bt');
      var next = (global.BWStore.getDomainData('breath_tests') || []).filter(function (x) { return x.id !== id; });
      global.BWStore.setDomainData('breath_tests', next);
      renderMemberKpisAndHistory();
    });

    document.getElementById('btExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = global.BWStore.getDomainData('breath_tests') || [];
      global.BWI18n.downloadCsv('breath-tests-' + active.name + '.csv', ['Date', 'BOLT', 'BPM', 'Note'], list.map(function (x) {
        return [x.ts, x.score, x.bpm || '', x.note || ''];
      }));
    });

    updateBoltDial(0);
    renderMemberKpisAndHistory();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderMemberKpisAndHistory();
    });
    global.addEventListener('bwMemberChanged', renderMemberKpisAndHistory);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
